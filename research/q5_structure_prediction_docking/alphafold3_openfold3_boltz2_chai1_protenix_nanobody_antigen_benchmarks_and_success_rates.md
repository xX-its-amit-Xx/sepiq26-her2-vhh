---
title: Co-folding engines (AF3, OpenFold3, Boltz-2, Chai-1, Protenix) for HER2-VHH - benchmarks, pins, GPU-hours, 14-day plan
queen: q5_structure_prediction_docking
king: king_infer
worker: alphafold3_openfold3_boltz2_chai1_protenix_nanobody_antigen_benchmarks_and_success_rates
tier: expert
tags: [alphafold3, openfold3, boltz-2, chai-1, protenix, nanobody, DockQ, install, gpu-hours, leakage, HER2]
confidence: medium
challenge_relevance: 4
serendipity: Known-plaintext attack on a lock - PDB HER2 complexes as known plaintext; paid off as a concrete leakage ablation (templates on/off, 2021 vs 2025 cutoff weights) and an ipTM-weighted consensus-contact scoring idea.
date: 2026-10-17
---

# Co-folding engines for the HER2-VHH blind prediction

**TL;DR.** No published benchmark I could open isolates nanobody-antigen success for Boltz-2, OpenFold3 or Protenix. The one clean nanobody table (Hitawala & Gray, mAbs 2025, 60 nanobody complexes, single seed) puts AF3 at 31.6% DockQ>=0.23, Boltz-1 at 23.3% and Chai-1 at 15.0%. Boltz-2, Chai-1, OpenFold3 and Protenix-v1 can all start today with no weight application. AF3 weights are the only gating item. A ~740-token HER2-ECD plus VHH complex costs seconds to a couple of minutes per seed, so the 40 GPU-hour budget is not binding. MSA handling and evaluation design are the real constraints.

Legend: **opened** means I read the source. **[search-snippet]** means I only saw a search-result summary. **[extrapolated]** means my own interpolation. Not opened at all: the Boltz-2 report, the Chai-1 report, the AF3 Nature paper, the OpenFold3 preprint, the FoldBench Nature Communications page (auth redirect), OpenProtein docs.

DockQ bands: >=0.23 acceptable-or-better, >=0.49 medium, >=0.80 high.

## 1. Benchmarks (engine x benchmark x success rate)

