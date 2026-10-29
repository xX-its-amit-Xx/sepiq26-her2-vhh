---
title: Alpaca VHH germline, somatic hypermutation, immunisation protocol and the AVIDa-hHER2 data generation
queen: q2_vhh_immunology_structure
king: king_world
worker: camelid_hcab_biology_alpaca_germline_ighv_genes_and_immunisation_response
tier: expert
tags: [alpaca, VHH, IGHV, germline, somatic-hypermutation, disulfide, AVIDa, HER2, IgBLAST, restoration-analogy]
confidence: medium
challenge_relevance: 3
serendipity: Art-restoration analogy (germline = original panel, SHM = overpaint, binding data = technical imaging). Partially holds for the framework and CDR1/CDR2 scaffold, but is NOT shown to mark contacts; no source I opened tests mutation density against contact residues. Declared untested rather than dead.
date: 2026-10-17
---

# TL;DR
A VHH is built from a small set of germline IGHV genes (about 88 V genes in the alpaca locus, with a handful dominating usage), so "distance from germline" is cheap to compute but mostly tells you which germline family a clone uses, not where it binds. The AVIDa-hHER2 data come from ONE alpaca, several immunisation timepoints, phage display, one panning round (per the sibling AVIDa-hIL6 method), and enrichment-derived labels. No source I opened shows that mutation density marks contact residues, so the restoration analogy is only partly supported and still untested.

Several premises in the brief did not verify; see Gotchas ("Citation corrections").

# 1. Germline genes and hallmarks

| Item | Value | Source (opened) |
|---|---|---|
| Locus | Single IgH locus on alpaca chromosome 4: VHH and VH genes intermixed, one D-J cluster, CH and CHH (CH1-lacking) constant genes | Achour 2008 J Immunol 181:2001 (abstract via search result only) |
| V/D/J gene count | 88 IGHV (incl. 4 pseudogenes), 8 IGHD, 7 IGHJ, attributed to Achour 2008 | Tu 2020 (PMC7450171) |
| IgBLAST reference used by Tu 2020 | 84 functional V, 8 D, 7 J from the IMGT antibody repertoire db; IGHJ1*01 excluded (all false positives) | Tu 2020 |
| Hallmark-bearing V genes | 17 V genes carry >=2 FR2 hallmarks (Kabat F37, E44, R45, G47), all in an IgHV3 sub-cluster, >85% of V usage; top 5 = 85.54% of V usage | Tu 2020 |
| Hallmark-free V genes | about 10% of V usage; IGHV3S39*01 is about 60% of that | Tu 2020 |
| Dominant germlines in structures (n=385 unique VHH) | IGHV3-3 n=175, IGHV3S53 n=106; third family IGHV3S61/3S65/3S66 carries an extra CDR-H2 Cys | Bahrami Dizicheh 2023 (PMC10439903) |
| Hallmark by germline (FR2 positions 37/45/47) | IGHV3-3: F37, E45, F47. IGHV3S53: Y37, Q45, L47 | PMC10439903 |
| CDR-H3 conformation by germline | 82% of IGHV3-3 structures kinked, 75% of IGHV3S53 extended; overall 58% kinked / 29% extended; AlphaFold on repertoire sequences: >95% kinked (3-3), 90% extended (3S53) | PMC10439903 |
| VHH tetrad vs VH | Nb: F37 (VH V), E44 (VH G), R45 (VH L), F/L/W/G47 (VH W); VHH from the IGHVH family, likely an IGHV3 duplication | Mitchell & Colwell 2018 (PMC6033041) |

Gaps (not verifiable from what I opened): (a) the exact count of "functional VHH-family" IGHV genes. Tu 2020's 17 hallmark-bearing genes is the closest defensible number; Achour's own VHH/VH split was not seen. (b) Frequencies at IMGT 42 F/Y, 49 E/Q, 50 R, 52 G/F/L. Kabat 37/44/45/47 correspond roughly to IMGT 42/49/50/52 and the papers above report hallmark identity by germline, but no percentage table for those four IMGT positions was found. (c) IMGT/GENE-DB pages for Vicugna pacos could not be fetched (HTTP 400). (d) VicPac3.1 was not opened.

# 2. Somatic hypermutation and CDR germline content

