---
queen: q2_vhh_immunology_structure
king: king_world
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- Nanobody paratopes are CDR3-centred (about 43-46% of contact residues) with a real framework tail (about 24% of contacts fall outside IMGT CDRs, mostly FR2 positions 42/49/50/52). A position-only prior is a cheap, strong baseline for the VHH chain (chain B).
- Four public anti-HER2 VHH structures exist (5MY6, 7QVK, 9MTE, 9MTX). The epitopes our workers computed sit in domain I and the I/III and I/II junctions, none in domain IV. 9MTE/9MTX were released 2025-11-19, after the structure-engine training cutoffs.
- No public VHH CDR3 is within 70% identity of ONU11/13/23, so nothing can be copied from the PDB. The ONU CDR3s run from 12 aa (ONU13) to 20 aa (ONU23), and long ones are where structure predictors fail.
- The HER2 antigen side decides the score and is the weakest part: the VHH-side prior says nothing about which HER2 residues are touched.
- No approved anti-HER2 nanobody drug exists; clinical HER2 VHH work is imaging and radiotheranostics, so there is no therapeutic epitope literature to lean on.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. Alpaca IGHV locus: 88 IGHV (84 functional), 8 IGHD, 7 IGHJ; 17 hallmark-bearing V genes carry over 85% of usage (Tu 2020). File camelid_hcab (9 sources). Medium.
2. Alpaca VJ-lineage substitution rate is 12-22%, with Gly/Ala insertions at CDR1/CDR2 tips; per-region rates are not reported. camelid_hcab. Medium.
3. IGHV3-3 structures are 82% kinked CDR3; IGHV3S53 are 75% extended (Dizicheh 2023). camelid_hcab. Medium.
4. VHH CDR3 holds 46% of antigen-contacting residues and 54% of pairwise contacts; only 16% of VHH use all three loops vs 53% of antibody VH (Mitchell and Colwell 2018). paratope_rules (22 sources). High.
5. From 615 PDB VHH complexes (worker computation): 24% of contacts lie outside IMGT CDRs; 35% of PDB CDR3s are 18 aa or longer; positional prior macro PR-AUC about 0.6 in 5-fold CV, optimistic because of clone-family leakage. vhh_structure (22 sources). Medium.
6. Damage-map prior: mean PR-AUC 0.547 vs 0.149 prevalence on 17 VHH complexes; on 5 HER2 VHHs +0.17 to +0.33, absolute about 0.40. paratope_rules. Medium (own computation, small n).
7. Leakage audit: no VHH CDR3 within 70% identity of ONU11/13/23. paratope_rules. Medium (known_her2 matched by eye only, BLASTp not run).
8. Anti-HER2 VHH structures: 5MY6 (2Rs15d, domain I, 2.25 A, 2017); 9MTE (27A05 + 47D05, 2.66 A) and 9MTX (29E09, 3.06 A), released 2025-11-19 (De Tavernier, Mol Cancer Ther 2026). known_her2 (9 sources). High for entries, low for 9MTE/9MTX domains.
9. Non-structural anti-HER2 VHH with domain calls from murine-domain-swap ELISA: A2G5, A9B5 (domain I), H2F5 (domain II), G1E4 (domain IV). known_her2. Medium.
10. Approved nanobody-derived drugs: caplacizumab (2018/2019), envafolimab (2021), cilta-cel (2022), ozoralizumab (2022). therapeutics (22 sources). Medium (dates from snippets; sources differ by days).
11. Caplacizumab mechanism: structure 7EOW shows no clash with GPIb, contradicting the original blocking story. therapeutics. Medium.
12. AF3-class nanobody success is reported under 50%; mean CDR3 RMSD 2.9-4.3 A vs framework about 0.8 A. vhh_structure, therapeutics. Low-medium (secondary).
13. UniProt P04626 numbering is mature + 22 (verified by alignment for 1N8Z, 1S78). therapeutics. High.

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Art conservation as a hand-set damage map: passed on paratope residues (+0.40 PR-AUC over prevalence), weaker on HER2 VHHs whose paratopes are framework-heavy (36-69% FR).
- Restoration via germline vs somatic mutation (germline as original panel, SHM as overpaint): untested, not dead. No source tests mutation density against contacts, and SHM rates did not differ across hallmark families.
- CDR3 inpainting (framework as canvas): gave a length-conditional prior, but the restorer fails for long kinked loops (ONU23).
- Art provenance (catalogue raisonne) for ONU clones: negative. No catalogued CDR3 matches; only a germline-level CDR1 resemblance. Died because the catalogue holds about 10 clones and BLASTp was not run.
- Over-restoration (overturned epitope claims): no formally retracted nanobody epitope found; 3 softer cases plus 2 failure-rate cases. Still yielded a checklist (label confound, modelled vs measured, mechanism assumed from geometry).

