# Questions for the SEPIQ organisers (draft, to be posted by the user in the HF Space Community tab)

Post at https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (Community tab). Each item below can change which team wins at n = 3.

1. **Metric variant.** /guideline names PR-AUC (unweighted and area-weighted) macro-averaged over the three antibodies; /detail says the official leaderboard metric is not specified. Which variant ranks teams: unweighted, area-weighted, or an average of both?
2. **Chain pooling.** Is PR-AUC computed per complex over antigen (chain A) and VHH (chain B) residues pooled together, or separately per chain and then averaged? (A CDR-aware VHH prior scores far higher on the VHH chain alone than pooled.)
3. **PR-AUC definition.** Is it average precision (step-wise, as in scikit-learn `average_precision_score`) or trapezoidal area under the precision-recall curve? (An all-tied constant prediction scores about the prevalence under AP but about 0.5 under the trapezoid rule.)
4. **Ties and omitted residues.** Omitted residues count as prediction 0: are ties broken arbitrarily or treated as one threshold step?
5. **Which submission counts.** With up to 5 Track A submissions, does the best one, the last one, or a team-nominated one count for the final ranking?
6. **Antigen construct.** Which residues of chain A are labelled? The printed construct is P04626 1-624 plus His tag with signal peptide included (offset 0); are tag and unmodelled residues scored as 0-label or excluded?
7. **Deadline.** Exact closing time and time zone for 2026-10-31, and the exact date results are announced (/detail: 2026-12-15, Space: 1 Dec).
8. **Contact definition.** Is Voronota-LT contact area > 0 the positive label, or is a minimum area/cutoff applied?

Do not include team-private information in the post.
