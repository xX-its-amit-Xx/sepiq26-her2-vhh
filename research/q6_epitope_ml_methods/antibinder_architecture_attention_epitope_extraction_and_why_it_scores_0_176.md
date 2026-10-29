---
title: AntiBinder architecture, attention-based epitope readout, and why it scores 0.176 PR-AUC
queen: q6_epitope_ml_methods
king: king_infer
worker: antibinder_architecture_attention_epitope_extraction_and_why_it_scores_0_176
tier: expert
tags: [AntiBinder, baseline, PR-AUC, attention, epitope, leakage, AVIDa-SARS-CoV-2, SAbDab-nano, AsEP]
confidence: medium
challenge_relevance: 3
serendipity: CASP "winner's ablation" lens applied to AntiBinder; it paid off by showing the paper has no epitope ablation at all and the 0.176 is an organiser-side proxy that is statistically indistinguishable from random.
date: 2026-10-17
---

# AntiBinder: how it gets a per-residue score, and why 0.176 is barely above random

## TL;DR
AntiBinder is a global antibody-antigen binder/non-binder classifier (heavy-chain sequence + IgFold structure features vs antigen sequence + ESM-2 features, bidirectional cross-attention). The published paper reports NO residue-level epitope or paratope metric, and never uses AVIDa-SARS-CoV-2 or SAbDab-nano, so the SEPIQ proxy figure (8GZ5, PR-AUC 0.176) is not reproducible from the paper. I simulated random scoring on 26 positives out of 206 residues: mean AP is 0.147 (not 0.126) with sd 0.032, so 0.176 is only about 1.2x the expected random AP, and a random scorer reaches it about 16% of the time. Treat it as a floor, not a signal.

## Q1. Architecture (open-access article, PMC11744619, read through a fetch summariser; supplement not seen)
| Item | Finding |
|---|---|
| Task | Pair classification, interact vs not (BCE loss, sigmoid output). Not a contact-map or epitope model. |
| Antibody encoder (AbSeqEmb) | Amino-acid index + Chothia region index (3 CDRs, 4 frameworks); IgFold-predicted structure matrix, CDR-H3 emphasised, linear+ReLU; concatenated. Heavy chain only. |
| Antigen encoder (AgSeqEmb) | Amino-acid index + ESM-2 embedding (article calls it structural), linear+ReLU. No region segmentation. |
| Embedding | "S2V" chosen over one-hot, k-mer, AC, CKSAAP. |
| Length limits | Antibody 149, antigen 1024 (covers "over 80%"); pad or truncate. |
| Core block | BidAttBlock: separate weights; Ab->Ag (query Ab, key/value Ag) and Ag->Ab; stacked blocks (count only in Supp. Table 2); two linear reducers with learnable balance, concat, MLP. |
| Parameters, GPU, training time | NOT reported in the article text. The "30 min on RTX 3090 Ti" is an organiser-side number I could not verify. |
| Paratope/epitope readout | None quantitative. One qualitative figure: HIV-1 JRCSF gp120 / PGT124, antigen-to-antibody attention highlights Y65-R349 and E118-Q332 pairs matching known contacts. Authors call attention "sparse" and say further study is needed. |
| Training data | Cov-AbDab SARS-CoV-2 (13,471 pos / 13,853 neg, 32 antigens), LANL HIV (12,650/11,354, 940 Ag), BioMap (655/708, 594 Ag), MET (1,516/2,484, 1 Ag), combined 56,691 pairs, 1,567 antigens. Text/table inconsistency: BioMap "1706" vs 1,363. |
| Global results | Unseen-antigen AUC: Cov-exp1 82.88, Cov-exp2 96.51 (AbAgIntPre 96.44, so the "over 10%" claim holds for F1, not AUC), HIV-exp1 83.89; cross-species Bio-exp1 AUC 74.84 (335 test pairs). MET 5-fold AUC 0.9715. |
| Ablation | Sequence contributes more than structure; combination best (figures only). No epitope ablation. |

## Q2. Published residue-level numbers and the 0.176 reconciliation
- AntiBinder paper: zero residue-level numbers (no ROC, PR-AUC, top-k). One anecdotal heatmap. Answer to "PR-AUC or only ROC/top-k": neither.
- SEPIQ proxy (from BRIEF, not independently verified): 8GZ5 (RBD + P17 VHH), 26/206 epitope residues, prevalence 0.1262.
- Random baseline: analytic PR-AUC limit = prevalence = 0.126. Lift of 0.176 = 0.176/0.1262 = 1.39x (+0.050 absolute).
- Finite-sample correction (my Monte Carlo, 5,000 shuffles, 26 pos / 180 neg): mean AP 0.147, sd 0.032, 5-95% range 0.106-0.208, P(random >= 0.176) = 0.16. Effective lift over expected random AP is 1.2x, about 0.9 sd. One complex, no CI, no repeated seeds: not evidence of signal. The official metric is macro over 3 complexes, which averages noise down only by about sqrt(3).
- 206 residues is presumably the RBD length used in the proxy (unverified); the HER2 epitope fraction will differ.

