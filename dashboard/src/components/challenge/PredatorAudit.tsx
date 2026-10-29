"use client";
import { useState } from "react";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import Rich from "./Rich";
import Seg from "./Seg";

export type Claim = { n: number; file: string; claim: string; source: string; verdict: string; notes: string };
export type Audit = { date: string; checked: number; counts: Record<string, number>; claims: Claim[]; quarantine: { file: string; severity: string; reason: string; action: string }[]; patterns: string[] };

const ORDER = ["verified", "imprecise", "unsupported", "unreachable", "fabricated"];
const TONE: Record<string, "good" | "warn" | "bad" | "info" | "plain"> = { verified: "good", imprecise: "warn", unsupported: "bad", unreachable: "info", fabricated: "bad" };
const COLOR: Record<string, string> = { verified: "var(--good)", imprecise: "var(--amber)", unsupported: "var(--bad)", unreachable: "var(--ink-3)", fabricated: "var(--her2)" };

function verdictKey(v: string) {
  return ORDER.find((o) => v.toLowerCase().includes(o)) ?? "unreachable";
}

/** The predator (citation audit) results: stacked verdict bar plus a filterable claim list. */
export default function PredatorAudit({ audit }: { audit: Audit }) {
  const [f, setF] = useState<string>("all");
  const total = audit.claims.length || audit.checked || 1;
  const shown = audit.claims.filter((c) => f === "all" || verdictKey(c.verdict) === f);
  return (
    <div>
      <div className="ch-panel">
        <div className="ch-row" style={{ gap: ".3rem" }} aria-hidden="true">
          <svg viewBox="0 0 100 6" className="ch-svg" preserveAspectRatio="none" style={{ height: "1.1rem", borderRadius: 4 }}>
            {ORDER.map((k, idx) => {
              const before = ORDER.slice(0, idx).reduce((acc, o) => acc + ((audit.counts[o] ?? 0) / total) * 100, 0);
              return <rect key={k} x={before} y={0} width={((audit.counts[k] ?? 0) / total) * 100} height={6} fill={COLOR[k]} />;
            })}
          </svg>
        </div>
        <Pills items={ORDER.map((k) => ({ text: `${k} ${audit.counts[k] ?? 0}`, tone: TONE[k] }))} />
        <p>
          The audit rechecked {audit.checked} decision-relevant claims from the research files against the real tables and original pages. Counts below are from the audit file.{(audit.counts.fabricated ?? 0) > 0 ? " Files with fabricated or unsupported claims are quarantined below." : ""}
        </p>
        <Source path={["research/_meta/predator_audit.md", "research/_meta/predator_audit.json"]} note={`Audit date ${audit.date}.`} />
      </div>

      {audit.quarantine.length > 0 && (
        <>
          <h3>Quarantined files</h3>
          {audit.quarantine.map((q) => (
            <Drop key={q.file} title={<span><Rich>{q.file.split("/").pop() ?? q.file}</Rich></span>} summary={`severity ${q.severity}`}>
              <dl className="ch-kv">
                <dt>Why</dt><dd><Rich>{q.reason}</Rich></dd>
                <dt>Action</dt><dd><Rich>{q.action}</Rich></dd>
                <dt>File</dt><dd><code>{q.file}</code></dd>
              </dl>
            </Drop>
          ))}
          <Source path="research/_meta/quarantine.json" />
        </>
      )}

      <h3>Every checked claim</h3>
      <Seg label="Verdict" value={f} onChange={setF} options={[{ v: "all", t: "All" }, ...ORDER.map((k) => ({ v: k, t: `${k} ${audit.counts[k] ?? 0}` }))]} />
      {shown.map((c) => (
        <Drop key={c.n} title={<span>#{c.n} <Rich>{c.claim}</Rich></span>} summary={<Pills items={[{ text: verdictKey(c.verdict), tone: TONE[verdictKey(c.verdict)] }]} />}>
          <dl className="ch-kv">
            <dt>Verdict</dt><dd>{verdictKey(c.verdict)}</dd>
            <dt>Notes</dt><dd><Rich>{c.notes}</Rich></dd>
            <dt>Checked against</dt><dd>{c.source}</dd>
            <dt>Claim made in</dt><dd><code>{c.file}</code></dd>
          </dl>
        </Drop>
      ))}
      {audit.patterns.length > 0 && (
        <Drop title="Patterns the audit saw" summary="Where errors tend to come from">
          <ul>{audit.patterns.map((p, i) => <li key={i}><Rich>{p}</Rich></li>)}</ul>
        </Drop>
      )}
    </div>
  );
}
