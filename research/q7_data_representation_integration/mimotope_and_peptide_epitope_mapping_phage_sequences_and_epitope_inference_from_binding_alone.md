---
title: Mimotope-style epitope inference from binding data alone - tool survey and a 5-complex oracle test on HER2
queen: q7_data_representation_integration
king: king_infer
worker: mimotope_and_peptide_epitope_mapping_phage_sequences_and_epitope_inference_from_binding_alone
tier: expert
tags: [mimotope, PepSurf, EpiSearch, Mimox, BepiPred-3.0, DiscoTope-3.0, SEMA, HER2, CDR3, complementarity, falsification]
confidence: medium
challenge_relevance: 2
serendipity: Query-by-humming (contour matching of charge/hydrophobicity instead of residue identity) was implemented as patch-feature matching; it did NOT pay off, even in the oracle setting where the true binder CDR3 is the query.
date: 2026-10-17
---

## TL;DR
Classic mimotope tools (PepSurf, EpiSearch, Mimox, 3DEX, MIMOP) need dozens of short, antigen-selected peptides and a known antigen structure, and they are only modestly accurate (sensitivity about 0.3, precision about 0.2-0.3 on a 10-case set). I found no published method that infers an epitope from antibody-side sequences alone. My own CPU test (5 public HER2-binder complexes, using the TRUE binder CDR3 as the query, which is the best case) found that matching a CDR3's charge/hydrophobicity/aromatic profile to HER2 surface patches gives macro PR-AUC 0.081 against a surface-exposure prior of 0.083 (random is about 0.05), with no benefit over a wrong-CDR3 control. Verdict: falsification condition met, mimotope-style complementarity adds nothing beyond a generic prior.

## 0. Resource check
Run 2026-10-17: C: 64.5 GB free, D: 45 GB free, CPU load 8 percent. Both limits satisfied. The real AVIDa-hHER2 / SEPIQ CSVs could NOT be fetched: the HF dataset `sepiq-2026/SEPIQ-2026-training-data` returns HTTP 401 without a logged-in token (files listed via API: AVIDa-hHER2.csv, NGS_read_count_table.csv, prediction_template_ONU11/13/23.csv); `COGNANO/AVIDa-hHER2` also 401 to anonymous. So the experiment below uses the real binder CDR3 of each control complex as a stand-in for an "enriched CDR3 family". This is an optimistic oracle, see Gotchas.

## 1. Tool survey (mimotope / peptide-epitope mapping)
Sources: Moreau/Denisova-era review (Molecules 2011, doi 10.3390/molecules16010694, PMC6259106), MimoTree paper (Li et al., Front Bioinform 2024, doi 10.3389/fbinf.2024.1295972), EpiSearch paper (Negi & Braun, Bioinform Biol Insights 2009;3:71-81, doi 10.4137/bbi.s2745, PMC2808184). The 2011 review quotes no benchmark numbers for any of these tools.

