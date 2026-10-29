---
title: "SAbDab-nano curation, redundancy, leakage and clustering for honest training"
queen: q6_epitope_ml_methods
king: king_infer
worker: sabdab_nano_curation_redundancy_leakage_and_clustering_for_honest_training
tier: expert
tags: [SAbDab, SAbDab-nano, leakage, clustering, MMseqs2, HER2, PDB, AF3, Boltz-2, OpenFold3, DiscoTope-3, AbEpiTope, split-protocol, licences]
confidence: medium
challenge_relevance: 4
serendipity: "CASP target-selection / template-difficulty lens: computed a CDR3-identity ladder of ONU11/13/23 against every public HER2-VHH. It paid off: all public VHHs are far (CDR3 identity at most 0.36), so they are fair priors, but 27A05/29E09 show that same-lineage siblings exist in the PDB."
date: 2026-10-17
---

## TL;DR
Only **four public HER2-VHH entries exist in the PDB** (5MY6, 7QVK, 9MTE, 9MTX), plus about 30 HER2-Fab/scaffold complexes. By CDR3 identity none is a close template for ONU11/13/23 (best CDR3 identity 0.36), so they are fair priors, not unfair leaks. The real leakage risk is different: random splits inflate residue-level epitope metrics (AsEP: MCC 0.305 to 0.152, AUC-ROC 0.695 to 0.596 when test epitopes are unseen), and HER2 with trastuzumab/pertuzumab sits in every structure-model training set.

## 1. Size and composition (Q1)
| Item | Value | Source / confidence |
|---|---|---|
| SAbDab-nano, Sept 2021 | 823 structures, 492 with non-redundant CDR sequences, about 78% protein antigens, CC BY 4.0, weekly update | Schneider 2022 NAR (OUP page); high |
| Unique antigens, resolution histogram | **not reported** in the paper | NAR page |
| SAbDab-nano 2026 count | **not obtained.** The old URL (opig.stats.ox.ac.uk/webapps/sabdab-nano/) returns 404; everything now redirects to the SAbDab2 single-page app, which fetches as an empty JS shell. | tried; gap |
| SAbDab2 (launched June 2026; Capel ... Deane, bioRxiv 10.64898/2026.06.16.732554) | 21,237 antibody instances, 11,085 PDB IDs, 6,540 unique variable regions; ML-ready subset 15,641 structures (13,902 holo), 5,301 unique IDs; no nanobody count stated | OPIG blog + search snippet; medium |
| SAbDab2 splits | versioned `ab-split` (antibody similarity) and `ab-ag-split` (antibody and antigen similarity), Zenodo record 20083995; thresholds not stated on the blog | blog; medium |
| HER2/ERBB2 in the PDB | 63 entries carry UniProt P04626 (RCSB search 2026-10-17); about 35 are antibody/binder complexes with the ectodomain (table below); 4 are VHH. Six further entries are EGFR-VHH (4KRL, 4KRM, 4KRO, 4KRP, 7OM4, 8UKV; EGFR domain III, not HER2). | RCSB Search/GraphQL; high |

For 2026 SAbDab-nano numbers: download the SAbDab2 summary table from the web UI and filter to single-chain (VH-only) entries. Not possible with the tools available here.

## 2. Every HER2/ERBB2 antibody-type complex (Q3, "done" table)
Machine-readable copy: same filename with `.json`. Dates are RCSB initial release dates. Epitope domain uses UniProt P04626 numbering (domain I 23-217, II 218-341, III 342-510, IV 511-652 = mature domain boundaries + 22 signal residues). "computed" = residues with any heavy atom within 4.5 A of the VHH, from RCSB coordinates. "lit." = well-known domain, not recomputed. "unverified" = not checked.

