---
title: Paratope prediction for VHH - methods, prevalence-aware metrics, trivial baselines, install recipes
queen: q5_structure_prediction_docking
king: king_infer
worker: paratope_prediction_methods_for_nanobodies_and_cdr_only_focus
tier: expert
tags: [paratope, VHH, nanobody, Parapred, Paragraph, NanoBERTa-ASP, ParaAntiProt, ImmuneBuilder, IgFold, ANARCI, ANARCII, AF3, Boltz, baseline]
confidence: medium
challenge_relevance: 4
serendipity: Known-plaintext attack - treat the VHH framework as the known cipher header and CDR3 as unknown payload; paid off as a concrete "prior + residual" scoring design and a bound on what the header alone can score, but the true bound could not be measured because SAbDab-nano residue statistics were not retrieved.
date: 2026-10-17
---

## TL;DR
For a VHH, the paratope is mostly CDR residues, so a "CDR1/2/3 plus flanks" prior already carries most of the achievable residue-level signal; published sequence/structure predictors reach nanobody PR-AUC of roughly 0.6-0.7 in their own test sets (prevalence unreported in most), which is not directly comparable across papers. No paper found benchmarks co-folded-complex paratopes against Paragraph/Parapred for nanobodies head to head. Recommended 2-method stack: NanoBodyBuilder2 (structure + CDR boundaries via ANARCI/ANARCII) feeding a CDR/flank/structure prior, blended with a nanobody-trained sequence model (NanoBERTa-ASP, if weights obtainable) and, optionally, contact-derived paratope from AF3/Boltz co-folds. Many numbers below are not verified; those are flagged.

Verification status: I opened the pages listed in Sources. Several (Nature, Springer, tandfonline, bioRxiv PDFs) returned redirects, 403 or 429, so figures from them come from web-search summaries and are marked "(search summary)". Treat those as medium/low confidence.

## 1. Method table (question 1)

Prevalence note: across antibodies, ParaDeep reports about 10.4% binding residues (AACDB v1.0, 2,807 complexes, 4.5-A-style contact definitions vary by paper). NanoBERTa-ASP labels a residue as paratope if an antigen atom is within 4.5 A. Prevalence on nanobody-only test sets was NOT reported in anything I could open. PR-AUC values are therefore not comparable across rows.

