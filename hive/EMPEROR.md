# EMPEROR — charter and decision log (SEPIQ 2026)

The Emperor does not research and does not manage content. The Emperor manages **the shape of the hive**: how many kings, which queens,
how many workers, which queens may talk, how much context each level may carry. Optimises for (a) context-window hygiene,
(b) coverage, (c) serendipity pressure, (d) finishing: the dashboard ships AND a submission goes in before 2026-10-31.

## Standing rules (inherited from the CASMI26 and OpenBind hives, adapted)
1. **Fan-in discipline.** Worker writes one topic file. Queen reads only TL;DR + frontmatter + Implications of her workers and writes
   `research/<queen_id>/_QUEEN_DIGEST.md` (<= 1,500 words). King reads only queen digests, writes `research/_meta/<king_id>_KINGLOG.md`.
   Emperor reads only king logs and coverage JSON.
2. **Serendipity is mandatory.** Every worker has a `serendipity:` line; every queen digest a "Forced analogies" section; every king log a
   "Cross-domain transfers" section with at least one idea from outside biotech/ML. Kings rotate the lens list.
3. **Stagnation rule.** If a queen's second round yields < 2 new concrete sourced facts, the king re-assigns her to a different subdomain
   or a random field (art, law, philosophy, healthcare, ecology, astronomy, cryptography, music, sports analytics) with the instruction
   "find what this field knows about inferring where two things touch from weak noisy signals".
4. **Channels are explicit** (structure.json). Emperor opens/closes by observed traffic.
5. **Restructure triggers.** Split a king > 5 queens or log > 3,000 words; merge queens overlapping > 50% in tags; add a queen when a king log
   names an uncovered subdomain twice; kill a worker topic when two rounds yield nothing new.
6. **Every tick ends with artifacts on disk.** No silent ticks.
7. **Resource rule.** Check CPU/RAM/disk on C: and D: before any fan-out; <= ~8 concurrent agents; big downloads on the drive that has space;
   Explorer public partitions only, <= 2 GPUs (CLAUDE.md fair-use guardrails).
8. **Template-noun rule (new).** The user's kickoff text is a reusable template ("protease", "mass spec"). Verify the real challenge first;
   never import the template's nouns. (Learned on CASMI26, repeated here: SEPIQ has no protease and no mass spectrometer.)

## Tick 0 — 2026-10-17 (initial structure)
**Observation.** Fresh folder. Real challenge fetched from sepiq.uk: HER2 VHH epitope/paratope prediction, 3 held-out cryo-EM complexes
(ONU11, ONU13, ONU23), Track A per-residue PR-AUC macro-averaged over 3 complexes, 5 submissions per team, window closes **2026-10-31
(14 days)**, results 2026-12-15. Training signal = AVIDa-hHER2 (1.8M NGS reads, a few hundred labels), SAbDab-nano, public PDB.
Biggest structural facts: (i) n = 3 test targets means the metric is dominated by variance and by whether the *epitope region* is
right (HER2 has four domains and known epitope hot spots); (ii) co-folding engines are explicitly allowed and public HER2 complexes are
explicitly allowed even if they leak ("as long as the answer is correct"); (iii) the baseline scores 0.176 on its own proxy, so the bar
is low and a good structure-based prior can win; (iv) the user's thesis (data representation of the NGS data is the breakthrough) is
testable only through q7 and needs real execution, not just reading.

**Decision.** Two kings:
- `king_world` - biology, molecules, assay and institution. 4 queens x 5 workers (HER2 biology, VHH immunology/structure,
  assay/NGS/ground truth, challenge intelligence).
- `king_infer` - sequence-to-interface methods. 5 queens x 5 workers (structure prediction + docking, epitope ML, data representation
  and integration, compute/validation/execution, cross-domain serendipity).
Why two, not one: nine queen digests (~13k words) would exceed one king's budget. Why not three: no third natural seam; q4 stays small.
Serendipity: a dedicated queen (q9) AND a lens on every queen.