| PDB | Released | Method, res (A) | Binder | Epitope domain |
|---|---|---|---|---|
| **5MY6** | 2017-08-09 | X-ray 2.25 | VHH 2Rs15d | **I** (computed, 18 res) |
| **7QVK** | 2023-02-01 | X-ray 3.1 | VHH NM-02 | **I/II junction** (computed: 11 res in I, 12 in II; 168-233) |
| **9MTE** | 2025-11-19 | EM 2.66 | VHH 27A05 + 47D05 | 27A05: **III + I** (16 + 7 res); 47D05: **I** (12 res, 2 in II) |
| **9MTX** | 2025-11-19 | EM 3.06 | VHH 29E09 | **III + I** (11 + 8 res) |
| 1N8Z | 2003-02-18 | X-ray 2.52 | trastuzumab Fab | IV (lit.) |
| 1S78 | 2004-04-27 | X-ray 3.25 | pertuzumab Fab | II (lit.) |
| 3BE1, 3H3B, 3N85, 3WLW, 3WSQ, 5O4G, 6ATT, 6J71, 8VQD, 9T3R, 9T3S | 2008-2026 | X-ray/EM 2.45-3.77 | Fabs/scFvs (bH1, chA21, Fab37, MF3958, 39S, HuA21, TL1, EPS232, EPS226) | unverified |
| 6BGT, 7MN8, 8PWH, 8Q6J, 6OGE, 9QBF, 9QBG | 2018-2025 | X-ray/EM 2.7-4.36 | trastuzumab (+/- pertuzumab) | IV (+ II), lit. |
| 9L1S | 2025-01-01 | EM 3.0 | pertuzumab variant, HER2 S310F | II (lit.) |
| 8FFJ | 2023-02-22 | EM 7.5 | zanidatamab (biparatopic) | IV + II (lit.) |
| 8JYR, 8JYQ, 9IUT | 2024-2025 | X-ray 1.69-2.09 | H2Mab-119 / -214 / -250 | 8JYR: I (PDB title); others unverified |
| 3MZW, 4HRL/M/N, 5K33, 5KWG, 6LBX | 2010-2020 | X-ray 2.0-4.3 | affibody, DARPins, Fcabs, repebody | 6LBX: IV; 4HRM: I; rest unverified |
| 7MN5, 7MN6, 8HGO, 8HGP, 8U4K, 8U4L, 8VQE | 2021-2024 | EM 2.6-4.5 | no antibody (ligand-bound HER2 dimers) | n/a |

Findings:
- 9MTE/9MTX are the only 2025-2026-era VHH entries. Citation: Mol Cancer Ther 2026, DOI 10.1158/1535-7163.MCT-25-0654 ("TPP-45142, an anti-HER2 T-cell engager"). Deposited 2025-01-11/12, released 2025-11-19.
- 5MY6 (Clin Cancer Res 2017, 10.1158/1078-0432.CCR-17-0310) and 7QVK (PLoS One 2023, 10.1371/journal.pone.0288259) have domain I and I/II epitopes. 27A05/29E09 contact domains I and III together.
- **No public HER2 VHH has a domain IV epitope** (by my computation); domain IV is covered only by Fabs and a repebody.
- I did not search for HER2-VHH entries lacking a P04626 annotation, so "four" is a lower bound. No ERBB3/ERBB4-binding VHH entry was seen.

## 3. Template-difficulty ladder (forced analogy, Q3)
CDR3 taken between `YYC`/`YFC` and `WGQG`/`WGRG`; BLOSUM62 global alignment; identity = matches / longer length. Short CDR3s make this noisy, so differences below about 0.1 mean little.

| ONU clone (CDR3) | 5MY6 2Rs15d | 7QVK NM-02 | 27A05 | 47D05 | 29E09 | max full-VHH identity |
|---|---|---|---|---|---|---|
| ONU11 AARPLGSTWTEHPY | 0.14 | 0.35 | 0.07 | 0.36 | 0.14 | 0.69 (NM-02) |
| ONU13 AAKYGSSRLWDY | 0.33 | 0.29 | 0.17 | 0.31 | 0.25 | 0.71 (NM-02) |
| ONU23 AADGRFYSDYVWSSPDEYAY | 0.10 | 0.30 | 0.05 | 0.20 | 0.10 | 0.68 (NM-02) |

ONU sequences are from sepiq.uk/detail. Between ONU clones: CDR3 identity 0.43 (11/13), 0.25 (11/23), 0.25 (13/23); full-VHH 0.72-0.75. Among public VHHs, **27A05 and 29E09 are siblings**: CDR3 0.71, full-VHH 0.85, computed epitopes overlap with Jaccard 0.75 (18 of 24 residues). This is direct evidence of convergent clones hitting one epitope (the Q4 hazard).

Verdict (CASP-style): by CDR3 and full-VHH identity, no public entry is an unfair template for any ONU clone (max CDR3 0.36, max full 0.71, all in the "FM-like" regime). All four are a fair prior. Caveat: this is only the sequence half of CASP's difficulty measure; epitope-neighbourhood identity cannot be computed because ONU structures are unreleased. If an ONU clone were a lineage sibling of 27A05/29E09 its epitope would likely be I+III and the prior would become unfair; the CDR3 numbers say none of the three is.

