---
title: Nanobody therapeutics and engineering history, caplacizumab to bispecifics (with HER2 nanobody structures)
queen: q2_vhh_immunology_structure
king: king_world
worker: nanobody_therapeutics_and_engineering_history_caplacizumab_to_bispecifics
tier: expert
tags: [nanobody, VHH, caplacizumab, ozoralizumab, envafolimab, cilta-cel, HER2, 9MTE, 5MY6, epitope, SAbDab-nano, growth, overturned-claims]
confidence: medium
challenge_relevance: 3
serendipity: Art-conservation "over-restoration" analogy - treat each overturned epitope claim as overpaint; it paid off as a checklist (label confound, modelled-vs-measured discord, mechanism assumed from geometry) and surfaced a first-hand check, but no formally retracted nanobody epitope was found.
date: 2026-10-17
---

## TL;DR
Four nanobody-derived medicines are approved (caplacizumab 2018/19, envafolimab 2021, cilta-cel 2022, ozoralizumab 2022). Engineering (albumin-binding third domain, biparatopic/multivalent formats, CAR-T) mostly changed format and valency, not the single-VHH paratope-epitope rules. For the challenge, the most useful finding is that **four public HER2-VHH structures already exist** (5MY6, 7QVK, 9MTE, 9MTX; I computed their epitopes below) and they cluster on **domain I (plus I/III and I/II junction)**, away from trastuzumab (domain IV) and pertuzumab (domain II). A formally retracted nanobody-epitope claim could not be sourced; softer "overpaint" cases are listed with their limits.

## 1. Dated therapeutic timeline
| Date | Product | Target | Format | Event / source |
|---|---|---|---|---|
| 2018-08-30 (HemOnc) / 2018-09-03 (EC decision, newdrugapprovals.org) | caplacizumab (Cablivi) | vWF A1 | bivalent humanised VHH | EU approval, aTTP. Sources disagree on the day (DrugBank says Oct 2018). Basis: TITAN (ph II), HERCULES (ph III, n=220). Search snippets only. |
| 2019-02-06 | caplacizumab-yhdp | vWF A1 | same | FDA approval, adults with aTTP with plasma exchange + immunosuppression (snippet, journalforclinicalstudies.com) |
| 2021-11-26 to 2021-11-29 | envafolimab (KN035) | PD-L1 | VHH-Fc, subcutaneous | NMPA approval announced (3D Medicines 2021-11-26; TRACON 2021-11-29); a Frontiers case report says conditional authorisation Dec 2021 (contested). MSI-H/dMMR solid tumours; pivotal ORR 44.7% (BICR). |
| 2022-02-28 | ciltacabtagene autoleucel (Carvykti) | BCMA | CAR-T with two BCMA VHHs (biepitopic) | FDA approval, R/R myeloma after >=4 lines; CARTITUDE-1 ORR 98% (J&J/Legend release, snippet). |
| 2022-09-26 | ozoralizumab (Nanozora) | TNF-alpha + HSA | trivalent: 2 anti-TNF VHH + 1 anti-albumin VHH | Japan approval, RA (Taisho; Adis "First Approval", Drugs 2022, doi:10.1007/s40265-022-01821-0, snippet). Q4W dosing via albumin binder. A later 30 mg autoinjector approval (~Aug 2023) is a device expansion. |
| Pipeline | gefurulimab (myasthenia gravis, bispecific VHH) | C5 + HSA (target detail unverified) | - | called the most advanced Nb drug in clinic by one review (ScienceDirect S1359644625002375, snippet) |

