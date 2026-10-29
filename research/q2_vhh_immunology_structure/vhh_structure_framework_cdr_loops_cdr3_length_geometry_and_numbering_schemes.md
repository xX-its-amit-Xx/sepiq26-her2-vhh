---
title: VHH structure - framework, CDR loops, CDR3 length/geometry, numbering schemes and CDR3 "inpainting"
queen: q2_vhh_immunology_structure
king: king_world
worker: vhh_structure_framework_cdr_loops_cdr3_length_geometry_and_numbering_schemes
tier: expert
tags: [vhh, cdr3, imgt, anarci, kinked, extended, nanobodybuilder2, igfold, alphafold3, paratope-prior, her2-nanobodies, sabdab-nano]
confidence: medium
challenge_relevance: 4
serendipity: Art-conservation inpainting (framework = canvas, CDR3 = lost paint layer). Paid off partly - it gave a concrete length/kink-conditional test and a prior conditioned on CDR3 length; the "restorer" fails exactly where the loop is kinked and long, which is where ONU11/ONU23 sit.
date: 2026-10-17
---

# VHH structure: framework, CDR loops, CDR3 geometry, numbering, predictor accuracy

**TL;DR.** A VHH is a conserved ~115-aa scaffold plus three loops, and CDR3 (median ~15-16 aa, ~35% >= 18 aa in the PDB) does most of the binding (~43% of contact residues in my 615-complex tally) but is the part structure predictors get wrong (mean CDR3 RMSD 2.9-4.3 A vs framework ~0.8 A). Roughly one contact residue in four to five lies outside the IMGT CDRs (mostly FR2 positions 42/49/50/52), and a position-only prior built from PDB VHH complexes (provided, JSON) reaches macro PR-AUC ~0.6 in a leaky 5-fold CV on paratope residues. Treat 0.6 as an upper bound, not a forecast.

Provenance legend: **[V]** = number read from a source page I opened; **[C]** = computed by me this session (scripts in `C:\Temp\sepiq26\scripts`, data from RCSB 2026-10-17); **[S]** = only seen in a search snippet; **[U]** = unverified.

## 1. CDR length distributions and the SAbDab-nano count

| Set | n | CDR3 median (mean) | CDR3 >= 18 | Source |
|---|---|---|---|---|
| Human VH repertoire | 324,005 (Methods say 325,005) | 14 (14.11) | not reported | Zhang 2025 Front Immunol [V] |
| Alpaca VHH repertoire | 465,173 | 16 (15.73) | not reported | same [V] |
| Llama VHH repertoire | 219,381 | 16 (15.74) | not reported | same [V] |
| Bactrian VHH repertoire | 187,873 | 19 (19.34) | not reported | same [V] |
| 90 non-redundant Nb-antigen crystal structures | 90 | 15 (15.19 +/- 4.23) vs Ab VH 12 (12.09 +/- 3.81) | not reported | Mitchell & Colwell 2018 [V] |
| 2,161 numbered nanobodies (sequence + 3D) | 2,161 | median 15, range quoted 12-18; CDR1 ~6, CDR2 12-13 (their definition) | not reported | J Genet Eng Biotechnol 2022 [V] |
| **PDB camelid VHH-like chains, unique sequences** (RCSB organism filter Lama/Vicugna/Camelus, 100-145 aa, anchor-based CDR3 = Cys104..W118) | 854 | **16 (15.67)** | **35.2%** (>= 20: 20.3%; <= 10: 13.3%) | [C] |
| Structural CDR-H3 of kinked / extended VHH (their loop definition, not IMGT) | 215 / 100 | 12 vs 9 | - | Dizicheh 2023 [V] |