**Time policy (new, because of the 14-day window).** Research waves are capped at ~48 h. The dashboard is built from whatever has landed by
then and keeps filling in. **Modeling starts in parallel, not after**: an engineering lane (outside the hive) builds the proxy test set,
runs co-folding on the three targets as soon as sequences are captured, and produces a safe submission-1 early; the ladder decisions come
from q8. The user asked for dashboard first; this is a deliberate, flagged deviation forced by the deadline.

**Concurrency policy.** At most 8 workers in flight at a time (fan-out of ~45 workers happens in waves, queens ordered by dependency:
Wave 1 = q4, q3, q1, q2 (what is the label and what is HER2/VHH); Wave 2 = q5, q6, q7, q8, q9).

**Context budget per level:** worker <= 1 topic; queen <= 5 TL;DRs; king <= 5 digests; emperor <= 2 king logs.

**Next Emperor tick** after the Wave-1 queen digests exist: reassign any stagnant queen, open the proxy-test channel with real PDB ids,
decide whether q7 gets an execution worker pool.

## Tick 1 — 2026-10-17 (round 1 closed: 46 workers, 9 digests, 2 king logs)
**What happened.** All nine queens delivered; no stagnation. q3/q4 captured verbatim pages (`research/_meta/sepiq_verbatim.md`); q7 ran
real tables (1,843,875 VHH, 19,367 labelled: 7,316 Yes / 12,051 Not) and **killed the user thesis four ways** (DCA/Potts, clonal DMS,
mimotope complementarity, PU/denoising): the NGS data carry no per-HER2-residue contrast; they inform only the VHH side. Antigen side must
come from structure (co-fold consensus, exposure, public footprints). HER2 interface base rate ~3-5% (not 12.6%). 9MTE/9MTX are
leakage-free proxies (released 2025-11-19); only 4 public HER2-VHH structures exist. The scorer is ambiguous (chain pooling, AP vs
trapezoid, best-of-5 vs last) and each ambiguity can change the winner. n=3 makes gaps < ~0.1 noise.

**Structure decisions.**
1. KILL further NGS-representation research (q7): keep one utility worker for grouped-CV/family splits. The negative result is a headline
   finding for the dashboard ("why the data-representation hypothesis failed and what survives").
2. MERGE q5+q8 into one **execution sprint** lane (outside the research hive, engineering agents): proxy table, validator, floor submission,
   co-fold consensus, ladder. Research is saturated; value now comes from measured runs.
3. OPEN channels `proxy_labels` (one shared Voronota-LT area>0 table for 5MY6/7QVK/9MTE/9MTX/8GZ5) and `scorer_ambiguity` (owner q4:
   ask organisers via the HF Space community tab).
4. Treat q9 as low-yield; fold its null spreads and decibans recipe into the runbook. No re-dispatch.
5. Add one-off workers (engineering): ANARCI/BLASTp of ONU clones vs known VHHs and alpaca germline; reconcile the three versions of
   `her2_public_complexes.json`; construct/chain-A-length reconciliation.
6. Close Track B/CAPRI and drug-history topics for this deadline.

**Open contradictions carried forward.** HER2 prevalence 0.126 vs 0.03-0.05; chain A length 618/624/630; HF dataset gated (401) vs q7 tables;
Voronota version; official ranking variant; deadline 2026-12-15 vs 1 Dec.

**Round 2 launched this tick (parallel lanes).** Scribe (narrative, expert synthesis, glossary, facts), Predator audit, dashboard build
(scaffold -> six page builders -> integrate + Vercel deploy), modeling lane CPU-only (validator, proxy labels, floor submission).
GPU co-folding waits for measured seconds-per-seed and the user's go (Explorer public partitions, <= 2 GPUs).