| Method | Input | Nanobody-evaluated? | Reported metrics (as found) | Prevalence-aware? | Weights / install | Status |
|---|---|---|---|---|---|---|
| Parapred (Liberis 2018, Bioinformatics 34:2944) | Sequence, CDR + flanks (CNN/LSTM) | Trained on Fv antibodies; no nanobody claim found. github.com/oxpig/Parapred README fetch returned 404 (not verified) | In ParaDeep Table (H chain blind test, 222 complexes): ROC-AUC 0.861, PR-AUC 0.516, MCC 0.410. Third-party aggregator: AUC-PR 0.652/0.646 on other sets (dataset unclear) | No | Python 3 repo, old Keras; unverified | Dated; CDR-window-only by design |
| Paragraph (Chinery, Moal, Wahome, Deane, Bioinformatics 2023) | 3D structure (IMGT-numbered PDB) -> equivariant GNN | Not mentioned in README; README has heavy-only weights (`--heavy`) | Search aggregator: AUC-PR 0.696 / AUC-ROC 0.934 on PECAN benchmark; 0.725 on another set (third-party, verify) | No | `pip install .` from github.com/oxpig/Paragraph, Python 3.8.3, PDB must be IMGT numbered; <0.1 s/structure, ~10 min per 10,000 | Usable on NanoBodyBuilder2 models after IMGT renumbering |
| PECAN | Structure of Ab and Ag (needs antigen) | Not applicable without antigen | Quoted only via Paragraph comparison | n/a | n/a | Needs antigen structure (could use co-fold) |
| NanoBERTa-ASP (BMC Bioinf 2024, doi 10.1186/s12859-024-05750-5) | Sequence, RoBERTa pretrained on nanobody sequences | Yes, nanobody-specific | Nanobody-only ten-fold CV: AUC 0.947, precision 0.766; with heavy chains added: AUC 0.952, precision 0.778. PR-AUC, MCC, F1 only in figures (not numerically extracted) | No | 1,070 labelled nanobodies from 7,255 SAbDab PDBs (+4,400 heavy chains); 4.5 A labels; "scripts and datasets on GitHub"; weights availability unverified | Full-sequence eval gave higher ROC but lower PR-AUC than CDR-only (class imbalance) |
| ParaAntiProt (Sci Rep 2024, doi 10.1038/s41598-024-80940-y) | Sequence, AntiBERTy + ProtTrans embeddings | Yes | Nanobody set ROC-AUC 0.912, PR-AUC 0.665 (search summary; page itself not opened) | Not stated | Not verified | Best-quoted nanobody PR-AUC |
| ParaDeep (Front Bioinf 2025, doi 10.3389/fbinf.2025.1684042) | Sequence, BiLSTM-CNN | NO (limitations: nanobodies untested) | H: ROC 0.959, PR-AUC 0.805, MCC 0.685 (n=222 blind test, ~10.4% prevalence). Parapred H: PR-AUC 0.516 | Prevalence 10.4% stated | github.com/PiyachatU/ParaDeep, Colab | Not validated on VHH |
| Paraplume (Athenes, Woolfe, Mora, Walczak, arXiv 2510.05626) | Sequence, PLM embeddings | Unknown (PDF unreadable) | Not extracted | - | - | Claims repertoire-scale use; read the PDF before relying |
| ParaSurf | Structure/surface | Unverified | Not retrieved | - | - | Not opened |
| AntiBERTy / ablang / nanoBERT heads | Sequence embeddings | NbBench (Zhang and Tsuda, arXiv 2505.02022) evaluates 11 models over 8 nanobody tasks; abstract says antibody LMs excel at antigen-related tasks | Per-model paratope numbers not extracted (PDF tables unreadable) | - | github.com/ZHymLumine/NbBench | Check task list for paratope AUPRC |
| NanoBodyBuilder2 (ImmuneBuilder) | Sequence -> structure | n/a (structure) | CDR-H3 RMSD 2.89 A, "0.55 A improvement over AlphaFold2" (README) | n/a | `pip install ImmuneBuilder`; needs PyTorch, OpenMM, pdbfixer, ANARCI; license not stated in README | Good as CDR geometry provider |
| IgFold | Sequence -> structure | Yes (single chain via `-H`) | Not extracted | n/a | `pip install igfold` (Python >=3.11, torch>=2) or pixi env; 4 models, 25 MB in package; AntiBERTy ~100 MB from Hugging Face; backbone only "a few seconds on CPU"; JHU non-commercial licence | CPU-feasible |
| tFold | Structure | not opened | - | - | - | Unverified |

Key negative finding: no source I could open reports per-residue PR-AUC, ROC-AUC and MCC together with prevalence on a common nanobody test set for Parapred vs Paragraph vs LM heads. A fair comparison would have to be rerun by us.

## 2. Paratope prevalence and location (question 2)

Not retrieved: SAbDab-nano residue-level statistics (Voronota-area fraction by CDR1/2/3, FR2 37/44/45/47, FR3 ~94). I did not open the SAbDab-nano paper or run structures; any numbers below are my estimates, not data.

What was verified: all-antibody prevalence about 10.4% (ParaDeep, AACDB). The AF3 nanobody study (bioRxiv 2024.10.07.616899) gives CDR3 length 3-24 residues (Chothia numbering) over 70 complexes, with CDR3 the dominant driver of epitope success, 45 kinked vs 25 stretched CDR3s.

Qualitative expectation (unverified, from general VHH biology): CDR3 contributes the largest share of contacts; CDR1 and CDR2 smaller; FR2 hallmark residues (positions 37/44/45/47 IMGT-like) sometimes contact because VHH lacks VL, and FR3 near the CDR3 base can contribute.

