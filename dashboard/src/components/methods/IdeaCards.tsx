"use client";
import { useState } from "react";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import { IDEAS, type Verdict } from "./ideaData";

const TONE = { holds: "good", partly: "warn", breaks: "bad", untested: "info" } as const;
const LABEL: Record<Verdict, string> = { holds: "holds", partly: "partly holds", breaks: "breaks", untested: "not yet tested" };
const FILTERS: (Verdict | "all")[] = ["all", "holds", "partly", "breaks", "untested"];

export default function IdeaCards() {
  const [f, setF] = useState<Verdict | "all">("all");
  const list = IDEAS.filter((i) => f === "all" || i.verdict === f);
  return (
    <div className="ic">
      <style>{`
        .ic-bar{display:flex;flex-wrap:wrap;gap:.4rem;margin:.8rem 0}
        .ic-bar .btn[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .ic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,22rem),1fr));gap:1rem;align-items:start}
        .ic-card{border:1px solid var(--hair);border-radius:10px;background:var(--panel);padding:1rem;min-width:0}
        .ic-card h3{margin:.4rem 0 .3rem;font-size:1.1rem}
        .ic-field{font-family:var(--font-head);font-size:.78rem;color:var(--vhh);text-transform:uppercase;letter-spacing:.04em}
        .ic-card p{font-size:.95rem}
        .ic-card .drop{margin:.4rem 0}
        .ic-card .drop summary{padding:.5rem .7rem;font-size:.92rem}
      `}</style>
      <div className="ic-bar" role="group" aria-label="Filter ideas by verdict">
        {FILTERS.map((k) => (
          <button key={k} type="button" className="btn" aria-pressed={f === k} onClick={() => setF(k)}>
            {k === "all" ? `All (${IDEAS.length})` : `${LABEL[k]} (${IDEAS.filter((i) => i.verdict === k).length})`}
          </button>
        ))}
      </div>
      <div className="ic-grid">
        {list.map((i) => (
          <article key={i.id} className="ic-card" id={i.id}>
            <div className="ic-field">{i.field}</div>
            <h3>{i.title}</h3>
            <Pills items={[{ text: LABEL[i.verdict], tone: TONE[i.verdict] }]} />
            <p><b>The analogy.</b> {i.analogy}</p>
            <Drop title="How the other field solved it">
              <p>{i.solved}</p>
            </Drop>
            <Drop title="Honest verdict" summary={LABEL[i.verdict]}>
              <p>{i.why}</p>
            </Drop>
            <Drop title="The cheap experiment">
              <p>{i.cheap}</p>
            </Drop>
            <Drop title="The kill test">
              <p>{i.kill}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>If this test fails, the idea is dropped, not argued for.</p>
            </Drop>
            <Drop title="The fun part of the challenge">
              <p>{i.fun}</p>
            </Drop>
            <Source path={i.src} />
          </article>
        ))}
      </div>
    </div>
  );
}
