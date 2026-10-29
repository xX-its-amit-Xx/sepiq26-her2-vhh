---
title: B-cell epitope predictors (BepiPred-3.0, DiscoTope-3.0, SEMA 2.0, EpiPred, AbEpiTope-1.0) - state and limits
queen: q6_epitope_ml_methods
king: king_infer
worker: b_cell_epitope_predictors_bepipred3_discotope3_sema_abepitope_state_and_limits
tier: expert
tags: [epitope-prediction, BepiPred-3.0, DiscoTope-3.0, SEMA, EpiPred, AbEpiTope, PR-AUC, leakage, licences, nanobody]
confidence: medium
challenge_relevance: 3
serendipity: CASP "early plateau" lens - antigen-only epitope predictors sit at a data-defined ceiling (PR-AUC ~0.2 at ~6% prevalence); the "CASP14 jump" analogue is antibody conditioning, which the one tool that does it (AbEpiTope) has not yet shown at residue level. Analogy partly holds; it paid off as a concrete baseline-ceiling argument.
date: 2026-10-17
---

## TL;DR
No published B-cell epitope predictor has a residue-level PR-AUC on nanobody/VHH data. The best antigen-only structure-based tool (DiscoTope-3.0) reaches PR-AUC about 0.23 at about 6.4% prevalence on 24 antigens, which is only about 3.6x random. The one antibody-conditioned tool (AbEpiTope-1.0) reports no residue-level PR-AUC and probably excludes nanobodies. These tools are usable as weak priors (academic-licence caveats below), not as a winning Track A model.

## 1. Residue-level metrics table (everything below was read from the cited pages; otherwise NOT REPORTED)

| Method (paper) | Test set | N | Prevalence | ROC-AUC | AUC0.1 / AUC10 | PR-AUC | MCC |
|---|---|---|---|---|---|---|---|
| BepiPred-3.0 (Clifford 2022, Protein Sci, PMC9679979) | TS1 (PDB Ab-Ag) | 5 antigens, 971 res, 88 epi res | 0.256 | 0.738 | 0.165 | NOT REPORTED | NOT REPORTED |
| BepiPred-3.0 | TS2 (PDB Ab-Ag) | 15 antigens, 2,670 res, 209 epi res | 0.190 | 0.771 | 0.196 | NOT REPORTED | 0.332 |
| BepiPred-3.0 | IEDB linear set | 3,560 sequences, 8,818 epi res | 0.116 | 0.663 | 0.133 | NOT REPORTED | NOT REPORTED |
| DiscoTope-3.0 (Hoie 2024, Front Immunol 10.3389/fimmu.2024.1322712), AF2 input | external test | 24 antigen chains, 6,788 res, 436 epi res | ~0.064 (derived from counts) | 0.783 | NOT REPORTED | 0.232 +/- 0.02 | 0.227 |
| DiscoTope-3.0, solved input | same | same | ~0.064 | 0.795 | NOT REPORTED | 0.223 +/- 0.02 | 0.214 |
| DiscoTope-3.0 paper's comparators | same | same | ~0.064 | n/a | n/a | BepiPred-3.0 0.177 (predicted); SEMA 0.185 (solved) | n/a |
| SEMA 2.0 (Ivanisenko 2024, NAR, 10.1093/nar/gkae386) | 101 sequences; masked / unmasked | 101 | NOT REPORTED | 0.744 masked / 0.777 unmasked (1D+3D ensemble) | NOT REPORTED | NOT REPORTED (epitope task) | NOT REPORTED |
| EpiPred (Krawczyk 2014, Bioinformatics, 10.1093/bioinformatics/btu190, PMC4207425) | X-test 30 crystal complexes; H-test 15 homology-model complexes (from 148-complex SAbDab-nr) | 30 / 15 | NOT REPORTED | NOT REPORTED | n/a | NOT REPORTED | MCC reported, value not extracted |
| AbEpiTope-1.0 (Clifford 2025, Sci Adv, 10.1126/sciadv.adu1823, PMC12165000) | 1,730 Ab-Ag complexes (+109-complex "After" set) | 1,730 | NOT REPORTED | NOT REPORTED (residue-level) | n/a | NOT REPORTED | NOT REPORTED |
| ISPIPred / ParaPred-style | not opened | - | - | - | - | - | - (UNVERIFIED, not searched; ParaPred is paratope-side) |