Trivial baseline estimate (back-of-envelope, labelled as such). Let prevalence p = 0.12-0.20 for a ~120-aa VHH (about 14-24 contact residues). A "CDR3 + 2-residue flanks + CDR1/2 low prior" score: suppose the high tier covers about 25% of residues and holds about 65% of contacts. Precision in that tier = 0.65*p/0.25 = 0.31-0.52; with a soft ranking inside tiers (CDR3 centre above CDR1/2 above frameworks) PR-AUC plausibly lands near 0.35-0.5 versus a random PR-AUC of p (0.12-0.20). This is consistent with published sequence models reaching 0.6-0.7 on nanobodies (ParaAntiProt 0.665), but those sets have unknown prevalence. Settle with: compute SAbDab-nano contacts with Voronota-LT and score this prior with leave-family-out PR-AUC.

Caveat for this challenge: antibody-side ground truth is Voronota-LT area-defined contacts with HER2, and metric is macro over only 3 complexes, so variance is huge; one wrong CDR3 call can swing a complex.

## 3. Numbering VHH sequentially, mapping CDRs (question 3)

The challenge uses sequential numbering of the printed sequences (ONU11 120 aa, ONU13 120 aa, ONU23 130 aa; per BRIEF). Strategy: number each sequence with an IMGT scheme tool, record the IMGT-to-sequential index map (tools return per-residue (position, aa) lists, so the sequential index is just the enumeration index skipping gaps), then write predictions in `seqNum`.

| Tool | Install | Notes |
|---|---|---|
| ANARCI | `conda install -c bioconda anarci` (third-party) or from GitHub; needs HMMER | Standard; ImmuneBuilder depends on it |
| AbNumber | `conda install -c bioconda abnumber` (README) | Wraps ANARCI; README says Windows NOT supported (HMMER); README does not list VHH support or CDR definitions (see abnumber.readthedocs.io, not opened) |
| ANARCII (Oxford, bioRxiv 10.1101/2025.04.16.648720; Commun Biol 2026 doi 10.1038/s42003-026-10186-z per Oxford listing) | `pip install anarcii` (PyPI) | Language-model numbering, alignment-free, no HMMER; claims >99.99% identical on conserved residues, >99.94% on complete CDRs; web app on opig.stats.ox.ac.uk. Works on Windows in principle (unverified) |
| IMGT/DomainGapAlign | web | Not opened |

Practical: with only 3 sequences, run the OPIG ANARCII web app or ANARCII on the local box; no Linux needed. IMGT CDR boundaries: CDR1 27-38, CDR2 56-65, CDR3 105-117 (standard IMGT definition; not re-verified in this session). Note VHH CDR2/CDR3 length variation yields insertion codes (111A... 112A...), so the sequential map must be explicit.

## 4. Co-folded paratope vs sequence-only predictors (question 4)

No head-to-head found. Evidence gathered:
- AF3 on 70 nanobody-antigen complexes (bioRxiv 2024.10.07.616899v2): DockQ any-correct 47.1% (high 21.4%) vs AF2-M v2.3.2 32.8% (high 11.4%); median CDR RMSD AF3 CDR1 1.044, CDR2 0.735, CDR3 1.34 A. Stretched CDR3 largely right (>80% correct per Results, >88% in Discussion - internal inconsistency); kinked >70% fail; incorrect predictions median CDR3 length 17.
- mAbs 2025 (doi 10.1080/19420862.2025.2545601; page 403, search summary): nanobody N=60: AF3 high-accuracy 13.3%, overall 31.6%; Boltz-1 and Chai-1 overall 20.4% each (text elsewhere says Boltz-1 23.3%, high 5.0%; Chai-1 high 0%). Internal inconsistency flagged.
- FoldBench (Nat Commun 2025, doi 10.1038/s41467-025-67127-3; search summary): nanobody-antigen subset n=46, AF3 overall 53.3%, high 33.3%; AF3, Boltz-1 and Protenix clearly above others; Chai-1 not top.
- bioRxiv 2026.03.02.709004 (search summary): AF3, Boltz-2 and Chai-1 do not robustly separate real from shuffled nanobody-antigen pairs; ipTM is overconfident on failures.
- Boltz-2, OpenFold3, Protenix nanobody success rates: not found in opened sources (unverified).

