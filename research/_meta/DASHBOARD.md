# SEPIQ26 dashboard

Live URL: https://sepiq26-intelligence.vercel.app (Vercel project `sepiq26-intelligence`, static export of Next.js 16.4).
Note: the per-deployment *.vercel.app URLs sit behind Vercel SSO (HTTP 302); only the alias above is public.

## Deploy
From `dashboard/`: `npm run deploy`
= data build -> content sync (with redaction) -> `vercel pull --yes --environment production` -> `vercel build --prod --yes` -> `scripts/fix-output.mjs` -> `scripts/check-leaks.mjs` -> `vercel deploy --prebuilt --prod --yes`.
If unlinked: `vercel link --yes --project sepiq26-intelligence`. Delete `.env.local` (holds an OIDC token) after pull/link.

Why fix-output: the generated `.vercel/output/config.json` carries extensionless `overrides` for every page, and on this project every HTML route then 404ed while assets served. Stripping `overrides` fixed it (CASMI26 uses the same flow without the problem; cause not investigated).

## Routes (all 200 live, titles and h1 rendered)
/ (home), /story, /challenge, /assay, /methods, /ideas, /structures (3D lab), /models, /hive. Unknown paths return 404.

## Safeguards
- `scripts/sync-content.mjs` redacts Windows/Unix user paths, usernames, emails and secret-like strings in content/ copies.
- `scripts/check-leaks.mjs` fails the deploy if out/ contains usernames, absolute paths, OIDC or token strings. Live HTML grep also clean.
- 3D structures are fetched at runtime from files.rcsb.org; nothing large is committed.

## Fixes this pass
- Lint errors in `/` (setState in effect) and `/story` (component created during render) fixed.
- Glossary: `macro-averaged` lookup fixed; added `residue`, `interface`, `structure prediction` via `scripts/glossary-extra.json`. All 194 literal glossary ids now resolve.

## Known gaps
- Phone width verified by CSS inspection only (viewport meta, body overflow-x hidden, scroll wrappers on tables/SVG/timelines); no device test.
- Glossary is checked for literal ids only; terms passed as dynamic children are not checked.
- The hive page quotes "HF token" as a to-do (a request, not a secret).
- Numbers were not re-audited against hive files in this pass.


## Hosting update 2026-10-20
Moved from Vercel to Cloudflare Pages: https://sepiq26-intelligence.pages.dev . Redeploy with `cd dashboard && npm run deploy` (webpack build + leak check + `wrangler pages deploy out`). The Vercel notes above (fix-output, vercel pull/build) no longer apply.