Notes. EpiPred reports top-ranked-epitope recall/precision: X-test 44% recall at 14% precision versus random 23% (abstract); the Results text reverses recall/precision for random, so the paper is internally inconsistent. H-test: 16% precision, 47% recall. AbEpiTope reports interface accuracy at complex level (AbEpiScore-1.0 PCC 0.8036, mean AUC over 205 thresholds 0.9213 vs AlphaFold-2.3 0.5602 / 0.8900) and target-selection accuracy (AbEpiTarget rank-1 61.21% vs AF-2.3 42.08%). These are not residue PR-AUC.

## 2. Nanobody / antibody-conditioned status

| Tool | Antibody-conditioned? | Nanobody evaluated? | Published conditioned residue PR-AUC |
|---|---|---|---|
| BepiPred-3.0 | No, antigen sequence only (Ab input listed as future work) | No | none |
| DiscoTope-3.0 | No (authors say prior antibody-specific approaches have not clearly improved accuracy) | No | none |
| SEMA 1D/3D | No per-antibody model; "Fab regions of immunoglobulins" propensity | Not stated | none |
| EpiPred | Yes (antibody+antigen structures) | Not stated; SAbDab complexes | none (recall/precision only) |
| AbEpiTope-1.0 | Yes (AF2.3-multimer complex + inverse folding) | Probably not: each antibody required VH+VL (inferred; paper does not say; README does not mention nanobodies) | none (complex-level IoU/PCC only) |

Bottom line: published antibody- or nanobody-conditioned residue PR-AUC with prevalence is NOT REPORTED for every tool examined. Useful baselines for SEPIQ must be built in-house on SAbDab-nano.

## 3. HER2 leakage

Targets: 1N8Z (trastuzumab-HER2), 1S78 (pertuzumab), 6OGE, 7MN8, 8GZ5 (note: BRIEF uses 8GZ5 as an RBD-VHH proxy, not HER2; I did not verify it as HER2).

| Tool | Training data | Overlap with HER2 ECD complexes | Status |
|---|---|---|---|
| BepiPred-3.0 | PDB Ab-Ag crystals deposited before 2021-09-29, res <3 A, R <0.3; 1,466 antigens, 358 after 50%-ID collapse (BP3C50ID) | 1N8Z and 1S78 (pre-2021) very likely in the raw set; 6OGE/7MN8 depend on dates and collapse; test sets removed >20% identity to test only | UNKNOWN (likely YES for older HER2 entries). I did not check identity to P04626 or the FASTA files. |
| DiscoTope-3.0 | 582 BepiPred-3 structures, 1,466 chains; 1,125 train/281 val after removing >20% identity to BP3 test | Inherits BP3 PDB cut-off; likely contains HER2 ECD chains from pre-2021 entries | UNKNOWN (likely YES) |
| SEMA 2.0 | 1,544 PDB sequences (PDB to 2023-12-28), BLAST filter >30% vs test | HER2 entries through 2023 plausibly included | UNKNOWN (likely YES) |
| EpiPred | SAbDab-nr 2014 | 1N8Z/1S78 could be in set (pre-2014); not checked | UNKNOWN |
| AbEpiTope-1.0 | PDB <2023-02-02, 1,733 complexes, partitions at 65% antigen identity | HER2 complexes likely included | UNKNOWN (likely YES) |

Implication: because the three HER2 ECD epitopes in the challenge are on the same antigen that has trastuzumab/pertuzumab sites in training, any of these tools is likely to put high scores on domains II and IV (the known mAb sites), not necessarily the VHH sites. Per BRIEF, leakage is permitted by the rules, but it inflates any retrospective validation on known HER2 complexes. A real identity check against P04626 needs the DTU training FASTA downloads (not done).

## 4. Licences, availability, runtime

| Tool | Licence (what I could verify) | Web vs local | Runtime |
|---|---|---|---|
| BepiPred-3.0 | DTU server page states no licence; software download 3.0b (source) listed. Treat as academic/non-commercial UNVERIFIED | DTU server (max 50 seq, 300k aa, 10-6000 aa, truncates past 1,023 aa) + BioLib + local | "a few minutes per sequence" (server page) |
| DiscoTope-3.0 | Code under "Creative Commons license in LICENSE file" (variant not seen; LICENSE fetch 404); weights `models.zip` no separate terms; DTU server free for academic use | DTU + BioLib + GitHub (Magnushhoie/discotope3_web) | <1 s per chain on GPU plus ~15 s load; CPU fallback above 1000 residues |
| SEMA 2.0 | Repo shows an MIT notice carrying "Copyright 2016 AYLIEN" and no LICENSE file: ambiguous; weights availability unstated | sema.airi.net free, no login; local code via setup.sh (needs Foldseek for 3D) | NOT REPORTED |
| EpiPred | No licence stated; from Oxford stats.ox.ac.uk resources page | server/download (availability not rechecked) | NOT REPORTED |
| AbEpiTope-1.0 | "freely by academic groups for non-commercial purposes"; for-profit needs a licence from M. Nielsen | DTU server (up to 100 files) + GitHub mnielLab/AbEpiTope-1.0 | "hundreds of structures in minutes"; needs Python 3.9, PyTorch/PyG/CUDA stack |

