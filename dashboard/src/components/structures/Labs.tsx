"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import StructViewer, { type Focus } from "./StructViewer";
import { AA3, COL, DATA, SRC, aaAt, byId, covAt, domOf, ranges, type Cx, type Region } from "./shared";
import css from "./structures.module.css";

const ECTO_PDB = "8PWH"; // trastuzumab + pertuzumab + HER2 cryo-EM entry: 624 of 624 ectodomain residues modelled
const ECTO_OFF = -22; // structure number = UniProt number - 22 (mature numbering)
const VHH_IDS = ["5MY6-2Rs15d", "7QVK-NM-02", "9MTE-27A05", "9MTE-47D05", "9MTX-29E09"];
const MAB_IDS = ["8PWH-trastuzumab", "8PWH-pertuzumab"];
const ALL_IDS = [...VHH_IDS, ...MAB_IDS];

function Check({ on, set, children }: { on: boolean; set: (b: boolean) => void; children: React.ReactNode }) {
  return (
    <label className={css.check}>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}
const Sw = ({ c }: { c: string }) => <span className={css.sw} style={{ background: c }} />;

function chainsOf(c: Cx): string[] {
  return c.pdb === "8PWH" ? c.vhh.split("") : [c.vhh];
}
function nm(c: Cx) {
  return c.type === "VHH" ? `${c.short} (${c.pdb})` : `${c.short} (${c.pdb})`;
}
function paintHeat(v: any, chain: string, off: number) {
  v.setStyle({ chain }, { cartoon: { colorfunc: (a: any) => COL.heat[Math.min(covAt(a.resi - off), 5)] } });
}
function paintDomains(v: any, chain: string, off: number) {
  for (const [d, a, b] of DATA.domains) v.setStyle({ chain, resi: `${a + off}-${b + off}` }, { cartoon: { color: COL.dom[d] } });
}
function sel(chain: string, us: number[], off: number) {
  return { chain, resi: us.map((u) => u + off) };
}

function HeatLegend() {
  const names = ["0", "1", "2", "3", "4", "5"];
  return (
    <div className={css.legend}>
      <span>Public antibodies touching a residue:</span>
      {COL.heat.map((c, i) => (
        <span key={i}><Sw c={c} />{names[i]}</span>
      ))}
    </div>
  );
}
function DomLegend() {
  return (
    <div className={css.legend}>
      {DATA.domains.map(([d, a, b]) => (
        <span key={d}><Sw c={COL.dom[d]} />Domain {d} ({a}-{b})</span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ HER2 ectodomain lab */
function EctoLab() {
  const [domains, setDomains] = useState(true);
  const [heat, setHeat] = useState(false);
  const [patch, setPatch] = useState(false);
  const [glyco, setGlyco] = useState(false);
  const [fabs, setFabs] = useState(false);
  const [overlay, setOverlay] = useState<string>("none");
  const [pick, setPick] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [focus, setFocus] = useState<Focus>(null);
  const ov = overlay === "none" ? null : byId(overlay);

  const hot = useMemo(() => {
    const out: number[] = [];
    DATA.covN.forEach((n, i) => { if (n >= 3) out.push(i + 23); });
    return out;
  }, []);
  const chips = ov ? ov.epiV : hot;

  const sig = JSON.stringify([domains, heat, patch, glyco, fabs, overlay, pick]);
  const paint = (v: any) => {
    v.setStyle({}, {});
    if (fabs) {
      v.setStyle({ chain: ["A", "B"] }, { cartoon: { color: COL.tras, opacity: 0.4 } });
      v.setStyle({ chain: ["C", "D"] }, { cartoon: { color: COL.pert, opacity: 0.4 } });
    }
    v.setStyle({ chain: "E" }, { cartoon: { color: COL.gray } });
    if (heat) paintHeat(v, "E", ECTO_OFF);
    else if (domains) paintDomains(v, "E", ECTO_OFF);
    if (patch) v.addStyle(sel("E", DATA.patchUnion, ECTO_OFF), { stick: { color: COL.patch, radius: 0.22 } });
    if (glyco) v.addStyle(sel("E", DATA.glyco, ECTO_OFF), { sphere: { color: "#00b3d6", radius: 1.6 } });
    if (ov) {
      const only = ov.epiV.filter((u) => !ov.epi.includes(u));
      v.addStyle(sel("E", only, ECTO_OFF), { stick: { color: COL.epiV, radius: 0.15 } });
      v.addStyle(sel("E", ov.epi, ECTO_OFF), { stick: { color: COL.epi, radius: 0.24 } });
    }
    if (pick !== null) v.addStyle({ chain: "E", resi: pick + ECTO_OFF }, { sphere: { color: "#ffe600", radius: 1.5 } });
  };
  const click = (u: number) => {
    setPick(u);
    setTick((t) => t + 1);
    setFocus({ chain: "E", resi: u + ECTO_OFF, tick: tick + 1 });
  };
  const bind = pick !== null ? DATA.covBinders.find((x) => x[0] === pick) : null;
  const n0 = DATA.covN.filter((n) => n === 0).length;

  return (
    <div className={css.lab}>
      <div className={css.panel}>
        <h4>Switch layers on and off</h4>
        <Check on={domains} set={setDomains}>Colour the four <GlossaryTerm id="ectodomain">ectodomain</GlossaryTerm> domains (I to IV)</Check>
        <Check on={heat} set={setHeat}>Heat map: how many of 25 public antibodies touch each residue</Check>
        <Check on={patch} set={setPatch}>Dimer patch mask (where HER2&apos;s natural partners sit)</Check>
        <Check on={glyco} set={setGlyco}>Sugar-attachment (<GlossaryTerm id="sequon">sequon</GlossaryTerm>) sites</Check>
        <Check on={fabs} set={setFabs}>Show the two drug antibodies bound in this entry</Check>
        <h4 style={{ marginTop: "0.8rem" }}>Where does an antibody bind?</h4>
        <select className={css.select} value={overlay} onChange={(e) => { setOverlay(e.target.value); setPick(null); }} aria-label="Mark an antibody epitope">
          <option value="none">None (list shows the most-contacted residues)</option>
          {ALL_IDS.map((id) => <option key={id} value={id}>{nm(byId(id))}</option>)}
        </select>
        {ov && <p className={css.note}><Sw c={COL.epi} />4 Å contact residues, <Sw c={COL.epiV} />extra Voronota-LT residues</p>}
      </div>
      <div style={{ minWidth: 0 }}>
        {heat ? <HeatLegend /> : domains ? <DomLegend /> : null}
        <StructViewer
          key={ECTO_PDB}
          pdb={ECTO_PDB}
          height={430}
          paint={paint}
          sig={sig}
          focus={focus}
          caption={<>HER2 from entry {ECTO_PDB} (cryo-EM). Drag to rotate, scroll to zoom.</>}
        />
        <div className={css.panel}>
          <h4>{ov ? `Residues in the ${ov.short} footprint (click one)` : "Residues touched by 3 or more public antibodies (click one)"}</h4>
          <div className={css.chips}>
            {chips.map((u) => (
              <button key={u} type="button" className={css.chip} aria-pressed={pick === u} onClick={() => click(u)} title={`Domain ${domOf(u)}, ${covAt(u)} public antibodies`}>
                {aaAt(u)}{u}
              </button>
            ))}
          </div>
          {pick !== null ? (
            <p className={css.note}>
              Residue {AA3[aaAt(pick)] ?? aaAt(pick)} {pick}, domain {domOf(pick)}, touched by {covAt(pick)} of the 25 public antibodies
              {bind ? `: ${bind[2].join(", ")}` : ""}.
              {DATA.patchUnion.includes(pick) ? " It lies in the dimer patch." : ""}
            </p>
          ) : (
            <p className={css.note}>Pick a residue to fly the camera to it.</p>
          )}
        </div>
        <Drop title="What am I looking at, and what does the heat map really say?" summary="Most of HER2 has never been touched by a public antibody">
          <p>
            This is the outside part (<GlossaryTerm id="ectodomain">ectodomain</GlossaryTerm>) of HER2, residues 23 to 652, 630 in all. The first 22 letters of the full
            protein are a <GlossaryTerm id="signal-peptide">signal peptide</GlossaryTerm>: a shipping label that is cut off before the protein is finished, so it is never in
            any structure. Older structure files also count from the cut point, so their numbers are 22 lower than the standard
            (<GlossaryTerm id="uniprot">UniProt</GlossaryTerm>) numbers used on this page. We convert for you.
          </p>
          <p>
            Across the 25 public binders in our panel, {DATA.covBinders.length} of 630 residues are touched by at least one antibody and {n0} are touched by none. Never-touched does not mean
            unbindable. It means nobody published a structure there, so a model trained on public structures has nothing to learn from.
          </p>
          <Drop title="The dimer patch">
            <p>
              HER2 teams up with relatives (<GlossaryTerm id="egfr">EGFR</GlossaryTerm>, <GlossaryTerm id="her3">HER3</GlossaryTerm>, <GlossaryTerm id="her4">HER4</GlossaryTerm>). The surface that those partners cover in three solved
              pairs is about {DATA.patchUnion.length} residues, mostly in domain II (residues 221 to 351), plus a small rim on domain I. The four public nanobody footprints avoid it, except one residue (105) for 47D05. The
              challenge antigen is probably a single copy, so the patch is likely open. That is an inference, not a verified fact.
            </p>
            <Source path={SRC.dimer} />
          </Drop>
          <Drop title="Where the heat-map numbers come from">
            <p>Counts are from 25 public binder structures. Natural partner footprints are not included in the count. Approved-drug coverage of domains I to III is undercounted because several clinical antibodies have no public structure.</p>
            <Source path={[SRC.coverage, SRC.therapeutic]} />
          </Drop>
        </Drop>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ complex lab (nanobodies / drug antibodies) */
function ComplexLab({ ids, kind }: { ids: string[]; kind: "vhh" | "mab" }) {
  const [id, setId] = useState(ids[0]);
  const [domains, setDomains] = useState(true);
  const [epi, setEpi] = useState(true);
  const [epiV, setEpiV] = useState(false);
  const [regs, setRegs] = useState<Record<Region, boolean>>({ CDR1: true, CDR2: true, CDR3: true, framework: true });
  const [patch, setPatch] = useState(false);
  const [heat, setHeat] = useState(false);
  const [both, setBoth] = useState(false);
  const [pick, setPick] = useState<{ side: "her" | "vhh"; n: number } | null>(null);
  const [focus, setFocus] = useState<Focus>(null);
  const [tick, setTick] = useState(0);
  const c = byId(id);
  const mates = DATA.complexes.filter((x) => x.pdb === c.pdb && x.id !== c.id);
  const overlapPatch = c.epiV.filter((u) => DATA.patchUnion.includes(u));

  const sig = JSON.stringify([id, domains, epi, epiV, regs, patch, heat, both, pick]);
  const paint = (v: any) => {
    v.setStyle({}, {});
    const her = c.her;
    v.setStyle({ chain: her }, { cartoon: { color: COL.gray } });
    if (heat) paintHeat(v, her, c.off);
    else if (domains) paintDomains(v, her, c.off);
    if (patch) v.addStyle(sel(her, DATA.patchUnion, c.off), { stick: { color: COL.patch, radius: 0.2 } });
    // partner(s)
    for (const m of mates) for (const ch of chainsOf(m)) {
      const base = kind === "mab" ? (ch === "A" || ch === "B" ? COL.tras : COL.pert) : "#9fb0b2";
      v.setStyle({ chain: ch }, { cartoon: { color: base, opacity: kind === "mab" ? (both ? 0.9 : 0.3) : 0.35 } });
    }
    const mine = chainsOf(c);
    for (const ch of mine) {
      const base = kind === "mab" ? (c.short === "trastuzumab" ? COL.tras : COL.pert) : "#8fd0d3";
      v.setStyle({ chain: ch }, { cartoon: { color: base } });
    }
    const shown = [c, ...(kind === "mab" && both ? mates : [])];
    for (const s of shown) {
      if (epiV) v.addStyle(sel(her, s.epiV.filter((u) => !s.epi.includes(u)), c.off), { stick: { color: COL.epiV, radius: 0.15 } });
      if (epi) v.addStyle(sel(her, s.epi, c.off), { stick: { color: kind === "mab" && both ? (s.short === "trastuzumab" ? COL.tras : COL.pert) : COL.epi, radius: 0.24 } });
    }
    if (kind === "vhh" && c.cdr && c.para && c.vhhResi) {
      const ch = c.vhh;
      const col: Record<Region, string> = { CDR1: COL.cdr1, CDR2: COL.cdr2, CDR3: COL.cdr3, framework: COL.fw };
      (["CDR1", "CDR2", "CDR3"] as const).forEach((r) => {
        if (!regs[r]) return;
        const [a, b] = c.cdr![r];
        const loop: number[] = [];
        for (let i = a; i <= b; i++) { const rr = c.vhhResi![String(i)]; if (rr !== undefined) loop.push(rr); }
        if (loop.length) v.setStyle({ chain: ch, resi: loop }, { cartoon: { color: col[r] } });
        if (c.para![r].length) v.addStyle({ chain: ch, resi: c.para![r] }, { stick: { color: col[r], radius: 0.22 } });
      });
      if (regs.framework && c.para.framework.length) v.addStyle({ chain: ch, resi: c.para.framework }, { stick: { color: COL.fw, radius: 0.22 } });
    }
    if (pick) {
      const chain = pick.side === "her" ? c.her : c.vhh;
      const resi = pick.side === "her" ? pick.n + c.off : pick.n;
      v.addStyle({ chain, resi }, { sphere: { color: "#ffe600", radius: 1.5 } });
    }
  };
  const go = (side: "her" | "vhh", n: number) => {
    setPick({ side, n });
    const t = tick + 1;
    setTick(t);
    setFocus({ chain: side === "her" ? c.her : c.vhh, resi: side === "her" ? n + c.off : n, tick: t });
  };
  const paraList: { r: Region; idx: number; resi: number }[] = [];
  if (c.paraIdx && c.para) (["CDR1", "CDR2", "CDR3", "framework"] as const).forEach((r) => c.paraIdx![r].forEach((idx, k) => paraList.push({ r, idx, resi: c.para![r][k] ?? c.vhhResi?.[String(idx)] ?? idx })));

  const pickInfo = pick && pick.side === "her" ? { u: pick.n, a: c.area[String(pick.n)] } : null;

  return (
    <div className={css.lab}>
      <div className={css.panel}>
        <h4>{kind === "vhh" ? "Pick a nanobody" : "Pick a drug antibody"}</h4>
        <select className={css.select} value={id} onChange={(e) => { setId(e.target.value); setPick(null); }} aria-label="Choose a complex">
          {ids.map((x) => <option key={x} value={x}>{nm(byId(x))}</option>)}
        </select>
        <h4 style={{ marginTop: "0.8rem" }}>Layers</h4>
        <Check on={domains} set={setDomains}>HER2 domain colours</Check>
        <Check on={epi} set={setEpi}><GlossaryTerm id="epitope">Epitope</GlossaryTerm> residues (4 Å contact) <Sw c={kind === "mab" && both ? COL.tras : COL.epi} /></Check>
        <Check on={epiV} set={setEpiV}>Wider <GlossaryTerm id="voronota-lt">Voronota-LT</GlossaryTerm> footprint <Sw c={COL.epiV} /></Check>
        {kind === "vhh" && c.paraIdx ? (
          <>
            <Check on={regs.CDR1} set={(b) => setRegs({ ...regs, CDR1: b })}><GlossaryTerm id="cdr1">CDR1</GlossaryTerm> loop and its contacts <Sw c={COL.cdr1} /></Check>
            <Check on={regs.CDR2} set={(b) => setRegs({ ...regs, CDR2: b })}><GlossaryTerm id="cdr2">CDR2</GlossaryTerm> loop and its contacts <Sw c={COL.cdr2} /></Check>
            <Check on={regs.CDR3} set={(b) => setRegs({ ...regs, CDR3: b })}><GlossaryTerm id="cdr3">CDR3</GlossaryTerm> loop and its contacts <Sw c={COL.cdr3} /></Check>
            <Check on={regs.framework} set={(b) => setRegs({ ...regs, framework: b })}><GlossaryTerm id="framework">Framework</GlossaryTerm> contacts <Sw c={COL.fw} /></Check>
          </>
        ) : null}
        {kind === "mab" && <Check on={both} set={setBoth}>Show both antibodies and both footprints</Check>}
        <Check on={patch} set={setPatch}>Dimer patch mask <Sw c={COL.patch} /></Check>
        <Check on={heat} set={setHeat}>Public-coverage heat map</Check>
      </div>
      <div style={{ minWidth: 0 }}>
        {heat ? <HeatLegend /> : domains ? <DomLegend /> : null}
        <StructViewer
          key={c.pdb}
          pdb={c.pdb}
          fmt={c.fmt}
          height={430}
          paint={paint}
          sig={sig}
          focus={focus}
          caption={<>{c.name}, entry {c.pdb}. {kind === "vhh" ? "Nanobody in teal tones, HER2 in grey or domain colours." : "Fab chains in orange (trastuzumab) and violet (pertuzumab)."}</>}
        />
        <div className={css.stat}>
          <div><b>{c.res} Å</b><span>{c.method === "ELECTRON MICROSCOPY" ? "cryo-EM" : "X-ray"} detail, released {c.date}</span></div>
          <div><b>{c.nepi}</b><span>epitope residues at 4 Å ({(c.frac * 100).toFixed(1)}% of 630)</span></div>
          <div><b>{c.nepiV}</b><span>residues by Voronota-LT</span></div>
          <div><b>{c.doms.join(", ")}</b><span>HER2 domains touched</span></div>
          <div><b>{overlapPatch.length}</b><span>footprint residues inside the dimer patch</span></div>
        </div>
        <div className={css.panel}>
          <h4>HER2 residues in the footprint (click one)</h4>
          <div className={css.chips}>
            {c.epiV.map((u) => (
              <button key={u} type="button" className={css.chip} aria-pressed={pick?.side === "her" && pick.n === u} onClick={() => go("her", u)} title={`Domain ${domOf(u)}; contact area ${c.area[String(u)] ?? "n/a"} square angstrom${c.epi.includes(u) ? "; within 4 Å" : ""}`}>
                {aaAt(u)}{u}{c.epi.includes(u) ? "" : "*"}
              </button>
            ))}
          </div>
          <p className={css.note}>* = only in the wider Voronota-LT footprint, not within 4 Å.{pickInfo ? ` Selected: ${AA3[aaAt(pickInfo.u)]} ${pickInfo.u}, domain ${domOf(pickInfo.u)}, contact area ${pickInfo.a ?? "n/a"} Å².` : ""}</p>
          {paraList.length > 0 && (
            <>
              <h4 style={{ marginTop: "0.7rem" }}>Nanobody residues that touch HER2 (click one)</h4>
              <div className={css.chips}>
                {paraList.map((p) => (
                  <button key={p.r + p.idx} type="button" className={css.chip} aria-pressed={pick?.side === "vhh" && pick.n === p.resi} onClick={() => go("vhh", p.resi)} title={`${p.r}, position ${p.idx} of the sequence`}>
                    {c.seq?.[p.idx - 1]}{p.idx} <span style={{ opacity: 0.7 }}>{p.r === "framework" ? "FR" : p.r}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <Drop title={`About ${c.short}`} summary={kind === "vhh" ? "Where on HER2, and which loops do the work" : "A clinical antibody, for contrast"}>
          {kind === "vhh" ? (
            <p>
              {c.short} binds HER2 {c.doms.length > 1 ? "across domains " + c.doms.join(" and ") : "in domain " + c.doms[0]}. Its contact residues sit in {c.paraIdx ? `CDR1 (${c.paraIdx.CDR1.length}), CDR2 (${c.paraIdx.CDR2.length}), CDR3 (${c.paraIdx.CDR3.length}) and the framework (${c.paraIdx.framework.length})` : "the nanobody"}.
              Notice that framework residues often join in: a nanobody is small, so the supposedly passive scaffold touches the target too.
            </p>
          ) : (
            <p>
              These two drug antibodies bind far from each other. <GlossaryTerm id="trastuzumab">Trastuzumab</GlossaryTerm> grips domain IV. <GlossaryTerm id="pertuzumab">Pertuzumab</GlossaryTerm> grips domains I and II, near the dimerisation surface. They are the best-studied HER2 binders, so
              they dominate the public structure record. Each is a Fab (two protein chains), not a nanobody.
            </p>
          )}
          <p className={css.note}>Footprint residues come from our own contact calculation on the deposited structure. Entry {c.pdb} is fetched live from RCSB, nothing is stored here. Publication DOI {c.doi}.</p>
          {kind === "vhh" && c.id.startsWith("9M") && <p className={css.note}>9MTE and 9MTX were released 2025-11-19, after the challenge training cutoff, so they are leakage-free stand-ins for the hidden test complexes.</p>}
          <Source path={[SRC.complexes, SRC.arch]} note={`Residues are converted to ${c.off === 0 ? "standard" : "this entry's"} numbering (structure number = UniProt number${c.off === 0 ? "" : " minus 22"}). Footprint residues: ${ranges(c.epiV)}.`} />
        </Drop>
      </div>
    </div>
  );
}

export default function Labs() {
  const tabs = [
    { k: "ecto", label: "HER2 ectodomain" },
    { k: "vhh", label: "Four HER2 nanobodies" },
    { k: "mab", label: "Trastuzumab and pertuzumab" },
  ] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("ecto");
  return (
    <div>
      <div className={css.tabs} role="group" aria-label="Choose a 3D scene">
        {tabs.map((t) => (
          <button key={t.k} type="button" className={css.tab} aria-pressed={tab === t.k} onClick={() => setTab(t.k)}>{t.label}</button>
        ))}
      </div>
      {tab === "ecto" && <EctoLab />}
      {tab === "vhh" && <ComplexLab key="vhh" ids={VHH_IDS} kind="vhh" />}
      {tab === "mab" && <ComplexLab key="mab" ids={MAB_IDS} kind="mab" />}
    </div>
  );
}
