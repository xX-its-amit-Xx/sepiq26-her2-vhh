---
title: Cryo-EM ground truth for HER2-VHH - what a ~3 A map can and cannot certify
queen: q3_assay_ngs_ground_truth
king: king_world
worker: cryo_em_ground_truth_resolution_map_model_uncertainty_and_what_3A_can_resolve_for_small_complexes
tier: expert
tags: [cryo-EM, ground-truth, Q-score, HER2, VHH, prevalence, label-noise, Voronota-LT, AVIDa]
confidence: medium
challenge_relevance: 4
serendipity: Art restoration (original pigment vs inpainting) - paid off as a way to split the positive set into density-backed vs model-built labels; it partly breaks because the final labels are a deterministic contact threshold, not a restorer's judgement.
date: 2026-10-17
---

# TL;DR
The organisers disclose almost nothing about the cryo-EM: no resolution (global or interface), no Fab or fiducial, no particle statistics, no glycan policy. A ~3 A map of an ~80 kDa HER2-ECD/VHH complex can place backbone and most side chains in ordered regions. Interface labels (a residue is positive if it has any Voronota-LT contact area) are sensitive to small coordinate shifts, so a minority of marginal positives (my estimate, unverified: ~10-25% of antigen positives) will reflect modelling choice rather than density. Chance PR-AUC baselines are about 0.03-0.05 on the antigen chain and 0.2-0.3 on the VHH chain (estimates, derivation below).

# 1. What ~3 A means here (Q1)
**Disclosed (sepiq.uk/detail, opened 2026-10-17):** three HER2-VHH complexes "selected from the HER2 repertoire", generated via BINDS; vitrified, 3D reconstructions from aligned 2D images; Osaka team (Namba, Kasai, Inoue), Kasai acquired data and did image analysis. The antigen "may form dimers under experimental conditions"; numbering is P04626 including signal peptide; the shown sequence ends at residue 620 (...MPIWKFPDEE) + GACQ + HHHHHH. No Fab, scaffold or fiducial is mentioned. The organisers say they will later report map resolution, validation statistics and "confidence of interface annotations ... based on the fitted atomic model and local map density". The 3.0 A figure comes from the brief; the detail page gave no value, so whether it is global or interface-level is **unknown**.

**Size:** HER2 ECD residues 1-620 glycosylated plus a ~14 kDa VHH. The 9MTX entry (below) lists 82.77 kDa total for a 630-residue HER2 chain + one VHH, a verified reference mass. ~80 kDa is near the practical lower edge for fiducial-free cryo-EM (low contrast, alignment accuracy). Domain IV and the C-terminal end are flexible. 6OGE modelled HER2 Thr23-Ala644 except 127-129 (PLoS One 2019 abstract-level), but at 4.36 A.

**Precedents (opened):**

| Entry | System | Res (A) | Fiducial | Notes |
|---|---|---|---|---|
| 6OGE / EMD-20055 | HER2 ECD + trastuzumab Fab + pertuzumab Fab | 4.36 | two Fabs | 622-res HER2 chain; a 4-residue N-glycan chain + 5 NAG modelled; released 2019-05-15; doi 10.1371/journal.pone.0216095 |
| 9MTX / EMD-48615 | HER2 ECD (630 res) + nanobody 29E09 | 3.06 | none listed | closest precedent: ~3 A is reachable fiducial-free; C1; 510 of 752 deposited residues modelled; no glycan entities; deposited 2025-01-12, released 2025-11-19; doi 10.1158/1535-7163.MCT-25-0654 |
| 1N8Z | HER2 ECD + Herceptin Fab (X-ray) | n/a | - | crystal reference |

Key fact from 9MTX: only 510/752 deposited residues were modelled even at 3.06 A. The SEPIQ labels exist only for residues present in the model.

