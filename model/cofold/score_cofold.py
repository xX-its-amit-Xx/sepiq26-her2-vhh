"""Stage 2 of the co-fold lane: per-residue interface frequency from contacts/*.npz, scored on the leakage-free proxies.

Frequency variants (all MEAN over models, never max):
  freq        = mean over seeds x samples of 1[Voronota-LT area > 0]            (primary)
  freq_w_ipsae= same, weighted by ipSAE per model
  freq_w_iptm = same, weighted by ipTM per model
  area        = mean contact area
Scores are made strictly unique with a tiny random tie-break (as in the CPU lane) so the all-tied-zero trap cannot inflate AP.
Hybrid 'cofold + prior' = freq + 0.05 * (floor composite rescaled to [0,1]) is reported separately (never the kill test).

Proxy mapping: 9MTE_27A05 -> P3, 9MTE_47D05 -> P4, 9MTX_29E09 -> P5.  Floor baselines are rebuilt with the CPU lane's own
baselines.make_complexes (leave-one-PDB-out footprint), so numbers sit next to the floor exactly as in model/README.md section 5.
Usage: python score_cofold.py <out_prefix>
"""
import csv
import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.dirname(HERE)
sys.path.insert(0, MODEL)
import baselines as BL  # noqa: E402
import features as F  # noqa: E402
import metric as M  # noqa: E402

MAP = {"9MTE_27A05": "P3", "9MTE_47D05": "P4", "9MTX_29E09": "P5"}
CONT = os.path.join(HERE, os.environ.get("COFOLD_CONT", "contacts"))
OUT = os.path.join(HERE, "results")
os.makedirs(OUT, exist_ok=True)


def freq_vectors(npz, tag_mask_b=None):
    d = np.load(npz)
    area = d["area"]
    la = int(d["la"])
    contact = (area > 0).astype(float)
    out = {"freq": contact.mean(0), "area": area.mean(0)}
    for nm, w in (("freq_w_ipsae", d["ipsae"]), ("freq_w_iptm", d["iptm"])):
        w = np.nan_to_num(w, nan=0.0)
        out[nm] = (contact * w[:, None]).sum(0) / max(w.sum(), 1e-9)
    # split-half agreement across seeds (diagnostic): correlation of antigen freq between odd/even seeds
    seeds = d["seed"]
    uniq = sorted(set(seeds))
    h1 = contact[np.isin(seeds, uniq[0::2])].mean(0)
    h2 = contact[np.isin(seeds, uniq[1::2])].mean(0)
    out["_split_half_r_antigen"] = float(np.corrcoef(h1[:la], h2[:la])[0, 1]) if h1[:la].std() > 0 and h2[:la].std() > 0 else float("nan")
    out["_la"] = la
    return out


def uniq(v, seed, eps=1e-7):
    rng = np.random.default_rng(seed)
    return np.asarray(v, float) + eps * rng.random(len(v))


def build(names, byp, tab, labvar, variant, seed=21):
    cx = {}
    for nm in names:
        pid = MAP[nm]
        fv = freq_vectors(os.path.join(CONT, nm + ".npz"))
        la = fv["_la"]
        rows = byp[pid]
        rrA, yA, wA = BL.chain_arrays(rows, "A", labvar)
        rrB, yB, wB = BL.chain_arrays(rows, "B", labvar)
        assert len(rrA) == la, (nm, len(rrA), la)
        v = fv[variant.replace("hybrid_", "")]
        sA, sB = v[:la].copy(), v[la:].copy()
        if variant.startswith("hybrid_"):
            fl_a, fl_b = BL.build_scores(BL.ARMS["FLOOR_composite"], pid, rows, tab, seed + int(pid[1:]))
            sA = sA + 0.05 * (fl_a - fl_a.min()) / (np.ptp(fl_a) + 1e-12)
            sB = sB + 0.05 * (fl_b - fl_b.min()) / (np.ptp(fl_b) + 1e-12)
        tm = BL.tag_mask_B(rrB)
        sA, sB = uniq(sA, seed + int(pid[1:])), uniq(sB, seed + 100 + int(pid[1:]))
        sB[tm] = 0.0
        cx[pid] = {"A": (yA, sA, wA), "B": (yB, sB, wB)}
    return cx


