"use client";
import { useState } from "react";

/** Expandable block; nest Drops to any depth. title: always visible. summary: one-line teaser shown while closed. */
export default function Drop({ title, summary, defaultOpen = false, children }: { title: React.ReactNode; summary?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details className="drop" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>
        <span className="drop-chev" aria-hidden="true" />
        <span className="drop-head">
          <span className="drop-title">{title}</span>
          {summary && !open && <span className="drop-sum">{summary}</span>}
        </span>
      </summary>
      <div className="drop-body">{children}</div>
    </details>
  );
}
