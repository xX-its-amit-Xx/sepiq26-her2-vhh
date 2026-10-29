---
title: Confidence metrics, seed diversity and ensemble-to-epitope probability for co-folded VHH-HER2 complexes
queen: q5_structure_prediction_docking
king: king_infer
worker: confidence_metrics_iptm_pae_plddt_seed_diversity_and_epitope_probability_from_ensembles
tier: expert
tags: [ipTM, ipSAE, PAE, AF3, Boltz-2, Chai-1, seeds, Voronota-LT, epitope-probability, calibration]
confidence: medium
challenge_relevance: 5
serendipity: Cryptanalytic frequency analysis (seeds = intercepts, contact frequency = letter histogram, index of coincidence = convergence test); partially paid off, gives a concrete convergence statistic and a shrinkage rule.
date: 2026-10-17
---

## TL;DR
No single confidence number reliably says a nanobody-antigen pose is right: published numbers are weak (AF3 ipTM-based average precision about 0.45 for DockQ>=0.23; PR-AUC 0.187 / 0.067 / 0.026 for AF3 / Chai-1 / Boltz-2 at telling real from shuffled pairs). The robust move for Track A is therefore not to pick a top-1 pose but to average contact maps over many seeds and models, then shrink toward prevalence by how much the ensemble disagrees. Seeds are cheap: 20 seeds were called "sufficient" for stability by Hitawala and Gray, and 10-25 samples was the efficiency sweet spot in a 2026 preprint (secondary source only).

## 1. Ranked confidence metrics (with what is actually reported)
Honest caveat: I could not open the full text of the ipSAE preprint tables, AbEpiTope or the 2026 shuffled-pair preprint for AUROC tables (HTTP 429 or binary PDF). Numbers below are only what I read.

| Rank (my judgement) | Metric | Where it comes from | Reported discrimination | Source status |
|---|---|---|---|---|
| 1 | ipSAE (PAE cutoff 10 or 15 A, d0 from n residues passing) | Dunbrack, bioRxiv 10.1101/2025.02.10.637595 | ipTM for true vs false heterodimers overlaps over 0.3-0.7 (40 true, 70 false pairs, density plots); ipSAE gives near 0 for non-interactors (RAF1/RIPK1 0.000 at 10 A) vs 0.68-0.73 for true cases. No AUC or score cutoff stated in the paper; pDockQ/pDockQ2/LIS only mentioned in Discussion. | read (PMC11844409). Not antibody-specific. |
| 2 | ipTM (high-accuracy-tuned thresholds) | Hitawala and Gray, mAbs 2025, doi 10.1080/19420862.2025.2545601 (PMC12360200) | AP for DockQ>=0.23: 0.458 (Ab, threshold 0.49), 0.450 (Nb, threshold 0.40). Search summary also quoted R=0.73 (Nb) and 0.90 (Ab) ipTM vs DockQ for top-ranked; the PMC text I fetched did not contain these, so treat as unverified. | read |
| 3 | I-pLDDT (interface pLDDT) | same | AP 0.368 (Ab, cutoff 85), 0.336 (Nb, cutoff 87); I-pLDDT + Rosetta dGB gives AP 0.743 for nanobodies | read |
| 4 | Average H3 pLDDT | same | AP 0.287 / 0.316 (cutoff 86) | read |
| 5 | Rosetta dGB alone | same | AP 0.188 / 0.178 | read |
| not benchmarked on Ab/Nb by me | pTM, AF3 ranking_score, pDockQ, pDockQ2, LIS, actifpTM, Boltz-2 confidence_score | AF3 docs: ranking_score = 0.8*ipTM + 0.2*pTM + 0.5*disorder - 100*clash; Boltz: confidence_score = 0.8*complex_plddt + 0.2*iptm | no antibody AUROC found. actifpTM (Bioinformatics 41(3) btaf107) is AF2-oriented; ipsae.py outputs pDockQ, pDockQ2, LIS alongside ipSAE. | docs only |

Real vs shuffled pairing (106 nanobody-antigen complexes, 11,342 non-cognate pairs; bioRxiv 10.64898/2026.03.02.709004, seen ONLY via a search snippet and a tweet summary, not opened): PR-AUC AF3 0.187, Chai-1 0.067, Boltz-2 0.026; cross-tool ipTM Pearson r 0.13-0.18; shuffled complexes got epitope recall comparable to real ones; DockQ improves with saturation sampling but ipTM change vs DockQ change is about uncorrelated. Treat as medium-low confidence until the paper is opened.

