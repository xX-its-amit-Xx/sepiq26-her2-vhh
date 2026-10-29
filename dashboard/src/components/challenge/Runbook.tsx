"use client";
import { useEffect, useState } from "react";
import Drop from "@/components/Drop";
import Rich from "./Rich";

export type RunDay = { id: string; date: string; label: string; deliverable: string; owner: string; compute: string; gate: string; submit: string | null };

const KEY = "sepiq-runbook-v1";
const DEADLINE = Date.UTC(2026, 9, 31, 0, 0, 0);

function dayIso(mmdd: string): string | null {
  const m = mmdd.match(/(\d{2})-(\d{2})/);
  return m ? `2026-${m[1]}-${m[2]}` : null;
}

/** Day-by-day runbook as a checklist. Progress is stored in this browser only (localStorage, wrapped in try/catch). */
export default function Runbook({ days }: { days: RunDay[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [today, setToday] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDone(JSON.parse(raw) ?? {});
    } catch {
      setSaved(false);
    }
    const now = new Date();
    setToday(now.toISOString().slice(0, 10));
    setLeft(Math.max(0, Math.ceil((DEADLINE - now.getTime()) / 86400000)));
  }, []);

  function persist(next: Record<string, boolean>) {
    setDone(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setSaved(false);
    }
  }
  const n = days.filter((d) => done[d.id]).length;
  const pct = days.length ? Math.round((n / days.length) * 100) : 0;

  return (
    <div>
      <div className="ch-panel">
        <div className="ch-row" style={{ justifyContent: "space-between" }}>
          <b style={{ fontFamily: "var(--font-head)" }}>{n} of {days.length} days done ({pct}%)</b>
          <span className="ch-lab">
            {left !== null ? `${left} day${left === 1 ? "" : "s"} to the 31 October window end` : "Window ends 2026-10-31"}
          </span>
        </div>
        <div className="ch-prog" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Runbook progress"><i style={{ width: `${pct}%` }} /></div>
        <div className="ch-row">
          <button type="button" className="btn" onClick={() => persist({})}>Reset checklist</button>
          <span className="ch-lab">{saved ? "Ticks are saved in this browser only." : "This browser blocks storage, so ticks last for this visit only."}</span>
        </div>
      </div>
      {days.map((d) => {
        const iso = dayIso(d.date);
        const isToday = iso !== null && iso === today;
        return (
          <div key={d.id} className={`ch-day${isToday ? " today" : ""}${done[d.id] ? " done" : ""}`}>
            <input
              type="checkbox"
              id={`rb-${d.id}`}
              checked={!!done[d.id]}
              onChange={(e) => persist({ ...done, [d.id]: e.target.checked })}
              aria-label={`${d.id} ${d.label} done`}
            />
            <div className="ch-day-body">
              <label htmlFor={`rb-${d.id}`} className="ch-day-h">
                <span className="ch-day-t">{d.id} · {d.label}</span>
                {isToday && <span className="pill pill-bad" style={{ marginLeft: ".5rem" }}>today</span>}
                {d.submit && <span className="pill pill-info" style={{ marginLeft: ".4rem" }}>{d.submit}</span>}
              </label>
              <div className="ch-day-d"><Rich>{d.deliverable}</Rich></div>
              <Drop title="Go / no-go gate and compute" summary={d.gate.slice(0, 90) + (d.gate.length > 90 ? "..." : "")}>
                <p><b>Gate.</b> <Rich>{d.gate}</Rich></p>
                <p><b>Compute.</b> <Rich>{d.compute}</Rich></p>
                <p><b>Owner code.</b> {d.owner} (Q is the compute-and-execution queen, W is a numbered worker agent).</p>
              </Drop>
            </div>
          </div>
        );
      })}
    </div>
  );
}
