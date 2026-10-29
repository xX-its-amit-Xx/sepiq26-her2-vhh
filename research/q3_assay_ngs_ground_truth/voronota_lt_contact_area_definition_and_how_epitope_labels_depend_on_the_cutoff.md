---
title: Voronota-LT contact-area ground truth - how the epitope label depends on the cutoff, and the noise ceiling it implies
queen: q3_assay_ngs_ground_truth
king: king_world
worker: voronota_lt_contact_area_definition_and_how_epitope_labels_depend_on_the_cutoff
tier: expert
tags: [Voronota-LT, ground truth, epitope label, cutoff, label noise, PR-AUC ceiling, weighted PR-AUC, bootstrap, submission format]
confidence: medium
challenge_relevance: 4
serendipity: Law of evidence and standard of proof. The cutoff is the standard of proof, and it paid off. About 70% of residues convicted at "area > 0" are convicted under every standard, and that robust core holds about 92% of the antigen contact area, so the weighted metric is nearly cutoff-proof while the unweighted metric is not.
date: 2026-10-17
---

## TL;DR
The SEPIQ ground truth is a list of antigen and VHH residues with at least one Voronota-LT atom-atom contact. The guideline gives no area cutoff, so a residue is positive if its contact area is above 0. Across 24 real nanobody-antigen chain pairs from 13 PDB entries, I measured the positive fraction on the antigen at 13.2% for area > 0 and 11.3% for area >= 5 A^2. A perfect predictor scores about 0.92-0.97 PR-AUC against a replicate copy of the same complex, and about 0.83-0.88 if 10% of positives are swapped. With only 3 complexes, the paired CI is wide (about 0.15-0.19 wide at residue level in my simulation), and a complex-level cluster bootstrap can only exclude zero if all three per-complex differences have the same sign.

## 1. How Voronota-LT defines contact area (Q1)
Sources: expansion_lt README, core README, bioRxiv listing, SEPIQ /guideline.

| Item | Value | Where |
|---|---|---|
| Tessellation | Radical (Laguerre / power) tessellation of atomic balls. Not the additively weighted Voronoi tessellation used by core Voronota. AW mode exists via `--run-in-aw-diagram-regime` | LT README |
| Constraint | Each atom's cell and each contact surface is clipped inside the solvent-accessible surface of a rolling probe | LT README |
| Probe radius | `--probe` default 1.4 A. Fastest below 2.0 A | LT README |
| Atomic radii | van der Waals balls. The default table is not listed in the README. A custom table can be passed with `--pdb-or-mmcif-radii-config-file` | LT README |
| "Contacts" | Atom-atom pair with a shared tessellation face. Columns `ID1_*`, `ID2_*`, `area`, `arc_length`, `distance`. Atom pairs can have contact area while 4-6 A apart (see below) | LT README, my run |
| "Cells" | Per-atom `sas_area` and `volume`. These are the SAS-based quantities, not contacts | LT README |
| Residue level | `--print-contacts-residue-level` prints `ir` rows with `area` and `count`. Cells at residue level print `rc` rows with `sas_area`. The aggregation is a sum of atom-level areas | LT README, my run |
| Area cutoff | None documented. The only distance-type filter is `-max-dist` in the selection language | LT README |
| Ground truth recipe | `--restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]'`, then sum per residue. Each residue with at least one contact gets `fact = 1` and `weight` = its summed binding-site area. Columns `chain seqNum resName fact weight` | /guideline |

Notes.
- I ran the official prebuilt binary (`cosmopolitan_voronota-lt_v1.1.497.exe`, release v1.29.4816, 2026-08-13). The guideline names v1.1.479 in its download command and v1.29.4602 in its release URL, so the organisers may not have used my version. Differences between LT versions are unquantified.
- A contact survives with a tiny area. The first printed 8GZ5 contact is Tyr351 OH to Tyr109 OH at 5.64 A and area 1.12 A^2. So "area > 0" is not a 4 A rule.
- Heteroatoms (glycans, ligands) change SAS and so change areas. The organisers' command line for hetero handling is not stated. I excluded them.
- The paper trail is thin. The preprint I found is "Voronota-LT: efficient, flexible and solvent-aware tessellation-based analysis of atomic interactions", bioRxiv 10.1101/2024.02.05.577169, by Olechnovic and Grudinin (not Venclovas). I could not confirm a 2025 Bioinformatics or Bioinformatics Advances version, and the full-text fetch hit HTTP 429. The algorithm facts above come from the README, not the paper.

