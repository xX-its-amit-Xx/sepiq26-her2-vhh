---
queen: q6_epitope_ml_methods
king: king_infer
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- No published tool gives nanobody-conditioned residue-level epitope PR-AUC. The best antigen-only tool, DiscoTope-3.0, scores 0.232 at 6.4% prevalence (24 antigens), about 3.6x random: a weak prior, not a winning model.
- Language-model embeddings (ESM-2, AbLang-2, IgBert, ProtT5) give a real VHH paratope prior (PR-AUC ~0.69-0.77) but are near chance for epitopes on unseen groups (AsEP AUROC 0.544). The antigen side must come from structure or co-folding.
- The baseline's 0.176 is the organisers' proxy, not a paper number (AntiBinder reports no residue metric). A shuffle null gives AP 0.147 (sd 0.032) on 8GZ5, so 0.176 is ~1.2x random and random reaches it 16% of the time.
- On HER2 the random PR-AUC is ~0.03-0.05; macro SD over 3 complexes is ~0.03-0.05, so only gaps >= 0.1 are reliable. Unresolved scoring ambiguities (chain pooling, AP vs trapezoid, best-of-5 vs last) can each change the winner.
- Only four public HER2-VHH structures exist (5MY6, 7QVK, 9MTE, 9MTX); all are far from ONU11/13/23 (CDR3 identity <= 0.36), so they are fair priors and the only proxy test set. Validate by CDR3-cluster plus epitope-bin folds.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. DiscoTope-3.0 external test: 24 antigens, 6,788 res, 436 epitope res, PR-AUC 0.232 (AF2 input) / 0.223 (solved), ROC-AUC 0.783/0.795; comparators BepiPred-3.0 0.177, SEMA 0.185. (b_cell_epitope_predictors_..., 10 sources; medium-high)
2. BepiPred-3.0 TS1/TS2 ROC-AUC 0.738/0.771, no PR-AUC reported. AbEpiTope-1.0 reports complex-level metrics only and likely excludes nanobodies. (same file; medium)
3. EpiPred abstract and Results text contradict each other on recall/precision of random. (same file; high)
4. Paratope PR-AUC for PLM probes ~0.69-0.77 at 10-25% prevalence; best PLM model on AsEP gets AUROC 0.544, MCC 0.077 on unseen epitope groups. (protein_and_antibody_language_models_..., 22 sources; medium)
5. Licences: ESM-2 MIT; AbLang-2 BSD-3; IgBert MIT; IgLM JHU non-commercial; ESM3/ESM C 600M Cambrian Non-Commercial; DTU tools academic. (same + b_cell file; medium, several unverified)
6. AntiBinder: pair classifier (IgFold + ESM-2, bidirectional cross-attention), MIT code, no weights, no residue metric; only a qualitative gp120/PGT124 attention figure. (antibinder_architecture_..., 9 sources; medium)
7. Shuffle null on 26/206 residues: mean AP 0.147, sd 0.032, 5-95% 0.106-0.208, P(>=0.176)=0.16. (same; own simulation, high given assumptions)
8. HER2 prevalence 0.024-0.064 for 15-40 contact residues on 630 res; 8GZ5 is 0.126. (residue_level_pr_auc_..., 12 sources; estimate)
9. A constant predictor scores ~0.52 under trapezoid PR-AUC; a CDR-only prior scores 0.64 on the VHH alone, 0.34 per complex if chains are pooled. (same; own simulation, medium)
10. Four HER2-VHH PDB entries: 5MY6 (domain I, 18 res), 7QVK (I/II, 168-233), 9MTE (27A05 III+I, 47D05 I), 9MTX (III+I); 63 PDB entries carry P04626. (sabdab_nano_curation_..., 14 sources; high, computed from RCSB)
11. AsEP: MCC 0.305 to 0.152, AUC-ROC 0.695 to 0.596 under an epitope-group split. (same; medium)
12. SAbDab-nano Sept 2021: 823 structures, 492 non-redundant CDR sets; SAbDab2 (June 2026) 21,237 antibody instances; 2026 nano count not obtained. (same; medium)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- CASP "winner's ablation" on AntiBinder: paid off; the paper has no epitope ablation, so 0.176 is statistically indistinguishable from random.
- CASP "early plateau" on epitope predictors: paid off as a ceiling argument (~0.2 PR-AUC at ~6% prevalence); the "CASP14 jump" analogue (antibody conditioning) is unproven at residue level.
- CASP13-to-14 "representation vs architecture" on PLMs: partial; PLMs act as a free MSA for the VHH side only, nothing for the epitope.
- CASP metric eras / screening base rates: paid off hard; metric implementation choices change the winner. Only partly holds because SEPIQ has one unresolved metric.
- CASP target-selection lens: paid off; the CDR3-identity ladder shows public VHHs are fair priors, though 27A05/29E09 show same-lineage siblings exist.

