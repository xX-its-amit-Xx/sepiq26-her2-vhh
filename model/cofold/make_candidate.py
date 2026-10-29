"""Stage 3: per-residue co-fold CSVs for all complexes + candidate submission s2_cofold_candidate (only if all 3 ONU contacts exist).

Candidate score per chain = contact frequency (mean over all seeds x samples of 1[Voronota-LT area > 0], Boltz-2)
                            + 0.05 * (floor prior rescaled to [0,1]) used only as tie-breaker / weak prior
(antigen prior = CPU lane's exposure x (1-dimer) x footprint, all public binders; VHH prior = ANARCI IMGT positional prior),
then rank-preserving rescale to chain base rates (antigen 0.045 / VHH 0.15, features.to_probability), signal peptide 1-22 = 0,
tags = 0, VHH leader M1/A2 = 1e-6, unique values (tiny tie-break).  Same conventions as make_floor.py.
"""
import csv
import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.dirname(HERE)
sys.path.insert(0, MODEL)
import features as F  # noqa: E402
import sepiq_common as sc  # noqa: E402
import validate_submission as V  # noqa: E402

CONT = os.path.join(HERE, "contacts")
PER = os.path.join(HERE, "per_residue")
OUT = os.path.join(MODEL, "submissions", "s2_cofold_candidate")
os.makedirs(PER, exist_ok=True)


def fmt(v):
    return "0" if v == 0 else ("%.10f" % v)


def load(name):
    d = np.load(os.path.join(CONT, name + ".npz"))
    area = d["area"]
    la = int(d["la"])
    c = (area > 0).astype(float)
    ipsae = np.nan_to_num(d["ipsae"], nan=0.0)
    iptm = np.nan_to_num(d["iptm"], nan=0.0)
    return {"freq": c.mean(0), "freq_w_ipsae": (c * ipsae[:, None]).sum(0) / max(ipsae.sum(), 1e-9),
            "freq_w_iptm": (c * iptm[:, None]).sum(0) / max(iptm.sum(), 1e-9), "mean_area": area.mean(0), "la": la,
            "n": len(area), "iptm": float(iptm.mean()), "ipsae": float(ipsae.mean())}


def export_per_residue():
    cons = sc.load_constructs()
    labels = {}
    for r in csv.DictReader(open(os.path.join(MODEL, "proxies", "proxy_labels.csv"))):
        labels[(r["proxy_id"], r["chain"], int(r["seqNum"]))] = r
    pmap = {"9MTE_27A05": "P3", "9MTE_47D05": "P4", "9MTX_29E09": "P5"}
    for name in ("9MTE_27A05", "9MTE_47D05", "9MTX_29E09", "ONU11", "ONU13", "ONU23"):
        if not os.path.exists(os.path.join(CONT, name + ".npz")):
            continue
        v = load(name)
        la = v["la"]
        if name.startswith("ONU"):
            seqA, seqB = cons["antigen"], cons["clones"][name]
        else:
            seqA = seqB = None
        with open(os.path.join(PER, name + ".csv"), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(["chain", "seqNum", "resName", "freq", "freq_w_ipsae", "freq_w_iptm", "mean_contact_area", "label_gt0", "label_area"])
            for i in range(len(v["freq"])):
                chain, n = ("A", i + 1) if i < la else ("B", i - la + 1)
                if name.startswith("ONU"):
                    rn = sc.THREE[(seqA if chain == "A" else seqB)[n - 1]]
                    lab, area = "", ""
                else:
                    lr = labels[(pmap[name], chain, n)]
                    rn, lab, area = lr["resName"], lr["fact_gt0"], lr["area"]
                w.writerow([chain, n, rn, "%.4f" % v["freq"][i], "%.4f" % v["freq_w_ipsae"][i], "%.4f" % v["freq_w_iptm"][i],
                            "%.3f" % v["mean_area"][i], lab, area])


def norm01(x):
    x = np.asarray(x, float)
    return (x - x.min()) / (np.ptp(x) + 1e-12)


def candidate():
    names = sc.CLONES
    if not all(os.path.exists(os.path.join(CONT, n + ".npz")) for n in names):
        print("ONU contacts incomplete; no candidate written")
        return None
    os.makedirs(OUT, exist_ok=True)
    cons = sc.load_constructs()
    tab, used = F.positional_prior_table(exclude_pdbs=())
    a_prior = F.antigen_score_her2("exposure_dimer_footprint", exclude_pdbs=())
    nA = sc.INFERRED_TEMPLATE_A_ROWS
    zero_sp = np.zeros(nA, bool)
    zero_sp[:sc.SIGNAL_PEPTIDE] = True
    prov = {"engine": "Boltz-2 2.2.1 (ColabFold unpaired MSA), seeds x samples per complex = see n_models", "score": "freq + 0.05*floor_prior",
            "base_rates": [F.BASE_A, F.BASE_B], "clones": {}}
    for k, clone in enumerate(names):
        v = load(clone)
        fa = v["freq"][:nA]
        pa_raw = fa + 0.05 * norm01(a_prior)
        pa = F.to_probability(pa_raw, F.BASE_A, zero_mask=zero_sp)
        pa = np.where(zero_sp, 0.0, np.maximum(pa, 1e-6))
        pa = F.break_ties(pa, seed=301 + k)
        seq = cons["clones"][clone]
        imgt = F.imgt_for_sequence(seq)
        b_prior = F.vhh_positional_scores(imgt, tab)
        fb = v["freq"][v["la"]:]
        tags = np.array([("B", i + 1) in sc.tag_positions(clone) for i in range(len(seq))])
        pb_raw = fb + 0.05 * norm01(b_prior)
        pb = F.to_probability(pb_raw, F.BASE_B, zero_mask=tags)
        pb = np.where(tags, 0.0, np.maximum(pb, 1e-6))
        pb[0] = 1e-6
        pb[1] = 1e-6
        pb = F.break_ties(pb, seed=401 + k)
        pb = np.where(tags, 0.0, pb)
        with open(os.path.join(OUT, "prediction_%s.csv" % clone), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(sc.HEADER)
            for c, n, rn in sc.template_rows(clone):
                w.writerow([c, n, rn, fmt(float(pa[n - 1] if c == "A" else pb[n - 1]))])
        prov["clones"][clone] = {"n_models": v["n"], "mean_iptm": round(v["iptm"], 3), "mean_ipsae": round(v["ipsae"], 3),
                                 "top10_antigen": [(int(i + 1), round(float(fa[i]), 3)) for i in np.argsort(-fa)[:10]],
                                 "n_antigen_resid_freq_ge_0.5": int((fa >= 0.5).sum())}
    json.dump(prov, open(os.path.join(OUT, "provenance.json"), "w"), indent=1)
    rep = V.validate_dir(OUT)
    return rep


if __name__ == "__main__":
    export_per_residue()
    r = candidate()
    if r is not None:
        print("errors", r.errors, "warnings", getattr(r, "warnings", None))
