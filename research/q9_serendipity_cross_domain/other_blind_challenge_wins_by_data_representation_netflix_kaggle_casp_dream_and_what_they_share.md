---
title: "Blind-challenge wins and small-n held-out sets: Netflix, Merck, Higgs, DREAM, CASP, and what n = 3 can say"
queen: q9_serendipity_cross_domain
king: king_infer
worker: other_blind_challenge_wins_by_data_representation_netflix_kaggle_casp_dream_and_what_they_share
tier: expert
tags: [blind-challenges, netflix-prize, merck-qsar, dream, casp, leaderboard-overfitting, pr-auc, power, severe-testing, ensembling]
confidence: medium
challenge_relevance: 4
serendipity: "Philosophy of science (severe testing) plus other blind challenges: the analogy PARTLY holds. The statistics transfer exactly (n = 3 is mostly a lottery on absolute rank), but 'representation beats model size' is only half-supported by the evidence."
date: 2026-10-17
---

# TL;DR

With three held-out complexes, macro PR-AUC is a noisy ruler. My simulation (code outline below) puts the standard deviation of a macro PR-AUC at about 0.055-0.06 for a model with true AUC 0.7 if scoring is on ~120-residue VHH chains, and about 0.024-0.027 if the 600-residue antigen dominates. Two *independent* submissions then need a gap of roughly 0.15 (VHH-scale) or 0.07 (antigen-scale) to be distinguishable at 95%; two *correlated* variants (score correlation 0.8) need about 0.03. The best-documented wins elsewhere (Netflix, Merck QSAR, DREAM synergy) came from adding information to the input plus sharing across tasks plus blending, but "representation beats model size" is mixed (AlphaFold2 is the strong counterexample). Treat the five submissions as a diversified hedge, not five tunings of one idea.

# 1. Challenge table

Test-set sizes are given only where I opened a source; "unverified" means I did not open a primary source that states it.

| Challenge (year) | Winner / top | Margin over runner-up | Held-out items | Winning edge | Source opened |
|---|---|---|---|---|---|
| Netflix Prize (2009) | BellKor's Pragmatic Chaos; test RMSE 0.856704 (quiz 0.8554) | 0.000010 RMSE vs The Ensemble (0.856714); a tie at the 4-decimal rule, won by submitting 20 min earlier | Quiz 1,408,342 + Test 1,408,789 user-movie pairs | Both: new data features (temporal dynamics, baselines, neighborhood + RBM) and a blend of hundreds of predictors | Koren 2009 (PDF text read); arXiv:1207.5649 (text extracted) |
| Merck Molecular Activity (Kaggle 2012) | Dahl, Jaitly, Jordan-Squire, Salakhutdinov | Margin to runner-up unverified. ~15% relative gain over Merck's internal baseline (Dahl 2014); another source says "nearly 17%" | 15 assays (pmlive summary); per-assay test counts unverified | Multitask deep net + dropout + ensembling on fixed Dragon descriptors (same inputs for all teams): architecture/loss/ensembling, not new inputs | Dahl et al. 2014 arXiv:1406.1231 (PDF text extracted) |
| Higgs ML (Kaggle 2014) | Gabor Melis, AMS ~3.81 | 2nd Tim Salimans, 3rd Pierre Courtiol ("followed closely"); HEP award Crowwork 3.72 | 1,785 teams; 800k events total released; private-test size unverified | Ensembles of standard learners; details of edge unverified | ATLAS news page; PMLR v42 abstract |
| DREAM AZ drug synergy (2019) | Yuanfang Guan, first in SC1A, SC1B, SC2 | SC2 advantage Bayes factor > 5; 2nd-place score not in the text I read | SC1: 167 combinations; SC2: 370; 160 teams submitted, 78 final | Prior-knowledge features (drug target, pathways) | Menden et al. 2019 (PMC6572829; first 100k chars) |
| NCI-DREAM drug sensitivity (2014) | Bayesian multitask MKL | not read | 44 methods; cell-line count unverified | Nonlinear models + pathway information; expression best single data type | Costello et al. 2014 (abstract-level only) |
| CASP14 (2020) | AlphaFold2 | Summed z-score 244.0 vs 90.8 for next group (BAKER) | 92 domains (96 targets) | End-to-end architecture + MSA representation, both | Jumper 2021 summaries via search |
| CAPRI (2001-) | per-round | Ranked by number of targets with >= 1 correct model | 59 rounds, >300 targets; only 16 in rounds 47-55 (2020-24) | Sampling + scoring | Lensink/Wodak material via search |
| CAGI (2010-) | per-challenge | n/a | 50 challenges over 5 editions; per-challenge n unverified | Conservation + supervised features | Jain et al. 2024 (abstract via search) |
| CAFA3 (2019), Kaggle Otto (2015) | not researched | - | unverified | - | do not cite numbers |

