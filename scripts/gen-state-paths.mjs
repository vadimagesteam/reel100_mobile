#!/usr/bin/env node
/**
 * Generate src/assets/states/statePaths.ts — US state silhouette path data.
 *
 * Downloads the public-domain-ish @svg-maps/usa map (a single SVG with one path
 * per state in a shared coordinate space) and, for each state, computes the
 * bounding box of its path so we can emit a per-state `viewBox` cropped to that
 * box. Rendering the path into a square box with that viewBox centers and scales
 * the silhouette to fill the avatar at its correct aspect ratio — no raster
 * assets, fully tintable, a few KB gzipped.
 *
 * Keys are the uppercase two-letter slug the backend returns for each state
 * (see apps/api-server/scripts/statesSeed.ts in the backend: slug === "CA").
 *
 * Usage:
 *   node scripts/gen-state-paths.mjs
 *
 * Source: @svg-maps/usa v2.0.0 (ISC license).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://unpkg.com/@svg-maps/usa@2.0.0/index.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'assets', 'states', 'statePaths.ts');

const tokenRe = /([MmLlHhVvZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;

/** Bounding box of an SVG path made of M/L/l/H/h/V/v/Z commands (no curves). */
function bbox(d) {
  const tokens = [];
  let m;
  while ((m = tokenRe.exec(d)) !== null) {
    tokens.push(m[1] ? { t: 'c', v: m[1] } : { t: 'n', v: parseFloat(m[2]) });
  }
  let x = 0, y = 0, sx = 0, sy = 0, cmd = null, i = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const next = () => tokens[i++].v;
  const rec = () => {
    if (x < minX) minX = x; if (y < minY) minY = y;
    if (x > maxX) maxX = x; if (y > maxY) maxY = y;
  };
  while (i < tokens.length) {
    if (tokens[i].t === 'c') { cmd = tokens[i].v; i++; }
    switch (cmd) {
      case 'M': x = next(); y = next(); sx = x; sy = y; rec(); cmd = 'L'; break;
      case 'm': x += next(); y += next(); sx = x; sy = y; rec(); cmd = 'l'; break;
      case 'L': x = next(); y = next(); rec(); break;
      case 'l': x += next(); y += next(); rec(); break;
      case 'H': x = next(); rec(); break;
      case 'h': x += next(); rec(); break;
      case 'V': y = next(); rec(); break;
      case 'v': y += next(); rec(); break;
      case 'Z': case 'z': x = sx; y = sy; rec(); break;
      default: i++; break;
    }
  }
  return { minX, minY, maxX, maxY };
}

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`Failed to fetch source: ${res.status}`);
  const js = await res.text();
  const json = js.replace(/^\s*export\s+default\s*/, '').replace(/;?\s*$/, '');
  const data = JSON.parse(json);

  // The viewBox is SQUARE and centered on each state's bounding box so the
  // silhouette can fill a circular avatar 1:1 (no letterboxing — react-native-svg
  // mis-positions letterboxed content under the New Architecture). FILL controls
  // how much of the box the longest side of the state occupies (~0.66 => a
  // comfortable margin inside the circle).
  const FILL = 0.66;
  const entries = {};
  for (const loc of data.locations) {
    const b = bbox(loc.path);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const side = Math.max(b.maxX - b.minX, b.maxY - b.minY) / FILL;
    const viewBox =
      `${(cx - side / 2).toFixed(2)} ${(cy - side / 2).toFixed(2)} ` +
      `${side.toFixed(2)} ${side.toFixed(2)}`;
    entries[loc.id.toUpperCase()] = { name: loc.name, viewBox, d: loc.path };
  }

  const body = Object.keys(entries)
    .sort()
    .map((k) => {
      const e = entries[k];
      return (
        `  ${k}: {\n` +
        `    name: ${JSON.stringify(e.name)},\n` +
        `    viewBox: ${JSON.stringify(e.viewBox)},\n` +
        `    d: ${JSON.stringify(e.d)},\n` +
        `  },\n`
      );
    })
    .join('');

  const file = `/* eslint-disable quotes */
/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND. Run \`node scripts/gen-state-paths.mjs\`.
 *
 * US state silhouette path data, keyed by uppercase two-letter slug (the slug
 * the backend returns for each state, e.g. "CA"). Each entry carries the raw
 * SVG path plus a per-state square \`viewBox\` centered on the state's bounding
 * box, so rendering the path into a square (circular) avatar centers and scales
 * the silhouette 1:1 with no letterboxing.
 *
 * Source: @svg-maps/usa v2.0.0 (ISC).
 */
export type StatePathEntry = {
  /** Full state name, for reference/debugging. */
  name: string;
  /** viewBox cropped to this state's bounding box: "minX minY width height". */
  viewBox: string;
  /** Raw SVG path data in the source map's coordinate space. */
  d: string;
};

export const STATE_PATHS: Record<string, StatePathEntry> = {
${body}};
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, file);
  console.log(`Wrote ${Object.keys(entries).length} states -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