## Q3. Why AVIDa-SARS-CoV-2 pretraining "helps" (hypotheses)
Facts: AVIDa-SARS-CoV-2 (Tsuruta et al., NeurIPS 2024, arXiv 2405.18749): VHHs from two spike-immunised alpacas, binary binder/non-binder labels against 12 SARS-CoV-2 variants (Delta, Omicron...), CC BY-NC 4.0, columns VHH_sequence, Ag_label, label. The HF card does not say RBD vs full spike, and I could not read counts (PDF unreadable by fetch). SAbDab-nano: 1,585 structures (Apr 2024 snapshot), 1,972 single-domain (Jul 2025); small and redundant.
| Hypothesis | Evidence | Verdict |
|---|---|---|
| Data volume | AVIDa is far larger than SAbDab-nano; the AntiBinder paper itself trains on 56k pairs. | Plausible, untestable from the paper. |
| Label type (binding vs contact) | SAbDab-nano has only positives (structures); a classifier needs negatives, which must be synthesised and leak "same antigen" shortcuts. AVIDa gives real negatives on the same antigen. | Supported as the main reason SAbDab-only is about random. |
| Antigen-family overlap | 8GZ5 antigen is SARS-CoV-2 RBD; AVIDa antigen is spike variants. | Strongly supported: in-domain pretraining on the test antigen. |
| Leakage of 8GZ5/RBD | RBD is in AVIDa antigens by construction; whether the 8GZ5 VHH sequence is in AVIDa is unverified. | Antigen leakage certain, sequence leakage unknown. |
Judgement: antigen-family overlap plus real negatives. None of this transfers to HER2 unless AVIDa-hHER2 supplies the same thing, and it has only a few hundred labels (per BRIEF).

## Q4. Code, weights, licence, retraining
- Repo: github.com/fdu-wangfeilab/AntiBinder, MIT licence (LICENSE file present). README clone URL says shiipl/AntiBinder: mismatch, verify. Files: antibinder_model.py, antigen_antibody_emb.py, main_trainer.py, main_test.py, heavy_chain_split.py, cfg_ab.py, datasets/, benchmarks/.
- Weights: not mentioned in README. No Zenodo/HF link found. Assume retrain.
- Requirements: Python 3.10+, fair-esm 2.0.0, igfold 0.4.0, biotite 0.40.0, biopython 1.83, lmdb, scikit-learn. requirements.txt not visible in the listing.
- Retrain feasibility: a 30 min run on an RTX 3090-class GPU is plausible but the real cost is precomputing IgFold structures per VHH (all 1.8M sequences is infeasible; subsample) and ESM-2 for 630+ aa antigens. Explorer gpu/gpu-short with at most 2 GPUs fits. AntiBinder takes the heavy chain only, fine for VHH.
- Licences: code MIT (usable). AVIDa-SARS-CoV-2 CC BY-NC 4.0 (a cash-prize entry is arguably non-commercial, but check). SEPIQ training data licence "other": no redistribution or rehosting.

## Q5. HER2 / AVIDa-hHER2
- Antigen cap 1024 aa; HER2 ECD (~620 aa, with signal peptide, GACQ and His still under 1024) fits without truncation. Attention cost O(L_Ab x L_Ag), about 120 x 650, trivial.
- Real problems are not length: (a) one antigen only, so the model can learn "VHH is enriched" without conditioning on the antigen, which defeats cross-attention; (b) one-round enrichment labels are noisy and clone-frequency biased; (c) HER2 has four domains, so epitope prevalence will likely be lower than the RBD's 0.126 (a 20-30 residue epitope over ~620 gives 0.03-0.05; my estimate, unverified), which lowers the random PR-AUC floor.
- Sparse attention on a single-antigen task cannot localise the epitope without antigen variation; consider antigen-side perturbations (domain deletions) at inference.

