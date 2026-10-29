export type CalloutTone = "note" | "key" | "warn" | "kill";

/** Highlighted block. tone: note (default), key (main takeaway), warn (caveat), kill (a hypothesis that failed). */
export default function Callout({ tone = "note", title, children }: { tone?: CalloutTone; title?: string; children: React.ReactNode }) {
  return (
    <aside className={`callout callout-${tone}`}>
      {title && <div className="callout-title">{title}</div>}
      <div>{children}</div>
    </aside>
  );
}
