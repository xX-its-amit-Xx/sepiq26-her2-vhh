---
title: "Presence-only species-distribution modelling (MaxEnt) as a lens on epitope prediction from weak enrichment labels"
queen: q9_serendipity_cross_domain
king: king_infer
worker: ecology_niche_modelling_and_species_distribution_with_presence_only_data
tier: expert
tags: [maxent, presence-only, PU-learning, identifiability, spatial-block-CV, AUC-critique, boyce-index, HER2, epitope]
confidence: medium
challenge_relevance: 3
serendipity: "Ecology's presence-only 'niche' problem mapped onto epitope-from-enrichment; the statistics hold (Poisson/logistic/PU equivalence, validation pitfalls) but covariates and sampling process break; the unknown-prevalence worry turns out NOT to matter for a rank-based per-complex PR-AUC."
date: 2026-10-17
---

# Presence-only SDMs as a lens on SEPIQ Track A

## TL;DR
Ecologists spent 15 years on the statistical problem we face: you see only "presences" (positive residues or enriched reads), you have an unlabeled background, and nobody knows the true prevalence. The maths is settled: MaxEnt = Poisson point process = (infinitely weighted) logistic regression, and absolute prevalence is not identifiable without outside information. For Track A the lesson is double-edged. (i) Unknown prevalence does not hurt a per-complex, rank-based PR-AUC, because the intercept is a monotone shift. (ii) What does hurt is what ecology fights hardest: biased sampling and validation on too few, non-independent blocks; with n=3 test complexes the score is very noisy (simulation below). Verdict: **PARTLY HOLDS** (statistics hold; covariates and sampling process break).

## 1. The presence-only problem and the exact identifiability statement (Q1)

MaxEnt (Phillips, Anderson & Schapire 2006, Ecol Model 190:231-259, doi:10.1016/j.ecolmodel.2005.03.026; citation/abstract only, full text not opened) takes the maximum-entropy density over sites subject to feature expectations matching the presence sample. Fithian & Hastie (2013, Ann Appl Stat 7(4):1917-1939, doi:10.1214/13-AOAS667; full text opened) write the constraint as (1/n1) sum_{presence} x_i = E_p[x(z)] and show it gives the exponential-family density p(z) = exp(b.x(z)) / integral exp(b.x(u))du, exactly the log-linear inhomogeneous Poisson process (IPP) conditioned on n1.

**Presence-background vs presence-absence.** Presence-absence data identify P(y=1|x) directly. Presence-background data (n1 presences, n0 background points sampled over the domain) identify only the *relative* intensity lambda(x) = p1(x)/p0(x).

**Statements as sourced:**
- Fithian & Hastie 2013, sect. 1.2.2: "Using presence-only data alone, we can at best hope to estimate a relative, not absolute, occurrence rate." The absolute sightings rate is observable, but its constant of proportionality to the occurrence rate is unknown "without other data or assumptions".
- Same paper: the IPP intercept estimate "reflects nothing more than the total number of presence samples" (it normalises the fitted intensity to integrate to n1). Even with sampling bias modelled, the intercept carries no information about the occurrence intercept "unless we have independent knowledge" of the bias intercept.
- Ward, Hastie, Barry, Elith & Leathwick 2009 (Biometrics 65(2):554-563, doi:10.1111/j.1541-0420.2008.01116.x; the abstract was NOT available to me, I rely on the secondary account in Wang & Stone 2018, arXiv:1801.01326, which I opened): the probability of presence is not identifiable from presence-background data if nothing is known about the structure of the probability function; the population prevalence is required, and with it the EM algorithm recovers site-level probabilities. A search snippet of the abstract says prevalence is identifiable only under "some unrealistic constraint on the structure of the logistic model".
- **Formal restatement I will use (mine, not a quote):** for presence-background data, the likelihood of (n1, n0, x_i) identifies beta in P(y=1|x) = sigma(alpha + f_beta(x)) and identifies alpha only up to an offset tied to log(n1/n0)-type design terms. So the slope (relative suitability) is identified; the intercept, hence prevalence pi = E[P(y=1|x)], is not. Supplying pi or a functional-form restriction pins alpha.
- Royle, Chandler, Yackulic & Nichols 2012 (Methods Ecol Evol 3:545-554, doi:10.1111/j.2041-210X.2011.00182.x; abstract only) claim occurrence probability IS identifiable under random sampling of presence locations plus constant detection, and that MaxEnt is "extremely sensitive to specification of the background prevalence". Hastie & Fithian 2013 (Ecography 36:864-867, "Inference from presence-only data; the ongoing controversy") is the reply; I could NOT open it and only confirmed it exists through a Methods in Ecology and Evolution blog interview. **Contested:** Royle's identifiability rests on a parametric form (logit-linear in continuous covariates) and random presence sampling; Ward and Fithian-Hastie say that without such restrictions it fails. Both agree that with constraints it works and is fragile.

