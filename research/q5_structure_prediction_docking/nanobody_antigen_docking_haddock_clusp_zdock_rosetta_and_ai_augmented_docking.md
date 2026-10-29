---
title: Nanobody-antigen docking (HADDOCK3, ClusPro, ZDOCK, Rosetta, AI-augmented) - what it adds over co-folding for HER2-VHH
queen: q5_structure_prediction_docking
king: king_infer
worker: nanobody_antigen_docking_haddock_clusp_zdock_rosetta_and_ai_augmented_docking
tier: expert
tags: [docking, HADDOCK3, ClusPro, ZDOCK, SnugDock, AF3, nanobody, epitope, restraints, HER2]
confidence: medium
challenge_relevance: 3
serendipity: "Cryptanalysis cribs: restraints are known plaintext that shrink the pose keyspace. Held partially - bits are real, but the cheapest crib for HER2 (domain-level epitope) is unknown for the blind ONU clones, and the crib has to be guessed, not given."
date: 2026-10-17
---

## TL;DR
Docking only works well when you already know something about the interface. In the only nanobody-specific HADDOCK3 benchmark I could open (40 complexes), blind "all-surface" docking reached 20% top-10 success, while loose epitope information gave 55% and the full true interface gave 87.5%. A current co-folding engine (AF3 server, 25 models) already gets 52.5% top-10 blind on the same set. For the three blind HER2 clones, docking is therefore at most a cheap, CPU-only sanity ensemble or re-ranker, and it is worth hours, not days, of the 14.

## 1. Published numbers (what I actually opened)

Primary source: Sanchez-Marin, Giulini, Bonvin, "Combining AI structure prediction and integrative modelling for nanobody-antigen complexes", bioRxiv 10.1101/2025.07.01.662355 (version posted 2026-04-27, not peer reviewed). Benchmark: 40 nanobody-antigen complexes, CDR3-non-redundant, released after 2021-09-30. Success = CAPRI acceptable or better (DockQ >= 0.23 in the AF comparison). Protocol: HADDOCK3 antibody-antigen workflow (rigidbody 1000 models, top 200 to flexref, emref, FCC clustering), nanobody input = clustered ensemble of ImmuneBuilder + AF2-Multimer models (IBMu).

| Method / scenario (n = 40) | Top1 | Top10 | Notes |
|---|---|---|---|
| HADDOCK3 True Interface, bound antigen | 65% | 87.5% | all interface residues active, no passive |
| HADDOCK3 True Interface, predicted/unbound antigen | 57.5% | 80% | |
| HADDOCK3 Loose Interface (CDR active; epitope+4 A passive), bound | 30% | 55% | 65% top10 with FCC cluster-based success |
| Loose Interface, unbound antigen | 17.5% | 42.5% | 55% cluster-based |
| Two-Hit (2 alanine-scan hot residues active, +7.5 A passive), bound | ~LI | up to 47.5% (with new paratope) | |
| Loose + framework-aware CDR+FR paratope, bound / unbound | n.r. | 62.5% / 42.5% | top-200 pool 95% / 85% |
| All Surface (blind; 10,000 rigid-body models), bound | 7.5% | 20% | not run for unbound antigen |
| AF2-Multimer v2.3 (blind) | 25% | 27.5% | |
| AF3 server, 25 models (blind) | 32.5% | 52.5% | AF3 paper: 60% top1 with 1000 seeds |

