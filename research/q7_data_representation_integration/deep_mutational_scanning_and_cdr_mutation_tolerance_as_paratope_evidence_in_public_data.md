---
title: "Deep mutational scanning and CDR mutation tolerance as paratope evidence in public data"
queen: q7_data_representation_integration
king: king_infer
worker: deep_mutational_scanning_and_cdr_mutation_tolerance_as_paratope_evidence_in_public_data
tier: expert
tags: [DMS, clonal-variants, tolerance, paratope, AVIDa-hHER2, PR-AUC, negative-result, competition-panning, ONU11, ONU13, ONU23]
confidence: medium
challenge_relevance: 2
serendipity: "Music-IR cover-version lens (invariant notes = melody = paratope): the covers differ only at the sequencing-error floor in CDR3, so the lens fails for CDR3 but the few loud 'arrangement' columns (CDR1/CDR2/FR2) are usable as negative evidence; partially paid off."
date: 2026-10-17
---

## TL;DR
The three target clones (ONU11, ONU13, ONU23) are rows in the local AVIDa-hHER2 table, each with a family of 1,330 to 4,420 sequences, so a "free DMS" can be read per target. It is nearly flat: in all three families CDR3 varies only at the sequencing/PCR error floor (about 0.5 to 2 % per column, same as framework), so natural clonal variants do NOT substitute for a DMS inside CDR3. A tolerance-only score (built from 348 enriched families) scored PR-AUC 0.137 vs 0.206 for a CDR3-uniform baseline on 5 public HER2-VHH interfaces (falsified). Separately, the NGS table's trastuzumab/pertuzumab competition columns give a real antigen-side signal: ONU13 is strongly depleted by trastuzumab, ONU11 and ONU23 are not.

