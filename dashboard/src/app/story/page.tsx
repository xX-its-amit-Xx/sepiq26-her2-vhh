"use client";
import { useEffect, useMemo, useState } from "react";
import GlossaryTerm from "@/components/GlossaryTerm";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import Callout from "@/components/Callout";
import Pills from "@/components/Pills";
import Viewer3D from "@/components/Viewer3D";
import factsRaw from "@/data/facts.json";
import timelineRaw from "@/data/timeline.json";

/* ------------------------------------------------------------------ data */
type Fact = { fact: string; number: number | string | null; unit: string | null; source_file: string; confidence: string };
type TLItem = { field: string; date: string; event: string; source_file: string; confidence: string };
const FACTS = factsRaw as unknown as Fact[];
const TL = timelineRaw as unknown as TLItem[];

const G = ({ id, children }: { id?: string; children: React.ReactNode }) => <GlossaryTerm id={id}>{children}</GlossaryTerm>;

function FactList({ ids }: { ids: number[] }) {
  const items = ids.map((i) => FACTS[i]).filter(Boolean);
  if (!items.length) return null;
  const files = Array.from(new Set(items.map((f) => f.source_file).filter(Boolean)));
  return (
    <>
      <ul className="st-facts">
        {items.map((f, k) => (
          <li key={k}>
            <span>{f.fact}</span>
            <b>
              {f.number ?? ""} {f.unit ?? ""}
            </b>
            <em className={`st-conf st-conf-${String(f.confidence).split("-")[0]}`}>{f.confidence}</em>
          </li>
        ))}
      </ul>
      <Source path={files} />
    </>
  );
}

type More = { title: string; lead?: React.ReactNode; facts?: number[]; src?: string[]; nested?: { title: string; body: React.ReactNode } };
type Para = { body: React.ReactNode; more: More };
type Chapter = { id: string; n: number; title: string; figTitle: string; figCap: React.ReactNode; paras: Para[] };

/* ---------------------------------------------------------- small widgets */
function Seg({ options, value, onChange, label }: { options: { v: string; t: string }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="st-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.t}
        </button>
      ))}
    </div>
  );
}

function LazyViewer({ pdb, label, caption }: { pdb: string; label: string; caption: React.ReactNode }) {
  const [on, setOn] = useState(false);
  if (!on)
    return (
      <button type="button" className="st-btn" onClick={() => setOn(true)}>
        {label}
      </button>
    );
  return <Viewer3D pdb={pdb} height={320} spin caption={caption} />;
}

/* ---------------------------------------------------------- illustrations */
function HerFig() {
  const [paired, setPaired] = useState(false);
  const [drugs, setDrugs] = useState(false);
  const beads = [
    { y: 76, r: 15, t: "I" },
    { y: 108, r: 15, t: "II" },
    { y: 140, r: 17, t: "III" },
    { y: 170, r: 15, t: "IV" },
  ];
  const receptor = (x: number, partner?: boolean) => (
    <g key={partner ? "p" : "h"} style={{ transform: `translate(${x}px,0)`, transition: "transform .7s ease" }}>
      <rect x={-4} y={186} width={8} height={46} rx={3} className={partner ? "f-grey" : "f-her2"} />
      <line x1={0} y1={60} x2={0} y2={186} className={partner ? "s-grey" : "s-her2"} strokeWidth={3} />
      {beads.map((b) => (
        <g key={b.t}>
          <circle cx={0} cy={b.y} r={b.r} className={partner ? "f-grey" : "f-her2"} />
          <text x={0} y={b.y + 4} textAnchor="middle" className="t-on">
            {b.t}
          </text>
        </g>
      ))}
    </g>
  );
  return (
    <div>
      <svg viewBox="0 0 300 280" role="img" aria-label="Cartoon of the HER2 receptor on a cell surface. Four beads stick out of the membrane. A partner receptor can pair up with it, and two drug antibodies can sit on it.">
        <text x={8} y={20} className="t-sm">outside the cell</text>
        <rect x={0} y={190} width={300} height={22} className="f-sunk" />
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={8 + i * 15} cy={201} r={5} className="f-hair" />
        ))}
        <text x={8} y={262} className="t-sm">inside the cell</text>
        {receptor(90)}
        {receptor(paired ? 128 : 228, true)}
        <rect x={96} y={101} width={paired ? 26 : 0} height={12} rx={5} className="f-her2" style={{ transition: "width .7s ease" }} />
        {paired && (
          <g>
            <path d="M109 232 L109 256" className="s-her2 st-flow" strokeWidth={3} fill="none" />
            <path d="M104 250 L109 258 L114 250" className="s-her2" strokeWidth={3} fill="none" />
            <text x={122} y={250} className="t-sm">growth signal</text>
          </g>
        )}
        {drugs && (
          <g>
            <rect x={44} y={158} width={30} height={24} rx={6} className="f-vhh" />
            <text x={59} y={174} textAnchor="middle" className="t-on">T</text>
            <rect x={44} y={96} width={30} height={24} rx={6} className="f-vhh" />
            <text x={59} y={112} textAnchor="middle" className="t-on">P</text>
          </g>
        )}
        <text x={90} y={46} textAnchor="middle" className="t-lab">HER2</text>
        <text x={paired ? 128 : 228} y={46} textAnchor="middle" className="t-lab">partner</text>
      </svg>
      <div className="st-ctl">
        <button type="button" className="st-btn" aria-pressed={paired} onClick={() => setPaired((p) => !p)}>
          {paired ? "Unpair" : "Pair up (dimerisation)"}
        </button>
        <button type="button" className="st-btn" aria-pressed={drugs} onClick={() => setDrugs((p) => !p)}>
          {drugs ? "Hide drugs" : "Show two drugs"}
        </button>
      </div>
    </div>
  );
}

function NanoFig() {
  const [view, setView] = useState("loops");
  return (
    <div>
      <svg viewBox="0 0 300 280" role="img" aria-label="Cartoon comparing a Y-shaped antibody with a much smaller single-domain nanobody, with the three grabbing loops marked.">
        {/* antibody */}
        <g>
          <rect x={72} y={172} width={16} height={64} rx={6} className="f-grey" />
          <line x1={80} y1={172} x2={42} y2={96} className="s-grey" strokeWidth={10} strokeLinecap="round" />
          <line x1={80} y1={172} x2={118} y2={96} className="s-grey" strokeWidth={10} strokeLinecap="round" />
          <line x1={58} y1={168} x2={26} y2={104} className="s-grey2" strokeWidth={7} strokeLinecap="round" />
          <line x1={102} y1={168} x2={134} y2={104} className="s-grey2" strokeWidth={7} strokeLinecap="round" />
          <circle cx={36} cy={92} r={11} className="f-vhh" />
          <circle cx={124} cy={92} r={11} className="f-vhh" />
          <text x={80} y={258} textAnchor="middle" className="t-lab">antibody</text>
        </g>
        {/* nanobody */}
        <g>
          <rect x={206} y={110} width={46} height={58} rx={20} className="f-vhh" />
          <path d="M213 112 q-3 -14 5 -14 q8 0 5 14" className="s-vhh" strokeWidth={3} fill="none" />
          <path d="M226 110 q-3 -20 6 -20 q9 0 6 20" className="s-vhh" strokeWidth={3} fill="none" />
          <path d="M241 112 q16 -50 30 -14 q4 10 -4 16" className="s-her2" strokeWidth={5} fill="none" strokeLinecap="round" />
          <text x={229} y={258} textAnchor="middle" className="t-lab">nanobody (VHH)</text>
          {view === "loops" && (
            <g>
              <text x={206} y={78} className="t-sm" textAnchor="middle">CDR1</text>
              <text x={232} y={68} className="t-sm" textAnchor="middle">CDR2</text>
              <text x={276} y={64} className="t-sm" textAnchor="middle" style={{ fill: "var(--her2)" }}>CDR3</text>
              <text x={229} y={142} className="t-on" textAnchor="middle">scaffold</text>
            </g>
          )}
        </g>
        <path d="M140 92 L196 120" className="s-grey" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
        <text x={168} y={96} textAnchor="middle" className="t-sm">same job</text>
        {view === "contacts" && (
          <g>
            <text x={150} y={190} textAnchor="middle" className="t-sm">share of target-touching residues</text>
            <rect x={150} y={198} width={46 * 1.4} height={14} className="f-her2" />
            <text x={150 + 46 * 1.4 + 6} y={209} className="t-sm">CDR3 46%</text>
            <rect x={150} y={218} width={24 * 1.4} height={14} className="f-vhh" />
            <text x={150 + 24 * 1.4 + 6} y={229} className="t-sm">outside all 3 loops 24%</text>
          </g>
        )}
      </svg>
      <Seg label="Nanobody view" value={view} onChange={setView} options={[{ v: "loops", t: "Name the loops" }, { v: "contacts", t: "Who touches the target" }]} />
    </div>
  );
}

