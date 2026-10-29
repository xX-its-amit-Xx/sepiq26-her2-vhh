---
title: AVIDa-hHER2 and the AVIDa family - dataset anatomy, columns, sizes, label logic
queen: q3_assay_ngs_ground_truth
king: king_world
worker: avida_hher2_and_avida_family_dataset_anatomy_columns_sizes_label_logic
tier: expert
tags: [AVIDa, hHER2, hIL6, SARS-CoV-2, labels, chi-squared, IE-score, phage display, label noise, epitope]
confidence: medium
challenge_relevance: 3
serendipity: Rules of evidence (labels as exhibits with a standard of proof); it paid off by exposing that every hHER2 label is hearsay with respect to epitope and that the real labelling rule is an IE-score cascade, not the plain chi-squared rule on the site.
date: 2026-10-17
---

## TL;DR
AVIDa-hHER2 is not a public COGNANO card. The `COGNANO/AVIDa-hHER2` URL returned HTTP 401, and search found no such release. The data is the gated HF dataset `sepiq-2026/SEPIQ-2026-training-data`, which has 1,843,875 unique VHH sequences. Only a few hundred sequences carry binder/non-binder labels, and those labels come from one-round panning enrichment. A label can say that a clone's read share rose after panning against HER2. It cannot say where on HER2 the clone binds. I could not open the gated table, so the per-row questions (4 and 7) are unanswered and listed under Open questions.

## 1. Data dictionary (what I could open)
The gated card was fetched with WebFetch at https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data. I saw only the public card text. The tool returned a summary rather than the raw page, so quotes below are close to verbatim but not guaranteed exact.

| Item | Value (source: SEPIQ card unless noted) |
|---|---|
| Size on card | 626 MB total; 1,843,875 unique VHH sequences |
| Access | Gated, manual review. Only approved SEPIQ participants can download |
| Main columns | `#ONU ID`, `Total`, `Sequence`, `Label`, `Binary Label`, `Cluster`, `#Cluster`, `Cluster size` |
| Aggregated columns | `Background IE-score`, `Target IE-score` |
| `Total` | Total NGS reads across all libraries |
| `Label` values | `Yes` (binder), `Not` (non-binder), `noise`, `non-sig.` |
| `Binary Label` | 1 = binder, 0 = non-binder. Other labels have no binary value and count as pending |
| Clustering | USEARCH at 93% identity (Edgar 2010), clusters numbered by descending size |
| Negative-control sublibraries | NC1, NC2, NC3_C1, NC3_C2, Comparator_C1, Comparator_C2 |
| HER2 sublibraries | Her2, Her2_C1, Her2_C2 |
| Competition sublibraries | Her2_Trastuzumab_C1 to C3, Her2_Pertuzumab_C3, Her2_RabMAb_C3. Competition signal exists only for Mother Library B |
| Naming | "Marin" = alpaca. Suffix B or C = mother library. Phase (1st/2nd) and temperature (4 C or 37 C) are encoded in experiment names |
| Licence | "other": SEPIQ participation and approved non-commercial research only. No redistribution, no commercial use, no reconstruction of hidden labels |
| Citations on card | Tsuruta et al. 2023 (AVIDa-hIL6, NeurIPS 36); Edgar 2010 (Bioinformatics 26:2460) |

Not found on the card: the string "AVIDa-hHER2", the file name `NGS_read_count_table.csv`, the read depth, and the exact counts of labelled binders and non-binders. https://sepiq.uk/detail says "NGS_read_count_table.csv" is the read-level file. It says there are two libraries, one biopanning round, about 10^5 paired reads per library, and "a few hundred" labelled sequences. The card's `Total`/`Sequence`/`#ONU ID` layout looks like the merged table, but I could not confirm that `NGS_read_count_table.csv` is the same table or how it joins to the labelled table. The likely join key is the sequence or `#ONU ID` (unverified).

Two things differ from the BRIEF.
- The site says "chi-squared, p <= 0.05, proportion rose". The card describes a richer cascade on IE-scores (below).
- The card lists sublibraries for more than two libraries: mother libraries B and C, plus competition panels and negative controls.

## 2. The label rule
The card's IE-score is a negative log10 p-value from a chi-square test on the abundance-ratio change before and after panning. It follows the AVIDa-hIL6 method. Lower means more likely to bind. Infinite values are set to -500. The rule is applied in this order, as stated on the card:

