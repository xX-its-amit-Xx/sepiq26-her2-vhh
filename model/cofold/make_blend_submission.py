"""Write a blended candidate submission directory (s3_shrunk_blend, s4_ensemble_*) with provenance.json and validate it.

usage: python make_blend_submission.py s3
  s3 = Boltz-2 contact frequency, arm shrink_iptm (README 10.1 candidate rule), prior = FLOOR composite fitted from ALL public data.
Same conventions as make_floor.py / make_candidate.py: signal peptide and tags = 0, VHH leader M1/A2 = 1e-6, unique values,
chain base rates antigen 0.045 / VHH 0.15, antigen rows 1..618.
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
import blend as BD  # noqa: E402
import features as F  # noqa: E402
import sepiq_common as sc  # noqa: E402
import validate_submission as V  # noqa: E402


def fmt(v):
    return "0" if v == 0 else ("%.10f" % v)


def uniquify(v, step=2e-10):
    """Make all non-zero values distinct after rounding to 10 decimals (ascending sweep), preserving order."""
    v = np.round(np.asarray(v, float), 10)
    idx = np.argsort(v, kind="stable")
    prev = 0.0
    for i in idx:
        if v[i] == 0:
            continue
        if v[i] <= prev:
            v[i] = prev + step
        prev = v[i]
    return np.round(v, 10)


def build_dir(outname, arm, stats_by_clone, provenance_extra, seed0=500):
    out = os.path.join(MODEL, "submissions", outname)
    os.makedirs(out, exist_ok=True)
    cons = sc.load_constructs()
    tab, used = F.positional_prior_table(exclude_pdbs=())
    a_prior = F.antigen_score_her2("exposure_dimer_footprint", exclude_pdbs=())
    nA = sc.INFERRED_TEMPLATE_A_ROWS
    zero_sp = np.zeros(nA, bool)
    zero_sp[:sc.SIGNAL_PEPTIDE] = True
    prov = {"submission": outname, "arm": arm, "readme_section": "model/README.md section 10.1 (pre-registered) and later subsections",
            "base_rates": {"antigen": F.BASE_A, "vhh": F.BASE_B},
            "prior": "FLOOR composite from all public data: antigen 8Q6J RSA x (1-0.5 dimer patch) x (0.7+0.3 public footprint, all binder entries); "
                     "VHH ANARCI-IMGT positional prior from 615 PDB VHH complexes (%d entries)" % used,
            "conventions": "antigen rows 1..618, signal peptide 1-22 = 0, tags = 0, VHH leader M1/A2 = 1e-6, unique values (1e-7 tie-break)",
            "clones": {}}
    prov.update(provenance_extra)
    for k, clone in enumerate(sc.CLONES):
        st = stats_by_clone[clone]
        lm = BD.lams(st)
        seq = cons["clones"][clone]
        imgt = F.imgt_for_sequence(seq)
        b_prior = F.vhh_positional_scores(imgt, tab)
        tags = np.array([("B", i + 1) in sc.tag_positions(clone) for i in range(len(seq))])
        lead = np.zeros(len(seq), bool)
        lead[:2] = True
        pa = BD.arm_chain(arm, st["fA"], a_prior, F.BASE_A, st["N"], lm["A"], mask0=zero_sp)
        pa = np.where(zero_sp, 0.0, np.maximum(pa, 1e-6))
        pa = uniquify(F.break_ties(pa, seed=seed0 + k))
        pb = BD.arm_chain(arm, st["fB"], b_prior, F.BASE_B, st["N"], lm["B"], mask0=tags | lead)
        pb = np.where(tags, 0.0, np.maximum(pb, 1e-6))
        pb[:2] = 1e-6
        pb = F.break_ties(pb, seed=seed0 + 50 + k)
        pb = np.where(tags, 0.0, pb)
        pb[:2] = [1e-6, 1.5e-6]
        pb = uniquify(pb)
        with open(os.path.join(out, "prediction_%s.csv" % clone), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(sc.HEADER)
            for c, n, rn in sc.template_rows(clone):
                w.writerow([c, n, rn, fmt(float(pa[n - 1] if c == "A" else pb[n - 1]))])
        prov["clones"][clone] = {"n_models": st["N"], "mean_iptm": round(st["iptm"], 3), "split_half_r_antigen": round(st["r_A"], 3),
                                 "split_half_r_vhh": round(st["r_B"], 3), "lam_antigen": {a: round(v, 3) for a, v in lm["A"].items()},
                                 "lam_vhh": {a: round(v, 3) for a, v in lm["B"].items()},
                                 "top10_antigen_by_score": [(int(i + 1), round(float(pa[i]), 4)) for i in np.argsort(-pa)[:10]],
                                 "top10_vhh_by_score": [(int(i + 1), round(float(pb[i]), 4)) for i in np.argsort(-pb)[:10]]}
    json.dump(prov, open(os.path.join(out, "provenance.json"), "w"), indent=1)
    rep = V.validate_dir(out)
    return rep, out


def boltz_stats():
    return {c: BD.chain_stats(os.path.join(HERE, "contacts", c + ".npz")) for c in sc.CLONES}


if __name__ == "__main__":
    which = sys.argv[1]
    if which == "s3":
        extra = {"engine": "Boltz-2 2.2.1 (50 models/complex: 10 seeds x 5 samples, ColabFold unpaired MSA)",
                 "parameters": "lam = 1 - clip((mean ipTM - 0.30)/0.30, 0, 1) per complex, same lam both chains; score = (1-lam)*f + lam*P' (P' = prior rescaled to mean(f)), then base-rate calibration",
                 "proxies_that_informed_the_choice": "none for parameters (all fixed in README 10.1 before scoring). The candidate rule (2a unless 2a is worse than raw by >=0.05 macro antigen AP on 9MTE x2 / 9MTX) was evaluated on those 3 proxies: see README 10.x",
                 "inputs": ["cofold/contacts/ONU{11,13,23}.npz", "features.py priors (public data only)"]}
        rep, out = build_dir("s3_shrunk_blend", "shrink_iptm", boltz_stats(), extra)
        print(out, "errors", rep.errors, "warnings", getattr(rep, "warnings", None))
