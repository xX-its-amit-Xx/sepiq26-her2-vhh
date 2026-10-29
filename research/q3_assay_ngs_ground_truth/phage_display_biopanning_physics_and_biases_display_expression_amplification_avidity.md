---
title: Phage-display biopanning physics and biases behind AVIDa-hHER2 chi-squared labels (chain of custody and error budget)
queen: q3_assay_ngs_ground_truth
king: king_world
worker: phage_display_biopanning_physics_and_biases_display_expression_amplification_avidity
tier: expert
tags: [phage-display, biopanning, NGS, label-noise, pMES4, parasitic-clones, AVIDa-hHER2, epitope, error-budget]
confidence: medium
challenge_relevance: 3
serendipity: Forensic chain-of-custody log applied to every handoff of a sequence; paid off by exposing that the label is a differential-abundance test whose nuisance variance (amplification, PCR, display) is never modelled, and that labels carry almost no epitope information.
date: 2026-10-17
---

## TL;DR
The AVIDa-hHER2 "binder" label says only that a VHH's read share rose between the unpanned mother library and a single panning round, at an uncorrected p <= 0.05 (z-test on proportions). That is a statistical-enrichment flag, not a measured binding event, and it carries essentially no information about which HER2 residues are touched. My estimate (derived from stated assumptions, not measured) is that roughly 10-40 % of chi-squared binder labels are false positives, and that 30-60 % of truly HER2-specific clones are not labelled binder. No published study measures these fractions for AVIDa-hHER2.

## What I could and could not verify
- **AVIDa-hHER2 dataset card**: `huggingface.co/datasets/COGNANO/AVIDa-hHER2` and its raw README returned HTTP 401, so the card was NOT read. HER2-specific protocol facts come from BRIEF.md (marked "brief"). Treating the HER2 pipeline as identical to hIL6 is inference.
- **AVIDa-hIL6** (Tsuruta et al., NeurIPS 2023, arXiv 2306.03329) and **AVIDa-SARS-CoV-2** (arXiv 2405.18749): PDFs downloaded and text-extracted; methods read directly. Same lab (COGNANO) and pipeline family, so they are the best proxy.
- No paper found that stratifies ELISA/BLI validation by NGS enrichment ratio (searches returned patents and generic phage-ELISA papers). This is a real literature gap.

## Q1. Fraction of round-1 enrichment that is artefact (published numbers)
| Artefact class | Evidence | Number | Source |
|---|---|---|---|
| Propagation (parasitic) clones, peptide library | Ph.D.-7 deep sequencing, bulk amplification of 10^6 PFU | parasites are <0.01 % of diversity; in naive library rise to >0.01 %, ~1 % after amplification; sequences above 1e-4 abundance were ~35 % of bulk-amplified population but <1 % in emulsion; ~1 in 20 literature peptides come from a parasite subset <1e-7 of diversity | Matochko 2013 NAR (PMC3919620) |
| Replicate variance | technical / biological | ~1.25x / ~1.5x Poisson variance | same |
| Single dominant clone | CD4 panning, Ph.D.-7, 3 rounds | WSLGYTG clone ~95 % of round-3 eluate; unique sequences 61.6 % -> 0.08 %; recovery 1.6e-6 (R1), 4.8e-5 (R2), 3.4e-4 (R3); Sanger of 57 clones missed it | Sell 2024, doi 10.3390/cimb46090627 |
| Selection-system binders (plastic, streptavidin/biotin, albumin, metal chelates, protein A/G, Fc, secondary Ab) | review | qualitative; no aggregate fraction given; SAROTUP recognises only 23 TUP motifs | Vodnik 2011 Molecules 16:790, doi 10.3390/molecules16010790 |
| Display/expression | 15 anti-tetanus scFvs | display propensity vs overall expression Spearman rho 0.88 (p<0.005) | Scott 2008 BMC Biotechnol (PMC2630973; search summary) |
| Negative-control filtering | hIL6 pipeline | binder to a no-antigen negative sample reassigned to "noise"; plus a p-value-ratio rule (printed "102.5", probably 10^2.5) | Tsuruta 2023 |

