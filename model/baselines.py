"""Proxy league: baselines scored on the public proxy complexes with the shuffle null and a paired bootstrap.

League = HER2 proxies P1-P5 (5MY6, 7QVK, 9MTE x2, 9MTX; 4 PDB entries, 5 complexes; 27A05 and 29E09 share an epitope bin).
8GZ5 (P6, SARS-CoV-2 RBD + P17) is reported separately as a sanity row because the HER2 priors do not apply to it.
Leave-one-complex-out (LOCO): the only data-derived input that touches proxy labels is the public footprint, and for each held-out
complex it is rebuilt without that complex's PDB entry (and, for 9MTE/9MTX, without both). Nothing else is fitted
(exposure = a fixed reference structure, positional prior built from the 610 non-proxy PDB VHH complexes, weights pre-set).
Run:  python baselines.py   (about 2-4 minutes, 1 process)
"""
import csv
import json
import os
import sys
import time

import numpy as np

import features as F
import metric as M
import sepiq_common as sc

HERE = os.path.dirname(os.path.abspath(__file__))
LABELS = os.path.join(HERE, "proxies", "proxy_labels.csv")
OUT = os.path.join(HERE, "results")
LEAGUE = ["P1", "P2", "P3", "P4", "P5"]
SANITY = ["P6"]
LABEL_VARIANTS = {"gt0": "fact_gt0", "ge5": "fact_ge5", "d4": "fact_d4"}
NULL_N = 300


def load_labels():
    rows = list(csv.DictReader(open(LABELS)))
    byp = {}
    for r in rows:
        byp.setdefault(r["proxy_id"], []).append(r)
    return byp


def chain_arrays(rows, chain, labvar):
    rr = [r for r in rows if r["chain"] == chain]
    rr.sort(key=lambda r: int(r["seqNum"]))
    col = LABEL_VARIANTS[labvar]
    y = np.array([int(r[col]) for r in rr], float)
    area = np.array([float(r["area"]) for r in rr])
    return rr, y, np.where(y > 0, area, 0.0)


def own_rsa(rr):
    return np.array([float(r["rsa_isolated_chain"]) if r["rsa_isolated_chain"] != "" else 0.0 for r in rr])


def vhh_prior_for(rr, tab, cdr3_only=False):
    labels = [r["imgt"] or None for r in rr]
    if cdr3_only:
        out = np.zeros(len(labels))
        for i, lab in enumerate(labels):
            k = F.imgt_key(lab)
            if k is not None and k.rstrip("+").lstrip("-").isdigit() and 105 <= int(k.rstrip("+")) <= 117:
                out[i] = 1.0
        return out
    return F.vhh_positional_scores(labels, tab)


def tag_mask_B(rr):
    """His6 at the C-terminus of the SEQRES (and any trailing run of H) is scored 0 like in the real submissions."""
    n = len(rr)
    m = np.zeros(n, bool)
    i = n - 1
    while i >= 0 and rr[i]["resName"] == "HIS":
        m[i] = True
        i -= 1
    return m


