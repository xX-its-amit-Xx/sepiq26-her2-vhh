"""SEPIQ Track A metric, implemented in every ambiguity variant (the scorer itself is unpublished).

Source of the definition: /guideline (research/_meta/sepiq_verbatim.md): per-complex PR-AUC, macro-average over complexes,
unweighted and area-weighted (weighted recall = TP_area / P_area paired with ordinary precision), omitted residues = 0,
paired bootstrap B=2000 with 95% CI.
What is NOT specified (so every variant is computed): AP (step sum, sklearn.average_precision_score semantics) vs
trapezoid under the PR curve (sklearn.auc on precision_recall_curve points, anchored at (recall=0, precision=1));
antigen-only vs VHH-only vs pooled A+B within one complex; which of the two weightings ranks the leaderboard.

Data layout used by all functions
    complexes = {name: {"A": (y, s, w), "B": (y, s, w)}}   y in {0,1}, s in [0,1] predictions, w = area (0 where y == 0)
"""
import numpy as np

SCOPES = ("antigen", "vhh", "pooled")
INTEGRATIONS = ("ap", "trapz")
WEIGHTINGS = ("unweighted", "area")


def pr_curve(y, s, w=None):
    """Return recall[], precision[] at each distinct threshold (descending score, ties grouped). None if no positive."""
    y = np.asarray(y, float)
    s = np.asarray(s, float)
    n = len(y)
    if y.sum() == 0:
        return None, None
    order = np.argsort(-s, kind="stable")
    ss, ys = s[order], y[order]
    last = np.r_[np.nonzero(np.diff(ss))[0], n - 1]
    tp = np.cumsum(ys)[last]
    prec = tp / (last + 1.0)
    if w is None:
        rec = tp / y.sum()
    else:
        wy = np.asarray(w, float)[order] * ys
        tot = wy.sum()
        if tot <= 0:
            return None, None
        rec = np.cumsum(wy)[last] / tot
    return rec, prec


def pr_auc(y, s, w=None, how="ap"):
    rec, prec = pr_curve(y, s, w)
    if rec is None:
        return float("nan")
    if how == "ap":
        return float(np.sum(np.diff(np.r_[0.0, rec]) * prec))
    if how == "trapz":
        r = np.r_[0.0, rec]
        p = np.r_[1.0, prec]
        return float(np.sum(np.diff(r) * (p[1:] + p[:-1]) / 2.0))
    raise ValueError(how)


def _vectors(chains, scope):
    if scope == "antigen":
        return chains["A"]
    if scope == "vhh":
        return chains["B"]
    return tuple(np.concatenate([chains["A"][i], chains["B"][i]]) for i in range(3))


def complex_score(chains, scope, weighting, how):
    y, s, w = _vectors(chains, scope)
    return pr_auc(y, s, w if weighting == "area" else None, how)


def macro(complexes, scope, weighting, how, names=None):
    names = names or list(complexes)
    v = [complex_score(complexes[n], scope, weighting, how) for n in names]
    return float(np.nanmean(v)), v


def all_variants(complexes, names=None):
    """dict[(scope, weighting, how)] -> (macro, per-complex list)."""
    return {(sc_, wt, hw): macro(complexes, sc_, wt, hw, names) for sc_ in SCOPES for wt in WEIGHTINGS for hw in INTEGRATIONS}


def shuffle_null(complexes, names=None, n=300, seed=0):
    """Permute predictions within each chain of each complex (keeps the score distribution, kills positional information).
    Returns dict[variant] -> (mean, sd) of the macro score over n permutations."""
    rng = np.random.default_rng(seed)
    names = names or list(complexes)
    acc = {(a, b, c): [] for a in SCOPES for b in WEIGHTINGS for c in INTEGRATIONS}
    for _ in range(n):
        shuf = {}
        for nm in names:
            ch = {}
            for c in "AB":
                y, s, w = complexes[nm][c]
                ch[c] = (y, rng.permutation(s), w)
            shuf[nm] = ch
        for k in acc:
            acc[k].append(macro(shuf, *k, names=names)[0])
    return {k: (float(np.mean(v)), float(np.std(v))) for k, v in acc.items()}


