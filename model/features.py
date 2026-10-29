"""Feature builders shared by the proxy league (baselines.py) and the floor submission (make_floor.py).

No parameter below is fitted on the proxy labels. Fixed in advance (pre-registered in README):
  DIMER_WEIGHT = 0.5   soft penalty on the partner-occupied patch (q1: "do not hard-mask it")
  FOOT_LAMBDA  = 0.3   weight of the public-footprint prior (q1: held-out VHH AP 0.04-0.05 => keep it mild)
  BASE_A = 0.045, BASE_B = 0.15   chain base rates used only to put both chains on a probability-like scale
                                   (q8 digest: antigen about 0.05, VHH about 0.15; our proxy table gives A 0.029-0.055, B 0.11-0.22)
"""
import json
import os

import numpy as np

import sepiq_common as sc

DIMER_WEIGHT = 0.5
FOOT_LAMBDA = 0.3
BASE_A, BASE_B = 0.045, 0.15
BINDER_TYPES = {"Fab", "scFv", "VHH", "affibody", "DARPin", "Fcab", "repebody", "Fv_peptide", "biparatopic_scFv-Fc"}
# P04626 residues occupied by ERBB partners in the three heterodimers (q1 erbb_family md, section 2, union = 51 residues)
_R = lambda a, b: list(range(a, b + 1))  # noqa: E731
DIMER_HER3 = _R(221, 224) + _R(232, 238) + _R(247, 249) + [267, 268, 270, 272, 274] + _R(276, 281) + [307, 335]
DIMER_EGFR = [222, 223, 224] + _R(232, 238) + [247, 248, 267, 272, 274] + _R(276, 281) + [307, 308, 310, 312, 316, 317, 332, 333, 348, 351]
DIMER_HER4 = [57, 105, 106, 224, 232, 233] + _R(235, 237) + [239] + _R(247, 249) + [258] + _R(265, 267) + [270, 274] + _R(276, 281) + _R(290, 292) + [303, 306, 308] + _R(310, 314) + [316, 333, 335]
DIMER_PATCH = sorted(set(DIMER_HER3) | set(DIMER_EGFR) | set(DIMER_HER4))

# proxy PDB ids kept out of every positional / footprint prior used in the league
PROXY_PDBS = {"5MY6", "7QVK", "9MTE", "9MTX", "8GZ5"}
FAMILY = {"9MTE": {"9MTE", "9MTX"}, "9MTX": {"9MTE", "9MTX"}}  # 27A05 / 29E09 share an epitope bin (q8 digest fact 1)


def her2_mask():
    return {r["uniprot_pos"]: r for r in json.load(open(os.path.join(sc.DATA, "her2_ecd_habitat_mask.json")))}


def rsa_reference(n=sc.INFERRED_TEMPLATE_A_ROWS):
    """Exposure feature for HER2 antigen positions 1..n: RSA from structure 8Q6J (computed by q1 worker, file her2_ecd_habitat_mask.json).
    Residues outside 23-652 get 0 (signal peptide); the 6 residues unmodelled in 8Q6J get 0.5 (neutral)."""
    m = her2_mask()
    out = np.zeros(n)
    for i in range(1, n + 1):
        r = m.get(i)
        if r is None:
            continue
        v = r["rsa_8Q6J"]
        out[i - 1] = 0.5 if v is None else float(np.clip(v, 0, 1))
    return out


def dimer_vector(n=sc.INFERRED_TEMPLATE_A_ROWS):
    v = np.zeros(n)
    for p in DIMER_PATCH:
        if p <= n:
            v[p - 1] = 1.0
    return v


def footprint(exclude_pdbs=(), n=sc.INFERRED_TEMPLATE_A_ROWS):
    """Public footprint prior in [0,1]: every epitope-cluster (q1 Jaccard 0.3 clusters) counts once, ERBB-receptor / apo entries are excluded,
    entries from `exclude_pdbs` are dropped first. Epitope residues = Voronota-LT residues in P04626 numbering (q1 worker data)."""
    d = json.load(open(os.path.join(sc.DATA, "her2_public_complexes.json")))
    ex = set(exclude_pdbs)
    ents = [r for r in d if r["partner_type"] in BINDER_TYPES and r.get("epitope_residues_voronota_lt_uniprot_P04626") and r["pdb_id"] not in ex]
    by = {}
    for r in ents:
        by.setdefault(r.get("epitope_cluster_j0.3"), []).append(r)
    v = np.zeros(n)
    for cid, rs in by.items():
        for r in rs:
            for p in r["epitope_residues_voronota_lt_uniprot_P04626"]:
                if 1 <= p <= n:
                    v[p - 1] += 1.0 / len(rs)
    v = v / max(len(by), 1)
    # light smoothing +-1 residue would blur; none applied. Normalise to [0,1].
    return v / v.max() if v.max() > 0 else v


