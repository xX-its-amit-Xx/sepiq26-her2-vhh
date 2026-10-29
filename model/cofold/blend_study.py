"""Pre-registered shrinkage/blend study (README section 10.1). CPU only.
Usage: python blend_study.py <prefix> <name1,name2,...>
  primary:   python blend_study.py blend_primary 9MTE_27A05,9MTE_47D05,9MTX_29E09
  secondary: python blend_study.py blend_secondary 5MY6_2Rs15d,7QVK_NM02       (leakage-flagged)
  extended:  python blend_study.py blend_all5 <all five>                          (descriptive only)
Writes cofold/results/<prefix>_{scores,bootstrap,lamgrid,params}.csv/json
"""
import csv
import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.dirname(HERE)
sys.path.insert(0, MODEL)
sys.path.insert(0, HERE)
import baselines as BL  # noqa: E402
import blend as BD  # noqa: E402
import features as F  # noqa: E402
import metric as M  # noqa: E402

MAP = {"5MY6_2Rs15d": "P1", "7QVK_NM02": "P2", "9MTE_27A05": "P3", "9MTE_47D05": "P4", "9MTX_29E09": "P5"}
CONT = os.path.join(HERE, "contacts")
OUT = os.path.join(HERE, "results")


def uniq(v, seed, eps=1e-7):
    rng = np.random.default_rng(seed)
    return np.asarray(v, float) + eps * rng.random(len(v))


def main():
    prefix, names = sys.argv[1], sys.argv[2].split(",")
    pids = [MAP[n] for n in names]
    byp = BL.load_labels()
    tab, _ = F.positional_prior_table()
    labvar = "gt0"
    info = {}
    data = {}
    for nm in names:
        pid = MAP[nm]
        rows = byp[pid]
        st = BD.chain_stats(os.path.join(CONT, nm + ".npz"))
        rrA, yA, wA = BL.chain_arrays(rows, "A", labvar)
        rrB, yB, wB = BL.chain_arrays(rows, "B", labvar)
        assert len(rrA) == st["nA"] == st["la"] and len(rrB) == len(st["fB"]), (nm, len(rrA), st["la"], len(rrB), len(st["fB"]))
        PA, PB = BL.build_scores(BL.ARMS["FLOOR_composite"], pid, rows, tab, 11 + int(pid[1:]))
        tm = BL.tag_mask_B(rrB)
        lm = BD.lams(st)
        info[nm] = {"pid": pid, "mean_iptm": round(st["iptm"], 3), "split_half_r_A": round(st["r_A"], 3), "split_half_r_B": round(st["r_B"], 3),
                    "N": st["N"], "lam_A": {k: round(v, 3) for k, v in lm["A"].items()}, "lam_B": {k: round(v, 3) for k, v in lm["B"].items()},
                    "mean_freq_A": round(float(st["fA"].mean()), 4), "mean_freq_B": round(float(st["fB"][~tm].mean()), 4)}
        data[nm] = dict(pid=pid, st=st, rrA=rrA, yA=yA, wA=wA, yB=yB, wB=wB, PA=PA, PB=PB, tm=tm, lm=lm)

    def build(arm, lam_override=None):
        cx = {}
        for nm, d in data.items():
            st, lm = d["st"], d["lm"]
            if lam_override is not None:
                lm = {"A": {"shrink_iptm": lam_override, "shrink_splithalf": lam_override, "shrink_fixed02": lam_override},
                      "B": {"shrink_iptm": lam_override, "shrink_splithalf": lam_override, "shrink_fixed02": lam_override}}
                arm_ = "shrink_iptm"
            else:
                arm_ = arm
            pid = d["pid"]
            sA = BD.arm_chain(arm_, st["fA"], d["PA"], F.BASE_A, st["N"], lm["A"])
            sB = BD.arm_chain(arm_, st["fB"], d["PB"], F.BASE_B, st["N"], lm["B"], mask0=d["tm"])
            sA, sB = uniq(sA, 21 + int(pid[1:])), uniq(sB, 121 + int(pid[1:]))
            sB[d["tm"]] = 0.0
            cx[pid] = {"A": (d["yA"], sA, d["wA"]), "B": (d["yB"], sB, d["wB"])}
        return cx

    arms = {a: build(a) for a in BD.ARMS}
    arms["FLOOR_composite"] = BL.make_complexes("FLOOR_composite", pids, byp, tab, labvar)
    arms["uniform_random"] = BL.make_complexes("uniform_random", pids, byp, tab, labvar)

    res, boots = [], []
    for arm, cx in arms.items():
        null = M.shuffle_null(cx, names=pids, n=300, seed=5)
        for (scope, wt, how), (mac, per) in M.all_variants(cx, names=pids).items():
            mu, sd = null[(scope, wt, how)]
            res.append([arm, scope, wt, how, round(mac, 4), round(mu, 4), round(sd, 4), round(mac - mu, 4)] + [round(x, 4) for x in per])
    for arm in BD.ARMS:
        for base in ("raw_freq", "raw_freq_cal", "FLOOR_composite"):
            if arm == base:
                continue
            for scope in ("antigen", "vhh", "pooled"):
                for mode in ("residue", "block"):
                    r = M.paired_bootstrap(arms[arm], arms[base], scope=scope, B=1000, mode=mode, seed=3, names=pids)
                    boots.append([arm + " minus " + base, scope, mode, round(r["delta_obs"], 4), round(r["lo"], 4), round(r["hi"], 4), round(r["p_two_sided"], 3)])
    # lam grid (descriptive): shrink with a single fixed lam on both chains
    grid = []
    for lam in np.round(np.arange(0, 1.0001, 0.1), 2):
        cx = build(None, lam_override=float(lam))
        for scope in ("antigen", "vhh", "pooled"):
            mac, per = M.macro(cx, scope, "unweighted", "ap", names=pids)
            grid.append([lam, scope, round(mac, 4)] + [round(x, 4) for x in per])
    hdr = ["arm", "scope", "weighting", "integration", "macro", "null_mean", "null_sd", "lift_vs_null"] + ["per_" + p for p in pids]
    for fn, h, rows_ in (("scores", hdr, res), ("bootstrap", ["comparison", "scope", "mode", "delta_obs", "ci_lo", "ci_hi", "p_two_sided"], boots),
                         ("lamgrid", ["lam", "scope", "macro_ap_unweighted"] + ["per_" + p for p in pids], grid)):
        with open(os.path.join(OUT, "%s_%s.csv" % (prefix, fn)), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(h)
            w.writerows(rows_)
    json.dump(info, open(os.path.join(OUT, prefix + "_params.json"), "w"), indent=1)
    print(json.dumps(info, indent=1))
    print("%-18s %-8s %-6s %-12s macro  null   per-complex %s" % ("arm", "scope", "wt", "integ", pids))
    for r in res:
        if r[2] == "unweighted" and r[3] == "ap":
            print("%-18s %-8s %.4f %.4f  %s" % (r[0], r[1], r[4], r[5], r[8:]))


if __name__ == "__main__":
    main()
