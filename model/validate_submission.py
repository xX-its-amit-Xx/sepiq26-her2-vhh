"""Local validator for SEPIQ Track A prediction files (the HF Space only checks that the header holds the 4 names).

Usage
  python validate_submission.py <dir containing prediction_ONU11.csv prediction_ONU13.csv prediction_ONU23.csv>
  python validate_submission.py --self-test        # builds a valid set + 20 deliberately broken sets

Checks (error codes in brackets)
  files      all three complexes present, named prediction_<clone>.csv            [MISSING_FILE, EXTRA_FILE]
  header     exact names chain,seqNum,resName,prediction in that order            [HEADER_NAMES, HEADER_ORDER, EXTRA_COLUMN(warn)]
  rows       chain in {A,B}; integer seqNum; 3-letter upper-case resName          [BAD_CHAIN, BAD_SEQNUM, BAD_RESNAME]
  numbering  (chain, seqNum) -> residue must equal the printed construct
             (A = UniProt P04626 numbering incl. 22-aa signal peptide, 1 = M; B = sequential, 1 = first printed residue).
             On mismatch the best constant offset is searched and reported      [NUMBERING_MISMATCH, OFFSET_DETECTED]
  duplicates one row per (chain, seqNum)                                       [DUPLICATE_ROW]
  values     numeric, finite, in [0, 1], written as text that parses back      [BAD_VALUE, OUT_OF_RANGE]
  ties       all non-zero predictions of a complex are distinct as TEXT (no
             rounding ties; ties cost ~0.10 AP in the q8 simulation)            [TIES]
  tags       antigen 625-630 and the final His6 of the VHH are exactly 0          [TAG_NONZERO]
  size       antigen rows beyond the inferred template (618) and zero-only files  [BEYOND_TEMPLATE(warn), ALL_ZERO]
  roundtrip  read -> rebuild per-chain vectors -> write -> read -> join to the
             printed construct by (chain, seqNum, resName): lossless, 0 unmatched,
             rank order of the predictions unchanged                             [ROUNDTRIP]
Exit code 0 only if there are no errors. Warnings do not fail.
"""
import csv
import io
import math
import os
import sys
import tempfile

import sepiq_common as sc

EXP_CACHE = {}


def _expected(clone):
    if clone not in EXP_CACHE:
        EXP_CACHE[clone] = sc.expected_residues(clone)
    return EXP_CACHE[clone]


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, code, msg):
        self.errors.append((code, msg))

    def warn(self, code, msg):
        self.warnings.append((code, msg))

    def codes(self):
        return sorted({c for c, _ in self.errors})


def read_rows(path):
    """Return (header, rows) where rows are lists of raw strings. Handles BOM and CRLF."""
    raw = open(path, "rb").read()
    bom = raw.startswith(b"\xef\xbb\xbf")
    text = raw.decode("utf-8-sig")
    rdr = csv.reader(io.StringIO(text))
    allrows = [r for r in rdr]
    if not allrows:
        return None, [], bom
    return allrows[0], allrows[1:], bom


def detect_offset(clone, parsed):
    """Find the constant seqNum shift per chain that maximises residue agreement (to give an actionable message)."""
    exp = _expected(clone)
    out = {}
    for chain in "AB":
        pts = [(n, r) for (c, n, r) in parsed if c == chain]
        if not pts:
            continue
        best = (0, -1)
        for shift in range(-40, 41):
            ok = sum(1 for n, r in pts if exp.get((chain, n + shift)) == sc.ONE.get(r))
            if ok > best[1]:
                best = (shift, ok)
        base = sum(1 for n, r in pts if exp.get((chain, n)) == sc.ONE.get(r))
        if best[0] != 0 and best[1] > base and best[1] >= 0.8 * len(pts):
            out[chain] = best[0]
    return out


