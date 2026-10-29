---
title: HER2 therapeutic antibodies, ADCs and binder footprints - epitopes in P04626 numbering, overlap matrix and coverage map
queen: q1_her2_biology
king: king_world
worker: her2_therapeutic_antibodies_adcs_epitopes_trastuzumab_pertuzumab_margetuximab_and_binding_footprints
tier: expert
tags: [HER2, ERBB2, epitope, trastuzumab, pertuzumab, VHH, nanobody, Schoener-D, coverage, PDB, P04626, ADC]
confidence: medium
challenge_relevance: 4
serendipity: "Ecology niche overlap (Schoener's D, presence-only occupancy) computed for 25 binders: the overlap matrix is clean and informative, but a MaxEnt-style prior built from the other 'species' predicts held-out VHH epitopes only about 2x better than random (macro AP 0.04-0.05 vs 0.024 base). Analogy holds for description, mostly breaks for prediction."
date: 2026-10-17
---

# HER2 antibodies, ADCs and footprints

## TL;DR
HER2 is a four-domain (I-IV) receptor on cancer cells. The two classic antibody drugs sit at opposite ends of it: trastuzumab at the membrane-proximal domain IV, pertuzumab on the domain II "dimerisation arm". Contacts computed from PDB coordinates (4.0 A heavy-atom cutoff, UniProt P04626 numbering including the 22-residue signal peptide) show that **approved/clinical antibodies touch only 42 of the 630 ectodomain residues (6.7 %)**, and all 25 distinct PDB binders together touch 213 (33.8 %). Domain III has zero approved-drug contacts. The held-out VHHs ONU11/13/23 therefore have a lot of unoccupied surface to land on, but a footprint prior alone is only a weak predictor (see Forced analogy).

