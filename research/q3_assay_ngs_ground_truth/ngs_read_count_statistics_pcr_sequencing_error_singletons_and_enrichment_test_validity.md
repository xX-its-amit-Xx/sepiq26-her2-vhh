---
title: NGS read-count statistics, sequencing/PCR error, singletons and validity of the AVIDa enrichment test
queen: q3_assay_ngs_ground_truth
king: king_world
worker: ngs_read_count_statistics_pcr_sequencing_error_singletons_and_enrichment_test_validity
tier: expert
tags: [AVIDa-hHER2, chi-squared, two-proportion z-test, Cochran, label-noise, PCR-error, singletons, compositionality, PPV, PR-AUC, simulation]
confidence: medium
challenge_relevance: 3
serendipity: Healthcare screening base-rate arithmetic (sensitivity/specificity/PPV) applied to the enrichment call; it paid off by giving a hard numeric PPV band (about 25-65% at 1-5% prevalence under idealised alpha) and a clean argument for PR-AUC.
date: 2026-10-17
---

## TL;DR
The AVIDa "binder" label is a two-proportion test (algebraically a 2x2 Pearson chi-squared without continuity correction) on before/after read counts, with singletons dropped. It is valid only for clones with roughly >= 10 combined reads. Below that it is anti-conservative (my simulation: 7-10% false "binder" calls among testable clones at 3-4 reads versus the nominal 2.5%), and with realistic PCR/phage-growth over-dispersion the false-positive rate stays at 5-15% even at high counts. At 1-5% true-binder prevalence the PPV of a "binder" call is plausibly 25-95% depending on count and enrichment strength. The label says "enriched on a HER2-coated bead in one round", which is not "binds HER2 at an epitope".

**Access limit.** `COGNANO/AVIDa-hHER2` on Hugging Face returns HTTP 401 to me, and `sepiq-2026/SEPIQ-2026-training-data` (public metadata lists `AVIDa-hHER2.csv` and `NGS_read_count_table.csv`) is gated:manual. So Q6 (analysis of the real table) was NOT run. Everything about hHER2 specifically is inferred from the two sibling AVIDa papers (same lab, same pipeline) and the BRIEF. Anything marked "sim" is my own simulation with assumed parameters, not a measurement of AVIDa-hHER2.

## 1. What test is actually used (primary source)
From the AVIDa-hIL6 paper (Tsuruta et al., NeurIPS 2023, arXiv 2306.03329, Sec. 3.1 Steps 4-5); the AVIDa-SARS-CoV-2 paper (arXiv 2405.18749) describes the same procedure:
- About 100,000 paired reads per library; "singletons were removed to avoid sequencing errors"; unique amino-acid VHH sequences are counted. SARS-CoV-2 methods: reads trimmed with Cutadapt v3.5, low-quality reads removed with Trimmomatic v0.39, paired reads merged with fastq-join, VHH CDS extracted.
- Test: x1, x2 = counts of one VHH before/after panning, n1, n2 = library totals. Quote: "Given that the minimum value of all possible n1 and n2 was over 10,000, we assumed ... normal distributions ... according to the central limit theorem." Z = (p1hat - p2hat)/sqrt(p(1-p)(1/n1+1/n2)), pooled p = (x1+x2)/(n1+n2), p-value from the standard normal. This is the two-proportion z-test; Z^2 equals Pearson chi-squared of the 2x2 table [x1, n1-x1; x2, n2-x2] without Yates correction. The BRIEF's "chi-squared" is therefore right in effect, but the papers say z-test. The CLT justification is on n1, n2 (>10,000), not on x1, x2, which is the crux: validity of the normal approximation depends on expected cell counts, not library size.
- Label rule: increase and p <= 0.05 -> binder; decrease and p <= 0.05 -> non-binder; else non-significant (excluded; hIL6 reports 1,998,127 non-significant samples; SARS-CoV-2 says about 97% of the total). Two-sided p <= 0.05 means a nominal 2.5% false-binder rate among tested true nulls.
- hIL6 takes the smallest p-value over 12 sublibraries for the same target (min-p, no multiplicity correction). hHER2 reportedly has two libraries (BRIEF); whether min-p over two is used is unverified.
- Noise filter (hIL6, Sec. 3.1): a binder to the no-antigen negative-control panning becomes "noise"; if non-significant vs control, the label is kept only if p(control)/p(antigen) >= 10^2.5 ("empirically determined by an author (a biologist)"). Whether hHER2 labels carry this filter is unverified (a search-result summary says the SEPIQ card mentions HER2-free negative-control sublibraries; I could not open it).
- hIL6 label validation (Sec. 3.3): 10 binder-, 6 non-binder- and 4 noise-labelled VHHs tested by immunofluorescence (BLI as well); all 10 binders bound. Clones were clustered at 93% identity and selected in read-count order. n=10 gives an exact 95% lower bound on precision of only about 69%, and high-count selection biases toward the easy regime.

