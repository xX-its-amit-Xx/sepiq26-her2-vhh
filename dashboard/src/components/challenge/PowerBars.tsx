"use client";
import { useState } from "react";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import Seg from "./Seg";

type Kind = "all" | "residue" | "patch" | "complex";
// research/q8_compute_validation_execution/five_submission_ladder... section 3 (binormal toy Monte Carlo, 150 outer sims per cell).
const ROWS: { kind: Exclude<Kind, "all">; boot: string; noise: number; gap: number; power: number; fp?: boolean }[] = [
  { kind: "residue", boot: "residue", noise: 0, gap: 0.0, power: 0.01, fp: true },
  { kind: "residue", boot: "residue", noise: 0, gap: 0.108, power: 0.74 },
  { kind: "residue", boot: "residue", noise: 0, gap: 0.181, power: 0.99 },
  { kind: "patch", boot: "patch-cluster", noise: 0, gap: 0.108, power: 0.76 },
  { kind: "residue", boot: "residue", noise: 0.7, gap: 0.0, power: 0.04, fp: true },
  { kind: "residue", boot: "residue", noise: 0.7, gap: 0.086, power: 0.74 },
  { kind: "patch", boot: "patch-cluster", noise: 0.7, gap: 0.087, power: 0.75 },
  { kind: "patch", boot: "patch-cluster", noise: 0.7, gap: 0.143, power: 0.99 },
  { kind: "complex", boot: "complex-cluster (3 clusters)", noise: 0.7, gap: 0.0, power: 0.14, fp: true },
  { kind: "complex", boot: "complex-cluster (3 clusters)", noise: 0.7, gap: 0.147, power: 0.98 },
];

/** How big must a real improvement be before three test complexes can show it? */
export default function PowerBars() {
  const [kind, setKind] = useState<Kind>("all");
  const rows = ROWS.filter((r) => kind === "all" || r.kind === kind);
  return (
    <div className="ch-panel">
      <Seg
        label="Resampling unit"
        value={kind}
        onChange={setKind}
        options={[{ v: "all", t: "All" }, { v: "residue", t: "Residue" }, { v: "patch", t: "Contact patch" }, { v: "complex", t: "Whole complex" }]}
      />
      {rows.map((r, i) => (
        <div key={i} className="ch-brow">
          <span>
            {r.fp ? "No real gap (false-alarm rate)" : `Real gap ${r.gap.toFixed(3)}`}
            <br />
            <span className="ch-lab">{r.boot}, patch noise {r.noise}</span>
          </span>
          <div className="ch-bar" role="img" aria-label={`power ${r.power}`}><i className={r.fp ? "amber" : ""} style={{ width: `${r.power * 100}%` }} /></div>
          <span className="ch-num">{(r.power * 100).toFixed(0)}%</span>
        </div>
      ))}
      <p>
        Bars show how often a <GlossaryTerm id="paired-cluster-bootstrap">paired bootstrap</GlossaryTerm> flags a gap as real. In this toy simulation a gap of about 0.09 to 0.11 in macro score is needed for roughly 75% detection, and the 3-cluster whole-complex version raises false alarms to 14% against a nominal 5%. The simulation uses idealised score distributions, so treat it as order of magnitude.
      </p>
      <Source path="research/q8_compute_validation_execution/five_submission_ladder_and_cluster_bootstrap_decision_rules_for_n_equals_3.md" note="Section 3, Monte Carlo of n=3 (150 outer simulations per cell)." />
    </div>
  );
}