| Engine | Benchmark (source) | n | Date cutoff vs training cutoff | DockQ>=0.23 | High quality | Top-1 vs best-of-N | Status |
|---|---|---|---|---|---|---|---|
| AF3 (server) | Hitawala & Gray mAbs 2025, nanobody-antigen | 60 bound Nb-Ag | structures after 2021-09-30 = AF3 training cutoff | 31.6% | 13.3% (>=0.80) | top-ranked decoy of seed 1 only. Multi-seed docking rates not reported (20 seeds used only for H3 RMSD) | opened (PMC12360200) |
| AF3 | same, antibodies | 49 | same | 34.7% | 10.2% | same | opened |
| Boltz-1 | same, nanobodies | 60 | same | 23.3% | 5.0% | single seed | opened |
| Chai-1 | same, nanobodies | 60 | same | 15.0% | 3.3% | single seed | opened |
| Boltz-1 / Chai-1 | same, antibodies | 49 | same | 20.4% / 20.4% | 4.1% / 0% | single seed | opened |
| AF3 | same paper, DB5.5 (possibly in training) | - | - | 50.8% | - | - | opened; authors attribute gap to 34.7% to possible contamination |
| AF3, Boltz-1, Chai-1 | bioRxiv 10.1101/2025.07.11.662141, antibody-antigen | 110 antibodies (no nanobodies mentioned) | 2021-09-30 | mean DockQ only: AF3 top-ranked 0.29-0.37; Boltz-1/Chai-1 ~0.12-0.14 | - | 40 seeds x 5 models = 200 per complex; AF3 best-of-200 mean DockQ rises from <0.3 to >0.5 | opened; mean DockQ, not success rate |
| AF3 / Boltz-1 / Chai-1 / HF3 | FoldBench Ab-Ag, as tabulated in Protenix-v1 report Table 2 | 160-167 interfaces | after 2021-09-30 to 2025-01-09 | AF3 47.9-48.75%; Boltz-1 33.5-34.4%; Chai-1 23.1-23.6%; HF3 23.6-28.8% | - | official outputs | opened via Protenix PDF; antibody-antigen, nanobodies not split out |
| Protenix-v1 | FoldBench Ab-Ag (same table) | 160 / 167 | cutoff 2021-09-30 | 52.31+/-1.43% / 50.12+/-1.36%; 55.63% / 53.29% with all 20 seeds | - | "5 seeds x 5 samples" bootstrapped from 20 seeds | opened |
| Protenix-v1 | PXM-22to25-Antibody | 498 complexes (359 clusters) in the intersection table | 2022-01-01 to 2025-12-31 | median 33.14%, selected 40.26%, best 54.22% | - | single seed 36.01%, 10 seeds 42.92%, 80 seeds 47.68% (bootstrap from 100 seeds) | opened |
| Boltz-2 | same set | 498 | same | median 38.59%, selected 40.10%, best 50.35% | - | - | opened; **Protenix authors flag overlap with Boltz-2 training data** |
| Chai-1 / Boltz-1 | same set | 498 | same | selected 22.12% / 20.59% (median 17.77% / 17.27%) | - | - | opened |
| Protenix-v2 | PX2 report | 3 collections | - | +9 to +13 points over v1; v2 at 5 seeds beats v1 at 1000 seeds | gains at >0.8 too | 5 to 1000 seeds | opened (text only); **v2 weights proprietary, not downloadable** |
| OpenFold3-preview2 | AF3 antibody-antigen set | - | - | figure only, no numbers in README | - | - | **unverified** |
| Boltz-2 | Boltz-2 technical report | - | - | Tamarind blog: improves over Boltz-1, still below AF3, no numbers | - | - | report not opened; **unverified** |
| Chai-1 | technical report doi 10.1101/2024.10.10.615955 | - | - | not opened | - | - | **unverified** |
| Chai-1 vs AF2 (nanobodies) | a search summary claimed Chai-1 45% (34/76) vs AF2 39% (30/76) | 76 | - | - | - | - | **[search-snippet], source could not be confirmed; do not cite** |

**Reading across the table.**
1. For nanobodies the only opened engine ranking is AF3 > Boltz-1 > Chai-1, single seed, n=60. 31.6% of 60 is about 19 successes, so the 95% CI is roughly 21-45% (my arithmetic).
2. Protenix-v1 and Boltz-2 are evaluated on antibody sets, not nanobody-only. Their nanobody rate is unknown and I do not guess it.
3. Seed scaling is real: Protenix-v1 goes 36.0 -> 42.9 -> 47.7% at 1, 10, 80 seeds. AF3 best-of-N mean DockQ roughly doubles at 200 samples. Top-1 selection recovers only part of the best-of-N gain (Protenix selected 40.3% vs best 54.2%).
4. Confidence ranking for nanobodies (Hitawala & Gray, AF3): ipTM-HA alone has average precision 0.450 (cutoff >=0.40). I-pLDDT + a Rosetta dG term reaches AP 0.743, the best they report. Transfer to other engines is untested.

## 2. Version pins, licences, 14-day usability

Verified by GitHub API, PyPI JSON and raw files on 2026-10-17.