Summary: no published, general "x % of round-1 enriched sequences are TUPs" exists. Peptide-library literature shows parasites can account for a few percent of reported hits; VHH libraries differ (larger folded domains; Shine-Dalgarno parasites not documented for pMES4 VHH, unverified). No quantified fraction found for anti-His / Ni-NTA / anti-tag binders (HER2 construct has C-terminal GACQ + His). hIL6 controls for beads and blocking via a no-antigen sample; whether AVIDa-hHER2 has one is unverified.

## Q2. Enrichment after one round, and what it reflects
- **Pipeline (hIL6 paper)**: one bead-panning round per mother library; ~100,000 paired reads per library; singletons removed; two-proportion z-test with pooled proportion (min n1,n2 > 10,000); binder = share up and p <= 0.05; non-binder = share down and p <= 0.05; otherwise non-significant (1,998,127 pairs in hIL6; ~97 % in SARS-CoV-2). hIL6 used the smallest p across 12 sublibraries per VHH-target pair, which is multiple-testing inflation.
- **Titres**: I found no source giving input/output titre ratios for VHH single rounds. The only verified recovery numbers are peptide-library (1.6e-6 round 1; 30-fold then 7-fold rises). The 10^2-10^4 range suggested in the brief is unverified here.
- **What the share ratio encodes** (my synthesis): ratio = capture/retention fraction (affinity AND avidity, antigen density and orientation) x displayed copy number (tracks expression) x proteolytic stability x elution/infectivity/TG1 growth factor x PCR/sequencing factor. pMES4 is pIII display from a phagemid with helper phage, so mostly monovalent, but high bead antigen density allows multivalent rebinding. A rise therefore reflects displayed amount x apparent affinity x growth, not K_D.
- Round 1 has the lowest signal-to-background, and z-test power scales with read count, so abundant clones are favoured over strong but rare ones.

## Q3. Pre-selection bias in pMES4/pIII VHH libraries
Verified library facts (SARS-CoV-2 paper appendix; same lab): RNA from lymph node/PBMC, random-hexamer cDNA, PCR with CALL001/CALL002 (hinge-based), ~700 bp band gel-extracted, nested PCR adding PstI/BstEII sites, cloning into pMES4 (C-terminal His tag), TG1 electroporation, density >10^7 cfu/uL, pooled to a mother library (12 in hIL6, 31 in SARS-CoV-2).
- **Present-in-input filter**: clones need PCR-amplifiable priming sites, absence of internal PstI/BstEII sites (my inference, unquantified), TG1 tolerance, and display competence. Amber stop: suppressed in supE TG1 as Gln (standard, not verified in the AVIDa papers). Toxic or poorly expressed VHHs drop out in outgrowth.
- **Immune bias**: hIL6 paper states binder probability varied with collection time and body site, and VHHs binding alpaca self-proteins are likely deleted.
- **Can input read count predict "binder"?** Mechanistically in part yes (power rises with x1+x2; expanded lineages are both abundant and more likely specific). No published correlation found. Cheap test on the NGS table: logistic regression of label on log(input count) alone; AUC well above 0.5 means the label partly encodes abundance.

## Q4. What one-round panning on full HER2 ECD can and cannot say about epitope
Can say: this sequence (or close relatives) is enriched on a HER2-ECD-coated bead surface at p <= 0.05; a family of related clones all enriching makes it more credible. Nothing more.

Cannot distinguish:
1. **Domains I-IV**: a single full-ECD antigen, no domain-resolved readout. Known HER2 nanobodies differ: 2Rs15d binds domain I (crystal structure; no competition with trastuzumab or pertuzumab); 5F7 binds domain IV, the trastuzumab/T-DM1 epitope (from search summaries of AACR Clin Cancer Res 23:6616 and Sci Rep 12:3020, not fully opened, confidence medium).
2. **Shared epitopes** among sequence-dissimilar VHHs.
3. **Glycan-proximal surfaces**: no deglycosylated or glycan-knockout control in the pipeline as described.
4. **Partially buried or conformation-dependent regions** and **adsorption denaturation / orientation** on beads (tag capture vs amine coupling changes which face is exposed; orientation unrecorded).
5. **Avidity artefacts**: low-affinity VHH enriching through multivalent bead rebinding, unlike the single-valent cryo-EM complex.
6. **Mutant series**: HER2 is wild-type only (brief), so the mutant-differential trick available in AVIDa-SARS-CoV-2 (427 VHHs binder for some variants, non-binder for others) is unavailable.

