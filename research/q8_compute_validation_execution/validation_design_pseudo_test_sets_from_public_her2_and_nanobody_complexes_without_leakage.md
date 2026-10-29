---
title: Validation design - pseudo-test sets from public HER2 and nanobody complexes without leakage
queen: q8_compute_validation_execution
king: king_infer
worker: validation_design_pseudo_test_sets_from_public_her2_and_nanobody_complexes_without_leakage
tier: expert
tags: [validation, proxy set, leakage, PDB, HER2, VHH, Voronota-LT, PR-AUC baseline, runbook]
confidence: medium
challenge_relevance: 4
serendipity: Sports walk-forward backtest (no lookahead, last season = proxies, playoffs = ONU11/13/23); it paid off by forcing a dated cutoff and by showing the proxy set is a dead-ball league (prevalence 0.03-0.08, not 0.13) so a good-looking PR-AUC means little without a prevalence-matched baseline.
date: 2026-10-17
---

## TL;DR
Only **four HER2-VHH PDB entries exist** (5MY6, 7QVK, 9MTE, 9MTX; five VHH-antigen pairs, **four non-redundant**), all released before any public trace of the SEPIQ test data, so all pass the walk-forward cutoff. They are too few for tuning and only good for sanity checks; their antigen-side prevalence is low (0.03-0.08 vs 0.126 for 8GZ5), so random PR-AUC is about 0.03-0.08 per antigen chain. Proxy scores will be optimistic for the co-folding engines wherever the proxy sits inside their training window (5MY6 for all; 7QVK for Boltz-2) and for anything homologous to the proxies.

## 1. Every public HER2-VHH entry (verified against RCSB, 2026-10-17)
Method: RCSB Search API, polymer entity UniProt P04626 (63 entries), then GraphQL entity descriptions, plus full-text queries "HER2 nanobody", "ErbB2 VHH", "HER2 single domain antibody", "HER2 sybody" (sybody query returned nothing). SAbDab-nano (doi 10.1093/nar/gkab1050) is a web app I could not query programmatically; only RCSB's SAbDab annotation tab for 9MTE was read. Treat the list as "RCSB-complete, SAbDab-nano unchecked".

| Entry | Released | Deposited | Method / res | VHH | Epitope (computed, UniProt numbering incl. signal peptide) | Paper |
|---|---|---|---|---|---|---|
| 5MY6 | 2017-08-09 | 2017-01-25 | X-ray 2.246 A | 2Rs15d | Domain I (21 of 21 contact residues, 100 % of area) | doi 10.1158/1078-0432.CCR-17-0310 |
| 7QVK | 2023-02-01 | 2022-01-21 | X-ray 3.1 A | NM-02 (has an extra Cys pair; humanisation paper) | I/II junction: 11 residues in I, 14 in II (32 % / 68 % of area) | doi 10.1371/journal.pone.0288259 |
| 9MTE | 2025-11-19 | 2025-01-11 | cryo-EM 2.66 A | 27A05 (chain A) and 47D05 (chain B) | 27A05: I (14 res) plus III (20 res, 64 % of area); 47D05: I (16 res) plus II (2) | doi 10.1158/1535-7163.MCT-25-0654 (Takeda-linked TPP-45142 T-cell engager) |
| 9MTX | 2025-11-19 | 2025-01-12 | cryo-EM 3.06 A | 29E09 | I (11 res) plus III (20 res, 62 % of area) | same paper |

Candidates from the brief that fail: **5MYX** is an Abeta Fab (unrelated). **8HLM** is p53/BCL2. **6OGE, 7MN8, 8PWH, 8Q6J, 1N8Z, 1S78, 3BE1, 5O4G, 8VQD, 9T3R/9T3S** are Fab or scFv entries (not single-domain). **3QYC** is a dimeric VH domain with no antigen. **4HRL-4HRN** are DARPin, **3MZW** affibody, **6LBX** repebody, not VHH. Domain boundaries (mature numbering I 1-195, II 196-319, III 320-488, IV 489-607, plus 22 for the signal peptide) are from memory of the literature and are approximate. Cryo-EM numbering matches UniProt (9MTE chain C starts TQVCTG, first resolved residue 24).

