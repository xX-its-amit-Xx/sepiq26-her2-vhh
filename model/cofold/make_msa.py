"""Fetch unpaired ColabFold MSAs (login node, network only) for each unique sequence in cofold/inputs/*.yaml,
write a3m files to msa/ and rewrite yamls with msa paths. Run: python make_msa.py <inputs_dir> <msa_dir> <out_dir>"""
import sys, re, glob, hashlib, os
from boltz.data.msa.mmseqs2 import run_mmseqs2
inp, msad, outd = sys.argv[1:4]
os.makedirs(msad, exist_ok=True); os.makedirs(outd, exist_ok=True)
cache = {}
for f in sorted(glob.glob(inp + "/*.yaml")):
    txt = open(f).read()
    def sub(m):
        seq = m.group(1)
        h = hashlib.md5(seq.encode()).hexdigest()[:10]
        p = f"{msad}/{h}.a3m"
        if not os.path.exists(p):
            res = run_mmseqs2([seq], f"{msad}/tmp_{h}", use_env=True, use_filter=True)
            open(p, "w").write(res[0] if isinstance(res, list) else res)
            n = open(p).read().count(">")
            print(h, len(seq), "seqs in msa:", n, flush=True)
        return f"sequence: {seq}\n      msa: {p}"
    new = re.sub(r"sequence: ([A-Z]+)\n      msa: empty", sub, txt)
    open(f"{outd}/{os.path.basename(f)}", "w", newline="\n").write(new)
print("MSA_DONE")
