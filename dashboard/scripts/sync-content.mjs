// Copies the hive's research output into the dashboard so Vercel builds are self-contained.
//   ../research  -> content/research
//   ../hive      -> content/hive
//   ../BRIEF.md  -> content/BRIEF.md
// Text copies are redacted (local paths, usernames, emails, secrets); the source files are never touched.
import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const out = resolve(here, "..", "content");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const d of ["research", "hive"]) {
  const src = resolve(root, d);
  if (existsSync(src)) cpSync(src, resolve(out, d), { recursive: true });
}
if (existsSync(resolve(root, "model", "README.md"))) copyFileSync(resolve(root, "model", "README.md"), resolve(out, "model_README.md"));
if (existsSync(resolve(root, "BRIEF.md"))) copyFileSync(resolve(root, "BRIEF.md"), resolve(out, "BRIEF.md"));

const rules = [
  [/VERCEL_OIDC_TOKEN\s*=\s*\S+/g, "[redacted-secret]"],
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, "[redacted-secret]"],
  [/\b(?:hf|ghp|gho|sk|xox[bp])[_-][A-Za-z0-9_-]{16,}/g, "[redacted-secret]"],
  [/\b[A-Za-z]:(?:\\\\|\\|\/)[^\s"'`<>)|]*/g, "[local-path]"],
  [/\/(?:Users|home)\/[A-Za-z0-9._-]+[^\s"'`<>)|]*/g, "[local-path]"],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email]"],
  [/ashenoy\w*/gi, "[user]"],
  [/shenoy\.am/gi, "[user]"],
];
function scrub(dir) {
  for (const n of readdirSync(dir)) {
    const f = resolve(dir, n);
    if (statSync(f).isDirectory()) {
      scrub(f);
      continue;
    }
    if (!/\.(md|json|txt|csv|yml|yaml|py|sh)$/i.test(n)) continue;
    const a = readFileSync(f, "utf8");
    let b = a;
    for (const [re, rep] of rules) b = b.replace(re, rep);
    if (b !== a) writeFileSync(f, b);
  }
}
scrub(out);
console.log("content synced (redacted)");
