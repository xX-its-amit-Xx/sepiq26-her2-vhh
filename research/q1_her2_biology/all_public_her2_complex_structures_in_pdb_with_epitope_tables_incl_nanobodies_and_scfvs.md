---
title: All public HER2 ectodomain complexes in the PDB, with P04626-numbered epitopes, domains, nanobody/scFv subset, and a presence-only bias analysis
queen: q1_her2_biology
king: king_world
worker: all_public_her2_complex_structures_in_pdb_with_epitope_tables_incl_nanobodies_and_scfvs
tier: expert
tags: [HER2, ERBB2, PDB, RCSB, epitope, nanobody, VHH, scFv, cryo-EM, Voronota-LT, SIFTS, leakage, proxy-benchmark, sampling-bias]
confidence: high
challenge_relevance: 4
serendipity: Presence-only species-distribution modelling (MaxEnt, target-group background) applied to the PDB as a museum collection of epitope occupancy records. The bias-correction half paid off (it shows 44 antibody-class records are only about 7-10 independent niches). The prediction half failed under leave-one-niche-out (a presence prior scores below random).
date: 2026-10-17
---

## TL;DR
The live RCSB search (UniProt P04626, 2026-10-17T00:38Z) returns 63 entries. 45 of them contain HER2 ectodomain (ECD) coordinates, and 41 of those carry a partner. These give 56 HER2-partner interfaces: 44 antibody-class epitopes and 12 receptor or homodimer interfaces. Those 44 epitopes collapse to only about 11 distinct epitope clusters (inverse-Simpson about 7.4 effective niches). Pertuzumab-like (domain II) and trastuzumab-like (domain IV) interfaces account for 18 of the 44 records. Four public HER2-VHH complexes exist: 5MY6 and 7QVK (X-ray) and 9MTE and 9MTX (cryo-EM, released 2025-11-19). No public VHH is a close homolog of ONU11/13/23 (framework identity at most 74 %).

Deliverables: `her2_public_complexes.json` (60 records, 45 PDB entries), `her2_public_complexes_analysis.json` and `her2_public_complexes_loco_prior_test.json`. The earlier architecture-worker version of the JSON is preserved as `her2_public_complexes_architecture_worker_v0.json`. Where the two overlap, I compared Voronota epitopes by PDB id (53 comparisons): Jaccard 1.0 in 38, 0.8-0.99 in 4, 0.08-0.70 in 3, and 0.0 in 8. The 0.0 values arise because v0 is keyed by PDB id alone and my file also has second-partner records (6OGE trastuzumab, 7MN8 trastuzumab and others), so the comparison pairs unlike partners; I did not reconcile those individually.

## 1. Retrieval (Q1) with timestamps
All queries were run on 2026-10-17. The RCSB Search API was queried at 00:38:20Z.

| Query | Hits |
|---|---|
| UniProt P04626 accession (`reference_sequence_identifiers`, database_name = UniProt), return_type entry | **63** |
| Sequence search (HER2 ECD 23-652, identity >= 90 %, E <= 1) | 43 (a strict subset of the 63) |
| Sequence search (identity >= 30 %, E <= 0.1) | 113 (adds EGFR/HER3/HER4 and rat neu) |
| Full text: "HER2" / "HER-2" / "p185" | 132 / 29 / 38 |
| Full text: "ERBB2" / "ErbB2" | 1104 each (noisy: cancer papers) |
| PDBe-KB `graph-api/uniprot/best_structures/P04626` | 39 distinct entries, all contained in the RCSB 63 |
| PDBe `api/v2/mappings/best_structures/P04626` | 63, identical to the RCSB set |

