---
title: CAPRI, DockQ and CAPRI-Q - blind docking history and what it means for SEPIQ scoring
queen: q4_challenge_intelligence
king: king_world
worker: capri_dockq_capri_q_history_of_blind_docking_challenges_and_lessons_for_scoring
tier: expert
tags: [CAPRI, DockQ, CAPRI-Q, CASP16, antibody-antigen, nanobody, AlphaFold3, PR-AUC, screening-statistics]
confidence: medium
challenge_relevance: 3
serendipity: Healthcare screening (PPV vs prevalence) applied to docking grades; paid off - it shows a CAPRI Acceptable pose can be a weak residue-level classifier at 0.126 prevalence, and that PR-AUC of a binary docked model is roughly recall x precision.
date: 2026-10-17
---

# CAPRI, DockQ and CAPRI-Q: blind docking history and lessons for SEPIQ scoring

**TL;DR.** Track B is a CAPRI-run atomic-level docking contest scored with DockQ/CAPRI-Q, separate from the Track A residue-level PR-AUC that carries the prize money. Blind antibody/nanobody docking is still hard (CASP16: best group above 60% on antibody-antigen targets, typical group about a quarter; AF3 single seed about 31% acceptable on nanobodies). A docked model only helps Track A once converted to per-residue probabilities, and at 0.126 prevalence even a decent classifier has PPV below about 0.55.