## 4. Clustering counts (Q2)
No published count of SAbDab-nano after CDR3 or antigen clustering was found. The only redundancy figure is 492 non-redundant CDR sets among 823 structures (exact-duplicate removal, about 40% reduction; Schneider 2022). Commands to compute:
```
# CDR3 clusters (FASTA of CDR3 only; repeat for 0.7 and 0.4)
mmseqs easy-cluster cdr3.fasta out tmp --min-seq-id 0.9 -c 0.8 --cov-mode 1
# antigen clusters
mmseqs easy-cluster antigen.fasta out_ag tmp --min-seq-id 0.7 -c 0.8 --cov-mode 0
# CD-HIT alternative for full VHH
cd-hit -i vhh.fasta -o vhh80 -c 0.8 -n 5
```
Expected order of magnitude (my estimate, unpublished): from roughly 1,000 nanobody entries, CDR3 clusters at 90% leave several hundred, at 70% a few hundred, at 40% roughly 200-300; antigen clusters at 70% leave a few hundred antigens dominated by SARS-CoV-2 RBD, lysozyme, GFP, EGFR/HER2 and GPCR/transporter scaffolds. AbEpiTope (Sci Adv 2025) shows a published precedent for antibody/antigen redundancy handling: MMseqs2 99% representatives (to 1,932 complexes), then graph partitioning so no group shares more than 65% antigen or 95% light/heavy identity (final 1,733 complexes).

## 5. Tools and benchmarks: HER2 content, cut-offs, licences (Q3, queen extra)
| Tool | Training cut-off | HER2 / HER2-VHH inside? | Licence (competition use) |
|---|---|---|---|
| AlphaFold 3 | PDB before 2021-09-30 (cut-off per Boltz-1 text and AbEpiTope) | yes for 1N8Z, 1S78, 3BE1, 3N85, 3WLW, 3WSQ, 5MY6 (all released before the cut-off); 7QVK, 9MTE, 9MTX outside | code CC-BY-NC-SA 4.0, weights by application, academic/non-commercial (search summaries); permitted rules say AF3 is fine, read the terms |
| Boltz-2 | PDB released before 2023-06-01 (Boltz-2 paper) | 5MY6 and 7QVK (2023-02-01) inside; 9MTE/9MTX outside | MIT, code and weights (README) |
| Chai-1 | not stated in README (recollection 2021-01-12: unverified) | 5MY6 likely inside | Apache 2.0 code and weights (README) |
| OpenFold3 | OpenBind-0 default weights: June 2025 cut-off (README) | 5MY6, 7QVK inside; 9MTE/9MTX outside if cut by release date; deposit date (2025-01) would put them inside, rule unverified | Apache 2.0 repo; weights licence not stated in README |
| DiscoTope-3.0 | 1,406 chains from BepiPred-3 set (582 crystal structures, 3 A or better), 50% clustering, external test 24 chains, at most 20% similarity to training | HER2-antibody complexes very probably in training (SAbDab-derived), per-ID unverified | web server free for academic use; GitHub says "Creative Commons licence" (variant not read) |
| BepiPred-3.0 | unverified | unverified | unverified |
| AbEpiTope-1.0 | 1,730 AbAg complexes, nested CV; "Before/After" split at AF-2.3 cut-off 2021-09-30 | HER2-trastuzumab almost certainly in "Before"; per-ID unverified | article CC BY-NC; software licence not read |
| AntiBinder | SAbDab-nano and AVIDa-SARS-CoV-2 (per BRIEF) | 5MY6 plausible; unverified | unverified |

Published residue-level PR-AUC numbers (sources opened):
| Benchmark / method | Metric | Value | Prevalence |
|---|---|---|---|
| DiscoTope-3.0 external test, predicted structures | AUC-PR | 0.232 +/- 0.02 (BepiPred-3.0 0.177) | about 6.4% (436/6,788; derived) |
| DiscoTope-3.0, solved structures | AUC-PR | 0.223 +/- 0.02 (SEMA 0.185) | same |
| AsEP epitope-ratio split (EpiFormer Table 1) | AUPRC | DiscoTope3 0.232, WALLE 0.278, EpiScan 0.409, MIPE 0.206, GraphBepi 0.156 | not stated |
| AsEP epitope-group split (EpiFormer Table 6) | AUPRC | DiscoTope3 0.220, WALLE 0.208, EpiScan 0.228, MIPE 0.137, GraphBepi 0.166 | not stated |
| Nanobody-specific residue PR-AUC | none found | AsEP covers conventional antibodies only | n/a |