Other head-to-head facts:
- Hitawala and Gray (bioRxiv, PMC11838198; published as doi 10.1080/19420862.2025.2545601, tandfonline returned 403 so I used the preprint): nanobody-antigen docking set N=70; AF3 single seed top-ranked 31.4% success (DockQ > 0.23), 11.4% high accuracy. The paper does NOT run ClusPro/HADDOCK/ZDOCK/HDOCK head to head; it cites physics docking as about 20% in passing. Combined filters (Rosetta dG_B <= 0 then I-pLDDT >= 73) reach n-AUC 0.992 for nanobodies. AlphaRED (AF2M + ReplicaDock) cited at 43% on N=67.
- Gaudreault et al., Bioinformatics 2025 (btaf129): 81 antibody-antigen complexes (antibodies only, no nanobodies), top-5 naive: AF3 47% (epitope mapping)/46%, AF2-M 28%, Boltz-1 28%/21%, template-docking up to 35%. Docking competitive only vs AF2 era, not AF3.
- Clustered AlphaFlow-ensemble HADDOCK (PMC12279294, antibodies, 54 complexes): Para-Epi AFL top-1 67% bound / 78% unbound (n=9 hard cases); CDR-VagueEpi top-10 67% bound-unbound, 56% unbound-unbound; AF3 server 25 models "still struggled" in these hard cases.
- Nanobody ensemble note: AF3 had the best CDR3 (mean 2.48 A top1; best-of-25 median 1.15 A), but its structures cannot be used downstream under AF3 server terms (Bonvin paper).
- Not found (gaps): any published CAPRI acceptable rate for ClusPro, ZDOCK(+IRAD), HDOCK or SnugDock specifically on nanobodies. Rosetta robustification paper (PLoS One 10.1371/journal.pone.0234282) reports antibody HADDOCK 75% vs ClusPro 67.8% top-10 (found via search snippet only; not opened). Treat as unverified.
- Co-folding reference (not nanobody-specific): FoldBench leaderboard antibody-antigen DockQ>=0.23 (post-2023-01): AF3 47.9%, Protenix 34.1%, Boltz-1 33.5%, OpenFold3-preview 28.8%, HelixFold3 28.4%, Chai-1 23.6%. Post-2024-01: AF3 47.95, Protenix 38.36, OF3 34.29, Boltz-1 31.43, Chai-1 18.31; Boltz-2 25.0 and RF3 37.5 flagged as leakage-prone (github.com/BEAM-Labs/FoldBench). No nanobody-only rows on the page. A 2026 preprint (106 real nanobody complexes vs 11,342 shuffled pairs; AF3 PR-AUC 0.187, Chai-1 0.067, Boltz-2 0.026; epitope recall about equal for real and shuffled pairs) was seen only via search snippet (page 429'd) - low confidence.

## 2. How restraints change success
- Blind to paratope-informed (Bonvin, bound antigen, top10): 20% (All Surface) -> 42.5-55% (Loose; CDR only + vague epitope) -> 62.5% (CDR+FR paratope) -> 87.5% (true interface). Top1 is 3-4x lower than top10 everywhere, scoring is the bottleneck: top-200 pool holds acceptable poses in 85-95% of cases.
- CDR-only paratope is a leaky crib: when less than 60% of the true paratope lies on CDRs, HADDOCK struggles in top10. 69.9% of 226 SAbDab-nano structures bind via CDR3 plus CDR1/2 plus framework (FR2/FR3), only 30.1% are antibody-like CDR-only. Gotcha for the ONU clones.
- Antigen quality matters: unbound/predicted antigen costs about 8-23 points top10. 2/40 epitope RMSD > 5 A even after PDB homolog substitution.
- Input-nanobody accuracy: min CDR3 RMSD in the ensemble vs max DockQ in top10, Pearson up to -0.66.
- HADDOCK rescue value: where AF2M failed (29 cases) Loose gets 10% (top1) and 34% top10 acceptable; on AF2 low ipTM (<0.6) 22%/39%. AF3-failed cases: table text truncated in my extraction - n=18 failed, 21 low-ipTM, rates not recovered. Roughly 30-40% rescue in low-information scenarios.
- Restraint type 'HER2 domain-level': no benchmark exists; closest is Loose Interface (epitope +4 A shell). A domain-sized passive patch is vaguer than anything benchmarked, so expect numbers between Loose and All Surface (20-55% top10), unverified.

## 3. Compute, install, access
| Tool | Access | Cost per complex | Verdict for 14 days |
|---|---|---|---|
| HADDOCK3 | `pip install haddock3` (README: Python 3.10+; PyPI version number not retrieved - check `pip index versions haddock3`). Tutorial says registration form for CNS access, Linux/macOS only. | Bonvin: 12 cores AMD EPYC 7451 about 37-45 min per workflow (+30-40% with mixed restraints). Tutorial on M2 10 cores: about 24 min; reduced sampling (200/50) under 6 min. All Surface: 10,000 rigid-body models, far more. | Trivial on Explorer `short` (CPU only, no GPU quota). 3 complexes x 4 restraint scenarios x 2-3 receptor conformations = about 36 runs, about 25 core-hours x 12 = under 30 wall-hours if run 4-6 at a time. |
| HADDOCK web server | free, registered; queue times not retrieved | n/a | Not needed, local is easy. |
| ClusPro | free academic server; antibody mode exists; limits/queue not retrieved | n/a | Manual submission only; useful as independent blind ensemble. AbEMap contact-frequency (below). |
| ZDOCK | zdock.wenglab.org (moved from umassmed); 3.0.2, 3.0.2f, IRaPPA re-ranking; recent wait about 2 min 24 s; no limits listed on landing page | n/a | Fast blind rigid body. No nanobody benchmarks found. |
| HDOCK | accepts sequences or PDB, about 30 min typical | n/a | Not benchmarked here. |
| Rosetta SnugDock / ReplicaDock (AlphaRED) | academic licence, not verified this session | not retrieved | Skip: install and CPU burden not worth it. |

Conda recipe (unverified beyond README): `conda create -n haddock3 python=3.11; pip install haddock3; pip install pdb-tools freesasa`. Restraints via `haddock3-restraints calc_accessibility | passive_from_active | active_passive_to_ambig`. Data: github.com/haddocking/nanobodies (inputs, restraint files, scripts); tutorial www.bonvinlab.org/education/HADDOCK3/HADDOCK3-nanobody-antigen/ (workflow topoaa, rigidbody, flexref, emref, clustfcc, seletopclusts, contactmap).
Explorer guardrails: public `short` only, 12 cores x ~1 h per run, never gyorilab/Minkara partitions; array with %cap.

## 4. Pose ensemble to per-residue epitope scores
- Published recipe: ClusPro AbEMap (PMC12679822, n = 26 antibody-antigen complexes after 2021-09-30). Per antigen atom, Boltzmann-weighted normalized contact occurrence over the 1000 lowest-energy PIPER poses, summed per residue. For AF ensembles the weight is ipTM over 500 models (AF3: 100 seeds x 5).
- Residue-level PR-AUC (mean, SE ~0.04-0.07): X-ray bound Ab+Ag 0.43; unbound X-ray 0.26; homology Ab 0.26-0.28; sequence-only predicted 0.20-0.22; AF2-M ensemble 0.36/0.35; AF3 ensemble 0.58/0.53 (ROC 0.82/0.81).
- Answer to "does docking-ensemble beat a single AF3 pose": no published nanobody evidence. For antibodies, contact-frequency over a large AF3 ensemble (0.53-0.58) beats classic docking-based AbEMap with predicted inputs (0.20-0.22). I found no single-pose AF3 PR-AUC on that same set; so this supports "ensemble contact frequency over co-folding poses" rather than "docking beats AF3". Text had a garbled duplicate (0.53/0.36), table numbers used.
- Practical estimator for Track A: score_r = sum_k w_k * 1[r in interface of pose k], w_k from ipTM (co-folding) or Boltzmann exp(-E/kT) / HADDOCK score; cluster-level weighting reduces duplicate poses.

## 5. HER2-specific inputs
- 1N8Z: trastuzumab Fab-HER2 ectodomain crystal, 2.52 A; HER2 appears fixed in an extended, ligand-activated-like state. 1S78 is a HER2 ectodomain entry with Fab chains (pertuzumab - my knowledge, not confirmed in sources). 6OGE: cryo-EM HER2-trastuzumab(-pertuzumab); domain IV and trastuzumab Fab have weaker local map quality (high domain IV flexibility); a newer cryo-EM entry 8PWH is cited. 7MN8: no information found.
- Rigid-body docking against one receptor cannot represent domain IV motion. Bonvin: epitope RMSD > 5 A kills docking; multi-domain antigens are the failure mode (7QNE). Use a HADDOCK3 receptor ensemble (1N8Z + 6OGE + a pertuzumab-bound frame), or dock domain-wise.
- Both the trastuzumab and pertuzumab Fabs occupy known sites; their footprints give free negative restraints (epitope probably not overlapping if the ONU clones are non-competing, unknown).

## 6. Does docking add anything on top of co-folding?
Evidence says: marginally. (i) Co-folding blind top10 (AF3, 25 models) 52.5% > Loose docking 55% only when the epitope is already roughly known; (ii) docking rescues about 30-40% of AF-failed cases, but only if restraints are informative; (iii) the real-vs-shuffled preprint suggests co-folding confidence is not specific, and docking cannot fix that without information; (iv) cluster of poses plus contact-frequency is a useful ensemble re-ranker. Bonvin's own advice: with no epitope information, try AlphaFold-like methods first and use docking as a last resort.

## Forced analogy: cryptanalysis cribs
(a) Docking = brute-force key search over rigid-body poses (6 DOF, plus conformer ensemble); restraints = cribs (known plaintext). Number of bits: a crib reduces key entropy by log2(prior/posterior). My calculation from the Bonvin top10 numbers: All Surface 20% to Loose 55% = +1.46 bits on success odds; to True Interface 87.5% = +2.1 bits. Geometric keyspace view (assumptions, not from sources: about 30 distinguishable epitope patches on the HER2 ectodomain, about 5 bits; domain I-IV labels = 2 bits; 5-8 CDR3 active residues restrict paratope to about 1-2 bits).
(b) Testable idea: build the Track A score as a Bayesian posterior: prior = AF3/Boltz/Chai ensemble contact frequency, likelihood = HADDOCK3 contact frequency under CDR-only restraints plus HER2 domain restraint; score = product, check agreement. Check cheaply on SAbDab-nano proxies (e.g., 8GZ5) whether the fused PR-AUC beats the best single (AbEMap table: AF3 ensemble 0.53-0.58).
(c) Honest verdict: partially holds. The bits are real, but the analogy breaks because cribs here are guessed (Loose Interface used true epitope + 4 A shell, an oracle). In a blind challenge the crib has to come from co-folding itself, which makes the docking-ensemble largely circular. Cheapest crib for HER2: epitope domain label (2 bits) plus excluding trastuzumab/pertuzumab sites; the ONU domain assignment is unknown (could come from AVIDa-hHER2 sequence clustering - speculation).

## Gotchas
1. Bonvin Loose/Two-Hit scenarios use experimental epitope information (an oracle); numbers do not transfer to blind HER2. The honest blind number is All Surface: 20% top10, 7.5% top1, n=40, bound antigen only.
2. Top-N metrics differ: success is "any acceptable in top N" or cluster-based "any of top 4 per cluster" - not comparable with AF3 DockQ top1.
3. Leakage: Bonvin used CDR3-non-redundant, post-2021-09-30 set, but Boltz-2/RF3 training cutoffs are later (FoldBench flags them); HER2 itself is heavily represented in PDB.
4. Contact-frequency PR-AUC (AbEMap) is antibody-only, n=26, SE up to 0.07; no nanobody result; PR-AUC baseline depends on epitope fraction, so numbers are not comparable across sets.
5. HER2 is a multi-domain, flexible target; benchmark antigens are mostly single-domain.
6. Preprints, not peer reviewed; Hitawala numbers from the earlier preprint version; Nature (FoldBench) and tandfonline blocked.
7. AF3 outputs may not be reused downstream per server terms (Bonvin paper), restricting AF3-pose-to-HADDOCK pipelines; the local AF3 weights licence is a separate question.
8. Docking top200 contains acceptable poses in 85-95% but ranking is poor - a contact-frequency score over all poses will smear toward the whole accessible surface unless weighted.

## Implications for the challenge
1. Do not spend GPU days on docking; use CPU-only HADDOCK3 on Explorer `short` as an overnight add-on: 3 complexes x (CDR-only active, CDR+FR paratope, domain-restraint) x 2-3 HER2 conformations, about 40 min x 12 cores per run.
2. Make the co-folding ensemble (AF3 if available via server, Boltz-2, Chai-1, Protenix, OpenFold3) the primary signal; score residues by ipTM-weighted contact frequency (AbEMap-style), which has the only published PR-AUC evidence (antibody: 0.53-0.58 with AF3 100 seeds).
3. Use docking only to re-rank/validate: where docking top clusters agree with co-folding contacts, raise confidence.
4. Use CDR+FR paratope restraints (CDR3 active; FR2/FR3 regions), not CDR-only; Fpara < 60% hurts.
5. Receptor: use a HER2 ensemble (1N8Z, 6OGE, a pertuzumab-bound structure) rather than one frame; check domain IV RMSD.
6. Verify claims before relying: HADDOCK3 current version, CNS licence, ClusPro/ZDOCK server limits, Rosetta licence - not retrieved.
7. Validate any fusion on a few public nanobody-antigen proxies for PR-AUC before submission; only 5 submissions allowed.

## Open questions
- Nanobody-specific residue-level PR-AUC from docking ensembles (none found).
- Per-nanobody GPU-hours for AF3/Boltz-2/Chai-1/OF3/Protenix and nanobody-only success rates for each (FoldBench lacks nanobody rows; not answered by this worker; see sibling workers).
- Whether ONU11/13/23 bind domain IV (flexible) or I-III.
- HADDOCK3 current version and install recipe on Explorer.

## Sources (opened)
- https://www.biorxiv.org/content/10.1101/2025.07.01.662355 (PDF read locally via pdftotext; Sanchez-Marin, Giulini, Bonvin)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/ (Hitawala and Gray preprint; published doi 10.1080/19420862.2025.2545601 not opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12279294/ (clustered AlphaFlow ensembles, HADDOCK)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12679822 (AbEMap contact-frequency, AF2/AF3 ensembles)
- https://academic.oup.com/bioinformatics/article/41/4/btaf129/8093612 (AI-augmented physics-based docking)
- https://github.com/BEAM-Labs/FoldBench (leaderboard)
- https://github.com/haddocking/haddock3 (README) and https://www.bonvinlab.org/education/HADDOCK3/HADDOCK3-nanobody-antigen/
- https://zdock.wenglab.org/
- Search-snippet only (not opened): biorxiv 10.64898/2026.03.02.709004; 3decision.discngine.com HER2 page; rcsb 1N8Z; PLoS One 10.1371/journal.pone.0234282
