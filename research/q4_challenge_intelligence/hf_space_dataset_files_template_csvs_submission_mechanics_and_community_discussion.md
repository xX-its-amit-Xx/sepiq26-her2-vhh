---
title: HF Space and dataset forensics - files, submission mechanics, discussions, templates
queen: q4_challenge_intelligence
king: king_world
worker: hf_space_dataset_files_template_csvs_submission_mechanics_and_community_discussion
tier: expert
tags: [huggingface, submission-format, scoring, templates, AVIDa-hHER2, format-traps, leaderboard]
confidence: medium
challenge_relevance: 4
serendipity: Law of evidence and burden of proof - the Space is a court with no judge in the room (no scorer, no validator beyond a header check); the analogy held well and exposed that the burden of admissible form falls entirely on the submitter.
date: 2026-10-17
---

# HF Space and dataset forensics

**TL;DR.** The public Space (`sepiq-2026/SEPIQ-2026-Challenge`) contains NO scoring code and almost no validation: `app.py` checks only that each of three CSVs has the four header names, then uploads the files untouched to a private dataset. The 5-submission cap, team registration, 0-1 clipping, residue matching and score computation are not in the code, so they run offline on the organisers' side and a header-correct but wrongly numbered file is accepted silently. No leaderboard or score exists; ranking is promised on 1 Dec 2026 with team names only. The verbatim capture the engineering lane needs is in `research/_meta/sepiq_verbatim.md`.

## 1. File inventory (API read 2026-10-17)

Space `sepiq-2026/SEPIQ-2026-Challenge`: Docker SDK (Gradio 5.43.0), cpu-basic, created 2026-05-06, last modified 2026-10-15T18:51:36Z, head sha d46a4e3, 42 likes, `hf_oauth: true`, linked datasets `SEPIQ-2026-submissions` (private, 401) and `SEPIQ-2026-training-data`.

