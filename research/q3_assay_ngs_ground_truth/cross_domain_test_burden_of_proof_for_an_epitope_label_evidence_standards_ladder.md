---
title: Cross-domain test - burden of proof for an epitope label (evidence-standards ladder)
queen: q3_assay_ngs_ground_truth
king: king_world
worker: cross_domain_test_burden_of_proof_for_an_epitope_label_evidence_standards_ladder
tier: expert
tags: [law-of-evidence, Daubert, PCAST, NAS-2009, evidence-ladder, label-noise, PU-learning, confident-learning, AVIDa-hHER2, lens-ranking]
confidence: medium
challenge_relevance: 2
serendipity: Put the assay chain on trial (Daubert, PCAST, burden of proof). It paid off in two ways. It showed that the label fails the "fit" test for epitope, and it showed that p<=0.05 read as "95 % real" is the prosecutor's fallacy (PPV about 27 % at a 3 % prior). Most of the rest re-labels positive-unlabelled learning that a statistician already knows.
date: 2026-10-17
---

## TL;DR
Tried as evidence, the AVIDa-hHER2 chi-squared "binder" label would be admitted for one narrow claim, "this clone's read share rose on HER2 panning". It would be excluded for the claim Track A needs, "this clone touches these HER2 residues", because the assay does not "fit" that question (Daubert). Its nominal false-positive rate (about 2.5 % one-sided, 5 % two-sided, uncorrected) is 10 to 30 times worse than the latent-print rates PCAST accepted (0.17 %, upper bound 0.33 %), and with a roughly 3 % prior it gives a positive predictive value of only about 27 %. The framing's main design value is the asymmetry of burden: treat "non-binder" as unlabelled, and rank labels by corroboration. Nothing here was tested on the gated table. Every rung count below is an estimate from stated assumptions.

## 0. What was and was not opened
| Item | Status |
|---|---|
| PCAST 2016 full report (PDF, text-extracted locally) | Opened. Numbers below are quoted from it |
| Daubert (Cornell LII copy of 509 U.S. 579) | Opened, via the fetch tool's extracts |
| NAS 2009 "Strengthening Forensic Science" | The NAP pages returned only front matter. The headline finding comes from a search summary (medium confidence) |
| Northcutt et al. confident learning | arXiv abstract page opened. Full text not read |
| Elkan and Noto KDD 2008 | PDF extracted and read (Lemma 1, SCAR, e1 and e3) |
| AVIDa-hHER2 card | `COGNANO/AVIDa-hHER2` returns 401 (the two sibling workers found the same). Dataset facts come from the sibling files in this directory (dataset anatomy; biopanning physics), which opened the AVIDa-hIL6 and AVIDa-SARS-CoV-2 papers and the public SEPIQ card |
| Ecology, screening and art lenses | Reasoned from general knowledge only. No sources opened for those lenses |

## 1. The full cross-domain test: legal concept mapped to assay counterpart
Estimates marked (est.) are mine. Items marked (sib.) come from the sibling workers' files.

