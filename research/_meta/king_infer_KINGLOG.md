# king_infer KINGLOG (tick, 2026-10-17; infer-only run, no queens dispatched)

Basis: only the _QUEEN_DIGEST.md of q5, q6, q7, q8, q9 (plus BRIEF.md, king.md, structure.json). Worker bodies were not read; numbers below are the queens' claims, with the confidence they assigned.

## Verdict per queen
| Queen | New concrete sourced facts | Stagnant? | Judgement |
|---|---|---|---|
| q5 structure/docking | 8 | No | Strongest actionable: multi-seed co-fold contact frequency, leakage-free proxies 9MTX/9MTE. Timings extrapolated. |
| q6 epitope ML | 12 | No | Best calibration of expectations (random null, prevalence, scorer ambiguity). No nanobody-conditioned residue PR-AUC exists. |
| q7 data representation | 10 | No | Real tables run; the breakthrough hypothesis killed four ways. Most valuable negative result. |
| q8 compute/validation | 9 | No | Portal returns no score; power analysis; runbook. Timings extrapolated. |
| q9 serendipity | 8 | No (weakest) | Every lens "partly holds", none yields a method. Useful mainly as nulls and a decibans recipe. |

## Stagnation rule
No queen has fewer than 2 concrete facts or is generic, so no re-dispatch is required. If forced to spend the one allowed re-dispatch (not done, per instruction), the candidate is q9, with a random field of **astronomy** (matched-filter detection of faint periodic signals in noisy sparse data) or **healthcare screening**, instruction: "find what this field knows about ranking a true answer among look-alikes, then bring it back as a testable idea for Track A residue-level PR-AUC (macro over 3 complexes)". q7 could alternatively be pointed at **law/evidence** (corroboration of weak witnesses) but its negative result is already decisive. No other queen needs one.

## (a) What is the label, and how reliable
Two different labels, do not confuse them.
1. **Scoring truth (what we are graded on):** residues in antigen-VHH contact per Voronota-LT contact area on 3.0 A-class cryo-EM structures of ONU11, ONU13, ONU23. Reliability: high as physical truth at ~3 A for backbone and large side chains, but cutoff-dependent (4 A vs 4.5 A atom-contact conventions differ; q5, q6) and the exact scorer is unresolved: chain pooling (a CDR-only prior scores ~0.64 on VHH alone vs ~0.34 per complex pooled; q6), average_precision vs trapezoid (a constant predictor ~0.04 vs ~0.52; q6), best-of-5 vs last submission (q8), /detail vs /guideline metric contradiction (BRIEF q4). These ambiguities can each change the winner.
2. **Training label (AVIDa-hHER2):** enrichment-derived, not biophysical. q7 on the real table: 1,843,875 VHH, 19,367 labelled (7,316 Yes, 12,051 Not); label reproduces 100% from counts; pooled two-proportion z-test with no multiple-testing correction; "Not" is mostly depleted; only 49.5% of Yes replicate-confirmed; 59% of Yes have zero mother reads; 97% of sequences have zero reads per HER2 sublibrary. Note the BRIEF's "few hundred labels" is wrong. A sequence model mostly learns lineage (3-mer AUROC 0.945 random split falls to 0.855 under family split). Reliability for per-residue interface info: effectively none on the antigen side (one antigen, one round); weak CDR variability signal on the VHH side.
3. **Held-out truth caveat:** ONU11 CDR3 RPLGSTWTEHPY is a label-noise clone in the table (q7); ONU13 and ONU23 are Yes. Prevalence on HER2 is probably 0.024-0.064 (q6, q9), not 0.126 (8GZ5); random macro PR-AUC ~0.03-0.05, macro SD ~0.02-0.06.

## Top 10 facts that change how we would model
1. The NGS data contain no per-HER2-residue contrast; they inform the VHH side only; the antigen side must come from public structures or co-folding. (q7 DMS/DCA files; q9 casp_history file)
2. Four representation tricks (DCA/Potts, clonal-variant DMS, mimotope complementarity, PU/denoising) were tested and killed; denoising lowered held-out PR-AUC. A plain CDR-variability prior (PR-AUC 0.562 on CDR residues) beat the DCA composite (0.509). (q7 DCA file, labels file)
3. The only antigen-side NGS hint is trastuzumab competition: ONU13 depleted >20x, ONU11 and ONU23 not (domain mapping of competitors unverified, low). (q7 DMS file)
4. Co-folding beats docking for VHH: AF3 31.6% DockQ>=0.23 (n=60, 1 seed), Boltz-1 23.3%, Chai-1 15.0%; HADDOCK3 blind 20% top-10. ipTM discriminates weakly (AP 0.45; I-pLDDT+dGB 0.743). (q5 engines, confidence files)
5. Recipe to test: 20 seeds x 5 samples per engine, ipSAE-weighted Voronota-LT contact frequency, shrunk toward prevalence by split-half disagreement; mean not max over seeds (max ~0.10 AP worse, synthetic). (q5 confidence file; q8 ensembling file)
6. Leakage-free proxies are 9MTX/9MTE (released 2025-11-19, after engine cutoffs); 5MY6 and 7QVK are inside some training windows. Only 4 public HER2-VHH entries, so proxies are sanity checks, not tuning sets. Brief errors: 5F7D/5MYX/5MZV, 5MY7 and 7PH0 are not HER2-VHH. (q5 HER2 file; q6 sabdab file; q8 validation file)
7. The baseline's 0.176 is ~1.2x a finite-sample shuffle null (AP 0.147, sd 0.032; random hits it 16% of the time); AntiBinder reports no residue metric. (q6 antibinder file)
8. Best antigen-only epitope tool DiscoTope-3.0 reaches PR-AUC 0.232 at 6.4% prevalence (~3.6x random); PLMs give a real VHH paratope prior (~0.69-0.77) but are near chance on epitopes for unseen groups (AsEP AUROC 0.544). (q6 predictors, PLM files)
9. n=3 is a lottery: smallest reliable macro gap ~0.09-0.11 for unrelated models (0.03 for correlated variants); a 3-cluster bootstrap gives ~14% false positives; the portal returns no score, so the five submissions are checkpoints. (q8 ladder file; q9 cryptanalysis file)
10. Ties and numbering can silently destroy a submission: rounding costs ~0.10 AP; UniProt P04626 numbering includes the 22-residue signal peptide, VHH is sequential; a partial upload can leave 1-2 files committed. (q8 ensembling, runbook, ladder files)

