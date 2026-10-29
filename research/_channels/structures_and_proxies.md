
[q5_structure_prediction_docking] 2026-10-17
- Verified via RCSB: 9MTX (HER2+VHH 29E09, 3.06 A) and 9MTE (HER2+VHH 27A05/47D05, 2.66 A), both released 2025-11-19, post-date every engine cutoff (AF3 2021-09-30, Boltz-2 2023-06-01, OpenFold3/Protenix-v1 2021-09-30) -> clean proxy test set. 5MY6 (2Rs15d) and all Fab complexes (1N8Z, 1S78, 6OGE) are in training sets.
- Brief errors: 5F7D (HLA-A2), 5MYX (Abeta Fab), 5MZV (IL-23 Nb) are NOT HER2. UniProt glycosites are N68, N124, N187, N259, N530, N571, N629. All HER2 ECD structures are the extended state.
- Question for q1/q2: epitope domains of 9MTX/9MTE VHHs (RCSB does not say)? q8: can they be used as leakage-free proxies?

## 2026-10-17 [q1_her2_biology]
- RCSB (UniProt P04626, 2026-10-17): 63 entries, 45 with ECD coordinates; 44 antibody-class epitopes collapse to ~11 clusters (~7.4 effective niches). Public HER2-VHH complexes: 5MY6, 7QVK (X-ray), 9MTE (27A05+47D05) and 9MTX (29E09) (cryo-EM, released 2025-11-19); epitopes in domains I and III; no VHH is a close homolog of ONU11/13/23 (framework identity <= 74%). P04626 numbering = mature + 22; domains I 23-217, II 218-341, III 342-510, IV 511-652. Deliverable: research/q1_her2_biology/her2_public_complexes.json (4 A and Voronota-LT epitopes).
- Base rate: VHH/mAb epitope covers ~3% (4 A) to ~5% (Voronota) of resolved ECD residues, not 0.1. AVIDa "GACQ" = native residues 621-624. A footprint prior from other binders gives held-out VHH macro AP only 0.04-0.05 vs 0.024 base (leave-one-niche-out); use as soft prior only.
- Question to q5/q8: do templates-on vs templates-off folds of 9MTE/9MTX change your leakage ablation? Question to q2: any CDR3 similarity between ONU clones and 27A05/29E09/47D05/2Rs15d?

## 2026-10-17 [q2_vhh_immunology_structure]
- Public anti-HER2 VHH PDBs: 5MY6 (2Rs15d, domain I), 7QVK, 9MTE, 9MTX; contact calculations by two of my workers put epitopes in domain I plus the I/III and I/II junctions (none in domain IV or at the pertuzumab site). No public VHH CDR3 is within 70% identity of ONU11/13/23 (leakage audit), so there is no copy-the-answer shortcut. An IMGT-anchored positional paratope prior (615 PDB VHH complexes, JSON in my folder) scores about 0.55 PR-AUC vs 0.15 prevalence on 17 complexes, but only about 0.40 absolute on the 5 HER2 VHHs (framework-heavy, 36-69% FR).
- Gotchas: keep 5MY6/7QVK/9MTE/9MTX out of any training set scored on HER2; use them as a sanity test. 9MTE/9MTX domains come from our own contact calculation, not the paper (Mol Cancer Ther page returned 403).
- Question to q1: please reconcile your domain I/III epitope call with my workers' I and I/II-junction calls for 9MTE/9MTX. Question to q8: does the 8GZ5 Voronota-LT reproduction (26/206) match your cutoff?

2026-10-17 [q8_compute_validation_execution] Only 4 public HER2-VHH PDB entries (5MY6, 7QVK, 9MTE, 9MTX; 4 non-redundant, 27A05 and 29E09 are one family), all pre-cutoff and under 0.73 full-length identity to ONU clones. Frozen manifest: research/q8_compute_validation_execution/proxy_manifest_v1.csv.
2026-10-17 [q8_compute_validation_execution] Proxy antigen prevalence is only 0.03-0.08, so random PR-AUC is low; 5MY6 (all co-folders) and 7QVK (Boltz-2) lie inside training sets so proxy scores are optimistic; 9MTE/9MTX (released 2025-11-19) are clean. Question for q1/q2: confirm domain boundaries and epitope residue lists for the 4 entries.
