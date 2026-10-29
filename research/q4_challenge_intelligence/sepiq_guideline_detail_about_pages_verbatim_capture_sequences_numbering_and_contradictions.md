---
title: SEPIQ site exhibits, sequences, schemas and the three contradictions (chain-of-custody audit)
queen: q4_challenge_intelligence
king: king_world
worker: sepiq_guideline_detail_about_pages_verbatim_capture_sequences_numbering_and_contradictions
tier: expert
tags: [sepiq, verbatim, her2, vhh, onu11, onu13, onu23, uniprot-p04626, schema, deadlines, metric, contradictions]
confidence: high
challenge_relevance: 5
serendipity: Forensic chain of custody, treating each web page as an evidence exhibit; it paid off twice (the home page is a stale exhibit that explains "seven"; the HF Space app.py is the only exhibit that shows what the uploader actually checks).
date: 2026-10-17
---

# SEPIQ 2026: exhibits, sequences, schemas, contradictions

**Full verbatim capture (all three pages, sequences, schemas, hashes): `research/_meta/sepiq_verbatim.md`** (written first, before this analysis).

## TL;DR
The three challenge targets are ONU11, ONU13 and ONU23; "seven antibodies" survives only on the stale home page, and the HF Space states that ONU24 and ONU429 were withdrawn. The metric is PR-AUC (macro over the 3 complexes, with an area-weighted variant) per /guideline, the Space and /detail agree on "PR AUC" but only /guideline defines it. Track A closes **2026-10-31 (14 days from 2026-10-17)**; no extension notice exists, but an extension clause does. One real surprise: the "C-terminal GACQ" of the HER2 construct is native P04626 residues 621-624, not a tag, so the construct is simply P04626 1-624 plus His6 at zero offset.

## Exhibit register (custody log)
| Ex. | Source | Fetched | Server Last-Modified | Trust |
|---|---|---|---|---|
| E1 | sepiq.uk/detail | 2026-10-17 curl, HTTP 200 | 2026-09-01 09:24:51 GMT | Authoritative for sequences, timeline, rules, prizes |
| E2 | sepiq.uk/guideline | same | 2026-09-01 09:24:56 GMT | Authoritative for format, ground truth, metric |
| E3 | sepiq.uk/about | same | 2026-09-01 09:24:43 GMT | Org registration only (79 words) |
| E4 | sepiq.uk/ (home) | same | 2026-09-01 09:25:01 GMT | Stale (says June start, "seven", DockQ, 3D docking) |
| E5 | HF dataset README | same | repo lastModified 2026-09-04 | Authoritative for data schema |
| E6 | HF Space app.py (+ commits to 2026-10-15) | same | n/a | Authoritative for what the uploader enforces; carries ONU24/ONU429 note, 1 Dec ranking rule |
| E7 | UniProt P04626 FASTA | same | n/a | Reference sequence (1255 aa) |
| E8 | HF discussions: Space #1 (deadline), dataset #2 (antigen), #3 (starter kit) | same | 2026-08-27 to 2026-09-30 | Organiser replies by user hiroyuki-code |

All four sepiq.uk pages carry the same 1 Sept 2026 build stamp, so none changed after deployment. The site cannot have "changed since BRIEF.md"; what BRIEF.md missed is the HF side (E5, E6, E8). SHA-256 of every raw exhibit is in the verbatim file.

## Q2: Sequences (details and full blocks in the verbatim file)
| Item | Printed length | Composition | Check |
|---|---|---|---|
| HER2 construct | 630 aa | P04626 1-624 + HHHHHH | Equals P04626[1:624]+"HHHHHH": True; offset 0; signal peptide 1-22 included |
| ONU11 | 127 aa | 120 aa numbered, then S121, then HHHHHH | no non-standard letters |
| ONU13 | 127 aa | 120 aa numbered, S121, HHHHHH | no non-standard letters |
| ONU23 | 135 aa | VHH 1-129 (ends ...QGTQVTVSS), His6 = 130-135 | page numbers to 130 which lands on the first H |

- HER2 numbering markers 10-620 match the true residue counts at every block. GACQ is UniProt 621-624 (UniProt 625-632 = PCPINCTH), so the page's visual separation of GACQ is misleading. The expressed range is not stated anywhere; the ECD proper runs to about 652, so the construct is truncated before it. Dataset discussion #2 (2026-08-02) is the organiser's own printing of the same 630 aa.
- **ONU23 "130 aa" in BRIEF.md is a numbering artefact**: the page numbers run to 130 and position 130 is already the first His; the VHH proper is 129 aa and the full string 135. ONU11/13: 120 + S = 121 VHH residues, + His6 = 127. Whatever indexing the template CSVs use, expect 127/127/135 VHH rows if tags are included (template contents are gated, unverified).
- Sequences on /detail (plain and LaTeX renderings) and on the Space (E6) are identical character for character. Sequence 1 of the training data also ends HHHHHH, so all tags are uniform.
- Numbering is sequential, 1 = M; verbatim: "we are not adopting the Kabat, Chothia, or IMGT schemes."

