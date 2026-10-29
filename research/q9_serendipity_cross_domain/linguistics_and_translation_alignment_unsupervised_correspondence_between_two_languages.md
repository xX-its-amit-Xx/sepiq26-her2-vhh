---
title: Translation alignment as a lens on VHH-HER2 interface prediction
queen: q9_serendipity_cross_domain
king: king_infer
worker: linguistics_and_translation_alignment_unsupervised_correspondence_between_two_languages
tier: expert
tags: [word-alignment, IBM-models, bilingual-lexicon-induction, attention, coevolution, paratope-prediction, SAbDab-nano, AER]
confidence: medium
challenge_relevance: 2
serendipity: Per-residue interface probability as word alignment between two "languages"; the analogy PARTLY holds (the weak-signal and gold-set-size lessons transfer, the "two languages" premise breaks because AVIDa-hHER2 has one antigen).
date: 2026-10-17
---

# Translation alignment as a lens on VHH-HER2 interface prediction

## TL;DR
Machine-translation research learned to align two languages from no or little parallel text, but only when there is a second language with its own statistics. Our data have one antigen, so the "HER2 language" has a single word. The part of the analogy that survives is practical: a paratope probability from sequence alone (nanobody language model plus SAbDab-nano priors) is the best-supported route. Published sequence-only paratope PR-AUCs sit around 0.6-0.7 on antibody benchmarks, against the baseline's 0.176 on a different task (8GZ5). Evidence limits: several numbers below come from search snippets or aggregator pages, not from the primary papers, and are flagged.

## Verification status (read first)
What I actually opened in full: arXiv abstract pages for Lample 2018 (1710.04087), Søgaard 2018 (1805.06297), Jain & Wallace 2019 (1902.10186) and Wiegreffe & Pinter 2019 (1908.04626). Everything else comes from WebSearch result summaries. The eLife (Ovchinnikov 2014) full page, PNAS (Bitbol 2016) and bioRxiv (Rao 2020) pages failed to load (error, 403, 429). So numbers from those papers are second-hand or marked "unverified". Nothing here is invented; gaps are stated.

## Q1. Alignment without parallel supervision: what each needs and how each fails

| Method | Minimal signal | Failure condition | Source status |
|---|---|---|---|
| IBM Models 1-5 (Brown et al. 1993, Comput. Linguist. 19(2)) | Sentence-aligned parallel text (many sentences); EM learns lexical translation t(f/e), then alignment, fertility, distortion (Models 2-5) | Needs many sentence pairs; little data gives garbage; Model 1 has no position information | Not opened; textbook knowledge, citation unverified here |
| GIZA++ (Och & Ney 2003, Comput. Linguist. 29(1):19-51, doi 10.1162/089120103321337421) | Same parallel text; HMM plus IBM 1/3/4 pipeline; scored against manual reference alignments (AER) on German-English Verbmobil and French-English Hansards | Degrades with noisy data. One low-resource Griko-Italian study: GIZA++ AER 14.5 on clean text, fast_align 19.8, IBM-2 37.3 (single study, setting specific) | Via search snippets (aclanthology J03-1002; arXiv 2301.09685) |
| fast_align (Dyer et al. 2013) | Same parallel text; IBM-2 with a prior favouring diagonal (monotone) alignments | Prior assumes similar word order; hurts on reordered pairs | Description via arXiv 2301.09685 snippet; original paper not opened |
| Lample et al. 2018 (arXiv 1710.04087) | Two monolingual embedding spaces, zero dictionary: adversarial mapping, then Procrustes refinement | Per abstract, works for distant pairs such as English-Russian, English-Chinese; reported to beat some supervised methods on some pairs. Accuracy figures not on abstract page, not checked | Abstract opened |
| Artetxe et al. 2017/2018 (VecMap) | Monolingual embeddings plus either a small seed (about 25 pairs or numerals in the 2017 paper, from memory, unverified) or a structural self-learning loop | Same family of failure as above | Not opened |
| Søgaard et al. 2018 (arXiv 1805.06297) | Shows the above fail "in more realistic scenarios" | Failure when corpora are not comparable (domain mismatch) or languages are distant / morphologically unlike. The core condition is approximate isomorphism of the two embedding spaces | Abstract opened; detailed conditions beyond the abstract (isomorphism, graph similarity) are from memory, unverified |