| Tool | Input | Method class | Web server status (checked 2026-10-17 by curl) | Quoted accuracy |
|---|---|---|---|---|
| 3DEX (Schreiber 2005) | mimotopes + antigen structure | motif, Calpha/Cbeta distance graph, gaps allowed | stand-alone download; no live check | none in review |
| MIMOX (Huang 2006, BMC Bioinf 7:451) | mimotopes (ClustalW consensus) + structure | motif/cluster, NACCESS, Jmol | http://immunet.cn/mimox/ returned 404; likely dead (unverified) | reproduces FINDMAP/3DEX case studies only |
| MIMOP (Moreau 2006) | mimotopes + template | MimAlign + MimCons | "upon request" | none |
| Mapitope (Enshell-Seijffers 2003) | mimotopes + structure | amino-acid pair statistics vs random | via Pepitope | none (improved variant: 3 -> +9 contact residues for mAb E16) |
| PepSurf (Mayrose 2007 NAR; Pepitope server Bioinformatics 23:3244) | peptides (max 14 aa) + structure | peptide alignment to surface graph | pepitope.tau.ac.il: HTTPS cert mismatch (ngrok cert), HTTP 307 redirect; usable status unverified | NAR paper: correct in 4 known complexes (qualitative); MimoTree paper: sens 0.32, prec 0.28 |
| EpiSearch (Negi & Braun 2009) | up to 30 peptides + structure | 12 A surface patches ranked by residue-frequency match | curie.utmb.edu/episearch.html: connection failed from here (unverified) | Table 1: trastuzumab/HER2 top patch (C565) covers 9 of 14 interface residues (coverage 0.64, overlap 0.33), from 5 peptides; Bo2C11 0.50, b12 0.44, 17b 0.18 (1st) / 0.64 (2nd), 13b5 1.00, 80R 0.38. MimoTree paper: sens 0.31, prec 0.21 |
| Pep-3D-Search (Huang 2008) | mimotopes or motif | ant-colony paths on surface graph | not checked | none |
| MimoPro (Chen 2011) | mimotopes + structure | patch (15 A) + graph hybrid | not checked | none in review |
| MimoTree (Li 2024) | mimotopes + structure | gapped alignment with 3D connection | paper; availability not checked | complex structures sens 0.52 / prec 0.17 / MCC 0.16; unbound antigens sens 0.33 / prec 0.12 / MCC 0.04; ensemble PepSurf U (MimoTree ^ EpiSearch) sens 0.50 / prec 0.27 / MCC 0.25 |

Key points: (i) every tool assumes 5-30 peptides panned against the antibody (antibody is the bait); the SEPIQ data are the inverse (antigen is bait, antibody is the library); (ii) accuracy falls sharply from bound to unbound antigen structure (sens 0.52 to 0.33); (iii) HER2/trastuzumab is the one HER2 benchmark in EpiSearch, and it was the correct domain IV site from only 5 peptides; EpiSearch's second patch (C214, domain I/II) was on the opposite face, so even there a false patch ranked second.

## 2. Precedent for epitope inference from antibody-side sequences alone
Searches ("epitope prediction from antibody repertoire sequences", paratope-guided epitope, idiotope, anti-idiotype mimicry) found:
- Sequence-only PARATOPE prediction is mature (Paraplume, bioRxiv 10.1101/2025.10.04.680432; ParaDeep F1 0.723 / MCC 0.685 heavy chain, PMC12626946; ParaAntiProt, Sci Rep s41598-024-80940-y). Paraplume was run at repertoire scale and showed larger paratopes in tetanus-toxoid repertoire than naive; it stops at paratope features, not epitope location.
- Idiotope-driven work (PMC10221809) uses BCR repertoire sequences to predict T-cell epitopes, a different problem.
- Idiotype-network theory (Ab2 mimics antigen) is the conceptual basis for mimotope reversal, but I found NO paper that predicts the epitope of a specific antibody from antibody-side deep sequencing without an antigen library. The search summaries called this "an open gap". Confidence medium: search tool, not exhaustive literature review.
- Joint paratope/epitope models still take antigen structure as input (IJCAI 2024 multimodal contrastive, abstract only).
Nothing was measured for the requested scenario; there is no number to report.

## 3. Mimotope reversal on HER2 (what I did)
Structures downloaded from RCSB (files.rcsb.org): 1N8Z (HER2 + trastuzumab Fab, 2.52 A, chains A/B Fab, C HER2), 1S78 (HER2 + pertuzumab, 3.25 A; used A + C/D), 6OGE (cryo-EM HER2 + trastuzumab + pertuzumab Fabs, 4.36 A), 5MY6 (HER2 + nanobody 2Rs15d, 2.25 A, domain I). Important correction: 5MY6 is nanobody **2Rs15d**, not 5F7; I found no PDB entry for 5F7, so the requested 5F7 control was NOT run (5F7 coverage in the literature I saw: radioiodination study only, JNM).

