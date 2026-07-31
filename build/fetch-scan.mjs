/**
 * Scans third-party skills the index links to.
 *
 * The index's whole claim is that a verdict was produced rather than asserted.
 * For our own skills that is easy — they are on disk. For everyone else's, this
 * script locates the actual SKILL.md through the GitHub API, downloads it, and
 * runs the real AIRLOCK engine over the bytes.
 *
 * Two rules it follows, because the alternative is publishing fiction:
 *
 *   Never construct a raw URL. Paths vary (some repos keep SKILL.md at the root,
 *   others under skills/<name>/), and a guessed path yields a 404 that is easy to
 *   mistake for "nothing found".
 *
 *   A repository that could not be resolved stays `unscanned`. That word appears
 *   on the card, so a gap in coverage is visible rather than implied clean.
 *
 *   GITHUB_TOKEN=... AIRLOCK_PATH=../airlock node build/fetch-scan.mjs
 *
 * The token is optional but the unauthenticated rate limit is 60 requests an
 * hour, which this exhausts quickly.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = join(ROOT, 'content', 'catalog.json');
const AIRLOCK = process.env.AIRLOCK_PATH || join(ROOT, '..', 'airlock');

const engineFile = join(AIRLOCK, 'core', 'scan.mjs');
if (!existsSync(engineFile)) {
  process.stderr.write(`fetch-scan: no AIRLOCK checkout at ${AIRLOCK}. Set AIRLOCK_PATH.\n`);
  process.exit(2);
}
const { scanText, ENGINE_VERSION } = await import(pathToFileURL(engineFile).href);

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'skill-index-scanner',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

/** Find SKILL.md files in a repository without guessing where they live. */
async function findSkillFiles(owner, repo, limit = 6) {
  const meta = await gh(`/repos/${owner}/${repo}`);
  if (!meta) return [];

  const tree = await gh(`/repos/${owner}/${repo}/git/trees/${meta.default_branch}?recursive=1`);
  if (!tree || !Array.isArray(tree.tree)) return [];

  return tree.tree
    .filter((n) => n.type === 'blob' && /(^|\/)SKILL\.md$/i.test(n.path))
    .slice(0, limit)
    .map((n) => ({
      path: n.path,
      raw: `https://raw.githubusercontent.com/${owner}/${repo}/${meta.default_branch}/${n.path}`,
    }));
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'skill-index-scanner' } });
  if (!res.ok) return null;
  const text = await res.text();
  return text.length > 512 * 1024 ? null : text;
}

// ---------------------------------------------------------------------------

const catalog = JSON.parse(readFileSync(CATALOG, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

let scanned = 0;
let skipped = 0;
const report = [];

for (const skill of catalog.skills) {
  if (skill.localPath) continue; // handled by rescan.mjs
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/.exec(skill.url || '');
  if (!m) { skipped++; continue; }

  const files = await findSkillFiles(m[1], m[2]);
  if (!files.length) {
    skipped++;
    report.push([skill.id, 'no SKILL.md found', '']);
    continue;
  }

  // A collection is only as trustworthy as its worst entry, so the recorded
  // verdict is the worst one found rather than an average or the first hit.
  let worst = 'pass';
  const rank = { pass: 0, review: 1, block: 2 };
  let findings = 0;
  let invisible = 0;
  const reaches = new Set();
  let ok = 0;

  for (const f of files) {
    const text = await fetchText(f.raw);
    if (text === null) continue;
    const r = scanText(text, { filename: f.path });
    ok++;
    if (rank[r.verdict] > rank[worst]) worst = r.verdict;
    findings += r.findings.filter((x) => !x.suppressed).length;
    invisible += r.stats.invisibles;
    for (const c of r.capability.derived) reaches.add(c);
  }

  if (!ok) { skipped++; report.push([skill.id, 'could not download', '']); continue; }

  skill.scan = {
    verdict: worst,
    findings,
    invisible,
    reaches: [...reaches].sort(),
    filesScanned: ok,
    sampledOf: files.length,
    engine: ENGINE_VERSION,
    date: today,
  };
  scanned++;
  report.push([skill.id, worst, `${ok} file(s), ${findings} finding(s)`]);
}

catalog.updated = today;
writeFileSync(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

process.stdout.write(`\nfetch-scan: ${scanned} scanned, ${skipped} left unscanned\n\n`);
for (const [id, verdict, detail] of report) {
  process.stdout.write(`  ${String(verdict).padEnd(20)} ${id.padEnd(34)} ${detail}\n`);
}
process.stdout.write('\n');
