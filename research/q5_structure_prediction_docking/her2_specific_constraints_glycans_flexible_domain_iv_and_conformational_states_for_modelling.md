---
title: HER2-specific constraints for modelling - PDB states, domains, glycans, domain IV, antigen input recipe
queen: q5_structure_prediction_docking
king: king_infer
worker: her2_specific_constraints_glycans_flexible_domain_iv_and_conformational_states_for_modelling
tier: expert
tags: [HER2, ERBB2, PDB, glycans, leakage, AF3, Boltz-2, Chai-1, OpenFold3, Protenix, cryo-EM]
confidence: medium
challenge_relevance: 4
serendipity: Known-plaintext attack against a lock that changes shape - treat each HER2 PDB state as a plaintext sample; yielded the "use one extended state" prior, but the lock barely moves, so the analogy only partly holds.
date: 2026-10-17
---

## TL;DR
Every HER2 ectodomain structure I could verify is in the same "constitutively extended" state, with or without Fab bound, so one rigid antigen conformation is a safe modelling assumption. The two HER2-VHH cryo-EM entries (9MTX, 9MTE; released 2025-11-19) post-date every engine cutoff, while 5MY6 and all Fab complexes are inside training sets. Several IDs in the brief (5F7D, 5MYX, 5MZV) are not HER2, and the brief's glycan site list is wrong.

## 1. Verified PDB entries (opened via data.rcsb.org, 2026-10-17)

| PDB | What it is | Method / resolution | Released | Notes |
|---|---|---|---|---|
| 1N8Z | HER2 ECD + Herceptin (trastuzumab) Fab | X-ray 2.52 A | 2003-02-18 | domain IV binder |
| 1S78 | ErbB2-pertuzumab complex | X-ray 3.25 A | 2004-04-27 | domain II binder |
| 2A91 | ErbB2 domains 1-3 | X-ray 2.5 A | 2005-07-26 | truncated, no domain IV |
| 4HRL | HER2 ECD + a binder with cytotoxic effect | X-ray 2.55 A | 2013-10-16 | binder identity not checked |
| 5MY6 | HER2-Nb (2Rs15d) complex | X-ray 2.246 A | 2017-08-09 | VHH; domain I per secondary sources (review: D88-L161) |
| 6OGE | HER2 ECD + trastuzumab Fab + pertuzumab Fab | cryo-EM 4.36 A | 2019-05-15 | T23-A644 defined, T127-V129 unresolved (PMC6493747) |
| 7MN5 | HER2/HER3/NRG1b ECD heterodimer | cryo-EM 2.93 A | 2021-10-27 (deposited 2021-04-30) | HER2 in heterodimer |
| 9MTX | HER2 ECD + VHH 29E09 | cryo-EM 3.06 A | 2025-11-19 (deposited 2025-01-12) | HER2 entity 630 aa, 510 residues modelled, no NAG entity listed; Mol Cancer Ther 25:541 (2026), doi 10.1158/1535-7163.MCT-25-0654 |
| 9MTE | HER2 ECD + VHHs 27A05 and 47D05 | cryo-EM 2.66 A | 2025-11-19 (deposited 2025-01-11) | closest public analogue of the challenge ground truth |

NOT HER2: 5F7D = HLA-A2 with peptide G11N; 5MYX = Abeta-pE3 Fab; 5MZV = IL-23:IL-23R:Nb22E11. Do not use them. 5MY6 is the only pre-2025 HER2-VHH entry I confirmed. The RCSB pages for 9MTX/9MTE did not state epitope domains (the paper says only "distinct from trastuzumab and pertuzumab"). A separate VHH-Fc, A9B5, maps to domain I by chimera ELISA (PMC10634241), with no PDB entry.

### Leakage flags per engine
Cutoffs come from a search-result summary of the OpenFold portal (portal.openfold.io/datasets/cutoffs; my direct fetch of that page returned no table), so treat as single-source: AF3 2021-09-30 (extra validation to 2023-01-12); Boltz-2 2023-06-01; Chai-1 2021-01-12 (one paper); OpenFold3 and Protenix-v1 2021-09-30; later variants Protenix-v1-20250630 and OpenBind-0 at 2025-06-30. Boltz-1 cutoff not confirmed.

| Entry | AF3 | Chai-1 | OpenFold3 / Protenix-v1 | Boltz-2 | 2025-06 variants |
|---|---|---|---|---|---|
| 1N8Z, 1S78, 2A91, 4HRL, 5MY6, 6OGE | in training | in | in | in | in |
| 7MN5 | ambiguous (deposit before, release after 2021-09-30; depends on rule, unverified) | out if release date used | ambiguous | in | in |
| 9MTX, 9MTE | out | out | out | out | out (released after 2025-06-30) |

Consequence: HER2 itself is fully seen by every engine, so only the VHH-HER2 interface of the challenge targets is novel. 9MTX and 9MTE are the only honest post-cutoff VHH-HER2 benchmarks.

## 2. Domains and epitopes
UniProt P04626 (opened): signal peptide 1-22; mature chain 23-1255; extracellular 23-652; cytoplasmic 676-1255; kinase 720-987. Domain I extent verified indirectly from the A9B5 paper chimera boundaries: T23-R217. Domain II-IV residue boundaries were not stated in any source I opened. Approximate values often quoted (II ~218-341, III ~342-510, IV ~511-652) are from memory and unverified; recompute from a structure.

| Domain | Known binders | Source |
|---|---|---|
| I | 2Rs15d (5MY6), A9B5 (no PDB) | secondary review; PMC10634241 |
| II | pertuzumab (1S78, 6OGE) | RCSB, PMC6493747 |
| III | none structural confirmed in my search | - |
| IV | trastuzumab (1N8Z, 6OGE) | RCSB, PMC6493747 |