## 2. Positive fraction versus cutoff, measured (Q2)
Method (my own run, scripts in `C:\Temp\sepiq26\q3vor\scripts`): 13 PDB entries downloaded from files.rcsb.org, protein atoms only, no hydrogens, first altloc, heteroatoms dropped. The VHH was detected by a WGQG motif and 95-145 residues, and the antigen chain is the chain with most atoms within 4.5 A. This gave 24 chain pairs (many are asymmetric-unit copies, so effective n is smaller). Residue counts are observed residues, not full-length sequence. Voronota-LT came from the prebuilt binary. dSASA is isolated chain SAS minus in-complex SAS per residue from Voronota-LT cell tables. Distances are minimum heavy-atom distances. "CAPRI" is residues with any heavy atom within 5 A of the partner (my approximation of the CAPRI interface residue definition, not checked against the CAPRI paper).

Antigen-side positive fraction, per pair, selected entries:

| Entry (pair) | n antigen res | area>0 | area>=1 | area>=5 | area>=10 | d<4 A | d<5 A (CAPRI) | dSASA>0 | dSASA>=10 |
|---|---|---|---|---|---|---|---|---|---|
| 8GZ5 (A,B) | 191 | 0.126 (24) | 0.115 | 0.089 (17) | 0.073 | 0.073 | 0.089 | 0.126 | 0.073 |
| 5MY6 HER2-nanobody (A,B) | 553 | 0.038 (21) | 0.034 | 0.034 (19) | 0.031 | 0.031 | 0.033 | 0.038 | 0.031 |
| 4KRL EGFR-7D12 (A,B) | 205 | 0.127 (26) | 0.127 | 0.088 (18) | 0.068 | 0.059 | 0.078 | 0.127 | 0.063 |
| 5IMK VSIG4 | 118 | 0.212 | 0.195 | 0.186 | 0.153 | 0.161 | 0.178 | 0.203 | 0.127 |
| 1MEL lysozyme (L,A) | 127 | 0.205 | 0.205 | 0.181 | 0.181 | 0.173 | 0.205 | 0.197 | 0.150 |
| 5F7L BabA (A,B) | 375 | 0.083 | 0.083 | 0.077 | 0.064 | 0.053 | 0.083 | 0.080 | 0.056 |
| Mean of all 24 pairs, antigen | | 0.132 | 0.127 | 0.113 | 0.101 | 0.095 | 0.117 | 0.130 | 0.093 |
| Mean of all 24 pairs, VHH | | 0.190 | 0.181 | 0.166 | 0.149 | 0.145 | 0.172 | 0.179 | 0.122 |

The full 24-row table with all columns is in the `.json` beside this file.

Findings.
- Area > 0 gives 13.2% (range 3.8-21.2%) on the antigen and 19.0% (range 12.1-26.6%) on the VHH. The VHH fraction is higher because a nanobody is small and CDR-heavy.
- Moving from area > 0 to >= 5 A^2 removes about 14% of antigen positives on average (0.132 to 0.113). The 5 A^2 cutoff removes only 0-3.4% of the total contact area, because the dropped residues are the small ones.
- Distance 4 A is stricter than area >= 5 (0.095 versus 0.113). The 5 A distance rule sits between area > 0 and area >= 1... roughly between area >= 5 and area > 0 (0.117).
- dSASA > 0 tracks area > 0 closely (0.130 versus 0.132), as both come from the SAS-clipped geometry. dSASA >= 10 is stricter, about the same as d < 4 A.
- 8GZ5: the brief says 26/206 = 0.126. I get 24/191 = 0.126 at area > 0. The fractions match, the counts do not. My structure has 191 observed antigen residues, so the 206 is probably a different residue span (sequence rather than modelled residues) and 26 vs 24 may come from heteroatom or altloc handling. Unverified.
- 5MY6 is the only HER2-nanobody structure I ran. A 553-residue antigen gives 21 positives (3.8%). If the real task counts the full HER2 ECD (about 620 residues) with about 20-30 epitope residues, expect a positive fraction of 3-5% on the antigen chain, not 12.6%. That changes the random-predictor PR-AUC baseline by a factor of 3.

