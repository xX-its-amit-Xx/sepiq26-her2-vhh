---
title: Ensembling, calibration and smoothing for residue-level PR-AUC (macro over 3 complexes) - recipe, ladder, CSV checklist
queen: q8_compute_validation_execution
king: king_infer
worker: ensembling_and_probability_calibration_for_residue_level_pr_auc_macro_over_three_targets
tier: expert
tags: [pr-auc, ensembling, calibration, rank-averaging, smoothing, seeds, submission-csv, runbook, leakage]
confidence: medium
challenge_relevance: 4
serendipity: Sports power rankings (polls + Elo + betting lines aggregated, only the order matters for a bracket) - holds for within-list ordering, breaks at cross-chain pooling where calibration suddenly matters.
date: 2026-10-17
---

# Ensembling, calibration and smoothing for Track A

## TL;DR
PR-AUC only sees the ORDER of scores inside one scored list, so calibration (Platt, isotonic, temperature) cannot help unless the organisers pool chain A and chain B into one list per complex, which the guideline text does not settle. Recipe: average several seeds and several co-fold models, smooth lightly over 3D neighbours, shrink toward a CDR/surface prior, give every residue a distinct small nonzero value, and write scores on a common calibrated probability scale across both chains so it is safe under either reading of the metric. Seed count, model diversity, smoothing and prior shrinkage move the number; calibration, the exact aggregation family and the output scale mostly do not (except through ties and chain pooling).

## 1. What the guideline says (https://sepiq.uk/guideline, fetched 2026-10-17)
- Per-complex PR-AUC, macro-averaged over antibodies 1-3; "residues will not be pooled across all antibodies ... (micro-averaging)". Pooling ACROSS complexes is excluded, so cross-complex calibration is irrelevant.
- Weighted variant: weighted recall = TP_area/P_area with ordinary precision. Weights = Voronota-LT per-residue contact areas, non-zero only where fact = 1.
- Ground truth columns: chain, seqNum, resName, fact, weight. Submission: chain, seqNum, resName, prediction in [0,1]; omitted residue assumed 0. Chain A antigen, chain B VHH.
- NOT stated: whether chains A and B are pooled into ONE PR curve per complex or scored per chain then combined. This is the only place calibration can matter. The page describes thresholding to 0/1 and counting TP/FN/TN/FP, i.e. a standard threshold sweep.
- The 5-submission cap comes from BRIEF.md; the guideline page fetched here states no limit (unverified on the page).

### Provably irrelevant vs relevant (per scored list)
| Choice | Effect on PR-AUC inside one list | Why |
|---|---|---|
| Strictly increasing transform of final score (Platt, temperature, power, log) | None (provable) | PR curve depends only on sorted order and labels; the area-weighted recall variant also depends only on order |
| Output scale (0-1 vs 0-0.5) | None | order only |
| Isotonic regression | Can HURT | only weakly monotone, creates plateaus (ties) |
| Rounding/saturating/clipping | Hurts via ties | synthetic: rounding to 1 decimal cost about 0.10 AP |
| Aggregation family over seeds (mean prob, mean logit, geometric, noisy-OR, rank mean) | Second order, NOT provably zero | sum of transformed scores is not monotone in the sum of originals; synthetic spread under 0.015 AP |
| Max over seeds | Worse (about 0.10 AP below mean, synthetic) | keeps the worst outlier per residue |
| Cross-chain calibration | Zero if per-chain scoring; potentially large if A+B pooled | section 2 |
| Smoothing, seed count, model diversity, prior shrinkage | Real | change the order |

## 2. Chain pooling: where calibration can bite
My estimate (not verified against ground truth): HER2 ECD is about 630 residues (P04626 residues 23-652 after the 22-residue signal peptide, plus the construct tail), a VHH epitope is perhaps 20-40 residues, so antigen prevalence is about 3-6%; a paratope of 15-25 of 120-130 VHH residues is about 12-20%. In one pooled list a VHH residue at 0.3 and an antigen residue at 0.3 are only correctly ordered if both are calibrated to their own base rates.
Decision: output calibrated PROBABILITIES per residue with chain base rates preserved (antigen mean about 0.05, VHH mean about 0.15). Optimal if pooled, harmless if per-chain. Do NOT min-max each chain separately: pooled, that would rank antigen noise equal to VHH signal. A probe via S2 vs S3 (section 8) only works if score feedback exists.

