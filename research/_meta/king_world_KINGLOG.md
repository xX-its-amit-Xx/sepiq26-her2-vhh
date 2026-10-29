# King WORLD log, tick 1 (2026-10-17)

Scope: read BRIEF.md, king.md, structure.json and only the four `_QUEEN_DIGEST.md` files (q1-q4). Queens were not dispatched (Emperor and queens already ran). Worker bodies were not read; all claims below are as reported by queen digests and carry their stated confidence.

## Stagnation rule (applied, not executed)
All four queens report 7-13 numbered concrete facts with file and source counts, so none is stagnant (< 2 new facts or generic content). No re-dispatch is needed. If the Emperor wants a contingency: the only soft spot is q3's `cross_domain_test_burden_of_proof...` worker (digest admits its ecology/screening/art lenses were reasoned from general knowledge, no sources, relevance 2) and q2's therapeutics worker (4 sources). Were q3 re-dispatched it would go to **sports analytics** (ranking a true answer among look-alikes with tiny n); were q2 re-dispatched it would go to **cryptography** (known-plaintext: framework as crib, CDR3 as unknown). Instruction text per king.md. Not dispatched.

## (a) What is the label, and how reliable is it?
There are TWO labels and they must never be mixed.

1. **Training label (AVIDa-hHER2 "binder")**: a two-proportion z-test (equivalently 2x2 chi-squared, no Yates, singletons dropped; binder = read share rose after ONE panning round and p <= 0.05). Source: q3 `avida_hher2...md`, `ngs_read_count...md`. It says only that a clone got enriched against whole HER2 ECD. It carries no information on WHERE it binds. Reliability: weak, noisy epitope supervision. Estimated 10-40% false positives among binders and 30-60% of specific clones missed (q3, derived from assumptions, NOT measured: the real table is gated, HF 401). The test is invalid under ~10 combined reads (7-10% false-binder rate at 3-4 reads in simulation). Tag binders (His, GACQ) and display/expression bias can pose as binders. hIL6 sister dataset: 10/10 binders validated (95% lower bound on precision ~69%); hHER2 behaviour is inferred from it. Only epitope-informative columns: competition sublibraries (trastuzumab, pertuzumab, RabMAb; Mother Library B only), domain mapping from memory, unverified.
2. **Scoring truth (Track A)**: Voronota-LT antigen-VHH contact area > 0 from a ~3.0 A cryo-EM model (q3 `voronota_lt...md`, q4). Reliability: deterministic but cutoff- and model-dependent. Antigen positives ~9-13% of residues by area>0 (13.2% / 11.3% / 9.5% for area>0 / >=5 A^2 / d<4 A over 24 pairs; HER2 5MY6 only 3.8%). q1 measures 3-5% on HER2 and says the brief's 0.1 is too high; 4-9% replicate flip rate; a perfect predictor tops at PR-AUC ~0.92-0.97; 3 complexes give CI ~0.18 wide. Residues not modelled in cryo-EM (e.g. 9MTX had 510/752 residues modelled) have no label; likely absent: 121-134 and 598-652 (q1), tags and signal peptide set to 0 (q4). Area-weighted variant is near cutoff-proof; unweighted moves with cutoff. Which variant ranks is NOT stated (open).
3. Chance level: antigen ~0.03-0.05, VHH ~0.2-0.3 (q3 estimates). The VHH side is where scores are won or look inflated; the antigen side decides real skill (q2).

Verdict: use the enrichment label only as unlabelled/PU weak signal, never as truth; proxy validation must use area>0 labels on public complexes, not 4 A cutoffs.

