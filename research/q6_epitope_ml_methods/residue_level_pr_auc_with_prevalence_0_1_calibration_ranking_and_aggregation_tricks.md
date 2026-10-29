---
title: Residue-level PR-AUC, prevalence, ties, ranking tricks and small-n variance for SEPIQ Track A
queen: q6_epitope_ml_methods
king: king_infer
worker: residue_level_pr_auc_with_prevalence_0_1_calibration_ranking_and_aggregation_tricks
tier: expert
tags: [PR-AUC, average-precision, prevalence, ties, trapezoid, bootstrap, small-n, Voronota-LT, CASP-metric-eras, licences]
confidence: medium
challenge_relevance: 5
serendipity: CASP metric eras / screening base rates - tested which method class a PR-AUC metric favours; paid off hard (the hard-mask vs trapezoid vs pooled-chain ambiguities each change the winner), partially holds because CASP changed metrics across years while SEPIQ has one unresolved metric.
worker_note: all simulations are mine (numpy 2.5.3, scikit-learn 1.9.1, single process, scripts in C:\Temp\sepiq26\q6, not in the research tree); every simulated number depends on stated assumptions.
date: 2026-10-17
---

# Residue-level PR-AUC, prevalence, ties and small-n variance

**TL;DR.** On HER2 the random-guess PR-AUC is about 0.03-0.05 per antigen chain (not 0.126 as on the 8GZ5 proxy), so the baseline's 0.176 on 8GZ5 is only 1.4x its random level, and the same 0.176 on HER2 would be about 4x random. Three complexes give a macro-PR-AUC standard deviation of roughly 0.03-0.05 for a weak predictor, so only a gap of about 0.1 or more is reliably detectable. The largest unresolved risks are not modelling: they are (i) whether chains A and B are pooled, (ii) whether PR-AUC is step-wise average precision or trapezoid, and (iii) whether the 5 submissions are scored best or last.

## 1. Metric as written (read 2026-10-17)

From /guideline (fetched by me; the fetch tool paraphrases and only short quotes are reliable):
- "The macro-average of the individual PR-AUCs of each antigen-VHH complex will be calculated"; residues are "not pooled across all antibodies". Score = 1/3 sum PR-AUC_k.
- Two variants: unweighted, and weighted recall = TP_area/P_area paired with ordinary precision. Weights are non-zero only for interface residues (fact = 1). Thresholds are not fixed ("all valid thresholds").
- Ground truth: Voronota-LT inter-chain contact surfaces aggregated per residue; only antigen-VHH contacts.
- Missing prediction rows: prediction = 0. Chain A = antigen, chain B = VHH.
- Bootstrap (if close): B = 2000; residue indices resampled with replacement; "use the exact same index set Ib across all antibodies and both teams"; 95% percentile CI; empirical two-sided p. The text says "cluster bootstrap" but describes a residue bootstrap, and a shared index set across antibodies of different length is not well defined. Not clarified in the document.
- Ties, number of counted submissions, which of the 5 counts: not stated.
- HF Space: public repo has `app.py` (header-only validation), `vhh_dataset_tutorial.ipynb`, no scorer (file list read via HF tree page; app.py contents confirmed by sibling worker q4 `hf_space_dataset_files...md`). So implementation (average_precision_score vs auc) is UNRESOLVED.

## 2. Prevalence table (estimates, not measured)

Antigen length 630 = HER2 ECD residues 23-652 (BRIEF). Epitope size 15-30 contact residues is the brief's typical VHH range; Voronota-LT with any contact area > 0 tends to yield the upper end. Ground truth depends on the cutoff (see q3 worker). The evaluated antigen length may be shorter if unresolved residues are dropped, which raises p.

| Chain | Positives | Length | Prevalence p | Flag |
|---|---|---|---|---|
| HER2 antigen | 15 | 630 | 0.024 | estimate |
| HER2 antigen | 20 | 630 | 0.032 | estimate |
| HER2 antigen | 25 | 630 | 0.040 | estimate |
| HER2 antigen | 30 | 630 | 0.048 | estimate |
| HER2 antigen | 40 | 630 | 0.064 | estimate, generous contacts |
| VHH (ONU11/13) | 18-25 | 120 | 0.15-0.21 | estimate |
| VHH (ONU23) | 24-30 | 130 | 0.18-0.23 | estimate |
| 8GZ5 RBD (proxy) | 26 | 206 | 0.126 | from BRIEF |
| Pooled A+B | ~25 + ~21 | 750 | ~0.061 | estimate |