| Condition | Label |
|---|---|
| Target IE >= 1.3 | `Not` |
| Background IE <= -3 | `noise` |
| Background IE negative and at least 2 units above the target | `Yes` |
| Background IE negative, other cases | `non-sig.` |
| Background IE positive and target <= -1.3 | `Yes` |
| All other cases | `non-sig.` |

Note that 1.3 corresponds to p = 0.05 on the -log10 scale. The card does not spell out the sign convention beyond "lower = more likely binder". I could not verify the contingency-table layout for hHER2. The null is that the clone's read share is the same before and after panning.

The AVIDa-hIL6 paper (https://arxiv.org/html/2306.03329) states the method precisely:
- It is a two-proportion z-test with a pooled proportion and a normal approximation. It is equivalent to a 2x2 chi-square of (reads of this VHH, all other reads) by (mother library, sublibrary). Every library had more than 10,000 reads.
- The cutoff is p <= 0.05. A share that rose is labelled binder, one that fell is non-binder, and the rest are non-significant.
- For each VHH-target pair the smallest p-value across the 12 sublibraries sharing the target is kept.
- The paper describes no multiple-testing correction. I found no minimum-count filter other than singleton removal.
- Noise handling: a binder that also binds the negative control becomes `noise`. A binder that is non-significant against the control keeps its label only if p_control / p_IL6 >= 10^2.5, an empirically chosen ratio.

AVIDa-SARS-CoV-2 (https://arxiv.org/html/2405.18749v3) reports the same scheme with the same p <= 0.05 and 10^2.5 ratio. The text I read called the test a two-proportion z-test.

### False-positive arithmetic (uncorrected, my calculation)
Assume N sequences are truly unchanged by panning and the test is calibrated.
- Two-sided p <= 0.05 gives 0.05 N significant calls. Half of them rose, so the false "binder" rate is 0.025 N.
- For N = 100,000 tested clones, that is about 2,500 false binders and 2,500 false non-binders.
- Taking the minimum p over k sublibraries inflates the rate to 1 - 0.95^k for independent tests. With k = 12 (the hIL6 design) that is 46% per clone, so about 23% would be false "rose" calls under the null. The hHER2 value of k is unknown, because it depends on how many HER2 sublibraries were pooled.
- Sampling noise is not the only error. The z-test treats reads as independent draws, but PCR jackpotting and phage amplification bias violate that. The p-values are therefore anti-conservative.
- Observed hIL6 prevalence of 3.7% binders shows that real signal is above this null floor in that dataset. For hHER2 there is no stated count, so I cannot say what fraction of binders is false.

## 3. Comparison of the three AVIDa papers

| | AVIDa-hIL6 (NeurIPS 2023, arXiv 2306.03329) | AVIDa-SARS-CoV-2 (NeurIPS 2024, arXiv 2405.18749, HF DOI 10.57967/hf/2331) | AVIDa-hHER2 (SEPIQ card and sepiq.uk) |
|---|---|---|---|
| Antigen | Human IL-6, WT plus 30 alanine mutants (31) | 13 antigens: 12 SARS-CoV-2 variants plus OC43 (HF card lists 17 `Ag_label` values) | Wild-type human HER2 ECD |
| Animals and libraries | 1 alpaca, 4 immunisations, 12 mother libraries (pMES4), 408 sublibraries | 2 alpacas, 31 mother libraries | 1 alpaca, 2 libraries per site; card mentions B and C |
| Panning | 1 round | Bead, cell or both; round count not confirmed in what I read | 1 round |
| Reads | MiSeq 2x300, about 100,000 paired reads per library, singletons removed | About 100,000 paired reads per library | About 10^5 paired reads per library (site); raw reads including singletons released |
| Size | 573,891 labelled pairs: 20,980 binders (3.7%) and 552,911 non-binders; 38,599 unique VHH; 1,998,127 non-significant samples | 77,003 pairs: 22,002 binding, 55,001 non-binding; 36,100 unique VHH | 1,843,875 sequences; "a few hundred" labelled |
| Label | z-test p <= 0.05, noise filter vs negative control | Same | IE-score cascade (section 2); `Yes`/`Not`/`noise`/`non-sig.` |
| Wet-lab check | 20 clones (10 binder, 6 non-binder, 4 noise) by immunofluorescence and BLI | 9 VHH cited from an external study; no ELISA or SPR in what I read | None found |
| Licence | cc-by-nc-4.0 | cc-by-nc-4.0 | "other", gated |
| Unlabelled corpus | none | VHHCorpus-2M: 2,040,988 unique VHH from 5 alpacas | n/a |

Orthogonal validation, in rules-of-evidence terms:
- hIL6 meets balance of probabilities for its tested subset. All 10 tested binders bound IL-6 by immunofluorescence and BLI, and all 6 non-binders and 4 noise clones did not bind IL-6 by BLI. Agreement is 20/20 on 20 clones, but the sample is small and was limited to isolable clones. The appendix says 12 binders, 6 non-binders and 5 noise clones were selected, with 3 not isolable. The main text and appendix differ, so rely on the appendix.
- SARS-CoV-2: no agreement rate that I could find.
- hHER2: no orthogonal assay found. Under the forced analogy these labels are hearsay.

AVIDa-hIL6 also reports that 650 of 4,425 multi-antigen binders (14.7%) bind some mutants but not others. That is the only epitope-flavoured signal in the family, and it is absent from hHER2 (one antigen, no mutants).

## 4. Class balance (partial)
- hIL6 prevalence is 3.7% binders among labelled pairs. Train 10,564 binders in 292,843; test 10,416 in 281,048.
- SARS-CoV-2 prevalence is 22,002 / 77,003 = 28.6% of pairs. Train 15,400 binders and 34,285 non-binders; test 6,602 and 20,716. Of 36,100 unique VHH, 14,078 bind at least one antigen.
- hHER2: the labelled fraction is a few hundred out of 1,843,875, about 0.02% if "few hundred" means 300 (illustrative only). Binder prevalence, CDR3 lengths, duplicates and family structure could not be computed because the table is gated and not on this machine.
- hIL6 shows the same selection effect: 1,998,127 non-significant samples versus 573,891 labelled. Labels need enough reads to reach p <= 0.05, so labelled clones are biased toward high-count sequences. For hHER2 this is a strong prior, not a measured fact.

## 5. AntiBinder (doi 10.1093/bib/bbaf008)
I opened the OUP article page (https://academic.oup.com/bib/article/26/1/bbaf008/7966331). The tool summary covered the first 100,000 of 121,949 characters. In that part:
- The training datasets named are Cov-AbDab, the Los Alamos HIV database, BioMap and the MET dataset (Makowski et al.). AVIDa is not mentioned.
- Labels are binary interaction/non-interaction for three datasets. BioMap uses binding free energy. The text gives no conversion, negative-generation method or decision threshold.
- Label-noise robustness is not addressed. The limitations discuss IgFold and ESM-2.
- So the BRIEF's claim that AntiBinder was trained with AVIDa is unconfirmed. sepiq.uk says the organisers' baseline used SAbDab-nano and AVIDa-SARS-CoV-2. That is the organisers' pipeline, not necessarily the paper's. The unread last 21,949 characters and the supplement could mention AVIDa.

## 6. Epitope content
sepiq.uk says the dataset "does not directly include residue-level epitope annotations". The only indirect epitope-adjacent signals I found are:
- Competition panels with trastuzumab, pertuzumab and RabMAb, available for mother library B only. The card lists them but I could not see their values. If a clone's enrichment drops under trastuzumab (domain IV) or pertuzumab (domain II), that would suggest overlap, but that is my inference and is not documented.
- Cluster membership (USEARCH 93%), which groups similar sequences, not similar epitopes.

What labels cannot say: which HER2 domain or residues a VHH touches; whether the VHH binds the folded ECD or a misfolded fraction; whether binding is monovalent or avid on phage; affinity or kinetics (read share is not Kd); whether the clone binds the C-terminal GACQ/His tag region or the immobilisation surface; which paratope residues (CDRs vs framework) make contact.

## Forced analogy: rules of evidence
Each label is an exhibit with provenance: library, sublibrary, read counts, IE-score, control comparison.

| Label | Standard of proof | Corroboration |
|---|---|---|
| `Yes` with both background and target IE-scores significant | Balance of probabilities for "enriched on HER2 panning" | Background control only |
| `Yes` by the positive-background rule | Mere allegation | None |
| `Not` | Mere allegation for non-binding; it only says "did not rise" | None |
| `noise` | Evidence of artefact, not of non-binding | Negative controls |
| Any label vs epitope | Hearsay | No structural or competition data visible to me |
| cryo-EM ONU11/13/23 | Beyond reasonable doubt, but held out | n/a |

Testable idea: weight training sequences by the strength of evidence (log-odds from IE-score or `Total`) instead of using the 0/1 `Binary Label`. Use `Yes` clones in clusters with several high-IE members as a higher-confidence set. Hold out whole 93% clusters when validating, since near-identical clones inflate agreement. The analogy holds for label confidence and breaks for epitope, where no exhibit speaks to location at all.

## Gotchas / what could fool us
1. A chi-squared test on 10^5 reads per library has power only for clones with several reads. Labelled sets are biased to abundant clones.
2. No multiple-testing correction in the published scheme. About 2.5% of null clones are false binders per test, and the min-p over sublibraries makes it worse.
3. Phage display artefacts that raise a clone's share without binding HER2: faster growth or better display (expression bias), propagation bias, PCR jackpotting, and binding to the plate, tag or blocking agent. The background-control rule only catches artefacts shared with the control sublibraries. I cannot give a quantitative artefact fraction for hHER2. In hIL6, 4 of 20 tested clones (the ones labelled noise) showed nonspecific cell staining, but that is not a measured artefact rate among binders.
4. A `Binary Label` of 0 can include `Not` clones that simply fell in share because others expanded (a compositional effect). A drop in share is not evidence of non-binding.
5. One panning round: enrichment is weak, and there is no selection on affinity beyond the wash conditions.
6. Clones in the same 93% cluster share CDRs, so random splits leak.
7. The site says "chi-squared"; the AVIDa papers say z-test; the card says IE-score. They are equivalent for the basic 2x2 case but the cascade adds thresholds not on the site.
8. Licence: no redistribution and no reconstruction of hidden labels. Keep the table out of shared outputs.

## Implications for the challenge
1. Confirm gated access to the SEPIQ table, then compute the label counts, cluster size distribution and read counts for ONU-like clones.
2. Treat `Yes` labels as soft weights, not hard targets, and avoid using `Not` as a negative for paratope learning without a read-count floor.
3. Split by `Cluster` when validating any sequence model.
4. Use the trastuzumab/pertuzumab competition panels, if the values are usable, as the only epitope-adjacent signal. Check mother library B only.
5. Do not expect labels to improve residue-level PR-AUC directly. The structure-aware signal must come from the sequence family, folding priors and docking.
6. Run the ONU11/13/23 near-neighbour search (question 7) once the table is available: align CDR3s at >= 80% identity and record `Total`, `Label`, `Cluster`.

## Open questions
- Exact counts of `Yes`/`Not`/`noise`/`non-sig.` in the SEPIQ table, and read depth per library (gated).
- Does `NGS_read_count_table.csv` equal the HF table, and what is the join key?
- Is there an AVIDa-hHER2 paper? I found none. Did AntiBinder use AVIDa data in its supplement?
- CDR3 length distribution, duplicate structure and ONU11/13/23 neighbours (question 7 not done: no data access, and no local compute was run).
- Whether the IE-score uses a chi-square on a 2x2 table identical to the hIL6 z-test, and the value of k for min-p.

## Sources (opened)
- https://huggingface.co/datasets/COGNANO/AVIDa-hIL6 (card)
- https://huggingface.co/datasets/COGNANO/AVIDa-SARS-CoV-2 (card)
- https://huggingface.co/datasets/COGNANO/AVIDa-hHER2 (HTTP 401, not opened); https://huggingface.co/api/datasets/COGNANO/AVIDa-hHER2 (HTTP 401)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (public card of gated dataset)
- https://arxiv.org/abs/2306.03329 and https://arxiv.org/html/2306.03329 (AVIDa-hIL6)
- https://arxiv.org/html/2405.18749v3 (AVIDa-SARS-CoV-2; first 100,000 of 108,060 characters)
- https://academic.oup.com/bib/article/26/1/bbaf008/7966331 (AntiBinder; first 100,000 of 121,949 characters)
- https://sepiq.uk/detail