- **Unannotated entries.** I screened the title of every text-only hit (1,186 entries not found by UniProt or sequence). None is an unannotated HER2-ECD complex. All title hits are antibody-only structures (1FVC/D/E, 1L7I, 2GJJ, 3QYC, 5TDN/O/P, 6BHZ/I0/I2, 6ZQK, 5JIH/K, meditope-trastuzumab entries and others). Two are worth naming. 3QYC is an anti-HER2 sdAb dimer without HER2. 9XL8 is a VHH-trastuzumab-Fab complex whose VHH binds the Fab, not HER2.
- **Rat neu.** 1N8Y (rat HER2 ECD, no partner) is outside P04626.
- **63 to 45 ECD entries.** I removed 18 entries:
  - 4 TM NMR structures: 2JWA, 2KS1, 2N2A, 5OB4.
  - 14 non-ECD entries: kinase domains (3PP0, 3RCD, 7JXH, 7PCD, 8U8X, 8VB5), phospho-peptide or C-tail complexes (1MFG, 1MFL, 1MW4, 2L4K, 4GFU, 4NND, 5TQS), and 1QR1 (GP2 peptide 654-662 on HLA-A2, outside the ECD).
- **SIFTS.** The legacy PDBe endpoint `api/mappings/uniprot/<id>` returned 404 or empty today. The EBI FTP SIFTS XML is a stub (no UniProt cross-references) for roughly half of the entries. I therefore used the RCSB entity alignment (`rcsb_polymer_entity_align`, provenance SIFTS) as the mapping. Where the XML is populated (23 entries) I cross-checked it: 12,619 HER2 residues compared, 0 disagreements. The only disagreements (47 residues in 6BGT, 6 in each of 7MN5 and 7MN6) are on partner chains.
- **SAbDab / SAbDab-nano.** Not queried live. The cross-check against the PDB itself (RCSB plus PDBe) is complete. A SAbDab-nano cross-check is still open.
- **Release-date filter.** Release >= 2025-01-01 with P04626 returns 9 entries: 9IUT, 9L1S, 9MTE, 9MTX, 9QBF, 9QBG, 9QBH, 9T3R, 9T3S. The text queries "HER2 nanobody" and "ErbB2 VHH" restricted to that date range return only 9MTE and 9MTX. "HER2 sybody" returns 0. I did not search bioRxiv.

## 2. Core table (Q2, Q5): partner types (60 records)
Fab 23, ERBB receptor/ligand 7, HER2 homodimer 5, VHH 5, Fv-clasp + epitope peptide 4, scFv 3, DARPin 3, Fcab 2, biparatopic scFv-Fc 2, affibody 1, repebody 1, apo 4.

**HER2-VHH (single-domain) complexes.** CDRs are IMGT-like boundaries anchored on the deposited sequence. Numbering is VHH sequential, 1-based, from the first Q/E of `[QE]VQL`. Paratope = VHH residues within 4.0 A of HER2.

| PDB | VHH | Method, res (A), release | HER2 / VHH chains (auth; label) | HER2 epitope, 4 A / Voronota-LT (n) | Domains (Cho) | Paratope, VHH numbering |
|---|---|---|---|---|---|---|
| 5MY6 | 2Rs15d | X-ray, 2.246, 2017-08-09 | A; A,D-G / B; B,H | 17 / 21 | I | CDR1 (26-33 GYIFNSCG): 31-33. CDR2 (51-58): 52-54, 58. CDR3 (96-104 AVCYNLETY): 98, 101-103. Framework: 34, 37, 44, 45, 47, 50, 105 |
| 7QVK | NM-02 (humanised sdAb) | X-ray, 3.1, 2023-02-01 | AAA; A,D / BBB; B | 13 / 25 | I, II | CDR1: 27. CDR2: none. CDR3 (96-112): 100, 102-104, 109, 112. Framework: 3, 4, 113, 115 |
| 9MTE | 27A05 | cryo-EM, 2.66, 2025-11-19 | C / A | 18 / 34 | I, III | CDR1: 28, 32, 33. CDR2: 52, 57. CDR3 (95-101 WDVNGDI): 95, 97-99. Framework: 37, 42, 44, 45, 47, 50, 102 |
| 9MTE | 47D05 | cryo-EM, 2.66, 2025-11-19 | C / B | 10 / 18 | I, II | CDR1: 28-32. CDR2: 53. CDR3 (96-108): 100, 101. Framework 71-74, 76 |
| 9MTX | 29E09 | cryo-EM, 3.06, 2025-11-19 | B / A | 17 / 31 | I, III | CDR1: 29, 33. CDR2: 53, 54, 56, 58. CDR3 (96-102 RDVNGDY): 96, 98, 99. Framework: 35, 37, 42, 44, 45, 47, 50, 103 |

