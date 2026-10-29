---
title: HER2 ectodomain architecture, domains I-IV, structures, disorder, conservation and epitope base rates
queen: q1_her2_biology
king: king_world
worker: her2_ectodomain_architecture_domains_I_to_IV_and_structures
tier: expert
tags: [HER2, ERBB2, P04626, ectodomain, domain-boundaries, SASA, glycosylation, disorder, conservation, alpaca, Voronota-LT, epitope-base-rate, VHH]
confidence: medium
challenge_relevance: 4
serendipity: "Ecological niche modelling (ECD surface as habitat patches, public binders as occupancy records). Partly paid off: exposure alone gives AUC 0.72 for 'any public binder touches this residue', but the 'rigid, unshielded habitat' mask is a weak predictor (AUC 0.60) and rigidity is anti-predictive (0.35-0.40) because epitopes sit on mobile loops."
date: 2026-10-17
---

## TL;DR
HER2's ectodomain is residues 23-652 of P04626 (signal peptide 1-22). The four domains are I 23-217, II 218-341, III 342-510 and IV 511-652 once mature numbering is shifted by +22; older papers number from the mature protein, so their numbers run 22 lower, and one (Garrett 2003) runs 21 lower. In 21 independent public antibody/VHH/scaffold complexes, a contact-defined epitope covers only about 3 % (4 A) to 5 % (Voronota-LT) of the resolved HER2 residues. That is well below the 0.1 quoted in the brief, and it is about 7.6 % even among solvent-exposed residues. The AVIDa-hHER2 "GACQ" is not an artificial tail. It is native P04626 residues 621-624, so the antigen is probably wild-type 1-624 plus His6.

## 1. Boundaries and numbering (Q1)
UniProt P04626 JSON (opened 2026-10-17): Signal 1-22; Chain 23-1255; Extracellular 23-652; Transmembrane 653-675; Cytoplasmic 676-1255; kinase domain 720-987. UniProt does **not** annotate domains I-IV, so they must come from the literature.

Domain boundaries (mature numbering, signal peptide excluded) in US9327035, read on Google Patents: I "about 1-195", II 196-319, III 320-488, IV 489-630. Add 22 to get P04626 numbering. I checked the result against the 25 UniProt disulfides. Every disulfide falls wholly inside one domain: 4 in I, 9 in II, 2 in III, 10 in IV. That is a strong internal consistency check, because a boundary error of a few residues would split a bond.

| Domain | Fold | P04626 (incl. SP) | Mature (Cho/Franklin) | Length | Disulfides (UniProt) | N-sequons annotated (UniProt CARBOHYD) |
|---|---|---|---|---|---|---|
| I | L1 | 23-217 | 1-195 | 195 | 4 (26-53, 162-192, 195-204, 199-212) | N68, N124 (predicted only), N187 |
| II | CR1 | 218-341 | 196-319 | 124 | 9 (220-227 ... 334-338) | N259 |
| III | L2 | 342-510 | 320-488 | 169 | 2 (342-367, 475-504) | none |
| IV | CR2 | 511-652 | 489-630 | 142 | 10 (511-520 ... 630-642) | N530, N571, N629 (predicted only) |

My scan of the sequence for N-X-S/T found 8 sequons in the ECD: 68 NAS, 124 NNT, 125 NTT, 187 NRS, 259 NHS, 530 NCS, 571 NGS and 629 NCT. UniProt annotates 7, treating 124/125 as one site. Experimental evidence codes (ECO:0000269) exist for N68, N259, N530 and N571. N187 has proteomics evidence only. N124 and N629 are sequence-based predictions only.

**Where the papers disagree.** I could not open the Cho 2003 or Garrett 2003 full text (Nature and Cell Press are paywalled, and PMC returned a bot-check page). Their numbering is therefore taken from the deposited PDB files. Boundary statements inside the papers are **unverified**.

