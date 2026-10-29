export type PillTone = "plain" | "good" | "warn" | "bad" | "info";

/** Row of small status chips. items: text plus optional tone. */
export default function Pills({ items }: { items: { text: string; tone?: PillTone }[] }) {
  return (
    <div className="pills">
      {items.map((p, i) => (
        <span key={i} className={`pill pill-${p.tone ?? "plain"}`}>{p.text}</span>
      ))}
    </div>
  );
}
