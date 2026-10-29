/** Standard page header. owner: placeholder note naming the builder until real content lands. */
export default function PageHead({ title, lede, owner }: { title: string; lede: string; owner?: string }) {
  return (
    <div className="pagehead">
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      {owner && <p className="placeholder-note">Placeholder. Content for this page is still being written ({owner}).</p>}
    </div>
  );
}
