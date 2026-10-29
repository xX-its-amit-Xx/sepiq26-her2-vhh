---
title: "CASP history: what actually changed the field (data representation, MSA, end to end) and what it says about SEPIQ"
queen: q9_serendipity_cross_domain
king: king_infer
worker: casp_history_what_actually_changed_the_field_data_representation_msa_end_to_end
tier: expert
tags: [CASP, CAPRI, DockQ, coevolution, DCA, AlphaFold, MSA, philosophy-of-science, small-n, AVIDa-hHER2, pseudo-MSA]
confidence: medium
challenge_relevance: 3
serendipity: "CASP as a blind-round epistemology (n=3 test complexes = a 3-target CASP round); the MSA-to-contact-map move maps onto enrichment-reads-to-paratope-map. Partly holds; breaks on one antigen / one round / no co-variation across partners. Paid off as a measurable null: a length-bucketed pseudo-MSA gives identical profiles for ONU11 and ONU13."
date: 2026-10-17
---

## TL;DR
CASP's big jumps came from changing **what the network was fed and asked to predict** (coevolution couplings, then inter-residue distance distributions, then MSA plus pair representations trained end-to-end), not from bigger models on the same input. The SEPIQ analogy (enrichment reads as a noisy family-level signal, like an MSA) **partly holds**. I built the pseudo-MSA from the real AVIDa-hHER2 table and it yields a variability map that flags CDRs and not the specific interface. It breaks hardest at one point: an MSA carries *pairwise co-variation within one fold across thousands of homologues*, while SEPIQ has *one antigen, one panning round, one immunised animal*, so there is no second axis of variation to read contacts off.

Verification note: I opened PubMed/PMC/PLoS pages for CASP13, DockQ, Hitawala-Gray, Jumper-Proteins; Nature, Wiley and tandfonline were blocked (403/redirect). Numbers I could not open are marked "unverified (from memory)" and should be treated as low confidence.

## 1. Dated CASP table: what the model was fed, and where the gain came from

| Year / round | Top method (family) | Dominant change in the input or objective | Reported number (before to after) | Gain from | Source status |
|---|---|---|---|---|---|
| 1994 CASP1 | Threading/homology, knowledge-based | Blind assessment itself | No metric I verified | n/a | unverified |
| ~2000 CASP4 | Rosetta fragment assembly (Bowers, Strauss, Baker) | Input = sequence-derived 3- and 9-mer fragments from the PDB; sampling + a knowledge-based energy | No CASP number verified | Data representation (fragments as moves) | unverified (from memory) |
| 2009 | Weigt et al., PNAS: DCA on interaction partners | Global statistical model (maximum entropy / Potts) separates direct from indirect correlations in an MSA | Not CASP | Model of the data (the same MSA) | unverified (from memory) |
| 2011 | Morcos et al. PNAS 108:E1293 doi:10.1073/pnas.1111471108; Marks et al. PLoS ONE 6:e28766 | DCA over many domains; contacts "recapitulating the global structure of the contact map for the majority of the protein domains" | No L/5 number verified here | Model over fixed MSA representation | Morcos abstract opened via search, Marks only a reference entry |
| 2012 | Jones PSICOV (Bioinformatics) | Sparse inverse covariance, fast | not verified | Model | unverified (from memory) |
| 2016 CASP12 | Mostly statistical-model and conventional ML contact methods | Contacts from coevolution fed to ML post-processors | Best L/5 long-range precision **47%**, "near doubling" from the earlier ~20% plateau (Kryshtafovych 2019 Proteins, PMC6927249) | Data representation (coevolution) plus ML | Verified |
| 2017 (PLoS CB, not CASP) | RaptorX-Contact, Wang et al. | 2D deep residual network on pairwise features including evolutionary coupling; precision refers to top-L long-range | Average top-L long-range accuracy 0.47 vs CCMpred 0.21 vs MetaPSICOV 0.30 (579 proteins, three sets) | Model on same inputs (DCA features stay) | Verified through a search summary |
| 2018 CASP13 | AlphaFold1 (A7D), Senior 2020 Nature 577:706 | Distogram (a distribution over distances, not binary contacts) from MSA-derived features, then gradient descent on a potential | Best L/5 FM contact precision **above 70%** vs 47% at CASP12; the CASP12 winner would have ranked below the top third of CASP13 groups (Shrestha et al.). A7D mean GDT_TS 61.4 (Senior 2019 Proteins). 24 of 43 FM domains high accuracy (TM >= 0.7) vs 14 for the next group | Loss and output representation (distogram) first, MSA features second | Verified via search summaries; Nature page blocked |
| 2020 CASP14 | AlphaFold2, Jumper 2021 Nature doi:10.1038/s41586-021-03819-2 | MSA and pair representation refined jointly by Evoformer, end-to-end structure loss, recycling | Median domain GDT_TS **92.4**; 87 of 92 domains > 70, 58 > 90; summed z 244.0 vs 90.8 (next) (Jumper 2021 Proteins, PMC9299164) | Model + loss end-to-end (the MSA stays the input) | Verified |
| 2021 | MSA Transformer, Rao et al. ICML (PMLR 139) | Row/column attention over the whole MSA, trained by masked language modelling; unsupervised contacts | Outperforms ESM-1b and Potts models "across all MSA depths" (secondary report); exact top-L precision unverified | Model on same MSA; MSA is the input | Only a secondary report |
| 2022-2024 CASP15, CASP16 | AF2/AF-Multimer derivatives plus sampling | Assembly (multimer) emphasis | Not collected here | n/a | Not covered |
| CASP17 | Not announced, from anything I opened | | | | unverified |

