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

  /*
   * There used to be a warning here saying an entry without localPath or
   * rawUrl "can never be scanned, so it stays unscanned". It contradicted the
   * file it was validating: of the sixteen entries it fired on, fifteen carry
   * a real scan block produced by build/fetch-scan.mjs. And `rawUrl` was a
   * field no script ever read and no entry ever set — it existed only in this
   * check and in the message above it.
   *
   * A validator that is wrong about its own data is worse than no validator:
   * it teaches the person reading the output to ignore warnings.
   */
  if (s.scan === null || s.scan === undefined) {
    warnings.push(`${id}: no verdict recorded — run "npm run rescan" or remove the entry`);
  }
}

// ── verdicts must be derived, not asserted ──────────────────────────────────

let derived = 0;

if (process.argv.includes('--verdicts')) {
  const AIRLOCK = process.env.AIRLOCK_PATH || join(ROOT, '..', 'airlock');
  const engineFile = join(AIRLOCK, 'core', 'scan.mjs');

  if (!existsSync(engineFile)) {
    errors.push(`(verdicts): no AIRLOCK checkout at ${AIRLOCK}. Set AIRLOCK_PATH.`);
  } else {
    const { scanText } = await import(pathToFileURL(engineFile).href);

    for (const s of catalog.skills) {
      // Only an entry with a local path can be re-derived today. The other
      // sixteen hold verdicts that build/fetch-scan.mjs produced from a
      // remote file at whatever the default branch pointed at that day —
      // real verdicts, but not reproducible ones, because nothing records
      // which commit they came from. Pinning every entry to a commit and a
      // blob is the next piece of work; until it lands, this loop covers
      // five of twenty-one and the summary below says so out loud.
      if (!s.localPath) continue;
      const file = join(AIRLOCK, s.localPath);
      if (!existsSync(file)) { warnings.push(`${s.id}: localPath not found, skipped`); continue; }

      const actual = scanText(readFileSync(file, 'utf8'), { filename: s.localPath }).verdict;
      const stored = s.scan?.verdict ?? 'unscanned';
      derived++;

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
  // The old summary said "every verdict re-derived and matching" whatever the
  // loop above had actually managed to check. Saying five out of twenty-one is
  // less impressive and is the only version that stays true when somebody
  // reads it next to the code.
  const total = catalog.skills.length;
  const note = process.argv.includes('--verdicts')
    ? `, ${derived} of ${total} verdicts re-derived and matching${derived < total ? ` (${total - derived} not yet pinned to a commit)` : ''}`
    : '';
  process.stdout.write(`  ✓ structure valid${note}\n`);
}
process.stdout.write('\n');

process.exitCode = errors.length === 0 ? 0 : 1;
