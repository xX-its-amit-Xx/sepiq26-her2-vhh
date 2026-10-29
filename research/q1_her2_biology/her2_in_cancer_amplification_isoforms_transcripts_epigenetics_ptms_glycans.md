---
title: HER2 ectodomain as a surface niche - isoforms, glycans, variants, cancer biology and a per-residue habitat mask
queen: q1_her2_biology
king: king_world
worker: her2_in_cancer_amplification_isoforms_transcripts_epigenetics_ptms_glycans
tier: expert
tags: [HER2, ERBB2, P04626, glycosylation, isoforms, gnomAD, cBioPortal, PDB, epitope-mask, habitat-suitability]
confidence: medium
challenge_relevance: 4
serendipity: Ecology habitat-suitability modelling - treat glycans, isoform deletions and variants as disturbance layers; paid off as a concrete per-residue prior (her2_ecd_habitat_mask.json) and a surprising finding that 147 of 341 exposed ECD residues have never been in any public antibody/binder contact.
date: 2026-10-17
---

# HER2 ectodomain: isoforms, PTMs, glycan shielding, variants, cancer context

**TL;DR (anyone).** HER2 is a protein that sits on cell surfaces; in some cancers (roughly 1 in 8 to 1 in 5 breast tumours, depending on the dataset) the cell makes far too many copies, which is why antibody drugs target it. The outside part (the ectodomain, residues 23-652) carries seven sugar attachment points; only two or three of them sit near where known drugs bind, so most of the surface is open to an antibody. For the challenge, the useful output is a per-residue "which spots are shielded, mutated or never seen binding" table, provided here as JSON.