## Contradictions within my subdomain
- Number of anti-HER2 VHH structures: known_her2 finds 3 (5MY6, 9MTE, 9MTX); paratope_rules and therapeutics add 7QVK (4). Working figure is 4.
- Epitope domain prior: known_her2 suggests hedging I and IV highest; therapeutics (own contacts) finds no public VHH in IV and puts them in I and the junctions. Computed contacts outrank inference from trastuzumab competition.
- Kinked CDR3 fraction: 58% overall (Dizicheh) vs over 95% for AF-modelled IGHV3-3; modelled structures overstate kinking.
- Non-CDR contact share: 24% (615-set, IMGT boundaries) vs 23% FR share (17-set, heuristic boundaries); consistent but boundaries differ.
- Two brief DOIs for Zavrtanik 2018 were wrong; corrected to 10.1016/j.jmb.2018.09.002 and Data in Brief 10.1016/j.dib.2019.103754.

## Gotchas for the modeler (what could silently fool us)
- The 0.6 PR-AUC positional prior is leaky (clone families); do not forecast from it.
- Never train or tune on 5MY6/7QVK/9MTE/9MTX if scored on HER2 complexes; use as sanity test only.
- IMGT numbering of ONU11/13/23 came from a custom anchor-rule script, not ANARCI; may be off by one in FR3 and CDR2. Rerun ANARCI.
- Do not score MA start residues or His6 tags.
- HER2 numbering is UniProt (mature + 22); mixing numbering shifts every residue by 22.
- Crystal-lattice contacts inflate epitopes unless filtered by symmetry image.
- Affinity or "binder" calls from multivalent formats are not monovalent paratope quality.
- Epitope domains for 9MTE/9MTX are our own contact calculation, not the paper's.

## Questions for other queens (name the queen)
- q1_her2_biology: reconcile domain I/III vs I/II-junction epitopes for 9MTE/9MTX; do HER2 glycans sit inside the VHH footprints?
- q3_assay_ngs_ground_truth: do the competition sublibraries (trastuzumab, pertuzumab, D8F12) give per-clone domain labels for ONU-like clusters?
- q8_compute_validation_execution: does the 8GZ5 Voronota-LT reproduction (26/206) match your cutoff, and can 9MTE/9MTX be leakage-free proxies?
- q5_structure_prediction_docking: CDR3 confidence by length (ONU23, 20 aa) for AF3, Boltz and Chai on post-cutoff structures.

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- A nanobody is a tiny camel-family antibody that grips its target mostly with one long, floppy loop in the middle.
- Only four pictures of nanobodies stuck to HER2 exist, and none looks like our three mystery clones, so we cannot simply copy an answer.
- Guessing which part of the nanobody touches HER2 is fairly easy, but guessing which part of HER2 gets touched is the hard half.

## Gaps I could not fill
- SAbDab-nano current entry count (last seen 1,972 on 2025-07-10) and CDR histograms.
- Domains and Kd of 27A05, 47D05, 29E09; real BLASTp of ONU CDR3s; identity of 47D5 vs 47D05.
- Seed clones 11A4, 22G, 18G, A10, D12 unverified; AVIDa-hHER2 paper, Govaert and Zavrtanik numbers; per-region alpaca SHM; ready-made alpaca IGHV FASTA.
- A formally overturned nanobody epitope claim (none found).
- Boltz/Chai CDR3 RMSD on nanobodies.
