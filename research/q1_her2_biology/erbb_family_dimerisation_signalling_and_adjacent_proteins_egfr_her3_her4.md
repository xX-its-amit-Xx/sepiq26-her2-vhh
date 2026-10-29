---
title: ERBB family dimerisation, signalling and neighbouring proteins (EGFR, HER3, HER4) as they bear on a HER2 VHH epitope
queen: q1_her2_biology
king: king_world
worker: erbb_family_dimerisation_signalling_and_adjacent_proteins_egfr_her3_her4
tier: expert
tags: [HER2, ERBB2, dimerisation, HER3, EGFR, HER4, cryo-EM, nanobody, epitope, PDB, shedding, p95HER2]
confidence: medium
challenge_relevance: 4
serendipity: Competitive-exclusion niche analogy (realized vs fundamental niche). It paid off. The natural-partner-occupied patch is a measurable residue set, and none of the 4 public HER2-VHH epitopes overlaps it.
date: 2026-10-17
---

## TL;DR
HER2 is permanently in the "open" (extended) shape, and its domain II "dimerisation arm" plus the pocket formed by domains I-II is the surface that EGFR, HER3 and HER4 occupy when they partner with it. I computed that partner-occupied patch directly from the deposited cryo-EM structures (about 51 residues, mostly domain II, P04626 residues 221-351, plus a small domain I rim at 57/105/106). The four public HER2-VHH epitopes in the PDB (2Rs15d, 27A05, 29E09, 47D05) sit on domains I and III and do not overlap that patch, apart from one residue (105) for 47D05. If the challenge antigen is a monomeric ECD, as is usual, the dimer patch is open and nothing forbids a VHH from landing there, but historically VHHs have not been found there.

## 1. Dimerisation model and the PDB set (all PDB ids pulled from RCSB search + data API on 2026-10-17)

**Domains (P04626 numbering incl. 22-aa signal peptide).** I 23-215, II 216-338, III 339-500, IV 501-629 (Fig. 1 legend of Gragera 2025 Sci Adv, doi 10.1126/sciadv.adu9945). UniProt itself only annotates ECD = 23-652, TM 653-675. These are literature boundaries and differ by a few residues between papers.

**Tethered vs extended.** In the inactive EGFR/HER3/HER4 state, domain IV contacts domain II and hides the dimerisation arm (the "tether"). Ligand binds between domains I and III and the receptor extends, which exposes the arm (Diwanji 2021 text). HER2 has no known ligand and is permanently extended. In the Diwanji structures HER2 is "nearly identical" to earlier monomeric structures (RMSD about 0.7-1.0 Å), so it needs no further change to join a dimer. Burgess 2003 (Mol Cell 12:541) is the standard review of this model. I did not open it, so I cite it only as a pointer.

**Dimerisation arm.** HER2 arm is residues 270-285 (EGFR arm 266-281 in Zhang 2023 numbering; HER2 sequence 270-285 = ALVTYNTDTFESMPNP in P04626). Key HER2 residues are F279 and L313. EGFR Y275 makes a cation-pi with R309 in the EGFR homodimer, but HER2 has L313 at the equivalent site, so the HER2 arm inserts into the EGFR pocket and not the reverse (Zhang 2023, Cell Discov 9:18, PMC9925823). In HER2/HER3 only the HER2 arm is resolved. The HER3 arm is unresolved in wild type, and HER3 pulldown does not need it. HER2-S310F (oncogenic) adds pi-stacking with HER3 Y265, so the HER3 arm becomes visible and buried area rises from 1,977 to 3,378 Å² (Diwanji 2021, Nature 600:339).

**Correction to the brief.** The correct DOI of Diwanji 2021 is 10.1038/s41586-021-04084-z, not ...04052-x.

