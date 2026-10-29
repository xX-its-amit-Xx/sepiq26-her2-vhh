---
title: "HER2, nanobodies and the SEPIQ 2026 guessing game: a plain-language story"
author: scribe
tier: layman
date: 2026-10-17
---
<!-- changed: no Emperor draft v1 existed on disk when this was written, so this is written fresh from the two king logs and nine queen digests. Corrections applied from the hive: three test complexes (not seven), HER2 contact base rate about 3-5 percent (not 12.6 percent), 19,367 labelled sequences (not "a few hundred"), and the data-representation hypothesis recorded as killed. -->

## 1. HER2: a cancer protein with a big outer surface

Every cell is wrapped in a skin studded with proteins that act like antennae. HER2 (also called ERBB2) is one of them, and it belongs to a small family of four related receptors that pass growth signals into the cell. The part sticking out of the cell is the ectodomain, a chain of about 630 amino acids (the small building blocks of every protein) folded into four beads called domains I, II, III and IV. In some cancers the cell makes far too much HER2. In a large public cancer database, 362 of 10,712 tumour samples (3.4 percent) carried extra copies of its gene, and the rate reached 15.4 percent in oesophageal, 13.2 percent in stomach and 11.5 percent in breast cancer samples.

That is why drug makers care. An antibody drug called trastuzumab (Herceptin) was approved by the US regulator in 1998; it grips domain IV, the bead nearest the cell membrane. A second antibody, pertuzumab (2012), grips domain II, which is the arm HER2 uses to pair with its siblings. Later drugs bolt a toxic payload onto trastuzumab. Yet the surprise for our contest is how little of HER2 has ever been seen in contact with a drug. Approved antibodies touch only 42 of the 630 residues (6.7 percent). All 25 distinct antibodies with published pictures together touch 213 (33.8 percent). Most of the surface is unexplored.

A word on numbering, because it matters later. Scientists count HER2's residues from the start of its full genetic instruction, which includes a 22-residue "signal" tag that is cut off before the protein reaches the surface. Older papers count after the cut. The two systems differ by 22, and mixing them silently ruins a prediction.

<!-- src: research/q1_her2_biology/_QUEEN_DIGEST.md; research/q1_her2_biology/her2_in_cancer_amplification_isoforms_transcripts_epigenetics_ptms_glycans.md; research/q1_her2_biology/her2_therapeutic_antibodies_adcs_epitopes_trastuzumab_pertuzumab_margetuximab_and_binding_footprints.md -->

## 2. What a nanobody is, and where it grabs

Humans make antibodies shaped like a Y, built from two heavy and two light protein chains. Camels, llamas and alpacas also make a second, simpler kind with heavy chains only. Its antigen-grabbing end, a single small domain, is called a VHH, or nanobody. It is small, stable, and easy to produce in bacteria. Four medicines built from nanobody parts have been approved since 2018, though none targets HER2.

The part of the nanobody that touches its target is the paratope. The patch on the target it touches is the epitope. A nanobody has three hypervariable loops named CDR1, CDR2 and CDR3 (complementarity-determining regions), held in place by a steadier scaffold called the framework. The third loop, CDR3, is the star: in a large survey it held 46 percent of the nanobody residues that touch the target. But the scaffold is not idle. About 24 percent of contacts fall outside the three loops, mostly at four framework positions.

This gives a first practical lesson. Guessing the nanobody half of an interface is comparatively easy, because the loops are predictable. Guessing which part of HER2 gets touched is hard, because HER2 is big and each nanobody can land somewhere different. Only four public pictures of nanobodies on HER2 exist, and none of the three mystery nanobodies in the contest has a loop-3 sequence within 70 percent identity of any of them, so nobody can copy a published answer.

<!-- src: research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md; research/q2_vhh_immunology_structure/nanobody_therapeutics_and_engineering_history_caplacizumab_to_bispecifics.md -->

## 3. How the experiment makes its labels, and where it bends the truth

The training data come from a chain of laboratory steps. First, an alpaca is injected with human HER2 so that its immune system makes antibodies against it. Second, the genes for the animal's nanobodies are copied into viruses that infect bacteria (phages), each virus displaying one nanobody on its surface. This is phage display. Third, the viruses are poured over HER2 stuck to a surface, the loose ones are washed off, and the sticky ones are recovered. That fishing step is biopanning, and here it was done for just one round. Fourth, the genes before and after fishing are read by next-generation sequencing (NGS), which yields counts of each sequence.

The resulting table holds 1,843,875 distinct nanobody sequences, of which 19,367 carry a label: 7,316 "Yes" and 12,051 "Not". A sequence earns "Yes" when its share of the reads rose after fishing and a simple statistical test (a chi-squared test, essentially asking whether the rise is bigger than chance) gave p at or below 0.05. This is a hint of stickiness, not proof. Only 49.5 percent of the "Yes" sequences were confirmed in a repeat, and 59 percent had no reads at all in the starting pool. Crucially, a "Yes" says nothing about where on HER2 the nanobody grips.