def build_scores(arm, pid, rows, tab, seed):
    """Return (sA, sB) already on probability-like scale with tie-breaking noise. Antigen arms need HER2 features."""
    kind = "RBD" if pid == "P6" else "HER2"
    rA = [r for r in rows if r["chain"] == "A"]
    rA.sort(key=lambda r: int(r["seqNum"]))
    rB = [r for r in rows if r["chain"] == "B"]
    rB.sort(key=lambda r: int(r["seqNum"]))
    rng = np.random.default_rng(seed)
    pdb = rows[0]["pdb_id"]
    excl = F.FAMILY.get(pdb, {pdb})
    antigen_arm, vhh_arm = arm
    # antigen
    if antigen_arm == "uniform":
        a = np.ones(len(rA))
    elif antigen_arm == "exposure_own":
        a = own_rsa(rA)
    elif kind == "HER2":
        a = F.antigen_score_her2(antigen_arm, exclude_pdbs=excl)
    elif antigen_arm == "exposure":
        a = own_rsa(rA)  # RBD sanity row: no reference-structure feature, use own isolated-chain RSA
    else:
        a = None  # not applicable to RBD
    # vhh
    if vhh_arm == "uniform":
        b = np.ones(len(rB))
    elif vhh_arm == "cdr_prior":
        b = vhh_prior_for(rB, tab)
    elif vhh_arm == "cdr3_only":
        b = vhh_prior_for(rB, tab, cdr3_only=True)
    elif vhh_arm == "exposure_own":
        b = own_rsa(rB)
    else:
        raise ValueError(vhh_arm)
    if a is None:
        return None, None
    tm = tag_mask_B(rB)
    pa = F.to_probability(a, F.BASE_A)
    pb = F.to_probability(b, F.BASE_B, zero_mask=tm)
    # constant arms need random tie-break so that they are valid "unique" submissions (also what the null expectation is)
    if antigen_arm == "uniform":
        pa = F.break_ties(pa, seed * 2 + 1, eps=1e-3)
    else:
        pa = F.break_ties(pa, seed * 2 + 1)
    if vhh_arm == "uniform":
        pb = F.break_ties(pb, seed * 2 + 2, eps=1e-3)
        pb[tm] = 0.0
    else:
        pb = F.break_ties(pb, seed * 2 + 2)
    return pa, pb


ARMS = {
    "uniform_random": ("uniform", "uniform"),
    "antigen_exposure": ("exposure", "uniform"),
    "antigen_exposure_own_rsa": ("exposure_own", "uniform"),
    "antigen_exposure_x_dimer": ("exposure_dimer", "uniform"),
    "antigen_footprint_only": ("footprint", "uniform"),
    "antigen_exposure_x_dimer_x_footprint": ("exposure_dimer_footprint", "uniform"),
    "vhh_cdr_positional_prior": ("uniform", "cdr_prior"),
    "vhh_cdr3_indicator": ("uniform", "cdr3_only"),
    "vhh_own_rsa": ("uniform", "exposure_own"),
    "FLOOR_composite": ("exposure_dimer_footprint", "cdr_prior"),
}


def make_complexes(arm, pids, byp, tab, labvar, seed=11, resolved_only=False):
    out = {}
    for pid in pids:
        rows = byp[pid]
        sA, sB = build_scores(ARMS[arm], pid, rows, tab, seed + int(pid[1:]))
        if sA is None:
            return None
        rrA, yA, wA = chain_arrays(rows, "A", labvar)
        rrB, yB, wB = chain_arrays(rows, "B", labvar)
        if resolved_only:
            kA = np.array([r["resolved"] == "1" for r in rrA])
            kB = np.array([r["resolved"] == "1" for r in rrB])
            out[pid] = {"A": (yA[kA], sA[kA], wA[kA]), "B": (yB[kB], sB[kB], wB[kB])}
        else:
            out[pid] = {"A": (yA, sA, wA), "B": (yB, sB, wB)}
    return out


def uniform_tied(pids, byp, labvar):
    """All-equal predictions (a lazy 'constant' submission, illegal under our tie rule) to expose AP vs trapezoid behaviour."""
    out = {}
    for pid in pids:
        rows = byp[pid]
        rrA, yA, wA = chain_arrays(rows, "A", labvar)
        rrB, yB, wB = chain_arrays(rows, "B", labvar)
        out[pid] = {"A": (yA, np.full(len(yA), 0.05), wA), "B": (yB, np.full(len(yB), 0.05), wB)}
    return out


