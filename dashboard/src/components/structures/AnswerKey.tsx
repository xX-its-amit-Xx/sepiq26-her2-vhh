"use client";
import { useMemo, useState } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import { AA3, COL, DATA, SRC, aaAt, byId, domOf, sum } from "./shared";
import css from "./structures.module.css";

const IDS = ["5MY6-2Rs15d", "7QVK-NM-02", "9MTE-27A05", "9MTE-47D05", "9MTX-29E09", "8PWH-trastuzumab", "8PWH-pertuzumab"];

/** "What the answer key looks like": the per-residue contact-area table the challenge scores against, shown for public structures. */
export default function AnswerKey() {
  const [id, setId] = useState(IDS[2]);
  const [cut, setCut] = useState(0);
  const [k, setK] = useState(10);
  const c = byId(id);
  const rows = useMemo(
    () => Object.entries(c.area).map(([u, a]) => ({ u: Number(u), a })).sort((x, y) => x.u - y.u),
    [c],
  );
  const maxA = Math.max(...rows.map((r) => r.a));
  const kept = rows.filter((r) => r.a >= cut);
  const total = sum(rows.map((r) => r.a));
  const keptArea = sum(kept.map((r) => r.a));
  const desc = [...rows].sort((x, y) => y.a - x.a);
  const kk = Math.min(k, desc.length);
  const topShare = total ? sum(desc.slice(0, kk).map((r) => r.a)) / total : 0;

  // strip chart geometry: 630 residues across the width
  const W = 630, H = 90;
  const sx = (u: number) => u - 23;

  return (
    <div>
      <p>
        After the deadline, the organisers compare our guesses with a table made from the real <GlossaryTerm id="cryo-em">cryo-EM</GlossaryTerm> structure. Each HER2 residue that touches the
        nanobody gets a row with a <b>contact area</b> (how many square angstroms of its surface touch the partner, measured with <GlossaryTerm id="voronota-lt">Voronota-LT</GlossaryTerm>). Nanobody residues get rows too. The page below uses
        public structures as stand-ins, because the real keys stay secret until judging. Our table is computed by our own script and will not match the organisers&apos; key exactly.
      </p>
      <div className={css.panel}>
        <label className={css.note} htmlFor="ak-sel">Show the answer-key style table for</label>
        <select id="ak-sel" className={css.select} value={id} onChange={(e) => { setId(e.target.value); setCut(0); }}>
          {IDS.map((x) => <option key={x} value={x}>{byId(x).short} ({byId(x).pdb})</option>)}
        </select>
        <div style={{ marginTop: "0.7rem" }}>
          <label className={css.note} htmlFor="ak-cut">Count a residue as &ldquo;in the interface&rdquo; only if its contact area is at least <b>{cut.toFixed(0)} Å²</b></label>
          <input id="ak-cut" className={css.range} type="range" min={0} max={Math.ceil(maxA)} step={1} value={cut} onChange={(e) => setCut(Number(e.target.value))} />
        </div>
        <div className={css.stat}>
          <div><b>{kept.length}</b><span>interface residues at this cut</span></div>
          <div><b>{((kept.length / 630) * 100).toFixed(1)}%</b><span>of the 630-residue HER2 ectodomain</span></div>
          <div><b>{Math.round(keptArea)} Å²</b><span>area kept ({total ? Math.round((keptArea / total) * 100) : 0}% of all contact area)</span></div>
        </div>
        <div className={css.svgwrap}>
          <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={`Contact area along HER2 for ${c.short}`}>
            {DATA.domains.map(([d, a, b]) => (
              <g key={d}>
                <rect x={sx(a)} y={H + 2} width={b - a + 1} height={9} fill={COL.dom[d]} opacity={0.85} />
                <text x={sx(a) + (b - a) / 2} y={H + 17} textAnchor="middle" fontSize="9" fill="currentColor">{d}</text>
              </g>
            ))}
            <line x1={0} x2={W} y1={H} y2={H} stroke="currentColor" opacity={0.35} />
            {cut > 0 && <line x1={0} x2={W} y1={H - (cut / maxA) * (H - 6)} y2={H - (cut / maxA) * (H - 6)} stroke={COL.patch} strokeDasharray="3 3" />}
            {rows.map((r) => (
              <rect key={r.u} x={sx(r.u) - 0.9} width={2.2} y={H - (r.a / maxA) * (H - 6)} height={(r.a / maxA) * (H - 6)} fill={r.a >= cut ? COL.epi : COL.epiV} opacity={r.a >= cut ? 1 : 0.4}>
                <title>{`${AA3[aaAt(r.u)]} ${r.u}: ${r.a} square angstroms`}</title>
              </rect>
            ))}
          </svg>
        </div>
        <p className={css.note}>Each bar is one HER2 residue along the ectodomain (left is the start). Bar height is contact area, the dashed line is your cut-off. Coloured band: domains I to IV.</p>
        <div className={css.tablewrap} tabIndex={0} aria-label="Answer-key style table">
          <table>
            <thead>
              <tr><th>chain</th><th>seqNum</th><th>resName</th><th>fact</th><th>weight</th><th aria-label="area bar" /></tr>
            </thead>
            <tbody>
              {kept.map((r) => (
                <tr key={r.u}>
                  <td>A</td><td>{r.u}</td><td>{AA3[aaAt(r.u)]}</td><td>1</td><td>{r.a.toFixed(1)}</td>
                  <td style={{ width: "30%" }}><div className={css.bar} style={{ width: `${(r.a / maxA) * 100}%` }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={css.note}>Columns follow the challenge file format: chain, seqNum, resName, fact (1 = interface), weight (contact area in Å²). Chain A is HER2 and chain B is the nanobody. Only the HER2 side is shown here. We show standard UniProt numbers, whereas the real file&apos;s numbering for chain A is not confirmed in our notes.</p>
      </div>
      <Drop title="Why contact area matters for scoring" summary="A few big contacts carry most of the weight">
        <p>
          The area-weighted score rewards finding the residues with the most contact. Slide the number below: with only the biggest few residues, how much of the total area do you already hold?
        </p>
        <label className={css.note} htmlFor="ak-k">Take the <b>{kk}</b> residues with the largest contact area</label>
        <input id="ak-k" className={css.range} type="range" min={1} max={desc.length} step={1} value={kk} onChange={(e) => setK(Number(e.target.value))} />
        <p>
          For {c.short}, the {kk} biggest residues hold <b>{(topShare * 100).toFixed(0)}%</b> of the contact area, from {desc.length} residues in total. These are {desc.slice(0, Math.min(kk, 8)).map((r) => `${aaAt(r.u)}${r.u} (domain ${domOf(r.u)})`).join(", ")}{kk > 8 ? ", and more" : ""}.
        </p>
        <Source path={[SRC.complexes]} note="Per-residue Voronota-LT areas for each public structure." />
      </Drop>
      <Drop title="Why the epitope is a tiny part of HER2" summary="About 3 to 6 residues in every 100">
        <p>
          On the five public nanobody structures, the epitope averages 3.2% of the observed HER2 residues when counted at 4 Å and 5.6% when counted by Voronota-LT. So a guesser that marks every residue as an interface scores
          badly: only a few in a hundred are positives. That low <GlossaryTerm id="base-rate">base rate</GlossaryTerm> is what the score on the leaderboard has to beat.
        </p>
        <Source path={SRC.arch} note="Field base_rate_VHH in the summary file." />
      </Drop>
    </div>
  );
}
