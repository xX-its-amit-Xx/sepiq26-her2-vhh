---
title: Prior antibody/nanobody prediction contests, small-n noise, adversarial cases and HER2-VHH proxies
queen: q4_challenge_intelligence
king: king_world
worker: prior_nanobody_antibody_prediction_competitions_and_benchmarks_adversarial_antibody_cases_aircr_and_others
tier: expert
tags: [competitions, small-n, bootstrap, PR-AUC, leakage, HER2-VHH, proxies, CASP16, AIntibody, Adaptyv, Ginkgo-AbDev, sports-analogy]
confidence: medium
challenge_relevance: 4
serendipity: Sports ranking-with-noise (three matches in a series, Bradley-Terry/Elo, luck share of a season) -- paid off; it exposed that the n=3 cluster bootstrap CI is exactly [min, max] of the per-complex differences, i.e. a sign test with a 25% false-positive rate, and that "commit vs hedge" across the 5 allowed submissions is a portfolio problem.
date: 2026-10-17
---

## TL;DR
SEPIQ ranks teams on the mean of three PR-AUCs from three structures. Simulation says that is mostly a lottery between teams of similar skill: a clearly better method (macro PR-AUC about 0.5 vs 0.15) wins about 94-100% of the time, but a modestly better one (e.g. hit-rate 0.6 vs 0.5) wins only about 58-61%, and with 10-30 comparable teams the observed winner is the truly best team only about 10-30% of the time. Prior antibody contests (AIntibody, Adaptyv, Ginkgo AbDev, CASP16) show the same pattern: only the data-rich or experiment-anchored sub-task was won by models, in silico confidence scores were near chance, and the "winner" differed from what the metrics predicted. The best public HER2-VHH proxy complexes are 5MY6, 7QVK, 9MTE and 9MTX (9MTE/9MTX are post-AF3-cutoff cryo-EM, which is the closest match to the ONU test).

