---
queen: q8_compute_validation_execution
king: king_infer
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- The portal gives no score feedback (app.py), so the five submissions are checkpoints, not experiments. All model selection must happen on public proxies before upload.
- Only 4 public HER2-VHH PDB entries exist (5MY6, 7QVK, 9MTE, 9MTX; 4 non-redundant). They suit sanity checks, not tuning.
- At n=3 the smallest detectable gap is about 0.09-0.11 macro PR-AUC; a 3-cluster bootstrap is degenerate. Prefer the simplest robust arm unless a pre-registered margin is beaten.
- Compute is not the bottleneck: about 14 GPU-h total (extrapolated) fits the 2-GPU Explorer cap on public partitions, with Modal as fallback. Queue waits of hours are likely.
- Plan: upload a 2-hour CDR/accessibility-prior submission on Oct 20 as insurance, freeze Oct 28, upload the real candidate Oct 29, reserve Oct 30, last upload by Oct 30 06:00 UTC (deadline time zone unstated).

## New concrete facts (numbered; each with file + source count; mark confidence)
1. Four HER2-VHH PDB entries: 5MY6 (2017, X-ray 2.25 A, domain I), 7QVK (2023, 3.1 A, I/II junction), 9MTE (2025-11-19, cryo-EM 2.66 A, two VHHs), 9MTX (2025-11-19, 3.06 A). 27A05 and 29E09 are one family (identity 0.857). All under 0.73 full-length identity to ONU clones. (validation_design file, 14 sources; medium-high; SAbDab-nano not queried; AVIDa identity not computed because the table is gated)
2. Proxy antigen prevalence is 0.03-0.08 (vs 0.126 for 8GZ5), so random PR-AUC is low and a prevalence-matched baseline is required. 5MY6 is inside co-folding training windows, 7QVK inside Boltz-2's; 9MTE/9MTX are clean. (validation_design, 14; medium)
3. Space app.py: no score returned, leaderboard tab static (rankings planned 1 Dec 2026), only the header is validated, the 5-cap and deadline are not enforced, files go to a private dataset per team/user/UTC timestamp, and a partial upload failure can leave 1-2 files committed. Which submission counts is unstated. (ladder, 7 sources; runbook, 11; medium, WebFetch summaries are not verbatim)
4. Power: about 0.09-0.11 absolute macro PR-AUC for roughly 75% power at n=3; a 3-cluster bootstrap gives about 14% false positives. (ladder, 7; medium, Monte Carlo)
5. Explorer public gpu: 8h limit, gpu-short 2h; A100/H200/V100/T4 nodes; 152 pending, 65 running at probe. No boltz/alphafold modules, so pip or apptainer. All per-engine minutes are extrapolations (1 GPU-min per 5-sample seed-run, from one AF3 timing snippet). (compute, 9; medium-low on timings)
6. Boltz credit cost is unknown: the CLI is unauthenticated here. (compute; high confidence that it is a gap)
7. Calibration: strictly increasing transforms cannot change PR-AUC within a list; isotonic can hurt via ties; max-over-seeds is about 0.10 AP worse than mean (synthetic). Calibration matters only if chains A and B are pooled, which the guideline does not settle, so write probabilities with chain base rates preserved (antigen about 0.05, VHH about 0.15). (ensembling, 9; medium)
8. Ensembling recipe: mean over at least 3 models x 5 seeds, 8 A smoothing, 0.2 prior shrinkage, unique nonzero values. No real HER2 seed-gain run was done. (ensembling; low-medium)
9. Runbook: 15 days, 21-row failure register, 2-hour fallback spec, last upload by Oct 30 06:00 UTC. (runbook, 11; medium)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Walk-forward backtest (sports): worked. Forced a dated cutoff and exposed the low-prevalence proxy league.
- Salary cap (sports): worked as a budgeting rule (many cheap seeds first, bench AF3/Protenix-v2). Not a modelling idea.
- Power rankings (aggregation): holds within a list, breaks at cross-chain pooling.
- Batting average over 3 games / stop-loss: worked as shrinkage and kill rules. The Elo-ladder part died because the portal returns no scores.
- Popper falsification: changed 4 runbook decisions, did not change the modelling plan.

## Contradictions within my subdomain
- /detail vs /guideline disagree on whether PR-AUC is the named primary metric (fetch summaries differ). Resolution: optimise macro PR-AUC, check both variants.
- Results date 2026-12-15 (/detail) vs ranking release 1 Dec 2026 (Space).
- Bootstrap described as residue-level (B=2000) and as "cluster bootstrap" elsewhere.
- "Clean" proxy labels differ: the runbook calls 9MTE/9MTX clean and 7QVK/5MY6 leakage-flagged, while the validation file says all four pass the date cutoff. They agree only if "clean" means outside engine training windows; keep both labels.

## Gotchas for the modeler (what could silently fool us)
- Proxy PR-AUC is optimistic for co-folders on 5MY6/7QVK and for anything homologous to the proxies.
- Ties: rounding or clipping scores costs about 0.10 AP. Make all values unique.
- Min-max scaling each chain separately breaks a pooled A+B list.
- Numbering: antigen uses UniProt P04626 numbering including the 22-residue signal peptide; VHH uses a sequential index. A wrong offset silently zeroes the score. A round-trip test is required.
- Partial upload failure can leave 1-2 of 3 files committed; the app does not check row counts or range.
- The smoothing gain seen in the toy simulation is an artefact, not evidence.
- V100/T4 lack bf16, which Chai-1 needs.
- All WebFetch page readings are model summaries, not verbatim.

## Questions for other queens (name the queen)
- q4_challenge_intelligence: any verbatim statement of which submission is scored, chain pooling, deadline time zone?
- q3_assay_ngs_ground_truth: confirm the weighted metric and label definition (Voronota-LT, 4 A rule).
- q1_her2_biology / q2_vhh_immunology_structure: domain boundaries and epitope residue lists for the 4 proxies.
- q5_structure_prediction_docking: measured seconds per seed for Boltz-2/Chai-1 on HER2+VHH, and training cutoffs per engine.
- q6_epitope_ml_methods / q7_data_representation_integration: which arm is worth GPU-hours versus the CDR/accessibility prior.

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- We cannot see our score until the contest ends, so we must test our guesses on a handful of known public examples first.
- With only three answers to be graded on, small score differences are mostly luck, so we keep the plan simple and robust.
- The computing we need is modest, and the real risk is a missed deadline or a formatting slip, not a lack of GPUs.

## Gaps I could not fill
- Sequence identity of the proxies to the gated training table.
- SAbDab-nano not queried programmatically.
- Boltz credit cost; measured per-seed GPU time; real queue waits.
- Deadline time zone and which submission is scored.
- No real HER2 seed-gain experiment.