**VHH sequences** (from the RCSB entity records, tags trimmed):
- 5MY6 2Rs15d: `QVQLQESGGGSVQAGGSLKLTCAASGYIFNSCGMGWYRQSPGRERELVSRISGDGDTWHKESVKGRFTISQDNVKKTLYLQMNSLKPEDTAVYFCAVCYNLETYWGQGTQVTVSS`
- 7QVK NM-02: `QVQLQESGGGSVQAGETLRLSCTASGFTFDDSDMGWYRQAPGNECELVSSISSDGSTYYADSVKGRFTISQDNAKNTVYLQMNSLKPEDTGVYYCAAEGHRYELGTCAALDYWGRGTQVTVSS`
- 9MTE 27A05: `EVQLVESGGGLVQAGGSLRLSCVASGIPFSTRTMAWYRQPPGNERDWVATIRSGAPVYADSVKGRFTVSRDNAKNTLYLQMNSLEPEDTATYYCWDVNGDIWGQGTLVTVSS`
- 9MTE 47D05: `EVQLVESGGGVVQPGGSLRLSCAASGSIFGFNDMAWYRQAPGKQRELVALISRVGVTSSADSVKGRFTISRVNAKDTVYLQMNSLRPEDTALYYCYMDQRLDGSTLAYWGQGTLVTVSS`
- 9MTX 29E09: `EVQLVESGGGVVQPGGSLRLSCVASRIPASIRTMAWYRQTPGNQRDWLATIGSSGTPAYADSVKGRFTVSRDNAKNTVYLQMNSLRPEDTALYYCRDVNGDYWGQGTLVTVSS`

27A05 and 29E09 are one clonotype family (full-length identity 0.857, CDR3 0.714, same footprint), so the set has four independent epitope-VHH units, not five. The 9MTE/9MTX antigen constructs are the HER2 ECD fragment 1-~530 (chain A of 9MTE has 451 resolved residues), which lacks most of domain IV.

## 2. Cutoff date (walk-forward line)
The brief states the organisers publish no creation date for the three cryo-EM structures or for ONU11/13/23 (sepiq.uk /detail gives only the Sep 1-Oct 31 window and the Dec 15 results date; I re-read it today). Earliest public traces I can date:
- HF dataset `sepiq-2026/SEPIQ-2026-training-data`: createdAt **2026-06-02**, last modified 2026-09-04 (HF API).
- Space initial build 2026-05-06/07 (from the q4 sibling note, not re-verified here).
- The cryo-EM maps come from the AMED-BINDS programme; deposition has not happened (released "only after judging").

**Cutoff used: 2026-05-06** (earliest public trace; stricter than needed). The structures were physically made at an unknown earlier date, so this is a conservative bound only for public posting, not for wet-lab origin. Entries posted after: **none** among HER2-VHH entries (latest is 2025-11-19). The latest HER2 Fab entries 9T3R/9T3S (2026-03-11) also predate it, but they are not VHH. Nothing is dropped. If the organisers' sequences came from COGNANO libraries, a public proxy cannot contain them: 9MTE/9MTX authors are Takeda/Maverick-linked (De Tavernier, Vintem, et al.), not COGNANO or Osaka.

## 3. Identity to ONU11/13/23 (and AVIDa)
ONU sequences captured from /detail (tags stripped): ONU11 CDR3 region `AARPLGSTWTEHPY`, ONU13 `AAKYGSSRLWDY`, ONU23 `AADGRFYSDYVWSSPDEYAY` (text between the Cys of YYC and WGQG, leading AA included). mmseqs2 is not installed here and there is no pip build, so I used a Biopython BLOSUM62 global alignment (identity = matches / shorter length). Re-run with mmseqs on Explorer or WSL for the formal 70/90 % clusters (command below).

