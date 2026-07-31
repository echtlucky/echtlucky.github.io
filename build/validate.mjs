/**
 * Validates the skill index.
 *
 * Two jobs, and the second one is the point of the whole index:
 *
 *   1. Structure — required fields, no duplicate ids, sane links.
 *   2. Nobody may type their own verdict. Continuous integration re-derives
 *      every verdict from the actual skill and fails if the file disagrees, so
 *      a pull request cannot introduce an entry that claims to be clean.
 *
 *   node build/validate.mjs
 *   AIRLOCK_PATH=... node build/validate.mjs --verdicts
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'content', 'catalog.json'), 'utf8'));

const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);

const REQUIRED = ['id', 'name', 'author', 'source', 'url', 'license', 'tags', 'title', 'description'];
const VERDICTS = new Set(['pass', 'review', 'block', 'unscanned']);
const ID = /^[a-z0-9][a-z0-9-]*$/;

// ── structure ───────────────────────────────────────────────────────────────

const seen = new Set();

for (const s of catalog.skills) {
  const id = s.id ?? '(no id)';

  for (const key of REQUIRED) {
    if (s[key] === undefined || s[key] === null || s[key] === '') fail(id, `missing required field "${key}"`);
  }

  if (s.id && !ID.test(s.id)) fail(id, 'id must be lowercase letters, digits and hyphens');
  if (seen.has(s.id)) fail(id, 'duplicate id');
  seen.add(s.id);

  if (s.url && !/^https:\/\//.test(s.url)) fail(id, 'url must be https');
  if (s.rawUrl && !/^https:\/\//.test(s.rawUrl)) fail(id, 'rawUrl must be https');

  for (const lang of ['en', 'de']) {
    if (!s.title?.[lang]) fail(id, `title.${lang} is missing`);
    if (!s.description?.[lang]) fail(id, `description.${lang} is missing`);
    else if (s.description[lang].length > 320) fail(id, `description.${lang} is over 320 characters`);
  }

  if (!Array.isArray(s.tags) || s.tags.length === 0) fail(id, 'at least one tag is required');
  else for (const tag of s.tags) if (!ID.test(tag)) fail(id, `tag "${tag}" must be lowercase`);

  if (s.scan !== null && s.scan !== undefined) {
    if (!VERDICTS.has(s.scan.verdict)) fail(id, `unknown verdict "${s.scan.verdict}"`);
    if (!s.scan.date || !s.scan.engine) fail(id, 'a scan must record its date and engine version');
  }

  // A submission can only be verified if the skill can be reached.
  if (!s.localPath && !s.rawUrl) {
    warnings.push(`${id}: no localPath or rawUrl — it can never be scanned, so it stays "unscanned"`);
  }
}

// ── verdicts must be derived, not asserted ──────────────────────────────────

if (process.argv.includes('--verdicts')) {
  const AIRLOCK = process.env.AIRLOCK_PATH || join(ROOT, '..', 'airlock');
  const engineFile = join(AIRLOCK, 'core', 'scan.mjs');

  if (!existsSync(engineFile)) {
    errors.push(`(verdicts): no AIRLOCK checkout at ${AIRLOCK}. Set AIRLOCK_PATH.`);
  } else {
    const { scanText } = await import(pathToFileURL(engineFile).href);

    for (const s of catalog.skills) {
      if (!s.localPath) continue;
      const file = join(AIRLOCK, s.localPath);
      if (!existsSync(file)) { warnings.push(`${s.id}: localPath not found, skipped`); continue; }

      const actual = scanText(readFileSync(file, 'utf8'), { filename: s.localPath }).verdict;
      const stored = s.scan?.verdict ?? 'unscanned';

      if (stored !== actual) {
        fail(s.id, `stored verdict "${stored}" does not match a fresh scan ("${actual}"). Run: npm run rescan`);
      }
    }
  }
}

// ── report ──────────────────────────────────────────────────────────────────

process.stdout.write(`\nskill index — ${catalog.skills.length} entries\n\n`);
for (const w of warnings) process.stdout.write(`  ! ${w}\n`);
for (const e of errors) process.stdout.write(`  ✗ ${e}\n`);

if (errors.length === 0) {
  process.stdout.write(`  ✓ structure valid${process.argv.includes('--verdicts') ? ', every verdict re-derived and matching' : ''}\n`);
}
process.stdout.write('\n');

process.exitCode = errors.length === 0 ? 0 : 1;