## 3. Combining seeds and models
| Source | Finding (as reported) | Relevance |
|---|---|---|
| DiscoTope-3.0, Front Immunol 2024, doi 10.3389/fimmu.2024.1322712 (opened PMC10882062). NB: BRIEF/starting sources say Nat Commun; the paper opened is Frontiers in Immunology | Final score = ARITHMETIC MEAN of bootstrapped XGBoost ensemble (20 in ablation, 100 in final model; each member 70% of epitopes, unlabelled at 5:2, different seed). Single ESM-IF1 XGBoost AUC-ROC 0.767; 20-member ensemble 0.791 (+0.024); full model 0.799 (AF structures) / 0.807 (solved). External AUC-PR 0.232 (predicted) vs BepiPred-3.0 0.177; 0.223 (solved) vs SEMA 0.185 | Best direct epitope-ensemble evidence; arithmetic mean works. Antigen-only task |
| Same | Per-antigen normalisation (score - mu)/std from GAMs on antigen length and mean surface score. NO neighbour-radius smoothing (ESM-IF1 embeddings carry 3D context) | Cross-antigen calibration only; irrelevant per complex |
| BepiPred-3.0, Protein Sci 2023 (opened PMC9679979; DOI 10.1002/pro.4497 not visible on page) | 5 fold models; AUC on "averaged probability outputs"; majority vote for MCC etc. Smoothing: "moving average with a window size of 9" applied only for the IEDB external linear-epitope set. AUC 0.738 (5 antigens), 0.771 (15 antigens), 0.663 (IEDB). No AUC-PR | 1D smoothing only; does not confirm the server's final score is smoothed |
| Hitawala and Gray, bioRxiv 10.1101/2024.09.21.614257 (opened PMC11838198; mAbs DOI 10.1080/19420862.2025.2545601 NOT verified) | AF3 single seed top decoy: nanobody 11.4% high-accuracy (DockQ >= 0.80), 31.4% acceptable+; antibody 11.0% / 38.1%. Only 3 seeds run for variance, no pooled success; 1000-seed figure cited, not tested. Nanobody cutoffs: ipTM >= 0.4, Delta-GB <= 0 REU, I-pLDDT >= 90 (85 used in AUROC). Nanobody n-AUC: Delta-GB 0.937, I-pLDDT 0.889; combo (Delta-GB <= 0 then I-pLDDT >= 73) 0.992. "The model has difficulty finding the correct antigen interface" | Confidence can select good poses; no residue-level epitope metric reported; preprint and NeurIPS versions differ (8.9/13.4 vs 11.0/11.4) |
| AFsample (PMC10534052; search snippets only) | about 6000 models vs 25 default; CASP15 mean DockQ 0.41 to 0.55; nanobody H1144: 3 of 6000 models with ranking_confidence > 0.8, all DockQ > 0.8 | Massive sampling finds rare correct poses; 5 seeds will not |
| Ab-Ag AF evaluation (PMC10751731; snippet only) | 427 complexes: latest AF > 30% near-native, about 50% with increased sampling (about 20% prior version) | sampling roughly doubles hit rate |
| Rank vs probability averaging (search snippets only) | DUD-E 8-model ensembles: rank 0.976 vs average 0.970 AUROC on one set, 0.878 vs 0.887 on held-out; differences small, sign-inconsistent | pick on validation, do not agonise |
| DKFZ 2026 benchmark Boltz-2/Chai-1/IntFold/AF3 (snippet only) | no single confidence metric best; combine global and local | mix ipTM with interface-local pLDDT/PAE |
| bioRxiv 2024.10.07.616899 "AI driven approaches in Nanobody Epitope Prediction" | fetch failed (HTTP 429), NOT read | follow-up |

I found NO published number for contact frequency over N seeds as a nanobody epitope scorer. It is plausible, not proven. The "AF2 ipTM seed sampling nanobody" query returned only AFsample-type results.

