"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import GlossaryTerm from "@/components/GlossaryTerm";
import Pills from "@/components/Pills";
import Source from "@/components/Source";
import { ROUTES } from "@/lib/routes";

const DEADLINE_UTC = Date.UTC(2026, 9, 31, 23, 59, 59); // 2026-10-31; time zone not stated by organisers (hive q8)
const BRIEF_DAYS = 14; // value written in BRIEF.md on 2026-10-17, used until the browser clock is read

type Tile = { big: string; label: React.ReactNode; sub: React.ReactNode; tone: "her2" | "vhh" | "amber"; detail: React.ReactNode; src: string[] };

const SUBS: { n: string; when: string; what: string; state: string; tone: "good" | "info" | "plain" | "warn" }[] = [
  { n: "S1", when: "Oct 20", what: "Safe baseline (CDR and surface prior)", state: "Built and validated locally; not uploaded", tone: "good" },
  { n: "S2", when: "Oct 24", what: "Baseline plus structure-prediction blend, only if it helps", state: "Planned", tone: "info" },
  { n: "S3", when: "Oct 26", what: "Best blend of the arms that passed their gates", state: "Planned", tone: "plain" },
  { n: "S4", when: "Oct 29", what: "The real candidate, after QA", state: "Planned", tone: "plain" },
  { n: "S5", when: "Oct 30, by 06:00 UTC", what: "Reserve or hedge, only if S4's stored files are fine", state: "Planned", tone: "plain" },
];

const RISKS: { rank: number; light: "red" | "amber"; title: string; plain: string; p: string; i: string; fix: string }[] = [
  { rank: 2, light: "red", title: "Residue numbering off by a few positions", plain: "If our numbering is shifted, every score lands on the wrong residue and the portal will not warn us.", p: "High", i: "High", fix: "Round-trip test and a strict validator (built; self-test of 24 cases passes)." },
  { rank: 9, light: "red", title: "Practice tests look better than they are", plain: "Two of our four public practice structures were seen by the prediction engines during training, which inflates scores.", p: "High", i: "High", fix: "Judge on the two clean structures (9MTE, 9MTX) and state the leakage openly." },
  { rank: 1, light: "amber", title: "Upload fails halfway", plain: "The portal sends three files in separate calls, so one or two can be saved and the rest lost.", p: "Medium", i: "High", fix: "Upload the baseline early to test the flow; retry the whole set; keep receipts." },
  { rank: 19, light: "amber", title: "Our scorer is wrong", plain: "We do not know exactly how the organisers score, and a mistake in our copy would mislead every decision.", p: "Medium", i: "High", fix: "Check our scorer against a library and report every scoring variant." },
  { rank: 10, light: "amber", title: "All three antibodies get the same answer", plain: "If the model paints one patch for all three antibodies, a single wrong guess is paid for three times.", p: "Medium", i: "High", fix: "Predict each antibody separately; keep a low-variance hedge for S5." },
];