For 5MY6 the 4 A HER2 epitope is 109-112, 156, 157, 170, 173, 174, 177-183, 217.

The full VHH sequences are in the JSON field `paratope_vhh`.

Two nanobody pairs share an epitope. 27A05 (9MTE) and 29E09 (9MTX) have 85 % identity, share the CDR3 motif DVNGD and bind the same bi-domain site: domain I residues 34-68 and 90, plus domain III residues 378-500. 5MY6 (domain I 109-183) and 47D05 (103-181 plus 256-257) fall in one cluster with DARPin 9_29 and H2Mab-119.

**scFv and scFv-like complexes.**

| PDB | Partner | Method, res (A), release | HER2 residues | Domain |
|---|---|---|---|---|
| 3H3B | chA21 scFv (2 copies) | X-ray, 2.45, 2010 | 23-192 construct | I |
| 6J71 | HuA21 scFv | X-ray, 2.918, 2019 | | I |
| 8FFJ | Zanidatamab (biparatopic scFv-Fc) | cryo-EM, 7.5, 2023 | arm 1 contacts domains I/II, arm 2 domain IV | |
| 6ZQK | scFv-Fab 841 | X-ray, 2.2 | no HER2 in coordinates (excluded) | |

Selected epitopes in other classes:
- Trastuzumab-class (1N8Z and others): domain IV, 17-24 residues (4 A).
- Pertuzumab-class (1S78, 6OGE, 8PWH, 8Q6J, 9L1S): domains I-II, 21-37 residues (4 A).
- HER2 ECD only, no partner modelled: 2A91, 9QBF, 9QBG, 9QBH. 9QBF/G are titled "in complex with trastuzumab" but contain no Fab.

Per-complex fractions use 630 ECD residues (UniProt 23-652). Antibody-class 4 A epitopes have median 16 residues (mean 15.8), or 2.5 % of the ECD. Voronota-LT epitopes have median 23 (mean 24.4), or 3.9 %. VHH Voronota epitopes are 18-34 residues (mean 25.8, 4.1 %). The random-guess PR-AUC base rate is therefore about 0.04. The BRIEF's 8GZ5 proxy has a base rate of 0.126, about 3 times higher. Absolute PR-AUC values from that proxy do not transfer.

## 3. Epitope definition and numbering (Q3, Q4)
- **4.0 A contacts.** gemmi 0.7.5 `ContactSearch`, protein heavy atoms only, hydrogens, waters and ligands removed. Symmetry mates were searched. The default was the identity copy, with direct atom distance <= 4.0 A. The best symmetry copy was used only when the cognate pair is split across the lattice: 4HRM, 8JYR (a 22-residue epitope from a symmetry copy; the v0 file agrees at 22) and the 3WLW homodimer. Contacts through lattice translations are flagged: ContactSearch labels them image 0, so they must be filtered by direct distance. A naive image-0 filter inflates 1N8Z from 17 to 23 residues.
- **Voronota-LT.** v1.1.497 (release v1.29.4816, cosmopolitan exe), probe 1.4 A, inter-chain contacts at residue level, area > 0. It was run on the HER2 chain plus the partner chains of each interface. It was skipped for symmetry-mate pairs (4HRM, 8JYR, the 3WLW homodimer). Voronota epitopes are larger than 4 A epitopes (median 23 vs 16).
- **Numbering.** UniProt P04626 numbering includes the signal peptide (1-22). Unmapped epitope residues: none in any record. Mutated epitope residues versus UniProt (per-record field): S310F in 7MN6, 7MN8, 8VQD, 8VQE and 9L1S; F274Y in 8VQD; and 4HRN Asp49 (maps to UniProt N571, so Asp where UniProt has Asn). I did not check the papers for the reason behind these differences.
- **Domain boundaries.** The architecture worker's table is used: I 23-217, II 218-341, III 342-510, IV 511-629 (extended to 652 in their table). These equal Cho 2003 (mature 1-195, 196-319, 320-488, 489-607) plus 22. I could not open the Cho text myself (a web search did not return the boundaries). The boundaries are therefore unverified from the primary paper but agree with the architecture worker. An independent structural definition from RCSB SCOP2 (1N8Z chain C, live) differs at I/II and II/III: I 1-165, II 166-322, III 323-488, IV 489-607, i.e. UniProt 23-187, 188-344, 345-510, 511-629. The JSON carries both (`domains_contacted` for Cho and `domains_contacted_scop2_alt`). Residues 188-217 and 342-344 are boundary-ambiguous. Residues 630-652 are labelled "post-IV".

