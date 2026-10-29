# SEPIQ 2026 — project brief (read once; every agent in the hive reads this)

Project root: `D:\Users\<user>\.devin\SEPIQ_2026`. Today when written: 2026-10-17.

## What the challenge is (verified from sepiq.uk /detail and /guideline, 2026-10-17)
**SEPIQ VHH-Epitope-Prediction Challenge 2026** — blind prediction of the **HER2 (ERBB2) ectodomain epitope and the VHH
(nanobody) paratope** for three held-out HER2–VHH complexes (clones **ONU11, ONU13, ONU23**), ground truth = cryo-EM
structures (target ≈ 3.0 Å, University of Osaka: Namba, Kasai, Inoue), released only after judging.
Organisers: SEPIQ (London) + COGNANO Inc. (training data: Yamazaki, Maeda, Imura) + CAPRI, OpenFold, AMED-BINDS;
platform team Neporozhnii, Ostapenko, Harimoto, Ryzhkova, Liu, Tomii, Honma; evaluation Nagata + Kliment Olechnovič (Voronota-LT).
Core hypothesis on the site: **"folding from binding"** — large-scale binding-derived sequence data may carry weak but scalable
signal about interface structure. Presented as testable, not proven.

- **Track A (SEPIQ / Hugging Face, residue level):** per-residue interface probability for antigen (chain A) and VHH (chain B).
  One CSV per complex: `chain, seqNum, resName, prediction` (0–1; omitted residues = 0). Max **5 submissions per team**, teams ≤ 10.
  Code not mandatory but inputs/settings/external public data must be documented. Only PUBLIC external data (PDB, SAbDab...) allowed.
  Prizes: $3,000 / $2,000 / $1,000; top teams invited as consortium authors.
- **Track B (CAPRI, atomic level):** predicted complex structures, CAPRI procedures, DockQ/CAPRI-Q (not yet confirmed for this challenge);
  handled separately via CAPRI registration; prizes set with CAPRI.
- **Metric (Track A, per /guideline):** per-complex PR-AUC, **macro-averaged over the 3 antibodies** (no pooling), two variants:
  unweighted and area-weighted (weighted recall = TP_area/P_area, paired with ordinary precision). Ground truth defined with
  **Voronota-LT** contact areas (columns `chain, seqNum, resName, fact, weight`; antigen–VHH contacts only). Close results are
  resolved with a paired cluster bootstrap (B=2000, 95% CI). NOTE: /detail says the official leaderboard metric is not specified
  and names PR-AUC only for the baseline — contradiction to resolve (q4).
- **Timeline:** Track A submission window **2026-09-01 → 2026-10-31**; results announced **2026-12-15**. (Home page also says
  "scheduled to begin June 2026", judging 1–30 Nov, CAPRI round starts 16 Sept; organisers may extend.) **14 days left.**
- **Data:** HF dataset `sepiq-2026/SEPIQ-2026-training-data` (template CSVs) and **AVIDa-hHER2**: ≈1.8 M VHH sequences from one
  alpaca immunised with wild-type human HER2, two phage-display libraries (pMES4), ONE biopanning round, ~10^5 paired reads each;
  `NGS_read_count_table.csv`; only a few hundred sequences carry binder/non-binder labels (chi-squared before/after panning,
  binder if proportion rose and p ≤ 0.05 — enrichment-derived, not biophysical). Antigen = human HER2 ECD, UniProt P04626 numbering
  incl. signal peptide, construct has C-terminal "GACQ" + His tag. VHH numbering is sequential (NOT Kabat/IMGT).
  ONU11 = 120 aa (+S +His), ONU13 = 120 aa (+S +His), ONU23 = 130 aa (+His). Sequences are printed on /detail (q4: capture verbatim).
- **Baseline:** AntiBinder (Zhang 2025, Brief Bioinform): transformer on sequence + global binding labels, epitope/paratope from attention.
  Proxy test on PDB 8GZ5 (RBD–P17 VHH, epitope fraction 26/206 ≈ 0.126): trained on SAbDab-nano alone ≈ random; pretrained on
  AVIDa-SARS-CoV-2 then fine-tuned on SAbDab-nano → PR-AUC 0.176 (≈30 min on an RTX 3090 Ti).