### HER2 nanobody trials (ClinicalTrials.gov API, opened directly)
NCT03331601 is verified: "Evaluation of 68GaNOTA-Anti-HER2 VHH1 Uptake in Brain Metastasis of Cancer Patients", start 2017-10-16, TERMINATED. The earlier phase I (n=20, J Nucl Med 2016) and the repeatability phase II (EudraCT 2016-002164-13) are the same tracer family (2Rs15d lineage; no NCT number in my sources). Other HER2 sdAb trials from `HER2 AND (nanobody OR VHH OR sdAb OR "single domain")`: NCT04040686 (99mTc-NM-02, 2019-07-29, completed), NCT04591652 (99mTc-MIRC208, 2020-09), NCT04674722 (99mTc/188Re sdAb, 2020-08-24, completed), NCT06369831 (68Ga-ABS011, 2024-09-12), NCT06824155 (HEAT, 177Lu, 2025-02-12), NCT07593976 (68Ga-NOTA-anti-HER2-sdAb for pCR, start 2026-07-15). NCT04034823 (KN035 + trastuzumab + docetaxel) pairs a PD-L1 VHH-Fc with a HER2 IgG; it is not an anti-HER2 nanobody. **No anti-HER2 nanobody therapeutic (non-imaging) is approved**; HER2 VHH clinical work is imaging and radiotheranostics.

## 2. Which engineering steps changed paratope-epitope assumptions
Muyldermans, Annu Rev Biochem 82:775-797 (2013), doi:10.1146/annurev-biochem-063011-092449 (abstract opened via Europe PMC; full text not opened): VHHs are small, high-affinity, stable; crystal structures underpin their engineering. Recent review opened: Li et al., Cell Commun Signal 23:271 (2025), doi:10.1186/s12964-025-02270-4.
- **Humanisation** (VHH 75-90% identical to human VH3 per Li 2025): touches framework, so framework residues that contact antigen (see gotchas) can be disturbed. Caplacizumab and the BCMA CAR-T VHH are humanised.
- **Albumin binder** (ozoralizumab; Harpoon TriTAC ~53 kDa): adds a second paratope to the molecule but leaves the target paratope untouched; changes pharmacokinetics, not epitope rules.
- **Biparatopic/trivalent/CAR-T**: avidity can rescue weak monovalent epitopes (cilta-cel is biepitopic). Consequence: affinity or "binder" calls from multivalent formats are not monovalent paratope quality.
- **Mechanism assumptions**: caplacizumab was framed as blocking the GPIb site; the 1.60 A structure (7EOW) shows it binds the underside of A1 with no steric clash with GPIb, acting by conformational arrest (Lee et al., BBRC 567:49, 2021, doi:10.1016/j.bbrc.2021.06.030, abstract opened on RCSB).

## 3. Epitope information in therapeutic design
- **Biparatopic pairing**: Ablynx patents (US 8975382, US 9969805) fuse the trastuzumab-competitive nanobodies 2D3/5F7 to the Omnitarg (pertuzumab)-competitive 47D5 via a 35GS linker (search snippet). I found **no structure of 5F7 or of the 5F7/47D5 pair**; the brief spells "47D4", sources say 47D5.
- **2025 open paper**: A9F5-H2F5-Fc ("AH") pairs a domain I binder with a domain II binder (Liu et al., Front Immunol 16:1711448, doi:10.3389/fimmu.2025.1711448). AH internalisation >75% in NCI-N87 vs <30% for trastuzumab, pertuzumab or the combination; modelled inter-epitope distance ~36.1 A vs linker ~57 A. Epitopes there come from ELISA with murine-domain-swap chimeras plus AlphaFold 3, not from structures.
- **Structures that matter**: 5MY6 (2Rs15d, domain I, basis of the radiotheranostic), 9MTE/9MTX (TPP-45142 T-cell engager, De Tavernier et al., Mol Cancer Ther 25:541, 2026, doi:10.1158/1535-7163.MCT-25-0654; "HER2-low" selectivity via an epitope distinct from trastuzumab/pertuzumab), 6OGE and 8PWH (trastuzumab+pertuzumab ternary references).
- Binning/competition data (Biacore) sit in patents and were not extractable here.

