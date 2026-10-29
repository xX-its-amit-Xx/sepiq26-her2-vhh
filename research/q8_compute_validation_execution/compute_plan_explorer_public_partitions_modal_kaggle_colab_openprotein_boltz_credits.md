---
title: Compute plan - Explorer public partitions, Modal, Kaggle, Colab, OpenProtein, Boltz credits
queen: q8_compute_validation_execution
king: king_infer
worker: compute_plan_explorer_public_partitions_modal_kaggle_colab_openprotein_boltz_credits
tier: expert
tags: [compute, explorer, slurm, boltz-2, openfold3, chai-1, protenix, modal, kaggle, colab, budget, runbook]
confidence: medium
challenge_relevance: 3
serendipity: Sports salary-cap analogy (GPU-hour = cap space, engine = player with WAR per dollar); paid off as a budgeting rule (many cheap seeds first, bench AF3/Protenix-v2), not as a modelling idea.
date: 2026-10-17
---

# TL;DR
Explorer's public `gpu` partition (8 h limit) has A100 and H200 nodes but a deep queue (152 pending, 65 running at probe time, mostly H200 and A100 requests). The whole co-folding plan is only about 14 GPU-hours, so it fits easily within the 2-GPU cap. Modal ($30/month free) is the fallback. Boltz API cost could NOT be estimated: the `boltz-api` CLI on this box is unauthenticated, and the skills say not to guess prices. All per-complex GPU-minute figures below are extrapolations, not measurements, and are labelled as such.

# 1. Explorer, read-only facts (probed 2026-10-17 via `ssh explorer`)
Commands run: `sinfo -s`, `sinfo -p gpu,gpu-short,short -o ...`, `squeue -A b.gyori`, `squeue -A m.minkara`, `squeue -p ... -t PD`, `module avail`, `which apptainer`. Nothing was submitted.

| Partition | Time limit | GPUs (GRES from sinfo) | State at probe |
|---|---|---|---|
| gpu | 8:00:00 | 4 nodes x 8 H200; 2 nodes x 4 A100 + 1 x 3 A100; 15 V100 nodes (sxm2 x3-4, pcie x2); 1 node x 4 T4 | 23 of 25 nodes allocated/mixed, 1 idle (the T4 node d1025), 1 down (c2204) |
| gpu-short | 2:00:00 | same node list as gpu | 54 pending |
| gpu-interactive | 2:00:00 | same node list | not probed |
| short | 2-00:00:00 | CPU only (one V100 node listed) | 151 of 252 nodes allocated, 101 other; 614 pending |
| Minkara_COMBINE_Lab, gyorilab | 14 d / 30 d | lab-owned | NOT used, per CLAUDE.md |

- Queue depth: `gpu` had 152 pending and 65 running. Pending GRES requests: 99 x h200:1, 29 x a100:1, 5 x v100-sxm2:1, 12 x generic gpu:1. `gpu-short` pending: 31 h200:1, 11 a100:1, 7 generic, 2 v100.
- Lab accounts: `b.gyori` had 2 jobs (1 on `gpu`, 1 on `gyorilab` with an H200 for 3 d). `m.minkara` had 17 jobs (several pending L40 jobs on its own partition). Public-queue pressure is mostly other users. Re-check `squeue -A b.gyori` and `squeue -A m.minkara` before each submit.
- Software: `apptainer` and `singularity` at `/usr/bin`; modules `anaconda3/2024.06`, `miniconda3/24.11.1` and `25.9.1`, `cuda/12.1.1, 12.3.0, 12.8.0, 13.2.0`, `cuDNN/9.10.2`. No boltz, alphafold, colabfold or openfold modules, so pip into a conda env or pull a container.
- Scratch: `/scratch/<user>` exists (apptainer-cache and other project dirs), 341 TB free on the filesystem; scratch is purged, so it is not storage.
- Realistic wait: NOT measured (no `sacct` or `squeue --start`; the snapshot is one instant). Judgement: a 1-GPU job of 2 h or less on `gpu-short` accepting A100 or H200 has roughly 40 jobs pending ahead of it, so waits of hours are plausible; do not assume minutes. Requesting `--gres=gpu:a100:1` or `gpu:h200:1` fits HER2+VHH (~755 tokens). V100 (32 GB) probably has the shortest queue (5 pending) but V100 and T4 lack bf16 (see Gotchas).
- Fair-use plan: at most 2 GPUs at once, so `--array=0-N%2` (2 concurrent tasks, 1 GPU each), `--time=02:00:00` on `gpu-short`, about 64 GB memory, 8 cores.

