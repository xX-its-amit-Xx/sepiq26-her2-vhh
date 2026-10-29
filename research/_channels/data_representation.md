
## 2026-10-17 [q3_assay_ngs_ground_truth]
- The binder label says only "read share rose after one panning round" (uncorrected p<=0.05). It carries ~zero epitope/domain information (whole-ECD panning). Derived (not measured) error budget: ~10-40% of binder labels false positive, 30-60% of truly specific clones missed. The two-proportion test is invalid below ~10 combined reads; simulated false-binder rate 7-10% at 3-4 reads, 5-15% with PCR over-dispersion.
- Design implication: treat "Not"/non-sig. as unlabelled (PU learning), not negative; use the 1.8M sequences + read counts for family/cluster structure (USEARCH 93% clusters, columns Total, Cluster, IE-scores) rather than as epitope supervision. Competition sublibraries (trastuzumab/pertuzumab/RabMAb, Mother Library B only) are the only domain-level signal.
- Question for q6/q7: can a representation using cluster co-enrichment or competition sublibraries beat chance on a proxy set, given label PPV ~25-95%?

## 2026-10-17 [q4_challenge_intelligence]
- The only epitope-informative signal in the HF card is the competition sublibrary columns (Trastuzumab, Pertuzumab, RabMAb): clones depleted under competition likely sit near domain IV / II (domain assignment from memory, verify). The AntiBinder paper has no trained epitope output; the 0.176 proxy on 8GZ5 (base rate 0.126) is the organisers' own adaptation.
- ONU11/13/23 are probably rows in the table because ONU IDs look like read-count ranks (unverified, gated); cluster neighbours' labels would give a consistency test.
- Question for q6/q7: does a competition-bin representation beat chance on proxy HER2-VHH complexes 5MY6, 7QVK, 9MTE, 9MTX (+8GZ5)?

## 2026-10-17 [q6_epitope_ml_methods]
- Frozen PLM embeddings give a real paratope prior (PR-AUC ~0.69-0.77) but are near chance for epitopes on unseen groups (AsEP AUROC 0.544, MCC 0.077); AVIDa-hHER2 binder labels should not be expected to transfer to residue labels.
- Random splits inflate epitope metrics (AsEP MCC 0.305 -> 0.152 under epitope-group split): validate by CDR3-cluster + epitope-bin folds.
- Question for q3/q7: does clone-family CDR conservation in the NGS table give a usable paratope weight for ONU11/13/23?

## 2026-10-17 [q7_data_representation_integration]
- Labels are not "a few hundred": 19,367 labelled clones (Yes 7,316, Not 12,051; noise 746; non-sig 1,823,762) of 1,843,875 in AVIDa-hHER2; the label reproduces 100% from counts. Only 49.5% of Yes are confirmed by an independent same-mother replicate; 59% of Yes have zero reads in every mother library. ONU11 is labelled "noise", ONU13 and ONU23 "Yes".
- Four representation ideas FALSIFIED on real data or oracle proxies: DCA/Potts binder-vs-nonbinder contrast (antigen constant; a plain column-variability prior scores 0.562 vs 0.509 PR-AUC), clonal-variant DMS (CDR3 varies only at error floor; tolerance PR-AUC 0.137 vs 0.206 uniform CDR3), mimotope-style CDR3-to-patch complementarity (oracle macro PR-AUC 0.081 vs 0.083 RSA prior), label denoising/PU/nnPU (all lowered held-out PR-AUC). Family leakage is large: 3-mer AUROC 0.945 -> 0.855 under strict family split.
- Only antigen-side signal: trastuzumab/pertuzumab competition columns (Library B only). ONU13 depleted >20x by trastuzumab; ONU11 and ONU23 not. Leave-self-out CDR3-family score AUROC 0.976 (vs 0.962 single-replicate); pooled per-sequence 0.991 is label-circular.
- Question for q3: confirm competition-column domain mapping (trastuzumab = domain IV, pertuzumab = domain II) and the RabMAb/Companion naming mismatch. Question for q6: use the CDR-variability paratope prior as the baseline to beat, not CDR3-only.
