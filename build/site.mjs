/**
 * Builds the whole site.
 *
 *   node build/site.mjs
 *
 * Every page is emitted once per language: English at the root, German under
 * /de/. There is no framework and no dependency — a site this size does not
 * need a build pipeline, it needs a loop.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render, LANGS, base, href, SITE } from './layout.mjs';
import { indexPage } from './search.mjs';

import * as home from './pages/home.mjs';
import * as airlock from './pages/airlock.mjs';
import * as nexus from './pages/nexus.mjs';
import * as deck from './pages/deck.mjs';
import * as skills from './pages/skills.mjs';
import * as learn from './pages/learn.mjs';
import * as scripts from './pages/scripts.mjs';
import * as api from './pages/api.mjs';
import * as forum from './pages/forum.mjs';
import * as games from './pages/games.mjs';
import * as spielReflex from './pages/spiel-reflex.mjs';
import * as spielPaare from './pages/spiel-paare.mjs';
import * as spielSequenz from './pages/spiel-sequenz.mjs';
import * as geobingo from './pages/geobingo.mjs';
import * as anmelden from './pages/anmelden.mjs';
import * as konto from './pages/konto.mjs';
import * as uebergabe from './pages/uebergabe.mjs';
import { impressum, privacy } from './pages/legal.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');
/** Was nur kopiert wird — die selbst gehostete Schrift und ihre Lizenz. */
const STATISCH = join(ROOT, 'static');

// The legal pages sit at the end: they are reachable from the footer, not
// from the main navigation, which is where people actually look for them.
const PAGES = [home, airlock, nexus, deck, skills, learn, scripts, api, forum, games, spielReflex, spielPaare, spielSequenz, geobingo, anmelden, konto, uebergabe, impressum, privacy];

// ---------------------------------------------------------------------------

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const written = [];
const searchIndex = [];

for (const lang of LANGS) {
  for (const page of PAGES) {
    const meta = page.meta[lang];
    const html = render({
      lang,
      slug: page.slug,
      title: meta.title,
      description: meta.description,
      body: page.body(lang),
      script: typeof page.script === 'function' ? page.script(lang) : '',
      // Page-owned <head> content, the same opt-in shape as `script`. It exists
      // for CSS that only one page needs: the alternative is the house habit of
      // appending to theme-extra.mjs, which ships every page's stylesheet to
      // every page. One page's shop layout has no business loading on the
      // Impressum.
      head: typeof page.head === 'function' ? page.head(lang) : '',
      // Dieselbe Opt-in-Form wie `script` und `head`: GSAP und die
      // Choreografie kommen nur auf Seiten, die sie anfordern. 118 KB auf das
      // Impressum zu laden waere dieselbe Nachlaessigkeit, gegen die der
      // Kommentar darueber schon argumentiert.
      bewegung: typeof page.bewegung === 'number' ? page.bewegung : 0,
      // Eine Seite ohne Rahmen. Siehe renderBlank() in layout.mjs — und den
      // Grund dafuer, der dort steht, weil er kein Geschmacksurteil ist.
      blank: page.blank === true,
    });

    const dir = join(OUT, base(lang).replace(/^\//, ''), page.slug);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, 'index.html');
    writeFileSync(file, html, 'utf8');
    written.push([href(lang, page.slug), Buffer.byteLength(html)]);

    // Index the rendered page, so search only ever finds what a reader can see.
    // Ausser sie soll gar nicht gefunden werden: eine `blank`-Seite haengt
    // hinter einem Code, und in der Suche dieser Website zu stehen waere genau
    // die Tuer, die der Code zumachen soll.
    if (page.blank) continue;
    searchIndex.push(...indexPage({
      lang,
      url: href(lang, page.slug),
      title: meta.title,
      html,
      kind: page.slug === '' ? 'page' : 'page',
    }));
  }
}

// ---------------------------------------------------------------------------
// Sitemap, robots, and the file that stops GitHub Pages running Jekyll over us
// ---------------------------------------------------------------------------

const SITE_CFG = JSON.parse(readFileSync(join(ROOT, 'content', 'site.json'), 'utf8'));
const ORIGIN = SITE_CFG.origin;

const urls = [];
for (const lang of LANGS) {
  for (const page of PAGES) {
    if (page.blank) continue;
    const loc = `${ORIGIN}${href(lang, page.slug)}`;
    const alts = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, page.slug)}"/>`,
    ).join('\n');
    urls.push(`  <url>\n    <loc>${loc}</loc>\n${alts}\n  </url>`);
  }
}

writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
  'utf8',
);

writeFileSync(join(OUT, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');

// GitHub Pages reads this out of the published artifact and starts
// redirecting the github.io address to it the moment it appears. Emitting
// it before DNS is ready takes the site down without anything having
// failed: both addresses then serve the registrar's parking page. So it is
// written only once customDomain is deliberately set, which is meant to
// happen after DNS resolves, not before.
if (SITE_CFG.customDomain) {
  writeFileSync(join(OUT, 'CNAME'), `${SITE_CFG.customDomain}\n`, 'utf8');
}

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`, 'utf8');

// GitHub Pages runs Jekyll by default, which silently ignores files starting
// with an underscore. We have none, but relying on that is a trap for later.
writeFileSync(join(OUT, '.nojekyll'), '', 'utf8');

/*
 * Alles aus `static/` unveraendert nach `dist/`.
 *
 * Bisher gab es diesen Ordner nicht — jede Datei der Seite wurde erzeugt. Mit
 * der eigenen Schrift gibt es zum ersten Mal etwas, das nur kopiert wird: zwei
 * `woff2` und die Lizenz dazu. Sie liegen bei uns und nicht bei Google, und
 * warum, steht ausfuehrlich in `build/marke.mjs`.
 */
if (existsSync(STATISCH)) {
  cpSync(STATISCH, OUT, { recursive: true });
  const n = readdirSync(join(OUT, 'schrift')).length;
  process.stdout.write(`  + static/ kopiert (${n} Dateien unter /schrift/)
`);
}

// A 404 that keeps the header, so a wrong URL is not a dead end.
const notFound = render({
  lang: 'en',
  slug: '',
  title: '404 — page not found · Skillry',
  description: 'That page does not exist.',
  body: `<section class="hero"><div class="wrap stack">
    <span class="eyebrow">404</span>
    <h1>That page does not exist.</h1>
    <p class="lede">The link may be old, or I may have moved something. Everything is reachable from the header above.</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="/">Home</a>
      <a class="btn" href="/skills/">Skill index</a>
      <a class="btn" href="${SITE.repoAirlock}">GitHub</a>
    </div>
  </div></section>`,
});
writeFileSync(join(OUT, '404.html'), notFound, 'utf8');

// ---------------------------------------------------------------------------

const total = written.reduce((n, [, bytes]) => n + bytes, 0);
process.stdout.write(`built ${written.length} pages · ${(total / 1024).toFixed(0)} KB total\n`);
for (const [url, bytes] of written) {
  process.stdout.write(`  ${url.padEnd(18)} ${(bytes / 1024).toFixed(0).padStart(4)} KB\n`);
}
process.stdout.write('  + sitemap.xml, robots.txt, 404.html, .nojekyll\n');