# 2. Engines for HER2-ECD (~630 aa) + VHH (~125 aa) = ~755 tokens

None of these numbers were measured here. The only hard per-token timing found is for AF3: on one 80 GB A100, 1024 tokens took 62 s, 2048 took 275 s, 3072 took 703 s (UAB community container performance.md, seen only as a search snippet). A 40 GB A100 reportedly handles up to 4,352 tokens only with unified memory enabled. Scaling the 62 s figure down to 755 tokens gives about 35-45 s per 5-sample batch; I use 1 GPU-minute per seed-run of 5 samples as a planning number, excluding MSA time.

| Engine | Install route | Weights / license | MSA dependency | VRAM (as reported) | Planning cost per seed-run (5 samples) |
|---|---|---|---|---|---|
| Boltz-2 | `pip install boltz[cuda] -U` (README) | MIT code and weights | `--use_msa_server` calls `https://api.colabfold.com` by default; `msa: empty` allowed but discouraged (prediction.md) | Community: 24 GB min, 48 GB (L40S) recommended; A100-80 or MSA-free mode to avoid OOM (search snippet, low confidence) | ~1 min; `--diffusion_samples 25 --recycling_steps 10` is the AF3-style setting and "takes significantly longer" |
| Chai-1 | `pip install chai_lab==0.6.1` | Apache 2.0 weights, auto-download | `--use-msa-server` (ColabFold, shared); own server via `--msa-server-url` | Docs recommend A100 80, H100 80 or L40S 48; needs bf16 | ~1-1.5 min (guess) |
| OpenFold3 | `pip install openfold3`, `setup_openfold`, `run_openfold predict --query_json=...` | Apache 2.0; default weights OpenBind-0 (0.5.0+); research preview | ColabFold server or JackHMMER/hhblits | README gives no VRAM; mentions low-memory mode and cuEquivariance | unknown; assume ~1.5 min |
| Protenix | `pip install protenix` | v1.0.0 open (Apache 2.0, 2026-02-05); Protenix-v2 (2026-04-08) weights proprietary and not redistributable | local ColabFold-compatible MSA search | not stated | ~1 min (guess) |
| AF3 | weights by request to Google DeepMind (not tested here) | restricted terms | local genetic databases (large) | 40 GB under ~1000 residues, 80 GB for large complexes (third-party guide) | ~1 min; skip unless weights already in hand |
| NanoBodyBuilder2 / ABodyBuilder (VHH only) | pip (ImmuneBuilder) | open | none | CPU is fine | seconds; no HER2 awareness, paratope-side fold only |

Which engine ranks nanobody binders best: a DKFZ record (inrepo02.dkfz.de/record/314413) is reported by search as finding Boltz-2-derived confidence best among Boltz-2, Chai-1, IntFold and AF3 for nanobody-antigen screening. I could not open the page, so this is unverified.

# 3. Boltz credits
- The skill docs (structure-and-binding, protein-screen, cli-setup, version 0.1.1) publish no per-job rate: "run `estimate-cost` and quote only the number it returns". Library-screen cost is tiered by total complex length (target plus candidate).
- Limits from the docs: SAB `num_samples` is 1-10 per job; `recycling_steps >= 1` (default 3); "predictions usually finish in under a few minutes"; binding block is `binding: {type: protein_protein_binding, binder_chain_ids: [B]}`; residue indices 0-based; model string `boltz-2.1`.
- Status here: `boltz-api` 0.37.1 is installed but `auth status` returns `authenticated: false` and `estimate-cost` fails with `auth_required`. Device-code login needs the user in a browser, so I did not start it. Dollar figures and the remaining monthly credit are UNKNOWN.
- Job counts to price once logged in: 3 targets x 25 seeds = 75 jobs, plus 6 proxies x 25 seeds = 150 jobs, total 225 jobs of ~755 tokens (proxies may differ). Action: run `estimate-cost` on ONE payload (HER2 + VHH, `num_samples: 5`), multiply by 225, compare with the credit balance in the Boltz dashboard.
- Whether a seed can be set through the API was not found in the skill reference (grep for "seed" returned nothing); diversity may come only from `num_samples`. Check `boltz-api predictions:structure-and-binding start --help` before relying on 25 independent seeds.

# 4. Other venues