## Q5. Orthogonal validation rates
| Study | Validation | Result |
|---|---|---|
| AVIDa-hIL6 | immunofluorescence on HA-IL-6 cells; clones chosen after clustering, hard cases first, by read count | 10/10 binder-labelled bound; 6/6 non-binder and 4/4 noise-labelled did not (n=20; deliberately selected) |
| AVIDa-SARS-CoV-2 | cites hIL6 (20 VHHs, IF + BLI) and 9 VHHs binding spike variants incl. Omicron | no precision table |
| CD4 peptide panning | Sanger of 57 clones | 2 tested candidates failed; dominant clone was a propagation artefact |

Precision of NGS enrichment vs ELISA/BLI for nanobodies at a chosen threshold: not found. 10/10 gives a Clopper-Pearson 95 % lower bound of ~69 %, but the sample was non-random so it is only an indicator. HER2 nanobody papers (2Rs15d domain I, 5F7 domain IV; co-crystal paper doi 10.1371/journal.pone.0288259 from a search result) are not panning-validation studies; they supply domain I and IV epitope anchors.

## Q6. Quantitative error budget (derived; assumptions explicit)
**False positives among chi-squared binder labels.** Assumptions: ~10^5 reads per library, uncorrected alpha 0.05, binders ~1-4 % of testable clones (hIL6 binder pairs 3.7 %), tested unique VHHs 10^4-10^5.
- A. Statistical noise: z-test ignores overdispersion (1.25-1.5x Poisson in peptide data; amplification and PCR add more), so effective null false-positive rate is ~0.04-0.10 per testable null clone. With nulls outnumbering true binders 25-100:1, raw FP share would be 30 % to >60 %. The "few hundred" labelled sequences imply a large unspecified cut (read-count floor and/or negative-control filter), which lowers this.
- B. Display/expression/amplification advantage: plausible 5-20 % of surviving labels.
- C. Anti-tag, bead, BSA, streptavidin binders: 2-10 % if no no-antigen control, near 0 if filtered.
- **Defensible FP range: ~10-40 % (central 20-25 %)**: low end with a read-count floor plus negative-control filter (hIL6 recipe); high end with only the raw z-test. The hIL6 10/10 result is consistent with the low end for selected high-count clones only.

**False negatives.** Non-binder = share fell at p <= 0.05; shares are compositional, so any clone captured below the pool average falls. Among truly HER2-specific clones, I estimate 30-60 % are not labelled binder (most sit in the ~97 % non-significant mass). Among labelled non-binders, the share that actually bind HER2 is probably 5-25 %. Causes: low abundance (no power), low display/expression, steric or orientation loss on beads, single-round dilution.

## Forced analogy: forensic chain of custody
(a) Each handoff is an evidence transfer that can add contamination (foreign signal) or tampering (systematic shift). (b) Testable idea: compute a per-clone custody-risk score from sequence features (internal CTGCAG / GGTNACC sites, amber TAG, Cys count, Arg-rich or very hydrophobic CDR3, His-rich motifs, framework family as expression proxy, input read count), down-weight high-risk rows when learning interface signal, and test whether Track A PR-AUC on held-out clusters changes. (c) The analogy holds well for itemising biases per step and breaks because the unit here is a compositional read share and the "tampering" is stochastic, so a noise model beats binary exclusion.

