import PageHead from "@/components/PageHead";
import Callout from "@/components/Callout";
import Drop from "@/components/Drop";
import Source from "@/components/Source";
import ChStyles from "@/components/challenge/Styles";
import Rich from "@/components/challenge/Rich";
import OrgChart, { type Chart, type KingInfo, type QueenInfo, type WorkerInfo } from "@/components/challenge/OrgChart";
import PredatorAudit, { type Audit, type Claim } from "@/components/challenge/PredatorAudit";
import { frontmatter, listRel, mdToHtml, readJson, readRel, scrub, section, splitSections } from "@/components/challenge/server";

export const metadata = { title: "How this was made | SEPIQ 2026 Intelligence" };

type Structure = {
  rationale: string;
  kings: { id: string; name: string; mandate: string; cross_domain_lenses?: string[]; queens: { id: string; subdomain: string; workers: string[] }[] }[];
  channels: { id: string; between: string[]; purpose: string }[];
};

const prettyQueen = (id: string) => {
  const [q, ...rest] = id.split("_");
  return `${q.toUpperCase()} ${rest.join(" ")}`;
};

function digestHtml(rel: string): string | null {
  const t = readRel(rel);
  if (!t) return null;
  return mdToHtml(frontmatter(t).content);
}

function tldrOf(body: string): string | null {
  const m = body.match(/##\s*TL;DR\s*\n+([\s\S]*?)(?:\n##\s|$)/i);
  if (!m) return null;
  const t = scrub(m[1].replace(/\s+/g, " ").trim());
  return t ? (t.length > 700 ? t.slice(0, 700).replace(/\s\S*$/, "") + "..." : t) : null;
}

function loadWorkers(qid: string, slugs: string[]): WorkerInfo[] {
  const files = listRel(`research/${qid}`).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const meta = files.map((f) => {
    const t = readRel(`research/${qid}/${f}`) ?? "";
    const fm = frontmatter(t);
    return { f, worker: String(fm.data.worker ?? ""), conf: fm.data.confidence ? String(fm.data.confidence) : null, rel: typeof fm.data.challenge_relevance === "number" ? fm.data.challenge_relevance : null, tldr: tldrOf(fm.content) };
  });
  return slugs.map((slug) => {
    const hit = meta.find((m) => m.worker === slug || m.f.replace(/\.md$/, "") === slug);
    return { slug, tldr: hit?.tldr ?? null, confidence: hit?.conf ?? null, relevance: hit?.rel ?? null, file: hit?.f ?? null };
  });
}

function loadChart(emperorHtml: string | null): Chart | null {
  const s = readJson<Structure>("hive/structure.json");
  if (!s) return null;
  const kings: KingInfo[] = s.kings.map((k) => {
    const queens: QueenInfo[] = k.queens.map((q) => ({
      id: q.id,
      short: prettyQueen(q.id),
      subdomain: q.subdomain,
      html: digestHtml(`research/${q.id}/_QUEEN_DIGEST.md`),
      workers: loadWorkers(q.id, q.workers),
    }));
    return { id: k.id, short: k.id.replace("king_", "").toUpperCase(), mandate: k.mandate, lenses: k.cross_domain_lenses ?? [], html: digestHtml(`research/_meta/${k.id}_KINGLOG.md`), queens };
  });
  return { rationale: s.rationale, emperorHtml, kings, channels: s.channels };
}

function loadAudit(): Audit | null {
  type Raw = { date: string; claims_checked: number; verified: number; imprecise: number; unsupported: number; unreachable: number; fabricated: number; claims: Claim[] };
  const a = readJson<Raw>("research/_meta/predator_audit.json");
  if (!a) return null;
  const q = readJson<{ quarantine: Audit["quarantine"] }>("research/_meta/quarantine.json");
  const md = readRel("research/_meta/predator_audit.md") ?? "";
  const patterns = section(md, "Patterns").split(/\r?\n/).filter((l) => l.startsWith("- ")).map((l) => scrub(l.slice(2).replace(/\*\*/g, "").replace(/`/g, "")));
  return {
    date: a.date,
    checked: a.claims_checked,
    counts: { verified: a.verified, imprecise: a.imprecise, unsupported: a.unsupported, unreachable: a.unreachable, fabricated: a.fabricated },
    claims: a.claims.map((c) => ({ ...c, file: scrub(c.file), source: scrub(c.source), notes: scrub(c.notes), claim: scrub(c.claim) })),
    quarantine: (q?.quarantine ?? []).map((x) => ({ ...x, file: scrub(x.file), reason: scrub(x.reason), action: scrub(x.action) })),
    patterns,
  };
}

export default function Page() {
  const emperor = readRel("hive/EMPEROR.md");
  const ticks = emperor ? splitSections(emperor).map((s) => ({ title: s.title, html: mdToHtml(s.body) })) : [];
  const chart = loadChart(null);
  const audit = loadAudit();

  return (
    <>
      <ChStyles />
      <PageHead
        title="How this was made"
        lede="A small organisation of AI agents did the research: an emperor that sets the shape, kings that steer, queens that own a subject, and workers that read and compute. Click any box to read what it concluded."
      />

      <Callout tone="key" title="The short version">
        <p>
          Nine subject areas were researched in parallel, one report per worker, then summarised upward in fixed word budgets so no single agent drowned in text. A separate auditor, the &quot;predator&quot;, then tried to break the numbers that matter most. Everything on this site traces back to a file in this hive; open any &quot;source&quot; tag to see which.
        </p>
      </Callout>

      <h2>The org chart</h2>
      {chart ? <OrgChart chart={chart} /> : <Callout tone="warn" title="Structure file not found">The hive structure file was not available at build time.</Callout>}

      <h2>The Emperor&apos;s decision log</h2>
      <p>The Emperor does not research. It writes down, at each &quot;tick&quot;, what it observed and how it changed the hive.</p>
      {ticks.length === 0 && <Callout tone="warn" title="Log not found">The Emperor log was not available at build time.</Callout>}
      {ticks.map((t, i) => (
        <Drop key={t.title} title={<Rich>{t.title}</Rich>} defaultOpen={/Tick 1/.test(t.title) && i >= 0}>
          <div className="ch-md" dangerouslySetInnerHTML={{ __html: t.html }} />
        </Drop>
      ))}
      <Source path="hive/EMPEROR.md" />

      <h2>The predator audit</h2>
      <p>After round one, an auditor picked 30 claims that most affect decisions and re-checked each against the raw data or the original page. Verdicts: verified, imprecise, unsupported, unreachable (could not be opened), or fabricated.</p>
      {audit ? <PredatorAudit audit={audit} /> : <Callout tone="note" title="Audit not published yet">No predator audit file has landed. This section fills in when one exists.</Callout>}
    </>
  );
}