Common lesson: unsupervised alignment needs (a) two populations of items with internal structure, and (b) approximate structural isomorphism between them. Without (b), more data does not rescue it.

## Q2. The protein analogue: coevolution across an interface
- Ovchinnikov, Kamisetty & Baker 2014, eLife 3:e02030, doi 10.7554/eLife.02030 (via search summary, full text not loaded): pseudo-likelihood direct coupling analysis on the 50S ribosome plus 28 other bacterial complexes; top co-varying cross-interface pairs are "almost always in contact" provided the number of aligned sequences exceeds the average length of the two proteins. It then predicted contacts for 36 complexes of unknown structure and modelled four. I did not verify the exact Meff thresholds in the paper; the commonly quoted regime is Meff of the order of hundreds to a few thousand effective sequences for ~200-residue pairs, which is consistent with the "sequences > length" statement but is unverified.
- Bitbol, Dwyer, Colwell & Wingreen 2016, PNAS 113:12180-12185 (via search summary): pairwise maximum entropy (DCA) iterative algorithm that pairs members of two families, tested on histidine kinase / response regulator pairs. It bootstraps from a small set of known pairs. Pair counts needed: not verified.
- Weigt 2009 PNAS and Gueudre 2016: not opened; no numbers reported.

Why it matters: this is the true protein counterpart of unsupervised alignment, and it requires thousands of independent, paired, orthologous sequences from two families. A paired set that diverged over evolutionary time is the "parallel corpus". We have one HER2 sequence and about 10^5-10^6 VHH sequences.

## Q3. Attention as alignment
- Bahdanau 2015 introduced attention as a soft alignment; its alignment matrices were visually near-diagonal for English-French (not re-opened).
- Jain & Wallace 2019 (arXiv 1902.10186, opened): attention weights often do not correlate with gradient-based importance, and very different attention distributions give equivalent predictions.
- Wiegreffe & Pinter 2019 (arXiv 1908.04626, opened): whether attention "explains" depends on the definition of explanation; adversarial attention distributions do poorly on their diagnostic, so Jain & Wallace do not disprove usefulness.
- Alignment accuracy: Garg et al. 2019 (arXiv 1909.02074; EMNLP 2019) say raw Transformer attention can differ significantly from traditional word alignments, and that supervising one head with IBM-model alignments gets AER competitive with, and with the guided variant better than, GIZA++ on three datasets. I did not retrieve the AER values; the commonly cited raw-attention AER on De-En is far worse than GIZA++, but I cannot give the figure. Unverified.
- Implication for AntiBinder: reading epitope and paratope off attention is the NMT practice that linguists found unreliable unless the attention is explicitly supervised with alignments. AntiBinder trained on global binding labels only gets a binary signal, which is exactly the weak supervision under which attention-as-alignment degrades. The baseline 0.176 PR-AUC on 8GZ5 (epitope fraction about 0.126, so random PR-AUC about 0.126) is only about 1.4x chance; this agrees with the linguistic finding that unguided attention is a poor aligner.

## Q4. Protein language models and per-residue paratope probability
| Model | Per-residue paratope from sequence alone? | Published number | Dataset | Status |
|---|---|---|---|---|
| Rao et al. 2020 / ICLR 2021 (ESM-1b attention, logistic regression on heads) | Contacts within one chain, not interfaces | Higher contact precision than Gremlin (no numbers retrieved) | single-chain contact benchmarks | Search snippet only |
| ESM-2 (Lin 2023 Science) | Embeddings only; no paratope head published in that paper | none | n/a | Not opened |
| AbLang, IgFold (Ruffolo 2021) | Embeddings / structure; not a paratope classifier in the original work | none retrieved | n/a | Unverified |
| IgBert / IgT5 (Kenlay 2024, arXiv 2403.17889) | No paratope result in the paper; used as embeddings by Paraplume | none | n/a | Snippet |
| Paraplume (arXiv 2510.05626, 2025) | Yes: PLM embeddings (including IgT5, IgBert) into MLP, per-residue probability, sequence only | AUC values not retrieved | not retrieved | Snippet only |
| ParaAntiProt (Sci Rep 2024) | Yes, ProtTrans-based, sequence only | ROC AUC 0.912, PR AUC 0.665 on a nanobody dataset (author-reported, via snippet) | nanobody set (details not retrieved) | Snippet only |