## 4. Presence map and sampling-bias analysis (forced analogy)
The 44 antibody-class records (excluding HER2 homodimers and ERBB receptor interfaces) were clustered by epitope Jaccard (single linkage) using the union of the 4 A and Voronota sets. The numbers below use the 0.3 cutoff.

| Jaccard cutoff | Clusters | Effective niches (inverse Simpson) |
|---|---|---|
| 0.2 | 10 | 7.3 |
| 0.3 | 11 | 7.4 |
| 0.5 | 15 | 9.8 |

Cluster sizes at 0.3: 10 (pertuzumab-like, domain II/I: pertuzumab 6 records, TL1, zanidatamab arm 1, EPS226 and EPS232), 8 (trastuzumab-like, domain IV), 6 (domain I: chA21, HuA21, MF3958, 3WLW Fabs), 4 (domain I apex: 4HRL, 5MY6, 8JYR, 47D05), 4 (domain IV: 4HRN, Fcabs, 6LBX), 4 (HER2 611-618 peptide Fv-clasps), 2 (affibody and Fab37, domains III/IV), 2 (NM-02 and 39S, I/II), 2 (27A05 and 29E09, I/III), then singletons (3WSQ, 4HRM).

Raw hits sum epitope-residue counts per domain. Effective hits give each record weight 1/(cluster size), the analogue of a target-group background correction.

| Domain | Share of ECD residues | Raw share of epitope hits | Effective (cluster-weighted) share | Raw hits per residue | Covered residues |
|---|---|---|---|---|---|
| I | 31.0 % | 29.3 % | 30.9 % | 1.59 | 105 of 195 |
| II | 19.7 % | 29.8 % | 18.0 % | 2.53 | 67 of 124 |
| III | 26.8 % | 12.0 % | 27.6 % | 0.75 | 68 of 169 |
| IV | 22.5 % | 28.9 % | 23.5 % | 2.15 | 72 of 142 |

Domain II is oversampled about 3.4 times in raw terms relative to domain III. After cluster weighting the occupancy is flat across domains (0.36-0.41 effective hits per residue). Domain-level over- and under-representation is therefore sampling effort, not a property of HER2. In total 312 of 630 ECD residues (49.5 %) are touched by at least one antibody-class epitope. Runs of at least 10 residues never contacted: 44-56, 69-80, 320-332, 355-376, 474-495, 513-522, and 628-652 (the juxtamembrane tail).

## 5. Leakage (Q7)

| ONU clone | Nearest public VHH (global identity over the shorter sequence) | CDR3 note |
|---|---|---|
| ONU11 | NM-02 (7QVK) 70.6 %, 2Rs15d 67.8 %, 47D05 67.2 % | CDR3 AARPLGSTWTEHPY, no match above 0.38 |
| ONU13 | NM-02 (7QVK) 73.9 %, 27A05 71.7 %, 29E09 70.2 % | CDR3 AAKYGSSRLWDY, no match above 0.50 |
| ONU23 | 27A05 70.8 %, NM-02 69.4 %, 29E09 68.4 % | CDR3 AADGRFYSDYVWSSPDEYAY. The 0.71 CDR3 identity against 29E09's RDVNGDY is a 7-versus-20 residue gap-alignment artefact |