# 2. Modelling at 3 A and uncertainty (Q2)
- Q-score (Pintilie et al., Nat Methods 17:328, doi 10.1038/s41592-020-0731-1): per-atom resolvability normalised to 1.0 at best; model averages correlate strongly with map resolution. I could not open the full text (paywall redirect; bioRxiv returned 429), so I do NOT quote the Q-vs-resolution curve. A paper using it (PMC7605492) reports mean residue Q 0.85-0.88 at 1.34 A, ~12 residues with unclear side chains from rotamer mixtures, lower Q at exterior loops. At 3 A expect lower Q (value unverified) and ambiguous side chains in loops.
- CDR3 is the hardest piece. H3 contributes 46% of nanobody-antigen residue contacts (Mitchell & Colwell 2018, 156 Nb structures, PMC6277174); mean nanobody paratope buried area 768.5 +/- 201 A^2; ~8.7 H3 contacting residues per structure (my arithmetic from their 1,353). ONU23 has a long CDR3 (AADGRFYSDYVWSSPDEYAY region, my reading of the printed sequence).
- Not obtained: EMRinger, MolProbity and Phenix map-model FSC values for this complex or typical values at 3 A. I cite these only as metrics the organisers may report.

**Resolution-to-uncertainty table (qualitative; my judgement, unverified; also in the .json):**

| Region / residue class | Global 3 A, strong local density | Interface 3.5-4 A (if flexible) | Label risk |
|---|---|---|---|
| Backbone, VHH framework | secure | secure | none |
| CDR1/CDR2 side chains in contact | mostly defined | rotamer ambiguity | low-moderate |
| CDR3 tip side chains | partly defined | built into weak density | moderate-high |
| Antigen surface Lys/Arg/Glu/Gln | ambiguous rotamers | ambiguous | moderate |
| Asn in N-glycan sequons | stub may be seen | may be absent | high for neighbours |
| Domain IV / flexible ECD | weak or unmodelled | unmodelled | absent from truth |
| His-tag, GACQ, linker | usually not modelled | not modelled | absent |

# 3. Labels dependent on modelling (Q3)
- Side-chain rotamers change which atoms touch. Voronota-LT contact area derives from atomic positions, so a residue near the area cutoff can flip with a 0.5-1 A shift (my reasoning).
- Glycans: whether they enter Voronota-LT is **not disclosed**. The brief says contacts are antigen-VHH only with chain/seqNum/resName columns for chains A and B. Glycans are separate residues or chains (as in 6OGE chain F), so they are probably excluded, but a glycan touching the VHH could shield protein contacts. Unknown.
- Tags: GACQ-His lies beyond residue 620 and is unlikely to be modelled.
- Dimer: if the deposited model has two HER2 chains, how truth treats the copies is unknown.

# 4. Disclosed vs unknown (Q4)
Disclosed: construct sequence to 620 + GACQ + His; three VHH sequences (ONU11 120 aa, ONU13 120 aa, ONU23 130 aa with S/His additions); truth from refined atomic models and contact maps. **Unknown:** resolution (global or interface), microscope/detector/dose/particles, any Fab/scaffold/fiducial (none mentioned), expression system, glycosylation, copy number and poses, class selection, tag removal, EMDB/PDB IDs.

# 5. Prevalence (Q5)
Estimates, not a SAbDab-nano count (not obtained): epitope 15-30 antigen residues; antigen chain ~620 residues, so 15/620 = 0.024 to 30/620 = 0.048; if ~550 are modelled, 0.027-0.055. VHH chain 120-130 residues with ~25-35 paratope residues gives 0.19-0.29 (consistent with 768 A^2 mean paratope area). The 8GZ5 proxy is 26/206 = 0.126 (brief). Random PR-AUC equals prevalence, so a model must beat ~0.03-0.05 (antigen) and ~0.2-0.3 (VHH) to show signal.

# 6. Pitfalls of blinded cryo-EM truth (Q6)
Multiple copies or poses (dimeric ECD with two VHHs; a VHH at two sites gives a union epitope); partial occupancy; 3D classification keeping the best class (biases to the majority pose); sharpening affecting CDR3 appearance; imposed C2 symmetry; one snapshot defines the interface. None can be checked until release.