| Legal concept | Assay counterpart | Measurable proxy | Numerical estimate |
|---|---|---|---|
| Admissibility: testability | Can "clone enriches on HER2" be falsified? | Replicate libraries or sublibraries, re-panning | Testable. Two libraries exist (site). Whether replication was used per clone is unknown |
| Known or potential error rate | FPR of the enrichment call | Null-clone call rate; ELISA or BLI agreement | Nominal 2.5 % one-sided. Effective 4 to 10 % after overdispersion (1.25 to 1.5x Poisson variance in peptide data, Matochko 2013, via sibling file) (est.). Min-p over k sublibraries inflates it: 1-0.975^k, about 5 % at k=2. hIL6 agreement was 20/20 on a hand-picked set (sib.) |
| Peer review | Method published | Venue | Yes for the method family (AVIDa-hIL6 NeurIPS 2023; AVIDa-SARS-CoV-2 2024). No hHER2 paper found |
| Standards controlling operation | Fixed thresholds and negative-control rules | Written cascade | Present: IE-score cascade, 1.3 equals p 0.05, noise filter (sib.). Absent in the hIL6 paper: multiple-testing correction |
| General acceptance | Community use of enrichment labels | Citations, reuse | Accepted as an ML benchmark label. Not established for epitope inference |
| Fit (Daubert) | Does the assay answer "which residues"? | Information content about location | Near zero. Panning is on whole HER2 ECD with no domain-resolved readout |
| Standard of proof, civil (balance of probabilities) | PPV > 0.5 for "enriched specifically on HER2" | Bayes PPV | About 27 % (one library, 3 % prior, see below) (est.). Not met without further rungs |
| Standard of proof, criminal (beyond reasonable doubt) | PPV >= 0.95, or FPR upper bound <= 1 % | About 300 error-free validations (3/n rule; PCAST fn 116: 0 of 100 gives 3.0 %) | Met only by cryo-EM (3 complexes, held out) |
| Burden of proof | Who must show a label is real? | Default state of an unlabelled clone | On "binder". `Not` only shows a share fell (compositional) |
| Corroboration | Independent assays or libraries agree | Fraction of labels with a second assay | hHER2: no orthogonal ELISA or BLI found. Replication only across libraries and clonal family |
| Chain of custody | Handoffs from immunisation to read count | Ten-step table in the sibling file | Never documented per clone. Each handoff adds some bias (sib.) |
| Hearsay | Label reports binding rather than observing it | Is binding itself observed? | Every label is hearsay for binding, and double hearsay for epitope |
| Expert witness | The labelling script or a model asserting a label | Calibration against ground truth | Calibration unmeasured for hHER2 |
| Prosecutor's fallacy | Reading P(enriched given not binder)=0.05 as P(not binder given enriched)=0.05 | PPV vs p-value | PPV about 27 % at 3 % prior, about 75 % at 20 % prior (sens 0.6) (est.) |

PPV = sens x prior / (sens x prior + FPR x (1 - prior)), computed by me:

| Setting | Sens | FPR | Prior | PPV |
|---|---|---|---|---|
| One library, uncorrected | 0.6 | 0.05 | 0.03 | 27 % |
| One library, curated set | 0.6 | 0.05 | 0.20 | 75 % |
| Concordant in two independent libraries | 0.36 | 0.0025 | 0.03 | 82 % |

The 0.0025 assumes independence. Shared display and PCR bias for the same clone make it optimistic. A clone must also be present with power in both libraries, and the fraction that is is unknown.

## 2. Forensic precedents with numbers
All from the PCAST 2016 report (opened).

| Evidence class | Measured false-positive rate | PCAST statement |
|---|---|---|
| Latent prints, large black-box study (6 false IDs in 3,628 non-mated pairs) | 0.17 %, upper 95 % bound 0.33 % (1 in 306) | "foundationally valid", with a false positive rate "substantial" and likely higher than jurors expect |
| Latent prints, another study (17 of 711) | 2.4 %, upper bound 3.5 % (1 in 28) | cited among the studies |
| Latent prints, another study (42 of 995) | 4.2 %, upper bound 5.4 %; 0.7 % if 35 probable clerical errors are excluded | PCAST: excluding errors post hoc in validation is inappropriate |
| Firearms, first appropriately designed black-box study (Ames lab) | 1 in 66, upper bound 1 in 46 (about 2.2 %) | one study, not published in a journal at the time |
| Hair, microscopic | earlier studies suggested 1 in 40,000; PCAST says many earlier studies underestimated FPR by at least 100-fold | not foundationally valid |
| Bite marks | "typically above ten percent and sometimes far above" | "far from meeting the scientific standards for foundational validity" |

Rules PCAST states that transfer directly:
- Foundational validity needs empirical studies showing the method is "repeatable, reproducible, and accurate, at levels that have been measured and are appropriate to the intended application". Subjective methods need multiple appropriately designed black-box studies.
- Report the upper 95 % one-sided bound, not the point estimate. Zero errors in 100 tests gives 3.0 %. Zero in 10 gives 26 %.
- Compute rates over conclusive calls only. Closed-set designs underestimate FPR.