Baseline success rates (top-ranked, 1 seed, Hitawala and Gray): nanobody DockQ>0.23 / >=0.8: AF3 31.6% / 13.3%; Boltz-1 23.3% / 5.0%; Chai-1 15.0% / 3.3%. Antibody: AF3 34.7 / 10.2; AF2.3-M 23.4 / 2.4; Boltz-1 20.4 / 4.1; Chai-1 20.4 / 0. Benchmark: 60 bound nanobodies (70 incl. unbound). AF3 paper figure for Ab-Ag with 1,000 seeds is about 60% overall success (quoted second-hand). Boltz-2, OpenFold3, Protenix nanobody-specific rates: not found (FoldBench Ab-Ag: AF3 47.9% success, others over 60% failure, not nanobody-specific). A tamarind blog's Chai-1r epitope-restraint DockQ numbers are secondary; not used.

## 2. How many seeds
- Hitawala and Gray: 3 seeds x 5 diffusion samples = 15 decoys per target for the main comparison; 20 seeds for ranking analysis, stated as sufficient (Fig S6); 100 seeds for stability. No saturation-curve values were printed in text. CDR-H3 median unbound RMSD with 20 seeds 2.9 A (Ab) / 2.2 A (Nb).
- 2026 preprint (snippet only): quality per energy best at N=10-25; deeper sampling does not fix confidence calibration; independent seeds more informative than more samples per seed.
- Recommendation: 20 seeds x 5 samples = 100 decoys per model family per target for AF3-class models; add Boltz-2 and Chai-1 as diversity, then use the convergence statistic in section 6 (below) to decide whether to continue. Beyond about 25 seeds, expect gains in mode coverage, not in confidence. No AFsample-style curve was verified (not searched deeply; open question).
- GPU cost: not verified by me. Rough planning only (unverified): AF3 on one GPU is minutes per seed for a ~1,400-residue HER2 ECD + VHH complex; check the first run with `time` and extrapolate. HER2 ECD (about 630 residues) + VHH (about 120) is a moderate size.

## 3. Ensemble-to-probability recipe (named tools)
Inputs: N models (AF3 `seed-S_sample-K/` dirs, Boltz-2 `*_model_i.cif`, Chai-1 cifs), each with summary_confidences.json or confidence_*.json and PAE.
1. Score each model: ipSAE (ipsae.py, PAE cutoff 10, dist 10; take the "max" row of the A-B pair), ipTM, interface pLDDT. Drop models with has_clash true.
2. Contacts: run Voronota-LT (github.com/kliment-olechnovic/voronota, latest release seen: 1.29.4816, expansion_lt subfolder) with `--compute-only-inter-chain-contacts` or `--compute-only-inter-residue-contacts`, `--write-contacts-residue-level-to-file`, default `--probe 1.4`. Sum area per residue over contacts with the other chain. Contact area A_i(m) for residue i in model m.
3. Weights: w_m = softmax(z_m / T), z = standardized ipSAE (optionally 0.5 ipSAE + 0.5 ipTM); T about 1 to start; per-model-family weights equal so Boltz-2 (high ipTM on everything) cannot dominate; z-score within family.
4. Raw score: p_i = sum_m w_m * 1[A_i(m) > 0] (binary frequency); optional area-weighted variant q_i = sum_m w_m * A_i(m) / max_j(...). Use binary frequency for the unweighted track and q for the area-weighted one.
5. Smoothing: p_i' = 0.7 p_i + 0.3 * mean of p over spatial neighbours (CA within 8 A on the antigen model; on VHH sequence neighbours i+/-1, CDR-aware).
6. Calibration: PR-AUC is rank-based within each complex, so monotone calibration does not change it; it matters only for threshold-free handling of ties and for mixing with priors. Rescale so mean(p) about 0.1 for antigen (26/206 = 0.126 in 8GZ5; HER2 ECD epitope prevalence unknown, expect order 0.05-0.10 of about 630 residues - assumption) via logit shift. Omitted residues are 0, so set tiny values (not zero) to break ties by distance to the ensemble consensus patch.
7. Shrinkage (section 6).
Match to ground truth: the challenge truth uses Voronota-LT inter-chain contact areas from the cryo-EM structure; using the same tool on models gives the same definition (probe, atom radii) and avoids a distance-cutoff mismatch. The exact official Voronota-LT flags are not published in what I read: unverified, so ask organisers or inspect the Space.