function PhageFig() {
  const [stage, setStage] = useState(0);
  const pos = [[40, 50], [110, 80], [180, 44], [250, 76], [70, 120], [150, 130], [220, 112], [270, 150]];
  const binders: Record<number, number> = { 1: 80, 5: 150, 6: 220 };
  const caps = [
    "1. An alpaca is immunised with HER2, so its immune system makes many different nanobodies.",
    "2. The genes for those nanobodies are copied into phages. Each phage shows one nanobody on its surface.",
    "3. Biopanning: the phages are poured over HER2 on a plate. Sticky ones stay, loose ones are washed off.",
    "4. Sequencing counts every nanobody before and after fishing. A rise in share earns a Yes label (illustrative bars).",
  ];
  return (
    <div>
      <svg viewBox="0 0 300 280" role="img" aria-label="Cartoon of phage display: nanobodies are shown on phages, poured over HER2 on a plate, and the sticky ones are kept.">
        {/* plate + HER2 */}
        <rect x={10} y={222} width={280} height={14} rx={4} className="f-sunk" />
        {[40, 80, 120, 150, 190, 220, 260].map((x) => (
          <g key={x}>
            <line x1={x} y1={222} x2={x} y2={202} className="s-her2" strokeWidth={3} />
            <circle cx={x} cy={198} r={5} className="f-her2" />
          </g>
        ))}
        <text x={150} y={254} textAnchor="middle" className="t-sm">HER2 stuck to a plate</text>
        {pos.map(([x, y], i) => {
          const isB = i in binders;
          const gone = stage >= 2 && !isB;
          const tx = stage >= 2 && isB ? binders[i] : x;
          const ty = stage >= 2 ? (isB ? 168 : y + 40) : y;
          return (
            <g key={i} style={{ transform: `translate(${tx}px,${ty}px)`, transition: "transform .9s ease, opacity .9s ease", opacity: gone ? 0 : 1 }}>
              <ellipse cx={0} cy={0} rx={5} ry={13} className="f-grey" style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity .6s" }} />
              <circle cx={0} cy={stage >= 1 ? 16 : 0} r={5.5} className={isB && stage >= 2 ? "f-vhh" : "f-vhh2"} style={{ transition: "cy .6s" }} />
            </g>
          );
        })}
        {stage === 3 && (
          <g>
            <text x={206} y={16} className="t-sm">reads of one clone</text>
            <rect x={206} y={22} width={20} height={10} className="f-grey" />
            <rect x={206} y={36} width={52} height={10} className="f-vhh" />
            <text x={262} y={31} className="t-sm">before</text>
            <text x={262} y={45} className="t-sm">after</text>
          </g>
        )}
      </svg>
      <div className="st-ctl" role="group" aria-label="Phage display step">
        {[0, 1, 2, 3].map((s) => (
          <button key={s} type="button" className="st-btn" aria-pressed={stage === s} onClick={() => setStage(s)}>
            Step {s + 1}
          </button>
        ))}
      </div>
      <p className="st-figstep">{caps[stage]}</p>
    </div>
  );
}