def main():
    t0 = time.time()
    byp = load_labels()
    tab, used = F.positional_prior_table()
    print("positional prior built from %d non-proxy PDB VHH entries, %d positions" % (used, len(tab)))
    print("dimer patch residues:", len(F.DIMER_PATCH))
    results = []   # rows for CSV
    per_complex = []
    store = {}
    for labvar in LABEL_VARIANTS:
        for arm in ARMS:
            for group, pids in (("HER2_league", LEAGUE), ("sanity_8GZ5", SANITY)):
                if group == "sanity_8GZ5" and ARMS[arm][0] in ("footprint", "exposure_dimer", "exposure_dimer_footprint"):
                    continue
                cx = make_complexes(arm, pids, byp, tab, labvar)
                if cx is None:
                    continue
                var = M.all_variants(cx)
                null = M.shuffle_null(cx, n=NULL_N, seed=5)
                for (scope, wt, how), (mac, per) in var.items():
                    mu, sd = null[(scope, wt, how)]
                    results.append([labvar, group, arm, scope, wt, how, round(mac, 4), round(mu, 4), round(sd, 4), round(mac - mu, 4),
                                    round(mac / mu, 3) if mu > 0 else "", round((mac - mu) / sd, 2) if sd > 0 else ""])
                    for pid, v in zip(pids, per):
                        per_complex.append([labvar, group, arm, scope, wt, how, pid, round(v, 4)])
                store[(labvar, group, arm)] = cx
        print("label variant", labvar, "done", round(time.time() - t0), "s")
    # tied-uniform reference
    for labvar in LABEL_VARIANTS:
        cx = uniform_tied(LEAGUE, byp, labvar)
        for (scope, wt, how), (mac, per) in M.all_variants(cx).items():
            results.append([labvar, "HER2_league", "uniform_ALL_TIED(not submittable)", scope, wt, how, round(mac, 4), "", "", "", "", ""])
    hdr = ["label_variant", "group", "arm", "scope", "weighting", "integration", "macro_score", "null_mean", "null_sd", "lift_abs", "lift_ratio", "z"]
    with open(os.path.join(OUT, "baseline_results.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(hdr)
        w.writerows(results)
    with open(os.path.join(OUT, "baseline_per_complex.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["label_variant", "group", "arm", "scope", "weighting", "integration", "proxy_id", "score"])
        w.writerows(per_complex)
    # resolved-only sensitivity (primary label variant)
    sens = []
    for arm in ARMS:
        cx = make_complexes(arm, LEAGUE, byp, tab, "gt0", resolved_only=True)
        for scope in M.SCOPES:
            mac, per = M.macro(cx, scope, "unweighted", "ap")
            nul = M.shuffle_null(cx, n=100, seed=5)[(scope, "unweighted", "ap")]
            sens.append([arm, scope, round(mac, 4), round(nul[0], 4)])
    with open(os.path.join(OUT, "baseline_resolved_only_sensitivity.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["arm", "scope", "macro_AP_unweighted_resolved_residues_only", "null_mean"])
        w.writerows(sens)
    # paired bootstrap: FLOOR vs uniform and vs exposure-only, antigen scope + VHH scope + pooled (AP, unweighted, gt0)
    boots = []
    base = store[("gt0", "HER2_league", "uniform_random")]
    for arm_b in ("antigen_exposure", "antigen_exposure_x_dimer_x_footprint", "vhh_cdr_positional_prior", "FLOOR_composite"):
        for scope in M.SCOPES:
            for mode in ("residue", "block", "complex"):
                r = M.paired_bootstrap(store[("gt0", "HER2_league", arm_b)], base, scope=scope, weighting="unweighted", how="ap",
                                       B=1000, mode=mode, seed=3)
                boots.append([arm_b + " minus uniform_random", scope, mode, round(r["delta_obs"], 4), round(r["lo"], 4), round(r["hi"], 4), round(r["p_two_sided"], 3)])
    for scope in ("antigen",):
        for mode in ("residue", "block", "complex"):
            r = M.paired_bootstrap(store[("gt0", "HER2_league", "antigen_exposure_x_dimer_x_footprint")], store[("gt0", "HER2_league", "antigen_exposure")],
                                   scope=scope, B=1000, mode=mode, seed=4)
            boots.append(["exposure_x_dimer_x_footprint minus exposure", scope, mode, round(r["delta_obs"], 4), round(r["lo"], 4), round(r["hi"], 4), round(r["p_two_sided"], 3)])
    with open(os.path.join(OUT, "paired_bootstrap.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["comparison", "scope", "bootstrap_mode", "delta_obs", "ci_lo", "ci_hi", "p_two_sided", ])
        w.writerows(boots)
    print("done in %d s" % (time.time() - t0))


if __name__ == "__main__":
    main()
