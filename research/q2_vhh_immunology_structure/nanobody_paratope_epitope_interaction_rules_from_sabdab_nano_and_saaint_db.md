---
title: Nanobody paratope/epitope rule sheet, SAbDab-nano/SAAINT-DB, leakage audit and a scored "damage-map" prior
queen: q2_vhh_immunology_structure
king: king_world
worker: nanobody_paratope_epitope_interaction_rules_from_sabdab_nano_and_saaint_db
tier: expert
tags: [paratope, epitope, SAbDab-nano, SAAINT-DB, HER2, 8GZ5, leakage-audit, PR-AUC, art-conservation-analogy]
confidence: medium
challenge_relevance: 4
serendipity: Art-conservation "restore the original from degraded traces" built as a hand-set CDR3/Tyr-Trp/FR37-44-47 prior; passes on 17 VHH complexes overall (+0.40 PR-AUC) but only +0.17 to +0.33 on the 5 HER2 VHHs, whose paratopes are framework-heavy (36-69% FR), so the "painting" is atypical exactly where we are tested.
date: 2026-10-17
---

# Nanobody paratope/epitope rules, database audit, and a scored restoration prior

## TL;DR
Typical VHH paratopes are CDR3-centred (about 46% of contacts) with a framework tail. A trivial hand-set "damage map" beats the prevalence baseline by about +0.40 PR-AUC on 17 VHH complexes (I computed this). On the 5 public HER2 VHH structures (5MY6, 7QVK, 9MTX, 9MTE x2) it still beats prevalence (+0.17 to +0.33), but absolute PR-AUC falls to about 0.40 because those paratopes lean on framework and CDR1/2, not CDR3. Verdict on the art-conservation analogy: PASS, with a loud caveat about HER2. No public VHH entity has a CDR3 within 70% identity of ONU11/13/23, so there is no leakage to exploit, but four public anti-HER2 VHH PDB entries exist (5MY6, 7QVK, 9MTE, 9MTX) and are usable as priors.

## 1. Quantitative paratope rules (Q1)
Sources actually opened: Mitchell and Colwell 2018 (PMC6277174; 156 Nb vs 156 Ab complexes, <=4.0 Å; doi 10.1093/protein/gzy017) and the Zavrtanik Data in Brief 2019 (123 non-redundant crystal structures <=3 Å). Zavrtanik 2018 itself: abstract only via search. Wilton 2018 not opened; nothing from it is quoted.

| Statistic (VHH) | Value | Source / status |
|---|---|---|
| H3 share of VHH antigen-contacting residues | 1353 residues = 46% (Ab VH: 38%) | Mitchell&Colwell, verified |
| Share of pairwise contacts involving H3 | 54.3% (Ab VH 44.3%) | same |
| H3 in paratope | all VHH structures | same |
| H3 contact density | 2.009 (VH 1.503) | same |
| H1 / H2 contact density | 0.825 / 1.057 (VH 0.843 / 1.212) | same |
| VHH using all three loops H1-3 | 16% (Ab VH 53%); one or two loops 30% (VH 10%) | same |
| IMGT position 29 contacting antigen | 37/156 VHH vs 5/156 Ab | same |
| FR positions with higher contact propensity in VHH | 37, 44, 45, 47, 117 (also 1, 2, 61, 62, but conserved) | same |
| Paratope buried area (dASA) | 768.5 +/- 201.0 Å² (VH 547.8; VHVL 833.8) | same |
| Total pairwise contacts | 8713 (VHH set) | same |
| Tyr share of paratope pair contacts | 14.9% VHH vs 23.6% Ab | same |
| Arg share (VHH) | 10.2% | same |
| H2 composition (VHH) | Ser 18%, Thr 15% most frequent contacts | same |
| Conservation vs contact propensity | R = -0.903 (Nb), -0.651 (Ab) | same |
| Shape complementarity | 0.72 +/- 0.07 (Nb) | same |
| Zavrtanik 2018 (qualitative) | paratopes aromatic and more hydrophobic than conventional; framework contacts in four regions, mostly charged; fewer contacts than Ab | abstract via search; numeric concave fraction UNVERIFIED |