function BaseFig() {
  const [pct, setPct] = useState(4);
  const N = 630;
  const order = useMemo(() => {
    const a = Array.from({ length: N }, (_, i) => i);
    let s = 12345;
    for (let i = N - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);
  const n = Math.round((N * pct) / 100);
  const lit = useMemo(() => new Set(order.slice(0, n)), [order, n]);
  return (
    <div>
      <svg viewBox="0 0 290 200" role="img" aria-label={`${N} dots stand for HER2 residues; ${n} are lit as touching the nanobody.`}>
        {Array.from({ length: N }, (_, i) => {
          const c = i % 30;
          const r = Math.floor(i / 30);
          const on = lit.has(i);
          return <circle key={i} cx={10 + c * 9} cy={10 + r * 9} r={on ? 3.6 : 2.6} className={on ? "f-her2" : "f-hair"} />;
        })}
        <text x={10} y={206 - 14} className="t-sm" style={{ opacity: 0 }}>.</text>
      </svg>
      <label className="st-slide">
        <span>Share that touch: <b>{pct.toFixed(1)}%</b> = {n} of {N} residues</span>
        <input type="range" min={3} max={5} step={0.1} value={pct} onChange={(e) => setPct(parseFloat(e.target.value))} aria-label="Share of HER2 residues that touch the nanobody" />
      </label>
      <p className="st-figstep">Dots are an illustration: positions are shuffled, only the proportion is real (hive range 3 to 5 percent).</p>
    </div>
  );
}

function Bars({ rows, max, unit }: { rows: { label: string; v: number; cls: string; note?: string }[]; max: number; unit: string }) {
  const h = 34;
  return (
    <svg viewBox={`0 0 300 ${rows.length * h + 10}`} role="img" aria-label="Bar chart">
      {rows.map((r, i) => (
        <g key={r.label} transform={`translate(0,${i * h + 4})`}>
          <text x={0} y={11} className="t-sm">{r.label}</text>
          <rect x={0} y={15} width={Math.max(2, (r.v / max) * 250)} height={13} rx={2} className={r.cls} style={{ transition: "width .5s ease" }} />
          <text x={Math.max(2, (r.v / max) * 250) + 5} y={26} className="t-lab">{r.v}{unit}</text>
        </g>
      ))}
    </svg>
  );
}

function CaspFig() {
  const [v, setV] = useState("fold");
  return (
    <div>
      {v === "fold" ? (
        <Bars max={100} unit="" rows={[
          { label: "2016 CASP12: contact precision, %", v: 47, cls: "f-vhh" },
          { label: "2018 CASP13: contact precision, % (above)", v: 70, cls: "f-vhh" },
          { label: "2020 CASP14: median GDT_TS (a different statistic)", v: 92.4, cls: "f-amber" },
        ]} />
      ) : (
        <Bars max={100} unit="%" rows={[
          { label: "CASP16 best group, antibody targets acceptable (above)", v: 60, cls: "f-vhh" },
          { label: "CASP16 typical group (about a quarter)", v: 25, cls: "f-grey" },
          { label: "CASP16 nanobody target H1244, any group", v: 0, cls: "f-her2" },
        ]} />
      )}
      <Seg label="History view" value={v} onChange={setV} options={[{ v: "fold", t: "Folding leaps" }, { v: "ab", t: "Antibodies stay hard" }]} />
      <p className="st-figstep">{v === "fold" ? "Bars use two different statistics, so the last bar is not a like-for-like step." : "Rounded values as quoted in the narrative; see the source drop-downs."}</p>
    </div>
  );
}

function ToolsFig() {
  const [restr, setRestr] = useState(false);
  return (
    <div>
      <Bars max={100} unit="%" rows={[
        { label: "AlphaFold3, one try", v: 31.6, cls: "f-vhh" },
        { label: "Boltz-1, one try", v: 23.3, cls: "f-vhh" },
        { label: "Chai-1, one try", v: 15.0, cls: "f-vhh" },
        { label: restr ? "Classic docking, told the true interface (top 10)" : "Classic docking, whole surface (top 10)", v: restr ? 87.5 : 20, cls: restr ? "f-amber" : "f-grey" },
      ]} />
      <div className="st-ctl">
        <button type="button" className="st-btn" aria-pressed={restr} onClick={() => setRestr((r) => !r)}>
          {restr ? "Remove the hint" : "Give docking the true interface"}
        </button>
      </div>
      <p className="st-figstep">{restr ? "Cheating bar: knowing the interface in advance is exactly what the challenge withholds." : "Success means a docking quality score of at least 0.23. Different test sets, so read as rough size only."}</p>
    </div>
  );
}

function LockFig() {
  const [split, setSplit] = useState("random");
  return (
    <div>
      <svg viewBox="0 0 300 150" role="img" aria-label="Many different keys, one lock: the sequence data describe many nanobodies for a single HER2.">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${14 + i * 38},14)`}>
            <circle cx={9} cy={8} r={8} className="f-vhh" />
            <rect x={7} y={14} width={4} height={50} className="f-vhh" />
            {[0, 1, 2].map((k) => (
              <rect key={k} x={11} y={34 + k * 10} width={4 + ((i * 5 + k * 7) % 3) * 3} height={5} className="f-vhh" />
            ))}
          </g>
        ))}
        <rect x={236} y={40} width={44} height={44} rx={8} className="f-her2" />
        <path d="M246 40 v-10 a12 12 0 0 1 24 0 v10" className="s-her2" strokeWidth={5} fill="none" />
        <circle cx={258} cy={60} r={4} className="f-bg" />
        <text x={14} y={104} className="t-sm">many keys: the nanobody data</text>
        <text x={236} y={104} className="t-sm">one lock</text>
      </svg>
      <Bars max={1} unit="" rows={[{ label: split === "random" ? "Sequence model AUROC, random split" : "Sequence model AUROC, family split", v: split === "random" ? 0.945 : 0.855, cls: split === "random" ? "f-vhh" : "f-amber" }]} />
      <Seg label="Split type" value={split} onChange={setSplit} options={[{ v: "random", t: "Random split" }, { v: "family", t: "Related sequences apart" }]} />
      <p className="st-figstep">Accuracy falls when related sequences are kept apart: the model mostly learned families.</p>
    </div>
  );
}

function TrapFig() {
  const [off, setOff] = useState(0);
  const cells = 30;
  const truth = [6, 7, 8];
  const pred = truth.map((t) => t + off);
  const hit = truth.filter((t) => pred.includes(t)).length;
  return (
    <div>
      <svg viewBox="0 0 300 120" role="img" aria-label="Two strips of residues: the true contacts and a prediction shifted by a numbering offset.">
        <text x={4} y={14} className="t-sm">answer key</text>
        {Array.from({ length: cells }, (_, i) => (
          <rect key={i} x={4 + i * 9.6} y={20} width={8.6} height={16} className={truth.includes(i) ? "f-her2" : "f-hair"} />
        ))}
        <text x={4} y={64} className="t-sm">your prediction</text>
        {Array.from({ length: cells }, (_, i) => (
          <rect key={i} x={4 + i * 9.6} y={70} width={8.6} height={16} className={pred.includes(i) ? "f-vhh" : "f-hair"} style={{ transition: "fill .3s" }} />
        ))}
        <text x={4} y={112} className="t-lab">{hit} of 3 true contacts matched</text>
      </svg>
      <label className="st-slide">
        <span>Numbering offset: <b>{off}</b> residues</span>
        <input type="range" min={0} max={22} step={1} value={off} onChange={(e) => setOff(parseInt(e.target.value, 10))} aria-label="Numbering offset in residues" />
      </label>
      <p className="st-figstep">Cartoon: 30 cells stand in for 630 residues. The real offset between the two numbering systems is 22.</p>
    </div>
  );
}

function PlanFig() {
  const days = 15; // Oct 17..31
  const x = (d: number) => 14 + ((d - 17) / (days - 1)) * 272;
  const ms = [
    { d: 17, t: "research closed", y: 22, cls: "f-grey" },
    { d: 20, t: "insurance entry", y: 58, cls: "f-vhh" },
    { d: 28, t: "freeze", y: 22, cls: "f-amber" },
    { d: 29, t: "upload candidate", y: 58, cls: "f-vhh" },
    { d: 30, t: "reserve; last upload 06:00 UTC", y: 94, cls: "f-her2" },
    { d: 31, t: "deadline", y: 22, cls: "f-her2" },
  ];
  return (
    <div>
      <svg viewBox="0 0 300 130" role="img" aria-label="Calendar from 17 to 31 October 2026 with the planned milestones.">
        <line x1={14} y1={80} x2={286} y2={80} className="s-grey" strokeWidth={3} />
        {Array.from({ length: days }, (_, i) => (
          <line key={i} x1={x(17 + i)} y1={76} x2={x(17 + i)} y2={84} className="s-grey" strokeWidth={1} />
        ))}
        {ms.map((m) => (
          <g key={m.d}>
            <line x1={x(m.d)} y1={m.y + 6} x2={x(m.d)} y2={80} className="s-grey" strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={x(m.d)} cy={80} r={5} className={m.cls} />
            <text x={Math.min(Math.max(x(m.d), 40), 236)} y={m.y} textAnchor="middle" className="t-sm">Oct {m.d}</text>
            <text x={Math.min(Math.max(x(m.d), 40), 236)} y={m.y + 10} textAnchor="middle" className="t-sm" style={{ fontSize: 8 }}>{m.t}</text>
          </g>
        ))}
        <text x={150} y={124} textAnchor="middle" className="t-sm">October 2026, one tick per day</text>
      </svg>
    </div>
  );
}

const FIGS = [HerFig, NanoFig, PhageFig, BaseFig, CaspFig, ToolsFig, LockFig, TrapFig, PlanFig];

/* ------------------------------------------------------------- narrative */
const CH: Chapter[] = [
  {
    id: "ch1", n: 1, title: "HER2: a cancer protein with a big outer surface", figTitle: "HER2 on a cell surface",
    figCap: <>Cartoon of a <G id="her2">HER2</G> receptor with its four <G id="ectodomain">ectodomain</G> beads. Pair it with a partner to see <G id="dimerisation-arm">dimerisation</G>, or add the two drugs trastuzumab (T) and pertuzumab (P).</>,
    paras: [
      {
        body: (<>Every cell is wrapped in a skin studded with proteins that act like antennae. <G id="her2">HER2</G> (also called <G id="erbb2">ERBB2</G>) is one of them, and it belongs to a small family of four related receptors (the <G id="egfr-family">EGFR family</G>) that pass growth signals into the cell. The part sticking out of the cell is the <G id="ectodomain">ectodomain</G>, a chain of about 630 amino acids (the small building blocks of every protein) folded into four beads called <G id="domain-i">domains I</G>, <G id="domain-ii">II</G>, <G id="domain-iii">III</G> and <G id="domain-iv">IV</G>. In some cancers the cell makes far too much HER2. In a large public cancer database, 362 of 10,712 tumour samples (3.4 percent) carried extra copies of its gene (<G id="amplification">amplification</G>), and the rate reached 15.4 percent in oesophageal, 13.2 percent in stomach and 11.5 percent in breast cancer samples.</>),
        more: {
          title: "Over-production, in numbers", facts: [56, 40],
          lead: <>The 630 comes from residues 23 to 652 of the reference sequence. The tumour-type rates quoted above come from the HER2 biology worker file.</>,
          src: ["research/q1_her2_biology/_QUEEN_DIGEST.md", "research/q1_her2_biology/her2_in_cancer_amplification_isoforms_transcripts_epigenetics_ptms_glycans.md"],
          nested: { title: "See a real HER2 structure in 3D", body: <><p>1N8Z is a published picture of the HER2 ectodomain with the trastuzumab Fab, solved by X-ray at 2.52 angstroms (listed in the timeline below). It loads from the public protein database only when you click.</p><LazyViewer pdb="1N8Z" label="Load 1N8Z in 3D" caption="PDB 1N8Z, fetched at runtime from RCSB." /></> },
        },
      },
      {
        body: (<>That is why drug makers care. An antibody drug called <G id="trastuzumab">trastuzumab</G> (Herceptin) was approved by the US regulator in 1998; it grips domain IV, the bead nearest the cell membrane. A second antibody, <G id="pertuzumab">pertuzumab</G> (2012), grips domain II, which is the arm HER2 uses to pair with its siblings. Later drugs bolt a toxic payload onto trastuzumab (<G id="antibody-drug-conjugate">antibody-drug conjugates</G>). Yet the surprise for our contest is how little of HER2 has ever been seen in contact with a drug. Approved antibodies touch only 42 of the 630 residues (6.7 percent). All 25 distinct antibodies with published pictures together touch 213 (33.8 percent). Most of the surface is unexplored.</>),
        more: {
          title: "How much of HER2 has been touched", facts: [41, 42, 53, 54],
          lead: <>Coverage here means the share of the 630 ectodomain <G id="residue">residues</G> that any published binder contacts.</>,
          src: ["research/q1_her2_biology/_QUEEN_DIGEST.md", "research/q1_her2_biology/her2_therapeutic_antibodies_adcs_epitopes_trastuzumab_pertuzumab_margetuximab_and_binding_footprints.md"],
        },
      },
      {
        body: (<>A word on numbering, because it matters later. Scientists count HER2’s residues from the start of its full genetic instruction, which includes a 22-residue <G id="signal-peptide">signal</G> tag that is cut off before the protein reaches the surface. Older papers count after the cut. The two systems differ by 22, and mixing them silently ruins a prediction.</>),
        more: {
          title: "The 22-residue offset", facts: [7, 6],
          lead: <>The challenge’s own numbering includes the signal peptide. Chapter 8 lets you slide the offset and watch a perfect prediction miss.</>,
          src: ["research/q4_challenge_intelligence/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch2", n: 2, title: "What a nanobody is, and where it grabs", figTitle: "Antibody versus nanobody",
    figCap: <>A Y-shaped <G id="antibody">antibody</G> has two heavy and two light chains. A <G id="vhh">VHH</G> keeps only the single grabbing domain, with three <G id="cdr">CDR</G> loops on a <G id="framework">framework</G>.</>,
    paras: [
      {
        body: (<>Humans make antibodies shaped like a Y, built from two heavy and two light protein chains. Camels, llamas and alpacas also make a second, simpler kind with heavy chains only (<G id="heavy-chain-only-antibody">heavy-chain-only antibodies</G>). Its antigen-grabbing end, a single small domain, is called a <G id="vhh">VHH</G>, or <G id="nanobody">nanobody</G>. It is small, stable, and easy to produce in bacteria. Four medicines built from nanobody parts have been approved since 2018, though none targets HER2.</>),
        more: {
          title: "Nanobody medicines and the alpaca toolkit", facts: [64, 63],
          lead: <>The alpaca immune system draws on a menu of germline genes that it then mutates; this is why nanobody sequences are so varied.</>,
          src: ["research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md", "research/q2_vhh_immunology_structure/nanobody_therapeutics_and_engineering_history_caplacizumab_to_bispecifics.md"],
        },
      },
      {
        body: (<>The part of the nanobody that touches its target is the <G id="paratope">paratope</G>. The patch on the target it touches is the <G id="epitope">epitope</G>. A nanobody has three hypervariable loops named <G id="cdr1">CDR1</G>, <G id="cdr2">CDR2</G> and <G id="cdr3">CDR3</G> (complementarity-determining regions), held in place by a steadier scaffold called the <G id="framework">framework</G>. The third loop, CDR3, is the star: in a large survey it held 46 percent of the nanobody residues that touch the target. But the scaffold is not idle. About 24 percent of contacts fall outside the three loops, mostly at four framework positions.</>),
        more: {
          title: "Where the contacts fall", facts: [57, 58],
          lead: <>Toggle the figure to “Who touches the target” to see the two bars.</>,
          src: ["research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md"],
          nested: { title: "A real nanobody on HER2 in 3D", body: <><p>5MY6 is HER2 with the nanobody 2Rs15d, binding domain I, solved at 2.25 angstroms.</p><LazyViewer pdb="5MY6" label="Load 5MY6 in 3D" caption="PDB 5MY6, fetched at runtime from RCSB." /></> },
        },
      },
      {
        body: (<>This gives a first practical lesson. Guessing the nanobody half of an interface is comparatively easy, because the loops are predictable. Guessing which part of HER2 gets touched is hard, because HER2 is big and each nanobody can land somewhere different. Only four public pictures of nanobodies on HER2 exist, and none of the three mystery nanobodies in the contest has a loop-3 sequence within 70 percent identity of any of them, so nobody can copy a published answer.</>),
        more: {
          title: "The three mystery nanobodies", facts: [49, 61, 9, 10],
          lead: <>ONU13 has a 12-residue CDR3; ONU23 has a 20-residue one and is the hardest case for structure predictors.</>,
          src: ["research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch3", n: 3, title: "How the experiment makes its labels, and where it bends the truth", figTitle: "Phage display: fishing for binders",
    figCap: <>Step through <G id="phage-display">phage display</G> and <G id="biopanning">biopanning</G>. Sticky <G id="phage">phages</G> are kept, loose ones washed off, then <G id="ngs">sequencing</G> counts them.</>,
    paras: [
      {
        body: (<>The training data come from a chain of laboratory steps. First, an alpaca is injected with human HER2 so that its immune system makes antibodies against it (<G id="immunisation">immunisation</G>). Second, the genes for the animal’s nanobodies are copied into viruses that infect bacteria (<G id="phage">phages</G>), each virus displaying one nanobody on its surface. This is <G id="phage-display">phage display</G>. Third, the viruses are poured over HER2 stuck to a surface, the loose ones are washed off, and the sticky ones are recovered. That fishing step is <G id="biopanning">biopanning</G>, and here it was done for just one round. Fourth, the genes before and after fishing are read by <G id="ngs">next-generation sequencing</G> (NGS), which yields counts of each sequence.</>),
        more: {
          title: "Why only one round matters", 
          lead: <>More rounds would let strong binders dominate and weak ones fade, giving cleaner labels. With one round, the before-versus-after change in a clone’s share is a hint, not proof. Chapter 7 returns to this.</>,
          src: ["research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>The resulting table holds 1,843,875 distinct nanobody sequences, of which 19,367 carry a label: 7,316 “Yes” and 12,051 “Not”. A sequence earns “Yes” when its share of the reads rose after fishing and a simple statistical test (a <G id="chi-squared">chi-squared test</G>, essentially asking whether the rise is bigger than chance) gave <G id="p-value">p</G> at or below 0.05. This is a hint of stickiness, not proof. Only 49.5 percent of the “Yes” sequences were confirmed in a repeat, and 59 percent had no reads at all in the starting pool. Crucially, a “Yes” says nothing about where on HER2 the nanobody grips.</>),
        more: {
          title: "The label table in numbers", facts: [13, 14, 15, 16, 17, 18],
          lead: <>These counts are the “AVIDa-hHER2” table. They describe which nanobodies are sticky, not which HER2 residues they touch.</>,
          src: ["research/q7_data_representation_integration/_QUEEN_DIGEST.md"],
          nested: { title: "How trustworthy are the labels?", body: <><p>Two error estimates below are assumption-derived, so treat them as ranges, not measurements.</p><FactList ids={[22, 23, 24, 19, 20]} /></> },
        },
      },
      {
        body: (<>The answer key for judging is different: a <G id="cryo-em">cryo-EM</G> picture (a flash-frozen sample imaged by electron microscope) of each complex at roughly 3 <G id="angstrom">angstroms</G> <G id="resolution">resolution</G>, turned into a list of residues that touch. At that sharpness some residues cannot be placed: one public nanobody-HER2 picture at 3.06 angstroms had only 510 of 752 deposited residues modelled.</>),
        more: {
          title: "Even the answer key is fuzzy", facts: [65, 66, 67],
          lead: <>Because the truth is itself noisy, a perfect predictor cannot score 1.</>,
          src: ["research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch4", n: 4, title: "The challenge and the score, in plain words", figTitle: "Why random guessing scores so low",
    figCap: <>Each dot is a HER2 residue. Only the lit few touch the nanobody, so a random guess scores near that share on the <G id="pr-auc">PR-AUC</G> measure.</>,
    paras: [
      {
        body: (<>SEPIQ (a London organisation, with the company <G id="cognano">COGNANO</G> supplying data and the docking-challenge group <G id="capri">CAPRI</G> involved) asks teams to predict, for three held-out complexes named <G id="onu11">ONU11</G>, <G id="onu13">ONU13</G> and <G id="onu23">ONU23</G>, which HER2 residues and which nanobody residues touch. In <G id="track-a">Track A</G>, each team files one spreadsheet per complex giving a probability from 0 to 1 for every residue. The window runs from 2026-09-01 to 2026-10-31; the organisers announce results on 2026-12-15, and up to five submissions per team are allowed. Prizes are $3,000, $2,000 and $1,000.</>),
        more: {
          title: "The rules in numbers", facts: [0, 1, 3, 4, 5, 8],
          lead: <>The home page of the challenge still says seven complexes; the hive checked and found three.</>,
          src: ["research/q4_challenge_intelligence/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>The score is <G id="pr-auc">PR-AUC</G>, the area under a curve that trades <G id="precision">precision</G> (of the residues you flag, how many are right) against <G id="recall">recall</G> (of the true ones, how many you found). It is computed for each complex and averaged over the three (<G id="macro-average">macro average</G>). Because only about 3 to 5 percent of HER2 residues touch the nanobody (the <G id="base-rate">base rate</G>), random guessing scores near 0.03 to 0.05 on the HER2 side, and a perfect predictor still falls short of 1 because the true answer is itself fuzzy, topping out near 0.92 to 0.97.</>),
        more: {
          title: "Base rate, random score and ceiling", facts: [43, 69, 66],
          lead: <>The brief’s 12.6 percent figure came from a different example (8GZ5); HER2’s own rate is closer to 3 to 5 percent.</>,
          src: ["research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md", "research/q1_her2_biology/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>The organisers’ baseline, a program called <G id="antibinder">AntiBinder</G>, reaches 0.176 on a stand-in test. That sounds respectable, but a shuffled answer scores 0.147 on the same example (a <G id="shuffle-null">shuffle null</G>), and shuffling reaches 0.176 about one time in six. The submission website only checks that the file’s column names are right. It returns no score and shows no leaderboard, so teams cannot learn from their own submissions.</>),
        more: {
          title: "Baseline, shuffle null and the silent portal", facts: [85, 86, 87, 11, 12],
          lead: <>No feedback means the method must be chosen by testing on public practice complexes, not by probing the portal.</>,
          src: ["research/q6_epitope_ml_methods/_QUEEN_DIGEST.md", "research/q4_challenge_intelligence/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch5", n: 5, title: "Before, after, and the big picture", figTitle: "How blind contests move fields",
    figCap: <>Blind contests such as <G id="casp">CASP</G> and <G id="capri">CAPRI</G> have driven leaps. Switch to see why antibodies stay hard.</>,
    paras: [
      {
        body: (<>Blind prediction contests have a long history. The protein-folding contest <G id="casp">CASP</G> showed how fields leap: the precision of predicted residue contacts roughly doubled to 47 percent in 2016 when scientists fed in evolutionary co-variation (<G id="coevolution">coevolution</G>), exceeded 70 percent in 2018, and in 2020 <G id="alphafold2">AlphaFold2</G> reached a median accuracy score of 92.4 (two different statistics, so not a like-for-like pair). The docking contest <G id="capri">CAPRI</G> had run 54 rounds and 230 targets by 2022. Yet antibodies and nanobodies stay hard: in the 2024 CASP16 round, the best group got above 60 percent of antibody targets acceptable with heavy sampling while a typical group managed about a quarter, and for the one nanobody target no group, AlphaFold-Multimer and AlphaFold3 included, was acceptable.</>),
        more: {
          title: "Milestones in numbers", facts: [96, 97, 98],
          lead: <>The same milestones appear on the timeline at the foot of this page.</>,
          src: ["research/q9_serendipity_cross_domain/casp_history_what_actually_changed_the_field_data_representation_msa_end_to_end.md", "research/q4_challenge_intelligence/capri_dockq_capri_q_history_of_blind_docking_challenges_and_lessons_for_scoring.md"],
        },
      },
      {
        body: (<>What would a win mean? Not much, say the sceptics, and they have arithmetic on their side. With only three test complexes, a modestly better method beats a rival only 58 to 61 percent of the time; only a gap of at least 0.15 wins reliably, and gaps below roughly 0.1 are mostly noise. A win would still be useful evidence, because the organisers’ “<G id="folding-from-binding">folding from binding</G>” idea (that binding data hold a weak, scalable signal about how molecules fit together) is offered as a hypothesis to be tested. The bigger prize is for medicine: if interfaces could be read from sequence and cheap binding experiments, nanobody discovery for hard targets would speed up.</>),
        more: {
          title: "Why three complexes means luck", facts: [93, 90, 91, 92, 68],
          lead: <>The 0.15 threshold and the 58 to 61 percent figure come from the king’s log and the q4 digest.</>,
          src: ["research/q4_challenge_intelligence/_QUEEN_DIGEST.md", "research/_meta/king_world_KINGLOG.md"],
        },
      },
    ],
  },
  {
    id: "ch6", n: 6, title: "What the field has actually tried", figTitle: "How often the tools get it roughly right",
    figCap: <>Share of 60 nanobody cases where the predicted pose reached a <G id="dockq">DockQ</G> of at least 0.23. Docking bars come from a different test.</>,
    paras: [
      {
        body: (<>Three families of tools exist. The first is “<G id="co-folding">co-folding</G>”: artificial-intelligence programs (<G id="alphafold3">AlphaFold3</G>, <G id="boltz">Boltz</G>, <G id="chai">Chai</G>, <G id="openfold3">OpenFold3</G>) that take both sequences and draw the complex. On 60 nanobody cases AlphaFold3 got a roughly correct pose (a docking-quality score, <G id="dockq">DockQ</G>, of at least 0.23) 31.6 percent of the time with one try, Boltz-1 23.3 percent and Chai-1 15.0 percent. Their own confidence number, <G id="iptm">ipTM</G>, tells good from bad poses only weakly (average precision 0.45).</>),
        more: {
          title: "Co-folding in numbers", facts: [70, 71, 72, 75, 76, 62],
          lead: <>The last two rows show that combining a confidence score with an energy estimate can do better, though that is one study.</>,
          src: ["research/q5_structure_prediction_docking/_QUEEN_DIGEST.md", "research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>The second family is classic <G id="docking">docking</G>, which shuffles two rigid shapes together: one blind test had it right in 20 percent of cases within its top ten. The third family predicts epitopes from the target alone or with <G id="language-model">language models</G>, the same kind of technology behind chatbots, but trained on protein text. The best antigen-only tool, <G id="discotope-3-0">DiscoTope-3.0</G>, scores 0.232 on a test where 6.4 percent of residues are positives, about 3.6 times random. Protein language models give a decent guess for the nanobody half (about 0.69 to 0.77) yet sit near chance for the target half when tested on epitope groups they have not seen (an <G id="roc-auc">AUROC</G> of 0.544, where 0.5 is a coin flip).</>),
        more: {
          title: "Docking and epitope predictors", facts: [73, 74, 80, 81, 82, 83, 84],
          lead: <>Docking jumps to 87.5 percent only when it is told the true interface, which the challenge withholds.</>,
          src: ["research/q5_structure_prediction_docking/_QUEEN_DIGEST.md", "research/q6_epitope_ml_methods/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>A theme runs through all three: no published tool reports a residue-level score for a nanobody-conditioned epitope, so nobody knows what a good number is. A promising trick is to run a co-folding engine many times and keep contacts that repeat (a <G id="consensus">consensus</G>), as a code-breaker keeps patterns that recur across intercepted messages.</>),
        more: {
          title: "Why consensus is the working bet", facts: [51],
          lead: <>The consensus idea is the structure arm of the plan in chapter 9. It has a pre-agreed kill test, so it is not assumed to work.</>,
          src: ["research/_meta/king_infer_KINGLOG.md"],
        },
      },
    ],
  },
  {
    id: "ch7", n: 7, title: "Why the data-representation idea failed, and what survives", figTitle: "Many keys, one lock",
    figCap: <>The sequence table describes many nanobodies against a single HER2, so models learn <G id="clonotype">families</G> rather than the target.</>,
    paras: [
      {
        body: (<>The team’s suspicion was that clever re-packaging of the 1.8 million sequences, rather than a bigger model, might reveal where nanobodies grip HER2. It was tested four ways on the real tables and failed each time. A statistical method from protein evolution (<G id="dca">DCA</G>, which finds residues that co-vary) cannot work here because HER2 is the same in every experiment, so there is nothing for nanobody residues to co-vary with. Looking at near-identical sequence variants as a stand-in for lab mutation scans failed because they differ only at the level of sequencing errors (0.5 to 2 percent per position). Matching a nanobody loop to the surface chemistry of HER2, the way peptide-mimic methods (<G id="mimotope">mimotopes</G>) do, scored 0.081 against 0.083 for a plain surface-exposure guess, with intervals including zero. Finally, repairing noisy labels (called <G id="pu-learning">PU learning</G>, treating “Not” as unknown) lowered held-out accuracy.</>),
        more: {
          title: "The four kills, with numbers", facts: [35, 34, 38, 39, 27, 28, 29],
          lead: <>Four independent tests, each killed the idea. Treat the thesis as closed.</>,
          src: ["research/q7_data_representation_integration/_QUEEN_DIGEST.md", "research/_meta/king_infer_KINGLOG.md"],
          nested: { title: "Pitfall: the tempting 0.991", body: <><p>A pooled enrichment score reaches 0.991 AUROC, but it is circular because the labels were built from the same counts.</p><FactList ids={[32]} /></> },
        },
      },
      {
        body: (<>The reason is simple: one target and one round of fishing means the data show many keys for a single lock. They describe the keys well, and say almost nothing about the lock. A sequence model trained on them mostly learns family relationships, which is why its accuracy (<G id="roc-auc">AUROC</G>) drops from 0.945 to 0.855 once related sequences are kept apart (<G id="grouped-cross-validation">grouped cross-validation</G>).</>),
        more: {
          title: "Random split versus family split", facts: [30, 31],
          lead: <>Use the toggle in the figure to flip between the two numbers.</>,
          src: ["research/q7_data_representation_integration/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>Two things survive. A plain map of which nanobody positions vary a lot scored 0.562 on loop residues, a strong cheap baseline. And one hint remains: trastuzumab depleted ONU13 more than 20-fold but did not deplete ONU11 or ONU23, though which HER2 domain the competing drugs sit on, in this assay, is unverified.</>),
        more: {
          title: "What is left", facts: [36, 33, 89],
          lead: <>The trastuzumab hint is flagged unverified in the hive: treat it as a clue, not a result.</>,
          src: ["research/q7_data_representation_integration/_QUEEN_DIGEST.md", "research/q6_epitope_ml_methods/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch8", n: 8, title: "What can fool us", figTitle: "A numbering slip",
    figCap: <>A perfect prediction with the wrong <G id="signal-peptide">signal-peptide</G> numbering lands on the wrong residues. Slide the offset to 22 to see the miss.</>,
    paras: [
      {
        body: (<>Several traps have already caught people, and the hive found more. The first is the <G id="base-rate">base rate</G>: the brief’s 12.6 percent contact fraction came from a different example, and HER2’s real figure is closer to 3 to 5 percent, so a score that looks low may be fine. The second is numbering: the 22-residue offset, or a count that includes tags that the answer key ignores, can zero a perfect model. The third is <G id="tie">ties</G> and rounding: giving many residues the same score, or rounding, cost about 0.10 in simulation.</>),
        more: {
          title: "Base rate, numbering, ties", facts: [44, 43, 45, 47, 7, 94],
          lead: <>Residue-level scores should be continuous and unrounded, and the numbering checked against the answer key’s convention.</>,
          src: ["research/_meta/king_infer_KINGLOG.md", "research/q8_compute_validation_execution/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>Fourth, the scorer is only partly specified. Whether the two chains are pooled, whether PR-AUC is <G id="average-precision">averaged-precision</G> or a <G id="trapezoid-pr-auc">trapezoid</G> area, and whether the best or the last of five submissions counts can each change the winner: a constant predictor scores about 0.04 under one definition and about 0.52 under another. Fifth, <G id="leakage">leakage</G>: some old HER2 pictures sit inside the training windows of the AI programs (<G id="training-cutoff">training cutoff</G>), so only two entries released on 2025-11-19 serve as clean practice tests. Sixth, labels: enrichment labels mix real binders with <G id="parasitic-clone">parasites</G>, sticky tags and noise, and random train/test splits flatter models by 10 to 45 percent. Seventh, luck itself, as noted, because three test cases amplify any miss.</>),
        more: {
          title: "Scorer, leakage and label traps", facts: [88, 95, 79, 78],
          lead: <>The two clean practice entries are 9MTE and 9MTX, both released after every engine’s training cutoff.</>,
          src: ["research/q6_epitope_ml_methods/_QUEEN_DIGEST.md", "research/q5_structure_prediction_docking/_QUEEN_DIGEST.md", "research/q8_compute_validation_execution/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>Finally, a human failure: a partial upload can leave one or two of the three files committed, and the website will not complain.</>),
        more: {
          title: "The silent portal", facts: [11, 12],
          lead: <>Because the portal only checks column names, the team will verify all three files itself before and after every upload.</>,
          src: ["research/q4_challenge_intelligence/_QUEEN_DIGEST.md"],
        },
      },
    ],
  },
  {
    id: "ch9", n: 9, title: "What we will do", figTitle: "The calendar",
    figCap: <>Dates are planned, and the last upload is set early because the deadline’s time zone is not stated.</>,
    paras: [
      {
        body: (<>Because the site returns no score, we choose the method by testing on public practice complexes, treating those few as sanity checks rather than training material. The plan is deliberately simple and staged. First, an insurance submission built in about two CPU-hours on 2026-10-20: a nanobody-side guess from loop positions and variability, plus a HER2-side guess from surface exposure (<G id="relative-solvent-accessibility">relative solvent accessibility</G>) shrunk toward the 3-5 percent base rate (<G id="shrinkage">shrinkage</G>). Second, a structure-based arm: run several co-folding programs many times on the three nanobodies and the two clean practice complexes, count how often each residue pair touches, and shrink uncertain residues toward the base rate. The estimate is about 14 GPU-hours on public university cluster partitions, within a two-GPU cap, and every timing so far is an extrapolation until measured.</>),
        more: {
          title: "Compute and its limits", facts: [77, 100, 12],
          lead: <>The GPU-hour figure is an extrapolation, labelled low or medium confidence in the hive. The plan uses only public partitions of the university cluster.</>,
          src: ["research/q8_compute_validation_execution/_QUEEN_DIGEST.md", "research/_meta/king_infer_KINGLOG.md"],
        },
      },
      {
        body: (<>Each idea has a pre-agreed kill test. For example, if the many-run consensus does not beat the simple exposure guess on the clean practice complexes, we drop it. If two candidate arms are within about 0.03 to 0.1, we submit the simpler one. We will not spend GPU time on the sequence-table ideas of chapter 7.</>),
        more: {
          title: "Why those thresholds", facts: [90, 91],
          lead: <>Gaps this small cannot be told apart from noise with only a handful of test complexes, so simplicity wins ties.</>,
          src: ["research/q8_compute_validation_execution/_QUEEN_DIGEST.md", "research/q9_serendipity_cross_domain/_QUEEN_DIGEST.md"],
        },
      },
      {
        body: (<>The calendar is: freeze on 2026-10-28, upload the real candidate on 10-29, keep 10-30 in reserve, and make the last upload by 2026-10-30 06:00 UTC because the deadline’s time zone is unstated. Before then, we will also try to ask the organisers which scoring variant counts.</>),
        more: {
          title: "Deadline facts", facts: [1, 2, 3],
          lead: <>Results are announced 2026-12-15 per the challenge detail page, while the challenge Space says 1 December.</>,
          src: ["research/q8_compute_validation_execution/_QUEEN_DIGEST.md", "research/_meta/king_infer_KINGLOG.md"],
        },
      },
    ],
  },
];

/* --------------------------------------------------------------- timeline */
function toYear(d: string) {
  const p = d.split("-").map(Number);
  return p[0] + ((p[1] || 1) - 1) / 12 + ((p[2] || 1) - 1) / 365;
}
const FIELDS = Array.from(new Set(TL.map((t) => t.field)));
const FCLS = ["f-her2", "f-vhh", "f-amber", "f-good", "f-ink", "f-bad", "f-grey"];

function Timeline() {
  const [field, setField] = useState("All");
  const [sel, setSel] = useState(0);
  const items = useMemo(
    () => TL.filter((t) => field === "All" || t.field === field).map((t) => ({ ...t, yr: toYear(t.date) })).sort((a, b) => a.yr - b.yr),
    [field],
  );
  const lo = Math.floor(Math.min(...items.map((i) => i.yr)) - 0.5);
  const hi = Math.max(Math.ceil(Math.max(...items.map((i) => i.yr)) + 0.5), lo + 2);
  const W = 900, L = 30, R = 30;
  const x = (y: number) => L + ((y - lo) / (hi - lo)) * (W - L - R);
  const cur = items[Math.min(sel, items.length - 1)];
  const ticks: number[] = [];
  const step = hi - lo > 20 ? 5 : hi - lo > 8 ? 2 : 1;
  for (let y = Math.ceil(lo / step) * step; y <= hi; y += step) ticks.push(y);
  const maxCum = items.length;
  return (
    <div>
      <div className="st-tabs" role="tablist" aria-label="Field">
        {["All", ...FIELDS].map((f) => (
          <button key={f} type="button" role="tab" aria-selected={field === f} onClick={() => { setField(f); setSel(0); }}>
            {f}
          </button>
        ))}
      </div>
      <div className="st-tl-scroll">
        <svg viewBox={`0 0 ${W} 250`} width={W} height={250} role="group" aria-label="Timeline of dated milestones">
          <line x1={L} y1={110} x2={W - R} y2={110} className="s-grey" strokeWidth={2} />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} y1={106} x2={x(t)} y2={114} className="s-grey" strokeWidth={1} />
              <text x={x(t)} y={128} textAnchor="middle" className="t-sm">{t}</text>
            </g>
          ))}
          {items.map((it, i) => {
            const lane = i % 3;
            const cy = 110 - 22 - lane * 20;
            const on = i === Math.min(sel, items.length - 1);
            return (
              <g key={i} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
                <line x1={x(it.yr)} y1={cy} x2={x(it.yr)} y2={110} className="s-grey" strokeWidth={1} />
                <circle cx={x(it.yr)} cy={cy} r={on ? 8 : 5.5} className={FCLS[FIELDS.indexOf(it.field) % FCLS.length]} stroke={on ? "var(--ink)" : "none"} strokeWidth={2} />
                <circle cx={x(it.yr)} cy={cy} r={13} fill="transparent" tabIndex={0} role="button" aria-label={`${it.date}: ${it.event}`} onFocus={() => setSel(i)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(i)} />
              </g>
            );
          })}
          {/* cumulative milestones */}
          <text x={L} y={156} className="t-sm">milestones recorded so far (a count of dated events in the hive, not the size of the field)</text>
          <polyline
            className="s-vhh"
            strokeWidth={2.5}
            fill="none"
            points={items
              .flatMap((it, i) => [`${x(it.yr)},${236 - (i / Math.max(maxCum, 1)) * 60}`, `${x(it.yr)},${236 - ((i + 1) / Math.max(maxCum, 1)) * 60}`])
              .concat([`${W - R},${236 - 60}`])
              .join(" ")}
          />
          <line x1={L} y1={236} x2={W - R} y2={236} className="s-hair" strokeWidth={1} />
          <text x={W - R} y={248} textAnchor="end" className="t-sm">{maxCum} milestones</text>
        </svg>
      </div>
      {cur && (
        <div className="st-tl-card">
          <div className="st-tl-meta">
            <b>{cur.date}</b> <span>{cur.field}</span> <em className={`st-conf st-conf-${cur.confidence.split("-")[0]}`}>{cur.confidence}</em>
          </div>
          <p>{cur.event}</p>
          <Source path={cur.source_file} />
        </div>
      )}
      {(field === "All" || field === "Nanobody field") && (
        <Drop title="Growth in the nanobody field" summary="19 to 318 VHH-proxy PDB entries and 1 to 15 trials, between 2012 and 2024">
          <svg viewBox="0 0 300 120" role="img" aria-label="Bars comparing 2012 and 2024 for nanobody-proxy PDB entries and clinical trials">
            <text x={0} y={12} className="t-sm">VHH-proxy PDB entries</text>
            <rect x={0} y={16} width={(19 / 318) * 240} height={12} className="f-grey" />
            <text x={(19 / 318) * 240 + 4} y={26} className="t-sm">2012: 19</text>
            <rect x={0} y={32} width={240} height={12} className="f-vhh" />
            <text x={244} y={42} className="t-sm">2024: 318</text>
            <text x={0} y={70} className="t-sm">clinical trials</text>
            <rect x={0} y={74} width={(1 / 15) * 240} height={12} className="f-grey" />
            <text x={(1 / 15) * 240 + 4} y={84} className="t-sm">2012: 1</text>
            <rect x={0} y={90} width={240} height={12} className="f-vhh" />
            <text x={244} y={100} className="t-sm">2024: 15</text>
          </svg>
          <p className="st-figstep">Worker proxy series with medium confidence: these are proxies for field growth, not an official count.</p>
          <Source path="research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md" />
        </Drop>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ before/after */
function BeforeAfter() {
  const cards = [
    {
      k: "Before", tone: "info",
      head: "What we knew going in",
      body: <>Folding contests leapt forward, yet antibody and nanobody docking stayed hard. Only a third of HER2 has ever been seen in contact with a binder, and only four public pictures show a nanobody on HER2.</>,
      facts: [42, 49, 98], src: ["research/q1_her2_biology/_QUEEN_DIGEST.md", "research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md"],
    },
    {
      k: "After", tone: "good",
      head: "What changes once we submit",
      body: <>We file one probability sheet for each of three held-out complexes. The portal gives no score, so the real test arrives with the organisers’ announcement on 2026-12-15. Until then we rely on public practice complexes and pre-agreed kill tests.</>,
      facts: [0, 12, 3], src: ["research/q4_challenge_intelligence/_QUEEN_DIGEST.md"],
    },
    {
      k: "Big picture", tone: "warn",
      head: "Why it matters beyond the prize",
      body: <>With three complexes the result is partly luck, but a clear win would be evidence for the organisers’ “folding from binding” idea. If interfaces can be read from sequence and cheap binding data, nanobody discovery for hard targets gets faster.</>,
      facts: [93, 90], src: ["research/_meta/king_world_KINGLOG.md"],
    },
  ];
  return (
    <section aria-label="Before, after and the big picture" className="st-ba">
      <h2>Before, after and the big picture</h2>
      <div className="st-ba-grid">
        {cards.map((c) => (
          <div key={c.k} className="st-ba-card">
            <Pills items={[{ text: c.k, tone: c.tone as "info" | "good" | "warn" }]} />
            <h3>{c.head}</h3>
            <p>{c.body}</p>
            <Drop title="Numbers behind this">
              <FactList ids={c.facts} />
              <Source path={c.src} />
            </Drop>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */
const CSS = `
.st-glance ul { margin: 0.3rem 0 0; padding-left: 1.2rem; }
.st-glance li { margin: 0.25rem 0; }
.st-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.6rem 0 1.2rem; }
.st-chips a { font-family: var(--font-head); font-size: 0.8rem; text-decoration: none; padding: 0.15rem 0.6rem; border-radius: 999px; border: 1px solid var(--hair); color: var(--ink-2); background: var(--panel); }
.st-chips a[aria-current="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.st-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.st-side { display: none; }
.st-inline { display: block; margin: 0.8rem 0; }
@media (min-width: 900px) {
  .st-grid { grid-template-columns: minmax(0, 1fr) 21rem; }
  .st-side { display: block; position: sticky; top: 5.5rem; order: 2; }
  .st-text { order: 1; min-width: 0; }
  .st-inline { display: none; }
}
.st-chap { scroll-margin-top: 5rem; padding-bottom: 1rem; }
.st-chap h2 { margin-top: 1.8rem; }
.st-num { font-family: var(--font-head); color: var(--her2); font-weight: 700; margin-right: 0.4rem; }
.st-fig { border: 1px solid var(--hair); background: var(--panel); border-radius: 10px; padding: 0.8rem; }
.st-fig svg { display: block; width: 100%; height: auto; max-height: 20rem; }
.st-fig h3 { margin: 0 0 0.4rem; font-size: 1rem; }
.st-figcap { font-size: 0.85rem; color: var(--ink-2); margin: 0.5rem 0 0; line-height: 1.45; }
.st-figstep { font-size: 0.85rem; color: var(--ink-2); margin: 0.4rem 0 0; line-height: 1.4; }
.st-ctl { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
.st-btn { font-family: var(--font-head); font-size: 0.82rem; padding: 0.3rem 0.7rem; border-radius: 999px; border: 1px solid var(--hair); background: var(--bg); color: var(--ink); cursor: pointer; }
.st-btn[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.st-seg { display: inline-flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
.st-seg button { font-family: var(--font-head); font-size: 0.82rem; padding: 0.3rem 0.7rem; border-radius: 999px; border: 1px solid var(--hair); background: var(--bg); color: var(--ink); cursor: pointer; }
.st-seg button[aria-pressed="true"] { background: var(--vhh); color: #fff; border-color: var(--vhh); }
.st-slide { display: block; margin-top: 0.5rem; font-family: var(--font-head); font-size: 0.85rem; }
.st-slide input { width: 100%; accent-color: var(--her2); }
.st-facts { list-style: none; margin: 0.4rem 0; padding: 0; font-size: 0.92rem; }
.st-facts li { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 0.6rem; align-items: baseline; padding: 0.3rem 0; border-bottom: 1px solid var(--hair); }
.st-facts b { font-family: var(--font-head); color: var(--her2); text-align: right; }
.st-conf { font-family: var(--font-head); font-style: normal; font-size: 0.7rem; padding: 0.02rem 0.4rem; border-radius: 999px; border: 1px solid var(--hair); color: var(--ink-3); }
.st-conf-high { color: var(--good); }
.st-conf-low, .st-conf-medium-low { color: var(--amber); }
@media (max-width: 520px) { .st-facts li { grid-template-columns: minmax(0, 1fr) auto; } .st-facts li em { display: none; } }
.st-ba-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
@media (min-width: 760px) { .st-ba-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.st-ba-card { border: 1px solid var(--hair); border-radius: 10px; background: var(--panel); padding: 0.9rem; min-width: 0; }
.st-ba-card h3 { margin-top: 0.6rem; font-size: 1.05rem; }
.st-tabs { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.6rem 0; }
.st-tabs button { font-family: var(--font-head); font-size: 0.8rem; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid var(--hair); background: var(--panel); color: var(--ink); cursor: pointer; }
.st-tabs button[aria-selected="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.st-tl-scroll { overflow-x: auto; border: 1px solid var(--hair); border-radius: 10px; background: var(--panel); max-width: 100%; }
.st-tl-scroll svg { display: block; max-width: none; }
.st-tl-card { border-left: 4px solid var(--her2); background: var(--panel); padding: 0.6rem 1rem; margin: 0.8rem 0; border-radius: 0 8px 8px 0; }
.st-tl-card p { margin: 0.3rem 0; }
.st-tl-meta { font-family: var(--font-head); font-size: 0.85rem; display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: baseline; }
.st-tl-meta span { color: var(--ink-2); }
.f-her2 { fill: var(--her2); } .s-her2 { stroke: var(--her2); }
.f-vhh { fill: var(--vhh); } .s-vhh { stroke: var(--vhh); }
.f-vhh2 { fill: var(--vhh); opacity: 0.55; }
.f-amber { fill: var(--amber); } .f-good { fill: var(--good); } .f-bad { fill: var(--bad); }
.f-ink { fill: var(--ink-2); }
.f-grey { fill: var(--ink-3); } .s-grey { stroke: var(--ink-3); } .s-grey2 { stroke: var(--hair); }
.f-sunk { fill: var(--sunk); } .f-hair { fill: var(--hair); } .s-hair { stroke: var(--hair); } .f-bg { fill: var(--panel); }
svg text { font-family: var(--font-head); fill: var(--ink); }
.t-sm { font-size: 9.5px; fill: var(--ink-2); }
.t-lab { font-size: 11px; font-weight: 600; }
.t-on { font-size: 10px; font-weight: 700; fill: #fff; }
svg line, svg path { stroke-linecap: round; }
.st-flow { stroke-dasharray: 5 4; animation: st-dash 0.9s linear infinite; }
@keyframes st-dash { to { stroke-dashoffset: -9; } }
@media (prefers-reduced-motion: reduce) { .st-flow { animation: none; } svg g, svg rect { transition: none !important; } }
`;

export default function Page() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    document.title = "The story | SEPIQ 2026 Intelligence";
    const els = CH.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(CH.findIndex((c) => c.id === e.target.id));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const Cur = FIGS[active];
  const ch = CH[active];
  return (
    <div>
      <style>{CSS}</style>
      <div className="pagehead">
        <h1>The story</h1>
        <p className="lede">A cancer protein, a camel-family antibody fragment, and a guessing contest with no scoreboard: what is going on, in plain language.</p>
      </div>
      <Callout tone="key" title="In 30 seconds">
        <div className="st-glance">
          <ul>
            <li>The task: for three secret <G id="her2">HER2</G>-<G id="nanobody">nanobody</G> pairs, say which residues touch (probability for each).</li>
            <li>The portal gives no score at all, so we choose our method by testing on public practice structures.</li>
            <li>Only 3 to 5 percent of HER2 residues touch a nanobody, so random guessing scores about 0.03 to 0.05.</li>
            <li>The giant sequence table does not say where on HER2 anything grips. That idea was tested four ways and killed.</li>
            <li>Deadline 2026-10-31. Our plan: a cheap insurance entry first, then a structure-based arm, last upload by 2026-10-30.</li>
          </ul>
          <Source path={["research/q4_challenge_intelligence/_QUEEN_DIGEST.md", "research/q7_data_representation_integration/_QUEEN_DIGEST.md", "research/_meta/king_infer_KINGLOG.md"]} />
        </div>
      </Callout>
      <nav className="st-chips" aria-label="Chapters">
        {CH.map((c, i) => (
          <a key={c.id} href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>{c.n}. {c.title.split(":")[0].split(",")[0]}</a>
        ))}
        <a href="#timeline">Timeline</a>
      </nav>

      <div className="st-grid">
        <aside className="st-side" aria-label="Illustration for the current chapter">
          <div className="st-fig" key={active}>
            <h3>{ch.figTitle}</h3>
            <Cur />
            <p className="st-figcap">{ch.figCap}</p>
          </div>
        </aside>
        <div className="st-text">
          {CH.map((c, i) => {
            const F = FIGS[i];
            return (
              <section key={c.id} id={c.id} className="st-chap" aria-labelledby={`${c.id}-h`}>
                <h2 id={`${c.id}-h`}><span className="st-num">{c.n}</span>{c.title}</h2>
                <div className="st-inline st-fig">
                  <h3>{c.figTitle}</h3>
                  <F />
                  <p className="st-figcap">{c.figCap}</p>
                </div>
                {c.paras.map((p, k) => (
                  <div key={k}>
                    <p>{p.body}</p>
                    <Drop title={p.more.title}>
                      {p.more.lead && <p>{p.more.lead}</p>}
                      {p.more.facts && <FactList ids={p.more.facts} />}
                      {p.more.nested && (
                        <Drop title={p.more.nested.title}>{p.more.nested.body}</Drop>
                      )}
                      {p.more.src && <Source path={p.more.src} />}
                    </Drop>
                  </div>
                ))}
                {c.id === "ch5" && <BeforeAfter />}
              </section>
            );
          })}
        </div>
      </div>

      <section id="timeline" className="st-chap" aria-labelledby="timeline-h">
        <h2 id="timeline-h">How each field grew: an interactive timeline</h2>
        <p>Pick a field, then tap a marker for the event, its confidence rating and the hive file it came from. Dates marked low or medium confidence come from search snippets or single sources.</p>
        <Timeline />
      </section>
    </div>
  );
}