| Quantity | Value | Source |
|---|---|---|
| Substitution rate per VJ lineage, alpaca | 12% to 22% (Tu Table S2) | Tu 2020 |
| Hallmark vs non-hallmark families | no significant difference in aa substitution rate | Tu 2020 |
| Per-region (CDR vs FR) mutation rate | NOT reported | Tu 2020 |
| Indel hotspot | Gly insertions 20.78% and Ala insertions 12.18% at the tips of CDR1 and CDR2 loops | Tu 2020 |
| Most-substituted germline residues | F, A, S, D; most often introduced: A, S, G, D | Tu 2020 |
| Samples | naive: 3 alpacas; immune: 1 donor after 5th and 7th immunisation; unique aa sequences 1.27 to 1.97 M (naive), 0.78 and 1.15 M (immune) | Tu 2020 |
| Fridy 2014 (llama) | NO SHM counts. Identical CDR3 occurs in VHHs with different CDR1/CDR2, attributed to somatic gene conversion, unquantified | PMC4272012 |
| Bactrian camel HCAb | higher nucleotide mutation rate than conventional, cited secondhand in Tu | Tu 2020 |

"Mean mutations per VHH" after immunisation is not available from sources I opened. A 12 to 22% rate on about 120 aa would be roughly 15 to 25 substitutions, but that is my arithmetic, the rate definition (nt vs aa, V region only) was not checked, so low confidence. CDR3 is junction-encoded and has no germline sibling; CDR1/CDR2 are germline-encoded and then edited.

# 3. Immunisation protocols and enrichment

| | Fridy 2014 (llama, GFP/mCherry) | AVIDa-hIL6 (NeurIPS 2023, alpaca) | AVIDa-hHER2 (SEPIQ training data card) |
|---|---|---|---|
| Dose | 5 mg per injection | 600 ug antigen cocktail | not stated on card |
| Adjuvant | CFA prime, IFA boosts | Titermax | not stated |
| Schedule | prime + 3 boosts at 3-week intervals; serum 10 d after last; sampling 50 to 70 d | 4 injections about 2 weeks apart; blood + at least one lymph node after each = 12 libraries | alpaca "Marin"; Mother Libraries B and C; "repeated immunostimulation" |
| Immunogen | recombinant GFP-His6 / mCherry-His6 | cocktail of WT IL-6 + 30 Ala mutants (31 proteins) | HER2 ECD, C-terminal His tag, full sequence on card |
| Library | bone marrow plasma cells, MS-based, no display | pMES4 phagemid, TG1, >10^7 cfu/uL, one round biopanning on magnet beads, 408 sublibraries | pMES4 and one round per the brief; panning rounds NOT specified on card |
| Reads | about 800k unique (454), about 3 M (MiSeq) | about 100,000 paired reads per library, MiSeq 2x300; singletons removed | 1,843,875 unique VHH sequences; USEARCH 93% clusters |
| Outcome | 31 specific nanobodies (25 LaG, 6 LaM), 57 to 75% single-step hit rate, 16 LaGs <=50 nM | 573,891 pairs: 20,980 binding / 552,911 non-binding | few hundred labelled (per brief) |

AVIDa-hHER2 specifics from the SEPIQ-2026 dataset card: target HER2 ECD amine-coupled to beads (Her2, Her2_C1, Her2_C2); competition sublibraries with trastuzumab (C1, C2, C3), pertuzumab (C3), rabbit mAb D8F12 / CST #4290 (C3), competition signal only for Mother Library B; controls NC1 (Protein G beads, no HER2), NC2 (anti-HA on Protein G + HER2), NC3 (BSA beads), comparator proteins; experiment phases 1st/2nd; 4C and 37C; labels by chi-square on abundance change (IE-score = common log p; positive threshold 1.3, negative -1.3, background threshold -3, target-vs-background difference >2; -500 floor), classes Yes/Not/noise/non-sig.; columns `#ONU ID, Total, Sequence, Label, Binary Label, Cluster, #Cluster, Cluster size`; 626 MB; gated, license "other". The card says the HER2 may form dimers under experimental conditions.

I could not find a standalone "AVIDa-hHER2" NeurIPS paper. The NeurIPS 2023 Datasets paper is AVIDa-hIL6 (Tsuruta et al., arXiv 2306.03329); AVIDa-SARS-CoV-2 is NeurIPS 2024 (arXiv 2405.18749). The "AVIDa-hHER2" paper is unverified. Exact HER2 dose/adjuvant/boost count: unverified. Expected clonal expansion: not quantified in any opened source; Fridy only gives a 57 to 75% hit rate for pre-selected sequences.

# 4. Extra disulfide bond