| Engine | Latest release (date) | Tag commit | HEAD seen | Python / torch / CUDA | Licence and weights | No application needed within 14 d? |
|---|---|---|---|---|---|---|
| AF3 google-deepmind/alphafold3 | v3.0.4 (2026-07-28) | 85c4d20505 | 03f4f48867 (2026-10-15) | JAX in Docker/Singularity; host CUDA 12.6; compute capability >=8.0; officially A100 80GB or H100 80GB | Code Apache-2.0. **Weights only if received directly from Google under separate Terms of Use.** README lists a download URL but no formal process; questions to alphafold@google.com. Turnaround unknown | **NO** unless weights already held. Bonus, not a dependency |
| Boltz jwohlwend/boltz | v2.2.1 (2025-09-08); PyPI 2.2.1 | cb04aeccdd | b1ebfc46ec (2026-05-29) | python >=3.10,<3.13; torch>=2.2; pytorch-lightning==2.5.0; cuequivariance cu12 >=0.5.0 | MIT, code and weights | **YES** |
| Chai-1 chaidiscovery/chai-lab | v0.6.1 (2025-03-18); PyPI 0.6.1 | 8d5ac0f93e | 66c38d1fe5 (2026-06-30) | Python >=3.10; torch>=2.3.1 (2.3.1-2.7.1 confirmed); Linux; bf16 GPU; A100 80GB / H100 80GB / L40S 48GB recommended | Apache-2.0 code and weights per README | **YES** |
| OpenFold3 aqlaboratory/openfold-3 | v0.5.0 (2026-08-21); PyPI 0.5.0 | c4771653c5 | afb570517d (2026-10-16) | Python 3.10-3.13; torch>=2.7; cuequivariance>=0.8; CUDA >=12.1; >=32GB GPU, tested mostly on A100 40GB | Apache-2.0. `setup_openfold` downloads weights. Default OpenBind-0 (`of3-ob-2025-06-30-174k.pt`, **cutoff 2025-06-30**). Older preview2 weights need `pip install "openfold3<0.5"`. Research preview | **YES** |
| Protenix bytedance/Protenix | v2.0.0 (2026-04-07); PyPI 2.0.0 | 2475421477 | 85767b811c (2026-09-21) | requires-python >=3.11; requirements pin torch==2.7.1, cuequivariance 0.8.0, triton 3.3.1, deepspeed 0.17.5 | Apache-2.0 project and v1 weights; **v2 weights proprietary**. README text conflicts (Apache covers weights vs v2 note). Use `protenix_base_default_v1.0.0` (cutoff 2021-09-30) | **YES, v1 only** |

Training cutoffs: Protenix v1 default 2021-09-30; `protenix_base_20250630_v1.0.0` 2025-06-30; OpenFold3 OpenBind-0 2025-06-30; AF3 2021-09-30.

## 3. GPU-hours for HER2 ECD (~620 aa) + VHH (~120 aa) = ~740 tokens

One token per standard residue gives ~740 (plus a few for tags). AF3 bucket would be 768.

| Engine | Measured anchor (source) | Estimate for ~740 tokens | Peak VRAM | Status |
|---|---|---|---|---|
| AF3 | A100 80GB: 62 s at 1024 tokens, 275 s at 2048; H100: 34 s and 144 s (docs/performance.md, compile-free) | A100 about 35-45 s, H100 about 20-25 s, plus one-off JIT compile per bucket | not published; 40GB A100 supported to 4352 tokens with unified memory | anchors measured; 740 extrapolated |
| Protenix-v1 | 500 tokens: 6.1 GB, 17 s; 1000: 18.2 GB, 59 s; 2000: 66.6 GB, 226 s (training_inference_instructions.md; GPU model not stated in lines I read) | about 35-40 s, about 11-13 GB | ~12 GB: T4 marginal, L40S / RTX 6000 fine | measured at 500/1000 only |
| Boltz-2 | none opened. Defaults: 3 recycles, 200 sampling steps, 1 diffusion sample | similar order, roughly 1-2 min per seed with 5 samples | unknown | fully extrapolated |
| Chai-1 | none opened; 5 samples default | 1-3 min per run | unknown | fully extrapolated |
| OpenFold3 | none opened; >=32GB stated | 1-3 min per run | >=32GB | fully extrapolated |

