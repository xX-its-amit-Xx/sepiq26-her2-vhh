---
title: Known anti-HER2 nanobodies - structures, epitopes, affinities, and attribution of ONU11/13/23
queen: q2_vhh_immunology_structure
king: king_world
worker: known_her2_nanobodies_2rs15d_5f7_and_others_epitopes_and_affinities
tier: expert
tags: [HER2, nanobody, VHH, epitope, PDB, 5MY6, 9MTE, 9MTX, 2Rs15d, 5F7]
confidence: medium
challenge_relevance: 3
serendipity: Art-provenance attribution (catalogue raisonne) - tried CDR3/CDR1 "brushstroke" matching of ONU clones to catalogued works; result is no attributable school, only a germline-level CDR1 resemblance. Paid off as a negative result.
date: 2026-10-17
---

## TL;DR
Only three public HER2-nanobody structures were found: 5MY6 (2Rs15d, domain I, X-ray) and, released 2025-11-19, cryo-EM 9MTE (27A05 + 47D05) and 9MTX (29E09). The sepiq.uk page gives no epitope information for ONU11/13/23, and no catalogued CDR3 resembles the ONU CDR3s (by eye; BLASTp not run), so the epitope domain must come from a weak prior. Only about 5 independent domain assignments could be verified.

## Master table (verified = source opened)
| Name | PDB | Epitope domain | Affinity | Source | Verified |
|---|---|---|---|---|---|
| 2Rs15d | 5MY6 (X-ray 2.25 A; chain A HER2 622 res, chain B Nb 115 res; released 2017-08-09) | I (contact residues not retrieved) | 3.9 nM (method not stated); 4.74 +/- 0.39 nM 131I-Nb on cells (snippet only) | D'Huyvetter, Clin Cancer Res 2017, 10.1158/1078-0432.CCR-17-0310 (unopened); Ducharme, Mol Pharm 2023, 10.1021/acs.molpharmaceut.3c00360 | Y (PDB, domain); N (residues, KD method) |
| 5F7 | none found | not reported; from a trastuzumab-competing panel | SPR 0.51 nM (ka 1.054e6 /M/s, kd 5.381e-4 /s); BT474M1 cells 1.8 nM (125I), 3.2 nM (131I) | Pruszynski, Nucl Med Biol 2012, 10.1016/j.nucmedbio.2012.08.008 | Y |
| 27A05 | 9MTE (cryo-EM 2.66 A, 2025-11-19) | not retrieved | not retrieved | De Tavernier, Mol Cancer Ther 2026, 10.1158/1535-7163.MCT-25-0654 | Y entry; N rest (AACR page 403) |
| 47D05 | 9MTE | not retrieved | not retrieved | same | Y entry; N rest; equivalence to brief's "47D5" unverified |
| 29E09 | 9MTX (cryo-EM 3.06 A, 2025-11-19) | not retrieved | not retrieved | same | Y entry; N rest |
| A2G5 | none | I | BLI 14.37 nM (parent A2H4 98.13) | Liu, Front Immunol 2023, 10.3389/fimmu.2023.1292839 | Y |
| A9B5 | none | I | BLI 7.801 nM (parent A9H5 136.7) | same | Y |
| H2F5 | none | II (overlaps pertuzumab) | BLI 3.89 nM (parent H2C11 509.5) | same | Y |
| G1E4 | none | IV (trastuzumab blocks) | BLI 53.4 nM (parent G1H2 750) | same | Y |
| 11A4, 22G, 18G, A10, D12, 5F7-47D5 biparatopic, CAR-T VHHs, Hamers/Cong sets | unknown | unknown | unknown | none opened | N - unverified seed items |

Same table as JSON at the same basename (.json).