Verdict ranking per jump (my judgement, labelled as such):
1. CASP11 to CASP12 contacts: **data representation** (coevolution couplings) >> model >> loss.
2. CASP12 to CASP13 (47% to over 70% L/5): **loss/output representation** (distogram) ≈ model (deep ResNets) > data (same MSA family of features). RaptorX 2017 shows part of the gain predates CASP13 and came from a deeper model on essentially the same inputs.
3. CASP13 to CASP14 (GDT_TS 61.4 mean, to 92.4 median; two different statistics, not like-for-like): **model + loss end-to-end** > representation. The MSA was not new. What changed was gradients flowing from the final 3D coordinates through MSA and pair features.
4. Rosetta fragments (2000): **data representation** (reusable structural pieces as moves).

Caution: the CASP13 vs CASP14 numbers compare different statistics (mean vs median, different assessors' domain sets). The Jumper Proteins paper reports the CASP14 assessors' own comparison as the "first time" this accuracy was reached, with AlphaFold2 outperforming the next group by 244.0 / 90.8 summed z.

## 2. Targets per round and how assessors handle small n

| Item | Verified value | Source |
|---|---|---|
| CASP13 tertiary targets | 90 released, 80 assessed, 111 evaluation units; 45 quaternary targets (42 assessed) | Kryshtafovych 2019 Proteins (PMC6927249) |
| CASP13 FM | Text gives no total; a figure caption mentions 31 FM targets for contact precision; Kinch 2019 split 80 targets into 112 units (search snippet) | PMC6927249; search |
| CASP14 | 92 domains considered in assessment (as quoted in Jumper Proteins); FM count not found | PMC9299164 |
| Scoring CASP14 | Summed z-scores of GDT-based metrics, only z > 2.0 counted (i.e. a negative or sub-2 z gets floored), per Jumper Proteins | PMC9299164 |
| Scoring CASP13 | The overview names GDT_TS and L/5 contact precision; z-scores "not mentioned" in the overview; I did not open the assessors' paper | PMC6927249 |

So the usual statement "about 100 domains, about 30 FM" is right to order of magnitude for CASP13 and unverified for CASP14. How n is tamed: (a) the test is a **paired comparison on the same targets for all groups**, so target difficulty cancels; (b) z-scores per target normalise difficulty before summation; (c) floored z (z > 2.0 in CASP14) rewards getting a few targets very right rather than being average on all; (d) ranking is of groups, and the margin (244 vs 90.8) is far outside any resampling noise. A 0.7 GDT_TS gain difference between top-1 and the best-of-5 (0.69 vs a ceiling 0.80) is the kind of increment small n cannot resolve.

## 3. CAPRI and small-n instability

| Item | Value | Source |
|---|---|---|
| CAPRI total as of 2022 | 54 rounds, 230 targets | Lensink CASP15 slides (search snippet) |
| Score set v2022 | 96 targets, 148 interfaces, 170k models (to round 50) | Lensink EMBO 2023 talk (snippet) |
| Joint CASP-CAPRI targets | R30 (CASP11, 2014): 25; R37 (CASP12, 2016): 10; R46 (CASP13, 2018): 21; R50 (CASP14, 2020): 12; R54 (CASP15, 2022): 37; R57 (CASP16, 2024): 34 | CASP16 Lensink deck (search snippet; PDF too big to open) |
| CASP14-CAPRI round | 12 targets (6 dimers, 3 trimers, 3 higher order); 25 groups incl. 8 servers; ~1250 models per target; top groups gave acceptable-or-better models for 70-75% of targets | Lensink et al. 2021 Proteins (snippet) |
| DockQ (Basu & Wallner 2016, doi:10.1371/journal.pone.0161879) | CAPRI test set 15,328 models (13,849 incorrect, 632 acceptable, 565 medium, 282 high) from 2005-2014 Score_set; training set 56,015 models for 118 benchmark-4.0 targets; cutoffs 0.23 / 0.49 / 0.80; d1 = 8.5 Å, d2 = 1.5 Å; r = 0.98 with IS-score | opened |

The DockQ paper does not state the number of CAPRI targets after excluding Target37 and Target40. I did **not** find a verbatim "few targets made rankings unstable" quote in anything I opened. What the CAPRI design does is score each target as acceptable-or-better among a group's top five models and report counts per target, i.e. it deliberately avoids a single aggregate. Assume the statistical-power statement exists only as a design choice, not as a quote. Low confidence.

## 4. Antibody and nanobody docking: evidence that sampling amplifies a weak signal

From Hitawala & Gray (PMC11838198, journal version doi:10.1080/19420862.2025.2545601; tandfonline blocked):

| Quantity | Value |
|---|---|
| Benchmark | 118 antibody, 70 nanobody complexes |
| AF3, one seed, top-ranked decoy, DockQ >= 0.80 | antibodies 11.0%, nanobodies 11.4% |
| Acceptable-or-better (DockQ > 0.23) | 38.1% antibodies, 31.4% nanobodies; failure about 60% for both |
| Seeds in this paper | 3 seeds x 5 decoys, only seed 1 scored. DeepMind's 1,000-seed figure of 60% success was **not reproduced** by the authors |
| Prior art quoted | AF2.3-Multimer about 20% antibody-antigen success (not re-run); Rosetta protocol about 20%; AlphaRED 43% acceptable on 67 antibodies |
| Confidence ranking | ipTM >= 0.5 (antibody) / >= 0.4 (nanobody), I-pLDDT >= 85, Rosetta ΔGB <= −40 (Ab) / <= 0 REU (Nb); nanobody ΔGB <= 0 then I-pLDDT >= 73 gives n-AUC 0.992 |
| Unbound CDR H3 | nanobody median 2.06 Å (AF3) vs > 3 Å for others; abstract/text disagree for antibodies (2.73 vs 2.15 Å) |

I could not open Evans 2021 (bioRxiv 2021.10.04.463034); only the 17-heterodimer DockQ counts were visible in a snippet (>= 0.49 on 13 or 14 targets, >= 0.80 on 7 or 6, versions differ). I found no AF-Multimer antibody-specific numbers in Evans.

Explicit amplification evidence: (i) a roughly 11% top-1 success but a published 60% at 1000 seeds (DeepMind figure, cited second-hand) means many seeds contain a correct pose; (ii) a post-hoc ranker (ipTM plus I-pLDDT plus ΔGB) reaches n-AUC 0.99 for nanobodies, so correct-vs-incorrect is separable. Weak per-sample signal + sampling + a good scorer = amplification. Caveat: the paper's own seed count here is 3, so the 11 to 60% scaling is DeepMind's claim, not measured by Hitawala-Gray.

## 5. Noisy labels and MSA depth

- Verified: nothing primary on the minimal Neff. Search found a workshop slide that attributes ">30 sequences per residue gives a highly accurate and confident model" to Xu et al. 2019 (secondary; unverified), and an EBI course note that "tens of sequences with low variability" is the commonest cause of failed AF2 predictions. A blog quoted TM 0.80 down to 0.41 when homologues are stripped, with no primary citation; do not rely on it. MSA Transformer is said to beat Potts models "across all depths", suggesting a supervised/pretrained prior shifts the minimum Neff downward (secondary).
- So the honest rule: signal exists from tens of effective sequences; fewer than ~30 per residue is where coevolution methods fail. Unverified in the AF2 supplement.

### What the AVIDa-hHER2 table actually contains (computed, local file, C:\Temp\sepiq26\q7data\AVIDa-hHER2.csv)

| Quantity | Value |
|---|---|
| Rows (unique sequences) | 1,843,875 (so the "1.8M" are unique sequences) |
| Sum of `total` column | 5,327,133 (this is what the column adds to; do not equate to reads per library) |
| `label` counts | Yes 7,316; Not 12,051; noise 746; non-sig. 1,823,762 |
| Most common lengths (with MA + His tag) | 131 (205,953), 129 (186,746), 132 (184,542), 130 (143,563) |
| Same length as ONU11 / ONU13 (127) | 115,325 sequences, 451 of them binder (`binary_label` 1.0) |
| Same length as ONU23 (135) | 71,363 sequences, 240 binder |

Clone facts: ONU11 total 7,058 reads, `label` = **noise** (target_IE_score −500, cluster 22, size 2,731); ONU13 total 6,874, Yes (cluster 2, size 4,420); ONU23 total 4,063, Yes (cluster 42, size 1,330). The dataset sequences carry "MA" plus His tag (lengths 127/127/135, not the 120/120/130 on /detail). The "noise" label for ONU11 is a gotcha.

Effective sequence count was **not** computed (no identity clustering weighting). With 115,325 same-length sequences and 93%-style clusters of hundreds to thousands (Cluster_size 1,330-4,420 for these three), Neff is surely in the thousands for the library, but the binder-labelled slice (451 / 240 sequences) is what carries the epitope-relevant signal.

Gapless pseudo-MSA by length bucket: mean per-position Shannon entropy 1.48 bits (all) vs 1.11 bits (binders) for the 127 bucket, 1.45 vs 1.16 for the 135 bucket. Framework positions have entropy near 0, CDR3 positions near 3.9 bits (max 4.32).

## 6. Philosophy of science: did each change generalise?

| Change | Survived next blind round? | Evidence |
|---|---|---|
| Fragment assembly (Rosetta) | Yes for many rounds, but plateaued on large folds | unverified (from memory) |
| DCA / coevolution | Yes. CASP12 doubled contact precision to 47% | PMC6927249 |
| Deep ResNet on contacts | Yes. CASP13 over 70% | PMC6927249 |
| Distogram + potential (AF1) | Yes, then superseded within 2 years | CASP14 |
| End-to-end Evoformer (AF2) | Yes, to 92.4 median; CASP14 assessors saw it as the first time | Jumper Proteins |
| Hand-crafted physics and template-free sampling alone | Not shown to beat the above | n/a |

The CASP13 to CASP14 jump is the cleanest "generalised, not overfit" case: different targets, new assessors, new fold space; 87 of 92 domains above 70 GDT_TS. What kept CASP honest: blind targets, pre-registered metrics, and many targets per round. A caveat from the assessors' own words: AF2 faced challenges with flexible regions and obligate oligomers, so gains are conditional on MSA availability ("provided enough sequences exist for the protein family," CASP13).

Forced analogy: n = 3 is a CASP round with three targets. CASP learned from each blind round only because (a) ~100 domains averaged out luck, (b) paired comparisons cancelled difficulty. With three complexes SEPIQ cannot tell a method that generalises from one tuned to those three: a single complex moving a PR-AUC by 0.1 changes the macro by 0.033.

## Forced analogy: CASP / evolutionary MSA to SEPIQ enrichment data

(a) Statement. An MSA is a noisy, huge, family-level signal whose position-pair co-variation is turned into a per-residue/contact map. The enrichment table is a noisy (one round, labels from chi-square on counts) family-level signal over ~1.84M VHHs. Map: columns = VHH positions; "family" = binder-labelled VHH pool.

(b) Testable recipe (implemented here as a baseline).
1. Take each ONU's length bucket, build a gapless pseudo-MSA from binder-labelled rows (`binary_label` == 1.0; 451 for the 127 bucket, 240 for the 135 bucket).
2. Per position i, compute entropy H_i; set p_i = min(1, H_i / 3.5)^1.5, zero for the His tag.
3. Evaluate on the public HER2-VHH PDB complexes (leave cluster out) against the CDR-only prior and AntiBinder.
4. Better version: align by IMGT/ANARCI so CDR3 length variants are columns-aligned, weight by IE score, add mutual information between CDR positions (DCA-lite), and add antigen-side prior from AF3/Boltz structures.

Result (VHH side only, per-position p >= 0.5, dataset numbering with the leading MA; full vectors in `..._onu_profiles.json`):

| Clone | Positions with p >= 0.5 |
|---|---|
| ONU11 | 33, 35, 52, 54, 55, 56, 58, 59, 63, 81, 100-109 (20 positions; CDR1/2/3 plus 81) |
| ONU13 | the same 20 positions (the profile depends on length bucket, not the sequence) |
| ONU23 | 33, 52, 58, 61, 80, 82, 101-115, 117 (22 positions; CDR3 is 15 long) |

Honest reading: this is a CDR detector. It gives a calibrated-looking probability over a few dozen residues but has no antigen-specific information and cannot separate ONU11 from ONU13. An expected PR-AUC against a real interface is a CDR-prior-level number; I did not measure it because the three structures are blind. The antigen chain A gets no probability from this recipe at all.

(c) Verdict: **partly holds** (variability from an enriched pool is real and cheap, and CASP confirms that representation beats model size). **Breaks** at one point: one antigen, one round. A coevolution MSA reads contacts from variation *between homologues that each fold the same way with different partners*; here every enriched VHH meets the same HER2, one panning round, one immunised animal, so there are no independent contexts and no co-variation across the interface. The signal is about *which VHH survive panning*, not *which residues touch*.

## Gotchas / what could fool us
1. Length-bucket pseudo-MSA misaligns CDR3 columns of equal length with different structure; entropy there is length-bound, not contact-bound.
2. High entropy marks any CDR, including residues the antibody never contacts, and framework contacts are invisible.
3. ONU11 is labelled "noise" in this table: its read count (7,058) is high but the enrichment test did not call it. Any pipeline that trains on `binary_label` loses it.
4. `total` summed is 5.33M, not 1.8M; reads-versus-sequences conflation.
5. Labels are chi-square on before/after proportions (BRIEF), enrichment not affinity; non-binders include real binders at low copy.
6. 451 / 240 binder sequences after length bucketing; clone clusters of 1,330-4,420 mean heavy redundancy, so effective n is far smaller.
7. CASP13 and CASP14 headline numbers use different statistics (mean vs median); do not quote as a before/after pair.
8. AF3 multi-seed claim is DeepMind's, not Hitawala-Gray's measurement.
9. Leakage: ONU clones are in the public table by rank; the rules say leakage is fine "as long as the answer is correct", but neighbours' labels cannot tell the epitope.

## Implications for the challenge
1. Use the pseudo-MSA only as a prior on which VHH positions are CDR-like; do not expect it to beat structure prediction. Use it to weight AF3/Boltz/OpenFold3 predicted interfaces.
2. Follow the amplification precedent: generate many seeds per complex (AF3-class, 1 seed is about 11% high accuracy), rank by ipTM + I-pLDDT, and average per-residue contact frequencies over the top-ranked decoys into the 0-1 prediction.
3. Build an IMGT-aligned MSA with ANARCI, add CDR-CDR mutual information, and test whether it adds anything over a plain CDR prior on public HER2-VHH complexes with cluster-held-out folds.
4. Treat n = 3 as a CASP round of three: report paired bootstrap per complex and do not tune on the three blind complexes.
5. Antigen side: use HER2 ERBB-family MSA or AF structure plus a Voronota-LT-like contact prior; the enrichment table says nothing about chain A.

## Open questions
- Exact CASP14 FM count and CASP13/14 z-score formulas (not found; assessors' papers not opened).
- The primary text of "few targets make CAPRI rankings unstable".
- Minimal Neff in the AF2 supplement; Rao 2021 and Evans 2021 numbers.
- Does an IMGT-aligned, IE-weighted pseudo-MSA beat a flat CDR prior on public HER2-VHH PDB complexes?

## Sources (opened)
- Kryshtafovych et al. 2019, CASP13 overview: https://pmc.ncbi.nlm.nih.gov/articles/PMC6927249
- Jumper et al. 2021 Proteins, Applying and improving AlphaFold at CASP14 (doi:10.1002/prot.26257): https://pmc.ncbi.nlm.nih.gov/articles/PMC9299164/
- Basu & Wallner 2016 DockQ: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0161879
- Hitawala & Gray, AF3 antigen and nanobody docking: https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/
- Search-result summaries only (not opened in full): Senior 2020 (doi:10.1038/s41586-019-1923-7); Morcos 2011 (doi:10.1073/pnas.1111471108); Wang et al. 2017 (doi:10.1371/journal.pcbi.1005324); Lensink CAPRI slides (predictioncenter.org CASP14, CASP15, CASP16 presentations); Evans 2021 (doi:10.1101/2021.10.04.463034); Rao et al. 2021 (PMLR 139)
- Local data: C:\Temp\sepiq26\q7data\AVIDa-hHER2.csv (computed 2026-10-17)