So the antigen-only prevalence is 3-4x lower than the 8GZ5 proxy and VHH paratope prevalence is 1.2-1.8x higher. This is a base-rate (screening) problem: PR-AUC values have to be read as lift over p.

## 3. Simulated PR-AUC of trivial baselines (sklearn `average_precision_score`)

Setup (assumptions mine): antigen L = 630, domain boundaries I 23-195 / II 196-319 / III 320-488 / IV 489-607 / juxtamembrane 608-652 approximate; epitope = patch of n residues around a random centre inside a domain drawn from an invented prior (0.30, 0.30, 0.25, 0.12, 0.03), biased to exposed residues; exposure proxy ~ Beta(1.2,1.6). 2000 replicates per cell. Mean (SD):

| Baseline | n=15 (p 0.024) | n=25 (p 0.040) | n=30 (p 0.048) |
|---|---|---|---|
| constant / all tied | 0.024 (0) | 0.040 (0) | 0.048 (0) |
| uniform random scores | 0.033 (0.017) | 0.049 (0.015) | 0.057 (0.015) |
| RSA-only | 0.047 (0.020) | 0.069 (0.020) | 0.079 (0.018) |
| domain prior (ties within domain, prior correct) | 0.058 (0.033) | 0.091 (0.052) | 0.108 (0.061) |
| hard 0/1 mask of the single most likely domain | 0.042 (0.028) | 0.068 (0.045) | 0.082 (0.054) |
| weak true signal (binormal d = 0.74, AUC about 0.70) | 0.089 (0.046) | 0.121 (0.044) | 0.137 (0.042) |

VHH, CDR prior (CDR1 25-33 at 0.5, CDR2 51-58 at 0.4, CDR3 97-110 at 0.75, 3 hallmark FR2 sites 0.12, other 0.03; positions are approximate sequential, assumption; expected paratope 20.7 residues, p = 0.173): PR-AUC 0.644 (SD 0.101) versus random 0.204 and tied 0.173. This is the single biggest "free" number in the challenge.

Pooled chains (chains A and B one PR curve per complex): CDR-prior on VHH plus uninformative antigen scores gives 0.339 per complex, versus 0.049 antigen-only and 0.061 constant. If pooling is what the organisers do, a paratope-only submission would beat a mediocre epitope model by 6x. This is not stated in /guideline and is the first thing to ask the organisers.

Reading the 0.176: the 8GZ5 proxy has p = 0.126, so 0.176 is a 1.4x lift; the "pretrained then fine-tuned" claim is a modest signal. On HER2 antigen-only, 0.176 is a 4-5x lift, comparable to my "weak signal" row at the top end, and well above domain-prior baselines (0.09-0.11). A method needs about 0.12 before it has proven anything beyond a domain prior on the antigen; 0.176 on HER2 would be a respectable result, but 0.176 on the proxy is near-chance for a ranker (unpretrained model reported ~random).

## 4. Average precision versus trapezoid, ties and sparse predictions