Correction to the brief: "Meyer et al. 2019 on crowd wisdom" does not match anything I could verify. The DREAM synergy paper with the 160-team and ensemble results is **Menden et al. 2019** (Nat Commun 10:2674, doi 10.1038/s41467-019-09799-2). The classic crowd-wisdom paper is Marbach et al. 2012 (Nat Methods), not opened here.

# 2. Held-out set sizes and what overfits

- Netflix: 1.41M test items. The 1e-5 RMSE margin is decided by the 4-decimal rule and a timestamp. Test scores were never disclosed during the contest, which prevented quiz-set gaming (Koren 2009).
- DREAM synergy: 167 and 370 held-out combinations, about 4 orders of magnitude below Netflix; the paper needed bootstrapped Bayes factors to separate first place.
- Roelofs et al. 2019 (NeurIPS 32:9179-9189): 120 Kaggle competitions (34 accuracy, 40 AUC, 17 MAP@K, 15 log loss, 14 multiclass loss). "Little evidence of substantial overfitting"; effect sizes typically below 1% accuracy; public-private differences symmetric about zero within about +/-2%. They suggest at least 10,000 test examples as a reasonable minimum and note outliers with tiny test sets (public 90; private 209 and 100). They explicitly **did not analyze rank shuffling** because ranks shake up from noise alone. So I have no verified public-vs-private rank-shuffle figure and will not give one.
- Blum & Hardt 2015 (The Ladder, arXiv:1502.04585): adaptive leaderboard access can be exploited; the Ladder releases a new best score only when it improves by a step, with leaderboard-accuracy guarantees. No numbers in the abstract.
- Dwork et al. 2015 (Science 349:636, doi 10.1126/science.aaa9375): Thresholdout reusable holdout. Summaries only; full text not opened.
- Recht et al. 2019 (ICML, arXiv:1902.10811): fresh test sets gave accuracy drops of 3-15% (CIFAR-10) and 11-14% (ImageNet), attributed to distribution shift, not adaptive overfitting.

Reading: adaptive overfitting is small; sampling noise and distribution shift are large. SEPIQ has 5 submissions and results on 2026-12-15, so adaptive leaderboard overfitting is moot; shift from training clones to ONU11/13/23 is the real risk.

# 3. Sampling noise of macro PR-AUC over three complexes

Setup: residues independent; binormal scores with true AUC 0.5 or 0.7; prevalence 0.10 or 0.13; 1,500-2,000 Monte Carlo repeats; PR-AUC = average precision (sklearn). The brief does not say whether chains A and B are pooled per complex, so I show VHH-only (120/120/130), antigen-only (600) and pooled (720). Code: `C:\Temp\sepiq26\q9\sim.py`.

| Scenario | True AUC | Prevalence | Single-complex mean / SD | Macro-3 mean / SD | 95% MDD, two independent submissions |
|---|---|---|---|---|---|
| VHH 120 x3 | 0.5 | 0.10 | 0.134 / 0.056 | 0.133 / 0.032 | 0.088 |
| VHH 120 x3 | 0.7 | 0.10 | 0.271 / 0.106 | 0.272 / 0.061 | 0.169 |
| VHH 120 x3 | 0.7 | 0.13 | 0.314 / 0.101 | 0.314 / 0.057 | 0.159 |
| Antigen 600 x3 | 0.7 | 0.10 | 0.234 / 0.046 | 0.234 / 0.027 | 0.074 |
| Antigen 600 x3 | 0.7 | 0.13 | 0.282 / 0.045 | 0.282 / 0.026 | 0.072 |
| Pooled 720 x3 | 0.7 | 0.10 | 0.232 / 0.042 | 0.231 / 0.024 | 0.067 |
| Pooled 720 x3 | 0.7 | 0.13 | 0.281 / 0.041 | 0.280 / 0.024 | 0.067 |