| Source | Evidence I opened | Numbering vs P04626 |
|---|---|---|
| Cho 2003 (Nature 421:756, 1N8Z, 2.52 A) | RCSB: construct is 607 residues, aligned to P04626 23-629. Auth numbers equal P04626 minus 22 in all 581 observed residues. | mature, offset -22 |
| Garrett 2003 (Mol Cell 11:495, **2A91**, 2.5 A) | RCSB: citation matches. Construct is 22-530 (domains I-III, 505 residues observed). Offset is -21 for all observed residues. | **-21**: it starts at A22, so residue 1 is the last signal-peptide residue |
| Franklin 2004 (Cancer Cell 5:317, 1S78, 3.25 A) | RCSB: construct 23-646, offset -22, 555/568 residues observed in chains A/B | mature, offset -22 |
| Newer cryo-EM and crystal entries (5MY6, 6J71, 6OGE, 7MN*, 8U4*, 9MT*, 9T3*) | offset 0 | full-length UniProt numbering |
| Domain-IV and domain-I fragment entries (4HRN, 6LBX) | auth minus P04626 = -522 for 4HRN | renumbered from the fragment start |

The same residue therefore has three names across papers: T23 = 1 (Cho), 2 (Garrett) and 23 (UniProt).

Two further traps in the brief:
- The brief's DOI for Garrett (10.1016/S1097-2765(03)00047-9) is the wrong paper. Crossref says it is Ferguson et al., "EGF activates its receptor by removing interactions that autoinhibit ectodomain dimerization" (Mol Cell 11:507). The HER2 truncated-ectodomain paper is **10.1016/S1097-2765(03)00048-0**, pages 495-505.
- The "domain IV 489-607" quoted in some papers is not the domain end. Cho's construct ends at mature 607 (P04626 629), while the ECD ends at mature 630 (652).

A PLOS ONE 2014 paper (journal.pone.0106448, opened) uses tighter PDB-numbered "domain cores": II = G200-R329 and IV = W499-N607. Patent and paper boundaries therefore differ by up to about 10 residues at domain II's ends, so boundaries are approximate by up to 10 residues.

## 2. Surface and exposure per domain (Q2, Q3)
Method: I wrote my own Shrake-Rupley (960 points, probe 1.4 A, radii C 1.70, N 1.55, O 1.52, S 1.80) on **isolated HER2 chains** (no partner, no glycans, protein atoms only). Reference set: 1N8Z-C, 1S78-A, 5MY6-A, 3BE1-A and 3N85-A, all X-ray full-ECD structures. Relative SASA uses Tien 2013 maximum areas. "Exposed" means rSASA at least 0.25.

SASA share of the whole ECD in the two most complete structures (1N8Z / 3N85): I 27.9 / 25.3 %, II 24.9 / 24.4 %, III 23.2 / 23.0 %, IV 24.0 / 27.2 %. Domain IV's area is unstable because its tail is unresolved in most structures: 1S78 and 5MY6 give IV only 17-18 %, 2A91 and 9QBG 5-8 %. Residue-count shares are I 31.0 %, II 19.7 %, III 26.8 %, IV 22.5 %.

Consensus table (per-residue values are in the companion JSON):

| | I | II | III | IV |
|---|---|---|---|---|
| Residues observed in at least 3 of 5 refs | 185/195 | 124/124 | 169/169 | 109/142 |
| Total SASA, A2 | 8,338 | 7,622 | 7,039 | 9,102 (inflated by free ends) |
| Exposed residues (rSASA at least 0.25) | 74 | 70 | 64 | 88 |
| B-factor hot residues (z > 1) | 11 | 28 | 17 | 73 |
| Residues in 8 A glycan footprint | 11 | 11 | **0** | 10 |
| **Habitat** residues (exposed, resolved, not B-hot, not glycan-shielded) | 58 | 43 | 47 | 21 |
| Habitat area, A2 (r = 8 A) | 4,875 | 3,575 | 3,546 | 1,404 |
| Plausible niche = habitat area / domain area | **58 %** (57-62 %) | **47 %** (44-47 %) | **50 %** | **15 %** (14-15 %) |
| Share of total habitat area | 36 % | 27 % | 27 % | 10.5 % |

