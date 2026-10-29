import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Callout from "@/components/Callout";
import Source from "@/components/Source";
import Pills from "@/components/Pills";
import s from "./assay.module.css";

const G = GlossaryTerm;
const Q7 = "research/q7_data_representation_integration/";

type Row = { label: string; v: number; tone?: "vhh" | "her2" | "amber" | "bad" };

/** Small inline-SVG horizontal bar chart. Values are shown as printed numbers. */
function Bars({ rows, max, title, signed = false }: { rows: Row[]; max: number; title: string; signed?: boolean }) {
  const W = 560, rh = 26, L = 190, R = 50;
  const H = rows.length * rh + 8;
  const col = (t?: string) => (t === "her2" ? "var(--her2)" : t === "amber" ? "var(--amber)" : t === "bad" ? "var(--bad)" : "var(--vhh)");
  const mid = signed ? L + (W - L - R) : L;
  const scale = (W - L - R) / max;
  return (
    <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {rows.map((r, i) => {
        const w = Math.abs(r.v) * scale;
        const x = signed ? mid - w : L;
        return (
          <g key={r.label}>
            <text x={L - 8} y={i * rh + 17} textAnchor="end">{r.label}</text>
            <rect x={x} y={i * rh + 5} width={Math.max(1, w)} height={16} rx={2} fill={col(r.tone)} opacity="0.85" />
            <text x={signed ? x - 4 : x + w + 5} y={i * rh + 17} textAnchor={signed ? "end" : "start"}>{signed ? r.v.toFixed(3) : r.v.toFixed(3)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FourFailures() {
  return (
    <div>
      <Callout tone="kill" title="The thesis, in one paragraph">
        <p>
          The idea was that clever re-packaging of the 1,843,875 nanobody sequences (7,316 labelled Yes, 12,051 Not) could squeeze out <i>where</i> on HER2 each nanobody grips. It was tested four ways on the real tables and failed each time. Each test came with a pre-stated way to be wrong, and a plain baseline had to be beaten. The data do carry signal about the <b>nanobody side</b> (which loops vary) but nothing per HER2 residue.
        </p>
      </Callout>
      <Pills items={[{ text: "DCA / Potts: killed", tone: "bad" }, { text: "Clonal mutation scan: falsified", tone: "bad" }, { text: "Mimotope matching: no gain", tone: "bad" }, { text: "Label denoising: worse", tone: "bad" }]} />

      <Drop title="1. Co-evolution (DCA / Potts): HER2 never varies" summary="Beats a loop-only guess, but a plain variability map beats it (0.562 vs 0.509)." defaultOpen>
        <p>
          <G>DCA</G> finds residues that change together across many sequences and infers they touch. Here the antigen is the same in every experiment, so there is no HER2 variation for nanobody residues to co-vary with. Only nanobody-to-nanobody couplings are measurable, and they mostly reflect germline and loop geometry.
        </p>
        <Bars title="Paratope PR-AUC on CDR residues, 5 HER2-nanobody chains" max={0.7} rows={[
          { label: "CDR3-only prior", v: 0.399, tone: "amber" },
          { label: "Composite (binder-derived)", v: 0.509, tone: "vhh" },
          { label: "Variability-only prior", v: 0.562, tone: "her2" },
        ]} />
        <p>The composite score beat the CDR3-only prior (0.509 versus 0.399, interval for the difference above zero). That sounds like a win, but a simple &quot;how variable is this loop position in the unselected library&quot; map scores 0.562, and the binder-versus-non-binder part adds nothing over it. &quot;Beats the stated baseline&quot; did not mean &quot;carries signal&quot;.</p>
        <Drop title="Details and numbers">
          <ul>
            <li>Data: 7,316 binders and 12,051 non-binders, scored against 5 HER2-nanobody structures. About 11 minutes of CPU.</li>
            <li>Binder-derived scores minus the variability prior: KL shift -0.07 (interval -0.17 to +0.03), coupling -0.03 (-0.14 to +0.08), contrast coupling -0.15 (-0.27 to -0.04).</li>
            <li>The variability prior scored 0.494 over all residues; a leave-one-out contact-frequency prior from public structures scored 0.435 on CDR residues.</li>
          </ul>
        </Drop>
        <Source path={Q7 + "paired_coevolution_potts_dca_and_contact_inference_from_binder_vs_nonbinder_sequences.md"} />
      </Drop>

      <Drop title="2. Free mutation scan from clone families: variation is just error" summary="Loop positions vary 0.5 to 2% per column, the sequencing error floor.">
        <p>
          A <G>deep mutational scanning</G> experiment tells you which nanobody positions tolerate change, and the tolerant ones are usually not at the interface. The three test clones (ONU11, ONU13, ONU23) each sit in a family of 1,330 to 4,420 sequences, so the hope was a free scan.
        </p>
        <Bars title="PR-AUC on 5 public HER2 interfaces" max={0.3} rows={[
          { label: "Tolerance-only score", v: 0.137, tone: "bad" },
          { label: "CDR3-uniform baseline", v: 0.206, tone: "amber" },
        ]} />
        <p>In all three families, CDR3 varies only at the error floor, about 0.5 to 2% per column, the same as the framework. Natural variants are not a mutation scan. A tolerance score built from 348 enriched families scored 0.137, below the plain CDR3-uniform baseline (0.206): falsified.</p>
        <Drop title="The three held-out clones as rows in the table">
          <div className={s.tblwrap}>
            <table className={s.tbl}>
              <thead><tr><th>Clone</th><th>CDR3 (from the challenge page)</th><th>Label</th></tr></thead>
              <tbody>
                <tr><td>ONU11</td><td>RPLGSTWTEHPY</td><td>noise</td></tr>
                <tr><td>ONU13</td><td>KYGSSRLWDY</td><td>Yes</td></tr>
                <tr><td>ONU23</td><td>DGRFYSDYVWSSPDEYAY</td><td>Yes</td></tr>
              </tbody>
            </table>
          </div>
          <p className={s.small}>Also from this work: 39 CDR3 families carry 50% of the above-expectation post-panning reads, and family-level replicate Pearson is 0.93. A family-level enrichment score (AUROC 0.976) beats a single-replicate per-sequence score (0.962) but not the pooled per-sequence score (0.991), which is circular with the label.</p>
        </Drop>
        <Source path={[Q7 + "deep_mutational_scanning_and_cdr_mutation_tolerance_as_paratope_evidence_in_public_data.md", Q7 + "clonotype_clustering_cdr3_families_and_enrichment_trajectories_as_epitope_bins.md"]} />
      </Drop>

      <Drop title="3. Mimotope matching: no better than a generic surface guess" summary="0.081 against 0.083 for plain surface exposure; random is about 0.05.">
        <p>
          A <G>mimotope</G> method finds the antigen patch whose shape and chemistry match the peptides a binder selects. Classic tools need dozens of antigen-selected peptides. Here the test was made as easy as possible: the true binder loop (CDR3) was the query for each of 5 public HER2 complexes.
        </p>
        <Bars title="Macro PR-AUC, 5 HER2-nanobody complexes" max={0.12} rows={[
          { label: "Random (about)", v: 0.05, tone: "amber" },
          { label: "Loop-to-surface matching", v: 0.081, tone: "vhh" },
          { label: "Surface-exposure prior", v: 0.083, tone: "her2" },
        ]} />
        <p>Matching charge, hydrophobicity and aromatic profile of the loop to HER2 surface patches scored 0.081, versus 0.083 for a surface-exposure prior, with bootstrap intervals that include zero difference and no benefit over a wrong-loop control. In the literature, mimotope tools reach sensitivity about 0.3 and precision about 0.2 to 0.3 on a 10-case set, and no published method infers an epitope from antibody-side sequence alone.</p>
        <Drop title="Caveat that makes this harder, not easier, to dismiss">
          <p>The oracle test is optimistic (it used the true loop). The mimotope worker could not open the gated table and used the true binder CDR3s instead; BepiPred, DiscoTope and SEMA were not run.</p>
        </Drop>
        <Source path={Q7 + "mimotope_and_peptide_epitope_mapping_phage_sequences_and_epitope_inference_from_binding_alone.md"} />
      </Drop>

      <Drop title="4. Label denoising and PU learning: it made models worse" summary="Every denoised variant scored below raw labels, outside its interval.">
        <p>
          If the labels are noisy, cleaning them should help. <G>PU learning</G> treats &quot;Not&quot; as unknown rather than negative. Models were trained on 19,367 labelled clones and tested on held-out families.
        </p>
        <Bars signed title="Change in PR-AUC versus raw labels, strict family split" max={0.16} rows={[
          { label: "3-mer logistic, soft labels", v: -0.059, tone: "bad" },
          { label: "ESM boosted trees, soft labels", v: -0.048, tone: "bad" },
          { label: "ESM boosted trees, Elkan-Noto", v: -0.094, tone: "bad" },
          { label: "ESM network, nnPU (pi 0.3)", v: -0.141, tone: "bad" },
        ]} />
        <p>All intervals sit below zero on both splits and on a stricter replicate-confirmed subset. A bigger lesson: a plain 3-mer model drops from AUROC 0.945 to 0.855 when related sequences are kept apart, and cluster size alone gives 0.84. Yes versus Not is largely family identity.</p>
        <Drop title="Why the usual PU assumptions fail here">
          <p>PU methods assume positives are labelled at random. Here the chance of being labelled grows with read count, so that assumption is false and the estimated class prior is not interpretable. Only 49.5% of Yes are replicate-confirmed, 59% of Yes have zero mother reads, and the library-wide share of enriched clones is 0.2 to 0.6% while the real binder prior is not identifiable from this design.</p>
          <p className={s.small}>This kills &quot;this soft label or nnPU helps on this task&quot;, not &quot;any denoising could help&quot;. Evaluating a denoised model against raw labels is itself partly circular.</p>
        </Drop>
        <Source path={Q7 + "negative_labels_pu_learning_noisy_labels_and_enrichment_to_label_denoising.md"} />
      </Drop>

      <Callout tone="key" title="What survives">
        <ul>
          <li><b>A cheap nanobody-side prior.</b> The unselected-library variability of each loop position scored 0.562 on loop residues. Any structure-based paratope model has to beat this and the contact-frequency prior (0.435).</li>
          <li><b>One antigen-side hint.</b> In the competition panning (Library B only), trastuzumab depletes ONU13 by more than 20 times, but not ONU11 or ONU23. Which HER2 domain the competing antibodies cover in this assay is unverified.</li>
          <li><b>Family structure for honest testing.</b> Use clone families to build grouped cross-validation folds so scores are not inflated.</li>
        </ul>
      </Callout>
      <Source path={[Q7 + "_QUEEN_DIGEST.md", "hive/EMPEROR.md"]} />
    </div>
  );
}
