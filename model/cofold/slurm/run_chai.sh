#!/bin/bash
# usage: sbatch ... run_chai.sh <outroot> <seeds> <samples> <name1> [name2 ...]   (fastas in /scratch/<user>/sepiq26/fasta/<name>.fasta)
OUT=$1; NSEED=$2; NSAMP=$3; shift 3
ROOT=/scratch/<user>/sepiq26
source $ROOT/venv_chai/bin/activate
export CHAI_DOWNLOADS_DIR=$ROOT/chai_dl HF_HOME=$ROOT/hf TORCH_HOME=$ROOT/torch_home TMPDIR=$ROOT/tmp DISABLE_PANDERA_IMPORT_WARNING=True
mkdir -p $TMPDIR $OUT
echo "HOST $(hostname) JOB $SLURM_JOB_ID"; nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv
python -c "import torch,sys; print('TORCH',torch.__version__,torch.cuda.is_available()); sys.exit(0 if torch.cuda.is_available() else 3)" || { echo CUDA_FAIL; exit 3; }
for name in "$@"; do
  for s in $(seq 1 $NSEED); do
    d=$OUT/${name}/seed${s}
    if ls $d/pred.model_idx_4.cif >/dev/null 2>&1; then echo "SKIP $name seed$s"; continue; fi
    rm -rf $d; mkdir -p $(dirname $d)
    nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits -l 2 > $OUT/${name}_s${s}_gpumem.csv & SMI=$!
    if [ -d $OUT/${name}/seed1/msas ] && [ -n "$(ls $OUT/${name}/seed1/msas 2>/dev/null)" ]; then MSAFLAG="--msa-directory $OUT/${name}_msas"; else MSAFLAG=--use-msa-server; fi
    t0=$(date +%s.%N)
    ( /usr/bin/time -v chai-lab fold $MSAFLAG --use-esm-embeddings --num-diffn-samples $NSAMP --seed $((2000+s)) $ROOT/fasta/$name.fasta $d > $OUT/${name}_s${s}.log 2> $OUT/${name}_s${s}.time )
    rc=$?
    t1=$(date +%s.%N)
    kill $SMI
    [ $s = 1 ] && [ -d $d/msas ] && cp -r $d/msas $OUT/${name}_msas
    echo "TIMING $name seed$s rc=$rc wall_s=$(echo "$t1 - $t0" | bc) maxrss_kb=$(grep 'Maximum resident' $OUT/${name}_s${s}.time | awk '{print $NF}') gpu_peak_mib=$(sort -n $OUT/${name}_s${s}_gpumem.csv | tail -1)"
  done
done
echo ALL_DONE