| PDB | What | Res. Å | Year | Note |
|---|---|---|---|---|
| 7MN5 | HER2/HER3/NRG1b ECD | 2.93 | 2021 | Diwanji 2021; HER2 fused to MBP |
| 7MN6 | HER2 S310F/HER3/NRG1b | 3.09 | 2021 | arm of HER3 resolved |
| 7MN8 | HER2 S310F/HER3/NRG1b + trastuzumab Fab | 3.45 | 2021 | text says 3.5/3.45/3.4 in different places |
| 8HGO | EGF-bound EGFR/HER2 ECD | 3.31 | 2023 | Zhang 2023 |
| 8HGP | EREG-bound EGFR/HER2 ECD | 4.53 | 2023 | |
| 8U4L | HER2/HER4/NRG1b ECD | 3.31 | 2024 | Trenker 2024 eLife |
| 8U4K | HER2/HER4/BTC ECD | 4.27 | 2024 | |
| 8VQE | HER2 S310F homodimer ECD (Fc fusion) | 2.67 | 2024 | Nat Chem Biol 21:706 |
| 3WLW | HER2 ECD homodimer with antibodies | 3.09 | 2015 | antibody-driven; lattice-like |
| 1S78 | HER2-pertuzumab | 3.25 | 2004 | pertuzumab binds the arm region |

HER2-HER3 buried area (domains I-III): 1,977 Å² (WT). HER2-EGFR arm interface: 1,395 Å² total (910 Å² HER2 side) vs 1,769 Å² in the EGFR homodimer.

## 2. Dimer-interface residues in P04626 numbering (computed)

Method: heavy atoms within 4.5 Å between the HER2 chain and the partner chain, chain A/B of the asymmetric unit only. Residues were mapped to P04626 by alignment, because older crystal entries use mature numbering (offset +22; 2A91 +21), while the cryo-EM entries use full P04626 numbering. Full data: `her2_public_complexes.json`.

| Partner | PDB | n HER2 residues | Domains | Residues (P04626) |
|---|---|---|---|---|
| HER3 | 7MN5 | 27 | II | 221-224, 232-238, 247-249, 267, 268, 270, 272, 274, 276-281, 307, 335 |
| EGFR | 8HGO | 31 | II (29), III (2) | 222-224, 232-238, 247, 248, 267, 272, 274, 276-281, 307, 308, 310, 312, 316, 317, 332, 333, 348, 351 |
| HER4 | 8U4L | 39 | II (36), I (3) | 57, 105, 106, 224, 232, 233, 235-237, 239, 247-249, 258, 265-267, 270, 274, 276-281, 290-292, 303, 306, 308, 310-314, 316, 333, 335 |
| HER2 (S310F homodimer) | 8VQE | 28 | II (24), I (4) | 57, 81, 105, 106, 258, 272-274, 276, 277, 279-281, 290-293, 303, 307, 308, 310-314, 316, 332, 333 |

- The union over the three heterodimers is 51 residues. The residues shared by all three heterodimers (the core "occupied niche") are 224, 232, 233, 235, 236, 237, 247, 248, 267, 274, 276, 277, 278, 279, 280, 281. This is the arm 274-281 plus the 224-248 stretch of domain II.
- The HER2-HER3 interface is the smallest and most "dynamic" of the three, per Diwanji 2021. HER4 and the homodimer use more of the domain I rim (57, 105, 106).
- Surface occluded by the partner means HER2 domain II (216-338) body and the arm-binding pocket (arm of partner enters the pocket between HER2 domains I/II; HER2 residues 258, 290-292, 303, 310-314).
- 3WLW (2015 antibody-induced HER2 homodimer, 3.09 Å) is a different, Fab-bridged geometry, and its contacts (35, 37, 178, 266-279, 308, 310, 378, 420, 446-473, 497-513) include domains III and IV. I treat it as an artefact-prone model, not a physiological homodimer.