- **T4 16GB:** AF3 blocked (capability 7.5; docs note numerical issues on 7.x and limit V100 to 1280 tokens). Protenix marginal. OpenFold3 blocked (32GB floor). Boltz-2/Chai-1 risky.
- **RTX 6000 (24GB assumed, model generation unverified):** Boltz-2 and Protenix likely fine; OpenFold3 below its floor; Chai-1 listed only for smaller complexes.
- **MSA cost:** ColabFold MMseqs2 server (`--use_msa_server` in Boltz, `--use-msa-server` in Chai-1, ColabFold-compatible MSA in Protenix, default in the OpenFold3 example) takes minutes per sequence and is rate-limited. Compute HER2 ECD once, each VHH once, reuse across seeds and engines. AF3's local pipeline needs the large genetic databases and fast SSD, impractical in 14 days. Inject ColabFold a3m into the AF3 JSON `unpairedMsa` fields (docs/performance.md describes MSA reuse). Chai-1 README warns the ColabFold strategy differs from its preprint. VHH MSAs are shallow, so little cost.
- **Budget [extrapolated]:** 4 engines x 3 complexes x 40 seeds x ~1.5 min is about 12 A100-hours; a 4x error still fits in 40 h.

## 4. Install recipes (nothing was installed or run here)

Explorer rules: partition `gpu` or `gpu-short` only, one GPU per job, at most 2 concurrent, never `gyorilab` or `Minkara_COMBINE_Lab`; check `squeue -A b.gyori` and `squeue -A m.minkara` first. Module names are **unverified**; run `module avail cuda anaconda`.

```bash
module load cuda/12.1 anaconda3          # names unverified
conda create -n cofold python=3.11 -y && conda activate cofold
pip install "boltz[cuda]==2.2.1"          # Boltz-2 default model
pip install "chai_lab==0.6.1"
pip install protenix                      # 2.0.0 package; use v1 weights
pip install openfold3 && setup_openfold   # set OPENFOLD_CACHE to /scratch/<user>/of3 first
boltz predict her2_onu11.yaml --use_msa_server --diffusion_samples 5 --recycling_steps 3 --out_dir out_boltz
protenix pred -i input.json -o out_px -n protenix_base_default_v1.0.0
run_openfold predict --query_json=query.json
srun -p gpu-short --gres=gpu:1 --time=02:00:00 --mem=48G -c 8 bash run.sh
```
Chai-1 CLI flags (`--use-msa-server`, `--use-templates-server`) are from its README; confirm exact subcommand with `chai-lab --help`. Torch pins differ (Protenix 2.7.1, Chai <=2.7.1, OpenFold3 >=2.7), so use one env per engine if pip conflicts appear.

Boltz YAML for one complex (docs/prediction.md): `sequences:` with `- protein: {id: A, sequence: <HER2 ECD>}` and `- protein: {id: B, sequence: <VHH>}`; omit `msa` when using `--use_msa_server`. AF3-like settings are `--recycling_steps 10 --diffusion_samples 25` (slower).

**Modal (untested):**
```python
import modal
img = modal.Image.debian_slim(python_version="3.11").pip_install(
    "boltz[cuda]==2.2.1", "chai_lab==0.6.1", "openfold3==0.5.0", "protenix==2.0.0")
app = modal.App("cofold")
@app.function(gpu="A100-80GB", image=img, timeout=3600,
              volumes={"/cache": modal.Volume.from_name("cofold-cache", create_if_missing=True)})
def run(job): ...
```
Split into one image per engine if pins clash; keep weights on the volume.

**Colab Pro+:** `!pip install "boltz[cuda]==2.2.1"` then `!boltz predict ...` on an A100 or L4 runtime; T4 is the risky case. Idle and max-runtime limits apply, so run Boltz-2 or Protenix and copy outputs to Drive.

**OpenProtein:** docs not opened; nothing verified.