Method (scripts in C:\Temp\sepiq26\q7mim\scripts\exp.py, CPU 40 s, FreeSASA with Tien-2013 max-ASA for RSA):
1. HER2 chain only (binder removed); surface residue = RSA > 0.10.
2. Patch = a surface residue plus its 9 nearest surface residues by Calpha distance (10 residues).
3. Patch profile = (mean charge K/R +1, D/E -1, H +0.1; mean Kyte-Doolittle; aromatic fraction F/W/Y/H).
4. Query = heavy-chain CDR3 of the true binder (regex between YYC and WGxG): trastuzumab SRWGGDGFYAMDY, pertuzumab ARNLGPSFYFDY, 2Rs15d AVCYNLETY. Mirror profile = (-charge, KD matched, aromatic matched).
5. Patch score = negative z-scaled Euclidean distance in feature space; residue score = best patch containing it.
6. Epitope = HER2 residue with any heavy atom within 4.5 A of binder.
Honest limitations: the query is an unordered composition profile, not an ordered contour; no sliding-window alignment (the query-by-humming idea) was implemented.

Domain concentration of the top-10 percent complementarity residues (counts, HER2 numbering as in PDB files):

| Complex | top-10% residues by domain | true epitope domains | Verdict |
|---|---|---|---|
| 1N8Z trastuzumab | I 1, II 9, III 15, IV 18 | IV 19 | IV enriched (18/43 = 42% vs 23% of surface) - the only hit |
| 1S78 pertuzumab | I 1, II 18, III 14, IV 5 | I 2, II 24 | II mildly enriched (18/38) |
| 5MY6 2Rs15d | II 12, III 14, IV 10 | I 17, II 1 | misses domain I entirely (0 in top) |
| 6OGE trastuzumab | II 10, III 18, IV 18 | IV 10, juxta 8 | no |
| 6OGE pertuzumab | I 3, II 11, III 5, IV 24, juxta 1 | I 1, II 20, III 4 | wrong domain (IV) |

So the complementary profile does not concentrate on a single domain; it concentrates on the right one in 1-2 of 5 cases, which is within what chance allows.

## 4-6. Controls and the falsifiable experiment (executed)
Candidates = surface residues per complex (359-439), positives 16-26 (base rate 0.04-0.07). Prior = RSA rank, a GENERIC EXPOSURE PRIOR. BepiPred-3.0 / DiscoTope-3.0 / SEMA 2.0 were NOT run (see section 7); this is a weaker prior than they would give, so the result is conservative for "adds nothing beyond the prior" only in the sense that a stronger prior makes it harder for complementarity to add anything. Combo = 0.5 x prior rank + 0.5 x complementarity rank (weight fixed, not tuned). Wrong-CDR3 control = mean complementarity score using the other complexes' CDR3s.

Per complex (PR-AUC, AUROC for comp-alone):

| Complex | base | PR prior | PR comp | PR combo | PR wrong-CDR3 | AUROC prior | AUROC comp |
|---|---|---|---|---|---|---|---|
| 1N8Z trastuzumab | 0.049 | 0.064 | 0.073 | 0.086 | 0.090 | 0.540 | 0.645 |
| 1S78 pertuzumab | 0.071 | 0.145 | 0.079 | 0.117 | 0.080 | 0.653 | 0.534 |
| 5MY6 2Rs15d | 0.045 | 0.055 | 0.037 | 0.040 | 0.029 | 0.540 | 0.380 |
| 6OGE trastuzumab | 0.041 | 0.053 | 0.059 | 0.078 | 0.088 | 0.591 | 0.622 |
| 6OGE pertuzumab | 0.052 | 0.097 | 0.159 | 0.094 | 0.092 | 0.653 | 0.540 |

