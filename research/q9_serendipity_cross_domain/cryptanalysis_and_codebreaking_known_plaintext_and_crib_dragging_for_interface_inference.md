---
title: "Cryptanalysis as a lens: known-plaintext cribs, Banburismus decibans and interface inference for HER2-VHH"
queen: q9_serendipity_cross_domain
king: king_infer
worker: cryptanalysis_and_codebreaking_known_plaintext_and_crib_dragging_for_interface_inference
tier: expert
tags: [cryptanalysis, crib-dragging, Banburismus, deciban, weight-of-evidence, HER2, PR-AUC, severe-testing, scoring-formula]
confidence: medium
challenge_relevance: 3
serendipity: "Known-plaintext attack = public HER2 complexes as cribs, enrichment as ciphertext; PARTLY holds. It gives a calibrated additive decibans recipe and a null-spread for n=3, but the 'no self-encryption' hard exclusion has no clean protein analogue and enrichment carries no antigen-side signal."
date: 2026-10-17
---

## TL;DR
Codebreakers won by (1) guessing a short piece of plaintext (a crib), (2) discarding every alignment that contradicts a hard rule, and (3) adding up many tiny likelihood-ratio hints in decibans until one hypothesis stood out. The same bookkeeping works for per-residue interface probabilities: public HER2 complexes (1N8Z, 1S78, 6OGE, 5MY6) are the cribs, region priors are the weights, and decibans give a formula that outputs 0-1 probabilities. The analogy only partly holds: our "ciphertext" (one-round enrichment) says nothing per-residue about HER2, and with n = 3 test complexes a crib is falsified only if it fails to beat a permutation null (computed below: about 0.058 macro PR-AUC for the antigen chain is the 95th percentile of chance).

## 1. Crib dragging and the known-plaintext attack (mechanism)
- A **crib** is a guessed plaintext fragment of length m believed to occur somewhere in an intercepted message of length n. It is slid ("dragged") along the ciphertext, giving n - m + 1 candidate alignments.
- Enigma's reflector means "a letter can never be encoded into itself" (Crypto Museum, opened: cryptomuseum.com/crypto/enigma/working.htm). So at each alignment, if any crib letter sits above the identical ciphertext letter (a "clash"), that alignment is impossible and is dropped. Tony Sale's menu page describes the clash as showing the crib is misplaced (seen in a search result only; page not opened).
- Survival of a random wrong alignment is about (25/26)^m (computed): m = 6 gives 0.79, m = 10 gives 0.68, m = 12 gives 0.63, m = 14 gives 0.58, m = 20 gives 0.46. So the constraint alone prunes weakly; surviving offsets are passed to the Bombe, which tests wheel settings against the crib-ciphertext menu (Crypto Museum: the Turing-Welchman Bombe finds rotor order and start settings).
- Not opened, so no detail cited: Singh, *The Code Book*; Hodges, *Alan Turing: The Enigma*; Rejewski's permutation-cycle work. I have no verified page numbers from them. Treat the history here as context only.
- Key abstraction for us: **crib + hard exclusion + soft evidence**. A crib is useful only if (a) probably true and (b) short enough to be found by sliding but long enough to be informative.

## 2. Banburismus, bans and decibans (from Good 1979, opened)
Source: I. J. Good, Biometrika 66(2):393-396 (1979), "Studies in the History of Probability and Statistics XXXVII. A. M. Turing's statistical work in World War II" (JSTOR 2335677; full text opened).
- Bayes factor for H given E = O(H|E)/O(H) = pr(E|H)/pr(E|not-H). Weight of evidence W = log of that factor (Peirce 1878 called it weight of evidence; Turing used it for sequential analysis).
- Units: ban = log10, natural ban = ln, **deciban = 1/10 ban**. "A deciban or half-deciban is about the smallest change in weight of evidence that is directly perceptible to human intuition." The name comes from Banbury, where sheets for Banburismus were printed.
- Variance result (section 7): if W for true H is normal with mean mu and variance sigma^2, then under not-H it is normal with mean -mu and the same variance, and sigma^2 = 2 mu in natural bans, so sigma is about 3 sqrt(mu) in decibans. Good: "the variance is disconcertingly large and the same was true of Banburismus."
- Also in Good 1979: expected Bayes factor against the truth is 1 (section 8); repeat rate = sum p_i^2, estimated by sum v_i(v_i-1)/{N(N-1)}, which Friedman (1922) had called the index of coincidence (section 10); Turing's frequency-of-frequencies smoothing (section 11).
- **Worked example (computed by me; the 1/17 German repeat rate is NOT in Good 1979 and is from memory of Banburismus accounts, so unverified).** Compare two aligned messages. Coincidence probability under "same key-stream offset" = 1/17, under random = 1/26. Each coincident letter = 10 log10(26/17) = +1.85 dB; each non-coincident letter = 10 log10((16/17)/(25/26)) = -0.09 dB. Expected weight per letter under H = 0.0588 x 1.85 + 0.9412 x (-0.093) = +0.021 dB, so 100 letters give mu of about 2.1 dB with sigma of about 4.4 dB by direct variance (the 3 sqrt(mu) rule gives 4.3 dB). That matches Good's "disconcertingly large" and shows why hundreds of letters were needed.