def validate_file(path, clone, rep=None):
    rep = rep or Report()
    tag = os.path.basename(path)
    header, rows, bom = read_rows(path)
    if bom:
        rep.warn("BOM", "%s: UTF-8 BOM present (header name 'chain' would read as '\\ufeffchain' in a naive parser)" % tag)
    if header is None:
        rep.err("EMPTY_FILE", "%s: empty file" % tag)
        return rep, None
    header = [h.strip() for h in header]
    if not all(h in header for h in sc.HEADER):
        miss = [h for h in sc.HEADER if h not in header]
        rep.err("HEADER_NAMES", "%s: header lacks %s (found %s)" % (tag, miss, header))
        return rep, None
    if header[:4] != sc.HEADER:
        rep.err("HEADER_ORDER", "%s: header order is %s, expected %s" % (tag, header, sc.HEADER))
    if len(header) > 4:
        rep.warn("EXTRA_COLUMN", "%s: extra columns %s (the Space tolerates them)" % (tag, header[4:]))
    ix = {h: header.index(h) for h in sc.HEADER}
    exp = _expected(clone)
    tags = sc.tag_positions(clone)

    parsed, seen, text_vals = [], {}, []
    n_mismatch = 0
    first_bad = []
    for ln, r in enumerate(rows, start=2):
        if not r or all(not x.strip() for x in r):
            rep.err("BLANK_ROW", "%s line %d: blank row" % (tag, ln))
            continue
        if len(r) < len(header):
            rep.err("SHORT_ROW", "%s line %d: %d fields, header has %d" % (tag, ln, len(r), len(header)))
            continue
        chain, sn, rn, pv = (r[ix[h]].strip() for h in sc.HEADER)
        if chain not in ("A", "B"):
            rep.err("BAD_CHAIN", "%s line %d: chain %r not in {A,B}" % (tag, ln, chain))
            continue
        try:
            if not sn.lstrip("-").isdigit():
                raise ValueError
            n = int(sn)
        except ValueError:
            rep.err("BAD_SEQNUM", "%s line %d: seqNum %r is not an integer" % (tag, ln, sn))
            continue
        if not (len(rn) == 3 and rn.isalpha() and rn.isupper() and rn in sc.ONE):
            rep.err("BAD_RESNAME", "%s line %d: resName %r is not an upper-case 3-letter standard residue" % (tag, ln, rn))
            continue
        try:
            v = float(pv)
            if not math.isfinite(v):
                raise ValueError
        except ValueError:
            rep.err("BAD_VALUE", "%s line %d: prediction %r is not a finite number" % (tag, ln, pv))
            continue
        if not (0.0 <= v <= 1.0):
            rep.err("OUT_OF_RANGE", "%s line %d: prediction %s outside [0,1]" % (tag, ln, pv))
        key = (chain, n)
        if key in seen:
            rep.err("DUPLICATE_ROW", "%s line %d: duplicate (%s,%d), first at line %d" % (tag, ln, chain, n, seen[key]))
            continue
        seen[key] = ln
        parsed.append((chain, n, rn, v, pv))
        if exp.get(key) != sc.ONE[rn]:
            n_mismatch += 1
            if len(first_bad) < 3:
                first_bad.append("(%s,%d,%s) expected %s" % (chain, n, rn, sc.THREE.get(exp.get(key), "<no such residue>")))
        if v > 0 and key in tags:
            rep.err("TAG_NONZERO", "%s: tag residue (%s,%d,%s) has prediction %s (must be 0)" % (tag, chain, n, rn, pv))
        if chain == "A" and n > sc.INFERRED_TEMPLATE_A_ROWS and v > 0:
            rep.warn("BEYOND_TEMPLATE", "%s: antigen residue %d > inferred template length %d carries prediction %s (harmless if the template is longer, but unverified)" % (tag, n, sc.INFERRED_TEMPLATE_A_ROWS, pv))
        if v > 0:
            text_vals.append(pv)

    if n_mismatch:
        shifts = detect_offset(clone, [(c, n, r) for c, n, r, _, _ in parsed])
        rep.err("NUMBERING_MISMATCH", "%s: %d of %d rows do not match the printed construct, e.g. %s" % (tag, n_mismatch, len(parsed), "; ".join(first_bad)))
        for ch, sh in shifts.items():
            rep.err("OFFSET_DETECTED", "%s: chain %s residues fit the construct if seqNum is shifted by %+d (mature-protein numbering would be -22 for chain A; 0-based would be +1)" % (tag, ch, sh))
    # ties judged on the written text so rounding is caught
    if text_vals:
        norm = [repr(float(t)) for t in text_vals]
        n_distinct = len(set(norm))
        if n_distinct < len(norm):
            from collections import Counter
            cnt = Counter(norm)
            top = cnt.most_common(3)
            rep.err("TIES", "%s: %d non-zero predictions but only %d distinct values (largest tie groups %s)" % (tag, len(norm), n_distinct, top))
    else:
        rep.err("ALL_ZERO", "%s: no non-zero prediction" % tag)
    if not any(c == "A" for c, *_ in parsed) or not any(c == "B" for c, *_ in parsed):
        rep.warn("ONE_CHAIN", "%s: file lacks rows for one chain (omitted residues are scored as 0 by the organisers)" % tag)
    return rep, parsed


