---
title: AntiBinder baseline, organiser publications, and what "folding from binding" means
queen: q4_challenge_intelligence
king: king_world
worker: antibinder_baseline_and_organiser_publications_what_the_hypothesis_folding_from_binding_means
tier: expert
tags: [antibinder, baseline, avida, cognano, folding-from-binding, pr-auc, her2, vhh]
confidence: medium
challenge_relevance: 4
serendipity: Art restoration (NGS table = over-painted original, cryo-EM = canvas); paid off as a framing for inference versus model-prior inpainting, but yielded only a modest testable idea.
date: 2026-10-17
---

# TL;DR
The official baseline (AntiBinder, PR-AUC 0.176 on a 0.126 base rate) is a SARS-CoV-2 proxy. The published AntiBinder paper has no trained epitope/paratope output and, as far as I could read, never mentions 8GZ5, so the proxy protocol is the organisers' own and is described only in one passage on /detail. "Folding from binding" appears on /guideline as a self-declared "testable hypothesis"; I found no preprint defining it. The HER2 labels are enrichment statistics (IE-score), not biophysics, so a model trained on them learns "what survives one panning round", a very indirect proxy for the interface.

Method caveat: web pages were read through WebFetch (a small summariser model), not as raw text; quotes are short excerpts it returned, so treat exact wording as medium confidence. The `paperclip` CLI was not installed in this shell (`command not found`), so no paperclip search was done; literature came from WebSearch/WebFetch only.

## 1. AntiBinder (primary source: doi:10.1093/bib/bbaf008)
- Authors per DBLP record (search result): Kaiwen Zhang, Yuhao Tao, Fei Wang; Brief Bioinform 26(1), bbaf008, 2025; article is CC BY-NC 4.0. Code: https://github.com/fdu-wangfeilab/AntiBinder (README clone line points to shiipl/AntiBinder); MIT licence.
- Architecture: AbSeqEmb (antibody) + AgSeqEmb (antigen) -> stacked BidAttBlock modules (cross-attention in both directions) -> MLP with two linear layers + sigmoid giving a binding probability; binary cross-entropy loss.
- Inputs: antibody heavy chain only (max length 149; amino-acid index, Chothia region index, IgFold structural embedding sliced to emphasise CDR-H3); antigen sequence padded/truncated to 1024 with ESM-2 1280-d embedding.
- Paper training sets: COVID-19 (Cov-AbDab) 27,324 pairs; HIV (LANL) 24,004; BioMap 1,363 (binding free-energy labels); MET 4,000. Evaluation: 5-fold CV plus unseen-antigen and cross-species splits.
- Epitope/paratope: NOT a trained output. One qualitative antigen-to-antibody attention heatmap (HIV gp120-PGT124; high attention on pairs Y65-R349 and E118-Q332 that match contacts); the authors say more study is needed on attention vs function. No residue-level metric.
- Repo README (as read): Python 3.10+; biopython, biotite, fair-esm, igfold, lmdb, scikit-learn, tqdm; `python main_trainer.py` / `python main_test.py`; no requirements.txt in the listing; no GPU spec; no pretrained weights mentioned; no mention of nanobody, AVIDa or SAbDab-nano.
- Not read: the last ~22k characters of the paper page and the supplementary docx (AntiBinder_supplementary_materials_bbaf008). An 8GZ5 mention there is unverified.

## 2. The SEPIQ proxy protocol (only source: sepiq.uk/detail)
| Item | What /detail says (short excerpts) |
|---|---|
| Model | "transformer-based AntiBinder model on sequence data only with global binding labels" |
| Compute | "~30 minutes on a single consumer-grade GPU" (NVIDIA RTX 3090 Ti) |
| Ground truth | PDB 8GZ5, VHH P17 on SARS-CoV-2 RBD, used because HER2 structures are private; "fraction of epitope residues is 26/206 = 0.126" |
| Training A | SAbDab-nano only -> roughly random |
| Training B | pretrain on AVIDa-SARS-CoV-2 then fine-tune on SAbDab-nano -> "PR-AUC of 0.176, modest but above the expected performance of a random predictor" |
| Leakage | "to avoid data leakage, we train and evaluate the baseline models on similar publicly available data." |

