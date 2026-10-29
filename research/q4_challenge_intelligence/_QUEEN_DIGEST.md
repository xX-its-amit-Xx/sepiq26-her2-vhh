---
queen: q4_challenge_intelligence
king: king_world
workers_completed: 5/5
date: 2026-10-17
---
## TL;DR (5 bullets a chief of staff would read)
- Targets are exactly three: ONU11, ONU13, ONU23. The home page "seven" is stale; the HF Space says ONU24 and ONU429 were withdrawn.
- Track A closes 2026-10-31 (14 days left); no extension notice exists, though an extension clause does. Plan the final upload for 2026-10-30.
- The Space has no scoring code, returns no score, has no leaderboard and enforces no 5-submission cap; it checks only 4 CSV header names. Local validation is our only safety net.
- Macro PR-AUC over n=3 is largely a lottery between near-equal teams (a modestly better method wins ~58-61% in simulation). Only a clearly better method (gap >= 0.15) wins reliably.
- The 0.176 baseline is an organiser adaptation on a SARS-CoV-2 proxy (8GZ5, base rate 0.126), not a published AntiBinder result.

## New concrete facts (numbered; each with file + source count; mark confidence)
1. HER2 construct = UniProt P04626 1-624 + His6, offset 0; "GACQ" is native 621-624, not a tag; signal peptide 1-22 is included. (sepiq_guideline_detail file, 8 sources; high)
2. Printed VHH lengths: ONU11 127, ONU13 127, ONU23 135 including His6; the BRIEF.md "ONU23 = 130 aa" is a numbering artefact (VHH proper 129). (same file; high)
3. All four sepiq.uk pages share a 2026-09-01 build stamp; verbatim capture is in research/_meta/sepiq_verbatim.md. (same file; high)
4. PR-AUC (macro over 3, unweighted and area-weighted) is defined only on /guideline; which variant ranks is not stated. The bootstrap resamples residue indices (B=2000), not complexes. (prior_nanobody_antibody_prediction_competitions file, 35 sources; medium-high)
5. Space/dataset: template CSVs gated (401); file sizes fit chain A 1..618 and chain B 1..127 (ONU11/13) or 1..135 (ONU23). Chain A 618 vs 630 unresolved. (hf_space file, 12 sources; medium)
6. AntiBinder paper has no trained epitope/paratope output and no 8GZ5 mention; "folding from binding" is defined only as a testable hypothesis on /guideline; no AVIDa-hHER2 paper found. (antibinder file, 12 sources; medium, pages read through a lossy summariser)
7. Public HER2-VHH proxy structures: 5MY6, 7QVK, 9MTE, 9MTX (plus 8GZ5 for the baseline proxy). (prior_competitions file; medium)
8. Only epitope-informative signal in the HF card: competition sublibrary columns (Trastuzumab, Pertuzumab, RabMAb). (hf_space file; medium, domain mapping from memory)
9. Track B (CAPRI/DockQ/CAPRI-Q): round number, models per target and EMDB release of ONU entries are unconfirmed. (capri file, 9 sources; low-medium)

## Forced analogies — what the cross-domain lens produced (keep the duds too, say why they died)
- Forensic chain of custody (exhibit register for web pages): paid off twice, exposing the stale home page and the fact that the uploader checks only headers.
- Art restoration (NGS = over-painted original, cryo-EM = canvas): modest; a useful framing (inference vs model-prior inpainting) but only one testable idea.
- Healthcare screening / leaderboard luck: paid off strongly via simulation of winner probability at n=3.
- CASP/CAPRI history: epitope placement is all-or-nothing and consensus beats ipTM ranking; actionable.

## Contradictions within my subdomain
- Home page "seven antibodies", June start and DockQ vs /detail and /guideline (three; Sept-Oct; PR-AUC). Resolved: home page is stale.
- /detail does not name the leaderboard metric; /guideline does. Unresolved: which variant ranks.
- Chain A length: 618 (file-size inference) vs 630 (printed construct).
- Rules say max 5 submissions, the Space enforces no cap; whether best or last counts is unknown.

## Gotchas for the modeler (what could silently fool us)
- The portal accepts anything with correct headers; a wrong seqNum or resName silently scores badly. Build a validator against the sequences.
- Tags, signal peptide and residues outside the cryo-EM model likely have zero truth; set tag residues to 0.
- Pooling chains A and B may let the easier paratope side dominate; calibrate both.
- Residue noise in the simulations is independent; real errors are spatially clustered, so true uncertainty is larger.
- Labels are enrichment-derived (IE-score), not biophysical; ranking by ipTM alone is unreliable.

## Questions for other queens (name the queen)
- q3_assay_ngs_ground_truth: can the gated table be inspected to confirm ONU11/13/23 rows and chain A length 618 vs 630?
- q6_epitope_ml_methods: does a competition-bin representation beat chance on 5MY6/7QVK/9MTE/9MTX/8GZ5?
- q8_compute_validation_execution: build the local CSV validator and a leave-one-complex-out proxy league; budget multi-seed AF3/Boltz/OpenFold3 runs within guardrails.
- q5_structure_prediction_docking: is consensus interface frequency over many seeds a good per-residue probability (CASP16/H1244 lesson)?

## Layman sentences — 3 sentences a non-scientist could repeat about my subdomain
- The contest asks teams to guess, for just three nanobody-cancer-protein pairs, which amino acids touch each other, and a lab later reveals the answer by imaging.
- With only three test cases, the winner may be partly luck unless one method is clearly better than the rest.
- The submission website only checks that a file is formatted correctly; it never tells you your score.

## Gaps I could not fill
- Template CSV contents and row counts (gated, 401).
- Whether best or last of five submissions counts; which PR-AUC variant ranks; CAPRI round number; any EMDB/PDB release of the ONU complexes.
- AntiBinder supplement (8GZ5 mention) not read; the paperclip CLI was unavailable to workers.
