import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import Labs from "@/components/structures/Labs";
import AnswerKey from "@/components/structures/AnswerKey";
import Anatomy from "@/components/structures/Anatomy";

export const metadata = { title: "3D lab | SEPIQ 2026 Intelligence" };

export default function Page() {
  return (
    <>
      <PageHead title="3D lab" lede="Look at the molecules: the cancer protein HER2, the tiny antibodies that grip it, and the answer sheet we are being graded against." />
      <Pills
        items={[
          { text: "3 hidden test complexes: ONU11, ONU13, ONU23", tone: "info" },
          { text: "4 public HER2-nanobody structures", tone: "plain" },
          { text: "Structures load live from RCSB", tone: "plain" },
        ]}
      />

      <Callout tone="key" title="The one-minute version">
        <p>
          The challenge asks us to guess, for three nanobodies, which spots on <GlossaryTerm id="her2">HER2</GlossaryTerm> they grab (the <GlossaryTerm id="epitope">epitope</GlossaryTerm>) and which letters of the nanobody do the grabbing (the <GlossaryTerm id="paratope">paratope</GlossaryTerm>). Only
          a small patch of HER2 is touched: roughly 3 to 6 residues in every 100. Public structures show us a few real examples, so this page lets you rotate them, switch layers on and off, and see exactly what the scoring table looks like.
        </p>
      </Callout>

      <Drop title="New to this? What is a nanobody, an epitope and a structure?" summary="Plain-language primer">
        <p>
          A <GlossaryTerm id="nanobody">nanobody</GlossaryTerm> is a very small antibody from camels and alpacas. A protein such as HER2 is a long chain of building blocks (residues) folded into a 3D shape. When a nanobody binds, a few
          residues on each partner sit close together. Those are the interface, the thing we must predict. Scientists see it by freezing the complex and imaging it (<GlossaryTerm id="cryo-em">cryo-EM</GlossaryTerm>) or by X-ray crystallography.
        </p>
        <Drop title="What does the colour code mean?">
          <p>Magenta marks HER2 contact residues (the epitope). Teal and violet shades mark nanobody loops. Yellow marks nanobody framework residues that also touch the target. Orange marks the surface HER2 shares with its natural partners. Every layer has its own switch.</p>
        </Drop>
        <Drop title="Does this page work offline?">
          <p>The molecules are downloaded from the public RCSB archive when you open a scene, so they need an internet connection. Nothing large is stored on this site.</p>
        </Drop>
      </Drop>

      <h2>The 3D scenes</h2>
      <p>Choose a scene, then use the switches. Click any residue in the lists to fly the camera to it.</p>
      <Labs />
      <Source path={["research/q1_her2_biology/her2_public_complexes.json", "research/q1_her2_biology/her2_ecd_per_residue_antibody_coverage.json"]} note="All footprints, areas and coverage counts on this page come from these files. HER2 residue numbers are standard UniProt numbers (P04626)." />

      <Callout tone="warn" title="Read the layers with care">
        <p>
          The heat map counts how many public antibodies touched each residue, so it shows where people have looked, not where binding is possible. The dimer patch is computed from structures of HER2 paired with relatives. If the challenge antigen is a single copy, that patch is probably open to nanobodies. That is an inference from our notes, not a confirmed fact.
        </p>
      </Callout>

      <h2>What the answer key looks like</h2>
      <AnswerKey />

      <h2>Nanobody anatomy explorer</h2>
      <Anatomy />

      <h2>What this page cannot tell you</h2>
      <Drop title="Limits of the structures" summary="Four public nanobody structures, three of them very similar">
        <p>
          Only four public HER2-nanobody structures exist (entries 5MY6, 7QVK, 9MTE and 9MTX; 9MTE holds two nanobodies). Entries 9MTE and 9MTX were released on 2025-11-19, so they are leakage-free stand-ins for the hidden test complexes. Two of the nanobodies (27A05 and 29E09) cover similar ground on domains I and III, so the examples are not fully independent.
        </p>
        <Drop title="Why some residues look missing in a scene">
          <p>
            Some floppy stretches are never resolved in a structure. The domain I loop at residues 121 to 134 is missing in essentially every entry, and domain IV&apos;s tail is missing in many. Residues in those stretches cannot be drawn.
          </p>
          <Source path="research/q1_her2_biology/her2_ectodomain_architecture_domains_I_to_IV_and_structures.md" />
        </Drop>
        <Drop title="Why footprint sizes differ between methods">
          <p>
            The 4 Å list counts a residue if any atom comes within four angstroms of the partner. The Voronota-LT list counts any non-zero contact area, so it is larger. The challenge key uses Voronota-LT contact areas, so the wider list is the closer match.
          </p>
        </Drop>
      </Drop>
    </>
  );
}