Framework identities in the 60-75 % range are typical of unrelated alpaca VHHs, so there is no sequence-level leakage. The risk is epitope-level: ONU clones raised in the same alpaca immunisation against wild-type HER2 ECD may bind niches already occupied by 2Rs15d (domain I 109-183), 47D05 (103-181), NM-02 (200-234) or 27A05/29E09 (34-68 with 378-500). The ONU epitopes are unknown (q4 holds the sequences).

**Proposed leave-one-epitope-out proxy set.** Take one entry per cluster at the 0.3 cutoff. Prefer wild-type constructs and the best resolution. For cluster 1 use the wild-type EPS226 Fab (9T3S) rather than the S310F TL1 Fab.

| Cluster | Representative |
|---|---|
| 1 | 9T3S |
| 2 | 1N8Z |
| 3 | 3H3B |
| 4 | 8JYR (also keep 5MY6 and 9MTE 47D05 as VHH examples) |
| 5 | 6LBX |
| 6 | 8JYQ (low value, a linear peptide) |
| 7 | 3MZW |
| 8 | 7QVK |
| 9 | 9MTE 27A05 |
| 10 | 3WSQ |
| 11 | 4HRM (low confidence) |

For a VHH-only proxy use 5MY6, 7QVK, 9MTE (27A05 and 47D05) and 9MTX, which is the closest analogue of the real task. Treat 27A05 and 29E09 as one niche when splitting, otherwise they leak into each other.

## Forced analogy: presence-only species distribution modelling
**(a) Statement.** Residues are grid cells. Each antibody-HER2 complex is an occupancy record: residue present when the antibody contacts it. The PDB is a museum collection with strong sampling bias, because therapeutic antibodies are studied far more than others. Distinct epitope clusters are species. There are no true absences, only untested cells.

**(b) Testable ideas and result.**
1. Cluster-weighted effective counts act like a target-group background. They flatten domain occupancy (table in section 4), so any domain-level prior learned from raw PDB counts mostly encodes sampling effort. Use sample weight 1/cluster size when training anything on these complexes.
2. A prior-from-other-niches under leave-one-niche-out was tested. For each antibody-class record, the other clusters' occupancy (distinct clusters per residue, raw counts, or smoothed) is a per-residue score against the held-out Voronota epitope. Mean average precision: random 0.046, raw count 0.031, cluster count 0.032, smoothed cluster 0.027. For the 5 VHHs: random 0.050, raw 0.036, cluster count 0.042. A presence prior does not beat random out of niche, and is typically worse. This is a negative result (the file is `her2_public_complexes_loco_prior_test.json`). It is expected, because a held-out niche is by construction poorly covered by the others.

**(c) Verdict.** The analogy partially holds. Bias diagnostics transfer well: effective niche counts, over-sampling, and clusters. Prediction does not, for three reasons. Untested cells are not absences. The antibody repertoire is not a stationary community. A new niche is by definition not in the training records. The practical value is as a prior only if the ONU epitopes land in already-occupied niches, which this data cannot tell us.

## Gotchas / what could fool us
- **Copy counts.** 56 interfaces, but only about 7-10 independent niches. Trastuzumab Fab appears 6 times (1N8Z, 6BGT, 6OGE, 7MN8, 8PWH, 8Q6J) and pertuzumab Fab 6 times, with further Fabs in the same clusters. Duplicate copies in the asymmetric unit (3H3B, 3WLW, 1S78, 8JYQ, 9IUT) are repeated records, not independent evidence.
- **Crystal contacts.** HER2-HER2 interfaces in 1S78, 3WLW, 4HRM and 4HRN are lattice contacts, not biology. 3N85 is a crystallographic trimer, not captured without symmetry handling.
- **Lattice translation.** gemmi image-0 contacts include neighbouring-cell translations. Filter by direct distance (this changed 1N8Z from 23 to 17 residues).
- **Cho vs SCOP2 domains.** The domain labels differ by about 30 residues at I/II. Residues 188-217 are domain I (Cho) or II (SCOP2).
- **Constructs.** S310F, truncated domains and Fv-clasp peptide constructs make some records unlike the wild-type ECD. 8JYQ and 9IUT are 8-residue epitope peptides (611-618), not folded-ECD epitopes.
- **Method differences.** Voronota-LT epitopes are about 1.5 times larger than 4 A epitopes. Which one the organisers' ground truth matches is a q4 question.
- **9MTE/9MTX.** These were released 2025-11-19 and describe a T-cell-engager programme. Whether the challenge ground truth overlaps them is unknown. They are the most relevant public VHH-HER2 cryo-EM data.
- **Legacy API.** The PDBe SIFTS mapping endpoint is dead and the FTP XML is a stub for about half the entries. Anything that assumes it will silently return no mapping.
- **Partner assignment.** Partner groups are built by chain-chain contact (>= 20 atom pairs). HER3 plus NRG1b merge into one partner, and 4HRM's two DARPin chains were merged by hand.