Parentheses give the range for glycan-footprint radii of 6-10 A.

Tethered versus extended: I computed the domain II to domain IV contacts (4 A) in tethered EGFR (1NQL chain A) and HER3 (1M6B), mapped to HER2 by a global BLOSUM62 alignment.
- The EGFR tether maps to HER2 II 270, 273-276, 278-281, 286 and IV 592-593, 595, 604-608, 613, 615 (10 + 10 residues).
- The HER3 tether maps to II 274, 276, 278-280 and IV 581, 592-595, 604-606, 609.
- In free HER2, 20 of the 23 union residues are exposed (mean rSASA 0.48). Their mean public-binder occupancy is **0.19** (Voronota) against 0.053 for all residues.
- So the tether-equivalent patch is a roughly 3.6-fold enriched, HER2-specific exposed patch. It covers the pertuzumab/dimerization-arm side of domain II and the trastuzumab side of domain IV.
- Domain I-III contacts did not register under this 4 A definition.

Glycans: in the deposited models, NAG is seen on N259 in 29 HER2 chains, N187 in 17, N68 in 11, N530 in 10, N571 in 9 and N629 in 1. **N124 is never modelled**, because it sits in the 121-134 loop that is disordered everywhere. Domain III is glycan-free, so it is the largest unshielded face.

## 3. Disorder, unresolved residues and B-factor hot spots (Q4)
- **Always unresolved**, in essentially every ECD structure: **121-134** (domain I loop, carrying N124/N125; 1N8Z misses 124-132, 2A91 124-127).
- Next, in about half of the structures: **603-612** (domain IV loop; missing in 1N8Z, 3BE1, 7MN*, 8U4*), **325-327** (1N8Z, 5K33, 7MN*, 9MTE) and **383-389** (1N8Z, 3BE1, 5K33, 9MTE).
- Domain IV tail: **586-646** missing in 1S78 and 3MZW; **600-646** in 1S78-B; **598-645** in 5MY6; **543-652** in 8VQD, 7QVK and the 9QBF/G/H set.
- Cryo-EM VHH entries are less complete. 9MTE has 451 of 630 residues observed (missing 530-652, 505-518, 333-340 and more). 9MTX has 400 of 630 (missing 501-652, 316-340, 271-287 and more). 9T3R/S have 437 of 630 (missing 315-341 and 501-652).
- Best coverage: 8PWH/8Q6J, 624 of 624; 6J71, all 617 residues in its 22-639 construct; 6OGE and 8FFJ, 619 of 622.
- Contiguous B-hot segments (z > 1 in the 5-structure mean): 120-123, 315-319, 323-340, 384-388, 501-507, 548-550, 557-559, 563-565, 571-573, and a long domain IV block 599-642.
- The full per-structure missing-residue table (all 53 chain entries) is in `..._summary.json`.

Consequence: any ground-truth structure at about 3 A will probably also lack 121-134 and the domain IV tail. Predicted probabilities there are wasted, because omitted residues are scored as 0.

## 4. Conservation against paralogs and alpaca (Q5)
Method: pairwise global alignments (Biopython PairwiseAligner, BLOSUM62, gap -10/-0.5) of each ECD to HER2 residues 23-652. **Clustal Omega and MAFFT are not installed here, and I did not run them.** Each paralog's mapped ECD spans: EGFR P00533 25-645, HER3 P21860 20-643, HER4 Q15303 26-651.

| Reference | Identical residues / aligned columns | % of the 630 HER2 ECD residues |
|---|---|---|
| EGFR | 274 / 617 | 43.5 |
| HER3 | 277 / 611 | 44.0 |
| HER4 | 274 / 613 | 43.5 |
| Alpaca ERBB2 (UniProt A0A6I9IK38, unreviewed, RefSeq XP_006214314.4, 1255 aa) | 582 / 630 | **92.4** (48 differences) |

Per-domain identity to EGFR / HER3 / HER4 / alpaca:

