r"""Conform candidate submissions to the REAL gated prediction templates (downloaded to C:\Temp\sepiq26\templates).
Finding 2026-10-17: templates are chain A 1..624 (P04626 numbering incl. signal peptide) and chain B without His tag rows
(ONU11/13: 121 rows = 120 VHH + S121; ONU23: 129 rows). Earlier floor/co-fold files had A 1..618 and B incl. His6:
header-valid but 6 template rows missing (A 619-624) and 6 extra rows (B His). This script joins on (chain, seqNum, resName),
fills missing template rows with unique values just above 0 (below every real prediction), drops extra rows, keeps values
unique, and verifies a 100% key match. Usage: python conform_to_templates.py <src_dir> <dst_dir>
"""
import csv, sys, os, math
TPL = r'C:\Temp\sepiq26\templates'
def main(src, dst):
    os.makedirs(dst, exist_ok=True)
    for c in ['ONU11', 'ONU13', 'ONU23']:
        tpl = [(r['chain'], r['seqNum'], r['resName']) for r in csv.DictReader(open(f'{TPL}\prediction_template_{c}.csv', encoding='utf-8-sig'))]
        sub = {(r['chain'], r['seqNum'], r['resName']): float(r['prediction']) for r in csv.DictReader(open(f'{src}/prediction_{c}.csv', encoding='utf-8-sig'))}
        pos = [v for v in sub.values() if v > 0]
        floor = min(pos) if pos else 1e-3
        out, n_fill = [], 0
        for k in tpl:
            if k in sub: out.append(sub[k])
            else: out.append(None); n_fill += 1
        used = set(v for v in out if v is not None)
        fill = []
        i = 1
        for idx, v in enumerate(out):
            if v is None:
                while True:
                    cand = floor * 1e-3 * i; i += 1
                    if float(f'{cand:.8g}') not in used: break
                out[idx] = float(f'{cand:.8g}'); used.add(out[idx])
        # round to 8 significant digits, then verify uniqueness of nonzero values and fix collisions
        vals = [float(f'{v:.8g}') for v in out]
        seen = {}
        for idx, v in enumerate(vals):
            if v in seen and v != 0.0:
                vals[idx] = float(f'{v * (1 + 1e-7 * (seen[v] + 1)):.8g}'); seen[v] += 1
            else: seen.setdefault(v, 0)
        with open(f'{dst}/prediction_{c}.csv', 'w', newline='', encoding='utf-8') as fh:
            w = csv.writer(fh, lineterminator='\r\n'); w.writerow(['chain', 'seqNum', 'resName', 'prediction'])
            for k, v in zip(tpl, vals): w.writerow([k[0], k[1], k[2], repr(v) if v != 0.0 else '0'])
        chk = [(r['chain'], r['seqNum'], r['resName']) for r in csv.DictReader(open(f'{dst}/prediction_{c}.csv', encoding='utf-8-sig'))]
        assert chk == tpl, 'key mismatch'
        nz = [v for v in vals if v != 0.0]
        print(c, 'rows', len(tpl), 'filled', n_fill, 'dropped', len(set(sub) - set(tpl)), 'zeros', vals.count(0.0), 'nonzero unique', len(set(nz)) == len(nz), 'range', min(vals), max(vals))
if __name__ == '__main__': main(sys.argv[1], sys.argv[2])