- sklearn doc (opened): AP = sum_n (R_n - R_{n-1}) P_n; "not interpolated and is different from computing the area under the precision-recall curve with the trapezoidal rule, which uses linear interpolation and can be too optimistic"; changed in 0.19 from linear interpolation. The page does not describe ties. Davis & Goadrich 2006 (ICML, doi 10.1145/1143844.1143874; summary via search results, PDF not opened) state linear interpolation in PR space is incorrect.
- Saito & Rehmsmeier 2015 (PLoS ONE, doi 10.1371/journal.pone.0118432; page opened): PR baseline = P/(P+N); ROC unchanged by imbalance; "strongly recommend PRC plots" for imbalanced data.
- Tie mechanics in sklearn (verified by simulation): all tied scores are one threshold, so a mask of k residues with TP hits yields AP = r*pi + (1-r)*p, where the second term is the tail of zero-score residues (including omitted rows set to 0) joining at precision p. For L=630, P=25, k=60, TP=10: formula 0.0905, simulated 0.0905; random tie-breaking inside the mask gives 0.126; the r*pi term alone is 0.067.
- Consequence 1: tied predictions are scored below the expected value of any random tie-break. Hence adding tiny noise or any weak secondary ranking inside tied blocks (distance to consensus patch, RSA) is free gain in expectation; it never reduces expected AP unless the secondary ranking is anti-informative.
- Consequence 2 (trapezoid risk): with `auc(recall, precision)` on `precision_recall_curve` output (which prepends the point recall 0, precision 1), I measured on L=630, P=25: constant predictor 0.520 (!), uniform random 0.045, hard top-60 mask 0.265 versus 0.081 under AP, soft ranker (d = 1) 0.161 versus 0.173 under AP. Under trapezoid a predictor that outputs one constant for every residue would score about 0.52, so any sane organiser would notice; but hard masks and ties are rewarded massively. Which implementation is used is unresolved. Weighted variant: with weights the curve is the same construction (weighted recall, ordinary precision), so the same issue applies.
- Calibration: PR-AUC is rank-only within a complex; monotone transforms do nothing. Calibration only matters if scores are mixed across complexes (not done: macro, no pooling) or if you post-hoc combine ensembles.
- Sparse predictions: omitted residues = 0 ties at the bottom; fine for AP (tail at prevalence) but wasteful versus a soft floor.

## 5. Ranking tricks: safe, unsafe, and when hard 0/1 wins

Hard versus soft (binormal simulation, L=630, P=25, mean AP; soft = continuous ranking; hard = top-k mask):

| Signal d | soft AP | hard k=30 | hard k=60 | hard k=120 |
|---|---|---|---|---|
| 0.5 | 0.089 | 0.050 | 0.051 | 0.053 |
| 1.0 | 0.170 | 0.079 | 0.081 | 0.079 |
| 1.5 | 0.320 | 0.149 | 0.140 | 0.118 |
| 2.5 | 0.698 | 0.407 | 0.303 | 0.185 |

Derivation: under step-wise AP a hard mask has AP = r*pi + (1-r)p. Any soft ranking that refines the mask (same top set, any informative or random order within it, same tail) has expected AP at least as large (shown above: 0.126 vs 0.0905). So a 0/1 mask is never better in expectation under AP unless the model's within-mask ordering is anti-informative. A hard mask wins only (a) under trapezoid-style scoring, (b) when the model is wrong about order but right about membership and you want to avoid being penalised by confident wrong order (that protection is already available via ties, which AP scores at the group-end precision), or (c) the evaluation has a threshold-based tie behaviour that favours binary outputs. No published evidence found that top-k binary beats soft probabilities on PR-AUC; I found none and it conflicts with the AP algebra.

