/**
 * The header: one bar, one drop layer, one command palette.
 *
 * The idea in one line — the search field IS the navigation. Everything the
 * site can do is an entry in it: pages, sections, catalogue skills, and live
 * actions (new post, sign out, switch theme, switch language). The mega menu
 * is not a second system; it is what that same palette shows before you type.
 *
 * Consequences of that idea, which is why the file looks the way it does:
 *   - exactly ONE drop layer (#ghDrop). Nav hover, empty search, typed search
 *     and the sign-in form are four states of the same box, so there is one
 *     open/close path, one Escape handler, one outside-click handler.
 *   - no dialog, no aria-modal, no body-scroll lock, no focus trap anywhere.
 *   - Firebase is never loaded to *display* the signed-in state. The state is
 *     read locally. The SDK arrives only when somebody presses a button that
 *     genuinely needs it.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { href, LANGS, FLAGS, SITE } from './layout.mjs';
import { LOGO } from './logo.mjs';
import { PORTAL } from './portal.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// Icons — small enough to be worth inlining, and the only ones the bar uses.
// ---------------------------------------------------------------------------

const I_SEARCH = `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"/></svg>`;
const I_THEME = `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5v13a6.5 6.5 0 0 1 0-13Z"/></svg>`;
const I_CARET = `<svg class="gh-caret" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 4l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I_BURGER = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1 3.75A.75.75 0 0 1 1.75 3h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 3.75Zm0 4A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75Zm0 4A.75.75 0 0 1 1.75 11h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75Z"/></svg>`;
const I_CLOSE = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>`;
const I_PLUS = `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M7.25 1.75a.75.75 0 0 1 1.5 0v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5Z"/></svg>`;

// ---------------------------------------------------------------------------
// The site map behind the mega menu.
//
// Section links are NOT written here. They are harvested from the real render
// (see setMenu below), because an anchor typed by hand goes stale the moment a
// heading is reworded and nothing fails loudly when it does.
// ---------------------------------------------------------------------------

export const SITEMAP = {
  airlock: {
    accent: 'airlock',
    lede: {
      en: 'Reads a skill file the way an assistant would, and tells you what it found.',
      de: 'Liest eine Skill-Datei so, wie ein Assistent es täte, und sagt dir, was drinsteht.',
    },
    cta: { en: 'Open AIRLOCK', de: 'AIRLOCK öffnen' },
    extra: {
      en: 'Nearby',
      de: 'In der Nähe',
      items: [
        { l: { en: 'Scanned skills', de: 'Geprüfte Skills' }, h: (lang) => href(lang, 'skills') },
        { l: { en: 'What can go wrong', de: 'Was schiefgehen kann' }, h: (lang) => href(lang, 'learn') },
        { l: { en: 'Source code', de: 'Quellcode' }, h: () => SITE.repoAirlock, ext: true },
        { l: { en: 'Report a false positive', de: 'False Positive melden' }, h: (lang) => `${href(lang, 'forum')}?cat=false-positives` },
      ],
    },
  },
  nexus: {
    accent: 'nexus',
    lede: {
      en: 'A Windows app that keeps the pieces in one place instead of five windows.',
      de: 'Eine Windows-App, die die Teile an einem Ort hält statt in fünf Fenstern.',
    },
    cta: { en: 'Open NEXUS', de: 'NEXUS öffnen' },
    extra: {
      en: 'Nearby',
      de: 'In der Nähe',
      items: [
        { l: { en: 'Source code', de: 'Quellcode' }, h: () => SITE.repoNexus, ext: true },
        { l: { en: 'Show your setup', de: 'Dein Setup zeigen' }, h: (lang) => `${href(lang, 'forum')}?cat=showcase` },
        { l: { en: 'Why it sits next to AIRLOCK', de: 'Warum es neben AIRLOCK steht' }, h: (lang) => href(lang, 'airlock') },
      ],
    },
  },
  scripts: {
    accent: 'index',
    lede: {
      en: 'Every FiveM resource with the version it declares — and a basket that ends in a message, not at a till.',
      de: 'Jede FiveM-Ressource mit der Fassung, die sie deklariert — und ein Warenkorb, der in einer Nachricht endet, nicht an einer Kasse.',
    },
    cta: { en: 'Open the scripts', de: 'Zu den Skripten' },
    extra: {
      en: 'Nearby',
      de: 'In der Nähe',
      items: [
        { l: { en: 'The basket', de: 'Der Warenkorb' }, h: (lang) => `${href(lang, 'scripts')}#korb` },
        { l: { en: 'What the licence check does', de: 'Was die Lizenzprüfung leistet' }, h: (lang) => href(lang, 'api') },
        { l: { en: 'Questions about a script', de: 'Fragen zu einem Skript' }, h: (lang) => `${href(lang, 'forum')}?cat=help` },
        { l: { en: 'Site notice and contact', de: 'Impressum und Kontakt' }, h: (lang) => href(lang, 'impressum') },
      ],
    },
  },
  skills: {
    accent: 'index',
    lede: {
      en: 'Every skill in the index, with the verdict the engine actually produced.',
      de: 'Jeder Skill im Index, mit dem Urteil, das die Engine tatsächlich erzeugt hat.',
    },
    cta: { en: 'Open the index', de: 'Index öffnen' },
    extra: {
      en: 'By verdict',
      de: 'Nach Urteil',
      items: [
        { l: { en: 'Passed', de: 'Bestanden' }, h: (lang) => `${href(lang, 'skills')}?v=pass` },
        { l: { en: 'Needs review', de: 'Prüfen' }, h: (lang) => `${href(lang, 'skills')}?v=review` },
        { l: { en: 'Blocked', de: 'Blockiert' }, h: (lang) => `${href(lang, 'skills')}?v=block` },
        { l: { en: 'Not scanned', de: 'Ungeprüft' }, h: (lang) => `${href(lang, 'skills')}?v=unscanned` },
        { l: { en: 'Submit a skill', de: 'Skill einreichen' }, h: () => `${SITE.repoAirlock}/blob/main/CONTRIBUTING.md`, ext: true },
      ],
    },
  },
  learn: {
    accent: 'nexus',
    lede: {
      en: 'Five questions, answered twice: short, and then properly.',
      de: 'Fünf Fragen, zweimal beantwortet: kurz, und dann richtig.',
    },
    cta: { en: 'Start reading', de: 'Loslesen' },
    extra: {
      en: 'Depth',
      de: 'Tiefe',
      items: [
        { l: { en: 'Short answers', de: 'Kurze Antworten' }, h: (lang) => `${href(lang, 'learn')}?level=basic` },
        { l: { en: 'The long version', de: 'Die lange Fassung' }, h: (lang) => `${href(lang, 'learn')}?level=deep` },
        { l: { en: 'Ask in the forum', de: 'Im Forum fragen' }, h: (lang) => `${href(lang, 'forum')}?cat=help` },
      ],
    },
  },
  api: {
    accent: 'nexus',
    lede: {
      en: 'The licence check a FiveM server talks to: the whole contract, and what it cannot do.',
      de: 'Die Lizenzprüfung, mit der ein FiveM-Server spricht: der ganze Vertrag, und was er nicht kann.',
    },
    cta: { en: 'Read the contract', de: 'Den Vertrag lesen' },
    extra: {
      en: 'Nearby',
      de: 'In der Nähe',
      items: [
        { l: { en: 'Questions about the API', de: 'Fragen zur API' }, h: (lang) => `${href(lang, 'forum')}?cat=help` },
        { l: { en: 'Ideas and requests', de: 'Ideen und Wünsche' }, h: (lang) => `${href(lang, 'forum')}?cat=ideas` },
        { l: { en: 'Site notice and contact', de: 'Impressum und Kontakt' }, h: (lang) => href(lang, 'impressum') },
      ],
    },
  },
  games: {
    accent: 'forum',
    lede: {
      en: 'Games from the network — playable right in the browser, and nothing loads from anyone else.',
      de: 'Spiele aus dem Netzwerk — direkt im Browser spielbar, und nichts lädt von Dritten.',
    },
    cta: { en: 'Open the games', de: 'Zu den Spielen' },
    extra: {
      en: 'Play',
      de: 'Spielen',
      items: [
        { l: { en: 'Reflex', de: 'Reflex' }, h: (lang) => `${href(lang, 'games')}#reflex` },
        { l: { en: 'Pairs', de: 'Paare' }, h: (lang) => `${href(lang, 'games')}#paare` },
        { l: { en: 'Suggest a game', de: 'Ein Spiel vorschlagen' }, h: (lang) => `${href(lang, 'forum')}?cat=ideas` },
      ],
    },
  },
  forum: {
    accent: 'index',
    lede: {
      en: 'Ask what something means. Beginner questions are the point.',
      de: 'Frag, was etwas bedeutet. Anfängerfragen sind der Sinn der Sache.',
    },
    cta: { en: 'Open the forum', de: 'Forum öffnen' },
    // Categories are not headings, so they cannot be harvested — they are the
    // one place where the menu genuinely owns its own links.
    extra: {
      en: 'Categories',
      de: 'Kategorien',
      items: [
        { l: { en: 'Help & questions', de: 'Hilfe & Fragen' }, h: (lang) => `${href(lang, 'forum')}?cat=help` },
        { l: { en: 'Skills', de: 'Skills' }, h: (lang) => `${href(lang, 'forum')}?cat=skills` },
        { l: { en: 'False positives', de: 'False Positives' }, h: (lang) => `${href(lang, 'forum')}?cat=false-positives` },
        { l: { en: 'Misses', de: 'Übersehenes' }, h: (lang) => `${href(lang, 'forum')}?cat=misses` },
        { l: { en: 'Ideas', de: 'Ideen' }, h: (lang) => `${href(lang, 'forum')}?cat=ideas` },
        { l: { en: 'Showcase', de: 'Zeigen' }, h: (lang) => `${href(lang, 'forum')}?cat=showcase` },
      ],
    },
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Vier Punkte statt sieben
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Sieben gleichrangige Punkte sind keine Navigation, sondern eine Liste — man
 * liest sie einzeln, statt sie zu erfassen. AIRLOCK, NEXUS und der Skill-Index
 * gehoeren ausserdem zusammen: es sind drei Werkzeuge, und dass sie
 * nebeneinander standen wie „Skripte" und „Forum", hat das verborgen.
 *
 * Jeder Punkt ist entweder eine Seite mit ihrem Menue (wie bisher) oder eine
 * GRUPPE, deren Menue ihre Kinder auflistet. Erreichbar bleibt jede Seite; sie
 * steht nur eine Ebene tiefer, wenn sie dorthin gehoert.
 *
 * `spiele` an den Skripten ist die Dimension aus `unternehmen.md`: sie steht
 * hier, bevor es GTA 6 gibt, damit ein neues Spiel ein Eintrag ist und kein
 * Umbau. Was es noch nicht gibt, wird auch nicht verlinkt — siehe `spielListe`.
 */