| Proxy | CDR3 (post-Cys) | Full id ONU11/13/23 | CDR3 id ONU11/13/23 |
|---|---|---|---|
| 5MY6 | AVCYNLETY | .670/.696/.661 | .22/.44/.22 |
| 7QVK | AAEGHRYELGTCAALDY | .714/.731/.694 | .43/.42/.35 |
| 27A05 | WDVNGDI | .652/.723/.688 | .14/.29/.14 |
| 47D05 | YMDQRLDGSTLAY | .672/.681/.681 | .38/.33/.31 |
| 29E09 | RDVNGDY | .664/.708/.664 | .29/.43/.29 |

Maximum full-length identity is 0.73 (7QVK vs ONU13), so **no proxy exceeds the 80 % flag**; framework identity of 65-73 % is the normal floor between any two alpaca/llama VHHs (ONU11 vs ONU23 is 0.80 full, CDR3 0.36). The ONU trio themselves would merge at 70 % full identity, so full-length clustering says nothing about epitope. CDR3 identity is the informative number; all are at or below 0.44, with short CDR3 alignment noise (7-9 residues) dominating. **AVIDa-hHER2 identity is NOT computed**: the gated table cannot be downloaded without authorised credentials, and I did not use a stored token for that. A local HF token file exists on this machine; whoever owns the approved account should run the script below. Epitope overlap with the ONU complexes is unknowable before release; the site says each ONU defines "a distinct interface". Prior: ONU epitopes will sit on domains I-IV where public VHH coverage is I, I/II and III, so domain IV (trastuzumab site) is the blind spot of this proxy set.

```
# on an authorised machine
mmseqs easy-cluster all_vhh.fasta out tmp --min-seq-id 0.7 -c 0.8 --cov-mode 1   # repeat with 0.9
mmseqs easy-search proxies.fasta AVIDa_labelled.fasta aln tmp --min-seq-id 0.0 --format-output query,target,pident,qcov
```

## 4. Epitope/paratope ground truth the SEPIQ way
Tool: `cosmopolitan_voronota-lt_v1.1.497.exe` from release v1.29.4816 (published 2026-08-13). Note that the brief's URL `kliment-olechnovique/voronota` returns 404; the working owner is **`kliment-olechnovic`**. Command: `voronota-lt -i pair.pdb --compute-only-inter-chain-contacts --print-contacts-residue-level -q`, antigen-VHH pairs only (glycans, waters, hydrogens removed), residue positive if any contact area > 0. Default probe 1.4 A.

**Pipeline validation:** on 8GZ5 my run gives **26 antigen positives**, matching the site's "26/206" numerator exactly; 206 is the SEQRES length of the antigen entity (195 resolved). So the site's fraction is positives over the full construct length, not over resolved residues. VHH side: 22/123.

| Proxy | Antigen pos / resolved / SEQRES | Frac (resolved / SEQRES) | VHH pos / len | VHH frac | Pooled (resolved) |
|---|---|---|---|---|---|
| 5MY6 | 21 / 556 / 622 | .038 / .034 | 24 / 115 | .209 | 45/671 = .067 |
| 7QVK | 25 / 506 / 630 | .049 / .040 | 15 / 121 | .124 | 40/627 = .064 |
| 9MTE 27A05 | 34 / 451 / 630 | .075 / .054 | 27 / 109 | .248 | 61/560 = .109 |
| 9MTE 47D05 | 18 / 451 / 630 | .040 / .029 | 17 / 117 | .145 | 35/568 = .062 |
| 9MTX 29E09 | 31 / 400 / 630 | .077 / .049 | 27 / 110 | .245 | 58/510 = .114 |

**Reading:** HER2 antigen chains are two to four times larger than RBD, so the antigen positive fraction is 0.03-0.08, **not the 0.10-0.15 the brief expected**. Random PR-AUC equals prevalence (approximately). Macro-PR-AUC baselines: antigen-only about 0.03-0.08; VHH-only about 0.12-0.25; pooled about 0.06-0.11. Which pooling the organisers use is unknown (per /guideline "chain A and chain B" rows are both in the CSV, so pooled is likely); the antigen side then dominates the negatives. Because a CSV omits residues = 0, an SEQRES-based denominator matters for the baseline but not for the area under the curve ordering.