- **SAbDab-nano entry count.** NAR 2022 paper: 823 structures / 492 nanobodies with non-redundant CDR sequences as of Sept 2021 [V, academic.oup.com page]. Stats-page snapshots: 1,585 (18 Apr 2024) and **1,972 single-domain structures on 10 Jul 2025** (1,089 X-ray, 874 EM, 8 NMR; 1,864 with antigen, 87 with affinity) [S, search snippet; live stats page now redirects to a "SAbDab2" shell that returned no figures, so "today's release" is **unverified**; the count grows ~4/week and the 2025 label changed from "nanobody" to "single-domain", so the series is not strictly comparable].
- **No published SAbDab-nano CDR1/2/3 histogram with a >= 18 fraction was found.** My [C] PDB-derived 35% is a substitute and it overweights heavily-studied clones (unique by full sequence, but many are siblings). A repertoire/PDB gap is plausible (repertoire median 16, bactrian 19).
- NanoNet / NanoBodyBuilder2 training-set CDR statistics: the NanoBodyBuilder2 main text does not report the nanobody training/test set size (deferred to Supplementary Notes 1-2) [V]. **Unverified.**
- CDR1 is 8 aa in 538/615 of my IMGT-anchored PDB set (IMGT 27-38 with gaps) [C]; CDR2 is 9 aa (317) or 8 aa (220) [C] (boundaries approximate, see Gotchas). The VHH-vs-VH story: VHH H1 backbone RMSD 3.36 +/- 1.11 A vs 1.60 +/- 0.92 for antibodies, H2 1.86 vs 1.78, H3 6.43 +/- 3.32 vs 3.52 +/- 1.33 A (max 21.1 A) [V, Mitchell & Colwell]. VHH CDR1 is therefore *not* a canonical-class loop; do not assume canonical structures for it.

## 2. Numbering: how each scheme treats a VHH

| Scheme | CDR1 | CDR2 | CDR3 | VHH-relevant behaviour |
|---|---|---|---|---|
| IMGT | 27-38 | 56-65 | 105-117 | CDR3 shorter than 13: gaps at the centre (111/112); longer: insertions 111A... / ...112A, alternating around 111/112. FR1 usually has a gap at **10** (VH numbered 1-26 with 25 residues). C23, W41, C104, W118 are fixed anchors. VHH hallmark FR2 = IMGT **42, 49, 50, 52**. |
| Kabat | 31-35B | 50-65 | 95-102 | letters (100A-K) for CDR3; hallmark Kabat 37/44/45/47. |
| Chothia | 26-32 | 52-56 | 95-102 | structural loop definitions, CDR1/2 shorter. |
| AHo | 24-42 | 57-76 | 109-138 | gapped, fixed length (no insertion letters); CDR3 shorter than 30 padded with gaps. |
| Martin (enhanced Chothia) | as Chothia | | | enhanced for light-chain loop lengths; irrelevant for VHH. |

(IMGT/Kabat/AHo boundaries are from my background knowledge of the schemes and the Kabat-style patent boundaries seen in a search snippet - **[U]**, I did not open the IMGT documentation.) The two facts that matter here: (i) only IMGT and AHo give every sequence the same coordinate system with fixed-length loops (insertions are explicit gaps), so they are the right choice for per-position priors; (ii) ANARCI (Dunbar & Deane, Bioinformatics 2016, doi 10.1093/bioinformatics/btv552 [S]) supports IMGT, Kabat, Chothia, Enhanced Chothia and AHo from HMMs (PyPI page [S]); `abnumber` wraps ANARCI. ANARCI/abnumber were **not run** here: `hmmscan` is not on this Windows box. The mappings below were made with my own anchor-rule script `prior.py` (C23, W41, "RFTIS" motif for FR3, C104, W118); **FR3 gap placement and CDR2 length are +/-1 versus a real ANARCI run. Re-run `ANARCI -s imgt --assign_germline` or `abnumber.Chain(seq,'imgt')` on Explorer (CPU, not GPU) before trusting positions 60-103.**

**Worked example 1 - 2Rs15d (PDB 5MY6 chain B)**, `QVQLQESGGGSVQAGGSLKLTCAASGYIFNSCGMGWYRQSPGRERELVSRISGDGDTWHKESVKGRFTISQDNVKKTLYLQMNSLKPEDTAVYFCAVCYNLETYWGQGTQVTVSS`:
IMGT FR1 has a gap at 10 (G9, G11); CDR1 `GYIFNSCG` = 27-30 + 35-38 (gaps 31-34); FR2 `M39 G40 W41 Y42 R43 Q44 S45 P46 G47 R48 E49 R50 E51 L52 V53 S54 R55`; CDR2 `ISGDGDTW` = 56-59 + 62-65 (gaps 60, 61); **CDR3 `AVCYNLETY` (9 aa) = A105 V106 C107 Y108 N109 | gaps 110-113 | L114 E115 T116 Y117**; W118 G119 Q120 G121. Note C37 (CDR1) and C107 (CDR3) = the non-canonical CDR1-CDR3 disulfide typical of dromedary VHH (Henry & MacKenzie mention non-canonical disulfides constraining long CDR3 [V]). 4.0 A contacts to HER2 in 5MY6 [C]: S31 C32 G33 (CDR1), M34 Y37 E44 R45 L47 R50 (FR2 = IMGT 39, 42, 49, 50, 52, 55), S52 G53 D54 W58 (CDR2), C98 L101 E102 T103 (CDR3), W105 (W118). i.e. all four VHH hallmark FR2 positions touch HER2 in this clone: 44% of its contact residues are outside the CDRs.

