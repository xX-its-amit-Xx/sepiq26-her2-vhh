---
title: Protein and antibody language models (ESM, AbLang, nanoBERT, IgLM, IgBert) as interface priors
queen: q6_epitope_ml_methods
king: king_infer
worker: protein_and_antibody_language_models_esm_ablang_nanobert_iglm_embeddings_for_interfaces
tier: expert
tags: [PLM, ESM-2, AbLang2, nanoBERT, IgLM, IgBert, paratope, epitope, licences, AVIDa, leakage]
confidence: medium
challenge_relevance: 3
serendipity: CASP13-to-14 "representation versus architecture" - tested whether PLM embeddings are the free MSA of the epitope problem; verdict is that they are an MSA for the VHH (paratope) side only and nothing for the HER2 epitope side.
date: 2026-10-17
---

## TL;DR
Frozen PLM embeddings give a solid, cheap paratope prior (published nanobody/antibody paratope PR-AUC about 0.69-0.77 at roughly 10-25 % prevalence), but nothing I could find shows they give an epitope prior: on antibody-specific epitope benchmarks the best PLM-based model is barely above chance on unseen epitope groups (AsEP: AUROC 0.544, MCC 0.077). For HER2 the useful PLM probe is the paratope side (ESM-2 650M, AbLang-2 or IgBert/ProtT5 residue embeddings); the epitope side must come from structure (HER2 is in the PDB with many Fab/VHH complexes) or from co-folding.

Evidence limits: several pages were summarised by a fetch tool, not read in full. Nothing about AVIDa-hHER2 (the Tsuruta 2024 NeurIPS D&B paper named in the brief) could be found, so Q5 is answered only by analogy to sibling datasets. Numbers marked "unverified" must not be quoted.

## 1. Model table (Q1)

| Model | Size | Training data | Licence (as verified) | Usable in a competition entry? |
|---|---|---|---|---|
| ESM-2 (Lin 2023) | 8M, 35M, 150M, 650M (33 layers, d=1280), 3B, 15B | UniRef50 (UR50/D 2021_04), no antibody-specific data | Repo code MIT; the README I read states no separate weight licence | Yes (public, MIT). Low legal risk |
| ESMFold v1 | 690M (48 layers, +36 trunk) | PDB + UR50 | same repo (MIT) | Yes |
| ESM C 300M | about 300M (name-implied) | EvolutionaryScale, details unverified | Cambrian Open License (permits use/modify/redistribute but requires "Built with ESM" notices, derivative titles starting with "ESM", AUP-bound) | Probably yes, with attribution duties; read the licence before shipping |
| ESM C 600M, ESM3 | 600M / larger | EvolutionaryScale | Separate **Cambrian Non-Commercial** licence (per Cambrian Open License section 5) | Academic competition: arguably, but prize money and consortium authorship make "non-commercial" ambiguous. Avoid unless the organisers say OK |
| ProtT5 (ProtTrans) | about 3B (T5-XL); not verified in this session | UniRef50/BFD, not opened | not verified in this session | Likely permissive; verify |
| AbLang-2 (Olsen, Moal, Deane 2024) | parameter count not found (unverified) | Unpaired + paired OAS, designed to reduce germline bias; counts not retrieved | Repo LICENSE = BSD-3-Clause (read). `pip install ablang2` | Yes. Caveat: takes paired VH|VL input; nanobody (VH only) handling is via a masked/empty light chain, not verified |
| AbLang (v1) heavy/light | 86M each (NbBench table) | OAS | not checked | Likely yes |
| nanoBERT (Hadsund 2024, doi 10.1093/bioadv/vbae033) | small 14M (d=320), big 86M (d=768) (NbBench lists 15M) | 10M nanobody sequences from INDI | not checked | Probably; verify |
| IgLM (Shuai 2023, Cell Systems) | not retrieved (unverified) | 558M OAS heavy/light chains, chain + species tags, infilling objective | **JHU Academic Software License: non-commercial; commercial needs JHU Tech Ventures** | Risky for prize-winning entry; use only for exploration |
| IgBert / IgT5 (Kenlay 2024, arXiv 2403.17889) | IgBert 0.4B (420M) | over 2 billion unpaired + 2 million paired OAS sequences | IgBert HF card: MIT; paper CC BY 4.0 | Yes |
| AntiBERTy | 26M (NbBench) | OAS-derived, counts not opened | not checked | Likely |
| AntiBERTa2 / -CSSP | 203M / 202M (NbBench) | not opened | not checked | Likely |
| VHHBERT | 86M (NbBench) | VHHCorpus-2M (2M+ VHH sequences, COGNANO) | not checked | Likely |
| ProGen2-OAS, NanoBERT-like others | not examined | - | - | Not verified |

