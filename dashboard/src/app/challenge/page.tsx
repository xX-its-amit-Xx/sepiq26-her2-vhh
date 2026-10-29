import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import GlossaryTerm from "@/components/GlossaryTerm";
import ChStyles from "@/components/challenge/Styles";
import Rich from "@/components/challenge/Rich";
import Runbook, { type RunDay } from "@/components/challenge/Runbook";
import Register, { type Failure } from "@/components/challenge/Register";
import TiesTrap from "@/components/challenge/TiesTrap";
import PowerBars from "@/components/challenge/PowerBars";
import { mdTable, readJson, readRel } from "@/components/challenge/server";

export const metadata = { title: "Challenge | SEPIQ 2026 Intelligence" };

const Q8 = "research/q8_compute_validation_execution/";
const RUNBOOK = Q8 + "day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md";
const LADDER = Q8 + "five_submission_ladder_and_cluster_bootstrap_decision_rules_for_n_equals_3.md";

function submitTag(...texts: string[]): string | null {
  for (const t of texts) {
    const m = t.match(/\b(S[1-5])\s+upload/i) ?? t.match(/upload\s+(S[1-5])\b/i);
    if (m) return `${m[1].toUpperCase()} upload`;
  }
  return null;
}

function loadRunbook(): RunDay[] {
  const t = readRel(RUNBOOK);
  if (!t) return [];
  return mdTable(t, "Day |")
    .filter((r) => r.length >= 6 && /^D\d+/.test(r[0]))
    .map((r) => ({ id: r[0], date: r[1], label: r[1], deliverable: r[2], owner: r[3], compute: r[4], gate: r[5], submit: submitTag(r[2], r[5]) }));
}

function loadFailures(): Failure[] {
  const t = readRel(RUNBOOK);
  const rows = t ? mdTable(t, "# |").filter((r) => r.length >= 7 && /^\d+$/.test(r[0])) : [];
  if (rows.length === 21) return rows.map((r) => ({ n: Number(r[0]), mode: r[1], p: r[2], i: r[3], signal: r[4], mitigation: r[5], owner: r[6] }));
  const j = readJson<Failure[]>(Q8 + "day_by_day_runbook_to_2026_10_31_and_failure_mode_register.json");
  return j ?? [];
}

function loadLadder(file: string, header: string) {
  const t = readRel(file);
  return t ? mdTable(t, header).filter((r) => r.length >= 4) : [];
}

const SCORER: { q: string; options: string; why: string; src: string }[] = [
  { q: "Are the two chains of a complex pooled into one curve?", options: "One PR-AUC per complex over HER2 plus nanobody residues, or two curves averaged", why: "A CDR-only prior scores about 0.64 on the nanobody alone but about 0.34 per complex when pooled; the easy nanobody side can dominate a pooled score.", src: "research/q6_epitope_ml_methods/_QUEEN_DIGEST.md" },
  { q: "How is the area under the PR curve computed?", options: "Step-sum average precision, or trapezoid", why: "A constant predictor scores about 0.04 with the step-sum and about 0.52 with the trapezoid. Sparse files full of tied zeros are inflated under the trapezoid.", src: "model/README.md" },
  { q: "Which variant ranks the leaderboard?", options: "Unweighted, area-weighted, or both", why: "The guideline defines both; the detail page names the official metric for the baseline only, and two readings of the same page disagree.", src: Q8 + "day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md" },
  { q: "Which of the five uploads is scored?", options: "The latest, the best by score, or a team-designated one", why: "The Space code stores every upload and never overwrites; no source we opened says which counts. This decides whether the first four uploads are insurance or real bets.", src: LADDER },
  { q: "What does the confidence test resample?", options: "Residues, contact patches, or whole complexes", why: "Residue resampling ignores spatial correlation (too optimistic); a 3-complex cluster bootstrap has only 10 distinct resamples and a 14% false-positive rate in our simulation.", src: LADDER },
  { q: "Is any score shown before judging?", options: "No feedback, or score added later", why: "The Space code shows only a confirmation (team, user, targets, time). The audit marks this as unknown rather than stated, so we plan for no feedback.", src: "research/_meta/predator_audit.md" },
];