## Contradictions / disagreements between queens
- **Where the antigen signal can come from.** q9 casp_history hoped enrichment reads could supply it; q7 and q9 ecology/cryptanalysis show they cannot. Resolved in favour of structure (q7 wins; q9 itself concedes in TL;DR).
- **Detectable gap.** q9: 0.07 (antigen-scale scoring) vs 0.15 (VHH-scale); q8: 0.09-0.11; q6: >=0.1. Roughly consistent; depends on the unresolved chain pooling.
- **HER2 prevalence.** BRIEF/8GZ5 0.126 vs q6 0.024-0.064 vs q9 0.03-0.04 (q9 medium-low). q6 and q9 agree; adopt ~0.04.
- **"Clean" proxy labels.** q8 runbook calls only 9MTE/9MTX clean; q8 validation file says all four pass the date cutoff; q5 says 7QVK is in Boltz-2's window. Keep both labels; use 9MTE/9MTX as primary.
- **Is the CDR prior the thing to beat?** q7 says a CDR-variability prior is the baseline (0.562 CDR); q5 says CDR+flank prior plus NanoBodyBuilder2/Paragraph is strong; q6 says PLM probes 0.69-0.77. These are different metrics and prevalences, not comparable; resolve on the 4 proxies.
- **Baseline lift:** 1.4x (analytic 0.126) vs 1.2x (finite null) within q6.
- **Engine ranking:** Boltz-2 above Chai-1 (q5) but flagged leakage-prone, so untrustworthy; and q5 shuffled-pair PR-AUC snippet (AF3 0.187, Chai-1 0.067, Boltz-2 0.026) contradicts naive "Boltz-2 is best" and is low-confidence.
- **Deadline dates:** 2026-12-15 results (/detail) vs 1 Dec ranking (Space) (q8); unresolved, not material to submission.

## (b) Cheapest experiments that could win Track A before 2026-10-31
Ordered by cost; all use public data only and leak-controlled proxies (9MTE/9MTX primary; 7QVK/5MY6 flagged). Remember "winning" is mostly a lottery at n=3, so the aim is a robust, correlated-improvement stack with a pre-registered margin.
1. **Insurance submission, ~2 CPU-hours (q8, Oct 20):** VHH side = CDR-variability/CDR+flank paratope prior (optionally AbLang-2/IgBert head); antigen side = RSA/accessibility prior shrunk to ~0.04 with chain base rates preserved, all values unique, round-trip numbering test. Protects against a missed deadline.
2. **Paratope head, cheap (~hours):** a nanobody-LM probe (ESM-2/AbLang-2, MIT/BSD) on SAbDab-nano with CDR3-cluster grouped folds; compare with the CDR-variability prior on CDR residues. Kill if not >= prior + 0.05 on the proxies.
3. **Multi-seed co-fold contact frequency (~12-14 GPU-h extrapolated, 2 GPUs, public partitions only):** Boltz-2, Chai-1, OpenFold3 (and Protenix-v1) x ~5-20 seeds on the three ONU clones plus the 9MTE/9MTX proxies; contact frequency over seeds, ipSAE-weighted, Voronota-LT areas, mean not max, shrink by split-half disagreement. Measure real seconds per seed first (all timings are extrapolations).
4. **Leakage ablation (cheap, same runs):** templates on/off and old vs new weights on 5MY6/7QVK vs 9MTE/9MTX to know how much of any proxy score is memorisation.
5. **Competition-column domain gate (nearly free):** use trastuzumab depletion to up-weight domain IV for ONU13 and down-weight it for ONU11/ONU23, only as a soft prior; first q3/q1 must confirm which domain the competing antibodies bind.
6. **Fusion by correlated variants:** average co-fold consensus with the antigen accessibility prior (and DiscoTope-3.0 if licence allows; academic licence risk with prize money); decide among at most 2-3 pre-registered arms, since gaps below ~0.03-0.1 are noise.
Do NOT spend GPU on NGS-derived representations (q7 recommendation, accepted).