## Top 10 facts that change how we would model
1. Targets are exactly 3 (ONU11/13/23); the home page "seven" is stale. Deadline 2026-10-31, plan upload 2026-10-30. (q4 `sepiq_guideline_detail...md`, `research/_meta/sepiq_verbatim.md`)
2. Antigen = P04626 1-624 + His6, offset 0, "GACQ" is native 621-624, signal peptide included; VHH lengths 127/127/135 incl. His6 (brief's "130" is an artefact). Numbering slip of 22 silently ruins the score. (q4 same file; q1 `her2_ectodomain...md`)
3. The portal checks only 4 header names, returns no score, no leaderboard, no enforced 5-cap. Local validator is mandatory. (q4 `hf_space...md`)
4. Epitope base rate is ~3-5%, not 0.1; calibrate PR-AUC against ~0.05 (0.024 at 4 A VHH-AP level). (q1 `all_public_her2_complex_structures...md`, q3 `voronota_lt...md`)
5. Public HER2-VHH truth is tiny: 5MY6, 7QVK, 9MTE (2 VHHs), 9MTX; all domains I/III/junctions, none in IV; no VHH CDR3 within 70% identity of ONU clones (BLASTp not run, by eye). Cannot copy an answer. (q2 `known_her2_nanobodies...md`, `nanobody_paratope...md`)
6. Footprint prior from other binders is weak on held-out VHH (macro AP 0.04-0.05); 44 antibody epitopes are ~11 clusters (~7.4 niches); 147/341 exposed ECD residues never touched. Use as a soft prior blended with uniform. (q1 `her2_ecd_habitat_mask.json`, `her2_public_complexes_loco_prior_test.json`)
7. Exposure alone gives AUC 0.72 for "touched by any public binder"; rigidity is anti-predictive (0.35-0.40). (q1 `her2_ectodomain_architecture...md`)
8. Paratope (chain B) is the cheap half: CDR3 holds ~46% of contact residues; ~24% of contacts are framework (FR2 42/49/50/52). Positional prior PR-AUC ~0.6 CV (leaky); damage-map prior 0.547 vs 0.149 prevalence on 17 VHHs, +0.17 to +0.33 on 5 HER2 VHHs. Antigen side is the hard half. (q2 `nanobody_paratope...md`, `vhh_imgt_positional_contact_prior_pdb615.json`)
9. AF3-class nanobody success is reported < 50%; CDR3 RMSD 2.9-4.3 A; kinked-CDR3 fraction overstated in modelled structures; ONU23 (20 aa CDR3) is the worst case. 9MTE/9MTX (released 2025-11-19) post-date engine training cutoffs, so are leakage-free proxies. (q2 `vhh_structure...md`; secondary, low-medium)
10. Macro PR-AUC over n=3 is a lottery for near-equal teams (modestly better method wins ~58-61%; gap >= 0.15 wins reliably); bootstrap resamples residue indices not complexes, so real uncertainty is larger. (q4 `prior_nanobody_antibody_prediction_competitions...md`)

## Contradictions / disagreements between queens
- **Base rate**: BRIEF 0.1 / q3 ~9-13% (24 pairs, area>0) vs q1 3-5% (HER2 public binders, 5MY6 3.8%). Both own computations on different sets; q3's pairs are general antigens, q1's are HER2. Use q1 for the HER2 prior, q3 for protocol. Settle by running Voronota-LT on all 4-5 HER2-VHH proxies.
- **Number of HER2-VHH structures**: 3 (q2 known_her2) vs 4 with 7QVK (q2 other workers, q1). Working figure 4.
- **Epitope domain**: q2 known_her2 suggests hedging I and IV; q2 own contacts and q1 find none in IV. Computed contacts outrank inference. 9MTE/9MTX domains are our own calculation, not the paper's (low).
- **Chain A length**: 618 (q4 file-size inference) vs 630 (printed construct) vs 624 (q4 sequence) vs ECD 23-652 (q1 domains). Unresolved; likely residues absent from template CSV. Gated.
- **Label pipeline**: site says chi-squared p<=0.05; HF card suggests IE-score cascade plus noise filter (q3, unresolved without table). False-positive estimates 10-40% (phage worker) vs 5-15% (stats worker): overlapping, different assumptions.
- **Voronota version**: guideline v1.1.479 / release v1.29.4602 vs worker v1.1.497 / v1.29.4816 (q3).
- **q1 internal**: her2_public_complexes.json exists in three versions; 60-record final supersedes; 83-pair cancer-worker claim unreconciled. Domain boundaries differ by source (I ends 195/215/217).
- **q2 vs q4 on ONU23**: 130 (brief) / 129 VHH proper / 135 printed with His6. Resolved as artefact.

## Cross-domain transfers (from outside chemistry/ML), each with a one-line kill test
1. **Healthcare screening / prosecutor's fallacy (q3, q4)**: treat enrichment label as a screening test with PPV ~27% at a 3% prior, so downweight it by Bayes rather than trust it. KILL: on 8GZ5/5MY6/9MTE/9MTX/7QVK, if a PU-weighted use of the enrichment-style signal (or simulated clone-enrichment proxy) does not beat a uniform + exposure prior by >= 0.02 macro PR-AUC under leave-one-complex-out, drop it.
2. **Law of evidence / cutoff as standard of proof (q3)**: rank residues by "robust core" (contacts surviving area>0, >=5 A^2, <4 A) and submit probability = fraction of cutoffs/seeds passing, since the weighted metric is cutoff-proof. KILL: if consensus-of-cutoffs score does not give higher weighted PR-AUC than raw single-cutoff labels on the proxies, discard.
3. **Ecology niche overlap / competitive exclusion (q1)**: the ~51-residue dimer-occupied patch (mostly 221-351) is a "realised vs fundamental niche" mask; down-weight it for VHH epitopes. KILL: if on the 4 public VHH epitopes the mask does not lower mean AP-by-position over exposed residues (none of the 4 overlap it, so it should help), or if it hurts held-out AP, remove it. Note the ecology presence-only MaxEnt prior itself died (AP 0.04-0.05).
4. **Art conservation / hand-set damage map (q2)**: position-based paratope prior as restoration of the "original panel", with germline-vs-SHM overpaint untested. KILL: on 5 HER2 VHHs the damage-map must beat prevalence by >= +0.17 absolute PR-AUC (reported +0.17 to +0.33) when IMGT numbering is redone with ANARCI; if not, fall back to uniform CDR3-weighted.
5. **CASP/CAPRI consensus lesson (q4)**: per-residue probability = interface frequency over many seeds/engines (epitope placement is all-or-nothing; consensus beats ipTM). KILL: on post-cutoff 9MTE/9MTX, if multi-seed consensus frequency does not beat single-best-ipTM-model contact map on PR-AUC, abandon the ensemble.
6. **Forensic chain of custody (q3, q4)**: audit every handoff (page capture, gated table, numbering) as an exhibit register; already paid off by catching the stale home page. KILL: n/a as a model idea; confirmed by validator test, a submission file that mismatches template sequences must fail the local check.
7. **Sports/leaderboard luck (q4)**: with n=3 and residue-level bootstrap, do not over-tune on the local league; choose the submission ladder as hedges. KILL: if local leave-one-complex-out bootstrap CI (~0.18) overlaps between candidate arms, submit the simpler arm.

## Coverage gaps
- The gated AVIDa-hHER2 table and template CSVs (HF 401): nobody has seen the real read counts, labelled sequences, chain A length, or competition-sublibrary domains. Needs HF login/token (user action) or a public mirror.
- BLASTp/ANARCI of ONU11/13/23 against 5MY6, 7QVK, 9MTE/9MTX and the alpaca germline; the custom IMGT numbering script may be off by one (q2).
- Glycan and heteroatom handling by the organisers, glycan sites inside predicted footprints (q1/q2 asked, unanswered).
- Construct: disulfide-dimerised or monomeric ECD, expression host (q1 asked q3).
- Official ranking variant (weighted vs unweighted), best-vs-last of 5 submissions.
- Voronota-LT reproduction on proxies (8GZ5 26/206 check) not confirmed; q1 did 4 A only for therapeutic antibodies.
- No query to PhosphoSitePlus, ClinVar, COSMIC, MANE; low relevance for Track A.
- Track B (CAPRI round, EMDB release dates) unconfirmed; low value for Track A.
- No worker tested whether the ONU CDR3s relate to the competition-bin clusters; this is the one place the NGS data could carry epitope signal (that belongs to q7).

## (b) Cheapest experiments that could win Track A before 2026-10-31
Ordered by cost (CPU only first). All must be scored leave-one-complex-out on {5MY6, 7QVK, 9MTE-VHH1, 9MTE-VHH2, 9MTX} (+8GZ5 as sanity) with area>0 Voronota-LT labels, paired bootstrap, and report macro over complexes, antigen and VHH separately.
1. **Validator + format-safe baseline (hours, CPU)**: header/sequence/numbering validator against the printed construct (offset 0, tags zero), then a submit-able uniform+CDR3-position file as a floor (guarantees a valid entry; covers the easy VHH chain).
2. **VHH-side positional damage-map prior with ANARCI numbering (hours, CPU)**: reported +0.17 to +0.33 over prevalence on HER2 VHHs; essentially free; resolves chain B.
3. **Antigen-side prior = exposure x (1 - dimer patch) x mild public-footprint, blended with uniform (hours, CPU)**: exposure alone AUC 0.72; the footprint prior alone is weak (AP 0.04-0.05), so only the blend is worth testing. Kill if it does not beat uniform on held-out VHH.
4. **Multi-seed co-folding consensus on ONU11/13/23 (Boltz-2 with the user's Boltz credits first, then OpenFold3/Chai-1 on Explorer public `gpu`/`gpu-short`, <= 2 GPUs)**: take per-residue interface frequency across seeds/engines. First validate on 9MTE/9MTX (leakage-free, released after engine cutoffs); only scale if it beats experiment 3 there.
5. **Competition-bin / cluster co-enrichment representation (q7, only if the gated table is obtained)**: use trastuzumab/pertuzumab sublibrary membership as domain evidence for clusters similar to ONU CDR3; kill quickly if no ONU-like cluster has a bin label.
6. **Calibration/ensemble step**: rank-average arms 3 and 4 per complex and calibrate so antigen scores are not swamped by VHH-side scores (pooling hazard, q4).
Five-submission ladder suggestion: S1 floor (exp 1+2), S2 prior blend (3), S3 co-fold consensus (4), S4 ensemble (6), S5 reserve for fix-ups. Hold final by 2026-10-30. Queens q8/q5 own execution.

## Recommendations to the Emperor
- Merge nothing; structure worked. Add a **narrow channel `proxy_labels`** (q1, q2, q3, q8): one shared Voronota-LT area>0 table for 5MY6/7QVK/9MTE/9MTX/8GZ5, so base rates and priors stop being computed three ways.
- Task q8 or q6 with the **gated-data access** problem (HF token from Amit) since q3 and q4 are blocked on the same 401.
- Close the topic of Track B/CAPRI and drug history (q4 capri, q2 therapeutics worker) for this deadline: low Track A yield.
- Add a one-off worker for **ANARCI + BLASTp of ONU clones** against known VHHs and alpaca germlines (cheap, answers leakage, numbering and CDR3-length risk in one go).
- Reconcile `her2_public_complexes.json` versions before anything downstream imports it.

## Recommendations to the Scribe (five things a layman most needs from this half)
1. HER2 is a cancer-overproduced surface protein; drugs grab it at two known spots, but most of its surface has never been seen holding an antibody.
2. A nanobody is a tiny antibody that grips mostly with one long floppy loop; guessing the nanobody half is the easier half, the HER2 half is the hard half.
3. The training "sticks" labels come from counting which sequences became more common after one fishing round: noisy hints, not proof, and they never say where on HER2 the nanobody binds.
4. The scoring answer key is an electron-microscope picture turned into a list of touching residues; even a perfect guess cannot score perfectly, and with only three test cases luck is a big part of winning.
5. Only four public pictures of nanobodies on HER2 exist and none resembles the three mystery clones, so teams cannot just copy; the submission site only checks the file format and never shows a score.

Honesty note: all numbers above are quoted from queen digests with their confidence; none were re-verified by this king. Sepiq pages were read by workers through a lossy summariser (q4 flags this).
