// DataNusa — Statistik Indonesia, entry for make.fun
// best-national-statistics-site-20261126-0539.
//
// The site itself lives in app/: a static, dependency-free page set
// (index.html shell, hash router in main.js, one render function per page
// in views.js, Canvas charts in charts.js, datasets in data.js, system
// fonts only in style.css). It opens at app/index.html, needs no build
// step, and loads nothing over the network.
//
// This file is only the hand-in step. It copies app/ and screenshots/
// next to this file into the output directory and writes
// dossier.json there with the vendored make.fun library
// (vendor/makefun-frontend.ts, left exactly as shipped: the scorer
// requires dossier.json to be byte for byte what its own copy writes).
// Before writing the dossier it checks the screenshots itself — the
// entry must carry 3 or 4 images, each no bigger than 256 KiB — so a
// bad screenshot set fails here, loudly, instead of at the scorer.
//
// v3 (28 Nov 2026, agent-written): home now carries a compact 5x2 KPI
// grid with a source line per card, two first-screen charts, an interactive
// island map + sortable 38-province table, a 2021–2025 year focus and a
// 10-year chart with a series picker; the master table has no empty cells
// left (population 2021–2024 and revised IPM 2021 filled in). Nothing here
// changes the dossier contract above.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container MAKEFUN_OUTPUT_DIR stands in for
// /output. Serve the site itself with `node serve.ts`, then open
// http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files and directories
// in app/ or 16 MiB of app files: app/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
} as const;

/** Image file names in a directory, sorted, so the log reads the same every run. */
function imageNames(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => /\.(?:png|jpe?g)$/i.test(name))
    .sort();
}

/**
 * Check the screenshots that are about to be handed in: the entry needs
 * between 3 and 4 of them, each at most 256 KiB, and the first by name is
 * the cover the judge sees first. Throws with the offending count or
 * file named, so a broken set never reaches the dossier step.
 */
function checkScreenshots(dir: string): string[] {
  const shots = imageNames(dir);
  if (shots.length < 3 || shots.length > DOSSIER_CAPS.screenshots.max) {
    throw new Error(
      `screenshots/: expected 3 to ${DOSSIER_CAPS.screenshots.max} images, found ${shots.length}`,
    );
  }
  for (const name of shots) {
    const bytes = statSync(join(dir, name)).size;
    if (bytes > DOSSIER_CAPS.screenshots.max_bytes) {
      throw new Error(
        `screenshots/${name}: ${bytes} bytes, over the ${DOSSIER_CAPS.screenshots.max_bytes} allowed`,
      );
    }
  }
  return shots;
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

const shots = checkScreenshots(join(out, 'screenshots'));
const appFiles = readdirSync(join(out, 'app')).sort();
console.log(`DataNusa v3: copied app/ (${appFiles.join(', ')}) and ${shots.length} screenshots (${shots.join(', ')}) to ${out}`);

writeFileSync(join(out, 'dossier.json'), buildDossier(out, DOSSIER_CAPS));
console.log(`DataNusa: dossier.json written (${statSync(join(out, 'dossier.json')).size} bytes)`);
