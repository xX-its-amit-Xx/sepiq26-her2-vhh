---
title: Clonotype clustering, CDR3 families and enrichment trajectories as epitope bins (AVIDa-hHER2)
queen: q7_data_representation_integration
king: king_infer
worker: clonotype_clustering_cdr3_families_and_enrichment_trajectories_as_epitope_bins
tier: expert
tags: [AVIDa-hHER2, CDR3, clonotype, enrichment, epitope-bin, leave-one-family-out, convergence, SAbDab-nano]
confidence: medium
challenge_relevance: 2
serendipity: Music-IR cover-song/riff matching (local motif match, framework = transposition). Partly paid off - CDR3 motif is framework-invariant (enriched CDR3 families sit on different frameworks), but the family score did not beat per-sequence enrichment, and the motif groups are weak bins.
date: 2026-10-17
---

## TL;DR
On the real data (1,843,875 VHH, 28 read-count columns), 1.68 M sequences yield a CDR3; they collapse into 120,206 Hamming-1 CDR3 families. Enrichment is highly concentrated (39 families carry 50 % of the above-expectation post-panning reads) and highly reproducible (family-level C1-vs-C2 Pearson 0.93). Falsifiable test: a leave-self-out CDR3-family enrichment score gives AUROC 0.976 and beats a single-replicate per-sequence score (0.962), but it does NOT beat the pooled per-sequence score (0.991), which is circular with the label. So "family representation beats per-sequence enrichment" is only conditionally confirmed. The motif groups (3 groups, silhouette 0.29) are too coarse to be a validated epitope-bin map.