Implication: a co-fold is a paratope predictor only when the docking is right (about 30-50% of cases) but even a wrong pose usually keeps the CDR loops as the interface, because the nanobody CDR loops are what the model puts at the interface. So a co-fold paratope map, averaged over many seeds/models, should rank CDR residues similarly to a CDR prior and add weight when poses agree. Whether it beats Paragraph on NanoBodyBuilder2 models is untested; run both on ~30 SAbDab-nano holdouts.

## 5. Compute cost and install (question 5)

Three sequences, each under 1 GPU-hour for all of:
| Method | Install | Weights public | Cost for 3 seqs |
|---|---|---|---|
| NanoBodyBuilder2 | `pip install ImmuneBuilder` + openmm/pdbfixer/ANARCI | yes (in package; verify) | seconds-minutes, CPU ok |
| IgFold | `pip install igfold` | yes | seconds on CPU |
| Paragraph | clone + `pip install .` (py3.8.3) | yes | <1 s |
| NanoBERTa-ASP | repo; unverified | unverified | seconds if weights exist |
| ParaAntiProt, Paraplume | not verified | unverified | - |
| AF3 / Boltz-2 / Chai-1 / Protenix / OpenFold3 | repos not opened here | AF3 weights need request; others public (unverified) | HER2 ECD (~600 aa) + VHH: minutes to tens of minutes per sample on one GPU; 3 complexes x 25 seeds is plausibly a few GPU-hours (estimate) |

Exact repo versions for the co-fold models were NOT collected (outside the opened sources); q5 siblings should fill these. Explorer rule: public `gpu`/`short` partitions only, max 2 GPUs.

## 6. NGS enrichment / CDR3 convergence literature (question 6)

No paper found that applies convergent-CDR3 or AIRR-ML to nanobody paratope residues. Closest two, both opened only via search summaries:
1. Machine learning-guided prediction of antigen-reactive in silico clonotypes from bio-panning clonal abundance changes (scFv, random forest on pre/post panning NGS; ResearchGate record of a 2020 paper; authors/DOI not verified).
2. Phage display profiling of CDR3beta loops enabling ML prediction of TCR-epitope specificity (bioRxiv 10.1101/2024.06.27.600973; PMC12225687) - TCR, not VHH, but the same pre/post-selection logic.
Also relevant: the AF3 nanobody paper shows the epitope is hard when CDR3 is long, which is exactly where sequence families would help.
Honest answer: signal from enrichment on CDR3 is for binder-versus-non-binder, not residue contact; mapping it to paratope residues is untested.

## Forced analogy: known-plaintext attack
(a) Precisely: the VHH framework (about 85% of residues, highly conserved, structurally "known") is the known header; CDR3 (and partly CDR1/2) is the unknown payload. The attacker wants key bitting positions (paratope). A known-plaintext attack exploits the fixed header to recover the key stream. Equivalent: use the conserved framework alignment to fix which positions can bind (CDRs, FR2 hallmark, FR3 base), and spend all model capacity on within-CDR ranking.
(b) Testable ideas: (i) Score = prior(position class) x residue-level model; fit the prior from SAbDab-nano with Voronota areas, then check how much PR-AUC a header-only prior achieves (the "known-plaintext only" score) using leave-family-out CV; any model must beat it. (ii) Residual attack: train sequence/structure model on the residual after dividing by the prior, so the NGS enrichment signal is used only to reorder inside CDR3. (iii) Reuse across the three complexes: ONU11/13/23 share the same framework family, so a header prior transfers; unknown payloads differ, so hedge CDR3 centre residues.
(c) Verdict: partially holds. It holds because VHH frameworks are conserved and contacts concentrate in CDRs. It breaks because the paratope is not a deterministic function of the payload (the key bitting depends on the antigen "lock"), CDR3 conformations (kinked vs stretched) can swing contacts, and FR2 hallmark residues contacts vary by clone.