### Synthetic simulation (mine, NOT real complexes)
Script: research/q8_compute_validation_execution/_mc/ensembling_sim.py. 600 residues in a 60 A box, epitope = within a radius of 3 random centres (prevalence 0.10), 5 seeds = 1.2*label + shared error (weight 0.6) + independent noise; mean AP over 300 trials, SE about 0.003.
| Method | AP |
|---|---|
| single seed | 0.372 |
| mean of logits | 0.567 |
| mean of probabilities | 0.563 |
| noisy-OR | 0.566 |
| geometric mean | 0.559 |
| rank mean | 0.557 |
| max over seeds | 0.463 |
| exp(5*mean prob) (monotone of mean prob) | 0.563 (identical: confirms invariance) |
| mean probs rounded to 1 decimal | 0.464 (ties) |
| mean then 8 A smoothing | 0.784 (ARTEFACT, see below) |
Takeaways: averaging families within 0.01; max and ties lose; the smoothing jump exists only because truth is a contiguous blob and noise is spatially independent. Real co-fold errors are spatially coherent wrong patches, so do not quote it.

## 4. Spatial smoothing
- Truth = Voronota-LT contact-area clusters, spatially coherent, so diffusion should help a noisy per-residue score.
- Literature gain: none found for 3D radius smoothing. DiscoTope-3.0 does none; BepiPred-3.0 uses a 1D window of 9 on one linear-epitope set. No known gain figure; must be measured.
- Seed disagreement is signal about pose uncertainty; heavy smoothing blurs it. Use s' = (1-a)*s + a*mean(s over side-chain-centroid neighbours within r), a in {0, 0.25, 0.5}, r in {6, 8, 10} A. Default a=0.25, r=8 A. The antigen neighbour graph can be built from the HER2 structure alone (pose-independent).
- Smooth per chain. On the VHH, do not smooth across framework; CDR-block structure matters.

## 5. Calibration, confidence weighting, prior, ties
- Platt/isotonic/temperature: inert for within-list PR-AUC. Use a one-parameter strictly monotone fit only to set a common probability scale across chains. Avoid isotonic unless followed by a tiny ensemble-mean tie-breaker.
- Seed weights: w_i = softmax(beta * z(ipTM_i + interface pLDDT_i)) or keep top half by ranking_confidence. Cap max weight 0.4 and keep a 50% equal-weight component (3 test complexes, one confident wrong pose would dominate).
- Prior shrinkage: final = (1-l)*ensemble + l*prior, l about 0.2-0.3 by validation. Prior = rank-normalised relative solvent accessibility (HER2) and CDR indicator, CDR3 highest (VHH).
- Omitted = 0: do NOT omit. A block of zeros is one tie group. Use final = 0.98*score + 0.02*prior_rank so every residue has a unique value in (0,1]. No cost, positive expected gain.
- Write exactly the template rows; behaviour on extra rows unverified.

## 6. How much does a 5-seed ensemble help? (Q5)
No real-complex run was done: I have no verified public HER2-VHH PDB list in hand, and the brief's 8GZ5 is an RBD-VHH proxy, not HER2. By analogy only: DiscoTope-3 20-member ensemble +0.024 AUC-ROC; AF Ab-Ag sampling about 20-30% to about 50% near-native at much larger seed counts; synthetic 0.37 to 0.56 (not transferable). Expect a few AP points, more where seeds disagree.
Ready-to-run script spec (CPU, tiny):
1. Inputs per validation complex: K=5 predicted complexes per model (Boltz-2, Chai-1, OpenFold3) with CIF + confidence JSON; ground truth from Voronota-LT (chain, seqNum, resName, fact, weight).
2. Per seed residue contact = any heavy-atom pair within 4.5 A across chains (or Voronota-LT area); soft version = inverse-distance-weighted contact count.
3. Scores: single_i; freq = mean_i; conf_freq = sum w_i*contact_i; rank-mean and logit-mean across models; optional sequence-model score.
4. Metrics: sklearn average_precision_score per chain and per complex (both pooled-chain and per-chain), weighted variant by manual cumulative recall with weights and ordinary precision, macro over complexes, paired cluster bootstrap B=2000 over contact patches.
5. Ablations: K in {1,2,3,5,10}; aggregation family; (a, r); l; ties (rounded vs unique).
6. Run with `python -I`; numpy/scipy/scikit-learn (system Python had none; I installed to C:\Temp\sepiq26\q8sim\lib).