### Forced analogy: the cutoff as a standard of proof
Residues are defendants. Area > 0 is balance of probabilities (convict on any contact). Area >= 5 A^2 or d < 4 A is beyond reasonable doubt. I convicted a residue under all of: area > 0, >= 1, >= 5, d < 4, d < 5, dSASA > 0.

| Verdict group | Antigen residues (sum over 24 pairs) | Share of the "area > 0" convictions |
|---|---|---|
| Convicted under area > 0 | 612 | 100% |
| Convicted under every standard (robust core) | 430 | 70.3% |
| Convicted under at least one standard (union) | 615 | 100.5% (a few residues are positive by distance but have no area) |
| VHH side: area > 0 / core | 556 / 396 | core = 71.2% |

The robust core holds on average 92.3% of the antigen contact area (minimum 82.9%). The 30% of residues convicted only under the lenient standard hold about 8% of the area. So the analogy holds well for area weighting (borderline residues are cheap to be wrong about) and for the unweighted metric it means about 30% of the labelled positives are borderline. The analogy partially breaks in one place: courts have a single verdict, while here the organisers have already fixed the standard (area > 0, unstated), so we cannot choose it. The testable idea is to rank the robust core first, then the borderline rim, as in Section 4.

## 3. Binary or continuous? (Q3)
The ground truth carries both: `fact` (binary, 1 for any contact) and `weight` (continuous area). Per /guideline:
- Unweighted PR-AUC treats each `fact = 1` residue equally. Precision and recall are counted by residue.
- Weighted PR-AUC replaces recall by TP_area / P_area and keeps ordinary precision (the guideline defines only weighted recall, not the full curve).
- The guideline lists a "zero weight" pitfall: a `fact = 1` residue with weight 0 adds nothing to weighted recall.

What each variant rewards, from my area distributions (antigen side, 24 pairs):
- The top 5 residues by area hold 37-56% of the contact area, and the top 10 hold 62-86%. The median positive residue has 11-36 A^2.
- Unweighted PR-AUC: a perfect ranking needs every positive above every negative. A model that finds 10 core residues and ranks the other 15-20 rim residues randomly among negatives loses a lot, because the rim is 30-60% of the positives by count.
- Weighted PR-AUC: finding the top 10 residues first gives recall 0.62-0.86 almost immediately. Rim residues matter little, but false positives still lower precision.

How to place probability mass.
- Both metrics use only the ranking (PR-AUC is threshold-free and rank-based), so calibration of the 0-1 values does not matter. Only order does. Do not give ties among many residues. A tie group is scored as one point on the curve.
- Rank by expected area, not only by probability of contact: E[area] = P(contact) x E[area | contact]. This serves the weighted metric without hurting the unweighted one much.
- Put large aromatic/charged CDR3-facing residues and the central epitope patch first, then the rim.
- Omitted residues count as 0, so omitting low-confidence residues is the same as ranking them last, tied.

The /detail versus /guideline contradiction: /detail names PR-AUC only for the baseline and says the leaderboard metric is not specified. /guideline defines unweighted and area-weighted PR-AUC, macro over 3 antibodies. I cannot resolve which is official. The practical answer is that both are rank metrics on the same ranking, so optimise a ranking that serves both (the E[area] ranking above), and check both locally.

## 4. Sensitivity of the label to coordinates (Q4)
Two experiments.

Experiment A, synthetic perturbation (12 replicates per pair, 24 pairs). Rigid shift of the VHH by a random direction, or independent per-atom jitter with RMS displacement s. Mean number of residues whose label changes per chain pair:

| Perturbation | Antigen area>0 | Antigen area>=5 | VHH area>0 | VHH area>=5 | Flips per base positive (area>0, antigen) |
|---|---|---|---|---|---|
| Rigid 0.3 A | 0.68 | 0.64 | 0.51 | 0.44 | 2.7% |
| Rigid 0.5 A | 1.17 | 0.93 | 0.93 | 0.66 | 4.7% |
| Atom jitter 0.3 A RMS | 0.97 | 0.72 | 0.74 | 0.60 | 3.8% |
| Atom jitter 0.5 A RMS | 1.67 | 1.23 | 1.21 | 0.89 | 6.7% |