## 2. Validity of the test (Q1)
- Cochran's rule (all expected counts >= 5 in a 2x2; Cochran 1954 - I did not open it, attribution unverified by me). With n1 ~ n2 the smallest expected cell is (x1+x2)/2, so validity needs x1+x2 >= 10. The test can still call clones below that (x1=0, x2 >= 4 is the smallest call at two-sided 0.05; x2=3 gives one-sided p = 0.042, not enough), and every such call violates the rule.
- How many AVIDa-hHER2 sequences violate it is UNMEASURED (table inaccessible). In my synthetic library (10^6 clones, lognormal sigma=2, 10^5 reads each) only 7.9% of testable clones (x1+x2 >= 2) had x1+x2 >= 10. If the few hundred labelled sequences were chosen with a minimum read count the violating share could be near 0%; if not, most binder calls would come from the violating range.
- Alternatives. Fisher's exact (conditional binomial, equal depths) is exact but conservative: 0.5-2.9% null up-calls versus 3-9.5% for the z-test at 2-4 reads (table below). G-test shares Pearson's small-count problem. Count models (DESeq2/edgeR negative binomial; not run here) handle over-dispersion but need replicates to estimate dispersion. Enrich2 (Rubin et al., Genome Biol 2017, doi 10.1186/s13059-017-1272-5) gives per-variant errors from sampling plus replicate consistency (abstract/summary level only; a 2018 correction fixed overestimated standard errors in its random-effects model). DiMSum (Faure et al., Genome Biol 2020;21:207, doi 10.1186/s13059-020-02091-3; opened via PMC7429474) models variance as m_in/N_in + m_out/N_out + a with replicate-specific multiplicative terms "from one all the way to more than 100", and reports that Enrich2 inflates type I errors in over-dispersed datasets while a pure Poisson count model fails when over-dispersion is high. Rosace (Rao et al., Genome Biol 2024;25:138, doi 10.1186/s13059-024-03279-7; abstract level only) shares information across positions by shrinkage. None of these were applied to AVIDa; all need replicates or a variance prior.
- DiMSum's lesson applies directly: Poisson-only error (variance of log counts ~ 1/N) understates real noise, and the AVIDa test is Poisson/binomial-only.

## 3. Null behaviour and false-discovery tables (Q2, sim)
Setup: 10^6 clones, lognormal(0,2) abundance, 10^5 reads before and after, independent sampling of the same composition, singletons set to 0, two-sided alpha 0.05 counting increases only (`C:\Temp\sepiq26\q3sim\sim3.py`).

| min (x1+x2) | clones tested | z/chi2 false-binder rate | Fisher/exact rate | share with all expected cells >= 5 |
|---|---|---|---|---|
| 2 | 23,966 | 3.2% | 0.5% | 7.9% |
| 3 | 11,031 | 6.9% | 1.2% | 17% |
| 4 | 7,993 | 9.5% | 1.6% | 24% |
| 5 | 5,880 | 4.9% | 2.2% | 32% |
| 6 | 4,496 | 3.1% | 2.9% | 42% |
| 10 | 1,882 | 2.0% | 1.3% | 100% |
| 20 | 526 | 2.7% | 1.7% | 100% |
| 50 | 85 | 5.9% | 3.5% | 100% |

The nominal 2.5% holds only on average; discreteness makes a sawtooth (x1=0, x2=4 is the smallest possible call). About 760 false binders arise at min count 2 among ~24k testable clones, and ~25-40 at min count >= 10 among ~1.9k. The 10^6-clone library is mostly unobserved (only ~6x10^4 distinct sequences seen at 10^5 reads in my sim).

False discovery with true binders (sim). True-binder enrichment lognormal(median F, sigma 1 in ln); "noise s" = extra multiplicative lognormal(0, s) noise on the post-panning library (PCR, phage growth, jackpots); one-sided 0.025 per direction; testable set defined by x1+x2 >= m, which conditions on the outcome and flatters sensitivity slightly.

