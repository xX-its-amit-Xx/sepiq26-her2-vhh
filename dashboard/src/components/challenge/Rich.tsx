"use client";
import { Fragment, useMemo } from "react";
import GlossaryTerm, { useGlossary } from "@/components/GlossaryTerm";

// Common words that are also glossary keys: do not auto-link them in running text.
const STOP = new Set(["tie", "seed", "lift", "niche", "consensus", "resolution", "precision", "recall", "framework", "tether", "hotspot", "phage", "ensemble", "docking", "mcc", "pdb"]);

/** Plain string with the first mention of each glossary term wrapped in GlossaryTerm. */
export default function Rich({ children }: { children: string }) {
  const g = useGlossary();
  const re = useMemo(() => {
    const keys = [...g.keys()].filter((k) => k.length >= 3 && !STOP.has(k)).sort((a, b) => b.length - a.length);
    if (!keys.length) return null;
    const esc = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/-/g, "[- ]"));
    return new RegExp(`(?<![A-Za-z0-9])(${esc.join("|")})(?![A-Za-z0-9])`, "gi");
  }, [g]);
  if (!re) return <>{children}</>;
  const parts: React.ReactNode[] = [];
  const seen = new Set<string>();
  let last = 0;
  let m: RegExpExecArray | null;
  const rx = new RegExp(re.source, "gi");
  while ((m = rx.exec(children))) {
    const ent = g.get(m[1].toLowerCase()) ?? g.get(m[1].toLowerCase().replace(/ /g, "-"));
    if (!ent || seen.has(ent.id)) continue;
    seen.add(ent.id);
    if (m.index > last) parts.push(children.slice(last, m.index));
    parts.push(<GlossaryTerm key={m.index} id={ent.id}>{m[1]}</GlossaryTerm>);
    last = m.index + m[1].length;
  }
  parts.push(children.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}