## 2. MaxEnt = Poisson process = logistic = PU (Q2)

| Equivalence | Source (opened?) | Statement |
|---|---|---|
| MaxEnt to Poisson regression / PPM | Renner & Warton 2013, Biometrics 69:274-281, doi:10.1111/j.1541-0420.2012.01824.x (abstract only) | MaxEnt is equivalent to a Poisson regression; they differ only in the intercept |
| MaxEnt to IPP, exactly | Fithian & Hastie 2013 (opened) | Same slope estimate; IPP = parametric density estimation, then multiply by n1 |
| IPP to logistic | Fithian & Hastie 2013 (opened) | Ordinary logistic gives a different beta in finite samples and under misspecification; infinitely weighted logistic regression (IWLR) equals the IPP exactly; unweighted logistic approaches it only as n1/n0 tends to 0. Their toy example: IWLR slope 1.325 vs ordinary logistic about 1.04 (n0 = n1) |
| Case-augmented design | Dorazio 2012 (cited in Fithian-Hastie, not opened) | Same equivalence as n0 tends to infinity |

**Map to PU learning (Elkan & Noto 2008, KDD pp. 213-220; full text opened).** Assumption: labeled positives are "selected completely at random" (SCAR). Lemma 1: with s=1 if labeled and c = p(s=1|y=1), p(y=1|x) = p(s=1|x)/c. A labeled-vs-unlabeled classifier estimates p(s=1|x); dividing by c recovers the true class probability. Estimators of c: e1 = mean of g(x)=p(s=1|x) over held-out labeled positives; e2 = sum of g over labeled / sum over all validation; e3 = max g. In their SwissProt experiment e1 was 0.1928, close to the true value. So **c plays the role that "prevalence" plays in ecology**: the one scalar that fixes the intercept. Presence-background modelling is PU learning with the background as the unlabeled set. Note c (labeling frequency) differs from pi (epitope fraction); given the number of labeled positives, either determines the other. Estimating either from data alone needs an irreducibility-type assumption (background knowledge; no source opened for this).

**Known prior for the epitope fraction (Q2):**
- Brief's proxy, 8GZ5 RBD-P17: 26/206 = 0.126 (an RBD-only construct).
- Ren et al. 2015 (BMC Bioinformatics 16 Suppl 18:S12; opened): conformational B-cell epitope dataset of 92 unbound structures, 2,123 epitope vs 16,615 unlabeled (ASA>0) residues = 11.3% (my arithmetic), conventional antibodies on assorted antigens.
- Frontiers in Immunology 2023, 14:1231623 (PMC10392943; opened): 345 sdAb-antigen complexes (309 with unique CDRs); sdAb epitope size not significantly different from antibody epitope size (mean difference 0.59 residues, p=0.22, 4.5 A distance definition; absolute sizes only in figures I could not read). SAbDab-nano (NAR 2022, doi:10.1093/nar/gkab1050) listed 1,585 nanobody structures in April 2024 and 1,972 single-domain structures (1,864 with antigen) in July 2025 per its statistics pages (search snippets only).
- **I did NOT find a per-structure epitope-fraction distribution for SAbDab-nano. This is an open gap; computing it from a SAbDab-nano download with Voronota-LT contact areas is a one-day job.**
- **Derived point:** the HER2 ECD is roughly 630 residues (UniProt P04626 about residues 23-652; from memory, verify). A VHH epitope of 20-26 residues gives pi about 0.03-0.04, three times lower than the 0.126 RBD proxy. The random PR-AUC baseline equals pi, so expect a floor near 0.03-0.04 on HER2. The proxy's AntiBinder PR-AUC of 0.176 (prior 0.126, lift 1.4) must be rescaled before being used as a target.

## 3. Sampling bias and its corrections (Q3)

