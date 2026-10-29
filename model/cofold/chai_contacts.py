"""Chai-1 predictions -> cofold/contacts_chai/<complex>.npz (same layout as contacts.py for Boltz-2).
usage: python chai_contacts.py <chai_out_root> <complex> [...]    (root has <complex>/seed<k>/pred.model_idx_<j>.cif + scores.model_idx_<j>.npz)
Chain order: the first chain in the CIF is antigen (A), the second the VHH (B); residues renumbered 1..L (input order)."""
import glob, os, re, sys, tempfile
import gemmi
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import contacts as C  # noqa: E402
B = C.B
OUT = os.path.join(HERE, "contacts_chai")


def process(cif, scores_npz):
    st = gemmi.read_structure(cif)
    st.setup_entities()
    st.remove_hydrogens()
    chains = [ch for ch in st[0]]
    assert len(chains) == 2, [c.name for c in chains]
    la, lb = len(chains[0]), len(chains[1])
    for nm, ch in zip(("A", "B"), chains):
        ch.name = nm
        for i, r in enumerate(ch):
            r.seqid = gemmi.SeqId(i + 1, " ")
    td = tempfile.mkdtemp(dir=r"C:\Temp\sepiq26\model")
    pdb = os.path.join(td, "pair.pdb")
    B.write_pair_pdb(st, "A", "B", pdb)
    sites = B.run_vlt(pdb, os.path.join(td, "sites.tsv"))
    area = np.zeros(la + lb)
    for r in sites:
        n = int(r["ID_rnum"])
        area[(n - 1) if r["ID_chain"] == "A" else la + n - 1] = float(r["area"])
    sc = np.load(scores_npz)
    pae = sc["pae"] if "pae" in sc.files else None
    ips = max(C.ipsae_pair(pae, np.arange(la), np.arange(la, la + lb)), C.ipsae_pair(pae, np.arange(la, la + lb), np.arange(la))) if pae is not None else np.nan
    iptm = float(np.ravel(sc["iptm"])[0]); ptm = float(np.ravel(sc["ptm"])[0]); agg = float(np.ravel(sc["aggregate_score"])[0])
    for f in glob.glob(td + "/*"):
        os.remove(f)
    os.rmdir(td)
    return area, iptm, ptm, ips, agg, la, lb


def main():
    root = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(r"C:\Temp\sepiq26\model", exist_ok=True)
    for name in sys.argv[2:]:
        rows, meta, la, lb = [], [], None, None
        for sd in sorted(glob.glob(os.path.join(root, name, "seed*")), key=lambda p: int(re.search(r"seed(\d+)$", p).group(1))):
            seed = int(re.search(r"seed(\d+)$", sd).group(1))
            for cif in sorted(glob.glob(os.path.join(sd, "pred.model_idx_*.cif"))):
                k = int(re.search(r"idx_(\d+)\.cif$", cif).group(1))
                sn = os.path.join(sd, "scores.model_idx_%d.npz" % k)
                if not os.path.exists(sn):
                    continue
                a, iptm, ptm, ips, agg, la, lb = process(cif, sn)
                rows.append(a); meta.append((seed, k, iptm, ptm, ips, agg))
        if not rows:
            print(name, "no models"); continue
        m = np.array(meta, float)
        np.savez(os.path.join(OUT, name + ".npz"), area=np.array(rows), seed=m[:, 0], sample=m[:, 1], iptm=m[:, 2], ptm=m[:, 3], ipsae=m[:, 4], conf=m[:, 5], la=la, lb=lb)
        print(name, "models", len(rows), "LA", la, "LB", lb, "mean iptm %.3f ipsae %.3f" % (m[:, 2].mean(), np.nanmean(m[:, 4])))


if __name__ == "__main__":
    main()
