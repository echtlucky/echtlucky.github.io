/**
 * Checks that every internal link resolves to a file that was actually built.
 *
 * A static site's most common defect is a link that used to work. External URLs
 * are listed but never requested — a build that reaches the network is a build
 * that fails when someone else's server is down, and this site makes a point of
 * not calling out.
 *
 *   node build/linkcheck.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

function walk(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, found);
    else if (p.endsWith('.html')) found.push(p);
  }
  return found;
}

if (!existsSync(OUT)) {
  process.stderr.write('linkcheck: dist/ does not exist. Run the build first.\n');
  process.exit(2);
}

const pages = walk(OUT);
const broken = [];
const external = new Set();
let checked = 0;

for (const page of pages) {
  // Strip script and style blocks first: the catalogue page builds its cards in
  // JavaScript, and the `href="` inside that template is a string, not a link.
  const html = readFileSync(page, 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const rel = page.replace(OUT, '').replace(/\\/g, '/');

  for (const m of html.matchAll(/href="([^"#]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|#)/.test(url)) { external.add(url.split('/').slice(0, 3).join('/')); continue; }

    checked++;
    const target = url.endsWith('/') ? join(OUT, url, 'index.html') : join(OUT, url);
    if (!existsSync(target)) broken.push(`${rel} → ${url}`);
  }
}

process.stdout.write(`\nlinkcheck — ${pages.length} pages, ${checked} internal links\n\n`);
for (const b of broken) process.stdout.write(`  ✗ ${b}\n`);

if (broken.length === 0) {
  process.stdout.write('  ✓ every internal link resolves\n');
  process.stdout.write(`  ${external.size} external host(s) linked, none requested at build time\n`);
}
process.stdout.write('\n');

process.exitCode = broken.length === 0 ? 0 : 1;
