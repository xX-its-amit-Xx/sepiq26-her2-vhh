---
title: Five-submission ladder and bootstrap decision rules at n=3
queen: q8_compute_validation_execution
king: king_infer
worker: five_submission_ladder_and_cluster_bootstrap_decision_rules_for_n_equals_3
tier: expert
tags: [track-a, scoring, pr-auc, bootstrap, power, submission-ladder, decision-rule, empirical-bayes, compliance]
confidence: medium
challenge_relevance: 5
serendipity: Baseball batting average over 3 games and tournament brackets - shrinkage and a stop-loss rule paid off as concrete decision rules; the Elo-ladder part broke because the portal returns no scores.
date: 2026-10-17
---

# Five-submission ladder and bootstrap decision rules at n=3

## TL;DR
The Space's own code shows **the portal returns no score after a submission** (only a confirmation of team, user, the three targets and a UTC time), and the leaderboard tab is static text with rankings planned for 1 Dec 2026. So the five submissions are **checkpoints, not experiments**: all model selection has to happen on a public proxy set before submitting. A Monte Carlo of n=3 says that, even in the optimistic test-set-conditional case, a paired difference of roughly **0.09-0.11 absolute macro PR-AUC** is needed for about 75% power. Prefer the simplest robust arm unless a pre-registered margin is met.

## 1. Scoring, as far as it can be pinned down
Caveat: WebFetch returns a model summary of each page, not verbatim text. Re-check the live pages before relying on any detail.

| Item | What the sources say | Status |
|---|---|---|
| Unit | One CSV per complex (ONU11, ONU13, ONU23): `chain, seqNum, resName, prediction`, values 0-1; omitted residues = 0 | clear |
| Chains | Chain A = HER2 antigen (UniProt P04626 numbering incl. signal peptide), chain B = VHH (sequential index) | clear |
| Ranking metric | Per-complex PR-AUC, macro-averaged over 3 antibodies; residues "will not be pooled across all antibodies" | clear |
| Variants | Unweighted PR-AUC and area-weighted (recall = TP_area / P_area, ordinary precision); weights are Voronota-LT per-residue contact areas | clear in principle |
| Chain A vs B within one complex | Not specified: one PR curve over A+B pooled per complex, or two curves averaged? | **ambiguous** |
| Bootstrap | B=2000, residue indices resampled with replacement, same indices for all antibodies and both teams, 95% percentile interval, empirical p-value; ranking text elsewhere says "cluster bootstrap test" | **ambiguous** (residue vs cluster) |
| Which variant ranks | /detail names PR-AUC only for the baseline, gives no leaderboard formula | **ambiguous** |
| Leaderboard | Space code: Leaderboard tab is static Markdown, loads no scores; text says ranking release 1 Dec 2026, team names only. /detail: no leaderboard mechanics | no live leaderboard found |
| Results date | 2026-12-15 (/detail) vs ranking release 1 Dec 2026 (Space) | minor conflict |

**Is feedback shown after each of the 5 submissions?** From `app.py`: the success message shows team, username, three targets, UTC time; no score or evaluation feedback is returned. /detail says the limit of five exists "to reduce leaderboard probing", implying a hidden-score design. So: no feedback unless organisers add it.

Other portal facts from `app.py`: sign-in with HF required (OAuth); all three CSVs required in one submission; only the header is validated (not the 0-1 range); the five-submission limit and the Oct 31 deadline are **not enforced in code**. Treat both as enforced by humans at judging and self-limit to exactly five.

Space discussion #1: on Aug 28 an organiser (hiroyuki-code) wrote the Track A deadline would be postponed by one to two months, consistent with 2026-10-31. Later replies are about gated dataset access only.

## 2. Overwritten or best-of-five?
Code: each submission goes to a new folder `<team>/<user>/<UTC timestamp>/prediction_<clone>.csv` in dataset `sepiq-2026/SEPIQ-2026-submissions`; the app never overwrites or deletes. Storage keeps all attempts; **which one is scored is not stated anywhere I could open.** Possibilities: (L) latest counts, (B) best of five by score, (N) team-designated or all scored.