| Venue | GPUs and quota | Limits | Fit |
|---|---|---|---|
| Modal | A100 80 GB $0.000694/s (~$2.50/h), A100 40 GB ~$2.10/h, L40S ~$1.95/h, H100 ~$3.95/h, L4 ~$0.80/h, T4 ~$0.59/h; Starter plan $30 free compute per month (modal.com/pricing). CLAUDE.md says fresh credits arrive monthly; balance not checked. | per-second billing, no idle-timeout games | Fallback for many-seed co-folding: 225 runs x ~1 min on L40S is roughly $7-10 with overhead (estimate). |
| Kaggle | One P100 16 GB or 2x T4; about 30 h/week (users report 30-41, weekly reset, not officially fixed); 12 h sessions (secondary sources; Kaggle page is a JS shell and fetch returned nothing) | 16 GB cards marginal for 755 tokens; no bf16 on T4/P100 | AntiBinder-style small finetune (~30 min on RTX 3090 Ti per the baseline paper) and proxy tests; NOT HER2 co-folding. |
| Colab Pro+ | pricing page returned only a heading; units, GPU types, timeouts UNVERIFIED | idle and max-runtime timeouts (CLAUDE.md) | Interactive debugging and finetunes. |
| OpenProtein.AI | Fold API lists Boltz-2, Boltz-1x, Boltz-1, AlphaFold2 (ColabFold), ESMFold, Protenix, RosettaFold-3 (docs.openprotein.ai/rest-api/fold.html); separate align workflow needed for MSAs | pricing, quotas, sequence limits NOT found; per-model summary at `/fold/model/{model_id}` | Possible second Boltz-2 venue; verify account and quota first. |

Compliance: SEPIQ allows only PUBLIC external data. HER2 and VHH sequences are public challenge data, so sending them to the ColabFold server, Boltz API or Modal does not break the rule. The ColabFold server is shared (Chai-1 docs say so), so compute each MSA once and reuse it across all seeds. Send no Broad drive data anywhere (B: may carry compliance rules).

# 5. Budget table (compute must finish by 2026-10-28)

| Arm | Engine | Runs | GPU-h (est.) | Venue | Wall-clock | Go/no-go gate |
|---|---|---|---|---|---|---|
| A0 MSAs, once per sequence | ColabFold | 9 | ~0 | local or Explorer short | 10-17 to 10-19 | MSAs exist for HER2 and 3 VHH |
| A1 proxy backtest | Boltz-2 | 6 x 25 = 150 | ~3 | Explorer gpu-short, array %2 | 10-19 to 10-22 | proxy PR-AUC above epitope-fraction baseline, else cut seeds |
| A2 main co-fold | Boltz-2 | 3 x 25 = 75 | ~1.5 | Explorer, else Modal L40S | 10-20 to 10-23 | wait over 12 h means move to Modal |
| A3 second engine | Chai-1 or OpenFold3 | 3 x 10 + 6 x 10 = 90 | ~2.5 | Explorer A100/H200 | 10-22 to 10-25 | only if A1 shows Boltz-2 variance is high |
| A4 AF3 / Protenix-v2 | AF3 | 3 x 5 = 15 | ~0.5 | only if weights in hand | 10-25 | benched by default |
| A5 AntiBinder finetune | transformer | 2-3 | ~1.5 | Kaggle or Colab | 10-22 to 10-26 | must beat 0.176 proxy PR-AUC |
| Buffer (reruns, OOM) | any | - | ~5 | any | to 10-28 | hard stop 10-28 |

Total about 14 GPU-h; the real risk is queue latency, not GPU-hours.

# 6. Runbook, 2026-10-17 to 10-31, and the 5-submission ladder
- 10-17 to 10-18: conda env on Explorer, boltz install, user runs `boltz-api auth login --device-code`, `estimate-cost`. Deliverable: `env_ok.txt`, cost figure.
- 10-19 to 10-22: A1 backtest and A2 main folds. Deliverable: per-residue contact frequency over seeds for each of ONU11, ONU13, ONU23.
- 10-23 to 10-25: A3, A5. Deliverable: ensembled CSVs in `chain, seqNum, resName, prediction` format.
- 10-26 to 10-28: buffer, final ensemble weights; compute freeze 10-28.
- 10-29 to 10-31: submit and verify format (3 days reserved).
- Ladder (max 5): S1 Boltz-2 consensus frequency; S2 plus Chai-1/OpenFold3 consensus; S3 plus AntiBinder attention; S4 best blend by proxy backtest; S5 reserve for a format fix. Kill criterion: a rung that does not beat the previous rung on the proxy backtest is dropped and its slot not spent.
- Validation: public HER2/nanobody (and other VHH-antigen) complexes deposited BEFORE the ONU complexes were solved. Leakage risk, stated honestly: Boltz-2, Chai-1 and OpenFold3 training sets may contain the proxies (they are PDB entries), which inflates backtest scores; the hidden ONU complexes cannot be in training, so the backtest is optimistic. SEPIQ rules also say public-data leakage is "not an issue as long as the answer is correct".