EpiFormer table row labels were garbled in the PDF text extraction; method-to-row alignment is medium confidence (DiscoTope3 0.232 matches the DiscoTope paper's own value). A 2026 nanobody study (PMC13437531: 28 nanobody-antigen complexes, PDB after 2023-06-01, about 5.5% positives, AF3, Boltz-2, Chai-1, IntFold) reports PR-AUC only in supplementary figures; it is a template for a clean post-cut-off test but gives no residue-level numbers.

## 6. Inflation from random versus cluster splits (Q4, Q5)
| Study | Random / easy | Cluster / hard | Source |
|---|---|---|---|
| AsEP, WALLE | MCC 0.305, precision 0.308, recall 0.516, AUC-ROC 0.695, F1 0.357 | epitope-group: MCC **0.152**, precision 0.207, recall 0.299, AUC-ROC **0.596**, F1 0.204 | AsEP, NeurIPS 2024 D&B (arXiv 2407.18184), Table 1 |
| AsEP, EpiScan | AUPRC 0.409 | 0.228 | EpiFormer arXiv 2606.04154 |
| AsEP, WALLE | AUPRC 0.278 | 0.208 | same |
| Graphinity ddG (Hummer et al., Nat Comput Sci 2025, 5:635; preprint 2023) | Pearson up to 0.87 (random 10-fold) | average **63% drop** at 100% length-matched CDR cutoff; other methods 0.17-0.26 at 90% CDR | PMC12374841 |
| TCR-pMHC (non-antibody datapoint) | AUROC 0.871 | 0.782 epitope-held-out | search snippet, arXiv 2604.13254; unverified |

Epitope-group splits halve MCC and cut AUPRC by roughly 10-45% relative for models that memorise sites; antibody-agnostic DiscoTope-3 loses little (0.232 to 0.220) because it never conditions on the antibody. AsEP authors say WALLE "is likely biased toward the epitopes in the training set". Graphinity authors: "to prevent information leakage, effective sequence identity cutoffs between train and test datasets are essential". Dunbar 2014, Ruffolo 2023, the Harmalkar papers and the Schneider docking benchmark were not read; I make no claim about them.

## 7. Split and exclusion protocol (Q4, Q6)
1. Pull the structure list from SAbDab(-nano) and state the release date (SAbDab2 versioned splits, Zenodo 20083995, are a documented baseline). Restrict to PDB release date on or before 2025-10-31, or exclude 9MTE/9MTX explicitly.
2. Cluster VHHs on CDR3 (MMseqs2 at 90/70/40%, coverage 0.8) and on full VHH (80%); union-merge clusters that share either; a merged cluster stays in one fold.
3. Cluster antigens (70%; Frontiers 2019 used 90% antibody / 70% antigen with merging, AbEpiTope 65% antigen / 95% chain) and epitope bins (epitope-residue Jaccard above 0.5 on aligned antigen). Hold out whole epitope bins so a domain-I sibling cannot be in training.
4. HER2 ablation, report all three: (a) exclude every P04626 entry (63) plus ERBB3/ERBB4 and EGFR homologues above 40% antigen identity; (b) HER2 non-VHH only; (c) all public. The (a) to (c) gap is the leakage estimate. Rules say leakage is acceptable "as long as the answer is correct", but it must be documented.
5. Write down: database and release date, PDB cut-off, tool/weights versions and licences, clustering commands and thresholds, the exclusion PDB-ID list, AVIDa-hHER2 label thresholds, seeds. SAbDab-nano is CC BY 4.0 (Schneider 2022). Licences of SAbDab2, OAS and PLAbDab: not verified (the SAbDab2 blog states none; OAS and PLAbDab not opened).

## Forced analogy: CASP target selection
(a) CASP is credible because targets are blind and template difficulty is measured (FM/TBM categories by template identity). ONU11/13/23 are the CASP targets; the four public HER2 VHHs are the templates.
(b) Testable idea: rank every training VHH by the ladder distance to the ONU clones and validate on held-out HER2 siblings built from the same ladder (hold out 27A05 with 29E09 in training = "TBM-easy"; hold out 5MY6 with nothing similar = "FM-like"). Select the model by PR-AUC on the FM-like bin, not the pooled value, because ONU clones sit in the FM-like regime. Extra check: use Boltz-2/OpenFold3 predictions on 9MTE/9MTX (post cut-off for Boltz-2) as a pseudo-blind test of residue PR-AUC.
(c) Verdict: partially holds. It holds for sequence-level difficulty. It breaks because CASP organisers compute difficulty with the target structure in hand; here the epitope-neighbourhood half is unobservable until the structures are released (results 2026-12-15).

## Gotchas
- **Deposit vs release date.** 9MTE/9MTX were deposited 2025-01-11 and released 2025-11-19; a deposit-date cut-off puts them inside OpenFold3's June 2025 cut-off, a release-date cut-off outside. Check each tool's rule.
- **Same-lineage siblings exist in the PDB.** 27A05/29E09 (CDR3 0.71, epitope Jaccard 0.75) would be split across train/test by a random split and score as "generalisation".
- AsEP is conventional antibodies only; its numbers do not transfer to VHH. EpiFormer table alignment is medium confidence.
- AUC-ROC 0.596 vs 0.695 understates the loss; at 6-13% prevalence PR-AUC is dominated by a few residues, and the challenge macro-averages over just 3 complexes, so variance is large.
- Antibody-agnostic predictors score "where do antibodies usually bind HER2"; trastuzumab/pertuzumab dominate that signal and point at domains IV and II, while public VHHs sit on I, I/II, III+I.
- Domain assignments and residue counts are mine (4.5 A cut-off; boundaries approximated); other cut-offs shift the counts.
- SAbDab2 replaced the SAbDab-nano URL; old scripts will 404 or receive an SPA shell.
- Boltz-2 README gives no cut-off; 2023-06-01 comes from the paper.

## Implications for the challenge
1. Treat 5MY6, 7QVK, 9MTE, 9MTX as fair priors; document them and run the (a)/(b)/(c) HER2 ablation on a proxy.
2. Validate by CDR3-cluster plus epitope-bin folds, never random; expect PR-AUC roughly 10-45% below a random-split estimate.
3. Blend epitope priors: public VHH priors (domains I, I/II, III+I) with Fab priors (II, IV), with calibrated weights, not a trastuzumab-dominated prior.
4. Run Boltz-2, OpenFold3 and Chai-1 on the 9MTE/9MTX/7QVK VHH-HER2 pairs and score residue PR-AUC against the deposited structures per tool before trusting an ensemble (AF3 and Boltz-2 never saw 9MTE/9MTX).
5. Write the inclusion/exclusion PDB-ID list, cut-off dates, MMseqs2 commands and tool licences into the submission documentation.

## Open questions
- 2026 SAbDab-nano counts (VHH complexes, unique antigens, resolution histogram) not retrieved.
- Exact training ID lists for DiscoTope-3, BepiPred-3, AbEpiTope, AntiBinder.
- Chai-1 and BepiPred-3 cut-offs; BepiPred-3, AntiBinder, AbEpiTope software, OAS, PLAbDab and SAbDab2 licences; OpenFold3 weights licence.
- Epitope domains of the unverified Fab/scaffold complexes; HER2-VHH entries lacking a P04626 annotation.
- Dunbar 2014, Ruffolo 2023, Harmalkar, Schneider docking benchmark claims on random-vs-cluster inflation.

## Sources (opened)
- https://doi.org/10.1093/nar/gkab1050 (via https://academic.oup.com/nar/article/50/D1/D1368/6431822), Schneider 2022 SAbDab-nano
- RCSB Search and GraphQL APIs (https://search.rcsb.org/, https://data.rcsb.org/graphql), queried 2026-10-17; coordinates from https://files.rcsb.org/download/ (5MY6, 9MTE, 9MTX, 7QVK)
- https://www.blopig.com/blog/2026/06/sabdab2-the-structural-antibody-database-in-the-age-of-machine-learning/ ; https://sabdab.opig.stats.ox.ac.uk/about and /nano (JS shell, no content)
- https://arxiv.org/abs/2407.18184 and PDF (AsEP); https://arxiv.org/pdf/2606.04154 (EpiFormer)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10882062/ (DiscoTope-3.0); https://github.com/Magnushhoie/discotope3_web
- https://backend.orbit.dtu.dk/ws/files/415546860/sciadv.adu1823_1_.pdf (AbEpiTope-1.0)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12374841/ (Graphinity, Hummer et al.)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13437531/ (open-source folding models, nanobody binding)
- https://jeremywohlwend.com/assets/boltz2.pdf ; https://raw.githubusercontent.com/jwohlwend/boltz/main/README.md
- https://raw.githubusercontent.com/aqlaboratory/openfold-3/main/README.md ; https://raw.githubusercontent.com/chaidiscovery/chai-lab/main/README.md
- https://sepiq.uk/detail (ONU sequences)
- Search snippets only (not opened in full): AntiBinder (Briefings Bioinform 26(1) 2025), AF3 licence summaries, TCR-pMHC arXiv 2604.13254, Frontiers Immunol 2019 clustering note