| Domain | EGFR | HER3 | HER4 | alpaca | Alpaca differences |
|---|---|---|---|---|---|
| I | 0.43 | 0.46 | 0.47 | 0.89 | 21 |
| II | 0.51 | 0.44 | 0.46 | 0.98 | 3 |
| III | 0.39 | 0.41 | 0.40 | 0.92 | 13 |
| IV | 0.44 | 0.44 | 0.40 | 0.92 | 11 |

- Of 274 exposed residues, 153 are non-identical in all three paralogs and only 34 are identical in all three. HER2's surface is therefore mostly paralog-divergent, so cross-reactivity is not a first-order concern.
- Largest paralog-divergent exposed patches (7 A single linkage on 1N8Z): 170-180 + 222-225 (I/II, 9 residues), 417-420/447-473/497 (III, 9), 362-368/404/429/459 (III, 8), 23-24/51-54/76/98 (I, 7), 343-354 (III, 7), 270-282 (II, 6), 557-562 (IV, 5) and 577-586 (IV, 5).
- Conserved exposed patches are small (3 residues at most): 274-275-278 (II tether), 587-589-597 (IV), 237/247, 402/427 and 582/594.
- **Self-tolerance flags.** Alpaca-human differences are where an immunised alpaca sees "foreign" HER2: 21 in domain I, with cluster 67/92/93/133/138; 13 in III, with 365/398/402; and 11 in IV, with 556/557/577/579 and 507/510/513/517.
  - Domain IV differences include N556K, A557D, F577S and P579S, inside or adjacent to the trastuzumab epitope.
  - In the unresolved loop the alpaca has N124E, N125S, T126A, V129A, T130V and P122L, so the alpaca **lacks the N124 sequon**.
  - Residues that differ from alpaca (47 observed) have mean binder occupancy 0.098, against 0.053 overall. Human-specific residues are about 1.8 times more often epitope, though this is confounded with exposure.
- Alpaca differences hold only 11.5 % of the total epitope mass. Most of the immunogenic surface is alpaca-identical, so tolerance cannot be the main shaper of where binders land.

## 5. AVIDa-hHER2 antigen (Q6)
- I could not open the COGNANO HF dataset page (HTTP 401), and I found no AVIDa-hHER2 paper. A web search returned only AVIDa-hIL6 and AVIDa-SARS-CoV-2 papers. The Mizuno/COGNANO citation in the brief is **unverified**.
- sepiq.uk/detail and the SEPIQ HF card (opened) state: "The HER2 antigen used in this experiment is an extracellular domain which may form dimers under experimental conditions." The sequence starts MELAALCRWGLLLALLPPGAASTQVCTGTDMKLRLPASPE and ends MPIWKFPDEE GACQ HHHHHH. Residues are to be numbered by full-length P04626, including the signal peptide.
- In P04626, MPIWKFPDEE is residues 611-620 and **GACQ is 621-624**. The construct is therefore, by its two ends, P04626 1-624 plus His6. I could not read the middle of the sequence, so I assume it is wild-type, as the card states ("wild-type human HER2" in the brief).
- The construct stops before C626, C630, C634 and C642, so it has no unpaired cysteine. It keeps the C600-C623 disulfide.
- It lacks N629, and the 599-624 region is B-hot and often disordered.
- The SEPIQ card says the antigen was amine-coupled to beads, and the antibody-competition sublibraries used trastuzumab, pertuzumab and a rabbit mAb. Amine coupling can hide lysines, which is a possible bias against epitopes rich in Lys.
- Expression host and glycoform are not stated in what I could read. Whether the glycans are mammalian, insect or other is **unknown**.

## 6. Epitope base rates (Q3, Q7)
Data: 53 HER2-binder rows from 40 ECD PDB entries (`her2_public_complexes_ectodomain_worker.json` (this worker) and `her2_public_complexes.json` (queen deliverable, later overwritten by another worker)). I collapsed them to 21 independent binders with at least 400 observed HER2 residues, picking one representative each (trastuzumab, pertuzumab and Fcab collapsed across entries).

