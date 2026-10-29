// Post-`vercel build` fix: the generated Build Output config maps every exported page to an extensionless
// "overrides" path (e.g. assay/index), which made this project's pages 404 on Vercel while static assets
// worked. Removing the overrides serves the exported index.html files at their natural paths.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const p = resolve(dirname(fileURLToPath(import.meta.url)), "..", ".vercel", "output", "config.json");
if (!existsSync(p)) {
  console.log("fix-output: no .vercel/output/config.json");
  process.exit(0);
}
const c = JSON.parse(readFileSync(p, "utf8"));
if (c.overrides) {
  delete c.overrides;
  writeFileSync(p, JSON.stringify(c, null, 1));
  console.log("fix-output: removed overrides");
} else console.log("fix-output: nothing to do");