A perfect predictor of the unperturbed labels, scored against the perturbed labels, gets PR-AUC (average precision) of 0.976 (rigid 0.3 A) down to 0.944 (jitter 0.5 A) on the antigen at area > 0. Contrary to what one might expect, the 5 A^2 cutoff is not clearly more stable under these shifts, since each residue near the cutoff flips just the same.

Experiment B, real replicates. In entries with several copies of the same complex in the asymmetric unit (1MEL, 4LGP, 3K1K, 5F7L, 3EZJ, two pairs in 7KN5), I compared labels between same-VHH copies, matched by residue number. The pairs between different VHHs in 7KN5 and 7OLZ (different epitopes) are excluded, since they disagree for biological reasons, not noise.

| Chain, cutoff | Pairs | Discordant / union positives (mean) | Discordant / positives | AP of binary replicate (unweighted) | Weighted AP, area-ranked |
|---|---|---|---|---|---|
| Antigen, area>0 | 12 | 6.2% | 6.4% | 0.942 | 0.998 |
| Antigen, area>=1 | 12 | 3.6% | 3.8% | 0.965 | 0.998 |
| Antigen, area>=5 | 12 | 5.2% | 5.5% | 0.951 | 0.998 |
| VHH, area>0 | 12 | 6.2% | 6.5% | 0.943 | 0.997 |
| VHH, area>=1 | 12 | 7.8% | 8.3% | 0.926 | 0.997 |
| VHH, area>=5 | 12 | 8.5% | 8.9% | 0.922 | 0.997 |

Label-flip rate noise floor: about 4-9% of positives between independent copies in crystals at the resolutions of these entries. The maximum for single pairs was 28.6% (7KN5, VHH side, area >= 5), and 0% for some pairs. I did not run different re-refined entries of the same protein, so "re-refined entries" is not covered.

Caveats. The copies are the same crystal, so crystal-packing differences are included, but data-set-to-data-set differences (different crystals, different refinement) are not. The target ground truth is cryo-EM at about 3.0 A, where side-chain placement is less certain than in the crystals I used (resolutions not checked per entry). I would expect a larger flip rate for it, but I have no measurement. Treat 4-9% as a floor.

## 5. Metric-level noise ceiling (Q5)
Perfect predictor (score = true label) against truth where a fraction x of positives is swapped with an equal number of negatives (simulation, 400 draws each):

| x (positives swapped) | HER2-like (L=620, 4% positive) | RBD-like (L=206, 12.6%) | VHH-like (L=120, 19%) |
|---|---|---|---|
| 0 | 1.000 | 1.000 | 1.000 |
| 5% | 0.934 | 0.939 | 0.938 |
| 10% | 0.864 | 0.827 | 0.877 |
| 15% | 0.737 | 0.772 | 0.819 |
| 20% | 0.683 | 0.716 | 0.707 |
| 30% | 0.523 | 0.577 | 0.604 |

So at the measured floor (x about 5-9%) the unweighted ceiling is about 0.90-0.94. The empirical replicate scores (0.92-0.97) agree. A model with a real 0.2 PR-AUC is far below the ceiling, so label noise does not limit ranking differences at the current baseline level (0.176 on the 8GZ5 proxy). It matters only for top teams. The weighted ceiling is about 0.997, because flips happen at tiny-area residues.

Bootstrap CI with 3 complexes (simulation: 3 complexes of about 740 residues, 6.4% positive, Gaussian-score predictors, residue-level bootstrap as in /guideline, B=300 here rather than 2000, 12 simulated data sets per row):

