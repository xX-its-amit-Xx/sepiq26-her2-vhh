#!/bin/bash
ROOT=/scratch/<user>/sepiq26
source $ROOT/venv_chai/bin/activate
export CHAI_DOWNLOADS_DIR=$ROOT/chai_dl HF_HOME=$ROOT/hf TMPDIR=$ROOT/tmp DISABLE_PANDERA_IMPORT_WARNING=True
cd $ROOT; mkdir -p chai_out
python scripts/chai_msa_prefetch.py chai_out $ROOT/fasta/ONU11.fasta $ROOT/fasta/ONU13.fasta $ROOT/fasta/ONU23.fasta $ROOT/fasta/9MTE_27A05.fasta $ROOT/fasta/9MTE_47D05.fasta $ROOT/fasta/9MTX_29E09.fasta