## 4. HER2 biology and contrast epitopes
HER2 ectodomain: four domains (I and III are L domains; II and IV cysteine-rich); no ligand; an extended conformation with the domain II dimerisation arm; heterodimers with EGFR/HER3/HER4 are structurally characterised (7MN5 HER2/HER3/NRG1b; 8HGO EGFR/HER2; 8U4L HER2/HER4). Shedding of the ECD (p95 remnant) is the textbook rationale for domain I-III binders; not independently sourced here. Domain boundaries in mature numbering from memory and approximate (unverified): I 1-195, II 196-319, III 320-488, IV 489-607. **UniProt P04626 = mature + 22** (verified by sequence alignment for 1N8Z and 1S78; 5MY6, 7QVK, 9MTE, 9MTX already use UniProt numbering).

Epitopes computed by me from deposited coordinates (RCSB mmCIF, gemmi, heavy-atom contacts <= 4.5 A, asymmetric unit only, waters/glycans excluded):

| Antibody/VHH | PDB | HER2 epitope, UniProt numbering | Domain |
|---|---|---|---|
| Trastuzumab Fab (4D5) | 1N8Z (2.52 A) | 579, 580, 582, 583, 591-595, 601, 613, 615, 618, 620, 622, 624-627 (mature 557-605) | IV |
| Pertuzumab Fab | 1S78 (3.25 A) | 150, 178, 258, 267-270, 274, 276-279, 290, 307-319, 333-337 (mature 128, 156, 236-257, 268, 285-297, 311-315) | II core, small I/III edge |
| 2Rs15d VHH | 5MY6 (2.25 A) | 109-112, 156-157, 170, 173-175, 177-183, 217 | I |
| NM-02 VHH | 7QVK (3.1 A) | 168, 170, 175, 200-201, 203, 213-233 | I/II junction |
| 27A05 VHH | 9MTE (2.66 A) | 35-40, 66-67, 90, 378, 382, 413-417, 446-449, 469-473, 497-500 | I + III |
| 47D05 VHH | 9MTE | 105, 107, 110-111, 149-150, 174-180, 256-257 | I (+ start of II) |
| 29E09 VHH | 9MTX (3.06 A) | 35-40, 66-67, 90, 378, 382, 413-417, 446-447, 470-473, 497-498 | I + III |

The 1S78 residue set merges the Fab copies in the asymmetric unit. In 9MTE, entity 1 = 27A05 (146 aa), entity 2 = 47D05 (128 aa), as on the RCSB page. Entry 6LBX (HER2 domain IV + "Rb-H2") is a **repebody, not a nanobody** (RCSB entity description).

## 5. Anti-HER2 nanobody table (queen extra)
| Nanobody | PDB | Epitope domain | Affinity | Source | Status |
|---|---|---|---|---|---|
| 2Rs15d | 5MY6 | I | Kd 4.74 +/- 0.39 nM (131I-labelled, cells) | D'Huyvetter 2017, Clin Cancer Res 23:6616, doi:10.1158/1078-0432.CCR-17-0310 | verified |
| NM-02 | 7QVK | I/II junction | unverified | PLoS One doi:10.1371/journal.pone.0288259 (citation from RCSB) | structure verified; Kd not opened |
| 27A05 | 9MTE | I + III | unverified | De Tavernier 2026 | structure verified |
| 47D05 | 9MTE | I (+ II start) | unverified | same | structure verified; identity with patent "47D5" unverified |
| 29E09 | 9MTX | I + III | unverified | same | structure verified |
| A9B5 | none | I | 7.8 nM | Liu 2025 | from article text |
| A9F5 | none | I (ELISA); II added by AF3 only | 19.4 nM | Liu 2025 | discordant evidence |
| H2F5 | none | II | not reported | Liu 2025 | - |
| 5F7, 2D3 | none | trastuzumab-competitive (IV region) | unverified | US 8975382 / 9969805 | no structure found |
| 47D5 | none | pertuzumab-competitive (II) | unverified | same | no structure found |
| A10 | none | two paratopes (second on opposite face) | unverified | NMR/cross-link/docking study 2021 (snippet) | modelled only |
| G1E4 | none | unverified | unverified | Liu 2025 | compared construct only |