| Definition | Mean epitope size (range) | Fraction of observed HER2 residues (range) | Fraction of 630 |
|---|---|---|---|
| 4 A heavy-atom, all 21 binders | 16.5 (7-36) | **3.1 %** (1.3-7.2 %) | 2.6 % |
| Voronota-LT contact area > 0, all 21 | 25.4 (15-52) | **4.8 %** (2.4-10.4 %) | 4.0 % |
| 4 A, 5 VHH/sdAb | 15.0 (10-18) | 3.2 % | 2.4 % |
| Voronota > 0, 5 VHH/sdAb | 25.8 (18-34) | **5.6 %** (3.8-7.8 %) | 4.1 % |

**An epitope fraction of about 0.1 is rare for HER2.** Only the largest of the 21 binders, TL1 (8VQD), reaches 10 % by Voronota. A random ranker should expect PR-AUC of roughly 0.03-0.06, and about 0.076 if restricted to exposed residues.

Cutoff sensitivity on specific complexes (n = residues; all 4 A numbers are heavy-atom, protein-protein only):

| Complex | 3.5 A | 4 A | 5 A | 6 A | Voronota > 0 | Voronota > 10 A2 | Interface area A2 |
|---|---|---|---|---|---|---|---|
| 1N8Z trastuzumab (581 obs.) | 10 | **17 (2.9 %)** | 19 | 22 | **23 (4.0 %)** | 18 | 722 |
| 1S78 pertuzumab chain A (555 obs.) | 16 | **22 (4.0 %)** | 29 | 36 | **34 (6.1 %)** | 26 | 1,062 |
| 5MY6 2Rs15d VHH | 13 | 17 | 18 | 24 | 21 | 17 | 738 |
| 9MTX 29E09 VHH | 12 | 17 | 24 | 35 | 31 | 20 | 866 |
| 9MTE 27A05 VHH | 8 | 18 | 25 | 38 | 34 | 21 | 884 |
| 9MTE 47D05 VHH | 5 | 10 | 16 | 20 | 18 | 16 | 627 |
| 7QVK NM-02 VHH | 10 | 13 | 21 | 25 | 25 | 19 | 653 |

Voronota-LT (v1.1.497, `--compute-only-inter-chain-contacts`, hetero atoms excluded) gives 1.2 to 1.9 times more residues than a 4 A cutoff, because it counts residues whose atoms are close to 6 A but still share a tessellation face. The organisers' ground truth is Voronota-based, so **positives should be about 1.4 times the 4 A count**, and outer-shell residues carry small weight.

Per-domain base rates from the 21 binders (mean over residues of the fraction of binders contacting that residue, Voronota / 4 A): I 4.5 / 2.4 %, II 6.4 / 4.5 %, III 3.6 / 2.3 %, IV 7.7 / 5.3 %. The five VHH only: I 8.1 %, II 2.7 %, III 5.1 %, IV 0 % (4 A: 4.8, 1.7, 2.8, 0 %).

- **VHH epitopes are not in domain IV.**
  - 5MY6 (2Rs15d) is entirely domain I (21 residues).
  - 9MTE 27A05 is I (14) + III (20), and 9MTE 47D05 is I (16) + II (2).
  - 9MTX 29E09 is I (11) + III (20).
  - 7QVK NM-02 is I (11) + II (14).
  - Caveat: in 9MTE and 9MTX domain IV is mostly unresolved (observed to 529 and 500), so the zero is partly an observability artefact.
- The therapeutic mAb literature is domain IV (trastuzumab) and II (pertuzumab) heavy, and the pooled occupancy inherits that bias.
- 9MTE and 9MTX come from a 2026 Mol Cancer Ther paper on the TPP-45142 T-cell engager. They are public cryo-EM HER2-VHH complexes from Nov 2025 and strong in-distribution priors for the three held-out VHH.