## Q6. Competing and follow-up methods (what I could open)
| Method | Result found | Prevalence | Licence/code |
|---|---|---|---|
| AsEP benchmark (arXiv 2407.18184), 1,723 Ab-Ag complexes | WALLE MCC 0.210 AUCROC 0.635 (ratio split), 0.077 / 0.544 (epitope-group split); EpiPred MCC 0.029; MaSIF-site 0.037; ESMFold 0.028; ESMBind AUCROC 0.506; AUCPR not reported for any | epitopes ~14.6 +/- 4.9 residues; 58% of training complexes below 10% of surface | data CC BY 4.0 (Zenodo 10.5281/zenodo.11495514), code MIT |
| ABConformer (arXiv 2509.23254) | sequence-only paratope/epitope with sliding attention; no numbers in abstract; PDF too large to fetch | unknown | code promised on acceptance (unverified) |
| Sequence-only PLM conformational epitope study (PMC12636489, search snippet only) | ROC-AUC 0.67, PR-AUC 0.56 on AbDb, not nanobody-specific | not seen | unverified |
| NbBench (search snippet only) | paratope AUPRC benchmark; AntiBERTa2-CSSP AUROC 0.939 | not seen | unverified |
| AbAgIntPre, PESI | no epitope PR-AUC found; AbAgIntPre appears only as a global-binding baseline (AUC 96.44 on Cov-exp2) | n/a | not checked |
Leaky benchmarks: any set with SARS-CoV-2 antigens in both train and test (AntiBinder Cov-exp splits; the 8GZ5 proxy after AVIDa pretraining). AsEP's epitope-group split drops WALLE from 0.635 to 0.544 AUROC: the clearest leak-versus-no-leak evidence found.

## Forced analogy: CASP, "what the winner's ablation said"
(a) AlphaFold2's ablations isolated which component carried the score (MSA/templates, recycling, structure module). For AntiBinder the paper's ablation says sequence > structure, but only for global binding AUC; there is no ablation for any epitope output. (b) Testable idea: run three arms on 8GZ5 with multiple seeds: (i) no pretraining, (ii) AVIDa pretraining, (iii) AVIDa pretraining with antigen sequences shuffled; report mean AP against the matched shuffle null (0.147 for n=206), not against 0.126. (c) Holds partially: CASP has a baseline-server ceiling, and the analogue here is the shuffle null (0.147), which 0.176 does not clearly beat. It breaks because CASP baselines were measured on many targets, whereas here n=1 complex.

## Gotchas / what could fool us
1. Compare AP to the finite-sample null (0.147), not the prevalence (0.126); with 26 positives sd is 0.032.
2. 0.176 comes from one complex and one run, no CI, and is not in the paper.
3. The paper does not use AVIDa-SARS-CoV-2 or SAbDab-nano; the proxy is the organisers' own undocumented experiment.
4. Attention is not attribution; the authors say so. Sparse attention can concentrate on CDR3 or termini regardless of antigen.
5. Single-antigen HER2 labels let the model ignore the antigen entirely.
6. Heavy-chain-only input and truncation at 149/1024 are fine for VHH and HER2 ECD but silently drop long sequences elsewhere.
7. IgFold is antibody (VH/VL) oriented; VHH structure quality is a risk.
8. Licences: AVIDa is NC, SEPIQ data is no-redistribute.

## Ranked reasons it underperforms
1. Wrong objective: global binder classification with no contact supervision; attention is an unvalidated proxy for contacts.
2. Antigen shortcut and n=1 antigen supervision: on HER2 the cross-attention has no variation to learn from; on the proxy, gains likely reflect same-family pretraining.
3. Statistical power: 26 positives, one complex, null AP already 0.147; the apparent 1.4x is mostly within noise.

## Implications for the challenge
1. Do not use AntiBinder attention as the main predictor; at best a weak feature. Retraining on HER2 is cheap but expect near-null.
2. Always report AP against a shuffle null and with bootstrap CIs; compute the null for each complex's prevalence.
3. Use structure predictors (AF3, OpenFold3, Boltz, Chai) for contacts and treat sequence-binding models as secondary priors.
4. If pretraining on AVIDa-SARS-CoV-2 for transfer, run the shuffled-antigen control first.
5. Check licences before using AVIDa (NC) in a prize entry.

## Open questions
- Supplement contents (block count, parameters) and the origin of the 0.176 run.
- Whether 8GZ5/P17 sequence appears in AVIDa-SARS-CoV-2 and whether labels refer to RBD or spike.
- Whether PESI/AbAgIntPre report epitope PR-AUC at all.
- Weights availability (README silent).

## Sources
- https://doi.org/10.1093/bib/bbaf008 (redirect only) and https://pmc.ncbi.nlm.nih.gov/articles/PMC11744619/ (read via fetch summariser)
- https://github.com/fdu-wangfeilab/AntiBinder (README summary)
- https://huggingface.co/datasets/COGNANO/AVIDa-SARS-CoV-2 (README) and https://arxiv.org/abs/2405.18749 (abstract only)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (card; no baseline info) and https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (discussion not visible)
- https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab/nano/stats (counts via search snippet)
- https://arxiv.org/html/2407.18184v1 (AsEP), https://arxiv.org/abs/2509.23254 (ABConformer abstract)
- Search snippets only: PMC12636489, NbBench (iopscience 10.1088/2632-2153/ae20ec)