Items I could not verify are marked "unverified". I did not capture the sepiq.uk verbatim text or sequences (another worker's job).

## 1. The CAPRI track: what is confirmed

| Item | Finding | Source / status |
|---|---|---|
| Track B definition | "Predict antigen-VHH complex structures from sequences", "managed by CAPRI"; follows "the established CAPRI framework for target release, model submission, and assessment"; "Please wait for a future announcement from CAPRI for a more detailed explanation" | sepiq.uk/guideline, fetched 2026-10-17 |
| Is DockQ/CAPRI-Q confirmed? | Largely yes. /guideline says Track B is evaluated with "CAPRI-Q/DockQ-based measures", gives d1 = 8.5 A and d2 = 1.5 A, says DockQ >= 0.80 is high accuracy and <= 0.23 incorrect, and cites Basu & Wallner 2016 and Collins et al. 2024. The home page says "metrics such as DockQ". /detail only lists DockQ and CAPRI-Q in references. BRIEF's "not yet confirmed" is outdated for the metric family; per-target rules and the CAPRI-side announcement are still pending | sepiq.uk home, /guideline, /detail |
| Round start | Home page timeline: "Track B (CAPRI round begins)" 16 Sept; judging 1-30 Nov. /detail gives Track A window 1 Sep-31 Oct, results 15 Dec | sepiq.uk |
| Registration | /detail: "Track B eligibility and registration will follow the standard CAPRI procedures"; submissions "will not be handled as standard SEPIQ/Hugging Face submissions unless otherwise agreed with the CAPRI team". No dedicated SEPIQ registration page found | /detail |
| CAPRI-side listing | EBI CAPRI page lists rounds 1-65; "Upcoming: none, Active: none"; Round 65 = 7th joint CASP-CAPRI assembly challenge (CASP17 season, Apr-Aug 2026). No mention of HER2, VHH or SEPIQ. capri-docking.org fetch returned a stale page (Round 51, 2020). **SEPIQ round number: unknown** | fetched |
| Submission size | Standard CAPRI: sets of **ten** models per target on the CAPRI site; larger sets go to scorer groups. SEPIQ says only "standard CAPRI submission rules". The "5 models" belief appears wrong for CAPRI (5 is the Track A per-team submission cap). SEPIQ Track B count: unverified | EBI page, /detail |
| Who scores | CAPRI assessors (CAPRI-Q resource). Track A scored by SEPIQ evaluators. Track B prizes set separately with CAPRI | /detail |
| Target type | HER2-VHH complexes (ONU11/13/23) implied; whether the antigen structure is supplied was "to be released with the full guidelines" (home FAQ). Whether Track B uses all three targets: unverified | home, /guideline |

Contradictions: /guideline is more specific than /detail on DockQ; use /guideline for Track B. The bootstrap is called a "cluster bootstrap" but the described procedure resamples residue indices (L draws with replacement, same indices reused across antibodies and teams), B about 2,000, 95% percentile interval, run only when scores are close.

## 2. DockQ / CAPRI-Q cheat-sheet

Formula (Basu & Wallner 2016, doi 10.1371/journal.pone.0161879; same parameters in DockQ v2, Mirabello & Wallner, Bioinformatics 40(10), 2024, PMC11467047):

DockQ = ( Fnat + 1/(1+(LRMS/8.5)^2) + 1/(1+(iRMS/1.5)^2) ) / 3, range 0-1. (The PLOS page renders equations as images, so the form is reconstructed from its text and the v2 text.)

| Quantity | Definition |
|---|---|
| Interface contact | heavy-atom pair < 5 A (4 A for peptides in v2) |
| Fnat | fraction of native contacts reproduced |
| LRMS | backbone RMSD of the ligand after superposing the receptor (larger chain) |
| iRMS | backbone RMSD over native interface residues defined at a 10 A cutoff (8 A Cbeta for peptides in v2) |

| Class | CAPRI rule | DockQ band |
|---|---|---|
| Incorrect | Fnat < 0.1, or (LRMS > 10 and iRMS > 4.0) | < 0.23 |
| Acceptable | 0.1 <= Fnat < 0.3 and (LRMS <= 10 or iRMS <= 4), or Fnat >= 0.3 and LRMS > 5 and iRMS > 2 | 0.23-0.49 |
| Medium | 0.3 <= Fnat < 0.5 and (LRMS <= 5 or iRMS <= 2), or Fnat >= 0.5 and LRMS > 1 and iRMS > 1 | 0.49-0.80 |
| High | Fnat >= 0.5 and (LRMS <= 1 or iRMS <= 1) | >= 0.80 |

The paper says the cutoffs 0.23/0.49/0.80 were optimised on the MOAL set and are a correspondence, not a classification rule. Numbers seen: MOAL-set 56,015 models / 118 targets (54,324 Incorrect, 762 Acceptable, 855 Medium, 74 High); independent CAPRI-set 15,328 models (13,849 / 632 / 565 / 282); DockQ vs IS-score Pearson R 0.98; AUC 0.98/0.99/0.97 (Acc/Med/High) vs 0.89/0.92/0.82 for IS-score; average PPV 94% at 90% recall; best average F1 0.91.

DockQ v2 changes: pure-Python rewrite, pip-installable, linear part about 4.08x faster; every interface in a multi-chain complex scored; GlobalDockQ = mean over interfaces; automatic chain mapping by exhaustive permutation maximising GlobalDockQ (A8 homomer: 8! = 40,320 mappings, about 1 min on 8 threads); nucleic acids and small molecules; clash detection; mmCIF/gzip. For a 1:1 antigen:VHH complex v2 should reduce to single-interface DockQ (my inference).

## 3. History of blind assessment on antibody/nanobody targets

| Experiment | Result | Source |
|---|---|---|
| CAPRI rounds 47-55 (8th evaluation) | Top groups acceptable-or-better on 70-75% of targets, fewer high-accuracy (secondary listing, check primary) | search listing of Proteins paper |
| CASP15-CAPRI | about 30 groups, about 2,000 models per target (Proteins 91(12):1658-1683, 2023) | listing |
| CAPRI Round 55 MassiveFold | >6,000 AF2 predictions/target gave acceptable-to-high models but AF confidence could not select them; confidence biased toward antibody chains; interface pLDDT proposed | search snippets |
| CASP16 AA, Phase 1 | 8 targets (5 Ab, 3 Nb); 5 of 8 hard; groups right on about a quarter; kozakovvajda >60% with classical docking + heavy sampling; top average DockQ 0.50 (CASP15) vs 0.47 (CASP16); ColabFold mean DockQ 0.21 to 0.05; acceptable on 3 and 5 targets for ClusPro and kozakovvajda, 1 and 2 for Wallner and Zheng (CASP15: Wallner and Zheng 5 each, ClusPro 2); AF3 5,000 models (1,000 seeds) gave only 2 models with DockQ > 0.49, mean about 0.27 | PMC12154902 |
| CASP16 H1244 (nanobody) | no group, AF-Multimer or AF3 acceptable; predicted interface too large | PMC12154902 |
| Hitawala & Gray, mAbs 2025 (doi 10.1080/19420862.2025.2545601; publisher page 403, numbers from PMC11838198) | AF3 one seed: Ab 38.1% DockQ > 0.23, 11.0% high (N=118); **Nb 31.4% and 11.4% (N=70)**; Rosetta docking and AF2.3-M about 20% (Ab); AlphaRED 43% acceptable; AF3 with 1,000 seeds 60% (cited from AF3 paper); successful Nb dockings have sub-angstrom CDR H3 in 64.7% vs 13.4% of failures. Authors: model "has difficulty finding the correct antigen interface" | PMC11838198 |

Unreconciled: a search snippet quoted 8.9% and 13.4% high-accuracy rates, versus 11.0/11.4 in the PMC text (possibly preprint vs published).

## 4. CAPRI atomic scoring vs Track A residue PR-AUC

A docked model gives per-residue interface calls: positive if any heavy atom is within 5 A of the partner (CAPRI rule), or a soft score from a distance kernel or ensemble frequency. Track A truth is Voronota-LT contact area for antigen-VHH pairs, with no distance cutoff. **I found no source quantifying overlap between Voronota-LT contact residues and 5 A CAPRI residues; unverified.** It is cheap to test on any public Nb-Ag structure; expect high agreement with differences at the rim.

The CAPRI grade does not map onto the Track A metric: DockQ's Fnat floor of 0.1 lets an "Acceptable" pose have most contacts wrong, which means near-random residue precision. Conversely a pose that finds the right antigen region with the wrong VHH orientation (CASP16 H1244: right region, interface too large) is "Incorrect" in CAPRI yet earns recall on the antigen chain in Track A. So Track B-style models are best used as an epitope ensemble, not as a single pose.

## 5. Epitope-level precedents and pathologies

- CAPRI counts residue-residue contacts (5 A) and interface residues, with F1; Score_set v2022 holds 96 targets, 148 interfaces, about 170k models (Lensink talk, snippet). CASP16 assessment weighted per-interface ICS/IPS by log10(interface size), an explicit correction for size dependence.
- I found no CASP/CAPRI contest that used residue-level PR-AUC on a handful of targets. Interface-residue predictors (e.g. PredUs) are literature, not blind challenges. Pathologies are therefore partly inferred: low base rate, interface-size dependence, class imbalance (about 97% incorrect even in DockQ's own training set).

## 6. Pitfalls for a 3-target, one-shot contest

- Target luck: CASP16 had 5 of 8 AA targets hard; group ranks swung between CASP15 and CASP16 (Wallner 5 acceptable targets, then 1). With 3 targets one miss dominates the macro mean.
- Ties and bootstrap: no tie rule stated. The residue bootstrap measures residue noise, not target noise; CASP used 1,000 bootstrap replicates over common targets.
- Leakage: organisers: not an issue "as long as the answer is correct". Held-out structures released only after evaluation.
- PDB/EMDB: search for ONU11/ONU13/ONU23 found no EMDB entries or Osaka HER2-VHH paper (only unrelated HER2 entries such as EMD-20055, 4.36 A, trastuzumab/pertuzumab). Home page says cryo-EM analysis is "in progress"; no accession or release date is given. Release before 31 Oct: unverified, seems unlikely.
- AF confidence does not rank antibody-antigen models reliably (Round 55).

## Forced analogy: healthcare screening statistics

Treat the docked interface call as a diagnostic test on residues; prevalence p = 0.126 (26/206 in the 8GZ5 proxy). PPV = sens*p / (sens*p + (1-spec)*(1-p)), 1-p = 0.874.

| Assumed sens | spec | PPV | binary PR area (recall x precision) | vs random 0.126 |
|---|---|---|---|---|
| 0.60 | 0.90 | 0.0756/0.1630 = 0.464 | 0.278 | 2.2x |
| 0.40 | 0.95 | 0.0504/0.0941 = 0.536 | 0.214 | 1.7x |
| 0.60 | 0.95 | 0.0756/0.1193 = 0.634 | 0.380 | 3.0x |
| 0.30 | 0.80 | 0.0378/0.2126 = 0.178 | 0.053 | below random |

A hard-thresholded docked model is a single PR point; with omitted residues = 0, PR-AUC is about recall x precision. Compare the AntiBinder proxy PR-AUC 0.176 (BRIEF figure, not re-verified). If residue sensitivity were similar to Fnat (assumption, not shown), an "Acceptable" pose (Fnat 0.1-0.3) gives sens 0.1-0.3 and PPV near or under 0.2, while "Medium" (Fnat >= 0.3) is a useful classifier. The screening view says CAPRI's single grade throws away exactly what Track A rewards, the ranking. Testable idea: average per-residue interface indicators across many seeds/models (e.g. thousands of AF3 samples as in CASP16) to get an ensemble frequency, submit it as a soft score, and tune the transform on public Nb-Ag structures to maximise PR-AUC at 0.126 prevalence.
Verdict: partially holds. The PPV/prevalence arithmetic and the one-point PR curve are exact. It breaks because residues in one interface are spatially correlated, so sens/spec are not constants, and a residue bootstrap understates uncertainty.

## Gotchas / what could fool us
- DockQ is pose-level; Track A is residue-level. Right epitope with wrong VHH orientation is "Incorrect" in CAPRI.
- Three "interface" definitions: 10 A iRMS set, 5 A contact set, Voronota-LT area.
- Fnat floor means "Acceptable" can be mostly wrong residue-wise.
- Hitawala & Gray rates differ between versions in my sources.
- "5 models" is Track A; standard CAPRI is ten.
- Three targets only: ranking uncertainty is mostly target luck.

## Implications for the challenge
1. Treat Track B as a separate contest; reuse its docked ensembles for Track A rather than optimising pose quality.
2. Generate many AF3/OpenFold3/Boltz seeds per ONU complex; submit per-residue interface frequency (soft, both chains).
3. Keep antigen-epitope consensus even when poses disagree (H1244 lesson).
4. Do not rank by ipTM alone; try interface pLDDT and consensus.
5. Locally compare Voronota-LT residues with 5 A heavy-atom residues on public Nb-Ag structures to calibrate cutoffs.
6. Recheck CAPRI/PDBe/EMDB before 31 Oct for ONU entries and the Track B round number.

## Open questions
- CAPRI round number and SEPIQ Track B models per target (ten?).
- Whether Track B supplies the antigen structure.
- Voronota-LT vs 5 A residue overlap on Nb-Ag complexes.
- Reconciling Hitawala & Gray rates (8.9/13.4 vs 11.0/11.4).
- CAPRI top-group rates specifically for nanobodies.

## Sources
- https://sepiq.uk/ , https://sepiq.uk/detail , https://sepiq.uk/guideline (fetched 2026-10-17)
- https://www.ebi.ac.uk/pdbe/complex-pred/capri/ ; https://www.capri-docking.org (stale page)
- https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0161879
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11467047/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12154902/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11838198/ (doi 10.1080/19420862.2025.2545601 page itself returned 403)
- Search summaries only, not opened: onlinelibrary.wiley.com/doi/10.1002/prot.26801 (CAPRI 47-55), pubmed 39868877 (MassiveFold), bioinfo.univ-lille.fr/jolibio/talks/02_jolibio_Lensink.pdf (Score_set)
