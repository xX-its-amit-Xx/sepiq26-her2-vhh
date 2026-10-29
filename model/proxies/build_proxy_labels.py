"""Build ONE shared proxy label table (model/proxies/proxy_labels.csv) with real Voronota-LT contact areas.

Inputs  : RCSB mmCIF files in C:\\Temp\\sepiq26\\model\\raw (downloaded from files.rcsb.org by fetch step below)
Tool    : Voronota-LT v1.1.497 (C:\\Temp\\sepiq26\\tools\\vlt.exe), a cosmopolitan build that runs natively on Windows.
          The guideline quotes v1.1.479; the version difference is NOT shown to matter for areas, but it was not tested
          against v1.1.479 (binary for that exact tag was not downloaded).
Command : exactly the guideline's:  --restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]'
          --write-sites-residue-level-to-file (one run per antigen/VHH pair, each pair isolated from other chains)
Differences from the organisers' (unknown) pipeline that we cannot rule out:
  * we feed the ASYMMETRIC UNIT chains (not assembly1), polymer standard amino acids only (no waters, ligands, glycans);
  * only the 1:1 pair is present in each run (9MTE has two VHHs on one HER2: each VHH is run separately);
  * crystal-lattice (symmetry mate) contacts are NOT included.
Label variants written per residue: fact_gt0 (area>0, the guideline's definition), fact_ge5 (area>=5 A^2),
fact_d4 (min heavy-atom distance to partner chain < 4.0 A).
"""
import csv
import json
import os
import subprocess
import sys
import tempfile

import gemmi
import numpy as np
from scipy.spatial import cKDTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
import sepiq_common as sc  # noqa: E402

RAW = r"C:\Temp\sepiq26\model\raw"
VLT = r"C:\Temp\sepiq26\tools\vlt.exe"

# proxy_id, pdb, antigen auth chain, vhh auth chain, vhh name, antigen kind
PROXIES = [
    ("P1", "5MY6", "A", "B", "2Rs15d", "HER2"),
    ("P2", "7QVK", "AAA", "BBB", "NM-02", "HER2"),
    ("P3", "9MTE", "C", "A", "27A05", "HER2"),
    ("P4", "9MTE", "C", "B", "47D05", "HER2"),
    ("P5", "9MTX", "B", "A", "29E09", "HER2"),
    ("P6", "8GZ5", "A", "B", "P17", "RBD"),
]


def fetch():
    import urllib.request
    os.makedirs(RAW, exist_ok=True)
    for pdb in sorted({p[1] for p in PROXIES}):
        dst = os.path.join(RAW, pdb + ".cif")
        if not os.path.exists(dst):
            urllib.request.urlretrieve("https://files.rcsb.org/download/%s.cif" % pdb, dst)


def entity_seq(st, chain_name):
    ch = st[0][chain_name]
    sub = ch.get_polymer().subchain_id()
    for e in st.entities:
        if sub in e.subchains:
            return gemmi.one_letter_code(list(e.full_sequence)), list(e.full_sequence)
    raise KeyError(chain_name)


def polymer_residues(st, chain_name):
    ch = st[0][chain_name]
    out = []
    for r in ch.get_polymer():
        if r.name in sc.ONE:  # standard amino acids only
            out.append(r)
    return out


def write_pair_pdb(st, ag, vh, path, include_hetero=False):
    new = gemmi.Structure()
    new.spacegroup_hm = "P 1"
    model = gemmi.Model("1")
    for src, dst in ((ag, "A"), (vh, "B")):
        c = gemmi.Chain(dst)
        for r in st[0][src]:
            if r.is_water():
                continue
            if r.name in sc.ONE and r.het_flag != "H":
                keep = True
            else:
                keep = include_hetero and r.name not in ("HOH", "DOD")
            if not keep:
                continue
            r2 = gemmi.Residue()
            r2.name = r.name
            r2.seqid = r.seqid
            r2.het_flag = "A" if r.name in sc.ONE else "H"
            seen = set()
            for a in r:
                if a.element.name == "H" or a.name in seen:
                    continue
                if a.altloc not in ("\0", "A", " "):
                    continue
                seen.add(a.name)
                a2 = gemmi.Atom()
                a2.name, a2.element, a2.pos, a2.occ, a2.b_iso = a.name, a.element, a.pos, 1.0, a.b_iso
                r2.add_atom(a2)
            if len(r2):
                c.add_residue(r2)
        model.add_chain(c)
    new.add_model(model)
    new.setup_entities()
    new.write_pdb(path)