## 7. Forced analogy: ecology and niche modelling
**State.** Treat the ECD as a landscape of habitat patches (domains), each residue as a cell, and 21 public binders as "occurrence records". Under species-distribution-model logic the background layer is "available habitat" (exposed, rigid, unshielded area), and the null occupancy rate is the fraction of cells a random "species" would occupy.

**Results of fitting it.** Descriptive AUCs for "any of the 21 binders touches this residue" (n = 587 resolved residues, 275 positive); the "10 % of binders" variant gives similar values:

| Predictor | AUC (any contact) | AUC (touched by at least 10 % of binders) |
|---|---|---|
| rSASA | **0.72** | 0.73 |
| SASA in A2 | 0.72 | 0.71 |
| Exposed flag (rSASA at least 0.25) | 0.64 | 0.64 |
| Habitat flag (exposed, rigid, unshielded) | 0.61 | 0.60 |
| Paralog divergence | 0.59 | 0.56 |
| Low B-factor (negated) | **0.40** | **0.35** |
| Not in glycan footprint | 0.50 | 0.53 |
| Domain IV indicator | 0.50 | 0.56 |

Occupancy inside habitat is 7.3 % (Voronota) against 4.5 % outside. Exposed residues are 7.6 % against 3.4 % buried. Glycan-footprint residues are 3.9 % against 5.4 % outside.

**Testable ideas for Track A (not yet tested on holdout complexes):**
1. Use the exposed-area layer as the prior (AUC 0.72), and add an explicit **tether-equivalent / dimerization-arm prior** (HER2 II 270-286 and IV 592-615; 3.6 times the mean occupancy).
2. Treat **flexible exposed loops as habitat, not as noise.** Rigidity is anti-predictive. Do not down-weight B-hot residues, other than the always-missing 121-134 and domain IV C-terminal tail.
3. Detection-bias correction, as in SDMs: thin by binder cluster (trastuzumab appears in at least 7 entries), and do not fit a prior to mAb epitopes alone when predicting VHH. The VHH records are I/II/III.
4. For a VHH-specific prior, put most mass on domain I (8 %) and III (5 %), with II as secondary. Down-weight IV only as far as its unresolved C-terminal region justifies.

**Where it holds, partly holds or breaks.** It partly holds for exposure and patch-level priors. It breaks on rigidity, because binders are not independent organisms and the "rigid" filter selects for crystal packing. It also breaks on sampling: the records reflect therapeutic-antibody discovery programs, not unbiased immune repertoires. The habitat mask removes domain IV entirely (15 % niche), yet domain IV holds 31 % of the epitope mass.

## Gotchas / what could fool us
1. The brief's "epitope about 0.1" is **not** what the PDB shows. Real VHH-HER2 epitopes are 18-34 residues (Voronota), 4-8 % of the resolved antigen. Check the denominator the organisers use (resolved residues vs 630).
2. Offset traps: Cho/Franklin use mature numbering (-22), Garrett -21, 4HRN -522. Never mix auth numbering with UniProt without checking.
3. The Garrett DOI in the brief belongs to the Ferguson EGFR paper.
4. N124 and N629 are predicted sequons. N124 is never modelled and lies in the always-disordered 121-134 loop. Alpaca lacks the N124 sequon, so the human glycan there is both foreign and unseen.
5. Domain IV area is unstable. SASA per domain depends on which tail residues were modelled, so use per-residue rSASA, not domain totals.
6. Voronota-LT residue contacts include outer-shell residues at 6 A. 4 A counts understate positives by 1.2-1.9 times.
7. Redundant structures: trastuzumab or pertuzumab appear in 1N8Z, 6BGT, 6OGE, 7MN8, 8PWH and 8Q6J (and 9L1S for a pertuzumab variant). 3H3B/6J71 are the same antibody family. 3WLW/3WSQ may share antibody lineage (unverified). Counting entries inflates domain IV and II occupancy.
8. Tether mapping uses 4 A contacts and alignment-based domain assignment, so the patch is a lower bound.
9. My rigidity score is a within-structure B-factor z-score averaged over 5 X-ray structures. Cryo-EM B-factors are not comparable and were not used.
10. Glycan footprint is a geometric stand-in (CA within 6-10 A of the sequon ND2), not a modelled glycan.

