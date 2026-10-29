"""Write the floor submission s1_floor (prediction_ONU11/13/23.csv) and validate it.

Antigen (chain A, P04626 numbering, rows 1..618 = inferred template):
    score = RSA(8Q6J) x (1 - 0.5 x dimer_patch) x (0.7 + 0.3 x public_footprint)   [no parameter tuned on any label]
    public_footprint built from ALL public binder entries (including the four VHH proxy structures: legitimate for the blind targets).
    rescaled to mean 0.045 (rank preserving), residues 1-22 (signal peptide) = 0, every other residue >= 1e-6, unique via tiny tie-break.
Paratope (chain B, sequential numbering from the printed sequence):
    IMGT numbering by ANARCI (pyhmmer-patched, see README) -> position contact frequency from the 615 PDB VHH complexes of q2
    (shrunk), rescaled to mean 0.15. His6 tag = 0. M1 and A2 (non-VHH leader of the printed clones) = 1e-6.
All values unique among non-zero entries; tags exactly 0.
"""
import csv
import json
import os

import numpy as np

import features as F
import sepiq_common as sc
import validate_submission as V

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "submissions", "s1_floor")
os.makedirs(OUT, exist_ok=True)


def fmt(v):
    return "0" if v == 0 else ("%.10f" % v)


def main():
    cons = sc.load_constructs()
    prov = {"antigen_arm": "exposure_dimer_footprint (8Q6J RSA x (1-0.5 dimer) x (0.7+0.3 footprint))",
            "vhh_arm": "ANARCI IMGT positional contact prior (615 PDB VHH complexes)",
            "base_rates": [F.BASE_A, F.BASE_B], "clones": {}}
    tab, used = F.positional_prior_table(exclude_pdbs=())
    prov["vhh_prior_entries_used"] = used
    a_raw = F.antigen_score_her2("exposure_dimer_footprint", exclude_pdbs=())
    nA = sc.INFERRED_TEMPLATE_A_ROWS
    zero_sp = np.zeros(nA, bool)
    zero_sp[:sc.SIGNAL_PEPTIDE] = True
    pa = F.to_probability(a_raw, F.BASE_A, zero_mask=zero_sp)
    pa = np.where(zero_sp, 0.0, np.maximum(pa, 1e-6))
    pa = F.break_ties(pa, seed=101)
    for k, clone in enumerate(sc.CLONES):
        seq = cons["clones"][clone]
        imgt = F.imgt_for_sequence(seq)
        b_raw = F.vhh_positional_scores(imgt, tab)
        tags = np.array([("B", i + 1) in sc.tag_positions(clone) for i in range(len(seq))])
        b = F.to_probability(b_raw, F.BASE_B, zero_mask=tags)
        b = np.where(tags, 0.0, np.maximum(b, 1e-6))
        b[0] = 1e-6  # M1 leader
        b[1] = 1e-6  # A2 leader
        b = F.break_ties(b, seed=200 + k)
        b = np.where(tags, 0.0, b)
        rows = sc.template_rows(clone)
        with open(os.path.join(OUT, "prediction_%s.csv" % clone), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(sc.HEADER)
            for c, n, rn in rows:
                v = pa[n - 1] if c == "A" else b[n - 1]
                w.writerow([c, n, rn, fmt(float(v))])
        top_b = sorted(range(len(seq)), key=lambda i: -b[i])[:12]
        prov["clones"][clone] = {"vhh_len": len(seq), "imgt_first_last": [imgt[2], imgt[len(seq) - 7]],
                                 "top12_B_seqNum_imgt": [(i + 1, imgt[i], round(float(b[i]), 3)) for i in top_b]}
    top_a = sorted(range(nA), key=lambda i: -pa[i])[:15]
    prov["top15_antigen"] = [(i + 1, round(float(pa[i]), 4)) for i in top_a]
    prov["antigen_mean_score_residues_23_618"] = round(float(pa[22:].mean()), 4)
    json.dump(prov, open(os.path.join(OUT, "provenance.json"), "w"), indent=1)
    rep = V.validate_dir(OUT)
    return rep


if __name__ == "__main__":
    r = main()
    raise SystemExit(0 if not r.errors else 1)
