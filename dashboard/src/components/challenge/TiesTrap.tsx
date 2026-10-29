"use client";
import { useState } from "react";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import Seg from "./Seg";

type Scope = "antigen" | "vhh" | "pooled";
type Metric = "ap" | "trapz";

// Proxy-league macro scores, model/README.md section 5 (floor and all-tied rows). Proxy numbers, not forecasts.
const DATA: Record<Metric, Record<Scope, { constant: number; floor: number }>> = {
  ap: { antigen: { constant: 0.042, floor: 0.082 }, vhh: { constant: 0.172, floor: 0.692 }, pooled: { constant: 0.064, floor: 0.389 } },
  trapz: { antigen: { constant: 0.521, floor: 0.076 }, vhh: { constant: 0.586, floor: 0.683 }, pooled: { constant: 0.532, floor: 0.384 } },
};

/** Interactive demo of why the scorer's PR-AUC convention can flip a ranking. */
export default function TiesTrap() {
  const [metric, setMetric] = useState<Metric>("ap");
  const [scope, setScope] = useState<Scope>("antigen");
  const d = DATA[metric][scope];
  const winner = d.constant > d.floor ? "constant" : "floor";
  const bars = [
    { name: "Do-nothing submission (every residue gets the same score)", v: d.constant, cls: "amber" },
    { name: "Our floor submission (real structural and sequence priors)", v: d.floor, cls: "" },
  ];
  return (
    <div className="ch-panel">
      <Seg label="Averaging rule" value={metric} onChange={setMetric} options={[{ v: "ap", t: "Step-sum (average precision)" }, { v: "trapz", t: "Trapezoid" }]} />
      <Seg label="Which residues" value={scope} onChange={setScope} options={[{ v: "antigen", t: "HER2 side" }, { v: "vhh", t: "Nanobody side" }, { v: "pooled", t: "Both chains pooled" }]} />
      {bars.map((b) => (
        <div key={b.name} className="ch-brow" style={{ gridTemplateColumns: "minmax(8rem,14rem) 1fr 3.5rem" }}>
          <span>{b.name}</span>
          <div className="ch-bar" role="img" aria-label={`${b.name}: ${b.v}`}><i className={b.cls} style={{ width: `${b.v * 100}%` }} /></div>
          <span className="ch-num">{b.v.toFixed(3)}</span>
        </div>
      ))}
      <p>
        {winner === "constant" ? (
          <b className="ch-sev-high">Under this reading the do-nothing submission wins. </b>
        ) : (
          <b className="ch-sev-low">Under this reading real skill wins. </b>
        )}
        Scores are macro <GlossaryTerm id="pr-auc">PR-AUC</GlossaryTerm> over the five public <GlossaryTerm id="proxy-set">proxy</GlossaryTerm> complexes. A constant prediction ties every residue, and the{" "}
        <GlossaryTerm id="trapezoid-pr-auc">trapezoid</GlossaryTerm> rule rewards that tie. We do not know which rule the organisers use, so our floor file gives every residue a unique value.
      </p>
      <Source path="model/README.md" note="Section 4 (ties trap) and section 5 (floor and all-tied rows). Proxy-league numbers, not forecasts for ONU11/13/23." />
    </div>
  );
}
