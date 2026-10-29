"use client";
import { createContext, useContext, useId, useState } from "react";
import data from "@/data/glossary.json";

export type GlossaryEntry = { id: string; term: string; short: string; long?: string; aliases?: string[] };
const entries = data as GlossaryEntry[];
const index = new Map<string, GlossaryEntry>();
for (const e of entries) {
  index.set(e.id.toLowerCase(), e);
  index.set(e.term.toLowerCase(), e);
  for (const a of e.aliases ?? []) index.set(a.toLowerCase(), e);
}
const Ctx = createContext(index);
export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={index}>{children}</Ctx.Provider>;
}
export function useGlossary() {
  return useContext(Ctx);
}

/** Jargon term with hover/click/focus definition. id: glossary id (defaults to the child text; matched on id, term or alias). Unknown terms render as plain text. */
export default function GlossaryTerm({ id, children }: { id?: string; children: React.ReactNode }) {
  const g = useGlossary();
  const key = (id ?? (typeof children === "string" ? children : "")).toLowerCase();
  const e = g.get(key);
  const [open, setOpen] = useState(false);
  const pid = useId();
  if (!e) return <>{children}</>;
  return (
    <span className="gloss" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="gloss-btn"
        aria-expanded={open}
        aria-describedby={open ? pid : undefined}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        onKeyDown={(ev) => ev.key === "Escape" && setOpen(false)}
      >
        {children}
      </button>
      {open && (
        <span role="tooltip" id={pid} className="gloss-pop">
          <b>{e.term}</b> {e.short}
          {e.long && <span className="gloss-long">{e.long}</span>}
        </span>
      )}
    </span>
  );
}
