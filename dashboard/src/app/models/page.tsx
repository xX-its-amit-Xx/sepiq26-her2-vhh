import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import GlossaryTerm from "@/components/GlossaryTerm";
import ChStyles from "@/components/challenge/Styles";
import Leaderboard, { type ArmRow, type BootRow, type Cell, type VariantRow } from "@/components/challenge/Leaderboard";
import { mdTable, mdToHtml, readRel, section, splitSections } from "@/components/challenge/server";

export const metadata = { title: "Our models | SEPIQ 2026 Intelligence" };

function cell(s: string | undefined): Cell {
  if (!s) return null;
  const m = s.match(/^\s*([0-9]*\.?[0-9]+)\s*(?:\(\s*([0-9]*\.?[0-9]+)\s*\))?/);
  if (!m) return null;
  return { v: Number(m[1]), nul: m[2] !== undefined ? Number(m[2]) : null };
}

const LABEL: Record<string, string> = {
  "FLOOR_composite minus uniform_random": "Floor submission vs random order",
  "vhh_cdr_positional_prior minus uniform_random": "Nanobody CDR position prior vs random order",
  "antigen_exposure minus uniform_random": "HER2 surface exposure vs random order",
  "exposure_x_dimer_x_footprint minus exposure": "Exposure + dimer + footprint vs exposure alone",
};

function loadBoots(): BootRow[] {
  const csv = readRel("model/results/paired_bootstrap.csv");
  if (csv) {
    const lines = csv.trim().split(/\r?\n/).slice(1);
    const rows: BootRow[] = [];
    for (const l of lines) {
      const [cmp, scope, mode, d, lo, hi, p] = l.split(",");
      const label = LABEL[cmp];
      if (!label) continue;
      rows.push({ comparison: label, scope: scope as BootRow["scope"], mode: mode as BootRow["mode"], delta: Number(d), lo: Number(lo), hi: Number(hi), p: Number(p) });
    }
    if (rows.length) return rows;
  }
  // Fallback: the three intervals quoted in the README text (residue resampling).
  return [
    { comparison: LABEL["FLOOR_composite minus uniform_random"], scope: "antigen", mode: "residue", delta: 0.012, lo: -0.027, hi: 0.049, p: 0.54 },
    { comparison: LABEL["FLOOR_composite minus uniform_random"], scope: "vhh", mode: "residue", delta: 0.484, lo: 0.39, hi: 0.56, p: 0 },
    { comparison: LABEL["exposure_x_dimer_x_footprint minus exposure"], scope: "antigen", mode: "residue", delta: 0.012, lo: -0.013, hi: 0.033, p: 0 },
  ];
}

export default function Page() {
  const readme = readRel("model/README.md");
  const sec5 = readme ? section(readme, "5.") : "";
  const arms: ArmRow[] = sec5
    ? mdTable(sec5, "Arm |")
        .filter((r) => r.length >= 4)
        .map((r) => ({ arm: r[0], antigen: cell(r[1]), vhh: cell(r[2]), pooled: cell(r[3]) }))
    : [];
  const variants: VariantRow[] = sec5
    ? mdTable(sec5, "Variant |")
        .filter((r) => r.length >= 4)
        .map((r) => ({ variant: r[0], antigen: cell(r[1]), vhh: cell(r[2]), pooled: cell(r[3]) }))
    : [];
  const boots = loadBoots();
  const sections = readme ? splitSections(readme) : [];

  return (
    <>
      <ChStyles />
      <PageHead
        title="Our models"
        lede="Our own experiments so far: a safe starter submission, scored on public complexes against what random guessing would give."
      />

      {!readme && (
        <Callout tone="warn" title="Results log not available">
          The modelling lane has not written its results log yet, or it was not found at build time. This page fills in once the log exists.
        </Callout>
      )}

      {readme && (
        <Callout tone="key" title="What the numbers say so far">
          <ul>
            <li>On the nanobody side, a simple rule (which positions sit in the loops that usually grab the target) scores about <b>3.4x</b> a random order. That is a robust, cheap effect.</li>
            <li>On the HER2 side, our priors score about <b>1.6x</b> random and the gain cannot be told apart from zero. The HER2 answer has to come from 3D structure prediction, which has not run yet.</li>
            <li>These are scores on five public complexes, not forecasts for the three secret ones. Differences below about 0.05 to 0.1 are noise with so few complexes.</li>
          </ul>
          <Source path="model/README.md" note="Headline under section 5." />
        </Callout>
      )}

      <h2>Leaderboard against the shuffle null</h2>
      {arms.length > 0 ? (
        <Leaderboard arms={arms} variants={variants} boots={boots} />
      ) : (
        readme && <Callout tone="note" title="Leaderboard table not found">The results log has no arm-by-arm table yet. The full log is below.</Callout>
      )}

      <h2>How to read this</h2>
      <Drop title="What is an arm?" summary="One candidate way of scoring residues">
        <p>An arm is one candidate recipe for turning a sequence or structure into a probability per residue. The <b>floor</b> submission combines the best HER2-side recipe with the nanobody loop prior. Nothing here is fitted on the answer labels, except a footprint score that is rebuilt leaving the tested structure out.</p>
      </Drop>
      <Drop title="What is the shuffle null?" summary="The score you would get by luck">
        <p>Take an arm&apos;s predictions and randomly reorder them within each chain, 300 times. The average score of those shuffles is the <GlossaryTerm id="shuffle-null">shuffle null</GlossaryTerm>. An arm only has skill if it clearly beats it, which is why the table shows the ratio.</p>
      </Drop>
      <Drop title="Why is the HER2 side so low?" summary="Only about 4% of HER2 residues touch the nanobody">
        <p>On the real HER2 complexes only 0.029 to 0.055 of antigen residues touch the nanobody (mean 0.042), so even a good guess scores low. The 0.126 figure quoted elsewhere belongs to a different protein, the SARS-CoV-2 spike domain.</p>
        <Source path="model/README.md" note="Section 3, proxy labels." />
      </Drop>

      <h2>The full results log</h2>
      <p>Everything the modelling lane has written down, one section per heading. Absolute file paths are replaced with a placeholder.</p>
      {sections.length === 0 && readme && (
        <div className="ch-md" dangerouslySetInnerHTML={{ __html: mdToHtml(readme) }} />
      )}
      {sections.map((s, i) => (
        <Drop key={s.title} title={s.title}>
          <div className="ch-md" dangerouslySetInnerHTML={{ __html: mdToHtml(s.body) }} />
          {i === 0 && <Source path="model/README.md" />}
        </Drop>
      ))}
      <Source path={["model/README.md", "model/results/paired_bootstrap.csv"]} />
    </>
  );
}