**Boltz hosted credits via `boltz-api`** (from the installed Boltz plugin skills v0.1.1):
```bash
irm https://install.boltz.bio/boltz-api/install.ps1 | iex      # Linux: curl -fsSL https://install.boltz.bio/boltz-api/install.sh | sh
boltz-api auth login --device-code
boltz-api predictions:structure-and-binding estimate-cost --model boltz-2.1 --input @yaml:///ABS/payload.yaml
boltz-api predictions:structure-and-binding start --model boltz-2.1 --idempotency-key her2-onu11-v1 --input @yaml:///ABS/payload.yaml --raw-output --transform id
boltz-api download-results --id <job-id> --name her2-onu11-v1 --root-dir /ABS/boltz-experiments --poll-interval-seconds 10
```
Payload: `entities: [{type: protein, chain_ids: [A], value: <HER2 ECD>}, {type: protein, chain_ids: [B], value: <VHH>}]`, optional `binding: {type: protein_protein_binding, binder_chain_ids: [B]}`. Field names are `chain_ids` (array) and `value`; residue indices in constraints are 0-based. Run `estimate-cost` and get the user's confirmation before `start`. The hosted `boltz-2.1` is not necessarily the open-source v2.2.1.

## 5. Nanobody failure statistics

| Failure mode | Evidence (Hitawala & Gray 2025 unless stated) |
|---|---|
| CDR3 correct but docking wrong | Given high-accuracy docking, H3 RMSD <=1.0 A in 84.7% of nanobodies. Given H3 RMSD <=1.0 A, high-accuracy docking in only 36.2% (antibodies 55.8%). P(acceptable docking) falls below P(wrong) at H3 RMSD 2.1 A for nanobodies |
| H3 accuracy, unbound, single seed, median | AF3 3.01 A, AF2-M 3.05 A, Boltz-1 3.78 A, Chai-1 3.63 A; AF3 with 20 seeds 2.2 A |
| Wrong interface | AF3 outcomes are bimodal (right interface or not). AF2.3-M, Boltz-1, Chai-1 can predict accurate H3 yet misplace the antigen. No quantified epitope-swap rate |
| Training dependence | Nanobody H3 median RMSD pre-cutoff 1.80 A vs post-cutoff 3.01 A; sub-angstrom H3 in 20.3% vs 4.2%. No edit-distance trend for nanobodies. Spike-binding nanobodies (7 of 36 medium-length) predicted with a closed RBD that hides the paratope |
| Cross-engine leakage (bioRxiv 662141, antibodies) | AF3 DockQ rises when a structurally similar complex is in training (less for Chai-1). Correlation weak: Cc 0.32 (complex search), 0.17 (interface search). Max concatenated-CDR identity to training 72%, typically ~50% |
| Hallucinated interfaces for non-binders | No opened source quantifies this. **Unverified/absent** |
| Epitope swap to wrong HER2 domain | No opened source. 5MY6 (HER2 with nanobody 2Rs15d, domain I, 2.25 A, 2017) and 1N8Z (trastuzumab Fab, 2.52 A) are known PDB complexes **[search-snippet]**; residue-level epitopes not checked |

HER2 leakage: both 5MY6 and 1N8Z pre-date every 2021-09-30 cutoff, so HER2 is a well-seen antigen for all engines. I did not enumerate other anti-HER2 PDB entries (needs a PDB query on UniProt P04626). Expect good HER2 geometry and weak VHH-specific pairing.

## 6. Recommended ensemble (~40 GPU-hours, three complexes)

| Engine | Seeds x samples | Why | GPU-h, all 3 complexes [extrapolated] |
|---|---|---|---|
| Protenix-v1 (`protenix_base_default_v1.0.0`) | 40 x 5 | best-documented log-linear seed scaling, open weights, measured latency | ~2 |
| Boltz-2 v2.2.1 (`--use_msa_server`) | 40 x 5 | open; strongest Boltz on Ab-Ag (overlap caveat) | ~3-4 |
| OpenFold3 v0.5.0 (OpenBind-0) | 20 x 5 | no published nanobody numbers; cutoff 2025-06-30 gives a leakage contrast | ~2-3 |
| Chai-1 v0.6.1 | 20 x 5 | weakest in cited tables; diversity only | ~1.5 |
| AF3 | 40 x 5, only if weights in hand | only engine with a measured nanobody lead | ~1-2 |