## Contradictions within my subdomain
- Baseline 0.176: lift over random is 1.4x (analytic 0.126) versus 1.2x (finite-sample null 0.147).
- AntiBinder's "over 10%" claim holds for F1 but not AUC (Cov-exp2 96.51 vs AbAgIntPre 96.44).
- EpiPred abstract vs Results swap recall and precision.
- BepiPred-3.0 test prevalence (19-26%) differs sharply from DiscoTope-3.0 (6.4%), so the tables are not comparable.

## Gotchas for the modeler (what could silently fool us)
- Raw PR-AUC is not comparable across complexes: report lift over prevalence and a shuffle null for each.
- Random splits inflate epitope metrics by 10-45%; HER2 (trastuzumab/pertuzumab) is in every structure-model training set and probably in DiscoTope/BepiPred training sets (unverified).
- Binary masks or ties break PR-AUC; output continuous scores, floor omitted residues just above 0, add a deterministic tie-breaker.
- Chain pooling would reward a CDR prior (0.34 per complex pooled); AP vs trapezoid moves a constant predictor from ~0.04 to ~0.52.
- Licence risk (DTU academic, IgLM, ESM3/ESM C 600M, AVIDa non-commercial) given prize money and authorship.
- Several claims rest on fetch-tool summaries, not full reads; parameter counts and some licences are unverified.

## Questions for other queens (name the queen)
- q4_challenge_intelligence: do organisers pool chains, use average_precision or trapezoid, and count best-of-5 or last? What contact-area cutoff defines positives?
- q3_assay_ngs_ground_truth: can the gated templates confirm chain A length (618 vs 630), and does clone-family CDR conservation in the NGS table carry paratope signal?
- q5_structure_prediction_docking: residue PR-AUC and lift of multi-seed Boltz-2/OpenFold3/Chai-1 contacts on 9MTE/9MTX/7QVK.
- q7_data_representation_integration: any representation that gives epitope signal beyond the PLM null (AsEP 0.544)?
- q8_compute_validation_execution: implement leave-one-complex-out with CDR3-cluster folds and a local Voronota-LT scorer.

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- Today's computer tools can guess which part of a nanobody touches its target fairly well, but they are close to guessing blindly about which part of the target gets touched.
- The organisers' baseline score looks low, but on a single example it is barely better than shuffling the answers at random.
- With only three test cases, a small score gap is mostly luck, so how the scoring is calculated matters as much as the model.

## Gaps I could not fill
- No residue-level PR-AUC for any nanobody-conditioned epitope tool; ISPIPred/ParaPred numbers not collected.
- AVIDa-hHER2 paper details, throughput benchmarks, several parameter counts and licences (AntiBERTy, nanoBERT, VHHBERT, ProtT5, BepiPred-3 weights, OpenFold3).
- SAbDab-nano 2026 counts and training ID lists for DiscoTope-3, BepiPred-3, AbEpiTope, AntiBinder; whether HER2 leaks into them.
- Scorer implementation (AP vs trapezoid, pooling, best-vs-last) remains unresolved.
- The AntiBinder supplement and the origin of the 0.176 run were not seen.
