# SEPIQ 2026 modeling lane: CPU results log (2026-10-17)

Scope: CPU only, no GPU, no Explorer, nothing uploaded to Hugging Face. venv: `C:\Temp\sepiq26\venv` (Python 3.14, numpy 2.5.4, scipy, scikit-learn 1.9.1, gemmi 0.7.5, freesasa 2.2.1, ANARCI 2026.2.13.2 + pyhmmer 0.12.3). Scratch and raw PDB files: `C:\Temp\sepiq26\model\`. Resources at start: CPU about 10%, C: 63 GB free, D: 45 GB free; one process at a time.

Run order (all from this folder, with the venv python):
`python validate_submission.py --self-test` | `python proxies/build_proxy_labels.py` | `python metric.py` | `python baselines.py` (about 70 s) | `python make_floor.py` | `python test_roundtrip_metric.py`

## 1. Files

| File | What |
|---|---|
| `sepiq_common.py` | constructs parsed from `research/_meta/sepiq_verbatim.md` (antigen = P04626 1-624 + His6 = 630; clones 127/127/135 incl. His6) |
| `validate_submission.py` | validator + `--self-test` (24 cases incl. 20 broken sets) |
| `proxies/build_proxy_labels.py`, `proxies/proxy_labels.csv`, `proxies/proxy_summary.json`, `proxies/gt_P*.tsv` | ONE shared label table (4,065 rows), per-proxy summary, guideline-format positives |
| `metric.py` | PR-AUC in all variants + shuffle null + paired bootstrap (sklearn cross-checked) |
| `features.py`, `baselines.py`, `results/*.csv` | baselines and league results (`baseline_results.csv` has every variant) |
| `make_floor.py`, `submissions/s1_floor/prediction_ONU{11,13,23}.csv`, `provenance.json` | floor submission, validated PASS |
| `test_roundtrip_metric.py`, `results/roundtrip/` | CSV -> join -> PR-AUC equals in-memory value (max difference 0.0, 6 proxies x 12 variants) |
| `data/` | local copies of inputs (P04626, habitat mask, q1 public complexes, q2 615-entry VHH table, patched ANARCI source as `.txt`) |

## 2. Validator (task 1)

Header names/order, residue numbering against the printed construct (antigen P04626 numbering incl. the 22-aa signal peptide, 1 = M; VHH sequential, 1 = first printed residue) with automatic constant-offset detection (reports -22 for mature numbering, +1 for 0-based), duplicates, value range and finiteness, ties judged on the written text, tags (A625-630, final His6 of the VHH) must be exactly 0, all three complexes, and a round trip (read, rebuild vectors, rewrite, reread, join to the construct by chain+seqNum+resName, ranking unchanged).
Self-test: 24 cases, 0 problems. Detected: -22 antigen offset, 0-based VHH, capitalised header, reordered columns, 2-decimal rounding (ties), non-zero His tag on either chain, value 1.7, value -0.2, NaN, text value, duplicate row, wrong resName, 1-letter and lower-case resName, chain H, seqNum 3.0, all-zero file, A/B swapped, missing file. Warn-only and still PASS: extra column, UTF-8 BOM. CRLF passes.
The Space itself checks only the four header names, so this validator is stricter than the portal on purpose.

## 3. Proxy labels (task 2): real Voronota-LT, base-rate contradiction resolved

Voronota-LT **v1.1.497** ran natively on Windows (binary `C:\Temp\sepiq26\tools\vlt.exe`, sha256 `7aa396d9...3730`, provenance not independently verified beyond `--help` reporting the version). The guideline quotes v1.1.479; we did not test v1.1.479, so a version effect is not excluded. No stand-in was needed. Command is the guideline's (`--restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]' --write-sites-residue-level-to-file`), one run per 1:1 antigen/VHH pair taken from RCSB `files.rcsb.org/download/<id>.cif` (asymmetric unit, standard amino acids only, no waters/ligands/glycans, no symmetry mates). Keeping hetero atoms changed nothing for HER2 (same residue counts) and added 2 antigen and 2 VHH residues on 8GZ5 (EDO). 9MTE carries two VHHs on one HER2; each is run as its own pair.

Numbering: HER2 auth numbering equals P04626 numbering (match fraction 1.000 for 5MY6, 7QVK, 9MTE; 0.9975 for 9MTX, one engineered residue, position 46). VHH seqNum = sequential SEQRES index; ANARCI IMGT label stored per VHH residue.
Universe = the template-like set: antigen P04626 1..618 (618 inferred, see limitations), VHH = full SEQRES; residues not modelled in the structure stay in the universe with `resolved=0` and label 0.

**Sanity check that matters:** 8GZ5 with area>0 gives 26 antigen positives of 206 = 0.1262, identical to the organisers' stated 26/206. So our label rule and universe reproduce theirs on that entry.

| Proxy | PDB / VHH | Antigen pos (area>0) / 618 | rate: >0 | rate: >=5 A^2 | rate: d<4 A | rate over resolved only (>0) | VHH pos / len | VHH rate >0 |
|---|---|---|---|---|---|---|---|---|
| P1 | 5MY6 / 2Rs15d | 21 | 0.034 | 0.031 | 0.028 | 0.038 | 24 / 115 | 0.209 |
| P2 | 7QVK / NM-02 | 25 | 0.041 | 0.036 | 0.021 | 0.049 | 15 / 132 | 0.114 |
| P3 | 9MTE / 27A05 | 34 | 0.055 | 0.042 | 0.029 | 0.075 | 27 / 146 | 0.185 |
| P4 | 9MTE / 47D05 | 18 | 0.029 | 0.028 | 0.016 | 0.040 | 17 / 128 | 0.133 |
| P5 | 9MTX / 29E09 | 31 | 0.050 | 0.041 | 0.028 | 0.078 | 27 / 122 | 0.221 |
| P6 | 8GZ5 / P17 (RBD, 206) | 26 / 206 | 0.126 | 0.083 | 0.073 | 0.133 | 22 / 126 | 0.175 |

**Resolution of the q1/q3 contradiction:** for HER2 the antigen base rate is **0.029-0.055 (mean 0.042) of the 618-residue universe**, 0.040-0.078 of modelled residues; the "0.126" is the RBD entry 8GZ5 only. VHH base rate is 0.11-0.22. The >=5 A^2 and d<4 variants lower the rate by roughly 10-45% (d<4 the most), so the definition matters for the baseline but the ordering of proxies does not change.

## 4. Metric (task 3)

Per-complex PR-AUC, macro over complexes, each of: AP (step sum, sklearn semantics) vs trapezoid (sklearn `auc` on the PR points, anchored at recall 0 / precision 1); unweighted vs area-weighted (recall = TP_area/P_area, ordinary precision); scope antigen-only, VHH-only, pooled A+B inside one complex. `metric.py` is checked against `average_precision_score` and `auc(precision_recall_curve)` on 50 random tied inputs (exact to 1e-12).
Paired bootstrap, B=2000 capable (1000 used in the log): `residue` (guideline wording, same draw for both teams, independent across complexes because lengths differ), `block` (circular blocks of 8 residues, crude proxy for spatially clustered errors), `complex` (degenerate at n=3 and at 5 proxies; shown only to document that).

**Ties trap found while testing the metric:** a constant (all-tied) prediction scores AP = prevalence (antigen 0.042, VHH 0.172, pooled 0.064) but trapezoid **0.521 / 0.586 / 0.532**. If the organisers use trapezoid with sklearn conventions, a sparse submission with many omitted (=0, tied) residues that contain positives is inflated, and the inflation is not real skill. The floor writes a unique non-zero value for every non-tag residue 23-618 to be safe under both.

## 5. Baselines on the proxies (task 4)

League = P1-P5 (5 complexes from 4 PDB entries; P3 and P5 share an epitope bin). Nothing is fitted on labels: exposure = RSA of HER2 in 8Q6J (q1 mask, computed in a Fab complex, so it is slightly biased against that Fab's epitope), dimer-patch penalty 0.5 on the 51-residue union of HER3/EGFR/HER4 contacts (q1), footprint weight 0.3, VHH positional prior from the **610 non-proxy** PDB VHH complexes in q2's table (all 5 proxy PDBs excluded). Only the footprint touches proxy labels, and it is rebuilt leaving out the held-out PDB (both 9MTE and 9MTX for either). Scores are rescaled per chain (antigen mean 0.045, VHH mean 0.15, rank preserving) and made unique by a 1e-7 random tie-breaker; His6 = 0.
Shuffle null: predictions permuted within each chain of each complex, 300 permutations, macro recomputed.

Primary label = area>0; AP; unweighted. Macro over the 5 HER2 proxies (null mean in brackets):

| Arm | antigen-only | VHH-only | pooled A+B |
|---|---|---|---|
| uniform (random order, one draw) | 0.070 (0.051) | 0.208 (0.204) | 0.153 (0.142) |
| antigen exposure (8Q6J RSA) | 0.070 (0.052) | 0.208 | 0.160 (0.142) |
| exposure x (1 - dimer) | 0.067 (0.052) | 0.208 | 0.150 (0.136) |
| public footprint only (LOCO) | 0.092 (0.050) | 0.208 | 0.135 (0.110) |
| **exposure x (1 - dimer) x mild footprint** | **0.082 (0.051)** | 0.208 | 0.159 (0.134) |
| VHH positional CDR prior (ANARCI IMGT) | 0.070 | **0.692 (0.203)** | 0.388 (0.106) |
| VHH CDR3 indicator (IMGT 105-117) | 0.070 | 0.353 (0.191) | 0.182 (0.072) |
| VHH own-structure RSA (needs a structure) | 0.070 | 0.296 (0.200) | 0.187 (0.121) |
| **FLOOR = antigen composite + VHH prior** | **0.082 (0.051)** | **0.692 (0.203)** | **0.389 (0.099)** |
| all-tied constant (not submittable) | 0.042 | 0.172 | 0.064 (trapezoid: 0.52 / 0.59 / 0.53) |

Floor composite, other variants (macro, null in brackets):

| Variant | antigen | VHH | pooled |
|---|---|---|---|
| AP, area-weighted | 0.094 (0.051) | 0.709 (0.203) | 0.444 (0.101) |
| trapezoid, unweighted | 0.076 (0.047) | 0.683 (0.189) | 0.384 (0.093) |
| AP, unweighted, label >=5 A^2 | 0.082 (0.045) | 0.674 (0.187) | not tabulated here, in csv |
| AP, unweighted, label d<4 A | 0.078 (0.034) | 0.493 (0.150) | in csv |
| AP, unweighted, modelled residues only | 0.128 (0.067) | 0.696 (0.221) | 0.429 (0.122) |

Per-complex floor AP (unweighted, area>0): antigen P1 0.057, P2 0.073, P3 0.119, P4 0.052, P5 0.108; VHH P1 0.700, P2 0.591, P3 0.843, P4 0.544, P5 0.779. Sanity 8GZ5 (RBD, VHH prior + own-structure RSA): antigen exposure 0.198 vs null 0.146 (the organisers' reported 0.176 for AntiBinder, if it is the same quantity, is below what a bare RSA ranking gives here, but our RSA uses the bound structure's own chain and gives 0 to unmodelled residues, so this row is optimistic); VHH prior 0.623 vs 0.201.

Paired bootstrap (1000 draws, AP unweighted, floor minus uniform, 5 proxies): antigen +0.012, CI [-0.027, +0.049] (residue), [-0.027, +0.046] (block), p = 0.54; **not distinguishable from zero**. VHH +0.484, CI [0.39, 0.56], excludes zero in all three modes. Composite minus exposure alone (antigen): +0.012, CI [-0.013, +0.033], not distinguishable. Complex-level resampling gives misleadingly tight intervals on pooled comparisons (p = 0.0 for exposure vs uniform pooled), which is why it is flagged degenerate.

### Headline
- Macro PR-AUC of the floor on the proxy league: antigen-only **0.082** (null 0.051, lift +0.031, 1.6x, not significant by bootstrap), VHH-only **0.692** (null 0.203, lift +0.489, 3.4x), pooled **0.389** (null 0.099, lift +0.289). Area-weighted AP is slightly higher (0.094 / 0.709 / 0.444). These are proxy numbers, not forecasts for ONU11/13/23.
- The whole lift in the pooled number comes from the VHH side (CDR positional prior, a robust, cheap effect). The antigen side with these priors is only marginally above chance. Real antigen signal must come from structure (co-folding consensus), which is not in this CPU lane.

## 6. Floor submission (task 5)

`submissions/s1_floor/prediction_ONU11.csv` (745 rows), `_ONU13.csv` (745), `_ONU23.csv` (753): header `chain,seqNum,resName,prediction`; antigen rows A1-A618, then every printed VHH residue (127/127/135); values written with 10 decimals, tags and signal peptide (1-22) = 0, M1 and A2 of the VHH leader = 1e-6 (q2: do not score them, but kept off exact zero), all other values unique. `validate_submission.py` reports PASS, 0 errors, 0 warnings, round trip lossless. Antigen part uses all public binder footprints (including the four VHH proxy structures, legitimate for blind targets); VHH part uses all 615 PDB VHH entries. Settings in `provenance.json`.

## 7. Limitations (read before trusting any number)
1. **Template row count is inferred, not read.** The template CSVs are gated (HTTP 401). Chain A = 618 rows + chain B = 127/127/135 reproduces the published file sizes 8,757/8,757/8,853 bytes to within 1 byte in both cases (the computed sizes are 8,756 and 8,852), so it is a strong but unproven inference; 618 is also not obviously a natural construct boundary (printed construct is 630). Rows beyond a longer real template are omitted, which the rules treat as 0. Antigen A619-630 are therefore not written. The validator warns, not errors, on antigen rows above 618.
2. **We do not know the scorer.** Chain pooling, AP vs trapezoid, which weighting ranks, best vs last submission, and bootstrap unit are all unspecified; every variant is reported. The ties trap above can change winners.
3. **Voronota-LT version is 1.1.497, not 1.1.479**; input handling (asymmetric unit, no hetero atoms, no assembly) may differ from the organisers' pipeline, and the 8GZ5 match (26/206) is a single-entry check.
4. **Proxy league is tiny and not independent.** 5 complexes from 4 PDB entries, two in one epitope family, all domain I/III/junction. 5MY6 and 7QVK lie inside some co-folding training windows (q8). With n this small, differences below about 0.05-0.1 AP are noise; the antigen-side result is exactly that.
5. **Exposure reference 8Q6J** is a Fab complex; RSA was computed by the q1 worker, not re-derived. Own-structure RSA arms (`*_own_rsa`, `vhh_own_rsa`) give 0 to unmodelled residues and so leak structural coverage; they are shown for comparison only and are not used in the floor. Unmodelled residues are negatives in the full universe: scoring on modelled residues only raises every antigen arm (floor 0.128 vs null 0.067), so how much of the ground-truth ECD is modelled matters.
6. **VHH prior caveats.** The q2 table's contact definition and IMGT keys came from q2's own scripts (anchor rules, not ANARCI); ANARCI labels here are mapped by position key, and a one-position mismatch in FR3/CDR2 is possible. The table's clone-family leakage was reported by q2 for its own cross-validation; here the 5 proxy PDBs are excluded, but other anti-HER2 or related VHH families in the 610 entries are not checked. N-terminal keys -1/0 were estimated from small n and are overridden for the ONU leaders; whether the ground truth numbers the leader M1/A2 as residues is unknown. The prior is position-only: it cannot say which CDR3 residues touch.
7. **ANARCI on Windows needed a local patch.** Upstream ANARCI calls an external `hmmscan` that does not exist on Windows. The installed `anarci.py` `run_hmmer` was replaced by a pyhmmer-based version (RF/PP annotations reconstructed from the alignment); the patched source is saved as `data/anarci_windows_pyhmmer_patched_anarci.py.txt`. Numbering of all 3 ONU clones and 6 proxy VHHs succeeded (e-values 1e-45 to 1e-60) and the first residue of each ONU framework maps to IMGT 1 after the leader, but we did not compare against reference ANARCI output.
8. **Footprint prior** counts public epitope clusters; held-out VHH AP from q1 was 0.04-0.05, consistent with the weak signal here. Footprint-based lift in the league is optimistic as an ONU forecast because the other three VHH families (domain I / III) are in the pool for each held-out proxy.
9. Blind targets may bind elsewhere (domain II, IV); nothing here was tested on such epitopes because no public VHH complex exists there.
10. Not done, by scope: no co-folding, no GPU, no learning from the NGS data (q7 found no per-residue contrast), no ANARCI reference comparison, no hand-numbering check of the q2 anchor script, no test of a pooled-calibration choice beyond fixed base rates.

## 8. Decisions this supports
- Upload candidate for insurance: the floor files as they are (validated). Expected value is carried almost entirely by the paratope side; do not expect the antigen side to beat chance by a meaningful margin without structure-based epitope placement.
- Next CPU-free step is the GPU lane: co-fold consensus for the antigen side, evaluated on the same `proxy_labels.csv` with the same `metric.py`, against the null in section 5 and the unique-value rule.


---
# Section 9 (2026-10-17): GPU lane, Boltz-2 co-folding measured on Explorer (co-folding engineer)

Everything below comes from job logs and files under `model/cofold/` (code, per-residue CSVs, `results/`) and `/scratch/<user>/sepiq26` on Explorer (raw predictions, logs). No Hugging Face upload. Public partition `gpu` only, 1 GPU per job, never more than 2 GPUs of mine at once. Sibling jobs of this user (mmbu-rl, vgym, casmi_df) were checked with `squeue -u <user>` before every submission and were not touched; when I submitted, the combined GPU count stayed at or below 2 (at one point 0 sibling GPUs were running).

## 9.1 Environment (login-node install, weights on /scratch)
- venv `/scratch/<user>/sepiq26/venv_boltz`, Python 3.11.15 (uv). **boltz 2.2.1**, **torch 2.8.0+cu128**, numpy 1.26.4, pytorch-lightning 2.5.0, triton 3.4.0. The default PyPI torch 2.14.1+cu130 does not run on the nodes (driver 570.86 = CUDA 12.8, "driver too old"): the first smoke job 11154653 died on that and was cancelled; torch was reinstalled from the cu128 index. cuequivariance kernels are not installed, so every run uses `--no_kernels` (slower, same maths).
- Weights from huggingface.co/boltz-community/boltz-2: `boltz2_conf.ckpt` (2.29 GB), `boltz2_aff.ckpt` (2.06 GB, unused), `mols.tar` (CCD, 45,227 files). Login-node quirks: heavy or long processes get SIGKILLed (python downloads, long tar, source builds of fairscale and antlr4 needed `--no-build-isolation`), so downloads ran with curl/tar in detached shells; `boltz` needs `mols.tar` to stay in the cache even after extraction (a deleted tar was re-downloaded inside the first GPU job).
- Chai-1: chai-lab **0.6.1** in `/scratch/<user>/sepiq26/venv_chai` (torch 2.6.0+cu124, about 20 minutes of effort; weights from chaiassets.com fetched with curl; needed `pyarrow==17.0.0` because pyarrow 26 requires numpy 2). Status in 9.7. OpenFold3 was not attempted (time).

## 9.2 Inputs
`model/cofold/inputs/*.yaml` (Boltz) and `model/cofold/fasta/*.fasta` (Chai). Chain A antigen, chain B VHH, no templates, no constraints, no glycans.
- Proxies: antigen = P04626 1-618 with signal peptide (the 618-residue universe of `proxy_labels.csv`), VHH = PDB SEQRES from `proxy_labels.csv` (27A05 146 aa, 47D05 128, 29E09 122). 9MTE/9MTX were released 2025-11-19, after the Boltz-2 training cutoff (2023-06 per q5).
- ONU11/13/23: antigen = printed construct P04626 1-624 + His6 (630 aa, signal peptide kept), VHH = printed clone including leader and His6 (127/127/135 aa), from `sepiq_common.load_constructs()`. Predictions are scored on antigen 1-618 as in the floor.
- MSA: compute nodes do have internet (curl: huggingface 200, api.colabfold.com 404 on the root URL = reachable). MSAs were nevertheless fetched once on the login node from the ColabFold MMseqs2 server with Boltz's own `run_mmseqs2` (`cofold/make_msa.py`, unpaired, `use_env=True`) and passed as a3m files: HER2-618 4,933 sequences, HER2-630 4,717, VHHs 11,116 to 12,739 (Boltz keeps at most 8,192). This sends the printed ONU sequences to the public ColabFold server. Single-sequence mode was NOT run, so the effect of the MSA is unknown.

## 9.3 Measured runtime (Boltz-2, 1 x A100)
Boltz defaults (3 recycling steps, 200 sampling steps) except `--diffusion_samples 5`; one `boltz predict` process per seed (seeds 1001..1010); `--write_full_pae`; mmCIF. Each call includes process start, model load and input processing.

| Complex | seeds | s per seed with 5 samples: mean / median / min / max |
|---|---|---|
| 9MTX 29E09 | 10 | 178 / 173 / 167 / 223 |
| 9MTE 27A05 | 10 | 187 / 183 / 175 / 209 |
| 9MTE 47D05 | 10 | 170 / 168 / 161 / 184 |
| ONU11 | 10 | 179 / 174 / 167 / 197 |
| ONU13 | 10 | 175 / 174 / 168 / 186 |
| ONU23 | 10 | 192 / 193 / 167 / 222 |
| all | 60 | **180.2 / 176.1** (about 36 s per diffusion sample) |

(9MTX seeds 1-3 were run by the smoke job 11155442 and are counted among the 60; they took 223, 169, 181 s.) All runs on node d1026, NVIDIA A100-SXM4-40GB, driver 570.86.15. Host RSS peak 6.6 to 7.4 GB. The nvidia-smi sampler reported 16,877 MiB in every run, but it printed two device lines per tick and the constant value means it may not be attributable to our process alone: use as an upper-bound indicator only, not as a measured peak. ipTM, pTM, complex_iplddt and confidence_score JSON, full PAE (npz), pLDDT and PDE are all written. All 63 `boltz predict` calls returned rc=0.
Jobs: 11154653 (smoke, CUDA mismatch, cancelled), 11155442 (smoke, 3 seeds, 10:01 elapsed), A 11155569 (9MTE_27A05, 9MTE_47D05, ONU11; 1:29:32), B 11155672 (9MTX seeds 4-10, ONU13, ONU23). Queue wait for an A100 was about 25 to 35 minutes per job. Total Boltz GPU time about 3.2 h for 63 seeds x 5 samples (50 models per complex).

## 9.4 From structures to per-residue scores
`cofold/contacts.py`: each of the 50 models per complex (10 seeds x 5 samples) goes through the CPU lane's own `build_proxy_labels.write_pair_pdb` and `run_vlt` (Voronota-LT v1.1.497, `--restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]'`, residue level), residues numbered 1..L in input order. ipSAE (Dunbrack definition, PAE cutoff 10 A, max of A to B and B to A) comes from the saved PAE. `cofold/score_cofold.py` writes `cofold/results/boltz2_proxies_{scores,bootstrap}.csv` and `_diagnostics.json`; `cofold/make_candidate.py` writes `cofold/per_residue/<complex>.csv` (freq, ipSAE-weighted freq, ipTM-weighted freq, mean contact area, labels for proxies) and the candidate submission.
Primary score = **mean over seeds and samples** of 1[area > 0] (never max). Variants: ipSAE-weighted, ipTM-weighted, mean area, and "hybrid" = freq + 0.05 x floor prior. All scores are made unique with a 1e-7 random tie-break (as in section 5), VHH His6 = 0. Floor baselines are rebuilt with the CPU lane's `baselines.make_complexes` (leave-one-PDB-out footprint); shuffle null 300 permutations; paired bootstrap 1000 draws.

## 9.5 Proxy results: 9MTE (27A05, 47D05) + 9MTX (29E09), macro over these 3, AP unweighted, label area>0 (null in brackets)

| Arm | antigen-only | VHH-only | pooled A+B |
|---|---|---|---|
| **Boltz-2 contact frequency (mean of 50 models)** | **0.453** (0.054) | 0.722 (0.207) | 0.549 (0.099) |
| Boltz-2 ipSAE-weighted freq | 0.353 | 0.689 | 0.478 |
| Boltz-2 ipTM-weighted freq | 0.438 | 0.721 | 0.541 |
| Boltz-2 mean contact area | 0.366 | 0.593 | 0.418 |
| Boltz-2 freq + 0.05 x floor prior (hybrid) | 0.449 | 0.726 | 0.550 |
| baseline: antigen exposure (8Q6J RSA) | 0.067 (0.054) | 0.178 | 0.145 |
| baseline: exposure x (1-dimer) x footprint | 0.093 (0.054) | 0.178 | 0.160 |
| baseline: FLOOR composite | 0.093 (0.054) | 0.722 (0.208) | 0.412 (0.102) |
| baseline: uniform random (one draw) | 0.079 | 0.178 | 0.140 |

Per complex, antigen AP of the primary arm (27A05, 47D05, 29E09): **0.960, 0.324, 0.076** (floor 0.119, 0.052, 0.108). VHH AP: 0.992, 0.252, 0.922. Area-weighted AP antigen 0.461, trapezoid 0.448: same picture.

**Pre-registered kill test: PASSED.** Co-fold consensus minus exposure-prior baseline on macro antigen PR-AUC = **+0.387** (paired bootstrap, residue unit, 1000 draws, 95% CI [+0.317, +0.459]; block-8 CI [+0.292, +0.461]), far above the +0.02 threshold. Against the full floor composite: antigen +0.361 [0.288, 0.434]; VHH -0.000 [-0.084, +0.084] (no gain on the paratope side: the CDR prior already reaches 0.72); pooled +0.137 [0.071, 0.204].

Do not over-read it.
1. n = 3 complexes, two from one PDB entry, and 27A05 alone (AP 0.96) carries most of the macro. Without 27A05 the mean of the other two is 0.20, still above the floor's 0.080, but 29E09 (0.076) is no better than the floor (0.108). The residue-level bootstrap CIs ignore that complexes are the real unit; the complex-level bootstrap is degenerate at n = 3 (section 5).
2. Success tracks model confidence. Mean ipTM / ipSAE: 27A05 0.756 / 0.648 (split-half seed agreement r = 0.97), 47D05 0.441 / 0.021 (r = 0.76), 29E09 0.488 / 0.045 (r = 0.93: the seeds agree with each other and are wrong). Seed agreement does not certify correctness, and ipSAE weighting did not help.
3. 27A05 and 29E09 are one family (identity 0.857, q8) yet got antigen AP 0.96 vs 0.08: the engine is unreliable per target. 9MTE/9MTX post-date the Boltz-2 cutoff, but earlier HER2-VHH complexes (5MY6, 7QVK) and many HER2 antibody complexes are inside its training window, and 27A05 may sit on a well-covered epitope, so proxy AP is probably optimistic for a blind target.
4. Seed count matters at 3: the smoke-time 3-seed antigen AP of 29E09 was 0.046 vs 0.076 with 10 seeds (diagnostic only).

## 9.6 ONU11 / ONU13 / ONU23 predictions (no ground truth: model outputs, not results)

| Clone | models | mean ipTM | mean ipSAE | antigen residues with freq >= 0.5 / >= 0.2 | domain holding most contact frequency (per-model dominant domain) |
|---|---|---|---|---|---|
| ONU11 | 50 | 0.388 | 0.001 | 0 / 29 | IV 45% (IV 26, I 16, III 6, II 2 models) |
| ONU13 | 50 | 0.365 | 0.005 | 26 / 48 | IV 44%, III 27% (IV 31, I 10, III 7, II 2) |
| ONU23 | 50 | 0.524 | 0.076 | 19 / 27 | I 93% (domain I in all 50 models) |

Domain bounds used: I 23-195, II 196-319, III 320-488, IV 489-607 (approximate). With 9.5 in mind: ipTM at or below 0.39 and ipSAE near zero is the regime of the weakest proxy (29E09, AP 0.08) or below, so the ONU11 and ONU13 antigen sides are low-confidence and split across domains; ONU23 is the most self-consistent (all models in domain I) but only ipTM 0.52. Top-frequency residue lists are in `submissions/s2_cofold_candidate/provenance.json`; tables in `cofold/per_residue/ONU*.csv`.
Candidate `submissions/s2_cofold_candidate/prediction_ONU{11,13,23}.csv`: score = freq + 0.05 x floor prior, rescaled to base rates 0.045 / 0.15, signal peptide and tags 0, leader M1/A2 1e-6, unique values; `validate_submission.py` PASS, 0 errors, 0 warnings. It is a candidate, not a recommendation to upload as is: on the proxies the antigen gain came from the confident complex, and a confidence-aware blend (shrinking the ONU11/13 antigen side toward the floor) was not tested.

## 9.7 Chai-1 status and limitations
Chai-1 0.6.1 installs and has its weights, input fastas and `cofold/slurm/run_chai.sh` ready, but it was **not run**: the first attempt (job 11157143) died after 590 s on a missing parquet backend (pyarrow/numpy mismatch, since fixed), and the resubmission (11157519, 3 seeds x 5 samples on the three proxies) was still pending with an estimated start about 3.5 h away when I cancelled it, so there is no Chai-1 timing or score. The consensus above is therefore single-engine (Boltz-2): the q5 multi-engine ensemble is untested here. Command to run it later: `sbatch -p gpu --gres=gpu:a100:1 -c 8 --mem=80G -t 02:30:00 scripts/run_chai.sh <outdir> 3 5 9MTE_27A05 9MTX_29E09 9MTE_47D05` (the ColabFold MSA server took about 10 min per complex on seed 1 in the failed run; later seeds reuse saved MSAs).

Limitations not covered above: (a) single engine, single MSA mode, no template-leakage ablation (templates off; old-vs-new weights not compared); (b) the kill test rests on 3 complexes; (c) labels are Voronota-LT v1.1.497 area > 0 on a predicted pair, with the section 3 caveats; (d) the nvidia-smi memory figure is unreliable (9.3); (e) antigen His6 and residues 619-630 are not scored (floor convention); (f) no confidence-aware shrinkage or smoothing was tuned, deliberately, to avoid fitting 3 proxies; (g) raw predictions (about 66 MB per complex including PDE/pLDDT) stay on Explorer scratch, which is purged periodically; local copies of cif, confidence JSON and PAE are in `C:\Temp\sepiq26\cofold_pred`.


---
# Section 10 (2026-10-17): second-engine lane + shrinkage/blend study (modeling engineer)

## 10.1 PRE-REGISTRATION of the blend arms (written BEFORE any blend arm was scored; later subsections only fill in numbers)

Data: Boltz-2 contact frequencies from Section 9 (`cofold/contacts/*.npz`, 50 models per complex: 10 seeds x 5 samples). Primary proxies: P3 (9MTE/27A05), P4 (9MTE/47D05), P5 (9MTX/29E09). If Boltz-2 predictions for P1 (5MY6/2Rs15d) and P2 (7QVK/NM-02) finish in time (5 seeds x 5 samples, see 10.2) they are reported as a separate, leakage-flagged secondary league (both PDBs are inside some engines' training windows), never pooled into the primary headline.
No parameter below is fitted on any proxy label. "Leave-one-complex-out" therefore means: all arm parameters are fixed here in advance, and the only label-derived inputs (public-footprint prior, VHH positional table) are rebuilt excluding the held-out PDB (and its epitope-family partner), exactly as in `baselines.py`.

Common conventions (all arms): antigen universe 1..618, VHH full SEQRES, His6 and VHH leader handled as in the floor; ranks inside a chain made unique by a 1e-7 random tie-break; prior P = FLOOR composite (antigen exposure x (1-0.5 dimer) x mild LOCO footprint; VHH ANARCI-IMGT positional prior); every arm is put on a probability scale per chain (antigen mean 0.045, VHH mean 0.15, rank-preserving) before pooled A+B scoring, so antigen scores are not swamped by VHH scores. Arm 1 is additionally reported uncalibrated as in Section 9.

Arms:
1. `raw_freq`: Boltz-2 mean contact frequency f (mean over models of 1[area>0]). Also `raw_freq_cal` (arm 1 with chain base-rate calibration).
2. Shrinkage toward the prior, `s = (1-lam)*f + lam*P'` where P' is the floor prior rescaled to the same mean as f on that chain (so lam changes ranking, not the overall level). Three fixed lam rules:
   - 2a `shrink_iptm`: lam = 1 - clip((mean ipTM - 0.30)/0.30, 0, 1)  (ipTM <= 0.30 -> pure prior, >= 0.60 -> pure Boltz). Same lam on both chains.
   - 2b `shrink_splithalf`: lam = clip(1 - r, 0, 1), r = split-half correlation of the chain's contact frequency between odd and even seeds.
   - 2c `shrink_fixed02`: lam = 0.2 (q8 ensembling recipe: mean not max, 0.2 prior shrinkage). No spatial smoothing (q8 judged the smoothing gain a toy artefact).
3. Log-odds (decibans), naive-Bayes style, `score_db = w_f*DBf + DBp`, where DBf = 10*log10 of the odds ratio of the Laplace-smoothed frequency ((k+1)/(N+2), k = contacts among N = 50 models) against the chain base rate, and DBp = 10*log10(P/mean(P)) with P (floor composite: exposure, dimer-patch penalty, public footprint for the antigen; positional CDR prior for the VHH) floored at 1e-3 of its maximum. Probability = sigmoid(logit(base) + ln10/10 * score_db). 3a `db_full`: w_f = 1. 3b `db_conf`: w_f = 1 - lam(2a).
4. Domain-gate arms: **SKIPPED**. The domain of the ONU clones' epitopes is unknown (q1/q3 list it only as an open question), so a gate cannot be verified; the proxies are all domain I/III so they could not test a gate either.

Reported for every arm: antigen-only, VHH-only, pooled A+B, macro over complexes, AP and trapezoid, unweighted and area-weighted, shuffle null (300 permutations), paired bootstrap against arm 1 and against the floor (residue unit and block-8, B=1000; complex-level bootstrap is degenerate at n=3 and is not used).
Interpretation rule (fixed now): an arm differs from arm 1 only if |difference in macro antigen AP| >= 0.05 (the noise floor, q8 says 0.03-0.1), the residue bootstrap CI excludes 0, and the sign agrees on at least 2 of the 3 complexes. Otherwise the arms are treated as tied and the simpler arm is preferred. Extra descriptive analysis, not an arm and not used to choose: a lam grid 0..1 per complex, and an explicit comparison of low-ipTM complexes (P4, P5) with the high-ipTM one (P3).
Candidate rule: `s3_shrunk_blend` = arm 2a, unless arm 2a is worse than arm 1 by >= 0.05 macro antigen AP on the primary proxies, in which case arm 2c. The ONU predictions never influence this choice.

## 10.3 Blend study, primary proxies (P3 27A05, P4 47D05, P5 29E09), macro over 3, AP, unweighted, label area>0 (shuffle null in brackets)
Code: `cofold/blend.py` (arms), `cofold/blend_study.py` (scoring), outputs `cofold/results/blend_primary_{scores,bootstrap,lamgrid,params}.*`. Arm 1 reproduces Section 9.5 exactly (0.453 / 0.722 / 0.549). Mean ipTM, split-half r (antigen) and resulting lam per complex: P3 0.756 / 0.97 / lam(2a) 0.00; P4 0.441 / 0.76 / 0.53; P5 0.488 / 0.93 / 0.37.

| Arm | antigen | VHH | pooled A+B (chain base rates) | antigen per complex P3, P4, P5 | VHH per complex P3, P4, P5 |
|---|---|---|---|---|---|
| 1 raw_freq (pooled uncalibrated, as Section 9) | 0.453 (0.054) | 0.722 (0.207) | 0.549 (0.099) | 0.960, 0.324, 0.076 | 0.992, 0.252, 0.922 |
| 1c raw_freq_cal | 0.453 | 0.722 | 0.490 (0.095) | same | same |
| 2a shrink_iptm | 0.437 (0.053) | 0.756 (0.207) | 0.557 (0.100) | 0.960, 0.281, 0.069 | 0.992, 0.368, 0.908 |
| 2b shrink_splithalf | 0.450 | 0.725 | 0.497 | 0.961, 0.313, 0.075 | 0.993, 0.257, 0.926 |
| 2c shrink_fixed02 | 0.450 | 0.721 | 0.519 | 0.960, 0.314, 0.074 | 0.965, 0.280, 0.918 |
| 3a db_full | 0.411 | 0.730 | 0.545 | 0.942, 0.223, 0.069 | 0.993, 0.285, 0.912 |
| 3b db_conf | 0.390 | 0.739 | 0.556 | 0.942, 0.161, 0.069 | 0.993, 0.316, 0.909 |
| FLOOR composite (prior only) | 0.093 (0.054) | 0.722 (0.208) | 0.412 (0.102) | 0.119, 0.052, 0.108 | 0.843, 0.544, 0.779 |
| uniform random | 0.079 | 0.178 | 0.140 | | |

Other variants (macro antigen): area-weighted AP 0.461 (arm 1), 0.454 (2a), 0.459, 0.458, 0.440, 0.423, floor 0.108; trapezoid 0.448, 0.430, 0.443, 0.443, 0.401, 0.381, floor 0.088. Same ordering as unweighted AP.

Paired bootstrap (residue unit, B=1000, 95% CI, macro AP difference to arm 1):
- antigen: 2a -0.017 [-0.046, +0.017]; 2b -0.004 [-0.026, +0.019]; 2c -0.004 [-0.025, +0.019]; 3a -0.042 [-0.086, +0.012]; 3b -0.063 [-0.116, -0.002]. Block-8 intervals are similar. Only 3b has an interval that excludes 0, and it is a loss.
- VHH: 2a +0.034 [+0.003, +0.083]; 2b +0.003; 2c -0.001; 3a +0.008; 3b +0.017 (all other intervals include 0).
- pooled (against arm 1c, the like-for-like calibrated list): 2a +0.067 [0.034, 0.104]; 3b +0.066 [0.030, 0.099]; 3a +0.054 [0.023, 0.079]; 2c +0.029 [0.002, 0.051]; 2b +0.007 [-0.002, 0.019]. The pooled gains are almost entirely the VHH side of P4 (below).
- Cross-chain calibration alone changes pooled AP: raw (uncalibrated) 0.549 vs calibrated 0.490 (difference 0.059, CI [0.034, 0.079]). Chain pooling is exactly the scorer ambiguity (Section 4), so this is not a modelling gain either way; it only says the pooled number depends on how antigen and VHH scores are scaled against each other.

Verdict under the pre-registered rule (needs |diff| >= 0.05 AND CI excluding 0 AND the sign on >= 2 of 3 complexes): **no shrink arm beats raw Boltz-2 on the antigen side**; the log-odds arms are worse (3b by 0.063, all three complexes lower). Nothing is "selected" on tiny differences. On the VHH side 2a is +0.034 (below the 0.05 floor, CI excluding 0, driven by one complex).

### Low-confidence regime, explicitly (descriptive lam grid, one lam on both chains, no selection)
Antigen AP by lam (0 = raw Boltz, 1 = floor prior):

| lam | P3 (ipTM 0.76) | P4 (0.44) | P5 (0.49) |
|---|---|---|---|
| 0.0 | 0.960 | 0.324 | 0.076 |
| 0.2 | 0.960 | 0.314 | 0.074 |
| 0.5 | 0.942 | 0.291 | 0.065 |
| 0.8 | 0.627 | 0.173 | 0.065 |
| 0.9 | 0.328 | 0.103 | 0.075 |
| 1.0 | 0.119 | 0.052 | 0.108 |

Reading: (i) the 29E09 case (P5; seeds agree, r = 0.93, and are wrong): shrinkage toward the exposure/footprint prior does NOT rescue the antigen side; AP stays at or below the raw 0.076 until lam is near 1, where it equals the floor (0.108, a +0.03 difference on one complex, inside the noise floor). The prior is itself near chance there (floor 0.108 vs null 0.05 to 0.08), so there is nothing to shrink toward. (ii) P4 (ipTM 0.44, the less self-consistent complex) loses antigen AP monotonically with lam, 0.324 to 0.052: the raw Boltz-2 contacts are far better than the prior even at low confidence, so shrinking low-ipTM complexes hurts there. (iii) On the VHH side the opposite happens for P4: VHH AP rises 0.252 to 0.544 as lam goes 0 to 1 (the CDR positional prior beats the co-folded paratope on that complex), while P3 and P5 lose 0.15 and 0.14. So the effect of shrinkage is complex-specific and its sign differs by chain; the proxies do not support one global rule, and the pre-registered 2a (lam 0.53/0.37) is roughly neutral on antigen (-0.017) and mildly positive on the VHH (+0.034) at n = 3. Confidence statistics (ipTM, split-half r, ipSAE) did not separate the one wrong complex (P5) from the right one in any way a shrinkage weight could exploit: its ipTM (0.49) is higher than P4's (0.44), whose antigen AP (0.32) is five times better.
Candidate rule outcome: 2a is not worse than raw by >= 0.05 on antigen (-0.017), so `s3_shrunk_blend` = arm 2a, as pre-registered.

## 10.4 PRE-REGISTRATION of the two-engine ensemble arm (written before any Chai-1 contact table was built)
If Chai-1 finishes at least 3 seeds x 5 samples for all six complexes: contacts are computed exactly as for Boltz-2 (Voronota-LT area > 0, `cofold/chai_contacts.py`), then
- `chai_only`: Chai-1 contact frequency alone (arm 1 recipe); `boltz_only`: arm 1 on Boltz-2; 
- `ens_mean`: f = 0.5 f_Boltz + 0.5 f_Chai (equal weight per ENGINE, not per model, so the unequal model counts do not matter); 
- `ens_shrink`: arm 2a applied to `ens_mean`, with ipTM = mean of the two engines' mean ipTM (lam = 1 - clip((ipTM - 0.30)/0.30, 0, 1)).
Scored on P3/P4/P5 with the same metric and interpretation rule as 10.1 (difference >= 0.05, CI excluding 0, sign on >= 2 of 3 complexes). `s4_ensemble_boltz_chai` = `ens_shrink`; it is written regardless of the proxy outcome as a candidate, and 10.x states plainly whether the proxies support it over `s3_shrunk_blend`. Engine agreement on ONU11/13/23 (Spearman of antigen frequencies, overlap of the top 20 residues) is reported as a descriptive diagnostic only.
Addition (still before any Chai-1 or OpenFold3 score exists): if OpenFold3 (0.5.0, default `openbind-2025-06-30-174k` weights, ColabFold MSAs) also finishes >= 3 seeds x 5 samples on all six complexes, the same recipe gives `ens3_mean` / `ens3_shrink` (equal weight per engine over the engines that completed, ipTM = mean over engines). The directory name will say which engines were used (`s4_ensemble_<engines>`); if only two of three finish, only the two-engine arm exists. Engines are never dropped or added after seeing proxy scores except for the stated reason "did not finish".

## 10.2 Second-engine and extra-proxy GPU lane: what was set up, what ran (job log, node types, waits)
Everything below is from Slurm/`sacct`/log output on Explorer (public partitions only, `gpu-short`, 1 GPU per job, A100 only because Chai-1 needs bf16 and V100/T4 lack it).

| Job | What | Partition / GPU | Outcome |
|---|---|---|---|
| 11161096 | Chai-1 ColabFold MSA prefetch (6 complexes, CPU, `short`) | CPU | OK, 10 min (about 160 s per new HER2+VHH pair; reused HER2 MSA 5 s); `.aligned.pqt` files in `chai_out/<name>_msas` so GPU jobs do not pay for MSA fetching (this also sends the ONU sequences to the public ColabFold server, as in Section 9.2) |
| 11161121 | Boltz-2 MSAs for 5MY6/7QVK VHHs (CPU) | CPU | OK (11,392 / 10,910 sequences) |
| 11161153 | OpenFold3 install (CPU) | CPU | OK: `openfold3` 0.5.0 by `uv pip install` into `venv_of3`, Python 3.11, torch 2.8.0+cu128 (about 5 min) |
| 11161376 | OpenFold3 weights (`setup_openfold --non-interactive`, CPU) | CPU | OK: `of3-ob-2025-06-30-174k.pt`, 2.3 GB, landed in `~/.openfold3` (home, not scratch) in about 1 min |
| 11161400 | OpenFold3 `align-msa-server` for all 6 complexes (CPU) | CPU | OK, about 5 min, `of3_msa/query_msa.json` |
| 11161110 | Chai-1, 5 seeds x 5 samples, 6 complexes (script `cofold/slurm/run_chai2.sh`, seed-major loop, 2 h guard) | gpu-short, a100 | eligible 08:18 (after the MSA job), started 08:49 (about 31 min wait), ran 1 min 13 s, then **cancelled by my own budget guard** because two sibling-session `casmi_cre_*` jobs had just started and the 2-GPU cap includes siblings) |
| 11161148 | Boltz-2 on 5MY6 and 7QVK, 5 seeds x 5 samples | gpu-short, a100 (d1029, A100-80GB; Section 9 used an A100-40GB) | submitted 08:14, started 08:38 (24 min wait), ran 11 min: 5MY6 seeds 1-3 finished (188 / 172 / 173 s per seed with 5 samples), then **cancelled by the guard** for the same reason |
| 11161848 | Boltz-2 resubmission (seeds 4-5 of 5MY6, all of 7QVK) | gpu-short, a100 | held behind sibling jobs from 08:50 to 11:05, **cancelled unrun by me at about 11:05** (about 3 h of working time); 7QVK has no Boltz-2 prediction and 5MY6 has 3 seeds (15 models), not 5 |
| 11161870 / 11161474 | Chai-1 (resubmit) / OpenFold3 `run_openfold predict`, 3 seeds x 5 samples (`cofold/slurm/run_of3.sh`) | gpu-short, a100 | held while siblings used both GPUs, then **cancelled unrun by me at 10:35** because a 2 h Chai-1 run or a 2 h OpenFold3 run could no longer finish inside the working window |

Budget enforcement: a local watcher (`guard2.sh`, 45 s poll) counted RUNNING GPU jobs of `<user>` including siblings (`casmi_cre_*`; earlier `mmbu-*`, `vgym` were only pending), cancelled my newest job when the count exceeded 2, and held my pending jobs when no slot was free. I did not touch any sibling job. No lab partition or lab account was used differently from the default `b.gyori` charge; `squeue -A b.gyori` showed no labmate jobs pending (only this user's own).
Result: **no Chai-1 or OpenFold3 prediction exists**; there is no second-engine number in this section. The pre-registered ensemble arm (10.4) was therefore not run and `s4_ensemble_*` was not written. Installed and ready: chai-lab 0.6.1 with weights and prefetched MSAs, OpenFold3 0.5.0 with weights and MSAs, three sbatch scripts. The first A100 slots arrived after 24-31 min (as in Section 9), but the two sibling `casmi_cre_*` jobs then held both GPUs from 08:48 for more than 1.5 h, which is what blocked the lane.

## 10.5 Secondary, leakage-flagged proxy: 5MY6 (2Rs15d), Boltz-2, 3 seeds x 5 samples = 15 models only (descriptive, one complex, not pooled with 10.3)
Code and files: `cofold/blend_study.py blend_5MY6_partial 5MY6_2Rs15d`, `cofold/results/blend_5MY6_partial_*`, `cofold/contacts/5MY6_2Rs15d.npz`. 5MY6 (2017) lies inside Boltz-2's training window, so the numbers are optimistic about ability and say nothing about a blind target; I use them only to test the behaviour of the confidence-based rules.
Mean ipTM 0.297, ipSAE 0.000 (the lowest of all complexes seen, below ONU11/13), yet raw Boltz-2 antigen AP = 0.758 (null 0.042; floor 0.057) and VHH AP 0.977 (floor 0.700). Arm 2a gives lam = 1 (ipTM <= 0.30), i.e. the prior only: antigen AP 0.057 (-0.70, CI [-0.89, -0.51]), VHH 0.700 (-0.28, CI [-0.47, -0.10]). Arms 2b and 2c are within +0.02 of raw (antigen 0.780). Decibans 3a 0.560 antigen; 3b equals the floor (it also down-weights by ipTM).
Consequence: a low ipTM does not imply a wrong contact map. Here a complex with ipTM 0.30 is nearly perfect (possibly memorised), whereas 29E09 (ipTM 0.49, clean date) is wrong. ipTM is a poor selector of which complexes to trust, in both directions, in the 4 complexes available. This directly weakens the ipTM-driven rules (2a, 3b) for ONU11 (ipTM 0.39) and ONU13 (0.37); it does not rescue them either, because of the leakage flag. 7QVK was not run.

## 10.6 Candidates, limitations, recommendation (2026-10-17)
Directories (each checked with `python validate_submission.py <dir>` from `model/`, no `-I`, result PASS, 0 errors, 0 warnings):
- `submissions/s1_floor` (exists from Section 6), `submissions/s2_cofold_candidate` (Section 9.6, raw Boltz-2 freq + 0.05 prior).
- `submissions/s3_shrunk_blend` (new): arm 2a on Boltz-2, pre-registered rule applied (2a was within 0.05 of raw on the primary proxies). Lam per clone: ONU11 0.71, ONU13 0.79, ONU23 0.25 (from mean ipTM 0.388 / 0.365 / 0.524). `provenance.json` lists arm, parameters, inputs and that no proxy informed any parameter. Spearman against s2 per chain: 0.89-1.00 (antigen: ONU11 0.95, ONU13 0.89, ONU23 1.00), against the floor 0.89-0.99. Values use a smooth monotone soft cap instead of a hard clip (no tie group at 0.95) and are made unique after 10-decimal rounding.
- `s4_ensemble_*`: **not written** (no second engine ran, see 10.2).

Honest summary of the evidence: (1) every blend or shrinkage arm is within noise of raw Boltz-2 on the primary antigen side (|diff| <= 0.06 and only the log-odds arm 3b is clearly worse); (2) the one complex-specific gain is the VHH side of 47D05 (VHH prior beats Boltz paratope), and the one loss is 5MY6 under 2a; (3) the proxies do not provide a rule that predicts which complexes Boltz-2 gets right (27A05 yes, 47D05 partly, 29E09 no, 5MY6 yes with ipTM 0.30); (4) n is 3 (primary) or 4, one PDB entry contributes two complexes; (5) engine and MSA ablations, template effects and any second engine remain untested; (6) the A+B pooled number depends on cross-chain scaling by +/-0.06, as much as any arm effect.
Recommendation for the 5-submission ladder (consistent with q8: submissions are checkpoints, no score feedback, simplest robust arm unless a pre-registered margin is beaten, last upload by Oct 30 06:00 UTC):
- S1 `s1_floor` as insurance (upload first, Oct 20).
- S2 `s2_cofold_candidate` (raw Boltz-2): the only arm with proxy evidence of large lift (antigen 0.45 vs floor 0.09 on 3 proxies, with the caveats of 9.5), and no blend beat it by the pre-registered margin, so it is the default main candidate.
- S3 `s3_shrunk_blend` as the hedge. Because 5MY6 shows ipTM shrinkage can erase a correct map and nothing shows it rescues a wrong one, I would not make it the final pick on proxy grounds; its value is diversification for ONU11/13 where Boltz-2 has ipTM <= 0.39 and ipSAE near 0. If the organisers' scorer takes the best of five this costs nothing; if it takes the last, put S2 last.
- S4/S5: reserve for a second-engine ensemble if a GPU window opens before Oct 28 (all environments, weights, MSAs and scripts are ready: `cofold/slurm/run_chai2.sh`, `run_of3.sh`; needs about 2 h of a free A100 for Chai-1 5 seeds x 6 complexes, unmeasured for OpenFold3), otherwise a more conservative mix of S2 and S1 rather than more variants of the same engine. Do not select among S2/S3 on differences below 0.05.

## 11. Template conformance (2026-10-17) — CORRECTION to earlier validator results
The gated real templates (`prediction_template_ONU11/13/23.csv`, downloaded with the user's HF login) differ from what research inferred:
chain A = P04626 residues **1..624** (not 1..618; rows 619-624 = EEGACQ), chain B has **no His-tag rows** (ONU11/13: 121 rows = 120 VHH + S121; ONU23: 129 rows),
total 745 / 745 / 753 rows, CRLF, empty `prediction` column. Earlier candidates `s1_floor`, `s2_cofold_candidate`, `s3_shrunk_blend` passed
`validate_submission.py` but each had 6 template rows missing (A 619-624) and 6 extra rows (B His tag): header-valid, but would have lost scoring rows silently.
`conform_to_templates.py <src> <dst>` joins on (chain, seqNum, resName), fills missing template rows with unique tiny values, drops extras, keeps non-zero values unique
and asserts a 100% key match. Upload-ready directories: `submissions/s1_floor_tpl`, `s2_cofold_candidate_tpl`, `s3_shrunk_blend_tpl`. Verified: keys identical to the templates, no NaN, non-zero values unique.
The Space's submit handler has `api_name=False`, needs a Hugging Face OAuth browser session, and writes with the Space's server-side token, so it cannot be driven from a script; upload through the Submit tab (team name free text).