MDD = 1.96 x sqrt(2) x SD(macro), treating the submissions as independent.

Paired case (two submissions sharing a latent score component; 720 residues, prevalence 0.115, AUC 0.7, 2,000 repeats):

| Score correlation | SD of macro difference | 95% MDD | 80%-power MDD |
|---|---|---|---|
| 0 | 0.031 | 0.061 | 0.087 |
| 0.5 | 0.024 | 0.047 | 0.067 |
| 0.8 | 0.016 | 0.031 | 0.045 |
| 0.95 | 0.009 | 0.017 | 0.024 |

Code outline:

```python
d = sqrt(2)*norm.ppf(auc)                       # binormal separation
for rep in range(R):
    for c in range(3):
        k = max(1, binomial(n, prev)); y = r_[ones(k), zeros(n-k)]
        s1 = d*y + sqrt(rho)*z + sqrt(1-rho)*e1  # submission 1
        s2 = d*y + sqrt(rho)*z + sqrt(1-rho)*e2  # submission 2
        diffs_c = AP(y,s1) - AP(y,s2)
    macro_diff[rep] = mean(diffs_c over 3 complexes)
sd = std(macro_diff); MDD95 = 1.96*sd; MDD80 = 2.8*sd
```

Caveats that push real noise up: (i) epitope residues form spatial patches, so the effective n is the number of patches (a handful per complex), not residues; (ii) true skill differs by complex, which cancels in paired comparisons but not in generalisation claims; (iii) prevalence 0.10-0.13 comes from the proxy; epitope fractions on a 600-residue ECD may be lower (unverified), which lowers baseline PR-AUC and raises relative variance; (iv) omitted residues (=0) create ties and PR plateaus. The brief's paired cluster bootstrap over n = 3 complexes has only 10 distinct resamples, so it is meaningful only at residue/patch level.

Conclusion: differences under about 0.03 PR-AUC between related models, or about 0.07-0.16 between unrelated models, are indistinguishable from noise with three complexes.

# 4. Philosophy of science: what three held-out cases can say

Sources actually opened: search summaries of Mayo (Statistical Inference as Severe Testing, and Mayo 1997 on Duhem's problem) and of Button et al. 2013 (Nat Rev Neurosci 14:365-376; about 20% average power across 48 neuroscience meta-analyses per a university summary; the exact "21%" median not confirmed). Popper's text and Ioannidis 2005 (PLoS Med e124) were not retrieved; I use them conceptually only.

Mayo: a claim is severely tested if it passes a test that would probably have found the flaw were it present; she builds on Popper but adds error probabilities and piecemeal testing against Duhem-Quine, where a failed prediction blames the whole bundle (model + data + metric + the Voronota ground-truth definition).

Five rules for n = 3:
1. **Pre-declare failure.** Before 2026-12-15 write down the macro PR-AUC at which the sequence-only hypothesis is abandoned. Without that, the result cannot disconfirm anything.
2. **Report the null reference.** Null is about the prevalence; in the sim a no-skill model scored 0.13-0.16 on VHH chains. A pass must exceed the null by more than one SD (0.03-0.06).
3. **Low power inflates winners (Button).** The top scorer's true skill is likely lower than shown (winner's curse); do not read the ranking as proof of "folding from binding".
4. **Test auxiliary assumptions separately (Duhem-Quine).** Check numbering, label definition and leakage on proxy complexes (8GZ5, SAbDab-nano) so a failure on n = 3 can be assigned to a cause.
5. **Claim at the residue/patch level, not the method level.** Three complexes give hundreds of residues but few independent patches; claim top-k enrichment, never "X beats Y" unless the gap exceeds the MDD in Section 3.

# 5. Diversity in winning blends, and the five-submission plan