Trp and Asn: no percentages in the text I opened (per-position probabilities are in figures/supplements). Correction to the brief: the Zavrtanik J Mol Biol DOI is 10.1016/j.jmb.2018.09.002, NOT 10.1016/j.jmb.2018.07.022; Data in Brief 2019 is doi 10.1016/j.dib.2019.103754 (PMC6441729).

My own counts (4.5 Å heavy-atom, Section 6) over 17 VHH-antigen pairs: paratope = 17.9 residues on average (range 10-29); CDR1/CDR2/CDR3/FR share = 0.15/0.16/0.46/0.23 (my heuristic region boundaries).

## 2. SAAINT-DB vs SAbDab-nano (Q2)
| | SAAINT-DB | SAbDab / SAbDab-nano |
|---|---|---|
| Paper | Huang et al, Acta Pharmacol Sin 2025 (nature.com s41401-025-01608-5; PMC12644554) | Schneider, Raybould, Deane, NAR 50:D1368 (2022), doi 10.1093/nar/gkab1050 |
| Entries | 19,128 data entries from 9,757 PDB entries (update 2025-05-01; preprint 18,031 / 9,373). GitHub README now reports v.20260827: 22,802 data entries, 11,695 PDB entries | SAbDab 18,744 entries / 9,521 PDB (2025-05-02). SAbDab-nano 1,585 structures (April 2024 snapshot), 1,972 (July 2025 snapshot), from search snippets of the statistics page |
| Nanobody (VHH) | "VHH type" = 3,283 entries (data entries, not PDB ids; VHH+/VHH- subtype counts not given) | see above |
| Redundancy clustering | not described in the paper text I opened; only a non-redundant affinity set (1,444 points vs 736 in SAbDab) | SAbDab-nano non-redundant count not found |
| Resolution | X-ray 64.2% (median 2.4 Å, range 0.92-8.0), EM 35.5% (median 3.3 Å) | not retrieved |
| Antigens | proteins, peptides, DNA, RNA only; no carbohydrates or haptens; 74.8% of entries are Ab-Ag; top species human, SARS-CoV-2, HIV-1, influenza A, P. falciparum | SAbDab includes haptens/carbohydrates |
| Download | https://github.com/tommyhuangthu/SAAINT (summary `saaintdb_<date>_all.tsv/xlsx`); structures at Zenodo doi 10.5281/zenodo.15335870 | https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab/nano/ |
| Overlap | 242 PDB entries absent from SAbDab; 6 SAbDab-only | |

Independent RCSB count (full-text "nanobody", "VHH", "single-domain antibody", "sybody", "camelid heavy chain antibody"): 4,619 entries returned; 1,117 VHH-like polymer entities in 1,044 entries by my sequence-motif regex (includes sybodies/synthetic; strict regex). Treat as order of magnitude.

## 3. Epitope rules (Q3)
| Item | Value | Status |
|---|---|---|
| Epitope size, 4.5 Å heavy-atom | 19.6 antigen residues mean (range 12-29), n=17 | computed |
| Buried SASA per side (Shrake-Rupley, complex vs separate) | 8GZ5 644 Å²; 5MY6 734; 7QVK 691 (paper: 637 VHH / 627 HER2); 9MTX 855; 9MTE-27A05 880; 9MTE-47D05 622 | computed (+paper for 7QVK) |
| 8GZ5 antigen epitope | 15/195 at 4.5 Å, 25/195 at 6 Å (195 of 206 resolved). BRIEF's 26/206 = 0.126 is roughly the 6 Å level or a Voronota any-contact label, not 4.5 Å | computed |
| Zavrtanik concave-epitope fraction | not found numerically; qualitatively VHH epitopes are more rigid, concave, conserved, structured, aromatic-rich | UNVERIFIED number |
| Glycans | 8GZ5 chain C is NAG-NAG-FUC on the RBD N343 site; epitope counts change if glycan atoms are included. No quantitative glycan-effect literature found | partial |

