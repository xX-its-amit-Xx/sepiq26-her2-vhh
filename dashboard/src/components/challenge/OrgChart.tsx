"use client";
import { useState } from "react";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import Rich from "./Rich";

export type WorkerInfo = { slug: string; tldr: string | null; confidence: string | null; relevance: number | null; file: string | null };
export type QueenInfo = { id: string; short: string; subdomain: string; html: string | null; workers: WorkerInfo[] };
export type KingInfo = { id: string; short: string; mandate: string; lenses: string[]; html: string | null; queens: QueenInfo[] };
export type Chart = { rationale: string; emperorHtml: string | null; kings: KingInfo[]; channels: { id: string; between: string[]; purpose: string }[] };

type Sel = { kind: "emperor" } | { kind: "king"; id: string } | { kind: "queen"; id: string };

function human(s: string) {
  return s.replace(/_/g, " ");
}

/** Interactive org chart: click a node to read its digest or log. */
export default function OrgChart({ chart }: { chart: Chart }) {
  const [sel, setSel] = useState<Sel>({ kind: "emperor" });
  const pressed = (s: Sel) => JSON.stringify(s) === JSON.stringify(sel);
  const king = sel.kind === "king" ? chart.kings.find((k) => k.id === sel.id) : undefined;
  const queenPair = sel.kind === "queen" ? chart.kings.flatMap((k) => k.queens.map((q) => ({ k, q }))).find((x) => x.q.id === sel.id) : undefined;
  const nWorkers = chart.kings.reduce((a, k) => a + k.queens.reduce((b, q) => b + q.workers.length, 0), 0);

  return (
    <div>
      <div className="ch-tree">
        <div className="top">
          <button type="button" className="ch-node emp" aria-pressed={pressed({ kind: "emperor" })} onClick={() => setSel({ kind: "emperor" })}>
            Emperor <span className="ch-lab" style={{ color: "inherit" }}>decides the shape of the hive</span>
          </button>
        </div>
        <div className="ch-kings">
          {chart.kings.map((k) => (
            <div key={k.id} className="ch-king">
              <button type="button" className="ch-node king" aria-pressed={pressed({ kind: "king", id: k.id })} onClick={() => setSel({ kind: "king", id: k.id })}>
                King {k.short}
              </button>
              <div className="ch-queens">
                {k.queens.map((q) => (
                  <button key={q.id} type="button" className="ch-node" aria-pressed={pressed({ kind: "queen", id: q.id })} onClick={() => setSel({ kind: "queen", id: q.id })}>
                    {q.short} <span className="ch-lab" style={{ color: "inherit" }}>· {q.workers.length} workers</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="ch-lab">1 emperor, {chart.kings.length} kings, {chart.kings.reduce((a, k) => a + k.queens.length, 0)} queens, {nWorkers} planned worker topics. Click any box.</p>
      </div>

      <div className="ch-panel" aria-live="polite">
        {sel.kind === "emperor" && (
          <>
            <h3 style={{ marginTop: 0 }}>Emperor</h3>
            <p><Rich>{chart.rationale}</Rich></p>
            <p>The Emperor does no research. It only chooses how many kings, queens and workers there are, which of them may talk, and how much each may read. Its decision log is below.</p>
            <Source path={["hive/structure.json", "hive/EMPEROR.md"]} />
          </>
        )}
        {king && (
          <>
            <h3 style={{ marginTop: 0 }}>King {king.short}</h3>
            <p><Rich>{king.mandate}</Rich></p>
            <Drop title="Cross-domain lenses this king forces on the queens" summary="Ideas borrowed from outside biotech">
              <ul>{king.lenses.map((l) => <li key={l}><Rich>{l}</Rich></li>)}</ul>
            </Drop>
            {king.html ? (
              <Drop title="Read the king log" summary="What the king concluded after reading the queen digests" defaultOpen>
                <div className="ch-md" dangerouslySetInnerHTML={{ __html: king.html }} />
              </Drop>
            ) : (
              <p>No king log has landed yet.</p>
            )}
            <Source path={["hive/structure.json", `research/_meta/${king.id}_KINGLOG.md`]} />
          </>
        )}
        {queenPair && (
          <>
            <h3 style={{ marginTop: 0 }}>Queen {queenPair.q.short}</h3>
            <p><Rich>{queenPair.q.subdomain}</Rich></p>
            {queenPair.q.html ? (
              <Drop title="Read the queen digest" summary="The five-bullet summary a chief of staff would read, plus facts, analogies and gaps" defaultOpen>
                <div className="ch-md" dangerouslySetInnerHTML={{ __html: queenPair.q.html }} />
              </Drop>
            ) : (
              <p>No digest has landed yet.</p>
            )}
            <h4 style={{ fontFamily: "var(--font-head)", margin: "1rem 0 .2rem" }}>Workers ({queenPair.q.workers.length})</h4>
            {queenPair.q.workers.map((w) => (
              <Drop
                key={w.slug}
                title={human(w.slug)}
                summary={w.tldr ? undefined : "Topic only; no matching report file found"}
              >
                {w.tldr ? <p><Rich>{w.tldr}</Rich></p> : <p>This worker topic was planned, but no report file with a matching worker name was found.</p>}
                <Pills
                  items={[
                    ...(w.confidence ? [{ text: `confidence ${w.confidence}`, tone: "info" as const }] : []),
                    ...(w.relevance !== null ? [{ text: `challenge relevance ${w.relevance}/5`, tone: "plain" as const }] : []),
                  ]}
                />
                {w.file && <Source path={`research/${queenPair.q.id}/${w.file}`} />}
              </Drop>
            ))}
            <Source path={["hive/structure.json", `research/${queenPair.q.id}/_QUEEN_DIGEST.md`]} />
          </>
        )}
      </div>

      <Drop title="Who may talk to whom: the channels" summary={`${chart.channels.length} open message channels between queens`}>
        <div className="ch-scroll">
          <table>
            <thead><tr><th>Channel</th><th>Queens</th><th>Purpose</th></tr></thead>
            <tbody>
              {chart.channels.map((c) => (
                <tr key={c.id}>
                  <td><code>{c.id}</code></td>
                  <td>{c.between.map((b) => (b === "*" ? "everyone" : b.split("_")[0])).join(", ")}</td>
                  <td><Rich>{c.purpose}</Rich></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Source path="hive/structure.json" />
      </Drop>
    </div>
  );
}