**Worked example 2 - NM-02 (7QVK chain B, 17-aa CDR3 -> 4 insertions)**: CDR3 `AAEGHRYELGTCAALDY` = A105 A106 E107 G108 H109 R110 Y111 E111A L111B G112B T112A C112 A113 A114 L115 D116 Y117 in ANARCI-style letters (IMGT rule, unexecuted). Contacts [C]: Q1 L2 (N-terminus), F25 (FR1), CDR3 H98 Y100 E101 L102 A107 Y110, W111 (FR4 W118) and R113. 36% outside CDRs; an N-terminal contact is a rare but real framework mode.

**Challenge sequences (verbatim from `research/_meta/sepiq_verbatim.md`), mapped by my anchor script**. Positions are sequential residue numbers *including* the leading `MA` (so ONU11 residue 3 = Q1 IMGT); offsets of -2 convert to the Q1-based count. Tags: `HHHHHH` at the end; ONU11/13 end `...VTVSS` (121 incl. S) + His6 = 127; ONU23 129 + His6 = 135.

| Clone | seq C23 / W41 / C104 / W118 | CDR1 (27-38) | CDR2 (56-65) | CDR3 (105-117 +insertions), length | IMGT 42/49/50/52 |
|---|---|---|---|---|---|
| ONU11 | C24 / W38 / C96 / W111 | G28 R29 T30 L31 -- S32 G33 W34 V35 = 27-30, 35-38 (8) | L53-A59 (7) after H at FR2 | `AARPLGSTWTEHPY`, **14**; A97=105 A98=106 R99=107 P100=108 L101=109 G102=110, S103/T104/W105 = 111.1/112.1/112 region, T106=113 E107=114 H108=115 P109=116 Y110=117 | F / D / R / F |
| ONU13 | C24 / W38 / C98 / W111 | E28 R29 T30 F31 -- S32 I33 D34 Y35 (8) | I53-G61 (9) | `AAKYGSSRLWDY`, **12**; A99=105 A100=106 K101=107 Y102=108 G103=109 S104=110, gap 111, S105=112 R106=113 L107=114 W108=115 D109=116 Y110=117 | Y / Q / R / F |
| ONU23 | C24 / W38 / C98 / W119 | G28 R29 T30 L31 -- S32 G33 A34 A35 (8) | I53-Q61 (9) | `AADGRFYSDYVWSSPDEYAY`, **20**; A99=105 A100=106 D101=107 G102=108 R103=109 F104=110 Y105=111 S106=111.1 D107=111.2 Y108=111.3 V109=111.4 W110=112.3 S111=112.2 S112=112.1 P113=112 D114=113 E115=114 Y116=115 A117=116 Y118=117 (IMGT insertion order, 7 extra) | F / E / R / F |

All three are classical VHH (hallmark F/Y42, E/Q/D49, R50, F52) and the first two carry "CDR1 `G R T L S`" / "`E R T F S`" - the RTF/RTL motif is the dominant alpaca IGHV3S53-like type. Position-in-the-prior consequence: ONU23's long CDR3 puts 7 residues in the "111+" insertion block where my prior is a single lumped value.

## 3. CDR3 geometry: kinked vs extended, framework contacts, concavity

**Primary-source findings (Dizicheh, Chen & Koenig, Commun Biol 2023, doi 10.1038/s42003-023-05241-y [V])**: 385 unique llama/alpaca VHH structures; classification by two angles at the C-terminal stem (alpha101, tau101): **58% kinked, 29% extended, 13% unclassified**; human antibodies ~79% kinked in the same framing (as stated by the authors). Kinked CDR-H3: median 12 residues, folds onto FR2; Phe at Kabat 37 and 47 (IMGT 42, 52), mostly Gln44 (IMGT 49), contacts at 37/45/47 + W103 (IMGT 118) + CDR3 positions I1, I4, I6; Arg45-Trp103-Tyr(I1) pi-stack; ~75% show a 3-10 turn at I2-I4. Extended: median 9 residues, Tyr37/Leu47, little FR2 contact apart from the W103-FR2 stack. **FR2 is part of the paratope in >72% of extended vs >44% of kinked structures (82 vs 32 A^2); CDR-H3 paratope area ~400 vs 411 A^2.** Germline link: IGHV3-3 -> 82% kinked, IGHV3S53 -> 75% extended; IGHV3-3 CDR3 mean 14 vs 9 in repertoire. AlphaFold 2.2 kink/extended classification: false-positive 9%/6%, false-negative 6%/8% (35 kinked, 36 extended). F37Y/F47L reduced Tm ~10 C in 4/8 VHHs. A 541-complex alpaca/llama set (Zhang 2025) confirms: longer CDR3 -> bent; FR2 contact count vs CDR3 length R = -0.472, CDR3 contacts vs length R = +0.536 (p < 1e-4) [V]. Second opinion: a 70-complex benchmark labels 45 kinked / 25 stretched (64/36%) [V, Eshak preprint] - fraction is dataset-dependent.

