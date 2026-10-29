
[q5_structure_prediction_docking] 2026-10-17
- Only clean nanobody table (Hitawala & Gray, n=60, 1 seed, DockQ>=0.23): AF3 31.6%, Boltz-1 23.3%, Chai-1 15.0%. No nanobody-specific rates for Boltz-2/OpenFold3/Protenix. Boltz-2, Chai-1, OpenFold3, Protenix-v1 need no weight application; AF3 weights do.
- Compute is not binding: ~12 GPU-h ensemble (extrapolated, not measured) fits 40 h. Recommend 20 seeds x 5 samples per engine, ipSAE-weighted Voronota-LT contact frequency, shrunk toward prevalence by split-half disagreement. ipTM discriminates weakly (AP ~0.45). HADDOCK3 blind only 20% top-10 vs AF3 52.5%: CPU re-ranker only.
- Question for q8: measure real s/seed on first run and confirm GPU access (Explorer public partitions only). Question for q6: is a CDR+flank prior (~0.35-0.5 PR-AUC, unverified) the baseline to beat?

## 2026-10-17 [q6_epitope_ml_methods]
- Four public HER2-VHH PDB entries (5MY6 dom I, 7QVK I/II, 9MTE III+I and I, 9MTX III+I) are all far from ONU11/13/23 by CDR3 (max identity 0.36): fair priors and the only proxy test set. 9MTE/9MTX (2025-11) post-date AF3/Boltz-2 training, so score each co-folder on them first.
- DiscoTope-3 (best antigen-only tool) is PR-AUC 0.232 at 6.4% prevalence (~3.6x random): weak prior only; DTU licences are academic. ESM-2 (MIT), AbLang-2 (BSD-3), IgBert (MIT) are safe for the VHH paratope channel; skip IgLM and ESM3/ESM C 600M (licence).
- Question for q5/q8: is multi-seed contact frequency from Boltz-2/OpenFold3/Chai-1 vs deposited 9MTE/9MTX/7QVK (residue PR-AUC, lift over prevalence) worth the GPU-hours?

2026-10-17 [q8_compute_validation_execution] Whole co-folding plan is about 14 GPU-h (extrapolated, not measured). Explorer public gpu has A100/H200/V100 (8h; gpu-short 2h), 152 pending, so waits of hours; cap 2 GPUs with --array=0-N%2. Modal is the fallback. Boltz API cost unknown.
2026-10-17 [q8_compute_validation_execution] Ensembling rule: mean over >=3 models x 5 seeds, 8 A smoothing, 0.2 prior shrinkage, unique nonzero values (rounding to 1 decimal cost about 0.10 AP in simulation). Request to q5/q6/q7: measured GPU-minutes per seed, and which arm beats the CDR/accessibility prior on proxies.

[q7_data_representation_integration] 2026-10-17
- No GPU-hours are worth spending on NGS-derived representations: DCA, clonal-DMS, mimotope complementarity and denoised labels all failed to beat simple priors on proxy HER2-VHH complexes (5MY6, 7QVK, 9MTE, 9MTX); all ran on CPU (DCA about 11 min). 5MY7 and 7PH0 in the brief are not HER2-VHH complexes; drop them.
- Baselines to beat for any arm: CDR-column variability prior (PR-AUC 0.562 on CDR residues) and RSA prior (macro PR-AUC 0.083 for epitope residues). Use family-grouped CV: random splits inflate (3-mer AUROC 0.945 -> 0.855).
- Question for q5/q8: use ONU13 trastuzumab depletion as a domain-level sanity check of co-folded poses (ONU13 should dock near the trastuzumab site; ONU11 and ONU23 should not).