All four VHH structures here make contact in domain I; domain I is the VHH-dominant HER2 region in public data.

## 6. Growth numbers (plottable)
SAbDab-nano: 1,585 structures (page updated 2024-04-18) and 1,972 (2025-07-10), from search snippets, about 300 per year; not a per-year breakdown. The per-year series below is a **proxy I generated**: RCSB full-text hits for nanobody OR VHH OR sybody by deposition year (includes entries that merely mention these words; 2025 depressed by release lag; 2026 partial). Trials: ClinicalTrials.gov start-date counts for nanobody/VHH/sdAb synonyms (97 total, API opened directly). Company counts: **not sourced**.

| Year | PDB proxy | Trials started |
|---|---|---|
| 2012 | 19 | 1 |
| 2013 | 33 | 0 |
| 2014 | 22 | 1 |
| 2015 | 46 | 0 |
| 2016 | 63 | 0 |
| 2017 | 62 | 1 |
| 2018 | 85 | 4 |
| 2019 | 108 | 5 |
| 2020 | 158 | 9 |
| 2021 | 250 | 3 |
| 2022 | 300 | 12 |
| 2023 | 243 | 10 |
| 2024 | 318 | 15 |
| 2025 | 227 | 17 |
| 2026 (partial) | 33 | 14 |

The full 2007-2026 series is in the `.json` beside this file.

## 7. Lessons from repertoire-to-structure efforts
AVIDa-hIL6: 573,891 antigen-VHH pairs, 20,980 binders (3.7%, heavily imbalanced). AVIDa-SARS-CoV-2 (arXiv 2405.18749): 77,003 samples (22,002 binding), two alpacas, labels from pre/post-selection read counts, and 427 VHHs are binders for one antigen and non-binders for others (snippets). CoV-AbDab had 12,021 entries in 2023 with variant names but not exact sequences (as cited in the AVIDa-hIL6 paper). For one-round panning: labels reflect enrichment, not affinity; per-antigen label flips mean label noise is structural; clone-level epitope truth has to come from structures, not labels.

## 8. Forced analogy: art conservation (history of restoration)
**Analogy**: a restorer who over-cleans removes original surface; a modeller who over-trusts a label, a model or a similarity transfer paints an epitope that was never there. Each overturned claim is overpaint to strip.

**Cases (all with limits)**
1. *Caplacizumab "blocks GPIb"* (mechanism inferred from target biology) vs 7EOW (no clash; conformational arrest). Source opened: RCSB 7EOW page. Caveat: I did not open an earlier text asserting direct competition. Failure mode: functional assay read as geometric overlap.
2. *A9F5 domain assignment*: ELISA says mainly ECD I, AlphaFold 3 adds five ECD I and three ECD II hydrogen bonds; the authors say modelling and ELISA disagree and ask for cryo-EM (Liu 2025). Unresolved: modelled contact beyond measured contact.
3. *47D5 "pertuzumab-competitive"* (patent, domain II) vs my contact calculation for 47D05 in 9MTE (mostly domain I, residues 256-257 only at the II edge). Possible partial overturning, but the patent clone 47D5 and entity 47D05 are not proven identical, and competition is not the same as binding the same residues. Flagged, not established.
4. *AF2-Multimer/AF3 on nanobodies*: overall success below 50%, collapsing with CDR3 conformation, example DockQ 0.005 for 8EMZ (Eshak and Goupil-Lamy, J Chem Inf Model 2025, doi:10.1021/acs.jcim.6c01301 as listed; bioRxiv 10.1101/2024.10.07.616899; figures from search snippets, full text not opened because of rate limiting).
5. *Binder labels*: 427 VHHs both binder and non-binder across antigens (AVIDa-SARS-CoV-2).

**Verdict**: partially holds. I did **not** find a nanobody case where a published epitope was formally retracted or overturned by a structure. Cases 1-3 are mechanism or modelled-vs-measured discord; 4-5 are failure rates and label noise. Stated openly rather than inflated. Failure modes extracted: label confounds (5), modelled contacts beyond measured (2), mechanism read from geometry (1), framework and CDR3 conformation errors (4).

