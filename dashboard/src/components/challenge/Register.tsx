"use client";
import { useState } from "react";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Rich from "./Rich";
import Seg from "./Seg";

export type Failure = { n: number; mode: string; p: string; i: string; signal: string; mitigation: string; owner: string };
type Sev = "high" | "medium" | "low";
const W: Record<string, number> = { H: 3, M: 2, L: 1 };
const NAME: Record<string, string> = { H: "high", M: "medium", L: "low" };

/** Severity is our own rule: probability x impact (H=3, M=2, L=1); 6 or more is high, 3 to 4 medium, 2 or less low. */
export function severity(p: string, i: string): Sev {
  const s = (W[p] ?? 2) * (W[i] ?? 2);
  return s >= 6 ? "high" : s >= 3 ? "medium" : "low";
}

export default function Register({ rows }: { rows: Failure[] }) {
  const [sev, setSev] = useState<"all" | Sev>("all");
  const withSev = rows.map((r) => ({ ...r, sev: severity(r.p, r.i) }));
  const shown = withSev.filter((r) => sev === "all" || r.sev === sev);
  const count = (s: Sev) => withSev.filter((r) => r.sev === s).length;
  return (
    <div>
      <Seg
        label="Severity"
        value={sev}
        onChange={setSev}
        options={[
          { v: "all", t: `All ${rows.length}` },
          { v: "high", t: `High ${count("high")}` },
          { v: "medium", t: `Medium ${count("medium")}` },
          { v: "low", t: `Low ${count("low")}` },
        ]}
      />
      <p className="ch-lab">Severity = probability x impact, our own rule (H=3, M=2, L=1; 6 or more is high). The probabilities are the runbook author&apos;s judgement, not measurements.</p>
      {shown.map((r) => (
        <Drop
          key={r.n}
          title={<span>#{r.n} <Rich>{r.mode}</Rich></span>}
          summary={<Pills items={[{ text: `severity ${r.sev}`, tone: r.sev === "high" ? "bad" : r.sev === "medium" ? "warn" : "good" }, { text: `P ${NAME[r.p] ?? r.p}` }, { text: `impact ${NAME[r.i] ?? r.i}` }]} />}
        >
          <dl className="ch-kv">
            <dt>Early signal</dt><dd><Rich>{r.signal}</Rich></dd>
            <dt>Mitigation</dt><dd><Rich>{r.mitigation}</Rich></dd>
            <dt>Owner code</dt><dd>{r.owner}</dd>
          </dl>
        </Drop>
      ))}
      {shown.length === 0 && <p>No rows at this severity.</p>}
    </div>
  );
}