That uses about 10-13 GPU-hours. Spend the remainder on the leakage ablation and a second MSA protocol, not on seeds beyond ~40 (gains are log-linear).

**Expected success, quoted from sources.** No source reports an ensemble nanobody success rate. Anchors: AF3 single seed 31.6% on 60 nanobodies; Protenix-v1 36.0% single seed rising to 42.9% (10 seeds) and 47.7% (80 seeds) on a mixed antibody set, with confidence-selected 40.3% vs best-of-N 54.2%. A planning figure of 30-45% per VHH for a DockQ>=0.23 pose is defensible but is my inference. Track A scores residues, so consensus contacts give partial credit even when the pose is wrong.

## Forced analogy: known-plaintext attack on a lock

(a) Each engine is a lock-picking tool. The public PDB HER2 complexes (5MY6, 1N8Z and others) are known plaintext-ciphertext pairs, so HER2-side geometry is partly memorised. The unseen lock is the VHH-specific CDR3 shape. Success on HER2 epitope families the model has seen is memorised plaintext; a correct novel VHH pose is generalisation.
(b) Testable ideas. (1) **Leakage ablation:** run OpenFold3 and Boltz-2 (templates are optional) with and without HER2 templates and compare per-residue contact maps; if the HER2-side map is stable, the uncertainty sits on the VHH side. (2) **Cutoff contrast:** run `protenix_base_default_v1.0.0` (2021) vs `protenix_base_20250630_v1.0.0` (2025) vs OpenFold3 OpenBind-0 on the same inputs; differences in HER2 interface residues estimate the influence of newer HER2 entries. (3) **Consensus frequency as the Track A probability:** score each residue by the ipTM-weighted fraction of engine x seed x sample poses that place it in contact (heavy atoms within ~5 A), and calibrate engine weights by PR-AUC on public HER2-VHH/Fab structures (leaked, so a sanity check only).
(c) The analogy **partially holds**. It captures memorised versus generalised success and motivates the ablation. It breaks because memorisation in a neural network is graded, not exact, there is no fixed query budget, and Hitawala & Gray find no CDR edit-distance trend for nanobodies and only weak correlation with training similarity.

## Gotchas / what could fool us

- **Mixed benchmarks.** Antibody and nanobody rates are not interchangeable. Only Hitawala & Gray separates nanobodies; the Protenix and Boltz-2 numbers are antibody-heavy.
- **Boltz-2 overlap.** The Protenix report says its antibody set contains part of Boltz-2 training data, so the Boltz-2 row overstates blind performance.
- **DockQ is not Track A.** DockQ>=0.23 is a pose metric; Track A is residue PR-AUC on Voronota contacts. A wrong pose on the right HER2 region can still score.
- **Seed noise.** Protenix's own 20-seed bootstrap gives a 95% CI of 49.3-56.3% for one "5 seeds x 5 samples" run. Differences of a few points between engines are noise.
- **Top-1 loses much of the gain.** Selected 40.3% vs best 54.2% (Protenix); ipTM ranking has AP only ~0.45 for nanobodies.
- **Cutoffs differ.** The `20250630` and OpenBind-0 weights have seen recent HER2 structures, which inflates any validation on HER2 PDB entries.
- **MSA mismatch.** ColabFold MMseqs2 MSAs differ from each tool's original pipeline (Chai-1 README warns). No meaningful paired VHH-HER2 MSA exists.
- **AF3 weights.** README states they may be used only if received directly from Google. Do not assume 14-day approval.
- **Version confusion.** `boltz predict` runs Boltz-2 by default from the same package as Boltz-1. Hosted `boltz-2.1` is not the open v2.2.1. Protenix README says Apache covers weights yet v2 weights are proprietary. OpenFold3 README's citation block says 0.4.2 while releases are at v0.5.0.
- **Short-chain extrapolation.** 740 tokens is below the 1024-token anchor for AF3 timing, so downward extrapolation is the weakest number here.
- **Search-summary numbers.** The Chai-1 45% (34/76) and FoldBench 46-nanobody claims came only from search summaries; I excluded them from the table.