Daubert (509 U.S. 579, 1993), as quoted by the pages I opened: whether it "can be (and has been) tested"; peer review; "the known or potential rate of error"; "the existence and maintenance of standards controlling the technique's operation"; general acceptance; and "fit". The inquiry is "a flexible one". NAS 2009, from a search summary only: with the exception of nuclear DNA analysis, no forensic method had been shown to connect evidence to a specific source consistently and with high certainty.

**Threshold, honestly stated.** Neither source gives a number that makes an evidence class inadmissible. PCAST demands a measured, application-appropriate error rate from multiple studies and sets no cutoff. In practice it accepted a 0.33 % upper bound, treated a single 2.2 % firearms study as not yet enough, and rejected 10 %+ and unmeasured classes. My working translation (est.): a class is defensible as individualising evidence if its upper FPR bound is a few percent or lower and measured in several black-box studies. It is acceptable as screening evidence if its PPV is at least 50 %.

**Where the chi-squared label falls.** Nominal FPR of 2.5 to 5 % sits at or above the weaker PCAST-accepted studies and 10 to 30 times above the best one. It is far below bite marks. The larger gap is that the FPR has never been measured empirically for hHER2 (no black-box study), which is the PCAST failing, more than the number itself. Verdict: admissible as screening evidence of enrichment, inadmissible as evidence of epitope.

## 3. The evidence ladder for training labels
Dataset facts used: 1,843,875 unique VHH sequences (SEPIQ card); about 10^5 paired reads per library, one panning round (site); "a few hundred" labelled (site). The exact counts of `Yes` and `Not` are unknown because the table is gated. I use N_L = 300 labelled as an illustration, and a binder share of 30 % (assumption; hIL6 is 3.7 %, SARS-CoV-2 is 28.6 %).

| Rung | Evidence required | Standard approximated | Surviving sequences (illustrative) | Basis |
|---|---|---|---|---|
| L0 | Read present in the NGS table | Mere allegation | 1,843,875 (100 %) | card |
| L0.5 | Has any binder or non-binder label (power filter) | Allegation with a procedure | about 300 (0.016 %) | "few hundred" |
| L1 | Label `Yes` (IE-score cascade, p <= 0.05) | Weak balance of probabilities, PPV about 27 % | about 90 | assumed 30 % share |
| L2 | Enrichment fold >= threshold in both libraries | PPV about 80 % if independent | about 20 to 55 (est. 25 to 60 % of L1; depends on how many clones occur in both libraries) | est. |
| L3 | L2, plus at least one more member of the 93 % cluster also `Yes` | Corroborated by a related but not independent witness | about 5 to 25 (est. 20 to 45 % of L2) | est. |
| L4 | Orthogonal ELISA or BLI | Near beyond reasonable doubt for "binds HER2" | none found for hHER2 | no source |
| L5 | Cryo-EM contact map | Beyond reasonable doubt for epitope | 3 (ONU11, ONU13, ONU23), all held out | brief |

Reading the ladder:
- The count falls by about 4 orders of magnitude from L0 to L1 and then by 2 to 4 times per rung. Only L1 to L3 can supply training signal. L4 and L5 supply the test.
- No rung below L5 carries residue-level information. Epitope or paratope labels come only from structures, so public data (SAbDab, PDB) has to supply them.
- To show an FPR upper bound of 1 % for the L1 label would need about 300 error-free orthogonal checks (3/n). Twenty clean checks, as hIL6 did, bound precision only at about 86 % or higher (0.05^(1/20)), and only for a hand-picked set.

## 4. Modelling advice and what survives
Papers: Elkan and Noto, KDD 2008 (full text read); Northcutt, Jiang and Chuang, JAIR 2021, arXiv 1911.00068 (abstract only).