Decision trees (S5 = last upload):
- Under L: S5 must be the final candidate; S1-S4 are insurance only.
- Under B: diversity helps; S1-S4 should be distinct bets, S5 the safe best guess.
- Unknown (now): S5 = the pre-registered final choice (right under L, fine under B); S2-S4 are informative variants rather than near-duplicates of S5. That costs nothing under L and helps under B.

Question to post on the Space Community tab: *"For Track A, if a team uploads several times (max five), which upload is scored: the most recent, the best by score, or a team-designated one? Will any score or rank be visible before 15 Dec? Is the ranking metric unweighted PR-AUC, area-weighted PR-AUC, or a combination, and are chain A and B residues of a complex pooled into one PR curve? Does the confidence test resample residues or clusters (and what is a cluster)?"*

## 3. Monte Carlo: what gap is detectable at n=3
Code: `research/q8_compute_validation_execution/_mc/mc.py` (numpy installed to `C:\Temp\sepiq26\pylib`; 3.3 min; CPU 2% and C: 62 GB free beforehand).

Setup: 3 complexes, 330 residues each (A+B pooled), prevalence 0.12, positives in contiguous patches of 6, binormal scores with d'=1.2 for model A and A+gap for model B, residue-noise correlation 0.6 between models, optional shared patch-level noise (SD 0.7). Paired bootstrap of the macro PR-AUC difference (average precision; B=300 inner, 150 outer sims per cell); significant if lower 95% limit > 0.

| Bootstrap | Patch noise | d' gap | True mean macro dPR-AUC | SD of observed gap over test draws | Power |
|---|---|---|---|---|---|
| residue | 0 | 0 | 0.00 | 0.038 | 0.01 (false positive) |
| residue | 0 | 0.3 | 0.108 | 0.041 | 0.74 |
| residue | 0 | 0.5 | 0.181 | 0.043 | 0.99 |
| patch-cluster | 0 | 0.3 | 0.108 | 0.042 | 0.76 |
| residue | 0.7 | 0 | 0.00 | 0.030 | 0.04 (false positive) |
| residue | 0.7 | 0.3 | 0.086 | 0.032 | 0.74 |
| patch-cluster | 0.7 | 0.3 | 0.087 | 0.035 | 0.75 |
| patch-cluster | 0.7 | 0.5 | 0.143 | 0.038 | 0.99 |
| complex-cluster (3 clusters) | 0.7 | 0 | 0.00 | - | **0.14 (false positive)** |
| complex-cluster (3 clusters) | 0.7 | 0.5 | 0.147 | - | 0.98 |

