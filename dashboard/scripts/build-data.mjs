// Converts ../research/_synthesis/*.json into src/data/*.json (prebuild step).
// glossary.json is normalised to [{id, term, short, long?, aliases?}]. If the scribe's file is absent, the committed stub stays.
// Other *.json files are copied through unchanged. Existing src/data files are never deleted.
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "..", "..", "research", "_synthesis");
const out = resolve(here, "..", "src", "data");
mkdirSync(out, { recursive: true });

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function normaliseGlossary(raw) {
  let list = raw;
  if (!Array.isArray(raw)) {
    list = raw.terms ?? raw.entries ?? raw.glossary ?? Object.entries(raw).map(([k, v]) => (typeof v === "string" ? { term: k, short: v } : { term: k, ...v }));
  }
  const res = [];
  for (const e of list) {
    const term = e.term ?? e.name ?? e.title;
    const short = e.short ?? e.definition ?? e.def ?? e.plain ?? e.meaning;
    if (!term || !short) continue;
    res.push({
      id: e.id ?? slug(term),
      term: String(term),
      short: String(short),
      ...(e.long ?? e.detail ?? e.more ? { long: String(e.long ?? e.detail ?? e.more) } : {}),
      ...(Array.isArray(e.aliases ?? e.synonyms) ? { aliases: (e.aliases ?? e.synonyms).map(String) } : {}),
    });
  }
  return res;
}

if (!existsSync(src)) {
  console.log("build-data: no research/_synthesis yet; keeping existing src/data");
} else {
  const files = readdirSync(src).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    try {
      const raw = JSON.parse(readFileSync(resolve(src, f), "utf8"));
      if (f === "glossary.json") {
        const g = normaliseGlossary(raw);
        const extra = resolve(here, "glossary-extra.json");
        if (existsSync(extra)) {
          const have = new Set(g.map((e) => e.id));
          for (const e of JSON.parse(readFileSync(extra, "utf8"))) if (!have.has(e.id)) g.push(e);
        }
        if (g.length) { writeFileSync(resolve(out, f), JSON.stringify(g, null, 1)); console.log(`build-data: glossary ${g.length} entries`); }
        else console.log("build-data: glossary.json had no usable entries; stub kept");
      } else {
        writeFileSync(resolve(out, f), JSON.stringify(raw, null, 1));
        console.log("build-data: copied", f);
      }
    } catch (err) {
      console.log("build-data: skipped", f, String(err.message ?? err));
    }
  }
  if (!files.length) console.log("build-data: research/_synthesis has no json yet; keeping existing src/data");
}
