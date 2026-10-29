/** Small "source" disclosure. path: project-relative hive path(s), e.g. research/q3_assay_ngs_ground_truth/w1.md. Absolute or user-home paths are dropped. */
export default function Source({ path, note }: { path: string | string[]; note?: string }) {
  const paths = (Array.isArray(path) ? path : [path])
    .map((p) => p.replace(/\\/g, "/"))
    .filter((p) => !/^([a-zA-Z]:|\/|~)/.test(p) && !/Users\//.test(p));
  return (
    <details className="source">
      <summary>source</summary>
      <ul>
        {paths.map((p) => (
          <li key={p}><code>{p}</code></li>
        ))}
      </ul>
      {note && <p>{note}</p>}
    </details>
  );
}