| prevalence | F, noise s | min count | FPR (non-binders called) | sensitivity | PPV | false-discovery fraction |
|---|---|---|---|---|---|---|
| 1% | 10x, s=0 | 3 / 5 / 10 / 20 | 5.0 / 3.3 / 0.9 / 0.5% | 0.68 / 0.91 / 0.95 / 0.97 | 0.58 / 0.75 / 0.95 / 0.98 | 42 / 25 / 5 / 2% |
| 1% | 10x, s=0.5 | 3 / 5 / 10 / 20 | 7.7 / 7.8 / 7.4 / 15.4% | 0.68 / 0.92 / 0.96 / 0.99 | 0.42 / 0.53 / 0.63 / 0.59 | 58 / 47 / 37 / 41% |
| 1% | 3x, s=0.5 | 5 / 10 / 20 | 10.3 / 8.1 / 15.1% | 0.70 / 0.75 / 0.87 | 0.21 / 0.30 / 0.26 | 79 / 70 / 74% |
| 2% | 10x, s=0.5 | 5 / 10 / 20 | 5.8 / 4.7 / 8.1% | 0.90 / 0.94 / 0.98 | 0.75 / 0.85 / 0.85 | 25 / 15 / 15% |
| 5% | 10x, s=0 | 5 / 10 / 20 | 1.4 / 0.0 / 0.0% | 0.86 / 0.92 / 0.98 | 0.97 / 1.00 / 1.00 | 3 / 0 / 0% |
| 5% | 10x, s=0.5 | 5 / 10 / 20 | 2.8 / 1.9 / 3.9% | 0.87 / 0.90 / 0.97 | 0.94 / 0.97 / 0.96 | 6 / 3 / 4% |
| 5% | 3x, s=0.5 | 5 / 10 / 20 | 6.7 / 6.2 / 12.1% | 0.71 / 0.79 / 0.91 | 0.68 / 0.76 / 0.71 | 32 / 24 / 29% |

Key finding: with multiplicative noise the false-positive rate rises with count (Poisson noise shrinks as 1/N, the multiplicative term does not), so raising the minimum count does not fix over-dispersion. Full grid (prevalence 1/2/5%, F 10 and 3, s 0 and 0.5, min count 2..50) is in the companion `.json`. Parameters (F, s, abundance sigma) are assumptions; s=0.5 is mild compared with DiMSum's reported multiplicative terms.

## 4. Sequencing and PCR error (Q3)
- Fraction of reads with >= 1 error, L = 375 nt, closed form 1-(1-e)^L: e=1e-4 -> 3.7%; 1e-3 -> 31%; 3e-3 -> 68%; 1e-2 -> 97.7% (nucleotide level; counting ~25% of substitutions as synonymous, amino-acid level 2.8 / 24.5 / 57 / 94%). The 0.1-1% MiSeq per-base rate is the brief's figure; I opened no MiSeq primary source. DiMSum's simulation assumed a per-base misread rate of 0.0001 (read-misidentification probability 0.02 for 126 nt). Overlap merging after quality trimming (fastq-join after Trimmomatic) lowers the effective rate, but no AVIDa paper gives a number.
- Error variants of an abundant clone (sim, ~843 amino-acid-distinct single-error variants), e=1e-3: a clone with 1,000 reads yields ~245 error reads, ~212 distinct error sequences, 183 singletons, ~29 variants with count >= 2. A clone with 10,000 reads yields ~2,450 error reads, ~800 distinct variants, 134 singletons and ~660 with count >= 2. At e=1e-4 and 1,000 reads: 28 error reads, essentially all singletons. Singleton removal kills nearly all error variants of moderate clones but not of dominant ones; after panning a dominant clone has hundreds of count >= 2 error neighbours that co-enrich with the parent and can be called "binders".
- Chimeras: a few % is the brief's figure; no source opened (unverified). Chimeras of abundant VHHs would also co-enrich with parents.
- Singletons in AVIDa: removed "to avoid sequencing errors" (hIL6, SARS-CoV-2 papers). Not stated whether per library or over a merged corpus. Per-library removal turns pre-panning singletons into x1=0 and makes any clone with x2 >= 4 a "binder"; it also makes rare true binders untestable.
- Jackpotting/PCR duplicates: no UMIs described in any AVIDa text I opened, so duplicates count as independent reads, one source of the multiplicative noise in Sec. 3.