## Q2 Structures
- 5MY6: HER2 + 2Rs15d, X-ray, 2.25 A (Sterckx, D'Huyvetter, Devoogdt). HER2 chain begins QVCTGTDMK.
- 9MTE: HER2 ECD (630 res, begins TQVCTGTDMK) + 27A05 + 47D05, 2.66 A. 9MTX: HER2 ECD (630 res) + 29E09, 3.06 A. Both from the TPP-45142 T-cell-engager paper.
- The 9MTX HER2 chain reads "DMQRHLY" where 5MY6 and 9MTE read "DMLRHLY"; a point difference whose origin I did not investigate.
- RCSB advanced search and SAbDab-nano were NOT run (interactive); entries came from web search plus RCSB pages, so the list may be incomplete. Seed candidate "6QUR": not confirmed, discard. 5MY6 is confirmed.
- These HER2 constructs are almost the challenge antigen (P04626 ECD), so they are usable public templates.

## Q3 How domains were assigned
- 2Rs15d: crystal structure plus non-competition with trastuzumab and pertuzumab (Ducharme restating the original screen).
- 5F7: no epitope mapping reported; only trastuzumab competition on SKBR3 cells (domain IV vicinity by inference, not by mapping).
- A2G5, A9B5, H2F5, G1E4: murine-domain-swap HER2-Fc chimeras (mD1, mD2, mD4; mD3 excluded for poor expression) plus competitive ELISA (A2G5 and A9B5 block each other; trastuzumab blocks G1E4). Domain III was never tested.
- 27A05, 47D05, 29E09: cryo-EM; domain not retrieved. Only "distinct from trastuzumab and pertuzumab epitopes" (search snippet).

## Q4 Affinities and discrepancies
5F7: SPR 0.51 nM vs cells 1.8-3.2 nM (3.5-6x weaker on cells). 2Rs15d: 3.9 vs 4.74 nM, consistent but methods differ or are unstated. Liu 2023 uses BLI with His-Nb on Ni-NTA and HER2-ECD-Fc as analyte (bivalent analyte, avidity risk). Cross-paper comparison is not valid. Cell lines: BT474/BT474M1, SKBR3, NCI-N87. On/off rates only for 5F7.

## Q5 ONU clones
sepiq.uk /detail (opened): sequences printed, no epitope annotation. HF discussion, bioRxiv, COGNANO and EMDB holds: not found (not exhaustively searched).
- ONU11 CDR1 GRTLSGWVMG; CDR3 about AARPLGSTWTEHPY
- ONU13 CDR1 ERTFSIDYMG; CDR3 about AAKYGSSRLWDY
- ONU23 CDR1 GRTLSGAAMG; CDR3 about AADGRFYSDYVWSSPDEYAY
Catalogued CDR3s (from RCSB FASTA I opened): 2Rs15d AVCYNLETY; 27A05 WDVNGDI; 47D05 YMDQRLDGSTLAY; 29E09 RDVNGDY. Sequences for 5F7 and the Liu nanobodies were not obtained.

Attribution verdict:
- Possible: CDR3 and CDR1 comparison by eye against 4 catalogued sequences.
- Not possible: BLASTp (Biopython absent, no web BLAST run), comparison to 5F7/A2G5/A9B5/H2F5/G1E4, epitope-level test.
- Findings: 27A05 and 29E09 share CDR3 core "DVNGD" (one clonal family). ONU11 and ONU23 share CDR1 "GRTLSG..MG" with different CDR3s, so same germline-like school but different hands; this CDR1 is common in camelids and not diagnostic. No ONU CDR3 resembles any catalogued CDR3: all three are unprecedented relative to this sample.

## Q6 Domain prior
Verified independent epitopes: 2Rs15d I; A2G5/A9B5 I (mutually blocking, count once); H2F5 II; G1E4 IV; 5F7 IV-proximal (inference). Count: I 2, II 1, III 0, IV 2 of 5. n is far too small and III is untested/under-sampled, plus immunisation and trastuzumab-elution selection bias. My judgement prior for ONU clones (not measured): I 0.30, II 0.20, III 0.15, IV 0.35. Domain boundaries (P04626 numbering, from memory, unverified): I 23-195, II 196-319, III 320-488, IV 489-607. Signal peptide is 1-22, so PDB mature numbering is offset by about 22 (check the template CSV).

## Forced analogy: art provenance and catalogue raisonne
(a) Catalogued nanobodies are authenticated works; ONU clones are unattributed. (b) Testable: for each ONU clone find CDR3 neighbours among AVIDa-hHER2 binders (same animal, so the real "workshop") and share epitope predictions inside a cluster; use public 5MY6/9MTE/9MTX as external anchors and the 27A05/29E09 sibling pair as a check that a CDR3 core tracks an epitope. (c) Partially holds: clonal family does predict epitope, but only 3 structures from other animals exist, so attribution mostly breaks for ONU.

## Gotchas
- Trastuzumab competition gives steric overlap, not domain.
- Domain-swap with murine HER2 misses epitopes on conserved surface and cannot score domain III here.
- Numbering offset of 22 and construct differences (622 vs 630 residues).
- 9MTE VHHs carry FLAG/His tags; strip them when using as templates.
- Priors from n=5 are noise; do not over-trust.
- Search-engine summaries (4.74 nM, "distinct epitope") are unopened primary claims.

## Implications for the challenge
1. Use 5MY6, 9MTE, 9MTX as templates/docking anchors and document them as public data.
2. Cluster ONU CDR3s against AVIDa-hHER2 binders and propagate epitope signal within clusters.
3. Hedge domain probabilities (I and IV highest, III not zero) until better evidence.
4. Extract interface residues for 5MY6/9MTE/9MTX (PDBe/PDBsum) to build an empirical contact footprint.
5. Obtain the Mol Cancer Ther 2026 domain assignments via a mirror or author manuscript.

## Open questions
Domains and KDs of 27A05, 47D05, 29E09; PDB-wide completeness; identity of "47D5"; 11A4, 22G, 18G, A10, D12; HF discussion and EMDB holds for ONU; real BLASTp scores.

## Sources (opened)
- https://www.rcsb.org/structure/5my6 , https://www.rcsb.org/structure/9MTE , https://www.rcsb.org/structure/9MTX
- https://www.rcsb.org/fasta/entry/5MY6 , /9MTE , /9MTX
- https://sepiq.uk/detail
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11606513 (Ducharme 2023)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3551612 (Pruszynski 2012)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10634241/ (Liu 2023)
- Not opened (snippet only): D'Huyvetter CCR 2017 10.1158/1078-0432.CCR-17-0310; De Tavernier MCT 2026 10.1158/1535-7163.MCT-25-0654 (403)