const CONTRA: { item: string; a: string; b: string; status: string; tone: "good" | "warn" | "bad"; src: string }[] = [
  { item: "HER2 interface base rate", a: "0.126 (the SARS-CoV-2 RBD proxy, 26/206)", b: "0.029 to 0.055 of 618 antigen residues on real HER2 proxies", status: "Resolved: use about 0.04", tone: "good", src: "model/README.md" },
  { item: "Number of test complexes", a: "Home page: seven antibodies", b: "Detail and guideline pages: three (ONU11, ONU13, ONU23)", status: "Resolved: the home page is stale", tone: "good", src: "research/q4_challenge_intelligence/_QUEEN_DIGEST.md" },
  { item: "Size of the labelled training set", a: "Brief: a few hundred labels", b: "Recount of the real table: 19,367 labelled (7,316 yes, 12,051 no)", status: "Resolved: use 19,367", tone: "good", src: "research/_meta/predator_audit.md" },
  { item: "Antigen chain length in the template", a: "618 (inferred from published file sizes)", b: "630 (printed construct) or 624 (sequence)", status: "Open: template files are gated", tone: "warn", src: "research/q4_challenge_intelligence/_QUEEN_DIGEST.md" },
  { item: "Which PR-AUC variant ranks", a: "Detail page names no official metric", b: "Guideline lists unweighted and area-weighted", status: "Open: report both", tone: "warn", src: "research/q4_challenge_intelligence/_QUEEN_DIGEST.md" },
  { item: "Which upload counts", a: "Latest", b: "Best of five", status: "Open: question drafted for the Space discussion tab", tone: "warn", src: LADDER },
  { item: "Results and ranking date", a: "Results announced 2026-12-15 (detail page)", b: "Ranking release 1 December (Space text)", status: "Open, not material to the submission", tone: "warn", src: "research/_meta/king_infer_KINGLOG.md" },
  { item: "Voronota-LT version", a: "Guideline cites v1.1.479", b: "Our proxy labels used v1.1.497", status: "Open: a version effect is not excluded", tone: "warn", src: "model/README.md" },
  { item: "Which public proxies are leakage-free", a: "Runbook: only 9MTE and 9MTX", b: "Validation file: all four pass the date cutoff; 7QVK is in one engine's window", status: "Kept both labels; 9MTE and 9MTX are primary", tone: "warn", src: "research/_meta/king_infer_KINGLOG.md" },
  { item: "Two ladders in the q8 files", a: "Runbook ladder: S1 floor, S2 co-fold, S3 plus NGS, S4 frozen, S5 hedge", b: "Ladder-rules file: S1 baseline, S2 plus NGS, S3 ensemble, S4 calibrated, S5 reserve", status: "Open: runbook ladder is shown first, the other below it", tone: "warn", src: LADDER },
  { item: "Fab chains in 9MTE and 9MTX", a: "One ERBB research note says they contain Fabs", b: "RCSB entity lists: only nanobodies plus HER2", status: "Resolved: that note is quarantined", tone: "good", src: "research/_meta/quarantine.json" },
];

