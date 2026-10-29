---
queen: q3_assay_ngs_ground_truth
king: king_world
workers_completed: 6/6
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- The AVIDa-hHER2 "binder" label means only "this clone's read share rose after one panning round against whole HER2 ECD". It says nothing about where on HER2 the clone binds; it is weak, noisy epitope supervision.
- Label noise is substantial but derived, not measured: ~10-40% false positives among binders and 30-60% of truly specific clones missed. The real table is gated (HF 401), so nothing was measured on it.
- The ground truth is Voronota-LT residue contacts with area > 0; antigen positives are ~9-13% of residues, with a 4-9% replicate flip rate, so even a perfect predictor tops out near PR-AUC 0.92-0.97 and 3 complexes give a CI about 0.18 wide.
- Chance PR-AUC is ~0.03-0.05 on the antigen and ~0.2-0.3 on the VHH (estimates): the VHH side is where scores will be won or look inflated.
- Best design lever: treat Not/non-significant as unlabelled (PU learning), and use the area-weighted metric's robustness as a confidence tier.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. Gated SEPIQ card: 1,843,875 unique VHH, 626 MB; columns #ONU ID, Total, Sequence, Label (Yes/Not/noise/non-sig.), Binary Label, Cluster (USEARCH 93%), Cluster size, Background/Target IE-score; sublibraries include negative controls and trastuzumab/pertuzumab/RabMAb competition (Mother Library B only). (avida_hher2..., 8 sources; medium; card seen through a fetch-tool summary, not exact quotes.)
2. Label = two-proportion z-test (Z^2 = 2x2 Pearson chi-squared, no Yates), singletons dropped, increase + p<=0.05 = binder; hIL6 uses min-p over 12 sublibraries with no multiplicity correction; hIL6 validation 10/10 binders confirmed (exact 95% lower bound on precision ~69%). (ngs_read_count..., avida..., 9 sources; medium-high for hIL6, hHER2 inferred.)
3. The test is invalid below ~10 combined reads; simulated false-binder rate 7-10% at 3-4 reads, 5-15% with PCR over-dispersion; PPV 25-95% at 1-5% prevalence. Share of real labels violating Cochran's rule: unmeasured. (ngs_read_count..., simulation; medium.)
4. Phage artefacts: parasitic clones, display/expression bias (rho 0.88 in one scFv study), tag binders (His, GACQ); round 1 has the lowest signal-to-background; abundant clones are favoured. No published fraction for VHH. (phage_display..., 6 sources; medium.)
5. Voronota-LT: radical tessellation, probe 1.4 A; area > 0 means contacts can be 4-6 A apart (Tyr351-Tyr109 example 5.64 A, 1.12 A^2). Antigen positive fraction 13.2% / 11.3% / 9.5% for area>0 / >=5 A^2 / d<4 A over 24 pairs; HER2 5MY6 only 3.8%. Robust core 70% of positives, 92% of area. (voronota_lt..., 13 sources, own run; medium-high; effective n below 24 because of asymmetric-unit copies.)
6. Cryo-EM: no resolution/fiducial/glycan policy disclosed; 9MTX (3.06 A, HER2 ECD + nanobody, no fiducial) had only 510/752 deposited residues modelled; 6OGE 4.36 A with two Fabs. Labels exist only for modelled residues. ~10-25% of antigen positives at risk (unverified estimate). (cryo_em..., 8 sources; medium.)
7. Evidence ladder: label is admissible as screening evidence of enrichment (PPV ~27% at 3% prior, est.) but fails "fit" for epitope; nominal FPR 2.5-5% is 10-30x the PCAST latent-print rate. (cross_domain..., 4 sources; medium-low.)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Law of evidence / burden of proof: survived. Gave the prosecutor's-fallacy framing and the cutoff-as-standard-of-proof insight (robust core vs marginal contacts).
- Healthcare screening (PPV): survived; yielded the numeric PPV band and the argument for PR-AUC.
- Forensic chain of custody: survived; located unmodelled nuisance variance at each handoff.
- Art restoration (density-backed vs model-built labels): partly died; final labels are a deterministic contact threshold, not a restorer's judgement.
- Ecology/screening/art lenses in the evidence worker: reasoned from general knowledge only, no sources; mostly relabel PU learning.

## Contradictions within my subdomain
- Site says "chi-squared, p<=0.05"; card suggests an IE-score cascade with a noise filter. Unresolved without the table.
- Phage worker gives 10-40% false positives; stats worker 5-15% (null clones) and PPV 25-95%; ranges overlap but rest on different assumptions.
- Voronota version: guideline names v1.1.479 / release v1.29.4602; worker used v1.1.497 / v1.29.4816.

## Gotchas for the modeler (what could silently fool us)
- Treating Not/non-sig. as true negatives, or the binder label as epitope-informative.
- Sub-10-read binder calls, min-p over libraries, and abundant-clone bias in labels.
- Tag binders (His/GACQ) and display-expression bias masquerading as binders.
- Local validation on 3 complexes is too noisy (CI ~0.18); VHH-side scores sit on a much higher chance baseline than antigen.
- The unweighted metric moves with the cutoff; the weighted one is near cutoff-proof. Organisers' hetero/glycan handling is unknown.
- Proxy sets must use area>0 labels, not 4 A cutoffs.

## Questions for other queens (name the queen)
- q4_challenge_intelligence: which metric is official (/detail vs /guideline)? Any disclosed hetero/glycan handling or resolution?
- q6_epitope_ml_methods: does any method exploit PU learning or competition sublibraries as domain signal?
- q7_data_representation_integration: can cluster co-enrichment or IE-scores serve as weak supervision?
- q8_compute_validation_execution: can proxy sets (PDB HER2-VHH, area>0) be assembled with a paired bootstrap?
- q1_her2_biology: which HER2 domains do the ONU clones likely target (competition with trastuzumab/pertuzumab)?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- The "this antibody sticks" labels come from counting which antibody sequences became more common after one fishing round, so they are noisy hints, not proof.
- They do not say where on the target protein the antibody grabs, which is exactly what the contest scores.
- The answer key is a 3D electron-microscope picture turned into a list of touching residues, and even a perfect guess cannot score perfectly because the picture itself is a bit fuzzy.

## Gaps I could not fill
- The gated hHER2 table (HF 401): labelled counts, read-count distribution, share of labels with <10 reads, whether the noise filter applies, and the dataset worker's Q4/Q7.
- Q-score vs resolution curve; EMRinger/MolProbity at 3 A; organiser cryo-EM details.
- Full texts of NAS 2009, confident learning and Cochran 1954 were not read.
- Titre/recovery numbers for single-round VHH panning; peer-reviewed Voronota-LT version unconfirmed.