## 0. Facts about SEPIQ pinned down this session (feeds the engineering lane)
Verbatim page text, HER2 antigen sequence, ONU11/ONU13/ONU23 sequences and contradiction resolution are in `research/_meta/sepiq_verbatim.md`. Key resolutions:
- Number of antibodies: the home page says both "3 specific VHH antibodies" and "seven given VHH antibodies" (stale block); /detail and /guideline say three (ONU11, ONU13, ONU23). Three is right.
- Metric: /guideline = PR-AUC, unweighted and area-weighted, macro-averaged over the 3 complexes. /detail never names the leaderboard metric. The home page still says DockQ (stale, Track B). Which of the two PR-AUC variants sets the rank is not stated.
- Bootstrap: /guideline says "cluster bootstrap" but the algorithm resamples residue indices (B = 2000, same index set across antibodies and teams, 95% percentile CI, empirical p). It never resamples complexes.
- Dates: June 2026 = original announced start (HF dataset repo created 2026-06-02); operative window 1 Sep - 31 Oct, judging in Nov, results 15 Dec 2026 (organisers may extend).
- The HF dataset is gated (manual approval); public API shows files `AVIDa-hHER2.csv`, `NGS_read_count_table.csv`, `prediction_template_ONU11/13/23.csv`. Column schemas of the first two could not be read without access.
- HER2 numbering in the PDB entries below matches the SEPIQ UniProt numbering (chain starts at Q24, signal peptide 1-22 present in SEPIQ's sequence), so PDB epitope residue numbers can be compared directly.

## 1. Cross-domain small-n, noisy blind contests (Q1)
| Field / contest | n of test items | Metric | Winner margin | Replicated on fresh set? | Lesson for the 3-complex PR-AUC macro |
|---|---|---|---|---|---|
| CASP16 antibody-antigen (assessment: PMC12154902) | 8 AA targets (3 nanobody, 5 antibody); 5 hard | DockQ/ICS/IPS/QSbest, interface only | kozakovvajda acceptable models on 5/8 (~60%); ClusPro 3; Wallner 1, Zheng 2; "most other top groups did not differ significantly" in head-to-head bootstrap | Partly: ColabFold mean DockQ fell 0.21 (CASP15) to 0.05 (CASP16) on the same size set, so difficulty varies more than method skill; CASP15 also 8 AA targets | Even CASP, with 8 targets, reports that most top groups are statistically tied; a classical docking group beat AF3-based ones; sampling depth mattered more than architecture |
| Kaggle Higgs (analysis: rstudio-pubs 29531) | test size not stated in the source; 1,785 teams, >35,000 submissions | AMS (nonlinear) | top scores close together | Rank shake-up "significant", attributed mainly to model variance; public vs private near the identity line, gap grows with score | Best public score is often a lucky fit; only 2 submissions scored privately; split public set in two and average (SEPIQ has no public set, 5 submissions) |
| Netflix Prize (Wikipedia) | 1,408,789 test ratings (quiz 1,408,342) | RMSE | Quiz: Ensemble 0.8553 vs BellKor 0.8554 (0.0001); test: both 0.8567, tie, won by submission time (20 min) | Quiz order did not carry to test (tie) | With n = 1.4 M items the order of the top two was still decided by the clock; n = 3 is 5 orders of magnitude smaller |
| M4 forecasting (N-BEATS paper, INSEAD summary) | 100,000 series | sMAPE/MASE/OWA | winner Smyl (hybrid) OWA 0.821 vs second 0.838 (gap 0.017); winner ~10% better than the combination benchmark | M4 was built to replicate M1-M3; the "simple combinations beat pure ML" result replicated; 6 pure-ML entries none beat the benchmark | Replication at huge n, and what replicated was a method family, not the rank order of teams |
| Good Judgment / IARPA ACE (EA Forum summary, citizenscience.gov) | hundreds of questions (exact count unverified), 2011-2015, questions picked to be 10-90% | Brier | top 60 of 2,800 volunteers had Brier 0.25 vs 0.37 rest; superforecasters 35-72% better than other teams (GJ site claim) | Superforecaster status persisted year to year (selected on year 1, outperformed after) | Skill was real only after pooling many questions; selection on one round regressed |
| NHC hurricane track verification (nhc.noaa.gov verify8) | ~188 (1989) to ~294 (1999) cases per year at 48 h | mean track error, n mi | annual means swing by up to ~50 n mi (nearly 50%) around the trend | Year-to-year ordering is dominated by storm mix | The test set (which storms) moves the score more than the model improvements; per-complex difficulty is the "storm mix" |
| Sports (NBA 82 games, NFL 16 games; optimumsportsperformance blog, one analysis) | 16 or 82 games | win% | luck share of win% variance: NFL 43.1%, NBA 13.3% (second analysis: 39% / 15%) | Standings reliability grows with games | A 16-game season is already ~40% luck; a 3-game series is far worse |

Reading across the table: the margin between winners is usually inside the noise unless the test has n of 1e5 or more or the contest pools many rounds. SEPIQ's n = 3 is below every example here.

## 2. The SEPIQ noise problem, quantified (Q2)
### Setup and assumptions
- Resource check done first (CPU 2%, C: 65.9 GB, D: 45.2 GB free); single process, scikit-learn `average_precision_score` as PR-AUC. Code: `C:\Temp\sepiq26\sim2.py`, `sim3.py`, `sim4.py` (not in the research tree).
- Complex = 750 residues (HER2 ECD ~630 resolved plus VHH ~120). Prevalence: the brief says 0.10-0.15 (8GZ5: 26/206 = 0.126). My own 4.5 A heavy-atom contacts on the real HER2-VHH structures give pooled prevalence 0.049-0.082 (section 5); Voronota-LT counts any contact, so true values are probably 1.2-1.7x higher. I simulated 0.05, 0.10, 0.15.
- Predictor models (binormal scores, positives shifted by d): (a) "bin": d ~ N(d0, 0.4) independently per method and complex; (b) "mix": hit/miss. With probability h the method finds the real patch (d = 1.5-2.0), otherwise d = 0 (right-sized guess at the wrong place). (b) matches the CASP16 and AF3 evidence that epitope placement is all-or-nothing. Residue noise is independent in these simulations, which is optimistic (real errors are spatially clustered), so true SDs are larger.
- Pairs of methods use independent noise given the labels; complex difficulty is shared (cancels in paired differences).

### Standard deviation of macro PR-AUC (3 complexes)
| Prevalence | Random: mean / SD | Weak "bin" (d 0.35) mean / SD | Weak "mix" (h 0.25) mean / SD | Strong "bin" (d 1.5) mean / SD | Strong "mix" (h 0.7) mean / SD |
|---|---|---|---|---|---|
| 0.05 | 0.058 / 0.007 | 0.100 / 0.034 | 0.131 / 0.078 | 0.365 / 0.085 | 0.402 / 0.133 |
| 0.10 | 0.107 / 0.008 | 0.166 / 0.043 | 0.202 / 0.095 | 0.491 / 0.087 | 0.501 / 0.152 |
| 0.15 | 0.156 / 0.009 | 0.231 / 0.052 | 0.260 / 0.104 | 0.570 / 0.083 | 0.563 / 0.153 |
The 0.18 weak predictor sits between the 0.10 and 0.15 prevalence rows (about 0.17-0.23 mean); its SD is 0.04-0.10, i.e. a single run of such a method can score anywhere in roughly [0.10, 0.40] (95% range at prevalence 0.10: 0.10-0.27 bin, 0.10-0.40 mix). Random alone is tight (SD under 0.01), so any real method is separable from random, but methods are not separable from each other.

### Probability the better of two methods wins on the macro score
| Pair (prevalence 0.05 / 0.10 / 0.15) | P(better wins) | SD of macro difference | P(all three per-complex diffs same sign) |
|---|---|---|---|
| Strong vs weak, bin (d 1.5 vs 0.35) | 0.998 / 0.998 / 1.000 | 0.093-0.097 | 0.90-0.93 |
| Strong vs weak, mix (h 0.7 vs 0.25) | 0.946 / 0.942 / 0.938 | 0.15-0.19 | 0.52-0.55 |
| Close, mix (h 0.6 vs 0.5) | 0.587 / 0.576 / 0.595 | 0.17-0.21 | 0.25 |
| Close, bin (d 1.0 vs 0.9) | 0.608 / 0.615 / 0.605 | 0.09-0.11 | 0.24-0.28 |
A moderately better method beats a slightly worse one only ~58-61% of the time: three matches, each barely better than a coin. Analytic cross-check (best-of-3 majority): single-match win prob 0.55 gives 0.575, 0.60 gives 0.648, 0.70 gives 0.784, 0.80 gives 0.896.

### What the "B = 2000 paired bootstrap at n = 3" really gives
- Exact result for a cluster bootstrap over complexes: 3 draws from 3 complexes give 27 equally likely resamples; the three "all draws identical" resamples each have probability 1/27 = 3.7%, above 2.5%, so the percentile 95% CI is exactly [min_k d_k, max_k d_k] over the three per-complex PR-AUC differences, B = 2000 only adding Monte Carlo jitter. The CI excludes 0 only if all three differences share a sign: that is a sign test, false-positive rate 2/8 = 25% under a symmetric null (consistent with the P(all same sign) column above). The empirical p-value formula in /guideline degenerates (p near 0 if all three positive).
- What /guideline actually specifies is a residue-index bootstrap. It measures only within-complex label-sampling noise, ignores complex-to-complex variation, and so is overconfident about generalisation. Simulated example (true hit rates 0.6 vs 0.5, prevalence 0.10, B = 2000, five datasets): residue-bootstrap 95% CI width 0.107-0.151 (stable), while the cluster CI width equals the range of the per-complex diffs: 0.012, 0.120, 0.445, 0.488, 0.707 in five draws. In one dataset (per-complex diffs -0.011, -0.005, -0.017) the cluster CI [-0.017, -0.005] excluded zero by the sign rule even though the differences were tiny, and in another the residue CI [0.010, 0.140] excluded zero from a lead that came from one complex (0.006, 0.125, 0.101).
- Type-I check (identical methods, hit 0.5 vs 0.5, prevalence 0.10): over 150 simulated datasets (B = 400 for the residue bootstrap, 2,000 for the cluster one), the residue-bootstrap 95% CI excluded 0 in 68.7% of cases (nominal 5%), and the n = 3 cluster CI in 30.7% (theory 25%; Monte Carlo SE about 3.8 points). So if the organisers run the documented residue bootstrap, "statistically significant" between two equally good teams is the usual outcome; it should not be read as evidence of skill. Caveat: "null" here means equal hit probability with independent hit/miss draws per method, which is the case where complex-level luck dominates.
- Leaderboard-level view (sim4: K teams, true macro-skill SD 0.03-0.06, team-specific noise SD 0.05-0.15 taken from the SD(diff)/sqrt(2) range above): with K = 10, P(observed winner is the true best) = 0.16-0.49 and P(true best in observed top 3) = 0.42-0.82; with K = 30, 0.07-0.37 and 0.19-0.67. Rank Spearman 0.18-0.73. A pooled-over-two-teams noise realistic for the top group (true SD 0.03, noise 0.09) gives 10-20% chance the top-ranked team is truly best.

## 3. Prior antibody/nanobody competitions and benchmarks (Q3)
| # | Contest / benchmark | Date, organiser | Task | Test size | Metric | Top score / result | Public lessons |
|---|---|---|---|---|---|---|---|
| 1 | AIntibody (Nature Biotechnology s41587-026-03238-6; announcement paper s41587-024-02469-9) | results Aug 2026; designed by Specifica (IQVIA), Bradbury and Erasmus. I found no Aithyra link, and Aithyra/Ginkgo in the brief looks wrong | 3 tasks on SARS-CoV-2 RBD: affinity maturation of a parent, ranking, de novo CDR loops | 511 designs from 29 organisations, one lab | KinExA/BLI affinity + 5 developability assays | Aureka: 94.7 pM vs best lab-screened 113 pM (statistically tied); six designs under 10 nM; Aureka claims ~2,000-fold over parent (company press release, not the paper) | Models won only the data-rich maturation task; ranking task worse than random picking except for one model (secondary source); loops variable; single easy antigen; top entries used bespoke PLM + structure + affinity-data workflows; IgGM 3rd (BooleanBiotech) |
| 2 | Adaptyv EGFR binder competition (bioRxiv 10.1101/2025.04.17.648362) | 2024, two rounds, Adaptyv Bio | design EGFR binders | R1: 201 designs, 5 bound (2.5%); R2: 400 tested, 378 expressed (95%), 53 bound (~14%); 1,800+ submissions, 130 designers, 30 got a binder | SPR affinity | best 1.21 nM (Cradle cetuximab variant, 8x vs cetuximab scFv 9.94 nM); best de novo 82-91.5 nM (BindCraft) | ipTM, iPAE, ESM2 pseudolikelihood not significantly correlated with binding (ROC-AUC ~0.5; normalised ESM2 0.72 because many designs were mutants of known binders); optimising known binders most reliable; top-100-by-metrics picks bound 24% vs 10% for diversity picks but not stronger; interface dG, H-bond %, interface size separated binders |
| 3 | Ginkgo Datapoints AbDev (mAbs 10.1080/19420862.2026.2634216; ORA PDF) | Sep-Nov 2025, Ginkgo | predict 5 developability assays | 113 teams; held-out test sizes not extracted | Spearman | hydrophobicity 0.708; thermostability 0.392; polyreactivity 0.356; self-association 0.337; titer 0.310 | "limited model performance and a call for data standardisation"; datasets too small, models generalise poorly (abstract via search snippet; paper itself returned 403) |
| 4 | AIRR-ML-25 (Kaggle adaptive-immune-profiling-challenge-2025) | 2025, AIRR-C | classify disease from repertoires, find explaining sequences | 290 teams per a third-party GitHub README (unverified on Kaggle) | AUROC-type, details unverified | one dataset (HSV-2) best AUROC 0.67 in a Frontiers paper | official results to be in Nature Methods; a top-10 repo uses k-mer + public clone + ESM2 ensemble (LingyiC/airr-ml-gisl); no winner post-mortem found. Kaggle pages are JS shells, so facts are from GitHub and search |
| 5 | CASP16 AA targets | 2024, Prediction Center | antibody/nanobody-antigen complexes | 8 targets (3 nanobody) | DockQ, ICS, IPS | kozakovvajda 5/8; ColabFold DockQ 0.05; AF3 5,000-model run mean DockQ 0.27, 2 models above 0.49 | classical docking with heavy sampling beat deep-learning servers; sampling unsolved; small target count blocks firm conclusions |
| 6 | CASP15 AA targets | 2022 | same | 8 targets (stated in CASP16 paper) | same | ColabFold DockQ 0.21 | CASP16 AA targets were harder |
| 7 | CAPRI rounds 47-55 (Proteins; ResearchGate record) | 2019-2024 | multi-type, many antibody targets | 49 targets overall; round 55: 3 of 4 with antibodies | CAPRI/DockQ | performance poor on antibody and nanobody complexes lacking co-evolution | massive-sampling AF (MassiveFold) helps; SEPIQ Track B uses this framework |
| 8 | Absolut! (Robert et al., Nat Comput Sci 2(12):845, 10.1038/s43588-022-00372-4) | 2022, Greiff lab | synthetic antibody-antigen 3D binding with known epitope/paratope/affinity | ~1e9 structures, 159 lattice antigens (Sigma2 readme) | ML task accuracy | method ranking on Absolut! data matched ranking on experimental data (abstract via search; the paper page needed a login) | useful for pretraining/benchmarking but lattice antigens are not real HER2 |
| 9 | AbBiBench (arXiv 2506.04235) | 2025 | likelihood vs measured affinity; CDR-H3 redesign for H1N1 | v2: >184,500 measurements, 14 antibodies, 9 antigens | zero-shot correlation | n/a | scores whole complex not antibody alone; FoldX mutant structures on Zenodo; snippet-level facts only |
| 10 | Hitawala and Gray AF3 docking benchmark (mAbs 10.1080/19420862.2025.2545601; PMC11838198) | 2024-25 | AF3 on SAbDab complexes after 30 Sep 2021 cutoff | 70 nanobody, 118 antibody complexes (single seed) | DockQ | nanobody 11.4% high accuracy, 31.4% overall (published version quotes 13.3% / 34.7% across ab+nb) | ipTM-HA >= 0.4 cutoff; Rosetta dG + I-pLDDT best (n-AUC 0.992); filters 99% within set and 95% vs AF3 train |
| 11 | SAbDab-nano (10.1093/nar/gkab1050) | Schneider et al 2022 | database | 2,013 antigen-bound VHH structures (July 2026 per /guideline); 9,775 antibody-antigen structures in SAbDab | n/a | n/a | the pool SEPIQ proxies come from |

## 4. Adversarial cases where prediction or the label misleads (Q4)
Verified items (opened sources) first.
- **CASP16 H1244, BILBO1-Nb48**: in all predictions with RMSD below 15 A, Nb48 sat on the globular EF-hand motif instead of the true site; no group got an acceptable model (PMC12154902, structure-provider paper via search). A single group's model 1 got the epitope wrong on all 8 antibody/nanobody targets (search snippet, unverified in the full text). H1225: best DockQ only 0.48.
- **AF3 confident but wrong** (Hitawala and Gray, PMC11838198): nanobody bin ipTM-HA 0.8-0.9: 20% incorrect; I-pLDDT 85-90: only 33% correct; their stated mechanism: "difficulty finding the correct antigen interface for a given antibody interface". They name no PDB IDs for failure cases.
- **AF2-M vs AF3 nanobody epitope** (bioRxiv 10.1101/2024.10.07.616899, snippet only): failure 67.1% (AF2-M) vs 52.9% (AF3); weak or non-binding nanobodies get placed on surface hydrophobic patches (ResearchGate summary, low confidence).
- **HER2 itself, from the PDB list I pulled (63 HER2 entries via UniProt P04626)**: epitope location varies widely among VHH. My 4.5 A contact analysis gives 2Rs15d (5MY6): residues 109-112, 156-157, 170-183, 217 (domain I, and notably it does not compete with trastuzumab or pertuzumab per PDBj/NCBI summaries); NM-02 (7QVK): 170, 200-203, 213-232 (domain I/II junction, mostly domain II by residue range); 27A05 (9MTE chain A) and 29E09 (9MTX): essentially the same discontinuous epitope, 35-90 plus 378-498, joining domain I and domains III/IV in the extended conformation; 47D05 (9MTE chain B): 105-180 plus 256-257. So one antigen offers at least three distinct sites for VHH, and two different clones (27A05, 29E09) share a discontinuous epitope. Residue ranges for domains are the standard UniProt boundaries (I ~1-195, II ~196-320, III ~321-488, IV ~489-630), applied by me, not from the papers.
- **Domain IV benchmark antibodies** (not VHH, still adversarial for sequence-only models): trastuzumab Fab 1N8Z (deposited 2002-11-21) and pertuzumab 1S78 (2004-01-29; domain II), repebody Rb-H2 on domain IV 6LBX (2019-11-15). The domain assignment for 1N8Z/1S78 is background knowledge, not from a page I opened.
- **Non-canonical CDR3 packing**: NM-02 (7QVK) carries an extra Cys pair (CDR1 and CDR3 region) visible in the sequence from RCSB: `...NECELV...` and `...TCAALDY...`; I infer a non-canonical disulfide linking CDR3 to framework/CDR1, typical of dromedary VHH, but I did not verify this in the paper (10.1371/journal.pone.0288259).
- **Multiple binding modes / cryptic epitopes for VHH with PDB IDs**: I did not find a verified HER2 example; the cryptic-site claim (CDR3 reaches cryptic sites) rests on a review (PMC12109276, snippet only). Unverified.
- **Labels that mislead (SEPIQ-specific)**: binder = proportion up after ONE panning round and chi-squared p <= 0.05 against the mother library, not affinity or epitope; no multiple-testing correction on the labels (metadata promised); enrichment can come from expression/display/phage-propagation bias, panning against a dimerising ECD with GACQ+His tag, and can select binders to the tag or to a non-trastuzumab-like site. Test structures are cryo-EM at about 3 A of a complex that may be a dimer: contact labels depend on which assembly (chain choice) Voronota sees.

## 5. Leakage, homology and fair proxy tests (Q5)
### Published practice
- AF3 cutoff date 30 Sep 2021 plus sequence filters (Hitawala and Gray: 99% inside test set, 95% vs AF3 train; benchmark 110 complexes after Sep 2021 at 80% identity: bioRxiv 10.64898/2026.09.06.749672, search snippet only because the page returned HTTP 429).
- SAbDab2 (Zenodo 20083995; BLOPIG June 2026): "ab-split" clusters by antibody only and can leak through the antigen; "ab-ag-split" also clusters antigens; replaces date splits.
- Other thresholds: 40% CDR clusters (bioRxiv 2023.04.01.535079), 75% heavy/light (AbRank), 95% plus epitope-group, antigen-fold and temporal splits (Chimera-Bench, arXiv 2603.13431), Foldseek-Multimer clusters (DeepRank-Ab). No consensus threshold.
- SEPIQ explicitly accepts public-data leakage "as long as the answer is correct". Consequence: 5MY6, 7QVK, 9MTE, 9MTX are all public, so a model that has seen them will do better on ONU if the ONU epitopes overlap those sites (e.g. clone 27A05/29E09 family in domain I plus III/IV). Epitope redundancy (two near-identical epitopes in one entry pair) is the actual leak, not sequence identity of VHHs.

### Public HER2-VHH complexes (UniProt P04626 entries in RCSB with a VHH chain; RCSB data API and search)
| PDB | Deposited | Released | Method / res (A) | VHH | HER2 epitope (my 4.5 A contacts) | Pooled interface prevalence (A+B) |
|---|---|---|---|---|---|---|
| 5MY6 | 2017-01-25 | 2017-08-09 | X-ray 2.25 | Nb 2Rs15d (115 aa) | domain I, 18 res | 0.060 (antigen 0.032, VHH 0.191) |
| 7QVK | 2022-01-21 | 2023-02-01 | X-ray 3.1 | NM-02 (132 aa) | domain I/II, 18 res | 0.049 (0.036 / 0.107) |
| 9MTE | 2025-01-11 | 2025-11-19 | cryo-EM 2.66 | 27A05 + 47D05 (two VHH on one HER2) | 27A05: 23 res (I + III/IV); 47D05: 14 res (I/II) | 0.075 and 0.049 |
| 9MTX | 2025-01-12 | 2025-11-19 | cryo-EM 3.06 | 29E09 (122 aa) | 19 res, same site as 27A05 | 0.082 (0.048 / 0.209) |
Other HER2-binding non-VHH scaffolds in the same pull: 4HRL/4HRM/4HRN DARPins (2012-10-28), 3MZW affibody (2010-05-13), 6LBX repebody (2019-11-15), 5K33/5KWG Fcab (2016-05-19/07-18). The brief's proxy 8GZ5 (RBD-P17) gives 15/195 antigen (0.077) and 18/123 VHH, pooled 0.104 by my contact rule vs 26/206 = 0.126 by the organisers; so my numbers likely understate Voronota by up to ~1.7x. 7QVK, 9MTE and 9MTX are cryo-EM or X-ray entries after the AF3 cutoff (2021-09-30), so AF3/Boltz/Chai-class models have not seen them in training, and 9MTE/9MTX (released 2025-11-19) are also later than most models' data. They are the right fair-proxy pool for leave-one-complex-out tests; 5MY6 is older than the cutoff (contaminated for AF3).

## Forced analogy: sports analytics (three matches in a short series)
(a) Statement. Each ONU complex is a match; each team's per-complex PR-AUC is its performance; the leaderboard is the series result. Bradley-Terry strength = log-odds of beating another team in one match; Elo = running estimate of it. Luck factors: opponent (the epitope drawn: some are easier), form (hit or miss on the patch), and the referee (Voronota contact definition).
(b) Testable ideas.
 1. Build a league of your own candidates: score each candidate on the five public complexes (5MY6, 7QVK, 9MTE, 9MTX, 8GZ5) by leave-one-complex-out, fit Bradley-Terry on per-complex wins, and require a candidate to win on at least 4 of 5 (a 5/5 sweep has one-sided sign-test p = 1/32, about 0.03; 4/5 has p = 6/32, about 0.19, so only a clean sweep is evidence); rank by posterior probability of beating the incumbent, not by mean PR-AUC.
 2. Use the five submissions as a portfolio. PR-AUC is convex in "which patch was right": committing to the top patch gives about 1.0 if right and about prevalence if wrong; interleaving 3 patches gives about 0.33 either way. So for expected macro score commit to the most probable patch; use the other submissions for different patch hypotheses (domain I vs domain II vs III/IV) if the scoring takes the best or last submission. The rules do not say whether best-of-5 or the last counts (open).
 3. Expect regression to the mean: the best of 10-30 comparable entries is the luckiest, so do not read a 0.02-0.05 lead on the public proxies as skill.
(c) Verdict: partially holds. It holds for the 3-match noise, the sign-test structure of the CI, and "form" (hit or miss). It breaks because teams are scored on the same matches (shared difficulty cancels in comparisons, unlike sports schedules), PR-AUC is continuous not win/loss, and there is no home advantage; and in sports the losing team is not scored on how wrong it was.

## Gotchas / what could fool us
1. The 0.176 baseline vs "random 0.126" is on a 206-residue RBD; HER2 ECD is about 630 residues, so the random PR-AUC is about 0.05-0.10, not 0.126. A 0.18 on HER2 would be far better than the same number on 8GZ5.
2. Whether PR-AUC is computed over antigen chain only or antigen+VHH pooled per complex is not stated; the weighted variant needs weights only on positives; the metric can reward a VHH-paratope-only strategy if chains are pooled (paratope prevalence is 0.11-0.21 vs 0.03-0.05 on the antigen).
3. The documented bootstrap resamples residues not complexes: CI can look tight (width 0.11-0.15) while the real uncertainty (complex draw) is 0.1-0.7.
4. n = 3 cluster bootstrap CI is [min, max] of per-complex differences; "significant" means "all three agree in sign" (25% by chance).
5. Leakage is declared acceptable; 9MTE/9MTX contain overlapping epitopes (27A05 and 29E09), so any ONU clone from the same family would be solved by nearest-neighbour lookup in public PDB data.
6. In silico confidence (ipTM, iPAE, pLDDT) is a poor selector: ROC-AUC about 0.5 for binding in Adaptyv; AF3 confident bins 20-67% wrong for nanobodies.
7. Independent-residue noise in my simulations understates the real spatial correlation; true SDs are larger.
8. Brief says AIntibody was Aithyra/Ginkgo; I found Specifica (IQVIA) with Bradbury and Erasmus; Ginkgo AbDev is a different contest.
9. Secondary sources (Aureka press release, artificialscience summary) supply the AIntibody ranking claim; the Nature article was not readable here.
10. SAbDab-nano holds near-duplicate VHH families (many from one lab/target class), so identity splits on VHH alone do not remove epitope redundancy.

## Implications for the challenge
1. Treat the Dec 15 leaderboard as a lottery among near-equals: aim for a method that is clearly better than the median (macro PR-AUC gap of at least 0.15-0.2) rather than +0.02 refinements.
2. Maximise P(hit) on the epitope patch: ensemble different structure-first predictors (AF3, Boltz, Chai, OpenFold3, ClusPro-style docking with heavy sampling per CASP16), and add a prior from public HER2-VHH epitopes (domain I/II/III/IV sites listed above).
3. Use the five submissions as distinct hypotheses and find out (ask organisers) whether best or last counts.
4. Build the proxy league from 5MY6, 7QVK, 9MTE (two VHH), 9MTX plus 8GZ5, with leave-one-complex-out; report sign counts, not averages.
5. Do not select on ipTM/pLDDT alone; combine interface energy and consensus across tools.
6. Ask the organisers to confirm: chain pooling, variant used for ranking, which bootstrap, and how ties are broken (Netflix lesson: time of submission).
7. Evaluate paratope and epitope separately in practice; the paratope side is easier (higher prevalence, canonical CDR positions) and could dominate a pooled metric.

## Open questions
- Is PR-AUC per complex pooled over chains A and B or per chain; which variant (weighted/unweighted) ranks; does best or last of the five submissions count?
- Real ONU epitope prevalence under Voronota-LT (needs structures; unavailable until release).
- Does ONU belong to the 27A05/29E09 clonotype family (CDR3 motif "DVNGD"; ONU23's CDR3 "DGRFYSDYVWSSPDEY" does not look similar by eye; unverified)?
- AIRR-ML-25 final leaderboard, Ginkgo AbDev test sizes, AIntibody per-task winners: need Kaggle/Nature full text.
- Hit-rate calibration of the "mix" model: real AF3 per-complex hit rate on HER2-VHH could be measured on the proxies (compute lane).

## Sources
Opened (fetched or retrieved):
- https://sepiq.uk/ , https://sepiq.uk/detail , https://sepiq.uk/guideline , https://sepiq.uk/about (raw HTML via curl)
- https://huggingface.co/api/datasets/sepiq-2026/SEPIQ-2026-training-data (public metadata; README gated)
- https://data.rcsb.org/graphql and https://search.rcsb.org/rcsbsearch/v2/query , https://files.rcsb.org/download/{5MY6,7QVK,9MTE,9MTX,8GZ5}.cif (structures, my contact analysis)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12154902/ (CASP16 complex assessment)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/ (Hitawala and Gray, AF3 antibody/nanobody docking)
- https://en.wikipedia.org/wiki/Netflix_Prize
- https://adaptyvbio.substack.com/p/protein-design-competition-has-binder (Adaptyv results; paper bioRxiv 10.1101/2025.04.17.648362 returned 429)
- https://artificialscience.org/2026/08/ai-beats-the-lab-at-antibody-design/ ; https://blog.booleanbiotech.com/ai-antibody-design-2025
- https://rstudio-pubs-static.s3.amazonaws.com/29531_4b5b689e7adf4448a8d420e6b356397c.html (Higgs leaderboard analysis)
- https://ora.ox.ac.uk/objects/uuid:f1c61639-22e2-4737-b651-f18888f6b507/files/r0z708z807 (PDF unreadable; figures from search snippet)
Search-snippet only (not opened in full; confidence lower): Nature s41587-026-03238-6 and s41587-024-02469-9 (AIntibody), tandfonline 10.1080/19420862.2026.2634216 (Ginkgo AbDev), Kaggle AIRR-ML-25 page and GitHub topic page, Frontiers 10.3389/fimmu.2026.1944643, Nature Comput Sci 10.1038/s43588-022-00372-4 (Absolut!), arXiv 2506.04235 (AbBiBench), bioRxiv 10.64898/2026.09.06.749672, Zenodo 20083995 and BLOPIG SAbDab2 post, bioRxiv 10.1101/2024.10.07.616899, PMC12109276, NHC verify8 page, N-BEATS arXiv 1905.10437, INSEAD M4 summary, EA Forum / citizenscience.gov (Good Judgment), optimumsportsperformance.com (luck share), PDBj/RCSB/NCBI 5MY6 summaries, CAPRI rounds 47-55 pages, Proteins 10.1002/prot.70025.