**Is the challenge construct monomeric?** The brief says the antigen is the HER2 ECD with a C-terminal GACQ and His tag, and the binding assays used one wild-type HER2. Nothing I opened says the construct is a dimer. The comparable public VHH structures (9MTE, 9MTX, below) use the ECD 23-652 as a single copy (one HER2 chain modelled per entry). The ECD alone does not dimerise detectably at cryo-EM concentrations (public HER2 ECD structures 9QBF-9QBH are monomers). So I treat the challenge construct as a monomer, but this is an inference, not a verified fact. A C-terminal GACQ (cysteine) could allow disulfide-linked dimers in prep, and that is worth checking in the training-data README.

## 3. ERBB neighbourhood table (UniProt entries pulled; identities computed by me with BLOSUM62 global alignment of ECDs, projected on the HER2 domain boundaries above)

| Protein | UniProt | ECD (UniProt) | ECD length | % id to HER2 ECD | Domain I | II | III | IV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| HER2 | P04626 | 23-652 | 630 | 100 | | | | | |
| EGFR | P00533 | 25-645 | 621 | 43.5 | 42.5 | 51.2 | 39.5 | 45.0 | domain III is the least conserved |
| HER3 | P21860 | 20-643 | 624 | 44.0 | 45.6 | 45.5 | 40.7 | 47.3 | kinase-dead; NRG1 binder |
| HER4 | Q15303 | 26-651 | 626 | 43.5 | 46.6 | 48.0 | 40.1 | 41.9 | binds NRG1, BTC |

Percentages are over the HER2 domain length (identical residues / HER2 domain residues). The domain boundaries are projected by alignment and are approximate (about 5 residues). Ligands: NRG1 (Q02297, EGF-like 178-222, binds HER3/HER4), EGF (P01133, mature 971-1023, binds EGFR), BTC P35070, EREG O14944. HER2 binds no ligand. MUC4 (Q99102, 5,412 aa, EGF-like 5118-5157 and 5321-5360) is the classic HER2-associated mucin (it hinders trastuzumab access in the literature); I did not find a structure and did not verify the association in a source I opened. Integrin and other HER2-associated claims are likewise unverified here.

**Cross-reactivity risk for a HER2 VHH.** Overall identity is only about 44 %, so at the whole-domain level cross-reactivity is not expected. The risk sits at conserved patches. Domain II is the most conserved (45-51 %), and the dimerisation arm and pocket are shared by all four receptors. A VHH against the arm region would be a pan-ERBB candidate. Measured epitope identity (from my contact sets) is below.

| Epitope | PDB | n | Domains | Identical residues in EGFR / HER3 / HER4 |
|---|---|---|---|---|
| 2Rs15d | 5MY6 | 18 | I (17) | 2 / 0 / 7 |
| 27A05 | 9MTE | 23 | III (16), I (7) | 5 / 4 / 4 |
| 29E09 | 9MTX | 19 | III (11), I (8) | 3 / 2 / 3 |
| 47D05 | 9MTE | 14 | I (12), II (2) | 1 / 3 / 4 |
| Trastuzumab | 1N8Z | 25 | IV (19), II (4), I (2) | 8 / 11 / 13 |
| Pertuzumab | 1S78 | 26 | II (24) | 9 / 8 / 9 |
| HER3 partner | 7MN5 | 27 | II | 12 / 12 / 13 |

The VHH epitopes on domains I and III are 0-7 identical residues out of 14-23, so they are highly HER2-specific. The dimer patch is about 45-50 % identical, so a VHH there carries real cross-reactivity risk.

## 4. Signalling (brief; from general knowledge of the field, not from sources I opened, hence medium confidence)