### Chain-of-custody table (magnitudes are mine unless cited)
| # | Handoff | Contamination / tampering risk | Bias type | Estimated magnitude |
|---|---|---|---|---|
| 1 | Immunisation (one alpaca, WT HER2) | immune dominance, self-reactive deletion, timing and body-site effects | repertoire | affects presence; hIL6 notes binder probability varies with time/site |
| 2 | RNA, cDNA, PCR (CALL001/002, ~700 bp, nested PCR) | primer mismatch, chimeras, PCR drift | amplification/sampling | unquantified |
| 3 | pMES4 cloning (PstI/BstEII), TG1 electroporation | internal sites cut clones, toxic/non-expressed clones lost, fast growers favoured | pre-selection | unquantified |
| 4 | pIII display (helper rescue) | display tracks expression, proteolysis | display/expression | rho 0.88 (scFv); multi-fold share differences plausible |
| 5 | Antigen immobilisation (ECD, GACQ-His, beads) | denaturation, orientation, tag occlusion, avidity, His-binders | epitope/avidity | changes label meaning; not inferable |
| 6 | Wash | stringency untuned; plastic/BSA/streptavidin TUPs | non-specific retention | no % for VHH |
| 7 | Elution | protease/acid damage | selective loss | unquantified |
| 8 | TG1 amplification | parasitic clones, RBS/origin mutations | growth advantage | peptide: >1e-4 clones ~35 % bulk vs <1 % emulsion; one clone 95 % of eluate (CD4) |
| 9 | NGS PCR | jackpotting, template switching | quantitation | 1.25-1.5x Poisson variance |
| 10 | Sequencing and test | error near-duplicates, min-p, uncorrected multiple testing, compositionality | statistical | dominant FP source in budget |

## Gotchas / what could fool us
1. "Non-binder" is not evidence of non-binding; shares are compositional.
2. z-test assumes iid sampling; real variance is larger, so p <= 0.05 is anti-conservative.
3. Read count drives power, so a model can learn "abundant, germline-like VHH" instead of epitope.
4. Clonal families share labels; random splits leak. Cluster-split at >=90 % identity.
5. hIL6 used min-p across 12 sublibraries; HER2 handling unknown.
6. GACQ-His construct: anti-His/Ni-NTA binders give HER2-unrelated labels.
7. Residue-level truth exists for only three cryo-EM complexes; panning data cannot give residue-level information.
8. PCR/sequencing errors and chimeras can appear as novel "binders".

## Implications for the challenge
1. Treat binder labels as noisy weak supervision (~10-40 % wrong positives, large false-negative mass); use soft labels or loss correction.
2. Do not use non-binder rows as hard negatives.
3. Test whether label is predictable from input read count and custody-risk features; remove that signal before claiming "folding from binding".
4. Split by sequence cluster, not by row.
5. Expect no domain-level epitope information from labels; use structure-based priors (AF3-class docking) for epitope and the data mostly for paratope/binder priors.
6. Sanity-anchor with known HER2 VHH epitopes (2Rs15d domain I, 5F7 domain IV).
7. Obtain the HF dataset card (401 here) and check for a no-antigen control and read-count floor.

## Open questions
- Does AVIDa-hHER2 have a no-antigen negative sample and use min-p across libraries?
- Real titre ratios for these pMES4 VHH single rounds.
- Is label AUC from input abundance alone above 0.5?
- Any ELISA/BLI validation rates for HER2 labels (none found).

## Sources (opened)
- https://arxiv.org/pdf/2306.03329 (AVIDa-hIL6, full text extracted)
- https://arxiv.org/pdf/2405.18749 (AVIDa-SARS-CoV-2, full text extracted)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3919620 (Matochko 2013, first 100k chars)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11431649 (Sell 2024, doi 10.3390/cimb46090627)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6259164/ (Vodnik 2011, first 100k chars)
- Search-result summaries only (medium confidence): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2630973/ (Scott 2008), https://aacrjournals.org/clincancerres/article/23/21/6616/260027/131I-labeled-Anti-HER2-Camelid-sdAb-as-a, https://www.nature.com/articles/s41598-022-07006-9, https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0288259&type=printable
- Attempted, failed (HTTP 401): https://huggingface.co/datasets/COGNANO/AVIDa-hHER2
