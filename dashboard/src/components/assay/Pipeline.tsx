"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Source from "@/components/Source";
import s from "./assay.module.css";

const G = GlossaryTerm;

type Step = {
  id: string;
  truth?: boolean;
  name: string;
  sub: string;
  plain: ReactNode;
  mechanism: ReactNode;
  noise: ReactNode;
  controls: ReactNode;
  gotchas: ReactNode;
  src: string[];
};

const Q3 = "research/q3_assay_ngs_ground_truth/";
const Q7 = "research/q7_data_representation_integration/";

const steps: Step[] = [
  {
    id: "immunise", name: "1. Immunise", sub: "alpaca + HER2",
    plain: <>An <G id="alpaca">alpaca</G> is injected with human <G id="HER2">HER2</G> so its immune system makes a huge, varied set of nanobodies against it.</>,
    mechanism: (
      <>
        <p>One alpaca was immunised with wild-type human HER2. The nanobody (<G id="VHH">VHH</G>) genes from its blood become the raw material for two phage libraries, called B and C. The letters follow repeated immunisation (the order of the letters is the order of immunisation rounds).</p>
        <Drop title="Why this matters for the contest">
          <p>The antigen is always the same wild-type protein. There are no HER2 mutants in the experiment, so nothing varies on the HER2 side that a model could correlate with nanobody sequence.</p>
        </Drop>
      </>
    ),
    noise: <p>Each library is one animal&apos;s immune response. Clones present depend on that animal&apos;s history, not just on HER2 binding.</p>,
    controls: <p>None on this step. Controls start at the library and panning steps.</p>,
    gotchas: <p>A mutant series, as used in the sibling SARS-CoV-2 dataset to separate variant-specific binders, is unavailable for HER2 (wild-type only).</p>,
    src: [Q3 + "phage_display_biopanning_physics_and_biases_display_expression_amplification_avidity.md", Q7 + "clonotype_clustering_cdr3_families_and_enrichment_trajectories_as_epitope_bins.md"],
  },
  {
    id: "library", name: "2. Library", sub: "phage display",
    plain: <>Each nanobody gene is attached to a virus (<G id="phage">phage</G>) that shows the nanobody on its surface, giving a pool of viruses that each wear a different nanobody.</>,
    mechanism: (
      <>
        <p>The VHH genes are cloned into a <G id="phagemid">phagemid</G> vector (pMES4) so each phage particle displays one VHH and carries its gene. The unselected pool is the <G id="Mother Library">Mother Library</G>; its read counts are the &quot;before&quot; in every later comparison.</p>
        <Drop title="Mother library read depths in the count table">
          <p>Pre-panning columns hold 55,040 reads (1st phase, B), 225,719 (2nd phase, B) and 185,182 (2nd phase, C).</p>
        </Drop>
      </>
    ),
    noise: <p>Not every VHH displays equally well. In one scFv study display propensity tracked overall expression with Spearman rho 0.88, so well-expressed clones start ahead regardless of binding.</p>,
    controls: <p>The table carries HER2-free negative-control sublibraries (NC1, NC2, NC3, Comparator), used to flag clones that stick to plastic or beads.</p>,
    gotchas: <p>Display and expression bias can make a clone look enriched without any extra affinity. No published fraction exists for VHH libraries.</p>,
    src: [Q3 + "phage_display_biopanning_physics_and_biases_display_expression_amplification_avidity.md", Q7 + "clonotype_clustering_cdr3_families_and_enrichment_trajectories_as_epitope_bins.md"],
  },
  {
    id: "panning", name: "3. Biopanning", sub: "one round of fishing",
    plain: <>The virus pool is poured over HER2. Sticky ones stay, the rest are washed away, and survivors are regrown. Here that was done only once.</>,
    mechanism: (
      <>
        <p>The pool is incubated with whole HER2 ectodomain on a surface, washed, and bound phage are eluted and amplified (<G>biopanning</G>). One round was done, which has the lowest signal-to-background of any round.</p>
        <Drop title="What one round on whole HER2 cannot tell you">
          <ul>
            <li>Which HER2 domain (<G id="domain I">I</G> to <G id="domain IV">IV</G>) the clone touches: one full-length antigen, no domain-resolved readout.</li>
            <li>Whether two different-looking clones share an epitope.</li>
            <li>Whether the binding face is near a <G>glycan</G>; no glycan-knockout control is described.</li>
            <li>Whether the antigen was partly denatured or oriented oddly on the surface (orientation unrecorded).</li>
            <li>Avidity artefacts: a weak binder can enrich by rebinding to a dense coating.</li>
          </ul>
        </Drop>
      </>
    ),
    noise: (
      <>
        <p>Abundant clones are favoured by amplification, and a few clones can dominate. Phage-specific growth advantages create <G id="parasitic clone">parasitic clones</G> that enrich with no binding.</p>
        <p className={s.small}>No quantified fraction for VHH exists. In a peptide-library study, abundant clones were about 35% of a bulk-amplified population versus under 1% in emulsion amplification.</p>
      </>
    ),
    controls: <p>HER2-free panning columns, and competition panning with trastuzumab, pertuzumab and a third antibody (Library B only; named RabMAb in the README and Companion in the count file).</p>,
    gotchas: (
      <ul>
        <li><G id="tag binder">Tag binders</G> (His tag, the C-terminal GACQ) can enrich as if they were HER2 binders.</li>
        <li>The competition columns are the only antigen-side hint (see the last section).</li>
      </ul>
    ),
    src: [Q3 + "phage_display_biopanning_physics_and_biases_display_expression_amplification_avidity.md", Q7 + "_QUEEN_DIGEST.md"],
  },
  {
    id: "ngs", name: "4. Sequencing", sub: "count every clone",
    plain: <>The pool before and after fishing is read by a sequencing machine, which counts how often each nanobody sequence appears.</>,
    mechanism: (
      <>
        <p>About 10^5 paired reads per library are trimmed, merged and collapsed to unique amino-acid sequences (<G>NGS</G>). Singletons (sequences seen once) are removed to avoid sequencing errors. The final table has 1,843,875 distinct VHH sequences and 28 count columns.</p>
        <Drop title="How sparse is the table?">
          <p>97% of sequences have zero reads in each HER2 sublibrary, and 77.9% are <G>singleton</G>s.</p>
        </Drop>
      </>
    ),
    noise: <p>PCR and sequencing errors create fake neighbours of real clones. In the three target families, positions in CDR3 vary at only 0.5 to 2% per column, the same as framework, which is the error floor.</p>,
    controls: <p>Replicate panning columns (Her2_C1 and Her2_C2 for libraries B and C) allow a same-mother replicate check.</p>,
    gotchas: <p>Large families are partly one real clone plus PCR and sequencing variants, so family size is partly an error artefact.</p>,
    src: [Q7 + "negative_labels_pu_learning_noisy_labels_and_enrichment_to_label_denoising.md", Q7 + "clonotype_clustering_cdr3_families_and_enrichment_trajectories_as_epitope_bins.md", Q7 + "deep_mutational_scanning_and_cdr_mutation_tolerance_as_paratope_evidence_in_public_data.md"],
  },
  {
    id: "test", name: "5. Enrichment test", sub: "did its share rise?",
    plain: <>For each sequence, a statistical test asks whether its share of the reads went up after fishing by more than luck would explain.</>,
    mechanism: (
      <>
        <p>The test is a two-proportion z-test, algebraically the same as a 2x2 <G>chi-squared</G> without continuity correction, on before and after counts. An increase with <G id="p-value">p</G> at or below 0.05 earns &quot;binder&quot;. The pipeline&apos;s IE-score is a pooled version of this test with no <G id="multiple testing">multiple-testing</G> correction. The labels reproduce exactly from the counts.</p>
        <Drop title="Try it">
          <p>The simulator further down this page computes, exactly, how often this test calls a clone that did not change at all a binder, as read counts drop.</p>
        </Drop>
      </>
    ),
    noise: (
      <>
        <p>The normal approximation is justified on library size (over 10,000 reads), but it depends on each clone&apos;s own counts. It is invalid below about 10 combined reads (<G>Cochran&apos;s rule</G>). In a simulation (not a measurement of this table), the false-binder rate among tested null clones was 7 to 10% at 3 to 4 reads, versus the nominal 2.5%.</p>
        <p className={s.small}>With realistic PCR over-dispersion, 5 to 15% stays false even at high counts (simulation).</p>
      </>
    ),
    controls: <p>A clone that is also a binder in a HER2-free control panning is reassigned to &quot;noise&quot; (documented for the sibling hIL6 dataset; its use for HER2 is inferred). 746 sequences carry the noise label, and ONU11 is one of them.</p>,
    gotchas: <p>The sibling dataset takes the smallest p over 12 sublibraries with no correction. How many real labels have fewer than 10 reads was not measured.</p>,
    src: [Q3 + "ngs_read_count_statistics_pcr_sequencing_error_singletons_and_enrichment_test_validity.md", Q7 + "negative_labels_pu_learning_noisy_labels_and_enrichment_to_label_denoising.md"],
  },
  {
    id: "labels", name: "6. Labels", sub: "Yes / Not / ...",
    plain: <>Each tested sequence gets a tag: &quot;Yes&quot; if it grew, &quot;Not&quot; if it shrank. Most sequences are never tested at all.</>,
    mechanism: (
      <p>Of 1,843,875 sequences, 19,367 carry a label: 7,316 Yes and 12,051 Not. A further 1,823,762 are non-significant and 746 are noise. The <G>binder label</G> means only that the clone&apos;s read share rose after one panning round on whole HER2.</p>
    ),
    noise: (
      <>
        <p>Only 49.5% of Yes clones are confirmed by an independent same-mother replicate, and 59% of Yes have zero reads in every mother library. &quot;Not&quot; is mostly depleted, not tested-flat.</p>
        <Drop title="Estimated false positives and misses (derived, not measured)">
          <p>One worker&apos;s estimate from stated assumptions: roughly 10 to 40% of binder labels are false positives and 30 to 60% of truly HER2-specific clones are missed. The real table was not used for this estimate. Treat as unverified.</p>
        </Drop>
      </>
    ),
    controls: <p>For the sibling hIL6 dataset, all 10 binder-labelled VHHs tested did bind. Ten is few: the exact 95% lower bound on precision is only about 69%.</p>,
    gotchas: (
      <ul>
        <li>A label says nothing about where on HER2 the clone binds, which is what the contest scores.</li>
        <li>A sequence model mostly learns lineage: 3-mer AUROC falls from 0.945 to 0.855 under a strict family split.</li>
      </ul>
    ),
    src: [Q7 + "_QUEEN_DIGEST.md", Q3 + "_QUEEN_DIGEST.md"],
  },
  {
    id: "cryo", truth: true, name: "7. Cryo-EM", sub: "the 3D picture",
    plain: <>The organisers froze each HER2-nanobody pair and photographed it with an electron microscope to build a 3D density map, then fitted an atomic model into it.</>,
    mechanism: (
      <>
        <p>Target resolution is about 3.0 &Aring; (University of Osaka), released only after judging. Labels exist only for residues that are modelled in the structure.</p>
        <Drop title="What a similar public structure looks like">
          <p>9MTX (HER2 ectodomain with a nanobody, 3.06 &Aring;, no fiducial) has only 510 of 752 deposited residues modelled. 6OGE, with two Fabs, is at 4.36 &Aring;.</p>
        </Drop>
      </>
    ),
    noise: <p>Side-chain placement is less certain at 3 &Aring; than in crystals. The hive estimates 10 to 25% of antigen positives are at risk from missing density (unverified estimate).</p>,
    controls: <p>None disclosed: no resolution map, fiducial or glycan policy has been published by the organisers.</p>,
    gotchas: <p>Unmodelled residues cannot be labelled positive, so flexible or glycan-covered surface can drop out of the answer key.</p>,
    src: [Q3 + "cryo_em_ground_truth_resolution_map_model_uncertainty_and_what_3A_can_resolve_for_small_complexes.md", Q3 + "_QUEEN_DIGEST.md"],
  },
  {
    id: "contacts", truth: true, name: "8. Contact areas", sub: "who touches whom",
    plain: <>Software lists which residues of HER2 and of the nanobody touch, using a rule for what counts as touching.</>,
    mechanism: (
      <>
        <p><G>Voronota-LT</G> builds a radical tessellation with a 1.4 &Aring; probe and reports contact area per atom pair. A residue is positive if its <G id="contact area">contact area</G> is above 0, since the guideline gives no cutoff.</p>
        <Drop title="How generous is area above zero?">
          <p>It admits contacts 4 to 6 &Aring; apart. One example is Tyr351 to Tyr109 at 5.64 &Aring; with 1.12 &Aring;&sup2;. Across 24 real nanobody-antigen pairs the antigen positive fraction was 13.2% for area above 0, 11.3% for at least 5 &Aring;&sup2; and 9.5% for distance under 4 &Aring;.</p>
          <p>For HER2 itself the hive uses a base rate of about 3 to 5% (one public HER2 structure, 5MY6, gave 3.8%). The 13.2% is an all-antigen average, not a HER2 number.</p>
        </Drop>
      </>
    ),
    noise: <p>Between independent copies in the same crystal, 4 to 9% of positives flip. That is a floor, not a measurement for cryo-EM.</p>,
    controls: <p>The area-weighted metric is far less sensitive to the cutoff: its replicate ceiling is about 0.997 because flips happen at tiny-area residues.</p>,
    gotchas: <p>Proxy sets must use area above 0, not a 4 &Aring; cutoff. The organisers&apos; heteroatom and glycan handling is unknown, and the guideline and the worker cite different Voronota versions.</p>,
    src: [Q3 + "voronota_lt_contact_area_definition_and_how_epitope_labels_depend_on_the_cutoff.md", Q3 + "_QUEEN_DIGEST.md", "hive/EMPEROR.md"],
  },
  {
    id: "truth", truth: true, name: "9. Truth", sub: "scored by PR-AUC",
    plain: <>Predictions are compared to that list, one score per complex, and the three scores are averaged.</>,
    mechanism: (
      <p>For each of <G>ONU11</G>, <G>ONU13</G> and <G>ONU23</G> the metric is per-complex <G>PR-AUC</G>, <G id="macro-average">macro-averaged</G> over the three antibodies, with an area-weighted variant. Close results are settled by a paired cluster bootstrap (2,000 resamples, 95% interval).</p>
    ),
    noise: <p>A perfect predictor of the unperturbed labels scores about 0.92 to 0.97 against a replicate copy, and about 0.83 to 0.88 if 10% of positives are swapped. With only three complexes the confidence interval is about 0.18 wide.</p>,
    controls: <p>Use the calculator further down this page to see how the chance level and the spread move.</p>,
    gotchas: <p>The scorer is only partly specified (chain pooling, average precision versus trapezoid, best versus last of five submissions). A constant predictor scores about 0.04 under one definition and about 0.52 under another.</p>,
    src: [Q3 + "voronota_lt_contact_area_definition_and_how_epitope_labels_depend_on_the_cutoff.md", "research/_synthesis/narrative.md", "BRIEF.md"],
  },
];