| Pathway | Docking sites | Comment |
|---|---|---|
| MAPK (Shc/Grb2/SOS) | HER2 Y1248 (also Y1221/Y1222 region), Y1139 (Grb2/Grb7) | PDB shows Grb7-SH2 on HER2 pY1139 peptide (1MW4, 2L4K) and PTPN18 on pY1248 (4GFU, 4NND) |
| PI3K/AKT | HER3 YXXM motifs (HER2 itself has few) | HER2-HER3 is the potent PI3K unit (count of HER3 motifs unverified here) |
| PLC-gamma | HER2 phosphotyrosines (5TQS, PLCG1 C-SH2) | |
| STAT3 | via HER2/EGFR pY and via SRC | |
| SRC | HER2 pY877 (in the kinase domain) | |

Implication for epitopes: signalling lives on the intracellular tails and does not directly alter the ECD. The ECD-relevant effects on cells are (a) dimer partners occupying domain II (about 51 residues) on dimerised HER2, (b) the compact versus extended equilibrium (Gragera 2025: compact form seen only with trastuzumab, a minority of particles, 91,370 vs 77,784), (c) glycans (cryo-EM shows N-glycans on the ECD), and (d) membrane proximity (domain IV and the juxtamembrane region 630-652 are close to the membrane). Recombinant ECD has none of (a), (c-membrane) or (d). Epitopes on domains I and III are therefore the least likely to differ between ECD and cell. Domain II and IV epitopes are the likeliest to be cell-context dependent.

## 5. Nanobodies with solved structures (RCSB search by UniProt, 2026-10-17)

| PDB | Target | VHH | Res. Å | Epitope domain | Conformation selectivity | Source |
|---|---|---|---|---|---|---|
| 4KRL / 4KRM | EGFR domain III | 7D12 | 2.85 / 2.66 | III (my contacts: 348-349, 370-382, 408, 432-444, 465-467) | Blocks ligand sterically like cetuximab; acts on isolated domain III, so not conformation-selective | Schmitz 2013 Structure 21:1214, doi 10.1016/j.str.2013.05.008 |
| 4KRO | EGFR ECD | EgA1 | 3.05 | Domain II/III junction (my contacts 316-335, 363-364, 399-484) | Binds the tethered form region, prevents the conformational change for ligand binding; epitope reachable by convex VHH paratope, not by flat mAb paratope | same |
| 4KRP | EGFR ECD | 9G8 | 2.82 | Domain II/III junction | same | same |
| 7OM4 | EGFR-EGF full ECD | EgB4 | 6.05 | Domains I and II | Binds the active, ligand-bound form, non-inhibitory | BMC Mol Cell Biol 23:12 (2022), doi 10.1186/s12860-022-00412-x |
| 8UKV | EGFRvIII | 34E5 | 2.94 | Domain III region (chain assignment of VHH not verified by me) | EGFRvIII-binding | Structure 32:1367 (2024), doi 10.1016/j.str.2024.05.018 |
| 5MY6 | HER2 | 2Rs15d | 2.25 | Domain I (my contacts: 109-112, 156-157, 170-183, 217) | does not compete with trastuzumab or pertuzumab | Clin Cancer Res 23:6616 (2017), doi 10.1158/1078-0432.CCR-17-0310 |
| 9MTE | HER2 ECD + Fabs | 27A05, 47D05 | 2.66 | 27A05 domains I+III; 47D05 domain I (+II) | 27A05 and 29E09 same bin, no competition with trastuzumab or pertuzumab | De Tavernier 2026 Mol Cancer Ther 25:541, doi 10.1158/1535-7163.MCT-25-0654 |
| 9MTX | HER2 ECD + Fab | 29E09 | 2.78-3.06 (paper gives three values) | domains I+III | same | same |

I found no VHH structure for HER3 or HER4 in RCSB (HER3 has Fab and DARPin binders, e.g. 7BHE DARPin D5, 3P11, 4LEO). The 9MTE/9MTX structures are the closest public analogues to the challenge: they are single-copy HER2 ECD (23-652) plus a VHH, solved with Fab fiducials because a lone VHH is too small. The brief's ground truth (University of Osaka) probably used a similar trick, though that is not stated.