The answer key for judging is different: a cryo-EM picture (a flash-frozen sample imaged by electron microscope) of each complex at roughly 3 angstroms resolution, turned into a list of residues that touch. At that sharpness some residues cannot be placed: one public nanobody-HER2 picture at 3.06 angstroms had only 510 of 752 deposited residues modelled.

<!-- src: research/q7_data_representation_integration/_QUEEN_DIGEST.md; research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md -->

## 4. The challenge and the score, in plain words

SEPIQ (a London organisation, with the company COGNANO supplying data and the docking-challenge group CAPRI involved) asks teams to predict, for three held-out complexes named ONU11, ONU13 and ONU23, which HER2 residues and which nanobody residues touch. In Track A, each team files one spreadsheet per complex giving a probability from 0 to 1 for every residue. The window runs from 2026-09-01 to 2026-10-31; the organisers announce results on 2026-12-15, and up to five submissions per team are allowed. Prizes are $3,000, $2,000 and $1,000.

The score is PR-AUC, the area under a curve that trades precision (of the residues you flag, how many are right) against recall (of the true ones, how many you found). It is computed for each complex and averaged over the three. Because only about 3 to 5 percent of HER2 residues touch the nanobody, random guessing scores near 0.03 to 0.05 on the HER2 side, and a perfect predictor still falls short of 1 because the true answer is itself fuzzy, topping out near 0.92 to 0.97.

The organisers' baseline, a program called AntiBinder, reaches 0.176 on a stand-in test. That sounds respectable, but a shuffled answer scores 0.147 on the same example, and shuffling reaches 0.176 about one time in six. The submission website only checks that the file's column names are right. It returns no score and shows no leaderboard, so teams cannot learn from their own submissions.

<!-- src: research/q4_challenge_intelligence/_QUEEN_DIGEST.md; research/q6_epitope_ml_methods/_QUEEN_DIGEST.md; research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md -->

## 5. Before, after, and the big picture

Blind prediction contests have a long history. The protein-folding contest CASP showed how fields leap: the precision of predicted residue contacts roughly doubled to 47 percent in 2016 when scientists fed in evolutionary co-variation, exceeded 70 percent in 2018, and in 2020 AlphaFold2 reached a median accuracy score of 92.4 (two different statistics, so not a like-for-like pair). The docking contest CAPRI had run 54 rounds and 230 targets by 2022. Yet antibodies and nanobodies stay hard: in the 2024 CASP16 round, the best group got above 60 percent of antibody targets acceptable with heavy sampling while a typical group managed about a quarter, and for the one nanobody target no group, AlphaFold-Multimer and AlphaFold3 included, was acceptable.

What would a win mean? Not much, say the sceptics, and they have arithmetic on their side. With only three test complexes, a modestly better method beats a rival only 58 to 61 percent of the time; only a gap of at least 0.15 wins reliably, and gaps below roughly 0.1 are mostly noise. A win would still be useful evidence, because the organisers' "folding from binding" idea (that binding data hold a weak, scalable signal about how molecules fit together) is offered as a hypothesis to be tested. The bigger prize is for medicine: if interfaces could be read from sequence and cheap binding experiments, nanobody discovery for hard targets would speed up.

<!-- src: research/q9_serendipity_cross_domain/casp_history_what_actually_changed_the_field_data_representation_msa_end_to_end.md; research/q4_challenge_intelligence/capri_dockq_capri_q_history_of_blind_docking_challenges_and_lessons_for_scoring.md; research/q4_challenge_intelligence/_QUEEN_DIGEST.md; research/_meta/king_world_KINGLOG.md -->

## 6. What the field has actually tried

Three families of tools exist. The first is "co-folding": artificial-intelligence programs (AlphaFold3, Boltz, Chai, OpenFold3) that take both sequences and draw the complex. On 60 nanobody cases AlphaFold3 got a roughly correct pose (a docking-quality score, DockQ, of at least 0.23) 31.6 percent of the time with one try, Boltz-1 23.3 percent and Chai-1 15.0 percent. Their own confidence number, ipTM, tells good from bad poses only weakly (average precision 0.45). The second family is classic docking, which shuffles two rigid shapes together: one blind test had it right in 20 percent of cases within its top ten.

The third family predicts epitopes from the target alone or with language models, the same kind of technology behind chatbots, but trained on protein text. The best antigen-only tool, DiscoTope-3.0, scores 0.232 on a test where 6.4 percent of residues are positives, about 3.6 times random. Protein language models give a decent guess for the nanobody half (about 0.69 to 0.77) yet sit near chance for the target half when tested on epitope groups they have not seen (an AUROC of 0.544, where 0.5 is a coin flip).