Macro (5 complexes; note 6OGE duplicates trastuzumab/pertuzumab epitopes, so effective n is 3-4): PR-AUC prior 0.083, comp 0.081, combo 0.083, wrong-CDR3 0.076; AUROC prior 0.595, comp 0.544, combo 0.613, wrong-CDR3 0.520.

Paired bootstrap over residues (B = 2000, resampling within each complex, macro-averaged), differences in PR-AUC:
- comp minus prior: -0.004, 95% CI [-0.047, 0.038]
- combo minus prior: +0.001, 95% CI [-0.026, 0.029]
- comp with right CDR3 minus comp with wrong CDR3: +0.003, 95% CI [-0.019, 0.027]

All intervals straddle zero. **Falsification condition is met**: complementarity adds nothing beyond the (simple) prior, and the right CDR3 is no better than a wrong one. The question-4 AUROC for recovering true epitope residues by complementarity alone is 0.544 macro (trastuzumab 0.645 / 0.622, pertuzumab 0.534 / 0.540, 2Rs15d 0.380), against about 0.5 for random.

## 7. Antigen-side priors (BepiPred-3.0, DiscoTope-3.0, SEMA 2.0)
Availability verified by curl 2026-10-17 (HTTP 200): services.healthtech.dtu.dk/services/BepiPred-3.0/, .../DiscoTope-3.0/, sema.airi.net.
- BepiPred-3.0: Clifford et al., Protein Sci 2022;31:e4497, doi 10.1002/pro.4497; sequence-based, ESM-2 650M embeddings; server limit 50 sequences / 300,000 aa.
- DiscoTope-3.0: Hoie et al., Front Immunol 2024;15:1322712, doi 10.3389/fimmu.2024.1322712; structure-based, ESM-IF1 inverse-folding embeddings + RSA + pLDDT, positive-unlabelled training; IEDB says it beats BepiPred-3.0, ScanNet and SEMA on an external set.
- SEMA 2.0: NAR 52(W1):W533 (2024); SEMA-1D (ESM-2) and SEMA-3D (SaProt); original SEMA reported ROC AUC 0.76.
I did NOT submit HER2 ECD to any of them (they are browser-queue jobs; no local weights downloaded), so the requested top-ranked residues, domain I-IV coverage and unevenness of predicted probability are NOT measured here. Unverified: any AUC numbers for these tools on HER2. What I can say is that the substituted RSA prior is itself uneven (AUROC 0.54-0.65 over the five complexes), i.e. mild signal. A DiscoTope-3 run on 1N8Z/1S78/5MY6 HER2 chains is the obvious next step and a real prior will likely score higher than 0.083 PR-AUC, which would only widen the gap.

## Forced analogy: query-by-humming
(a) A CDR3 is the hummed query; the epitope's physicochemical contour is the tune; retrieval = alignment of contour, tolerant to transposition (a uniform shift of hydrophobicity) and note errors (substitutions of similar residues). (b) Testable idea, implemented in simplified form: score patches by profile distance of (charge-mirrored, KD, aromatic) features, with per-feature z-scaling as the "key normalisation". A stricter version (not run) would use dynamic-time-warping / local alignment of the CDR3's ordered KD/charge sequence against surface strands and ridges of the patch. (c) Verdict: the analogy BREAKS. A hum is a monophonic 1-D signal against a 1-D database; a paratope contacts a 3-D, mostly non-contiguous surface and the CDR3 is only one of six loops; the CDR3 side chain at the center of the paratope is not a transposed copy of epitope chemistry (shape complementarity and water-mediated contacts dominate), so the "melody" is not conserved. The measured result (right CDR3 equals wrong CDR3, CI [-0.019, 0.027]) is the empirical break.