/**
 * Wie viele Ressourcen es je Spiel gibt.
 *
 * **Aus den Daten und nicht von Hand.** Das Feld `spiel` gibt es in
 * `content/scripts.json` noch nicht; alle 37 Eintraege sind FiveM-Ressourcen
 * und damit GTA V. Diese Vorgabe steht hier im Code und nicht als 37 gleiche
 * Zeilen in der Datei — sobald dort ein `spiel` steht, gilt es, und diese Zeile
 * aendert sich nicht.
 */
const PRODUKTE = JSON.parse(readFileSync(join(WURZEL, 'content', 'scripts.json'), 'utf8'));
export const SPIEL_ANZAHL = (Array.isArray(PRODUKTE) ? PRODUKTE : PRODUKTE.products ?? [])
  .reduce((z, p) => { const g = p.spiel ?? 'gta5'; z[g] = (z[g] ?? 0) + 1; return z; }, Object.create(null));

export const NAV = [
  {
    slug: 'scripts',
    key: 'scripts',
    spiele: [
      { key: 'gta5', l: { en: 'GTA V', de: 'GTA V' }, da: true },
      { key: 'gta6', l: { en: 'GTA VI', de: 'GTA VI' }, da: false },
      { key: 'egal', l: { en: 'Game-independent', de: 'Spielunabhängig' }, da: true },
    ],
  },
  {
    key: 'werkzeuge',
    gruppe: [
      { slug: 'airlock', key: 'airlock' },
      { slug: 'nexus', key: 'nexus' },
      { slug: 'skills', key: 'skills' },
    ],
  },
  { slug: 'games', key: 'games' },
  { slug: 'forum', key: 'forum' },
  { slug: 'learn', key: 'learn', dazu: [{ slug: 'api', key: 'api' }] },
];

/** Die Seiten hinter einem Punkt — eine Gruppe hat mehrere, eine Seite sich selbst. */
const seiten = (n) => (n.gruppe ? n.gruppe : [n]);

/** Jede Seite, die es gibt, in der Reihenfolge der Navigation. */
export const ALLE_SEITEN = NAV.flatMap((n) => [...seiten(n), ...(n.dazu ?? [])]);

/**
 * Harvested section anchors, filled by the build between its two passes.
 * Shape: MENU['en']['airlock'] = [{ t: 'What it actually shows you', u: '/airlock/#…' }]
 */
let MENU = {};
export function setMenu(m) { MENU = m || {}; }

// ---------------------------------------------------------------------------
// Markup
// ---------------------------------------------------------------------------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/**
 * Die Liste der Spiele im Skripte-Menue.
 *
 * **Was es noch nicht gibt, bekommt keinen Link.** GTA VI hat keine
 * Modding-Plattform; ein Link dorthin fuehrte auf eine leere Liste, und eine
 * leere Liste hinter einem Menuepunkt liest sich wie ein Fehler. Es steht
 * trotzdem da — als Ankuendigung, nicht als Angebot. Wer die Struktur erst
 * baut, wenn es soweit ist, baut sie zweimal.
 */
function spielListe(lang, spiele, t) {
  const eintraege = spiele.map((g) => {
    const n = SPIEL_ANZAHL[g.key] ?? 0;
    /*
     * **Verlinkt wird nur, was Eintraege hat.** Ein Menuepunkt, der auf eine
     * leere Liste fuehrt, liest sich wie ein Fehler — und „Spielunabhaengig"
     * waere heute genau das: alle 37 Ressourcen sind FiveM. Die Zeile steht
     * trotzdem da, mit ihrer Null, denn sie sagt etwas Wahres ueber das
     * Angebot.
     */
    if (!n) return `<li><span class="mega-bald">${esc(g.l[lang])}<em>${esc(g.da ? t.menu.keine : t.menu.bald)}</em></span></li>`;
    return `<li><a href="${href(lang, 'scripts')}?spiel=${g.key}">${esc(g.l[lang])}<em>${n}</em></a></li>`;
  }).join('');
  return `<div class="mega-col">
      <h3 class="mega-h">${esc(t.menu.spiel)}</h3>
      <ul>${eintraege}</ul>
    </div>`;
}

/**
 * Das Menue einer GRUPPE: keine eigene Seite, sondern ihre Kinder.
 *
 * Es sieht aus wie ein Seitenmenue und ist eines ohne Kopfspalte — eine Gruppe
 * hat nichts, worauf ihr „Mehr erfahren" zeigen koennte. Statt eine Seite dafuer
 * zu erfinden, steht hier die Aufzaehlung, und jedes Kind bringt seine eigene
 * Beschreibung mit.
 */
function gruppenPanel(lang, n, t) {
  const spalten = n.gruppe.map((k) => {
    const m = SITEMAP[k.key];
    return `<div class="mega-col">
      <h3 class="mega-h"><a href="${href(lang, k.slug)}" class="accent-${m.accent}">${esc(t.nav[k.key])}</a></h3>
      <p class="mega-kurz">${esc(m.lede[lang])}</p>
      <ul>${m.extra.items.slice(0, 3)
        .map((it) => `<li><a href="${esc(it.h(lang))}" class="dim">${esc(it.l[lang])}</a></li>`).join('')}</ul>
    </div>`;
  }).join('');
  return `<div class="gh-panel mega" id="mega-${n.key}" role="group" aria-label="${esc(t.nav[n.key])}">
  <div class="mega-in">${spalten}</div>
</div>`;
}

/** Seiten, die zu einem Punkt gehoeren, ohne eigener Punkt zu sein. */
function dazuListe(lang, dazu, t) {
  return `<div class="mega-col">
      <h3 class="mega-h">${esc(t.menu.auch)}</h3>
      <ul>${dazu.map((k) => `<li><a href="${href(lang, k.slug)}">${esc(t.nav[k.key])}</a></li>`).join('')}</ul>
    </div>`;
}

function megaPanel(lang, key, t, n = null) {
  const m = SITEMAP[key];
  const sections = (MENU[lang]?.[key] ?? []).slice(0, 7);
  const label = t.nav[key];

  const secList = sections.length
    ? `<div class="mega-col">
        <h3 class="mega-h">${t.menu.onPage}</h3>
        <ul>${sections.map((s) => `<li><a href="${esc(s.u)}">${esc(s.t)}</a></li>`).join('')}</ul>
      </div>`
    : '';

  const extras = `<div class="mega-col">
      <h3 class="mega-h">${m.extra[lang]}</h3>
      <ul>${m.extra.items
        .map((it) => {
          const url = it.h(lang);
          const ext = it.ext ? ' rel="noopener" class="ext"' : '';
          return `<li><a href="${esc(url)}"${ext}>${esc(it.l[lang])}</a></li>`;
        })
        .join('')}</ul>
    </div>`;

  return `<div class="gh-panel mega accent-${m.accent}" id="mega-${key}" role="group" aria-label="${esc(label)}">
  <div class="mega-in">
    <a class="mega-lead" href="${href(lang, key === 'skills' ? 'skills' : key)}">
      <span class="mega-kicker">${esc(label)}</span>
      <span class="mega-lede">${esc(m.lede[lang])}</span>
      <span class="mega-cta">${esc(m.cta[lang])} <span aria-hidden="true">→</span></span>
    </a>
    ${n?.spiele ? spielListe(lang, n.spiele, t) : ''}
    ${secList}
    ${extras}
    ${n?.dazu ? dazuListe(lang, n.dazu, t) : ''}
  </div>
</div>`;
}

/** The overview: every area at once. This is what an empty search field shows. */
function overviewPanel(lang, t) {
  const cols = ALLE_SEITEN.map((n) => {
    const m = SITEMAP[n.key];
    const sections = (MENU[lang]?.[n.key] ?? []).slice(0, 5);
    return `<div class="mega-col">
      <h3 class="mega-h"><a href="${href(lang, n.slug)}" class="accent-${m.accent}">${esc(t.nav[n.key])}</a></h3>
      <ul>${sections.map((s) => `<li><a href="${esc(s.u)}">${esc(s.t)}</a></li>`).join('')}
      ${m.extra.items
        .slice(0, 3)
        .map((it) => `<li><a href="${esc(it.h(lang))}" class="dim">${esc(it.l[lang])}</a></li>`)
        .join('')}</ul>
    </div>`;
  }).join('');

  return `<div class="gh-panel mega overview" id="mega-all" role="group" aria-label="${esc(t.menu.all)}">
  <div class="mega-in cols5">${cols}</div>
  <div class="mega-foot">
    <span class="mega-tip"><kbd>↑</kbd><kbd>↓</kbd> ${esc(t.find.navigate)}</span>
    <span class="mega-tip"><kbd>↵</kbd> ${esc(t.find.open)}</span>
    <span class="mega-tip"><kbd>esc</kbd> ${esc(t.menu.close)}</span>
    <a class="mega-tip" href="${href(lang, 'impressum')}">${esc(t.footer.impressum)}</a>
    <a class="mega-tip" href="${href(lang, 'datenschutz')}">${esc(t.footer.privacy)}</a>
  </div>
</div>`;
}