Paratope/epitope rules that transfer: VHHs reach concave and junction epitopes that flat Fabs miss (EgA1/9G8); the epitope covers 15-23 antigen residues and about 900-950 Å² (27A05 901 Å², 29E09 949 Å²; 15 of their 18-19 residues are shared); salt bridge D417(HER2)-R52(VHH) in 27A05.

## 6. Kinetics and affinities

- HER2-HER3 or HER2-EGFR ECD affinity: no KD found in the sources I opened. Diwanji 2021 reports pulldown ratios, not KD; Zhang 2023 gives buried areas only. A tight, ligand-independent HER2-ECD/HER3-ECD KD is not measured in what I read (so "unverified", not zero). Ligand-driven dimerisation happens via the ligand-binding partner, and HER2 does not bind NRG1 or EGF.
- 27A05 / 29E09: SPR 1:1 Langmuir, 0.73-750 nM series, "low nanomolar", 27A05 has the slower dissociation; numeric values are in Supplementary Table S3 which I could not read.
- 2Rs15d: 4.74 ± 0.39 nM on HER2+ cells for [131I]SGMIB-2Rs15d (Clin Cancer Res 2017 abstract, via search result); SPR value not found.
- Recombinant versus cell: phage panning uses a single ECD copy with C-terminal tag, no membrane, no partner, no glycan crowding. Cells carry partners, a glycocalyx (MUC4 on some), and receptor clusters. Cell-level data in De Tavernier cover only the bivalent T-cell engager (IC50 2.3 pM on BT-549, 10.2 pM on ZR-75-1), not the single VHHs.

## 7. Ectodomain shedding and p95HER2

- Sheddase: ADAM10 is a major source of HER2 ECD shedding (Liu 2006, Cancer Biol Ther 5:657, doi 10.4161/cbt.5.6.2708, abstract opened). Evidence for ADAM17 is weaker. Metalloprotease inhibitors (TIMP-1, TAPI, batimastat) block shedding (Codony-Servat 1999 Cancer Res 59:1196; Christianson 1998).
- Cleavage site: a secondary search result (not a primary paper) gives the primary site at 647-648 and a minor site at 644-645, juxtamembrane. In P04626 residues 644-648 are A-E-Q-R-A (A644, E645, Q646, R647, A648), consistent with "near Ala 648". I could not confirm in a primary paper. Confidence low-medium.
- Two different "p95" species: (i) the shed ECD is about 105-110 kDa (Zabrecky 1991 JBC; Pupa 1993); (ii) the membrane-retained C-terminal fragments (CTFs, p95HER2, 100-115 kDa) come from alternative translation initiation at Met611 and Met687 (Anido 2006 EMBO J, doi 10.1038/sj.emboj.7601191, abstract opened; I verified M611 and M687 in P04626). Christianson 1998 used the name "p95" for a shedding-related fragment in tissues. CTFs lack almost the whole ECD, and tumours dependent on CTFs do not respond to anti-HER2 antibodies.
- Result: in serum, shed ECD (23-~647) has no dimer partner and no membrane, so it looks like the recombinant monomer ECD. A VHH raised against recombinant ECD may therefore bind soluble shed ECD in patient serum (sink effect).

## Forced analogy: ecology, competitive exclusion and niche modelling

(a) The analogy. The HER2 surface is a habitat. Natural dimer partners (EGFR, HER3, HER4, HER2 itself) are competing species. The patch they occupy in dimers (about 51 residues in domain II plus a small domain I rim) is their realized niche, in the sense that on a cell it is mostly taken. Everything exposed on a monomer ECD is the fundamental niche for a VHH (the set of residues it could bind in the absence of competition). A recombinant monomer ECD removes the competitors, so the occupied patch is open (niche release, as on an island with no predators).