| Predictor separation (d') | Mean dScore | Mean 95% CI width | Fraction of data sets where CI excludes 0 |
|---|---|---|---|
| 1.5 vs 1.0 | 0.154 | 0.179 | 100% |
| 1.5 vs 1.25 | 0.076 | 0.193 | 33% |
| 2.0 vs 1.0 | 0.346 | 0.184 | 100% |
| 1.0 vs 1.0 (null) | -0.006 | 0.156 | 0% |

So a difference in macro PR-AUC below about 0.08-0.10 is not distinguishable. Two further points: (a) the residue-level bootstrap treats residues as independent, which they are not (epitope residues are spatial patches), so the real CI is probably wider; (b) if the organisers use a cluster bootstrap over complexes (the guideline says "a cluster bootstrap is used if scores are closely matched"), there are only 3^3 = 27 equally likely resamples. The probability that all three draws are the same complex is 1/27 = 3.7%, which is above 2.5%, so the 2.5th percentile equals the smallest per-complex difference and the 97.5th the largest. The CI excludes 0 only if all three per-complex differences have the same sign. This is my own derivation, not stated by the organisers.

Noise in the training labels (queen extra). I did not find an AVIDa-hHER2 paper. For the family, sources I opened:
- AVIDa-hIL6 (arXiv 2306.03329): one panning round per mother library, labels from a two-proportion z-test at p <= 0.05, minimum p taken over 12 sublibraries, noise filter against a negative control (ratio >= 10^2.5, set empirically). Validation: 20 clones tested, with 10 of 10 binder-labelled clones binding by immunofluorescence. The Clopper-Pearson 95% lower bound for 10/10 is about 0.69 (my calculation), so the binder precision is at best loosely pinned down. The paper reports no overall false-positive rate. 4 noise-labelled clones bound cells nonspecifically.
- Under a null of no change, 2.5% of clones would be false "binders" (0.025 N), and with the minimum over k independent sublibraries the false-positive chance per clone rises to 1 - 0.95^k (46% for k = 12). The sibling file (`avida_hher2_and_avida_family_dataset_anatomy_columns_sizes_label_logic.md`) has the full arithmetic. I could not obtain a measured artefact fraction for hHER2. Whatever it is, a one-round enrichment can say "this clone's read share rose in a HER2 panning", and cannot say which HER2 region it binds.

## 6. Submission format and silent-zero failure modes (Q6)
Format (from /guideline and /detail):
- One CSV per complex with `chain, seqNum, resName, prediction`. Chain A is the antigen (HER2), chain B is the VHH. Prediction is 0 to 1. Omitted residues are read as 0. Up to 5 submissions per team.
- HER2 numbering follows full-length UniProt P04626, including the 22-residue signal peptide, so the first residue (Met1) is 1. The /detail sequence block runs to 620, then "GACQ" and "HHHHHH". Whether the tail is numbered in the truth is not stated.
- VHH numbering is sequential (1..N) and is not Kabat or IMGT. ONU11 and ONU13 are 120 aa plus S plus His tag, and ONU23 is 130 aa plus His tag (per the brief).
- The guideline's example, 5F7L, has chain A starting at 102. seqNum comes from the structure's numbering and need not start at 1.
- The guideline says CSV but its ground-truth script writes tab-separated files. Send the CSV as asked.

Failure modes that silently reduce or zero a score (the join is on `chain, seqNum`, and unmatched predictions are likely dropped while missing predictions become 0; the exact join is unverified):
1. Signal peptide offset. Numbering HER2 from the mature protein (Thr23 = 1) shifts every residue by 22 and the join then matches the wrong residues.
2. Wrong chain letters. If the truth has A for the antigen and B for the VHH and you write H, L, or the PDB codes of your model, nothing matches.
3. Tag and linker residues. The S in front of the VHH and the His tag, GACQ and the HHHHHH tail of HER2 extend the sequential numbering, so an off-by-one at the VHH start shifts all CDR positions. Decide whether the S counts as residue 1 before writing numbers.
4. The VHH numbered Kabat or IMGT (gaps and insertion codes such as 52A) instead of sequential 1..N.
5. Predictions as binary 0/1 or heavily tied values. This discards ranking information and PR-AUC then reduces to a single point.
6. A structure-prediction model's output residue numbering (starts at 1 per chain regardless of the antigen's true numbering, drops the signal peptide if you gave it the mature sequence).
7. `resName` in one-letter code instead of three-letter code, if the join uses it. Use the template CSV from the dataset repository.
8. Ground truth only lists interface residues, so rows for non-interface residues are not needed. A prediction written only for interface residues you believe in is allowed and equals ranking the rest as 0.