def antigen_score_her2(arm, exclude_pdbs=()):
    """arm in exposure | exposure_dimer | footprint | exposure_dimer_footprint"""
    e = rsa_reference()
    if arm == "exposure":
        return e
    if arm == "footprint":
        return footprint(exclude_pdbs)
    d = 1.0 - DIMER_WEIGHT * dimer_vector()
    if arm == "exposure_dimer":
        return e * d
    if arm == "exposure_dimer_footprint":
        f = footprint(exclude_pdbs)
        return e * d * ((1 - FOOT_LAMBDA) + FOOT_LAMBDA * f)
    raise ValueError(arm)


def positional_prior_table(exclude_pdbs=PROXY_PDBS, a=5.0, m0=0.1):
    """IMGT-position contact frequency from the 615 PDB VHH complexes of q2 (prior_raw.json; contacts defined by q2's worker script,
    IMGT numbering by q2's own anchor-rule script, NOT ANARCI). Entries of `exclude_pdbs` are removed. Shrunk: (n_c + a*m0) / (n_seen + a)."""
    raw = json.load(open(os.path.join(sc.DATA, "vhh_prior_raw_pdb615.json")))
    nc, ns = {}, {}
    used = 0
    for r in raw:
        if r["pdb"] in exclude_pdbs:
            continue
        used += 1
        seen = r.get("all_pos")
        pos = set(r["pos"])
        if seen is None:
            continue
        for k in seen:
            ns[k] = ns.get(k, 0) + 1
            if k in pos:
                nc[k] = nc.get(k, 0) + 1
    tab = {k: (nc.get(k, 0) + a * m0) / (ns[k] + a) for k in ns}
    return tab, used


def imgt_key(label):
    """ANARCI label like '27', '111A' -> q2 key '27', '111+'; N-terminal extras keep '0', '-1'; C-terminal tail 'T1' -> None."""
    if label is None or label == "" or label.startswith("T"):
        return None
    base = label.rstrip("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    return base + ("+" if label != base else "")


def vhh_positional_scores(imgt_labels, tab):
    out = np.zeros(len(imgt_labels))
    for i, lab in enumerate(imgt_labels):
        k = imgt_key(lab)
        if k is None:
            continue
        if k in tab:
            out[i] = tab[k]
        elif k.rstrip("+") in tab:
            out[i] = tab[k.rstrip("+")]
        else:
            out[i] = 0.02
    return out


def imgt_for_sequence(seq):
    """ANARCI IMGT labels for each residue of seq (list of str|None) via the Windows/pyhmmer-patched ANARCI in the venv."""
    from anarci import anarci
    res = anarci([("x", seq)], scheme="imgt")
    numbering, details = res[0][0], res[1][0]
    if numbering is None:
        raise RuntimeError("ANARCI could not number the sequence")
    nm = numbering[0][0]
    qstart = details[0]["query_start"]
    labels = [None] * len(seq)
    idx = qstart
    for (pos, ins), aa in nm:
        if aa == "-":
            continue
        assert seq[idx] == aa, (idx, seq[idx], aa)
        labels[idx] = "%d%s" % (pos, ins.strip())
        idx += 1
    for k in range(qstart - 1, -1, -1):
        labels[k] = str(-(qstart - 1 - k))
    for t, k in enumerate(range(idx, len(seq)), start=1):
        labels[k] = "T%d" % t
    return labels


def to_probability(scores, base, zero_mask=None, cap=0.95):
    """Linear rescale (rank-preserving within the chain) so that the mean over the chain equals `base`; zeros stay zero."""
    s = np.asarray(scores, float).copy()
    if zero_mask is not None:
        s[zero_mask] = 0.0
    mu = s.mean()
    if mu <= 0:
        return s
    s = s * (base / mu)
    return np.minimum(s, cap)


def break_ties(scores, seed, eps=1e-7):
    """Deterministic pseudo-random tie-breaker that only reorders (near-)equal scores; exact zeros stay exactly 0."""
    s = np.asarray(scores, float).copy()
    rng = np.random.default_rng(seed)
    u = rng.random(len(s))
    nz = s > 0
    s[nz] = s[nz] + eps * u[nz]
    return s