**Not the paper the brief assumed.** Zavrtanik et al., J Mol Biol 430:4369 (2018), doi 10.1016/j.jmb.2018.09.002, studied ~105 sdAb-antigen complexes [S] and reports paratopes enriched in aromatics and more hydrophobic, epitopes "more rigid, concave, conserved, structured, aromatic-rich", with numerous framework contacts concentrated in **four structurally distinct framework regions** forming mostly charged interactions [S - only abstract-level snippets reached me]. I could not obtain its full text, so its **kinked/extended frequency, curvature definition and proportions are unverified**; the kinked/extended counts above come from Dizicheh 2023, not Zavrtanik/Mitchell (Mitchell & Colwell 2018 does not use the terms [V]). Henry & MacKenzie 2018 [V]: sdAb paratopes "flat and convex... possibly only inefficiently concave"; no curvature numbers.

**Concave vs convex, quantitatively - proposal, no published proportion found.** Fit a sphere (or osculating paraboloid) to paratope C-alpha/centroid coordinates; signed curvature kappa = +1/R when the interface centroid lies on the antigen side of the best-fit plane through the paratope rim (concave), - otherwise (convex); flat if |kappa| < 0.02 A^-1. Run on the 615-complex PDB set (script `prior.py` already holds the contacts - coordinates were not retained) to get proportions. Until done: **proportions unverified**; the literature direction is VHH epitopes concave-biased vs conventional antibodies, VHH paratopes more convex/flat [S/V qualitatively].

## 4. Predictor accuracy on VHH CDR3

| Study / set | Method | CDR3 RMSD (A) | Other | Source |
|---|---|---|---|---|
| NanoBodyBuilder2, nanobody test set (size unstated) | NanoBodyBuilder2 / AlphaFold2 / ABodyBuilder / MOE | **2.89** / 3.44 / 5.08 / 4.90 (means) | CDR1 1.98/2.08; CDR2 1.37/1.35; framework 0.79/0.82 | Abanades 2023, doi 10.1038/s42003-023-04927-7 [V, PMC10227038 mirror] |
| IgFold paper, 71 nanobodies | AlphaFold / IgFold / NanoNet | 4.00 / 4.25 / 5.43 (mean) | IgFold ~15 s vs ~6 min | Ruffolo 2023, doi 10.1038/s41467-023-38063-x [V, PMC10129313] |
| Independent, 75 nanobodies not in any training set | OmegaFold / AF2 / IgFold / ESMFold / NanoNet | median **2.5** / 3.3 / 3.3 / 3.3 / 3.8 | fraction < 2.5 A: 52 / 44 / 29 / 35 / 25% | Valdes-Tresanco 2023 Molecules [V] |
| 70 nanobody-antigen complexes, **bound** | AF3 / AF2-Multimer | median **1.34** / 1.90 | median CDR1 1.04/1.31, CDR2 0.74/0.89; complex correct 47.1% / 32.8% | Eshak & Goupil-Lamy bioRxiv 2024 v2 [V] |
| 70 nanobodies, unbound, AF3 one seed | AF3 | median **2.30** (2.06 in Fig 3B); bound-context 1.97 | high-accuracy docking (DockQ >= 0.8) 11.4%, acceptable-or-better 31.4%, fail ~60% | Hitawala & Gray, mAbs 2025, doi 10.1080/19420862.2025.2545601 [V] |
| same benchmark | Boltz-1 / Chai-1 | **no CDR3 RMSD obtained**; high-accuracy rate ~5% / 3.3% (nanobodies) | authors: both predict H3 well yet dock wrongly | search snippet [S] |

