"use client";
import { useState } from "react";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import { CASP, CASP_SRC, type Casp } from "./ideaData";

const COLOR: Record<Casp["gain"], string> = { data: "var(--her2)", model: "var(--vhh)", loss: "var(--amber)", both: "var(--good)", "n/a": "var(--ink-3)" };
const NAME: Record<Casp["gain"], string> = { data: "what the model was fed", model: "the model", loss: "what it was asked to predict", both: "model and loss, end to end", "n/a": "baseline" };
const num = (y: string) => parseInt(y.replace("~", ""), 10);

export default function CaspTimeline() {
  const [sel, setSel] = useState<number>(CASP.length - 2);
  const W = 600, H = 120, pl = 20, pr = 20;
  const x = (y: string) => pl + ((num(y) - 1994) / (2021 - 1994)) * (W - pl - pr);
  const cur = CASP[sel];
  return (
    <div className="ct">
      <style>{`
        .ct svg{width:100%;height:auto;display:block}
        .ct text{font-family:var(--font-head);font-size:11px;fill:var(--ink-2)}
        .ct-dot{cursor:pointer}
        .ct-leg{display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-family:var(--font-head);font-size:.82rem;margin:.4rem 0}
        .ct-leg i{display:inline-block;width:.7rem;height:.7rem;border-radius:50%;margin-right:.35rem;vertical-align:middle}
        .ct ol{list-style:none;margin:0;padding:0}
        .ct li{display:grid;grid-template-columns:4rem 1fr;gap:.2rem .8rem;padding:.45rem 0;border-bottom:1px solid var(--hair);font-size:.94rem}
        .ct li b{font-family:var(--font-head)}
        .ct li small{color:var(--ink-3);font-family:var(--font-head)}
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Timeline of structure-prediction milestones from 1994 to 2021, coloured by what changed">
        <line x1={pl} x2={W - pr} y1={60} y2={60} stroke="var(--hair)" strokeWidth={2} />
        {[1994, 2000, 2006, 2012, 2018].map((y) => (
          <text key={y} x={x(String(y))} y={H - 8} textAnchor="middle">{y}</text>
        ))}
        {CASP.map((c, i) => (
          <circle
            key={i}
            className="ct-dot"
            cx={x(c.year) + (i === 3 ? -4 : i === 4 ? 4 : 0)}
            cy={60 + (i % 2 ? 14 : -14)}
            r={i === sel ? 9 : 6}
            fill={COLOR[c.gain]}
            stroke={i === sel ? "var(--ink)" : "none"}
            strokeWidth={2}
            tabIndex={0}
            role="button"
            aria-label={`${c.year}: ${c.method}`}
            onClick={() => setSel(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(i)}
          />
        ))}
      </svg>
      <div className="ct-leg">
        {(Object.keys(COLOR) as Casp["gain"][]).map((k) => (
          <span key={k}><i style={{ background: COLOR[k] }} />{NAME[k]}</span>
        ))}
      </div>
      <p aria-live="polite"><b>{cur.year}: {cur.method}.</b> {cur.note}. Evidence in the hive: {cur.status}. What helped most, by the research summary: {NAME[cur.gain]}.</p>
      <Drop title="Full list of milestones" summary="Every dot above, with how well the hive could verify it">
        <ol>
          {CASP.map((c, i) => (
            <li key={i}>
              <b>{c.year}</b>
              <span>{c.method}. {c.note}. <small>{c.status}</small></span>
            </li>
          ))}
        </ol>
      </Drop>
      <Source path={CASP_SRC} note="Only the 2016, 2017, 2018 and 2020 entries are marked verified. The what-changed colouring is the research worker's own judgement." />
    </div>
  );
}
