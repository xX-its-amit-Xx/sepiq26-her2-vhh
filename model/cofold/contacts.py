"""Stage 1 of the co-fold lane: Voronota-LT residue-level antigen-VHH contact areas for every predicted model.

Reuses the CPU lane's exact label procedure (model/proxies/build_proxy_labels.py: write_pair_pdb + run_vlt, same
--restrict-contacts command, same Voronota-LT v1.1.497 binary), applied to each Boltz-2 prediction instead of an
experimental structure.  Chain A = antigen, chain B = VHH (as input to Boltz).  Residues are numbered 1..L in input order.

Per model also computes ipSAE (Dunbrack 2025 definition, PAE cutoff 10 A, A->B and B->A, max) from the saved full PAE.

Output: cofold/contacts/<complex>.npz  with  area[n_models, LA+LB], iptm[n], ptm[n], ipsae[n], conf[n], seed[n], sample[n]
Usage:  python contacts.py <pred_root> <complex> [<complex> ...]     (pred_root contains <complex>/seed<k>/boltz_results_*/predictions/...)
"""
import glob
import json
import os
import re
import sys
import tempfile

import gemmi
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "proxies"))
sys.path.insert(0, os.path.dirname(HERE))
import build_proxy_labels as B  # noqa: E402  (reuses write_pair_pdb, run_vlt, VLT path)

OUT = os.path.join(HERE, "contacts")
CUT = 10.0


def ipsae_pair(pae, ia, ib):
    """ipSAE for aligned residues in ia scored on partner residues ib (rows = aligned, cols = scored)."""
    sub = pae[np.ix_(ia, ib)]
    best = 0.0
    for r in range(sub.shape[0]):
        valid = sub[r] < CUT
        n0 = int(valid.sum())
        if n0 == 0:
            continue
        d0 = 1.24 * (max(n0, 27) - 15) ** (1.0 / 3.0) - 1.8
        d0 = max(d0, 1.0)
        v = float(np.mean(1.0 / (1.0 + (sub[r][valid] / d0) ** 2)))
        best = max(best, v)
    return best


def process_model(cif, pae_file, conf_file, la):
    st = gemmi.read_structure(cif)
    st.setup_entities()
    st.remove_hydrogens()
    names = [ch.name for ch in st[0]]
    assert names[:2] == ["A", "B"], names
    td = tempfile.mkdtemp(dir=r"C:\Temp\sepiq26\model")
    pdb = os.path.join(td, "pair.pdb")
    # renumber residues 1..L per chain
    for ch in st[0]:
        for i, r in enumerate(ch):
            r.seqid = gemmi.SeqId(i + 1, " ")
    B.write_pair_pdb(st, "A", "B", pdb)
    sites = B.run_vlt(pdb, os.path.join(td, "sites.tsv"))
    lb = len(st[0]["B"])
    area = np.zeros(la + lb)
    for r in sites:
        n = int(r["ID_rnum"])
        area[(n - 1) if r["ID_chain"] == "A" else la + n - 1] = float(r["area"])
    conf = json.load(open(conf_file))
    pae = np.load(pae_file)["pae"]
    ia, ib = np.arange(la), np.arange(la, la + lb)
    ips = max(ipsae_pair(pae, ia, ib), ipsae_pair(pae, ib, ia))
    for f in glob.glob(td + "/*"):
        os.remove(f)
    os.rmdir(td)
    return area, conf.get("iptm", np.nan), conf.get("ptm", np.nan), ips, conf.get("confidence_score", np.nan), conf.get("complex_iplddt", np.nan)


def main():
    root = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(r"C:\Temp\sepiq26\model", exist_ok=True)
    for name in sys.argv[2:]:
        rows, meta = [], []
        la = lb = None
        for sd in sorted(glob.glob(os.path.join(root, name, "seed*")), key=lambda p: int(re.search(r"seed(\d+)$", p).group(1))):
            seed = int(re.search(r"seed(\d+)$", sd).group(1))
            for cif in sorted(glob.glob(os.path.join(sd, "boltz_results_*", "predictions", "*", "*_model_*.cif"))):
                k = int(re.search(r"_model_(\d+)\.cif$", cif).group(1))
                d = os.path.dirname(cif)
                base = os.path.basename(cif)[:-4]
                if la is None:
                    st = gemmi.read_structure(cif)
                    la, lb = len(st[0]["A"]), len(st[0]["B"])
                res = process_model(cif, os.path.join(d, "pae_" + base + ".npz"), os.path.join(d, "confidence_" + base + ".json"), la)
                rows.append(res[0])
                meta.append((seed, k) + tuple(res[1:]))
        if not rows:
            print(name, "no models found")
            continue
        m = np.array(meta, float)
        np.savez(os.path.join(OUT, name + ".npz"), area=np.array(rows), seed=m[:, 0], sample=m[:, 1], iptm=m[:, 2], ptm=m[:, 3],
                 ipsae=m[:, 4], conf=m[:, 5], iplddt=m[:, 6], la=la, lb=lb)
        print(name, "models", len(rows), "LA", la, "LB", lb, "mean iptm %.3f ipsae %.3f" % (m[:, 2].mean(), m[:, 4].mean()))


if __name__ == "__main__":
    main()