- **Where inpainting fails.** (a) Valdes-Tresanco: errors grow for the longest loops; length 15 easy (OmegaFold < 2 A for all), lengths 17-18 modelled well by all but Yang-Server, lengths 19 and 24 had a few high-RMSD models explained by unusual references (antigen wedged under CDR3; engineered VH lacking the canonical disulfide); n per length is tiny (1-9) [V]. (b) Eshak: median CDR3 length 11-12 for high-quality complexes vs **17 for incorrect ones**; AF3 > 80% success with stretched CDR3 vs ~20% (kinked, incorrect > 70%) - internally inconsistent in the preprint (80% vs 88%), flag [V]. (c) AF3 "insufficient data to conclude on loop length for nanobodies" [V, Hitawala]. So there is no sharp RMSD-vs-length breakpoint in the literature; the defensible statement is "degrades from ~15-17 aa, worst when kinked and non-canonically disulfide-bridged".
- Key non-equivalences: NanoBodyBuilder2 2.89 A (mean, unbound, lenient test set) vs AF3 1.34 A (median, bound, antigen-aware) are not comparable; medians sit ~1-1.5 A below means because of a long tail.
- Training-set overlap with the test PDB entries is only partly controlled (Valdes-Tresanco claims none; Ruffolo, Abanades tests are time-split) - AF3/Boltz/Chai have PDB cut-offs before 2021-2024 so 2024-2025 PDB benchmarks are fairer than older ones.

## 5. Contact residues outside the IMGT CDRs

Computed [C] on 615 PDB camelid-VHH:protein interfaces (CDR3-sequence-unique; entry files <= 2.5 MB; first copy with >= 5 contacting residues; 4.0 A heavy-atom contact; CDR borders from my anchor numbering):

| Region | Share of contact residues | Contact probability per residue |
|---|---|---|
| CDR3 | 42.5% | 0.478 |
| CDR2 | 18.0% | 0.374 |
| CDR1 | 14.6% | 0.323 |
| FR2 | 9.8% | 0.102 |
| FR3 | 8.3% | 0.039 |
| FR1 | 3.8% | 0.028 |
| FR4 | 2.5% | 0.042 |

- **Outside IMGT CDRs: 24% pooled, 22.2% mean per complex (median 18.8%).** By CDR3 length: 34% (<= 12 aa), 27% (13-17), **16% (>= 18)** [C] - consistent with the FR2/CDR3-length anticorrelation in Zhang 2025 (R = -0.47) and with Dizicheh's extended > kinked FR2 use. FR2 positions 42, 49, 50, 52, 55 each 19-30% [C]. The five HER2-VHH chains (5MY6, 7QVK, 9MTE x2, 9MTX) give 44%, 36%, 50%, 38%, 53% outside the CDRs (45% pooled, n = 5, tiny) [C]: **for HER2 nanobodies the framework share is higher than the global figure**, because HER2 domain I/III epitopes are flat-ish and FR2-heavy.
- Mitchell & Colwell: VHH paratopes use 18.76 contact residues on average (VH 16.01), 50 aligned positions occurring in > 10% of structures vs 35 for VH; 5 of the extra VHH positions are in H3 and 5 are VH-VL-interface positions [V]. My mean 17.6-18.0 per VHH is consistent.
- Not SAbDab-nano: I did not have its tarball; fractions should be re-run on the weekly SAbDab-nano download (`pdb` list + Chothia/IMGT-numbered files) to match the challenge's population.

## 6. Sequence-only paratope baseline: features and a ready recipe

Features visible from sequence (all [C]/[V] as indicated): position (IMGT) is the dominant signal; CDR3 central residues (107-114) contact in 48-78% of PDB VHHs; CDR2 56-59 and 63-65 ~50%, CDR1 36-38 ~40-50%; FR2 42/49/50/52 ~20-30%; the N-terminus (1-2, 18-20%), FR3 66-68, 81 (12%) and W118 (19%) occasionally; everything else < 5%. Composition: paratopes aromatic-rich and hydrophobic [S, Zavrtanik abstract]; CDR3 Tyr/Trp-rich; W118/R50/Y42 stack with CDR3 in kinked loops. A length-conditional shift: long CDR3 (>= 18) puts 55% of contacts in CDR3 and 4% in FR2 vs 28% / 17% for CDR3 <= 12 [C].