| Decision | Verdict | Reason |
|---|---|---|
| Sample weights by rung (L1 < L2 < L3) | Justified for binder and paratope pre-training. Killed for epitope | The weights order rows by PPV, which is real information. But no rung below L5 holds residue-level information, so weighting cannot create an epitope signal |
| PU framing: `Yes` as positive, everything else including `Not` as unlabelled | Justified in principle. The Elkan-Noto correction does nothing for PR-AUC | Lemma 1: p(y=1 given x) = p(s=1 given x)/c with c = p(s=1 given y=1). Dividing by a constant does not change the ranking, and PR-AUC is rank-based, so the estimate of c (e1 or e3) is irrelevant for ranking |
| SCAR assumption | Violated | Elkan and Noto need labelled positives "selected completely at random". Here labelling depends on read count, display and power, so c depends on x and the lemma does not hold as stated. A propensity-weighted PU variant would be needed. I did not open one, so I cite none |
| Confident learning (cleanlab) | Dud at this N | It assumes class-conditional noise and needs good out-of-sample predicted probabilities. With about 300 labels and features with no shown signal, it has no basis to flag errors, and the noise here depends on abundance, not only on class |
| Clonal-family agreement as "corroborating witnesses" | Partly justified | Concordance within a 93 % cluster raises PPV. But relatives share lineage and display bias, so they are not independent. Treat the family as one witness with a bonus |

Counts under the illustrative assumptions: L1 about 90, L2 about 20 to 55, L3 about 5 to 25. These are far too few to train a residue-level model from scratch. The honest uses are a binder-versus-unlabelled prior, or choosing 5 to 25 confident clones for co-folding checks.

## 5. The five lenses tested for a usable design decision
Only the law lens was worked in full. The other four are judged from general reasoning with no sources opened for them, so the ranking is my untested judgement.

