# SEPIQ 2026: HER2 VHH epitope/paratope prediction

Entry for the SEPIQ 2026 VHH-Epitope-Prediction Challenge (team `xx_its_amit_xx`): blind, per-residue
interface prediction for three held-out cryo-EM complexes of the HER2 ectodomain (UniProt P04626) with
VHH nanobodies (ONU11, ONU13, ONU23).

**Live dashboard (plain-language and expert views, 3D structures, failure modes):**
https://sepiq26-intelligence.pages.dev

## Result in one paragraph

Track A is scored by per-complex PR-AUC, macro-averaged over three complexes. Our predictor is **multi-seed co-folding**: the
per-residue frequency with which a residue contacts the partner chain across seeds and samples. On three leakage-free public
HER2-VHH proxy complexes (9MTE with two VHHs, and 9MTX; all released after the engines' training cutoffs), antigen-side PR-AUC
(macro) is:

| Predictor | Antigen PR-AUC | Per complex (27A05, 47D05, 9MTX) |
|---|---|---|
| Shuffled-label null | 0.054 | |
| Surface-exposure prior | 0.067 | |
| CDR/exposure floor | 0.093 | |
| Chai-1 | 0.074 | |
| Boltz-2 (submitted as #2) | 0.453 | 0.96, 0.32, 0.08 |
| Mol-1 | 0.602 | 0.82, 0.03, 0.96 |
| **Boltz-2 + Mol-1, equal weight** | **0.672** | 0.97, 0.12, 0.92 |

The nanobody side scores about 0.72 for the CDR prior and 0.75 for the ensemble, which is within noise of each other. With n = 3,
differences below about 0.1 are noise, and most of the ensemble's gain over Boltz-2 comes from one complex (9MTX); another (47D05) got
worse. We do not know our official score. Mol-1's confidence score (ipTM) was high where it was right and low where it was wrong,
but that is three cases.

## What we tried, and what did not work

| Idea | Outcome |
|---|---|
| Use the 1.8M-read NGS panning data to learn the epitope ("data representation" thesis) | **Failed.** The data carry no per-HER2-residue signal, only VHH-side signal (tested four ways: coevolution, clonal scans, mimotope complementarity, PU denoising). |
| Chai-1 as a second engine | **No signal** as run here (antigen 0.07, at the null). |
| Boltz-2 + Chai-1 ensemble | **Worse** than Boltz-2 alone (0.37). |
| Mol-1 (new open model by Molence Bio, Apache-2.0 code; its report says PDB training data stop at 2021-09-30) | **Beat Boltz-2** on the proxies (0.60). Self-reported benchmarks elsewhere; we could not verify them. |
| Boltz-2 + Mol-1 equal-weight average | **Passed the pre-registered rule** (beat both by >= 0.05): 0.67. This is our third Track A candidate. |
| Gate by confidence (use Mol-1 when its ipTM > 0.5) | 0.70, but chosen after seeing the results, so exploratory only. |
| Shrinkage and blends toward priors | Did not beat raw Boltz-2 by the pre-set margin of 0.05. |
| A 40-complex benchmark to tune seed count and weighting | Built (`model/bench/`), but the co-folding run did not finish in time. A path bug made every run fail silently, and the queue wait left no time to rerun. |

## Submissions

- Track A: submissions #1 (floor baseline) and #2 (raw Boltz-2) were accepted by the portal on 2026-10-26. The portal returns no score;
  the official ranking is released after the window closes. Submission #3 (Boltz-2 + Mol-1) is built and validated; see
  `SUBMISSION_STATUS.md` for whether it was uploaded.
- Track B (atomic CAPRI complexes): see `TRACK_B.md` for status.

## Repository layout

| Path | Contents |
|---|---|
| `model/` | Metric (`metric.py`), submission validator, proxy labels (Voronota-LT contact area > 0), co-folding scripts (`cofold/`), Slurm runners |
| `model/bench/` | A 40-complex, leakage-controlled benchmark of post-2023-06 VHH-antigen structures (manifest, labels, FASTA, reproduction steps in `model/bench/README.md`) |
| `research/` | Literature and data digests from a multi-agent research hive, with an audit of claims (`research/_meta/predator_audit.md`) |
| `hive/` | How the research hive was organised and its decision log |
| `dashboard/` | Next.js static site behind the dashboard link above |

## Reproduce

1. Build proxy labels: `model/proxies/build_proxy_labels.py` (needs RCSB access and Voronota-LT).
2. Co-fold: `model/cofold/slurm/run_cofold.sh <inputs> <out> <seeds> <samples> <names...>` (Boltz-2 2.2.1, 5 diffusion samples).
3. Score: `model/cofold/score_cofold.py`; metric in `model/metric.py`.
4. Dashboard: `cd dashboard && npm install && npm run build`.

## What is not here

- The gated SEPIQ training data and the organiser's submission templates are **not** included (redistribution is not
  permitted).
- Submission CSVs are not included.
- Personal paths and contact details were removed from the text files.

## Honest limitations

- Three proxy structures; the result is a lottery as much as a method. Mol-1's evidence is on the same three structures.
- Benchmark clustering used UniProt plus at least 30% local identity, not MMseqs; membrane antigens are over-represented.
- Official scoring details (best versus last submission, weighting) were unconfirmed when we submitted.

## License

To be added by the repository owner.