## Scope notes (what differs from BRIEF.md)
The files on HF differ from the brief: they are not "two libraries, one panning round, a few hundred labels". Verified from README.md and the files (downloaded with the user's existing HF login; dataset is gated, approved access):

| Item | Value |
|---|---|
| `AVIDa-hHER2.csv` | 499,335,870 B; 1,843,875 rows; 36 cols: `#ONU ID, total`, 28 per-condition **IE-scores**, `background_IE_score, target_IE_score, label, binary_label, Cluster, #Cluster, Cluster_size, sequence`. It holds IE-scores, NOT counts. |
| `NGS_read_count_table.csv` | 126,170,849 B; 1,843,875 rows; `#ONU ID` + 28 count columns; 5,327,133 reads total (sums, all columns) |
| Mother (pre-panning) columns | `Marin-Mother-1st-B` (55,040 reads), `Marin-Mother-2nd-B` (225,719), `Marin-Mother-2nd-C` (185,182) |
| Library split | "B" and "C" = two mother libraries (order of letters = repeated immunisation). 1st-phase experiments are B only; 2nd-phase has B and C. Competition columns (Trastuzumab, Pertuzumab, RabMAb) are Library B only (README). |
| Post-panning HER2 columns | 2nd phase: `Her2_C1`, `Her2_C2` for B and C (about 290-360 k reads each); 1st phase `Her2_37C-1st-B` (50,092), Trastuzumab C1-C3 (37C and 4C), Pertuzumab C3, RabMAb C3 (Companion in the count file) |
| Controls | NC1, NC2 (37C, 4C), NC3_C1/C2, Comparator_C1/C2 (B and C) - HER2-free |
| Labels | Yes 7,316; Not 12,051; non-sig. 1,823,762; noise 746. So **19,367 labelled** (binary 1/0), not "a few hundred". 18,096 have a parsable CDR3. |
| Clusters | USEARCH 93 % identity, 473,728 clusters (whole-sequence) |
| Pre/post per library | Yes: Library B (1st and 2nd) and C (2nd) each have a Mother column and matching HER2 columns. |
| Held-out clones | ONU11, ONU13, ONU23 are rows in this table (clone IDs ranked by total reads: 7,058 / 6,874 / 4,063). Labels: ONU11 = **noise**, ONU13 = Yes, ONU23 = Yes. Sequences match sepiq.uk/detail (verbatim: ONU11 CDR3 RPLGSTWTEHPY, ONU13 KYGSSRLWDY, ONU23 DGRFYSDYVWSSPDEYAY). |

Resources at start: C: 65.6 GB, D: 45.1 GB free, CPU 4 %. Data in `C:\Temp\sepiq26\q7_clonotype\` (626 MB). Terms: the dataset is for SEPIQ participants only; nothing here redistributes it.

## Q2. CDR3 families
- CDR3 extraction: regex-free rule (last C before WGQG/WGKG/RGQG, strip leading AA). 1,676,735 of 1,843,875 sequences (90.9 %) yield one; 237,916 unique CDR3; median length 13 aa. ANARCI not installed, so IMGT boundaries not used.
- Tools: **MMseqs2, CD-HIT and ANARCI were not installed** (not tried via pip/conda to save time). First attempt, Hamming-1 + indel-1 single-linkage network, percolated into a 105,823-member giant component and was discarded (negative result). Final: greedy abundance-ranked centroid clustering, radius Hamming 1, same length.
- Result: **120,206 families**; 57,274 singleton unique-CDR3 sets (47.6 %). Size quantiles (unique sequences per family): median 2, 90 % 21, 99 % 191, 99.9 % 1,154; max 15,476. Top-10: 15,476, 13,459, 10,763, 8,357, 7,985, 7,309, 7,200, 6,855, 6,038, 6,028. Log2 size histogram: 2^0 57,274; 2^1 27,592; 2^2 12,097; 2^3 8,189; 2^4 6,648; 2^5 4,236; 2^6 2,250; 2^7 1,102; 2^8 475; 2^9 199; 2^10 89; 2^11 33; 2^12 18; 2^13 4.
- Top-100 families hold 18.8 % of unique sequences and **27.95 % of reads** (top-100 single sequences: 8.1 %). Large families are mostly one clone plus somatic/PCR/sequencing variants, so family size is partly a read-error artefact (see Gotchas).

## Q3. Enrichment model and concentration
Per family f in condition c: counts summed over members; log2E = log2[((post+0.5)/N_post)/((pre+0.5)/N_pre)], SE (delta method, multinomial) = sqrt(1/a + 1/b - 1/N_post - 1/N_pre)/ln2 with a, b the pseudocounted counts; z = log2E/SE. Pre = the Mother column of the same library and phase. No edgeR/DESeq2 (no replicates of Mother; deliberately kept to one-line formula).

Concentration (post = B2+C2 HER2 replicates pooled, 3,038 families with >=20 post reads): 807 significant (z > 3, log2E > 1), median log2E 3.32; 761 robust (both replicates z > 2 and log2E > 1 in B or C). Share of above-expectation post reads: top 10 families 27.2 %; top 100 67.6 %; top 1000 96.6 %; 39 families give 50 %, 414 give 90 %.

Replicate concordance (families with >=20 post reads in the pair and >=10 pre reads; single-seq analogue in the same filter):

| Comparison | level | n | Pearson | Spearman |
|---|---|---|---|---|
| Lib B, C1 vs C2 | family | 952 | 0.930 | 0.855 |
| Lib B, C1 vs C2 | sequence | 340 | 0.905 | 0.903 |
| Lib C, C1 vs C2 | family | 1,171 | 0.936 | 0.695 |
| Lib C, C1 vs C2 | sequence | 419 | 0.942 | 0.761 |
| B vs C (mean of C1,C2), min 20 post reads each | family | 240 | 0.924 | 0.872 |
| B vs C, min 50 | family | 133 | 0.945 | 0.931 |
| B vs C | exact sequence | 20 | 0.975 | 0.928 |

Families allow many more B-vs-C comparisons (240 vs 20 exact sequences), because the two mother libraries rarely share the same exact sequence. Family level is not clearly more reproducible than sequence level within a library (Pearson equal, Spearman better for B, worse for C); it mainly increases coverage. Note: n differs between rows, so values are not directly comparable.

## Q4. Convergence test
- Enriched families (n = 761 robust; analysed 761 with >=5 members): framework (last 70 aa before the CDR3's conserved Cys) of up to 40 top members. Median fraction of distinct framework strings 0.70; median pairwise identity 0.957; 82.9 % of families contain a member pair with framework identity < 0.8 and 94.3 % < 0.9. Enriched CDR3 families span >= 2 USEARCH-93 whole-sequence clusters in 99.3 % of cases and >= 5 in 92.5 %. Exactly shared CDR3 sequences (13,856 in enriched families): 4,457 occur in >= 2 whole-sequence clusters.
- Reading: the same CDR3 is found on frameworks that are not 93 % identical to each other, i.e. CDR3 motif is carried across backgrounds. This is a proxy: I did not call V genes (IMGT/IgBLAST/MiXCR not run), and alpaca V-gene germline is only partly annotated. Immune-diversification (somatic mutation, one lineage) can also produce < 93 % identical frameworks, so this does not prove independent convergent origin.
- Literature (only what I opened): GLIPH2 (Huang, Wang, Rubelt, Scriba, Davis, Nat Biotechnol 2020; 38:1194-1202; doi 10.1038/s41587-020-0505-4; https://pmc.ncbi.nlm.nih.gov/articles/PMC7541396/) groups TCRs expected to share an epitope by motifs or strong CDR3 homology and scales to millions of sequences. It is a **TCR** tool; it does not model antibodies or phage panning. A search for antibody epitope-binning-by-clonotype, Immcantation and MiXCR returned nothing usable, so I cite none for those (unverified). Immcantation and MiXCR are repertoire pre-processing/lineage tools, not epitope-bin tools, as far as I know (not verified here).

## Q5. Motif groups ("bins") and held-out clones
Method: 761 robust enriched families -> 3-mer profile of top-20 members -> SVD(30) -> Ward clustering, k = 3..10. Silhouette by k: 3: 0.293, 4: 0.253, 5: 0.158, 6: 0.176, 7: 0.192, 8: 0.185, 9: 0.201, 10: 0.215. Best k = 3, but silhouette 0.29 is weak, and the request for 3-10 groups is met only at the bottom end.

| Bin | Families | Mode CDR3 len | Motif (top reps) | Post reads | Median log2E | Labelled Yes/Not |
|---|---|---|---|---|---|---|
| 0 | 698 | 14 | heterogeneous: RKRLYTSGTTRFDYDY, KYGSSRLWDA, GRSIAVLTIKLSDY, ARLPINDY. C-terminal "(D)YDY" conserved (info 1.3-2.5 bits) | 806,184 | 3.41 | 5,200 / 50 |
| 1 | 38 | 12 | **RPLGSTW-x-E-x-Y** (R 3.5, P 3.2, L 2.2, G 3.6, S 3.5 bits at positions 1-5) | 62,221 | 3.16 | 557 / 5 |
| 2 | 25 | 16 | **ESLSSALGRELGDYGS** (Q/E-S-L-S/T-S 3-3.8 bits) | 46,972 | 5.03 | 355 / 1 |

Bin 0 is a catch-all, not a single motif. Bins 1 and 2 are clear sequence motifs (many point variants). Bins are NOT epitope-validated: they are sequence groups. Persistence in both libraries: 19-28 % of families in each bin are enriched in both B and C.

Held-out clones (family = Hamming-1 centroid cluster of CDR3):

| Clone | CDR3 | Label | Family size | Family post reads | Family log2E (z) | Robust enriched | Nearest bin | Best 3-mer cosine |
|---|---|---|---|---|---|---|---|---|
| ONU11 | RPLGSTWTEHPY | noise | 4,934 | 9,632 | 4.24 (37.1) | yes (B and C) | **bin 1** | 0.997 |
| ONU13 | KYGSSRLWDY | Yes | 8,357 | 23,139 | 3.96 (59.2) | yes (B and C) | bin 0 | 0.988 |
| ONU23 | DGRFYSDYVWSSPDEYAY | Yes | 1,591 | 4,141 | 5.43 (20.7) | yes (B only) | bin 0 | 0.999 |

All three fall into an enriched family; this is unsurprising because ONUs ranked 11, 13, 23 by read count are among the most abundant clones. ONU11 is labelled "noise" by the organisers' algorithm (background IE <= -3, i.e. also enriched in controls) but its family is strongly enriched - a warning about bead-sticky clones. Nearest alternative enriched families by local BLOSUM62 alignment: ONU11 -> RPLGSTWLEYPY (bin 1, log2E 3.47); ONU23 -> DGRFYSDFVWSSPDEYTY (bin 0, 3.56); ONU13 -> weak matches only (KLGSDYEYDY, norm score 2.4).

## Q6. Falsifiable experiment (CPU, script runtime 158 s)
Script: `C:\Temp\sepiq26\q7_clonotype\scripts\clonotype_family_analysis.py` (python, pandas, scikit-learn, Biopython; one process). Output `C:\Temp\sepiq26\q7_clonotype\results.json`, `enriched_families.csv`.
Label: `binary_label` (n = 18,096 with CDR3; 6,837 binders, prevalence 0.378). Scores: single = own log2E of pooled 2nd-phase HER2 reads (B2+C2, C1+C2 columns) vs pooled 2nd Mother; family = same formula over the CDR3 family excluding the focal sequence's own reads (leave-self-out); shrunk = family score x reads/(reads+20); USEARCH93 = same over the whole-sequence cluster. Bootstrap B = 1000 resamples of sequences, 95 % percentile CI. Subset "has peer" = >=1 other family member with >=10 reads (13,595 sequences, prevalence 0.494).

| Scope | Method | AUROC [95 % CI] | PR-AUC [95 % CI] |
|---|---|---|---|
| all | single-seq pooled (leaky: counts define label) | 0.991 [0.989, 0.992] | 0.990 [0.988, 0.991] |
| all | single-seq, replicate B2_C1 only | 0.962 [0.958, 0.965] | 0.959 [0.956, 0.962] |
| all | CDR3 family, leave-self-out | 0.976 [0.974, 0.979] | 0.973 [0.970, 0.976] |
| all | CDR3 family, leave-self-out, shrunk | 0.980 [0.978, 0.983] | 0.980 [0.978, 0.983] |
| all | USEARCH93 whole-seq cluster, leave-self-out | 0.986 [0.983, 0.987] | 0.983 [0.981, 0.986] |
| all | random | 0.501 | 0.379 |
| has peer | single pooled | 0.991 [0.989, 0.992] | 0.993 [0.992, 0.994] |
| has peer | single, replicate B2_C1 only | 0.963 [0.960, 0.966] | 0.970 [0.967, 0.972] |
| has peer | CDR3 family, leave-self-out | 0.988 [0.986, 0.990] | 0.990 [0.988, 0.992] |
| has peer | USEARCH93 cluster, leave-self-out | 0.988 [0.986, 0.990] | 0.990 [0.988, 0.992] |
| all | CDR3 3-mer logistic, GroupKFold by CDR3 family (leave-families-out) | 0.892 [0.886, 0.897] | 0.882 [0.876, 0.888] |
| all | same, random 5-fold (leaky) | 0.970 [0.968, 0.973] | 0.966 [0.962, 0.969] |

Paired bootstrap, family minus single(pooled) AUROC: shrunk -0.0103 [-0.0124, -0.0084] (all); leave-self-out on has-peer -0.0025 [-0.0043, -0.0007].

Verdict (pre-registered rule: falsified if family shows no gain over the single-sequence score): **falsified against the pooled single-sequence score, not falsified against a single-replicate score.** Family (0.976-0.980) > single-replicate (0.962), CIs do not overlap; family < pooled single (0.991), but the pooled score reuses the very counts that define the label, so 0.991 is a ceiling, not a fair competitor. The family score never saw the focal sequence's reads and still reaches 0.976-0.988. Whole-sequence USEARCH-93 clusters did as well or better than CDR3 families (0.986 vs 0.976 all), so **the "local motif beats global similarity" part of the forced analogy is not supported** here. Leave-families-out k-mer model (0.892) shows that a CDR3 motif model generalises to unseen families with lost accuracy, and that random CV overstates by 0.08 AUROC. Labels are enrichment-derived, so none of this tests epitope or structure.

## Q7. Public HER2 VHH complexes
- **5MY6** (HER2 + nanobody 2Rs15d; 2.246 A; released 2017-08-09; doi 10.1158/1078-0432.CCR-17-0310; RCSB API opened). Domain I (contacts P04626 109-183 plus R217). CDR3 YNLETY. Did not compete with trastuzumab/pertuzumab (Vaneycken 2011 FASEB J, doi 10.1096/fj.10-180331, abstract-level, from sibling worker's notes).
- **5MY7 is NOT a HER2 nanobody**: RCSB title "Adhesin Complex Protein from Neisseria meningitidis". **7PH0 is NOT either**: "Structure of light-adapted AsLOV2 Q513L". The brief's search string is wrong for these two IDs.
- **9MTE** (cryo-EM, HER2 ECD + VHH 27A05 and 47D05; released 2025-11-19; doi 10.1158/1535-7163.MCT-25-0654; Sanofi T-cell-engager programme per the sibling worker): 27A05 domain I + III (CDR3 WDVNGDI); 47D05 domain I (CDR3 YMDQRLDGSTLAY). **9MTX**: 29E09, domain I + III (CDR3 RDVNGDY). **7QVK**: VHH NM-02, domain I + II (3.1 A). Contact-domain assignments computed by a sibling worker (research file her2 `body.md`, not re-derived).
- **3QYC** is a dimeric human VH domain (anti-HER2), not a camelid VHH.
- CDR3 similarity to enriched families (local BLOSUM62, length-normalised score; low is background): 2Rs15d YNLETY vs YHYETHS (bin 0) 2.7; 27A05 vs AHWDIVGNDF 2.4; 29E09 vs VRYFNSDY 2.5; 47D05 vs RLQGSTWLEADY (bin 1) 1.8; none is near ONU families (>5 for the ONU11 neighbours). Conclusion: **no public HER2 VHH CDR3 resembles an enriched family**; the structural prior cannot name a domain for any bin. The only suggestive item: 47D05 (domain I) vs bin 1 (RPLGSTW...) is weak (1.8).

## Forced analogy: music information retrieval (cover-song / Shazam)
(a) Each VHH = melody, framework = key/instrument (transposition), CDR3 family = riff; enrichment trajectory = chroma-like feature. (b) Testable idea: score a held-out clone by local CDR3 match to enriched families rather than whole-sequence similarity, then use the matched family's enrichment as a prior on VHH paratope residues (CDR3 positions) and on which HER2 domain it targets. (c) Verdict: **partially holds.** Holds: the CDR3 motif travels across non-identical frameworks (82.9 % of enriched families have member pairs under 80 % framework identity), and replicate concordance is good (0.93). Breaks: whole-sequence USEARCH93 clusters scored better (AUROC 0.986) than local CDR3 families (0.976), since frameworks also carry lineage information; and unlike audio, a riff has no known "song" (epitope) to be matched to - bins are not epitope-labelled.

## Gotchas
1. **Label circularity.** The binary label is derived from the same read counts; any per-sequence count score is near-perfect (AUROC 0.99). Only leave-self-out or held-replicate scores are meaningful.
2. **Background not subtracted.** My enrichment uses the Mother column as pre only; HER2-free controls (NC3, Comparator, similar depth, 150-360 k reads) not used. Bead/Protein-G stickies appear enriched (ONU11 is "noise"). I did not quantify the fraction of robust families also enriched in controls (not run). Treat enriched != HER2-specific.
3. **Libraries B and C share few exact sequences** (only 20 sequences usable for exact B-vs-C correlation).
4. **Read errors inflate families.** 1.84 M unique sequences from 5.3 M reads (~0.35 sequence per read, i.e. many singletons): family sizes mix variants, errors and true lineage.
5. **Clone ID encodes read rank**, so ONU11/13/23 are among the most abundant; "falls into an enriched family" is expected.
6. **CDR3 rule is not IMGT**: no ANARCI; 9.1 % of sequences yield no CDR3 and are dropped.
7. **Brief's PDB IDs 5MY7/7PH0 are unrelated proteins**; brief's "few hundred labels" is stale (19,367).
8. **Giant-component trap**: single-linkage on CDR3 gave a 105,823-member component; use centroid clustering.
9. **Pre-registration**: the "family beats single" rule was chosen after I knew the label is circular; I report all rows rather than the favourable one.
10. **Dataset terms**: gated for participants; do not rehost.

## Implications for the challenge
1. Do not treat per-sequence enrichment as a fair benchmark for any model: use leave-self-out family or held-replicate scores when evaluating anything built from these counts.
2. Use family-level enrichment as a de-noised per-clone prior (AUROC 0.976-0.988 without seeing the clone's own reads): it is a cheap weight for training-sample selection in a residue-level model.
3. Subtract control columns (NC3, Comparator) before calling bins; first rerun with background-corrected log2E.
4. Do not claim 3-10 epitope bins: only bins 1 (RPLGSTW) and 2 (ESLSSALGREL) are tight motifs; ONU11 sits in bin 1, ONU13 and ONU23 in the heterogeneous bin 0.
5. For Track A, the family signal can at best weight CDR3 positions; it carries no HER2-side information (bins unmapped to domains).
6. Use the Trastuzumab/Pertuzumab/RabMAb competition columns (Library B only) per family to try to map bins to domains IV/II - not done here.

## Open questions
- Which fraction of 761 robust families are enriched in NC3/Comparator?
- Do competition columns (Trastuzumab/Pertuzumab/RabMAb) separate bins 0/1/2 by domain?
- Does MMseqs2 at 80-90 % identity give families that predict better than Hamming-1 CDR3 centroids?

## Sources (opened)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (README.md, file list, downloaded with user's authenticated access)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7541396/ (GLIPH2; doi 10.1038/s41587-020-0505-4)
- https://data.rcsb.org/rest/v1/core/entry/5MY6, /5MY7, /7PH0 (titles, resolution, release dates)
- https://papers.neurips.cc/paper_files/paper/2023/file/8339dacd9df7ffe9623760f74169dd1e-Paper-Datasets_and_Benchmarks.pdf and https://github.com/cognano/AVIDa-hIL6 (AVIDa-hIL6 background; seen in search results only, not fetched)
- https://arxiv.org/abs/2405.18749v1 (AVIDa-SARS-CoV-2; search result only)
- Sibling-worker files on disk: C:\Temp\sepiq26\her2\body.md, C:\Temp\sepiq26\her2_data\entries.json (HER2 PDB contact domains, CDR3 sequences)
- sepiq.uk/detail text saved at C:\Temp\sepiq26\raw\detail.txt (held-out sequences)
- AVIDa-hHER2 on HF under COGNANO/AVIDa-hHER2: API returned "Repository not found"; not used.
