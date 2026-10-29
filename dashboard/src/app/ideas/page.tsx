import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import GlossaryTerm from "@/components/GlossaryTerm";
import IdeaCards from "@/components/methods/IdeaCards";
import CaspTimeline from "@/components/methods/CaspTimeline";

export const metadata = { title: "Ideas | SEPIQ 2026 Intelligence" };

export default function Page() {
  return (
    <>
      <PageHead
        title="Ideas from other fields"
        lede="Other fields have solved the same kind of puzzle: finding where two things touch from weak, noisy clues. Each card says what we borrowed, how honest the borrowing is, and how it would be killed."
      />
      <Callout tone="key" title="The takeaway">
        <p>
          Every lens the hive tried returned some version of <b>partly holds</b>. None produced a method that clearly beats a plain nanobody-loop prior plus a structure-based guess for the antigen. The shared break is simple: the training data have one antigen and one round of selection, so they say a lot about the nanobodies and almost nothing about where on HER2 they land.
        </p>
      </Callout>
      <Drop title="What the four verdict labels mean" summary="holds, partly holds, breaks, not yet tested">
        <ul>
          <li><b>Holds</b>: evidence in the hive supports it, or it is a practice rather than a model.</li>
          <li><b>Partly holds</b>: some of it transfers and some of it breaks.</li>
          <li><b>Breaks</b>: a test or the structure of our data already showed it does not work for the challenge.</li>
          <li><b>Not yet tested</b>: proposed with a kill test, no run yet. We use this label instead of guessing.</li>
        </ul>
        <p>A kill test is a pre-agreed result that retires the idea. Scores are on a handful of public proxy complexes under <GlossaryTerm>leave-one-complex-out</GlossaryTerm> testing, using <GlossaryTerm>PR-AUC</GlossaryTerm>.</p>
      </Drop>

      <h2>The idea cards</h2>
      <IdeaCards />

      <h2>How the field of structure prediction grew</h2>
      <p>
        The CASP contest has judged blind <GlossaryTerm>structure prediction</GlossaryTerm> since 1994. Jumps came mostly from changing what the model was fed or asked to predict: evolutionary co-variation (<GlossaryTerm>MSA</GlossaryTerm>, <GlossaryTerm>coevolution</GlossaryTerm>), then distance maps, then end-to-end training. That is why the user suspected a data-representation breakthrough. In our case the hive tested it four ways and the antigen side did not respond. Click a dot to read it.
      </p>
      <CaspTimeline />
      <Callout tone="kill" title="Where the CASP analogy stops">
        <p>
          CASP methods got their gain from alignments of many related proteins that carry co-variation between positions. Our <GlossaryTerm>NGS</GlossaryTerm> data have many related nanobodies but a single antigen, so there is no partner-side co-variation to learn from.
        </p>
        <Source path="research/q9_serendipity_cross_domain/_QUEEN_DIGEST.md" />
      </Callout>
    </>
  );
}