**Recipe (about 40 lines of Python):**
1. Number the VHH with IMGT (ANARCI on Explorer, or my `prior.py` as a fallback). Strip `MA` prefix and His6; score only numbered residues.
2. `score(i) = (c[pos_i] + 2*g)/(t[pos_i] + 2)` using the table `vhh_imgt_positional_contact_prior_pdb615.json` (fields `freq`, `n_contact`, `n_seen` per IMGT position; `111+` = lumped CDR3 insertion block; g = global rate 0.14). For ONU23 the 7 residues in the 111+ block get 0.56 each.
3. Optionally multiply CDR3 residues by a mild bump for aromatic (W/Y/F) and subtract for G/P/charged-at-tip; keep this tiny until validated.
4. Output per-residue 0-1; write the VHH rows only (chain B); do not predict chain A from this table.
5. Validate with the same 5-fold CV: **flat prior macro PR-AUC = 0.605, length-conditional = 0.607, mean prevalence = 0.144** (n = 615 complexes) [C]. **This is optimistic**: folds are CDR3-sequence-unique but not clone-family-unique (many nanobodies share germline CDR1/2 and similar loops), the contact cutoff is 4 A not Voronota-LT, the `111+` lumped labels let the first k residues of the block score positive, and 7.5% of residues have no IMGT label. Compare AntiBinder's 0.176 on the RBD proxy (BRIEF.md): a position-only prior should beat a sequence-global-label model on paratope PR-AUC; do not read 0.6 as expected leaderboard performance.

## Forced analogy: art conservation (framework = canvas, CDR3 = lost paint layer)

(a) *Precise statement.* Scaffold (FR1-FR4 + C23-C104 disulfide + W118) is the support that any template restorer can read off a database; CDR1/CDR2 are partly-retained underpainting (restrained families: CDR1 8 aa in 87% of PDB VHH [C]); CDR3 is the missing paint layer; the antigen is the "frame" that determines which of several plausible reconstructions is real.
(b) *Testable ideas.* (1) **Restorer's competence curve**: stratify the 615-complex PDB set by CDR3 length and kink state (alpha101/tau101 or an FR2-residue proxy) and measure template-modelling/NanoBodyBuilder2 loop RMSD; expectation from [V] data: success for <= 15 aa extended, failure for >= 17 aa kinked. (2) **Context predicts the missing layer**: IMGT 42/52 = Phe/Phe and Gln49 predicts a kinked loop (Dizicheh). ONU11 (F42, D49, R50, F52) and ONU23 (F42, E49, R50, F52) are Phe/Phe -> predicted *kinked*; ONU13 (Y42, Q49, F52) is intermediate. Prediction: for ONU11/23 CDR3 packs against FR2 -> FR2 contact probability falls (my table: 4% of contacts for >= 18 aa) while CDR3 tip residues dominate; ONU13 with 12-aa CDR3 gets a higher FR2 share (17% for <= 12 aa). Implement as a CDR3-length-conditional prior (done above); gain in CV is negligible (0.605 -> 0.607), so do not expect it to move PR-AUC much. (3) **Hallucination detector**: AF3/Boltz ipTM/pLDDT of the CDR3 under antigen vs apo predictions - when predicted CDR3 RMSD between two seeds exceeds ~2.5 A, drop CDR3 weights to the prior (Eshak: ipTM-based correct/incorrect classification ~70-79% [V]).
(c) *Verdict.* **Partly holds.** Holds for the scaffold (framework RMSD 0.6-0.8 A everywhere) and for the "style from context" idea (germline/FR2 -> kinked/extended, AF2 kink call 91-94% accurate [V]). Breaks because a restorer reads the frame (antigen) too: the missing paint is not just a loop but an interface, and loop geometry is not the same as which residues touch. AF3 gets CDR3 backbone ~1.3 A median when bound but docks correctly only ~11% (high) / ~31% (acceptable) of nanobodies unbound [V]. Inpainting works for loops < ~15 aa and extended; it becomes hallucination for >= 17-18 aa kinked loops with a CDR1-CDR3 disulfide.

## Gotchas / what could fool us

