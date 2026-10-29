---
title: Day-by-day runbook to 2026-10-31, 5-submission ladder, failure-mode register, 2-hour fallback
queen: q8_compute_validation_execution
king: king_infer
worker: day_by_day_runbook_to_2026_10_31_and_failure_mode_register
tier: intermediate
tags: [runbook, premortem, submission-ladder, failure-modes, fallback, hugging-face, popper, falsification]
confidence: medium
challenge_relevance: 4
serendipity: Sports game-plan + Popperian falsification lens; it paid off modestly (4 decisions changed, listed in the verdict) but did not change the modelling plan.
date: 2026-10-17
---

# Day-by-day runbook to 2026-10-31

## TL;DR
Fifteen days (Sat 2026-10-17 to Sat 2026-10-31). The plan is: a 2-hour CDR/accessibility-prior submission uploaded on Oct 20 as insurance, then co-fold and NGS arms added only if they beat the prior on public leakage-free proxies, frozen Oct 28, QA'd Oct 29, with the real candidate uploaded Oct 29 and the reserve Oct 30 (deadline time zone is NOT stated anywhere, so treat it as the earliest plausible reading). The Space has no scoring and no leaderboard feedback, so the five-submission ladder is a hedge, not a probe.

## Verified facts that shape the plan (opened 2026-10-17)
| Fact | Evidence |
|---|---|
| Deadline time zone is not stated: /guideline fetch returned none, /detail says only "Sep 1 to Oct 31, 2026"; results Dec 15, 2026. | https://sepiq.uk/guideline , https://sepiq.uk/detail |
| /detail says organisers "will extend the duration" if SEPIQ/HF side has delays or technical issues. Space discussion #1: organiser (hiroyuki-code, Aug 28) said Track A deadline moves back 1-2 months (from Sep 15). Extension is plausible but must not be planned on. | /detail ; https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/discussions/1 |
| Submit tab: gr.LoginButton (HF OAuth required, session 480 min per README `hf_oauth_expiration_minutes: 480`); three CSV slots (ONU11, ONU13, ONU23); required columns `chain, seqNum, resName, prediction`; free-text team name; files renamed `prediction_{clone}.csv` and stored in private dataset `sepiq-2026/SEPIQ-2026-submissions` under `{team}/{user}/{UTC timestamp}`. | https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/raw/main/app.py (as summarised by WebFetch; code not read line by line by me) |
| The app does NOT check row counts, 0-1 range, team registration, deadline, or the 5-submission cap; uploads the 3 files in separate calls (partial failure can leave 1 or 2 files committed); leaderboard tab is static Markdown; it does not compute scores. | same |
| Training dataset `sepiq-2026/SEPIQ-2026-training-data` is gated (users asked for access in discussion #1; an organiser told one to re-authenticate). Access request is a day-0 task. | discussion #1 |
| Submission rule: max 5 per team; document inputs, inference settings, public external data (source + license); proprietary data forbidden; code not required. Residency exclusions: Crimea, DNR/LNR, Russia, Belarus, Cuba, Iran, Syria, North Korea, occupied Ukraine; sanctions by Japan/Ukraine/EU/UK/US; sponsor may demand proof of residency/identity; false info = disqualification. | /detail |
| Metric: /guideline (per BRIEF) = macro per-complex PR-AUC, weighted + unweighted. /detail says "two versions of PR-AUC (with and without weights) will be the primary evaluation measures" in the page text I fetched this session, but in another reading names no official metric (WebFetch summaries of the same page disagree). Conclusion: optimise macro PR-AUC, check both variants locally; contradiction unresolved. | /guideline, /detail |
| Which of the 5 submissions is scored (last? best? any?) is NOT stated. Unverified. Ask organisers via Space discussion on D01. | absent |

## Deadline time zone: recommendation
Unstated. Possible readings: Oct 31 23:59 in UTC, in AoE (UTC-12, ends Nov 1 11:59 UTC), in Japan/London local, or "window ends Oct 31 00:00" (exclusive). The server timestamps in UTC (app.py), so UTC is the only clock the platform has, but it does not enforce it. Earliest plausible end = Oct 30 23:59 UTC (if "to Oct 31" is exclusive). Rule: **final upload completed by Fri 2026-10-30 06:00 UTC** (>= 41 h before an Oct 31 23:59 UTC end, >= 18 h before the earliest plausible reading); the real candidate is uploaded Thu Oct 29 (>= 24 h earlier still). Post one polite question in discussion #1 on D01 asking for the zone and the scoring rule; do not rely on an answer.

## Runbook (all times UTC; owner W = worker agents, Q = queen q8)
GPU cap 2 at once, agents <= 8, Explorer public partitions only (`short`, `gpu`, `gpu-short`; never `gyorilab`/`Minkara_COMBINE_Lab`), check `squeue -A b.gyori`/`m.minkara` before each submit. Path prefix below: `research/q8_compute_validation_execution/runbook/`.

| Day | Date | Deliverable file | Owner | Compute launched | Go / no-go gate |
|---|---|---|---|---|---|
| D01 | Sat 10-17 | `D01_access_and_templates.md` (gated-dataset access request status, template CSVs hash, HF login test, question posted on discussion #1) | Q | none; 1-GPU smoke test on Explorer `gpu-short` (Boltz-2 or Chai-1 on one VHH) to measure real s/seed | GO if HF login works and templates downloaded. NO-GO escalation: no access by D03 -> build seqNum maps from sequences on /detail (verbatim, printed there) and UniProt P04626 |
| D02 | Sun 10-18 | `D02_numbering_maps.json` (ONU11/13/23: template seqNum -> sequence index; antigen P04626 numbering incl. signal peptide, residues 1-22) | W1 | CPU only | GATE: round-trip test, 100% template rows map to the right resName |
| D03 | Mon 10-19 | `D03_proxy_manifest.csv` **FROZEN**: 9MTX, 9MTE (released 2025-11-19, after engine cutoffs; clean), 7QVK, 5MY6 (in training sets; leakage-flagged), epitopes per Voronota-LT + 4 A rule from q1 JSON | W2 | CPU; Voronota-LT | GO when manifest hash committed. No later edits; additions only as separate file. Falsifier thresholds written (below) the same day |
| D04 | Tue 10-20 | `D04_baseline_pipeline_e2e.md` + `D04_S1_prior_{ONU11,ONU13,ONU23}.csv` + `D04_qa_report.txt` | W3 | CPU (scorer: macro AP, weighted AP, paired cluster bootstrap B=2000) | **Baseline end-to-end by Oct 20.** GATE: scorer reproduces proxy AP; CSVs pass validator. Upload S1 (2-hour fallback) to the Space this day |
| D05 | Wed 10-21 | `D05_cofold_launch.md`; `D05_proxy_arm_A_scores.csv` | W4 | GPU 1+2: Boltz-2 / Chai-1 / OpenFold3 on proxies first (20 seeds x 5 samples is the q5 plan; scale down to measured s/seed) | GO if one seed completes < 20 min; else cut to 8 seeds x 5 |
| D06 | Thu 10-22 | `D06_cofold_arm_A_ONU.csv` (first co-fold results for ONU11/13) | W4 | GPU: ONU11, ONU13 | GATE A1: arm beats prior by > 0.02 macro AP on proxies AND CI excludes 0, else bench |
| D07 | Fri 10-23 | `D07_cofold_arm_A_ONU23.csv` + `D07_ipSAE_contact_freq.csv` | W4 | GPU: ONU23 | Same gate. Seeds-split-half agreement logged |
| D08 | Sat 10-24 | `D08_arm_A_eval.md`; **S2 upload** (prior + co-fold blend if GATE A1 passed, else prior + footprint prior) | Q | none (GPUs free for NGS arm GPU embeddings if needed) | **First co-fold arm results Oct 22-24.** Upload only if candidate >= S1 on proxies |
| D09 | Sun 10-25 | `D09_ngs_feature_arm.csv`, `D09_ngs_eval.md` | W5 | CPU, pyarrow column subsets of 1.8 M-row table; <= 4 procs after headroom check | **NGS-feature arm by Oct 25.** GATE B1: adds > 0.01 to arm A or prior on proxies; else benched |
| D10 | Mon 10-26 | `D10_ensemble_candidates.csv` (weights fit by leave-one-proxy-out only), **S3 upload** (best 2-arm or 3-arm blend) | W6 | CPU | GO if blend >= best single arm on proxies (no gain -> upload best single arm) |
| D11 | Tue 10-27 | `D11_methods_note_DRAFT.md` (see checklist) + sensitivity sweep of blend weights | W7 | CPU / spare GPU for reruns | Note draft complete or no-go on any item not documentable |
| D12 | Wed 10-28 | `D12_ensemble_FROZEN.json` (weights, seeds, hashes) | Q | none | **Ensemble frozen Oct 28.** Frozen means no weight changes; only bug fixes |
| D13 | Thu 10-29 | `D13_final_{ONU11,ONU13,ONU23}.csv`, `D13_qa_signoff.md`; **S4 upload (the real candidate)** | Q + W3 | none | **Final CSVs QA'd Oct 29.** Validator checklist all green (see register) |
| D14 | Fri 10-30 | `D14_reserve_S5.csv` ; **S5 upload by 06:00 UTC**; methods note published to HF | Q | none | Reserve = hedge variant (below); upload only if no failure found in S4's stored files |
| D15 | Sat 10-31 | `D15_buffer_log.md` | Q | none | Buffer only. No new modelling; upload only to repair a confirmed broken stored file, and only if the window is confirmed still open |

## 5-submission ladder with kill criteria
Because the Space shows no scores, rungs are judged on local proxy metrics only. If the organisers confirm "last submission counts", re-order so the real candidate is last (S5 = S4 content). If "best counts", the ladder is as below.

| Rung | Date | Content | Kill / promote criterion |
|---|---|---|---|
| S1 safe baseline | Tue 10-20 | 2-hour fallback prior (spec below) | Never killed; it is insurance. Kill only if validator fails |
| S2 co-fold v1 | Sat 10-24 | prior blended with co-fold contact frequency | KILL (do not upload) if proxy macro AP < S1 or paired bootstrap CI includes 0 |
| S3 + NGS arm | Mon 10-26 | S2 plus NGS-derived features | KILL NGS component if D09 gate fails; upload S3 only if differs materially from S2 (rank corr < 0.95), else save the slot |
| S4 frozen candidate | Thu 10-29 | frozen ensemble | Promote as primary if >= every earlier rung on proxies |
| S5 hedge | Fri 10-30 | different design: lower-variance blend (co-fold arm shrunk 50% toward prior) for all-three-same-epitope risk | Upload only if S4 shows a stored-file defect or if proxy variance of S4 across split-halves is high; otherwise keep slot unused |

Where: Space App tab "Submit", HF login, three CSVs per submission; confirm each upload by checking the Files of the private dataset is not possible for us (private), so confirm via the success message and screenshot it into `D*_upload_receipt.png`. Note that the counter is not enforced by the code I read, so keep our own ledger `runbook/submission_ledger.csv` and do not exceed 5.

## Falsification pre-registration (Popper, written before any ONU result exists)
Hypothesis H: "folding from binding": weak binding-derived signal (NGS enrichment or co-fold from sequence alone) adds interface information beyond a structure-agnostic prior. With n=3 held-out complexes H cannot be confirmed, only fail to be refuted. Pre-registered refutations (on proxies, since ONU truth is unavailable until judging):
1. NGS-feature arm: macro AP gain over the prior <= 0.01, or paired-cluster-bootstrap 95% CI includes 0 -> H(NGS) refuted for our purposes; arm removed.
2. Co-fold arm: no gain > 0.02 on the clean proxies (9MTX, 9MTE) -> arm benched even if it beats prior on leakage-flagged ones (7QVK, 5MY6), since that gain is more likely memory.
3. Leakage ablation: gain disappears when templates are off or when scored on clean proxies only -> report as leakage, not signal.
4. On ONU itself: if the three co-fold predicted epitopes are the same patch while organiser data suggests otherwise, no way to tell now; hedge (S5).
Note the proxy set is also n=2 clean complexes: the falsification test is itself weak. State this in the methods note.

## Substitution rules (game-plan view)
A day's arm is "benched" if its gate fails, with no sunk-cost carry-over; its GPU slot goes to the next arm. Pre-agreed substitutions: Explorer queue stall > 6 h -> move that job to Modal/Boltz credits/Colab; Boltz credits out -> Chai-1/OpenFold3 on Explorer; AF3 weights not obtained -> drop AF3 (not on critical path).

# Failure-mode register
P = probability (L/M/H, my judgement, not measured), I = impact on final score.

| # | Failure mode | P | I | Early signal | Mitigation | Owner |
|---|---|---|---|---|---|---|
| 1 | HF Space upload errors / partial upload (3 separate upload_file calls) | M | H | error text, one file missing | upload by D08 early; retry whole triple; keep receipts; upload S1 early to test the flow | Q |
| 2 | Residue numbering offset (UniProt P04626 incl. 22-aa signal peptide vs mature) | H | H | proxy score near 0 after correct-looking model; template seqNum range mismatch | use the template CSV seqNum as truth; round-trip test D02; unit test on a known residue (e.g. glycosite N68 vs mature 46) | W1 |
| 3 | VHH sequential numbering treated as Kabat/IMGT | M | H | CDR3 predicted outside the chain; ANARCI numbers in the output | sequential only; map by index to template; assert resName equals template | W1 |
| 4 | His-tag / M / A / S extras scored or omitted wrongly | M | M | row count differs from template | template defines rows; omitted = 0; tag residues set to 0 | W3 |
| 5 | Chain labelling swap (A antigen / B VHH) | M | H | validator: resName not matching chain | validator checks chain-sequence compatibility per row | W3 |
| 6 | Explorer queue stall / public partition crowded | M | M | pending > 6 h | cap 2 GPUs, `short`/`gpu-short`; failover to Modal/Colab; fit to budget measured on D01 | Q |
| 7 | Boltz credits exhausted | M | M | credit balance after D05 | use credits only for ONU, run proxies on Explorer; Chai-1/OpenFold3 backup | W4 |
| 8 | AF3 weights unavailable | H | L | no approval by D03 | do not wait; q5: Boltz-2/Chai-1/OpenFold3 need no application | Q |
| 9 | Proxy leakage inflating scores (7QVK, 5MY6 in training sets) | H | H | clean-proxy (9MTX/9MTE) AP much lower than flagged proxies | gate on clean proxies only; templates-off ablation; state leakage honestly (the rules say public-data leakage is "not an issue as long as the answer is correct") | W2 |
| 10 | All-three-VHH-same-epitope assumption (shared prior or model collapses three outputs to one patch) | M | H | predicted antigen maps for 3 clones correlate > 0.9 | per-clone inference; S5 hedge; compare to q1 effective niches (~7.4) | W6 |
| 11 | Metric mismatch between /detail and /guideline | M | M | /detail names no official metric; /guideline lists two PR-AUC variants | report both locally; blend must not lose on either; ask organisers | Q |
| 12 | Extended-deadline rumour tempts delay | M | H | organiser comment dated Aug 28 only | plan to Oct 30; if extension is announced, still keep S4 uploaded | Q |
| 13 | Sanctions/residency eligibility problem for a team member | L | H | unknown | check every member against /detail list before first upload; sponsor can ask for proof | Q (user) |
| 14 | 3 test complexes dominated by one epitope (macro AP then decided by 1 complex) | M | M | proxy per-complex AP spread | no pooled metric; report per-complex; S5 low-variance | W6 |
| 15 | Gated training dataset access not granted | M | M | no email by D03 | the sequences on /detail and public PDB suffice for the prior and co-fold arms; only the NGS arm blocked (AVIDa-hHER2 is public elsewhere per brief, unverified here) | Q |
| 16 | HF OAuth session expires (480 min) mid-upload | L | M | login screen on Submit | re-login before each submission | Q |
| 17 | Score values outside 0-1 or NaN (app does not check) | L | H | validator | min/max/NaN assert | W3 |
| 18 | Ensemble over-fit to 2 clean proxies | H | M | weights drift with leave-one-out | weights restricted (<= 3 params), shrink to prior | W6 |
| 19 | Scorer is wrong (proxy PR-AUC miscomputed, weights misapplied) | M | H | cannot reproduce AntiBinder 8GZ5 baseline numbers (PR-AUC 0.176, base 0.126, per brief) | independent re-implementation by second worker | W3 |
| 20 | Methods note incomplete -> rule violation | M | M | note missing items on D11 | checklist below | W7 |
| 21 | Local resource trouble (C: or CPU headroom) when processing 1.8 M-row table | M | L | CPU > 75%, free < 5 GB | worker.md resource rule; column subset | W5 |

# Two-hour fallback ("from scratch in 2 h, baseline only")
Inputs: the three sequences printed on /detail; the template CSVs; one public HER2 ECD PDB structure (e.g. a Fab complex from RCSB; it is only used for surface accessibility, no ONU info).
Spec (scores 0-1; omitted residue = 0):
- **VHH (chain B)**: locate CDRs by sequence motifs on the printed sequences: CDR1 follows the "CAAS"/"CTAS" start region to "MGWFRQ"/"MGWYRQ"; CDR2 follows "EREFV"/"KQREFV"/"RDFVA" to "YADSVKG"-like motif; CDR3 between "YYCAA" and "WGQG". Scores: CDR3 residues 0.8, CDR1 0.5, CDR2 0.5, 2-residue flanks 0.3, framework 0.05, His tag 0. (This is a hand-made prior; CDR3-centered paratope is textbook for VHH. Its AP is UNVERIFIED; q5 quoted ~0.35-0.5 as unverified. Validate on 9MTX/9MTE in the first 20 minutes of the 2 h.)
- **Antigen (chain A)**: relative solvent accessibility from the PDB structure (extended ECD state) x domain weight (I 23-217: 1.0; III 342-510: 1.0; II 218-341: 0.5; IV 511-652: 0.3, from q1 epitope distribution), glycosylation sites (N68, N124, N187, N259, N530, N571, N629 per q5 UniProt) minus 0.3 within 3 residues. Expected antigen AP ~ 0.04-0.05 vs 0.024 base (q1, leave-one-niche-out); this is near-random, honest.
Time budget: 0:00-0:20 load templates + numbering map; 0:20-0:50 CDR + accessibility code; 0:50-1:20 score proxies for sanity; 1:20-1:45 write CSVs + validator; 1:45-2:00 upload + receipt. Expected macro PR-AUC unknown; the point is a valid file. Pre-build the script as `runbook/fallback_2h.py` on D04 so the 2 h shrinks to 20 min of rerun.

# Parallelism and critical path
Parallel under <= 8 agents / <= 2 GPUs: A) numbering maps + validator (CPU); B) proxy manifest + scorer (CPU); C) co-fold engine A on GPU 1; D) engine B on GPU 2; E) NGS feature arm (CPU, <= 4 procs); F) methods note drafting; G) literature/rules watch (discussion #1). Serial: manifest -> scorer -> arm gates -> blend fit -> freeze -> QA -> upload. Critical path: D02 numbering maps -> D04 e2e -> D05-D07 co-fold GPU runs -> D10 blend -> D12 freeze -> D13 QA/upload. **Single point of failure: the seqNum/resName mapping plus validator (one silent offset zeroes everything and the Space will not warn, since it checks only column names).** GPU access is not the SPOF: it has three fallbacks (Modal, Colab, Boltz credits).

# Document-for-rules checklist (methods note)
Draft D11 (Oct 27), final D14 (Oct 30), publish to HF (our own model/dataset repo or a Space discussion post; the Space has no code-upload field). Contents: (1) per-submission table S1-S5 with date and rung; (2) inputs: ONU sequences from /detail, template CSVs; (3) engines + version + seeds + settings; (4) external public data with accession IDs and license: PDB entries used (9MTX, 9MTE, 7QVK, 5MY6, HER2 structure for accessibility), UniProt P04626, AVIDa-hHER2 if used (cite its license after checking), SAbDab-nano if used; (5) numbering convention statement; (6) leakage statement (proxies 7QVK/5MY6 in training sets of engines; clean ones post-date cutoffs per q5); (7) statement that no proprietary data used; (8) eligibility affirmation; (9) pre-registered falsifiers and what they showed.

# Forced analogy: sports game plan + Popperian falsification
(a) A coaching staff writes the substitution rule before kickoff because in-game emotion biases against benching a favourite; Popper says a hypothesis earns credit only through a stated way of being wrong. Here: the "starter" arms (co-fold, NGS) are benched on pre-written thresholds. (b) Testable idea: pre-register the bench thresholds (done above) and measure the arm's gain on clean proxies only; additionally score "the prior" as the null team every arm must beat. (c) Holds partially: sports has many games, we have n=2 clean proxies and n=3 held-out cases, so statistical benching is noisy; it breaks on "play to learn": no leaderboard feedback exists.

# Verdict on the cross-domain lens
It changed four decisions versus a default plan: (1) the NGS and co-fold arms are removable by pre-written thresholds instead of being kept "for the ensemble"; (2) gating uses only the two clean proxies, not leakage-flagged ones that would favour the co-fold arm; (3) the ladder is treated as a hedge because no scores are returned, and a rung is skipped (slot saved) when it is not materially different; (4) the real candidate is uploaded Oct 29 rather than the day before the deadline. The modelling plan itself is unchanged. It cannot rescue n=3: no result on the held-out set will confirm "folding from binding".

# Gotchas
- The Space validates column names only; wrong numbering uploads cleanly and scores near random.
- Partial upload leaves 1-2 files in a stored folder; a later complete upload makes a new timestamp folder; which counts is unknown.
- "Team name" is free text and any signed-in user can join a team by typing it; use a unique name and do not let others upload into it.
- /detail and /guideline disagree on metric naming; WebFetch summaries of the same page varied, so recheck the page text on D01.
- The app code was read via a summarising fetch, not line by line; re-fetch raw `app.py` and read it for the exact CSV rules before the first upload.
- Deadline zone, count rule (last/best) and enforcement are unknown.

# Implications for the challenge
1. D01: request dataset access, ask the zone and counting rule in discussion #1.
2. Build numbering maps and validator before any model (SPOF).
3. Freeze the proxy manifest Oct 19; gate only on 9MTX/9MTE.
4. Upload the 2-hour fallback Oct 20 to test the pipeline end to end.
5. Final candidate Oct 29; last upload no later than Oct 30 06:00 UTC.
6. Keep own submission ledger (max 5; the app does not enforce).

# Open questions
Time zone of the deadline; whether last or best submission scores; whether the cap is enforced downstream; whether the official metric is weighted or unweighted; whether late uploads are rejected after Oct 31; actual s/seed of co-fold engines on Explorer.

# Sources
- https://sepiq.uk/guideline (opened; no deadline zone or submission details in what was returned)
- https://sepiq.uk/detail (opened; sequences, eligibility, documentation, extension language)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (opened; header only)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/raw/main/README.md (OAuth metadata)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/tree/main (file list)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/raw/main/app.py (summarised by fetch tool)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/discussions and /discussions/1
- research/_channels/methods_to_execution.md and structures_and_proxies.md (sibling findings: q5, q1)
- Klein premortem: secondary summaries only (https://concepts.dsebastien.net/concept/premortem/ , https://www.shadowboxtraining.com/services/pre-mortem/); the HBR 2007 article itself was not opened.
- Kaggle final-week advice: community/course pages only (https://community.drivendata.org/t/overfitting-and-leaderboard-shakeup/10991 , https://discourse.aicrowd.com/t/final-suggestions-some-tips/5753); no official Kaggle checklist found.
