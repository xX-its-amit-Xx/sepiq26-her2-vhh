"use client";
import { useMemo, useState } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import s from "./assay.module.css";

const G = GlossaryTerm;

// ln(k!) table
const LF: number[] = [0];
for (let k = 1; k <= 3000; k++) LF.push(LF[k - 1] + Math.log(k));

function pois(k: number, m: number) {
  if (m <= 0) return k === 0 ? 1 : 0;
  return Math.exp(-m + k * Math.log(m) - LF[k]);
}
function window(m: number): [number, number] {
  const w = 8 * Math.sqrt(m) + 8;
  return [Math.max(0, Math.floor(m - w)), Math.min(2900, Math.ceil(m + w))];
}

// Probabilist's Gauss-Hermite, 5 nodes (weights sum to 1)
const GH: [number, number][] = [[0, 0.53333], [1.35563, 0.22208], [-1.35563, 0.22208], [2.85697, 0.011257], [-2.85697, 0.011257]];

/** Probability the two-proportion z-test (one-sided 0.025, increase only, singletons dropped) calls "binder".
 *  lam: expected reads before; fold: true enrichment; N: reads per library; noise: lognormal sigma on the post-panning mean. */
function pCall(lam: number, fold: number, N: number, noise: number): number {
  const nodes = noise > 0 ? GH : ([[0, 1]] as [number, number][]);
  let tot = 0;
  const [a0, a1] = window(lam);
  const p1: number[] = [];
  for (let k = a0; k <= a1; k++) p1.push(pois(k, lam));
  for (const [z, w] of nodes) {
    const m2 = lam * fold * Math.exp(noise * z - (noise * noise) / 2);
    const [b0, b1] = window(m2);
    let acc = 0;
    for (let j = b0; j <= b1; j++) {
      const q2 = pois(j, m2);
      if (q2 < 1e-14) continue;
      const x2 = j === 1 ? 0 : j;
      for (let k = a0; k <= a1; k++) {
        const x1 = k === 1 ? 0 : k;
        if (x2 <= x1) continue;
        const pp = (x1 + x2) / (2 * N);
        const zz = (x2 - x1) / N / Math.sqrt(pp * (1 - pp) * (2 / N));
        if (zz > 1.96) acc += p1[k - a0] * q2;
      }
    }
    tot += w * acc;
  }
  return Math.min(1, tot);
}

const pct = (x: number, d = 1) => (100 * x).toFixed(d) + "%";