| Claim | Value | Source |
|---|---|---|
| Fraction of VHH with an extra disulfide | about one quarter overall (cites Mitchell & Colwell 2018 plus two others) | PMC11509895 (secondhand) |
| Most common pair | CDR1-CDR3 (IMGT C33-C102); extra bridges almost always involve CDR1, rarely FR2/CDR2 | PMC11509895 |
| Species split: germline C33 about 30% camel, about 12% alpaca, about 3.5% llama; llama/alpaca more often CDR2-CDR3 | **unverified**: from a review snippet, primary not opened | search result only |
| Alpaca germline family with CDR-H2 Cys | IGHV3S61, 3S65, 3S66 | PMC10439903 |
| Does it improve stability/affinity? | Govaert 2012 says yes; Mendoza 2020 found no difference | PMC11509895 |

Mitchell & Colwell 2018 (Proteins 86:697, doi 10.1002/prot.25497, not prot.25594) does not report the disulfide fraction in the text I fetched. Govaert 2012 itself was not opened.

# 5. Binder predictors, convergence, one-animal caveat
Opened evidence: Mitchell & Colwell analysed 90 nonredundant Nb-antigen structures (60 llama, 24 camel, 6 alpaca): 18.76 contact residues per VHH, 50 conserved paratope positions (present in >10% of structures), five of which touch VL in conventional antibodies; framework positions 14, 37, 44, 45, 47, 92, 117 are more variable in Nb than Ab. Tu: classical VHH have longer CDR3 than non-classical ones. Zavrtanik 2018 JMB was NOT found, so I make no claim about it. No opened source gives clonal-family fractions or cross-animal convergence numbers. Implication: one animal means no convergence test. Enrichment can be driven by bead or Protein G stickiness (hence NC1 to NC3), and labels are statistical, not biophysical.

# 6. Germline-distance recipe (ONU11/ONU13/ONU23)
- No ready-made alpaca IGHV FASTA was located on any page I opened. Source of record is the IMGT repertoire (Tu 2020 used 84 functional V + 8 D + 7 J from it), obtainable from IMGT/GENE-DB; I could not open it.
- Recipe: (1) export Vicugna pacos IGHV, IGHD, IGHJ FASTA from IMGT/GENE-DB (gapped IMGT V-REGION preferred); (2) build an IgBLAST custom germline database with makeblastdb (IgBLAST built-ins are human, mouse, rat, rhesus); (3) run IgBLAST on the three VHH sequences, as Tu 2020 and Bahrami 2023 did with the IMGT alpaca set; (4) IMGT-number with ANARCI (a numbering tool; its docs advise against using it as the primary species/germline caller); (5) per-position mismatch to the best V allele = germline distance. abnumber with alpaca germlines was not verified.
- Caveat: the alpaca germline set is incomplete and polymorphic, so the best-hit "germline" can itself be a mutated allele.

# Anti-HER2 nanobodies (queen extra)

| Nanobody | PDB | Epitope domain | Affinity | Source | Status |
|---|---|---|---|---|---|
| 2Rs15d | 5MY6 (X-ray 2.25 A; chain A HER2 622 aa, chain B Nb 115 aa; deposited 2017-01-25; dromedary-derived per PDBj snippet) | domain I; does not compete with trastuzumab/pertuzumab | 4.5 +/- 0.8 nM ([125I]SGMIB), 7.1 +/- 0.4 nM ([18F]RL-I) on BT474M1 cells; 4.74 +/- 0.39 nM ([131I]SGMIB) | D'Huyvetter 2017 Clin Cancer Res 23:6616; RCSB 5MY6; PMC5662479 | verified (radiolabelled-cell values) |
| 5F7 | none found | C-terminus of domain IV, blocked by trastuzumab | not found | PMC5662479 (secondhand) | PDB unverified |
| A9B5 | none found | domain I (search snippet) | not found | PMC10634241 (not opened) | unverified |
| 47D5 | none found | none found | none found | none | unverifiable |
| R3B23 | n/a | non-HER2 control sdAb | n/a | PMC5662479 | control, not an anti-HER2 binder |

The only HER2-VHH PDB entry I confirmed is 5MY6. 6OGE is HER2 with trastuzumab and pertuzumab Fabs (cryo-EM 4.36 A), not a nanobody.