def run_vlt(pdb_path, out_tsv):
    cmd = [VLT, "--input", pdb_path, "--restrict-contacts", "[-a1 [-chain A] -a2 [-chain B]]",
           "--write-sites-residue-level-to-file", out_tsv, "--force-icode-column", "--quiet"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[:500])
    rows = []
    with open(out_tsv) as f:
        hdr = None
        for ln in f:
            p = ln.rstrip("\n").split("\t") if "\t" in ln else ln.split()
            if not p:
                continue
            if p[0] == "rs_header":
                hdr = p
                continue
            rows.append(dict(zip(hdr, p)))
    return rows


def min_dists(st, ag, vh):
    """min heavy-atom distance of each residue (antigen then VHH) to the other chain; polymer AA only."""
    ra, rv = polymer_residues(st, ag), polymer_residues(st, vh)

    def coords(rs):
        xs, own = [], []
        for i, r in enumerate(rs):
            for a in r:
                if a.element.name != "H":
                    xs.append([a.pos.x, a.pos.y, a.pos.z])
                    own.append(i)
        return np.array(xs), np.array(own)
    xa, oa = coords(ra)
    xv, ov = coords(rv)
    ta, tv = cKDTree(xa), cKDTree(xv)
    da, _ = tv.query(xa)
    dv, _ = ta.query(xv)
    resa = np.full(len(ra), 99.0)
    resv = np.full(len(rv), 99.0)
    for d, o in zip(da, oa):
        resa[o] = min(resa[o], d)
    for d, o in zip(dv, ov):
        resv[o] = min(resv[o], d)
    return ra, resa, rv, resv


def isolated_rsa(pdb_path, chain):
    """RSA (freesasa, Lee-Richards default) of one chain with the partner removed; returns {(resnum_str): rel_total}."""
    import freesasa
    with tempfile.TemporaryDirectory() as td:
        st = gemmi.read_structure(pdb_path)
        for ch in list(st[0]):
            if ch.name != chain:
                st[0].remove_chain(ch.name)
        p = os.path.join(td, "iso.pdb")
        st.write_pdb(p)
        s = freesasa.Structure(p)
        res = freesasa.calc(s)
        d = res.residueAreas()[chain]
        return {k: v.relativeTotal for k, v in d.items()}


def anarci_imgt(seq):
    """IMGT numbering for each 0-based index of seq via (patched, pyhmmer-backed) ANARCI. Returns list of labels or None."""
    from anarci import anarci
    res = anarci([("x", seq)], scheme="imgt", allowed_species=None)
    numbering, details = res[0][0], res[1][0]
    if numbering is None:
        return None, None
    nm = numbering[0][0]
    qstart = details[0]["query_start"]
    labels = [None] * len(seq)
    idx = qstart
    for (pos, ins), aa in nm:
        if aa == "-":
            continue
        labels[idx] = "%d%s" % (pos, ins.strip())
        idx += 1
    # N-terminal extras: 0, -1, -2 ...; C-terminal extras: T1, T2...
    for k in range(qstart - 1, -1, -1):
        labels[k] = str(-(qstart - 1 - k))
    t = 0
    for k in range(idx, len(seq)):
        t += 1
        labels[k] = "T%d" % t
    return labels, details[0]


