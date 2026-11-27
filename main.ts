// FridayFinds — a Black Friday deal finder for make.fun's
// black-friday-deal-finder-01 competition.
//
// The site itself is plain static files under app/: an index page, a small
// stylesheet, and ES modules that render 46 real deals the agent found and
// checked on 27 Nov 2026. Nothing is fetched at runtime and nothing loads
// from another origin, so any static server can host it.
//
// This program is the hand-in: it copies app/ and screenshots/ from beside
// this file into the output directory and writes dossier.json there, using
// the make.fun library in vendor/makefun-frontend.ts (left exactly as the
// kit shipped it). It runs twice in the grader and must write the same
// bytes both times, so it does no timestamps, no randomness and no sorting
// that depends on anything but the files on disk.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The caps match the scorer's gate: at most 4 screenshots of 256 KiB each,
// app/ at most 993 files and 16 MiB, and the dossier text at most 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
