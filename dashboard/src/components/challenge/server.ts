// Build-time (server only) readers for hive files. Never imported by client components.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";

const cwd = process.cwd();
const roots = [resolve(cwd, "content"), resolve(cwd, "..")];

/** Map a project-relative path to candidate files inside content/ (synced copy) or the project root. */
function candidates(rel: string): string[] {
  const out: string[] = [];
  for (const r of roots) {
    if (rel === "model/README.md" && r.endsWith("content")) out.push(resolve(r, "model_README.md"));
    else out.push(resolve(r, rel));
  }
  return out;
}

export function readRel(rel: string): string | null {
  for (const p of candidates(rel)) {
    try {
      if (existsSync(p)) return readFileSync(p, "utf8");
    } catch {
      /* try next */
    }
  }
  return null;
}

export function listRel(rel: string): string[] {
  for (const p of candidates(rel)) {
    try {
      if (existsSync(p)) return readdirSync(p);
    } catch {
      /* try next */
    }
  }
  return [];
}

export function readJson<T>(rel: string): T | null {
  const t = readRel(rel);
  if (!t) return null;
  try {
    return JSON.parse(t) as T;
  } catch {
    return null;
  }
}

/** Remove absolute Windows paths, home paths and user names before anything reaches the site. */
export function scrub(s: string): string {
  return s
    .replace(/[A-Za-z]:[\\/][^\s`'")<>|]*/g, "[local path]")
    .replace(/\/(?:Users|home)\/[^\s`'")<>|]*/g, "[local path]")
    .replace(/~[\\/][^\s`'")<>|]*/g, "[local path]")
    .replace(/ashenoy\d*/gi, "[user]")
    .replace(/shenoy\.am/gi, "[user]");
}

export function mdToHtml(md: string): string {
  const file = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify).processSync(scrub(md));
  return String(file);
}

export function clean(s: string): string {
  return scrub(s.replace(/\*\*/g, "").replace(/`/g, "").trim());
}

/** Parse the first markdown table whose header line starts with `headerStart` (after the pipe). Returns rows of cleaned cells. */
export function mdTable(text: string, headerStart: string): string[][] {
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => l.trim().startsWith("|") && l.replace(/^\|\s*/, "").startsWith(headerStart));
  if (i < 0) return [];
  const rows: string[][] = [];
  for (let k = i + 2; k < lines.length; k++) {
    const l = lines[k].trim();
    if (!l.startsWith("|")) break;
    rows.push(l.replace(/^\||\|$/g, "").split("|").map(clean));
  }
  return rows;
}

/** Text of a "## <title>" section (until the next "## " heading). */
export function section(text: string, titleStart: string): string {
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => l.startsWith("## ") && l.slice(3).trim().toLowerCase().startsWith(titleStart.toLowerCase()));
  if (i < 0) return "";
  let j = i + 1;
  while (j < lines.length && !lines[j].startsWith("## ")) j++;
  return lines.slice(i + 1, j).join("\n");
}

/** Split markdown at "## " headings. */
export function splitSections(text: string): { title: string; body: string }[] {
  const out: { title: string; body: string }[] = [];
  let cur: { title: string; lines: string[] } | null = null;
  for (const l of text.split(/\r?\n/)) {
    if (l.startsWith("## ")) {
      if (cur) out.push({ title: cur.title, body: cur.lines.join("\n") });
      cur = { title: l.slice(3).trim(), lines: [] };
    } else if (cur) cur.lines.push(l);
  }
  if (cur) out.push({ title: cur.title, body: cur.lines.join("\n") });
  return out;
}

export function frontmatter(text: string): { data: Record<string, unknown>; content: string } {
  try {
    const m = matter(text);
    return { data: m.data as Record<string, unknown>, content: m.content };
  } catch {
    return { data: {}, content: text };
  }
}
