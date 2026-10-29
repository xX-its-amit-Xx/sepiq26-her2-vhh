#!/bin/bash
# usage: sbatch ... run_chai2.sh <outroot> <nseeds> <nsamples> <name1> ...   MSAs prefetched in <outroot>/<name>_msas (else server)
OUT=$1; NSEED=$2; NSAMP=$3; shift 3
ROOT=/scratch/<user>/sepiq26
source $ROOT/venv_chai/bin/activate
export CHAI_DOWNLOADS_DIR=$ROOT/chai_dl HF_HOME=$ROOT/hf TORCH_HOME=$ROOT/torch_home TMPDIR=$ROOT/tmp DISABLE_PANDERA_IMPORT_WARNING=True
mkdir -p $TMPDIR $OUT
START=$(date +%s); LIMIT=${CHAI_WALL_S:-6900}; EST=600; FAILS=0
echo "HOST $(hostname) JOB $SLURM_JOB_ID"; nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv
python -c "import torch,sys; print('TORCH',torch.__version__,torch.cuda.is_available()); sys.exit(0 if torch.cuda.is_available() else 3)" || { echo CUDA_FAIL; exit 3; }
for s in $(seq 1 $NSEED); do
 for name in "$@"; do
  d=$OUT/${name}/seed${s}
  if ls $d/pred.model_idx_$((NSAMP-1)).cif >/dev/null 2>&1; then echo "SKIP $name seed$s"; continue; fi
  now=$(date +%s); if [ $((now-START+EST)) -gt $LIMIT ]; then echo "DEADLINE_GUARD stop before $name seed$s"; echo STOPPED_EARLY; exit 0; fi
  rm -rf $d; mkdir -p $(dirname $d)
  if [ -d $OUT/${name}_msas ] && [ -n "$(ls $OUT/${name}_msas 2>/dev/null)" ]; then MSAFLAG="--msa-directory $OUT/${name}_msas"; else MSAFLAG=--use-msa-server; fi
  t0=$(date +%s.%N)
  chai-lab fold $MSAFLAG --use-esm-embeddings --num-diffn-samples $NSAMP --seed $((2000+s)) $ROOT/fasta/$name.fasta $d > $OUT/${name}_s${s}.log 2>&1
  rc=$?
  t1=$(date +%s.%N)
  w=$(echo "$t1 - $t0" | bc); echo "TIMING $name seed$s rc=$rc wall_s=$w"; wi=${w%.*}; [ "$wi" -gt "$((EST-90))" ] && EST=$((wi+90)); if [ $rc -ne 0 ]; then FAILS=$((FAILS+1)); [ $FAILS -ge 3 ] && { echo TOO_MANY_FAILS; exit 4; }; else FAILS=0; fi
 done
done
echo ALL_DONE
