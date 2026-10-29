"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

// Same pinned 3Dmol build as the shared Viewer3D. This wrapper exists because the labs restyle the model
// on every toggle without re-downloading it, and because some entries (7QVK) only exist as mmCIF on RCSB.
const SRC = "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";
let loader: Promise<any> | null = null;
function load3Dmol(): Promise<any> {
  const w = window as any;
  if (w.$3Dmol) return Promise.resolve(w.$3Dmol);
  if (!loader) {
    loader = new Promise((res, rej) => {
      const existing = document.querySelector(`script[src="${SRC}"]`) as HTMLScriptElement | null;
      const s = existing ?? document.createElement("script");
      s.addEventListener("load", () => res(w.$3Dmol));
      s.addEventListener("error", () => rej(new Error("3Dmol failed to load")));
      if (!existing) {
        s.src = SRC;
        s.async = true;
        document.head.appendChild(s);
      } else if (w.$3Dmol) res(w.$3Dmol);
    });
  }
  return loader;
}

export type Focus = { chain: string; resi: number; tick: number } | null;

/** Restylable 3D view. paint(v) is called after load and whenever sig changes; it must call v.setStyle/addStyle (render is done here). */
export default function StructViewer({
  pdb, fmt = "pdb", height = 420, paint, sig, focus = null, spin = false, caption,
}: {
  pdb: string; fmt?: "pdb" | "cif"; height?: number; paint: (v: any, $3Dmol: any) => void; sig: string; focus?: Focus; spin?: boolean; caption?: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<any>(null);
  const lib = useRef<any>(null);
  const paintRef = useRef(paint);
  useEffect(() => {
    paintRef.current = paint;
  });
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [rot, setRot] = useState(spin);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const $3Dmol = await load3Dmol();
        const r = await fetch(`https://files.rcsb.org/download/${encodeURIComponent(pdb.toUpperCase())}.${fmt}`);
        if (!r.ok) throw new Error(String(r.status));
        const txt = await r.text();
        if (dead || !box.current) return;
        box.current.innerHTML = "";
        const v = $3Dmol.createViewer(box.current, { backgroundAlpha: 0 });
        v.addModel(txt, fmt);
        lib.current = $3Dmol;
        paintRef.current(v, $3Dmol);
        v.zoomTo();
        v.render();
        viewer.current = v;
        setState("ready");
      } catch {
        if (!dead) setState("error");
      }
    })();
    return () => {
      dead = true;
      try { viewer.current?.spin(false); viewer.current?.clear(); } catch { /* ignore */ }
      viewer.current = null;
    };
  }, [pdb, fmt]);

  useEffect(() => {
    const v = viewer.current;
    if (!v || state !== "ready") return;
    paintRef.current(v, lib.current);
    v.render();
  }, [sig, state]);

  useEffect(() => {
    const v = viewer.current;
    if (!v || state !== "ready" || !focus) return;
    v.zoomTo({ chain: focus.chain, resi: focus.resi }, 600);
    v.render();
  }, [focus, state]);

  useEffect(() => {
    const v = viewer.current;
    if (v && state === "ready") v.spin(rot ? "y" : false, 0.6);
  }, [rot, state]);

  return (
    <figure className="viewer" style={{ margin: "0.6rem 0" }}>
      <div className="viewer-box" style={{ height }}>
        <div ref={box} className="viewer-canvas" role="img" aria-label={`Interactive 3D view of PDB entry ${pdb.toUpperCase()}`} />
        {state === "loading" && <div className="viewer-msg">Loading {pdb.toUpperCase()} from RCSB...</div>}
        {state === "error" && <div className="viewer-msg">Could not load {pdb.toUpperCase()} from RCSB. Check your connection and reload.</div>}
      </div>
      <figcaption>
        <button type="button" className="btn" onClick={() => setRot((x) => !x)}>{rot ? "Stop spin" : "Spin"}</button>{" "}
        <button type="button" className="btn" onClick={() => viewer.current?.zoomTo()}>Reset view</button>
        {caption && <span className="viewer-cap">{caption}</span>}
      </figcaption>
    </figure>
  );
}
