"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

const SRC = "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";
let loader: Promise<any> | null = null;
function load3Dmol(): Promise<any> {
  const w = window as any;
  if (w.$3Dmol) return Promise.resolve(w.$3Dmol);
  if (!loader) {
    loader = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = () => res(w.$3Dmol);
      s.onerror = () => rej(new Error("3Dmol failed to load"));
      document.head.appendChild(s);
    });
  }
  return loader;
}

export type Highlight = { chain?: string; resi?: number[] | string; color: string; style?: "stick" | "sphere" | "cartoon" };
export type ChainColor = { chain: string; color: string };

/** 3D structure; PDB fetched at runtime from RCSB (nothing committed). pdb: 4-char id. chains: base colour per chain. highlights: residue sets drawn on top (resi as numbers or "10-20"). height in px. spin: start rotating. caption: node shown beside the buttons. */
export default function Viewer3D({ pdb, chains = [], highlights = [], height = 380, spin = false, caption }: { pdb: string; chains?: ChainColor[]; highlights?: Highlight[]; height?: number; spin?: boolean; caption?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [rotating, setRotating] = useState(spin);
  const viewer = useRef<any>(null);
  const key = JSON.stringify([pdb, chains, highlights]);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const $3Dmol = await load3Dmol();
        const r = await fetch(`https://files.rcsb.org/download/${encodeURIComponent(pdb.toUpperCase())}.pdb`);
        if (!r.ok) throw new Error(String(r.status));
        const txt = await r.text();
        if (dead || !ref.current) return;
        ref.current.innerHTML = "";
        const v = $3Dmol.createViewer(ref.current, { backgroundAlpha: 0 });
        v.addModel(txt, "pdb");
        v.setStyle({}, { cartoon: { color: "#9aa5a8", opacity: 0.85 } });
        for (const c of chains) v.setStyle({ chain: c.chain }, { cartoon: { color: c.color } });
        for (const h of highlights) {
          const sel: any = {};
          if (h.chain) sel.chain = h.chain;
          if (h.resi !== undefined) sel.resi = h.resi;
          v.addStyle(sel, { [h.style ?? "stick"]: { color: h.color } });
        }
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
      viewer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const v = viewer.current;
    if (v && state === "ready") v.spin(rotating ? "y" : false, 0.6);
  }, [rotating, state]);

  return (
    <figure className="viewer">
      <div className="viewer-box" style={{ height }}>
        <div ref={ref} className="viewer-canvas" role="img" aria-label={`3D structure of PDB ${pdb.toUpperCase()}`} />
        {state === "loading" && <div className="viewer-msg">Loading {pdb.toUpperCase()} from RCSB...</div>}
        {state === "error" && <div className="viewer-msg">Could not load {pdb.toUpperCase()} from RCSB. Check your connection and reload.</div>}
      </div>
      <figcaption>
        <button type="button" className="btn" onClick={() => setRotating((r) => !r)}>{rotating ? "Stop spin" : "Spin"}</button>{" "}
        <button type="button" className="btn" onClick={() => viewer.current?.zoomTo()}>Reset view</button>
        {caption && <span className="viewer-cap">{caption}</span>}
      </figcaption>
    </figure>
  );
}