## Gotchas / what could fool us
1. The cutoff is unstated. Area > 0 is my reading of "each reported residue", but a hidden minimum area would drop 14% of the antigen positives and a few percent of area.
2. The positive fraction depends on the denominator. 12.6% (RBD proxy) versus 3.8% (HER2 5MY6 in my run) changes the random baseline from 0.126 to about 0.04. Do not compare PR-AUC with 0.176 from the proxy without this.
3. Area > 0 is not distance < 4 A. Atoms 5-6 A apart can have contact area.
4. Different chains in the same entry look like noise but are biology. My first cross-copy comparison gave 100% discordance for different VHHs in 7KN5 and 7OLZ, which had to be excluded.
5. Per-pair counts are pseudo-replicated (ASU copies), so standard errors on the table means are too small.
6. Heteroatom treatment, hydrogens, altlocs and the LT version can each move a few residues.
7. Cryo-EM at about 3 A has more coordinate uncertainty than the crystals I used, so my 4-9% floor is probably optimistic for the real truth.
8. The residue-level bootstrap in /guideline assumes independent residues, and "L" (which length) is not defined for antibodies of different lengths. The question of whether a complex's score pools chains A and B or averages them is not answered in the text I read.

## Implications for the challenge
1. Rank by expected contact area (P(contact) x predicted area), with no ties, so one ranking serves both metrics.
2. Put the robust core first. Residues central to the paratope-facing patch (about 70% of positives, about 92% of area) decide the weighted score and about 70% of the unweighted one.
3. Expect a low antigen prevalence on HER2 (3-5%). Evaluate local proxies with the same prevalence (use 5MY6-like HER2 complexes), not with RBD/8GZ5 only.
4. Do not trust gains below about 0.08-0.10 macro PR-AUC when comparing submissions.
5. Reproduce the ground truth locally with the same binary on your own predicted complexes (`voronota-lt --restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]' --print-contacts`), then sum by residue, and test your ranking against area > 0, >= 5 and d < 4 A. A ranking that does well under all three is robust.
6. Run the format checklist in Section 6 against the template CSV before every submission (5 allowed).

## Open questions
- What exact cutoff and heteroatom handling did the organisers use? A short question to the organisers would settle it.
- Does the metric pool chains A and B within a complex, or are they scored separately?
- Is the HER2 tail (GACQ, His tag) numbered in the truth?
- Real cryo-EM flip rate: compare two independently refined models of one cryo-EM nanobody complex.
- Voronota-LT version differences (v1.1.479 versus v1.1.497).

## Sources (opened)
- https://sepiq.uk/guideline
- https://sepiq.uk/detail
- https://raw.githubusercontent.com/kliment-olechnovic/voronota/master/README.md
- https://raw.githubusercontent.com/kliment-olechnovic/voronota/master/expansion_lt/README.md
- https://github.com/kliment-olechnovic/voronota/releases (release v1.29.4816 via the GitHub API; binary `cosmopolitan_voronota-lt_v1.1.497.exe` run locally)
- Search result listing for the Voronota-LT preprint: https://www.biorxiv.org/content/10.1101/2024.02.05.577169.full.pdf (full text not read; the fetch of the v2 page returned HTTP 429)
- https://arxiv.org/html/2306.03329v2 (AVIDa-hIL6 labels and validation)
- https://arxiv.org/pdf/2405.18749 (AVIDa-SARS-CoV-2; the PDF fetch returned binary, only the search-result summary of size and licence was used)
- Sibling worker file: `research/q3_assay_ngs_ground_truth/avida_hher2_and_avida_family_dataset_anatomy_columns_sizes_label_logic.md`
- RCSB PDB entries downloaded from files.rcsb.org: 8GZ5, 5MY6, 4KRL, 1MEL, 1OP9, 1ZVH, 4LGP, 3K1K, 5IMK, 7KN5, 7OLZ, 5F7L, 3EZJ
- Not found or not opened: any AVIDa-hHER2 paper or dataset card (COGNANO page returned 401 per the sibling file).