## Tick 2 — 2026-10-17 (round 2 closed: dashboard live, floor + Boltz-2 candidates)
**Done.** Dashboard live (https://sepiq26-intelligence.vercel.app, redeployed with model results). Boltz-2 multi-seed co-folding measured:
180 s/seed (A100-40GB), 3.2 GPU-h for 63 runs; antigen PR-AUC macro on 9MTE x2 + 9MTX 0.453 vs exposure prior 0.067 (null 0.054),
kill test (+0.02) passed by +0.387; VHH side 0.72 = floor (CDR prior already covers it). Per-complex spread large (0.96 / 0.32 / 0.076);
ipTM does not reliably say which maps to trust. ONU23 most self-consistent (domain I, ipTM 0.52); ONU11/13 low confidence (ipTM 0.39/0.37).
Shrinkage/log-odds blends did not beat raw by the 0.05 margin. Candidates validated: s1_floor, s2_cofold_candidate, s3_shrunk_blend.
**Blocked.** Chai-1 / OpenFold3 / extra Boltz proxies (5MY6, 7QVK) never got a GPU: sibling session's casmi_cre_* jobs held both GPUs under the
2-GPU rule. Environments, weights and scripts are ready (`model/cofold/slurm/run_chai2.sh`, `run_of3.sh`).
**Decisions.** No upload to Hugging Face without the user's account; organiser email drafted (`research/_meta/organiser_email.md`) but not sent
(no email tool, Chrome extension disconnected). Next: second engine when a GPU frees; ONU domain verification; user uploads S1 floor, then S2.

## Tick 3 — 2026-10-18 (second engine measured: Chai-1 does not help)
Chai-1 0.6.1, 3 seeds x 5 samples on 9MTE_27A05, 9MTE_47D05, 9MTX_29E09, ONU11/13/23 (job 11194640, public gpu, 1 A100, 1.4 h, finished clean; no jobs of ours left).
Proxy antigen AP macro: Chai-1 0.074 (null 0.053; vs exposure prior +0.007, CI -0.02..+0.05) vs Boltz-2 0.453. VHH side 0.59 vs Boltz-2 0.72 vs floor 0.72.
Mean ipTM 0.17-0.27 (Boltz-2 ~0.4), so Chai-1 as run here carries no antigen signal. Equal-weight Boltz-2+Chai-1 ensemble: antigen 0.368, VHH 0.63, both below Boltz-2 alone.
Decision: pre-registered ensemble rule FAILS; no s4 ensemble. S2 raw Boltz-2 stays the main candidate. Chai-1 scripts: `model/cofold/chai_contacts.py`, results `model/cofold/results/{chai,ens}_*`.
Caveat: n=3 proxies, one Chai config (no templates tuned); this is "no evidence it helps", not "Chai-1 is bad".

## Tick 4 — 2026-10-30 (benchmark, lab rules, Mol-1; pre-registered before any Mol-1 result)
**State.** Two Track A submissions are in (floor, raw Boltz-2). The Boltz-2 40-complex benchmark never produced data: the 20-complex run (job 11480155) failed
silently because the YAML MSA paths were relative to the wrong working directory (every unit logged "MSA file not found" and rc=0); the other 20 inputs lack MSAs
(ColabFold server errors). Lab-partition rule is in the global CLAUDE.md (yield guard, weekday 8 pm-8 am); guarded runner `run_cofold_lab.sh` tested except the grace-expiry scancel.
Track B (CAPRI atomic complexes) has no portal, deadline or format on sepiq.uk and needs a CAPRI account: not entered.
**Mol-1** (Molence Bio, Apache-2.0 code, Protenix derivative; self-reported benchmarks; the report indicates PDB training data before 2021-09-30, so the 2025 proxies are leakage-free).
Run: 3 seeds x 5 samples on 9MTE x2, 9MTX and ONU11/13/23 (job 11496897), same label procedure as Boltz-2.
**Pre-registered rule (written before results).** Replace raw Boltz-2 as the Track A antigen-side source only if Mol-1 antigen macro PR-AUC on the 3 proxies beats raw Boltz-2 (0.453)
by >= 0.10 AND the per-complex ordering is not driven by a single complex. A Mol-1+Boltz-2 equal-weight average is a second candidate, adopted only if it beats both by >= 0.05.
Otherwise no new submission: the two accepted submissions stand. Any new submission uses one of the 3 remaining slots and must be validated with `model/validate_submission.py`.