export default function Page() {
  const days = loadRunbook();
  const failures = loadFailures();
  const ladder = loadLadder(RUNBOOK, "Rung |");
  const ladder2 = loadLadder(LADDER, "Rung |");

  return (
    <>
      <ChStyles />
      <PageHead
        title="The challenge"
        lede="Three secret protein complexes, one filing deadline, five uploads, and no score back. Here is the rulebook, the plan to 30 October, and what could go wrong."
      />

      <Callout tone="key" title="The five facts a busy reader needs">
        <ul>
          <li>Exactly <b>three</b> test complexes: <GlossaryTerm id="onu11">ONU11</GlossaryTerm>, <GlossaryTerm id="onu13">ONU13</GlossaryTerm> and <GlossaryTerm id="onu23">ONU23</GlossaryTerm>. Answers come from cryo-EM structures revealed only after judging.</li>
          <li>The submission window closes <b>2026-10-31</b>; we plan the last upload for about 2026-10-30.</li>
          <li>The portal (as far as its public code shows) returns <b>no score</b>, so the five uploads are checkpoints, not experiments.</li>
          <li>With only three test cases, gaps smaller than roughly 0.1 in the score are noise.</li>
          <li>Real HER2 interfaces cover about 3 to 5% of residues, so a random guess scores very low.</li>
        </ul>
        <Source path="research/q4_challenge_intelligence/_QUEEN_DIGEST.md" />
      </Callout>

      <h2>Rules and tracks</h2>
      <Drop title="Track A: residue-level prediction (the one we are entering)" summary="A probability for every residue, one CSV per complex, up to 5 uploads" defaultOpen>
        <ul>
          <li>For each complex, give a 0 to 1 probability that each HER2 residue (chain A) and each nanobody residue (chain B) touches its partner. Columns: <code>chain, seqNum, resName, prediction</code>. Omitted residues count as 0.</li>
          <li>Up to <b>5 submissions per team</b>, teams of up to 10, a Hugging Face account to submit. Prizes of $3,000, $2,000 and $1,000.</li>
          <li>Only <b>public</b> outside data is allowed (<GlossaryTerm id="pdb">PDB</GlossaryTerm>, <GlossaryTerm id="sabdab">SAbDab</GlossaryTerm> and similar), and inputs and settings must be documented. Co-folding engines such as <GlossaryTerm id="alphafold3">AlphaFold3</GlossaryTerm>, <GlossaryTerm id="boltz">Boltz</GlossaryTerm> and <GlossaryTerm id="chai">Chai-1</GlossaryTerm> are explicitly allowed.</li>
          <li>Leakage from public data is stated to be &quot;not an issue as long as the answer is correct&quot;, so we still disclose it honestly in each upload&apos;s notes.</li>
          <li>The portal checks only the four header names; it does not check the 0 to 1 range, row counts or the five-upload cap. Local validation is our only safety net.</li>
        </ul>
        <Source path={["BRIEF.md", "research/q4_challenge_intelligence/_QUEEN_DIGEST.md", LADDER]} />
      </Drop>
      <Drop title="Track B: atomic-level structures (not entered)" summary="Predicted 3D complexes judged by CAPRI; closed for this deadline">
        <p>Track B asks for full predicted complex structures, judged with <GlossaryTerm id="capri">CAPRI</GlossaryTerm> procedures and <GlossaryTerm id="dockq">DockQ</GlossaryTerm>. The round number, models per target and whether the answer structures will be released are unconfirmed. The hive closed this track for the 2026-10-31 deadline.</p>
        <Source path={["research/q4_challenge_intelligence/_QUEEN_DIGEST.md", "hive/EMPEROR.md"]} />
      </Drop>
      <Drop title="The metric, in plain words" summary="Precision-recall area per complex, averaged over three complexes">
        <p>Think of ranking residues from most to least likely to touch. <GlossaryTerm id="precision">Precision</GlossaryTerm> asks how many of your top picks were right; <GlossaryTerm id="recall">recall</GlossaryTerm> asks how many true contacts you found. <GlossaryTerm id="pr-auc">PR-AUC</GlossaryTerm> is the area under that trade-off. Each complex is scored on its own and the three scores are <GlossaryTerm id="macro-average">macro-averaged</GlossaryTerm>, never pooled.</p>
        <p>There are two variants: unweighted, and <GlossaryTerm id="area-weighted-metric">area-weighted</GlossaryTerm>, where recall counts each true residue by its <GlossaryTerm id="voronota-lt">Voronota-LT</GlossaryTerm> contact area. Close results are to be settled with a <GlossaryTerm id="paired-cluster-bootstrap">paired bootstrap</GlossaryTerm> (B=2000, 95% interval).</p>
        <p>The organisers&apos; own baseline, <GlossaryTerm id="antibinder">AntiBinder</GlossaryTerm>, is quoted at 0.176 on a SARS-CoV-2 proxy where 12.6% of residues are positives. A shuffle simulation on that entry gives mean 0.147 with a standard deviation of 0.032, so random guessing reaches 0.176 about 16% of the time.</p>
        <Source path={["BRIEF.md", "research/q6_epitope_ml_methods/_QUEEN_DIGEST.md"]} />
      </Drop>

      <h2>Scorer ambiguity: six unknowns that can change the winner</h2>
      <p>The organisers have not published scoring code. Each row below is a fork we cannot resolve from public pages, and each one can reorder close entries. We report every variant locally and prefer entries that win under all of them.</p>
      <div className="ch-scroll">
        <table>
          <thead><tr><th>Question</th><th>Possible answers</th><th>Why it matters</th></tr></thead>
          <tbody>
            {SCORER.map((r) => (
              <tr key={r.q}>
                <td><b><Rich>{r.q}</Rich></b></td>
                <td><Rich>{r.options}</Rich></td>
                <td><Rich>{r.why}</Rich><Source path={r.src} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Try it: how the averaging rule can flip a ranking</h3>
      <TiesTrap />

      <h3>How big a gain can three test complexes even detect?</h3>
      <PowerBars />

      <h2>The five-submission ladder</h2>
      <p>Because no score comes back, each rung is judged only on local proxy complexes before it is uploaded. A rung that fails its test is not uploaded, and the slot is kept.</p>
      {ladder.length === 0 && <Callout tone="warn" title="Ladder not available">The runbook file was not found at build time.</Callout>}
      <div className="ch-grid">
        {ladder.map((r, i) => (
          <div key={r[0]} className={`ch-card ch-rung${i === 4 ? " s5" : ""}`}>
            <Pills items={[{ text: r[1], tone: "info" }, ...(i === 4 ? [{ text: "reserve", tone: "warn" as const }] : [])]} />
            <h3>{r[0]}</h3>
            <p><b>Content.</b> <Rich>{r[2]}</Rich></p>
            <Drop title="Kill or promote rule" summary="When this rung is dropped or becomes the primary">
              <p><Rich>{r[3]}</Rich></p>
            </Drop>
          </div>
        ))}
      </div>
      <Source path={RUNBOOK} note="Section: 5-submission ladder with kill criteria." />
      <Callout tone="warn" title="Before trusting the order">
        If the organisers confirm that the latest upload is the one scored, the real candidate must be uploaded last (S5 repeats the S4 content). If the best of five counts, the order above stands.
      </Callout>
      {ladder2.length > 0 && (
        <Drop title="A second ladder from the ladder-rules file" summary="Different content per rung, with advance and kill thresholds">
          <div className="ch-scroll">
            <table>
              <thead><tr><th>Rung</th><th>Date</th><th>Content</th><th>Advance when</th><th>Kill or revert when</th></tr></thead>
              <tbody>
                {ladder2.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td><td className="ch-num">{r[1]}</td><td><Rich>{r[2]}</Rich></td><td><Rich>{r[3]}</Rich></td><td><Rich>{r[4] ?? ""}</Rich></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Stop-loss in that file: if two consecutive rungs fail their advance test, freeze at the incumbent and spend the remaining days on documentation and a proxy audit.</p>
          <Source path={LADDER} note="Section 4, the ladder. Dates and content differ from the runbook ladder; see the contradictions table." />
        </Drop>
      )}

      <h2>Day-by-day runbook to 30 October</h2>
      <p>Tick days off as they finish. Your ticks stay in this browser only. The final upload is planned for 2026-10-30 (06:00 UTC in the runbook); 31 October is a buffer because the deadline time zone is unstated.</p>
      {days.length > 0 ? <Runbook days={days} /> : <Callout tone="warn" title="Runbook not available">The runbook file was not found at build time.</Callout>}
      <Source path={RUNBOOK} />

      <h2>Failure-mode register</h2>
      <p>Twenty-one ways this could go wrong, with the early warning sign and the planned fix. Filter by severity and open a row for details.</p>
      {failures.length > 0 ? <Register rows={failures} /> : <Callout tone="warn" title="Register not available">The register file was not found at build time.</Callout>}
      <Source path={RUNBOOK} note="Failure-mode register table." />

      <h2>Open contradictions</h2>
      <p>Places where our own sources disagree. Resolved rows say which side we adopted; open rows are carried forward.</p>
      <div className="ch-scroll">
        <table>
          <thead><tr><th>Topic</th><th>One side</th><th>Other side</th><th>Status</th></tr></thead>
          <tbody>
            {CONTRA.map((c) => (
              <tr key={c.item}>
                <td><b><Rich>{c.item}</Rich></b></td>
                <td><Rich>{c.a}</Rich></td>
                <td><Rich>{c.b}</Rich></td>
                <td><Pills items={[{ text: c.status, tone: c.tone }]} /><Source path={c.src} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