A theme runs through all three: no published tool reports a residue-level score for a nanobody-conditioned epitope, so nobody knows what a good number is. A promising trick is to run a co-folding engine many times and keep contacts that repeat, as a code-breaker keeps patterns that recur across intercepted messages.

<!-- src: research/q5_structure_prediction_docking/_QUEEN_DIGEST.md; research/q6_epitope_ml_methods/_QUEEN_DIGEST.md; research/_meta/king_infer_KINGLOG.md -->

## 7. Why the data-representation idea failed, and what survives

The team's suspicion was that clever re-packaging of the 1.8 million sequences, rather than a bigger model, might reveal where nanobodies grip HER2. It was tested four ways on the real tables and failed each time. A statistical method from protein evolution (DCA, which finds residues that co-vary) cannot work here because HER2 is the same in every experiment, so there is nothing for nanobody residues to co-vary with. Looking at near-identical sequence variants as a stand-in for lab mutation scans failed because they differ only at the level of sequencing errors (0.5 to 2 percent per position). Matching a nanobody loop to the surface chemistry of HER2, the way peptide-mimic methods do, scored 0.081 against 0.083 for a plain surface-exposure guess, with intervals including zero. Finally, repairing noisy labels (called PU learning, treating "Not" as unknown) lowered held-out accuracy.

The reason is simple: one target and one round of fishing means the data show many keys for a single lock. They describe the keys well, and say almost nothing about the lock. A sequence model trained on them mostly learns family relationships, which is why its accuracy (AUROC) drops from 0.945 to 0.855 once related sequences are kept apart.

Two things survive. A plain map of which nanobody positions vary a lot scored 0.562 on loop residues, a strong cheap baseline. And one hint remains: trastuzumab depleted ONU13 more than 20-fold but did not deplete ONU11 or ONU23, though which HER2 domain the competing drugs sit on, in this assay, is unverified.

<!-- src: research/q7_data_representation_integration/_QUEEN_DIGEST.md; research/_meta/king_infer_KINGLOG.md -->

## 8. What can fool us

Several traps have already caught people, and the hive found more. The first is the base rate: the brief's 12.6 percent contact fraction came from a different example, and HER2's real figure is closer to 3 to 5 percent, so a score that looks low may be fine. The second is numbering: the 22-residue offset, or a count that includes tags that the answer key ignores, can zero a perfect model. The third is ties and rounding: giving many residues the same score, or rounding, cost about 0.10 in simulation.

Fourth, the scorer is only partly specified. Whether the two chains are pooled, whether PR-AUC is averaged-precision or a trapezoid area, and whether the best or the last of five submissions counts can each change the winner: a constant predictor scores about 0.04 under one definition and about 0.52 under another. Fifth, leakage: some old HER2 pictures sit inside the training windows of the AI programs, so only two entries released on 2025-11-19 serve as clean practice tests. Sixth, labels: enrichment labels mix real binders with parasites, sticky tags and noise, and random train/test splits flatter models by 10 to 45 percent. Seventh, luck itself, as noted, because three test cases amplify any miss.

Finally, a human failure: a partial upload can leave one or two of the three files committed, and the website will not complain.

<!-- src: research/_meta/king_infer_KINGLOG.md; research/_meta/king_world_KINGLOG.md; research/q6_epitope_ml_methods/_QUEEN_DIGEST.md; research/q8_compute_validation_execution/_QUEEN_DIGEST.md -->

## 9. What we will do

Because the site returns no score, we choose the method by testing on public practice complexes, treating those few as sanity checks rather than training material. The plan is deliberately simple and staged. First, an insurance submission built in about two CPU-hours on 2026-10-20: a nanobody-side guess from loop positions and variability, plus a HER2-side guess from surface exposure shrunk toward the 3-5 percent base rate. Second, a structure-based arm: run several co-folding programs many times on the three nanobodies and the two clean practice complexes, count how often each residue pair touches, and shrink uncertain residues toward the base rate. The estimate is about 14 GPU-hours on public university cluster partitions, within a two-GPU cap, and every timing so far is an extrapolation until measured.

Each idea has a pre-agreed kill test. For example, if the many-run consensus does not beat the simple exposure guess on the clean practice complexes, we drop it. If two candidate arms are within about 0.03 to 0.1, we submit the simpler one. We will not spend GPU time on the sequence-table ideas of chapter 7.

The calendar is: freeze on 2026-10-28, upload the real candidate on 10-29, keep 10-30 in reserve, and make the last upload by 2026-10-30 06:00 UTC because the deadline's time zone is unstated. Before then, we will also try to ask the organisers which scoring variant counts.

<!-- src: research/q8_compute_validation_execution/_QUEEN_DIGEST.md; research/_meta/king_infer_KINGLOG.md; research/_meta/king_world_KINGLOG.md -->