| File | Bytes | Last commit | Note |
|---|---|---|---|
| app.py | 29,211 | 2026-10-15 | whole UI + submit handler, 883 lines |
| README.md | 232 | 2026-05-06 | YAML header only (oauth scopes read/write/manage-repos, inference-api) |
| requirements.txt | 51 | 2026-10-15 | `gradio[oauth]==5.43.0`, `huggingface-hub>=0.34.4,<1.0` |
| Dockerfile | 477 | 2026-09-02 | python:3.10-slim, runs app.py |
| LICENSE | 11,331 | 2025-12-09 | Apache-2.0 (software only) |
| vhh_dataset_tutorial.ipynb | 21,768 | 2026-06-15 | data loading only, no model, no scoring |
| _static/*.png | 0.03-1.6 MB each | 2026-06-15 | logos/hero images, no data |

Dataset `sepiq-2026/SEPIQ-2026-training-data`: gated (manual approval), license `other`, 27 likes, 185 downloads last month, created 2026-06-02, 626 MB total.

| File | Bytes | Last commit |
|---|---|---|
| AVIDa-hHER2.csv | 499,335,870 | 2026-06-15 (renamed from ONU_table_mod_IE_score_arranged_with_cluster_all.csv) |
| NGS_read_count_table.csv | 126,170,849 | 2026-08-25 |
| README.md (card) | 17,291 | 2026-09-04 |
| prediction_template_ONU11.csv | 8,757 | 2026-08-31 |
| prediction_template_ONU13.csv | 8,757 | 2026-08-31 |
| prediction_template_ONU23.csv | 8,853 | 2026-08-31 |
| LICENSE | 0 (empty) | 2026-06-02 |

No baseline predictions, example submissions, ground truth or scoring script exist in either repo. The card says hidden Cryo-EM, final labels and annotations "should remain private". The dataset card and file list are public even though file contents are gated; template and CSV contents could NOT be read (401), so section 4 is partly inference.

## 2. Submission mechanics, from the code

Quoted from `app.py`:

- Login: `if profile is None: return "Please sign in with your Hugging Face account before submitting."` (HF OAuth, 480-minute sessions).
- All three files required: `if not all([onu11_file, onu13_file, onu23_file]): ... "Please upload prediction files for ONU11, ONU13, and ONU23."` One submission = three CSVs together; partial uploads are refused.
- Validation, in full: `required_columns = {"chain", "seqNum", "resName", "prediction"}` and `required_columns.issubset(columns)` using `csv.DictReader` on `utf-8-sig`. Failure text: `"{clone}: invalid CSV format. Required columns are: chain, seqNum, resName, prediction."`; unreadable file: `"Could not read the {clone} file."` Extra columns pass; header names are case-sensitive and not whitespace-stripped; the UI limits uploads to `.csv`. Nothing checks rows, chain letters, numbering, residue names, value range, NaN, row count or duplicates.
- Storage: `submission_folder = f"{safe_team}/{safe_user}/{timestamp}"` with `safe_*` = `re.sub(r"[^A-Za-z0-9_-]", "_", ...)`, timestamp `%Y%m%d_%H%M%S` UTC; files saved as `prediction_ONU11.csv` etc. into `sepiq-2026/SEPIQ-2026-submissions`. Your own file names are irrelevant.
- Receipt: "Submission received successfully." with team, user, clones, UTC time. NO score, no rank, no row count. The Space text confirms: "Scores will not be disclosed."
- Team registration: the team name is a free-text box ("Enter your registered SEPIQ team name") with no lookup; a team exists as a folder in the private repo. A "Rename team" feature (commits 2026-10-15, user Confora) lets members rename; membership = having a `<team>/<user>/` folder. Names are limited to letters, digits, `-`, `_`; case-insensitive duplicates are rejected on rename.
- The 5-submission cap (/detail: "each team will be allowed up to five Track A submissions") is NOT enforced in the handler: every click creates a new timestamped folder. Which of the five counts (last, best, first) is unstated. Two users on one team have separate folders, so the organisers must aggregate by team.
- Space copy: "Track A is open until 31 October 2026" and "Submission deadline: October 31, 2026".

Forced analogy, law of evidence: the submitter bears the burden of admissible form (right chain, right numbering, values in [0,1]); the court (private scorer) has published its rules of evidence only in `/guideline`, and the clerk (app.py) rejects only a missing caption (the header). A technically valid but unscorable submission is therefore easy to produce: right header, wrong numbering (for example HER2 numbered from the mature protein) uploads with a green tick and scores near zero. Testable idea: treat the template as the only admissible exhibit, join every submission to it locally and refuse to submit unless 100 percent of keys match.

## 3. Scoring semantics (from /guideline, since no code exists)

- Omitted residues: "Participants may skip residues in their output - it will be assumed that the prediction is 0 for any omitted residue"; assessment join: "For missing rows in the prediction output table, set the 'prediction' value to 0". Join key evidently (chain, seqNum, resName) against ground-truth rows `chain seqNum resName fact weight`.
- Ground truth: Voronota-LT v1.1.479 residue-level contact areas, antigen-VHH contacts only, `fact=1` for any residue with a contact, `weight` = area.
- Metric: PR-AUC with and without area-weighted recall, macro-averaged: `Score = 1/3 * sum_k PR-AUC_k`. Ties resolved by a paired cluster bootstrap, B=2000, over resampled residue indices. The guideline says "Draw L indices ... same index set across all antibodies", which is only well defined if all complexes share L; per-complex lengths differ, so the exact scheme is ambiguous.
- NOT stated anywhere: clipping or rejection of out-of-range values; handling of NaN or empty cells; behaviour on seqNum/resName mismatch (drop, error, or extra false positives); whether chains A and B of one complex are pooled into one PR curve or scored separately; PR-AUC estimator (average precision vs trapezoid), which matters with roughly 10-20 positives among about 750 residues; tie handling.
- Which PR-AUC ranks: /guideline says both versions "will be the primary evaluation measures"; the Space says only "PR AUC"; /detail names PR-AUC only for the baseline. Optimise ordering quality that serves both.

## 4. Template CSVs (inferred, contents gated)

Header (validator and /guideline): `chain,seqNum,resName,prediction`; /guideline says outputs are "formed by adding a column to each input table", so templates carry chain/seqNum/resName rows. The /guideline examples use three-letter upper-case residue names (ALA, MET).

Byte-size reconstruction (run by script): with CRLF line endings, an EMPTY prediction column (row `A,12,SER,` + CRLF), chain A seqNum 1..618 contiguous, and chain B 1..127 (ONU11, ONU13) or 1..135 (ONU23), predicted sizes are exactly 8,757 / 8,757 / 8,853 bytes. The alternative (LF endings, prediction filled with `0`) is off by one byte each (8,756 / 8,852). The chain B delta fits independently: ONU23 minus ONU11 = 8 three-digit rows x 12 bytes = 96 bytes. As inference (confidence medium, one gated read would settle it):

| Template | Chain A rows | Chain B rows | B layout |
|---|---|---|---|
| ONU11 | 618 (1..618) | 127 | 120 VHH + S121 + HHHHHH 122-127 |
| ONU13 | 618 | 127 | same layout |
| ONU23 | 618 | 135 | 129 VHH + HHHHHH 130-135 |

Consequences. (a) Chain B numbering is sequential from the first M with tag residues INCLUDED as rows; ONU23 is 8 rows longer. (b) Chain B follows the sequences printed on /detail. (c) Chain A is NOT the 630-residue construct: P04626 1-624 + His6 is 630 rows, so 618 rows means the template stops short or skips 12 residues. The simplest reading is a gap-free 1..618 list that excludes the C-terminal tail (residues 619-624 plus His6); this is UNVERIFIED. Any true interface residue outside the template cannot be scored regardless of what you submit (a likely benign case, since HER2 domain IV ends well before the tail region, but the template should be checked).

Numbering: HER2 uses full-length P04626 numbering including the 22-residue signal peptide, so the index equals the position in the construct string (M1; no offset). PDB HER2 structures (for example 1N8Z, 1S78) number the mature protein; the offset of 22 is from background knowledge and must be verified against the file before use. Insertion codes: none expected for P04626 numbering or sequential VHH numbering; the guideline's Voronota example output has plain integers only.

## 5. Community discussion, transcribed (full text in `_meta/sepiq_verbatim.md`)

Space discussion #1, "About the deadline of Track A" (open, 5 comments; the Space has exactly 1 discussion):
1. 2026-08-27 longhung25 (Long-Hung Pham): asks whether the 15 Sept Track A deadline is final, since the submission template is not yet available; asks for an extension.
2. 2026-08-28 hiroyuki-code (organiser): timeline being finalised; deadline "expected to be postponed by one to two months"; guidelines soon, portal shortly after.
3. 2026-09-15 dharani2024: has requested gated dataset access, asks for fast grant.
4. 2026-09-24 hiroyuki-code: "We believe you have already been authenticated, but we would appreciate it if you could verify it again."
5. 2026-09-26 Sajib-006: also awaiting access; wants the templates.

Dataset discussions (3 open): #1 parquet-converter bot (2026-06-16, boilerplate, `refs/convert/parquet` returned 404 unauthenticated). #2 xssda / Jinhan Zhang (2026-07-27) asked whether a HER2 PDB is provided and for the exact construct; organiser reply 2026-08-02: no antigen PDB during the challenge, complex structures only at ground-truth release, full construct sequence supplied, ECD "may form dimers under experimental conditions", no algorithm restrictions including 3D structure prediction, public data leakage "not an issue" if the answer is correct, public HER2 structures may be used as templates, and the repository description would be updated (it was). #3 agilisium2026 (2026-09-18) asks where the starter-kit baseline training code is; sushsingh (2026-09-30): "I also have similar query, only the data loading codes are available." No organiser reply is visible on #3, so the baseline pre-training and per-residue evaluation scripts promised on /detail are not in the notebook. Likes: 42 (Space, matches BRIEF), 27 (dataset).

## 6. AVIDa-hHER2 on HF

No standalone `COGNANO/AVIDa-hHER2` repo exists publicly (API 401; org search lists only AVIDa-hIL6, AVIDa-hTNFa, AVIDa-SARS-CoV-2, VHHCorpus-2M, VHHBERT). hHER2 is shipped only as `AVIDa-hHER2.csv` (499.3 MB) inside the gated SEPIQ repo beside `NGS_read_count_table.csv` (126.2 MB). Card: 1,843,875 unique VHH sequences (the notebook says about 1.6 M, /detail about 1.8 M; trust the card). Documented columns (exact headers unverifiable): `#ONU ID`, `Total`, `Sequence`, `Label`, `Binary Label`, `Cluster` (USEARCH 93% identity), `#Cluster`, `Cluster size`, `Marin...` sublibrary columns, `Background IE-score`, `Target IE-score`. NGS-table row and labelled-row counts: not published ("a few hundred" per /detail, but the card's rule can label more).

The card's labelling differs from /detail's chi-square wording: IE-score = log10 of the chi-square p-value, negative = enriched (clamp -500), positive threshold 1.3. Binder (Yes) if background IE is negative and background minus target > 2, or background positive and target <= -1.3; "noise" if background <= -3 (adjusted); Not if target >= 1.3. Controls: NC1 (beads only), NC2 (anti-HA), NC3 (BSA), Comparator proteins; targets Her2, Her2_C1/C2, plus competition libraries Her2_Trastuzumab_C1-C3, Her2_Pertuzumab_C3, Her2_RabMAb_C3. Competition data exist only for Mother Library B. Sublibrary suffix encodes mother library (B/C), experiment phase, temperature (4 or 37 C).

Licence: `other`, empty LICENSE file; gate terms: non-commercial, no redistribution or rehosting, no attempt to infer hidden labels, cite or acknowledge SEPIQ/COGNANO. Cheap column subsets (general technique, untested here due to gating): `pyarrow.csv.open_csv` with `ConvertOptions(include_columns=[...])` streaming batches; `polars.scan_csv(...).select(...)`; `duckdb.read_csv` projecting columns; `load_dataset(..., streaming=True, token=...)`.

## 7. Git history and rule drift

Space has about 48 commits: 2026-05-06/07 initial build; 2026-06-12 tutorial notebook; 2026-06-14/15 UI edits; 2026-08-25 app.py; 2026-09-01 app.py; 2026-09-02 "change timeline" (linyows) plus Dockerfile, requirements, app.py (submit form and Oct 31 deadline appear); 2026-09-07/08 guideline links (hiroyuki-code); 2026-10-15 "add team rename", "fix user log out message", "remove Team renamed to message" (Confora). Dataset commit history is gated (401); dates in section 1 come from the tree API. Rule drift: June launch, 15 Sept deadline (per discussion), then Sep 1 to Oct 31; the home page is stale (June, seven VHH, DockQ-only).

## 8. Leaderboard and calibration

No leaderboard exists: the LEADERBOARD tab is static text, "The ranking will be released on 1 December 2026 with team names only and no scores." Team and submission counts are invisible (submission repo private). Calibration anchors: AntiBinder baseline PR-AUC 0.176 on the 8GZ5 proxy vs random 0.126 (26/206); nothing on HER2.

Contradictions resolved. Seven vs 3 antibodies: home table says seven, home bullet, /detail and the Space say three; the Space notes ONU24 and ONU429 were withdrawn for wet-experiment problems, so three is current. Dates: home says June start and judging 1-30 Nov; Space says ranking (names only) 1 Dec; /detail says results 15 Dec; best reading is judging in Nov, names 1 Dec, results/awards 15 Dec. Metric: /guideline defines weighted and unweighted PR-AUC; the Space says "PR AUC"; the home page still says DockQ (Track B).

## Gotchas / what could fool us

1. Header-only validation: right header plus wrong numbering is accepted; write your own checker against the template.
2. Fill `prediction` explicitly; the template column is (inferred) empty and an empty cell may parse as NaN.
3. Chain letters: A = HER2, B = VHH, upper case; do not use PDB chain ids.
4. Numbering: HER2 = P04626 including signal peptide (off-by-22 risk if your structure is mature-numbered); VHH = sequential from the first M, with S121 and the His tag counted in the template rows. No Kabat/IMGT.
5. resName must match the template (three-letter upper case); a mismatch may drop the row (unknown).
6. Three files per submission; five submissions per team enforced offline; which counts is unknown.
7. Values in [0,1]; clipping undocumented, so clip yourself; break ties deliberately because PR-curve ties may be treated optimistically or pessimistically.
8. Positives are generous: any Voronota contact counts, even 0.85 square angstroms (B6 GLU in the example), so the positive set is larger than visual epitope.
9. Chain-A template (inferred 618 rows) may not cover all 630 construct residues.
10. Two PR-AUCs: the weighted one rewards ranking large-area residues first.
11. Gate approval is manual and slow (users waited days); request early.

## Implications for the challenge

1. Build a local validator now: header, chain set {A,B}, integer seqNum within template range, resName equals template, 0 <= prediction <= 1, finite, no duplicates; join to the template and require 100 percent key match.
2. Obtain the three templates (gated); confirm chain A length (618 vs 630), line endings and whether prediction is empty; pass the result to the engineering lane.
3. Spend the five submissions as diversified blind hypotheses (structure-driven AF3/Boltz/OpenFold3 consensus vs competition-library-informed vs sequence-model), because no score is returned.
4. Mine the card's competition columns (Trastuzumab, Pertuzumab, RabMAb) as epitope-bin labels: clones depleted under competition likely bind near domain IV (trastuzumab) or II (pertuzumab); domain boundaries are from memory, verify. This is the only epitope-informative signal in the data and the organisers point to it.
5. Optimise within-complex ranking (macro PR-AUC), never pool residues across complexes.
6. Keep documentation of inputs, settings and PDB/SAbDab-only external data (required for Track A).

## Open questions

- Exact template contents and numbering ranges (needs gated read or an organiser answer).
- Do chains A and B pool into one PR curve per complex, or separate epitope and paratope curves?
- Treatment of out-of-range, NaN, mismatched rows; which of five submissions is scored; how team aggregation works.
- Row count and labelled-row count of NGS_read_count_table.csv and AVIDa-hHER2.csv.

## Sources

- https://huggingface.co/api/spaces/sepiq-2026/SEPIQ-2026-Challenge (plus /commits/main, /tree/main?expand=true, /discussions, /discussions/1)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/raw/main/app.py (also README.md, requirements.txt, Dockerfile, LICENSE, vhh_dataset_tutorial.ipynb)
- https://huggingface.co/api/datasets/sepiq-2026/SEPIQ-2026-training-data (plus /tree/main?expand=true, /discussions, /discussions/1-3; /commits/main returned 401)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (public rendered card)
- https://sepiq.uk/ , https://sepiq.uk/detail , https://sepiq.uk/guideline , https://sepiq.uk/about
- https://huggingface.co/api/datasets?search=AVIDa and ?search=COGNANO (existence check)
- Not accessible: raw dataset README and template CSVs (401), SEPIQ-2026-submissions repo (401), datasets-server (401).
