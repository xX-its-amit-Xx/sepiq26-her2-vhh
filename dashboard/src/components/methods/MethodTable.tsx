"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, ROWS, type Category, type Row } from "./methodData";
import Source from "@/components/Source";

type Key = "category" | "method" | "status" | "test";
const STATUS_ORDER: Record<Row["status"], number> = { opened: 0, "our simulation": 1, "partly unverified": 2, unverified: 3 };

export default function MethodTable() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const [hideUnv, setHideUnv] = useState(false);
  const [key, setKey] = useState<Key>("category");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const f = ROWS.filter(
      (r) =>
        (cat === "all" || r.category === cat) &&
        (!hideUnv || r.status === "opened" || r.status === "our simulation") &&
        (!needle || `${r.method} ${r.best} ${r.leakage} ${r.licence}`.toLowerCase().includes(needle)),
    );
    const val = (r: Row) => (key === "status" ? STATUS_ORDER[r.status] : r[key].toLowerCase());
    return [...f].sort((a, b) => {
      const x = val(a), y = val(b);
      const c = x < y ? -1 : x > y ? 1 : 0;
      return asc ? c : -c;
    });
  }, [cat, q, hideUnv, key, asc]);

  const head = (k: Key, label: string) => (
    <th aria-sort={key === k ? (asc ? "ascending" : "descending") : "none"}>
      <button type="button" className="mt-sort" onClick={() => (key === k ? setAsc(!asc) : (setKey(k), setAsc(true)))}>
        {label} {key === k ? (asc ? "▲" : "▼") : ""}
      </button>
    </th>
  );

  return (
    <div className="mt">
      <style>{`
        .mt-bar{display:flex;flex-wrap:wrap;gap:.5rem .8rem;align-items:center;margin:.8rem 0}
        .mt-bar select,.mt-bar input[type=search]{font:inherit;font-size:.9rem;padding:.3rem .5rem;border:1px solid var(--hair);border-radius:6px;background:var(--panel);color:var(--ink);max-width:100%}
        .mt-bar label{font-family:var(--font-head);font-size:.85rem;color:var(--ink-2)}
        .mt-wrap{overflow-x:auto;border:1px solid var(--hair);border-radius:8px;background:var(--panel);max-width:100%}
        .mt table{min-width:56rem;font-size:.88rem}
        .mt th{font-family:var(--font-head);background:var(--sunk);position:sticky;top:0;white-space:nowrap}
        .mt td{vertical-align:top}
        .mt-sort{all:unset;cursor:pointer;font-weight:600}
        .mt-sort:focus-visible{outline:2px solid var(--her2);outline-offset:2px}
        .mt-m{font-weight:600;font-family:var(--font-head)}
        .mt-c{font-size:.75rem;color:var(--vhh);font-family:var(--font-head);white-space:nowrap}
        .mt-st{font-size:.75rem;font-family:var(--font-head);white-space:nowrap}
        .mt-st-opened{color:var(--good)}.mt-st-sim{color:var(--vhh)}.mt-st-pu{color:var(--amber)}.mt-st-un{color:var(--bad)}
        .mt-n{color:var(--ink-3);font-size:.85rem;margin:.4rem 0}
      `}</style>
      <div className="mt-bar">
        <label>
          Family{" "}
          <select value={cat} onChange={(e) => setCat(e.target.value as Category | "all")}>
            <option value="all">All families</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Search{" "}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="name, licence, leak..." />
        </label>
        <label>
          <input type="checkbox" checked={hideUnv} onChange={(e) => setHideUnv(e.target.checked)} /> Hide numbers the hive could not fully verify
        </label>
      </div>
      <div className="mt-wrap" role="region" aria-label="Method comparison table" tabIndex={0}>
        <table>
          <thead>
            <tr>
              {head("category", "Family")}
              {head("method", "Method")}
              <th>Best reported number</th>
              {head("test", "Test size")}
              <th>Leakage note</th>
              <th>Licence / access</th>
              {head("status", "Evidence")}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.method}>
                <td className="mt-c">{r.category}</td>
                <td className="mt-m">{r.method}</td>
                <td>
                  {r.best}
                  <Source path={r.src} />
                </td>
                <td>{r.test}</td>
                <td>{r.leakage}</td>
                <td>{r.licence}</td>
                <td className={`mt-st ${r.status === "opened" ? "mt-st-opened" : r.status === "our simulation" ? "mt-st-sim" : r.status === "partly unverified" ? "mt-st-pu" : "mt-st-un"}`}>{r.status}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7}>No method matches these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-n" aria-live="polite">{rows.length} of {ROWS.length} methods shown. Numbers come from different benchmarks and are not comparable across families.</p>
    </div>
  );
}