## Gotchas / what could fool us
1. Prevalence mismatch: PR-AUC values from papers (0.5-0.8) are on different prevalences (all-antibody 10.4% in ParaDeep) and labels (4.5 A atom cutoff vs Voronota areas); do not compare.
2. Full-sequence vs CDR-only scoring: NanoBERTa-ASP notes ROC rises and PR-AUC falls on full sequences; CDR-only evaluation inflates precision. The challenge scores full-length VHH residues.
3. Leakage: SAbDab-based predictors are trained on PDB entries that may include near-identical HER2 VHHs; challenge rules permit this, but benchmarks do not.
4. ParaDeep claims "27% MCC improvement" over Parapred, while its Table gives roughly 67% (0.685 vs 0.410): abstract/table mismatch.
5. mAbs 2025 text gives two different Boltz-1 nanobody success rates; AF3 nanobody paper gives >80% vs >88% for stretched CDR3: use ranges.
6. MCC/F1 depend on the 0.5 threshold; PR-AUC does not; Track A uses PR-AUC.
7. Only 3 complexes: macro-PR-AUC has enormous variance; area-weighted variant favors large contacts (CDR3 centre).
8. AbNumber does not run on Windows; numbering inconsistencies in CDR insertion codes can shift the sequential mapping by 1-2 positions, silently misaligning predictions.
9. Parapred/Paragraph are trained mostly on VH/VL Fvs; VHH CDR3 are longer and FR2 hallmark contacts are not represented.
10. Third-party aggregator numbers (hyper.ai) are not primary; I used them only as flagged.

## Implications for the challenge
1. Build the header-only prior first (Voronota-LT on SAbDab-nano), report its leave-family-out PR-AUC as the floor.
2. Stack: (A) NanoBodyBuilder2 -> Paragraph (structure paratope) with IMGT renumbering via ANARCII; (B) nanobody sequence model (NanoBERTa-ASP if weights are available, else retrain a small head on AntiBERTy/IgFold embeddings with SAbDab-nano labels); rank-average with the prior.
3. Add co-fold contact maps (AF3/Boltz-2/OpenFold3, many seeds) as a third, down-weighted feature only if its agreement with the prior is high.
4. Number the three VHHs with ANARCII (pip, Windows-safe) and write an explicit IMGT-to-sequential map; unit test the map on both CDR3 insertion cases.
5. Hedge CDR3 flanks: because macro PR-AUC with three targets is noisy, give a nonzero floor to all CDR residues and FR2 hallmark/FR3 base.
6. Use public partitions only on Explorer; the structure models need CPU/minutes.

## Open questions
- SAbDab-nano residue-level Voronota prevalence by region (the actual trivial-baseline PR-AUC).
- Numeric PR-AUC of NanoBERTa-ASP, Paragraph and NbBench heads on one common nanobody set with prevalence.
- Boltz-2, OpenFold3, Protenix and Chai-1 nanobody success rates and exact repo versions.
- Whether NanoBERTa-ASP, ParaAntiProt and Paraplume weights are public.
- Whether enrichment/CDR3 families can inform residue-level contacts at all.

## Sources
- https://raw.githubusercontent.com/oxpig/ImmuneBuilder/main/README.md
- https://raw.githubusercontent.com/Graylab/IgFold/main/README.md
- https://raw.githubusercontent.com/prihoda/AbNumber/master/README.md
- https://raw.githubusercontent.com/oxpig/Paragraph/main/README.md
- https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2025.1684042/full (ParaDeep)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10956323/ (NanoBERTa-ASP)
- https://www.biorxiv.org/content/10.1101/2024.10.07.616899v2.full (AF3 nanobody epitope)
- https://arxiv.org/abs/2505.02022 (NbBench, abstract only)
- Search summaries only (page not opened): Paragraph bioRxiv 10.1101/2022.06.10.495640; ParaAntiProt https://www.nature.com/articles/s41598-024-80940-y; mAbs 10.1080/19420862.2025.2545601; FoldBench 10.1038/s41467-025-67127-3; bioRxiv 10.64898/2026.03.02.709004; ANARCII https://pypi.org/project/anarcii/; Paraplume arXiv 2510.05626; TCR phage display bioRxiv 10.1101/2024.06.27.600973