export function header(lang, current, t, opts = {}) {
  const nav = NAV.map(
    (n) => `<a class="gh-navlink" href="${n.slug ? href(lang, n.slug) : href(lang, n.gruppe[0].slug)}" data-mega="${n.key}"
      aria-expanded="false" aria-controls="mega-${n.key}" aria-haspopup="true"${seiten(n).some((k) => k.slug === current) || (n.dazu ?? []).some((k) => k.slug === current) ? ' aria-current="page"' : ''}>${t.nav[n.key]}${I_CARET}</a>`,
  ).join('');

  const langs = LANGS.map((l) => {
    const name = l === 'en' ? 'English' : 'Deutsch';
    return `<a href="${href(l, current)}" hreflang="${l}" aria-current="${l === lang}" title="${name}" data-lang="${l}">${FLAGS[l]}<span class="sr">${name}</span></a>`;
  }).join('');

  /* Eine Gruppe hat kein SITEMAP — sie hat Kinder. Deshalb zwei Bauer statt
     einer Verzweigung im Bauer selbst. */
  const megas = NAV.map((n) => (n.gruppe ? gruppenPanel(lang, n, t) : megaPanel(lang, n.key, t, n))).join('\n');

  // The sign-in form is markup, not a string built in JS: it has to be there
  // for anyone whose JavaScript failed, and it is one <form> so a password
  // manager recognises it.
  const authPanel = opts.auth
    ? `<div class="gh-panel authp" id="ghAuthPanel" role="group" aria-label="${esc(t.auth.signIn)}">
  <div class="authp-in">
    <div data-auth-view="out">
      <h3 class="authp-h">${esc(t.auth.signIn)}</h3>
      <p class="authp-note">${esc(t.auth.why)}</p>
      <a class="btn btn-primary authp-go" href="${href(lang, 'signin')}">${esc(t.auth.signIn)}</a>
    </div>

    <div data-auth-view="unverified" hidden>
      <h3 class="authp-h">${esc(t.auth.verifyH)}</h3>
      <p class="authp-note">${esc(t.auth.verifyP)}</p>
      <p class="authp-err" id="ghAuthErr2" role="status" hidden></p>
      <div class="authp-row">
        <button type="button" class="btn" id="ghAuthResend">${esc(t.auth.resend)}</button>
        <button type="button" class="btn btn-primary" id="ghAuthRecheck">${esc(t.auth.recheck)}</button>
      </div>
      <button type="button" class="linkish" data-signout>${esc(t.auth.signOut)}</button>
    </div>

    <div data-auth-view="in" hidden>
      <p class="authp-who"><span class="authp-avatar" id="ghAuthAvatar2" aria-hidden="true"></span><span><strong id="ghAuthName2"></strong><br><span class="authp-mail" id="ghAuthMail2"></span></span></p>
      <ul class="authp-links">
        <li><a href="${href(lang, 'forum')}?new=1">${esc(t.quick.newPost)}</a></li>
        <li><a href="${href(lang, 'forum')}?mine=1">${esc(t.auth.myPosts)}</a></li>
        <li><a href="${href(lang, 'account')}">${esc(t.auth.konto)}</a></li>
        ${PORTAL ? `<li><a href="${PORTAL}/" id="ghPortalLink">${esc(t.auth.portal)}</a></li>` : ''}
      </ul>
      <button type="button" class="btn" data-signout>${esc(t.auth.signOut)}</button>
    </div>
  </div>
</div>`
    : '';

  /*
   * Zwei Elemente fuer zwei Zustaende, und zwar mit Absicht.
   *
   * Abgemeldet ist "Anmelden" ein LINK auf eine Seite. Ein Ausklappfeld am
   * Bildschirmrand hat keine Adresse: man kann niemanden dorthin schicken, es
   * ist kein Ziel nach einer Weiterleitung, und der Zurueck-Knopf tut nichts.
   * Und in 400px am Rand war nie Platz fuer Google, GitHub und E-Mail
   * nebeneinander — deshalb fehlten die beiden Wege hier, waehrend es sie im
   * Kundenportal gab. Dieselbe Firma, zwei Anmeldungen.
   *
   * Angemeldet bleibt es ein Knopf mit Ausklappfeld, denn dann ist es kein
   * Formular mehr, sondern ein kurzes Menue — und dafuer ist ein Ausklappfeld
   * genau richtig.
   *
   * Ohne JavaScript ist der Link sichtbar und der Knopf nicht. Das ist die
   * richtige Reihenfolge: ohne Skript gibt es ohnehin keinen Anmeldezustand,
   * und der Link funktioniert trotzdem.
   */
  const authBtn = opts.auth
    ? `<a class="gh-signin" id="ghAuthLink" href="${href(lang, 'signin')}">
        <span id="ghAuthLinkLabel">${esc(t.auth.signIn)}</span>
      </a>
      <button type="button" class="gh-signin" id="ghAuthBtn" aria-expanded="false" aria-controls="ghAuthPanel" hidden>
        <span class="gh-avatar" id="ghAvatar" hidden aria-hidden="true"></span>
        <span id="ghAuthLabel">${esc(t.auth.signIn)}</span>
      </button>`
    : '';

  return `<header class="gh-header" id="ghHeader">
  <div class="gh-bar">
    <a class="gh-logo" href="${href(lang, '')}" aria-label="${esc(SITE.name)}">${LOGO}<span class="gh-word">${SITE.name}</span></a>

    <button type="button" class="gh-burger" id="ghBurger" aria-expanded="false" aria-controls="mega-all" aria-label="${esc(t.menu.open)}">${I_BURGER}</button>

    <nav class="gh-nav" id="ghNav" aria-label="Main">${nav}</nav>

    <div class="gh-find" id="ghFind">
      <button type="button" class="gh-findopen" id="ghFindOpen" aria-label="${esc(t.find.aria)}" aria-expanded="false">${I_SEARCH}</button>
      <div class="gh-findbox">
        <span class="gh-findicon" aria-hidden="true">${I_SEARCH}</span>
        <input id="siteSearch" class="gh-findinput" type="text" role="combobox"
               placeholder="${esc(t.find.placeholder)}" aria-label="${esc(t.find.aria)}"
               autocomplete="off" autocapitalize="off" spellcheck="false"
               aria-expanded="false" aria-controls="ghSugList" aria-autocomplete="list">
        <kbd class="gh-findkey" aria-hidden="true">/</kbd>
        <button type="button" class="gh-findclose" id="ghFindClose" aria-label="${esc(t.menu.close)}" hidden>${I_CLOSE}</button>
      </div>
    </div>

    <div class="lang-switch">${langs}</div>

    <div class="gh-actions">
      <a class="gh-quick" id="ghQuick" href="${href(lang, 'forum')}?new=1" hidden>${I_PLUS}<span>${esc(t.quick.newPostShort)}</span></a>
      <button class="icon-btn" id="themeBtn" type="button" title="${esc(t.themeLabel)}" aria-label="${esc(t.themeLabel)}">${I_THEME}</button>
      ${authBtn}
    </div>
  </div>

  <div class="gh-drop" id="ghDrop">
${megas}
${overviewPanel(lang, t)}
    <div class="gh-panel sug" id="ghSug" role="group">
      <div class="sug-in">
        <div id="ghSugList" role="listbox" aria-label="${esc(t.find.aria)}"></div>
        <div class="sug-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> ${esc(t.find.navigate)}</span>
          <span><kbd>↵</kbd> ${esc(t.find.open)}</span>
          <span id="ghSugCount" aria-live="polite"></span>
        </div>
      </div>
    </div>
${authPanel}
  </div>
</header>
<div class="gh-scrim" id="ghScrim"></div>`;
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

export const HEADER_CSS = `
/* ── header shell ───────────────────────────────────────────────────────── */
/*
 * The bar is deliberately the only full-bleed element on the site: it is the
 * frame, not part of the column. Everything under it keeps --w. The old
 * .wrap inside the header is gone, which is what let the two share a
 * max-width by accident.
 */
:root {
  --hdr-h: 62px;
  --hdr-pad: clamp(14px, 2.2vw, 32px);
  --hdr-find: 260px;
  --hdr-find-open: min(680px, 52vw);
  /* Every hover state in the bar goes through these, so a light header later
     is four lines, not forty. */
  --hdr-tint: rgba(255,255,255,0.07);
  --hdr-tint-2: rgba(255,255,255,0.13);
  --hdr-ring: rgba(255,255,255,0.22);
}

/*
 * ══ DER KOPF IST KEIN BALKEN MEHR, SONDERN FUENF INSELN ═══════════════════
 *
 * Vorher: ein durchgehender Balken mit Volltongrund und Unterkante. Alles
 * darin lag auf derselben Flaeche, und die Gruppen -- Marke, Navigation,
 * Sprache, Suche, Aktionen -- waren nur durch Abstand getrennt.
 *
 * Jetzt traegt jede Gruppe ihre eigene Flaeche, und **die Luecken dazwischen
 * sind der Entwurf**. Man sieht die Seite zwischen ihnen durchlaufen; nichts
 * ist verbunden, weil nichts verbunden gehoert.
 *
 * ══ Warum die Inseln in BEIDEN Schemata dunkel sind ═══════════════════════
 *
 * Weil der Kopf seit jeher sein eigener Farbraum ist (die Begruendung steht
 * bei --header-bg): was in ihm steht, richtet sich danach, dass er dunkel
 * ist, und nicht danach, ob die Seite hell oder dunkel ist. Ein Kopf, der
 * mitschaltet, braeuchte zwei Saetze Kontrastwerte fuer jedes Element darin.
 *
 * Der Grund ist durchscheinend und unterlegt: darunter laeuft der Inhalt
 * durch, und ohne backdrop-filter waere eine Ueberschrift, die gerade
 * darunter steht, als Schatten in der Insel zu lesen.
 *
 * ══ Doppelrand: Schale und Kern ═══════════════════════════════════════════
 *
 * Jede Insel ist eine Schale mit Innenabstand, und was darin liegt, hat einen
 * KLEINEREN Radius -- ausgerechnet, nicht geschaetzt:
 *
 *     innen = aussen - Innenabstand
 *
 * Nur dann sind die Kurven konzentrisch. Gleicher Radius innen wie aussen
 * ergibt an den Ecken eine sich verjuengende Sichel, und die sieht man, auch
 * wenn man sie nicht benennen kann.
 */
:root {
  /*
   * EINE Hoehe fuer alle fuenf. Gemessen standen sie vorher auf 36, 40, 44,
   * 46 und 47.1 px -- jede Insel so hoch, wie ihr Inhalt zufaellig war, und
   * die Oberkanten damit um 5.5px versetzt. Nebeneinanderliegende Koerper in
   * fuenf Hoehen liest man als Versehen, nicht als Entwurf. Der Inhalt
   * zentriert sich in die Hoehe hinein, nicht umgekehrt.
   */
  --insel-h: 44px;
  --insel-r: 15px;
  --insel-pad: 5px;
  --insel-r-innen: calc(var(--insel-r) - var(--insel-pad));

  /*
   * Der Grund der Insel ist HELLER als die dunkle Seite, nicht dunkler.
   *
   * Zuerst stand hier rgba(15,20,27,.86) -- gemessen 1.02:1 gegen den
   * Seitengrund. Das ist dieselbe Farbe. Eine Insel, die genau so dunkel ist
   * wie das Wasser, ist keine Insel; sichtbar war nur der Schatten, und der
   * allein liest sich als Fleck statt als Koerper.
   *
   * Der Inselgrund folgt der STIMME des Schemas, nicht seiner Helligkeit:
   * er ist in beiden Schemata dunkel (der Kopf ist sein eigener Farbraum),
   * aber bei Tag ein dunkles Blau und bei Nacht ein dunkles Violett.
   *
   * Nachgemessen: rgb(44,38,66) steht 1.36:1 ueber der Nacht #0d0a1a --
   * dieselbe Deutlichkeit, die vorher mit rgb(38,46,57) auf #0d1117 gewaehlt
   * wurde (1.38:1). Das Tag-Blau rgb(38,48,77) steht 13.02:1 ueber der
   * weissen Seite und traegt Blau 300 mit 6.67:1. Vier Bloecke wie bei jedem
   * Schema-Merkmal: Grundwert, Systemvorliebe, und die zwei ausdruecklichen
   * Schalterzustaende.
   */
  --insel-grund: rgba(38, 48, 77, 0.88);
  --insel-kante: rgba(255, 255, 255, 0.13);
  --insel-kante-hell: rgba(255, 255, 255, 0.19);
  /* Innenlicht an der Oberkante: das ist der Unterschied zwischen einer
     Flaeche und einem Koerper. */
  --insel-glanz: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  /* Zwei Schatten, nie einer -- dieselbe Regel wie im Rest der Seite: ein
     enger als Auflagekante, ein weiter als Entfernung. Und beide aus dem
     dunkelsten Violett der Palette statt aus neutralem Schwarz, sonst legt
     sich ein grauer Hof um jede Insel. */
  --insel-schatten: 0 1px 2px rgba(5, 3, 15, 0.55), 0 10px 26px -12px rgba(5, 3, 15, 0.8);
  --insel-schatten-hoch: 0 2px 5px rgba(5, 3, 15, 0.6), 0 24px 52px -18px rgba(5, 3, 15, 0.95);

  /* Eigene Kurve fuer den Kopf: traeger am Anfang, langes Ausschwingen. Sie
     laesst eine Insel wirken, als haette sie Masse. */
  --insel-ease: cubic-bezier(0.32, 0.72, 0, 1);
}

/* Die Nachtstimme des Inselgrunds — Begruendung und Messwerte oben. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { --insel-grund: rgba(44, 38, 66, 0.88); }
}
:root[data-theme='dark'] { --insel-grund: rgba(44, 38, 66, 0.88); }
:root[data-theme='light'] { --insel-grund: rgba(38, 48, 77, 0.88); }

.gh-header {
  position: sticky; top: 0; z-index: 50;
  background: transparent;
  padding-block: 10px;
}

.gh-bar {
  display: flex; align-items: center;
  /* Der Abstand IST die Gestaltung. Er waechst mit der Breite mit, damit die
     Inseln auf einem grossen Bildschirm nicht zusammenruecken. */
  gap: clamp(8px, 0.9vw, 14px);
  min-height: var(--hdr-h);
  padding-inline: var(--hdr-pad);
}

/* ── die Schale ─────────────────────────────────────────────────────────── */

.gh-logo, .gh-nav, .lang-switch, .gh-findbox, .gh-actions {
  height: var(--insel-h);
  box-sizing: border-box;
  background: var(--insel-grund);
  border: 1px solid var(--insel-kante);
  border-radius: var(--insel-r);
  box-shadow: var(--insel-schatten), var(--insel-glanz);
  -webkit-backdrop-filter: blur(14px) saturate(1.35);
  backdrop-filter: blur(14px) saturate(1.35);
  transition: box-shadow var(--mittel) var(--insel-ease),
              border-color var(--mittel) var(--insel-ease),
              transform var(--mittel) var(--insel-ease);
}

/* Was IN einer Schale liegt, bekommt den kleineren Radius. */
.gh-navlink, .lang-switch a, .gh-quick, .gh-actions .icon-btn,
.gh-signin, .gh-avatar { border-radius: var(--insel-r-innen); }

/*
 * Beim Scrollen sinken die Inseln nicht -- sie heben sich. Der Inhalt
 * wandert unter ihnen durch, und genau dann muessen sie sich davon absetzen.
 */
.gh-header.stuck .gh-logo, .gh-header.stuck .gh-nav, .gh-header.stuck .lang-switch,
.gh-header.stuck .gh-findbox, .gh-header.stuck .gh-actions {
  box-shadow: var(--insel-schatten-hoch), var(--insel-glanz);
  border-color: var(--insel-kante-hell);
}

/*
 * Drei Abstaende, die zusammen die Ruhe links im Kopf machen.
 *
 * 1. Zeichen zu Wortmarke: 11px waren zu wenig fuer eine Wortmarke, die seit
 *    dem Umstieg auf Montserrat 19px gross ist. Ein Zeichen klebt an einem
 *    Wort, sobald der Abstand kleiner wird als die Innenraeume der Schrift.
 * 2. Wortmarke zu Navigation: das war bisher der gap von 12px der Leiste,
 *    also
 *    derselbe Abstand wie zwischen zwei Knoepfen rechts. Die Marke ist aber
 *    kein Knopf in einer Reihe, sondern das eine Element, von dem sich alles
 *    andere absetzt.
 * 3. Beide wachsen, aber nicht gleich: 11 → 15 und 12 → 34. Der zweite bleibt
 *    dadurch der groessere, und genau daran liest man ab, dass Zeichen und
 *    Wort zusammengehoeren und die Navigation etwas anderes ist.
 */
.gh-logo { display: flex; align-items: center; gap: 11px; color: var(--header-fg); flex: none;
  padding: var(--insel-pad) 13px var(--insel-pad) 10px; }
.gh-logo:hover { text-decoration: none; opacity: 0.86; }

/*
 * Das Zeichen traegt die Markenfarbe, die Wortmarke nicht.
 *
 * Grund: das Zeichen IST die Marke, die Wortmarke ist ihr Name. Beides in
 * Farbe waere ein Klumpen; das Zeichen allein ist ein Akzent, und der Name
 * daneben bleibt lesbar wie jede andere Schrift im Kopf.
 *
 * Es ist --marke-auf-dunkel und keines der beiden Schema-Merkmale. Der
 * Kopfbalken ist dunkel, auch im hellen Schema, und richtet sich deshalb nicht
 * nach dem Schema der Seite. Der erste Entwurf nahm --marke-stark und landete
 * damit im hellen Schema bei 1.47:1 — gemessen, nicht vermutet. Ausfuehrlich
 * in build/marke.mjs.
 *
 * KEINE RUECKSTRICHE IN DIESEM KOMMENTAR — er steht innerhalb eines
 * Template-Literals, und einer darin beendet es.
 */
.gh-logo svg { display: block; color: var(--marke-auf-dunkel); }

/*
 * Von 26 auf 34 Punkt.
 *
 * Der Balken bleibt 62 Punkt hoch — das war die Auflage. Damit ist 34 fast
 * die Obergrenze: darueber wird die Luft ueber und unter dem Zeichen kleiner
 * als der Abstand zur Wortmarke, und dann sieht der Kopf gedraengt aus statt
 * grosszuegig. 34 laesst 14 Punkte oben und unten.
 */
.gh-logo svg.mark { width: 34px; height: 34px; }

.gh-word {
  font-family: var(--anzeige);
  /* Von 16 auf 19: die zwei Stufen, um die die Wortmarke wachsen sollte. 700
     statt 600, weil Montserrat leichter baut als die Systemschrift und bei 600
     neben einem 34er Zeichen duenn wirkt. */
  font-weight: 700; font-size: 19px; letter-spacing: -0.004em;
}

.gh-burger { display: none; }

/* ── Die Spieldimension im Menue ─────────────────────────────────────────── */

/*
 * Die Zahl steht rechts und in der Marke: sie ist die eigentliche Auskunft
 * dieser Zeile. „GTA V" allein sagt nur, dass es die Kategorie gibt; „GTA V 37"
 * sagt, dass sich das Klicken lohnt.
 */
.mega-col li a em,
.mega-bald em {
  font-style: normal; font-size: 0.82em; font-variant-numeric: tabular-nums;
  margin-left: 0.6em; opacity: 0.75;
}
.mega-col li a em { color: var(--marke); opacity: 1; font-weight: 600; }

/* Was es (noch) nicht gibt, ist kein Link — und sieht auch nicht wie einer aus. */
.mega-bald { color: var(--fg-subtle); cursor: default; }
.mega-bald em { text-transform: lowercase; letter-spacing: 0.02em; }

/* Die Beschreibung eines Werkzeugs in der Gruppenansicht. Zwei Zeilen, dann
   Schluss — ein Menue ist kein Ort zum Lesen. */
.mega-kurz {
  margin: 2px 0 8px; color: var(--fg-muted); font-size: 0.86rem; line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* ── nav ────────────────────────────────────────────────────────────────── */
/*
 * flex: 0 0 — the nav never shrinks. Letting it shrink is how a bar ends up
 * reading "AIRLOC" at 1000px: overflow:hidden clips mid-word and nothing looks
 * broken enough to notice in a screenshot. It collapses at a breakpoint or not
 * at all. --nav-w is measured once by the script; without it the nav simply
 * sizes to its content and the widening animation degrades to a fade.
 */
.gh-nav {
  display: flex; align-items: center; gap: 2px; padding: var(--insel-pad);
  flex: 0 0 var(--nav-w, auto); max-width: var(--nav-w, none);
  min-width: 0; overflow: hidden;
  /* The one auto margin in the bar. It is what pins the field and the actions
     to the right edge, and what the field eats into as it widens. */
  margin-right: auto;
}
.gh-navlink {
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--header-fg); font-size: 14px; font-weight: 500; white-space: nowrap;
  /* Kein senkrechter Innenabstand: der Verweis fuellt den Innenraum der
     Schale ganz aus. Mit eigener Hoehe lief er ueber und wurde beschnitten,
     weil .gh-nav overflow:hidden traegt. */
  padding: 0 11px; height: 100%; border-radius: var(--insel-r-innen); opacity: 0.82;
  transition: opacity var(--fast) var(--ease), background var(--fast) var(--ease);
}
.gh-navlink:hover, .gh-navlink:focus-visible { opacity: 1; background: var(--hdr-tint); text-decoration: none; }
.gh-navlink[aria-current="page"] { opacity: 1; background: var(--hdr-tint); }
.gh-navlink[aria-expanded="true"] { opacity: 1; background: var(--hdr-tint-2); }
.gh-caret { opacity: 0.5; transition: transform var(--fast) var(--ease); }
.gh-navlink[aria-expanded="true"] .gh-caret { transform: rotate(180deg); opacity: 0.9; }

/*
 * Der Marker unter dem geoeffneten Punkt.
 *
 * Er wuchs frueher aus dem Punkt heraus und landete auf der UNTERKANTE DES
 * BALKENS, damit das Panel darunter an diesem Punkt zu haengen scheint und
 * nicht am Kopf. Mit bottom: calc((var(--hdr-h) - 34px) / -2 - 1px) lag er
 * also ausserhalb des Verweises.
 *
 * Seit der Kopf aus Inseln besteht, gibt es diese Unterkante nicht mehr --
 * und .gh-nav traegt overflow: hidden, also wurde der Marker schlicht
 * abgeschnitten. Unsichtbar, und dazu 10px Ueberlauf in einer Schale, die
 * genau 44px hoch sein soll.
 *
 * Jetzt sitzt er INNEN, am unteren Rand des Verweises. Die Insel ist das,
 * woran das Panel haengt; der Marker sagt nur noch, an welchem Punkt davon.
 */
.gh-navlink { position: relative; }
.gh-navlink::after {
  content: ''; position: absolute; left: 10px; right: 10px; height: 2px;
  bottom: 5px;
  /* Der aktive Punkt traegt die Markenfarbe — der dritte kleine Akzent.
     --marke-auf-dunkel, weil der Balken in beiden Schemata dunkel ist;
     dieselbe Begruendung wie beim Zeichen, ausfuehrlich in build/marke.mjs. */
  border-radius: 2px; background: var(--marke-auf-dunkel);
  transform: scaleX(0); transform-origin: 50% 100%; opacity: 0;
  transition: transform var(--kurz) var(--ease), opacity var(--kurz) var(--ease);
}
.gh-navlink[aria-expanded="true"]::after { transform: none; opacity: 1; }
@media (prefers-reduced-motion: reduce) { .gh-navlink::after { transition: none; } }

/* ── the find field ─────────────────────────────────────────────────────── */
/*
 * It grows leftwards. The right edge is pinned by the nav's margin-right:auto,
 * so animating the basis moves only the left edge, and the nav collapses into
 * the same var(--mittel). Fixed basis rather than flex-grow, because a growing field
 * next to an auto margin never grows at all — the margin takes the free space
 * first — and a growing field without one leaves the actions floating away
 * from the right edge.
 */
.gh-find {
  flex: 0 0 var(--hdr-find); min-width: 0;
  transition: flex-basis var(--mittel) var(--ease);
}
.gh-header.finding .gh-find { flex-basis: var(--hdr-find-open); }
.gh-nav { transition: flex-basis var(--mittel) var(--ease), max-width var(--mittel) var(--ease),
                      opacity var(--kurz) var(--ease) 40ms, transform var(--mittel) var(--ease); }
.gh-header.finding .gh-nav {
  flex-basis: 0; max-width: 0;
  opacity: 0; transform: translateX(-10px); pointer-events: none;
  transition: flex-basis var(--mittel) var(--ease), max-width var(--mittel) var(--ease),
              opacity var(--kurz) var(--ease), transform var(--kurz) var(--ease);
}

.gh-findopen { display: none; }
.gh-findbox {
  display: flex; align-items: center; gap: 9px;
  padding: 0 var(--insel-pad) 0 13px;
  color: var(--header-fg);
}
.gh-findbox:hover { border-color: var(--insel-kante-hell); }
/*
 * ══ DIE SUCHE TRITT NACH VORN ═════════════════════════════════════════════
 *
 * Angeklickt ist sie nicht mehr eine Insel unter fuenf, sondern DIE Insel:
 * sie hebt sich, wird heller umrandet und legt sich ueber die anderen. Die
 * uebrigen treten zurueck -- nicht indem sie verschwinden, sondern indem sie
 * an Saettigung und Deckkraft verlieren.
 *
 * Das ist der Unterschied zwischen "ein Feld hat Fokus" und "ich suche
 * gerade". Ein Fokusring allein sagt das Erste; die Tiefenstaffelung sagt
 * das Zweite, und darum geht es hier.
 *
 * Bewegt wird nur transform und opacity -- filter auf einer Flaeche mit
 * backdrop-filter kostet sonst bei jedem Bild eine Neuberechnung.
 */
.gh-header.finding .gh-findbox {
  border-color: var(--insel-kante-hell);
  box-shadow: var(--insel-schatten-hoch), var(--insel-glanz),
              0 0 0 3px rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}
.gh-header.finding .gh-find { position: relative; z-index: 3; }

.gh-header.finding .gh-logo,
.gh-header.finding .lang-switch,
.gh-header.finding .gh-actions {
  opacity: 0.55;
  transition: opacity var(--mittel) var(--insel-ease);
}

/*
 * Haptik: eine Insel, die man druecken kann, gibt nach. 0.985 und nicht 0.95
 * -- eine Leiste ist kein Knopf, sie soll nachgeben und nicht einknicken.
 */
.gh-logo:active, .lang-switch:active, .gh-findbox:active { transform: scale(0.985); }
@media (prefers-reduced-motion: reduce) {
  .gh-logo:active, .lang-switch:active, .gh-findbox:active { transform: none; }
  .gh-header.finding .gh-findbox { transform: none; }
}
.gh-findicon { display: flex; opacity: 0.6; flex: none; }
.gh-findinput {
  flex: 1; min-width: 0; border: 0; background: transparent; outline: none;
  color: var(--header-fg); font: inherit; font-size: 13.5px;
}
.gh-findinput::placeholder { color: var(--header-fg); opacity: 0.55; }
.gh-findkey {
  flex: none; border: 1px solid var(--header-border); border-radius: 4px;
  padding: 1px 6px; font-size: 11px; opacity: 0.6; line-height: 1.4;
}
.gh-header.finding .gh-findkey { display: none; }
.gh-findclose { flex: none; background: none; border: 0; color: inherit; opacity: .6; cursor: pointer; padding: 3px; display: flex; }
.gh-findclose:hover { opacity: 1; }

/* ── actions ────────────────────────────────────────────────────────────── */
.gh-actions { display: flex; align-items: center; gap: 4px; flex: none; padding: var(--insel-pad); }

.gh-quick {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px; border-radius: var(--radius);
  font-size: 13px; font-weight: 600; white-space: nowrap;
  background: color-mix(in srgb, var(--marke-auf-dunkel) 22%, transparent);
  border: 1px solid color-mix(in srgb, var(--marke-auf-dunkel) 55%, transparent);
  color: var(--header-fg);
  animation: quickIn var(--mittel) var(--ease) both;
}
.gh-quick:hover { text-decoration: none; background: color-mix(in srgb, var(--marke-auf-dunkel) 34%, transparent); }
.gh-quick[hidden] { display: none; }
.gh-quick.warn { background: color-mix(in srgb, var(--accent-idx) 20%, transparent); border-color: color-mix(in srgb, var(--accent-idx) 55%, transparent); }
@keyframes quickIn { from { opacity: 0; transform: translateY(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .gh-quick { animation: none; } }

.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius);
  border: 1px solid var(--header-border); background: var(--hdr-tint);
  color: var(--header-fg); cursor: pointer; padding: 0;
}
.icon-btn:hover { background: var(--hdr-tint-2); }
.lang-switch { display: flex; gap: 2px; align-items: center; padding: var(--insel-pad); flex: none; }
.lang-switch a { color: var(--header-fg); padding: 5px 7px; border-radius: var(--radius); opacity: 0.5; line-height: 1; }
.lang-switch a svg { display: block; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,0.25); }
.lang-switch a:hover { opacity: 1; background: var(--hdr-tint); text-decoration: none; }
.lang-switch a[aria-current="true"] { opacity: 1; background: var(--hdr-tint-2); }

.gh-signin {
  display: inline-flex; align-items: center; gap: 7px;
  height: 32px; padding: 0 12px; border-radius: var(--radius);
  border: 1px solid var(--hdr-ring); background: transparent;
  color: var(--header-fg); font: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; white-space: nowrap;
}
.gh-signin:hover { background: var(--hdr-tint); }
.gh-signin[aria-expanded="true"] { background: var(--hdr-tint-2); }
/*
 * Der Avatar traegt die Markenschichtung als Verlauf: Violett in Himmel.
 * Beide Farben stehen als Literale, nicht als Schema-Merkmale — der Avatar
 * sitzt im Kopf (eigener Farbraum) UND im Panel (folgt dem Schema), und ein
 * Merkmal, das im hellen Schema dunkel wird, machte die Initialen unlesbar.
 * Die Tinte #120833 hat auf #b7a2fb 8.64:1 und auf #79c0ff mehr.
 */
.gh-avatar {
  width: 22px; height: 22px; border-radius: 50%; flex: none;
  display: grid; place-items: center; font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.02em; color: #120833;
  background: linear-gradient(140deg, #b7a2fb, #79c0ff);
}
.gh-avatar[hidden] { display: none; }
.gh-signin.unverified .gh-avatar { background: linear-gradient(140deg, var(--accent-idx), var(--danger)); }

/* ── the one drop layer ─────────────────────────────────────────────────── */
/*
 * ══ AUCH DAS PANEL IST EINE INSEL ═════════════════════════════════════════
 *
 * Es war eine durchgehende Platte von Kante zu Kante, die unten am Kopf klebte
 * und mit einer Unterkante abschloss -- gebaut fuer den Balken, der darueber
 * lag. Neben fuenf freistehenden Inseln liest sich das als der eine Teil, den
 * jemand vergessen hat.
 *
 * Jetzt haengt es frei: eingerueckt auf dieselbe Achse wie die Inseln, mit
 * demselben Radius, demselben Schatten, einem Abstand nach oben. Man sieht
 * unter dem Kopf hindurch, und das Panel schwebt darunter statt daran zu
 * haengen.
 */
.gh-drop {
  position: absolute; top: 100%; pointer-events: none;
  left: var(--hdr-pad); right: var(--hdr-pad);
  padding-top: 8px;
}
.gh-panel {
  display: none; opacity: 0; transform: translateY(-8px);
  pointer-events: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--insel-r);
  box-shadow: var(--insel-schatten-hoch);
  transition: opacity var(--kurz) var(--ease), transform var(--kurz) var(--ease);
}
.gh-panel.on { display: block; }
/* A five-column overview on a 1400x600 laptop is taller than what is left of
   the screen. Every panel scrolls inside itself rather than off the bottom. */
.gh-panel.mega { max-height: calc(100dvh - var(--hdr-h) - 34px); overflow-y: auto; overscroll-behavior: contain;
  border-radius: var(--insel-r); }
.gh-panel.on.show { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .gh-panel { transition: none; transform: none; } }

/*
 * The scrim appears only for panels somebody deliberately opened — search,
 * sign-in, the mobile menu. A hover mega menu must never dim the page: sweeping
 * across five nav items would strobe it.
 */
.gh-scrim {
  position: fixed; inset: 0; z-index: 40; background: rgba(5,3,15,0.34);
  opacity: 0; pointer-events: none; transition: opacity var(--kurz) var(--ease);
}
.gh-header[data-scrim] ~ .gh-scrim { opacity: 1; pointer-events: auto; }
@media (prefers-reduced-motion: reduce) { .gh-scrim { transition: none; } }

/* ── mega panels ────────────────────────────────────────────────────────── */
.mega-in {
  max-width: var(--w); margin: 0 auto; padding: 26px var(--hdr-pad) 30px;
  display: grid; gap: 26px 34px;
  grid-template-columns: minmax(220px, 300px) repeat(auto-fit, minmax(180px, 1fr));
}
.mega-in.cols5 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.mega-lead {
  display: flex; flex-direction: column; gap: 8px; color: var(--fg);
  border-left: 3px solid currentColor; padding-left: 16px;
}
.mega-lead:hover { text-decoration: none; }
.mega-kicker { font-family: var(--mono); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.mega-lede { color: var(--fg-muted); font-size: 0.92rem; line-height: 1.5; }
.mega-cta { font-size: 0.9rem; font-weight: 600; color: var(--link); }
.mega-lead:hover .mega-cta { text-decoration: underline; text-underline-offset: 0.18em; }
.mega-h { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--fg-subtle); margin-bottom: 0.7rem; font-weight: 600; }
.mega-h a { color: inherit; }
.mega-h a:hover { color: currentColor; }
.mega-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.mega-col a {
  display: block; color: var(--fg); font-size: 0.9rem; line-height: 1.35;
  padding: 6px 9px; margin-left: -9px; border-radius: 6px;
}
.mega-col a:hover { background: var(--surface-2); text-decoration: none; color: var(--link); }
.mega-col a.dim { color: var(--fg-muted); font-size: 0.85rem; }
.mega-col a.ext::after { content: ' ↗'; opacity: 0.45; font-size: 0.85em; }
/* Aligns the foot with .mega-in without a second wrapper element. */
.mega-foot {
  border-top: 1px solid var(--border); background: var(--bg-subtle);
  padding-block: 10px;
  padding-inline: max(var(--hdr-pad), calc((100% - var(--w)) / 2 + var(--hdr-pad)));
  display: flex; flex-wrap: wrap; gap: 6px 20px;
  font-size: 0.78rem; color: var(--fg-subtle);
}
.mega-tip kbd { border: 1px solid var(--border); border-radius: 4px; padding: 0 5px; background: var(--surface); margin-right: 2px; }

/* ── suggestions ────────────────────────────────────────────────────────── */
/*
 * The results card sits under the field, right-aligned with it. It is not
 * full width on purpose: a typed query is a narrow thing and a full-width
 * sheet would read as the overlay this replaced.
 */
.sug { background: transparent; border: 0; box-shadow: none; }
.sug-in {
  max-width: var(--w); margin: 0 auto; padding: 0 var(--hdr-pad);
  display: flex; justify-content: flex-end;
  flex-direction: column; align-items: flex-end;
}
#ghSugList, .sug-foot {
  width: min(var(--hdr-find-open), 100%);
  background: var(--surface); border: 1px solid var(--border); border-top: 0;
  box-shadow: var(--e3);
}
#ghSugList { max-height: min(62vh, 520px); overflow-y: auto; padding: 6px; border-radius: 0 0 2px 2px; }
.sug-foot {
  border-radius: 0 0 12px 12px; padding: 8px 14px;
  display: flex; gap: 16px; font-size: 0.76rem; color: var(--fg-subtle);
  border-top: 1px solid var(--border);
}
.sug-foot kbd { border: 1px solid var(--border); border-radius: 4px; padding: 0 5px; background: var(--surface-2); }
.sug-foot span:last-child { margin-left: auto; }

/* .search-hit and its children are reused verbatim from the old dialog. */
.search-hit[aria-selected="true"] { background: var(--surface-2); border-color: var(--border); }
.search-hit .hk.k-action { color: var(--marke); border-color: color-mix(in srgb, var(--marke) 45%, transparent); }
.search-hit .hk.k-skill { color: var(--accent-idx); border-color: color-mix(in srgb, var(--accent-idx) 45%, transparent); }
.search-hit .hk.k-here { color: var(--nexus); border-color: color-mix(in srgb, var(--nexus) 45%, transparent); }
.sug-group {
  font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--fg-subtle); padding: 10px 14px 4px;
}

/* ── sign-in panel ──────────────────────────────────────────────────────── */
.authp .authp-in {
  max-width: var(--w); margin: 0 auto; padding: 0 var(--hdr-pad);
  display: flex; justify-content: flex-end;
}
.authp .authp-in > div {
  width: min(400px, 100%); padding: 22px 24px 24px;
  background: var(--surface); border: 1px solid var(--border); border-top: 0;
  border-radius: 0 0 12px 12px; box-shadow: var(--e3);
}
.authp-h { font-size: 1.05rem; margin-bottom: 0.35rem; }
.authp-note { color: var(--fg-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; }
.authp-l { display: block; font-size: 0.78rem; color: var(--fg-muted); margin-bottom: 2px; }
.authp .fld { margin: 0 0 12px; }
.authp-go { width: 100%; justify-content: center; margin-top: 4px; }
.authp-err {
  color: var(--danger); font-size: 0.85rem; margin: -4px 0 10px;
  border-left: 2px solid var(--danger); padding-left: 10px;
}
.authp-err.ok { color: var(--ok); border-left-color: var(--ok); }
.authp-err[hidden] { display: none; }
.authp-alt { display: flex; justify-content: space-between; gap: 12px; margin-top: 12px; }
.authp-row { display: flex; gap: 10px; margin-bottom: 12px; }
.linkish { background: none; border: 0; padding: 0; font: inherit; font-size: 0.84rem; color: var(--link); cursor: pointer; }
.linkish:hover { text-decoration: underline; text-underline-offset: 0.18em; }
.authp-who { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-size: 0.9rem; }
.authp-mail { color: var(--fg-subtle); font-size: 0.82rem; }
.authp-avatar { width: 38px; height: 38px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-weight: 700; font-size: 15px; color: #120833; background: linear-gradient(140deg, #b7a2fb, #79c0ff); }
.authp-links { list-style: none; margin: 0 0 14px; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.authp-links a { display: block; padding: 7px 10px; margin-left: -10px; border-radius: 6px; color: var(--fg); font-size: 0.9rem; }
.authp-links a:hover { background: var(--surface-2); text-decoration: none; color: var(--link); }
[data-only="up"] { display: none; }
.authp.mode-up [data-only="up"] { display: block; }

/* ── narrow ─────────────────────────────────────────────────────────────── */
/*
 * 1200, not 980: at 1000px the nav items plus a usable field plus the actions
 * do not fit, and "does not fit" in a flex row means silent clipping — nothing
 * in the bar shrinks, so the overflow simply pushes the actions off the right
 * edge. The bar gives up the nav while there is still room for everything else.
 *
 * It was 1120 while there were five items. API is the sixth, and the German
 * labels are the long ones; 1120 left the bar about eighty pixels short of its
 * own content, which is exactly the failure this breakpoint exists to prevent.
 */
@media (max-width: 1200px) {
  .gh-nav { display: none; }
  .gh-find { margin-left: auto; }   /* the nav's auto margin went with it */
  /*
   * Burger und Suchknopf sind auf schmalen Geraeten EIGENE INSELN.
   *
   * Sie standen vorher auf dem Balken und brauchten nur eine Kante. Den Balken
   * gibt es nicht mehr -- sie hingen dadurch als leere Kaesten im Nichts, und
   * im hellen Schema sah man zwei weisse Quadrate ohne erkennbaren Zweck.
   *
   * Sie bekommen also dieselbe Schale wie die uebrigen Gruppen: gleiche Hoehe,
   * gleicher Radius, gleicher Schatten. Auf dem Telefon sind sie die Gruppe.
   */
  .gh-burger {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--insel-h); height: var(--insel-h); order: -1;
    border-radius: var(--insel-r);
    border: 1px solid var(--insel-kante); background: var(--insel-grund);
    box-shadow: var(--insel-schatten), var(--insel-glanz);
    -webkit-backdrop-filter: blur(14px) saturate(1.35);
    backdrop-filter: blur(14px) saturate(1.35);
    color: var(--header-fg); cursor: pointer; padding: 0;
    transition: border-color var(--mittel) var(--insel-ease);
  }
  .gh-burger:hover { border-color: var(--insel-kante-hell); }
  .gh-burger:active { transform: scale(0.985); }
  .mega-in { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .gh-panel.mega { max-height: calc(100dvh - var(--hdr-h)); overflow-y: auto; }
}

@media (max-width: 720px) {
  :root { --hdr-h: 56px; }
  /* The name stays. A phone showing only the symbol shows an unlabelled mark,
     and this one is deliberately not self-explanatory — it needs the word
     beside it far more than a padlock would. It only goes below 420px, where
     there is genuinely no room for both it and the search. */
  .gh-word { font-size: 17px; letter-spacing: -0.002em; }
  .gh-quick span { display: none; }
  .gh-quick { padding: 0 9px; }
  .lang-switch { display: none; }          /* lives in the menu panel instead */
  .gh-signin { padding: 0 9px; }
  .gh-signin #ghAuthLabel { display: none; }
  .gh-signin.io #ghAuthLabel { display: inline; }

  /* The field folds into its own icon and, when opened, takes the whole bar.
     Still the header — no dialog, no scroll lock, nothing to trap focus in. */
  .gh-find { flex: 0 0 auto; margin-left: auto; }
  .gh-findbox { display: none; }
  .gh-findopen {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--insel-h); height: var(--insel-h);
    border-radius: var(--insel-r);
    border: 1px solid var(--insel-kante); background: var(--insel-grund);
    box-shadow: var(--insel-schatten), var(--insel-glanz);
    -webkit-backdrop-filter: blur(14px) saturate(1.35);
    backdrop-filter: blur(14px) saturate(1.35);
    color: var(--header-fg); cursor: pointer; padding: 0;
  }
  .gh-findopen:active { transform: scale(0.985); }
  .gh-header.finding .gh-find {
    position: absolute; inset: 0 var(--hdr-pad) auto; height: var(--hdr-h);
    display: flex; align-items: center; z-index: 2;
  }
  .gh-header.finding .gh-findopen { display: none; }
  .gh-header.finding .gh-findbox { display: flex; flex: 1; height: 36px; }
  .gh-findclose { display: flex; }
  .sug-in, .authp .authp-in { padding: 0; }
  #ghSugList, .sug-foot, .authp .authp-in > div { width: 100%; border-radius: 0; border-inline: 0; }
  #ghSugList { max-height: calc(100dvh - var(--hdr-h) - 40px); }
}

/* Keyboard users get the panel too — hover is not the only way in. */
@media (max-width: 420px) { .gh-word { display: none; } }

@media (hover: none) { .gh-caret { opacity: 0.75; } }
`;

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * @param {{lang:string, strings:object, fb:object|null, urls:object}} cfg
 */
export const HEADER_JS = (cfg) => `
(function () {
  var C = ${JSON.stringify(cfg)};
  var S = C.strings;
  var head = document.getElementById('ghHeader');
  if (!head) return;

  var drop   = document.getElementById('ghDrop');
  var nav    = document.getElementById('ghNav');
  var input  = document.getElementById('siteSearch');
  var list   = document.getElementById('ghSugList');
  var count  = document.getElementById('ghSugCount');
  var scrim  = document.getElementById('ghScrim');
  var burger = document.getElementById('ghBurger');
  var quick  = document.getElementById('ghQuick');
  var authBtn = document.getElementById('ghAuthBtn');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // =========================================================================
  // 1. The drop layer. One opener, one closer, four kinds of content.
  // =========================================================================
  var openId = null, hoverTimer = null, closeTimer = null, lastTrigger = null, sticky = false;

  // The nav's natural width, so collapsing it can be animated rather than
  // switched off. Re-measured on resize because the labels are translated and
  // a German label is not an English one.
  function measureNav() {
    if (!nav || !nav.offsetParent) return;
    head.style.removeProperty('--nav-w');
    head.style.setProperty('--nav-w', nav.scrollWidth + 'px');
  }
  measureNav();
  addEventListener('resize', function () {
    if (head.classList.contains('finding')) return;
    measureNav();
  }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureNav);

  // Panels that dim the page, because somebody asked for them rather than
  // merely moved a mouse across the bar.
  var SCRIM = { 'ghSug': 1, 'ghAuthPanel': 1, 'mega-all': 1 };

  function panel(id) { return document.getElementById(id); }

  function openDrop(id, trigger, deliberate) {
    clearTimeout(closeTimer);
    if (openId === id) { if (deliberate) sticky = true; return; }
    if (openId) hide(openId);
    var p = panel(id);
    if (!p) return;
    openId = id;
    sticky = !!deliberate;
    lastTrigger = trigger || null;
    // Anything opened from somewhere other than the field gives the bar its
    // nav back — otherwise the sign-in panel appears above a header still
    // stretched open for a search nobody is doing any more.
    if (trigger !== input) head.classList.remove('finding');
    p.classList.add('on');
    // The panel goes display:none -> block, then fades in, and the two must
    // land in separate style resolutions or the browser has nothing to
    // animate from. The usual double-requestAnimationFrame does that — and
    // silently never fires in a background tab or any embedded view whose
    // rendering is suspended, leaving an open menu at opacity 0 with no way
    // for the reader to know it is there.
    //
    // Reading offsetHeight forces the same flush synchronously. It costs one
    // layout on a panel that was about to be laid out anyway, and it cannot
    // fail to happen.
    void p.offsetHeight;
    p.classList.add('show');
    head.setAttribute('data-drop', id);
    if (SCRIM[id]) head.setAttribute('data-scrim', ''); else head.removeAttribute('data-scrim');
    syncExpanded();
  }

  function hide(id) {
    var p = panel(id);
    if (!p) return;
    p.classList.remove('show');
    if (reduce) { p.classList.remove('on'); return; }
    setTimeout(function () { if (!p.classList.contains('show')) p.classList.remove('on'); }, 190);
  }

  function closeDrop(restoreFocus) {
    clearTimeout(hoverTimer); clearTimeout(closeTimer);
    if (!openId) return;
    hide(openId);
    openId = null;
    sticky = false;
    head.removeAttribute('data-drop');
    head.removeAttribute('data-scrim');
    head.classList.remove('finding');
    syncExpanded();
    if (restoreFocus && lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    lastTrigger = null;
  }

  function syncExpanded() {
    [].forEach.call(head.querySelectorAll('[data-mega]'), function (a) {
      a.setAttribute('aria-expanded', String(openId === 'mega-' + a.getAttribute('data-mega')));
    });
    if (burger) burger.setAttribute('aria-expanded', String(openId === 'mega-all'));
    if (authBtn) authBtn.setAttribute('aria-expanded', String(openId === 'ghAuthPanel'));
    input.setAttribute('aria-expanded', String(openId === 'ghSug'));
    if (openId !== 'ghSug') input.removeAttribute('aria-activedescendant');
  }

  // --- nav: hover with intent, focus, arrow keys ---------------------------
  [].forEach.call(head.querySelectorAll('[data-mega]'), function (a) {
    var id = 'mega-' + a.getAttribute('data-mega');
    if (canHover) {
      a.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { if (!head.classList.contains('finding')) openDrop(id, a); }, 90);
      });
      a.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
    }
    /*
     * Focus deliberately does NOT open the panel. Tabbing across five nav
     * items would otherwise swap the contents of a box under the cursor five
     * times. ArrowDown (and Alt+ArrowDown, the combobox convention) opens it,
     * which is also why the link carries aria-haspopup. Nothing in a panel is
     * unreachable without it: the same links are in the overview panel, the
     * palette and the footer.
     */
    a.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDrop(id, a, true);
        var first = panel(id).querySelector('a');
        if (first) first.focus();
      } else if (e.key === 'Escape') { closeDrop(true); }
    });
  });

  // Leaving the whole header closes a hovered panel — but slowly enough that
  // the diagonal mouse path from a nav item down into the panel survives it.
  // A panel that was clicked open stays open until it is dismissed.
  if (canHover) {
    head.addEventListener('mouseleave', function () {
      if (sticky) return;
      if (document.activeElement && head.contains(document.activeElement)) return;
      closeTimer = setTimeout(function () { closeDrop(false); }, 220);
    });
    head.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });

    /*
     * Drei Wege aus dem Menue heraus, die mouseleave auf dem Kopf NICHT
     * meldet — und an denen das Panel deshalb offen stehenblieb:
     *
     *   1. Der Zeiger verlaesst das Fenster nach oben, in die Leiste des
     *      Browsers. Je nach Weg und Geschwindigkeit bekommt der Kopf dabei
     *      kein mouseleave, weil der Zeiger das Dokument verlaesst statt ein
     *      Element.
     *   2. Es wird gescrollt. Das Rad bewegt den Zeiger nicht, also feuert
     *      gar nichts — der Kopf bleibt kleben, das Panel steht ueber dem
     *      Inhalt, und der Zeiger ist laengst woanders.
     *   3. Der Tab wird gewechselt. Beim Zurueckkommen steht das Menue
     *      immer noch offen, und niemand weiss mehr, warum.
     *
     * Alle drei schliessen nur ein per Hover geoeffnetes Panel. Was jemand
     * ANGEKLICKT hat (sticky), bleibt stehen — das ist eine Entscheidung
     * und keine Zeigerbewegung.
     */
    document.addEventListener('mouseleave', function () {
      if (!openId || sticky) return;
      closeTimer = setTimeout(function () { closeDrop(false); }, 220);
    });

    addEventListener('scroll', function () {
      if (!openId || sticky) return;
      closeDrop(false);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && openId && !sticky) closeDrop(false);
    });
  }

  if (burger) burger.addEventListener('click', function () {
    if (openId === 'mega-all') closeDrop(true); else openDrop('mega-all', burger, true);
  });

  // Outside interaction. pointerdown, not click: a click that starts outside
  // and ends on a link inside must not close before the link fires.
  document.addEventListener('pointerdown', function (e) {
    if (!openId) return;
    if (head.contains(e.target)) return;
    closeDrop(false);
  });
  if (scrim) scrim.addEventListener('click', function () { closeDrop(false); });

  /*
   * Escape in two steps, which is what people expect from a field that is
   * always there: the first press empties it (back to the menu), the second
   * closes the panel and gives the focus back to the page. Restoring focus to
   * the field instead would leave the bar stretched open around an empty box.
   */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !openId) return;
    if (openId === 'ghSug' && input.value) { input.value = ''; onQuery(); input.focus(); return; }
    var fromField = (openId === 'ghSug') || (openId === 'mega-all' && document.activeElement === input);
    closeDrop(!fromField);
    if (fromField) input.blur();
  });

  // Focus leaving the header entirely (Tab past the last item) closes it.
  head.addEventListener('focusout', function (e) {
    setTimeout(function () {
      if (!openId) return;
      if (head.contains(document.activeElement)) return;
      closeDrop(false);
    }, 0);
  });

  // =========================================================================
  // 2. The palette. Index + catalogue + current page + live actions.
  // =========================================================================
  var index = null, pending = null, hits = [], sel = 0;
  var findOpen = document.getElementById('ghFindOpen');
  var findClose = document.getElementById('ghFindClose');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (term) {
      if (term.length < 2) return;
      var re = new RegExp('(' + term.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  /*
   * One shared promise, deliberately.
   *
   * The old dialog loaded on open, so the fetch was always finished before the
   * first keystroke. Inline, the first keystroke starts it — and the version
   * that returned Promise.resolve() while a fetch was in flight made the
   * second keystroke render against a null index and flash "nothing found".
   */
  function load() {
    if (index) return Promise.resolve(index);
    if (pending) return pending;
    pending = fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { index = d.filter(function (e) { return e.l === C.lang; }); return index; })
      .catch(function () { index = []; return index; });
    return pending;
  }

  // Headings of the page you are already on. No network, so they answer the
  // first keystroke while the index is still arriving.
  var here = [].map.call(document.querySelectorAll('main h2[id]'), function (h) {
    return { t: (h.textContent || '').trim(), u: '#' + h.id, k: 'here', s: '', b: '' };
  });

  function actions() {
    var a = [];
    a.push({ k: 'action', t: S.actTheme, s: '', b: 'theme dark light design hell dunkel modus',
             run: function () { document.getElementById('themeBtn').click(); } });
    a.push({ k: 'action', t: S.actLang, s: '', b: 'language sprache deutsch english wechseln',
             run: function () { location.href = C.urls.alt; } });
    if (state.user && state.user.emailVerified) {
      a.push({ k: 'action', t: S.actNew, s: '', b: 'forum post thread beitrag neu new schreiben',
               run: function () { location.href = C.urls.newPost; } });
    }
    if (C.fb) {
      if (state.user) a.push({ k: 'action', t: S.actSignOut, s: '', b: 'sign out logout abmelden ausloggen', run: signOut });
      else a.push({ k: 'action', t: S.actSignIn, s: '', b: 'sign in login anmelden konto account',
                    run: function () { openDrop('ghAuthPanel', authBtn, true); focusAuth(); } });
    }
    return a;
  }

  function score(e, terms, q) {
    var t = e.t.toLowerCase(), b = (e.b || '').toLowerCase(), s = (e.s || '').toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (t.indexOf(term) === 0) total += 60;
      else if (t.indexOf(term) !== -1) total += 40;
      else if (s.indexOf(term) !== -1) total += 12;
      else if (b.indexOf(term) !== -1) total += 8;
      else return 0;
    }
    if (t.indexOf(q) !== -1) total += 30;
    if (e.k === 'page') total += 10;
    if (e.k === 'action') total += 22;   // a verb you typed is a thing you meant
    if (e.k === 'here') total += 16;     // and this page is where you already are
    if (e.k === 'skill') total += 6;
    return total;
  }

  var KIND = { page: 'page', section: 'section', skill: 'skill', action: 'action', here: 'here' };

  function renderHits() {
    var q = input.value.trim().toLowerCase();
    if (!q) { list.innerHTML = ''; count.textContent = ''; hits = []; return; }
    var terms = q.split(/\\s+/);
    var pool = actions().concat(here, index || []);
    hits = pool
      .map(function (e) { return { e: e, n: score(e, terms, q) }; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 14)
      .map(function (x) { return x.e; });

    if (!hits.length) {
      list.innerHTML = '<div class="search-empty">' + esc(S.noResults) + '</div>';
      count.textContent = '';
      return;
    }
    sel = 0;
    list.innerHTML = hits.map(function (e, i) {
      var label = S[KIND[e.k]] || e.k;
      return '<a class="search-hit" role="option" id="sug-' + i + '" aria-selected="' + (i === 0) + '"' +
        ' href="' + esc(e.u || '#') + '" data-i="' + i + '">' +
        '<span class="ht">' + highlight(e.t, terms) +
          '<span class="hk k-' + e.k + '">' + esc(label) + '</span></span>' +
        (e.s ? '<span class="hp">' + esc(e.s) + '</span>' : '') +
        (e.b && e.k !== 'action' ? '<span class="hb">' + highlight(e.b.slice(0, 170), terms) + '</span>' : '') +
        '</a>';
    }).join('');
    input.setAttribute('aria-activedescendant', 'sug-0');
    count.textContent = hits.length + ' ' + (hits.length === 1 ? S.result : S.resultsWord);
  }

  function move(d) {
    var nodes = list.querySelectorAll('.search-hit');
    if (!nodes.length) return;
    nodes[sel].setAttribute('aria-selected', 'false');
    sel = (sel + d + nodes.length) % nodes.length;
    nodes[sel].setAttribute('aria-selected', 'true');
    nodes[sel].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', 'sug-' + sel);
  }

  function activate(i) {
    var e = hits[i];
    if (!e) return;
    if (e.run) { closeDrop(false); input.blur(); e.run(); return; }
    location.href = e.u;
  }

  function onQuery() {
    if (input.value.trim()) {
      openDrop('ghSug', input, true);
      renderHits();               // current page + actions answer immediately
      load().then(function () { if (openId === 'ghSug') renderHits(); });
    } else {
      // Empty field: the mega menu IS the empty state. There is no second
      // navigation system, only this one before you have typed anything.
      openDrop('mega-all', input, true);
    }
  }

  function enterFind() {
    head.classList.add('finding');
    load();                        // warm the index while they are still aiming
    onQuery();
  }

  input.addEventListener('focus', enterFind);
  input.addEventListener('input', onQuery);
  if (findOpen) findOpen.addEventListener('click', function () { enterFind(); input.focus(); });
  if (findClose) findClose.addEventListener('click', function () { input.value = ''; closeDrop(false); });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (openId !== 'ghSug') { onQuery(); } else { move(1); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { if (hits.length) { e.preventDefault(); activate(sel); } }
    else if (e.key === 'Tab') { closeDrop(false); }
  });

  list.addEventListener('mousemove', function (e) {
    var a = e.target.closest('.search-hit');
    if (!a) return;
    var i = +a.getAttribute('data-i');
    if (i === sel) return;
    list.querySelectorAll('.search-hit')[sel].setAttribute('aria-selected', 'false');
    sel = i; a.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', 'sug-' + i);
  });
  list.addEventListener('click', function (e) {
    var a = e.target.closest('.search-hit');
    if (!a) return;
    var i = +a.getAttribute('data-i');
    if (hits[i] && hits[i].run) { e.preventDefault(); activate(i); }
  });

  // One owner for "/" now. The catalogue filter on /skills/ used to fight the
  // dialog for it; it keeps its click target and loses the shortcut.
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) ||
                 document.activeElement.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); enterFind(); input.focus(); input.select(); return;
    }
    if (e.key === '/' && !typing) { e.preventDefault(); enterFind(); input.focus(); }
  });

  // =========================================================================
  // 3. Signed-in state — read locally, never fetched to be displayed.
  // =========================================================================
  var state = { user: null };
  var CRUMB = 'skillry:who';

  var authLink = document.getElementById('ghAuthLink');
  /*
   * Das Ziel wird beim Laden gesetzt und nicht beim Klick.
   *
   * Beim Klick waere es zu spaet fuer den, der den Link mit der mittleren
   * Maustaste in einen neuen Tab legt oder seine Adresse kopiert: dort gibt es
   * kein Klickereignis, das noch etwas anhaengen koennte. Am Anmeldeknopf
   * liest man dann in der Statusleiste eine Adresse, die nicht die ist, die
   * beim Klick benutzt wuerde.
   *
   * Nur Pfad und Parameter, nie die ganze Adresse — die Gegenseite nimmt
   * ohnehin nur Pfade an (siehe ziel() in pages/anmelden.mjs), und was hier
   * nicht reingeschrieben wird, muss dort nicht abgewiesen werden.
   */
  if (authLink) {
    var hier = location.pathname + location.search;
    if (hier.indexOf('/signin') === -1) {
      authLink.href = authLink.href + '?weiter=' + encodeURIComponent(hier);
    }
  }

  function paint() {
    var u = state.user;
    /* Abgemeldet der Link zur Seite, angemeldet der Knopf mit dem Menue.
       Genau einer von beiden ist sichtbar, nie beide und nie keiner. */
    if (authLink) authLink.hidden = !!u;
    if (authBtn) authBtn.hidden = !u;
    if (authBtn && u) {
      var label = document.getElementById('ghAuthLabel');
      var av = document.getElementById('ghAvatar');
      var n = u.displayName || (u.email || '?').split('@')[0];
      authBtn.classList.toggle('io', true);
      authBtn.classList.toggle('unverified', !u.emailVerified);
      label.textContent = n.length > 14 ? n.slice(0, 13) + '…' : n;
      av.hidden = false;
      av.textContent = n.slice(0, 2).toUpperCase();
      authBtn.setAttribute('aria-label', S.account + ': ' + n);
      setView(u.emailVerified ? 'in' : 'unverified');
      var n2 = document.getElementById('ghAuthName2'), m2 = document.getElementById('ghAuthMail2'),
          a2 = document.getElementById('ghAuthAvatar2');
      if (n2) { n2.textContent = n; m2.textContent = u.email || ''; a2.textContent = n.slice(0, 2).toUpperCase(); }
    }
    if (quick) {
      if (u && u.emailVerified) {
        quick.hidden = false; quick.classList.remove('warn');
        quick.href = C.urls.newPost;
        quick.querySelector('span').textContent = S.quickNew;
        quick.removeAttribute('data-verify');
      } else if (u) {
        // Posting unverified is a guaranteed permission-denied from the rules.
        // Offering the button anyway would be offering a dead end.
        quick.hidden = false; quick.classList.add('warn');
        quick.href = '#';
        quick.setAttribute('data-verify', '1');
        quick.querySelector('span').textContent = S.quickVerify;
      } else {
        quick.hidden = true;
      }
    }
  }

  if (quick) quick.addEventListener('click', function (e) {
    if (quick.getAttribute('data-verify')) { e.preventDefault(); openDrop('ghAuthPanel', quick, true); focusAuth(); }
  });

  function setView(v) {
    [].forEach.call(document.querySelectorAll('[data-auth-view]'), function (el) {
      el.hidden = el.getAttribute('data-auth-view') !== v;
    });
  }

  /*
   * Two sources, cheapest first.
   *
   * (a) a crumb we write ourselves after a successful sign-in. Synchronous, so
   *     the bar is right in the first paint and never flickers from "Sign in"
   *     to a name.
   * (b) Firebase's own IndexedDB record, read only when (a) says there was a
   *     sign-in — because indexedDB.open() CREATES the database, and creating
   *     a Firebase store on the machine of someone who only read the homepage
   *     is exactly what this site promises not to do.
   *
   * Neither is ever an authorisation decision. The rules on the server are.
   */
  function readCrumb() {
    try { var s = localStorage.getItem(CRUMB); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function writeCrumb(u) {
    try {
      if (u) localStorage.setItem(CRUMB, JSON.stringify({
        uid: u.uid, displayName: u.displayName, email: u.email, emailVerified: !!u.emailVerified
      }));
      else localStorage.removeItem(CRUMB);
    } catch (e) {}
  }

  function refine() {
    if (!C.fb || !window.indexedDB || !state.user) return;
    var req;
    try { req = indexedDB.open('firebaseLocalStorageDb'); } catch (e) { return; }
    req.onupgradeneeded = function () {
      // It did not exist: the crumb is stale (cleared storage, another
      // profile). Do not leave the database we just created behind.
      req.transaction.abort();
    };
    req.onerror = function () { state.user = null; writeCrumb(null); paint(); };
    req.onsuccess = function () {
      var db = req.result;
      if (!db.objectStoreNames.contains('firebaseLocalStorage')) { db.close(); return; }
      var key = 'firebase:authUser:' + C.fb.apiKey + ':[DEFAULT]';
      var g = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').get(key);
      g.onsuccess = function () {
        var v = g.result && g.result.value;
        state.user = v ? { uid: v.uid, email: v.email, displayName: v.displayName, emailVerified: !!v.emailVerified } : null;
        writeCrumb(state.user);
        paint();
        db.close();
      };
      g.onerror = function () { db.close(); };
    };
  }

  state.user = readCrumb();
  paint();
  refine();

  // Another tab signed in or out; the bar should not disagree with itself.
  addEventListener('storage', function (e) {
    if (e.key !== CRUMB) return;
    state.user = readCrumb();
    paint();
  });

  // =========================================================================
  // 4. Firebase, loaded on purpose and not before.
  // =========================================================================
  var sdk = null;
  function ensureSdk() {
    if (sdk) return sdk;
    var BASE = 'https://www.gstatic.com/firebasejs/' + C.fb.sdk + '/';
    sdk = Promise.all([import(BASE + 'firebase-app.js'), import(BASE + 'firebase-auth.js')])
      .then(function (m) {
        var fb = Object.assign({}, m[0], m[1]);
        var app = fb.getApps().length ? fb.getApps()[0] : fb.initializeApp(C.fb.config);
        var auth = fb.getAuth(app);
        fb.onAuthStateChanged(auth, function (u) {
          state.user = u ? { uid: u.uid, email: u.email, displayName: u.displayName, emailVerified: !!u.emailVerified } : null;
          writeCrumb(state.user);
          paint();
        });
        return { fb: fb, app: app, auth: auth };
      });
    return sdk;
  }

  // The forum page uses this instead of initialising a second app, a second
  // auth instance and a second onAuthStateChanged that writes the same doc.
  if (C.fb) {
    window.Skillry = window.Skillry || {};
    window.Skillry.auth = { ensure: ensureSdk, state: state, config: C.fb };
  }

  function focusAuth() {
    setTimeout(function () {
      var v = document.querySelector('[data-auth-view]:not([hidden])');
      var f = v && v.querySelector('input, button');
      if (f) f.focus();
    }, 60);
  }

  if (authBtn) authBtn.addEventListener('click', function () {
    if (openId === 'ghAuthPanel') closeDrop(true);
    else { openDrop('ghAuthPanel', authBtn, true); focusAuth(); }
  });

  /*
   * Das Anmeldeformular ist umgezogen und mit ihm alles, was dazu gehoerte:
   * Umschalten zwischen Anmelden und Anlegen, das Absenden, das Zuruecksetzen
   * des Passworts und die Uebersetzung der Firebase-Fehlercodes. Das steht
   * jetzt in build/pages/anmelden.mjs.
   *
   * Was hier bleibt, ist das Ausklappfeld fuer den ANGEMELDETEN Zustand: die
   * Bestaetigung der Adresse und das kurze Kontomenue.
   */
  var err2 = document.getElementById('ghAuthErr2');
  function say(el, msg, ok) {
    if (!el) return;
    el.hidden = !msg; el.textContent = msg || '';
    el.classList.toggle('ok', !!ok);
  }
  function mapError(e) {
    var c = (e && e.code) || '';
    if (c.indexOf('too-many-requests') !== -1) return S.errMany;
    if (c.indexOf('network') !== -1) return S.errNet;
    return S.errGeneric;
  }

  var resend = document.getElementById('ghAuthResend');
  if (resend) resend.addEventListener('click', function () {
    ensureSdk().then(function (k) { return k.fb.sendEmailVerification(k.auth.currentUser); })
      .then(function () { say(err2, S.resendOk, true); })
      .catch(function (e2) { say(err2, mapError(e2)); });
  });

  // The stored record says "unverified" until a reload or a token refresh, so
  // somebody who just clicked the link needs a way to say so.
  var recheck = document.getElementById('ghAuthRecheck');
  if (recheck) recheck.addEventListener('click', function () {
    ensureSdk().then(function (k) {
      return k.auth.currentUser.reload().then(function () {
        var u = k.auth.currentUser;
        state.user = { uid: u.uid, email: u.email, displayName: u.displayName, emailVerified: !!u.emailVerified };
        writeCrumb(state.user); paint();
        if (!u.emailVerified) say(err2, S.stillUnverified);
      });
    }).catch(function (e2) { say(err2, mapError(e2)); });
  });

  function signOut() {
    ensureSdk().then(function (k) { return k.fb.signOut(k.auth); })
      .then(function () { state.user = null; writeCrumb(null); paint(); closeDrop(false); });
  }
  [].forEach.call(document.querySelectorAll('[data-signout]'), function (b) {
    b.addEventListener('click', signOut);
  });
})();`;