## Gotchas / what could fool us
1. **Numbering**: PDB 1N8Z/1S78 use mature numbering (+22 to UniProt); 5MY6/7QVK/9MTE/9MTX use UniProt numbering. The challenge uses UniProt incl. signal peptide. Mixing shifts epitopes by 22 residues.
2. 1S78 holds two HER2/Fab copies plus a second Fab arrangement; unioned residues overstate the pertuzumab epitope.
3. Trastuzumab and pertuzumab are Fab contrasts; Fab epitopes are larger than VHH epitopes (VHHs favour concave or domain-edge sites with CDR3 plus framework contact).
4. Enrichment "binder" = proportion rose in one panning round (p <= 0.05); avidity, expression bias and phage growth bias confound it.
5. Full-text PDB counts are inflated by keyword mentions; SAbDab-nano is the proper series but only two snapshots were obtained.
6. ClinicalTrials.gov free-text under-counts (97 total; many agents appear under INNs); HER2 imaging trials are not therapies.
7. 9MTE/9MTX were deposited January 2025 and released 2025-11-19; any model trained on a later PDB snapshot may have seen them. Check each tool's training cutoff before treating them as clean validation.
8. Several figures here (approval days, SAbDab counts, benchmark rates) come from search snippets and were not confirmed on primary pages.

## Implications for the challenge
1. Use 5MY6, 7QVK, 9MTE and 9MTX as the only public HER2-VHH ground truth: a HER2 position prior (domain I strongly; I/III interface 378-500; I/II junction 168-233), with low weight because ONU clones may differ.
2. Down-weight trastuzumab (579-627) and pertuzumab (258-337) sites: no public VHH occupies domain IV. Keep the UniProt-with-signal-peptide numbering of the challenge.
3. Build antigen priors from VHH contacts after removing crystal-lattice contacts (image-index filter, as done above).
4. Treat the paratope as CDR3 plus CDR1/2 and selected framework residues; public VHH contacts are CDR3-dominated.
5. Do not rely on AF3/OpenFold3 interface confidence alone (reported nanobody success under 50%); use multiple seeds and per-residue consensus frequency as the probability.
6. Treat enrichment labels as weak supervision and keep structure-derived pairs separate.

## Open questions
- Is 47D05 (9MTE) the patent clone 47D5? Compare sequences.
- Per-year SAbDab-nano counts need its CSV export (not done).
- Kd values for NM-02, 27A05, 47D05, 29E09.
- Number of nanobody companies: no source found.
- A real overturned nanobody epitope claim needs a targeted search (a docking or HDX prediction followed by a structure for the same clone).

## Sources (opened unless marked snippet)
- Europe PMC record for doi:10.1146/annurev-biochem-063011-092449 (Muyldermans 2013; abstract only)
- RCSB pages 1N8Z, 5MY6, 9MTE, 7EOW; RCSB Search/GraphQL; mmCIF files 1N8Z, 1S78, 5MY6, 7QVK, 9MTE, 9MTX, 6LBX; UniProt P04626 FASTA
- https://clinicaltrials.gov/api/v2/studies (HER2/nanobody queries; NCT03331601)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12142954/ (Li 2025)
- https://www.frontiersin.org/journals/immunology/articles/10.3389/fimmu.2025.1711448/full (Liu 2025)
- Snippet only: TRACON/BioSpace and 1stOncology (envafolimab); J&J/Legend/BioSpace (cilta-cel); Adis/Springer, Wikipedia (ozoralizumab); HemOnc, newdrugapprovals.org, journalforclinicalstudies.com (caplacizumab); SAbDab-nano stats page; arXiv 2405.18749 and 2306.03329; bioRxiv 2024.10.07.616899; patents US 8975382 and 9969805; J Nucl Med 2016 and 65(2):178 (HER2 sdAb PET).