Trivial epitope baselines, computed by me on antigen chains only (per-residue average precision):

| complex | n_epi | prevalence | rel. SASA | Kyte-Doolittle | SASA + 0.05 KD |
|---|---|---|---|---|---|
| 8GZ5/B | 15 | 0.077 | 0.105 | 0.097 | 0.118 |
| 5MY6/B | 18 | 0.032 | 0.083 | 0.027 | 0.060 |
| 7QVK/BBB | 18 | 0.036 | 0.051 | 0.032 | 0.052 |
| 9MTX/A | 19 | 0.048 | 0.100 | 0.038 | 0.098 |
| 9MTE/A | 23 | 0.051 | 0.102 | 0.042 | 0.088 |
| 9MTE/B | 14 | 0.031 | 0.121 | 0.032 | 0.063 |
| 4KRL/B | 12 | 0.059 | 0.231 | 0.059 | 0.240 |
| 4KRO/B | 21 | 0.037 | 0.079 | 0.030 | 0.048 |
| 7OM4/B | 19 | 0.031 | 0.060 | 0.043 | 0.064 |
| 7AR0/B | 16 | 0.045 | 0.104 | 0.056 | 0.174 |
| 1RJC/A | 19 | 0.147 | 0.271 | 0.116 | 0.222 |
| 6ZBP/FFF | 16 | 0.082 | 0.196 | 0.090 | 0.169 |
| 6RTW/B | 22 | 0.079 | 0.206 | 0.068 | 0.160 |
| 7Z1D/FFF | 15 | 0.077 | 0.114 | 0.098 | 0.137 |
| 8E0E/B | 29 | 0.090 | 0.120 | 0.080 | 0.113 |
| 6OBC/B | 29 | 0.112 | 0.172 | 0.079 | 0.127 |
| 5C2U/B | 29 | 0.250 | 0.351 | 0.280 | 0.409 |

Means over 17: prevalence 0.076, SASA AP 0.145, hydrophobicity AP 0.075 (no better than prevalence), combo 0.138. A plain SASA predictor gives about 2x prevalence (~+0.07) at absolute values ~0.1. HER2 ECD (~630 residues) epitope prevalence will be about 3-5% at 4.5 Å.

Published benchmarks (search snippets, not full texts; different test sets, not comparable):

| Method | AUC-PR | Setting |
|---|---|---|
| DiscoTope-3.0 | 0.232 +/- 0.02 (AlphaFold structures); 0.223 +/- 0.018 (solved) | 24 external antigen chains; bioRxiv 2023.02.05.527174 |
| ScanNet | 0.127 / 0.157 in text (figure legend 0.143) | same |
| BepiPred-3.0 | 0.177 +/- 0.02 | same benchmark, later version |
| SEMA | 0.185 +/- 0.02 | same |
| Epitope3D-derived set | BepiPred-3 0.20, DiscoTope-3 0.19, GraphBepi 0.24, EpiGraph 0.23 | third party (Sci Rep s41598-024-78506-z snippet) |
| Review table | DiscoTope 2.0 0.07, BepiPred 3.0 0.16, DiscoTope 3.0 0.20, ISPIPab 0.23 | MDPI Biomolecules 14:983 snippet |

EpiPred and SEMA 2.0 own PR-AUC values: not found. These methods are antibody-agnostic; there is no VHH-specific epitope baseline; the ceiling for antibody-unaware methods is about 0.2.

## 4. Paratope predictors (Q4)
| Predictor | Input | PR-AUC | Test set |
|---|---|---|---|
| Parapred | sequence (CDR + flank) | 0.646 (PECAN split); 0.652 (MIPE) | conventional Ab |
| Paragraph | structure (graph) | 0.696 (PECAN); 0.725 expanded; 0.650 (MIPE); framework-region run 0.429 PR / 0.768 ROC (ParaSurf paper) | conventional Ab |
| PECAN | structure | below Paragraph's 0.696 | conventional Ab |
| ParaAntiProt | sequence (language models) | 0.665 PR-AUC, 0.912 ROC-AUC on its nanobody dataset (snippet ambiguous: 0.731 may be a structure-based competitor) | nanobody |
| NanoBERTa-ASP | sequence (RoBERTa) | PR-AUC only in figures; text: AUC 0.952/precision 0.778 (mixed training), 0.947/0.766 (pure nanobody), 10-fold CV; 1,070 labelled nanobody sequences; labels = residues within 4.5 Å in SAbDab at <=3.0 Å | nanobody |
| NbBench paratope task | sequence LMs | AUROC best 0.939 (AntiBERTa2-CSSP); AUPRC not extracted; 851/139/240 split | antibody mix |
| ParaSurf, AbNatiV | surface / nativeness | no VHH-only PR-AUC found | |