# Forced analogy: art restoration
(a) Germline = pristine panel; SHM = overpaint; binding assay = technical imaging; mutation density = XRF map of retouches.
(b) Testable ideas. (i) Feature = per-position mismatch to the best germline V (framework and CDR1/CDR2 only); test PR-AUC on solved VHH-antigen complexes in SAbDab-nano (including 5MY6) against a position-prior baseline. (ii) CDR3 is junction-made and has no pristine sibling: treat it as always-overpainted, a high base prior. (iii) Hallmark-conserved FR2 positions are the frame and should be down-weighted.
(c) Verdict: PARTIALLY holds for scaffold reconstruction (a germline sibling reconstructs the framework and most CDR1/CDR2 scaffold; 17 hallmark genes carry more than 85% of usage, so germline is low-entropy). For marking the paratope it is UNTESTED: Tu 2020 gives no per-region SHM rates and no opened paper correlates mutation density with contacts in any complex. Mechanistic doubts: Gly/Ala insertions at CDR1/CDR2 loop tips are also generic hotspots rather than binding signals; gene conversion (Fridy) shuffles CDR1/CDR2 independent of antigen; and the library mixes several immunisation timepoints, so the "overpaint" is a blend. Not dead, but unsupported; worth one cheap test.

# Gotchas
1. Citation corrections: the 2010 promiscuous-class paper is Nguyen/Hamers/Wyns/Muyldermans (J Immunol 184:5696, doi 10.4049/jimmunol.0903722), not "Deschacht". Fridy 2014 is doi 10.1038/nmeth.3170 (not nmeth.2988) and uses MS plus NGS, not phage display, and reports no SHM. Mitchell & Colwell is 10.1002/prot.25497.
2. "88 IGHV" includes conventional VH genes and 4 pseudogenes; it is not a VHH-only count.
3. Hallmarks are not required for heavy-chain-only function (PMC10439903): hallmark absence does not mean conventional VH.
4. Germline family strongly predicts CDR-H3 conformation (kinked vs extended), so distance-from-germline partly proxies family, a confounder.
5. Labels are chi-square enrichment from one round; bead/Protein G/BSA binders and display or expression bias contaminate; NC2 cannot exclude HER2 adsorption by anti-HA.
6. The card gives no panning-round count; "one round" is from the sibling AVIDa-hIL6 method and the brief.
7. IgBLAST has no alpaca built-in; a custom set mis-assigns silently.

# Implications for the challenge
1. Compute per-residue germline mismatch for ONU11/13/23 with an IgBLAST custom IMGT alpaca set; use as one VHH-side feature, validated on 5MY6 and SAbDab-nano alpaca/llama structures before trusting.
2. Give CDR3 a high base paratope prior regardless of mutation; down-weight FR2 hallmark positions.
3. Use the card's USEARCH 93% clusters and sibling enrichment (same CDR3, different CDR1/2) as clonal-family features; cross-animal convergence is impossible with one animal.
4. Use the competition sublibraries (trastuzumab, pertuzumab, D8F12; Mother Library B) to bias the antigen-side epitope domain; 2Rs15d (domain I) shows VHH need not compete with trastuzumab/pertuzumab.
5. Ask the organisers or COGNANO for the exact HER2 immunisation protocol if it matters; do not cite one.

# Open questions
- Exact Vicugna pacos VHH vs VH IGHV counts in IMGT/GENE-DB (release date).
- Per-region SHM rates for alpaca VHH; any complex where mutation density predicts contacts.
- Govaert 2012 and Zavrtanik 2018 primary numbers.
- Does a standalone AVIDa-hHER2 paper exist?

# Sources
Opened:
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7450171 (Tu 2020, Immunology 161:53, doi 10.1111/imm.13224)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10439903/ (Bahrami Dizicheh 2023, Commun Biol)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6033041 (Mitchell & Colwell 2018)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4272012 (Fridy 2014)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11509895/ (extra disulfide analysis)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5662479 (D'Huyvetter 2017; 2Rs15d, 5F7)
- https://www.rcsb.org/structure/5my6
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data
- https://papers.neurips.cc/paper_files/paper/2023/file/8339dacd9df7ffe9623760f74169dd1e-Paper-Datasets_and_Benchmarks.pdf and https://arxiv.org/abs/2306.03329 (AVIDa-hIL6)

Search-result snippets only (not fully opened): Hamers-Casterman 1993 (pubmed.ncbi.nlm.nih.gov/8502296, Nature 363:446); Achour 2008 (PMID 18641337); Nguyen 2010 (doi 10.4049/jimmunol.0903722); NCBI IgBLAST page; ANARCI on PyPI; PDBj 5MY6/6OGE.
