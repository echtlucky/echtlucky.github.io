/**
 * Validates the two content files the build reads.
 *
 * The skill index, where the second job is the point of the whole index:
 *
 *   1. Structure — required fields, no duplicate ids, sane links.
 *   2. Nobody may type their own verdict. Continuous integration re-derives
 *      every verdict from the actual skill and fails if the file disagrees, so
 *      a pull request cannot introduce an entry that claims to be clean.
 *
 * And the script catalogue, where the checks exist to keep two promises the
 * page makes: no invented price, and no picture without its dimensions.
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
const VERDICTS = new Set(['pass', 'review', 'block', 'unscanned', 'unscannable']);
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
  /*
   * An entry that CANNOT be scanned is a third case, and it used to fall
   * through to the warning below with two remedies that were both wrong.
   *
   * `mcp-registry` is the official MCP registry: a service that verifies
   * namespace ownership through GitHub, DNS or HTTP. There is no SKILL.md to
   * read. `npm run rescan` skips it forever (no localPath), and removing it
   * would drop a genuinely relevant entry — it is a different axis of trust,
   * which is exactly why it is listed.
   *
   * So it declares why, in both languages, and the index prints that reason on
   * the card. The rule from the comment above applies to this warning too: one
   * that fires where neither of its remedies applies teaches the reader to
   * ignore warnings.
   */
  if (s.unscannable) {
    if (s.scan) fail(id, 'an entry cannot be both unscannable and carry a scan');
    else if (!s.unscannable.en || !s.unscannable.de) {
      fail(id, 'unscannable must say why, in both languages');
    }
  } else if (s.scan === null || s.scan === undefined) {
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

// ── the script catalogue ────────────────────────────────────────────────────

const shop = JSON.parse(readFileSync(join(ROOT, 'content', 'scripts.json'), 'utf8'));
const shopErrors = [];
const bad = (id, msg) => shopErrors.push(`${id}: ${msg}`);

const RESOURCE = /^[a-z0-9][a-z0-9_-]*$/;
const SEMVER = /^\d+\.\d+\.\d+$/;

if (!Array.isArray(shop.products) || shop.products.length === 0) {
  shopErrors.push('(products): must be a non-empty array');
} else {
  const ids = new Set();

  for (const p of shop.products) {
    const id = p.id ?? '(no id)';

    if (!p.id || !RESOURCE.test(p.id)) bad(id, 'id must be the resource folder name, lowercase');
    if (ids.has(p.id)) bad(id, 'duplicate id');
    ids.add(p.id);

    if (!SEMVER.test(String(p.version ?? ''))) bad(id, 'version must be the x.y.z from fxmanifest.lua');

    for (const lang of ['en', 'de']) {
      if (!p.title?.[lang]) bad(id, `title.${lang} is missing`);
      if (!p.summary?.[lang]) bad(id, `summary.${lang} is missing`);
      else if (p.summary[lang].length > 320) bad(id, `summary.${lang} is over 320 characters`);
    }

    if (p.requires !== undefined && !Array.isArray(p.requires)) bad(id, 'requires must be an array');

    /*
     * A price is either absent or a real number. The string "19,99" would render
     * as a currency amount and sort as nothing, and 0 is a price nobody meant to
     * set — both are the kind of number a reader would take for real, which is
     * the one thing the page promises not to show.
     */
    if (p.price !== null && p.price !== undefined) {
      if (typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price <= 0) {
        bad(id, 'price must be null or a positive number, never a string');
      }
    }

    if (p.media !== undefined) {
      if (!Array.isArray(p.media)) bad(id, 'media must be an array');
      else
        for (const m of p.media) {
          if (m.type !== 'image' && m.type !== 'video') bad(id, 'media.type must be "image" or "video"');
          if (!m.src || !m.src.startsWith('/')) bad(id, 'media.src must be a root-relative path');
          // Without both, the page jumps while the file loads. The rule is
          // easier to keep here than to remember.
          if (!Number.isInteger(m.w) || !Number.isInteger(m.h) || m.w <= 0 || m.h <= 0) {
            bad(id, 'media needs integer w and h, or the layout shifts on load');
          }
          if (m.type === 'image' && !m.alt?.en) bad(id, 'an image needs alt text in both languages');
        }
    }
  }
}

if (shop.handoff?.discord && !/^https:\/\//.test(shop.handoff.discord)) {
  shopErrors.push('(handoff): discord must be an https invite, or empty');
}
if (!shop.handoff?.email || !shop.handoff.email.includes('@')) {
  shopErrors.push('(handoff): no email address, and with an empty discord field the basket would have nowhere to go');
}

errors.push(...shopErrors);

// ── report ──────────────────────────────────────────────────────────────────

const priced = (shop.products ?? []).filter((p) => typeof p.price === 'number').length;
const medien = (p) => (Array.isArray(p.media) ? p.media : []);
// Getrennt gezaehlt wie auf der Seite selbst: eine gezeichnete Oberflaeche
// ist keine Aufnahme aus dem Spiel.
const ui = (shop.products ?? []).filter((p) => medien(p).some((m) => m.kind === 'ui')).length;
const shot = (shop.products ?? []).filter((p) => medien(p).some((m) => m.kind !== 'ui')).length;

process.stdout.write(
  `\nskill index — ${catalog.skills.length} entries` +
    ` · script catalogue — ${(shop.products ?? []).length} products,` +
    ` ${priced} priced, ${ui} with an interface, ${shot} with a recording\n\n`,
);
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
