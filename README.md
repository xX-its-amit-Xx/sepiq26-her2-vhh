# SEPIQ 2026: HER2 VHH epitope/paratope prediction

Entry for the SEPIQ 2026 VHH-Epitope-Prediction Challenge (team `xx_its_amit_xx`): blind, per-residue
interface prediction for three held-out cryo-EM complexes of the HER2 ectodomain (UniProt P04626) with
VHH nanobodies (ONU11, ONU13, ONU23).

**Live dashboard (plain-language and expert views, 3D structures, failure modes):**
https://sepiq26-intelligence.pages.dev

## Result in one paragraph

Track A is scored by per-complex PR-AUC, macro-averaged over three complexes. Our submitted predictor is
**multi-seed Boltz-2 co-folding**: the per-residue frequency with which a residue contacts the partner chain across
seeds and samples. On three leakage-free public HER2-VHH proxy complexes (9MTE with two VHHs, and 9MTX; all released
after the engines' training cutoffs) it scores **0.45 antigen-side PR-AUC (macro)**, against 0.07 for a
surface-exposure prior and 0.05 for shuffled labels. The VHH side scores 0.72, which equals a CDR-position prior, so
co-folding adds nothing there. Per-complex scores are very uneven (0.96, 0.32, 0.08): the method either finds
the right HER2 region or it does not. With n = 3, differences below about 0.1 are noise. We do not know our official score.

## What we tried, and what did not work

| Idea | Outcome |
|---|---|
| Use the 1.8M-read NGS panning data to learn the epitope ("data representation" thesis) | **Failed.** The data carry no per-HER2-residue signal, only VHH-side signal (tested four ways: coevolution, clonal scans, mimotope complementarity, PU denoising). |
| Chai-1 as a second engine | **No signal** as run here (antigen 0.07, at the null). |
| Boltz-2 + Chai-1 ensemble | **Worse** than Boltz-2 alone (0.37). Pre-registered rule failed, so no ensemble was submitted. |
| Shrinkage and blends toward priors | Did not beat raw Boltz-2 by the pre-set margin of 0.05. |
| ipTM to choose which complex to trust | Unreliable on our proxies. |

## Submissions

- Track A: two submissions accepted by the portal: a CDR/exposure floor baseline, and raw multi-seed Boltz-2.
  The portal returns no score; the official ranking is released after the window closes.
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

- Three proxy structures, one co-folding engine that works; the result is a lottery as much as a method.
- Benchmark clustering used UniProt plus at least 30% local identity, not MMseqs; membrane antigens are over-represented.
- Official scoring details (best versus last submission, weighting) were unconfirmed when we submitted.

## License

To be added by the repository owner.
