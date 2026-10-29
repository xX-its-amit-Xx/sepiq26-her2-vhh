"use client";

/** Small segmented toggle. */
export default function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { v: T; t: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="ch-row" role="group" aria-label={label}>
      <span className="ch-lab">{label}</span>
      <span className="ch-seg">
        {options.map((o) => (
          <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
            {o.t}
          </button>
        ))}
      </span>
    </div>
  );
}