The ParaAntiProt number is the one directly relevant datum: a sequence-only model reports PR AUC near 0.67 on nanobodies. Caution: that dataset has a different positive rate than ours.

## Q5. How much parallel data exists?
- SAbDab-nano (Schneider, Raybould, Deane 2022, NAR 50:D1368, doi 10.1093/nar/gkab1050): 1,585 nanobody structures at a 18 April 2024 snapshot; 1,972 single-domain antibody structures at 10 July 2025 (1,089 X-ray, 874 EM, 8 NMR). These count structures, not distinct complexes or antigens; clustering to distinct nanobody-antigen pairs would give fewer (not computed).
- Paratope-predictor PR-AUC on PECAN data (aggregator leaderboard, not primary): Paragraph 0.696, PECAN 0.675, Parapred 0.646; on MIPE: Parapred 0.652, Paragraph 0.650. These numbers come from a hyper.ai mirror and a 2024 comparison paper; the primary papers (Liberis 2018, Pittala & Bailey-Kellogg 2020, Chinery 2023) were not opened. Most of these are conventional antibody (VH+VL) benchmarks, so nanobody transfer is unproven.
- One-antigen limit: AVIDa-hHER2 has ONE antigen (HER2 ECD). There are about 10^6 VHH "sentences" but a single "target word". There is no second language, no isomorphism to exploit, and no way to run Lample- or DCA-style co-variation across the interface, because the HER2 side does not vary.

## Q6. Closest linguistic trick: semi-supervised bilingual lexicon induction
Seeded induction (a few hundred or fewer known pairs, plus monolingual embeddings, mapped by Procrustes and refined iteratively) is the closest. Mapping:

| Linguistic method | Protein counterpart | Data it needs | Our data |
|---|---|---|---|
| Parallel corpus + IBM / GIZA++ | Paired co-evolving sequences + DCA | thousands of orthologous pairs | none (one HER2) |
| Monolingual embeddings + unsupervised mapping (Lample) | PLM embeddings of VHHs and of HER2 domains | two varied populations | VHH yes; HER2 no |
| Seed dictionary + Procrustes + self-learning (Artetxe) | few hundred known binders + enrichment labels + PLM embeddings, iteratively expanded | seed pairs | a few hundred binder labels, 10^5-10^6 reads |
| Attention as alignment | Cross-attention in AntiBinder-style models | supervised alignment signal | global binary labels only |
| Gold alignment set for AER | 3 complexes (ONU11/13/23) | many sentences | n=3 |

Implementable in 14 days: only the seeded step, in a reduced form. Use a pretrained nanobody or antibody LM embedding of each VHH, train a per-residue head with SAbDab-nano interface labels (public data, allowed), and use enrichment-labelled binders only to reweight or filter. The HER2 side is handled separately (see below).

