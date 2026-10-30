#!/bin/bash
set -euo pipefail
source /scratch/<user>/engines/mol1/env.sh
source $M1/venv/bin/activate
module load cuda/12.8.0 gcc 2>/dev/null || module load cuda/12.8.0 || true
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
nvidia-smi -L; python -c "import torch;print(torch.__version__,torch.cuda.get_device_name(0))"
python /scratch/<user>/sepiq26/mol1_run/run_sepiq_mol1.py