## Implications for the challenge
1. Use the JSON as the only public epitope truth set. Build a VHH-only proxy from 5MY6, 7QVK, 9MTE (x2) and 9MTX, with 27A05 and 29E09 as one niche.
2. Expect an epitope of about 4 % of the ECD (Voronota mean 25.8 residues for VHHs, 18-34), so the random PR-AUC floor is about 0.04. Calibrate PR-AUC expectations to that, not to the 0.126 of the 8GZ5 proxy.
3. Weight training or prior examples by 1/cluster size. Never train a HER2-specific epitope prior on raw PDB counts (domain II is oversampled about 3.4 times).
4. Do not rely on a public-occupancy prior for novel epitopes. It fails leave-one-niche-out. Use it only as a soft feature, validated within-niche.
5. Add the five public VHH complexes as test and sanity cases for any structure predictor (AF3, OpenFold3, Boltz). They test the paratope CDR3-dominant pattern: CDR3 plus CDR1/2 plus framework 44-50.
6. Expect 3-5 niches on HER2 domains I/II for the ONU clones based on VHH precedent. Domain I (34-183) and the I/III site are the most populated by VHHs.

## Open questions
- Do ONU11, ONU13 and ONU23 map onto 2Rs15d, 47D05, NM-02 or 27A05/29E09 niches? This needs the AVIDa-hHER2 enrichment data and q4.
- Does the organisers' Voronota-LT parameterisation match mine (probe 1.4 A, residue-level area > 0)?
- SAbDab-nano was not queried live. Confirm the nanobody set against it.
- Cho 2003 boundaries were not read from the primary paper.
- Are there bioRxiv or unreleased HER2 VHH cryo-EM structures beyond the PDB? Not searched.

## Sources
- RCSB Search API https://search.rcsb.org/rcsbsearch/v2/query (queries 2026-10-17)
- RCSB Data API https://data.rcsb.org/rest/v1/core/entry/<id>, polymer_entity, polymer_entity_instance (1N8Z chain C SCOP2 features)
- RCSB mmCIF https://files.rcsb.org/download/<id>.cif (45 entries)
- PDBe https://www.ebi.ac.uk/pdbe/graph-api/uniprot/best_structures/P04626 and https://www.ebi.ac.uk/pdbe/api/v2/mappings/best_structures/P04626
- PDBe legacy mappings https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/<id> (404 or empty)
- SIFTS XML https://ftp.ebi.ac.uk/pub/databases/msd/sifts/split_xml/ (partial)
- UniProt https://rest.uniprot.org/uniprotkb/P04626.json and .fasta
- Voronota-LT https://github.com/kliment-olechnovic/voronota/releases (v1.29.4816, voronota-lt v1.1.497)
- Citations (via RCSB primary_citation): Cho 2003 doi:10.1038/nature01392; 1S78 doi:10.1016/S1535-6108(04)00083-2; 9MTE/9MTX doi:10.1158/1535-7163.MCT-25-0654; 7QVK doi:10.1371/journal.pone.0288259; 5MY6 doi:10.1158/1078-0432.CCR-17-0310
- Local: `research/q1_her2_biology/her2_ectodomain_architecture_domains_I_to_IV_and_structures_summary.json` (domain table); `research/_meta/sepiq_verbatim.md` (ONU sequences)
- Scripts: C:\Temp\sepiq26\her2_scripts\s1-s10.py
