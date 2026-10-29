---
queen: q1_her2_biology
king: king_world
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- HER2 ECD = P04626 23-652 (domains I 23-217, II 218-341, III 342-510, IV 511-652). Older papers number 22 lower; use P04626 numbering everywhere, as the challenge does.
- Epitopes are sparse: a public binder epitope covers about 3% (4 A) to 5% (Voronota-LT) of resolved residues, not the brief's 0.1. Calibrate PR-AUC against about 0.05 (worker prior base rate 0.024 for 4 A VHH macro AP).
- Public HER2-VHH structural truth is tiny: 5MY6, 7QVK, 9MTE (2 VHHs), 9MTX; all on domains I/III. No public VHH is a close homolog of ONU11/13/23 (framework identity <= 74%).
- A footprint prior from other binders is weak (held-out VHH macro AP 0.04-0.05); 44 antibody-class epitopes are only ~11 clusters (~7.4 effective niches). Use as a soft prior blended with uniform.
- Antigen is probably wild-type 1-624 + His6 ("GACQ" is native 621-624); expect 121-134 and 598-652 unresolved in ground truth.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. RCSB UniProt P04626 search returns 63 entries, 45 with ECD coordinates, 56 partner interfaces (44 antibody-class, 12 receptor/homodimer). File: all_public_her2_complex_structures...md (n=12; high).
2. Approved antibodies touch 42/630 ECD residues (6.7%); all 25 binders touch 213 (33.8%); domain III has zero approved-drug contacts. File: her2_therapeutic_antibodies...md (n=12; medium).
3. 5O4G is Fab MF3958 (domain I), not margetuximab; no public margetuximab-HER2 complex exists among the 63. Same file (verified in RCSB; high).
4. Dimer-occupied patch about 51 residues, mostly P04626 221-351; none of 4 public VHH epitopes overlaps (47D05 touches only 105). File: erbb_family...md (n=14; medium). The 647/648 cleavage site and HER2-HER3 KD are unverified.
5. Seven-eight N-sequons (68, 124/125, 187, 259, 530, 571, 629); experimental evidence for N68, N259, N530, N571. Per-residue habitat mask (630 rows) in her2_ecd_habitat_mask.json. File: her2_in_cancer...md (n=20; medium).
6. 147 of 341 exposed ECD residues have never contacted any public binder. Same file (medium).
7. Exposure alone gives AUC 0.72 for "touched by any public binder"; rigidity is anti-predictive (0.35-0.40); paralog divergence weak (0.59). File: her2_ectodomain_architecture...md (n=14; medium).
8. Disulfide consistency check: all 25 UniProt disulfides fall within single domains with the above boundaries (4/9/2/10). Same file (high).
9. Correction: Diwanji 2021 DOI is 10.1038/s41586-021-04084-z; 1S78 DOI per RCSB is 10.1016/S1535-6108(04)00083-2.

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Ecology niche modelling (Schoener's D overlap, habitat mask): description paid off (niche count, clean overlap matrices, habitat mask).
- Presence-only MaxEnt prior: died for prediction; held-out VHH AP 0.04-0.05, because the 44 records are heavily clustered and mAbs land where VHHs do not.
- Competitive exclusion (realised vs fundamental niche): paid off as a measurable partner-occupied patch, but it is soft, since a monomeric ECD leaves it open.
- Rigid-habitat mask died: epitopes sit on mobile loops (AUC 0.35-0.40).

## Contradictions within my subdomain
- Domain boundaries differ across sources (I ends 195/215/217 depending on numbering; Cho/Garrett/Gragera conventions); IV ends 629 vs 630 vs 652.
- her2_public_complexes.json was written by three workers; the final 60-record version (45 entries) supersedes the 51-, 53- and 83-row versions. The 53-row copy is her2_public_complexes_ectodomain_worker.json; 83 partner pairs claim from the cancer worker is not reconciled (it overwrote an earlier file). Epitope Jaccard comparison v0 vs final: 38/53 identical, 8 zero due to partner-keying, not reconciled.
- Base rate: brief says 0.1; workers measure 0.03-0.05 (0.024 at the 4 A VHH-AP level).

## Gotchas for the modeler (what could silently fool us)
- Numbering: P04626 includes the 22-aa signal; PDB/older papers do not. Offset error = silent garbage.
- Footprint prior tuned on mAbs mislead: pertuzumab/trastuzumab hotspots are not VHH hotspots.
- Voronota-LT positives are about 1.4x the 4 A count; the unresolved 121-134 and 598-652 ends likely absent from truth.
- Possible leakage via 27A05/29E09/47D05 epitope bins if ONU clones are related; check CDR3 first.
- Disulfide-dimerised GACQ construct could bury domain II arm residues.

## Questions for other queens (name the queen)
- q2_vhh_immunology_structure: CDR3 similarity of ONU11/13/23 to 27A05, 29E09, 47D05, 2Rs15d?
- q3_assay_ngs_ground_truth: expression host and glycosylation state of the AVIDa-hHER2 antigen; is it truly 1-624?
- q5_structure_prediction_docking: does template inclusion of 9MTE/9MTX inflate fold scores?
- q4_challenge_intelligence: which construct boundaries does the cryo-EM model use?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- HER2 is a cell-surface protein that cancers overproduce, and antibody drugs grab it at two well-known spots.
- Most of its outer surface has never been seen holding any antibody, so new nanobodies could land almost anywhere.
- Past antibody pictures are only a weak guide to where the three mystery nanobodies stick.

## Gaps I could not fill
- PhosphoSitePlus, ClinVar, COSMIC, MANE Select transcript not checked.
- AVIDa-hHER2 antigen host/boundaries and Cho domain boundary statements unconfirmed (paywalled).
- HER2-HER3 KD and 647/648 cleavage site lack primary source.
- Voronota-LT not run in the therapeutic-antibody worker (4 A only).
- Reconciliation of the three versions of her2_public_complexes.json.