(b) Testable idea. Build the "occupancy" map (union of partner contact residues, listed in section 2) and the "binder-use" map (contacts over 32 public HER2-binder structures). Binder use per residue is uneven: of the 32 entries with a binder partner, domain I is used in 19, IV in 17, II in 15 and III in 9, but trastuzumab and pertuzumab dominate (each in many entries), so this is a heavily redundant prior. Hot residues: 579-583, 592-595, 615 (trastuzumab, domain IV); 267, 274-279, 308 (pertuzumab and partners, domain II). The four public VHH structures use none of the arm patch. Proposed Track A prior: (i) multiply the per-residue score by a domain II-arm penalty for residues 221-281 and 307-335 unless the model has strong evidence; (ii) boost domain I (23-215) and domain III (339-500) concave patches, where all 4 public HER2 VHH epitopes are located; (iii) test the penalty by leave-one-out over the 4 public VHH complexes, so the metric is per-residue PR-AUC on 9MTE/9MTX/5MY6 against a flat prior. The prediction is a modest gain, because only 4 structures are available and they contain two near-identical epitopes (27A05 and 29E09 share 15 residues).

(c) Does it hold? Partially. It holds for geometry (the occupied patch is measurable and VHH epitopes avoid it). It breaks on three points: partner occupancy matters on cells but not in the monomer-ECD cryo-EM ground truth, so the ground-truth epitope can sit on the "occupied" patch without any competitive cost, and "realized niche" is the wrong target. Second, competitive exclusion needs a dynamic constraint, whereas the phage selection and the structure have none for the dimer patch, so avoidance in the 4 public examples might simply reflect that selected VHHs came from panning on monomer ECD and domain II is a poorer, flatter surface (the 9G8/EgA1 lesson says VHHs like concave junctions). Third, with n = 4 the avoidance is not statistically established (p cannot be claimed).

## Gotchas / what could fool us

1. **Numbering.** Old crystal entries (1N8Z, 1S78, 3BE1, 3WLW, 3H3B) number the mature protein (auth = UniProt − 22; 2A91 − 21). Cryo-EM entries from 2021 onward use full P04626 numbering (offset 0). A residue list copied from a paper may be off by 22. All lists here are in P04626 numbering.
2. **Domain boundaries differ by paper.** Gragera 2025: I 23-215, II 216-338, III 339-500, IV 501-629. Use the same scheme everywhere, or domain-level statistics shift by a few residues.
3. **Fab fiducials.** The public HER2-VHH cryo-EM structures (9MTE, 9MTX) include a Fab; contacts with the Fab are not the VHH epitope. I counted only the VHH chain. For the held-out ONU structures the same may hold, so the HER2 surface covered by a Fab is hidden from the label and from other binders.
4. **Fusion proteins.** 7MN5/6/8 fuse HER2 to MBP; 8VQD/8VQE are Fc fusions (so "homodimer" there is partly Fc-driven); 3WLW is antibody-bridged. A homodimer interface from these is not necessarily physiological.
5. **Contact threshold.** I used 4.5 Å heavy atoms. Voronota-LT areas will give a different, larger set; do not compare my counts to the challenge labels directly. Outlier residues (for example 1N8Z trastuzumab 24, 54, 245, 261-263, away from the main domain IV patch) look like crystal-packing or modelling artefacts and I did not remove them.
6. **Redundancy.** Of the public HER2 complexes, trastuzumab and pertuzumab account for about 10 entries each, so any frequency map is a trastuzumab/pertuzumab map. Deduplicate by clone, not by PDB entry.
7. **Compact HER2 only with trastuzumab** (Gragera 2025, minority of particles, low-pass at 4.5 Å, anisotropic). Don't assume a compact conformation exists on cells.
8. **Resolution mismatches inside papers** (29E09: 2.78, 3.01 and 3.06 Å; 7MN8: 3.5/3.45/3.4 Å). Use the RCSB value (3.06 and 3.45).
9. **p95 ambiguity.** "p95HER2" means the shed ECD in some papers and the membrane CTF in others.
10. **ECD identity is ~44 %, but the interface is not specific.** Counter-selection should target domain II.