Reading (base PR-AUC of A was about 0.35-0.42 here, higher than the 0.176 AntiBinder proxy; a lower base shrinks the gap for the same d'):
- **Smallest detectable gap at about 75% power: 0.09-0.11 absolute macro PR-AUC**; 80% power about 0.10-0.12; 0.15+ near-certain. Gaps below about 0.05 cannot be told from noise.
- Patch clustering barely changed power here because 8-residue blocks and a simple noise model were used; real contact patches are larger, so treat this as a lower bound on inflation.
- **A complex-level cluster bootstrap with 3 clusters is degenerate**: only 10 distinct resamples exist and the null false-positive rate was 0.14 against nominal 0.05. If organisers literally cluster by complex, close results cannot be resolved properly.
- This power is conditional on one fixed test set. If true per-complex gaps vary with SD 0.05-0.15, the SD of the 3-complex mean gap is 0.03-0.09, and a population-level detectable gap is about (1.96+0.84) x SE = 0.08-0.24 (analytic, not simulated). Luck of the draw can reorder any two close arms.

## 4. The ladder (all by 2026-10-31; today 2026-10-17)
S5 stays unspent until 2026-10-30.

| Rung | Date | Content (change vs previous) | Advance criterion (proxy set) | Kill / revert criterion |
|---|---|---|---|---|
| S1 safe baseline | 10-20 | Sequence prior (antigen domain-aware prior; VHH CDR/paratope prior from public VHH structures) plus co-fold contact map (AF3-class, OpenFold3, Chai-1 or Boltz output reduced to per-residue interface scores), simple mean | Proxy macro PR-AUC >= random + 0.05; valid format on all 3 CSVs | Not above random: still submit as a format/rule smoke test, then treat the proxy set or co-fold step as broken |
| S2 + NGS feature | 10-24 | Add one NGS-derived per-residue feature (e.g. enrichment/convergence of CDR motifs) to S1 | Raw gain >= 0.03, bootstrap lower CI > 0, positive in >= 2/3 of proxy complexes | Gain < 0.03 or sign flips across complexes: drop the feature, S1 stays incumbent |
| S3 ensemble | 10-27 | Rank or logit average of surviving arms plus a second co-folder | Beats best single arm by >= 0.02, or ties within noise (kept for robustness), no complex worse by > 0.03 | Worse than best single arm by > 0.02: revert to that arm |
| S4 calibrated | 10-29 | Calibrate (leave-one-complex-out isotonic/Platt, prevalence shrink), omit very low scores as 0 | Both unweighted and area-weighted macro PR-AUC not worse than S3 | Any drop > 0.01, or < 3 proxy complexes to calibrate on: skip, keep S3 |
| S5 reserved hedge | 10-30/31 | Spent only after the final-choice rule (section 6); default content is the chosen final arm, or the fix for a rung that failed format/rules | Final arm selected by the rule | Never use for an untested idea |

Stop-loss (resting the starter): if two consecutive rungs fail their advance criterion, freeze at the incumbent, spend no more compute on features, and use the remaining days on compliance docs and a proxy-set audit.

## 5. Day-by-day runbook
| Date | Named deliverable |
|---|---|
| 10-17 | Organiser question posted; `PREREG.md` committed before any proxy scoring |
| 10-18 | `proxy_manifest` frozen: public HER2/VHH complexes released BEFORE the test complexes were made, with release dates and a leakage audit |
| 10-19 | Co-fold runs on proxy plus ONU11/13/23 (Explorer public partitions or Boltz credits, <= 2 GPUs); scoring script reproducing both variants and both chain options |
| 10-20 | **S1 submitted**; `DOCS_S1.md` |
| 10-21 | NGS feature built, scored alone on proxy |
| 10-22 | S2 scored with bootstrap; advance/kill decision logged |
| 10-23 | Buffer / stop-loss day |
| 10-24 | **S2 submitted** (if killed, submit a distinct variant only if useful under B, otherwise keep the slot) |
| 10-25 | Second co-folder, ensemble code |
| 10-26 | Ensemble scored; shrunk arm-quality estimates |
| 10-27 | **S3 submitted** |
| 10-28 | Leave-one-complex-out calibration |
| 10-29 | **S4 submitted** |
| 10-30 | Final-choice rule applied; all DOCS complete; organiser reply checked; **S5 submitted this evening** |
| 10-31 | Spare day for portal failure (deadline timezone unverified) |

## 6. Pre-registered final-choice rule (no feedback)
Write before scoring:
1. Proxy set P of K public HER2 or VHH-antigen complexes released before the test complexes were created (K and dates recorded). Primary metric: unweighted macro PR-AUC (leave-one-complex-out for any fitted part); secondary: area-weighted.
2. A challenger replaces the incumbent only if (a) raw macro gain >= 0.05 on both variants, (b) paired bootstrap 95% CI lower bound > 0 (B=2000; cluster = complex if K >= 8, contact-patch blocks if K < 8), (c) positive in >= 2/3 of proxy complexes.
3. Shrink first: with proxy SE of a macro score about 0.04 (SD 0.1, K about 6) and a prior spread among arms of about 0.03, the factor is 0.0009 / (0.0009 + 0.0016) = 0.36, so a raw 0.05 gain is believed as about 0.02. Margin 0.05 is a floor, not a target. (Illustrative; recompute from the real proxy.)
4. Default when not met: simplest robust arm (S1, or the S3 ensemble if within 0.02 of the best, since averaging reduces variance).
5. Never choose the best of several noisy readouts; never retune after seeing the proxy gap.

## 7. Compliance by rung
| Rule | Applies to | Action |
|---|---|---|
| Public external data only (PDB, SAbDab-nano, AVIDa-hHER2) | all rungs | list every source with URL, ID and release date |
| Inputs and settings documented | all rungs | `DOCS_S1.md` to `DOCS_S5.md` |
| HF account sign-in | all rungs | submit from the team's registered HF account |
| Team <= 10, <= 5 submissions per team | all | self-limit to 5 total; consistent team name |
| Leakage from public data tolerated if answer correct | all | still state it honestly in each DOCS file |
| Residence/sanctions exclusions | team | check each member |

Each DOCS file lists: arm name, code version, model versions and seeds, external data with URLs/PDB IDs/dates, NGS subset used, omission/threshold rule, proxy results with CI, and the diff versus the previous rung. No official documentation template was found.

## Forced analogy: baseball batting average and tournament brackets
(a) Three complexes are like 3 games of a hitter's season: each arm's PR-AUC is a noisy rate, and the proxy set is the prior season. (b) Testable ideas: (i) empirical-Bayes shrinkage of each arm's proxy score toward the grand mean (factor about 0.36 above) and rank by the shrunk value; (ii) the two-failures stop-loss in section 4; (iii) a single-elimination bracket on the proxy set where the 0.05 margin is the incumbent's seed advantage. (c) Holds partly: shrinkage and stop-loss transfer directly. Elo breaks because Elo needs a result after every match and this portal returns none, so the matches must be played on the proxy set.

## Gotchas / what could fool us
- No feedback means no ladder: treating submissions as experiments teaches nothing.
- Proxy leakage: public HER2 VHH structures may share epitopes with the test clones, and the organisers say leakage is acceptable; proxy scores relying on close homologues overstate generalisation to ONU11/13/23. Say so in each DOCS file.
- Small proxy set (K about 5-10): SE about 0.03-0.05, and picking among 5 arms is a winner's curse.
- PR-AUC depends on prevalence: random baseline about 0.12 for the 8GZ5 proxy, lower for a whole HER2 ECD (about 630 residues); pooled A+B and separate A/B can rank arms differently.
- Omitted residues are 0: sparse predictions make ties at 0; area weighting favours large buried residues.
- Residue bootstrap ignores spatial correlation (anti-conservative); a 3-cluster bootstrap is degenerate.
- The app does not check the 0-1 range or team registration; validate locally. Two uploads within one second collide on one path.
- The Monte Carlo is a binormal toy; real score distributions are heavier-tailed. Treat 0.09-0.11 as order of magnitude.

## Implications for the challenge
1. Post the organiser question today and re-check on 10-30.
2. Commit `PREREG.md` before scoring anything.
3. Use S1 on 10-20 as a pipeline smoke test; interpret nothing from it.
4. Add a component only with >= 0.05 raw gain plus bootstrap and 2/3-complex consistency; otherwise keep the simpler arm.
5. Keep S5 for 10-30 and make it the final arm only.
6. Score both variants and both chain options; prefer arms winning under all.
7. Write DOCS_S1..S5 as specified.

## Open questions
- Latest vs best-of vs designated; pooled vs separate chains; residue vs cluster bootstrap; ranking variant; deadline timezone; whether score visibility is added later.
- Which public HER2-VHH complexes qualify for the proxy set (PDB IDs not enumerated here and unverified; see the validation-design worker file in this folder).

## Sources (opened)
- https://sepiq.uk/guideline (WebFetch summary)
- https://sepiq.uk/detail (WebFetch summary)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (page shell) and /raw/main/README.md (config only)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/raw/main/app.py (summary of code)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/discussions and /discussions/1
- Search only, not opened in full: https://arxiv.org/pdf/2205.03285, https://metricgate.com/docs/roc-cluster-correlated-bootstrap/ (no source found on PR-AUC under cluster bootstrap with < 10 clusters)
- Not opened, not cited for claims: Saito and Rehmsmeier doi 10.1371/journal.pone.0118432; gated HF training-data page.