All numbers below come from calls I ran on 2026-10-17 (UniProt REST, RCSB search/GraphQL/mmCIF, Ensembl REST, gnomAD GraphQL v4, cBioPortal REST) or from papers I opened; anything else is flagged **unverified**. Working files: `C:\Temp\sepiq26\w_glyco\` (scripts `C:\Temp\sepiq26\q1_*.py`).

Residue numbering everywhere is **UniProt P04626, including the 22-aa signal peptide** (signal 1-22; ECD 23-652; TM 653-675), the same as the challenge.

## 1. Isoforms (UniProt P04626, REST JSON + isoform FASTA lengths)

| Isoform | Length (fetched) | What differs from canonical | ECD effect |
|---|---|---|---|
| P04626-1 (canonical, HER2/ERBB2) | 1255 | - | full ECD 23-652 |
| -2 "CTF-611" | 645 | alt. initiation at Met611 (VSP_039249 deletes 1-610) | ECD keeps only 611-652 (stub); this is the p95-type fragment, no epitope for any known antibody |
| -3 "CTF-687" | 569 | alt. initiation at Met687 (deletes 1-686) | no ECD |
| -4 | 1240 | residues 1-23 `MELAALCRWGLLLALLPPGAAST` replaced by `MPRGSWKP` | N-terminus/signal region; residues 24+ intact |
| -5 | 1225 | residues 1-30 deleted | removes signal + 8 mature residues (23-30) incl. disulfide partner Cys26 |
| -6 "B" | 888 | del 633-648; del/replace 771-883 (kinase); alt. C-term 884+ | **16-aa deletion 633-648 at the ECD-TM junction** (same size as the 48-bp exon-16 cassette, below) |

- **Delta16 / exon 16 skipping:** I found no UniProt entry named delta16. Literature (Jackson et al., Int J Cell Biol 2013, doi:10.1155/2013/973584, opened) says exon 16 is a 48-bp cassette exon encoding a small ECD region, loss removes ECD cysteines and favours disulfide-linked homodimers; the paper gives no residue numbers. That 48 bp = 16 aa matches UniProt isoform 6's 633-648 deletion, but equating them is **my inference, unverified**. Disulfides 626-634, 630-642 (UniProt) span this segment (Cys630 and Cys634 inside; Cys642 just beyond), consistent with "cysteines lost".
- **Herstatin (intron-8 retention):** secreted, ECD-only with a novel 79-aa C-terminus (same Jackson review). Not in UniProt; exact breakpoint residue not obtained (**unverified**; expect it to follow the domain I-II exon boundary, not checked).
- **p95 (alt. initiation vs shedding):** 95-105 kDa ECD-truncated forms arise from alternative splicing, proteolysis or alternative initiation (Jackson review). UniProt supports Met611 and Met687 as alternative start sites.
- **Ensembl 'ERBB2' translation 603 aa (ENST00000584014, ENST00000578199, 18 exons)** is a protein-coding, ECD-only-length product, likely the herstatin/ECD-secreted family (identification unverified).
- **Antigen identity:** the challenge antigen is stated to be the human HER2 ECD, UniProt numbering with signal peptide, i.e. canonical isoform 1 ECD (23-652) with a C-terminal GACQ+His tag (BRIEF.md). Nothing I retrieved describes AVIDa-hHER2's exact construct, so "canonical 1255 aa, ECD 23-652" is confirmed only from the challenge text. The three public VHH-HER2 structures I mapped (below) all use canonical sequence.

## 2. PTMs on the ECD

**UniProt P04626 CARBOHYD (all "N-linked GlcNAc", Asn): 68, 124, 187, 259, 530, 571, 629 (seven).** The expected list is confirmed exactly. **Disulfides (25 in ECD, UniProt):** 26-53, 162-192, 195-204, 199-212, 220-227, 224-235, 236-244, 240-252, 255-264, 268-295, 299-311, 315-331, 334-338, 342-367, 475-504, 511-520, 515-528, 531-540, 544-560, 563-576, 567-584, 587-596, 600-623, 626-634, 630-642. Only other ECD feature: Phospho-Thr182 (UniProt). **PhosphoSitePlus was not queried** (not opened; **unverified** whether it adds ECD sites). Mutagenesis 317-318 reduces ERBB3 dimerisation (UniProt).

**Domain boundaries used here (derived):** I 23-217, II 218-341, III 342-510, IV 511-629, juxtamembrane 630-652. These are the Cho et al. 2003 mature-numbering boundaries (I 1-195, II 196-319, III 320-488, IV 489-607, recalled from memory, **paper not opened**) shifted by +22. Support: InterPro Pfam on P04626 (REST, opened): Recep_L 52-172, Furin-like 190-343, GF_recep_IV 511-642. Epitopes agree (trastuzumab contacts 579-627 = domain IV; pertuzumab 258-337 = domain II).

### Glycosites: occupancy by MS (recombinant sErbB2) and what cryo-EM/X-ray models show

Fujitani et al., Glycobiology 34(3):cwad100 (2024), doi:10.1093/glycob/cwad100 (opened; numbers via page summary, Table 1; the page was truncated, so treat as medium confidence). His-tagged sErbB2 from HEK293 vs CHO. "Unmodified" = non-glycosylated fraction.

| Site | Domain | Unmodified HEK/CHO (%) | Glycan class | Sialylation HEK/CHO (%) | PDB models with glycan on this Asn (of 27 ECD entries with any) |
|---|---|---|---|---|---|
| N68 | I | 0 / 0 | complex (HEK tri-antennary 66%, CHO bi-antennary 90%) | 2.9 / 41.8 | 10 |
| N124 (N125 minimal) | I | 0.1 / 7.6 (reported 99.9 / 92.4 glycosylated) | complex | 15.9 / 71.2 | **0** |
| N187 | I | 74.5 / 84.5 (low occupancy) | complex | 30.2 / 49.0 | 16 |
| N259 | II | 0.8 / 3.0 | **high-mannose only** | 0 / 0 | 28 chains (most common) |
| N530 | IV | 17.5 / 6.5 | complex, least fucosylated | 10.6 / 43.3 | 11 |
| N571 | IV | 0 / 0.3 | complex | 36.7 / 76.9 | 9 |
| N629 | IV/JM | 8.7 / 24.7 | complex | 30.1 / 67.7 | 1 (6OGE) |

- **Host matters:** structure class correlates across hosts (r^2 > 0.944), HEK sialylation < half of CHO, branching differs at N68 (r^2 0.022) and N187 (0.354). Insect (Sf9/High Five, paucimannose) expression: **no HER2 data found** (not searched beyond the first pass; unverified). AVIDa-hHER2 antigen host: **not found** (web search returned nothing for AVIDa-hHER2; the closest COGNANO dataset, AVIDa-hIL6, arXiv:2306.03329, names no host in the snippet). Ask organisers / read the AVIDa-hHER2 paper.
- Duarte et al., Oncogene 40:3719 (2021), doi:10.1038/s41388-021-01801-w (opened): in NCI-N87 gastric cells ST6Gal1 sialylates **N530 and N629** (domain IV, trastuzumab domain); N124, N187, N259 carried only high-mannose in that dataset (conflicts with Fujitani's complex glycans at N124/N187: cell line vs recombinant, tissue vs soluble). ST6GAL1-KO cells were more trastuzumab-sensitive.
- **Cryo-EM/PDB glycan chains (my parse of struct_conn covale ASN-ND2 to NAG, mapped to P04626 by sequence anchoring):** every model shows only a single GlcNAc stub; no branched glycan was parsed. Entries with most sites: 6OGE (cryo-EM, 4.36 A) has 68/187/259/530/571/629; 8PWH, 8Q6J (cryo-EM, 3.17/3.3 A) and 8U4K/8U4L (HER4 complexes) have 68/187/259/530/571; HER3 complexes 7MN5/6/8 have 187/259/530 only. **N124 is never modelled in any entry.** The user-listed ids check out as: 6J71 = X-ray (2.918 A, HuA21 scFv; **not cryo-EM**; only N259), 7MN5 and 7MN8 = cryo-EM (2.93, 3.45 A), 7MN6 = S310F cryo-EM (3.09 A).

## 3. Glycan shielding and the exposed patch

Method (mine, approximate): HER2 chain E of 8Q6J (cryo-EM 3.3 A, residues 23-646, Fabs removed, no glycans modelled in SASA) -> Shrake-Rupley SASA (probe 1.4 A, 92 pts) -> relative to Tien-2013 theoretical max; "exposed" = RSA >= 0.2. Shield zone = C-alpha within 10 A (or 15 A) of any glycosite ND2 (crude proxy for a mature N-glycan reach; 15 A is generous).

| Quantity | Value |
|---|---|
| ECD residues modelled in 8Q6J | 624 of 630 (647-652 absent) |
| Exposed (RSA >= 0.2) | 341 |
| Exposed within 10 A of a glycosite | 51 (15 %) |
| Exposed within 15 A of a glycosite | 119 (35 %) |
| Exposed and glycan-free at 15 A | 222 (65 %) |
| Per domain exposed: I / II / III / IV / JM | 92 / 83 / 74 / 81 / 11; within 10 A: 17 / 10 / 0 / 20 / 4 |
| Trastuzumab epitope window 579-626: exposed 35 | within 10 A of glycan 2 (6 %), within 15 A 12 (34 %) |
| Pertuzumab window 258-337: exposed 58 | within 10 A 7 (12 %), within 15 A 15 (26 %) |

Reading: **domain III is essentially glycan-free (0 of 74 exposed residues within 10 A, 4 within 15 A)**; N530/N571/N629 bracket domain IV and N259 sits right at the pertuzumab (domain II) edge, N68/N124/N187 on domain I. Trastuzumab's epitope (579-627) lies between N571 and N629 and is partly shielded in the 15 A sense, which matches the sialylation-sensitivity story above. Caveat: one conformer (extended, Fab-bound); the compact conformation in 9QBF (3.8 A) would change DI/DIII exposure.

## 4. Cancer biology (layman: 3 sentences)

Some cancers make 20 to 100 times too many HER2 copies by duplicating a stretch of chromosome 17. This shows up in about 1 in 8 breast tumours in the big public TCGA set, in about 1 in 7 stomach tumours and 1 in 6-7 oesophageal tumours, and rarely elsewhere. Doctors now also treat tumours with low but non-zero HER2, so a binder that sees HER2 at low density has real clinical value.

**Amplification (cBioPortal, TCGA PanCancer Atlas, GISTIC=+2, my REST calls):** across 10,712 CNA-profiled samples in 32 studies, 362 amplified (3.4 %). Top: ESCA 28/182 (15.4 %), STAD 58/438 (13.2 %), BRCA 123/1070 (11.5 %), UCS 5/56 (8.9 %), CESC 5.5 %, BLCA 5.4 %, UCEC 5.2 %, PAAD 4.9 %, COADREAD 3.4 %, LUSC 2.5 %, OV 2.3 %; lung adeno 1.8 %; many tumour types 0. The conventional "15-20 % of breast cancer" is higher than GISTIC +2 in TCGA (11.5 %), because the clinical definition is IHC 3+ or ISH-based and cohort mixes differ; I could not open the ASCO/CAP paper (HTTP 403) so that range is **not tied to a document I opened**. Secondary summaries of Wolff et al. JCO 2018 (doi:10.1200/JCO.2018.77.8738; via search results only) say IHC 2+ is weak-to-moderate complete membrane staining in >10 % of cells, and that ISH groups 2-4 (about 5 % of cases) need concomitant IHC review.

**HER2-low:** IHC 1+, or IHC 2+ with negative ISH (Modi et al., DESTINY-Breast04, NEJM 2022;387:9-20, doi:10.1056/NEJMoa2203690, via PubMed abstract in search).

**Receptors per cell:** no single authoritative value. Flow/QIFI tables from search snippets: BT-474 about 0.48 x 10^6 (QIFI) to 2.75 x 10^6 (microsphere calibration); SK-BR-3 about 1.77 x 10^6 (QIFI, extrapolated); ranges 0.5-3 x 10^6 depending on the assay. I did not open these papers, so citations are **unverified** (search result pages: PMC5524165, PMC3064190). "About 10^6 per HER2-3+ cell" is order-of-magnitude supported only.

## 5. Gene structure and regulation (modeller-only)

- ERBB2: chr17q12 (GRCh38 17:39,687,914-39,730,426, + strand), Ensembl ENSG00000141736; canonical **ENST00000269571 (ERBB2-201): 27 exons, 1255 aa, ENSP00000269571**. Ensembl REST listed 50+ transcripts (e.g. ERBB2-217 ENST00000584601 31 exons 1225 aa; -205 ENST00000578502 28 exons 1294 aa; -214/-203 ECD-length 603 aa; -202 ENST00000445658 979 aa). **MANE Select was not returned by the Ensembl REST lookup (field None); I did not confirm it, expected to be ENST00000269571 (unverified).**
- 17q12 core amplicon co-amplifies STARD3, TCAP, PNMT, PGAP3, ERBB2, GRB7 (ESMO 2020 abstract 1993P via search); STARD3 overexpression stabilises HER2 via HSP90. **Promoter methylation, enhancer and super-enhancer regulation of ERBB2: search returned nothing; not answered (unverified).** For a modeller: expression level of the antigen on immunisation cells is irrelevant here; antigen is a soluble recombinant ECD.

## 6. Natural and somatic ECD variation

**gnomAD v4 (GraphQL, canonical ENST00000269571, missense, residues 23-652; exome + genome allele counts summed, may double-count overlapping samples):** 790 ECD missense variants over 450 of 630 positions (71 % of positions). Common ones: A386D (AC 6413; domain III), W452C (3990; III), P489L (1180; III/IV), E79A (907), R47H (752), P523S (633), R143Q (561), L145F (417), G243S (208), R536Q (208). All seven glycosites have missense neighbours: N68Y/S, N124K, N187S/K, N259S/I, N530S, N571Y, N629D/T/K (sequon-destroying or Ser/Thr-neutral; allele counts in the JSON).

**Somatic (cBioPortal TCGA PanCancer, 321 mutated samples, ECD missense):** **S310F 37, S310Y 5** (domain II; with other S310 changes, 43 at position 310), G222C 3, R103Q 2, E280Q 2, R143Q 2, R47H 2, E207D 2, G603C 2; all else singletons. S310F/Y sit in domain II, beside the pertuzumab/dimerisation arm: S310F is a gain-of-function ECD variant that forms HER2 homodimers and binds HER3 (PDB 7MN6, 8VQE; 8VQD TL1 Fab; 9L1S pertuzumab with S310F). In epitope terms, residue 310 is in the pertuzumab heavy-chain contact set from my 1S78 computation (307-310, 312, 314, 316-319, 333), so S310 lies within the pertuzumab/dimer-interface footprint. ClinVar and COSMIC were **not queried** (unverified).

## 7. Glycan/PTM heterogeneity and the alpaca VHH repertoire

No paper I found tests how immunogen glycoform heterogeneity shapes a VHH repertoire (searches returned only: E. coli-produced HER2 subdomains raised antibodies that did not recognise native HER2, attributed to missing PTMs/conformation). Inference only: (a) N259 is a near-uniform high-mannose, almost fully occupied site at the domain II edge, so it is a stable obstacle; (b) N187 is 75-85 % unoccupied in recombinant sErbB2, so a glycan-free population of the same peptide exists in the immunogen, and the other six sites are heterogeneous in sialylation/branching (HEK vs CHO) which a VHH's small footprint can tolerate as a glycan-adjacent contact; (c) the public structures show binders next to glycans: the HER2 nanobody 2Rs15d contacts domain I residues 109-217 (N124 flank), 27A05 and 29E09 contact 35-90 plus 378-500, yet no public complex includes N-glycan atoms in the interface (only one NAG stub is ever modelled). So glycan occlusion near the epitope is a prior, not a rule.

## Residue-indexed table (key positions; full 630-row table in JSON)

Full machine-readable file: `research/q1_her2_biology/her2_ecd_habitat_mask.json` (per residue: aa, domain, RSA, nearest glycosite and CA-ND2 distance, gnomAD missense list and AC, TCGA missense count, number of public complex entries contacting, mask tags). Complex table: `research/q1_her2_biology/her2_public_complexes.json` (83 HER2-partner pairs over 40 PDB entries). Mask tag counts from the file: 341 exposed; 266 of these carry a gnomAD or recurrent somatic tag (not discriminating: almost every position has a missense); 147 exposed residues are in zero public complex contacts.

| UniProt pos | Domain | Feature |
|---|---|---|
| 26-53, 162-192, 195-204 ... 630-642 | all | disulfides (list in section 2) |
| 68, 124, 187 | I | glycosites; N124 never modelled; N187 low occupancy |
| 182 | I | phospho-Thr (UniProt) |
| 259 | II | glycosite, high-mannose, 98 % occupied; at pertuzumab edge (contacts 258, 267-279) |
| 310 | II | S310F/Y hotspot (42 TCGA samples); pertuzumab/dimer footprint |
| 317-318 | II | mutagenesis: reduced ERBB3 dimerisation |
| 386 / 452 / 489 | III | common gnomAD missense (A386D, W452C, P489L); region glycan-free |
| 530, 571, 629 | IV | glycosites, sialylated (ST6Gal1 targets 530/629) |
| 579-627 | IV/JM | trastuzumab footprint (1N8Z/6BGT/6OGE/7MN8/8PWH/8Q6J: 579-583, 591-595, 601, 613-627) |
| 633-648 | JM | deleted in isoform 6 (delta16-like, inferred) |
| 647-652 | JM | not modelled in 8Q6J |

## Public HER2 ECD complexes (RCSB search + GraphQL; contacts <= 4.5 A heavy atoms; summary)

RCSB text search for UniProt P04626 returned 63 entries; 40 have ECD-partner contacts that I computed (JSON has all; ids below). Relevant to the challenge: **VHH/nanobody structures: 5MY6 (2Rs15d, X-ray 2.246 A, 2017; epitope domain I 109-112, 156-157, 170-183, 217), 9MTE (cryo-EM 2.66 A, released 2025-11-19; VHH 27A05 contacts domain I 35-90 and III 378-500; VHH 47D05 contacts domain I 105-180 and II 256-257), 9MTX (cryo-EM 3.06 A; VHH 29E09 contacts 35-90 and 378-498)**. Primary paper for 9MTE/9MTX: De Tavernier et al., Mol Cancer Ther 25:541-555 (2026), doi:10.1158/1535-7163.MCT-25-0654, PMID 41504346 (TPP-45142 T-cell engager; llama-derived, per search). Note the 9MTE/9MTX VHHs also touch two domains, so a naive "one domain per VHH" prior is wrong. Other classes: trastuzumab (1N8Z, 6BGT, 6OGE, 7MN8, 8PWH, 8Q6J) DIV; pertuzumab (1S78, 6OGE, 8PWH, 8Q6J, 9L1S, 8FFJ) DII; DI binders (3H3B, 3WLW, 4HRL, 5MY6, 5O4G, 6J71, 8JYR); DIII (3N85, 3WSQ, 3MZW affibody); DIV non-antibody (4HRN, 5K33, 5KWG, 6LBX repebody); JM peptide-binding Fabs (8JYQ, 9IUT); HER3/HER4/EGFR heterodimers (7MN5/6/8, 8U4K/L, 8HGO/P) all use domain II 221-335. Newest (2026): 9T3R, 9T3S (EPS232/EPS226 Fab, DII 266-308).

## Forced analogy: Ecology and niche modelling (habitat suitability under disturbance)

**(a) Statement.** Treat each ECD residue as a habitat cell and an antibody paratope as a species seeking a niche. Glycans, isoform deletions and ECD variants are disturbance layers that lower the suitability of cells (steric occlusion, absence in some isoforms, polymorphic cells). A species-distribution model combines environment layers with occurrence records; here occurrence = residues touched by any public binder (83 contacts), environment = RSA, glycan distance, variant density, domain, and prior suitability = the mask.

**(b) Testable ideas for Track A PR-AUC.** (1) Use the mask as a prior multiplier on the model output: down-weight residues within 10 A of N259/N530/N571/N629 (shield10) by a factor tuned on public VHH complexes (5MY6, 9MTE, 9MTX), then evaluate on those three. (2) Use "number of public complex entries contacting" as a Bayesian prior of hotness (pertuzumab loop 267-279, 308 and trastuzumab 579-583 are hottest); but because the challenge VHHs are held-out and may bind new sites, mix 70 % observed-hotness with 30 % uniform over exposed. (3) Domain-III residues (0 of 74 glycan shielded) are the most "open habitat" and only 36 of 74 exposed have ever been a contact: they are candidate unexplored niches; VHHs 9MTE/9MTX use DIII at 378-500. (4) Treat gnomAD/TCGA variant density as a **negative control**: 266 of 341 exposed residues have a variant tag, so it does not discriminate; do not use it.

**(c) Honest verdict: partially holds.** The mapping to occlusion is genuine (glycan distance, 15 % of exposed surface in the 10 A zone). It breaks in two places: variants are nearly everywhere (no sparse "disturbed" cells), and antibody "occurrence records" are sampling-biased by the drug-discovery pipeline (trastuzumab and pertuzumab dominate: 12 of 40 entries), unlike random field surveys.

## Gotchas

- **Domain boundaries:** literature uses mature numbering (trastuzumab "557-603"); with signal peptide it is 579-625. Confusing them shifts all domain assignments by 22. My domain I-IV boundaries are derived, Cho paper not opened.
- **Only one GlcNAc per site in PDB** - glycan dimension in epitope maps is under-observed; a cryo-EM glycan-free map does not mean no glycan. N124 never modelled yet 92-99 % occupied by MS.
- **Epitope = contact set, not paratope energy:** 4.5 A cut-off; binning of 9T3R etc. differs from author definitions (Voronota-LT areas will differ; area-weighted metric favours large contact).
- **Dataset bias:** 40 entries, 12 are trastuzumab/pertuzumab; HER3/HER4 heterodimer entries (7MN5, 8U4K...) are not antibody epitopes (flagged as partner, not used for hotness prior in the JSON `partner` field; hotness counts exclude 'HER2 self' only). Partner 'EGFR/HER3/HER4' contacts are included in n_public_complex_entries_contacting; filter by `partner` before using as paratope prior.
- **gnomAD allele count** sums exome+genome and may double-count; A386D and W452C are common polymorphisms (AC > 3000), so they are not "mutations".
- **cBioPortal GISTIC +2 is not the clinical HER2-positive definition**; breast 11.5 % vs 15-20 % clinical.
- **Antigen host unknown:** HEK vs CHO changes sialylation by 2x and branching at N68/N187; the immune response to the alpaca immunogen may reflect a different glycoform than the cryo-EM antigen.
- **My SASA** uses one cryo-EM conformer with no glycans; relative values are approximate (own Shrake-Rupley code, not DSSP/FreeSASA).
- Kinase-domain entries (7JXH, 8VB5...) map to P04626 but are not ECD; excluded.

## Implications for the challenge

1. Use `her2_ecd_habitat_mask.json` as a prior: drop prediction probability on residues with `glycan_shield_10A` and `unmodelled` tags, keep domain III and I open. Test on 5MY6, 9MTE, 9MTX before applying to ONU11/13/23.
2. Treat 9MTE (27A05, 47D05) and 9MTX (29E09) as the nearest public analogues (cryo-EM VHH-HER2): epitopes include DI 35-90/105-180 and DIII 378-500; pull these into training/validation, they are in PDB so allowed under "public data".
3. Build the target-side prior from `n_public_complex_entries_contacting`, but blend with uniform: pertuzumab/trastuzumab hotness could mislead if ONU VHHs bind elsewhere (VHH footprints in PDB cover DI/DIII).
4. Remember the antigen carries glycans: N259 (high-mannose, domain II) and N187 (low occupancy) are not equivalent; a VHH contacting residues within 10 A of N530/N571/N629 is consistent with glycan-adjacent epitopes.
5. Ignore gnomAD/COSMIC density as an epitope feature; only S310 (DII) and the sequon-destroying changes at the seven glycosites matter, and neither is likely in the challenge antigen (wild-type per BRIEF).
6. Get the AVIDa-hHER2 paper/dataset card to learn expression host and glycosylation state of the immunogen.

## Open questions

- Antigen expression host and glycoform for AVIDa-hHER2 and for the cryo-EM sample (HEK/CHO/insect).
- Exact herstatin breakpoint and whether UniProt isoform 6 = delta16 (needs a primary paper).
- MANE Select transcript ID (Ensembl REST did not report it), ClinVar and COSMIC counts, PhosphoSitePlus ECD entries, enhancer/promoter-methylation literature.
- Authoritative receptor-number reference per HER2 3+ cell and ASCO/CAP text (403).
- Whether ONU11/13/23 epitopes overlap the DI/DIII region seen in 9MTE/9MTX (suggests a cluster of VHH-friendly sites).

## Sources (opened or actually queried)

- https://rest.uniprot.org/uniprotkb/P04626.json and https://rest.uniprot.org/uniprotkb/P04626-{1..6}.fasta (2026-10-17)
- https://search.rcsb.org/rcsbsearch/v2/query, https://data.rcsb.org/graphql, https://files.rcsb.org/download/{id}.cif (46 entries), https://data.rcsb.org/rest/v1/core/entry/9MTE
- https://www.ebi.ac.uk/interpro/api/entry/pfam/protein/uniprot/P04626 (Pfam positions)
- https://rest.ensembl.org/lookup/symbol/homo_sapiens/ERBB2?expand=1 ; https://rest.ensembl.org/lookup/id/ENST00000269571?mane=1
- https://gnomad.broadinstitute.org/api (GraphQL, gnomad_r4, ERBB2)
- https://www.cbioportal.org/api (studies *_tcga_pan_can_atlas_2018: discrete-copy-number/fetch, molecular-profiles/*_mutations/mutations)
- https://academic.oup.com/glycob/article/34/3/cwad100/7477814 (Fujitani 2024)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8154592/ (Duarte 2021, Oncogene)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3713377 (Jackson 2013, splice variants)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13044525/ and https://pubmed.ncbi.nlm.nih.gov/41504346/ (9MTE/9MTX paper, via search results)
- Search-result summaries only (not opened): ASCO/CAP 2018 secondary summaries (nottingham-repository.worktribe.com/OutputFile/2407087); https://pubmed.ncbi.nlm.nih.gov/35665782/ (DESTINY-Breast04); ESMO 2020 abstract 1993P (17q12 core amplicon); PMC5524165 / PMC3064190 (receptor counts)