Note: the user-specified "Cambrian non-commercial" does apply to ESM C 600M and ESM3 weights, not to ESM-2.

## 2. Published residue-level interface numbers (Q2, Q3)

Prevalence reminder: paratope about 1:3 inside CDR+-2, about 1:10 over the whole variable region (Paraplume paper). Epitope fraction on the antigen surface is much lower (AsEP epitopes about 14.6 +- 4.9 residues; BRIEF's proxy 8GZ5 epitope fraction 0.126 of the whole chain).

### Paratope (antibody-side)
| Source / method | Embedding | Test set | PR-AUC | ROC-AUC | MCC |
|---|---|---|---|---|---|
| NbBench Table 8 (frozen-ish PLM + head, mean of 3 seeds), SAbDab paratope, 851/139/240 train/val/test, **token-level, nanobody-focused** | ESM-2 650M | NbBench test (240) | 0.718 | 0.928 | not reported |
| same | ESM-2 150M | same | 0.714 | 0.922 | - |
| same | AbLang-H / AbLang-L | same | 0.756 / 0.742 | 0.933 / 0.933 | - |
| same | AntiBERTy | same | 0.739 | 0.932 | - |
| same | AntiBERTa2-CSSP (best) | same | 0.765 | 0.939 | - |
| same | NanoBERT (15M) | same | 0.719 | 0.928 | - |
| same | VHHBERT | same | 0.695 | 0.921 | - |
| same | IgBert | same | 0.687 | 0.921 | - |
| same | ProtBert | same | 0.693 | 0.916 | - |
| Paraplume (concat of 6 PLMs + MLP), antibodies (H+L) | six PLMs | Paragraph test (1,086 complexes, 60/20/20) | 0.758 | 0.966 | 0.676 |
| Paraplume | six PLMs | PECAN test (152) | 0.730 | 0.963 | 0.657 |
| Paraplume | six PLMs | MIPE (626, 5-fold CV) | 0.716 | 0.962 | 0.632 |
| Paragraph (structure from ABodyBuilder) | - | Paragraph / PECAN / MIPE | 0.725 / 0.696 / 0.689 | 0.934 / 0.934 / 0.937 | 0.669 / 0.654 / 0.596 |
| Parapred | - | PECAN / MIPE | 0.646 / 0.652 | 0.930 / 0.868 | - / 0.503 |
| Paraplume single-PLM ablation (Table S1), PECAN PR-AUC/MCC | ESM-2 0.734/0.650; ProtT5 0.734/0.633; IgBert 0.710/0.596; IgT5 0.703/0.574; AbLang2 0.693/0.599; AntiBERTy 0.631/0.553 | | | | |
| ParaAntiProt (Kalemati, Sci Rep 2024, doi 10.1038/s41598-024-80940-y) | ProtTrans + antibody LMs | nanobody set | 0.665 | 0.912 | general set: ROC 0.904, F1 0.701, MCC 0.585 (secondary report from search snippet, full text not opened; prevalence and test definition unverified) |
| NanoBERTa-ASP (Sci Rep/BMC 2024, PMC10956323) | RoBERTa pretrained on 31M OAS heavy chains, fine-tuned on 1,070 labelled nanobodies | 10-fold CV | PR-AUC only in figures (not extracted) | AUC 0.947-0.952 | not reported |

Reading: on pooled data the ESM-2 vs antibody-specific gap is small (NbBench: 0.718 vs 0.765 PR-AUC; Paraplume ablation: general PLMs ESM-2/ProtT5 equal or better than antibody LMs). Caveat on leakage: SAbDab splits by sequence cluster differ per paper; PECAN/Paragraph/MIPE splits are not guaranteed to be CDR-identity-clean, and ESM-2 was trained on UniRef50 which includes many antibody sequences. No source I read gives a paratope number restricted to nanobody CDR positions with an explicit prevalence; ParaAntiProt's nanobody PR-AUC of 0.665 is the only labelled nanobody figure (unverified details).

### Epitope (antigen-side)
| Method | PLM role | Test set | PR-AUC / AUPR | AUROC | MCC |
|---|---|---|---|---|---|
| WALLE (AsEP, NeurIPS D&B 2024, arXiv 2407.18184) | ESM-2 node features + GNN, antibody-aware | 170 complexes, epitope-group split (epitopes unseen) | not reported | 0.544 | 0.077 (SE 0.015) |
| WALLE | same | epitope-to-surface-ratio split | not reported | 0.635 | 0.210 |
| ESMBind (ESM-2 binding-site predictor, antibody-agnostic) | ESM-2 fine-tuned | AsEP group split | - | 0.500 | 0.002; fine-tuned on AsEP: AUROC 0.584, MCC 0.104 |
| MaSIF-site / EpiPred / ESMFold-contact | - | AsEP group split | - | - | 0.046 / -0.006 / 0.018 |
| EpiScan (Bepler-Berger antibody embedding, not ESM-2; conventional antibodies only; PMC11383971) | antibody sequence embedding | DB1, 30 test complexes | AUPR 0.304 | 0.715 | - |
| EpiScan | same | DB2 (30 CoV complexes) | AUPR 0.243 | 0.686 | - |
| PInet / PECAN (EpiScan Table 1) | - | DB1 | AUPR 0.368 / 0.226 | 0.687 / 0.655 | - |
| BepiPred-3.0 (ESM-2 650M embeddings), third-party eval (CALIBER) on linear epitopes | ESM-2 650M | one external set | 0.04 | 0.622 | - |

The AsEP paper also flags overlap risk between ESM-2/BepiPred-3.0 training data and AsEP structures, i.e. the optimistic numbers are the leaky ones. EpiScan's text and tables disagree on which method has the best AUPR (PInet 0.368 per table, EpiScan claimed), a reminder to trust table cells. Parapred, Paragraph, ParaAntiProt, SEMA, ABAG-docking epitope numbers were not retrieved beyond what is above; SEMA and ABAG-docking are unverified here.

## 3. Zero-shot interface signal from contact heads / MSA-Transformer (Q4)
I found **no published evidence** that ESM-2 contact heads or MSA Transformer, run on concatenated antibody+antigen sequences, recover inter-chain contacts zero-shot. What I did find: (a) ESM-2's attention-based unsupervised contact prediction is documented for intra-chain contacts only (ESM repo); (b) fine-tuning ESM-2 on paired heavy/light antibody sequences changes cross-chain attention from sequence-proximal positions (base model) to CDR, especially H3 (arXiv 2308.14300, as reported by the search tool); (c) interaction-aware models (MINT, PPLM-Affinity, LangAAI) exist but are trained. Mechanistically this is expected: antibody-antigen pairs have no cross-species coevolution (the antibody is generated by V(D)J + somatic hypermutation, not selected jointly with the antigen over evolutionary time), so the Evoformer-style pair signal that works for obligate complexes is absent. Treat as a negative/absent result, not as a measured zero.

## 4. AVIDa-hHER2 fine-tuning (Q5)
Could not verify the AVIDa-hHER2 paper or its baselines: COGNANO's datasets page lists only hTNFa, hIL6, SARS-CoV-2 and VHHCorpus; the HF dataset card needs login (401); search returned nothing. So "Tsuruta 2024 NeurIPS D&B AVIDa-hHER2 baseline numbers" is unverified. Sibling evidence:
- AVIDa-hIL6 (arXiv 2306.03329): 573,891 pairs, 20,980 binding vs 552,911 non-binding (3.7 % positive); label rule = proportion rise with p <= 0.05, negative-control binders reassigned as noise.
- AVIDa-SARS-CoV-2 (arXiv 2405.18749): train 15,400 binders / 34,285 non-binders; test uses a different alpaca.
- NbBench Table 8, sequence-level binding: SARS-CoV-2 AUROC/AUPRC AbLang-H 0.884/0.850, NanoBERT 0.876/0.829, ESM-2 650M 0.850/0.793; hIL6 AbLang-H 0.925/0.737 (test positives rare, recall 0.51), ESM-2 650M 0.857/0.550 with recall 0.088. Nanobody-specific or antibody LMs beat ESM-2 at sequence-level binding.
Transfer to residues: no evidence. These classifiers read antigen-conditioned enrichment, which may reflect expression/display bias and CDR3 family identity rather than interface. With only a few hundred HER2 labels, the realistic use is an attention/occlusion probe on the paratope side, which the BRIEF's AntiBinder proxy suggests is near random unless pretrained on larger sets (PR-AUC 0.176 vs 0.126 baseline).

## 5. Compute budget (Q6)
No measured throughput was found (searches returned only NVIDIA training docs). Back-of-envelope, labelled ESTIMATE: 1.8M VHH x about 122 tokens = about 2.2e8 tokens. ESM-2 650M costs about 1.3 GFLOP/token forward, so about 2.9e17 FLOP; at 30-40 % MFU in bf16 on an A100 (312 TFLOPs peak) that is roughly 40-80 min; an L40 (about 180 TFLOPs bf16 dense) maybe 1-2 h. Weights 1.3 GB in fp16; activations at batch 256 x 128 tokens are a few GB, so 24-48 GB is ample. nanoBERT (14-15M) is about 40x cheaper (minutes); AbLang-2 and IgBert scale with their sizes (IgBert 0.4B about 0.6x of ESM-2 650M cost). Reality check from Paraplume: 6 embeddings -> 1,000 sequences in about 3 min on one GPU, one embedding about 50 s (includes MLP and overhead; not a pure forward-pass figure). If only the few hundred labelled plus the top enriched clones are needed, the cost is negligible; embed all 1.8M only if clustering the NGS table. Per BRIEF, run on Explorer public partitions or Kaggle/Colab, never the lab partitions.

## Forced analogy: CASP13 to 14, representation versus architecture
(a) In CASP13-14 the MSA/coevolution representation (deep contact prediction, then MSA depth in AF2) carried the signal before the Evoformer architecture amplified it. For this challenge: is a PLM embedding the "MSA" of the epitope problem, i.e. a free evolutionary prior that the downstream head just reads?
(b) Testable idea: rank embeddings by what they add. Run a frozen-probe ablation on the paratope side for HER2 VHH sequences with (i) one-hot + position, (ii) ESM-2 650M, (iii) AbLang-2 or IgBert, (iv) a nanobody LM (nanoBERT), using SAbDab-nano structures as labels with CDR-identity-clustered splits; whichever gives the PR-AUC gain over one-hot plus IMGT-position prior is the representation actually adding information. Second test: per-residue masked-LM log-likelihood of ONU11/13/23 relative to the VHHCorpus/AVIDa-hHER2 family frequencies (conservation vs mutation tolerance) as a zero-parameter paratope score, since CDR3 and CDR1-2 positions are less conserved. Expect most gain to be positional (CDR location) rather than learned contact semantics.
(c) Verdict: **partially holds**. For the VHH side the PLM embedding is essentially a compressed MSA of the antibody repertoire and gives a real prior (PR-AUC about 0.7 vs about 0.1-0.25 prevalence), though much of it is repackaged CDR/framework position and germline identity (ESM-2 and ProtT5 match antibody LMs in the Paraplume ablation). For the HER2 epitope side it **breaks**: HER2 has no MSA-style information about which surface binds which VHH, and AsEP shows PLM-based epitope predictors near chance on unseen epitope groups. The CASP14 step change came from coevolution between residues that physically contact; antibody-antigen pairs lack that coupling.

## Gotchas / what could fool us
1. Different "PR-AUC" denominators: NbBench, Paraplume, ParaAntiProt, EpiScan score over different residue sets (CDR+-2 vs whole variable region vs whole antigen). Prevalence swings from about 1:3 to about 1:10, so PR-AUCs are not comparable across papers.
2. Positional shortcut: a head fed any embedding can reach high ROC-AUC on paratope just by learning "CDR3 and CDR1-2 positions". Compare against an IMGT-position-only baseline.
3. Leakage: ESM-2/UniRef50 and OAS-trained LMs have seen SAbDab antibodies (and nanobodies/HER2 binders in PDB); AsEP explicitly warns of this. SAbDab clusters differ between papers; "CDR identity < 70 %" split only in EpiScan DB1-cdr70.
4. Epitope numbers on the "ratio split" (AsEP AUROC 0.635, MCC 0.21) vs "group split" (0.544, 0.077): the leaky split overstates utility by about 2.7x on MCC.
5. Text vs table inconsistencies (EpiScan AUPRC claim vs table; AsEP "55X" claim vs tables) - quote table cells only.
6. AVIDa labels are enrichment labels with high class imbalance; accuracy above 0.96 with recall 0.09 (ESM-2 650M on hIL6) is a trivial-majority artefact.
7. nanoBERT's 10M sequences come from INDI; VHHBERT from AVIDa-linked VHHCorpus (also COGNANO) - the same corpus family as the challenge data, so VHHBERT may have seen the HER2 library (permitted by the rules, but inflates any internal benchmark).
8. Licences: IgLM (non-commercial), ESM C 600M / ESM3 (Cambrian Non-Commercial), ESM C 300M (attribution/naming strings) vs MIT/BSD-3 (ESM-2, AbLang-2, IgBert).
9. AbLang-2 expects paired VH|VL; feeding a lone VHH needs an explicit choice (verify empirically).

## Implications for the challenge
1. Use frozen ESM-2 650M (MIT) and AbLang-2 (BSD-3) or IgBert (MIT) residue embeddings plus an MLP for the **VHH paratope** channel; expect PR-AUC about 0.7 on conventional paratope benchmarks, lower for H3-dominated nanobodies. Add an IMGT-position baseline and ensemble ESM-2 + ProtT5 (best in Paraplume ablation).
2. Do not rely on any PLM for the **HER2 epitope** channel. Evidence says near-chance (AsEP). Use HER2 PDB complexes (public) and AF3/Boltz/OpenFold3 co-folding for the antigen side; use PLM paratope output only to condition or weight VHH residues.
3. Skip IgLM and ESM3/ESM C 600M for the entry; they add licence risk without published gain on interfaces.
4. Do not fine-tune on the few hundred AVIDa-hHER2 binder labels expecting residue transfer; at best use as a binder/non-binder filter for ranking designs or for picking which of the three clones' family neighbours to align (alignments of enriched VHH clusters could give a within-family conservation signal at CDRs).
5. Cheap experiment: masked-LM pseudo-likelihood of ONU11/13/23 per position with nanoBERT/AbLang-2 as a zero-shot paratope score; compare to ESM-2 probe on SAbDab-nano with CDR-clustered splits.
6. Budget: embedding 1.8M with ESM-2 650M is about 1-2 h on one A100/L40 (estimate), so do it only if needed; otherwise embed the labelled few hundred plus top clones.

## Open questions
- AVIDa-hHER2 paper numbers, size and licence (not found); the Space/HF dataset card needs login.
- Parameter counts and training counts for AbLang-2, IgLM, AntiBERTy, ProtT5; licences for nanoBERT, AntiBERTy, AntiBERTa, VHHBERT.
- Measured tokens/s for ESM-2 650M, AbLang-2, nanoBERT on L40/A100 (only an FLOP estimate here).
- Full-text ParaAntiProt: nanobody test set definition, prevalence, MCC, and its comparison with Paragraph.
- Any ESM-2/MSA-Transformer zero-shot antibody-antigen inter-chain contact benchmark (none found).
- Published epitope PR-AUC for SEMA (ESM-2) and ABAG-docking on nanobodies (not retrieved).

## Sources
- NbBench: https://arxiv.org/html/2505.02022v2 (opened)
- Paraplume: https://arxiv.org/html/2510.05626v1 (opened)
- AsEP: https://arxiv.org/html/2407.18184v1 (opened)
- EpiScan: https://pmc.ncbi.nlm.nih.gov/articles/PMC11383971/ (opened, first 100k chars)
- NanoBERTa-ASP: https://pmc.ncbi.nlm.nih.gov/articles/PMC10956323/ (opened)
- ParaAntiProt (search snippet only): doi 10.1038/s41598-024-80940-y
- nanoBERT (search result summary only): https://pmc.ncbi.nlm.nih.gov/articles/PMC10978573 ; doi 10.1093/bioadv/vbae033
- AbLang-2: LICENSE https://raw.githubusercontent.com/oxpig/AbLang2/main/LICENSE ; README https://raw.githubusercontent.com/oxpig/AbLang2/main/README.md ; paper doi 10.1093/bioinformatics/btae618, preprint 10.1101/2024.02.02.578678 (search summary only)
- IgLM README: https://raw.githubusercontent.com/Graylab/IgLM/main/README.md ; paper summary via search (Cell Systems 2023)
- IgBert/IgT5: https://arxiv.org/abs/2403.17889 ; https://huggingface.co/Exscientia/IgBert
- ESM repo: https://raw.githubusercontent.com/facebookresearch/esm/main/README.md
- ESM C HF card: https://huggingface.co/EvolutionaryScale/esmc-600m-2024-12 ; Cambrian Open License https://www.evolutionaryscale.ai/policies/cambrian-open-license-agreement
- AVIDa-SARS-CoV-2: https://arxiv.org/abs/2405.18749 ; AVIDa-hIL6: https://arxiv.org/abs/2306.03329 (search summary) ; COGNANO datasets page https://cognanous.com/datasets
- Chain-aware attention note: https://arxiv.org/pdf/2308.14300 (search summary only)
- BepiPred-3.0 / CALIBER figure: search summary only (unverified)