Competition-entry usability. SEPIQ Track A rule (BRIEF) allows only public external data and requires documentation of inputs. Running any of these tools is code, not data; the output is derived from public PDB data. Academic non-commercial licences are compatible with an academic prize entry in my reading, but a company team or a for-profit prize claim could breach DTU terms; this is a judgment, not legal advice. Verdict: usable as a documented feature (medium risk for DiscoTope-3/BepiPred-3/AbEpiTope under DTU terms; SEMA licence unclear). Do not ship model weights.

## 5. Predicted structure input
- DiscoTope-3.0 supports `--struc_type alphafold` (flags AF structures, reads pLDDT). Paper: predicted vs solved PR-AUC 0.232 vs 0.223, ROC-AUC 0.783 vs 0.795, MCC 0.227 vs 0.214. Predicted input is not worse, partly because training used pLDDT-filtered AF2 models (mean pLDDT >=85). No AF3, Boltz-2 or OpenFold3 testing is reported; these models can be fed as ordinary PDB/mmCIF-converted-to-PDB, but pLDDT must live in the B-factor column. Using `alphafold` flag for a Boltz/AF3 model is untested (my inference). Multi-chain mode is "unsupported and untested", and per-chain processing ignores the antibody.
- AbEpiTope-1.0 trained and evaluated on AlphaFold-2.3 multimer models of true and swapped complexes. AF3, Boltz-1, Chai-1 are named only as future directions. README states rigid-body docking models are not expected to score well. Requires VH+VL (or scFv); nanobody support unstated, so a VHH-HER2 model may fail or be misparsed (untested).
- SEMA takes experimental PDB/uploaded structures; predicted-structure evaluation not reported.

## 6. Output and mapping to 0-1 prediction

| Tool | Per-residue output | Mapping to 0-1 |
|---|---|---|
| BepiPred-3.0 | Per-residue epitope probability in CSV (+ smoothed); default threshold 0.1512 (max-MCC) | Use raw score; rank-normalise across HER2 ECD to spread values; the model is calibrated to ~13% prevalence |
| DiscoTope-3.0 | Raw score and calibrated score (CSV; raw column documented 0.00-1.00 in README); thresholds on calibrated: 1.50 (~30% recall), 0.90 (~50%, default), 0.40 (~70%) | Calibrated scores exceed 1, so rank-percentile or min-max; the paper evaluates with rank scores too; PR-AUC is rank-invariant, so any monotone map is fine |
| SEMA | per-residue score CSV | min-max |
| AbEpiTope | AbEpiScore/AbEpiTarget per complex plus interface.csv (residue lists); per-residue scores not documented in README | not directly a residue probability |

Since PR-AUC depends only on ranking within each complex, the 0-1 mapping is a formatting issue; omitted residues = 0 is a risk if the entire ECD is not listed.

## Forced analogy: CASP history, "the early CASP plateau"
(a) Pre-AF2 CASP template and fragment methods plateaued at a ceiling set by what the evaluation data could reward; here the ceiling is antigen-only features. A single antigen has a large epitopic surface and many antibodies hit different parts; an antigen-only predictor effectively returns "which residues are surface-accessible and immunogenic across all antibodies". DiscoTope-3.0 PR-AUC 0.23 at 6.4% prevalence (3.6x enrichment), BepiPred-3.0 0.177, SEMA 0.185 are one plateau band; ROC-AUC 0.74-0.80 across all tools is the same band.
(b) Testable idea: the missing "CASP14 jump" is conditioning on the antibody. Test on SAbDab-nano: compute per-complex residue PR-AUC of (i) DiscoTope-3 on HER2 only, (ii) the same restricted to residues within a docked AF3/Boltz VHH footprint, (iii) the union of top-scoring structure-prediction contacts. If (ii) beats (i) by a wide margin, antibody conditioning is the lever. For SEPIQ, an ensemble of DiscoTope-3 prior x docking-model contact consensus over many seeds is the closest analogue.
(c) Verdict: partially holds. It holds for the data-defined ceiling (antigen-only tools cannot know which antibody) and for the lack of nanobody-specific benchmarks. It breaks because epitope data are far smaller than CASP structures and prevalence/definition (4 A heavy atom vs Voronota-LT areas) differs, so the "jump" cannot be assumed from antibody conditioning alone; AbEpiTope has not shown a residue-level jump.
Single missing information source: BepiPred-3.0 and SEMA lack 3D structure; DiscoTope-3.0 lacks the antibody; EpiPred lacks language-model/inverse-folding features and a modern training set; AbEpiTope lacks nanobody training data and an explicit per-residue score.