- Rules: no algorithm restrictions (AF3 / OpenFold3 / Chai-1 / Boltz explicitly fine); leakage from public data "not an issue as
  long as the answer is correct" (!); residents/sanctions exclusions apply; Track A needs an HF account.
- Links: https://sepiq.uk · https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge (Space, 42 likes, 1 community discussion)
  · https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data · Voronota-LT https://github.com/kliment-olechnovic/voronota/releases
  · OpenFold3 https://github.com/aqlaboratory/openfold-3 · SAbDab-nano doi 10.1093/nar/gkab1050 · DockQ doi 10.1371/journal.pone.0161879
  · AntiBinder doi 10.1093/bib/bbaf008 · Hitawala & Gray 2025 (AF3 nanobody docking) doi 10.1080/19420862.2025.2545601.

## Things the user's kickoff template said that do NOT apply
The reused template mentioned a "protease", docking of a protease, and mass-spectrometry ground truth. **This challenge has no protease
and no mass spec.** The "assay" to dissect is **alpaca immunisation → phage display biopanning → NGS read counts → enrichment
statistics**, plus the **cryo-EM** ground truth. The "protein(s)" are **HER2 + the VHH family** (and adjacent ERBB receptors).
Same CASMI/OpenBind lesson: do not copy the template's nouns blindly.

## What the user wants (standing intent)
1. A hive: **Emperor** (decides the SHAPE: kings, queens, workers, channels, context budgets) → **Kings** (manage content, force
   cross-domain serendipity, stagnation rule) → **Queens** (subdomain exploration through workers) → **Workers** (research + build).
2. A **centralized intelligence dashboard on Vercel**: chief-of-staff + CSO + CMO view; layman narrative (what HER2 and nanobodies are,
   what the problem is and why it matters, before/after/big picture); every jargon term clickable with context; drop-downs that go
   arbitrarily deep; 3D structures (HER2, VHHs, complexes), interactive plots/sliders, animations; failure modes; "aha" moments;
   growth of each field over time; practical recommendations with "the fun part of the challenge" and analogous solved problems in
   other fields. Everything a layperson needs without leaving the site.
3. THEN modeling. Suspicion of the user: **data representation / integration of new data** (not a bigger model) is where a breakthrough sits.
4. Compute: Explorer (public partitions only, ≤ 2 GPUs, see CLAUDE.md guardrails), Modal, Kaggle, Colab, OpenProtein, Boltz credits.
   Check headroom (CPU/RAM/disk C: and D:) before any fan-out; ≤ ~8 concurrent agents.

## Output conventions (CRITICAL for workers)
- Each research deliverable is Markdown at `research/<queen_id>/<topic_slug>.md` with YAML frontmatter:
  ```
  ---
  title: ...
  queen: <queen_id>
  king: <king_id>
  worker: <worker_slug>
  tier: layman | intermediate | expert     (dominant tier of the body)
  tags: [ ... ]
  confidence: high | medium | low
  challenge_relevance: 0-5     (how much this helps win Track A PR-AUC)
  serendipity: <one line: the cross-domain analogy you were forced to try, and whether it paid off>
  date: 2026-10-17
  ---
  ```
  Body: 2–3 sentence **TL;DR**; dense sections with tables; **Gotchas / what could fool us**; **Implications for the challenge**
  (numbered, actionable); **Open questions**; **Sources** (only URLs/DOIs actually opened).
- Naturally tabular data ALSO goes as a JSON array-of-objects at the same path with `.json`.
- Cross-queen messages: `research/_channels/<channel_id>.md` (append-only, dated, signed). Only channels in `hive/structure.json` are open.
- Never fabricate citations, numbers, scores, names, dates. Unsure ⇒ say so, confidence low, say what would settle it.
- Tools: WebSearch/WebFetch (load via ToolSearch `select:WebSearch,WebFetch`), the `paperclip` skill for full-text literature,
  GitHub raw READMEs, HF dataset cards. Heartbeat for workers > 15 min: `research/_heartbeat/<worker_slug>.txt`.
