"use client";
import { useState } from "react";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import Rich from "./Rich";
import Seg from "./Seg";

export type Cell = { v: number; nul: number | null } | null;
export type ArmRow = { arm: string; antigen: Cell; vhh: Cell; pooled: Cell };
export type VariantRow = { variant: string; antigen: Cell; vhh: Cell; pooled: Cell };
export type BootRow = { comparison: string; scope: "antigen" | "vhh" | "pooled"; mode: "residue" | "block" | "complex"; delta: number; lo: number; hi: number; p: number };

type Scope = "antigen" | "vhh" | "pooled";
const SCOPES: { v: Scope; t: string }[] = [
  { v: "antigen", t: "HER2 side" },
  { v: "vhh", t: "Nanobody side" },
  { v: "pooled", t: "Both pooled" },
];

function Bar({ cell, cls }: { cell: Cell; cls?: string }) {
  if (!cell) return <span className="ch-lab">n/a</span>;
  return (
    <div className="ch-bar" role="img" aria-label={`score ${cell.v}${cell.nul !== null ? `, shuffle null ${cell.nul}` : ""}`}>
      <i className={cls} style={{ width: `${Math.min(100, cell.v * 100)}%` }} />
      {cell.nul !== null && <b style={{ left: `${Math.min(100, cell.nul * 100)}%` }} title={`shuffle null ${cell.nul}`} />}
    </div>
  );
}

/** Leaderboard of arms against the shuffle null (proxy league, model README section 5). */
export default function Leaderboard({ arms, variants, boots }: { arms: ArmRow[]; variants: VariantRow[]; boots: BootRow[] }) {
  const [scope, setScope] = useState<Scope>("pooled");
  const [mode, setMode] = useState<"residue" | "block" | "complex">("residue");
  const ranked = [...arms].sort((a, b) => (b[scope]?.v ?? -1) - (a[scope]?.v ?? -1));
  const bootRows = boots.filter((b) => b.scope === scope && b.mode === mode && !(b.lo === 0 && b.hi === 0));
  const lo = Math.min(0, ...bootRows.map((b) => b.lo));
  const hi = Math.max(0, ...bootRows.map((b) => b.hi));
  const pad = (hi - lo) * 0.08 || 0.01;
  const x = (v: number) => ((v - (lo - pad)) / (hi - lo + 2 * pad)) * 100;
  const modes = [...new Set(boots.map((b) => b.mode))];

  return (
    <div>
      <Seg label="Residues scored" value={scope} onChange={setScope} options={SCOPES} />
      <div className="ch-panel">
        {ranked.map((r, i) => {
          const c = r[scope];
          const isFloor = /FLOOR/i.test(r.arm);
          const tied = /ALL-TIED|all-tied/i.test(r.arm);
          return (
            <div key={r.arm} className="ch-brow" style={tied ? { opacity: 0.65 } : undefined}>
              <span>
                <span className="ch-lab">{i + 1}.</span> {isFloor ? <b><Rich>{r.arm}</Rich></b> : <Rich>{r.arm}</Rich>}
              </span>
              <Bar cell={c} cls={isFloor ? "her2" : tied ? "amber" : undefined} />
              <span className="ch-num">
                {c ? c.v.toFixed(3) : "n/a"}
                {c && c.nul !== null && <span className="ch-lab"> ({(c.v / c.nul).toFixed(1)}x null)</span>}
              </span>
            </div>
          );
        })}
        <p className="ch-lab">
          Bar = macro <GlossaryTerm id="pr-auc">PR-AUC</GlossaryTerm> over five public HER2 complexes (step-sum, unweighted, contact area above 0). Black tick = the <GlossaryTerm id="shuffle-null">shuffle null</GlossaryTerm>, the score from predictions randomly reordered. Arms with no tick had no null recorded in the log. The all-tied row is a do-nothing submission shown for comparison only.
        </p>
        <Source path="model/README.md" note="Section 5, baselines on the proxies. Proxy numbers, not forecasts for ONU11/13/23." />
      </div>

      {variants.length > 0 && (
        <>
          <h3>The floor submission under other scoring choices</h3>
          <div className="ch-scroll">
            <table>
              <thead><tr><th>Variant</th><th>HER2 side</th><th>Nanobody side</th><th>Both pooled</th></tr></thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.variant}>
                    <td><Rich>{v.variant}</Rich></td>
                    {[v.antigen, v.vhh, v.pooled].map((c, i) => (
                      <td key={i} className="ch-num">{c ? c.v.toFixed(3) : "n/a"}{c && c.nul !== null ? <span className="ch-lab"> (null {c.nul.toFixed(3)})</span> : null}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Source path="model/README.md" note="Section 5, floor composite, other variants." />
        </>
      )}

      <h3>Is the gain real? Paired bootstrap intervals</h3>
      <Seg label="Resampling" value={mode} onChange={setMode} options={modes.map((m) => ({ v: m, t: m === "block" ? "8-residue blocks" : m === "complex" ? "whole complex" : "residue" }))} />
      <div className="ch-panel">
        {bootRows.length === 0 && <p>No interval rows for this selection.</p>}
        {bootRows.map((b) => {
          const sig = b.lo > 0 || b.hi < 0;
          return (
            <div key={b.comparison + b.scope + b.mode} className="ch-brow" style={{ gridTemplateColumns: "minmax(8rem,13rem) 1fr 8.5rem" }}>
              <span><Rich>{b.comparison}</Rich></span>
              <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="ch-svg" style={{ height: "1.4rem" }} role="img" aria-label={`difference ${b.delta}, 95% interval ${b.lo} to ${b.hi}`}>
                <line x1={x(0)} x2={x(0)} y1={0} y2={8} stroke="var(--ink-3)" strokeWidth={0.4} strokeDasharray="1 1" />
                <line x1={x(b.lo)} x2={x(b.hi)} y1={4} y2={4} stroke={sig ? "var(--good)" : "var(--amber)"} strokeWidth={1.4} />
                <circle cx={x(b.delta)} cy={4} r={1.6} fill={sig ? "var(--good)" : "var(--amber)"} />
              </svg>
              <span className="ch-num">{b.delta >= 0 ? "+" : ""}{b.delta.toFixed(3)} <span className="ch-lab">[{b.lo.toFixed(3)}, {b.hi.toFixed(3)}]</span></span>
            </div>
          );
        })}
        <p className="ch-lab">
          Dot = measured difference in macro score; line = 95% <GlossaryTerm id="confidence-interval">confidence interval</GlossaryTerm>; dashed line = no difference. Green means the interval excludes zero, amber means we cannot tell it from zero. Whole-complex resampling with five complexes is degenerate and can look too tight.
        </p>
        <Source path="model/README.md" note="Section 5, paired bootstrap (1,000 draws)." />
      </div>
    </div>
  );
}