## Implications for the challenge
1. Set the prior base rate to 4-6 % of resolved residues for VHH epitopes and expect Voronota positives at about 1.4 times the 4 A count. Calibrate PR-AUC against about 0.05, not 0.1.
2. Mask 121-134 and the domain IV tail 598-652 (set to 0), since ground-truth models will probably omit them.
3. Build a residue prior from rSASA plus the tether/dimerization-arm bonus, and combine it with sequence-derived signals.
4. Train or validate the priors on the 5 public VHH-HER2 complexes (5MY6, 7QVK, 9MTE x2, 9MTX), not on mAb complexes. Their epitopes sit in domains I, II and III.
5. Treat the antigen as P04626 1-624 + His6. Drop residues 625-652 and the paired cysteines beyond 624 when predicting or folding.
6. Include paralog divergence only as a weak feature (AUC 0.59). Alpaca-human differences matter as a feature but are confounded with exposure.
7. Use the per-residue table (`..._ectodomain_architecture_domains_I_to_IV_and_structures.json`) as the feature layer. The epitope lists for every public HER2 complex are in `her2_public_complexes_ectodomain_worker.json` (this worker) and `her2_public_complexes.json` (queen deliverable, later overwritten by another worker).

## Open questions
- What are the exact domain boundaries in the text of Cho 2003, Garrett 2003 and Franklin 2004? These need the full text (not retrievable here).
- Which HF/COGNANO source documents the AVIDa-hHER2 antigen, including expression host, glycoform and exact residue span? The card page returned HTTP 401 for me.
- Do the three held-out VHH (ONU11/13/23) bind domain I/III like the 9MTE/9MTX nanobodies, or domain IV? Does 9MTE/9MTX's domain IV disorder hide their true epitopes?
- Is the middle of the SEPIQ antigen sequence identical to P04626 (only the two ends were visible)?
- Would a Clustal Omega/MAFFT multiple alignment change the conservation map? Pairwise alignment was used here.

## Sources
- UniProt P04626 JSON: https://rest.uniprot.org/uniprotkb/P04626.json. Also P00533, P21860, Q15303 and alpaca A0A6I9IK38 (JSON/FASTA, rest.uniprot.org).
- RCSB Search API (search.rcsb.org/rcsbsearch/v2/query, P04626 accession) and Data API (data.rcsb.org/rest/v1/core/entry and polymer_entity) for 63 P04626-linked entries (45 ECD entries analysed). Coordinates from files.rcsb.org/download/<id>.cif. EGFR 1NQL and HER3 1M6B for the tether.
- Voronota-LT v1.1.497: https://github.com/kliment-olechnovic/voronota/releases/tag/v1.29.4816
- US9327035 domain boundaries: https://patents.google.com/patent/US9327035B2/en
- PLOS ONE HER2 conserved motifs (domain II G200-R329, IV W499-N607): https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0106448
- Crossref (DOI check for Garrett and Ferguson): https://api.crossref.org/works/10.1016/S1097-2765(03)00047-9
- Europe PMC records for PMID 12610629 (Cho), 12620237 (Ferguson) and 15093539 (Franklin) (metadata only, no full text).
- SEPIQ: https://sepiq.uk/detail and https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (antigen description and sequence ends).
- RCSB citations: 2A91 Garrett 2003 Mol Cell 11:495; 1S78 Franklin 2004 Cancer Cell 5:317; 1N8Z Cho 2003 Nature 421:756; 9MTE/9MTX Mol Cancer Ther 2026 (TPP-45142).
- Not reachable: huggingface.co/datasets/COGNANO/AVIDa-hHER2 (HTTP 401), PMC (bot check), cell.com Structure 2013 (HTTP 403).
- Scripts and intermediate files: C:\Temp\sepiq26\scripts and C:\Temp\sepiq26\her2 (own analysis; not a citable source).