Evidence:
- Netflix (Koren 2009): 454 predictors from the BellKor's Pragmatic Chaos team with matching probe/qualifying results; a 75-predictor subset chosen by BigChaos by forward selection; a 24-predictor BellKor set. GBDT stacks gave RMSE 0.8603 (454), 0.8606 (75), 0.8664 (24). Individual predictors quoted in the paper are around 0.887-0.888 (e.g. 0.8870, 0.8881), and the final blend scored 0.8554 on quiz. Cinematch was 0.9514 quiz / 0.9525 test. So blending bought roughly 0.03 RMSE (about 3%) over strong single models. The paper says that in the last 30 days novel individual predictors were "unlikely to make a difference to the blend" and blending was the lower-risk path; it also says over-trained (weaker) components can help in blending. The 2008 BellKor abstract describes a "linear blend of over 100 results" at RMSE 0.8643 (via search). I found no per-model weight table.
- DREAM synergy (Menden 2019): best single team BAC 0.688; Spectral Meta-Learner ensemble 0.693 (modest); random aggregation 0.63 (worse). Aggregation helps only with sensible weighting; diversity alone is not magic.
- Merck: the winners combined multitask nets with ensembling (pmlive summary).

Five-submission hedge (aim for score correlation <= 0.6 between entries so best-of-five is not five draws from one distribution):
1. **Structure consensus**: AF3 / OpenFold3 / Boltz / Chai complex predictions over many seeds; per-residue interface frequency, spatially smoothed. Failure mode: docking error.
2. **Sequence-only weak-label model** trained on AVIDa-hHER2 enrichment labels (the representation hypothesis). Fails if the labels are enrichment artefacts.
3. **Rank-average of 1 and 2**: the expected-best, lowest-regret entry.
4. **Prior-only baseline**: CDR3-centric paratope prior on the VHH, surface-exposure prior on HER2. Low variance; everything must beat it.
5. **High-variance bet**: the most different model available (for example a learned antigen-side hot-spot model that structure methods miss), accepting it may lose badly.
Do not spend entries on hyperparameter variants: at score correlation 0.95 two submissions differ by SD 0.009, which is nothing.

# 6. Shared pattern and counterexamples to "representation, not model size"

Supports the suspicion:
- Netflix: "major breakthroughs in the competition were achieved by uncovering new features underlying the data" (Koren 2009): temporal dynamics and better baselines that every downstream model reuses.
- DREAM synergy: top teams added drug-target and pathway features; drug target was the only feature that improved the NAD baseline when swapped for the drug label (p = 0.012); removing drug label and target cost DMIS 0.17; algorithm class showed little relationship to performance.
- Merck QSAR: shared hidden layers across assays are a representation change with the same descriptors for all teams; in Dahl 2014 the best neural net beat the best baseline significantly on 14 of 19 assays, and multitask nets beat single-task nets significantly on all but two of 11 related assays.

Counterexamples and limits:
- AlphaFold2 at CASP14: z-sum 244.0 vs 90.8; median domain GDT_TS 92.4. An end-to-end architecture over MSAs and templates: model and representation together, not representation instead of model.
- Higgs: I found no evidence either way; reported winners used ensembles of standard learners, with details unverified.
- Merck: part of the edge was loss/architecture (dropout, multitask heads) on fixed inputs.
- Netflix ended with stacking after new features dried up.

Verdict: the suspicion survives in a restricted form. When the data are fixed and heterogeneous, adding information the data already imply (time, drug targets, related assays) beat swapping learners. It does not survive as "bigger models never win".

# Forced analogy: philosophy of science (severe testing)

Analogy: the three complexes are one experiment, a severe test of "binding-derived sequence data carry interface signal" only if the model could plausibly have scored at the null. It **holds** for statistics (n = 3 gives SD 0.03-0.06 on macro PR-AUC; a one-shot test). It **partly holds** for interpretation: Duhem-Quine ambiguity is worse here because ONU11/13/23 may share an epitope region or alpaca lineage, so three complexes may be fewer than three independent trials. It **breaks** against large-n challenges such as Netflix (2.8M items), where margins are decided to 1e-5; our case is the opposite regime.

