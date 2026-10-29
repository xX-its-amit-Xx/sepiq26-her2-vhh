---
queen: q7_data_representation_integration
king: king_infer
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- The breakthrough hypothesis (representation tricks turn weak binding signal into interface signal) was tested four ways on the real tables and killed in each: DCA/Potts, clonal-variant DMS, mimotope-style complementarity, label denoising.
- The data are bigger than the brief says: 1,843,875 VHH, 19,367 labelled clones (7,316 Yes, 12,051 Not), not "a few hundred". The label reproduces 100% from counts.
- Labels are noisy: only 49.5% of Yes are replicate-confirmed, 59% of Yes have zero mother reads. A sequence model mostly learns lineage (3-mer AUROC 0.945 falls to 0.855 under family split).
- The only antigen-side signal is the trastuzumab/pertuzumab competition columns (Library B only): ONU13 is depleted more than 20x by trastuzumab, ONU11 and ONU23 are not.
- Recommendation: do not spend GPU on NGS-derived representations. Use them for family structure, sanity checks and grouped-CV folds, and make the structure arms beat the CDR-variability and RSA priors.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. 120,206 Hamming-1 CDR3 families from 1.68 M sequences with a CDR3; 39 families carry 50% of above-expectation post-panning reads; family-level replicate Pearson 0.93. (clonotype file, n=7; medium)
2. Leave-self-out family score AUROC 0.976 beats single-replicate per-sequence 0.962 but not pooled per-sequence 0.991 (label-circular). Motif bins weak (k=3, silhouette 0.29). (clonotype file; medium)
3. Held-out clones are rows in the table: ONU11 CDR3 RPLGSTWTEHPY (label noise), ONU13 KYGSSRLWDY (Yes), ONU23 DGRFYSDYVWSSPDEYAY (Yes); families of 1,330 to 4,420 sequences. (clonotype, DMS files; medium-high)
4. In all three target families CDR3 varies only at the sequencing-error floor (0.5 to 2% per column), so natural variants are not a DMS. Tolerance-only score PR-AUC 0.137 vs 0.206 for CDR3-uniform on 5 interfaces. (DMS file, n=9; medium)
5. Competition signal: ONU13 depleted more than 20x by trastuzumab; ONU11 and ONU23 not. The domain mapping of the competing antibodies is from memory in other queens' notes. (DMS file; medium for numbers, low for domain mapping)
6. DCA: antigen is constant, so only VHH-VHH couplings are identifiable. Composite paratope score CDR PR-AUC 0.509 vs 0.399 CDR3-only (CI above 0), but a variability-only prior scores 0.562 and the binder/non-binder contrast does not beat CDR3-only. Claim killed. About 11 min CPU. (DCA file, n=12; medium)
7. Mimotope oracle (true CDR3 as query, 5 HER2 complexes): macro PR-AUC 0.081 vs 0.083 RSA prior (random about 0.05); paired-bootstrap CIs include 0. Classic mimotope tools need 5 to 30 antigen-selected peptides, sensitivity about 0.3; EpiSearch recovered the trastuzumab domain IV patch from 5 peptides. (mimotope file, n=16; medium; BepiPred, DiscoTope, SEMA not run)
8. The label cascade reproduces 100%. IE-score is a pooled two-proportion z-test with no multiple-testing correction, clipped at -500; "Not" is mostly "depleted". 97% of sequences have zero reads per HER2 sublibrary; 77.9% are singletons. (labels file, n=9; high)
9. Elkan-Noto, nnPU and denoised soft labels all lowered held-out PR-AUC vs raw labels. (labels file; medium)
10. Brief errors: 5MY7 and 7PH0 are not HER2-VHH complexes. Usable proxies: 5MY6, 7QVK, 9MTE, 9MTX (4 entries, 5 interfaces). The competition column "RabMAb" is named "Companion" in the count file. (DMS, labels files; high)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Music-IR cover-song matching (clonotype): CDR3 motif is framework-invariant, which held; but the family score did not beat pooled per-sequence and the motif groups are weak bins. Partial.
- Cover-version invariants (DMS): invariant notes = paratope fails because covers differ only at the error floor. The loud CDR1/CDR2/FR2 columns give usable negative evidence only. Mostly dud.
- Query-by-humming (mimotope): contour matching of charge/hydrophobicity did not beat an RSA prior even in the oracle. Dud: CDR3 chemistry-to-surface complementarity is not predictive at this resolution.
- Score-following/DTW with a constant drone (DCA): correctly predicted that only within-VHH couplings are identifiable; did not rescue signal. Useful as diagnosis, dud as method.
- Shazam constellation (labels): per-position enrichment peaks replicate across cluster halves (Jaccard 0.48 to 0.61, 75% in CDR columns), but denoising first did not sharpen them. Partial.

## Contradictions within my subdomain
- Family-level enrichment is highly reproducible (r 0.93) yet 50% of Yes are not replicate-confirmed: reproducibility sits in big expanded families; the small-family tail is noise.
- The DCA composite score beats CDR3-only but loses to a plain variability prior: "beats the stated baseline" does not mean "carries signal".
- The brief cites a Mason 2021 library of about 39,000 variants; the worker could not verify size or accession.

## Gotchas for the modeler (what could silently fool us)
- Family leakage: random splits inflate (3-mer AUROC 0.945 to 0.855). Use cluster-grouped CV.
- Pooled per-sequence enrichment (AUROC 0.991) is circular with the label; never report it as validation.
- Large families are one clone plus PCR/sequencing variants, so family size is partly an error artefact.
- "Not" is mostly depleted, not tested-flat; treating it as unlabelled (PU) also failed here.
- Oracle tests (true CDR3) are optimistic: negatives there are strong, positives would not be.
- No ANARCI, MMseqs2 or CD-HIT was used: own numbering (96% numbered) and greedy centroid clustering, boundaries not IMGT-verified.
- The mimotope worker could not fetch the gated files (HF 401) and used true binder CDR3s; the other workers used the user's approved login. Dataset terms: SEPIQ participants only, report aggregates only.

## Questions for other queens (name the queen)
- q3_assay_ngs_ground_truth: confirm the domain mapping of trastuzumab/pertuzumab and whether competition depletion can serve as a domain label for ONU13.
- q6_epitope_ml_methods: is a CDR-variability paratope prior (PR-AUC 0.562 on CDR residues) the baseline for your paratope models?
- q5_structure_prediction_docking and q8_compute_validation_execution: does ONU13's docked pose sit at the trastuzumab site while ONU11 and ONU23 do not?
- q4_challenge_intelligence: does the "noise" label for ONU11 affect how held-out truth is scored?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- The big experiment tells us which antibodies stuck to HER2, but not where on HER2 they stuck.
- We tried four clever ways to squeeze location out of those results, and none beat a simple guess based on where antibodies usually bind.
- The one useful hint comes from an experiment where a known drug competed for the spot, which suggests one of our three antibodies binds near the drug's site.

## Gaps I could not fill
- Mason 2021 library size and accession; Starr 2020 numbers; any HER2 DMS or MaveDB entry (none found, low confidence).
- BepiPred, DiscoTope and SEMA baselines were not run.
- Antigen-side domain assignment of the competition antibodies is unverified.
- No paired-alignment DCA positive precedent found (thin search); RBM-on-phage attribution unverified.
- ANARCI and MMseqs2 are unavailable on this Windows box.