## 5. Compositionality (Q4)
The test normalises for total depth only (n1, n2 enter the denominator of proportions). Reads are compositional: if a few dominant clones, true binders or background phage increase their share after panning, every other clone's proportion falls, so even a true weak binder can show p2 < p1 and be labelled "non-binder". No spike-in or size-factor normalisation (DESeq2 median-of-ratios, edgeR TMM) is used. In my sim a rare true binder at 3x median enrichment is detected only 52-91% of the time (sensitivity column), before any compositional depression. The non-binder label therefore means "not enriched relative to total", not "does not bind". The label count and class balance in hHER2 are unknown to me.

## 6. Replicates and reproducibility (Q5)
- hIL6: "Only experiments targeting the wild-type IL-6 protein were performed in triplicate to ensure reproducibility"; the text I read reports no concordance statistic for those triplicates, and labels use min-p over 12 sublibraries.
- hHER2: BRIEF states two libraries, one biopanning round. The hHER2 card/paper was inaccessible, so replicate structure and any enrichment-reproducibility figure are unverified (not confirmed absent).
- Reasoning: for shared clones, Poisson noise alone bounds log-fold reproducibility to about 1/sqrt(x) (about +-0.3 in ln at 10 reads), plus over-dispersion. Testable once the table is available: correlation of log2(x2/x1) between libraries for shared clones with x >= 10.

## 7. Minimum detectable enrichment (Q7, sim)
Input count c treated as exact, equal depth n1=n2=10^5, same z test (two-sided alpha, per-direction alpha/2). "Median" = fold where the expected output gives p <= alpha; "80%" = fold giving 80% Poisson power.

| input count c | alpha 0.05 median | alpha 0.05, 80% power | alpha 0.001 median | alpha 0.001, 80% power |
|---|---|---|---|---|
| 0 | needs x2 >= 4 | - | - | - |
| 1 | 6.5x | 9.1x | 13.5x | 17.1x |
| 2 | 4.3x | 5.7x | 7.8x | 9.7x |
| 3 | 3.5x | 4.6x | 6.2x | 7.6x |
| 5 | 2.7x | 3.5x | 4.5x | 5.4x |
| 10 | 2.05x | 2.5x | 3.2x | 3.7x |
| 20 | 1.75x | 2.0x | 2.35x | 2.65x |
| 50 | 1.45x | 1.6x | 1.8x | 1.95x |
| 100 | 1.3x | 1.4x | 1.55x | 1.65x |
| 1000 | 1.1x | 1.15x | 1.2x | 1.2x |

Optimistic (exact input, no over-dispersion). A clone at 1-5 input reads needs roughly 3-9x enrichment to be called at alpha 0.05; rare true binders are mostly undetectable, consistent with ~97% of tested pairs being non-significant in the SARS-CoV-2 paper.

## 8. Q6: analysis of NGS_read_count_table.csv
Not performed: file inaccessible (HF 401; SEPIQ repo gated). Resource check passed (C: 65.9 GB free, D: 45.2 GB, CPU 1%; pyarrow 25.0.1 present), so once obtained: read before/after/label columns with pyarrow, then compute the count distribution, the fraction with before+after < 10 (expected cell < 5), and the share of labelled binders at count extremes, per library. No numbers invented.

## Forced analogy: healthcare screening (base rates)
(a) The AVIDa label is a screening test: sensitivity = P(called | true binder), specificity = 1 - FPR, prevalence pi = share of true binders among tested clones (hIL6: 3.7% binding pairs; hHER2 unknown). PPV = sens*pi / (sens*pi + FPR*(1-pi)). With idealised FPR 2.5% and sensitivity 0.9: pi=1% -> PPV 27%; 2% -> 42%; 5% -> 65%. In the noisy sim at count >= 5, FPR is 3-10% and PPV spans 0.21-0.94 as tabulated: a 4-fold range from prevalence and noise.
(b) Testable ideas. (i) An epitope task with ~0.12 per-residue prevalence is the same regime: ROC-AUC is dominated by abundant true negatives, PR-AUC exposes precision; evaluate against the prevalence baseline (about 0.126 on the 8GZ5 proxy) and per complex, as the metric is macro-averaged over three. (ii) Treat an AVIDa "binder" as probability 0.3-0.9, not 1; weight training examples by call power (down-weight x1+x2 < 10). Test: retrain a sequence-based paratope/epitope model with count-weighted versus hard labels on the 8GZ5-like proxy and compare PR-AUC.
(c) Holds well for the base-rate arithmetic and the PR-vs-ROC argument; partially breaks because the "disease" (binding at an epitope) is not observed by the screen even in principle, and most labelled clones have no confirmatory test (hIL6 confirmed 10 binders).