## Implications for the challenge

1. Treat the dimer-occupied patch (union list above, core 16 residues) as a possible but disfavoured epitope. For a monomer-ECD cryo-EM complex, it is sterically available, so don't hard-mask it; apply a soft prior only.
2. Use 9MTE/9MTX/5MY6 (and the Fab complexes as negatives for non-overlap) as the only public VHH-HER2 structural truth for a leave-one-out check of any epitope model. Their epitopes (domains I and III, residues 35-90, 105-180, 378-500) are the best available prior for where HER2 VHHs land.
3. Note the leak risk: ONU clones may share an epitope bin with 27A05/29E09 or 2Rs15d if they come from related immunisations. The brief allows public data, so check by sequence (CDR3 similarity) before using the prior.
4. If the construct has the C-terminal GACQ, check whether the batch was disulfide-dimerised. If yes, treat domain II-arm residues as partially buried in the ground truth.
5. For counter-selection, if labels include "binder vs non-binder" for EGFR/HER3 panning data, expect cross-reactive VHHs to concentrate on domain II (45-51 % identity). Domain I and III epitopes are ≥ 95 % specific by identity count.
6. Use P04626 numbering with the domain scheme above for any residue feature (domain index, distance to arm, distance to tether), and convert old PDB numbering by +22.

## Open questions

- Is the challenge antigen monomeric in the cryo-EM sample, and was a Fab fiducial used? (Probably Fab-assisted, as in 9MTE; unverified.)
- Numeric KDs of 27A05 and 29E09 (Supplementary Table S3 of De Tavernier 2026) and any KD for HER2-ECD/HER3-ECD without ligand.
- Primary paper for the 647/648 cleavage-site assignment.
- Do ONU11/13/23 share epitope bins with 27A05/29E09/47D05 (both appear to come from a HER2-immunised camelid library)?
- 9MTE/9MTX mapping to clones: the paper does not say which accession is which complex (my contact analysis shows 9MTE = 27A05 + 47D05 and 9MTX = 29E09).

## Sources (only those actually opened)

- RCSB Search API and Data API (search.rcsb.org, data.rcsb.org GraphQL and core/entry), queried 2026-10-17; mmCIF from files.rcsb.org (45 HER2 ECD entries, 6 EGFR VHH entries).
- UniProt REST: P04626, P00533, P21860, Q15303 (full JSON), plus P01133, Q02297, P35070, O14944, Q99102.
- Diwanji 2021 Nature 600:339, doi 10.1038/s41586-021-04084-z, via PMC9298180.
- Zhang 2023 Cell Discov 9:18, doi 10.1038/s41421-023-00523-5, PMC9925823.
- Gragera 2025 Sci Adv 11:eadu9945, doi 10.1126/sciadv.adu9945, PMC12292818.
- De Tavernier 2026 Mol Cancer Ther 25:541, doi 10.1158/1535-7163.MCT-25-0654, PMC13044525.
- Europe PMC abstracts: Schmitz 2013 (doi 10.1016/j.str.2013.05.008), EgB4 (doi 10.1186/s12860-022-00412-x), Anido 2006 (doi 10.1038/sj.emboj.7601191), Liu 2006 (doi 10.4161/cbt.5.6.2708), Christianson 1998, Zabrecky 1991, Pupa 1993, Codony-Servat 1999 (bibliographic details only).
- Web search summaries (secondary, not opened as primary): the 647/648 cleavage residues and the 2Rs15d cell KD of 4.74 nM.
- Not opened: Burgess 2003 Mol Cell 12:541; Cho 2003 Nature; Garrett 2003. Statements attributed to them are background knowledge.
- Derived data (mine): `her2_public_complexes.json`, `erbb_family_dimerisation_signalling_and_adjacent_proteins_egfr_her3_her4.json`.
