
## 2026-10-17 [q3_assay_ngs_ground_truth]
- Law-of-evidence lens: p<=0.05 read as "95% real" is the prosecutor's fallacy (PPV ~27% at a 3% prior, est.); the label passes admissibility for "enriched" but fails Daubert "fit" for "which residues". The cutoff is the standard of proof; the robust-core split (70% of residues, 92% of area) is a usable confidence tier. Healthcare-screening base-rate arithmetic (PPV) was the lens that paid off most.

## 2026-10-17 [q4_challenge_intelligence]
- Forensic chain of custody: treating each web page as an exhibit exposed that the home page is stale (all sepiq.uk pages share the 1 Sept build stamp) and that only the HF Space app.py shows what the uploader enforces (header check only). Art restoration lens: NGS table = over-painted original, cryo-EM = canvas; modest payoff.
- Healthcare-screening lens: with n=3 macro PR-AUC, a modestly better method wins only ~58-61% (simulation); only a clearly better method (gap >= 0.15) reliably wins. Aim for a step change, not +0.02 tuning.

[q5_structure_prediction_docking] 2026-10-17
- Cryptanalysis lens: seeds = intercepts, per-residue contact frequency = letter histogram, split-half agreement = index-of-coincidence convergence test; produced a concrete shrinkage rule. PDB HER2 complexes as known plaintext became a leakage ablation (templates on/off, 2021 vs 2025 weights).

[q1_her2_biology] 2026-10-17
- Ecology lens (niche/presence-only/MaxEnt) on PDB epitopes: bias-correction half paid off (44 records = ~7-10 independent niches); prediction half failed (presence prior scores near/below random for held-out VHHs). Competitive-exclusion lens: HER2 dimer-occupied patch (~51 res, domain II) is a measurable residue set, no public VHH overlaps it. 147 of 341 exposed ECD residues never touched by any public binder.

## 2026-10-17 [q6_epitope_ml_methods]
- CASP/forecasting lens: 0.176 is only ~1.2x expected random AP on one complex; treat leaderboard gaps < 0.1 as a lottery, and judge candidates by lift over prevalence and a sign test across complexes, not raw mean PR-AUC.

## 2026-10-17 [q2_vhh_immunology_structure]
- Art-conservation lens (inferring the original from degraded traces): a hand-set damage map (CDR3 + Tyr/Trp + FR 37/44/45/47) beats prevalence by +0.40 PR-AUC on 17 VHH complexes, so the analogy passes for the paratope side. It does not transfer to HER2 antigen residues, and "mutation density marks contacts" is untested (no source). Art-provenance attribution of ONU clones to catalogued nanobodies found no match.

2026-10-17 [q8_compute_validation_execution] Sports lenses (walk-forward backtest, salary cap, power rankings, stop-loss) gave discipline rules, not modelling ideas: dated proxy cutoff, many cheap seeds before expensive engines, pre-registered kill criteria. At n=3 the smallest detectable gap is about 0.09-0.11 macro PR-AUC, so prefer the simplest robust arm.

## 2026-10-17 [q9_serendipity_cross_domain]
- All five lenses (CASP history, cryptanalysis, ecology/MaxEnt, translation alignment, other blind challenges) came back "partly holds". Common break: one antigen, one enrichment round, so reads carry NO per-HER2-residue signal; antigen-side weights must come from public HER2 complexes (cribs), reads only inform the VHH side. A length-bucketed pseudo-MSA from AVIDa-hHER2 gives identical profiles for ONU11 and ONU13.
- Noise floor at n=3: simulated macro PR-AUC SD is about 0.024-0.06 at true AUC 0.7; independent submissions need a gap of about 0.07-0.16 to separate (correlated variants about 0.03). Unknown prevalence does not change rank-based per-complex PR-AUC (ecology: intercept is a monotone shift), but HER2 epitope prior is probably 0.03-0.04, not 0.126.
- Best testable idea: nanobody-LM paratope head trained on SAbDab-nano (literature PR-AUC about 0.65-0.70, unverified). Question for all queens: has anyone measured a CDR/paratope prior per complex on pooled vs unpooled chains A+B?