# 7. Local headroom (run 2026-10-17)
`Get-PSDrive`: C: 62.5 GB free (CLAUDE.md says ~85, so it has shrunk), D: 45 GB free, O: 4,705.6 GB; CPU load 19 %. Light local work is fine. Stage outputs under `C:\Temp\sepiq26\<topic>\`; cold results go with `rclone copy "C:\Temp\sepiq26\<dir>" O:\rclone-offload\sepiq26\<dir> -P`. Keep Boltz outputs small (CIFs only; delete pae npz files). Nothing large on D:.

# Forced analogy: sports salary cap
(a) GPU-hours are cap space, each engine is a player, and "wins above replacement per dollar" is the gain in proxy-backtest PR-AUC per GPU-hour. (b) Testable idea: rank engines by delta PR-AUC per GPU-hour on the 6 proxies (A1) and allocate seeds in proportion. For Track A, score each residue by the fraction of seeds in which it contacts the partner within a 4-5 A cutoff; this graded 0-1 score suits PR-AUC better than one top-ranked pose. (c) Partly holds: the cap is nowhere near binding (14 GPU-h), so the scarce resource is calendar time and queue latency, where the analogy breaks.

# Gotchas
- Chai-1 needs bf16: V100 and T4 nodes (much of the `gpu` partition) cannot run it. Boltz docs mention `--no_kernels` for older NVIDIA GPUs.
- 16 GB cards (T4, P100) are likely too small for a 755-token complex; a 32 GB V100 is borderline.
- GRES `gpu:h200:1` requests only H200; a generic `gpu:1` may land on a V100.
- The ColabFold MSA server is shared and rate-limited; 225 separate calls will be slow, so compute MSAs once.
- `--diffusion_samples 25` is not 25 seeds; samples within one run share the trunk and are less diverse.
- Proxy backtests on public PDB complexes are in every engine's training data; the epitope fraction of a proxy (0.126 for 8GZ5) sets the PR-AUC floor and differs from the ONU complexes.
- Boltz skill docs say do not quote prices without `estimate-cost`.
- Protenix-v2 weights are proprietary despite the Apache repo licence.
- Queue numbers are a single snapshot.

# Implications for the challenge
1. Start today: create the conda env on Explorer and ask the user to run `boltz-api auth login --device-code` so cost can be priced.
2. Submit Boltz-2 backtest arrays on `gpu-short`, `--time=02:00:00`, `--array=0-N%2`; check `squeue -A b.gyori` and `squeue -A m.minkara` first.
3. Gate 10-20: if no GPU job has started within 12 h, move A1 and A2 to Modal L40S (about $10).
4. Use seed-frequency contact maps as the Track A score; run cheap Boltz-2 seeds first and bench AF3 and Protenix-v2.
5. Freeze compute 10-28; keep 3 days for ensembling and the 5-rung ladder.
6. Keep C: free space above 20 GB; offload cold output to O:.

# Open questions
- Boltz API credit balance, per-job cost, and whether seeds can be set (blocked on auth).
- Actual Explorer queue wait on `gpu-short` for A100/H200 (needs `squeue --start` or a canary job, not allowed in this task).
- Real VRAM and time for Boltz-2 and OpenFold3 at 755 tokens (needs a measured run).
- Colab Pro+ current limits; OpenProtein.AI pricing and quota; exact Kaggle weekly quota.

# Sources
Opened:
- https://raw.githubusercontent.com/jwohlwend/boltz/main/README.md
- https://raw.githubusercontent.com/jwohlwend/boltz/main/docs/prediction.md
- https://raw.githubusercontent.com/aqlaboratory/openfold-3/main/README.md
- https://raw.githubusercontent.com/chaidiscovery/chai-lab/main/README.md
- https://raw.githubusercontent.com/bytedance/Protenix/main/README.md
- https://modal.com/pricing
- https://docs.openprotein.ai/rest-api/fold.html
- Boltz skill docs (boltz-structure-and-binding, boltz-protein-screen, boltz-cli-setup, v0.1.1) and local `boltz-api` 0.37.1 output
- Explorer read-only `ssh explorer` probes, 2026-10-17

Search results only (pages not opened, low confidence): UAB AF3 performance.md, DKFZ record 314413 (inrepo02.dkfz.de), Kaggle quota summaries (gpuperhour.com, aimultiple.com).

Not obtainable: kaggle.com/docs/efficient-gpu-usage (JS shell), colab.research.google.com/signup (heading only), rc-docs.northeastern.edu partitions page (404).