def roundtrip(parsed, clone, tag, rep):
    """parsed -> vectors -> CSV text -> parse again -> join with construct; require lossless and same ranking."""
    exp = _expected(clone)
    vec = {}
    for c, n, rn, v, pv in parsed:
        vec[(c, n)] = (rn, pv)
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, "rt.csv")
        with open(p, "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(sc.HEADER)
            for (c, n), (rn, pv) in sorted(vec.items(), key=lambda kv: (kv[0][0], kv[0][1])):
                w.writerow([c, n, rn, pv])
        h2, rows2, _ = read_rows(p)
    back = {(r[0], int(r[1])): (r[2], r[3]) for r in rows2}
    if back != vec:
        rep.err("ROUNDTRIP", "%s: rewritten file differs from the original rows" % tag)
        return
    unmatched = [k for k, (rn, _) in back.items() if exp.get(k) != sc.ONE.get(rn)]
    if unmatched:
        rep.err("ROUNDTRIP", "%s: %d rows fail the join to the printed construct by (chain, seqNum, resName)" % (tag, len(unmatched)))
        return
    # ranking preserved
    order1 = [k for k, _ in sorted(vec.items(), key=lambda kv: (-float(kv[1][1]), kv[0]))]
    order2 = [k for k, _ in sorted(back.items(), key=lambda kv: (-float(kv[1][1]), kv[0]))]
    if order1 != order2:
        rep.err("ROUNDTRIP", "%s: ranking changed after round trip" % tag)


def validate_dir(d, verbose=True):
    rep = Report()
    files = {}
    for clone in sc.CLONES:
        p = os.path.join(d, "prediction_%s.csv" % clone)
        if not os.path.isfile(p):
            rep.err("MISSING_FILE", "missing %s (all three complexes must be in one upload)" % os.path.basename(p))
        else:
            files[clone] = p
    for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        if f.startswith("prediction_") and f.endswith(".csv") and f[len("prediction_"):-4] not in sc.CLONES:
            rep.warn("EXTRA_FILE", "unexpected file %s" % f)
    for clone, p in files.items():
        r, parsed = validate_file(p, clone, rep)
        if parsed is not None and not [e for e in rep.errors if e[1].startswith(os.path.basename(p))]:
            roundtrip(parsed, clone, os.path.basename(p), rep)
    if verbose:
        for code, m in rep.errors:
            print("ERROR  [%s] %s" % (code, m))
        for code, m in rep.warnings:
            print("WARN   [%s] %s" % (code, m))
        print("RESULT: %s (%d errors, %d warnings)" % ("PASS" if not rep.errors else "FAIL", len(rep.errors), len(rep.warnings)))
    return rep


# ----------------------------------------------------------------------------------------------- self test
def _write_valid(d, seed=0):
    import random
    rnd = random.Random(seed)
    os.makedirs(d, exist_ok=True)
    for clone in sc.CLONES:
        tags = sc.tag_positions(clone)
        vals = set()
        with open(os.path.join(d, "prediction_%s.csv" % clone), "w", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(sc.HEADER)
            for c, n, rn in sc.template_rows(clone):
                if (c, n) in tags:
                    v = 0.0
                else:
                    while True:
                        v = round(rnd.random() * 0.9 + 0.05, 9)
                        if v not in vals:
                            vals.add(v)
                            break
                w.writerow([c, n, rn, repr(v) if v else "0"])


def _mutate(d, clone, fn):
    p = os.path.join(d, "prediction_%s.csv" % clone)
    lines = open(p, newline="").read().split("\n")
    lines = fn(lines)
    open(p, "w", newline="").write("\n".join(lines))


def self_test():
    import shutil
    base = os.path.join(tempfile.gettempdir(), "sepiq_validator_selftest")
    shutil.rmtree(base, ignore_errors=True)
    good = os.path.join(base, "good")
    _write_valid(good)
    results = []
    r = validate_dir(good, verbose=False)
    results.append(("valid set", "PASS", "PASS" if not r.errors else "FAIL %s" % r.codes()))

    def shift_A(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4 and p[0] == "A":
                p[1] = str(int(p[1]) - 22)
            out.append(",".join(p))
        return out

    def drop_header_name(lines):
        lines[0] = lines[0].replace("prediction", "Prediction")
        return lines

    def swap_cols(lines):
        return ["chain,resName,seqNum,prediction"] + [",".join([p[0], p[2], p[1], p[3]]) for p in (l.split(",") for l in lines[1:] if l)]

    def zero_based(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4 and p[0] == "B":
                p[1] = str(int(p[1]) - 1)
            out.append(",".join(p))
        return out

    def round2(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4:
                p[3] = "%.2f" % float(p[3]) if float(p[3]) > 0 else "0"
            out.append(",".join(p))
        return out

    def tag_nonzero(lines):
        out = []
        for l in lines:
            if l.startswith("B,135,"):
                l = "B,135,HIS,0.5123456"
            out.append(l)
        return out

    def tag_nonzero_antigen(lines):
        return [l for l in lines if l] + ["A,625,HIS,0.4123456", ""]

    def over_one(lines):
        lines[5] = lines[5].rsplit(",", 1)[0] + ",1.7"
        return lines

    def negative(lines):
        lines[7] = lines[7].rsplit(",", 1)[0] + ",-0.2"
        return lines

    def nan_val(lines):
        lines[9] = lines[9].rsplit(",", 1)[0] + ",nan"
        return lines

    def text_val(lines):
        lines[9] = lines[9].rsplit(",", 1)[0] + ",high"
        return lines

    def dup_row(lines):
        return lines[:3] + [lines[2]] + lines[3:]

    def bad_resname(lines):
        p = lines[30].split(",")
        p[2] = "GLY" if p[2] != "GLY" else "ALA"
        lines[30] = ",".join(p)
        return lines

    def one_letter(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4:
                p[2] = sc.ONE[p[2]]
            out.append(",".join(p))
        return out

    def lower_res(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4:
                p[2] = p[2].lower()
            out.append(",".join(p))
        return out

    def bad_chain(lines):
        out = [lines[0]]
        for l in lines[1:]:
            out.append(("H" + l[1:]) if l.startswith("B,") else l)
        return out

    def float_seq(lines):
        p = lines[3].split(",")
        p[1] = "3.0"
        lines[3] = ",".join(p)
        return lines

    def all_zero(lines):
        out = [lines[0]]
        for l in lines[1:]:
            p = l.split(",")
            if len(p) == 4:
                p[3] = "0"
            out.append(",".join(p))
        return out

    def extra_col(lines):
        return [lines[0] + ",note"] + [l + ",x" for l in lines[1:] if l]

    def bom(lines):
        lines[0] = "﻿" + lines[0]
        return lines

    def crlf_ok(lines):
        return lines  # handled below by writing CRLF

    def swapped_chains(lines):
        out = [lines[0]]
        for l in lines[1:]:
            out.append(("B" + l[1:]) if l.startswith("A,") else (("A" + l[1:]) if l.startswith("B,") else l))
        return out

    cases = [
        ("antigen numbered as mature protein (-22)", "ONU11", shift_A, {"NUMBERING_MISMATCH", "OFFSET_DETECTED"}),
        ("header name capitalised (Prediction)", "ONU13", drop_header_name, {"HEADER_NAMES"}),
        ("columns reordered", "ONU23", swap_cols, {"HEADER_ORDER", "NUMBERING_MISMATCH", "BAD_RESNAME", "BAD_SEQNUM"}),
        ("VHH numbered from 0", "ONU11", zero_based, {"NUMBERING_MISMATCH", "OFFSET_DETECTED"}),
        ("values rounded to 2 decimals (ties)", "ONU13", round2, {"TIES"}),
        ("VHH His-tag residue B135 non-zero", "ONU23", tag_nonzero, {"TAG_NONZERO"}),
        ("antigen His-tag row A625 non-zero", "ONU11", tag_nonzero_antigen, {"TAG_NONZERO"}),
        ("prediction 1.7 (>1)", "ONU11", over_one, {"OUT_OF_RANGE"}),
        ("prediction -0.2 (<0)", "ONU13", negative, {"OUT_OF_RANGE"}),
        ("prediction NaN", "ONU23", nan_val, {"BAD_VALUE"}),
        ("prediction text", "ONU11", text_val, {"BAD_VALUE"}),
        ("duplicate row", "ONU13", dup_row, {"DUPLICATE_ROW"}),
        ("wrong resName at one row", "ONU23", bad_resname, {"NUMBERING_MISMATCH"}),
        ("one-letter resName", "ONU11", one_letter, {"BAD_RESNAME"}),
        ("lower-case resName", "ONU13", lower_res, {"BAD_RESNAME"}),
        ("chain H instead of B", "ONU23", bad_chain, {"BAD_CHAIN"}),
        ("seqNum written as 3.0", "ONU11", float_seq, {"BAD_SEQNUM"}),
        ("all predictions zero", "ONU13", all_zero, {"ALL_ZERO"}),
        ("chains swapped A<->B", "ONU23", swapped_chains, {"NUMBERING_MISMATCH"}),
    ]
    for name, clone, fn, want in cases:
        d = os.path.join(base, "case_" + __import__("re").sub(r"[^A-Za-z0-9]+", "_", name)[:40])
        shutil.copytree(good, d)
        _mutate(d, clone, fn)
        r = validate_dir(d, verbose=False)
        got = set(r.codes())
        ok = bool(r.errors) and bool(want & got)
        results.append((name, "FAIL expected, codes %s" % sorted(want), ("FAIL(detected) %s" % sorted(got)) if ok else "NOT DETECTED, got %s" % sorted(got)))
    # missing file
    d = os.path.join(base, "missing_file")
    shutil.copytree(good, d)
    os.remove(os.path.join(d, "prediction_ONU23.csv"))
    r = validate_dir(d, verbose=False)
    results.append(("ONU23 file missing", "FAIL expected, codes ['MISSING_FILE']", ("FAIL(detected) %s" % r.codes()) if "MISSING_FILE" in r.codes() else "NOT DETECTED %s" % r.codes()))
    # warnings-only cases must still PASS
    for name, clone, fn, wcode in [("extra column", "ONU11", extra_col, "EXTRA_COLUMN"), ("UTF-8 BOM", "ONU13", bom, "BOM")]:
        d = os.path.join(base, name.replace(" ", "_"))
        shutil.copytree(good, d)
        if name == "UTF-8 BOM":
            p = os.path.join(d, "prediction_ONU13.csv")
            t = open(p, newline="").read()
            open(p, "w", newline="", encoding="utf-8-sig").write(t)
        else:
            _mutate(d, clone, fn)
        r = validate_dir(d, verbose=False)
        wc = {c for c, _ in r.warnings}
        results.append((name, "PASS with warning %s" % wcode, ("PASS" if not r.errors else "FAIL %s" % r.codes()) + (" warn=%s" % sorted(wc))))
    # CRLF line endings must pass
    d = os.path.join(base, "crlf")
    shutil.copytree(good, d)
    for clone in sc.CLONES:
        p = os.path.join(d, "prediction_%s.csv" % clone)
        t = open(p, newline="").read().replace("\n", "\r\n")
        open(p, "w", newline="").write(t)
    r = validate_dir(d, verbose=False)
    results.append(("CRLF line endings", "PASS", "PASS" if not r.errors else "FAIL %s" % r.codes()))
    print("%-48s | %-52s | %s" % ("case", "expected", "observed"))
    bad = 0
    for name, exp, got in results:
        okk = (exp.startswith("PASS") and got.startswith("PASS")) or (exp.startswith("FAIL") and got.startswith("FAIL(detected)"))
        bad += 0 if okk else 1
        print("%-48s | %-52s | %s %s" % (name, exp, got, "" if okk else "  <-- PROBLEM"))
    print("SELF-TEST: %d cases, %d problems" % (len(results), bad))
    return bad


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--self-test":
        sys.exit(1 if self_test() else 0)
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(0 if not validate_dir(sys.argv[1]).errors else 1)