Surface fraction per domain was not computed (no structure downloaded). A flat ~25 percent per domain is the null; any bias toward I/IV is a hypothesis. Cheap fix: freesasa on 9MTE HER2 chain, per domain.

## 3. Glycans
UniProt CARBOHYD (opened): N68, N124, N187, N259, N530, N571, N629. The 6OGE paper assigns predicted glycans at N68, N187, N259, N571. The brief's list (N124, N172, N528, N573) does not match: N172, N528, N573 are not UniProt sites. UniProt numbering includes the 22-residue signal peptide; papers using mature numbering would be 22 lower (N68 = N46). Occupancy of N124, N530, N629 is unverified; read LINK/HETATM NAG records in the PDB files. 9MTX lists no NAG entity, so deposited ground truth may carry no modelled glycans even where glycans exist, which would make glycan-covered residues look like non-contacts.
How AF3 / Boltz-2 / Chai-1 handle glycans (CCD ligands with bonds) is from memory, not verified here. No published evidence found on whether adding NAG changes interface predictions, nor Voronota occlusion areas. Test: run +/- NAG at N68, N187, N259, N571 on 9MTX.

## 4. Antigen input recipe
1. Take P04626 residues 23-652 (drop signal peptide 1-22). The challenge construct adds C-terminal GACQ + His per BRIEF; omit the His tag from folding input.
2. Keep UniProt numbering for output: input index i (1-based on the trimmed sequence) = UniProt i+22. Write the offset into the CSV step explicitly.
3. Use the full ECD, not truncated domains: domains pack against each other (I-III contact gives the extended state) and 2A91 lacks IV. Full ECD (~630 aa) + VHH (~120-130 aa) is about 750 tokens. Memory and GPU-hours were not measured.
4. Single chain, no dimer; nothing indicates a dimer in the ground truth.
5. Optional: HER2 chain from 9MTE/9MTX as template (post-cutoff, public, rule-compliant), or 6OGE.

## 5. Flexibility and conformation
The 6OGE paper: HER2 is "constitutively extended"; the ternary complex matches binary and apo states (Calpha RMSD 0.96 A vs pertuzumab complex, 1.33 A vs trastuzumab complex). So Fab binding does not measurably shift conformation. A 2025 Sci Adv paper (adu9945, "receptor conformational adaptation") could not be read (HTTP 403), so possible contrary evidence for trastuzumab is unresolved. What AF3 and others predict for apo HER2 was not tested.

## 6. Cryo-EM ground truth issues
Observed: 6OGE had poor Fab constant-region density (flexibility) at 4.36 A; 9MTX modelled 510 of 752 deposited residues. Inferred, not verified: unmodelled regions generate no contacts in Voronota labels, so unobserved residues become negatives; domain IV or glycan-adjacent loops are the likely gaps. No preferred-orientation data found for HER2-VHH grids.

## Forced analogy: known-plaintext attack on a shape-changing lock
(a) Each PDB state is a plaintext sample; the cryo-EM complex is the sample at the target station. (b) Testable: average per-residue interface probabilities over runs using antigen templates 5MY6, 6OGE, 9MTE, 9MTX and measure PR-AUC on 9MTX/9MTE against a single-template baseline. (c) Partially holds: backbone states differ by ~1 A, so ensemble gain should be small; the glycan shield is the more variable tumbler.

## Gotchas
- 5F7D, 5MYX, 5MZV are not HER2; glycan sites in the brief are wrong.
- Signal-peptide offset of 22 between UniProt and mature numbering.
- Unmodelled residues and missing NAG create "unobserved", not "non-contact".
- Leakage: Fab complexes and 5MY6 are in all training sets; only 9MTX/9MTE are clean, but they may be homologous to challenge VHHs.
- Deposit versus release date changes 7MN5 status.
- Cutoff dates rest on one portal summary; Chai-1 and Boltz-1 weakly supported.

## Implications for the challenge
1. Feed P04626 23-652 as antigen; script the +22 numbering offset.
2. Benchmark every engine on 9MTX and 9MTE interface PR-AUC before applying to ONU11/13/23.
3. Run +/- NAG at N68, N187, N259, N571.
4. Seed and antigen-template ensemble; expect modest gain.
5. Compute domain SASA from 9MTE for a domain prior; do not use my approximate boundaries.
6. Not covered here (see below): success rates by method, install recipes, GPU-hours.

## Open questions
- Epitope domains of 29E09, 27A05, 47D05 (read doi 10.1158/1535-7163.MCT-25-0654).
- Exact domain II-IV boundaries and per-domain surface fractions.
- Published nanobody-antigen success rates and repo versions per engine, GPU-hours per complex (not researched; lead: Hitawala and Gray, doi 10.1080/19420862.2025.2545601).
- Sci Adv adu9945 claim (403).
- Real effect of NAG on predictions.

## Sources
- https://data.rcsb.org/rest/v1/core/entry/ for 1N8Z, 1S78, 2A91, 4HRL, 5MY6, 5MYX, 5MZV, 5F7D, 6OGE, 7MN5, 9MTX, 9MTE
- https://www.rcsb.org/structure/9MTX
- https://rest.uniprot.org/uniprotkb/P04626.txt
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6493747/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10634241/
- https://www.rcsb.org/structure/5MY6 (via search result summary)
- https://portal.openfold.io/datasets/cutoffs (via search result summary only)
- https://www.science.org/doi/10.1126/sciadv.adu9945 (title only, 403)
