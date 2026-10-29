"use client";
import { useDeferredValue, useMemo, useState } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Callout from "@/components/Callout";
import Source from "@/components/Source";
import s from "./assay.module.css";

const G = GlossaryTerm;
const pct = (x: number, d = 1) => (100 * x).toFixed(d) + "%";

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
}
type Item = { sc: number; y: number };

/** average precision: mean of precision at each positive's rank */
function ap(items: Item[]): number {
  const a = items.slice().sort((p, q) => q.sc - p.sc);
  let tp = 0, sum = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i].y) { tp++; sum += tp / (i + 1); }
  }
  return tp ? sum / tp : NaN;
}
function makeSet(r: () => number, n: number, prev: number, d: number): Item[] {
  const out: Item[] = [];
  for (let i = 0; i < n; i++) {
    const y = r() < prev ? 1 : 0;
    out.push({ y, sc: gauss(r) + (y ? d : 0) });
  }
  return out;
}
function quant(v: number[], q: number) {
  const a = v.filter((x) => !Number.isNaN(x)).sort((x, y) => x - y);
  if (!a.length) return NaN;
  return a[Math.min(a.length - 1, Math.max(0, Math.round(q * (a.length - 1))))];
}
// Phi via erf approximation
function phi(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

const NAMES = ["ONU11", "ONU13", "ONU23"];

export default function PrAucLab() {
  // part A: single curve
  const [prev, setPrev] = useState(0.04);
  const [prec, setPrec] = useState(0.5);
  const [rec, setRec] = useState(0.3);
  // part B/C
  const [prevs, setPrevs] = useState<[number, number, number]>([0.03, 0.04, 0.05]);
  const [d, setD] = useState(1.0);
  const [nres, setNres] = useState(620);
  const [mode, setMode] = useState<"fresh" | "boot">("fresh");

  const A = useMemo(() => {
    // piecewise-linear PR curve through (0,1), (rec, prec), (1, prev)
    const area = (rec * (1 + prec)) / 2 + ((1 - rec) * (prec + prev)) / 2;
    return { area, lift: area / prev };
  }, [prev, prec, rec]);

  const dPrevs = useDeferredValue(prevs);
  const dD = useDeferredValue(d);
  const dN = useDeferredValue(nres);

  const sim = useMemo(() => {
    const REPS = 150;
    const macros: number[] = [];
    const pooled: number[] = [];
    if (mode === "fresh") {
      const r = rng(20261017);
      for (let k = 0; k < REPS; k++) {
        const sets = dPrevs.map((p) => makeSet(r, dN, p, dD));
        const aps = sets.map(ap);
        if (aps.some((x) => Number.isNaN(x))) continue;
        macros.push((aps[0] + aps[1] + aps[2]) / 3);
        pooled.push(ap(sets.flat()));
      }
    } else {
      const r = rng(20261017);
      const base = dPrevs.map((p) => makeSet(r, dN, p, dD));
      const rb = rng(7);
      for (let k = 0; k < REPS; k++) {
        const sets = base.map((b) => Array.from({ length: b.length }, () => b[Math.floor(rb() * b.length)]));
        const aps = sets.map(ap);
        if (aps.some((x) => Number.isNaN(x))) continue;
        macros.push((aps[0] + aps[1] + aps[2]) / 3);
        pooled.push(ap(sets.flat()));
      }
    }
    const mean = (v: number[]) => v.reduce((x, y) => x + y, 0) / (v.length || 1);
    return {
      macros,
      mMean: mean(macros),
      lo: quant(macros, 0.025),
      hi: quant(macros, 0.975),
      pMean: mean(pooled),
      chanceMacro: (dPrevs[0] + dPrevs[1] + dPrevs[2]) / 3,
      auroc: phi(dD / Math.SQRT2),
    };
  }, [dPrevs, dD, dN, mode]);

  // chart A
  const W = 360, H = 220, L = 36, B = 28, T = 10, Rr = 10;
  const cx = (v: number) => L + v * (W - L - Rr);
  const cy = (v: number) => T + (1 - v) * (H - T - B);
  const curve = `M${cx(0)},${cy(1)} L${cx(rec)},${cy(prec)} L${cx(1)},${cy(prev)}`;

  // chart C histogram
  const bins = 24;
  const hmax = Math.max(0.3, ...sim.macros) * 1.02;
  const counts = Array(bins).fill(0) as number[];
  for (const m of sim.macros) counts[Math.min(bins - 1, Math.floor((m / hmax) * bins))]++;
  const cmax = Math.max(1, ...counts);
  const HW = 560, HH = 170, HL = 10, HB = 28, HT = 10;
  const hx = (v: number) => HL + (v / hmax) * (HW - HL - 10);
  const bw = (HW - HL - 10) / bins;

  return (
    <div>
      <div className={s.tool}>
        <h3 style={{ marginTop: 0 }}>A. Chance level and a toy precision-recall curve</h3>
        <p>
          <G>PR-AUC</G> is the area under a curve of <G>precision</G> (how many flagged residues are real) against <G>recall</G> (how many real ones were found). A predictor that guesses at random scores about the <G>prevalence</G> (share of residues that truly touch). Set a predictor by saying: &quot;at recall R, my precision is P&quot;.
        </p>
        <div className={s.ctl}>
          <label htmlFor="a-prev">Prevalence of true contact residues <b>{pct(prev)}</b></label>
          <input id="a-prev" type="range" min={0.01} max={0.35} step={0.005} value={prev} onChange={(e) => setPrev(+e.target.value)} />
        </div>
        <div className={s.ctl}>
          <label htmlFor="a-rec">Recall reached at the fixed-precision point <b>{pct(rec, 0)}</b></label>
          <input id="a-rec" type="range" min={0.05} max={0.95} step={0.05} value={rec} onChange={(e) => setRec(+e.target.value)} />
        </div>
        <div className={s.ctl}>
          <label htmlFor="a-prec">Precision at that point <b>{pct(prec, 0)}</b></label>
          <input id="a-prec" type="range" min={0.05} max={1} step={0.05} value={prec} onChange={(e) => setPrec(+e.target.value)} />
        </div>
        <div className={s.grid} aria-live="polite">
          <div className={s.stat}><div className={`${s.v} ${s.vhh}`}>{A.area.toFixed(3)}</div><div className={s.l}>toy-curve PR-AUC</div></div>
          <div className={s.stat}><div className={`${s.v} ${s.amber}`}>{prev.toFixed(3)}</div><div className={s.l}>chance PR-AUC (equals prevalence)</div></div>
          <div className={s.stat}><div className={`${s.v} ${s.her2}`}>{A.lift.toFixed(1)}x</div><div className={s.l}>lift over chance</div></div>
        </div>
        <svg className={s.svg} style={{ maxWidth: 420 }} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Precision-recall curve with chance line">
          <rect x={L} y={T} width={W - L - Rr} height={H - T - B} fill="none" stroke="var(--hair)" />
          <path d={`${curve} L${cx(1)},${cy(0)} L${cx(0)},${cy(0)} Z`} fill="var(--vhh-soft)" opacity="0.7" />
          <line x1={cx(0)} x2={cx(1)} y1={cy(prev)} y2={cy(prev)} stroke="var(--amber)" strokeDasharray="4 3" />
          <path d={curve} fill="none" stroke="var(--vhh)" strokeWidth="2" />
          <circle cx={cx(rec)} cy={cy(prec)} r="4.5" fill="var(--her2)" />
          <text x={cx(0.5)} y={H - 8} textAnchor="middle">recall</text>
          <text x={4} y={T + 8}>precision</text>
          <text x={cx(1)} y={cy(prev) - 4} textAnchor="end" style={{ fill: "var(--amber)" }}>chance</text>
        </svg>
        <p className={s.small}>Toy model: a straight-line curve from (0, 1) through your point to (1, prevalence). It is for building intuition, not a model of any real predictor. The antigen-side chance level in the hive is about 0.03 to 0.05 (HER2 base rate about 3 to 5%), and an estimated 0.2 to 0.3 on the nanobody side.</p>
        <Drop title="Why the same score can mean two things">
          <p>PR-AUC can be computed as average precision (a step sum) or with the trapezoid rule, and the two can differ a lot for weak predictors. The hive notes that a constant predictor scores about 0.04 under one definition and about 0.52 under another. The official choice is not yet confirmed.</p>
        </Drop>
        <Source path={["research/q3_assay_ngs_ground_truth/_QUEEN_DIGEST.md", "hive/EMPEROR.md", "research/_synthesis/narrative.md"]} />
      </div>

      <div className={s.tool}>
        <h3 style={{ marginTop: 0 }}>B and C. Three complexes: averaging and spread</h3>
        <p>
          The contest score is the <G id="macro-average">macro-average</G> of per-complex PR-AUC over the three complexes (<G>ONU11</G>, <G>ONU13</G>, <G>ONU23</G>), not one pooled number. The true prevalences of the three test complexes are not known yet, so the sliders below are hypothetical. This simulation draws scores for a predictor whose true contact residues score higher than the rest by a chosen amount, then shows how much the macro-average moves just from which residues happen to be in the test set.
        </p>
        {NAMES.map((n, i) => (
          <div className={s.ctl} key={n}>
            <label htmlFor={`b-${i}`}>Hypothetical prevalence, {n} <b>{pct(prevs[i])}</b></label>
            <input id={`b-${i}`} type="range" min={0.01} max={0.3} step={0.005} value={prevs[i]} onChange={(e) => { const v = [...prevs] as [number, number, number]; v[i] = +e.target.value; setPrevs(v); }} />
          </div>
        ))}
        <div className={s.ctl}>
          <label htmlFor="c-d">Predictor strength (score gap between contact and non-contact residues, in spreads) <b>{d.toFixed(1)}</b></label>
          <input id="c-d" type="range" min={0} max={3} step={0.1} value={d} onChange={(e) => setD(+e.target.value)} />
        </div>
        <div className={s.ctl}>
          <label htmlFor="c-n">Residues scored per complex (antigen chain; the hive has seen 618, 624 and 630 reported) <b>{nres}</b></label>
          <input id="c-n" type="range" min={100} max={700} step={10} value={nres} onChange={(e) => setNres(+e.target.value)} />
        </div>
        <div className={s.btnrow} role="group" aria-label="Spread method">
          <button type="button" className="btn" aria-pressed={mode === "fresh"} style={mode === "fresh" ? { background: "var(--vhh-soft)", borderColor: "var(--vhh)" } : undefined} onClick={() => setMode("fresh")}>Fresh test sets</button>
          <button type="button" className="btn" aria-pressed={mode === "boot"} style={mode === "boot" ? { background: "var(--vhh-soft)", borderColor: "var(--vhh)" } : undefined} onClick={() => setMode("boot")}>Bootstrap one test set</button>
        </div>
        <div className={s.grid} aria-live="polite">
          <div className={s.stat}><div className={`${s.v} ${s.amber}`}>{sim.chanceMacro.toFixed(3)}</div><div className={s.l}>chance macro PR-AUC (mean of the 3 prevalences)</div></div>
          <div className={s.stat}><div className={`${s.v} ${s.vhh}`}>{sim.mMean.toFixed(3)}</div><div className={s.l}>macro PR-AUC, average over {sim.macros.length} runs</div></div>
          <div className={s.stat}><div className={`${s.v} ${s.her2}`}>{sim.lo.toFixed(2)} to {sim.hi.toFixed(2)}</div><div className={s.l}>95% spread (width {(sim.hi - sim.lo).toFixed(2)})</div></div>
          <div className={s.stat}><div className={s.v}>{sim.pMean.toFixed(3)}</div><div className={s.l}>pooled PR-AUC (all residues together), for contrast</div></div>
        </div>
        <svg className={s.svg} viewBox={`0 0 ${HW} ${HH}`} role="img" aria-label="Histogram of macro PR-AUC across simulated test sets">
          {counts.map((c, i) => (
            <rect key={i} x={HL + i * bw + 1} y={HT + (1 - c / cmax) * (HH - HT - HB)} width={Math.max(1, bw - 2)} height={(c / cmax) * (HH - HT - HB)} fill="var(--vhh)" opacity="0.8" />
          ))}
          <line x1={HL} x2={HW - 10} y1={HH - HB} y2={HH - HB} stroke="var(--hair)" />
          <rect x={hx(sim.lo)} y={HH - HB + 4} width={Math.max(1, hx(sim.hi) - hx(sim.lo))} height={5} fill="var(--her2)" />
          <line x1={hx(sim.chanceMacro)} x2={hx(sim.chanceMacro)} y1={HT} y2={HH - HB} stroke="var(--amber)" strokeDasharray="4 3" />
          <text x={hx(sim.chanceMacro) + 4} y={HT + 10} style={{ fill: "var(--amber)" }}>chance</text>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <text key={f} x={hx(hmax * f)} y={HH - 6} textAnchor="middle">{(hmax * f).toFixed(2)}</text>
          ))}
        </svg>
        <p className={s.small}>
          Bars: how often each macro PR-AUC came up across {sim.macros.length} {mode === "fresh" ? "freshly drawn test sets" : "resamples of one test set"}. Pink bracket: the middle 95%. Implied ranking quality of this predictor: ROC-AUC about {sim.auroc.toFixed(2)}.
        </p>
        <Callout tone="warn" title="Read this as intuition, not as a forecast">
          <p>The scores here are drawn from a simple bell-curve model and the prevalences are hypothetical, so the numbers show how the metric behaves, not what any team will score. The hive&apos;s own simulation on real proxy structures put the confidence interval for a three-complex comparison at about 0.15 to 0.19 wide at residue level, and a complex-level cluster bootstrap can only exclude zero if all three per-complex differences have the same sign.</p>
        </Callout>
        <Drop title="What the controls teach">
          <ul>
            <li>With a strength of 0, the macro score lands on chance, and chance is only about the prevalence. A score of 0.10 means something very different at 4% prevalence than at 25%.</li>
            <li>Positives are few: about {Math.round(nres * (prevs[0] + prevs[1] + prevs[2]) / 3)} per complex at these settings, so a handful of residues moves a complex&apos;s score. Try the residue slider and watch the spread.</li>
            <li>Macro-averaging weights each complex equally, so one complex with a very high or low prevalence moves the average more than it would in a pooled score.</li>
            <li>The hive&apos;s label-noise floor is separate: a perfect predictor scores about 0.92 to 0.97 against a replicate copy of the same complex (4 to 9% of positives flip), so noise caps the very top scores far above the chance levels shown here.</li>
          </ul>
        </Drop>
        <Drop title="Settings used by this simulation">
          <p>Each residue is a contact with probability equal to the complex&apos;s prevalence. Its score is a standard normal draw, plus the gap if it is a contact. Per-complex PR-AUC is average precision. The macro-average is the mean over the three complexes; the pooled score ranks all residues together. 150 runs with a fixed random seed, so sliders move the picture smoothly. The paired cluster bootstrap in the official guideline (B=2000) compares two predictors; this tool shows spread for one.</p>
        </Drop>
        <Source path={["research/q3_assay_ngs_ground_truth/voronota_lt_contact_area_definition_and_how_epitope_labels_depend_on_the_cutoff.md", "BRIEF.md"]} note="Simulation is local to this page; the 618/624/630 chain lengths are an open contradiction in the hive." />
      </div>
    </div>
  );
}