## 4. Epitope PR-AUC from co-folding ensembles in literature
- AbEpiTope-1.0 (Clifford, Richardson, Peters, Nielsen, Sci Adv 2025, doi 10.1126/sciadv.adu1823): AF2.3-multimer models plus inverse folding; 1,730 complexes; reports it beats AlphaFold's own confidence at ranking interface accuracy; antibody-target variant 61.21% accuracy at picking the correct antigen. I could not extract residue-level AUC-PR or prevalence (PDF unreadable, abstract only). Unverified.
- AbAdapt-AF (bioRxiv 2022.05.21.492907) combined AF2 models with docking for epitope prediction on an anti-RBD benchmark; no numbers read.
- Real vs shuffled preprint above reports epitope recall but not PR-AUC (snippet only).
- Result: no paper I could verify gives residue-level PR-AUC from a multi-seed nanobody co-folding ensemble with prevalence. That is a gap and an opportunity; the AntiBinder proxy for 8GZ5 is PR-AUC 0.176 (from the BRIEF).

## 5. Non-binders and wrong-epitope poses
Confidence does not separate them well: ipTM fails to distinguish real from shuffled pairs (PR-AUC 0.026-0.187), and shuffled pairs yield plausible epitopes. In-challenge consequence: all three VHHs are real HER2 binders, so the question is which HER2 patch, not binder vs non-binder. Ensemble spread then is the only usable uncertainty signal. Shrinkage rule: for a complex, compute the entropy-based consensus (section 6); p_final = c * p + (1 - c) * prior_i, where prior_i is an antigen-only epitopeness (surface accessibility, or HER2 domain-level prior from known anti-HER2 binders) and c in [0,1] rises with convergence. Because PR-AUC is computed per complex then macro-averaged, shrinkage helps only by reordering within a complex: diffuse ensembles should rank by the prior, converged ones by frequency. Untested.

## 6. Forced analogy: cryptanalytic frequency analysis
(a) Each seed = an independent noisy intercept of one cipher (the true binding mode); per-residue contact frequency = letter histogram; weights = crib-match score. (b) Index of coincidence: IC = sum_i f_i^2 over contacting residues (f normalised to sum 1), or, more directly, the pairwise Jaccard between contact sets of random model pairs: J_bar = mean over pairs of |C_a intersect C_b| / |C_a union C_b|. Random patch placement gives low J_bar; one converged mode gives J_bar near 1; two modes give bimodal J (cluster models by J, then weight clusters, Kasiski-like period finding = detecting multiple poses). Testable rule: stop adding seeds when J_bar and the top-20 residue set stop changing between the first and second half of the seeds (split-half Spearman of p_i above 0.9). Use c = split-half agreement as the shrinkage coefficient. (c) Holds partially: seeds are not independent (same trained prior, shared MSA/templates, so correlated errors, like a reused one-time pad) and frequency measures model prior, not truth, which is the core failure the shuffled-pair preprint shows (confident wrong).