## 7. Submission CSV writer spec (Q6)
Header exactly `chain,seqNum,resName,prediction`; UTF-8; comma; LF; no index column; one file per complex (ONU11, ONU13, ONU23), filenames per template.
- chain: A = HER2 antigen, B = VHH (case per template; template is gated and unseen).
- HER2 seqNum: UniProt P04626 numbering INCLUDING the signal peptide (residue 1 = initiator Met; ECD starts at 23). Take rows from the template; never renumber from PDB or from the mature protein.
- VHH seqNum: sequential 1..N (BRIEF.md: ONU11 120 aa (+S +His), ONU13 120 aa (+S +His), ONU23 130 aa (+His); confirm whether tag residues appear in template rows). Not Kabat/IMGT.
- resName: as in template (three-letter uppercase likely; unverified); must match the residue at seqNum.
- prediction: finite float in [0,1], 6 decimals, unique per chain, no blanks.

Pre-submission tests (script all):
1. Header equals the 4 names; 4 fields per row.
2. Key set (chain, seqNum, resName) equals template set: no duplicates, extras or omissions.
3. resName matches the known sequence at each seqNum (check ONU sequences from sepiq.uk/detail and P04626).
4. prediction numeric, in [0,1], finite; unique-value count per chain equals row count.
5. Mean prediction per chain near intended base rate (about 0.05 / 0.15), with real spread.
6. Save only via Python (Excel can mangle fields).
7. HER2 offset check: first antigen seqNum equals the template's; the 22-residue signal offset is not applied twice.
8. Re-read with pandas and compute a self-AP against a fake truth to prove the pipeline end to end.

## 8. Runbook (today 2026-10-17, deadline 2026-10-31) and 5-submission ladder
| Date | Named deliverable |
|---|---|
| Oct 17 | D1 verified template row lists for the 3 CSVs, csv_validator.py passing on a dummy file |
| Oct 18 | D2 public HER2/VHH validation manifest with PDB release dates and Voronota-LT labels |
| Oct 19-20 | D3 co-fold jobs (Boltz-2, Chai-1, OpenFold3; K=5 seeds; public partitions only, at most 2 GPUs) on validation + 3 test targets |
| Oct 21 | D4 score extraction (contact frequency, ipTM, pLDDT) and eval harness with ablation table |
| Oct 22 | D5 submit S1, record result |
| Oct 23-24 | D6 pick aggregation, a, r, l, K on validation; submit S2 |
| Oct 25 | S3 chain-pooling probe |
| Oct 26-27 | D7 add sequence-derived/AVIDa-hHER2 signal; S4 |
| Oct 28 | D8 go/no-go on final blend; document inputs, settings and external data (rules require it) |
| Oct 29 | S5 final, buffer |
| Oct 30-31 | spare; never make the last day the first upload |

| # | Content | Kill criterion |
|---|---|---|
| S1 | best single co-fold model, mean seed contact frequency + prior, unique values | must pass section 7 tests; if rejected, fix only format |
| S2 | multi-model blend, a=0.25, r=8 A, l=0.2, per-chain base rates | drop smoothing/prior if validation macro AP does not beat S1 by one bootstrap SE |
| S3 | S2 but each chain min-max normalised | informative only with score feedback; if S3 > S2 the metric pools chains by rank |
| S4 | S2 + sequence-derived signal via rank mean | kill if no validation gain, or gain only on leaked complexes |
| S5 | best validated config, no new ideas | never ship a config that did not pass the section 7 tests |
Results are announced 2026-12-15 per the brief; whether a live leaderboard gives score feedback during the window is unverified. Without feedback the kill rules run on the validation metric and S3 is not a probe (use S3 as a hedge or skip).

## 9. Validation set and leakage (honest)
- Use public HER2 (ERBB2) nanobody/VHH complexes from SAbDab-nano/PDB released before the test complexes were made (keep release date before 2026-01; challenge opened 2026-09-01). I did not verify specific PDB IDs (I recall 5MY6 as a HER2-nanobody complex; unverified). Resolve via SAbDab-nano antigen = ERBB2 and deposition dates.
- Leakage: (1) Boltz-2, Chai-1 and OpenFold3 were trained on PDB up to their cutoffs (not verified here), so public HER2 complexes in validation are in-distribution: validation AP is an UPPER bound on test AP. (2) Very few public HER2-VHH complexes, so validation is tiny and noisy (per-complex AP SE maybe 0.05-0.10, my guess). (3) Tuning on it overfits: use the coarse grid, prefer defaults. (4) Rules say public-data leakage is "not an issue as long as the answer is correct", so public structure priors are legal, but document them.
- 8GZ5 (RBD-P17) tests the pipeline and ties, not HER2 epitope priors.

