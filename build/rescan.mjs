/**
 * Refreshes the scan verdicts in the skill index.
 *
 * The index claims a verdict for every entry it lists. That claim is only worth
 * something if it is produced rather than typed, so this script runs the real
 * AIRLOCK engine over each locally-available skill and writes the result back
 * into content/catalog.json — verdict, finding count, engine version and date.
 *
 *   AIRLOCK_PATH=D:/Projekte/airlock node build/rescan.mjs
 *
 * Entries whose source is not checked out locally keep whatever they had and are
 * reported as skipped. Nothing is ever invented: a skill with no scan carries
 * verdict "unscanned" and the index says so on its face.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = join(ROOT, 'content', 'catalog.json');
const AIRLOCK = process.env.AIRLOCK_PATH || 'D:/Projekte/airlock';

const catalog = JSON.parse(readFileSync(CATALOG, 'utf8'));

if (!existsSync(join(AIRLOCK, 'core', 'scan.mjs'))) {
  process.stderr.write(`rescan: no AIRLOCK checkout at ${AIRLOCK}. Set AIRLOCK_PATH.\n`);
  process.exit(2);
}

const { scanText, ENGINE_VERSION } = await import(pathToFileURL(join(AIRLOCK, 'core', 'scan.mjs')).href);

const today = new Date().toISOString().slice(0, 10);
let scanned = 0;
let skipped = 0;

for (const skill of catalog.skills) {
  if (!skill.localPath) { skipped++; continue; }
  const file = join(AIRLOCK, skill.localPath);
  if (!existsSync(file)) { skipped++; continue; }

  const text = readFileSync(file, 'utf8');
  const result = scanText(text, { filename: skill.localPath });
  const active = result.findings.filter((f) => !f.suppressed);

  skill.tools = result.frontMatter.declared;
  skill.scan = {
    verdict: result.verdict,
    findings: active.length,
    critical: result.counts.critical,
    high: result.counts.high,
    invisible: result.stats.invisibles,
    reaches: result.capability.derived,
    engine: ENGINE_VERSION,
    date: today,
  };
  scanned++;
}

catalog.updated = today;
writeFileSync(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

process.stdout.write(`rescan: ${scanned} scanned, ${skipped} skipped (no local checkout)\n`);
for (const s of catalog.skills) {
  process.stdout.write(`  ${(s.scan?.verdict ?? 'unscanned').padEnd(9)} ${s.name}\n`);
}
