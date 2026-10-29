"""Shrinkage / blend arms (pre-registered in model/README.md section 10.1) on Boltz-2 contact frequencies.

Arms: raw_freq, raw_freq_cal, shrink_iptm (2a), shrink_splithalf (2b), shrink_fixed02 (2c), db_full (3a), db_conf (3b).
Public API used by the proxy study (blend_study.py) and by the candidate builder (make_s3.py):
    chain_stats(npz)      -> dict(f, N, iptm, r_A, r_B, la)
    arm_chain(arm, f, P, base, N, lam, mask0)  -> probability-like vector for ONE chain (no tie-break)
"""
import numpy as np

import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import features as F  # noqa: E402

ARMS = ["raw_freq", "raw_freq_cal", "shrink_iptm", "shrink_splithalf", "shrink_fixed02", "db_full", "db_conf"]


def split_half_r(contact, seeds, sl):
    uniq = sorted(set(seeds))
    h1 = contact[np.isin(seeds, uniq[0::2])].mean(0)[sl]
    h2 = contact[np.isin(seeds, uniq[1::2])].mean(0)[sl]
    if h1.std() == 0 or h2.std() == 0:
        return float("nan")
    return float(np.corrcoef(h1, h2)[0, 1])


def chain_stats(npz_path, nA=618):
    d = np.load(npz_path)
    area = d["area"]
    la = int(d["la"])
    c = (area > 0).astype(float)
    f = c.mean(0)
    iptm = float(np.nan_to_num(d["iptm"], nan=0.0).mean())
    rA = split_half_r(c, d["seed"], slice(0, nA))
    rB = split_half_r(c, d["seed"], slice(la, None))
    return {"f": f, "N": len(area), "iptm": iptm, "r_A": rA, "r_B": rB, "la": la, "nA": nA,
            "fA": f[:nA], "fB": f[la:]}


def to_prob(scores, base, zero_mask=None, cap=0.95):
    """Rank-preserving rescale to chain mean `base`, then a smooth monotone soft cap (cap*tanh(x/cap)) instead of a hard clip,
    so that strongly supported residues keep distinct, ordered values (a hard clip creates tie groups at the cap)."""
    s = np.asarray(scores, float).copy()
    if zero_mask is not None:
        s[zero_mask] = 0.0
    mu = s.mean()
    if mu <= 0:
        return s
    return cap * np.tanh(s * (base / mu) / cap)


def lam_iptm(iptm):
    return 1.0 - float(np.clip((iptm - 0.30) / 0.30, 0.0, 1.0))


def lam_split(r):
    return float(np.clip(1.0 - (0.0 if np.isnan(r) else r), 0.0, 1.0)) if not np.isnan(r) else 1.0


def arm_chain(arm, f, P, base, N, lam_by_arm, mask0=None):
    """f: contact frequency (one chain), P: prior (>=0, any scale), base: chain base rate.
    lam_by_arm: dict arm -> lam for this chain. mask0: bool array of residues forced to 0 (tags / signal peptide)."""
    f = np.asarray(f, float).copy()
    P = np.asarray(P, float).copy()
    m = np.zeros(len(f), bool) if mask0 is None else mask0
    keep = ~m
    if arm == "raw_freq":
        out = f
    elif arm == "raw_freq_cal":
        out = to_prob(f, base, zero_mask=m)
    elif arm in ("shrink_iptm", "shrink_splithalf", "shrink_fixed02"):
        lam = lam_by_arm[arm]
        mu_f = f[keep].mean()
        Pp = P * (mu_f / max(P[keep].mean(), 1e-12))
        s = (1 - lam) * f + lam * Pp
        out = to_prob(s, base, zero_mask=m)
    elif arm in ("db_full", "db_conf"):
        wf = 1.0 if arm == "db_full" else 1.0 - lam_by_arm["shrink_iptm"]
        fs = (f * N + 1.0) / (N + 2.0)
        dbf = 10 * np.log10(fs / (1 - fs)) - 10 * np.log10(base / (1 - base))
        Pf = np.maximum(P, 1e-3 * P.max())
        dbp = 10 * np.log10(Pf / Pf[keep].mean())
        sc_db = wf * dbf + dbp
        out = 1.0 / (1.0 + np.exp(-(np.log(base / (1 - base)) + np.log(10) / 10 * sc_db)))
    else:
        raise ValueError(arm)
    out = np.asarray(out, float).copy()
    out[m] = 0.0
    return out


def lams(stats):
    return {
        "A": {"shrink_iptm": lam_iptm(stats["iptm"]), "shrink_splithalf": lam_split(stats["r_A"]), "shrink_fixed02": 0.2},
        "B": {"shrink_iptm": lam_iptm(stats["iptm"]), "shrink_splithalf": lam_split(stats["r_B"]), "shrink_fixed02": 0.2},
    }