1. **Dataset population mismatch.** Repertoire median 16 vs PDB set 15-16 vs "kinked/extended" CDR definitions (12 vs 9 = Dizicheh's structural loop, not IMGT 15/16). Do not mix them.
2. **Numbering artefacts**: challenge residues include a leading `MA`; ONU11/13 are numbered 1..120 + S; ONU23 numbering reaches position 130 which is already His1 (129 VHH + His6) [from `_meta/sepiq_verbatim.md`]. IMGT gaps (10, 73 and CDR centre) break any "position i of the template" assumption; template CSV seqNum is sequential and must be mapped back through the ANARCI position list.
3. **CDR definitions inflate "framework contacts"**: IMGT CDR2 56-65 vs Kabat 50-65 vs Chothia 52-56 changes the outside-CDR fraction by several points (Kabat FR2 residue 49-50 is IMGT CDR2/FR2 borderline). My 22-24% is IMGT only.
4. **Leakage risk**: CV across clonal siblings (same germline) inflates PR-AUC; HER2 VHH in the PDB (5MY6, 7QVK, 9MTE, 9MTX) are in my prior set; leave them out before scoring on any HER2-VHH proxy.
5. **RMSD hygiene**: mean vs median (~1 A), bound vs unbound, backbone-only vs all-atom, and "CDR3" including or excluding stem residues differ per paper.
6. **Sparse sources**: Nature/Springer pages returned auth redirects; IgFold and NanoBodyBuilder2 numbers came from PMC mirrors; Zavrtanik and the 2025 SAbDab-nano count were only available as abstracts/snippets; Ibex arXiv (32 nanobodies, NanoBodyBuilder2 comparison) could not be decoded.
7. **Contact definition**: 4.0 A heavy-atom (mine) vs Voronota-LT contact area (the challenge truth). Voronota-LT recovers more peripheral contacts and weights by area; "outside CDR" fractions typically rise a little - direction unmeasured, **unverified**.

## Implications for the challenge

1. Number ONU11/13/23 with ANARCI IMGT first (Explorer CPU); my table above is a fallback. Keep a seqNum <-> IMGT lookup in code; zero out `MA` and His6 residues.
2. Start with the positional prior (`vhh_imgt_positional_contact_prior_pdb615.json`) for chain B: flat is enough; add the length-conditional version only if it costs nothing. Expected paratope PR-AUC of the prior itself is far above random but the *antigen-side* epitope still needs a separate model.
3. Leave out HER2 nanobody PDBs (5MY6, 7QVK, 9MTE, 9MTX) when training/validating any prior or model that will be scored on HER2 complexes; use them separately as the sanity test (their FR2 share, 36-53%, is higher than the 24% global mean, so a HER2-conditional prior may be better).
4. Treat predicted CDR3 coordinates (AF3/Boltz/Chai/NanoBodyBuilder2) as a feature only when the CDR3 is <= 15 aa or confidence is high; ONU23 (20 aa, F42/F52 kinked-like) is the likeliest to hallucinate, ONU13 (12 aa) the safest.
5. The FR2 hallmark positions (42, 49, 50, 52) have ~20-30% contact probability and rise with short CDR3; give them 0.2-0.3 baseline, not 0.
6. Report both chains separately in the pipeline: nothing here informs HER2 epitope.

## Open questions

- Real SAbDab-nano CDR1/2/3 histograms and the >= 18 fraction on the current release (need the weekly download).
- Full Zavrtanik text: curvature definition and concave/convex proportions; four framework patches.
- NanoBodyBuilder2 nanobody test-set size and CDR3 RMSD by length (Supplementary Notes 2, 4).
- Boltz-1/Chai-1 CDR3 RMSD on nanobodies (only docking success seen).
- Whether ANARCI's IMGT numbering of ONU23 CDR3 insertions matches the IMGT rule I applied.
- Whether Track A per-complex PR-AUC pools the HER2 and VHH chains (determines how much the paratope prior contributes).

## Anti-HER2 nanobody table (queen extra)

| Nanobody | PDB | Epitope domain | Affinity | Source | Status |
|---|---|---|---|---|---|
| 2Rs15d | 5MY6 (X-ray 2.25 A; HER2 622 aa + Nb 115 aa; released 2017-08-09) | I; no competition with trastuzumab or pertuzumab | low-nM by SPR (value unverified) | D'Huyvetter et al., Clin Cancer Res 2017;23:6616, doi 10.1158/1078-0432.CCR-17-0310; Vaneycken 2011 FASEB J (snippet) | PDB verified; KD unverified |
| NM-02 | 7QVK (X-ray 3.1 A; released 2023-02-01) | I and II; 21-residue loop epitope, membrane-distal, no overlap with trastuzumab/pertuzumab | ~200 pM; humanised variant K 212 pM | PLOS ONE 2023, doi 10.1371/journal.pone.0288259 | verified |
| 27A05 | 9MTE (cryo-EM 2.66 A; 2025-11-19) | I + III (computed: 6 + 12 residues) | unverified | TPP-45142 paper, doi 10.1158/1535-7163.MCT-25-0654 (from RCSB citation) | PDB verified; clone-chain assignment inferred from residue counts |
| 47D05 | 9MTE | I + II (computed: 9 + 1) | unverified | same | same |
| 29E09 | 9MTX (cryo-EM 3.06 A; 2025-11-19) | I + III (computed: 7 + 10) | unverified | same | PDB verified |
| 5F7 | none found | IV (competes with trastuzumab) | 4.7 +/- 0.9 nM after labelling | astatine-211 labelling paper doi 10.1021/acs.molpharmaceut.9b00354 (snippet) | unverified (not opened) |
| A9B5 | none found | I | unverified | 2024 nanobody HER2 paper (PMC10634241 snippet) | unverified |
| 11A4 | none found | unknown | unknown | listed in brief; no source opened | unverifiable |

An RCSB title/organism search found no other HER2-VHH entries; "none found" means not found in that search, not absent. Another worker's file in this folder (`known_her2_nanobodies_2rs15d_5f7_and_others_epitopes_and_affinities.md`) may reconcile this list.

## Sources (opened or snippet-only, as marked)

- Schneider, Raybould, Deane, SAbDab-nano, NAR 2022, doi 10.1093/nar/gkab1050 - https://academic.oup.com/nar/article/50/D1/D1368/6420019 (opened; also PMC8728266 seen in search)
- SAbDab-nano stats snapshot (10 Jul 2025: 1,972; 18 Apr 2024: 1,585) - https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab/nano/stats (search snippet only; redirect to https://sabdab.opig.stats.ox.ac.uk/nano/stats returned no data)
- Abanades et al. 2023 (ImmuneBuilder/NanoBodyBuilder2), doi 10.1038/s42003-023-04927-7 - https://pmc.ncbi.nlm.nih.gov/articles/PMC10227038/ (opened; Table 3; this is the bioRxiv-mirror PMC copy)
- Ruffolo et al. 2023 IgFold, doi 10.1038/s41467-023-38063-x - https://pmc.ncbi.nlm.nih.gov/articles/PMC10129313 (opened)
- Valdes-Tresanco et al., Molecules 2023 - https://pmc.ncbi.nlm.nih.gov/articles/PMC10220908 (opened)
- Hitawala & Gray, mAbs 2025, doi 10.1080/19420862.2025.2545601 - https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/ (opened)
- Eshak & Goupil-Lamy, bioRxiv 2024 (v2) - https://www.biorxiv.org/content/10.1101/2024.10.07.616899v2.full (opened)
- Dizicheh, Chen, Koenig, Commun Biol 2023, doi 10.1038/s42003-023-05241-y - https://pmc.ncbi.nlm.nih.gov/articles/PMC10439903/ (opened)
- Zhang et al., Front Immunol 2025, doi 10.3389/fimmu.2025.1647230 - https://pmc.ncbi.nlm.nih.gov/articles/PMC12394203/ (opened)
- Mitchell & Colwell, Proteins 2018, doi 10.1002/prot.25497 - https://pmc.ncbi.nlm.nih.gov/articles/PMC6033041 (opened)
- Henry & MacKenzie, mAbs 2018, doi 10.1080/19420862.2018.1489633 - https://pmc.ncbi.nlm.nih.gov/articles/PMC6260137 (opened, first 100k chars)
- J Genet Eng Biotechnol 2022, doi 10.1186/s43141-022-00439-9 - https://pmc.ncbi.nlm.nih.gov/articles/PMC9684374/ (opened)
- Zavrtanik et al., J Mol Biol 2018, doi 10.1016/j.jmb.2018.09.002 - https://researchportal.vub.be/en/publications/structural-basis-of-epitope-recognition-by-heavy-chain-camelid-an (snippet only); PubMed page blocked by cookie wall
- ANARCI, Dunbar & Deane 2016, doi 10.1093/bioinformatics/btv552 - https://academic.oup.com/bioinformatics/article/32/2/298/1743894 (search snippet only); https://pypi.org/project/anarci/ (snippet)
- RCSB: https://www.rcsb.org/structure/5MY6 (opened); RCSB FASTA/Data API/Search API (5MY6, 7QVK, 9MTE, 9MTX, camelid VHH entities), accessed 2026-10-17
- PLOS ONE NM-02, doi 10.1371/journal.pone.0288259 - https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0288259 (opened)
- Hive-internal: `research/_meta/sepiq_verbatim.md` (ONU sequences), `research/q1_her2_biology/her2_public_complexes.json`
- Computed outputs: `research/q2_vhh_immunology_structure/vhh_imgt_positional_contact_prior_pdb615.json`; scripts `C:\Temp\sepiq26\scripts\{pdbvhh,prior,agg,paratope}.py`