| Post-processing | Verdict | Reason |
|---|---|---|
| Rank-normalisation per complex | Safe, no effect | PR-AUC is rank-invariant (ties preserved) |
| Monotone calibration (Platt, isotonic, logit shift) | Safe, no effect | same |
| Smoothing along 3D neighbours | Usually safe; can help | Epitopes are contiguous patches; neighbours' mean raises true positives together; hurts if over-smoothed (lowers the sharpest hits, merges neighbours of buried residues) - tune on public HER2 complexes by leave-one-complex-out |
| Averaging AF3/Boltz/OpenFold3 seeds (mean of contact probability) | Safe, usually helpful | reduces variance of rank; same ties logic |
| Geometric mean versus arithmetic mean | Arithmetic is more robust; geometric is a veto (one model's zero kills the residue, creating ties at 0) | If geometric, add floor epsilon and tiebreak; I did not simulate this |
| Max over models/seeds | Risky | favours the noisiest seed, inflates false positives |
| Rank-averaging across complexes | Irrelevant | no pooling across complexes |
| Hard thresholding / top-k masks | Harmful under AP | creates large tie blocks; the AP tail penalty is shown above |
| Zeroing low-confidence residues (omitting rows) | Harmful | joins the zero-tie tail |
| Clipping to [0,1] with saturation (many values at 1.0) | Harmful | ties at the top; keep float precision |
| Mixing antigen and VHH score scales | Only matters if pooling | see section 3 |

## 6. Ensemble and aggregation across 5 submissions and 3 complexes

- Score cannot be improved by combining submissions unless you change content: each submission is scored independently, and best/last is unspecified. A portfolio argument (sibling q4): commit each of the five submissions to a different patch hypothesis if best-of-5 counts; if last counts, commit all effort to the one most probable.
- Ensembles in other epitope benchmarks: DiscoTope-3.0 is itself an ensemble/stacked-feature predictor; I could not open its paper (bioRxiv returned 429 three times), so numbers below are from a search snippet only and unverified: PR-AUC 0.232 for DiscoTope-3.0 on predicted structures versus 0.177 BepiPred-3.0 on a 24-chain external set; 0.223 versus 0.185 SEMA on solved structures; epitope = heavy atom within 4 A of antibody. Third-party graph attention study snippet: AUC-PR 0.20-0.24 on Epitope3D; MsgaBpred example AUPR 0.1525 on one structure. None is nanobody-specific, none states prevalence in the snippet. So for epitope PR-AUC in published general-antibody sets the field's state of the art is about 0.2-0.25 at prevalence unknown but likely 0.05-0.10; this supports reading 0.176 as "average field level" if on HER2.
- Nanobody-specific residue-level epitope PR-AUC with stated prevalence: none found (negative result). Paratope PR-AUCs from sibling q5 are on different prevalence and labels (ParaAntiProt nanobody PR-AUC 0.665 snippet; Parapred H 0.516 and ParaDeep 0.805 with ~10.4% prevalence, via ParaDeep table as reported by sibling q5); not comparable to Voronota-LT labels.
- Leakage flags in benchmarks: BepiPred-3.0 training set of 582 antibody-antigen complexes (snippet) used by DiscoTope-3.0; sequence-identity-clustered test sets are standard but antibody-antigen complexes of the same antigen (HER2 has dozens in the PDB) can sit on both sides; SEPIQ states public-data leakage is "not an issue as long as the answer is correct", so public HER2-VHH complexes (5MY6, 7QVK, 9MTE, 9MTX from sibling q4) are fair game as proxies and priors.
- Voting: with 3 test complexes, ensembling only changes expected score through variance reduction of within-complex rank; its benefit is roughly the d increase from averaging independent noise (d to d*sqrt(m) for m independent equal models, ceiling given shared errors in co-folding). By the table above, going from d = 1.0 to 1.5 raises macro AP from 0.17 to 0.32, so a modest ensemble gain can be very large - if errors are independent, which AF3/Boltz seed errors are not (sibling q5: seed diversity vs ipTM is weak).

## 7. Small-n statistics

Simulation: binormal score, resampling residues (60 datasets x 200 bootstrap draws) and independent redraws of the dataset (300 each). Mean AP and SD of a single complex:

| L, P | p | d (AUC-ish) | mean AP | SD across datasets | SD residue-bootstrap |
|---|---|---|---|---|---|
| 630, 19 | 0.030 | 0 (random) | 0.039 | 0.015 | 0.018 |
| 630, 19 | 0.030 | 0.5 | 0.075 | 0.034 | 0.038 |
| 630, 19 | 0.030 | 1.0 | 0.142 | 0.061 | 0.061 |
| 630, 19 | 0.030 | 1.5 | 0.273 | 0.088 | 0.092 |
| 630, 25 | 0.040 | 1.0 | 0.171 | 0.053 | 0.066 |
| 630, 31 | 0.049 | 1.0 | 0.197 | 0.054 | 0.060 |
| 630, 25 | 0.040 | 1.5 | 0.331 | 0.087 | 0.089 |
| 130, 26 | 0.200 | 1.0 | 0.486 | 0.090 | 0.087 |

Macro-average over 3 independent complexes divides SD by sqrt(3): for d = 1 antigen-only about 0.03-0.04, for d = 1.5 about 0.05. Residue-level bootstrap SD tracks dataset SD (0.06-0.09 per complex), but is conditional on the particular three epitopes, so it understates the real uncertainty about which patch is correct (see q4: epitope identity dominates, committing to a patch is all-or-nothing).

Paired team differences (3 complexes, antigen-only, shared noise fraction rho = 0.5, P 19-31; 1500 replicates): equal skill d = 1.0 vs 1.0 gives difference SD about 0.04 and P(A wins) = 0.48; d = 1.25 vs 1.0 (macro AP gap 0.064) wins 93.5% of the time; d = 1.5 vs 1.0 (gap 0.146) wins 99.9%; d = 2.0 vs 1.0 (gap 0.337) wins 100%. Detectable gap at about 2 SD of the paired difference: about 0.08-0.10. With rho = 0 the SD rises to 0.048-0.056.

Organisers' test: cluster bootstrap over complexes with B = 2000 and 3 complexes has 27 equally likely resamples; the 2.5th percentile lies at the minimum per-complex difference, so the percentile CI is [min d_k, max d_k] and excludes 0 only when all three complexes agree in sign (derived by sibling q4, `prior_nanobody...md`, I reproduced the 3.7% = 1/27 argument). That is a sign test with 25% false-positive rate under symmetric null. If instead they use a residue-bootstrap with a shared index set Ib, what is resampled across antibodies of unequal length is undefined. Unresolved.

## 8. Forced analogy: CASP's metric-driven eras

(a) Statement: CASP changed the headline score (GDT_TS to lDDT-based and per-target to quality-assessment categories) and each change reordered which methods looked best, because a metric implicitly encodes a class of method. SEPIQ's PR-AUC with a 3-target macro, unresolved pooling and ties is its "metric era". (b) Derivation, testable: a naive metric rewards (1) a diffuse domain prior only if it ranks the right domain first (domain prior 0.09-0.11 vs random 0.05 in my simulation); (2) sharp residue-level calls only when the patch is right (all-or-nothing); (3) under trapezoid and pooled chains, a paratope-only CDR prior is the winner (0.34 vs 0.05). Testable idea: build the "naive winner" panel (constant, random, domain prior, RSA, CDR-position prior, pooled) and score every candidate method on the public HER2 VHH complexes under all four metric variants; promote a method only if it beats the panel under AP-antigen-only, AP-pooled and trapezoid. (c) Verdict: partially holds. It holds for metric-implied method class and for base-rate thinking (lift over p is the real quantity, the screening-statistics reading of 0.176). It breaks because CASP had many targets and category structure whereas SEPIQ has three complexes, so the metric is dominated by variance rather than by systematic method ranking.

## 9. Licences relevant to an entry (opened unless stated)

| Tool | Licence | Usable in entry? |
|---|---|---|
| Voronota / Voronota-LT | MIT (main repo LICENSE, Copyright Kliment Olechnovic 2013-2023); expansion_lt README states no licence of its own | Yes, for a local scorer |
| Boltz (Wohlwend, Corso, Passaro) | MIT (code); weights terms not opened | Yes, code; weights check separately |
| OpenFold3 (aqlaboratory) | Apache 2.0 (code); weights terms not opened | Yes |
| Chai-1 (chai-lab) | Apache 2.0 (LICENSE file as fetched, 2024+; weights terms not opened) | Likely yes, verify weights |
| AlphaFold 3 | code Apache 2.0, weights only from Google under separate terms of use, commercial use via Google Cloud | Academic competition entry likely allowed under terms; verify terms before use |
| DiscoTope-3.0, BepiPred-3.0, SEMA | not verified (README 404 / fetch blocked) | unverified |

## Gotchas / what could fool us

1. The 8GZ5 proxy has p = 0.126; HER2 antigen chain p about 0.03-0.05. 0.176 is not comparable across them; report lift, not value.
2. Pooling of A and B changes the winner; paratope prior alone gives 0.34 pooled (my simulation).
3. Trapezoid PR-AUC gives a constant predictor 0.52; step-wise AP gives 0.04. If trapezoid is used, ties/sparse masks win.
4. sklearn tied AP is lower than expected random-break AP; saturating scores at 1.0 or 0.0 costs points.
5. Voronota-LT cutoff changes positives; 15 vs 40 positives changes p by 2.7x and baseline PR-AUC with it.
6. Missing/unresolved HER2 residues or the "GACQ"+His tag: those rows may not exist in the ground truth; check numbering (P04626 including signal peptide) or you score zero silently.
7. Three complexes: SD 0.03-0.05 on a macro score; sign test CI.
8. Published epitope PR-AUCs (0.15-0.25) come from non-nanobody, different-prevalence, different-cutoff (4 A heavy atom) sets, and BepiPred-3.0 data overlap with DiscoTope-3.0 training is a leakage channel.
9. All simulation priors (domain priors, CDR positions, RSA proxy) are mine and invented; they illustrate mechanisms, not measured HER2 values.

## Implications for the challenge

1. Email or ask the organisers (the Space discussion) three questions: chain pooling; AP versus trapezoid; best-of-5 or last. Until answered, hedge: antigen-only AP-optimal submissions, plus one pooled-optimised and one trapezoid-optimised variant? Only if scoring is best-of-5; otherwise optimise antigen-only AP.
2. Never submit 0/1 masks or saturated values; output continuous scores, add a tiny deterministic tie-breaker (distance to consensus patch, RSA) and floor omitted residues at a small positive value (still lower than any predicted residue).
3. Ship the CDR-position prior for the VHH in every submission (expected PR-AUC about 0.64 vs 0.17-0.20 baseline for paratope; this costs nothing).
4. Use a domain prior and RSA as the floor for the antigen; require any model to beat domain-prior 0.09-0.11 (at p = 0.04) on public HER2 complexes via leave-one-complex-out before trusting it.
5. Use seed/model ensembles with arithmetic mean plus 3D smoothing; tune the smoothing radius on leave-one-complex-out and do not use max or geometric veto.
6. Judge candidates by lift over p and by a sign test over complexes, not by mean PR-AUC; expect the leaderboard to be a lottery for gaps below about 0.1.

## Local scorer: reference implementation plan (description only, nothing written to disk)

1. Obtain Voronota-LT from github.com/kliment-olechnovic/voronota (releases page; prebuilt Cosmopolitan binary or build `expansion_lt` with `g++ -std=c++14 -O3 -fopenmp`, or `cl /Ox /openmp:llvm` on Windows).
2. For each public HER2-VHH PDB/mmCIF: `voronota-lt -i complex.cif --compute-only-inter-chain-contacts --restrict-contacts-for-output "[-a1 [-chain A] -a2 [-chain B]]" --print-contacts-residue-level` (flags from the expansion_lt README as opened; I did not run it). Probe default 1.4 A. Check actual column names by running `--help`.
3. Per residue sum areas on each side to get weight; fact = 1 where area > 0 (organiser cutoff unknown; also compute fact for area thresholds 1, 5, 10 A^2 as sensitivity).
4. Align prediction rows to the ground-truth residues by (chain, seqNum, resName); missing rows are 0.
5. Metrics: unweighted AP via `average_precision_score(fact, prediction)`; weighted variant: sort by score, accumulate TP_area/P_area, precision unweighted, step-wise sum of delta-recall x precision with ties as one threshold; also compute trapezoid, pooled-chain and antigen-only variants side by side.
6. Macro over complexes; paired cluster bootstrap over complexes (27 resamples, B = 2000) and a residue bootstrap for comparison.
7. Run the five-baseline panel and the simulations above as regression tests.

## Open questions

- Is PR-AUC average precision or trapezoid? Pooled or per-chain? Best or last submission? Is the area-weighted variant the ranking metric?
- Real prevalence of ONU11/13/23 after Voronota-LT (unknown until release).
- Real nanobody epitope PR-AUC (with prevalence) for AF3/Boltz/DiscoTope-3 on a clustered nanobody test set: not found.
- DiscoTope-3.0 / BepiPred-3.0 / SEMA licences and exact benchmark tables (bioRxiv blocked with 429).

## Sources

Opened: https://sepiq.uk/guideline (paraphrased fetch); https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/tree/main; https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html; https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432; https://raw.githubusercontent.com/kliment-olechnovic/voronota/master/README.md; https://raw.githubusercontent.com/kliment-olechnovic/voronota/master/expansion_lt/README.md; https://raw.githubusercontent.com/kliment-olechnovic/voronota/master/LICENSE.txt; https://raw.githubusercontent.com/jwohlwend/boltz/main/LICENSE; https://raw.githubusercontent.com/aqlaboratory/openfold-3/main/LICENSE; https://raw.githubusercontent.com/chaidiscovery/chai-lab/main/LICENSE; https://raw.githubusercontent.com/google-deepmind/alphafold3/main/README.md; sibling files under research/q4_challenge_intelligence and research/q5_structure_prediction_docking.
Search results only, not opened: Davis & Goadrich 2006 (doi 10.1145/1143844.1143874, search summaries); DiscoTope-3.0 bioRxiv 10.1101/2023.02.05.527174 and Frontiers/Sci Rep/MsgaBpred snippets (numbers unverified).
