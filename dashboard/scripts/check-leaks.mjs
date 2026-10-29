// Fails (exit 1) if out/ contains local paths, usernames or secrets. Run after build, before deploy.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "out");
if (!existsSync(out)) {
  console.log("check-leaks: no out/ yet");
  process.exit(0);
}
const pats = [
  /ashenoy/i,
  /shenoy\.am/i,
  /\b[A-Za-z]:\\\\/,
  /\b[A-Za-z]:\\(?:Users|Temp)/,
  /\b[A-Za-z]:\/(?:Users|Temp)/,
  /OIDC/,
  /eyJ[A-Za-z0-9_-]{10,}\./,
  /\bhf_[A-Za-z0-9]{20,}/,
  /VERCEL_[A-Z_]*TOKEN/,
];
let bad = 0;
(function walk(d) {
  for (const n of readdirSync(d)) {
    const f = resolve(d, n);
    if (statSync(f).isDirectory()) {
      walk(f);
      continue;
    }
    if (!/\.(html|txt|js|json|css|map|xml)$/i.test(n)) continue;
    const s = readFileSync(f, "utf8");
    for (const p of pats)
      if (p.test(s)) {
        console.log("LEAK", String(p), f.slice(out.length));
        bad++;
      }
  }
})(out);
console.log(bad ? `check-leaks: ${bad} problem(s)` : "check-leaks: clean");
process.exit(bad ? 1 : 0);
