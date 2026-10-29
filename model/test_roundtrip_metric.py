"""End-to-end round trip: proxy scores -> prediction CSV (submission format) -> join with a guideline-format ground-truth table
(chain, seqNum, resName, fact, weight; missing prediction rows = 0) -> PR-AUC; must equal the in-memory value to 1e-12.
Also writes proxies/gt_<proxy>.tsv in the guideline's positive_ground_truth format (positives only) for reuse."""
import csv, os, io
import numpy as np
import baselines as B, metric as M, features as F

byp = B.load_labels(); tab, _ = F.positional_prior_table()
os.makedirs("results/roundtrip", exist_ok=True)
worst = 0.0
for pid in B.LEAGUE + B.SANITY:
    rows = byp[pid]
    sA, sB = B.build_scores(B.ARMS["FLOOR_composite" if pid != "P6" else "vhh_cdr_positional_prior"], pid, rows, tab, 11 + int(pid[1:]))
    rrA, yA, wA = B.chain_arrays(rows, "A", "gt0"); rrB, yB, wB = B.chain_arrays(rows, "B", "gt0")
    # write prediction csv, omitting exact zeros (as a participant may)
    p = f"results/roundtrip/prediction_{pid}.csv"
    with open(p, "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n"); w.writerow(["chain", "seqNum", "resName", "prediction"])
        for rr, s, c in ((rrA, sA, "A"), (rrB, sB, "B")):
            for r, v in zip(rr, s):
                if v > 0: w.writerow([c, r["seqNum"], r["resName"], repr(float(v))])
    # ground truth table (positives only, guideline format) written next to the labels
    with open(f"proxies/gt_{pid}.tsv", "w", newline="") as f:
        f.write("chain\tseqNum\tresName\tfact\tweight\n")
        for rr, c in ((rrA, "A"), (rrB, "B")):
            for r in rr:
                if r["fact_gt0"] == "1": f.write(f"{c}\t{r['seqNum']}\t{r['resName']}\t1\t{r['area']}\n")
    # read back and join
    pred = {}
    for r in csv.DictReader(open(p)): pred[(r["chain"], int(r["seqNum"]), r["resName"])] = float(r["prediction"])
    gt = {}
    for r in csv.DictReader(open(f"proxies/gt_{pid}.tsv"), delimiter="\t"): gt[(r["chain"], int(r["seqNum"]), r["resName"])] = float(r["weight"])
    out = {}
    for c, rr, y0, s0, w0 in (("A", rrA, yA, sA, wA), ("B", rrB, yB, sB, wB)):
        keys = [(c, int(r["seqNum"]), r["resName"]) for r in rr]
        s = np.array([pred.get(k, 0.0) for k in keys]); y = np.array([1.0 if k in gt else 0.0 for k in keys]); w = np.array([gt.get(k, 0.0) for k in keys])
        out[c] = (y, s, w)
    ref = {"A": (yA, sA, wA), "B": (yB, sB, wB)}
    for scope in M.SCOPES:
        for wt in M.WEIGHTINGS:
            for how in M.INTEGRATIONS:
                a = M.complex_score(out, scope, wt, how); b = M.complex_score(ref, scope, wt, how)
                worst = max(worst, abs(a - b))
print("round-trip worst |difference| over proxies x 12 variants:", worst)
assert worst < 1e-12
