---
title: Negative labels, PU learning, noisy labels and enrichment-to-label denoising on AVIDa-hHER2
queen: q7_data_representation_integration
king: king_infer
worker: negative_labels_pu_learning_noisy_labels_and_enrichment_to_label_denoising
tier: expert
tags: [AVIDa-hHER2, label noise, PU learning, nnPU, Enrich2, empirical Bayes, replicate agreement, phage display bias, family leakage, constellation analogy]
confidence: medium
challenge_relevance: 3
serendipity: Shazam constellation-of-peaks applied to per-position enrichment. It partly held (peaks replicate across cluster halves, Jaccard 0.48-0.61, 75% inside CDR columns) but denoising the global label first did NOT sharpen the local signal.
date: 2026-10-17
---

## TL;DR
I ran everything on the real gated tables (`AVIDa-hHER2.csv`, `NGS_read_count_table.csv`, downloaded with the user's own approved HF access to C:\Temp, aggregates only reported here). The binder label reproduces exactly from the counts (a two-proportion z-test, equivalent to a 2x2 chi-squared, plus a min-aggregation and a six-rule cascade). But it is not a few hundred labels: there are 19,367 labelled clones (7,316 Yes, 12,051 Not). Only 49.5% of Yes clones are confirmed by an independent same-mother replicate, 59% of Yes have zero reads in every mother library, and a sequence model mostly learns lineage (family) membership. Denoised soft labels, Elkan-Noto and nnPU all did worse than raw labels on held-out families, so the "label denoising helps" claim is falsified here.

## 1. Label reproduction and error rates (Q1)
Resource check passed first: C: 64.5 GB free, D: 45 GB free, CPU load 1 to 5%. The data download was about 0.6 GB.

**Data facts that correct the BRIEF.**
- 1,843,875 unique sequences x 29 libraries (3 mothers, 26 sublibraries). Total reads 5.33 M. Library depth runs from 44,118 to 408,975 reads, not a uniform ~10^5.
- Labels: Yes 7,316; Not 12,051; noise 746; non-sig. 1,823,762. The labelled set (Yes + Not) is 19,367 clones in 12,521 clusters, not "a few hundred". Yes clones have at least 4 total reads.
- The NGS table has the same sequence order and per-row totals as the labelled table (row sums equal `total` for 100% of rows). Its HER2 competition columns are named `Companion` where the labelled table says `RabMAb`.

**Reproduction.**

| Step | Result |
|---|---|
| Per-column IE-score from counts (z-test, mother = same phase and suffix, enriched = negative, clipped at +/-500) | 24 of 26 columns recomputed, correlation 1.0, max deviation about 1e-14. The 2 RabMAb columns were not recomputed because of the naming mismatch. |
| Aggregation (min if any value is negative, else max; NaN where both counts are 0) | 100% of 1,843,875 rows for both Background and Target IE, using the provided per-column IE values |
| Six-rule cascade on the provided aggregates | 1,843,875 of 1,843,875 labels match (100%) |

The test is a pooled two-proportion z-test, identical to an uncorrected 2x2 chi-squared. There is no Yates correction, no read-depth filter other than the sequence needing at least one read, and no multiple-testing correction. Two points about the rule:
- The BRIEF says "binder if the proportion rose and p at most 0.05". The real rule also demands a negative-control condition (`Background IE`), and Yes always has Target IE of -1.3 or lower (the two Yes rules are Target < Background-2 with Background < 0, or Background >= 0 with Target <= -1.3). `Not` means no target column enriched AND max depletion at least 1.3, so Not is mostly "depleted", not "tested and flat".
- IE is clipped at -500. Two columns show raw values near -1,576 and -1,728 before clipping, which makes IE magnitude uninformative past about 15.

**Zero counts post-panning.**
- 93.9% to 98.1% of the 1.84 M sequences have zero reads in each HER2 sublibrary (mean over the 15 HER2 libraries 97.05%). Mothers: 92.4% (2nd-B), 94.7% (2nd-C), 97.5% (1st-B).
- 77.9% of sequences are singletons (one read in total), 88.7% have 2 reads or fewer. Singletons hold 27.0% of all reads.
- Among Yes clones, 69.2% of HER2-library cells are zero.

**False-positive rate.** Textbook: one two-sided test at p <= 0.05 gives 2.5% false "rose" calls under a calibrated null, about 46,000 of 1.84 M. That is not what the data do, because the normal approximation is very conservative at tiny counts. I simulated the null (binomial resampling of all 29 libraries at each clone's pooled rate, 3 passes, full pipeline including min over 15 target and 11 background columns):

| Total reads (sim) | Any target column "rising" at raw 0.05 | Null `Yes` rate | Real `Yes` rate | Null / real |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | n/a |
| 2-4 | 0 | 0 | 0.005% | 0 |
| 5-9 | 0.0009% | 0 | 1.18% | 0 |
| 10-49 | 0.54% | 0 | 9.52% | 0 |
| 50+ | 9.7% | 0.0064% | 30.3% | 0.02% |

Sampling noise alone gives almost no false Yes calls, because the background rule and the min over 15 columns work against a false positive. This is a lower bound: it assumes Poisson calibration, and PCR jackpotting and phage bottlenecks add overdispersion. At 50+ reads the min over 15 target columns does inflate a single-column false rise to 9.7%.

Multiple-testing correction on the real data (per column, over all tested clones; BH at 5%, Bonferroni over that column's tests):

| | Clones with at least 1 rising target column | Yes retained |
|---|---|---|
| Raw p <= 0.05 | 11,388 | 7,316 (100%) |
| BH | 3,629 | 3,520 (48.1%) |
| Bonferroni | 1,889 | 1,812 (24.8%) |

So about half of Yes labels fail BH on their best single column, though several libraries can corroborate each other. That is why replicate agreement (section 5) is the better error estimate than the raw p threshold.

## 2. PU framing, class prior and sensitivity (Q2)
Framing: P = Yes clones (labelled positive), U = everything else (Not, non-sig., noise are all "not shown positive"). Three references were opened:
- nnPU, Kiryo, Niu, du Plessis, Sugiyama, arXiv 1703.00593 (v1 2 Mar 2017, NIPS 2017 oral): a non-negative risk estimator that stops the unbiased PU risk going negative, so flexible models do not overfit.
- Elkan and Noto, KDD 2008 (PDF opened; doi 10.1145/1401890.1401920 not independently confirmed from the paper text): under "selected completely at random" (SCAR), p(y=1|x) = p(s=1|x)/c with c = p(s=1|y=1).
- SAR-PU, Bekker, Robberechts, Davis, arXiv 1809.03207 (ECMLPKDD 2019): relaxes SCAR when positives are labelled with selection bias. I read the abstract only; the propensity details are not in what I opened.

SCAR fails here. The chance a true binder is labelled Yes rises with its read count (propensity depends on abundance): replicate-confirmed clones are labelled Yes 82.7% of the time overall, and Yes precision against replicates is 91% at 200+ reads. SAR-PU (propensity as a function of reads or cluster size) is the right model; I did not run it.

**Prior estimates (the number depends entirely on the definition):**

| Definition | pi |
|---|---|
| Yes / all sequences | 0.40% |
| Any raw-significant rising target column / all | 0.62% |
| BH-surviving / all | 0.20% |
| Replicate-confirmed (C1 and C2 enriched in the same mother) / all | 0.24% (4,384) |
| Yes / labelled (Yes + Not) | 37.8% |
| Yes among clones with total reads >= 10 | 13.9% |
| Yes among clones with total reads >= 50 | 30.3% |
| Storey pi1 from one HER2 column among clones with a+b >= 10 (>= 30) | 0.92-0.95 (0.96-0.99) |
| EB mixture fits, per column | degenerate (pi0 near 0 for 1st-phase libraries) |

Storey and the EB mixture are conditioned on presence in the libraries, and presence in a sublibrary is itself caused by enrichment, so they do not estimate a library prior. Elkan-Noto c-hat from a P-vs-U classifier on ESM embeddings was 0.15 to 0.38, but it depends on my P:U sampling ratio and is not a library-wide c. Honest summary: the library-wide prior of "enriched" clones is 0.2 to 0.6%, the detectable-clone prior is 14 to 30%, and the real binder prior is unidentifiable from this design.

**Sensitivity to a wrong prior** (nnPU, MLP on ESM2 8M embeddings, P = train Yes, U = 30k random non-labelled clones, held-out clusters, raw-label test with 37.8% prevalence):

| pi used | AUROC (93% cluster split) | PR-AUC | AUROC (strict family split) |
|---|---|---|---|
| 0.01 | 0.574 | 0.436 | 0.579 |
| 0.10 | 0.697 | 0.661 | 0.607 |
| 0.30 | 0.823 | 0.805 | 0.701 |

Moving pi by 10x moves AUROC by 0.12 to 0.25, and no value reaches the raw-label baseline (0.92 to 0.95). The metric is therefore very sensitive to the prior, in the direction of "the more positives you admit among U, the better the ranking of Yes vs Not".

## 3. Enrichment denoising: which estimator (Q3)
**Enrich2** (Rubin et al. 2017, doi 10.1186/s13059-017-1272-5; I read the README and `enrich2/selection.py`, not the paper full text). For two time points it uses the "ratios" method: log(c + 0.5) minus library log size, selected minus input, with variance = sum of 1/(c + 0.5) terms. WLS and OLS need three or more time points. A single-round design therefore only gets the ratio score with a +0.5 pseudocount, which is mild shrinkage, with no prior over clones and no pooling across libraries.

**Estimators compared** (clone-level log2 enrichment, HER2 libraries pooled per mother; ashr, apeglm and DESeq2 lfcShrink were NOT run, I did not use R. The EB estimator below is a normal-prior method-of-moments shrinker, a crude stand-in):

I used a replicate design with real held-out independence: rank on HER2 replicate C1 against half of the mother reads (binomial thinning), test on replicate C2 against the other half, both directions, mothers B and C, averaged over the four runs. The top 1000 by each estimator are scored on the held-out replicate (z-test at IE <= -1.3):

| Estimator | Top-1000 enriched in held-out replicate | Mean held-out log2 ratio | Median reads in top-1000 | Share with mother = 0 | Spearman vs held-out (a+b >= 5) |
|---|---|---|---|---|---|
| Raw log ratio (mother 0 = infinity, ties by reads) | 49.0% | 1.73 | 16 | 100% | 0.658 |
| Enrich2 ratios (+0.5) | 79.4% | 3.73 | 49 | 69% | 0.786 |
| Gamma-Poisson posterior mean (Jeffreys) | 67.5% | 3.37 | 28 | 88% | 0.753 |
| EB normal shrinkage | 88.5% | 3.89 | 69 | 47% | 0.799 |
| Beta posterior P(share above null) | 89.5% | 3.87 | 73 | 44% | 0.799 |
| Beta 5% lower credible bound | 86.1% | 3.86 | 66 | 56% | 0.797 |

**Impact on rank.** Of the raw top 1000 (mother B to C direction), only 379 (Enrich2), 287 (EB), 420 (gamma-Poisson), 206 (beta posterior), 337 (beta lower bound) remain in each shrunk top 1000. In the other direction the counts are 434, 379, 439, 332, 428. So shrinkage replaces 56 to 79% of the top 1000. The raw top 1000 are all clones absent from the mother, with median 6 to 16 reads.

Answer: the beta-binomial posterior (and the EB normal) handle low counts and the single round best. Raw ratios are unusable at low counts. Enrich2 ratios sit between.

Failed design, reported because it is a finding: using mother B and mother C as pseudo-replicates fails. They are largely different clone sets (see section 5). Cross-mother testing gave raw 31 to 40% against shrunk estimators 3 to 6%, an artefact of whether the clone exists in the other library, not of estimator quality.

## 4. Bias check (Q4)
Literature opened:
- Matochko, Li, Tang, Derda, Nucleic Acids Res 42(3):1784-1798 (2014), "Prospective identification of parasitic sequences in phage display screens" (PMC3919620): amplification in bacteria lifts a tiny fraction (under 0.01% of diversity) of fast-growing "parasitic" sequences. Abundance rose from about 1e-7 % in the theoretical library to over 0.01% (five orders of magnitude) and about 1% after further amplification. 197 parasites were found in the literature. Example GKPMPPM: 5,548 to 60,099 copies. Emulsion amplification of ~10^6-clone subsets avoids it.
- Plessers, Van Deuren, Lavigne, Robben, Int J Mol Sci 22(11):5513 (2021), doi 10.3390/ijms22115513 (PMC8197208): in one library canonical clones fell from about 68% to 6% over four rounds as indel variants (loss of display) took over, INS25 went from 1.06% to 28.49%, and the authors say amplification bias was "stronger than affinity-based target selection". In a second library the effect reversed (77% to 86% canonical), so it is library-dependent.
- A search for hydrophobic-CDR3 stickiness and display or expression bias in NGS nanobody panning returned nothing direct. That mechanism is untested here and the claim is unverified.

**Measured in this data:**

| Check | Result |
|---|---|
| Yes clones with zero reads in all three mothers | 59.1% (all sequences: 85.3%) |
| Yes clones with mother total <= 2 | 78.6% |
| Yes clones whose strongest target column has mother count 0 | 66.8% |
| AUROC of Yes vs Not from `Cluster_size` alone | 0.839 |
| AUROC from total reads alone | 0.611 |
| AUROC from CDR3 length alone | 0.539 |
| Yes vs Not purity within multi-member clusters | 97.6% |
| Yes clones also rising in the 1st-phase HER2 library | 8.2% |
| Yes clones with zero reads in all four 2nd-phase HER2 libraries | 3.2% |

Reading: enrichment evidence leans on an undersampled mother (a clone absent from the mother but present in a sublibrary gets an enormous z). Cluster size, i.e. an expanded lineage, predicts Yes on its own at 0.84. A negative-control library catches only artefacts the controls share (NC1, NC2, NC3, Comparator), not display or propagation advantage. PCR jackpotting and codon usage were not measured.

## 5. Label stability with pseudo-replicates (Q5)
Mothers B and C are not two readouts of the same clones. Only 132 of 7,316 Yes clones (1.8%) appear in both 2nd-phase mothers. The proper replicate within a mother is HER2 sublibrary C1 vs C2 (independent pannings, shared mother).

| Comparison (Yes clones, n = 7,316) | Called in both | Jaccard | Recall of other | Kappa |
|---|---|---|---|---|
| C1 vs C2 in mother B | 1,991 | 0.56 | 0.68 / 0.76 | 0.55 |
| C1 vs C2 in mother C | 1,686 | 0.56 | 0.73 / 0.71 | 0.59 |
| Mother B call vs mother C call | 95 | 0.015 | 0.03 | n/a (disjoint clones) |
| Mother B vs C, only the 132 Yes present in both | 52 | 0.43 | 0.63 / 0.58 | -0.13 |

Precision and recall of the label against replicate confirmation (confirmed = enriched in both C1 and C2 of the same mother, 4,384 clones in the library): precision of Yes = 3,624 / 7,316 = 49.5%, recall = 82.7%. Precision rises with depth: 54.0% at 10+ reads, 80.6% at 50+, 91.3% at 200+. 4,215 of the 7,316 Yes have under 50 reads. Agreement is under 60%, so per-clone supervision from these labels is weak, and residue-level supervision derived from them is weaker still. Not-labelled clones never reach replicate confirmation (0 of 12,051), so Not is consistent but says "depleted", not "non-binder".

## 6. Falsifiable experiment: does denoising help? (Q6)
Setup (CPU, 5 to 6 min per run): 19,367 labelled clones; features = 3-mer counts (8,000 dims, L2-normalised) for logistic regression and ESM2 t6 8M mean-pooled embeddings (320-d, transformers 5.20.1) for LightGBM and a small MLP. Variants: raw label; soft label (my denoiser: per-column empirical-Bayes mixture posterior of enrichment, second-best HER2 column so two libraries must agree, times one minus the strongest negative-control posterior; Yes median 0.66, Not median 0.35); Elkan-Noto weighting (GBM); nnPU (MLP, 30k unlabelled clones). Cluster bootstrap B = 200, 95% CI. Evaluation labels are raw `Yes`/`Not`. A "gold" subset (replicate-confirmed Yes; Not with 10+ reads; 13,334 clones, 3,624 positive) reports the same pattern.

Two splits, because the first is leaky. The 93% USEARCH cluster split leaves related lineages across train and test; the strict split holds out 5 folds of a KMeans-40 partition of embedding space.

| Variant | Split | AUROC (95% CI) | PR-AUC (95% CI) | dPR-AUC vs raw (95% CI) |
|---|---|---|---|---|
| LR 3-mer raw | 93% cluster | 0.945 (0.933-0.954) | 0.938 (0.923-0.949) | baseline |
| LR 3-mer soft | 93% cluster | 0.935 (0.920-0.945) | 0.928 (0.911-0.943) | -0.010 (-0.016 to -0.004) |
| GBM ESM raw | 93% cluster | 0.921 (0.909-0.931) | 0.904 (0.885-0.923) | baseline |
| GBM ESM soft | 93% cluster | 0.908 (0.896-0.921) | 0.891 (0.867-0.911) | -0.013 (-0.018 to -0.008) |
| GBM ESM Elkan-Noto | 93% cluster | 0.898 (0.884-0.911) | 0.876 (0.851-0.898) | -0.028 (-0.037 to -0.022) |
| MLP ESM nnPU, pi = 0.3 (best) | 93% cluster | 0.823 (0.799-0.844) | 0.805 (0.772-0.837) | -0.101 (-0.122 to -0.084) |
| LR 3-mer raw | strict family | 0.855 (0.815-0.890) | 0.828 (0.763-0.887) | baseline |
| LR 3-mer soft | strict family | 0.795 (0.709-0.864) | 0.769 (0.669-0.848) | -0.059 (-0.111 to -0.020) |
| GBM ESM raw | strict family | 0.804 (0.761-0.844) | 0.725 (0.644-0.811) | baseline |
| GBM ESM soft | strict family | 0.758 (0.706-0.813) | 0.677 (0.587-0.773) | -0.048 (-0.084 to -0.023) |
| GBM ESM Elkan-Noto | strict family | 0.740 (0.690-0.789) | 0.629 (0.558-0.714) | -0.094 (-0.122 to -0.066) |
| MLP ESM nnPU, pi = 0.3 | strict family | 0.701 (0.649-0.763) | 0.581 (0.490-0.704) | -0.141 (-0.170 to -0.097) |

All 23 rows (including the nnPU prior grid) are in the sibling `.json`.

**Verdict: FALSIFIED.** No denoised or PU variant beat raw labels, and every difference is outside the bootstrap CI in the wrong direction, on both splits and on the gold subset. The same-pipeline-label evaluation favours raw training, and my soft label is one construction among many, so this kills "this soft label or nnPU helps on this task", not "any denoising could help". The more important finding: 3-mer AUROC drops from 0.945 to 0.855 under a strict split, and cluster size alone gives 0.84, so Yes vs Not is largely family identity.

## Forced analogy: Music information retrieval, noisy-onset lens
**(a) Statement.** A global binder tag is like a whole-track tag that may be wrong. Fingerprinting (Wang 2003, "An industrial-strength audio search algorithm"; I read only a search-result summary of it, not the PDF) keeps sparse spectrogram peaks (a constellation map), hashes anchor-target peak pairs, and scores a match by the histogram of time offsets, so true matches share one offset and false ones scatter. The mapping: peak = per-position residue enrichment, time offset = sequence offset between enriched and depleted clones.

**(b) Test run.** I aligned 14,927 labelled clones by anchors (N-terminal block numbered from the start, CDR3 numbered from the YYC anchor, tail numbered from WGQG), computed per-position Jensen-Shannon divergence between Yes and Not residue distributions, subtracted a label-permutation null, and took local maxima as the constellation. Plain JSD correlated 0.94 across cluster halves but its shuffled-label null correlated 0.85, so raw JSD is mostly position variability, which is why I used the excess over the null.

| Label used | Split-half Spearman of excess profile | Top-12 peak Jaccard across halves | Peaks inside CDR columns |
|---|---|---|---|
| Raw Yes vs Not | 0.92 +/- 0.01 | 0.57 +/- 0.06 | 75% |
| Soft (denoised) | 0.90 +/- 0.02 | 0.48 +/- 0.07 | 74% |
| Replicate-confirmed vs Not (10+ reads) | 0.90 +/- 0.01 | 0.61 +/- 0.11 | 79% |

CDR columns are 39% of all columns (CDR1 and CDR2 are approximate sequential positions). Peaks recur at columns 28, 48, 60, 106 to 124 (CDR3 interior and tail).

**(c) Verdict: partially holds.** A positional signal exists and replicates: peaks are 1.9 to 2.0 times enriched in CDR columns relative to column share. Denoising the global label first did not sharpen it (soft Jaccard 0.48 vs 0.57 raw; replicate-confirmed 0.61 is inside one SD of raw). The analogy breaks in three places: alignment here is trivial (conserved framework), so the "local alignment recovers timing" step has nothing to recover; the peaks mostly reflect CDR3 length (Yes median CDR3 length 16 vs Not 14, tail columns only exist for long CDR3s); and a CDR peak is not an epitope. The Shazam pair-hash and offset-histogram step was not run, and no PR-AUC against any structure was measured, so this does not show a gain for Track A residue-level PR-AUC.

## Gotchas / what could fool us
1. The BRIEF's "a few hundred labels" is wrong: 19,367. "One panning round, 10^5 reads" is also wrong: 29 libraries, 44k to 409k reads each, two panning phases.
2. A 93% cluster split is not a family split. Held-out AUROC fell 0.945 to 0.855 when I held out embedding regions, and cluster size alone predicts Yes at 0.84.
3. Yes depends on an undersampled mother: 59% of Yes have zero mother reads. z-test p-values treat that as strong evidence.
4. SCAR is false (labelling propensity grows with reads), so Elkan-Noto c and nnPU priors are not interpretable.
5. Storey pi0 and mixture fits on clones that appear in the libraries are conditioned on the outcome and overstate the prior.
6. `Not` is "depleted or flat everywhere", not "does not bind", and compositional effects push shares down.
7. B and C mothers are different clone sets, so they are not pseudo-replicates; testing across them gives an artefact in the other direction.
8. IE clipping at -500 destroys ordering among the strongest clones.
9. Evaluating a denoised model against raw labels, or against a gold set from the same counts, is circular. This worker's soft label and gold subset use the same count table.
10. The gated licence forbids redistribution and rebuilding hidden labels. Only aggregates are written; nothing in this file reconstructs ONU11/13/23 truth.

## Implications for the challenge
1. Do not expect label denoising or nnPU to improve a sequence model; I measured a loss of 1 to 14 PR-AUC points. Spend effort elsewhere.
2. Never validate on 93% clusters. Use embedding-region or CDR3-family splits, or the cluster-size effect will be mistaken for learning.
3. If you want a cleaner label subset, use "enriched in C1 and C2 of the same mother" with at least 50 reads (80.6% precision against replicates) or 200+ reads (91.3%).
4. For any enrichment feature, replace raw log ratios with a beta-binomial posterior or EB shrinkage: replicate recovery of the top 1000 goes from 49% to about 89%.
5. Treat `Cluster_size` and cluster identity as a feature and a confound, not as evidence of binding.
6. A positional prior over CDR columns is cheap (75% of peaks inside CDRs) but is a CDR location prior, not an epitope signal. It is the only part of the analogy worth keeping.
7. Correct the BRIEF and the dashboard: 19,367 labelled clones, 29 libraries, and the real label rule (negative-control gating).
8. Cheap next tests: SAR-PU with propensity = f(reads, cluster size); the pair-hash offset histogram between enriched and depleted CDR3s; the trastuzumab/pertuzumab competition columns as the only epitope-adjacent signal, restricted to mother B.

## Open questions
- Does any denoised label help a task closer to the metric, such as ranking CDR residues against known complexes? Not tested.
- ashr, apeglm and DESeq2 lfcShrink were not run; would a proper unimodal mixture change the ranking?
- What fraction of Yes is display or propagation bias rather than HER2 binding? Needs the unselected-amplified-library control, not in the files.
- Do the 3-mer signals survive a CDR3-only, family-level split with a proper MSA?
- Is the doi 10.1145/1401890.1401920 correct for Elkan-Noto? The paper text I opened did not show it.

## Sources
Opened and read:
- https://arxiv.org/abs/1703.00593 (nnPU)
- https://arxiv.org/abs/1809.03207 (SAR-PU, abstract)
- https://cseweb.ucsd.edu/~elkan/posonly.pdf (Elkan and Noto, lemma 1 and SCAR text)
- https://github.com/FowlerLab/Enrich2 (README) and `enrich2/selection.py` at https://raw.githubusercontent.com/FowlerLab/Enrich2/master/enrich2/selection.py; paper doi:10.1186/s13059-017-1272-5 (link from README, full text not opened)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3919620/ (Matochko 2014)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8197208/ (Plessers 2021)
- https://www.princeton.edu/~cuff/ele201/files/Wang03-shazam.pdf (listed in a search result; only the search summary was read, not the PDF)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (README and the two CSVs, gated, user's access)
- Sibling note research/q3_assay_ngs_ground_truth/avida_hher2_and_avida_family_dataset_anatomy_columns_sizes_label_logic.md
- Searches with no usable hit: AVIDa-hHER2 paper (none found), hydrophobic CDR3 / polyreactivity in NGS nanobody panning.
Local scripts and outputs: C:\Temp\sepiq26\q7run (q1.py, q1b.py, q3b.py, q5.py, q2.py, exp.py, exp2.py, pos2.py; q1.json, q1b.json, q3b.json, q5.json, exp.json, exp_strict.json, pos.json).