Best sequence-only VHH paratope PR-AUC I could verify: ParaAntiProt 0.665 (snippet only). NanoBERTa-ASP's PR-AUC was not extracted and may be higher. All use 4.5 Å heavy-atom labels; none uses Voronota-LT area labels.

## 5. Leakage audit (Q5)
Method (script `nanobody_leakage_audit.py.txt`): RCSB full-text gather (4,619 entries), GraphQL sequences; VHH regex; CDR3 = between Y[YF]C and W[GA].G; global Biopython alignment identity = score/max(len); UniProt partners P04626 (ERBB2), P00533 (EGFR), P21860 (ERBB3), Q15303 (ERBB4).

Results (RCSB, 2026-10-17):
- CDR3 identity >=70% to ONU11 (AARPLGSTWTEHPY), ONU13 (AAKYGSSRLWDY) or ONU23 (AADGRFYSDYVWSSPDEYAY) among 1,117 public VHH entities: ZERO hits for all three (so none >=90%). Best full-length identity: ONU11 0.748 (8CY9), ONU13 0.79 (6H16), ONU23 0.78 (4DKA); this is generic alpaca framework similarity, not clonal. Caveats: CDR3 extraction fails for atypical sequences; I used RCSB, not the SAbDab-nano/SAAINT files themselves (not downloaded).
- ERBB-family VHH complexes with UniProt tag: 5MY6 (HER2 2Rs15d); 4KRL, 4KRM (7D12-EGFR dIII); 4KRO (EgA1-EGFR); 4KRP (9G8-EGFR); 7OM4 (EgB4-EGFR-EGF); 8UKV (34E5-EGFRvIII). HER2 by title but untagged: 9MTE, 9MTX, 7QVK.
- 63 PDB entries reference P04626. Non-VHH HER2 binders (trastuzumab 1N8Z, pertuzumab 1S78, 3BE1, 3H3B, 3N85, 3WLW, 3WSQ, 5O4G, 6ATT, 6BGT, 6J71, 6OGE, 7MN8, 8FFJ, 8JYR, 8PWH, 8Q6J, 8VQD, 9L1S, 9T3R, 9T3S; DARPins 4HRL/M/N; Fcabs 5K33/5KWG; repebody 6LBX; affibody 3MZW) are out of scope.

Queen extra: every anti-HER2 nanobody with a PDB id that I found.

| Nanobody | PDB | HER2 region | Affinity | Source | Status |
|---|---|---|---|---|---|
| 2Rs15d | 5MY6 (X-ray 2.246 Å, released 2017-08-09) | domain not stated in what I opened; does not compete with trastuzumab/pertuzumab (snippet) | KD about 3.5-5.6 nM by labelling/cell line (patent, JNM, conference snippets) | Clin Cancer Res 2017, doi 10.1158/1078-0432.CCR-17-0310 | structure verified; domain UNVERIFIED; KD secondary |
| NM-02 (humanised variant K 212 pM) | 7QVK (X-ray 3.1 Å, 2023-02-01) | domains I and II; 21 epitope residues (K170, K200, R203, R217); 16 paratope residues mostly CDR3 | about 200 pM (SPR); EC50 1.2 nM | PLoS One 2023, doi 10.1371/journal.pone.0288259 | verified from paper page |
| 27A05 (+ helper 47D05) | 9MTE (cryo-EM 2.66 Å, 2025-11-19) | 18 HER2 residues within 4 Å, 15 shared with 29E09; domain not assigned in text | "low nanomolar", exact in Table S3 (not opened) | Mol Cancer Ther 2026;25(4):541, doi 10.1158/1535-7163.MCT-25-0654 (TPP-45142) | domain/KD UNVERIFIED |
| 29E09 | 9MTX (cryo-EM 3.06 Å; text also says 3.01) | 19 residues within 4 Å; competes with 27A05, not with trastuzumab/pertuzumab | low nM | same | same |