## Gotchas / what could fool us
1. Prevalence differs by test set: BP3 TS1 25.6%, TS2 19.0%, DiscoTope-3 6.4%, SEPIQ proxy 8GZ5 ~12.6%. PR-AUC values are not comparable across papers. The random PR-AUC baseline equals prevalence.
2. DiscoTope-3's 0.232 is on 24 antigens with +/-0.02; differences of 0.01-0.05 between tools are within noise.
3. Epitope = 4 A of any antibody heavy atom (DiscoTope-3/BP3 style) vs Voronota-LT contact area for SEPIQ; positives differ for edge residues.
4. "Any antibody" labels merge epitopes across antibodies (BP3 collapsed at 50% identity) so the label is union of binding sites; a VHH has a single site, so the SEPIQ prevalence is much lower than the union.
5. HER2 ECD complexes (1N8Z, 1S78, 6OGE, 7MN8) likely sit in training, so retrospective HER2 scoring is optimistic.
6. DiscoTope-3 batch and size limit statements are inconsistent in docs (50 vs 100 files). DiscoTope-3 paper has inconsistent test set dates (Oct 2022 vs after April 2021).
7. DiscoTope-3 processes chains separately; HER2 is a single chain, but glycans and the construct's C-terminal GACQ/His tag affect numbering.
8. AbEpiTope name appears as "AbEpiTarget-1.0" for the target-prediction score; do not mistake it for a residue epitope predictor.
9. BepiPred-3.0 server truncates sequences past 1,023 aa; HER2 ECD (~630 aa incl. signal) is fine.
10. Reviews contain errors (one review calls BepiPred-3 "older"); I trust only primary pages I opened. Several publisher pages (Wiley, Science.org) returned 403; BepiPred-3 numbers came from PMC9679979.

## Implications for the challenge
1. Treat DiscoTope-3.0 (AF/Boltz HER2 model) and BepiPred-3.0 as weak priors (expected PR-AUC ~1.5-3x prevalence), not as the main model.
2. Build own nanobody-conditioned baseline on SAbDab-nano with prevalence-matched PR-AUC, since no published number exists.
3. Combine a DiscoTope-3 prior with multi-seed AF3/Boltz/OpenFold3 VHH-HER2 contact frequency; evaluate on held-out HER2-VHH complexes if any public ones exist.
4. Use rank-normalised scores in [0,1] and list every ECD residue; document tool, version, struc_type and licence in the submission.
5. Check licence (DTU academic-only, unverified for BepiPred/DiscoTope weights) before using in a team with commercial members.
6. Run a real identity check of training FASTA (DTU downloads) against P04626 to settle leak status.

## Open questions
- Exact CC variant in DiscoTope-3.0 LICENSE; BepiPred-3.0 licence text.
- Do the BP3/DiscoTope-3 training FASTAs include P04626-like chains (1N8Z, 1S78, 6OGE, 7MN8)?
- Does AbEpiTope accept a VHH (single heavy chain) input?
- ISPIPred/ParaPred numbers not collected.
- Runtime of BepiPred-3 per 600-residue ECD not measured.

## Sources
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9679979 (BepiPred-3.0, Protein Sci 2022; doi 10.1002/pro.4497)
- https://www.frontiersin.org/journals/immunology/articles/10.3389/fimmu.2024.1322712/full (DiscoTope-3.0)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12165000/ (AbEpiTope-1.0, doi 10.1126/sciadv.adu1823)
- https://academic.oup.com/nar/article/52/W1/W533/7671315 (SEMA 2.0)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4207425/ (EpiPred, Krawczyk 2014)
- https://github.com/Magnushhoie/discotope3_web ; https://github.com/mnielLab/AbEpiTope-1.0 ; https://github.com/AIRI-Institute/SEMAi
- https://services.healthtech.dtu.dk/services/BepiPred-3.0/ ; https://services.healthtech.dtu.dk/services/DiscoTope-3.0/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12908366/ (review, secondary)