def main():
    prefix = sys.argv[1] if len(sys.argv) > 1 else "cofold"
    names = [n for n in MAP if os.path.exists(os.path.join(CONT, n + ".npz"))]
    pids = [MAP[n] for n in names]
    byp = BL.load_labels()
    tab, _ = F.positional_prior_table()
    labvar = "gt0"
    res = []
    arms = {}
    for v in ("freq", "freq_w_ipsae", "freq_w_iptm", "area", "hybrid_freq"):
        arms["cofold_" + v] = build(names, byp, tab, labvar, v)
    for a in ("uniform_random", "antigen_exposure", "antigen_exposure_x_dimer_x_footprint", "FLOOR_composite"):
        arms["baseline_" + a] = BL.make_complexes(a, pids, byp, tab, labvar)
    boots = []
    for arm, cx in arms.items():
        null = M.shuffle_null(cx, names=pids, n=300, seed=5)
        for (scope, wt, how), (mac, per) in M.all_variants(cx, names=pids).items():
            mu, sd = null[(scope, wt, how)]
            res.append([arm, scope, wt, how, round(mac, 4), round(mu, 4), round(sd, 4), round(mac - mu, 4)] + [round(x, 4) for x in per])
    ref = arms["baseline_antigen_exposure"]
    for arm in ("cofold_freq", "cofold_freq_w_ipsae", "cofold_freq_w_iptm", "cofold_hybrid_freq"):
        for base in ("baseline_antigen_exposure", "baseline_uniform_random", "baseline_FLOOR_composite"):
            for scope in ("antigen", "vhh", "pooled"):
                for mode in ("residue", "block"):
                    r = M.paired_bootstrap(arms[arm], arms[base], scope=scope, B=1000, mode=mode, seed=3, names=pids)
                    boots.append([arm + " minus " + base, scope, mode, round(r["delta_obs"], 4), round(r["lo"], 4), round(r["hi"], 4), round(r["p_two_sided"], 3)])
    hdr = ["arm", "scope", "weighting", "integration", "macro", "null_mean", "null_sd", "lift_vs_null"] + ["per_" + p for p in pids]
    with open(os.path.join(OUT, prefix + "_scores.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(hdr)
        w.writerows(res)
    with open(os.path.join(OUT, prefix + "_bootstrap.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["comparison", "scope", "mode", "delta_obs", "ci_lo", "ci_hi", "p_two_sided"])
        w.writerows(boots)
    diag = {}
    for nm in names:
        d = np.load(os.path.join(CONT, nm + ".npz"))
        fv = freq_vectors(os.path.join(CONT, nm + ".npz"))
        diag[nm] = {"n_models": int(len(d["seed"])), "mean_iptm": float(np.mean(d["iptm"])), "sd_iptm": float(np.std(d["iptm"])),
                    "mean_ipsae": float(np.mean(d["ipsae"])), "split_half_r_antigen_freq": fv["_split_half_r_antigen"],
                    "mean_antigen_contact_residues_per_model": float((d["area"][:, :int(d["la"])] > 0).sum(1).mean()),
                    "mean_vhh_contact_residues_per_model": float((d["area"][:, int(d["la"]):] > 0).sum(1).mean())}
    json.dump(diag, open(os.path.join(OUT, prefix + "_diagnostics.json"), "w"), indent=1)
    print("macro AP unweighted (gt0):")
    for r in res:
        if r[2] == "unweighted" and r[3] == "ap":
            print("%-48s %-8s %.4f null %.4f  per %s" % (r[0], r[1], r[4], r[5], r[8:]))
    print(json.dumps(diag, indent=1))


if __name__ == "__main__":
    main()