## 1. Resource check (done first)
C: 65 GB free, D: 45.1 GB free, CPU load 1 %, RAM about 72 GB free. All inputs were already local (`C:\Temp\sepiq26\q7_clonotype\`, 476 MB + 120 MB); no download. Whole analysis ran in under 2 minutes of CPU (single process). Scripts: `research/q7_data_representation_integration/scripts_dms/` (s1 to s9 + `common.py`); working dir `C:\Temp\sepiq26\q7_dms\`.

## 2. Q1 Public DMS inventory (what I could and could not verify)
| Resource | Accession / location | Size | Public? / in window | Status |
|---|---|---|---|---|
| AVIDa-hHER2 NGS table | local `NGS_read_count_table.csv`, 29 panning columns | 1,843,875 unique VHH | local copy; template repo gated | opened, used |
| AVIDa-hHER2 labelled table | local `AVIDa-hHER2.csv` | 1,843,875 rows; labels Yes 7,316, Not 12,051, noise 746, non-sig. 1,823,762 | as above | opened. Note: more Yes than the brief's "few hundred" |
| Mason 2021 trastuzumab CDRH3 | doi 10.1038/s41551-021-00699-9 | per Europe PMC/search summaries: libraries of order 1e4 variants; networks screened about 1e8 in silico; 30/30 random variants kept HER2 binding | Europe PMC record flags no associated data; no accession found | paper paywalled; library size "39,000" and any SRA/GitHub accession are UNVERIFIED |
| MaveDB antibody/nanobody scans | mavedb.org | none found | web search returned no urn:mavedb for an antibody/nanobody CDR scan; site is a JS shell | negative, low confidence |
| HER2 ECD DMS / epitope mapping | none found | n/a | two searches found no public ERBB2 ECD DMS; one extended search was blocked by a tool content filter | treat as "none known" |
| Related antibody landscapes (not HER2) | Adams 2016 eLife doi 10.7554/elife.23156 (Tite-Seq); Phillips 2021 eLife doi 10.7554/elife.71393 | n/a | titles confirmed via Europe PMC only | background |
No public HER2-VHH CDR scan exists that I could find; the only HER2 "DMS-like" data in the 14-day window is AVIDa-hHER2 itself.

Public HER2-VHH complexes actually usable (verified from local PDB/CIF + RCSB): 5MY6 (2Rs15d), 7QVK (NM-02), 9MTE (27A05 + 47D05, two VHH), 9MTX (29E09) = 4 entries, 5 interfaces. **The brief's 5MY7 and 7PH0 are not HER2-VHH complexes** (RCSB titles: "Adhesin Complex Protein from Neisseria meningitidis" and "light-adapted AsLOV2 Q513L"), so they were dropped.

## 3. Q2 Near-neighbour variants inside AVIDa-hHER2
Clone families = the dataset's `Cluster` column (93 % identity). Counts (script s3):

| Family definition | Families with 10 or more variants |
|---|---|
| all members (78 % of sequences have total = 1 read) | 25,173 (of 473,729 clusters); 9,313 with 30 or more |
| unique sequences with total 2 or more reads | 6,044 |
| unique sequences with total 3 or more reads | 2,633 |
| enriched: at least 10 unique (total 2 or more) plus at least 3 "Yes" members | 586 (348 had a parseable consensus and were used) |
| at least 10 "Yes" members | 120 |

CDR3 parsing succeeded for 81.3 % of sequences, 230,911 unique CDR3s. No MMseqs2 on this box; I used the dataset clusters plus numpy Hamming (script s7). Nearest AVIDa CDR3 to each public-PDB VHH: Hamming 3 to 8 over lengths 7 to 17 with no sensible homology (e.g. 2Rs15d AVCYNLETY vs best NAVYGLTTY, 5 mismatches of 9). **No AVIDa family can be transferred to a PDB VHH**, which shapes the Q3/Q6 design below.

Label coherence of clonal neighbours (146,865 sequences with 3 or more reads, same cluster, equal length; script s7). The base Yes rate is 4.8 %:

| Hamming | pairs | P(neighbour Yes given Yes) | P(neighbour Yes given non-Yes) | odds ratio |
|---|---|---|---|---|
| 1 | 114,654 | 0.211 | 0.159 | 1.4 |
| 2 | 1,766,014 | 0.231 | 0.069 | 4.0 |
| 3 | 761,955 | 0.223 | 0.081 | 3.2 |
Clusters are label-pure (only 50 of 2,480 clusters containing a Yes also contain a Not). So variants inherit the binder label about 4 to 5x above base rate, but pair counts are dominated by a few giant clusters.

## 4. Q3 and Q6 Tolerance versus paratope on public HER2-VHH complexes
Design (all CPU, about 1 minute). Because no AVIDa family matches a PDB VHH, family-specific tolerance cannot be applied. Instead I built a **position prior** from the 348 enriched families: per column mutation rate (fraction of unique, 2 or more read members differing from the family consensus) pooled by (region, distance to nearest CDR edge), then looked each PDB residue up by region. Contacts: any heavy atom within 4 A of HER2 (not Voronota area; the official truth will differ). Regions were assigned by regex anchors, so they are approximate IMGT-like. Pooled prior (mean mismatch): CDR1 0.026, CDR2 0.020, CDR3 0.0147, FR1 0.0138, FR2 0.0108, FR3 0.0124, FR4 0.0013 (full table in `scripts_dms/prior_tolerance_by_region_pos.csv`).

Contact base rates: 5MY6 0.157, 7QVK 0.091, 9MTE_A 0.147, 9MTE_B 0.111, 9MTX 0.155 (macro 0.132). Contacts per region show that 31 of 75 contact residues (41 %) sit outside the CDRs (mostly FR2), which CDR-only baselines cannot reach.

Macro PR-AUC over 5 interfaces, two-level bootstrap (resample interfaces then residues, B = 2000, seed 0):

| Score | macro PR-AUC | 95 % CI |
|---|---|---|
| contact base rate | 0.132 | n/a |
| tolerance only, low mismatch = paratope | 0.137 | 0.103 to 0.204 |
| tolerance only, low entropy | 0.148 | 0.110 to 0.222 |
| CDR3-uniform baseline | 0.206 | 0.144 to 0.301 |
| all-CDR uniform | 0.257 | 0.182 to 0.352 |
| CDR3 uniform + tolerance tie-break | 0.254 | 0.171 to 0.378 |
| CDR3 uniform + simple centrality tie-break | 0.258 | (point only) |

Deltas versus CDR3-uniform: tolerance-only minus baseline = -0.069 (CI -0.145 to +0.003; only 3.4 % of bootstraps above 0). Tolerance as CDR3 tie-break = +0.049 (CI +0.013 to +0.109), **but** a pure centrality tie-break gives the same +0.052, and a permutation of the 7 CDR3 prior values gives a null mean 0.228 (95 % 0.198 to 0.258; p = 0.048). So the gain is CDR3 centrality (central loop residues contact more), not tolerance.

**Verdict on the falsifiable experiment: FALSIFIED.** The tolerance-only score does not beat the CDR3-uniform baseline (point estimate worse; CI includes zero), on 5 interfaces from 3+ public complexes. Power is low (5 interfaces, 11 to 18 contacts each), so "no evidence of benefit" rather than "proven zero".

## 5. Q2 corollary: the three target clones' own families
Challenge numbering = dataset index + 1 (M = 1); I confirmed each target sequence is present in the table (ONU11 label noise, 7,058 reads, Cluster22, 2,731 members; ONU13 Yes, 6,874 reads, Cluster2, 4,420; ONU23 Yes, 4,063, Cluster42, 1,330). Per-column mutation rate across unique family members with 2 or more reads (script s9; framework floor 0.7 to 0.9 %):

| Clone | unique members used | CDR3 columns | outliers above floor |
|---|---|---|---|
| ONU11 | 618 | all 0.3 to 1.9 % (at floor) | L53 (CDR2) 36.4 %; S13 10.5 %; A16 4.7 % |
| ONU13 | 1,012 | all 0.4 to 2.0 % (at floor) | E28 (CDR1) 67.5 %; Y39 34.3 %; Q46 24.4 % (FR2); N56 6.4 %; E54 5.7 %; I33 5.1 % |
| ONU23 | 272 | all 0 to 2.2 % (at floor) | none above 5.5 % (A16, L13 FR1) |

Interpretation: CDR3 is invariant in the family, but invariance at the error floor cannot separate contact from non-contact CDR3 residues. The loud columns (ONU11 L53, ONU13 E28/Y39/Q46) are plausibly real clonal variation (not a 1 % error) and so mark positions that are not folding-critical; contact-status unknown. Median Hamming distance of members from the target is 1 (ONU11, ONU23) and 3 (ONU13), so most members are single-step neighbours, which is partly error.

## 6. Q5 Antigen side (HER2 domains II and IV)
No public HER2 ECD DMS exists (see Q1). The substitute is the competition-panning columns in `NGS_read_count_table.csv`. Column semantics (competitor pre-bound during panning) are my reading of the column names and are **unverified**; the table's header says "Companion" while the labelled CSV says "RabMAb" for the same C3 column. RPM = reads per million in that column:

| Clone | HER2 alone 1st round 37C | Companion C3 37C (baseline) | Trastuzumab C3 37C / 4C | Pertuzumab C3 37C / 4C |
|---|---|---|---|---|
| ONU11 | 1,238 | 1,257 | 5,385 / 10,594 | 7,999 / 4,932 |
| ONU13 | 1,777 | 1,977 | 11 / 55 | 4,663 / 18,880 |
| ONU23 | 599 | 312 | 1,984 / 3,066 | 885 / 9,206 |
The Trastuzumab C1 and C2 columns agree (ONU13 0 to 84 RPM; ONU11 2,085 to 2,718; ONU23 492 to 715).

Reading: **ONU13 is depleted by more than 20x under trastuzumab and not by pertuzumab, so it plausibly overlaps or sterically abuts the trastuzumab epitope (domain IV)**. ONU11 and ONU23 are not depleted by either antibody (rises are compositional: competitors remove other clones), so they are probably away from the domain IV trastuzumab site and the domain II pertuzumab site; location otherwise unknown. Per-residue escape or sensitivity values for HER2: unknown, nothing published that I found. The trastuzumab (domain IV) and pertuzumab (domain II) contact structures are in local PDB 1N8Z and 1S78 (see q1 files).

## 7. Q4 Literature: does DMS sensitivity coincide with contacts?
I could not obtain a quantitative, primary-source overlap number. Fetches of the SARS-CoV-2 RBD DMS papers failed (a tool content filter blocked two and one returned the wrong article), and the paper-search results were secondary. What I can say, with the source in each case:
- Computational/structural analysis of antibody and ACE2 RBD complexes (PMC8319916, search summary only, not opened): shared hotspots Y449, L455, Y489 destabilised both ACE2 and antibody binding in modelling; qualitative.
- Yeast-display escape mapping: many escape mutations cost little ACE2 binding or expression, so escape and contact sets overlap only partly (search summary, unverified).
- VHH72 nanobody affinity maturation by DMS (PMC9132424, mAbs 2022; search summary): DMS identified permissive positions and beneficial substitutions, not a contact list.
- A humanisation patent example (USPTO 12391770 and related, search summary): of 4 predicted VL contact residues only Y91 was intolerant, while other intolerant residues were stem-loop glycines (G89, G96, G98, G34), i.e. structure-critical rather than contacting.
General, well-established caveat: DMS sensitivity marks hotspots plus folding-critical sites; tolerant positions can still contact. Starr 2020 numbers: unverified; nothing is quoted here.

## Forced analogy: music information retrieval, cover versions
(a) A clonal family = covers of one song; invariant positions = melody (paratope), free variation = arrangement; local alignment of covers = DMS. (b) Testable idea: use the loud "arrangement" columns as negative evidence only. Multiply a baseline contact prior by (1 - w x z) where z = family mutation rate z-scored against the framework floor, with w tuned on proxy complexes; apply to ONU11 L53 and ONU13 E28/Y39/Q46 (downweight to near zero). It cannot be validated on the public set since no PDB VHH has a family; the 5-interface test above tests only the pooled-prior version, which failed. (c) Verdict: the analogy **partly holds**. It breaks at CDR3: real covers differ at arrangement notes, but these families' "covers" are mostly the same take re-recorded with noise (error-floor variation). Melody (invariance) is present but not informative since framework is equally invariant. It also breaks because enrichment, not affinity, gates which covers appear.

## Gotchas / what could fool us
1. **Error floor equals signal.** 78 % of sequences have a single read; unique members with 2 or more reads still show 0.7 to 1.4 % framework mismatch. Any tolerance map must be read against the framework floor, not zero.
2. **Cluster definition bakes in invariance.** The `Cluster` column groups at 93 % identity (about 8 substitutions over 120 aa), which forces near-identical CDR3s into a family and truncates variation exactly where we want it.
3. **Labels are count-conditional.** Yes/Not come from chi-squared on read counts, so a low-count variant of a binder is "non-sig." purely from depth. Neighbour-label concordance (OR 1.4 to 4) mixes tolerance with counting noise.
4. **Pooled-prior gains can be pure geometry.** The +0.049 CDR3 tie-break gain is reproduced by centrality alone; always run a position-only control.
5. **Contact definition.** My 4 A heavy-atom contacts differ from Voronota-LT area truth; ranks of marginal residues may change. Contact fraction by region: 31 of 75 contacts are outside CDRs.
6. **ONU11 is labelled "noise"** (background IE -11.4, target IE -500): it enriches in the negative-control panning too, yet enriches strongly in HER2 competition columns. Do not drop it from training on that label alone.
7. **Brief errors:** 5MY7 and 7PH0 are not HER2-VHH complexes; HF API returned 401 for the public dataset path I tried.
8. Competition-column semantics are inferred; the header naming differs between the two local files (Companion vs RabMAb).

## Implications for the challenge
1. Do not use clonal-variant "DMS" as a paratope predictor in CDR3. It measured nothing above noise; save the effort.
2. Use loud family columns (ONU11 L53; ONU13 E28, Y39, Q46) as soft negative evidence on the VHH side (small downweight), and verify on the held-out cryo-EM only after judging.
3. Use competition columns as the antigen-side prior: weight domain IV (trastuzumab neighbourhood) for ONU13; treat ONU11/ONU23 as not near the 4D5 or pertuzumab sites; encode as a prior on the antigen chain, not as a hard mask.
4. Add CDR centrality as a cheap baseline feature (about +0.05 PR-AUC over CDR3-uniform on 5 public interfaces); all-CDR uniform (0.257) is just as strong, and 41 % of contacts are outside CDRs (mostly FR2), so do not zero the framework.
5. Treat CDR3-uniform around 0.21 and all-CDR around 0.26 macro PR-AUC as the floor any learned model must beat on these proxies.
6. Next cheap experiment: weight the HER2 residue prior by an escape-style competition score (ONU13 vs trastuzumab 4D5 contacts in 1N8Z) and test whether it ranks 4D5-contacting domain IV residues first.

## Open questions
- Is there a MaveDB or SRA deposit for Mason 2021 (library size, accession)? Unverified.
- Do the "Companion/RabMAb" columns mean a competing rabbit mAb? What was pre-bound in the trastuzumab and pertuzumab columns?
- Does a stricter family definition (CDR3 Hamming 1 to 3 plus unique-molecular-identifier-free error model, e.g. count-ratio test against the parent) reveal real CDR3 tolerance?
- A quantitative overlap between DMS-sensitive and contact residues from a primary paper (Starr 2020, Phillips 2021) remains to be pulled.

## Sources
- AVIDa-hHER2 local files `NGS_read_count_table.csv`, `AVIDa-hHER2.csv`, README (opened locally)
- PDB entries 5MY6, 7QVK, 9MTE, 9MTX local files; RCSB core API titles for 5MY7, 7PH0 (https://data.rcsb.org/rest/v1/core/entry/7PH0)
- Local copy of the sepiq.uk /detail page at <hotdir>/raw/detail.txt (ONU11/13/23 sequences)
awdetail.txt)  of the sepiq.uk /detail page (ONU11/13/23 sequences)
- Europe PMC record for doi 10.1038/s41551-021-00699-9 (authors, abstract, no data link)
- Europe PMC search listing doi 10.7554/elife.23156, 10.7554/elife.71393
- Search-result summaries only (not opened in full): https://pmc.ncbi.nlm.nih.gov/articles/PMC8319916, https://pmc.ncbi.nlm.nih.gov/articles/PMC9132424, USPTO 12391770