Testable idea for this challenge: train a per-residue interface model on AVIDa-hHER2 with enrichment labels at the sequence-cluster level, and pre-register one statistic, the top-k precision on VHH CDR residues over the three complexes, against the prevalence baseline (0.10-0.13). Also shuffle labels at the cluster level 1,000 times to get an empirical null SD. If the model does not beat its null by 2 SD on proxy complexes (8GZ5 and SAbDab-nano entries), fall back to entries 1 and 4 for the final five.

# Gotchas / what could fool us

1. Omitted residues (=0) create ties and PR plateaus; a coarse 0/1 prediction is one operating point.
2. The independent-residue simulation understates noise (patches are contiguous).
3. Per-chain vs pooled PR-AUC changes SD about 2x (0.057 vs 0.024); check what the evaluator does.
4. Bootstrap over 3 complexes has 10 distinct resamples.
5. Winner's curse: top scores overstate true skill.
6. Roelofs et al. did not analyze ranks; any "ranks shuffle by x%" claim needs its own source.
7. Netflix hid test scores; SEPIQ likely gives no feedback, so there is nothing to tune on.
8. "Leakage from public data is not an issue": near-identical PDB relatives of ONU11/13/23 would let a retrieval model win by memory, not representation.
9. The 15% vs 17% Merck discrepancy shows gains depend on baseline and metric.

# Implications for the challenge

1. Use the MDD numbers before trusting any internal comparison: differences under about 0.03 between related models are noise.
2. Build the five entries as in Section 5, decorrelated; no hyperparameter variants.
3. Pre-register the failure threshold for the sequence-only hypothesis.
4. Evaluate on proxy complexes with residue/patch-level resampling, not a 3-case bootstrap.
5. Search the PDB for close relatives of the three clones to see whether memory is helping.
6. Always include a prior-only entry as the regret-bounding baseline.

# Open questions

- Is Track A PR-AUC pooled over chains or per chain? (Settles 0.024 vs 0.057.)
- True epitope fractions for ONU11/13/23 on HER2 (sim assumed 0.10-0.13).
- Per-model weights in the BellKor/BigChaos blend and the Higgs private-test size were not retrieved.
- Not opened: Costello 2014 full text, Dwork 2015 full text, Ioannidis 2005, Mayo 2018 book, Otto and CAFA3 numbers.

# Sources

- Koren 2009, The BellKor Solution to the Netflix Grand Prize: https://www.asc.ohio-state.edu/statistics/statgen/joul_aut2009/BellKor.pdf (text extracted)
- Statistical Significance of the Netflix Challenge: https://arxiv.org/pdf/1207.5649 (text extracted)
- Dahl, Jaitly, Salakhutdinov 2014: https://arxiv.org/abs/1406.1231 (PDF text extracted)
- Roelofs et al. 2019: https://papers.nips.cc/paper/9117-a-meta-analysis-of-overfitting-in-machine-learning ; full text via https://object.cloud.sdsc.edu/v1/AUTH_da4962d3368042ac8337e2dfdd3e7bf3/ml-papers-txt/NeurIPS/2019/a_metaanalysis_of_overfitting_in_machine_learning__682ee801.txt
- Blum & Hardt 2015: https://arxiv.org/abs/1502.04585
- Dwork et al. 2015 (search summary only): doi 10.1126/science.aaa9375
- Recht et al. 2019: https://arxiv.org/abs/1902.10811 (search summary)
- Menden et al. 2019: https://pmc.ncbi.nlm.nih.gov/articles/PMC6572829
- Costello et al. 2014: doi 10.1038/nbt.2877 (paywalled; search abstracts only)
- Higgs: https://atlas-public.web.cern.ch/updates/news/machine-learning-wins-higgs-challenge ; https://proceedings.mlr.press/v42/cowa14.html
- CASP14: https://pmc.ncbi.nlm.nih.gov/articles/PMC8726744 (search summary)
- CAGI: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10882881/ (search summary); CAPRI: predictioncenter.org CASP15 Lensink presentation (search summary)
- Button et al. 2013: doi 10.1038/nrn3475 (search summaries)
- Mayo: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6460244/ (book review)
- Simulation: C:\Temp\sepiq26\q9\sim.py (own work)
