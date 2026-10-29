
## 2026-10-17 [q3_assay_ngs_ground_truth]
- Epitope truth = Voronota-LT residue-level contact area > 0 (no cutoff given in /guideline). My run on 24 nanobody-antigen pairs (13 PDB entries): antigen positive fraction 13.2% (area>0), 11.3% (>=5 A^2), 9.5% (d<4 A; HER2 5MY6 only 3.8%). Robust core = 70% of positives but 92% of area, so the area-weighted metric is nearly cutoff-proof; unweighted is not. Replicate flip rate 4-9%, so a perfect predictor scores PR-AUC ~0.92-0.97; with 3 complexes the CI is ~0.18 wide. Chance PR-AUC ~0.03-0.05 antigen, ~0.2-0.3 VHH (estimates).
- The SEPIQ HF card (gated, partly visible) describes an IE-score cascade (Label Yes/Not/noise/non-sig., Binary Label), not just plain chi-squared; the label is a two-proportion z-test (= 2x2 chi-squared) with singletons dropped. Organisers disclose no cryo-EM resolution, fiducial or glycan policy; 9MTX (3.06 A, HER2 ECD+VHH, no fiducial) is the precedent.
- Question for q4/q8: resolve the /detail vs /guideline metric contradiction; can anyone with the gated table count labelled Yes/Not and the share of labels with <10 combined reads?

## 2026-10-17 [q4_challenge_intelligence]
- Contradictions resolved (verbatim in research/_meta/sepiq_verbatim.md): 3 targets only (ONU11/13/23; home "seven" is stale, Space says ONU24 and ONU429 withdrawn). PR-AUC is defined only on /guideline (macro over 3 complexes, unweighted + area-weighted); /detail never names the leaderboard metric and which variant ranks is not stated. The "cluster bootstrap" resamples residue indices (B=2000), not complexes.
- Constructs: HER2 = P04626 1-624 + His6, offset 0 (GACQ = native 621-624, signal peptide 1-22 included). VHH printed lengths 127/127/135 incl. His6 (ONU23 "130" is a numbering artefact; VHH proper 129). Template CSVs are gated (401); chain A 618 vs 630 unresolved.
- Question for q3/q8: if you can see the gated templates, confirm chain A length and whether tag residues and signal peptide appear. The Space checks only the 4 header names and returns no score, so local validation is the only check.

## 2026-10-17 [q6_epitope_ml_methods]
- HER2 antigen random PR-AUC is only ~0.03-0.05 (630 res, 15-30 positives; 8GZ5 proxy is 0.126), so the baseline 0.176 on 8GZ5 is ~1.4x random (shuffle null AP 0.147, sd 0.032; random reaches 0.176 16% of the time). Under trapezoid PR-AUC a constant predictor scores ~0.52; macro SD over 3 complexes ~0.03-0.05, so only gaps >= 0.1 are separable.
- A paratope-only CDR prior scores ~0.64 on the VHH alone but ~0.34 per complex if chains A and B are pooled.
- Question for q4/q8: ask organisers (a) are chains A+B pooled per complex, (b) average_precision vs trapezoid, (c) best-of-5 or last submission counts, and what contact-area cutoff defines positives?

2026-10-17 [q8_compute_validation_execution] Space app.py returns NO score after upload; leaderboard tab is static; the 5-submission cap and deadline are not enforced in code. Which of the 5 submissions is scored (last/best/any) is stated nowhere.
2026-10-17 [q8_compute_validation_execution] Unresolved: whether chains A and B are pooled into one PR curve per complex (decides if cross-chain calibration matters) and whether the bootstrap is residue or cluster. /detail vs /guideline disagree on the named primary metric. Question for q3/q4: any verbatim text settling these?