## Forced analogy: sports power rankings
a) Each seed/model is a noisy ranker (poll, Elo, betting line). Aggregators (rank average, shrink toward last season's rating) beat any single star ranker, and a bracket needs only the ORDER. Vegas lines are well calibrated, which matters to bettors, not to seeding.
b) Testable: (i) shrink toward the prior like early-season ratings: l tuned on validation, best l larger when seeds disagree; (ii) weight rankers by past accuracy (confidence-weighted seeds, capped, like sharp bettors); (iii) only 3 "games" (complexes), variance dominates, so prefer robust averaging over sharp picks; (iv) tiebreakers: unique value per residue.
c) Partially holds. Holds for within-list ordering. Breaks where (1) pooled chains make calibration matter (comparing teams across leagues with different base rates) and (2) seeds are not independent rankers: shared MSAs and training data make errors correlated (my simulation used 0.6 shared error), so seed gains saturate faster than polls.

## Gotchas / what could fool us
1. Isotonic or rounding creates ties; tied blocks are scored as one step (synthetic cost 0.563 to 0.464).
2. Omitting residues is one giant zero tie; positives hiding there are unrankable.
3. Per-chain min-max scaling is harmless if per-chain scoring, harmful if pooled; guideline silent.
4. Toy smoothing gains (0.56 to 0.78) are an artefact; real co-fold errors are coherent wrong patches.
5. Seeds from one model share MSA/templates, so seed count saturates; cross-model diversity matters more.
6. Validation complexes are inside co-folder training data: optimistic.
7. Macro over 3 complexes: one wrong pose moves the score by a third of its AP; look at per-complex AP.
8. A HER2 numbering offset of 22 puts every antigen residue on the wrong truth row with no error message.
9. Citation drift: DiscoTope-3 is Frontiers in Immunology 2024 (10.3389/fimmu.2024.1322712), not Nature Communications as in the brief's starting sources.
10. The HF dataset is gated; template format assumptions (resName case, tag rows) are unverified.

## Implications for the challenge
1. Write calibrated probabilities with chain base rates preserved (A about 0.05, B about 0.15); never rescale chains separately.
2. Give every residue a unique nonzero value (0.98*score + 0.02*prior-rank); no isotonic, rounding or omission.
3. Combine by logit mean or rank mean over at least 3 models x 5 seeds; no max; do not spend time choosing aggregation families.
4. Weight seeds mildly by ipTM/interface pLDDT, cap weights, keep a 50% equal component.
5. Smoothing a=0.25, r=8 A on the antigen surface graph, coarse grid only; drop if validation shows no gain.
6. Prior shrinkage l=0.2 toward RSA (HER2) and CDR (VHH); also the tie-breaker.
7. Run all section 7 tests before every upload; follow the ladder and kill criteria; S5 only a validated config.
8. Ask the organisers (HF Space community tab) whether chains A and B share one PR curve per complex.

## Open questions
- Pooled vs per-chain PR-AUC within a complex.
- Do omitted residues only tie at 0 in the curve, or leave the label set?
- Is score feedback available inside the submission window?
- Exact template format once the gated dataset is accessible.
- Real 5-seed gain on HER2 complexes (needs co-fold runs; no verified public HER2-VHH ID list here).
- Training cutoffs of Boltz-2, Chai-1, OpenFold3 (not verified).

## Sources
- https://sepiq.uk/guideline (opened)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (opened; gated, templates not visible)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10882062/ DiscoTope-3.0, doi 10.3389/fimmu.2024.1322712 (opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9679979 BepiPred-3.0 (opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/ Hitawala and Gray, doi 10.1101/2024.09.21.614257 (opened)
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10534052/ AFsample (search snippets only)
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10751731/ AF Ab-Ag evaluation (search snippet only)
- https://inrepo02.dkfz.de/record/314413 DKFZ benchmark (search snippet only)
- https://www.biorxiv.org/content/10.1101/2024.10.07.616899.full.pdf (fetch failed 429, not read)
- Local synthetic simulation: research/q8_compute_validation_execution/_mc/ensembling_sim.py
