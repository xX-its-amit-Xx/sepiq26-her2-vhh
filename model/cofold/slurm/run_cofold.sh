#!/bin/bash
# usage: sbatch ... run_cofold.sh <inputs_dir> <outroot> <seeds> <samples> <name1> [name2 ...]
# Runs configs sequentially in one job, one boltz predict per (complex, seed), timing each.
IN=$1; OUT=$2; NSEED=$3; NSAMP=$4; shift 4
ROOT=/scratch/<user>/sepiq26
source $ROOT/venv_boltz/bin/activate
export BOLTZ_CACHE=$ROOT/boltz_cache HF_HOME=$ROOT/hf TMPDIR=$ROOT/tmp
mkdir -p $TMPDIR $OUT
echo "HOST $(hostname) JOB $SLURM_JOB_ID"; nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv
python -c "import torch,sys; print('TORCH',torch.__version__,torch.cuda.is_available(),torch.cuda.get_device_name(0)); sys.exit(0 if torch.cuda.is_available() else 3)" || { echo CUDA_FAIL; exit 3; }
echo "INTERNET_CHECK colabfold: $(curl -s -m 8 -o /dev/null -w '%{http_code}' https://api.colabfold.com || echo fail) hf: $(curl -s -m 8 -o /dev/null -w '%{http_code}' https://huggingface.co || echo fail)"
for name in "$@"; do
  for s in $(seq 1 $NSEED); do
    d=$OUT/${name}/seed${s}
    if ls $d/boltz_results_*/predictions/*/*model_0.cif >/dev/null 2>&1; then echo "SKIP $name seed$s"; continue; fi
    mkdir -p $d
    nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits -l 2 > $d/gpumem.csv & SMI=$!
    t0=$(date +%s.%N)
    ( /usr/bin/time -v boltz predict $IN/$name.yaml --out_dir $d --cache $BOLTZ_CACHE --accelerator gpu --devices 1 \
        --diffusion_samples $NSAMP --seed $((1000+s)) --output_format mmcif --write_full_pae --num_workers 2 --no_kernels \
        > $d/log.txt 2> $d/time.txt )
    rc=$?
    t1=$(date +%s.%N)
    echo "TIMING $name seed$s rc=$rc wall_s=$(echo "$t1 - $t0" | bc) maxrss_kb=$(grep 'Maximum resident' $d/time.txt | awk '{print $NF}')"
    kill $SMI; echo "GPU_PEAK_MIB $name seed$s $(sort -n $d/gpumem.csv | tail -1)"
  done
done
echo ALL_DONE
