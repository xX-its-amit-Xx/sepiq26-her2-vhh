---
queen: q5_structure_prediction_docking
king: king_infer
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- Co-folding beats docking for blind VHH-antigen: AF3 31.6% DockQ>=0.23 on 60 nanobodies (1 seed), Boltz-1 23.3%, Chai-1 15.0%. HADDOCK3 blind gets only 20% top-10 (AF3 52.5% on its set).
- Best Track A recipe: 20 seeds x 5 samples per engine, ipSAE-weighted Voronota-LT contact frequency, shrunk toward prevalence by split-half disagreement. Do not trust top-1 pose; ipTM discriminates weakly (AP ~0.45).
- Boltz-2, Chai-1, OpenFold3 v0.5.0 and Protenix-v1 need no weight application; AF3 weights do. A ~12 GPU-hour ensemble (extrapolated) fits the 40 h budget.
- 9MTX and 9MTE (HER2-VHH cryo-EM, released 2025-11-19) post-date all engine cutoffs: a leakage-free proxy set. Brief errors found: 5F7D/5MYX/5MZV are not HER2; the glycan list is wrong.
- Paratope side: a CDR+flank prior plus NanoBodyBuilder2/Paragraph or a nanobody sequence model is a strong cheap baseline; no head-to-head co-fold vs Paragraph benchmark exists.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. Hitawala & Gray (mAbs 2025, doi 10.1080/19420862.2025.2545601): nanobodies n=60, DockQ>=0.23: AF3 31.6%, Boltz-1 23.3%, Chai-1 15.0%; high quality 13.3/5.0/3.3%. (engines file, 22 sources; medium-high)
2. Protenix-v1 FoldBench Ab-Ag 52.3%; Protenix authors flag Boltz-2 training overlap on the 2022-2025 set; v2 weights are proprietary. Antibody, not nanobody. (engines file; medium)
3. Sanchez-Marin/Giulini/Bonvin bioRxiv 10.1101/2025.07.01.662355 (n=40): HADDOCK3 all-surface 20% top-10, loose epitope 55%, true interface 87.5%; AF3 25 models 52.5%. AF3 outputs cannot be used downstream under server terms. (docking file, 12 sources; medium)
4. ipTM AP for nanobody DockQ>=0.23 is 0.450; I-pLDDT + Rosetta dGB reaches AP 0.743. (confidence file, 10 sources; medium)
5. Real vs shuffled nanobody pairs: PR-AUC AF3 0.187, Chai-1 0.067, Boltz-2 0.026; shuffled pairs get similar epitope recall (snippet only; low).
6. Verified 12 RCSB entries; all HER2 ECD structures are one extended state; UniProt glycosites N68, N124, N187, N259, N530, N571, N629. (HER2 file, 8 sources; medium-high)
7. Engine cutoffs: AF3 2021-09-30, Boltz-2 2023-06-01, Chai-1 2021-01-12, OpenFold3/Protenix-v1 2021-09-30 (single source; medium-low).
8. Nanobody paratope PR-AUCs of about 0.6-0.7 (ParaAntiProt 0.665) are not comparable across papers (prevalence unreported). (paratope file, 13 sources; medium-low)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Cryptanalytic frequency analysis (seeds = intercepts, contact frequency = histogram, split-half = convergence): paid off as a shrinkage rule.
- Known plaintext (PDB HER2 complexes): paid off as a leakage ablation (templates on/off, old vs new weights) and ipTM-weighted consensus.
- Restraints as cribs (docking): partly died; for blind ONU clones the crib (epitope domain) is unknown.
- Fixed-header cipher (VHH framework): gave a "prior + residual" paratope design, but the bound could not be measured.
- Lock that changes shape (HER2 states): mostly died; HER2 barely moves, so one rigid state suffices.

## Contradictions within my subdomain
- Search-summary ipTM vs DockQ correlation (R=0.73 Nb) was absent from the fetched paper text.
- AF3 single-seed Nb rate 31.6% (n=60) vs 31.4% (n=70 set); AF3 on DB5.5 50.8% suggests contamination.
- Boltz-2 ranks above Chai-1 on the 2022-2025 set but is flagged leakage-prone, so the ranking is untrustworthy.

## Gotchas for the modeler (what could silently fool us)
- Proxy tests on pre-2025 HER2 structures are contaminated for every engine; use 9MTX/9MTE only.
- ipTM is weakly discriminative; shuffled pairs can look as good as real ones.
- Contact frequency across seeds measures model consensus, not truth; shrink by disagreement.
- Voronota-LT labels differ from 4.5 A atom-contact paratope labels in the literature.
- Do not use AF3 server outputs for downstream training or docking input.

## Questions for other queens (name the queen)
- q1_her2_biology / q2_vhh_immunology_structure: epitope domains of 9MTX and 9MTE VHHs?
- q8_compute_validation_execution: AF3 weight access, measured seconds per seed, and Explorer public partitions only.
- q6_epitope_ml_methods: is the CDR+flank prior the baseline to beat, and how do we combine it with co-fold contact frequency?
- q4_challenge_intelligence: does the leaderboard use the area-weighted metric, which would favour ipSAE-weighted contact areas?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- AI programs can guess how a tiny antibody sticks to a cancer protein, but they are right on the exact pose only about one time in three.
- Running the guess many times and keeping only the contacts that show up repeatedly is more reliable than trusting any single answer.
- Older shape-matching docking tools barely help unless you already know roughly where the antibody lands.

## Gaps I could not fill
- ipSAE AUROC, AbEpiTope residue numbers, and the 2026 shuffled-pair preprint (snippets only).
- GPU-hours per complex (extrapolated); Boltz-2, OpenFold3 and Protenix nanobody-specific success rates.
- HADDOCK3 version, Rosetta licence, ClusPro/ZDOCK/HDOCK nanobody rates.
- SAbDab-nano residue statistics; domain II-IV boundaries; install recipes.
- No worker re-dispatched: all 5 had sources, and I did no rescue searches.