Unspecified anywhere I could open: how attention becomes a per-residue score (layer/head averaging, which side), whether the 206 residues are the whole RBD construct, any confidence interval. It is one complex with 26 positives, so 0.176 vs 0.126 is likely within bootstrap noise (not computed). The exact protocol lives in the gated Starter Kit.

Mismatch: the AntiBinder paper itself trains on COVID/HIV/BioMap/MET, not SAbDab-nano/AVIDa, so "AntiBinder 0.176" is an organiser adaptation, not a number from the paper.

Reproducibility (Q5, untested): code MIT; no weights found; README gives no GPU need but organisers cite a 3090 Ti run of ~30 min. IgFold + ESM-2 embedding fits a 16-24 GB GPU, so Explorer `gpu-short`/`gpu` (<=2 GPUs, never the lab partitions) or Modal should do. Sketch only: clone repo; pip install biopython biotite fair-esm igfold lmdb scikit-learn tqdm; prepare CSVs with the columns named in `antigen_antibody_emb.py`; `python main_trainer.py`; `python main_test.py`. AVIDa-SARS-CoV-2 is on HF (COGNANO/AVIDa-SARS-CoV-2, CC BY-NC 4.0 per search summary).

## 3. Organiser publications (Q2)
| Item | Authors (relevant) | Date / venue | Key numbers | Source status |
|---|---|---|---|---|
| AVIDa-hIL6 | Tsuruta, Yamazaki, Maeda, Tamura, Wei, Mariet, Phloyphisut, Shimokawa, Ledsam, Colwell, Imura | arXiv 2306.03329: v1 6 Jun 2023, v2 11 Oct 2023; NeurIPS 2023 D&B | 573,891 pairs (20,980 binding / 552,911 non-binding); 30 IL-6 mutants + WT | arXiv abstract opened |
| AVIDa-SARS-CoV-2 + VHHCorpus-2M | Tsuruta et al. (Yamazaki, Maeda, Imura among authors) | arXiv 2405.18749; NeurIPS 2024 D&B | 77,003 pairs (22,002 / 55,001); 2 alpacas, 13 antigens, 12 mutants; corpus >2 M sequences | search summary only |
| AVIDa-hHER2 | COGNANO | no paper or bioRxiv found | ~1.8 M sequences (HF card 1,843,875) | none located |
| N-iX / COGNANO partnership | Imura quoted | 5 Oct 2026 (signing Lviv, Sept 2026) | "For SEPIQ, COGNANO provided 1.8 million HER2 VHH sequences" | opened |
| SEPIQ preprint | - | none found | - | - |

Not found or not searched: Olechnovic Voronota-LT papers (not searched), Namba/Kasai/Inoue HER2-VHH cryo-EM paper, talks. The brief's "AVIDa-hHER2 NeurIPS/bioRxiv paper" could not be confirmed; treat as nonexistent until shown.

