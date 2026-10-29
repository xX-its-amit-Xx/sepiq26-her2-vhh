---
title: Paired coevolution (Potts/DCA) and contact inference from binder vs non-binder sequences
queen: q7_data_representation_integration
king: king_infer
worker: paired_coevolution_potts_dca_and_contact_inference_from_binder_vs_nonbinder_sequences
tier: expert
tags: [DCA, Potts, plmDCA, EVcouplings, paratope, AVIDa-hHER2, binder-vs-nonbinder, identifiability, PR-AUC, negative-result]
confidence: medium
challenge_relevance: 2
serendipity: Score-following / DTW with one track held constant (a drone). It correctly predicted that only within-VHH couplings are identifiable. It did not rescue the signal. The drone-free "negative drone" control (NC panning libraries) added nothing.
date: 2026-10-17
---

## TL;DR
The antigen never varies, so DCA cannot see any VHH-HER2 coupling. Only VHH-VHH couplings are identifiable, and these mostly reflect germline and loop geometry. On the real AVIDa-hHER2 table (7,316 binders, 12,051 non-binders) and 5 HER2-VHH cryo-EM/X-ray chains, a pre-specified paratope score (KL shift + coupling strength) beats a CDR3-only prior (CDR-residue PR-AUC 0.509 vs 0.399). But a plain "how variable is this CDR column in the naive library" prior scores as well or better (0.562), and the pure binder-vs-non-binder coupling contrast does not beat CDR3-only. The claim that binder-vs-non-binder coevolution carries paratope signal is **killed**. The literal falsifier ("does not beat CDR3-only") was **not** triggered, which is why the controls matter.

