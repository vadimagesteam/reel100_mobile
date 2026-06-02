#!/usr/bin/env node
/**
 * Slice the master "state silhouettes" image into 50 per-state PNGs.
 *
 * The master is a grid of state silhouettes (the reference on the
 * "[Mobile] State profile picture assets" task is a 10x5 grid: 10 columns,
 * 5 rows, row-major, alphabetical by state name, white shapes on a dark
 * background, with a name label under each shape).
 *
 * This script crops each grid cell, drops the label band at the bottom of the
 * cell, trims the result to the silhouette's bounding box, and writes
 * <SLUG>.png into the output dir. Register the results in
 * src/components/search/stateImages.ts to light them up in StateAvatar.
 *
 * Prerequisite (not a runtime dep — dev only):
 *   npm i -D sharp
 *
 * Usage:
 *   node scripts/slice-state-images.mjs <master.png> \
 *     [--cols 10] [--rows 5] [--label-frac 0.22] [--pad 4] [--size 256] \
 *     [--out src/assets/states]
 *
 * Tip: provide a high-res, transparent (or solid-background) master. Tweak
 * --label-frac (fraction of each cell height occupied by the text label) and
 * --pad until the previews look clean.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

// Row-major order matching the reference grid (alphabetical by state name).
const SLUGS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

function parseArgs(argv) {
  const args = { cols: 10, rows: 5, labelFrac: 0.22, pad: 4, size: 256, out: 'src/assets/states' };
  const master = argv[2];
  for (let i = 3; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    const val = argv[i + 1];
    if (key === 'cols') args.cols = Number(val);
    else if (key === 'rows') args.rows = Number(val);
    else if (key === 'label-frac') args.labelFrac = Number(val);
    else if (key === 'pad') args.pad = Number(val);
    else if (key === 'size') args.size = Number(val);
    else if (key === 'out') args.out = val;
  }
  return { master, ...args };
}

async function main() {
  const { master, cols, rows, labelFrac, pad, size, out } = parseArgs(process.argv);
  if (!master) {
    console.error('Usage: node scripts/slice-state-images.mjs <master.png> [options]');
    process.exit(1);
  }

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Missing "sharp". Install it first:  npm i -D sharp');
    process.exit(1);
  }

  const img = sharp(master);
  const meta = await img.metadata();
  const W = meta.width;
  const H = meta.height;
  if (!W || !H) throw new Error('Could not read master image dimensions');

  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);
  const shapeH = Math.floor(cellH * (1 - labelFrac)); // drop the label band

  await mkdir(out, { recursive: true });

  for (let i = 0; i < SLUGS.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = Math.min(col * cellW + pad, W - 1);
    const top = Math.min(row * cellH + pad, H - 1);
    const width = Math.max(1, Math.min(cellW - pad * 2, W - left));
    // Symmetric padding: `top` already added `pad`, so strip `pad` from the
    // bottom too (the label band is excluded separately via `shapeH`).
    const height = Math.max(1, Math.min(shapeH - pad * 2, H - top));

    const dest = path.join(out, `${SLUGS[i]}.png`);
    await sharp(master)
      .extract({ left, top, width, height })
      .trim() // crop to the silhouette bounding box (background-based)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(dest);
    console.log(`wrote ${dest}`);
  }

  console.log(`\nDone: ${SLUGS.length} state images written to ${out}.`);
  console.log('Next: register them in src/components/search/stateImages.ts.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