## Q3: Training data and submission schema
- Dataset is `gated: manual`; README (E5) is public; the CSVs and the three templates return HTTP 401 without approval, so no raw file was opened and no credential was used.
- Files (bytes): AVIDa-hHER2.csv 499,335,870; NGS_read_count_table.csv 126,170,849; prediction_template_ONU11/13.csv 8,757 each; ONU23 8,853; README 17,291; LICENSE empty.
- Rows: 1,843,875 unique VHH (README); starter notebook output 1,659,488 train + 184,387 validation, 36 columns. Column list, label rules (conditions 1-6, IE-score thresholds 1.3, -3, -1.3, -500 sentinel) and example rows are in the verbatim file.
- Naming discrepancy: README prose uses `Total`, `Sequence`, `Binary Label`; notebook output has `total`, `sequence`, `binary_label`. Trust the notebook output for code.
- Submission CSV: `chain, seqNum, resName, prediction`; A = antigen, B = VHH; omitted = 0. The uploader (E6) validates only that these four names appear in the header; no row, range or value check. All three files must be uploaded together; stored as team/user/UTC-timestamp/prediction_<clone>.csv. Nothing in app.py enforces "5 submissions per team"; it is a policy statement only (observed in code, not a promise about back-end behaviour).
- NGS_read_count_table.csv schema is not visible anywhere public. Open.

## Q4: Contradiction 1, three vs seven antibodies
| Where | Verbatim | Reading |
|---|---|---|
| Home (E4), summary table | "Blind prediction of antigen epitopes based on the amino sequences of **seven** given VHH antibodies." | Only occurrence of "seven" or "7" for antibodies across home, /about, /detail, /guideline |
| Home, overview bullets | "Goal: Predict epitopes for **3** specific VHH antibodies." | same page contradicts itself |
| /detail | "**three** HER2-VHH complexes selected from the HER2 repertoire have been resolved"; "Structural Cryo-EM data were obtained for **three** HER2-VHH complexes" | current |
| /guideline | Score = 1/3 sum over k = 1..3; "Antibody k ∈ 1,2,3" | current |
| Space (E6) | "Prepare predictions for the three challenge VHH clones: ONU11, ONU13, ONU23"; "ONU24 and ONU429 were withdrawn due to problems with the wet experiment." | current, and a plausible mechanism for shrinkage |

**Verdict: 3 (ONU11, ONU13, ONU23), high confidence.** The numeric "seven" is stale; the Space note accounts for only two withdrawn clones, so the full list of seven is not recoverable from any exhibit (unresolved, immaterial). What would settle it formally: an organiser reply in the Space community tab or info@cognano.co.jp. The Space also wires exactly three upload slots.

