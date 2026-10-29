"""Prefetch ColabFold MSAs in chai .aligned.pqt format. usage: python chai_msa_prefetch.py <outroot> <fasta> ..."""
import sys, time
from pathlib import Path
from chai_lab.data.dataset.msas.colabfold import generate_colabfold_msas
out = Path(sys.argv[1])
for fa in sys.argv[2:]:
    name = Path(fa).stem
    d = out / f"{name}_msas"
    if d.exists() and any(d.iterdir()):
        print("SKIP", name); continue
    d.mkdir(parents=True, exist_ok=True)
    seqs = [l.strip() for l in open(fa) if l.strip() and not l.startswith(">")]
    t = time.time()
    generate_colabfold_msas(seqs, d, "https://api.colabfold.com")
    print("MSA", name, [len(s) for s in seqs], sorted(p.name[:12] for p in d.iterdir()), round(time.time() - t), "s", flush=True)