| Rank | Lens | Usable, quantitative, non-obvious decision for Track A? | Verdict |
|---|---|---|---|
| 1 | Healthcare screening base rates | Yes. Random PR-AUC equals prevalence (about 0.126 on the BRIEF's proxy complex 8GZ5, 26 of 206). A label's PPV depends on the prior, as in section 1. Report PR-AUC as lift over prevalence per complex | Useful, though partly obvious to a statistician |
| 2 | Law of evidence | Yes. Burden asymmetry (non-binder is unlabelled), "fit", the prosecutor's fallacy (27 % PPV), graded weights | Useful. It mostly re-labels PU learning and PPV arithmetic, but the ladder forces explicit numbers |
| 3 | Ecology niche modelling | Possibly. Presence-only species data is also positive-unlabelled with the same prevalence-identifiability issue. Smoothing scores over neighbouring surface residues suits a patch-shaped target. Unsourced here | Plausible, not verified. The smoothing idea is obvious from structure |
| 4 | Forensic science | Partly. PCAST reporting rules transfer: upper confidence bounds, conclusive calls only, no post hoc error exclusion. With only 3 test complexes the bounds are very wide | Same advice as the law lens, valuable for honest validation reporting |
| 5 | Art restoration | No number or decision | Decoration |

## Forced analogy: law of evidence (the chi-squared label as a witness)
(a) The chi-squared enrichment is a witness testifying that a clone's share rose. Cryo-EM is the court's judgment on location. Cross-examination asks how often the witness testifies falsely (FPR), whether the testimony is relevant to the charge (fit), whether anyone corroborates, and who bears the burden. (b) Testable idea: build the ladder weights from section 3, train a binder-versus-unlabelled model on L1 to L3 clones with cluster-held-out splits, and test whether its scores rank residues in public VHH complexes (SAbDab-nano) above a prevalence baseline. Also compare equal weights on all L1 clones against L3 only. Not run: the table is gated and no local compute was done. (c) The analogy holds well for label confidence and burden asymmetry, and partly for the ladder. It breaks for epitope, where nothing below the structure speaks to location, and it breaks on witness independence, because clonal relatives are not independent witnesses.

**Aha 1: asymmetry of burden.** The burden sits on the party asserting, which here is "binder". `Not` says a share fell, which in a compositional readout happens to any clone captured below the pool average. So `Not` is absence of evidence and should enter a model as unlabelled. The sibling file estimates that 5 to 25 % of labelled non-binders actually bind HER2.

**Aha 2: fit.** The assay can be well validated for a different question than the one asked. Daubert separates "is the test valid" from "does it answer this case". The enrichment label can pass the first and still say nothing about residues.

**What "folding from binding" must show to be believed.** In rungs. First, foundational validity: on public complexes with known contacts, a model using sequence plus enrichment-type labels must beat a prevalence baseline, with a stated upper confidence bound, across several independent held-out clusters. Second, validity as applied: the same on the three held-out cryo-EM complexes. With only 3 test complexes, PCAST-style arithmetic applies: a good result on 3 cannot rule out chance by a wide margin. It would also need a mechanism, since the labels carry no direct residue information. Until replicated, it is a weak-evidence claim.

## Gotchas / what could fool us
1. The 27 % and 82 % PPV figures are arithmetic on assumed sensitivity, FPR and prior. Treat them as illustration.
2. "A few hundred labelled" may reflect a read-count floor and control filters. That would raise real PPV above my single-library figure and bias labelled clones toward abundant ones.
3. Two libraries are independent only if a clone appears in both with enough reads. The overlap is unknown and may be small.
4. Rung counts assume a 30 % binder share. At 3.7 % (hIL6), L1 is about 11 clones and L3 is about 1 to 3.
5. Clonal-family concordance can come from one lineage with a shared display advantage, not shared binding.
6. A PU or confident-learning method run on features with no signal still returns confident-looking output.
7. PCAST numbers come from studies with different designs. The forensic table is a range, not a clean ladder.
8. NAS 2009 wording is from a search summary, not the opened report.

## Implications for the challenge
1. Treat `Not` as unlabelled. Never use it as a hard negative for paratope or epitope learning.
2. Build the graded label (L1, L2, L3) once the gated table is available, and count the real rung sizes first. If L3 is under about 10 clones, do not train on labels. Use them only to pick candidates for co-folding checks.
3. For ranking, skip the Elkan-Noto c correction. It does not change PR-AUC. The real problem is abundance-driven, non-random labelling.
4. Skip confident learning at about 300 labels.
5. Always split by 93 % cluster. Report PR-AUC as lift over per-complex prevalence, with bootstrap bounds as PCAST would.
6. Do not claim "folding from binding" works from three test complexes. Report it as weak evidence with intervals.

## Open questions
- Real counts of `Yes`, `Not`, `noise` and `non-sig.`, and how many clones appear in both libraries. These would replace every illustrative rung count.
- Does any orthogonal assay or competition panel (trastuzumab, pertuzumab) exist that could serve as L4 for some clones?
- Which PU method is right when labelling depends on abundance? No such paper was opened.
- Exact NAS 2009 wording from the report itself.

## Sources (opened)
- PCAST 2016, "Forensic Science in Criminal Courts" (PDF): https://obamawhitehouse.archives.gov/sites/default/files/microsites/ostp/PCAST/pcast_forensic_science_report_final.pdf
- Daubert v. Merrell Dow, 509 U.S. 579 (Cornell LII copy): https://www.law.cornell.edu/supct/html/92-102.ZO.html
- Northcutt, Jiang, Chuang, Confident Learning, JAIR 2021 (abstract page): https://arxiv.org/abs/1911.00068
- Elkan and Noto, KDD 2008 (PDF): https://cseweb.ucsd.edu/~elkan/posonly.pdf
- NAS 2009 finding: search summary only (medium confidence); the report text was not opened (https://www.nationalacademies.org/read/12589/chapter/1 returned front matter only)
- Sibling worker files in this directory (dataset anatomy; biopanning physics), which opened AVIDa-hIL6 (arXiv 2306.03329), AVIDa-SARS-CoV-2 (arXiv 2405.18749), the public SEPIQ card and sepiq.uk /detail
- Failed: https://huggingface.co/datasets/COGNANO/AVIDa-hHER2 (HTTP 401); https://supreme.justia.com/cases/federal/us/509/579/ (HTTP 403)