export default function EnrichmentSim() {
  const [lam, setLam] = useState(3);
  const [logN, setLogN] = useState(5);
  const [fold, setFold] = useState(10);
  const [noise, setNoise] = useState(0);
  const [prev, setPrev] = useState(0.03);
  const N = Math.round(Math.pow(10, logN));

  const r = useMemo(() => {
    const fpr = pCall(lam, 1, N, noise);
    const pow = pCall(lam, fold, N, noise);
    const ppv = (prev * pow) / (prev * pow + (1 - prev) * fpr || 1);
    return { fpr, pow, ppv };
  }, [lam, N, fold, noise, prev]);

  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = 0.5; x <= 30.01; x += 0.5) pts.push({ x, y: pCall(x, 1, N, noise) });
    return pts;
  }, [N, noise]);

  const W = 560, H = 210, L = 42, R = 10, T = 12, B = 30;
  const ymax = Math.max(0.1, ...curve.map((c) => c.y)) * 1.1;
  const X = (v: number) => L + ((v - 0.5) / 29.5) * (W - L - R);
  const Y = (v: number) => T + (1 - v / ymax) * (H - T - B);
  const path = curve.map((c, i) => `${i ? "L" : "M"}${X(c.x).toFixed(1)},${Y(c.y).toFixed(1)}`).join(" ");
  const combined = lam * (1 + fold);
  const valid = lam * 2 >= 10;
  const fprTone = r.fpr > 0.05 ? s.bad : r.fpr > 0.03 ? s.amber : s.good;

  return (
    <div className={s.tool}>
      <p>
        Pick a clone that did <b>not</b> change at all in the experiment (a true null). Set how many reads it has and see how often the <G>z-test</G> still calls it a &quot;binder&quot;. Then give true binders a real enrichment and see what share of &quot;binder&quot; calls are right.
      </p>
      <div className={s.ctl}>
        <label htmlFor="e-lam">Expected reads of the clone before panning <b>{lam}</b></label>
        <input id="e-lam" type="range" min={0.5} max={30} step={0.5} value={lam} onChange={(e) => setLam(+e.target.value)} />
      </div>
      <div className={s.ctl}>
        <label htmlFor="e-n">Library depth (reads per library) <b>{N.toLocaleString("en-US")}</b></label>
        <input id="e-n" type="range" min={4} max={6} step={0.1} value={logN} onChange={(e) => setLogN(+e.target.value)} />
      </div>
      <div className={s.ctl}>
        <label htmlFor="e-f">Panning stringency, modelled as true-binder fold enrichment <b>{fold}x</b></label>
        <input id="e-f" type="range" min={1.5} max={30} step={0.5} value={fold} onChange={(e) => setFold(+e.target.value)} />
      </div>
      <div className={s.ctl}>
        <label htmlFor="e-s">Extra noise from PCR and phage growth (log-scale spread) <b>{noise.toFixed(2)}</b></label>
        <input id="e-s" type="range" min={0} max={1} step={0.05} value={noise} onChange={(e) => setNoise(+e.target.value)} />
      </div>
      <div className={s.ctl}>
        <label htmlFor="e-p">Share of tested clones that are true binders <b>{pct(prev, 1)}</b></label>
        <input id="e-p" type="range" min={0.005} max={0.3} step={0.005} value={prev} onChange={(e) => setPrev(+e.target.value)} />
      </div>

      <div className={s.grid} aria-live="polite">
        <div className={s.stat}><div className={`${s.v} ${fprTone}`}>{pct(r.fpr, 2)}</div><div className={s.l}>chance a null clone is called a false binder (nominal 2.5%)</div></div>
        <div className={s.stat}><div className={`${s.v} ${s.vhh}`}>{pct(r.pow, 0)}</div><div className={s.l}>chance a true binder is caught</div></div>
        <div className={s.stat}><div className={`${s.v} ${r.ppv < 0.5 ? s.bad : s.good}`}>{pct(r.ppv, 0)}</div><div className={s.l}>of &quot;binder&quot; calls that are real</div></div>
        <div className={s.stat}><div className={`${s.v} ${valid ? s.good : s.amber}`}>{valid ? "valid" : "invalid"}</div><div className={s.l}>{valid ? "test assumptions roughly hold" : "under about 10 combined reads, the test is outside its valid range"} (about {combined.toFixed(0)} reads if a binder)</div></div>
      </div>

      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="False-binder probability versus expected reads">
        <line x1={L} y1={Y(0)} x2={W - R} y2={Y(0)} stroke="var(--hair)" />
        <line x1={L} y1={T} x2={L} y2={Y(0)} stroke="var(--hair)" />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}><line x1={L - 3} x2={L} y1={Y(ymax * f)} y2={Y(ymax * f)} stroke="var(--ink-3)" /><text x={L - 6} y={Y(ymax * f) + 4} textAnchor="end">{(ymax * f * 100).toFixed(0)}%</text></g>
        ))}
        {[1, 5, 10, 15, 20, 25, 30].map((v) => (
          <text key={v} x={X(v)} y={H - 14} textAnchor="middle">{v}</text>
        ))}
        <text x={(W + L) / 2} y={H - 1} textAnchor="middle">expected reads before panning (null clone)</text>
        <line x1={L} x2={W - R} y1={Y(0.025)} y2={Y(0.025)} stroke="var(--amber)" strokeDasharray="4 3" />
        <text x={W - R} y={Y(0.025) - 4} textAnchor="end" style={{ fill: "var(--amber)" }}>nominal 2.5%</text>
        <rect x={X(0.5)} y={T} width={Math.max(0, X(5) - X(0.5))} height={Y(0) - T} fill="var(--amber-soft)" opacity="0.5" />
        <path d={path} fill="none" stroke="var(--her2)" strokeWidth="2" />
        <circle cx={X(lam)} cy={Y(Math.min(ymax, r.fpr))} r="5" fill="var(--vhh)" stroke="var(--bg)" strokeWidth="1.5" />
      </svg>
      <p className={s.small}>The shaded band is where the combined count of a null clone is mostly under 10. The curve is jagged because counts are whole numbers: the smallest possible call is 0 reads before and 4 after.</p>

      <Drop title="How the simulator works, and what it is not">
        <p>For each pair of read counts (before, after) drawn from Poisson distributions, it applies the same rule as the dataset papers: singletons are set to zero, then a two-proportion z-test at one-sided 0.025 (increase only). It sums the probability of every call exactly, with no random sampling. Noise is a lognormal multiplier on the after-panning mean, integrated with five quadrature points.</p>
        <p>It reproduces the hive finding qualitatively (false-binder rates well above 2.5% at about 3 to 4 reads) but it is not a measurement of the real table, which has not been analysed for this. &quot;Stringency&quot; has no sourced mapping to fold enrichment, so that slider is an assumption, not a data-derived relationship.</p>
        <Drop title="Reference numbers from the hive simulation (library of 10^6 clones, 10^5 reads)">
          <div className={s.tblwrap}>
            <table className={s.tbl}>
              <thead><tr><th>min combined reads</th><th>z-test false-binder rate</th><th>Fisher exact rate</th></tr></thead>
              <tbody>
                <tr><td>2</td><td>3.2%</td><td>0.5%</td></tr>
                <tr><td>3</td><td>6.9%</td><td>1.2%</td></tr>
                <tr><td>4</td><td>9.5%</td><td>1.6%</td></tr>
                <tr><td>5</td><td>4.9%</td><td>2.2%</td></tr>
                <tr><td>10</td><td>2.0%</td><td>1.3%</td></tr>
                <tr><td>20</td><td>2.7%</td><td>1.7%</td></tr>
              </tbody>
            </table>
          </div>
          <p className={s.small}>At 1% true-binder prevalence with 10x enrichment and extra noise 0.5, the hive simulation found a 42 to 63% positive predictive value depending on the minimum count.</p>
        </Drop>
      </Drop>
      <Source path="research/q3_assay_ngs_ground_truth/ngs_read_count_statistics_pcr_sequencing_error_singletons_and_enrichment_test_validity.md" note="Simulator code is on this page; reference table is from the hive worker's own simulation." />
    </div>
  );
}
