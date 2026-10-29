"use client";
import { useMemo, useState } from "react";
import Callout from "@/components/Callout";
import GlossaryTerm from "@/components/GlossaryTerm";

// SYNTHETIC toy model. No real HER2 or co-folding output is used anywhere in this file.
const L = 630; // residues in the pretend antigen
const P = 25; // pretend true epitope residues (prevalence 3.97%, the middle of the hive's 3-5% range)
const REPEATS = 30;
const MAXN = 50;

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
function normal(r: () => number) {
  const u = Math.max(r(), 1e-12), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function ap(score: Float64Array, truth: Uint8Array) {
  const idx = Array.from({ length: L }, (_, i) => i).sort((a, b) => score[b] - score[a]);
  let tp = 0, sum = 0;
  for (let k = 0; k < L; k++) {
    if (truth[idx[k]]) {
      tp++;
      sum += tp / (k + 1);
    }
  }
  return sum / P;
}

type Curves = { mean: number[]; max: number[]; sdMean: number[]; sdMax: number[] };

function simulate(hit: number, mu: number, roll: number): Curves {
  const mean = new Array(MAXN).fill(0), max = new Array(MAXN).fill(0);
  const m2 = new Array(MAXN).fill(0), x2 = new Array(MAXN).fill(0);
  const r = rng(1234 + roll * 7919);
  for (let rep = 0; rep < REPEATS; rep++) {
    const truth = new Uint8Array(L);
    for (let i = 0; i < P; i++) truth[i] = 1; // positions are arbitrary labels, order does not matter
    const sum = new Float64Array(L), mx = new Float64Array(L).fill(-Infinity), tmp = new Float64Array(L), avg = new Float64Array(L);
    for (let n = 1; n <= MAXN; n++) {
      const right = r() < hit;
      const start = right ? 0 : Math.floor(r() * (L - P));
      for (let i = 0; i < L; i++) {
        const inPatch = right ? i < P : i >= start && i < start + P;
        const s = normal(r) + (inPatch ? mu : 0);
        sum[i] += s;
        if (s > mx[i]) mx[i] = s;
      }
      for (let i = 0; i < L; i++) avg[i] = sum[i] / n;
      tmp.set(mx);
      const a1 = ap(avg, truth), a2 = ap(tmp, truth);
      mean[n - 1] += a1; max[n - 1] += a2;
      m2[n - 1] += a1 * a1; x2[n - 1] += a2 * a2;
    }
  }
  const sd = (s: number, s2: number) => Math.sqrt(Math.max(0, s2 / REPEATS - (s / REPEATS) ** 2));
  return {
    mean: mean.map((v) => v / REPEATS),
    max: max.map((v) => v / REPEATS),
    sdMean: mean.map((v, i) => sd(v, m2[i])),
    sdMax: max.map((v, i) => sd(v, x2[i])),
  };
}

export default function SeedDemo() {
  const [hit, setHit] = useState(0.3);
  const [mu, setMu] = useState(1.5);
  const [n, setN] = useState(20);
  const [roll, setRoll] = useState(0);
  const c = useMemo(() => simulate(hit, mu, roll), [hit, mu, roll]);

  const W = 560, H = 260, pl = 44, pr = 14, pt = 14, pb = 34;
  const x = (k: number) => pl + ((k - 1) / (MAXN - 1)) * (W - pl - pr);
  const ymax = Math.max(0.2, ...c.mean.map((v, i) => v + c.sdMean[i]), ...c.max);
  const y = (v: number) => pt + (1 - v / ymax) * (H - pt - pb);
  const line = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const band = [...c.mean.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)},${y(v + c.sdMean[i]).toFixed(1)}`), ...c.mean.map((v, i) => `L${x(MAXN - i).toFixed(1)},${y(Math.max(0, c.mean[MAXN - 1 - i] - c.sdMean[MAXN - 1 - i])).toFixed(1)}`)].join(" ") + "Z";
  const prev = P / L;
  const ticks = [0, ymax / 2, ymax];

  return (
    <div className="sd">
      <style>{`
        .sd{border:1px solid var(--hair);background:var(--panel);border-radius:8px;padding:1rem;margin:1rem 0}
        .sd-ctl{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.8rem 1.2rem;margin-bottom:.8rem}
        .sd-ctl label{display:block;font-family:var(--font-head);font-size:.85rem;color:var(--ink-2)}
        .sd-ctl input[type=range]{width:100%;accent-color:var(--vhh)}
        .sd svg{width:100%;height:auto;display:block;max-width:100%}
        .sd text{font-family:var(--font-head);font-size:11px;fill:var(--ink-2)}
        .sd-leg{display:flex;flex-wrap:wrap;gap:.3rem 1.2rem;font-family:var(--font-head);font-size:.85rem;margin:.4rem 0}
        .sd-sw{display:inline-block;width:.9rem;height:.25rem;vertical-align:middle;margin-right:.35rem;border-radius:2px}
        .sd-tag{display:inline-block;font-family:var(--font-head);font-size:.75rem;font-weight:700;letter-spacing:.04em;color:var(--amber);border:1px solid var(--amber);border-radius:4px;padding:0 .4rem;margin-bottom:.5rem}
      `}</style>
      <span className="sd-tag">SYNTHETIC DATA - TOY MODEL, NOT HER2 RESULTS</span>
      <div className="sd-ctl">
        <label>
          Chance one run finds the right binding site: <b>{Math.round(hit * 100)}%</b>
          <input type="range" min={0.05} max={0.9} step={0.05} value={hit} onChange={(e) => setHit(+e.target.value)} aria-label="Chance a single run lands on the right site" />
        </label>
        <label>
          How strongly a right guess stands out from noise: <b>{mu.toFixed(1)}</b>
          <input type="range" min={0.5} max={3} step={0.1} value={mu} onChange={(e) => setMu(+e.target.value)} aria-label="Signal strength" />
        </label>
        <label>
          Number of runs combined: <b>{n}</b>
          <input type="range" min={1} max={MAXN} step={1} value={n} onChange={(e) => setN(+e.target.value)} aria-label="Number of seeds combined" />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Average precision against number of runs combined, comparing mean over runs with maximum over runs">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="var(--hair)" />
            <text x={pl - 6} y={y(t) + 4} textAnchor="end">{t.toFixed(2)}</text>
          </g>
        ))}
        <line x1={pl} x2={W - pr} y1={y(prev)} y2={y(prev)} stroke="var(--ink-3)" strokeDasharray="4 4" />
        <text x={W - pr} y={y(prev) - 4} textAnchor="end">random guess = {prev.toFixed(3)}</text>
        <path d={band} fill="var(--vhh)" opacity={0.15} />
        <path d={line(c.max)} fill="none" stroke="var(--her2)" strokeWidth={2.2} />
        <path d={line(c.mean)} fill="none" stroke="var(--vhh)" strokeWidth={2.2} />
        <line x1={x(n)} x2={x(n)} y1={pt} y2={H - pb} stroke="var(--ink)" strokeDasharray="2 3" />
        <circle cx={x(n)} cy={y(c.mean[n - 1])} r={4} fill="var(--vhh)" />
        <circle cx={x(n)} cy={y(c.max[n - 1])} r={4} fill="var(--her2)" />
        {[1, 10, 20, 30, 40, 50].map((k) => (
          <text key={k} x={x(k)} y={H - 14} textAnchor="middle">{k}</text>
        ))}
        <text x={(pl + W - pr) / 2} y={H - 1} textAnchor="middle">runs (seeds) combined</text>
        <text x={12} y={pt + 4}>score</text>
      </svg>
      <div className="sd-leg">
        <span><i className="sd-sw" style={{ background: "var(--vhh)" }} />Mean over runs: <b>{c.mean[n - 1].toFixed(3)}</b> (shaded band is one SD over {REPEATS} repeats)</span>
        <span><i className="sd-sw" style={{ background: "var(--her2)" }} />Max over runs: <b>{c.max[n - 1].toFixed(3)}</b></span>
        <button type="button" className="btn" onClick={() => setRoll((r) => r + 1)}>Re-roll the dice</button>
      </div>
      <Callout tone="key" title="What to see">
        <p>
          Each run is noisy. The mean over runs keeps the part every run agrees on and averages the rest away, so it improves as you add runs, as long as a decent share of runs find the right site. The maximum keeps the single loudest call per residue, so every extra run adds one more lucky false alarm, and it gets worse. Drag the first slider down to see how much the mean still helps when few runs find the site: consensus cannot rescue runs that never find it.
        </p>
      </Callout>
      <p style={{ fontSize: "0.88rem", color: "var(--ink-2)" }}>
        How it is built: a pretend antigen of {L} residues with {P} true <GlossaryTerm>epitope</GlossaryTerm> residues (about 4%, inside the hive&apos;s 3-5% range for HER2). Every run scores every residue as random noise, plus a boost on a patch of {P} residues. With the chance set above the patch is the true epitope; otherwise it is a random wrong patch. The score is <GlossaryTerm>average precision</GlossaryTerm>, averaged over {REPEATS} repeats. The real-world evidence for the same direction is in the table above (Protenix-v1 improves from 36.0% to 47.7% on 1 versus 80 seeds), but this toy model proves nothing about HER2 on its own.
      </p>
    </div>
  );
}