## 5. Leakage table (honest)
| Source | What it does | Proxy release | Effect on proxy score |
|---|---|---|---|
| AF3 (cutoff 2021-09-30; from the OpenFold portal summary via search, original paper not re-opened) | All five proxies except 5MY6 postdate it | 5MY6 in; 7QVK, 9MTE, 9MTX out | 5MY6 optimistic only |
| Chai-1 (2021-01-12; EBI course page via search) | same pattern | 5MY6 in; rest out | 5MY6 optimistic only |
| OpenFold3 preview `of3-p2-155k` (2021-09-30, RNAGym PR #33) | same as AF3 | as above | 5MY6 only |
| OpenFold3 default `openbind-2025-06-30` | later checkpoint, exact cutoff unverified (RNAGym PR: covers 1,077 of 1,422 targets of a 2024-25 benchmark) | 9MTE/9MTX (2025-11-19) still out; 7QVK in | 5MY6 and 7QVK optimistic |
| Boltz-2 (2023-06-01, RNAGym PR #33 and search summary of the paper) | latest cutoff of the four | 5MY6 and 7QVK in; 9MTE/9MTX out | 5MY6, 7QVK optimistic |
| SAbDab-nano pretraining (any learned model) | trained on all nanobody structures to date | up to the training date of the user's snapshot | proxies must be removed from the pretraining set by release date and by 70 % CDR3-plus-epitope cluster; otherwise inflated |
| Organiser rule | leakage "not an issue as long as the answer is correct" (Discussion #2 reply, 2026-08-02; public HER2 structures may be templates) | n/a | permits using the proxies as templates, so our proxy validation is deliberately NOT a clean estimate of what a template-using submission will score |
| Homology of test complexes to public ones | ONU VHHs are alpaca CDR-diverse; HER2 itself is fully public (about 60 structures) so the antigen side is always seen | n/a | the antigen fold is leaked by design; only the VHH orientation and which face is chosen is new |

Optimism, qualitatively: antigen-side residues inside domains I-IV are known for dozens of Fab/scFv epitopes, so a model that has memorised the commonly engaged surfaces (domain I, II and IV hot spots) earns PR-AUC above random on proxy and on test alike; the proxy tells us little beyond that. Only 9MTE/9MTX are leak-free for all four engines. Report proxy results as two strata: **clean (P3-P5)** and **seen (P1-P2, in some engine's training)**. I did not measure leakage numerically; no amount of AF3 confidence was run here.

## 6. Minimum viable proxy set and frozen manifest
**Verdict:** five VHH-antigen pairs, four non-redundant, three HER2 regions (I; I/II; I+III). That meets "at least 2 distinct domains" but misses domain IV and falls just under the 4-8 clean target (only three are fully clean, P3-P5, and two of those are one clonotype). Therefore also freeze a **secondary non-HER2 set**: 8GZ5 (RBD-P17, 2022-12-07; 26 antigen positives of 206, VHH 22/123), 4KRL (7D12-EGFR domain III, 2013-08-28; antigen 26/205 = .127, VHH 21/122), 8UKV (34E5-EGFR, 2024-06-19; antigen 27/321 = .084, VHH 23/119). 4KRO has a third partner (cetuximab) and is excluded. The secondary set restores the 0.13 prevalence regime and a different antigen, but it is not HER2 and not independent of AntiBinder's 8GZ5 use.

Frozen files (same folder): `proxy_manifest_v1.csv` and the `.json` twin. Columns: `proxy_id, pdb_id, vhh_name, vhh_chain, antigen_chain, release_date, method, resolution_A, her2_domain, ag_pos, ag_len_resolved, ag_len_seqres, pos_frac_ag_resolved, pos_frac_ag_seqres, vhh_pos, vhh_len, pos_frac_vhh, max_full_id_ONU, max_cdr3_id_ONU, max_id_AVIDa (NA, gated), post_cutoff_2026_05_06 (all False), in_AF3_Chai1_OF3preview_train, in_Boltz2_train, ag_epitope_uniprot_resnums, vhh_paratope_resnums` (VHH numbering is the PDB chain numbering; SEPIQ's is sequential, so convert before scoring). Raw outputs live in `C:\Temp\sepiq26\q8` (scratch, not archived).

## 7. Runbook (today 2026-10-17, deadline 2026-10-31) and the 5-submission ladder
| Day | Deliverable |
|---|---|
| Oct 17-18 | `proxy_manifest_v1.csv` frozen (done); scorer script computing macro PR-AUC (unweighted plus area-weighted) per proxy with the SEQRES baseline; AVIDa identity job run by the approved account |
| Oct 19-20 | Baseline zoo on proxies: random, hydrophobicity/exposure prior, domain-frequency prior (epitope hot spots from other HER2 antibodies, excluding the proxy itself), a CDR-only paratope prior. Report vs prevalence |
| Oct 21-22 | Co-folding on ONU11/13/23 and on P3-P5 (clean) and P1-P2 (seen): at most 2 GPUs, public partitions only, per CLAUDE.md. Deliverable: per-engine interface-probability CSVs and strata table |
| Oct 23 | Go/no-go on engines; decide ladder entries |
| Oct 24-27 | Submissions S1-S4 (one per day max, so a bug is caught) |
| Oct 28-29 | S5 reserved for the best ensemble; no new ideas |
| Oct 30-31 | Document inputs/settings/external data (required by the rules), upload by Oct 30, buffer day Oct 31 |

Ladder with kill criteria (decided on proxy macro PR-AUC divided by prevalence, clean stratum first):
1. **S1 prior-only** (domain-frequency x CDR-paratope prior). Kill/keep: serves as the floor; if clean-stratum lift < 1.3x random, the proxy metric itself is uninformative.
2. **S2 single co-folder (best of AF3/Boltz-2/Chai-1) contact map.** Kill if clean lift < S1 lift.
3. **S3 multi-engine, multi-seed consensus.** Kill if it fails to beat S2 on at least 2 of 3 clean proxies.
4. **S4 consensus plus AVIDa-derived feature** (CDR3 enrichment/cluster info). Kill if it lowers any clean-proxy lift versus S3 (data integration only if it helps).
5. **S5 best ensemble** with smoothing/calibration; submit only if it beats S3 on the clean stratum, else resubmit S3. Never spend S5 on an untested idea.
Stop rule: proxy lift differences below the bootstrap noise (n=3 clean proxies, so basically anything under about 1.5x) are not evidence; use proxies to kill, not to rank fine differences.

## Forced analogy: sports analytics walk-forward backtest
**(a) Precisely.** A quant sports modeller fits on seasons up to date T, tests only on games after T, and any feature built from post-T data is lookahead. Here the proxies are "last season" (released before 2026-05-06) and ONU11/13/23 are the unseen playoffs. The models' own PDB cutoffs are their "training window"; a proxy inside the window is a game the model already played. **(b) Testable ideas.** (i) Report lift over base rate per stratum, like a bookmaker closing-line comparison: lift = PR-AUC / prevalence. (ii) Build a "closing line" baseline (domain-frequency prior from all non-VHH HER2 antibodies except the held-out one, leave-one-epitope-out), and require that any engine beats it on clean games; this is a falsifiable test of whether co-folding adds anything. (iii) Treat each of the 3 ONUs as one playoff series: macro-averaging means one bad series costs a third, so prefer low-variance ensembles. **(c) Honesty.** It holds for the time-split logic and the base-rate discipline. It breaks on sample size (three clean games versus hundreds), on independence (27A05/29E09 are one family, like a rematch), and because the organisers explicitly allow lookahead via public templates, so the "playoffs" are not blind in the strict sense.

## Gotchas / what could fool us
- Prevalence differs by chain and by denominator (resolved vs SEQRES, antigen vs pooled). A PR-AUC of 0.15 is 2x random on HER2 but about 1x on 8GZ5. Always divide by prevalence.
- The 9MTE/9MTX antigen constructs lack most of domain IV, so a "domain IV" prior cannot be tested and over-penalises nothing.
- Numbering: cryo-EM and crystal chains use UniProt (with signal peptide); VHH uses PDB numbering here but sequential in SEPIQ. A one-off shift silently zeroes the score.
- Voronota contact "positive" is area > 0 here; the organisers' threshold and weighting (`fact`, `weight`) are only partially known, so the true positives may be fewer or more.
- The 9MTE VHH 27A05 spans domains I and III; HER2 ECD is conformationally flexible and compact/extended states differ (9QBF/9QBG), so contacts depend on state.
- 7QVK NM-02 has an unusual disulfide and may be humanised; its epitope is not representative of the alpaca library.
- Identity numbers are from a Biopython global alignment, not mmseqs; they are indicative only, and CDR3 identity on 7-9 residue loops is unstable.
- AVIDa leakage not measured; assume 0 until run.

## Implications for the challenge
1. Use `proxy_manifest_v1.csv` as the frozen test; never tune on it beyond kill decisions (3 clean proxies are too few).
2. Compute every proxy score as lift = PR-AUC / SEQRES prevalence and report clean (P3-P5) and seen (P1-P2) strata separately.
3. Run a leave-one-epitope-out domain-frequency prior as the floor engine; submit it as S1 if it beats random.
4. Add the secondary 8GZ5/4KRL/8UKV set only for pipeline sanity (prevalence about 0.13), never to choose between engines on HER2.
5. Remove all proxy entries and their 70 % CDR3 clusters from any SAbDab-nano pretraining, and say in the submission documentation that public HER2 structures were used as templates.
6. Get an authorised account to run the AVIDa identity script by Oct 18; this is the only missing column in the manifest.
7. Hold S5 for the best validated ensemble; kill any rung that fails its stated criterion.

## Open questions
- Exact date the ONU sequences or cryo-EM maps were produced (settles the cutoff).
- The organisers' pooling and weight definitions for the ground-truth CSV.
- AVIDa-hHER2 max identity to the proxies (gated).
- Whether SAbDab-nano lists HER2 VHH entries not in RCSB's P04626 mapping (webapp not queried).
- OpenFold3 `openbind-2025-06-30` exact cutoff.
- Whether the Takeda-linked 9MTE/9MTX sequences are alpaca-derived or synthetic/humanised.

## Sources
- https://search.rcsb.org/rcsbsearch/v2/query (HER2 UniProt and text queries, 2026-10-17)
- https://data.rcsb.org/graphql and https://data.rcsb.org/rest/v1/core/entry/{5MY6,7QVK,9MTE,9MTX,8GZ5,4KRL,4KRO,8UKV,3QYC,5MYX,8HLM} (entry metadata, sequences, citations)
- https://files.rcsb.org/download/ (coordinate files for the Voronota-LT runs)
- https://www.rcsb.org/annotations/9mte (SAbDab annotation)
- https://sepiq.uk/detail (ONU sequences, dates)
- https://huggingface.co/api/datasets/sepiq-2026/SEPIQ-2026-training-data (createdAt, file list; contents gated, 401 on files and card)
- https://api.github.com/repos/kliment-olechnovic/voronota/releases (v1.29.4816, Voronota-LT 1.1.497 binary)
- https://github.com/MarksLab-DasLab/RNAGym/pull/33 (OpenFold3, Boltz-2, Protenix cutoffs)
- https://www.ebi.ac.uk/training/online/courses/alphafold/alphafold-3-and-alphafold-server/introducing-alphafold-3/how-have-alphafold-3s-predictions-been-validated/ and https://jeremywohlwend.com/assets/boltz2.pdf (named in search results; PDF text not readable, Chai-1 and AF3 cutoffs taken from the search summary)
- Sibling notes: research/q3_assay_ngs_ground_truth/avida_hher2_and_avida_family_dataset_anatomy_columns_sizes_label_logic.md; research/q4_challenge_intelligence/hf_space_dataset_files_template_csvs_submission_mechanics_and_community_discussion.md
- DOIs: 10.1158/1078-0432.CCR-17-0310; 10.1371/journal.pone.0288259; 10.1158/1535-7163.MCT-25-0654; 10.1093/nar/gkab1050
