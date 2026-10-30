"""Mol-1 variant of contacts.py: Voronota-LT residue contact areas for every Mol-1 sample (chain A = antigen, chain B = VHH).

Usage:  python mol1_contacts.py <mol1_out_root> <complex> [<complex> ...]
Layout read: <root>/<complex>/raw/<complex>/seed_<s>/predictions/*_sample_<k>.cif  (+ *_summary_confidence_sample_<k>.json)
Output: contacts_mol1/<complex>.npz with the same keys as contacts.py (ipsae is NaN: no PAE saved).
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
import build_proxy_labels as B  # noqa: E402

OUT = os.path.join(HERE, "contacts_mol1")


def process(cif, la):
    st = gemmi.read_structure(cif)
    st.setup_entities()
    st.remove_hydrogens()
    assert [c.name for c in st[0]][:2] == ["A", "B"], [c.name for c in st[0]]
    td = tempfile.mkdtemp(dir=r"C:\Temp\sepiq26\model")
    pdb = os.path.join(td, "pair.pdb")
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
    for f in glob.glob(td + "/*"):
        os.remove(f)
    os.rmdir(td)
    base = cif[:-4]
    conf = {}
    for cand in glob.glob(base.replace("_sample_", "_summary_confidence_sample_") + ".json"):
        conf = json.load(open(cand))
    return area, conf.get("iptm", np.nan), conf.get("ptm", np.nan), conf.get("ranking_score", np.nan)


def main():
    root = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(r"C:\Temp\sepiq26\model", exist_ok=True)
    for name in sys.argv[2:]:
        rows, meta, la, lb = [], [], None, None
        for cif in sorted(glob.glob(os.path.join(root, name, "raw", "**", "predictions", "*_sample_*.cif"), recursive=True)):
            seed = int(re.search(r"seed_(\d+)", cif).group(1))
            k = int(re.search(r"_sample_(\d+)\.cif$", cif).group(1))
            if la is None:
                st = gemmi.read_structure(cif)
                la, lb = len(st[0]["A"]), len(st[0]["B"])
            res = process(cif, la)
            rows.append(res[0])
            meta.append((seed, k, res[1], res[2], np.nan, res[3], np.nan))
        if not rows:
            print(name, "no models found")
            continue
        m = np.array(meta, float)
        np.savez(os.path.join(OUT, name + ".npz"), area=np.array(rows), seed=m[:, 0], sample=m[:, 1], iptm=m[:, 2], ptm=m[:, 3],
                 ipsae=m[:, 4], conf=m[:, 5], iplddt=m[:, 6], la=la, lb=lb)
        print(name, "models", len(rows), "LA", la, "LB", lb, "mean iptm %.3f" % np.nanmean(m[:, 2]))


if __name__ == "__main__":
    main()