## 4. "Folding from binding" (Q3)
- Location: /guideline (the /detail, /about and home fetches returned no such phrase). Excerpt: "We present this as a testable hypothesis rather than a definitive claim." Paraphrase (not verbatim): large-scale binding-derived sequence data may carry weak but scalable information about structural constraints, tested with limited high-resolution labels.
- No preprint defining the term found; an exact-phrase web search returned only unrelated nanobody folding/inverse-folding work.
- Support for the general idea (abstract level, via search): Rollins et al. 2019 Nat Genet doi:10.1038/s41588-019-0432-9 (top epistatic pairs from deep mutational scans fix the fold; GB1 within 1.8 A, WW domain 2.1 A) and Schmiedel & Lehner 2019 Nat Genet doi:10.1038/s41588-019-0431-x. Caveat: those use designed variant libraries of ONE protein with quantitative fitness; SEPIQ has 1.8 M natural repertoire sequences, one panning round, near-binary labels, no controlled mutational neighbourhood.
- Against / absent: AntiBinder's attention result is one qualitative figure; the proxy gain is 0.176 vs 0.126 on one complex; paratope predictors such as NanoBERTa-ASP learn from structure-derived labels, not binding labels.
- Layperson paragraph: "Labs can read the letters of millions of antibody-like proteins and see which ones stick to a target. The idea is that the pattern of which letters tend to go together among the winners quietly encodes how they touch the target. The contest asks whether that faint pattern is strong enough to pinpoint the touching spots, and the organisers openly say they do not yet know."
- Verdict: unproven. Plausible for the VHH side (CDR composition, cluster structure); much weaker for the antigen epitope, since a single antigen offers no variation to learn from.