# Forced analogy: art conservation
Original pigment = residues with clear density (VHH framework, CDR1/2 backbone, HER2 surfaces well fitted by prior structures). Inpainting = side chains and loops built into weak density or by rotamer-library and starting-model priors. Illustrative split for 20 antigen positives: 12-16 supported, 4-8 marginal, i.e. 10-25% restoration (my estimate, no cited measurement). Testable idea: output calibrated soft probabilities, giving 0.3-0.6 to residues at the edge of a confident epitope core, because PR-AUC ranks rather than thresholds and edge residues are coin flips. Second idea: rank residues by contact frequency across an ensemble of AF3/OpenFold3/Boltz poses, like a range of plausible restorations. The analogy partly holds (restoration is constrained by surviving pigment as models are by density) and breaks where thresholding turns the result into binary labels.

# Queen extra: label noise in AVIDa NGS labels
Opened facts. AVIDa-hIL6 (arXiv 2306.03329): two-proportion z-test per VHH, smallest p over 12 sublibraries, p<=0.05 increase = binder; no multiple-comparison correction; negative-control relabel to noise; 10^2.5 cutoff "empirically determined by an author"; ONE panning round; ~20 clones validated (10 binders all bound by immunofluorescence/BLI); binders ~3.7% of samples; no false-positive rate reported; no epitope mapping. AVIDa-SARS-CoV-2 (arXiv 2405.18749): same test, 77,003 samples (22,002 binding), 36,100 unique VHH, ~97% non-significant excluded, two alpacas, 9 VHHs validated. The brief says HER2 used chi-squared; the HF card returned 401 and search found no AVIDa-hHER2 paper, so HER2 specifics are **unverified**.
Reasoning (mine): at p<=0.05 uncorrected, null sequences give ~5% false positives; with a min over 12 sublibraries the upper bound is 1-0.95^12 = 46% per null sequence if independent (sublibraries are correlated, so lower). Since most sequences are null-like, uncorrected tests can contaminate the binder set; display, growth and expression bias and PCR artefacts are caught only by the negative control. The true false-discovery fraction is unmeasured. One panning round says a clone was enriched on HER2 versus the library; it cannot say epitope, affinity (confounded with display level), 1:1 stoichiometry or native-vs-coated binding.

# Gotchas
1. Truth exists only for modelled residues; unmodelled loops are effectively negatives.
2. A 15-30 residue epitope with 5-8 marginal contacts shifts relative prevalence by 20-30%.
3. One snapshot of one class; alternative poses are not captured.
4. Numbering includes the signal peptide (P04626); an offset error ruins PR-AUC, so check against the template CSV.
5. Glycan handling unknown; N-glycans may hide true contacts.
6. Public HER2 structures (6OGE, 9MTX, 1N8Z) give surface geometry but not these epitopes; 9MTX binds a different VHH (29E09).
7. Chance baselines differ 5-10x between chains; compare per chain.

# Implications for the challenge
1. Submit calibrated soft probabilities, not binary calls; edge residues around a core get 0.3-0.5.
2. Use pose ensembles (AF3/OpenFold3/Boltz) and score contact frequency.
3. Down-weight disordered antigen regions (domain IV tail, residues beyond ~600, tag); 9MTX modelled ~68% of deposited residues.
4. Calibrate total predicted mass to ~20-25 antigen and ~25-35 VHH residues.
5. Emphasise CDR3 then CDR1/2 on the VHH; framework gets low nonzero weight.
6. Treat NGS enrichment labels as a weak pose-ranking signal, not epitope evidence.
7. Ask organisers (HF Space discussion) about glycans, copy number and global vs interface resolution.

# Open questions
Global vs interface resolution; interface Q-score; glycan and dimer-copy handling in truth; HER2-specific AVIDa labelling stats; measured SAbDab-nano epitope-size distribution (not obtained); Q-vs-resolution values.

# Sources
- https://sepiq.uk/detail
- https://www.rcsb.org/structure/6OGE
- https://www.rcsb.org/structure/9MTX
- https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0216095 (search result only; not fully opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6277174/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7605492/
- doi 10.1038/s41592-020-0731-1 (abstract-level via search only)
- https://arxiv.org/html/2306.03329v2
- https://arxiv.org/html/2405.18749