Other anti-HER2 nanobodies (e.g. 5F7) have no PDB id found: unverifiable here. 27A05 and 29E09 share a CDR3 stem (WDVNGDI vs RDVNGDY) and bin together, defining one HER2 hot spot. The ONU sequences (sepiq.uk/detail, retrieved today) have conventional alpaca framework with RTLS/ERTF-type CDR1 and are a different lineage from these human-like-J clones.

## 6. Proxy complex 8GZ5 and VHH-side calibration (Q6)
8GZ5 (RCSB opened): 1.70 Å X-ray; chain A SARS-CoV-2 Alpha RBD, 206 residues (195 resolved); chain B VHH P17, 126 residues with His tag (123 modelled); chain C N-glycan; primary doi 10.1093/jb/mvac096.

| cutoff (heavy atom, protein only) | VHH paratope residues | fraction of 123 | antigen epitope residues of 195 |
|---|---|---|---|
| 3.5 Å | 14 | 0.114 | 10 |
| 4.0 | 15 | 0.122 | 15 |
| 4.5 | 19 | 0.154 | 15 |
| 5.0 | 20 | 0.163 | 18 |
| 6.0 | 23 | 0.187 | 25 |
| 7.0 | 35 | 0.285 | 32 |

Calibration: chain-B prevalence for 8GZ5 is about 0.12-0.19 (0.154 at 4.5 Å; 23/123 = 0.187 at 6 Å, where the antigen side matches the BRIEF's 26/206). Across the 17 complexes VHH-side prevalence is 0.149 (0.080-0.240) and antigen side 0.076. VHH-side random PR-AUC is ~0.15; antigen side ~0.08-0.13. I did not run Voronota-LT (not installed), so the area-weighted label shift is unmeasured.

## Forced analogy: art conservation
(a) Analogy: each public structure is a degraded trace (one noisy snapshot; labels depend on cutoff, resolution and crystal packing); the true interface is the original. A conservator uses a stylistic prior to in-paint. Prior used: per-residue score = region base (CDR3 0.50, CDR2 0.20, CDR1 0.18, FR 0.03) x CDR3 apex bonus (0.6 to 1.0) x residue weight (Y 1.7, W 1.6, R 1.3, F 1.2, S/N 1.15, D 1.1, T/G/H 1.0, A/E/K/P 0.8, L/I 0.7, V 0.6), with floors of 0.25 at IMGT 29 and 0.22 at IMGT 37/44/45/47. Anchors found by motif (C23, W41, C104, W118), not ANARCI. Weights were set from the Section 1 statistics before scoring and not tuned afterwards (only parsing bugs were fixed); they are literature-informed, not blind.

(b) Scores (4.5 Å heavy-atom labels, VHH chain, sklearn average precision vs prevalence):

| complex/chain | VHH len | paratope n | prevalence | PR-AUC | delta | ROC-AUC | CDR1/2/3/FR share |
|---|---|---|---|---|---|---|---|
| 8GZ5/B | 123 | 19 | 0.154 | 0.516 | +0.362 | 0.86 | 0.26/0.16/0.37/0.21 |
| 5MY6/B | 115 | 22 | 0.191 | 0.384 | +0.192 | 0.68 | 0.14/0.18/0.18/0.50 |
| 7QVK/BBB | 121 | 13 | 0.107 | 0.297 | +0.190 | 0.60 | 0.08/0.00/0.23/0.69 |
| 9MTX/A | 110 | 23 | 0.209 | 0.543 | +0.333 | 0.83 | 0.17/0.22/0.22/0.39 |
| 9MTE/A | 109 | 19 | 0.174 | 0.509 | +0.335 | 0.79 | 0.16/0.16/0.21/0.47 |
| 9MTE/B | 117 | 14 | 0.120 | 0.293 | +0.173 | 0.71 | 0.36/0.07/0.21/0.36 |
| 4KRL/B | 122 | 18 | 0.148 | 0.572 | +0.424 | 0.86 | 0.22/0.06/0.56/0.17 |
| 4KRO/B | 116 | 17 | 0.147 | 0.715 | +0.569 | 0.87 | 0.12/0.00/0.76/0.12 |
| 7OM4/B | 130 | 17 | 0.131 | 0.750 | +0.620 | 0.96 | 0.00/0.35/0.65/0.00 |
| 7AR0/B | 125 | 10 | 0.080 | 0.609 | +0.529 | 0.94 | 0.10/0.10/0.80/0.00 |
| 1RJC/A | 123 | 22 | 0.179 | 0.564 | +0.385 | 0.81 | 0.00/0.36/0.32/0.32 |
| 6ZBP/FFF | 128 | 13 | 0.102 | 0.461 | +0.360 | 0.91 | 0.15/0.23/0.62/0.00 |
| 6RTW/B | 124 | 17 | 0.137 | 0.788 | +0.651 | 0.93 | 0.29/0.00/0.59/0.12 |
| 7Z1D/FFF | 128 | 13 | 0.102 | 0.358 | +0.257 | 0.90 | 0.15/0.23/0.62/0.00 |
| 8E0E/B | 121 | 29 | 0.240 | 0.520 | +0.281 | 0.80 | 0.07/0.38/0.24/0.31 |
| 6OBC/B | 119 | 20 | 0.168 | 0.688 | +0.520 | 0.86 | 0.15/0.15/0.50/0.20 |
| 5C2U/B | 124 | 18 | 0.145 | 0.727 | +0.582 | 0.95 | 0.17/0.11/0.72/0.00 |

Summary: n=17 VHH-antigen pairs (8GZ5 + 16 others; 4KRP dropped because anchor parsing failed). Mean PR-AUC 0.547 vs mean prevalence 0.149 = +0.398; every pair beats prevalence by more than 0.05 (minimum +0.173). 8GZ5: 0.516 vs 0.154. HER2 subset (5MY6, 7QVK, 9MTX, 9MTE-A, 9MTE-B): mean 0.405 vs 0.160 = +0.245; the other 12: 0.606 vs 0.144 = +0.46. Complexes were chosen by me (HER2/ERBB picks plus 8 random single-VHH X-ray <=2.3 Å entries, seed 7); 6ZBP and 7Z1D are both RBD VHHs (partial duplication).

(c) Verdict: PASS. Delta exceeds the 0.05 kill threshold on all 17 and on 5/5 HER2 VHHs. Where it strains: HER2 paratopes have 36-69% framework share and only 21-23% CDR3 (7QVK, 9MTX, 9MTE) versus 46% average, so ROC-AUC drops to 0.60-0.83; crude CDR boundaries may over-assign residues to FR (needs ANARCI to confirm). The ONU clones have long CDR3s (14, 12, 20 residues), so the real test may resemble 8GZ5 more than 7QVK; unknown.

Testable ideas: (1) use the prior as the chain-B feature/blend (prevalence ~0.15; priors alone give ~0.4-0.55, so a learned model must beat about 0.5 to add value); (2) modulate CDR3 weight by clone CDR3 length; (3) the antigen side has no trivial win (SASA AP 0.145 vs prevalence 0.076), so spend model capacity there with Boltz/AF3 structures and the 4 HER2-VHH PDBs as templates.

## Gotchas / what could fool us
1. Label definition changes prevalence about 2x: the 8GZ5 antigen epitope is 15 residues at 4.5 Å but ~25 at 6 Å; BRIEF's 26/206 is not reproducible at 4.5 Å. Compare PR-AUC only at fixed labels; official Voronota-LT area labels differ again.
2. Denominator: 206 (sequence) vs 195 (resolved) in 8GZ5; omitted residues score 0 in the SEPIQ CSV.
3. Motif-based CDR boundaries misassign CDR2/FR residues; HER2 FR shares of 36-69% may partly be this.
4. Redundancy: many VHH complexes share antigens (RBD, GFP, lysozyme, EGFR); SAAINT-DB describes no VHH-level clustering, so random-split PR-AUC is inflated.
5. Low-resolution cryo-EM (7QVK 3.1 Å X-ray, 9MTX 3.06 Å) is the right analogue for ONU's ~3.0 Å truth, not 1.5 Å crystals.
6. Count drift: SAAINT 19,128 (paper) vs 22,802 (GitHub now); SAbDab-nano 1,585 (2024) vs 1,972 (2025). Cite snapshot dates.
7. Citation hazards: the brief's Zavrtanik DOI is wrong; NanoBERTa-ASP text reports AUC/precision, not PR-AUC; ParaAntiProt 0.665 vs 0.731 attribution is ambiguous.
8. Public HER2 VHH structures (5MY6, 7QVK, 9MTE, 9MTX) are legitimate Track-A inputs and cover HER2 domains I/II; ONU epitopes may overlap them.

## Implications for the challenge
1. Use the damage-map prior for chain B: ~0.4-0.55 PR-AUC vs ~0.15 prevalence; blend, do not replace it.
2. Chain A (HER2) decides the score: SASA/hydrophobicity sit at ~2x prevalence, DiscoTope/BepiPred-class ~0.2 AP.
3. Seed the antigen side with HER2 epitopes from 5MY6/7QVK (domains I/II; K170, K200, R203, R217) and 9MTE/9MTX (shared hot spot), mapped to P04626 numbering; test whether a union prior beats SASA.
4. Reproduce 26/206 on 8GZ5 with Voronota-LT to fix the contact definition before training or evaluating.
5. Up-weight FR 29/37/44/45/47 as in Mitchell&Colwell, but let CDR3 length modulate it.
6. Evaluate with antigen-clustered splits and macro per-complex PR-AUC.

## Open questions
- Zavrtanik 2018 exact concave-epitope and framework numbers (supplements mmc2-4).
- NanoBERTa-ASP / ParaAntiProt exact VHH PR-AUC (figures).
- HER2 domain of 2Rs15d in 5MY6; 27A05/29E09 KDs (Table S3).
- Voronota-LT label prevalence on 8GZ5 and the HER2 structures.
- SAAINT-DB per-PDB VHH counts and any clustering (needs the GitHub TSV).

## Sources
Opened: https://www.rcsb.org/structure/8GZ5 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC12644554/ ; https://github.com/tommyhuangthu/SAAINT ; https://pmc.ncbi.nlm.nih.gov/articles/PMC6277174/ (doi 10.1093/protein/gzy017) ; https://pmc.ncbi.nlm.nih.gov/articles/PMC6441729 (doi 10.1016/j.dib.2019.103754) ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10956323/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC13044525/ ; https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0288259 ; https://sepiq.uk/detail ; RCSB Search/Data APIs (https://search.rcsb.org, https://data.rcsb.org/graphql, https://files.rcsb.org/download/ID.cif), 2026-10-17.
Search-snippet only (medium/low confidence): Zavrtanik 2018 doi 10.1016/j.jmb.2018.09.002; Paragraph doi 10.1093/bioinformatics/btac732; ParaSurf doi 10.1093/bioinformatics/btaf062; ParaAntiProt Sci Rep s41598-024-80940-y; NbBench doi 10.1088/2632-2153/ae20ec; DiscoTope-3.0 bioRxiv 2023.02.05.527174; BepiPred-3.0 doi 10.1002/pro.4497; SAbDab-nano pages at opig.stats.ox.ac.uk; Biomolecules 14:983; Sci Rep s41598-024-78506-z; 2Rs15d affinities from patent/JNM/conference snippets.
Code beside this file: nanobody_paratope_prior_score.py.txt, nanobody_leakage_audit.py.txt; table JSON has the same name with .json.
