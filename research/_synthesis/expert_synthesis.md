---
title: "SEPIQ 2026 Track A: expert synthesis (round 1)"
tier: expert
author: scribe
date: 2026-10-17
---

Basis: two king logs and nine queen digests; every number is a hive claim carrying the confidence the queens assigned (most worker files were read through lossy fetch summaries; own computations are flagged). Where kings disagree both values are stated.

## The problem, formally

**Inputs.** Three held-out complexes (ONU11, ONU13, ONU23), antigen chain A = UniProt P04626 1-624 + His6 (offset 0, signal peptide 1-22 included, "GACQ" is native 621-624), chain B = VHH with sequential numbering; printed VHH lengths 127/127/135 incl. His6 (the brief's "130" is an artefact; VHH proper 129 for ONU23). Chain A length is unresolved (618 from file-size inference, 624 sequence, 630 printed). CDR3: ONU13 12 aa (KYGSSRLWDY), ONU23 20 aa (DGRFYSDYVWSSPDEYAY), ONU11 RPLGSTWTEHPY (a label-noise clone in the AVIDa table).

**Outputs.** One CSV per complex (`chain, seqNum, resName, prediction`), probability in [0,1]; omitted residues = 0; up to 5 submissions per team; window 2026-09-01 to 2026-10-31; results 2026-12-15 (/detail) vs ranking 1 Dec (Space), unresolved.

**Metric.** Per-complex PR-AUC, macro-averaged over 3, unweighted and area-weighted (weighted recall = TP_area/P_area with ordinary precision); truth = Voronota-LT antigen-VHH contact area > 0 on ~3.0 A cryo-EM models; ties resolved by a paired residue-level bootstrap (B=2000, 95% CI).

**What the metric cannot see.**
1. Which variant ranks is not stated; /detail names PR-AUC only for the baseline, /guideline defines both (q4).
2. Chain pooling: a CDR-only prior scores ~0.64 on VHH alone and ~0.34 per complex pooled (q6, own simulation).
3. AP vs trapezoid: constant predictor ~0.04 vs ~0.52 (q6, own simulation).
4. Best-of-5 vs last submission: unstated (q8).
5. Residues not modelled in cryo-EM have no label (9MTX: 510/752 deposited residues modelled; likely absent 121-134 and 598-652); 10-25% of positives at risk, unverified (q3).
6. The bootstrap resamples residues, not complexes; errors are spatially clustered so real uncertainty is larger (q4).

## What is actually measured

**Assay chain.** One alpaca immunised with wild-type human HER2 -> two phage-display libraries (pMES4) -> ONE biopanning round -> NGS of before/after pools -> per-clone two-proportion z-test (Z^2 = 2x2 Pearson chi-squared, no Yates, singletons dropped; increase + p <= 0.05 = binder). hIL6 sister dataset validated 10/10 binders (95% lower bound on precision ~69%); hHER2 behaviour is inferred from it (q3).

**Where information is created.** Immunisation creates antigen-specific lineages (alpaca: 88 IGHV, 17 hallmark-bearing V genes carry >85% of usage, Tu 2020). Panning enriches display-competent HER2-binding clones against whole ECD. Cryo-EM creates the only residue-level information (the test truth).

**Where it is destroyed.** The whole-ECD panning discards location; the one-round design leaves the lowest signal-to-background; the z-test has no multiplicity correction; display/expression bias and tag (His, GACQ) binders pose as binders; Voronota area > 0 admits contacts 4-6 A apart (Tyr351-Tyr109 5.64 A, 1.12 A^2).

**Noise model.** Label false-positive 10-40% among binders and 30-60% of specific clones missed (q3, assumption-derived; stats worker 5-15%/PPV 25-95%); invalid below ~10 combined reads (7-10% false binder at 3-4 reads in simulation); truth replicate flip 4-9% (q3). A perfect predictor tops at PR-AUC ~0.92-0.97; 3 complexes give CI ~0.18 wide.

## The data, forensically

**AVIDa-hHER2 (real tables, q7).** 1,843,875 unique VHH; 19,367 labelled (7,316 Yes, 12,051 Not; the brief's "few hundred" is wrong); label reproduces 100% from counts; IE-score is a pooled z-test clipped at -500; "Not" is mostly "depleted"; only 49.5% of Yes are replicate-confirmed; 59% of Yes have zero mother reads; 97% of sequences have zero reads per HER2 sublibrary; 77.9% singletons. Sublibraries: negative controls and trastuzumab/pertuzumab/RabMAb (named "Companion" in the count file) competition, Mother Library B only.

**Enrichment biases.** Abundant-clone favouritism, parasitic clones, display bias (rho 0.88 in one scFv study), tag binders. Families: 120,206 Hamming-1 CDR3 families from 1.68 M sequences; 39 families carry 50% of above-expectation post-panning reads; replicate Pearson 0.93 at family level, yet family size is partly PCR/sequencing variants. The three ONU clones sit in families of 1,330 to 4,420 sequences with CDR3 varying only at the error floor (0.5-2%/column).

**Lineage leakage.** 3-mer AUROC 0.945 (random) falls to 0.855 under family split. Pooled per-sequence enrichment AUROC 0.991 is circular with the label.

**SAbDab-nano.** 823 structures / 492 non-redundant CDR sets (Sept 2021); SAbDab2 June 2026 has 21,237 antibody instances; 2026 nano count not obtained. Public HER2-VHH truth: 5MY6 (2Rs15d, X-ray 2.25 A, domain I, 2017), 7QVK (3.1 A, I/II junction, 2023), 9MTE (27A05 + 47D05, cryo-EM 2.66 A), 9MTX (29E09, 3.06 A), the last two released 2025-11-19. Brief errors: 5F7D/5MYX/5MZV, 5MY7, 7PH0 are not HER2-VHH. 27A05/29E09 are one family (identity 0.857). No CDR3 within 70% identity of ONU clones (BLASTp not run; max CDR3 identity <= 0.36 per q6; full-length < 0.73 per q8; framework <= 74% per q1).

**Leakage structure.** Engine cutoffs (single source, medium-low): AF3 2021-09-30, Boltz-2 2023-06-01, Chai-1 2021-01-12, OpenFold3/Protenix-v1 2021-09-30. 9MTE/9MTX are post-cutoff for all; 5MY6 is inside co-folding windows, 7QVK inside Boltz-2's. Rules say public leakage is "not an issue as long as the answer is correct".

## Information ceiling (numbers)

| Quantity | Value | Source |
|---|---|---|
| HER2 contact fraction (public binders) | 3-5% (5MY6 3.8%; 4 A VHH macro AP base 0.024) | q1, q3 |
| General 24-pair set, area>0 / >=5 A^2 / d<4 A | 13.2% / 11.3% / 9.5% | q3 |
| Brief/8GZ5 baseline proxy | 0.126 (26/206) | BRIEF |
| Random macro PR-AUC, HER2 antigen | ~0.03-0.05; VHH ~0.2-0.3 | q3 est. |
| Perfect predictor | ~0.92-0.97 | q3 |
| Baseline 0.176 vs shuffle null | null 0.147, sd 0.032, P(>=0.176)=0.16 | q6 |
| Epitope-tool ceiling (antigen only) | DiscoTope-3.0 0.232 at 6.4% prevalence (~3.6x) | q6 |
| Smallest reliable macro gap, unrelated models | ~0.09-0.11 (0.07 antigen-scale, 0.15 VHH-scale; correlated variants ~0.03) | q8, q9 |
| Winner probability, modestly better method | 58-61%; gap >= 0.15 wins reliably | q4 |
| 3-cluster bootstrap false positives | ~14% | q8 |
| Footprint prior on held-out VHH | macro AP 0.04-0.05 | q1 |
| Exposure alone for "touched by any binder" | AUC 0.72 (rigidity 0.35-0.40) | q1 |

Interpretation: the antigen side is at most a few-fold lift over a ~0.04 floor; the VHH side carries large lift but also a high chance level, so pooled scoring would be won by the paratope prior.

## Methods, ranked by evidence for THIS test

| Method | Needs | Best reported number on comparable data | Failure mode | Cost |
|---|---|---|---|---|
| Multi-seed co-fold contact frequency (Boltz-2, Chai-1, OpenFold3, Protenix-v1), ipSAE-weighted, mean not max, split-half shrinkage | Seqs, GPU (AF3 weights need application) | AF3 31.6% DockQ>=0.23 (n=60, 1 seed), Boltz-1 23.3%, Chai-1 15.0% (Hitawala and Gray 2025); ipTM AP 0.45, I-pLDDT+dGB 0.743 | Consensus is model agreement not truth; ONU23 20 aa CDR3; shuffled pairs look similar (low-confidence snippet: AF3 0.187, Chai-1 0.067, Boltz-2 0.026); leakage for pre-2025 proxies | ~12-14 GPU-h extrapolated |
| Antigen exposure/RSA x (1 - dimer patch) x mild footprint, shrunk to ~0.04 | HER2 structure | AUC 0.72 (any binder touched) | Footprint alone weak; mAb hotspots are not VHH hotspots | CPU hours |
| VHH paratope prior (positional damage map or CDR-variability, CDR+flank) | ANARCI numbering | 0.547 vs 0.149 prevalence (17 VHH); +0.17 to +0.33 on 5 HER2 VHH; CDR variability 0.562 on CDR residues | Leaky CV (~0.6); own IMGT script may be off by one; ONU23 long CDR3 | CPU hours |
| Nanobody-LM paratope head (ESM-2, AbLang-2, IgBert; MIT/BSD) | SAbDab-nano, grouped folds | PR-AUC ~0.69-0.77 at 10-25% prevalence (not comparable across papers) | Near chance for epitopes on unseen groups (AsEP AUROC 0.544) | GPU-hours or CPU |
| Antigen-only epitope predictors (DiscoTope-3.0, BepiPred-3.0, SEMA) | Structure | DiscoTope-3.0 0.232 (24 antigens, 6.4%); BepiPred-3.0 0.177; SEMA 0.185 | HER2 likely in their training sets; DTU academic licence vs prize money | CPU |
| Blind docking (HADDOCK3 etc.) | Epitope restraint | 20% top-10 all-surface; 55% loose epitope; 87.5% true interface (n=40) | Needs epitope that we lack | CPU-hours |
| Competition-column domain gate | Domain mapping verified | ONU13 depleted >20x by trastuzumab, ONU11/ONU23 not | Domain mapping from memory (low) | ~free |
| NGS representations (DCA, DMS, mimotope, PU) | Real tables | DCA 0.509 < variability 0.562; mimotope oracle 0.081 vs RSA 0.083; PU lowered PR-AUC | Killed four ways | Do not spend GPU |
| AntiBinder-style pair classifier | Pretraining on AVIDa-SARS-CoV-2 | 0.176 (organiser proxy, not a paper number) | ~1.2x shuffle null | Cheap |

## Cross-domain transfers worth testing

1. Cryptanalytic frequency analysis (seeds as intercepts, split-half as shrinkage). Test: on 9MTE/9MTX, shrunk consensus must beat unshrunk mean-contact PR-AUC.
2. Decibans / weight-of-evidence (additive log-odds from independent sources). Test: log-odds sum must beat the best single source by >= 0.03 macro PR-AUC after clustering correlated sources.
3. Sports walk-forward backtest. Test: if an arm's rank on 9MTE/9MTX contradicts its rank on 5MY6/7QVK beyond a preset margin, treat the gain as memorisation.
4. Healthcare screening / prosecutor's fallacy (enrichment label PPV ~27% at 3% prior, estimate). Test: PU-weighted enrichment-style signal must beat uniform+exposure by >= 0.02 macro PR-AUC leave-one-complex-out, else drop. Note q7 already found PU variants lowered PR-AUC.
5. Law-of-evidence consensus of cutoffs (robust core). Test: fraction-of-cutoffs score must raise weighted PR-AUC over a single-cutoff label.
6. Ecology realised-vs-fundamental niche (dimer-occupied patch ~51 residues, mostly 221-351, as a down-weight mask). Test: mask must lower mean AP-by-position over exposed residues on the 4 public VHH epitopes; presence-only MaxEnt itself died (AP 0.04-0.05).
7. Art-conservation hand-set damage map for the paratope. Test: >= +0.17 absolute over prevalence on 5 HER2 VHHs after ANARCI renumbering.
8. Healthcare base-rate lens. Test: macro lift over per-complex shuffle null >= ~1.5x on both clean proxies or do not submit as main.

## The 90-day plan

Calendar compressed by the deadline (14 days from 2026-10-17); a 90-day plan in the strict sense lies beyond the window, so the first 14 days are binding and the rest is the post-deadline path.

| Window | Milestone | Kill criterion | Compute |
|---|---|---|---|
| 10-17 to 10-20 | Validator (header, sequence, offset-0 numbering round-trip, tag residues = 0, unique values); proxy table via Voronota-LT area>0 for 5MY6/7QVK/9MTE x2/9MTX (+8GZ5 sanity); insurance submission S1 | Any validator mismatch blocks upload | CPU ~2 h |
| 10-20 to 10-24 | Measure seconds per seed (Boltz credits, Explorer); ANARCI/BLASTp of ONU clones; paratope head vs CDR-variability prior | LM head < prior + 0.05 on proxies: use the prior | CPU, small GPU |
| 10-24 to 10-28 | Multi-seed consensus (<= 5-20 seeds x engines) on ONU11/13/23 plus 9MTE/9MTX; leakage ablation (templates on/off, old vs new weights) | Consensus does not beat exposure prior on 9MTE/9MTX; or macro lift < 1.5x | ~12-14 GPU-h extrapolated, <= 2 GPUs, public partitions `short`/`gpu`/`gpu-short` only |
| 10-28 | Freeze; choose among at most 2-3 pre-registered arms | Gaps < ~0.03-0.1: submit the simpler arm | none |
| 10-29, 10-30 | Upload candidate; reserve; last upload by 10-30 06:00 UTC | Partial upload (1-2 files) must be re-checked | none |
| After 10-31 | Reconcile contradictions; if the results (2026-12-15) release ONU structures, retest every arm | n/a | n/a |

Five-submission ladder (king_world): S1 floor (uniform + CDR3/position prior), S2 prior blend, S3 co-fold consensus, S4 ensemble, S5 reserve. The portal returns no score, so submissions are checkpoints and not experiments. Do NOT spend GPU on NGS-derived representations.

## Contradictions still open

1. HER2 prevalence: 0.126 (brief/8GZ5) vs 3-5% (q1) vs 0.024-0.064 (q6) vs 0.03-0.04 (q9). Adopt ~0.04; settle by running Voronota-LT on all proxies.
2. Number of HER2-VHH structures: 3 vs 4 (working figure 4 with 7QVK).
3. Epitope domain: hedge I/IV (inference) vs none in IV (computed contacts); 9MTE/9MTX domains are our own calculation, not the paper's (low).
4. Chain A length 618/624/630; ECD 23-652.
5. Label pipeline: chi-squared (site) vs IE-score cascade (HF card); q7 reproduces the cascade 100% from counts.
6. Official ranking variant, pooling, AP vs trapezoid, best vs last.
7. Deadline/ranking dates: results 2026-12-15 vs ranking 1 Dec; time zone unstated.
8. Voronota version: guideline v1.1.479/release v1.29.4602 vs worker v1.1.497/v1.29.4816.
9. Baseline lift 1.4x (analytic 0.126) vs 1.2x (finite-sample null).
10. "Clean" proxies: runbook says 9MTE/9MTX only; validation file says all four pass the date cutoff; q5 says 7QVK is in Boltz-2's window.
11. Engine ranking: Boltz-2 above Chai-1 (q5, leakage-prone) vs shuffled-pair snippet (low).
12. Is the CDR prior the baseline to beat: q7 (0.562 on CDR residues) vs q5/q6 (different metrics and prevalences).
13. False-positive rate of labels: 10-40% (phage) vs 5-15% (stats).
14. Kinked CDR3 fraction 58% (Dizicheh) vs >95% in AF-modelled IGHV3-3.
15. Detectable gap 0.07 vs 0.15 vs 0.09-0.11 (depends on pooling).
16. Whether the antigen signal can come from enrichment reads: resolved against (q7).

## Sources

Only sources the hive files cite as opened or cited; nothing outside the hive was consulted.

- SEPIQ pages (verbatim capture): research/_meta/sepiq_verbatim.md; https://sepiq.uk
- Hitawala and Gray 2025, doi 10.1080/19420862.2025.2545601
- Sanchez-Marin, Giulini, Bonvin, bioRxiv 10.1101/2025.07.01.662355
- AntiBinder, doi 10.1093/bib/bbaf008; SAbDab-nano, doi 10.1093/nar/gkab1050; DockQ, doi 10.1371/journal.pone.0161879
- Tu 2020, Immunology 161:53, doi 10.1111/imm.13224; Mitchell and Colwell 2018, doi 10.1093/protein/gzy017 and Proteins 86:697 doi 10.1002/prot.25497
- Diwanji 2021, doi 10.1038/s41586-021-04084-z; Cho 2003 (record only), doi 10.1038/nature01392; 9MTE/9MTX, doi 10.1158/1535-7163.MCT-25-0654; 7QVK, doi 10.1371/journal.pone.0288259; 5MY6, doi 10.1158/1078-0432.CCR-17-0310
- Jumper 2021, doi 10.1038/s41586-021-03819-2; Fithian and Hastie 2013 (opened per q9)
- openFDA drugsfda and label endpoints (approval dates)
- Per-worker source lists: research/q1_.../ to research/q9_.../ (each worker file ends with its opened sources)