## Q5: Contradiction 2, the metric
| /guideline (E2), verbatim | /detail (E1), verbatim |
|---|---|
| "two versions of PR-AUC (with and without weights) will be the primary evaluation measures for SEPIQ Track A." | "The best performance, corresponding to a PR-AUC of 0.176, is modest but above the expected performance of a random predictor." (baseline on 8GZ5 only) |
| "The macro-average of the individual PR-AUCs of each antigen-VHH complex will be calculated ... residues will not be pooled across all antibodies" | Rules section: no metric named; "Ground Truth data will be kept private until the end of the submission evaluations" |
| "weighted recall ... TP_area/P_area" with ordinary precision | "illustrative scripts for evaluating per-residue epitope predictions" in the Starter Kit (E1), not shipped: the notebook only loads data (dataset discussion #3, 2026-09-18 and 09-30, unanswered) |
| Ground truth by Voronota-LT; table columns chain, seqNum, resName, fact, weight | Space (E6): "Primary metric: PR AUC"; "the primary metric is planned to be area under the precision-recall curve"; "Exact ranking rules and tie-breaking/statistical testing procedures are still being finalized." |

**Operational reading:** score = mean over ONU11, ONU13, ONU23 of per-complex PR-AUC, reported as unweighted and area-weighted (weights = Voronota-LT contact area on positives only); /detail does not contradict it, it is simply silent. The Space explicitly marks ranking rules as unfinalised, and the home page still advertises DockQ-style evaluation (stale).

Residual ambiguity that can swing a ranking:
1. The Score formula says "PR AUC_k" without saying which of the two variants ranks; the text says both are "primary". A combined rank is unspecified.
2. Whether chains A and B enter one PR curve per complex (the combined-table example concatenates both chains) or separate curves. If pooled, probabilities must be calibrated across the 630-residue antigen and the 127-135-residue VHH.
3. "cluster bootstrap": the prose says cluster, but Step 2 resamples **residue indices** with replacement ("Draw L indices randomly with replacement from {1, 2, ..., L}") with "the exact same index set across all antibodies", although the complexes differ in length (about 757/757/765 if tags are scored). That procedure is a residue bootstrap, not a cluster bootstrap, and the common index set is ill-defined for unequal L. Also "Decision Rule ... (p" is truncated in the page text. B = 2000 is given as "e.g.".
4. The Space says ranking is published 1 Dec with **team names only and no scores**, so scores may not be observable on a public leaderboard.

## Q6: Contradiction 3, dates
| Event | Date | Source | Note |
|---|---|---|---|
| Opening ceremony (Kyoto) | 2026-03-28 | Home | video caption |
| HF Space created / dataset created | 2026-05-06 / 2026-06-02 | HF API | |
| "scheduled to begin in June 2026" | June 2026 | Home | stale announcement text |
| Track A original deadline | 2026-09-15 | Space discussion #1 (2026-08-27) | participant quoting deadline |
| Organiser reply | "postponed by one to two months" | Space #1, 2026-08-28 | explains the move to Oct 31 |
| Track A window | 2026-09-01 to 2026-10-31 (61 days) | Home, /detail, Space (x3) | consistent |
| Track B (CAPRI) round begins | 2026-09-16 | Home, Space | |
| Judging and evaluation | 2026-11-01 to 2026-11-30 | Home, Space | not on /detail or /guideline |
| Ranking announcement (team names, no scores) | 2026-12-01 | Space | new vs BRIEF |
| "evaluation and results announcement" | 2026-12-15 | /detail | conflicts or follows: rankings 1 Dec, results Dec 15, likely both true |
| Final announcements / awards | December 2026 | Space | |

Days remaining from 2026-10-17: to 2026-10-31 = **14 days** (the submission deadline day itself being the 14th); to 2026-11-01 = 15; to 2026-12-01 = 45; to 2026-12-15 = 59. Time zone of the cutoff is unstated (the Space stamps UTC), so treat 2026-10-31 23:59 UTC as the safe limit. Extension: /detail says verbatim "Organizers will extend the duration of the challenge in case of any delays or technical issues from the SEPIQ or Hugging Face side"; /detail also says rule or deadline changes will be communicated "on the SEPIQ Competition Page, website, and LinkedIn page". I found no news page (sepiq.uk/news is 404), no change in the site after 1 Sept, and no extension post (web search turned up nothing; LinkedIn was not checked: unverified). Space commits since 2026-09-08 are only team-rename/login fixes (last 2026-10-15). Plan on 31 Oct; do not bank on an extension.

## Q7: Other rules and numbers
| Item | Verbatim | Source |
|---|---|---|
| Submission limit | "each team will be allowed up to five Track A submissions" ("To reduce leaderboard probing") | /detail |
| Team size | "Maximum team size of 10." | /detail |
| External data | "strictly limited to 'publicly available datasets' (e.g., PDB, SAbDab). The use of proprietary or private data is prohibited"; must "clearly state its source and license" | /detail |
| Leakage | "As long as the answer is correct, we do not consider data leakage resulting from the use of publicly available data to be an issue." Same statement in organiser reply, dataset #2: public HER2 structures may be used as templates | /guideline, E8 |
| Algorithms | "no restrictions on the computational approaches"; "perfectly acceptable to predict epitopes/paratopes based on three-dimensional structure prediction (equivalent to Track B)" | /detail, /guideline |
| Antigen PDB | "PDB files for the Her2 antigen will not be provided during the challenge period" (complex PDBs released with ground truth) | E8 dataset #2 |
| Reproducibility | participants "asked to provide sufficient documentation ... model inputs, inference settings, and any public external data"; code not required for Track B; top teams "encouraged" to share code | /detail |
| Licence grant | organisers may use Track A predictions for evaluation, leaderboard, meta-evaluation, publication of aggregate results | /detail |
| Eligibility | 18+; HF account for Track A; excluded: residents of Crimea, DNR, LNR, Russia, Belarus, Cuba, Iran, Syria, North Korea; individuals or entities under Japan, Ukraine, EU, UK or US sanctions or export controls | /detail |
| Prizes | "1st Place $3,000, 2nd Place $2,000, and 3rd Place $1,000"; Track B "determined separately in coordination with CAPRI"; travel awards "subject to sponsorship" | /detail |
| Authorship | "Top-ranking teams from each track will be invited as Consortium Authors" | /detail |
| Track B | Home "Track B (CAPRI round begins) 16 Sept"; /detail: "Track B submissions will therefore not be handled as standard SEPIQ/Hugging Face submissions unless otherwise agreed with the CAPRI team"; /guideline: "Please wait for a future announcement from CAPRI" | status unconfirmed |
| Data access | gated; agreement not to redistribute, not to use commercially, not to try to infer hidden labels; dataset form asks about "additional GPU resources for Track B" | E5 |
| Support | info@cognano.co.jp | /detail |
| Sponsors | "To Be Confirmed"; Gold/Silver/Bronze "Coming soon" | Home |
| Ground truth quality | target ≈ 3.0 Å (Home FAQ); map resolution and model-validation statistics "will be reported" for each held-out complex | Home, /detail |
| Stale/contradictory | Home FAQ says the task is "predicting the 3D structure ... (docking), not just identifying epitope residues"; Home evaluation says "DockQ"; Home data: "over a million" / "hundreds of thousands" vs 1.8M; starter notebook text says "~1.6 million" (train split only) | Home, E5, notebook |
| Epitope size | "the epitope comprises only about 10-20 residues" | /guideline |

Changes vs BRIEF.md: (a) ONU23 length (129 + His6, not "130 aa" as a pure VHH); (b) GACQ is native; (c) ONU24/ONU429 withdrawal; (d) ranking announced 1 Dec, team names only, no scores; (e) "PR AUC" metric repeated on the Space but ranking rules "still being finalized"; (f) bootstrap resamples residues, not clusters; (g) the Starter Kit's training and evaluation scripts are not in the Space (only data loading).

## Forced analogy: forensic chain of custody
(a) Each page is an exhibit with a custodian log (fetch time, hash, last-modified) and every fact is judged by provenance, not repetition. (b) Testable consequences: the home page is a pre-Sept exhibit and the three-clone, PR-AUC, 1 Sept to 31 Oct reading is corroborated by independent custodians (Space code and organiser replies). For modelling: because the uploader checks only the header, a malformed or mis-numbered CSV will be accepted silently and then scored against the hidden table, so reproduce the template exactly (test: round-trip your CSV through a script that checks seqNum vs the printed sequence, e.g. seqNum 1..630 with residue letters matching the construct above, and VHH 1..127/135) before spending one of five submissions. Also zero out His-tag residues (HER2 625-630; VHH last 6) since they cannot be interface. (c) The analogy holds for rule provenance, breaks for sequences: sequences are verifiable by code (identical in three exhibits), so provenance is unnecessary there.

## Gotchas
- "GACQ + His tag" in notes implies an artificial tail; GACQ is native, so no offset arises in numbering and no need to shift anything.
- Numbering to 130 on ONU23 includes the first His; counting from the page numbers gives a wrong VHH length by one.
- Page text duplicates every formula (plain + LaTeX); a scraper that concatenates will double sequences, so de-duplicate.
- Pooled vs per-chain PR curve and the unspecified weighted/unweighted rank rule can reorder close teams; the bootstrap is a residue bootstrap with an ill-defined common index across complexes.
- README column names differ from the notebook column names.
- The README label rule uses a different background IE threshold ("adjusted negative threshold (-3)") than /detail's "p-value <= 0.05" description; the labels are enrichment-derived and noisy.
- 5-submission limit is not enforced in the uploader code seen; do not rely on it, but do not abuse it.
- Last-Modified is the build time, not content time; it proves no change after 1 Sept, not that the content was current.

## Implications for the challenge
1. Treat the target set as exactly ONU11, ONU13, ONU23; build three templates only.
2. Plan the final submission for 2026-10-30 (UTC); there is no extension notice.
3. Use the exact construct (P04626 1-624 + His6, offset 0). Predict antigen residues 1-624 (signal peptide 1-22 not in a mature cryo-EM model; expect near-zero truth there) and set tag residues to 0.
4. Optimise for PR-AUC averaged over three complexes, evaluate both unweighted and area-weighted locally, and calibrate A and B jointly in case curves are pooled.
5. Validate CSVs offline against sequences before uploading: the portal checks only the header.
6. Get HF access approved now (several users in the Space thread report waiting weeks) and use the notebook's 36-column frame for training.
7. Document external public data and licences, and keep code reproducible (required documentation).

## Open questions
- Exact template contents and row counts (gated).
- Which PR-AUC variant ranks, pooled vs per-chain, and the bootstrap grouping.
- Whether a deadline extension will be posted (check LinkedIn and Space daily).
- Which seven antibodies the home page meant.
- Expression construct (range, host) is not published beyond the sequence.

## Sources
- https://sepiq.uk/detail, https://sepiq.uk/guideline, https://sepiq.uk/about, https://sepiq.uk/ (all opened 2026-10-17)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (API, tree, README.md, discussions #2 and #3)
- https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (API, app.py, vhh_dataset_tutorial.ipynb, discussion #1, commit list)
- https://rest.uniprot.org/uniprotkb/P04626.fasta
- A WebSearch on extension news returned nothing relevant (not a source).