## Cross-domain transfers (at least three, with one-line kill tests)
1. **Cryptanalysis frequency analysis / convergence (q5, q9):** seeds as intercepts, contact frequency as histogram, split-half agreement as the shrinkage weight. Kill test: on 9MTE/9MTX, if split-half-shrunk consensus does not beat unshrunk mean-contact PR-AUC (paired over residues, same models), drop shrinkage.
2. **Cryptanalytic decibans / weight-of-evidence (q9):** additive log-odds from independent evidence sources (co-fold frequency, accessibility, DiscoTope, domain gate) on a 0-1 output. Kill test: if the log-odds sum does not beat the best single source by >= 0.03 macro PR-AUC on the proxies after clustering correlated sources, revert to the single best source (clonal families violate independence, so cluster first).
3. **Sports walk-forward backtest (q8):** only evaluate on structures dated after each engine's training cutoff. Kill test: if an arm's rank on 9MTE/9MTX contradicts its rank on pre-cutoff 5MY6/7QVK by more than a pre-set margin, treat the pre-cutoff gain as memorisation and discard it.
4. **Ecology presence-only SDM = PU/MaxEnt (q9):** contact positives only, prevalence unidentifiable, so use ranking and a prior intercept set from public complexes. Kill test: PU/MaxEnt-style reweighting of public interface residues must beat plain logistic regression on grouped CV; q7 already found PU variants lowered PR-AUC, so expect to kill it.
5. **Music-IR / Shazam constellation on per-position enrichment peaks (q7):** replicate peaks across cluster halves (Jaccard 0.48-0.61, 75% in CDR columns). Kill test: denoised peaks must raise CDR-residue PR-AUC over the variability prior; q7's first try said no.
6. **Healthcare-screening base-rate lens (king lens, q6):** always report lift over prevalence and shuffle null. Kill test: if an arm's macro lift over the per-complex shuffle null is below ~1.5x on both clean proxies, do not submit it as the main candidate.

## Coverage gaps
- Nobody ran BepiPred-3, DiscoTope-3, SEMA, AbEpiTope on the proxies or on the ONU clones (q6/q7 gap); no nanobody-conditioned residue PR-AUC for any tool.
- No real HER2 seed-gain run; no measured per-seed GPU time, queue wait, Boltz credit cost, or AF3 weight access status (q8).
- No epitope domain/residue lists for 9MTE/9MTX/7QVK/5MY6 (q5/q8 asked q1/q2; belongs to king_world).
- Scorer ambiguity (pooling, AP vs trapezoid, best-vs-last, Voronota cutoff) unresolved; deadline time zone unstated.
- Sequence identity of the proxies to the gated training table not computed; no ANARCI/MMseqs2 here (Windows), so numbering/clustering are home-grown and unverified.
- Competition-antibody domain mapping (trastuzumab/pertuzumab) unverified.
- Law, art, music, sports, healthcare lenses only lightly covered (q9 did CASP, crypto, ecology, linguistics, blind challenges).
- Many sources are snippets/fetch summaries (q5, q6, q9); several licences and parameter counts unverified; AntiBinder supplement and the origin of the 0.176 run unseen.

## Recommendations to the Emperor
1. Add a short **execution sprint** shape (merge q5 + q8 workers, one owner) for the next 14 days: the research is saturated, and the remaining value is measuring seconds per seed, running proxies, and formatting. Reason: q8 and q5 both end at "needs a measured run".
2. **Kill further NGS-representation research** (q7); keep one worker only as a grouped-CV and family-split utility. Reason: four-fold kill with real tables.
3. **New channel `scorer_ambiguity`** (q4, q6, q8, q9 all asked the same question about pooling, AP vs trapezoid, best-vs-last). Owner q4; action: ask organisers or the HF Space discussion.
4. **Cross-king query:** q1/q2 to supply epitope domains and residue lists for the four proxies and domain mapping of competing antibodies (feeds experiment 5).
5. Treat q9 as a low-yield queen from now on; fold its useful outputs (null spreads, decibans recipe) into q8's runbook rather than re-dispatching.
6. No structure change to hive/ was made by me.

## Recommendations to the Scribe (five things a layman most needs from this half)
1. We are predicting where a tiny camel-derived antibody touches a cancer protein, and we are scored on only three examples, so luck is a large part of any ranking.
2. The huge experiment (1.8 million antibodies) says which antibodies stuck, not where on the target they stuck; four clever tricks to extract location failed.
3. AI structure programs guess the contact about one time in three; running them many times and keeping the contacts that repeat is more trustworthy than any single guess.
4. The organisers' baseline score is barely better than shuffling the answer, and the score we see will not be revealed until the end, so we test on a handful of already-solved public examples (two released in November 2025, after the AIs were trained).
5. Small formatting slips (rounded numbers, a wrong offset by the 22-residue signal peptide, a half-uploaded file) can ruin a good model; the real risk is the deadline, not computing power.