## Method (what was actually run)
- RCSB Search API (`reference_sequence_identifiers.database_accession = P04626`, 63 entries on 2026-10-17) plus an independent sequence search (ECD residues 23-300, >= 90 % identity, 41 entries, all already in the 63). No extra entries found. RCSB GraphQL/data API for titles, resolution, release dates, citations. Human HER2 only (rat HER2 1N8Y is not in the set).
- mmCIF from files.rcsb.org, model 1. HER2 chains from RCSB entity annotation; partner chains grouped into one binder by mutual contact (>= 10 atom pairs). Epitope = HER2 residues with any heavy atom within 4.0 A of any heavy atom of the binder (Biopython `NeighborSearch`). **Voronota-LT was not run**; area weighting would reorder edge residues. Residue numbers were mapped to P04626 by local pairwise alignment of the modelled sequence (robust to each paper's private numbering).
- Offset check: 1N8Z chain C residue 1 aligns to T23 of P04626, so **P04626 = mature + 22** (UniProt: chain 23-1255, extracellular 23-652, TM 653-675).
- Domains in mature numbering (Cho 2003 / Franklin 2004 convention as given in the brief; not re-derived from the papers' text): I 1-195, II 196-319, III 320-488, IV 489-607, juxtamembrane 608-630. In P04626 numbering: I 23-217, II 218-341, III 342-510, IV 511-629, JM 630-652.
- Paratope CDR content is a regex-anchored Kabat-like heuristic (CDR1 from Cys22+9, CDR2 from Trp36+14, CDR3 between YYC and WGxG). Nanobody CDR2 can fail when it contains a Cys. Treat region counts as +-2.
- Data files next to this note: per-binder footprints JSON (same basename as this file), `her2_antibody_footprint_overlap_matrices.json`, `her2_ecd_antibody_coverage_bins.json`, `her2_ecd_per_residue_antibody_coverage.json`, `her2_public_complexes.json`.

## 1. PDB ids named in the brief, verified in RCSB
| id | status | what it is |
|---|---|---|
| 1N8Z | verified (2003-02-18, 2.52 A X-ray) | human HER2 ECD + Herceptin (trastuzumab) Fab; Cho 2003 doi 10.1038/nature01392 |
| 1S78 | verified (2004-04-27, 3.25 A, two copies) | HER2 ECD + pertuzumab Fab. RCSB lists doi **10.1016/S1535-6108(04)00083-2** (Cancer Cell 2004). The brief's DOI 10.1016/j.ccr.2004.03.002 was not found in RCSB: unverified, do not cite |
| 5O4G | verified (2018-05-16, 3.0 A) | **NOT margetuximab.** Title "HER2 in complex with Fab MF3958" (Merus bispecific screen, Cancer Cell 2018 doi 10.1016/j.ccell.2018.04.003). Binds domain I |
| margetuximab | **no HER2 complex among the 63 P04626-annotated entries** | Fc-engineered trastuzumab-lineage antibody; sharing trastuzumab's domain IV epitope is an unverified inference (no opened source states it) |
| 3N85 | verified (2010, 3.2 A) | Fab37, tryptophan-rich paratope, crystallographic HER2 trimer; JMB doi 10.1016/j.jmb.2010.07.027 |
| 7MN8 | verified (2021, 3.45 A cryo-EM) | HER2/HER3/NRG1b ECD + **trastuzumab** Fab only (Nature doi 10.1038/s41586-021-04084-z). Trastuzumab + pertuzumab together: 6OGE (4.36 A), 8PWH (3.17 A), 8Q6J (3.3 A) |
| zanidatamab | 8FFJ (2023, **7.5 A** cryo-EM; Nat Commun doi 10.1038/s41467-023-37029-3) | resolution too low for side-chain claims; footprints approximate |
| zenocutuzumab, ZW49, disitamab vedotin | **no entry** | no public HER2 complex; epitope domain unverified |
| T-DXd | no separate entry | antibody is trastuzumab (FDA label: humanized anti-HER2 IgG1; "fam-trastuzumab") so epitope = trastuzumab's |

## 2. Per-antibody epitopes (P04626 numbering; mature = minus 22)
First HER2 copy, 4.0 A. Letter = residue identity in P04626.

| binder (PDB) | domain(s) | n | epitope residues (P04626) | paratope (heuristic) |
|---|---|---|---|---|
| **trastuzumab** 1N8Z (2.52 A) | IV | 17 | P579 E580 D582 Q583 K591 D592 P593 P594 F595 I613 K615 D618 E620 A622 Q624 P625 C626 | L: L1 4, L2 2, L3 3; H: H1 1, H2 4, H3 2 |
| trastuzumab in 6OGE, 7MN8, 8PWH, 8Q6J, 6BGT | IV | 14-18 | same three loops | H3 4-6, H2 3-5, L3 3 |
| **pertuzumab** 1S78 (3.25 A) | II 20 + I 2 | 22 | K150 Q178 F258 H267 C268 A270 Y274 T276 D277 T278 F279 T290 V308 G309 S310 T312 V314 P316 L317 H318 K333 P337 | H dominates: H1 3, H2 8, H3 4 (+5 FR); L2 2, L3 1 |
| pertuzumab T30S/D31A on S310F, 9L1S (3.0 A) | II | 21 | pertuzumab footprint minus domain I contacts | H2 7, H3 4, H1 3 |
| Fab37 3N85 | III 22 + IV 4 | 26 | E395 Q398 E401 D417 S418 L419 P420 D421 S423 V424 Q426 G449 W452 R456 T472 H473 R499 E503 V505 E507 G508 L509 P523 G524 T526 Q527 | H1 2, H2 6, H3 5; L3 3 |
| bH1 3BE1 (2.9 A, trastuzumab variant, dual HER2/VEGF) | IV | 16 | P579 E580 D582 Q583 K591 D592 P593 P594 F595 P601 K615 A622 C623 Q624 P625 C626 | H 8, L 7 |
| zanidatamab ECD II arm, 8FFJ (7.5 A) | II | 11 | K150 H267 D277 F279 T290 V308 L317 H318 K333 K336 P337 | approximate |
| zanidatamab ECD IV arm, 8FFJ | IV | 10 | P579 E580 Q583 D592 P593 P594 F595 D607 L608 K615 | approximate |
| 3WLW antibody (3.09 A) | I | 13 | S133 P134 R138 Q160 R190 A191 C192 H193 P194 C195 P197 S202 E207 | H 12 (H3 4), L 6 |
| HuA21 scFv 6J71 | I | 18 | R157 P159 Y163 D165 T166 T186 N187 R188 S189 R190 A191 C192 H193 P194 C195 P197 S202 E207 | VH-dominated (H1 9) |
| chA21 scFv 3H3B | I | 22 | P122 N124 N125 T126 R157 N158 P159 Y163 D165 T166 N187 R188 S189 R190 A191 C192 H193 P194 C195 S196 P197 E207 | scFv |
| MF3958 5O4G | I | 17 | Y163 D165 T166 L168 I184 T186 R188 S189 R190 A191 C192 H193 P194 C195 G201 S202 R203 | H 13 (H3 4, H2 4, H1 3), L 1 |
| 3WSQ antibody | III | 7 | R354 P378 F381 D382 G383 P385 A386 | H3 4, L3 3 |
| 39S 6ATT (3.77 A) | II (+I 1) | 13 | K200 V219 C220 A221 G222 G223 C224 P230 L231 P232 T233 C235 E238 | H3 4, H2 3, L1 5, L3 4 |
| TL1 8VQD (2.61 A, S310F-selective) | I 5, II 23, III 8 | 36 | T27 Q57 Q81 T105 Q106 F258 H267 E280 T290 F291 G292 Y303 T306 D307 V308 S310 C311 T312 L313 V314 P316 L317 H318 K333 C334 S335 K336 P337 Y343 E348 H349 R351 E352 R434 L436 G439 | H3 10 |
| H2Mab-119 8JYR (1.69 A) | I | 17 | E109 D110 N111 Y112 L149 K150 L154 Q156 K175 N176 N177 Q178 L179 A180 L181 T182 L183 | H2 6, L3 5 |
| EPS232 9T3R / EPS226 9T3S | II | 15 / 14 | L266 H267 C268 A270 V272 T273 Y274 T276 D277 T278 F279 E280 S281 (+D307 V308 in EPS232) | H3 5-6, L1 5-6 |
| **VHH 2Rs15d** 5MY6 (2.25 A) | I | 17 | E109 D110 N111 Y112 Q156 R157 K170 F173 H174 N177 Q178 L179 A180 L181 T182 L183 R217 | CDR1 4, CDR2 5, CDR3 5, FR 6 |
| VHH NM-02 7QVK (3.1 A) | I 4, II 9 | 13 | R203 S214 L215 R217 T218 V219 C220 A221 K228 G229 P230 L231 P232 | CDR3 6, other 5 |
| VHH 27A05 9MTE (2.66 A) | **I 6 + III 12** | 18 | L35 A37 P39 E40 P66 T67 P378 D382 S413 D417 Q446 G447 L448 G449 H470 T472 A497 N498 | CDR3 4, CDR2 3, CDR1 2, FR 7 |
| VHH 47D05 9MTE | I 9, II 1 | 10 | T105 D110 L149 K150 H174 N176 N177 Q178 L179 H257 | CDR3 2, CDR1 2, CDR2 1, FR 8 |
| VHH 29E09 9MTX (3.06 A) | I 7, III 10 | 17 | L35 A37 P39 E40 P66 T67 Q90 P378 D382 S413 D417 Q446 G447 H470 T472 H473 A497 | CDR2 5, CDR3 3, CDR1 2, FR 7 |
| affibody ZHER2:342 3MZW | III 18, IV 7 | 25 | P394 E395 Q398 E401 D417 S418 L419 P420 D421 S423 V424 G449 I450 S451 W452 E507 G508 L509 P523 G524 P525 T526 Q527 Q538 E539 | not an Ig |
| DARPin 9_29 4HRL / Fcab STAB19 5K33 / repebody Rb-H2 6LBX | I / IV / IV | 15 / 13 / 15 | see JSON | scaffolds |

Notes. (a) 9MTE/9MTX nanobodies come from a **Sanofi** T-cell-engager programme (Mol Cancer Ther 2026, doi 10.1158/1535-7163.MCT-25-0654). I found no link to COGNANO or ONU11/13/23. They were released 2025-11-19, so they are public before the challenge closes. (b) 27A05 and 29E09 have near-identical epitopes (D 0.83) and both bridge domain I (35-67) and domain III (378-498): a cleft epitope absent from every clinical antibody. (c) The two copies in 1S78 agree to within 1 residue.

## 3. Numbering reconciliation and the three-loop trastuzumab epitope
- Offset **P04626 = mature + 22**, verified by alignment of 1N8Z chain C (residue 1 = T23).
- Trastuzumab contacts in mature numbering (computed): 557, 558, 560, 561 | 569-573 | 591, 593, 596, 598, 600, 602-604. Cho 2003 describes three loops (brief: 557-561, 570-573, 593-603). My first two loops match; the third spans 591-604 at a 4.0 A cutoff against 593-603, a one-to-two residue edge difference. I could not read the loop text of Cho's full paper (only the abstract-level record: 2.5 A structure, binding near the juxtamembrane region), so the loop ranges are the brief's plus my coordinate check.
- Pertuzumab computed 128-315 mature (150-337 P04626). The domain II contacts run 258-337 (mature 236-315); K150 and Q178 are domain I contacts, so the brief's "245-333" is approximately right but the arm is not the whole epitope.
- Trastuzumab's epitope is the same three loops in all six structures containing it; no residue is domain-II/I.
- Trastuzumab vs pertuzumab overlap: **0 residues**; both Fabs sit together in 6OGE, 8PWH, 8Q6J (structural proof of non-competition).

## 4. Approved HER2 drugs (FDA original approval dates from openFDA drugsfda; payloads from openFDA label text)
| drug | format | target domain | FDA approval | payload | one-sentence layman |
|---|---|---|---|---|---|
| Herceptin (trastuzumab), BLA103792 | humanized IgG1 | IV | 1998-09-25 | none | A lab-made antibody that sticks to HER2 near the cell membrane and flags the cell for immune attack. |
| Perjeta (pertuzumab), BLA125409 | humanized IgG1 | II | 2012-06-08 | none | An antibody that stops HER2 pairing with its partner receptors. |
| Kadcyla (ado-trastuzumab emtansine), BLA125427 | ADC, MCC thioether linker | IV | 2013-02-22 | DM1 (maytansine derivative), average 3.5 per antibody (label) | Trastuzumab as a delivery truck for a cell-division poison. |
| Phesgo (pertuzumab+trastuzumab+hyaluronidase), BLA761170 | fixed-dose subcutaneous | II + IV | 2020-06-29 | none | Both antibodies in one injection under the skin. |
| Enhertu (fam-trastuzumab deruxtecan), BLA761139 | ADC, cleavable tetrapeptide linker | IV (trastuzumab) | 2019-12-20 | deruxtecan (DXd, exatecan derivative, topoisomerase I inhibitor), about 8 per antibody (label) | Trastuzumab carrying many copies of a DNA-damaging drug that also hits neighbouring cells. |
| Margenza (margetuximab-cmkb), BLA761150 | Fc-engineered IgG1 | IV (inferred, unverified) | 2020-12-16 | none | A trastuzumab-like antibody tuned to recruit immune cells better. |
| Ziihera (zanidatamab-hrii), BLA761416 | bispecific biparatopic, IgG1-like | II + IV (8FFJ; PMC12634555 also states ECD II and IV) | 2024-11-20 | none | One antibody that grabs HER2 in two places and clusters it. |
| Bizengri (zenocutuzumab-zbco), BLA761352 | bispecific HER2 x HER3 | HER2 domain unverified | 2024-12-04 | none | Blocks the HER2-HER3 pairing driven by NRG1 fusions. |
| disitamab vedotin (RC48) | ADC | unverified | **not FDA-approved**; Chinese approval year unverified here | MMAE (secondary sources) | A HER2 delivery truck carrying an auristatin poison. |

ZW49 (biparatopic ADC): only a patent title surfaced; format, payload and status unverified.

## 5. Epitope binning and competition
| pair | data | source / confidence |
|---|---|---|
| trastuzumab vs pertuzumab | non-competing; bind together | 6OGE, 8PWH, 8Q6J; footprint overlap 0 (verified) |
| trastuzumab vs bH1 | same epitope (D 0.82, 14 shared) | computed from 3BE1 |
| 2Rs15d vs trastuzumab / pertuzumab | "did not compete" (SPR/ELISA; Vaneycken 2011 FASEB J, doi 10.1096/fj.10-180331, abstract-level) | medium |
| 5F7 vs trastuzumab | competes (domain IV); secondary statement in the 2019 At-211 nanobody paper, not checked at the primary | low |
| 2Rs15d domain | domain I; review says "D88-L161" mature (P04626 110-183); 5MY6 contacts 109-183 + R217 | consistent |
| 5F7 domain | IV; **no solved structure** in the set | low |
| 47D05 vs 2Rs15d / H2Mab-119 / DARPin 9_29 | all domain I with overlapping footprints (D 0.29-0.71): competition expected; **no published binning found** | inferred |
| 27A05 vs 29E09 | same epitope (D 0.83) | computed |

No SPR/BLI binning matrix for HER2 VHHs was found in anything I opened. The 2025 IgG-VHH biparatopic paper (PMC12634555) used ELISA with murine-domain chimeras only, reports no KD, places nanobody A9B5 on ECD I (AlphaFold3 contacts K228, D234), and mentions neither margetuximab nor zenocutuzumab.

## 6. Affinities
| binder | value | source / quality |
|---|---|---|
| trastuzumab | 1.22 nM (SPR) | bispecific-antibody patent, own conditions; consistent with the brief's 0.1-5 nM but no primary paper opened |
| pertuzumab | 2.35 nM (same patent) vs 54.9 pM (SPR, another patent) | conflicting; BLI study (npj Breast Cancer 2015, doi 10.1038/npjbcancer.2015.12; snippet only) ranks trastuzumab tighter |
| 2Rs15d | "low nanomolar"; a review gives about 7 nM | Vaneycken 2011 abstract; review (secondary) |
| 5F7 | review figure garbled ("~5 10 pM"); conjugated 5F7 variants 0.09-0.19 nM | low |
| enrichment after one panning round | **no source found.** Inference only: phage multivalency retains micromolar to nanomolar binders; AVIDa labels are enrichment statistics, not KD | reasoning, not data |

## 7. Coverage map (occupied vs vacant niches)
ECD residues 23-652 (630), contacts from 25 distinct binders, one structure per binder, ErbB partners excluded.

| domain | residues (P04626) | n | approved/clinical (trastuzumab, pertuzumab, zanidatamab arms) | any of 25 binders | vacant |
|---|---|---|---|---|---|
| I | 23-217 | 195 | 2 (K150, Q178) | 70 (36 %) | 64 % |
| II | 218-341 | 124 | 21 (17 %) | 51 (41 %) | 59 % |
| III | 342-510 | 169 | **0** | 47 (28 %) | 72 % |
| IV | 511-629 | 119 | 19 (16 %) | 45 (38 %) | 62 % |
| JM | 630-652 | 23 | 0 | 0 | 100 % (absent from many constructs) |
| total | | 630 | 42 (6.7 %) | 213 (33.8 %) | 66 % |

Contiguous runs (>= 15) touched by none of the 25 binders: 41-56 (I), 239-256 (II), 355-377 (III), 474-496 (III), 556-570 (IV), 627-652 (IV/JM). Two of these sit in domain III, which no approved drug covers.

### Schoener's D matrix
Footprint = binary occupancy over 630 ECD residues, normalised to sum 1; D = 1 - 0.5 * sum|p_i - q_i|; "." = 0.

| D |trastu|bH1|zani-IV|pertu|zani-II|EPS232|TL1|39S|NM-02|Ab 3WLW|HuA21|MF3958|2Rs15d|H2Mab-119|47D05|Fab37|affibody|Ab 3WSQ|27A05|29E09|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|trastu|1|.82|.47|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|
|bH1|.82|1|.50|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|
|zani-IV|.47|.50|1|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|
|pertu|.|.|.|1|.46|.41|.33|.|.|.|.|.|.04|.09|.09|.|.|.|.|.|
|zani-II|.|.|.|.46|1|.27|.22|.|.|.|.|.|.|.06|.09|.|.|.|.|.|
|EPS232|.|.|.|.41|.27|1|.11|.|.|.|.|.|.|.|.|.|.|.|.|.|
|TL1|.|.|.|.33|.22|.11|1|.|.|.|.|.|.|.|.03|.|.|.|.|.|
|39S|.|.|.|.|.|.|.|1|.46|.|.|.|.|.|.|.|.|.|.|.|
|NM-02|.|.|.|.|.|.|.|.46|1|.|.|.06|.06|.|.|.|.|.|.|.|
|Ab 3WLW|.|.|.|.|.|.|.|.|.|1|.50|.41|.|.|.|.|.|.|.|.|
|HuA21|.|.|.|.|.|.|.|.|.|.50|1|.72|.06|.|.|.|.|.|.|.|
|MF3958|.|.|.|.|.|.|.|.|.06|.41|.72|1|.|.|.|.|.|.|.|.|
|2Rs15d|.|.|.|.04|.|.|.|.|.06|.|.06|.|1|.71|.29|.|.|.|.|.|
|H2Mab-119|.|.|.|.09|.06|.|.|.|.|.|.|.|.71|1|.41|.|.|.|.|.|
|47D05|.|.|.|.09|.09|.|.03|.|.|.|.|.|.29|.41|1|.|.|.|.|.|
|Fab37|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|1|.73|.|.12|.12|
|affibody|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.73|1|.|.08|.04|
|Ab 3WSQ|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|1|.11|.12|
|27A05|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.12|.08|.11|1|.83|
|29E09|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.12|.04|.12|.83|1|

Reading: 0.82 trastuzumab/bH1 (same niche), 0.46 pertuzumab/zani-II, 0.72 HuA21/MF3958, 0.71 2Rs15d/H2Mab-119, 0.83 27A05/29E09, 0.73 Fab37/affibody. D is 0 between the domain IV, II, I and III groups. Contact-level D is strict: antibodies on the same epitope score 0.4-0.8 because edge residues differ; at domain level D is 1.0 for every pair inside a domain. Full 25x25 matrices (D, Jaccard, shared counts) are in the overlap JSON.

### Residue-level coverage heatmap (10-residue bins; hits = sum over 25 binders of contacted residues)

| residues (P04626) | mature | dom | approved-contact res | all-binder res | antibody-hits (sum) | glyph |
|---|---|---|---|---|---|---|
|23-32|1-10|I|0|1|1||
|33-42|11-20|I|0|4|8|###|
|43-52|21-30|I|0|0|0|.|
|53-62|31-40|I|0|1|1||
|63-72|41-50|I|0|2|4|#|
|73-82|51-60|I|0|1|1||
|83-92|61-70|I|0|1|1||
|93-102|71-80|I|0|0|0|.|
|103-112|81-90|I|0|6|15|#####|
|113-122|91-100|I|0|1|1||
|123-132|101-110|I|0|3|3|#|
|133-142|111-120|I|0|3|3|#|
|143-152|121-130|I|1|2|6|##|
|153-162|131-140|I|0|6|12|####|
|163-172|141-150|I|0|7|15|#####|
|173-182|151-160|I|1|10|26|#########|
|183-192|161-170|I|0|9|27|#########|
|193-202|171-180|I|0|8|21|#######|
|203-212|181-190|I|0|2|5|##|
|213-222|191-200|I|0|8|12|####|
|223-232|201-210|II|0|7|10|###|
|233-242|211-220|II|0|3|3|#|
|243-252|221-230|II|0|0|0|.|
|253-262|231-240|II|1|2|3|#|
|263-272|241-250|II|3|5|15|#####|
|273-282|251-260|II|5|8|24|########|
|283-292|261-270|II|1|3|5|##|
|293-302|271-280|II|0|0|0|.|
|303-312|281-290|II|4|8|15|#####|
|313-322|291-300|II|4|5|11|####|
|323-332|301-310|II|0|0|0|.|
|333-342|311-320|II|3|5|10|###|
|343-352|321-330|III|0|5|5|##|
|353-362|331-340|III|0|1|1||
|363-372|341-350|III|0|0|0|.|
|373-382|351-360|III|0|3|7|##|
|383-392|361-370|III|0|3|3|#|
|393-402|371-380|III|0|4|7|##|
|403-412|381-390|III|0|0|0|.|
|413-422|391-400|III|0|6|14|#####|
|423-432|401-410|III|0|3|5|##|
|433-442|411-420|III|0|3|3|#|
|443-452|421-430|III|0|7|12|####|
|453-462|431-440|III|0|1|1||
|463-472|441-450|III|0|2|5|##|
|473-482|451-460|III|0|1|2|#|
|483-492|461-470|III|0|0|0|.|
|493-502|471-480|III|0|3|4|#|
|503-512|481-490|III|0|5|8|###|
|513-522|491-500|IV|0|0|0|.|
|523-532|501-510|IV|0|5|9|###|
|533-542|511-520|IV|0|5|5|##|
|543-552|521-530|IV|0|5|8|###|
|553-562|531-540|IV|0|1|1||
|563-572|541-550|IV|0|2|3|#|
|573-582|551-560|IV|3|6|15|#####|
|583-592|561-570|IV|3|6|14|#####|
|593-602|571-580|IV|3|4|10|###|
|603-612|581-590|IV|2|2|2|#|
|613-622|591-600|IV|5|5|8|###|
|623-632|601-610|IV|3|4|7|##|
|633-642|611-620|JM|0|0|0|.|
|643-652|621-630|JM|0|0|0|.|

Hot spots: 173-202 (domain I, 26-27 hits per bin: 2Rs15d, H2Mab-119, MF3958, HuA21, DARPin crowd), 273-282 (24, pertuzumab arm), 413-422 and 443-452 (domain III: Fab37, affibody, 27A05, 29E09), 573-602 (domain IV: trastuzumab loops). The per-residue JSON lists every binder for every residue.

## 8. Mechanism-linked constraints
- **Pertuzumab blocks dimerisation.** Its epitope (267-279, 290, 308-318) overlaps the HER2 face that contacts partners in the cryo-EM heterodimers: HER3 in 7MN5 (22 HER2 residues, 7 shared with pertuzumab: 267, 268, 274, 276-279), HER4 in 8U4K (32 residues, 12 shared), EGFR in 8HGO (23 residues, 10 shared). EPS232 shares 11 of its 15 with the HER3 interface.
- **Trastuzumab does not.** It shares 0 residues with the three dimer interfaces; its last contact is C626 against ECD end 652 and TM 653-675, i.e. it binds the membrane-proximal end of domain IV (Cho 2003: near the juxtamembrane region).
- Consequences for camelid immunisation: the ONU antigen is the soluble ECD (C-terminal GACQ + His), so membrane proximity does not hide domain IV on the antigen; steric limits of the cell surface only matter for cell-based screening. Domain I is exposed and already hosts many binders (2Rs15d, H2Mab-119, MF3958, HuA21, 3WLW, DARPin, 47D05), consistent with domain I being immunodominant in recombinant-ECD immunisations - this is an inference, not measured here. Free-HER2 conformations (extended 9QBG vs compact 9QBF, no partner chains in those entries) change which faces are exposed; not quantified.

## Forced analogy: Ecology niche modelling (occupancy, niche overlap, presence-only SDM)
(a) Each antibody is a species, HER2 ECD residues are habitat cells, the footprint is the realised niche, Schoener's D is niche overlap, "vacant niche" is a residue with zero occupancy, and the held-out VHHs are new species whose niche we predict from known species using presence-only data.

(b) Computed above: D matrix, coverage, dark runs. Testable idea: a MaxEnt-style residue prior p(u) built from other binders (footprint counts, optionally Gaussian-smoothed with sigma 3 residues) as an input feature for Track A. Leave-one-clone-out test on the 5 VHH epitopes in the PDB (630-residue ECD, positives 1.6-2.9 %, mutual epitope twin 27A05/29E09 excluded together):

| held-out VHH | positives | average precision, counts | AP, smoothed sigma 3 |
|---|---|---|---|
| 2Rs15d | 17 | 0.085 | 0.117 |
| NM-02 | 13 | 0.024 | 0.023 |
| 27A05 | 18 | 0.028 | 0.021 |
| 47D05 | 10 | 0.044 | 0.056 |
| 29E09 | 17 | 0.025 | 0.019 |
| macro | | 0.041 | 0.047 |

Base rate (random) 0.024; with the other VHHs also removed the smoothed macro AP is 0.036. So the prior is about 2x random at best, and helps only domain-I VHHs.

(c) Verdict: **partially holds.** It holds for description (niches are domain-structured, overlap is block-diagonal). It breaks for prediction because (1) presence-only PDB data are heavily sampling-biased (clinical antibodies, crystallisation-friendly domains), the SDM "survey bias" problem; (2) the new VHH niches (27A05/29E09) bridge domains I and III, which a per-residue marginal prior cannot represent; (3) n = 5. Use the map only as a weak prior multiplied with accessibility/conservation terms, and bias-correct it first (divide by an estimate of antibody-sampling effort per residue).

## Gotchas / what could fool us
1. **5O4G is MF3958, not margetuximab**; there is no public margetuximab-HER2 structure in the P04626 set.
2. The brief's Franklin DOI does not match RCSB; use 10.1016/S1535-6108(04)00083-2.
3. Several entries hold two HER2 or Fab copies (1S78, 3WLW, 4HRN, 3H3B); footprints differ by 1-3 residues. I used the first copy and compared copies only for 1S78.
4. Numbering: author numbering is mature or private; 7MN*, 9QB* entries include MBP/GFP fusions; P04626 includes the 22-residue signal peptide. I used alignment mapping; never add +22 blindly (6BGT's entity range starts at 1).
5. HER3/EGFR/HER4 contacts on HER2 are partner footprints, excluded from the 25-binder coverage but used for the mechanism check.
6. An unweighted 4.0 A contact set is not the challenge truth (Voronota-LT contact areas); low-area edge residues are included here.
7. Resolution spans 1.69 A to 7.5 A (zanidatamab 8FFJ; 6OGE is 4.36 A). Unresolved loops and glycans are invisible, so "vacant" can mean disordered or glycan-masked.
8. Clinical antibodies without public structures (zenocutuzumab, disitamab, ZW49, margetuximab) are missing, so approved-drug coverage of domains I-III is undercounted.
9. HER2 VHH binning data are sparse and come from abstracts or reviews; the 5F7-trastuzumab competition claim and the 5F7 KD are secondary and partly garbled.
10. AVIDa labels are enrichment-based, not KD; a single round retains weak binders and display-avidity artefacts.
11. 9MTE/9MTX nanobodies (Sanofi) are public and bridge I+III; they are not the ONU clones and nothing links them.
12. Heuristic CDR assignment; do not use the paratope region counts as ground truth.

## Implications for the challenge
1. Use footprint occupancy only as a weak, bias-corrected prior: strong for domain I, plausible vacant targets are domain III (342-510) and the I/III cleft; expect small gains.
2. Allow non-contiguous (I+III) predicted epitopes; do not smooth strictly along sequence.
3. Treat 2Rs15d/H2Mab-119/47D05/DARPin 9_29 as the domain-I template family and 27A05/29E09/Fab37/affibody as the domain-III family when ranking AF3/Boltz/OpenFold3 co-fold models: score candidate poses by agreement with these footprints.
4. Down-weight trastuzumab and pertuzumab footprints in the prior: zero overlap with every VHH structure except 2 edge residues (pertuzumab vs 47D05).
5. Assign each ONU clone to a template family by CDR3 similarity to 2Rs15d, 27A05, 29E09, NM-02 and use the family's footprint as the prior: cheap and testable once ONU sequences are captured.
6. Use `her2_public_complexes.json` for template lookup; the nanobody complexes are 5MY6, 7QVK, 9MTE, 9MTX only.

## Open questions
- Do ONU11/13/23 compete with 2Rs15d, 27A05 or 29E09? Needs binning or the post-judging structures.
- Primary monovalent KD values for trastuzumab, pertuzumab, 5F7 and 2Rs15d were not opened.
- Margetuximab, zenocutuzumab, disitamab, ZW49 epitopes unverified.
- Voronota-LT area-weighted footprints for the same 25 complexes were not run; they would give challenge-style truth.

## Sources (opened this session)
- RCSB Search, Data and GraphQL APIs and mmCIF files (https://search.rcsb.org, https://data.rcsb.org, https://files.rcsb.org): 63 P04626 entries and their citations.
- UniProt P04626 JSON: https://rest.uniprot.org/uniprotkb/P04626.json
- openFDA drugsfda and label endpoints: https://api.fda.gov/drug/drugsfda.json and https://api.fda.gov/drug/label.json
- Cho 2003, doi 10.1038/nature01392 (abstract-level record via search, PubMed 12610629)
- Vaneycken 2011: https://faseb.onlinelibrary.wiley.com/doi/abs/10.1096/fj.10-180331 (search-result abstract)
- At-211 nanobody paper https://pubs.acs.org/doi/10.1021/acs.molpharmaceut.9b00354 and review https://link.springer.com/article/10.1007/s00259-020-05094-1 (search snippets only)
- IgG-VHH biparatopic article https://pmc.ncbi.nlm.nih.gov/articles/PMC12634555/ (first 100,000 characters read)
- TPP-45142 record https://pubmed.ncbi.nlm.nih.gov/41504346/ (via E-utilities); RCSB pages for 9MTE and 9MTX
- Patent snippets for affinities: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9957325 and https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11787873 (snippet-level only)
- Computation: Biopython NeighborSearch + PairwiseAligner; scripts in C:\Temp\sepiq26\her2\ (an.py, fin.py, fin2.py, cx.py)
