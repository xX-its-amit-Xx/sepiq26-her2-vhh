import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Pipeline from "@/components/assay/Pipeline";
import EnrichmentSim from "@/components/assay/EnrichmentSim";
import PrAucLab from "@/components/assay/PrAucLab";
import FourFailures from "@/components/assay/FourFailures";
import s from "@/components/assay/assay.module.css";

export const metadata = { title: "How labels are made | SEPIQ 2026 Intelligence" };

const G = GlossaryTerm;

export default function Page() {
  return (
    <>
      <PageHead
        title="How the labels are made, and where they lie"
        lede="The training labels say which nanobodies got more common after one round of fishing on HER2. The answer key says which residues touch in a 3D picture. Neither tells you what a model might hope they do."
      />

      <Callout tone="key" title="The short version">
        <ul>
          <li>A &quot;binder&quot; label means only that a nanobody sequence became more common after a single panning round on whole HER2. It does not say where on HER2 it binds.</li>
          <li>The table is big (1,843,875 sequences, 19,367 labelled), but only 49.5% of Yes labels were confirmed by a replicate.</li>
          <li>The answer key comes from a cryo-EM structure turned into a list of touching residues. About 3 to 5% of HER2 residues are expected to touch, so a random guess scores near 0.04.</li>
          <li>Four attempts to squeeze HER2-residue information out of the sequence data all failed.</li>
        </ul>
      </Callout>

      <section className={s.sec} id="pipeline">
        <h2>From animal to answer key</h2>
        <p>
          Click any step. Each opens to the physical mechanism, where noise creeps in, the controls that exist, and the traps for anyone building a model. The top row makes the training labels; the bottom row makes the test truth.
        </p>
        <Pipeline />
      </section>

      <section className={s.sec} id="enrichment">
        <h2>How often does the enrichment test cry wolf?</h2>
        <p>
          Every label rests on one test of before-and-after read counts. The test was built for large counts. Most clones in this experiment have only a handful of reads, which is where it misbehaves. Slide the read count down and watch the false-binder probability climb.
        </p>
        <EnrichmentSim />
        <Drop title="Why does a test with a 5% error rate cause so much trouble?">
          <p>
            Because true binders are rare. If only 3 in 100 tested clones are real binders, a test that wrongly flags even 5% of the other 97 produces about 5 false calls for every 3 true ones. This is the base-rate effect: the share of &quot;binder&quot; calls that are real depends on how rare real binders are, not just on the test&apos;s error rate. The hive&apos;s estimate for a 3% prior is that only about 27% of binder calls would be right (an estimate from assumptions, not a measurement). See the <G>z-test</G> and <G>base rate</G> entries in the glossary.
          </p>
        </Drop>
      </section>

      <section className={s.sec} id="metric">
        <h2>What a score means when the base rate is tiny</h2>
        <p>
          The contest score is PR-AUC, averaged over three complexes. Its chance level is the share of residues that truly touch, which is small on HER2. Slide the prevalence to see how the chance level moves, then see how wide the spread is with only three complexes to average.
        </p>
        <PrAucLab />
      </section>

      <section className={s.sec} id="failures">
        <h2>Four ways the &quot;data representation&quot; thesis failed</h2>
        <p>
          The hope was that the sequence data, repackaged cleverly, would reveal the interface without needing a structure predictor. It was a testable idea, it was tested, and the answer is no. That negative result is itself useful: it tells the team not to spend GPU time on it.
        </p>
        <FourFailures />
      </section>
    </>
  );
}