## Implications for the challenge

1. **Go now (no application):** Boltz-2 (MIT), Chai-1 (Apache), OpenFold3 v0.5.0 (Apache, OpenBind-0), Protenix-v1 (Apache). **Conditional:** AF3 (weights).
2. **No-go for 14 days:** Protenix-v2 (proprietary weights), AF3 without weights in hand, and any plan resting on benchmark claims I could not open.
3. Compute MSAs once (HER2 ECD once, each VHH once) via the ColabFold server and reuse the a3m across engines and seeds.
4. Run Protenix-v1 and Boltz-2 first (40 x 5), then OpenFold3 and Chai-1 (20 x 5), on `gpu`/`gpu-short`, at most 2 GPUs.
5. Build per-residue scores as ipTM-weighted contact frequency over all poses, not top-1; sanity-check on public HER2 complexes knowing they are leaked.
6. Run the leakage ablation (templates on/off, 2021 vs 2025 cutoffs) before weighting engines.
7. Use Boltz hosted credits for one cross-check per complex with `boltz-2.1`, after `estimate-cost` and user confirmation.
8. Email Google for AF3 weights today regardless; it is the only engine with a measured nanobody lead.

## Open questions

- Nanobody-only success for Boltz-2, OpenFold3 OpenBind-0 and Protenix-v1. Settle by running the Hitawala & Gray 60-nanobody set.
- Real per-seed time and VRAM for Boltz-2, Chai-1, OpenFold3 at 740 tokens. Settle with a one-hour timing job on `gpu-short`.
- AF3 weights turnaround.
- How many anti-HER2 VHH/Fab PDB entries each engine trained on (PDB query on P04626 not done).
- What the Boltz-2 and Chai-1 reports say about antibody-antigen (not opened).
- Whether OpenProtein hosts any of these engines (not opened).

## Sources (opened)

- Hitawala & Gray, mAbs 2025, doi 10.1080/19420862.2025.2545601, read via PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC12360200/ (tandfonline returned 403)
- https://www.biorxiv.org/content/10.1101/2025.07.11.662141v2.full
- https://raw.githubusercontent.com/bytedance/Protenix/main/docs/PTX_V1_Technical_Report_202602042356.pdf
- https://raw.githubusercontent.com/bytedance/Protenix/main/docs/PX2.pdf
- https://github.com/bytedance/Protenix (README, docs/supported_models.md, docs/training_inference_instructions.md, requirements.txt, docs/model_1.0.0_benchmark.md)
- https://github.com/google-deepmind/alphafold3 (README, docs/installation.md, docs/performance.md)
- https://github.com/jwohlwend/boltz (README, docs/prediction.md, pyproject.toml)
- https://github.com/chaidiscovery/chai-lab (README, requirements.in, pyproject.toml)
- https://github.com/aqlaboratory/openfold-3 (README, docs/source/Installation.md, docs/source/parameters_reference.md, pyproject.toml)
- GitHub REST API (releases, tags, commits) for the five repos and PyPI JSON for boltz, chai-lab, openfold3, protenix, queried 2026-10-17
- Boltz plugin skills boltz-structure-and-binding and boltz-cli-setup (local, v0.1.1)
- https://www.tamarind.bio/blog/boltz2-state-of-the-art-structure-and-binding-affinity-prediction (no numbers)
- Search results only, not opened in full: RCSB 5MY6 / 1N8Z summaries; FoldBench https://www.nature.com/articles/s41467-025-67127-3