def paired_bootstrap(ca, cb, scope="antigen", weighting="unweighted", how="ap", B=2000, mode="residue", block=8, seed=0, names=None):
    """Paired bootstrap of macro(ca) - macro(cb).
    mode 'residue': per complex and chain draw L indices with replacement, SAME draw for both teams (guideline wording; independent
                    draws across complexes because lengths differ, so the guideline's 'one index set across antibodies' is ill-defined).
    mode 'block'  : circular blocks of `block` consecutive residues (crude stand-in for spatially clustered errors).
    mode 'complex': resample the complexes themselves (degenerate for n=3 and for the 5-6 proxies; reported only to show that).
    Returns dict(delta_obs, mean, lo, hi, p_two_sided, B)."""
    rng = np.random.default_rng(seed)
    names = names or list(ca)
    obs = macro(ca, scope, weighting, how, names)[0] - macro(cb, scope, weighting, how, names)[0]
    deltas = []
    for _ in range(B):
        if mode == "complex":
            pick = [names[i] for i in rng.integers(0, len(names), len(names))]
            da = macro(ca, scope, weighting, how, pick)[0]
            db = macro(cb, scope, weighting, how, pick)[0]
            deltas.append(da - db)
            continue
        ra, rb = {}, {}
        for nm in names:
            ia = {}
            for c in "AB":
                L = len(ca[nm][c][0])
                if mode == "residue":
                    idx = rng.integers(0, L, L)
                else:
                    nb = int(np.ceil(L / block))
                    starts = rng.integers(0, L, nb)
                    idx = ((starts[:, None] + np.arange(block)[None, :]) % L).ravel()[:L]
                ia[c] = idx
            ra[nm] = {c: tuple(x[ia[c]] for x in ca[nm][c]) for c in "AB"}
            rb[nm] = {c: tuple(x[ia[c]] for x in cb[nm][c]) for c in "AB"}
        deltas.append(macro(ra, scope, weighting, how, names)[0] - macro(rb, scope, weighting, how, names)[0])
    d = np.array(deltas)
    d = d[np.isfinite(d)]
    p = 2 * min((d <= 0).mean(), (d >= 0).mean())
    return {"delta_obs": float(obs), "mean": float(d.mean()), "lo": float(np.percentile(d, 2.5)), "hi": float(np.percentile(d, 97.5)),
            "p_two_sided": float(min(1.0, p)), "B": int(len(d))}


def self_check():
    """Unit checks against sklearn and hand-computed cases."""
    from sklearn.metrics import average_precision_score, precision_recall_curve, auc
    rng = np.random.default_rng(1)
    for _ in range(50):
        n = rng.integers(40, 700)
        y = (rng.random(n) < rng.uniform(0.02, 0.3)).astype(int)
        if y.sum() == 0:
            continue
        s = np.round(rng.random(n), rng.integers(1, 4))  # induces ties
        assert abs(pr_auc(y, s, None, "ap") - average_precision_score(y, s)) < 1e-12
        p, r, _t = precision_recall_curve(y, s)
        assert abs(pr_auc(y, s, None, "trapz") - auc(r, p)) < 1e-12, (pr_auc(y, s, None, "trapz"), auc(r, p))
    # all-tied predictions: AP = prevalence, trapezoid = (1 + prevalence)/2 (the ties trap)
    y = np.array([1] * 5 + [0] * 95)
    s = np.zeros(100)
    assert abs(pr_auc(y, s, None, "ap") - 0.05) < 1e-12 and abs(pr_auc(y, s, None, "trapz") - 0.525) < 1e-12
    # perfect ranking = 1 under both; weighted == unweighted when all weights equal
    s = np.r_[np.linspace(1, 0.9, 5), np.linspace(0.5, 0, 95)]
    w = np.r_[np.ones(5) * 7.0, np.zeros(95)]
    assert pr_auc(y, s, None, "ap") == 1.0 and pr_auc(y, s, w, "trapz") == 1.0
    assert abs(pr_auc(y, s, w, "ap") - pr_auc(y, s, None, "ap")) < 1e-12
    # weighted recall: one heavy positive found first gives more early area
    y = np.array([1, 1, 0, 0])
    w = np.array([9.0, 1.0, 0, 0])
    s_heavy_first = np.array([0.9, 0.5, 0.8, 0.1])   # order: pos(9), neg, pos(1), neg
    s_light_first = np.array([0.5, 0.9, 0.8, 0.1])   # order: pos(1), neg, pos(9), neg
    a = pr_auc(y, s_heavy_first, w, "ap")
    b = pr_auc(y, s_light_first, w, "ap")
    assert a > b, (a, b)
    return True


if __name__ == "__main__":
    print("metric self-check:", self_check())