## Gotchas / what could fool us
1. Oracle optimism: I used the TRUE binder's CDR3. Real enriched CDR3 families from one panning round are mixtures of binders to different epitopes, non-specific phage and display bias; the real signal would be weaker than the null result here.
2. Redundancy: 6OGE shares epitopes with 1N8Z and 1S78 (same Fabs); n is effectively 3-4, and the 4.36 A cryo-EM map has coarse side chains.
3. Heavy-chain CDR3 regex: fine for these Fabs, but 2Rs15d's CDR3 "AVCYNLETY" was matched on the VHH framework and includes an unpaired Cys; check before reuse.
4. Prior substitution: RSA is not BepiPred/DiscoTope; the paired comparison is vs a weak prior. Do not quote "vs BepiPred" from this file.
5. Epitope threshold of 4.5 A all-atom, and the SEPIQ ground truth uses Voronota-LT contact areas; positives count differ (16-26 here).
6. Numbering: PDB residue numbers for 1N8Z/1S78/6OGE appear to be UniProt-like (domain boundaries IV 489-607 gave sensible epitopes); the first run with a +22 offset assigned epitopes to "juxtamembrane", a trap.
7. Benchmarks of mimotope tools use 5-30 antigen-panned peptides and bound structures; MimoTree shows sensitivity 0.52 -> 0.33 on unbound structures, so quoted numbers overstate what a blind HER2 ECD run would do.
8. SEPIQ inverts the experiment: antigen is bait, antibody is library, so the sequence data constrain paratopes (what binds) not epitopes directly.

## Implications for the challenge
1. Do not build a CDR3-profile-to-surface-patch module for Track A; the oracle test shows no signal beyond RSA (PR-AUC 0.081 vs 0.083).
2. If the user thesis requires an NGS-based epitope signal, use it differently: cluster enriched VHHs and ask whether CLUSTER MEMBERSHIP (same CDR3 family) co-localises predicted epitopes from a structure predictor (OpenFold3/Boltz), rather than chemistry matching.
3. Obtain an HF token (the dataset is gated) and rerun this exact script with real enriched CDR3 families; it takes about 40 s on CPU. Expect weaker results than the oracle.
4. Run DiscoTope-3.0 and BepiPred-3.0 (both up) on HER2 ECD from 1N8Z/6OGE; use the output as a prior feature and the baseline any NGS-derived feature must beat.
5. A cheaper idea suggested by the numbers: epitopes of the three public controls cover 3 of 4 domains, so a domain-level prior (I vs II vs IV) gets more from nanobody precedent (2Rs15d domain I) than from chemistry.

## Open questions
- Does a real DiscoTope-3/SEMA prior on HER2 concentrate on domain IV/II (the immunogenic regions)? Not measured.
- Do enriched families have structured CDR3 motifs at all after one biopanning round? Requires the gated CSV.
- Is there any antibody-side-only epitope inference paper post-2025? My search found none; unverified.
- 5F7 nanobody: structure or epitope source not located.

## Sources
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6259106/ (Molecules 2011 review; read)
- https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2024.1295972/full (MimoTree; read)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2808184/ (EpiSearch; read)
- https://link.springer.com/article/10.1186/1471-2105-7-451 (MIMOX; search result only)
- https://curie.utmb.edu/episearch.html (search result; not reachable from here)
- https://www.rcsb.org/structure/5my6 (search result: 2Rs15d, domain I)
- PDB files 1N8Z, 1S78, 6OGE, 5MY6 downloaded from https://files.rcsb.org/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9679979 and https://services.healthtech.dtu.dk/services/BepiPred-3.0/ (search results; server HTTP 200)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10882062/ and https://services.healthtech.dtu.dk/services/DiscoTope-3.0/ (search results; server HTTP 200)
- https://sema.airi.net/ and https://academic.oup.com/nar/article/52/W1/W533/7653609 (search results)
- https://www.biorxiv.org/content/10.1101/2025.10.04.680432.full.pdf, https://pmc.ncbi.nlm.nih.gov/articles/PMC12626946/, https://www.nature.com/articles/s41598-024-80940-y, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10221809/ (search results, paratope/idiotope)
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (file list via API; downloads 401)
