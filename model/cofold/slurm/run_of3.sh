#!/bin/bash
# usage: sbatch ... run_of3.sh <nseeds> <nsamples> <name1> ...   (precomputed ColabFold MSAs: of3_msa/query_msa.json; one predict call per complex)
NSEED=$1; NSAMP=$2; shift 2
ROOT=/scratch/<user>/sepiq26
source $ROOT/venv_of3/bin/activate
export OPENFOLD_CACHE=$HOME/.openfold3 TMPDIR=$ROOT/tmp
OUT=$ROOT/of3_out; mkdir -p $OUT $ROOT/of3_q
START=$(date +%s); LIMIT=${OF3_WALL_S:-6900}; EST=900; FAILS=0
echo "HOST $(hostname) JOB $SLURM_JOB_ID"; nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv
python -c "import torch,sys; print('TORCH',torch.__version__,torch.cuda.is_available()); sys.exit(0 if torch.cuda.is_available() else 3)" || { echo CUDA_FAIL; exit 3; }
for name in "$@"; do
  if ls $OUT/$name/*/*_model.cif >/dev/null 2>&1 && [ "$(ls $OUT/$name/*/*_model.cif | wc -l)" -ge $((NSEED*NSAMP)) ]; then echo "SKIP $name"; continue; fi
  now=$(date +%s); if [ $((now-START+EST)) -gt $LIMIT ]; then echo "DEADLINE_GUARD stop before $name"; exit 0; fi
  python - <<PY
import json
q=json.load(open("$ROOT/of3_msa/query_msa.json"))
q["queries"]={"$name":q["queries"]["$name"]}
json.dump(q,open("$ROOT/of3_q/$name.json","w"),indent=1)
PY
  rm -rf $OUT/$name; t0=$(date +%s)
  run_openfold predict --query-json $ROOT/of3_q/$name.json --use-msa-server false --num-model-seeds $NSEED --num-diffusion-samples $NSAMP --output-dir $OUT/$name > $OUT/${name}.log 2>&1
  rc=$?; t1=$(date +%s); w=$((t1-t0))
  echo "TIMING $name rc=$rc wall_s=$w"; [ $((w+120)) -gt $EST ] && EST=$((w+120))
  if [ $rc -ne 0 ]; then FAILS=$((FAILS+1)); [ $FAILS -ge 2 ] && { echo TOO_MANY_FAILS; exit 4; }; else FAILS=0; fi
done
echo ALL_DONE