export default function Pipeline() {
  const [cur, setCur] = useState("test");
  const st = steps.find((x) => x.id === cur) ?? steps[0];
  const lab = steps.filter((x) => !x.truth);
  const tru = steps.filter((x) => x.truth);
  const btn = (x: Step) => (
    <button key={x.id} type="button" className={`${s.step} ${x.truth ? s.stepTruth : ""} ${cur === x.id ? s.stepOn : ""}`} aria-pressed={cur === x.id} onClick={() => setCur(x.id)}>
      {x.name}<small>{x.sub}</small>
    </button>
  );
  return (
    <div>
      <div className={s.trackLabel}>The training labels (how the data is made)</div>
      <div className={s.track}>{lab.map(btn)}</div>
      <div className={s.trackLabel}>The answer key (how the test truth is made)</div>
      <div className={s.track}>{tru.map(btn)}</div>
      <div className={s.panel} aria-live="polite">
        <h3>{st.name.replace(/^\d+\.\s*/, "")}</h3>
        <p>{st.plain}</p>
        <Drop title="Physical mechanism">{st.mechanism}</Drop>
        <Drop title="Where the noise comes in">{st.noise}</Drop>
        <Drop title="Controls">{st.controls}</Drop>
        <Drop title="Gotchas">{st.gotchas}</Drop>
        <Source path={st.src} />
      </div>
    </div>
  );
}
