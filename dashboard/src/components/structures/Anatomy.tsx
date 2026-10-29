"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import StructViewer from "./StructViewer";
import { COL, DATA, ONU, SRC, byId, cdr3Span } from "./shared";
import css from "./structures.module.css";

type Reg = "lead" | "FR1" | "CDR1" | "FR2" | "CDR2" | "FR3" | "CDR3" | "FR4" | "tag";
const REG_COL: Record<Reg, string> = {
  lead: "transparent", FR1: "rgba(150,170,175,0.30)", CDR1: COL.cdr1, FR2: "rgba(150,170,175,0.30)", CDR2: COL.cdr2,
  FR3: "rgba(150,170,175,0.30)", CDR3: COL.cdr3, FR4: "rgba(150,170,175,0.30)", tag: "rgba(240,160,60,0.35)",
};
const PUB = ["5MY6-2Rs15d", "7QVK-NM-02", "9MTE-27A05", "9MTE-47D05", "9MTX-29E09"];

type Item = { key: string; label: string; seq: string; cdr1: [number, number]; cdr2: [number, number]; cdr3: [number, number]; lead: number; contacts?: Record<number, string>; challenge: boolean; };

function items(): Item[] {
  const out: Item[] = ONU.map((o) => ({ key: o.name, label: `${o.name} (challenge)`, seq: o.seq, cdr1: o.cdr1 as [number, number], cdr2: o.cdr2 as [number, number], cdr3: cdr3Span(o.seq) ?? (o.cdr3 as [number, number]), lead: 2, challenge: true }));
  for (const id of PUB) {
    const c = byId(id);
    if (!c.seq || !c.cdr || !c.paraIdx) continue;
    const contacts: Record<number, string> = {};
    (["CDR1", "CDR2", "CDR3", "framework"] as const).forEach((r) => c.paraIdx![r].forEach((p) => (contacts[p] = r)));
    out.push({ key: id, label: `${c.short} (${c.pdb}, public)`, seq: c.seq, cdr1: c.cdr.CDR1 as [number, number], cdr2: c.cdr.CDR2 as [number, number], cdr3: cdr3Span(c.seq) ?? (c.cdr.CDR3 as [number, number]), lead: 0, contacts, challenge: false });
  }
  return out;
}
function regionOf(i: number, it: Item): Reg {
  const n = it.seq.length;
  const tagStart = it.challenge ? n - 6 : (() => { const j = it.seq.indexOf("VTVSS"); return j >= 0 ? j + 5 : n; })();
  if (i <= it.lead) return "lead";
  if (i > tagStart) return "tag";
  if (i < it.cdr1[0]) return "FR1";
  if (i <= it.cdr1[1]) return "CDR1";
  if (i < it.cdr2[0]) return "FR2";
  if (i <= it.cdr2[1]) return "CDR2";
  if (i < it.cdr3[0]) return "FR3";
  if (i <= it.cdr3[1]) return "CDR3";
  return "FR4";
}