## Forced analogy: philosophy of science via translation
(a) Statement: VHH sequence and HER2 surface are two "languages"; per-residue interface probability is the word-alignment link matrix (one link per contacting residue pair, aggregated over partners); judged against a gold alignment of 3.
(b) Testable ideas:
1. Paratope probability p(residue i in CDR/interface | VHH sequence) = PLM per-residue head trained on SAbDab-nano interfaces, then smoothed by position priors (CDR3 dominates). This is the "monotone prior" of fast_align transplanted. Expected PR-AUC from the literature: about 0.6-0.7 on antibody paratope benchmarks (Parapred/PECAN/Paragraph 0.65-0.70; ParaAntiProt 0.665 on nanobodies). This is a literature range, not our measurement; our positive rate and nanobody-only data may shift it.
2. HER2 side: no sequence variation. Available signals are surface accessibility and known domain structure from public PDB HER2 complexes (trastuzumab, pertuzumab etc.), plus the chance that the VHH epitope is on a small number of known epitope patches. I have no cited epitope-prior number; this would need a separate lookup.
3. AER-style sanity test: build a gold set of three from public HER2-VHH or nanobody complexes, and bootstrap over complexes to see how much metric variance n=3 gives. Prediction: huge.
(c) Verdict: PARTLY HOLDS. The analogies that hold: weak or seeded supervision, evaluation against a tiny gold set, and the warning that raw attention is not alignment. What breaks: unsupervised correspondence needs two populations with comparable structure (Søgaard's isomorphism condition), but the antigen side is a single fixed sequence. Also, AER studies in MT use hundreds of hand-aligned sentences (Och & Ney used Verbmobil and Hansards gold sets, sizes not verified here); a gold set of three yields a macro PR-AUC whose confidence interval can easily span the difference between rival methods. This is a measurement-theory point, not a numeric result I found in the literature.

## Gotchas / what could fool us
1. 8GZ5 proxy: epitope fraction 0.126; baseline 0.176 is only about 1.4x chance, and one complex gives no variance estimate.
2. Positive rate differs between benchmarks (paratope sets vs. interface of a 120-aa VHH vs. the 1,200-residue HER2 chain). PR-AUC is not comparable across them; quote lift over prevalence.
3. Aggregator PR-AUCs come from mirrors, not the original papers; splits (sequence-identity cutoffs) were not checked, and leakage inflates published antibody numbers.
4. SAbDab-nano counts are structures (many duplicates of lysozyme, GFP, SARS-CoV-2 RBD), not independent complexes.
5. Enrichment labels (chi-square p<=0.05 after one round) are not binding labels; polyspecific or amplification-biased phage can be "binders".
6. "Leakage from public data is fine if the answer is correct" (BRIEF): public HER2 complexes and VHH homologs may already encode the answer; this helps but is uncheckable here.
7. Attention-based explanation: Jain & Wallace show different attention gives identical outputs, so a high-attention residue need not be an interface residue.

## Implications for the challenge
1. Do not rely on cross-attention from a binding classifier trained on one antigen; use a supervised per-residue paratope head on nanobody LM embeddings with SAbDab-nano interface labels.
2. Report lift over prevalence, not raw PR-AUC, when comparing to 0.176.
3. Evaluate on at least a dozen held-out SAbDab-nano complexes (clustered by identity) and bootstrap by complex, to see the n=3 noise.
4. For the HER2 side use structural priors (accessible surface, known epitope patches); do not try coevolution since there is no antigen variation.
5. Use the enrichment-labelled binders only as a reweighting of VHH training examples, not as interface labels.
6. A 14-day plan: day 1-3 build dataset, day 4-8 train the head, day 9-12 bootstrap and calibrate, day 13-14 submit.

## Open questions
- Exact Meff thresholds in Ovchinnikov 2014 and pair counts in Bitbol 2016 (full texts not loaded).
- Raw-attention AER values (Garg 2019 tables) and Artetxe seed sizes.
- Paraplume and ParaAntiProt datasets, positive rates and splits; whether IgT5 embeddings are best for nanobodies.
- Number of distinct nanobody-antigen clusters in SAbDab-nano.
- Whether PR-AUC for the HER2 chain is computable against the heavy class imbalance on a 1,200-residue ectodomain.

## Sources
- https://arxiv.org/abs/1710.04087 (opened)
- https://arxiv.org/abs/1805.06297 (opened)
- https://arxiv.org/abs/1902.10186 (opened)
- https://arxiv.org/abs/1908.04626 (opened)
- https://elifesciences.org/articles/02030 ; doi 10.7554/eLife.02030 (search result only; page failed to load)
- https://arxiv.org/pdf/1604.08354 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC5087060 (search result only)
- https://aclanthology.org/J03-1002/ ; https://arxiv.org/pdf/2301.09685 (search result only)
- https://arxiv.org/pdf/1909.02074 (search result only)
- https://www.biorxiv.org/content/10.1101/2020.12.15.422761.full.pdf ; https://iclr.cc/virtual/2021/poster/3016 (search result only)
- https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab/nano/stats ; doi 10.1093/nar/gkab1050 (search result only)
- https://arxiv.org/pdf/2510.05626 ; https://arxiv.org/html/2403.17889v1 ; https://doaj.org/article/a65f9b14e0204a7d81b44e5c17d22e4d (search result only)
- https://vercel.hyper.ai/en/papers/paragraph-antibody-paratope-prediction-using (aggregator, search result only)