### Mapping to a per-residue log-likelihood ratio
For VHH position j (sequence-aligned, IMGT-like) and amino acid a, let c_E(a,j) be enrichment-weighted counts over enriched sequences (weight = max(0, log10 of post/pre frequency ratio)), c_B(a,j) counts over the pre-panning background, N_E and N_B totals, and Dirichlet pseudo-count alpha = 0.5:

W(a,j) [dB] = 10 log10 { [(c_E(a,j)+alpha)/(N_E+20 alpha)] / [(c_B(a,j)+alpha)/(N_B+20 alpha)] }

Residue-level evidence is the sum over independent clones that bear on residue i, which is Turing's additivity (valid only under conditional independence; clonal families violate it). Antigen side: all clones bind one HER2, so enrichment gives no per-HER2-residue contrast. Antigen-side weights must come from cribs (section 4), not reads. I did not run this on the 1.8M-row table in this task: it is a recipe, and no enrichment-derived numbers are reported.

### Relation to PR-AUC (computed)
- PR-AUC depends only on ranking, so any monotone transform of the weights leaves it unchanged. Decibans matter for calibration (the 0-1 column) and for pooling across chains, not for per-chain ranking.
- Under Turing's model (equal variance, sigma^2 = 2 mu nats): d' = sqrt(2 mu), AUROC = Phi(sqrt(mu)). Binormal PR-AUC by numerical integration:

| mu (nats/residue) | AUROC | PR-AUC at prevalence 0.10 | PR-AUC at 0.13 |
|---|---|---|---|
| 0.05 | 0.588 | 0.134 | 0.172 |
| 0.10 | 0.624 | 0.154 | 0.196 |
| 0.25 | 0.691 | 0.208 | 0.259 |
| 0.50 | 0.760 | 0.293 | 0.351 |
| 1.00 | 0.841 | 0.445 | 0.505 |
| 2.00 | 0.921 | 0.665 | 0.713 |

The BRIEF's AntiBinder proxy (PR-AUC 0.176 at prevalence 0.126) corresponds to mu of roughly 0.06 nats, about 0.26 dB per residue: very weak evidence. PR-AUC near 0.3 needs about 0.5 nats (2.2 dB) average expected weight per residue. The binormal assumption is an assumption; real score distributions are skewed.