## Gotchas / what could fool us
1. The CLT justification (n > 10,000) is the wrong criterion; validity needs expected cell counts >= 5 (about >= 10 combined reads).
2. Clones with x1 = 0 are tested as if p1 were known; any clone absent pre-panning with >= 4 reads after is a "binder" at alpha 0.05.
3. Per-library singleton removal creates artificial zeros and compounds point 2.
4. Over-dispersion (PCR jackpots, phage growth/display bias, no UMIs): false-positive rate does not fall with count (8-15% at high counts in the sim).
5. Min-p over several libraries (hIL6: 12) inflates false positives with no correction; two hHER2 libraries could lift the up-call rate to about 4.9% in the worst case.
6. Error neighbours of dominant clones and chimeras co-enrich with the parent and look like independent binders.
7. Enrichment can come from beads/plastic/blocker/streptavidin binding, His-tag or GACQ linker, phage growth advantage or display level; hIL6 used a negative-control filter, hHER2 use is unverified.
8. One panning round gives one bit per clone about whole-antigen enrichment, nothing about residues.
9. "Non-binder" mostly means "not enriched relative to composition", especially for rare clones.
10. The few hundred labelled sequences are probably high-count (selection bias); do not extrapolate their reliability to the 1.8M-row table.
11. All false-discovery numbers here are simulations under assumed parameters, not hHER2 measurements.

## Implications for the challenge
1. Do not train on hard binder/non-binder; weight by read count (e.g. require x1+x2 >= 10 or weight by test power, Sec. 7).
2. Request access to sepiq-2026/SEPIQ-2026-training-data and run the Sec. 8 analysis (Cochran-violating share, inter-library reproducibility of shared clones).
3. Recompute labels with Fisher's exact test plus a count threshold and compare with the provided labels; the disagreement is an empirical label-noise estimate.
4. Cluster sequences (AVIDa used 93% identity) and collapse error neighbours before using counts; do not treat clone families as independent evidence.
5. Use the labels for what they say (enriched on HER2 after one round) and take epitope/paratope information from structure-based or co-folding methods.
6. Report Track A PR-AUC per complex against a prevalence baseline.

## Open questions
- Exact hHER2 processing: negative-control filter, min-p over the two libraries, singleton handling, read-count threshold for labelled sequences.
- Number and count distribution of labelled sequences; share violating Cochran.
- Replicate concordance for clones shared between the two libraries.
- Actual per-base error and chimera rate in the COGNANO pipeline (no number in any opened paper).

## Sources
- Tsuruta et al., AVIDa-hIL6, NeurIPS 2023, https://arxiv.org/abs/2306.03329 (PDF opened, text extracted; Sec. 3.1-3.3)
- Tsuruta et al., AVIDa-SARS-CoV-2, NeurIPS 2024, https://arxiv.org/abs/2405.18749 (PDF opened, text extracted; Sec. 1, appendix methods)
- HF cards opened: https://huggingface.co/datasets/COGNANO/AVIDa-hIL6 , https://huggingface.co/datasets/COGNANO/AVIDa-SARS-CoV-2 , https://huggingface.co/datasets/COGNANO/AVIDa-hTNFa ; https://huggingface.co/api/datasets/sepiq-2026/SEPIQ-2026-training-data (public metadata only: file list, gated manual); COGNANO/AVIDa-hHER2 returned 401
- https://github.com/cognano/AVIDa-hIL6 (README opened)
- Faure et al., DiMSum, Genome Biol 2020, https://pmc.ncbi.nlm.nih.gov/articles/PMC7429474 (opened, first ~100k characters)
- Rubin et al., Enrich2, https://doi.org/10.1186/s13059-017-1272-5 and correction https://pmc.ncbi.nlm.nih.gov/articles/PMC5803959 (search summaries only)
- Rao et al., Rosace, https://link.springer.com/10.1186/s13059-024-03279-7 (search summary only)
- Simulation scripts: C:\Temp\sepiq26\q3sim\sim2.py, sim3.py