def main():
    fetch()
    P04626 = sc.load_p04626()
    rows_out, summary, logs = [], [], {}
    for pid, pdb, ag, vh, vname, kind in PROXIES:
        st = gemmi.read_structure(os.path.join(RAW, pdb + ".cif"))
        st.setup_entities()
        st.remove_hydrogens()
        td = tempfile.mkdtemp(dir=r"C:\Temp\sepiq26\model")
        p_pdb = os.path.join(td, "pair.pdb")
        write_pair_pdb(st, ag, vh, p_pdb)
        tsv = os.path.join(td, "sites.tsv")
        sites = run_vlt(p_pdb, tsv)
        # hetero sensitivity run (glycans etc. kept in chains)
        p_het = os.path.join(td, "pair_het.pdb")
        write_pair_pdb(st, ag, vh, p_het, include_hetero=True)
        sites_het = run_vlt(p_het, os.path.join(td, "sites_het.tsv"))
        het_names = sorted({r["ID_rname"] for r in sites_het} - set(sc.ONE))
        area = {("A" if r["ID_chain"] == "A" else "B", int(r["ID_rnum"]), r.get("ID_icode", "").strip("."), r["ID_rname"]): float(r["area"]) for r in sites}
        # polymer residues, min distances
        ra, da, rv, dv = min_dists(st, ag, vh)
        # sequences
        seqA, _ = entity_seq(st, ag)
        seqV, _ = entity_seq(st, vh)
        # --- antigen universe and numbering
        res_auth = {}
        for i, r in enumerate(ra):
            res_auth[(r.seqid.num, r.seqid.icode.strip())] = (r, da[i])
        rsa_ag = isolated_rsa(p_pdb, "A")
        rsa_vh = isolated_rsa(p_pdb, "B")
        if kind == "HER2":
            # numbering check: auth number == P04626 number?
            n_match = sum(1 for (n, ic), (r, d) in res_auth.items() if P04626[n - 1] == sc.ONE[r.name])
            frac = n_match / len(res_auth)
            logs[pid] = {"antigen_numbering_match_fraction_vs_P04626": round(frac, 4), "n_resolved_antigen": len(res_auth)}
            assert frac > 0.95, (pid, frac)
            universe_A = [(n, sc.THREE[P04626[n - 1]]) for n in range(1, sc.INFERRED_TEMPLATE_A_ROWS + 1)]
            mutated = [(n, sc.THREE[P04626[n - 1]], r.name) for (n, ic), (r, d) in res_auth.items() if P04626[n - 1] != sc.ONE[r.name]]
            logs[pid]["mutated_vs_P04626"] = mutated
            outside = [n for (n, ic) in res_auth if n > sc.INFERRED_TEMPLATE_A_ROWS]
            logs[pid]["resolved_antigen_beyond_618"] = outside
        else:
            # RBD: SEQRES index -> auth numbering by constant offset (verified on resolved residues)
            ch = st[0][ag]
            offs = {r.seqid.num - r.label_seq for r in ch.get_polymer() if r.label_seq}
            logs[pid] = {"seqres_to_auth_offsets_observed": sorted(offs)}
            off = sorted(offs)[0]
            universe_A = [(i + off, sc.THREE[seqA[i - 1]]) for i in range(1, len(seqA) + 1)]
        # --- VHH numbering: sequential SEQRES index (label_seq_id)
        chv = st[0][vh]
        v_by_label = {r.label_seq: r for r in chv.get_polymer() if r.label_seq}
        v_auth_to_label = {(r.seqid.num, r.seqid.icode.strip()): r.label_seq for r in chv.get_polymer() if r.label_seq}
        imgt, det = anarci_imgt(seqV)
        logs[pid]["anarci_evalue"] = None if det is None else det.get("evalue")
        logs[pid]["vhh_seqres_len"] = len(seqV)
        logs[pid]["vhh_resolved"] = len(v_by_label)
        # lookup tables for areas / distances
        dist_A = {k: v[1] for k, v in res_auth.items()}
        area_A = {(n, ic): a for (c, n, ic, rn), a in area.items() if c == "A"}
        area_V = {(n, ic): a for (c, n, ic, rn), a in area.items() if c == "B"}
        dist_V = {(r.seqid.num, r.seqid.icode.strip()): dv[i] for i, r in enumerate(rv)}
        # antigen rows
        nrows_A = 0
        for n, rn in universe_A:
            key = (n, "")
            resolved = key in res_auth
            a = area_A.get(key, 0.0)
            d = float(dist_A.get(key, 99.0))
            rsa = rsa_ag.get(str(n)) if resolved else None
            rows_out.append([pid, pdb, vname, "A", n, rn, int(resolved), ag, n if resolved else "", "", round(a, 4), int(a > 0), int(a >= 5), int(d < 4.0),
                             round(d, 3) if resolved else "", "" if rsa is None else round(rsa, 4), ""])
            nrows_A += 1
        # missing positives (area>0 on residues outside the universe) must be zero
        miss = [k for k in area_A if (k[0], k[1]) not in {(n, "") for n, _ in universe_A}]
        logs[pid]["antigen_positive_outside_universe"] = miss
        for i in range(1, len(seqV) + 1):
            r = v_by_label.get(i)
            resolved = r is not None
            if resolved:
                key = (r.seqid.num, r.seqid.icode.strip())
                a = area_V.get(key, 0.0)
                d = float(dist_V.get(key, 99.0))
                rsa = rsa_vh.get(str(r.seqid.num) + r.seqid.icode.strip())
                auth = r.seqid.num
            else:
                a, d, rsa, auth = 0.0, 99.0, None, ""
            rows_out.append([pid, pdb, vname, "B", i, sc.THREE[seqV[i - 1]], int(resolved), vh, auth, "", round(a, 4), int(a > 0), int(a >= 5), int(d < 4.0),
                             round(d, 3) if resolved else "", "" if rsa is None else round(rsa, 4), imgt[i - 1] if imgt else ""])
        # summary
        arr = [r for r in rows_out if r[0] == pid]
        S = {"proxy_id": pid, "pdb": pdb, "vhh": vname, "antigen_kind": kind, "vhh_chain": vh, "antigen_chain": ag}
        for ch in "AB":
            rr = [r for r in arr if r[3] == ch]
            res = [r for r in rr if r[6] == 1]
            S["n_%s_universe" % ch] = len(rr)
            S["n_%s_resolved" % ch] = len(res)
            for nm, ix in (("gt0", 11), ("ge5", 12), ("d4", 13)):
                npos = sum(r[ix] for r in rr)
                S["n_%s_pos_%s" % (ch, nm)] = npos
                S["rate_%s_%s_universe" % (ch, nm)] = round(npos / len(rr), 4)
                S["rate_%s_%s_resolved" % (ch, nm)] = round(npos / max(1, len(res)), 4)
            S["area_%s_total" % ch] = round(sum(r[10] for r in rr), 1)
        S["pooled_rate_gt0_universe"] = round((S["n_A_pos_gt0"] + S["n_B_pos_gt0"]) / (S["n_A_universe"] + S["n_B_universe"]), 4)
        S["hetero_residue_types_in_contact_when_kept"] = het_names
        S["n_A_pos_gt0_with_hetero_kept"] = sum(1 for r in sites_het if r["ID_chain"] == "A")
        S["n_B_pos_gt0_with_hetero_kept"] = sum(1 for r in sites_het if r["ID_chain"] == "B")
        S["notes"] = logs[pid]
        summary.append(S)
        print(pid, pdb, vname, {k: v for k, v in S.items() if k.startswith("n_") or k.startswith("rate_A_gt0") or k.startswith("rate_B_gt0")})
    hdr = ["proxy_id", "pdb_id", "vhh_name", "chain", "seqNum", "resName", "resolved", "auth_chain", "auth_seq", "icode", "area", "fact_gt0",
           "fact_ge5", "fact_d4", "min_dist_A", "rsa_isolated_chain", "imgt"]
    with open(os.path.join(HERE, "proxy_labels.csv"), "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(hdr)
        w.writerows(rows_out)
    json.dump(summary, open(os.path.join(HERE, "proxy_summary.json"), "w"), indent=1)
    print("wrote", len(rows_out), "rows")


if __name__ == "__main__":
    main()