## 3. Statistical cryptanalysis tools
- **Index of coincidence** (Friedman 1922; Good 1979 section 10): estimator sum v_i(v_i-1)/{N(N-1)}. Textbook values (about 0.0667 English, 1/26 = 0.0385 random) are from memory, unverified. Kasiski (1863) repeated-trigram test: not opened, unverified. Analogue for us: the repeat rate of enriched-clone CDR3 k-mers estimates how many independent epitope classes exist (a diversity measure, as Good notes for Gini/Simpson).
- **Differential cryptanalysis**: Biham & Shamir, "Differential Cryptanalysis of DES-like Cryptosystems" (Weizmann technical report, 19 July 1990, opened; the 1991 J. Cryptology version was NOT opened, so volume/pages unverified). A high-probability differential characteristic of probability p makes right plaintext pairs vote for the right subkey. Counting k key bits uses 2^k counters; the right key gets about m p counts from m pairs; the average counter gets about m alpha/2^k. Their signal-to-noise is S/N = 2^k p / alpha, independent of the number of pairs m (PDF extraction garbled the symbol alpha, the ratio of counted to all pairs; my reading). Empirical rule in the report: "when the S/N is about 1-2, about 20-40 occurrences of right pairs are sufficient"; at high S/N "3-4 right pairs are usually enough." Their example needs about 120 pairs per characteristic at p about 1/16 (S/N 2^16). Abstract: 8-round DES in minutes on a PC; up to 15 rounds in under 2^56 operations; a secondary source (search result) puts full DES at 2^47 chosen plaintexts (not verified in the primary text).
- **Observations needed for a given bias** (computed): for a binary observation with true rate p1 versus null p0, expected weight per observation is the KL divergence; observations needed for target weight W is W/KL (double it for safety given Turing's large variance).

| p1 vs p0 | KL (nats) | dB per observation | n for 10 dB (1 ban) | n for 20 dB |
|---|---|---|---|---|
| 0.15 vs 0.10 | 0.01224 | 0.053 | 188 | 376 |
| 0.55 vs 0.50 | 0.00501 | 0.022 | 460 | 919 |
| 0.52 vs 0.50 | 0.00080 | 0.0035 | 2,877 | 5,755 |
| 0.51 vs 0.50 | 0.00020 | 0.0009 | 11,512 | 23,024 |

Rule of thumb: n scales as 1/bias^2; a 1% bias needs about 10^4 observations for one ban. The 1.8M-read table has volume, but reads are not independent observations of a residue (clonal families, one panning round, library/PCR bias).
- Side-channel template attacks (Chari, Rao, Rohatgi 2002) were not searched or opened; no claim made.

## 4. The protein cribs (computed from PDB coordinates)
Method: downloaded files.rcsb.org PDB files for 1N8Z, 1S78, 6OGE, 5MY6; epitope = HER2 residues with any heavy atom within 4.5 A of the antibody or nanobody (not Voronota-LT areas, so boundaries differ from the official truth). 1N8Z and 1S78 use mature numbering; adding 22 gives P04626 numbering. Checked: 1N8Z+22 and 1S78+22 reproduce the 6OGE epitopes (6OGE chain A starts at 23, P04626 numbering) with Jaccard 0.68 (trastuzumab, 15 shared) and 0.89 (pertuzumab, 24 shared). UniProt P04626 (REST, opened): signal 1-22, chain 23-1255, TM 653-675, kinase 720-987.
Domain boundaries: a patent text (search result) gives mature numbering I 1-195, II 196-319, III 320-488, IV 489-630; adding 22 (II end 341 by my choice, source says 319 + 22 = 341) gives I 23-217, II 218-341, III 342-510, IV 511-652 (TM begins 653). Sources differ by a residue; the II/III boundary is least certain.

| PDB | Ligand | Method, resolution | HER2 domain | Epitope residues (P04626 numbering, <4.5 A) | n |
|---|---|---|---|---|---|
| 1N8Z (Cho 2003, Nature 421:756, doi 10.1038/nature01392) | trastuzumab Fab (4D5) | X-ray 2.52 A | IV | 579-580, 582-583, 591-595, 601, 613, 615, 618, 620, 622, 624-627 | 19 |
| 1S78 (Franklin 2004, Cancer Cell 5:317, doi 10.1016/S1535-6108(04)00083-2) | pertuzumab Fab | X-ray 3.25 A | II (24) plus 150, 178 in I | 258-337 patchy: includes 258, 267-268, 306-310, 312, 314, 316-319, 333, 335-337 | 26 |
| 6OGE (Hao 2019, PLoS One 14:e0216095, doi 10.1371/journal.pone.0216095) | trastuzumab + pertuzumab Fabs | cryo-EM 4.36 A | IV and II (+150 in I) | trastuzumab 18, pertuzumab 25 (match rows above) | 18 + 25 |
| 5MY6 (Clin Cancer Res 2017 per search result; 2.25 A) | nanobody 2Rs15d | X-ray | I | 109-112, 156-157, 170, 173-175, 177-183, 217 | 18 |

Union of all four: 66 residues: 109-112, 150, 156-157, 170, 173-175, 177-183, 217, 258, 267-268, 270, 274, 276-279, 290, 306-310, 312, 314, 316-319, 333, 335-337, 579-580, 582-583, 591-595, 601, 607-608, 610, 613, 615, 618, 620, 622, 624-627. Per domain: I 19/195, II 25/124, III 0/169, IV 22/142; overall 66/630 = 0.105, close to the BRIEF's 0.1-0.13 prior (coincidence of a union, not one complex).
- **5F7**: no PDB entry found. PMC5662479 (opened) says 5F7 binds the C-terminus of domain IV and competes with trastuzumab: a domain IV, trastuzumab-overlapping crib with no coordinates. 2Rs15d binds domain I (5MY6 coordinates), consistent with not competing with trastuzumab or pertuzumab.
- **Public and allowed?** All four entries are public PDB data; Track A allows public external data if documented. Whether the held-out ONU epitopes coincide with these sites is unknown; the BRIEF says leakage is "not an issue as long as the answer is correct".
- Gap: domain III has no public antibody crib here; the zero is selection bias (which antibodies were crystallised), not evidence that III is not immunogenic.

## 5. A crib-style constraint for VHH paratopes
Literature (Mitchell & Colwell, Protein Eng Des Sel 31:267-275, 2018, doi 10.1093/protein/gzy017, PMC6277174, opened): 156 Nb-antigen structures vs 156 Ab-antigen; contact = any atom within 5 A. H3 contributes 1,353 contacting residues = 46% of all Nb-antigen contacts (Ab VH H3: 865 = 38%); by pairwise contacts H3 = 54.3% (Ab 44.3%); H2 has 579 contacting residues (Ab 752); only 16% of Nbs use H1-3 only (Ab VH 53%); H3 is in the paratope in all Nb structures; framework contacts are more frequent than for antibodies but the article gives no single framework percentage I could extract. Contact density per residue: H3 2.009 vs 1.503 for VH. These are from the 2018 structure set, not a SAbDab-nano recount; I did not recompute SAbDab-nano counts.
One structure I did compute: 2Rs15d in 5MY6 (115 aa: QVQLQESGGGSVQAGGSLKLTCAASGYIFNSCGMGWYRQSPGRERELVSRISGDGDTWHKESVKGRFTISQDNVKKTLYLQMNSLKPEDTAVYFCAVCYNLETYWGQGTQVTVSS). Paratope = 22 residues at 4.5 A. Region windows are my own approximate boundaries (CDR1 26-35, CDR2 50-58, CDR3 = AVCYNLETY, 96-104):

| Region | Residues | Paratope residues | Rate | Share of paratope |
|---|---|---|---|---|
| CDR1 | 10 | 5 | 0.50 | 23% |
| CDR2 | 9 | 5 | 0.56 | 23% |
| CDR3 | 9 | 7 | 0.78 | 32% |
| Framework | 87 | 5 (Y37, E44, R45, L47, W105) | 0.057 | 23% |

n = 1 structure, so only a shape check: CDR3-dominant per-residue rate, framework contacts via FR2 hallmark positions 44, 45, 47, consistent with CDR3 about 46% of contacts in the literature. The "plaintext" for the VHH side is a paratope prior over region: a prior, not a hard constraint, since no region is excluded.

## Forced analogy: cryptanalysis
(a) Statement. Lock = HER2. Key setting = the interface (epitope plus paratope residues). Intercepted ciphertext = enriched reads. Cribs = public complexes and known paratope/epitope patterns. The "no self-encryption" analogue = exclusions such as buried residues, glycan-shielded sequons, or residues outside the ectodomain 23-652: weak, because most residues survive any single test, like (25/26)^m. Deciban = additive evidence from independent hints.

(b) Testable idea: a **crib-prior decibans model** with no private training data.

S_i = S0(pi_chain) + W_region(i) + W_pub(i) + W_expo(i) + W_gly(i) + W_sim(i, clone)   [decibans of odds]
p_i = 1 / (1 + 10^(-S_i/10)), clipped to [0.01, 0.90]
S0 = 10 log10(pi/(1-pi)): pi 0.115 gives -8.86 dB; pi 0.04 gives -13.8 dB.

- Antigen (chain A): W_region = domain LLRs from the pseudo-counted crib table halved (shrunk): domain II +2.0, IV +1.2, I 0.0, III -1.0 (floor chosen by me; the raw -17 dB is a pseudocount artefact of zero public epitopes). W_pub = +3 dB if residue is in the 66-residue union, +1.5 if within 2 positions of one. W_expo = -10 dB if relative solvent exposure < 5% in 1N8Z/6OGE (needs a one-off SASA run, not done here). W_gly = -3 dB at N-linked sequons N-X-S/T.
- VHH (chain B): W_region = CDR3 +4, CDR1 +3, CDR2 +3, framework -1.3, plus +2 at FR2 hallmark positions 37, 44, 45, 47 (halved from the 5MY6 shape; region windows from IMGT-like numbering of each ONU sequence). ONU23 (130 aa) probably has a longer CDR3: pi_B = 0.13; ONU11 and ONU13 (120 aa): pi_B = 0.115.
- W_sim (clone-specific): align each ONU CDR3 with 2Rs15d CDR3 (AVCYNLETY) and the trastuzumab/pertuzumab CDR3s from 1N8Z/1S78, and compute LR = P(identity >= s | same epitope class) / P(identity >= s | random); with about 0.07 per-position identity, random P(>= 6 of 9) is about 8e-6. Cap |W_sim| at 6 dB (the crib may be wrong); add only to that crib complex's epitope residues. I expect 0 for most clones; ONU sequences were not captured in this task.
- Worked numbers (illustrative): HER2 residue 580 (IV, in union, no clone similarity): S = -13.8 + 1.2 + 3 = -9.6 dB, p = 0.099. A domain II residue with no crib: S = -13.8 + 2.0 = -11.8 dB, p = 0.050. VHH CDR3 residue: S = -8.86 + 4 = -4.86 dB, p = 0.246. VHH framework residue: S = -10.2 dB, p = 0.087.
- Prior: the BRIEF's 0.1-0.13 fits the VHH chain (and 8GZ5). For HER2's 620-residue ECD with 18-26 epitope residues the prevalence is 0.03-0.04. If truth is scored per chain, only within-chain order matters; if chains are pooled, both chains must share one calibration (pooled prevalence about 35/740 = 0.05). Setting pi_A = 0.115 changes the 0-1 values but not the within-chain ranking.

(c) Verdict: **PARTLY holds.**
- Holds: additive weight of evidence, sequential accumulation, crib-guided prior, expected-weight as design criterion, signal-to-noise and counts needed (n about 1/bias^2).
- Breaks: (1) the Enigma exclusion is deterministic; protein constraints are probabilistic. (2) An Enigma crib is verified by decoding to German; our epitope guess is checkable only against 3 held-out structures after judging. (3) Enrichment gives no antigen-side residue contrast (one antigen). (4) Reads are not independent samples (clonal families). (5) A public crib helps only if the new binder shares the epitope class.

## 6. Where the analogy breaks: Popper, Mayo and n = 3
A crib is a falsifiable guess: if right, the decrypt reads as German. A crib-style epitope prior is falsified when the held-out truth fails to show the predicted enrichment of positives among top-scored residues. Mayo (Statistical Inference as Severe Testing, CUP 2018, doi 10.1017/9781107286184; publisher page opened): a claim has not passed a severe test if little has been done to rule out flaws in inferring it. With n = 3 complexes severity is low by construction.
Permutation null (computed, 4000 shuffles, uniform random ranking, average precision as PR-AUC proxy):

| Chain (positives/negatives) | Null mean | sd | 95th pct | Macro-of-3 mean | sd | 95th | 99th |
|---|---|---|---|---|---|---|---|
| ECD 20 / 600 | 0.042 | 0.016 | 0.076 | 0.041 | 0.009 | 0.058 | 0.070 |
| VHH 14 / 106 | 0.148 | 0.046 | 0.235 | 0.149 | 0.027 | 0.198 | 0.227 |
| both chains pooled 35 / 705 | 0.055 | 0.013 | 0.082 | 0.055 | 0.007 | 0.069 | 0.078 |

Reading: a macro HER2-chain PR-AUC of 0.07 or higher rejects chance at about the 1% level; about 0.05 is well inside chance, and a result equal to prevalence says nothing. **A falsifying result for the crib prior** = macro PR-AUC inside the null 95th percentile, or no better than the same pipeline with crib terms removed (ablation on the same three complexes), or any complex whose epitope sits in domain III (the zero-crib domain) so that crib-set residues score below the prior. Severity rises only by pre-registering the weights above before truth release, using the organisers' paired cluster bootstrap, and leave-one-complex-out testing inside the four public cribs (not run here).

## Gotchas / what could fool us
1. The 0.1-0.13 prior is a VHH-chain or small-antigen number (8GZ5 RBD: 26/206). For HER2's ECD it is 0.03-0.04; pooling chains changes the baseline PR-AUC.
2. My 4.5 A heavy-atom contacts are not Voronota-LT areas; the area-weighted variant rewards big contact patches (CDR3 core).
3. Numbering: 1N8Z and 1S78 use mature numbering; P04626 is +22. Mixing silently shifts epitopes by 22 residues. Domain boundaries differ by about one residue between sources.
4. Crib selection bias: public antibodies target domains I, II, IV because those were crystallised and are therapeutic; domain III absence is not evidence.
5. Deciban additivity needs conditional independence; clonal read families inflate evidence (Turing's variance is already "disconcertingly large").
6. PR-AUC is rank-only: calibration buys nothing unless chains are pooled.
7. The binormal AUROC/PR-AUC table assumes equal variance; order of magnitude only.
8. 5F7 has no coordinates (domain IV placement from one article); 6OGE is 4.36 A cryo-EM so its contact list is noisy (Jaccard 0.68 with 1N8Z).
9. 5MY6 region shares are n = 1 with my own region windows.
10. Unverified from memory: German repeat rate 1/17, English IC 0.0667, Kasiski 1863. Not opened: Singh, Hodges, Rejewski, Friedman, SAbDab-nano recount.

## Implications for the challenge
1. Use decibans (additive log-odds) as the internal scale and convert to 0-1 only at export; fix all weights before any result (pre-registration for severity).
2. Implement the section "Forced analogy" formula as a baseline crib prior and ablate each term (W_region, W_pub, W_expo) by leave-one-complex-out over 1N8Z, 1S78, 6OGE, 5MY6; report macro PR-AUC against the permutation nulls above.
3. On the VHH chain always include a CDR3-weighted region prior (CDR3 about 46% of contacts, Mitchell & Colwell); it is the cheapest evidence available.
4. Do not claim enrichment gives HER2 residue evidence; use it for VHH-side diversity weights and clone similarity to known binders.
5. Decide pi per chain after confirming whether truth pools chains (q4); keep the same relative calibration across ONU11, ONU13 and ONU23 files.
6. Capture ONU11/13/23 sequences verbatim and run W_sim against 2Rs15d CDR3 (AVCYNLETY) and the trastuzumab/pertuzumab CDR3s to see whether any clone is a crib relative.
7. Expect weak signal: AntiBinder-level 0.176 is about 0.3 dB/residue; about 0.3 PR-AUC needs about 2 dB/residue average expected weight.

## Open questions
- Does the official truth pool chains A and B; is per-chain prevalence 0.03-0.04 (ECD) vs 0.12-0.19 (VHH)?
- Exact 5F7 epitope (no coordinates) and whether any ONU clone competes with trastuzumab.
- SAbDab-nano recount of region shares and framework contact rate (not done).
- Does clone-level enrichment correlate with epitope class beyond what CDR3 similarity gives?
- Check primary text of Biham & Shamir J. Cryptology 1991, Singh, Hodges and Rejewski for the historical statements.

## Sources
Opened:
- https://data.rcsb.org/rest/v1/core/entry/1N8Z, /1S78, /6OGE (entry metadata); https://www.rcsb.org/fasta/entry/1N8Z and /1S78; coordinates https://files.rcsb.org/download/{1N8Z,1S78,6OGE,5MY6}.pdb
- https://rest.uniprot.org/uniprotkb/P04626.json (signal 1-22, chain 23-1255, TM 653-675)
- Good 1979, Biometrika 66(2):393-396 (JSTOR 2335677), PDF https://jhanley.biostat.mcgill.ca/bios601/CandH-ch0102/GoodOnTuring.pdf
- Biham & Shamir, Differential Cryptanalysis of DES-like Cryptosystems (technical report, July 1990), https://www.ioactive.com/wp-content/uploads/2015/07/biham91differential.pdf
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5662479 (5F7 and 2Rs15d statements)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6277174/ (Mitchell & Colwell 2018, doi 10.1093/protein/gzy017)
- https://www.cryptomuseum.com/crypto/enigma/working.htm (reflector, Bombe)
- https://www.cambridge.org/core/books/statistical-inference-as-severe-testing/D9DF409EF568090F3F60407FF2B973B2 (Mayo 2018)
- https://www.repository.cam.ac.uk/items/fe4806e8-c88f-440d-90d2-002006447281/full (Mitchell thesis abstract; embargoed, no counts)
Search-result snippets only (not opened as pages): https://www.rcsb.org/structure/5my6; patent texts at image-ppubs.uspto.gov for domain boundaries; https://www.codesandciphers.org.uk/anoraks/menus.htm (clash/menu).
Computation scripts: C:\Temp\sepiq26\q9scripts\contacts.py and dom.py.
