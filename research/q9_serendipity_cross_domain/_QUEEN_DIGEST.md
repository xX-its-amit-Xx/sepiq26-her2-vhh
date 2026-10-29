---
queen: q9_serendipity_cross_domain
king: king_infer
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- Every cross-domain lens (CASP history, cryptanalysis, ecology, translation alignment, other blind challenges) returned "partly holds"; none gave a method that beats a plain paratope/accessibility prior.
- The shared break: AVIDa-hHER2 has one antigen and one enrichment round, so reads say nothing per HER2 residue. They can only inform the VHH side (CDRs). Antigen-side weights must come from public HER2 complexes.
- n=3 is mostly a lottery: simulated macro PR-AUC SD is about 0.024-0.06 (true AUC 0.7). Unrelated submissions need a gap of about 0.07-0.16 to separate; correlated variants about 0.03.
- Unknown prevalence does not affect a rank-based per-complex PR-AUC. It does matter for pooled chains and for calibration.
- Best positive idea: a nanobody-language-model paratope head trained on SAbDab-nano (literature PR-AUC about 0.65-0.70, unverified), plus a decibans-style additive formula for 0-1 outputs.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. CASP jumps came mainly from changing what the model was fed or asked to predict: coevolution contacts (CASP12 best L/5 precision 47%), distograms (CASP13 above 70%), then end-to-end MSA+pair training (CASP14 median GDT_TS 92.4). Verified for CASP12, CASP14 numbers; CASP13 via search summaries. casp_history file, 10 sources. Medium.
2. A pseudo-MSA built from real AVIDa-hHER2 binders flags CDRs only and yields identical profiles for ONU11 and ONU13. casp_history file (own computation). Medium-high.
3. Enrichment carries no per-HER2-residue contrast; a decibans additive recipe W = 10 log10(enriched/background frequency) per VHH position is valid only under clone independence (clonal families violate it). Not run on the 1.8M-row table. cryptanalysis file, 13 sources. Medium.
4. With n=3, a macro PR-AUC of about 0.07 or more is needed to reject chance for the antigen chain. cryptanalysis file. Medium (simulation).
5. MaxEnt = Poisson process = infinitely weighted logistic = PU learning; intercept (prevalence) is not identifiable from presence-only data (Fithian and Hastie 2013, opened). Ecology file, 19 sources (9 abstract/snippet only). Medium-high.
6. HER2 epitope prior is probably about 0.03-0.04, not 0.126; macro-3 AP SD 0.02-0.05 by simulation. No SAbDab-nano epitope-fraction distribution found. Ecology file. Medium-low.
7. Unsupervised alignment (IBM models, Lample 2018, coevolution DCA) needs two populations with approximate isomorphism and thousands of paired sequences; we have one HER2 sequence against 1e5-1e6 VHH. Linguistics file, 13 sources (4 opened). Medium.
8. Winning edges elsewhere: Netflix (new temporal features plus blend, margin 0.00001 RMSE, tie broken by 20 minutes), Merck (multitask net+ensembling on fixed inputs), DREAM synergy (prior-knowledge features; 167/370 held-out items). Roelofs 2019: little overfitting across 120 Kaggle competitions, tiny test sets are outliers. Blind-challenge file, 16 sources. Medium-high. Correction: "Meyer 2019" is Menden 2019.

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- CASP/MSA to enrichment: partly alive. Works as a CDR variability map; dies for the interface because there is no cross-partner co-variation.
- Cryptanalysis (known-plaintext, cribs, decibans): partly alive. Gives an additive, calibrated recipe and a null spread; the "no self-encryption" hard exclusion has no protein analogue.
- Ecology (presence-only SDM): statistics map cleanly onto PU learning and clarify what prevalence does and does not do; covariates and sampling process do not transfer.
- Translation alignment: dud for the premise (single antigen), kept for the practical lesson (paratope LM head).
- Blind-challenge wins: partly alive. "Representation not model size" survives only in restricted form; AlphaFold2 is the counterexample (end-to-end model).

## Contradictions within my subdomain
- Antigen-side signal: ecology and cryptanalysis workers both place the antigen prior at public structures, whereas the CASP worker hoped reads could supply it; reads cannot.
- Detectable gap: 0.07 (antigen-scale scoring) vs 0.15 (VHH-scale scoring) depends on whether the 600-residue antigen or 120-residue VHH dominates the metric; unresolved.
- Prevalence: 0.126 (brief) vs 0.03-0.04 (ecology estimate) for HER2.

## Gotchas for the modeler (what could silently fool us)
- Clonal families violate additive independence of evidence; cluster before summing.
- Pooling chains A+B per complex can reduce a paratope-only prior from about 0.64 to about 0.34; calibration across chains matters only when pooled.
- Rounding or ties in the 0-1 column can cost AP; leaderboard differences under about 0.07 are noise.
- Several numbers (CASP/CAPRI/Neff, SDM sources, linguistics PR-AUC) are unverified: Nature, Wiley, tandfonline blocked; many sources were snippets only.
- Random splits inflate epitope metrics; validate by clone/epitope group.

## Questions for other queens (name the queen)
- q3_assay_ngs_ground_truth: does CDR conservation among enriched clones give a usable paratope weight per ONU clone?
- q4_challenge_intelligence: are chains A and B pooled per complex, and is the score average_precision or trapezoid?
- q6_epitope_ml_methods: which public nanobody paratope LM gives PR-AUC on SAbDab-nano clusters, and is it licensed for use?
- q8_compute_validation_execution: can the 4 proxy complexes plus a correlated-variant design meet the 0.03 gap?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- Other fields solved similar guessing games by adding new kinds of information, not just bigger models.
- Our data show many keys for one lock, so they can describe the keys well but say little about the lock.
- With only three test cases, small score differences between teams are mostly luck.

## Gaps I could not fill
- No rescue run: all five workers delivered sourced files. Unverified: CASP13/CAPRI/Neff numbers, Hastie-Fithian 2013 reply, Ward 2009 abstract, linguistics PR-AUC figures.
- Not done: SAbDab-nano recount, enrichment-table run of the decibans formula, ONU sequence checks, SAbDab-nano epitope-fraction distribution.
- Law, art, music, sports, healthcare lenses were not assigned to q9 workers (covered by other kings' channel notes).