## 1. Resource check and data (Q1)
- Check before compute: C: 65.5 GB free, D: 45.1 GB free, CPU 16 % (5 % before the later runs). Both thresholds passed.
- Reused the existing download in `C:\Temp\sepiq26\q7_clonotype\` (`AVIDa-hHER2.csv` 499 MB, `NGS_read_count_table.csv` 126 MB). No new download.
- 1,843,875 unique VHH. **Labelled: 7,316 `Yes` (binder), 12,051 `Not` (non-binder)**, 746 `noise`, 1,823,762 `non-sig.` The public text says "a few hundred" labelled sequences. The real count is about 19.4 k clones. This is a correction for the hive.
- Reads: pre-panning (Mother library 1st-B, 2nd-B, 2nd-C) 465,941. Post (Her2 37C 1st-B, Her2_C1/C2 2nd-B/C, excluding competition panels) 1,337,889. NC controls 1,400,758.
- Own anchor-based IMGT-like numbering: 1,772,357 of 1,843,875 sequences (96 %) numbered. ANARCI is not installed and needs HMMER, which is not available on this Windows box. **Not ANARCI**. CDR1 = 8 aa (mode, 85,415 clones), CDR2 = 8 (55,771) or 7 (28,595), CDR3 median 15.
- CDR3 length: binders mean 14.97 / mode 17 (n=7,292); non-binders mean 14.48 / mode 17 (n=11,938). The binder CDR3 is about 0.5 aa longer. This matters in Gotcha 2.

## 2. Literature (Q2, Q3)
| Work | What it shows | Relevance |
|---|---|---|
| Weigt, White, Szurmant, Hoch, Hwa, PNAS 106(1):67-72, 2009 (PMC2629192) | Message-passing DCA on more than 2,500 two-component signalling proteins gave spatially proximal inter-protein pairs | Founding inter-protein DCA. Needs thousands of paired homologs. |
| Ovchinnikov, Kamisetty, Baker, eLife 3:e02030, 2014 (PMC4034769, opened) | Pseudo-likelihood on the 50S subunit and 28 other bacterial complexes. Co-varying pairs are almost always in contact "provided that the number of aligned sequences is greater than the average length of the two proteins". Coupling above 1.5 is "nearly always" under 8 A. Paired alignments filtered to 90 % identity, positions with more than 75 % gaps removed | Gives the **Meff rule of thumb: N_aligned > L**. Needs real two-protein evolution. |
| Hopf et al. 2014 eLife (EVcomplex, arXiv 1405.0929; seen in a search snippet only, not opened) | Reported to work down to about 0.3 non-redundant sequences per residue with a quality score | Lower bound, unverified here. |
| EVcouplings, https://github.com/debbiemarkslab/EVcouplings (README opened) | Python framework around `plmc`, with an EVcomplex pipeline. The README states **no** N_eff/L guidance | Tool to use if a paired alignment existed. |
| Hopf et al., Bioinformatics 35(9):1582, 2019 | EVcouplings framework paper (details from a search listing) | Citation only. |
| Paratope-epitope sequence predictors (search snippets, not opened): Nanotope; NanoBERTa-ASP; Sci. Rep. 2024 antigen-agnostic LM model with nanobody ROC-AUC 0.912 and PR-AUC 0.665; arXiv 2106.00757 | **Paratope** from VHH sequence alone works, through structure and language-model priors rather than coevolution | The deep successors do not use DCA. They learn "which positions are usually paratope". |
| RBM on phage display (Di Gioia / Zamponi) | **Not found.** Three searches returned no such paper. I only found an RBM-on-SELEX paper (par.nsf.gov/servlets/purl/10402199, thrombin aptamers) and an RBM review (arXiv 2501.04387, not opened). Treat the attribution as **unverified** | The idea (an RBM or Potts model trained on one selection round) is sound. I cannot cite a paratope result from it. |
| Antibody-antigen DCA | No paper found that runs DCA across the antibody-antigen interface. Searches only returned general DCA text. I assert **no published positive result**, with low confidence because the search was thin | Consistent with the identifiability argument below. |

**Minimum Meff that gave useful contacts:** about N_aligned greater than L (Ovchinnikov 2014), reported down to about 0.3 per residue (Hopf 2014, unverified). Our fits had Meff/L (L = 40 sites) of **2.6** (binders), 25.4 (non-binders) and 17.9 (post-panning, enrichment-weighted). On count alone this is above the threshold. Those thresholds assume one conserved family under evolutionary constraint, which is not true here (see section 3).

## 3. Identifiability when the antigen is fixed (Q3)
| Coupling type | Identifiable? | Why |
|---|---|---|
| VHH(i) - HER2(j) epitope-paratope | **No** | HER2 residue j has one state in every sequence, so its column has zero variance. J(i,a; j,b) is only defined up to the field of site i. A Potts or logistic model gives no information about it. |
| VHH(i) - VHH(j) over all clones | Yes, but dominated by germline, FR/CDR geometry and CDR-length coding | These are not binding couplings. The `Not` model (largest Meff) gave the strongest couplings, and 9/20 of its top pairs were in contact (p = 0.0002). They were mostly CDR3 base-to-base hairpin pairs (CDR3 +k with -k). |
| VHH(i) - VHH(j) that differ between binders and non-binders (a difference of two Potts models, dJ = J_yes - J_not) | Yes in principle, as an effective epistasis on enrichment | It is the only candidate for paratope-correlated information. It includes indirect effects (display, expression, avidity, non-specific sticking). |
| Sequence -> label (logistic with pairwise terms) | Yes, equivalent to the contrast above | It gives a contrast, not a contact map. |
| A paratope residue as a "which positions matter for binding" ranking | Partly, from single-site shifts | This is not a coupling. It is a marginal difference. |

So the identifiable object is a **within-VHH, label-conditional contrast**. It does not tell which residue touches which epitope residue.

## 4. Single-site analysis (Q4)
Per-column conservation, entropy (H), KL(post||pre) read-weighted, and KL(Yes||Not) clone-level with 0.5 pseudocount are in the JSON. `position_table.json` is in `C:\Temp\sepiq26\q7_out\` for all 110+ columns.

Top columns by the pre-specified composite (z KL(post||pre) + z top-5 APC coupling of the post-panning fit):

| Rank | Column | KL post/pre | KL yes/no | contact in n structures (of those where column exists) |
|---|---|---|---|---|
| 1 | CDR3 +9 | 0.284 | 0.365 | 1/1 |
| 2 | CDR3 -8 | 0.281 | 0.412 | 0/1 |
| 3 | CDR3 +7 | 0.247 | 0.431 | 1/2 |
| 4 | CDR3 -7 | 0.312 | 0.497 | 0/1 |
| 5 | CDR3 +8 | 0.204 | 0.299 | 1/1 |
| 6 | CDR3 -6 | 0.206 | 0.372 | 0/2 |
| 7 | CDR3 -5 | 0.176 | 0.229 | 0/2 |
| 8 | CDR3 +6 | 0.139 | 0.233 | 2/2 |
| 9 | CDR2 -4 | 0.273 | 0.309 | none in structures |
| 10 | CDR3 +4 | 0.135 | 0.212 | 2/5 |
| 11 | FR2 +11 (IMGT ~52) | 0.163 | 0.270 | 3/5 |
| 12 | CDR3 +5 | 0.109 | 0.162 | 2/3 |
| 13 | CDR1 +2 | 0.191 | 0.273 | 1/5 |
| 14 | CDR2 +3 | 0.128 | 0.179 | 3/5 |

Column definition: for each CDR, `+k` is the k-th residue from the N-terminal end and `-k` from the C-terminal end (symmetric split). FR2 +k is the offset from the conserved Trp. The top ranks are long-CDR3 middle columns with occupancy of only 0.33-0.68. They are covered by one or two structures, so they are **not reliable**.

Overlap with known paratope (heavy atoms within 4 A of HER2): across the 5 chains, FR2 +1, +8, +9, +11, +14 and FR4 0 (Trp) touch HER2 in 3/5 or more chains. CDR3 +3 to +5 touch in 3/5. CDR1 and CDR2 contacts vary by clone. Among the 22 CDR columns present in at least 4 structures, Spearman of contact frequency vs KL(post||pre) is 0.42, vs KL(yes||no) 0.45, and vs top-5 coupling (post) only 0.11. Conservation is anti-correlated (-0.63): variable columns touch more. This is the whole story (section 6).

## 5. Pairwise step (Q5)
Method: torch pseudo-likelihood Potts model (plmDCA-style), L2 (lambda_J = lambda_h = 0.01), L-BFGS, 40 sites (CDR1 +-1..4, CDR2 +-1..4, CDR3 +-1..9, FR2 offsets -1, 1, 8, 9, 11, 13), 21 states (20 aa + gap). Frobenius norm after gauge-centring, then APC. Sequence weights are 1/Cluster_size (the dataset's 93 % clusters). CPU, 4 threads.

| Model | N clones | Meff (sum 1/cluster) | split-half Spearman of couplings | top-20 pairs adjacent (C-beta < 8 A in at least half of the structures with both columns) | permutation p |
|---|---|---|---|---|---|
| Binders (Yes) | 7,291 | 104.4 | 0.69 | 4/20 | 0.20 |
| Non-binders (Not) | 11,932 | 1015.8 | 0.68 | 9/20 | 0.0002 |
| Post-panning top 30 k, enrichment-weighted | 29,788 | 715.0 | 0.76 | 5/20 | 0.07 |
| Contrast J_yes - J_not | n/a | n/a | n/a | 4/20 | 0.20 |
Baseline adjacency over the 614 candidate pairs (same-region sequence separation of at least 4 excluded) is 11.7 %. Coupling magnitudes are tiny (APC about 0.004-0.007). The top-20 lists for every model are in the JSON. Nothing in the binder-vs-non-binder lists is spatially special. The only significant list is the non-binder one, which is a structural-covariation effect, not an antigen effect.

## 6. Falsifiable experiment (Q6)
Setup: 5 VHH chains from 4 PDB entries (**5MY6** 2Rs15d; **7QVK** NM-02; **9MTE** two chains 27A05 and 47D05; **9MTX** 29E09). Contact = any heavy atom within 4 A of HER2 (not Voronota-LT; I did not compute it). Contact counts: 18, 13, 16, 13, 17 residues. **5MY7 is not HER2** (RCSB title: Neisseria adhesin complex protein). **7PH0 is not HER2** (AsLOV2). 6OGE is a Fab complex. SAbDab-nano was not queried; the structures come from RCSB.

PR-AUC, macro over the 5 chains, residue bootstrap B=2000 (95 % CI):
| Score | PR-AUC, CDR residues only | PR-AUC, all V-domain residues |
|---|---|---|
| base rate (random) | 0.28-0.42 per chain | 0.11-0.16 per chain |
| CDR3-only prior | 0.399 [0.312, 0.519] | 0.225 [0.171, 0.309] |
| CDR-only prior | 0.346 | 0.253 |
| LOCO empirical contact prior (other structures) | 0.435 | 0.448 |
| **Composite (KL post/pre + coupling), pre-specified** | **0.509 [0.417, 0.666]**, delta vs CDR3-only **[+0.019, +0.251]** | **0.434 [0.352, 0.547]**, delta **[+0.114, +0.310]** |
| KL(post||pre) | 0.478 | 0.439 |
| KL(yes||no) | 0.474 | 0.461 |
| top-5 coupling, post fit | 0.538 | 0.469 |
| top-5 coupling, non-binder fit | 0.538 | 0.490 |
| **top-5 coupling, contrast J_yes - J_not** | **0.408**, delta **[-0.065, +0.135]** | 0.340 |
| **Variability only (entropy of the naive library column)** | **0.562** | **0.494** |
| KL(NC panning vs naive), non-specific enrichment | 0.560 | 0.425 |
| KL(post vs NC) | 0.475 | 0.439 |

Chain-level view (resampling the 4 PDB entries): composite CDR PR-AUC 0.515 [0.455, 0.577], delta vs CDR3-only [+0.079, +0.169]. Per chain (CDR residues): composite 0.50 (5MY6), 0.56 (7QVK), 0.57 (27A05), 0.32 (47D05), 0.59 (9MTX); CDR3-only 0.43, 0.45, 0.48, 0.25, 0.39. The bootstrap only resamples residues or entries; with 4 independent structures the CI is optimistic.

Controls that decide the interpretation:
1. **Variability prior.** The naive library entropy ranks CDR residues as well or better (0.562) than any binder-derived score. Binder-derived scores are not better than it: KL(post||pre) minus variability = -0.07 [-0.17, +0.03]; coupling (post) -0.03 [-0.14, +0.08]; contrast coupling -0.15 [-0.27, -0.04] (all CDR-only).
2. **Label permutation null** for KL(yes||no), 300 shuffles: CDR-only macro PR-AUC 0.474 vs null mean 0.451 (95th percentile 0.526), p = 0.35. On all residues the real value is above the null (0.461 vs 0.283), but a shuffled label still concentrates its noise at variable columns, so this just reflects variability.
3. **NC control.** KL of the HER2-free NC pannings vs the naive library scores 0.560 on CDR residues, equal to KL post/pre. Its column ranking is uncorrelated with KL post/pre (Spearman 0.04), so non-specific selection and HER2 selection hit different columns, yet both score the same. The common factor is variability.
4. KL(post||pre) and KL(yes||no) correlate at 0.97 over CDR columns, as expected, because the labels are defined from the same pre/post counts. They are not independent evidence.

**Verdict.** The literal test passes (composite beats CDR3-only with CI above 0 on both subsets). The scientific claim ("binder-vs-non-binder coevolution carries paratope signal") **fails**: nothing derived from binder-vs-non-binder contrast beats a variability prior, and the contrast-coupling does not beat CDR3-only. What survives is a weaker, already known statement: CDR-column variability predicts paratope.

## Forced analogy: music information retrieval (score following with a drone)
(a) DCA is dynamic-time-warping between two voices. The VHH is the moving voice. HER2 is a held drone. (b) A score follower aligning a moving line to a constant tone has a flat cost row, so every path costs the same. Only the moving voice's internal structure (which notes recur together) can be estimated. That is exactly the table in section 3. Testable idea from it: use a *second* drone as a reference, i.e. the NC libraries (same VHH, no HER2). The cross-voice term should then show up in a post-vs-NC difference. I tested it: KL(post vs NC) gave 0.475 vs 0.478 for post vs naive, no gain. (c) The analogy **holds** for identifiability. It **breaks** at DTW's monotonic path constraint. Paratope contacts are not an order-preserving map from VHH index to antigen index, and the "melody" here is selection pressure rather than a score.

## Gotchas / what could fool us
1. **Variability masquerades as paratope signal.** Contact fraction vs conservation is -0.63. Any score that is high where the library is diverse inherits this. Always run the entropy baseline.
2. **Length artefact.** In my symmetric column scheme, long-CDR3 middle columns are partly the gap state. Binders have longer CDR3 (14.97 vs 14.48 mean), so the KL at CDR3 +7..+9 and -6..-8 partly measures length enrichment, not residue preference. The top-ranked columns have occupancy of 0.33-0.68 and one or two structures behind them.
3. **Label circularity.** Labels are the same pre/post counts used for KL(post||pre). Do not treat the Yes/Not contrast as an independent confirmation.
4. **Redundancy.** Yes clones are heavily clustered: 7,291 clones but Meff 104. Non-binder couplings look "better" because Meff is 10 times larger, not because of binding.
5. **Structural covariation is not interface signal.** The 9/20 adjacency in the non-binder list is real loop geometry (CDR3 hairpin base). The same logic applies to any all-clone Potts fit.
6. **Tiny evaluation set.** 5 chains from 4 entries, 13-18 contacts each. The per-chain PR-AUC range is wide (47D05 0.32 vs 5MY6 0.50). The residue bootstrap understates uncertainty.
7. **Contact definition.** 4 A heavy-atom contacts, not Voronota-LT areas. Numbering is my anchor scheme, not ANARCI. FR3 offsets shift by one in some framework variants.
8. **Public text vs data.** "A few hundred labelled" is wrong for this table (about 19.4 k).

## Implications for the challenge
1. Do not spend compute on VHH-HER2 DCA. It is unidentifiable. Do not expect a plmDCA or EVcouplings run on binder sequences to produce epitope residues.
2. For VHH paratope (chain B), use a **variability + structure prior**: CDR-column entropy of the naive library (0.562 CDR / 0.494 all) plus a leave-one-out contact frequency from public HER2-VHH structures (0.435 / 0.448). Combine and test; these two baselines are the bar to beat, not CDR3-only.
3. Keep the binder-vs-non-binder contrast only as a weak per-clone feature, not as a coupling map. Check it against the permutation null every time.
4. Fix the column scheme before further work (anchor the CDR3 ends and use ANARCI/IMGT insertion codes) to remove the length artefact.
5. The antigen side (chain A) gets nothing from this analysis.

## Open questions
- Would a proper IMGT numbering (ANARCI) change the CDR3 result? Unknown; likely not for CDR1/2.
- Does a different pre-panning definition (Mother-1st only) change KL? Not tested.
- Is the Di Gioia/Zamponi RBM phage-display work real and does it report paratope results? Not found; settle by author search on arXiv.
- Voronota-LT contact labels may re-rank the 5 chains; not computed.

## Run record
Compute: about 11 min CPU total (counts 2.3 min x2, Potts fits 2.5 min, evaluation and bootstrap 3.6 min, controls 0.7 min), at most 4 threads, no GPU. Scripts: `C:\Temp\sepiq26\q7_scripts\` (`num.py`, `s1_counts.py`, `s2_struct.py`, `s3_dca.py`, `s4_eval.py`, `s5_controls.py`, `s6_vs_variability.py`). Outputs: `C:\Temp\sepiq26\q7_out\` (`results.json`, `controls.json`, `position_table.json`, `vs_variability.json`).

## Sources
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4034769 (Ovchinnikov, Kamisetty, Baker, eLife 2014; doi 10.7554/eLife.02030; opened)
- https://github.com/debbiemarkslab/EVcouplings (README opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2629192 and arXiv 0901.1248 (Weigt et al. PNAS 2009, doi 10.1073/pnas.0805923106; seen in search results only, abstract-level)
- Search-result snippets only (not opened): Hopf 2014 arXiv 1405.0929; Hopf 2019 doi 10.1093/bioinformatics/bty862; arXiv 2106.00757; Nanotope bioRxiv 10.1101/2023.09.27.559671; NanoBERTa-ASP PMC10956323; par.nsf.gov/servlets/purl/10402199; arXiv 2501.04387
- RCSB entry API (data.rcsb.org) for titles of 5MY6, 5MY7, 7PH0, 7QVK, 6OGE
- Local: `C:\Temp\sepiq26\q7_clonotype\AVIDa-hHER2.csv`, `NGS_read_count_table.csv`; structures in `C:\Temp\sepiq26\her2\cif\` and `q6\7QVK.cif`