export default function Anatomy() {
  const all = useMemo(() => items(), []);
  const [key, setKey] = useState("ONU11");
  const [showFW, setShowFW] = useState(true);
  const [showContacts, setShowContacts] = useState(true);
  const [pick, setPick] = useState<number | null>(null);
  const it = all.find((x) => x.key === key)!;
  const regs = useMemo(() => it.seq.split("").map((_, i) => regionOf(i + 1, it)), [it]);
  const len3 = (x: Item) => x.cdr3[1] - x.cdr3[0] + 1;

  // 3D anatomy scene: 5MY6 nanobody chain only
  const nb = byId("5MY6-2Rs15d");
  const nbSpan = cdr3Span(nb.seq!)!;
  const [r3d, setR3d] = useState({ CDR1: true, CDR2: true, CDR3: true, contacts: true });
  const paint3d = (v: any) => {
    v.setStyle({}, {});
    v.setStyle({ chain: nb.vhh }, { cartoon: { color: "#a9bcbf" } });
    const rng = (a: number, b: number) => { const o: number[] = []; for (let i = a; i <= b; i++) { const r = nb.vhhResi![String(i)]; if (r !== undefined) o.push(r); } return o; };
    if (r3d.CDR1) v.setStyle({ chain: nb.vhh, resi: rng(nb.cdr!.CDR1[0], nb.cdr!.CDR1[1]) }, { cartoon: { color: COL.cdr1 } });
    if (r3d.CDR2) v.setStyle({ chain: nb.vhh, resi: rng(nb.cdr!.CDR2[0], nb.cdr!.CDR2[1]) }, { cartoon: { color: COL.cdr2 } });
    if (r3d.CDR3) v.setStyle({ chain: nb.vhh, resi: rng(nbSpan[0], nbSpan[1]) }, { cartoon: { color: COL.cdr3 } });
    if (r3d.contacts) {
      const all = [...nb.para!.CDR1, ...nb.para!.CDR2, ...nb.para!.CDR3, ...nb.para!.framework];
      v.addStyle({ chain: nb.vhh, resi: all }, { stick: { color: COL.fw, radius: 0.2 } });
    }
  };

  const bars = all.map((x) => ({ k: x.key, label: x.label.split(" (")[0], n: len3(x), ch: x.challenge }));
  const maxN = Math.max(...bars.map((b) => b.n));
  const blocks: number[] = [];
  for (let i = 0; i < it.seq.length; i += 10) blocks.push(i);

  return (
    <div>
      <p>
        A nanobody (<GlossaryTerm id="vhh">VHH</GlossaryTerm>) is a small antibody made of one chain, about 120 letters long. Seven stretches matter: four steady
        <GlossaryTerm id="framework"> framework</GlossaryTerm> stretches that form the fold, and three floppy loops called <GlossaryTerm id="cdr">CDR</GlossaryTerm>1, 2 and 3 that reach out and grip the target. The loop surface that touches the target is the <GlossaryTerm id="paratope">paratope</GlossaryTerm>. CDR3 varies most in length.
      </p>
      <div className={css.panel}>
        <label className={css.note} htmlFor="an-sel">Choose a sequence</label>
        <select id="an-sel" className={css.select} value={key} onChange={(e) => { setKey(e.target.value); setPick(null); }}>
          {all.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
        </select>
        <div className={css.legend} style={{ marginTop: "0.6rem" }}>
          <span><Sw c={COL.cdr1} />CDR1</span><span><Sw c={COL.cdr2} />CDR2</span><span><Sw c={COL.cdr3} />CDR3</span>
          <span><Sw c="rgba(150,170,175,0.5)" />framework</span><span><Sw c="rgba(240,160,60,0.5)" />purification tag</span>
        </div>
        {!it.challenge && (
          <>
            <label className={css.check}><input type="checkbox" checked={showContacts} onChange={(e) => setShowContacts(e.target.checked)} /><span>Underline residues that touch HER2 in the solved structure</span></label>
            <label className={css.check}><input type="checkbox" checked={showFW} onChange={(e) => setShowFW(e.target.checked)} /><span>Include framework contacts in the underline</span></label>
          </>
        )}
        <div className={css.seq} role="group" aria-label={`Sequence of ${it.label}, grouped in tens`}>
          {blocks.map((b) => (
            <span key={b} className={css.seqblock}>
              <span className={css.seqpos}>{b + 1}</span>
              {it.seq.slice(b, b + 10).split("").map((ch, j) => {
                const i = b + j + 1;
                const r = regs[i - 1];
                const touch = !it.challenge && showContacts && it.contacts?.[i] !== undefined && (showFW || it.contacts[i] !== "framework");
                return (
                  <button key={i} type="button" className={css.res} aria-pressed={pick === i} title={`${ch}${i}, ${r}`} onClick={() => setPick(i)}
                    style={{ background: REG_COL[r], color: r.startsWith("CDR") ? "#fff" : undefined, fontWeight: r.startsWith("CDR") ? 700 : 400, textDecoration: touch ? "underline" : undefined, textDecorationThickness: touch ? "2px" : undefined }}>
                    {ch}
                  </button>
                );
              })}
            </span>
          ))}
        </div>
        <p className={css.note}>
          {pick ? `Residue ${it.seq[pick - 1]}${pick}, region ${regs[pick - 1]}.` : "Click a letter to see its position and region."}{" "}
          {it.challenge ? "Challenge numbering is sequential, with 1 = M (the two leading letters M and A are not part of the standard numbering)." : "Numbering here counts from the first modelled residue of the public sequence."}
        </p>
        <div className={css.stat}>
          <div><b>{len3(it)}</b><span>CDR3 letters ({it.seq.slice(it.cdr3[0] - 1, it.cdr3[1])})</span></div>
          <div><b>{it.cdr1[1] - it.cdr1[0] + 1}</b><span>CDR1 letters</span></div>
          <div><b>{it.cdr2[1] - it.cdr2[0] + 1}</b><span>CDR2 letters</span></div>
        </div>
      </div>

      <h3>How long is CDR3?</h3>
      <div className={css.svgwrap}>
        <svg viewBox={`0 0 520 ${bars.length * 24 + 8}`} role="img" aria-label="CDR3 length of each sequence">
          {bars.map((b, i) => (
            <g key={b.k} transform={`translate(0 ${i * 24 + 4})`}>
              <text x={96} y={14} textAnchor="end" fontSize="12" fill="currentColor">{b.label}</text>
              <rect x={104} y={3} width={(b.n / maxN) * 360} height={15} rx={3} fill={b.ch ? COL.cdr3 : COL.gray} />
              <text x={110 + (b.n / maxN) * 360} y={15} fontSize="12" fill="currentColor">{b.n}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className={css.note}>Purple bars are the three challenge nanobodies, grey bars are the public ones. Lengths use one rule for every sequence: from the residue after the cysteine that closes framework 3 up to the tryptophan of W-G-x-G.</p>

      <Drop title="Why CDR3 length decides how hard a nanobody is" summary="The longest loop (ONU23) is the one structure predictors most often get wrong">
        <p>
          From the hive notes: no public nanobody has a CDR3 within 70% identity of the three challenge sequences, so nothing can be copied from the public record. The challenge CDR3s run from 12 letters (ONU13) to 20 (ONU23). Long, kinked
          loops are where structure predictors fail most, so ONU23 is the likeliest to be mis-modelled and ONU13 the safest. ONU11 and ONU23 also carry the Phe/Phe pattern at positions 42 and 52 that is read as a sign of a kinked CDR3. ONU13 sits in between.
          These are predictions from published patterns, not observations of our three targets.
        </p>
        <Source path={[SRC.vhhGeom, "research/q2_vhh_immunology_structure/_QUEEN_DIGEST.md"]} />
      </Drop>
      <Drop title="How the regions were drawn, and how far to trust the borders">
        <p>
          The challenge numbers residues one by one and does not use the standard antibody numbering (<GlossaryTerm id="imgt">IMGT</GlossaryTerm>, <GlossaryTerm id="kabat-numbering">Kabat</GlossaryTerm>). Our region borders for the challenge sequences come from an anchor-rule script (find the conserved cysteines and tryptophans), not from the dedicated numbering software ANARCI. They may be off by one residue in framework 3 and CDR2. Re-running ANARCI is on the to-do list.
          For the public structures, CDR1 and CDR2 borders are the research worker&apos;s IMGT-like anchored ranges.
        </p>
        <Source path={[SRC.vhhGeom, SRC.verbatim]} note="Sequences are verbatim from the challenge pages. The leading MA and trailing HHHHHH are shown but are not antibody." />
      </Drop>

      <h3>The nanobody in 3D</h3>
      <p>
        This is nanobody 2Rs15d (entry 5MY6) on its own. Switch loops on and off, and the yellow sticks are the residues that touch HER2.
      </p>
      <div className={css.panel}>
        {(["CDR1", "CDR2", "CDR3"] as const).map((r) => (
          <label key={r} className={css.check} style={{ display: "inline-flex", marginRight: "1rem" }}>
            <input type="checkbox" checked={r3d[r]} onChange={(e) => setR3d({ ...r3d, [r]: e.target.checked })} />
            <span><Sw c={r === "CDR1" ? COL.cdr1 : r === "CDR2" ? COL.cdr2 : COL.cdr3} />{r}</span>
          </label>
        ))}
        <label className={css.check} style={{ display: "inline-flex" }}>
          <input type="checkbox" checked={r3d.contacts} onChange={(e) => setR3d({ ...r3d, contacts: e.target.checked })} />
          <span><Sw c={COL.fw} />Residues touching HER2</span>
        </label>
      </div>
      <StructViewer pdb="5MY6" height={340} paint={paint3d} sig={JSON.stringify(r3d)} spin caption="Only the nanobody chain is drawn." />
      <Source path={[SRC.complexes]} />
      <p className={css.note}>Data tables in this section cover {DATA.complexes.filter((c) => c.seq).length} public nanobody chains plus the three challenge clones.</p>
    </div>
  );
}
const Sw = ({ c }: { c: string }) => <span className={css.sw} style={{ background: c }} />;