export default function Page() {
  const [days, setDays] = useState<number>(BRIEF_DAYS);
  useEffect(() => {
    const t = setTimeout(() => {
      setDays(Math.max(0, Math.ceil((DEADLINE_UTC - Date.now()) / 86400000)));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const tiles: Tile[] = [
    {
      big: String(days),
      label: "days left",
      sub: "Track A closes 31 Oct 2026; our last upload is planned for 30 Oct",
      tone: "amber",
      detail: (
        <p>
          The organisers do not state a time zone, so the plan treats 30 Oct 06:00 UTC as the safe last upload. Results are announced 15 Dec 2026.
        </p>
      ),
      src: ["BRIEF.md", "research/q8_compute_validation_execution/day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md"],
    },
    {
      big: "3",
      label: "test complexes",
      sub: "ONU11, ONU13 and ONU23 are the only targets we are graded on",
      tone: "her2",
      detail: (
        <p>
          With only three answers, a score gap smaller than about 0.1 is mostly luck, so the plan stays simple and robust. The <GlossaryTerm id="cryo-em">cryo-EM</GlossaryTerm> structures that define the truth are released only after judging.
        </p>
      ),
      src: ["BRIEF.md", "research/q8_compute_validation_execution/_QUEEN_DIGEST.md"],
    },
    {
      big: "3-5%",
      label: "of HER2 surface is the answer",
      sub: (
        <>
          Base rate for the <GlossaryTerm id="interface">interface</GlossaryTerm>; guessing at random scores about this
        </>
      ),
      tone: "her2",
      detail: (
        <p>
          Measured on five public practice complexes: 2.9% to 5.5%, mean 4.2% of the 618 modelled HER2 residues. The 12.6% figure quoted elsewhere applies to one entry only (8GZ5, a different region of HER2). On the antibody side the rate is higher, 11% to 22%.
        </p>
      ),
      src: ["model/README.md"],
    },
    {
      big: "19,367",
      label: "labelled antibodies",
      sub: (
        <>
          of 1,843,875 <GlossaryTerm id="vhh">VHH</GlossaryTerm> sequences; 7,316 Yes, 12,051 No
        </>
      ),
      tone: "vhh",
      detail: (
        <p>
          The labels say whether an antibody enriched during <GlossaryTerm id="biopanning">biopanning</GlossaryTerm>, not where it touches HER2. We tested four ways to squeeze per-residue information from the <GlossaryTerm id="ngs">NGS</GlossaryTerm> data and all four failed, so the HER2 side must come from structure.
        </p>
      ),
      src: ["hive/EMPEROR.md"],
    },
    {
      big: "0.18-0.23",
      label: "best-known method scores",
      sub: (
        <>
          <GlossaryTerm id="pr-auc">PR-AUC</GlossaryTerm>: organiser baseline 0.176; best published surface predictor 0.232
        </>
      ),
      tone: "amber",
      detail: (
        <>
          <p>
            The 0.176 is the organisers&apos; own test on one entry; random guessing reaches it about 16% of the time, so it is only about 1.2 times random. The 0.232 (DiscoTope-3.0) is for antibody-blind prediction at 6.4% base rate, about 3.6 times random. Neither number is a prediction for ONU11, 13 or 23.
          </p>
        </>
      ),
      src: ["research/q6_epitope_ml_methods/_QUEEN_DIGEST.md", "BRIEF.md"],
    },
    {
      big: "0.389",
      label: "our floor score",
      sub: "Practice-set PR-AUC of the safe baseline; random would give about 0.10",
      tone: "vhh",
      detail: (
        <>
          <p>
            Split by side: HER2 surface 0.082 (random 0.051, not statistically distinguishable), antibody side 0.692 (random 0.203). Nearly all of the gain comes from knowing which antibody loops usually bind. These are proxy numbers on five known complexes, not a forecast, and the portal returns no score.
          </p>
        </>
      ),
      src: ["model/README.md"],
    },
  ];

  return (
    <div className="home">
      <style>{`
        .home h2 { font-size: 1.25rem; margin: 2.2rem 0 0.6rem; }
        .home .hero { padding: 1.2rem 0 0.4rem; border-left: 4px solid var(--her2); padding-left: 1rem; margin-bottom: 1rem; }
        .home .hero h1 { font-size: clamp(1.7rem, 5.5vw, 2.6rem); line-height: 1.15; margin: 0 0 0.5rem; }
        .home .hero p { font-size: 1.1rem; color: var(--ink-2); margin: 0.3rem 0; max-width: 46rem; }
        .home .four { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 0.7rem; margin-top: 1rem; }
        .home .four > div { background: var(--panel); border: 1px solid var(--hair); border-radius: 8px; padding: 0.7rem 0.9rem; }
        .home .four b { font-family: var(--font-head); display: block; color: var(--her2); font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.2rem; }
        .home .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 0.8rem; }
        .home .tile { background: var(--panel); border: 1px solid var(--hair); border-top: 5px solid var(--vhh); border-radius: 8px; padding: 0.8rem 0.9rem 0.5rem; min-width: 0; }
        .home .tile.her2 { border-top-color: var(--her2); } .home .tile.amber { border-top-color: var(--amber); }
        .home .tile .big { font-family: var(--font-head); font-weight: 700; font-size: clamp(2.3rem, 9vw, 3.1rem); line-height: 1; color: var(--ink); overflow-wrap: anywhere; }
        .home .tile .lab { font-family: var(--font-head); font-weight: 600; margin-top: 0.25rem; }
        .home .tile .sub { color: var(--ink-2); font-size: 0.9rem; margin: 0.2rem 0 0.4rem; }
        .home .tile .drop { margin: 0.3rem 0; background: var(--bg); }
        .home .tile .drop summary { padding: 0.4rem 0.6rem; font-size: 0.85rem; }
        .home .tile .drop-body { padding: 0 0.7rem 0.6rem 0.7rem; font-size: 0.9rem; }
        .home .strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr)); gap: 0.5rem; list-style: none; padding: 0; margin: 0; }
        .home .strip li { background: var(--panel); border: 1px solid var(--hair); border-radius: 8px; padding: 0.6rem 0.7rem; position: relative; min-width: 0; }
        .home .strip .n { font-family: var(--font-head); font-weight: 700; font-size: 1.4rem; }
        .home .strip .when { font-family: var(--font-head); font-size: 0.8rem; color: var(--ink-3); }
        .home .strip .what { font-size: 0.88rem; margin: 0.25rem 0 0.4rem; }
        .home .risk-head { display: flex; align-items: center; gap: 0.7rem; width: 100%; }
        .home .light { flex: none; width: 1.1rem; height: 1.1rem; border-radius: 50%; border: 2px solid var(--ink); }
        .home .light.red { background: var(--bad); } .home .light.amber { background: var(--amber); }
        .home .risk-meta { font-size: 0.8rem; color: var(--ink-3); font-family: var(--font-head); font-weight: 400; }
        .home .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 0.7rem; }
        .home .links a { display: block; text-decoration: none; color: var(--ink); background: var(--panel); border: 1px solid var(--hair); border-left: 5px solid var(--vhh); border-radius: 8px; padding: 0.9rem 1rem; min-width: 0; }
        .home .links a:hover, .home .links a:focus-visible { border-color: var(--her2); border-left-color: var(--her2); }
        .home .links strong { font-family: var(--font-head); font-size: 1.15rem; display: block; }
        .home .links span { color: var(--ink-2); font-size: 0.9rem; }
      `}</style>

      <section className="hero">
        <h1>
          Can we predict where a tiny antibody sticks to a cancer protein?
        </h1>
        <p>
          SEPIQ 2026 is a blind contest: for three antibodies (<GlossaryTerm id="vhh">VHH</GlossaryTerm> nanobodies) that grip the cancer-linked protein <GlossaryTerm id="her2">HER2</GlossaryTerm>, predict which residues on each side touch. The answers are 3D <GlossaryTerm id="cryo-em">cryo-EM</GlossaryTerm> structures nobody outside the organisers has seen.
        </p>
        <Pills
          items={[
            { text: `${days} days left`, tone: "warn" },
            { text: "No score feedback from the portal", tone: "info" },
            { text: "5 uploads allowed", tone: "plain" },
            { text: "Prizes $3,000 / $2,000 / $1,000", tone: "plain" },
          ]}
        />
        <Source path={["BRIEF.md", "research/q8_compute_validation_execution/_QUEEN_DIGEST.md"]} />
      </section>

      <section aria-label="Four questions">
        <div className="four">
          <div>
            <b>What is SEPIQ</b>
            A prediction contest run by SEPIQ and COGNANO: rank every residue by how likely it is part of the contact patch, scored by <GlossaryTerm id="pr-auc">PR-AUC</GlossaryTerm> averaged over the three antibodies.
          </div>
          <div>
            <b>What is at stake</b>
            Prize money and an invitation to co-author the consortium paper, and a test of the idea that antibody sequence data can reveal 3D contacts.
          </div>
          <div>
            <b>What we know</b>
            The antibody side is predictable from known loop habits. The HER2 side is near chance without a real 3D structure prediction. The big sequence dataset did not help on the HER2 side.
          </div>
          <div>
            <b>What we do next</b>
            Upload the safe baseline, run structure predictions for the three targets, blend only what beats the baseline on clean practice tests, freeze on 28 Oct.
          </div>
        </div>
        <Drop title="Show the evidence behind these four boxes">
          <ul>
            <li>Track A, scoring, prizes and dates are from the organiser pages as read on 2026-10-17 (<Source path="BRIEF.md" />).</li>
            <li>The data-representation idea (that the sequence data hold per-residue contrast for HER2) was tested four ways and failed (<Source path="hive/EMPEROR.md" />).</li>
            <li>The plan and its stop rules are in the runbook (<Source path="research/q8_compute_validation_execution/day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md" />).</li>
          </ul>
        </Drop>
      </section>

      <h2>Six numbers</h2>
      <section className="tiles" aria-label="Key numbers">
        {tiles.map((t, i) => (
          <div key={i} className={`tile ${t.tone}`}>
            <div className="big">{t.big}</div>
            <div className="lab">{t.label}</div>
            <div className="sub">{t.sub}</div>
            <Drop title="Why this number">
              {t.detail}
              <Source path={t.src} />
            </Drop>
          </div>
        ))}
      </section>

      <h2>The five submissions</h2>
      <ol className="strip" aria-label="Submission status">
        {SUBS.map((s) => (
          <li key={s.n}>
            <div className="n">{s.n}</div>
            <div className="when">{s.when}</div>
            <div className="what">{s.what}</div>
            <Pills items={[{ text: s.state, tone: s.tone }]} />
          </li>
        ))}
      </ol>
      <Drop title="How each upload is decided" summary="Gates are measured on public practice complexes, since the portal shows no score">
        <p>
          Each step is promoted only if it beats the safe baseline on the practice tests by a pre-set margin; otherwise the simpler file goes up. Which of the five uploads the organisers actually score (last or best) is not stated, so the real candidate is uploaded on 29 Oct and a reserve on 30 Oct.
        </p>
        <Callout tone="warn" title="Check on the page">
          Dates are the plan, not commitments. Only S1 exists as files, and it has been validated but not uploaded.
        </Callout>
        <Source path={["research/q8_compute_validation_execution/day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md", "model/README.md"]} />
      </Drop>

      <h2>Top five risks</h2>
      <section aria-label="Risk register">
        {RISKS.map((r) => (
          <Drop
            key={r.rank}
            title={
              <span className="risk-head">
                <span className={`light ${r.light}`} role="img" aria-label={r.light === "red" ? "red: high probability and high impact" : "amber: medium probability, high impact"} />
                <span>{r.title}</span>
              </span>
            }
            summary={<span className="risk-meta">Probability {r.p}, impact {r.i}</span>}
          >
            <p>{r.plain}</p>
            <p><b>What we do:</b> {r.fix}</p>
            <Source path="research/q8_compute_validation_execution/day_by_day_runbook_to_2026_10_31_and_failure_mode_register.md" note={`Register row ${r.rank} of 21. Probability and impact are the queen's judgement, not measured.`} />
          </Drop>
        ))}
        <Drop title="What red and amber mean">
          <p>Red: high probability and high impact. Amber: medium probability and high impact. The five shown are the highest-ranked of 21 rows in the register, chosen by us from probability times impact; the full register is in the source file.</p>
        </Drop>
      </section>

      <h2>Go deeper</h2>
      <nav className="links" aria-label="All sections">
        {ROUTES.filter((r) => r.href !== "/").map((r) => (
          <Link key={r.href} href={r.href}>
            <strong>{r.label}</strong>
            <span>{r.blurb}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