| Ecology tool | Source (opened?) | What it does | Facts |
|---|---|---|---|
| Target-group background / bias file | Phillips, Dudik, Elith et al. 2009, Ecol Appl 19:181-197, doi:10.1890/07-2153.1 (abstract only) | Background with the same bias as presences, e.g. all records of a target group | 226 species; improved average performance for all methods, most under strong bias |
| Spatial sorting bias | Hijmans 2012, Ecology 93:679-688 (abstract only) | Test presences nearer to training presences than test background is, inflating AUC | 226 species, 6 regions, Bioclim and MaxEnt; a null model using only distance to training sites beat MaxEnt for 45% and Bioclim for 67% of species; pairwise-distance sampling brings the null AUC near 0.5 and reshuffles rankings |
| Block CV | Roberts et al. 2017, Ecography 40:913-929, doi:10.1111/ecog.02881 (abstract/summaries only) | Random CV understates error under dependence; use blocks matching the dependence structure | Dryad doi:10.5061/dryad.737gk |

**Which "sampling bias" is AVIDa-hHER2?** One alpaca, one panning round, two libraries. It is not the classic accessibility bias. Nearest analogues:
1. *Single-observer, single-locality survey*: one animal = one repertoire, a narrow non-random region of VHH sequence space. Hijmans-type bias at dataset level (every test sequence is near some training sequence) plus Lobo-type extent dependence.
2. *Non-detection* (Royle's detectability): one round gives low contrast, and binder labels come from a chi-squared test (p <= 0.05) on before/after proportions. "Non-binder" means "not detected as enriched", so these are PU-style unlabeled sequences labelled as negatives.
3. *Amplification/display bias*: infection and amplification skew enrichment independently of affinity (a 2023 mAbs study, doaj summary only; not opened).
4. Target-group background: use same-library, same-pipeline reads that did not enrich, so the bias cancels in the ratio. Do not use random external sequences as background; that is the error target-group background was invented to prevent.

None of these biases concerns which HER2 residues are sampled, because the reads never observe residues. Residue-level bias (immunodominance, glycan shielding, accessible patches) belongs to the epitope landscape, not the reads.

## 4. Validation: the ecological equivalent of a few hundred labelled binders (Q4)

Closest equivalent: a presence-absence validation set used to evaluate a presence-only model, or independent presence-only hold-outs scored with Boyce-type metrics. Lobo, Jimenez-Valverde & Real 2008 (Global Ecol Biogeogr 17:145-151, doi:10.1111/j.1466-8238.2007.00358.x; full text opened) give five reasons against AUC: it (1) ignores predicted probabilities and goodness-of-fit, (2) summarises ROC regions where one rarely operates, (3) weights omission and commission equally, (4) gives no information on the spatial distribution of errors, and (5, most important) depends heavily on total extent: enlarging the study area inflates well-predicted absences. Pseudo-absence background therefore makes absolute AUC values meaningless. Jimenez-Valverde 2012 (Global Ecol Biogeogr 21:498-507, doi:10.1111/J.1466-8238.2011.00683.X; abstract only) studies AUC against sensitivity/specificity by simulation and is cited for the same extent dependence.

Alternatives and the SEPIQ translation:
- **Continuous Boyce index** (Hirzel et al. 2006, Ecol Model 199:142-152; search summary only): Spearman correlation between the predicted-to-expected (P/E) ratio and suitability class; fairly insensitive to prevalence; implemented in R `ecospat.boyce` (moving window default 1/10 of the range). SEPIQ: bin residues by score, compute the P/E ratio of true contacts per bin against the expected count from the bin's residue share. Rank-based, complementary to PR-AUC.
- **PR-AUC with the prior as baseline**: SEPIQ already uses PR-AUC; report lift = PR-AUC / pi so complexes with different epitope fractions compare (Lobo's extent problem is PR-AUC's prior dependence).
- Hijmans-style **null model**: an RSA-only predictor (plus distance to known HER2 epitopes). Report model minus null.

## 5. Protein-side analogues (Q5)

| Work | What | Numbers |
|---|---|---|
| Ren, Liu, Ellis, Li 2015, BMC Bioinf 16 Suppl 18:S12 (opened) | PUPre: weighted SVM finds reliable negatives (recall above 95%), then weighted SVM; conformational B-cell epitopes | 92 unbound structures; 2,123 positive / 16,615 unlabeled residues; recall 0.71, precision 0.18, F 0.28, MCC 0.21 vs DiscoTope 2.0 recall 0.26, precision 0.17, F 0.21, MCC 0.11 (complex-based 10-fold CV). No AUC reported |
| DiscoTope-3.0 (bioRxiv 10.1101/2023.02.05.527174; fetch failed with HTTP 429; snippet only) | PU bagging (bootstrap of unlabeled class) on AF2 structures and inverse-folding latents | headline metrics not verified |
| Epitope benchmark snippets (search results only) | AUC-PR 0.20, 0.19, 0.24, 0.23 on an epitope3D benchmark for several tools; a protein-language-model approach on AbDb ROC-AUC 0.67, PR-AUC 0.56 | not opened; low confidence |
| Selection-round likelihood models (search results only) | biorxiv 10.1101/2020.03.18.996595; Bayesian models on selected pools (mAbs 2023) | not presence-only MaxEnt |

Negative results: I found no published use of presence-only SDM machinery on phage-display enrichment for epitope mapping, and no PU-learning paper specific to PPI class-prior estimation (closest hits were generic PU papers). The PU-for-epitopes precedent (PUPre, DiscoTope-3.0) is real and its numbers are modest: precision about 0.18 at recall 0.71.

## 6. Where the niche analogy breaks (Q6)

| Ecology | SEPIQ | Break |
|---|---|---|
| Site (grid cell) | HER2 surface residue | residues form an irregular, sterically coupled 3D graph |
| Covariates measured at every site | per-residue features computed from a predicted structure | covariates are inferred, with error |
| Presence record | residue in contact with a VHH | there are zero direct presence records for HER2 in the data; reads are sequence-level |
| 10^2-10^4 presences per species | hundreds of weak sequence labels, 0 residue labels | wrong grain |
| One species, one niche | each VHH has its own epitope; test = 3 VHHs on 1 antigen | niche is conditional on the VHH |
| Bias is spatial | bias is in sequence repertoire | different object (sect. 3) |

**Covariates (per HER2 residue):** RSA from an AF3/OpenFold3/Boltz model of the ECD; hydrophobicity and charge; N-glycosylation sequons (N-X-S/T, trivial to compute from P04626) and distance to glycan-bearing Asn; domain label I-IV (approximate boundaries from memory 23-195, 196-319, 320-488, 489-630; verify in UniProt); pLDDT; protrusion/curvature; distance to known HER2 antibody epitopes.

**Three inputs available within 14 days:**
1. A predicted HER2 ECD from an AF3-class model (OpenFold3, Boltz, Chai-1 explicitly allowed) giving RSA and pLDDT.
2. Public HER2-antibody/nanobody complexes from PDB/SAbDab (labeled positives, domains) and SAbDab-nano antigens as a target-group set of other surfaces.
3. AVIDa-hHER2 read counts (enrichment of near-identical CDR3 neighbours of the three clones as a per-VHH confidence weight) and the ONU11/13/23 sequences from sepiq.uk/detail to run predicted complexes.

## Forced analogy: Philosophy of science via ecology

**(a) Statement.** A niche is inferred from presences only and validated on a few held-out blocks. HER2's "niche" is the residue set VHHs occupy; enriched reads are the presences; the three cryo-EM complexes are the held-out blocks.

**(b) What can three held-out items say?** I simulated residue-level scoring on a 630-residue antigen (binormal scores, 3,000 replicates; own code C:\Temp\sepiq26\q9\sim.py; residues assumed independent, which flatters the model):

| true positives (prior) | per-residue AUROC | mean AP | SD single-complex AP | SD macro-3 AP |
|---|---|---|---|---|
| 20 (0.032) | 0.65 | 0.080 | 0.035 | 0.020 |
| 20 (0.032) | 0.75 | 0.142 | 0.056 | 0.031 |
| 20 (0.032) | 0.85 | 0.279 | 0.089 | 0.054 |
| 26 (0.041) | 0.75 | 0.165 | 0.056 | 0.031 |

Even a fixed, honest model has a macro-3 AP SD of 0.02-0.05 from residue sampling alone, before choice-of-complex variance (unmeasured, would add more). So three held-out complexes can falsify a strong claim ("AP clearly above the 0.03-0.04 baseline") but cannot rank two models that differ by about 0.03: Popperian falsification yes, Duhem-style model selection no. It matches Roberts et al.: the block is the unit of independence, so n=3 blocks means n=3 effective samples.

**(c) Unknown prevalence = unknown epitope fraction?** Statistically yes (both are the non-identifiable intercept/prior). For the score, **no**: within-complex PR-AUC depends only on ranking, and the intercept is a monotone shift, so Track A does not require solving it. It matters only for calibrated probabilities if a metric pools or thresholds (/guideline says macro per-complex PR-AUC; /detail leaves the leaderboard metric unspecified, the q4 contradiction).

**(d) Verdict: PARTLY HOLDS.** Holds: PU/Poisson/logistic equivalence, intercept non-identifiability, rank invariance, null-model and block-CV discipline, the AUC critique. Breaks: no per-residue presences in the training data, predicted rather than measured covariates, bias lives in sequence space, n=3.

## One-page mapping table (ecology term, SEPIQ term)

| Ecology term | SEPIQ term |
|---|---|
| Site / grid cell | HER2 residue (or surface patch) |
| Environmental covariate x(z) | RSA, hydrophobicity, glycan distance, domain, pLDDT from a predicted structure |
| Presence record | residue in a Voronota-LT contact with a VHH (known only for PDB complexes) |
| Background / unlabeled sites | all other HER2 residues (PU unlabeled) |
| Intensity lambda(x) | relative epitope propensity |
| Prevalence pi / intercept | epitope fraction (about 0.03-0.04 of HER2 ECD, unverified; 0.126 RBD proxy) |
| Elkan-Noto c | labeling frequency of true epitope residues in the positive set |
| Sampling bias / bias file | immunodominance, glycan shielding, repertoire bias |
| Target-group background | residues of antigens passing the same SAbDab-nano filter |
| Spatial block | HER2 domain or leave-one-antigen-out fold |
| Spatial sorting bias | test epitopes adjacent to training epitopes (leakage) |
| AUC extent problem | PR-AUC prior dependence; report lift = PR-AUC / pi |
| Boyce index | P/E ratio vs score bin, Spearman |
| Null model (Hijmans) | RSA-only / domain-prior predictor |

## Testable recipe: PU/MaxEnt-style per-residue model on HER2 with a fixed prior
1. Unit: each residue r of chain A with covariates x_r (sect. 6). Positives: interface residues from public HER2-antibody/VHH complexes (optionally other nanobody-antigen complexes pooled as a target group). Unlabeled: the remaining residues of those antigens.
2. Fit an L1/ridge logistic model labeled-vs-unlabeled with heavy weight on the unlabeled set (IWLR-style, Fithian-Hastie) to obtain beta; ranking depends only on beta.
3. Fix the intercept: choose alpha so that mean_r sigmoid(alpha + f(x_r)) = pi_HER2 (central 0.035, sensitivity 0.02-0.06), the Ward / Phillips-Elith known-prevalence constraint; equivalently Elkan-Noto division by c with c solved from pi.
4. Output for ONU11/13/23: the same HER2 probability vector (values in [0,1]) unless per-VHH docking reweights it; optional second stage multiplies by a contact score from an AF3-class prediction of each VHH-HER2 pair. VHH-side (chain B) paratope: a separate CDR-position prior.
5. Validation by spatial blocks: (a) leave-one-antigen-out over SAbDab-nano antigens (block = antigen); (b) leave-one-HER2-domain-out using public HER2 complexes (low power, honest); (c) paired cluster bootstrap (B=2000, as the organisers), reporting the RSA-only null, lift and Boyce alongside PR-AUC.
6. Pre-registered rule: if macro lift over the RSA-only null on (a) is below 1.2 or its CI spans 0, submit the null plus docking; if above 1.5, submit the PU model.
7. Expected score from the simulation: per-residue AUROC 0.75 gives AP about 0.14-0.17 on HER2 (about 4x the prior) with macro SD about 0.03. Simulated, not measured.

## Gotchas / what could fool us
- Quoting PR-AUC from the 8GZ5 proxy (prior 0.126) as a target for HER2 (prior about 0.03-0.04): a 3x floor error.
- A rank score hides the intercept problem; a "probability" submission is only calibrated if pi is fixed and sources agree on it.
- Treating the clones' own enrichment as residue-level presence: enrichment is sequence-level and cannot separate epitopes.
- SCAR is violated by construction when positives come from PDB HER2 complexes (domains II and IV dominate; immunodominance), so Elkan-Noto c is not constant over x.
- Spatial sorting bias: test epitopes may sit beside trastuzumab/pertuzumab epitopes; a distance-to-known-epitope null can score well without learning (Hijmans: null beat MaxEnt for 45% of species). The organisers say leakage is fine "as long as the answer is correct"; legal, but say which scientific claim you are making.
- AUC extent dependence (Lobo): adding easy negatives (signal peptide, buried residues) inflates ROC-AUC; PR-AUC also moves with the prior. Keep the residue denominator fixed; omitted residues count as 0.
- Single-complex PR-AUC from 20-26 positives has SD about 0.056 (simulated), likely larger than gaps between leaderboard teams.
- Snippet-level numbers (AUC-PR 0.19-0.24, ROC-AUC 0.67) come from other benchmarks with different priors and were not opened.

## Implications for the challenge
1. Do not spend effort estimating the epitope fraction: per-complex PR-AUC is rank-invariant to it. Fix pi about 0.035 only to produce sensible 0-1 values.
2. Build the null first (RSA, domain, glycan distance); report all gains as model minus null.
3. Compute the SAbDab-nano epitope-fraction distribution (4.5 A vs Voronota-LT area definitions) in one day; it settles pi and the proxy rescaling.
4. Validate by leave-one-antigen-out and leave-one-domain-out, never random residue splits; report lift, Boyce and the paired cluster bootstrap.
5. Treat AVIDa-hHER2 labels as PU/non-detection data; use non-enriched same-library reads as background for any sequence-level model, never external sequences.
6. Spend the 14 days on better covariates (AF3-class HER2 plus per-VHH docking): the analogy says the signal lives in the covariates, not in a fancier PU loss.

## Open questions
- Epitope-fraction distribution in SAbDab-nano and in HER2 antibody complexes (not found).
- Whether the official leaderboard metric is macro per-complex PR-AUC or pooled.
- Full texts of Hastie & Fithian 2013 (Ecography), Ward 2009, Roberts 2017, Hijmans 2012, Hirzel 2006, Renner & Warton 2013, Phillips 2006/2009 were not opened; statements rest on abstracts and secondary sources as marked.
- Does per-VHH docking add information beyond the shared HER2 propensity map, given n=3?
- HER2 domain boundaries and ECD length are from memory.

## Sources (opened = full text read; otherwise abstract/snippet only)
- Fithian & Hastie 2013, doi:10.1214/13-AOAS667; https://arxiv.org/pdf/1207.6950; https://pmc.ncbi.nlm.nih.gov/articles/PMC4258396 (opened)
- Elkan & Noto 2008, https://cseweb.ucsd.edu/~elkan/posonly.pdf (opened)
- Lobo, Jimenez-Valverde & Real 2008, doi:10.1111/j.1466-8238.2007.00358.x, https://www.whoi.edu/cms/files/Global_Ecology_and_Biogeography_2008_Lobo_53565.pdf (opened)
- Wang & Stone 2018, https://arxiv.org/pdf/1801.01326 (opened; secondary source for Ward 2009)
- Ren et al. 2015, https://pmc.ncbi.nlm.nih.gov/articles/PMC4682424/ (opened)
- Frontiers Immunol 2023, https://pmc.ncbi.nlm.nih.gov/articles/PMC10392943 (opened)
- Ward et al. 2009, doi:10.1111/j.1541-0420.2008.01116.x, https://ideas.repec.org/a/bla/biomet/v65y2009i2p554-563.html (bibliographic page only)
- Phillips, Anderson & Schapire 2006, doi:10.1016/j.ecolmodel.2005.03.026 (citation only)
- Royle et al. 2012, doi:10.1111/j.2041-210X.2011.00182.x, https://pubs.usgs.gov/publication/70039008 (abstract)
- Hastie & Fithian 2013 Ecography, existence via https://methodsblog.com/2013/09/02/an-interview-with-trevor-hastie/
- Renner & Warton 2013, doi:10.1111/j.1541-0420.2012.01824.x (abstract)
- Phillips et al. 2009, doi:10.1890/07-2153.1 (abstract)
- Hijmans 2012, Ecology 93:679 (abstract)
- Roberts et al. 2017, doi:10.1111/ecog.02881 (abstract)
- Hirzel et al. 2006, Ecol Model 199:142 (search summary)
- Jimenez-Valverde 2012, doi:10.1111/J.1466-8238.2011.00683.X (abstract)
- SAbDab-nano statistics, https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab/nano/stats (snippet)
- DiscoTope-3.0, https://www.biorxiv.org/content/10.1101/2023.02.05.527174 (not opened)
- Own simulation: C:\Temp\sepiq26\q9\sim.py
