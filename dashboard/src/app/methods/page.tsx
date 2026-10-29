import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import Pills from "@/components/Pills";
import GlossaryTerm from "@/components/GlossaryTerm";
import MethodTable from "@/components/methods/MethodTable";
import SeedDemo from "@/components/methods/SeedDemo";

export const metadata = { title: "What has been tried | SEPIQ 2026 Intelligence" };

export default function Page() {
  return (
    <>
      <PageHead
        title="What has been tried"
        lede="Every family of method that could predict where a nanobody touches HER2, with its best reported number, what could have leaked, and whether we may use it."
      />

      <Callout tone="key" title="The one-minute version">
        <p>
          Nobody has published a tool that predicts the <GlossaryTerm>epitope</GlossaryTerm> on an antigen <em>given</em> a nanobody. The best antigen-only tool scores about 3.6 times random, which is still weak. Language models give a decent guess for the nanobody side (the <GlossaryTerm>paratope</GlossaryTerm>). Structure programs (<GlossaryTerm>co-folding</GlossaryTerm>) place a nanobody correctly roughly one time in three, and running them many times and keeping the contacts that repeat is the most promising use.
        </p>
        <Pills items={[{ text: "no tool does epitope given a nanobody", tone: "warn" }, { text: "baseline barely beats random", tone: "bad" }, { text: "consensus over seeds: promising", tone: "good" }]} />
      </Callout>

      <h2>The method table</h2>
      <p>
        Sort by clicking a heading, narrow by family, or search. The numbers come from different benchmarks, different test sizes and different metrics, so they are not comparable across families. Each row has a source tag with the file in the research folder it came from. Where the research could not open a source or only saw a search snippet, the row is marked.
      </p>
      <MethodTable />

      <Drop title="How to read a method number" summary="Three traps that make impressive numbers mean less">
        <Drop title="Percent of cases correct versus per-residue score">
          <p>
            Co-folding and docking papers count a complex as right when its <GlossaryTerm>DockQ</GlossaryTerm> is at least 0.23. The challenge instead scores each residue with <GlossaryTerm>PR-AUC</GlossaryTerm>. A program that places a nanobody correctly 30% of the time is not 30% good on the residue score: when it is wrong, it is wrong about the whole site.
          </p>
        </Drop>
        <Drop title="Leakage: did the program already see the answer?">
          <p>
            Each engine has a training cutoff date. Structures released before it may have been memorised. Only two public HER2 nanobody structures, 9MTE and 9MTX (released 2025-11-19), are known to post-date the engines. The challenge rules say leakage from public data is &quot;not an issue as long as the answer is correct&quot;, but we need leakage-free proxies to know what really works. See <GlossaryTerm>leakage</GlossaryTerm>.
          </p>
        </Drop>
        <Drop title="Prevalence: the random score is tiny on HER2">
          <p>
            On HER2 only about 3-5% of residues are in the interface, so random guessing scores about 0.03-0.05 on the antigen chain, and the nanobody chain is 15-23% in the hive&apos;s planning table. A score of 0.2 is therefore several times random on the antigen, but a gap between two teams of less than about 0.07-0.16 on three test complexes is mostly luck. The score is one number per complex, <GlossaryTerm id="macro-average">macro-averaged</GlossaryTerm>.
          </p>
          <Source path={["research/q6_epitope_ml_methods/residue_level_pr_auc_with_prevalence_0_1_calibration_ranking_and_aggregation_tricks.json", "research/q9_serendipity_cross_domain/_QUEEN_DIGEST.md"]} />
        </Drop>
      </Drop>

      <h2>Why the average over seeds beats the maximum</h2>
      <p>
        A <GlossaryTerm>seed</GlossaryTerm> is the random starting number that makes a structure program give a slightly different answer each time. The temptation is to run many seeds and keep the best-looking result. The honest alternative is the <GlossaryTerm>consensus</GlossaryTerm>: how often each residue ends up in the interface across all runs. Play with the toy model below.
      </p>
      <SeedDemo />
      <Source path={["research/_meta/king_infer_KINGLOG.md", "research/q5_structure_prediction_docking/alphafold3_openfold3_boltz2_chai1_protenix_nanobody_antigen_benchmarks_and_success_rates.json"]} note="The demo itself is a synthetic toy and is not a hive result." />
      <Callout tone="warn" title="Honest limits">
        <p>
          No one has measured seed consensus on HER2 nanobodies. The first real test is on the two leakage-free proxy complexes; the idea is dropped if it does not beat a single best-ranked model there. Seed counts and GPU hours for the challenge are extrapolations, not measurements.
        </p>
      </Callout>
    </>
  );
}