## 5. AVIDa-hHER2 labels and the held-out clones (Q4)
HF card (SEPIQ-2026-training-data; gated; ~626 MB; 1,843,875 sequences). Columns: `#ONU ID` (assigned by descending total read count), `Total`, `Sequence`, `Label` (Yes / Not / noise / non-sig.), `Binary Label` (1/0/blank), `Cluster`, `#Cluster`, `Cluster size` (USEARCH, 93% identity), library columns with `Marin` prefix (alpaca; mother library B or C; experiment; 4 C or 37 C), `Background IE-score`, `Target IE-score`.
- IE-score: chi-square enrichment/dilution before vs after target panning (AVIDa-hIL6 method); lower means binding; infinities capped at -500.
- Rules (card, summarised): Target IE >= 1.3 -> Not; Background IE <= -3 -> noise; negative background and target-minus-background gap > 2 -> Yes; other negative background -> non-sig.; positive background with target IE <= -1.3 -> Yes; else non-sig.
- Contradiction: the brief says "binder if proportion rose and p<=0.05"; /detail says labels come from a chi-squared test on before/after panning proportions; the card adds IE thresholds and a background-library filter. Prefer the card. Construct: HER2 ECD, UniProt P04626 numbering with signal peptide, C-terminal GACQ + His tag (sequence on /detail; verbatim capture is Worker 1's job).
- What this bounds: labels mean "enriched against His-tagged whole HER2 ECD under phage selection". Not domain, not affinity, not epitope. Avidity, display/expression bias and tag or plastic binders hide inside "Yes".
- Overlap: ONU ID is a read-count rank, so ONU11, ONU13 and ONU23 are the 11th, 13th and 23rd most abundant clones of the same 1.84 M table; this strongly suggests they are in the training CSV, probably labelled. Unverified (gated file). Match on the VH core, since the /detail sequences carry an N-terminal "MA" and a C-terminal His tag (lengths 120/120/130 aa as stated in the brief).

## 6. Contradictions (partial; queen asked Worker 1 for the full resolution)
| Issue | Side A | Side B | Resolution |
|---|---|---|---|
| 3 vs 7 antibodies | /detail "3 specific VHH"; /guideline formula k=1..3 | home page "seven given VHH antibodies" | three; seven looks stale (unverified) |
| Metric | /guideline: two PR-AUC variants are the "primary evaluation measures" | /detail names PR-AUC only for baseline | /guideline is explicit |
| Start date | home "begin in June 2026" | timeline 1 Sept - 31 Oct; CAPRI 16 Sept | window is Sept-Oct; June is stale |

## 7. Calibrating PR-AUC 0.15-0.25 on a 0.126 base rate (Q6)
Use lift: 0.176/0.126 = 1.4x; 0.25 = 2.0x. I found no published residue-level epitope PR-AUC from binding labels. Numbers I opened: NanoBERTa-ASP paratope AUC-ROC 0.947-0.952 (10-fold CV, ~1,070 labelled nanobodies per Methods; PR-AUC only in a figure) which is the easier, structure-labelled paratope task. Nanotope PR-AUC values not retrieved (bioRxiv HTTP 429). NABP-BERT AUROC 0.986 / AUPR 0.985 is pair-level binding, not comparable. No nanobody sequence-to-interface model trained on enrichment labels located; that gap is a finding.

## Forced analogy: art conservation and restoration
Mapping: the NGS enrichment table is faint pigment under over-paint; the cryo-EM complex is the original canvas; a restorer infers only what the trace supports and marks the rest as reversible inpainting. AntiBinder attention is varnish: it shows where the model looked, not what the paint did.
Testable idea: separate trace from inpainting by ablation. Score each residue with (a) a trace-only signal (within-cluster enrichment contrasts of the 93% clusters, CDR conservation among enriched members) and (b) a prior (AF3 / Boltz / OpenFold3 interface), report the PR-AUC delta of (a)+(b) over (b) on 8GZ5 and any public VHH-antigen complexes, and keep only gains that hold on held-out complexes. For the antigen side only the prior can speak, so trace weight there should be near zero.
Verdict: partially holds; it breaks because a restorer has an original per painting, while here the trace has no epitope variation (one antigen).

## Gotchas
1. 0.176 is one complex with 26 positives; its CI plausibly includes 0.126.
2. The proxy is the SARS-CoV-2 RBD, a heavily studied target; HER2 differs in public-PDB coverage.
3. Whether the 206 residues are the whole construct changes the base rate; Track A weights positives by Voronota area.
4. Labels are enrichment after one round against a whole-ECD His-tagged antigen; tag/plastic/display bias sits inside "Yes".
5. ONU11/13/23 are top-abundance clones; abundance memorisation or 93%-cluster neighbours can help or mislead; use cluster-aware splits.
6. Site pages disagree (section 6); do not cite the home page.
7. Data licence forbids redistribution and rehosting; do not copy it to O: or any public repo.
8. Fetch summaries are lossy; re-read raw /guideline when quoting.

## Implications for the challenge
1. Reproduce the baseline only to learn the attention-to-residue conversion; do not expect it to beat structure-prior methods on HER2.
2. Make the antigen side prior-driven (AF3 / Boltz / OpenFold3 complexes of ONU11/13/23 vs HER2); use binding data for VHH-side weighting and cluster sanity.
3. Verify ONU11/13/23 are in the HF table (ranks 11, 13, 23) and use their cluster neighbours' labels as a consistency test.
4. Report lift over base rate per complex with a cluster bootstrap, mirroring the organisers' paired bootstrap.
5. Any reproduction run goes on Explorer `gpu-short`/`gpu` (<=2 GPUs, no lab partitions) or Modal.

## Open questions
- Exact attention-to-residue rule and chain selection for 8GZ5 in the Starter Kit.
- Does a SEPIQ / folding-from-binding preprint exist (none found)?
- Does the AntiBinder supplement mention 8GZ5?
- Are ONU11/13/23 present and labelled in the HF table?

## Sources (opened)
- https://academic.oup.com/bib/article/26/1/bbaf008/7964282 (doi:10.1093/bib/bbaf008; summariser, partial)
- https://github.com/fdu-wangfeilab/AntiBinder
- https://sepiq.uk/detail , https://sepiq.uk/guideline , https://sepiq.uk/about , https://sepiq.uk
- https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data (public card)
- https://www.n-ix.com/news/n-ix-cognano-partner-to-scale-ai-data-infrastructure-for-antibody-drug-discovery/
- https://arxiv.org/abs/2306.03329 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10956323/
- Search-result summaries only: arXiv 2405.18749, HF COGNANO/AVIDa-SARS-CoV-2, doi:10.1038/s41588-019-0432-9, doi:10.1038/s41588-019-0431-x, Nanotope bioRxiv 10.1101/2023.09.27.559671, DBLP record for AntiBinder