## 7. Code pointers and parsers
- ipsae.py: github.com/DunbrackLab/IPSAE. Usage `python ipsae.py <pae_file> <structure> <pae_cutoff> <dist_cutoff>`; AF2 = .json + .pdb; AF3 = confidences .json + .cif (summary_confidences.json found by name substitution); Boltz = pae_*.npz + .cif (plddt_*.npz and confidence_*.json by name substitution, uses `pair_chains_iptm`). It does NOT parse Chai output natively (convert Chai pae npz to a Boltz-style npz yourself). Outputs `<stem>_<pae>_<dist>.txt` (ipSAE, ipSAE_d0chn, ipSAE_d0dom, ipTM_af, pDockQ, pDockQ2, LIS, asym/max rows), `_byres.txt`, `.pml`. d0 = 1.24*(L-15)^(1/3) - 1.8, min 1.0. Argument parsing is sys.argv based; noted bugs: Boltz fallback for missing `pair_chains_iptm` is ineffective.
- AF3 (google-deepmind/alphafold3 docs/output.md): `seed-<seed>_sample-<n>/` dirs, `ranking_scores.csv`, summary_confidences.json (chain_pair_iptm, chain_pair_pae_min, iptm, ptm, ranking_score, fraction_disordered, has_clash), confidences.json (pae [tokens x tokens], atom_plddts, contact_probs within 8 A, token_chain_ids). Default 5 samples per seed.
- Boltz (jwohlwend/boltz docs/prediction.md): confidence_*_model_N.json (confidence_score, ptm, iptm, protein_iptm, complex_plddt, complex_iplddt, chains_ptm, pair_chains_iptm), pae_*.npz (key `pae`), plddt_*.npz; flags `--diffusion_samples` (default 1), `--recycling_steps` 3, `--sampling_steps` 200, `--write_full_pae`.
- Script outline: loop dirs -> load summary json -> run ipsae.py as subprocess per model (or import its functions) -> run `voronota-lt` per model -> parse residue-level contact file -> accumulate -> weights -> p_i -> write CSV `chain,seqNum,resName,prediction` per complex.
- Install recipes, repo versions and GPU-hours for Explorer/Modal/Colab/OpenProtein: NOT verified in this pass (no installs run, resource rule respected). Boltz credits (boltz:* skills) and Explorer `gpu`/`gpu-short` (max 2 GPUs, never lab partitions) are the compliant routes.

## Gotchas / what could fool us
1. Boltz-2 gives uniformly high ipTM (PR-AUC 0.026 on real-vs-shuffled): raw ipTM across families must be z-scored within family.
2. ipTM depends on chain length and disordered flanks (HER2 ECD is large; the GACQ + His tail is in the construct): trim to ECD domains or rely on ipSAE.
3. Top-ranked pose is only about 31.6% correct for AF3 on nanobodies; a confidence-weighted average is dominated by a few confidently wrong models if T is small. Keep T high.
4. Seeds share the same MSA/prior: frequency is not independent evidence; split-half agreement inflates.
5. Public-structure leakage: AF3/Boltz training cutoffs may include HER2-VHH homologues; the rules allow leakage but it also inflates any proxy benchmark on PDB complexes.
6. VHH numbering is sequential, not Kabat; map model residue indices to the challenge seqNum carefully, including signal-peptide offset for HER2 (UniProt numbering includes signal peptide).
7. Voronota-LT residue contact areas: any contact vs area threshold changes positives; replicate organiser flags.
8. Evidence quality: several numbers here come from search snippets (flagged) and were not verified.

## Implications for the challenge
1. Generate 20 seeds x 5 samples with AF3-class models, plus Boltz-2 and Chai-1; do not rely on top-1.
2. Score models with ipsae.py (cutoff 10/10), z-score within family, softmax weight with high temperature.
3. Compute Voronota-LT inter-chain contact areas per model; build p_i = weighted frequency; smooth over 8 A neighbours.
4. Use split-half Jaccard / IC-like convergence to set shrinkage toward an antigen-only prior; test on PDB proxies (8GZ5 and other VHH-antigen entries) by PR-AUC, comparing top-1 vs ensemble.
5. Reserve the 5 submissions: ensemble binary, ensemble area-weighted, shrunk variant, a clustering-by-mode variant, a Boltz-only variant.
6. Ask organisers (or read the Space) for exact Voronota-LT parameters.

## Open questions
- Residue-level PR-AUC of ensembles vs top-1 for nanobodies (no verified paper).
- Seed-saturation curve for top-1 selection (Hitawala and Gray Fig S6 values).
- Actual AUROC of ipSAE vs ipTM on antibody sets; open the full preprint and the 2026 preprints.
- Boltz-2/OpenFold3/Protenix nanobody success rates; GPU-hours per complex.

## Sources
- https://github.com/DunbrackLab/IPSAE (README, ipsae.py)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11844409/ (ipSAE preprint, PMC)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12360200/ (Hitawala and Gray, doi 10.1080/19420862.2025.2545601)
- https://github.com/kliment-olechnovic/voronota and expansion_lt/README.md (raw)
- https://raw.githubusercontent.com/jwohlwend/boltz/main/docs/prediction.md
- https://raw.githubusercontent.com/google-deepmind/alphafold3/main/docs/output.md
- Search snippets only (not opened): bioRxiv 10.64898/2026.03.02.709004; Sci Adv doi 10.1126/sciadv.adu1823 (abstract-level); FoldBench doi s41467-025-67127-3; AbAdapt bioRxiv 2022.05.21.492907
