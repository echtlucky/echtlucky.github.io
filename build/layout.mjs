/**
 * The page shell: header, navigation, language switch, footer.
 *
 * No template language and no dependencies — the pages are JavaScript template
 * literals, which is enough structure for a site this size and keeps the whole
 * build to `node build/site.mjs`.
 */

import { CSS } from './theme.mjs';
import { CSS_EXTRA, HERO_JS } from './theme-extra.mjs';
import { SEARCH_CSS, SEARCH_MARKUP, SEARCH_JS, anchorHeadings } from './search.mjs';

export const LANGS = ['en', 'de'];
export const DEFAULT_LANG = 'en';

export const SITE = {
  name: 'Skillry',
  github: 'https://github.com/echtlucky',
  repoAirlock: 'https://github.com/echtlucky/airlock',
  repoNexus: 'https://github.com/echtlucky/nexus-os',
  repoSite: 'https://github.com/echtlucky/echtlucky.github.io',
  discussions: 'https://github.com/echtlucky/airlock/discussions',
};

/** Root-relative prefix for a language. English lives at the root. */
export const base = (lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`);

/** Build an internal href for a page slug in a language. */
export const href = (lang, slug) => `${base(lang)}/${slug ? `${slug}/` : ''}` || '/';

// ---------------------------------------------------------------------------
// Chrome strings
// ---------------------------------------------------------------------------

export const UI = {
  en: {
    tagline: 'Tools for people who use AI, and want to know what it is running.',
    nav: { airlock: 'AIRLOCK', nexus: 'NEXUS', skills: 'Skill index', learn: 'Learn', forum: 'Forum' },
    searchPlaceholder: 'Search',
    searchHint: 'Search this site',
    searchEverything: 'Search pages, skills and guides…',
    typeToSearch: 'Start typing to search everything on this site.',
    noResults: 'Nothing found. Try a different word.',
    navigate: 'to navigate',
    open: 'to open',
    page: 'page',
    section: 'section',
    result: 'result',
    resultsWord: 'results',
    themeLabel: 'Toggle light and dark',
    skipLink: 'Skip to content',
    footer: {
      products: 'Products',
      resources: 'Resources',
      community: 'Community',
      about: 'About',
      docs: 'Documentation',
      source: 'Source code',
      catalogue: 'Skill index',
      submit: 'Submit a skill',
      forum: 'Forum',
      discussions: 'GitHub Discussions',
      learn: 'Learn about AI safety',
      security: 'Report a security issue',
      legal: 'Legal',
      impressum: 'Site notice',
      privacy: 'Privacy',
      note: 'Built in the open. No trackers, no analytics, no advertising. Every page but the forum is entirely self-contained; the forum talks to Firebase, and the privacy page says exactly what that means.',
      rights: 'MIT licensed. Made by Skillry.',
    },
  },
  de: {
    tagline: 'Werkzeuge für Leute, die KI benutzen und wissen wollen, was da läuft.',
    nav: { airlock: 'AIRLOCK', nexus: 'NEXUS', skills: 'Skill-Index', learn: 'Lernen', forum: 'Forum' },
    searchPlaceholder: 'Suchen',
    searchHint: 'Diese Seite durchsuchen',
    searchEverything: 'Seiten, Skills und Anleitungen durchsuchen…',
    typeToSearch: 'Tippen, um alles auf dieser Seite zu durchsuchen.',
    noResults: 'Nichts gefunden. Probier ein anderes Wort.',
    navigate: 'zum Blättern',
    open: 'zum Öffnen',
    page: 'Seite',
    section: 'Abschnitt',
    result: 'Treffer',
    resultsWord: 'Treffer',
    themeLabel: 'Hell und dunkel umschalten',
    skipLink: 'Zum Inhalt springen',
    footer: {
      products: 'Produkte',
      resources: 'Material',
      community: 'Community',
      about: 'Über',
      docs: 'Dokumentation',
      source: 'Quellcode',
      catalogue: 'Skill-Index',
      submit: 'Skill einreichen',
      forum: 'Forum',
      discussions: 'GitHub Discussions',
      learn: 'KI-Sicherheit verstehen',
      security: 'Sicherheitslücke melden',
      legal: 'Rechtliches',
      impressum: 'Impressum',
      privacy: 'Datenschutz',
      note: 'Offen entwickelt. Keine Tracker, keine Analytics, keine Werbung. Jede Seite außer dem Forum ist vollständig in sich geschlossen; das Forum spricht mit Firebase, und die Datenschutzseite sagt genau, was das heißt.',
      rights: 'MIT-lizenziert. Gemacht von Skillry.',
    },
  },
};

// ---------------------------------------------------------------------------
// Marks
// ---------------------------------------------------------------------------

/** The site mark: a stylised airlock hatch, reused as the favicon. */
export const LOGO = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" stroke-width="1.6"/>
  <circle cx="12" cy="12" r="5.4" stroke="currentColor" stroke-width="1.6"/>
  <path d="M12 6.6v10.8M6.6 12h10.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

/**
 * Flags as inline SVG, not emoji.
 *
 * Windows ships no flag glyphs, so 🇬🇧 renders there as the bare letters "GB" —
 * on the single platform this project is most used from. Drawing them costs a
 * few paths and works identically everywhere.
 */
export const FLAGS = {
  en: `<svg width="20" height="14" viewBox="0 0 60 42" aria-hidden="true">
    <rect width="60" height="42" fill="#012169"/>
    <path d="M0 0l60 42M60 0L0 42" stroke="#fff" stroke-width="8"/>
    <path d="M0 0l60 42M60 0L0 42" stroke="#C8102E" stroke-width="4"/>
    <path d="M30 0v42M0 21h60" stroke="#fff" stroke-width="14"/>
    <path d="M30 0v42M0 21h60" stroke="#C8102E" stroke-width="8"/>
  </svg>`,
  de: `<svg width="20" height="14" viewBox="0 0 60 42" aria-hidden="true">
    <rect width="60" height="14" fill="#000"/>
    <rect y="14" width="60" height="14" fill="#DD0000"/>
    <rect y="28" width="60" height="14" fill="#FFCE00"/>
  </svg>`,
};

const ICON_SEARCH = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"/></svg>`;
const ICON_THEME = `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5v13a6.5 6.5 0 0 1 0-13Z"/></svg>`;
const ICON_GH = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;

// ---------------------------------------------------------------------------

const NAV = [
  { slug: 'airlock', key: 'airlock' },
  { slug: 'nexus', key: 'nexus' },
  { slug: 'skills', key: 'skills' },
  { slug: 'learn', key: 'learn' },
  { slug: 'forum', key: 'forum' },
];

function header(lang, current, t) {
  const nav = NAV.map(
    (n) =>
      `<a href="${href(lang, n.slug)}"${current === n.slug ? ' aria-current="page"' : ''}>${t.nav[n.key]}</a>`,
  ).join('');

  const langs = LANGS.map((l) => {
    const name = l === 'en' ? 'English' : 'Deutsch';
    return `<a href="${href(l, current)}" hreflang="${l}" aria-current="${l === lang}" title="${name}">${FLAGS[l]}<span class="sr">${name}</span></a>`;
  }).join('');

  return `<header class="gh-header">
  <div class="wrap">
    <a class="gh-logo" href="${href(lang, '')}">${LOGO}<span>${SITE.name}</span></a>
    <nav class="gh-nav" aria-label="Main">${nav}</nav>
    <div class="gh-actions">
      <button type="button" class="gh-search" data-search-open title="${t.searchHint}">
        ${ICON_SEARCH}<span>${t.searchPlaceholder}</span><kbd>/</kbd>
      </button>
      <div class="lang-switch">${langs}</div>
      <button class="icon-btn" id="themeBtn" type="button" title="${t.themeLabel}" aria-label="${t.themeLabel}">${ICON_THEME}</button>
      <a class="icon-btn" href="${SITE.github}" title="GitHub" aria-label="GitHub">${ICON_GH}</a>
    </div>
  </div>
</header>`;
}

function footer(lang, t) {
  const f = t.footer;
  const col = (title, items) =>
    `<div><h4>${title}</h4><ul>${items.map(([label, url]) => `<li><a href="${url}">${label}</a></li>`).join('')}</ul></div>`;

  return `<footer class="site">
  <div class="wrap">
    <div class="cols">
      ${col(f.products, [
        ['AIRLOCK', href(lang, 'airlock')],
        ['NEXUS', href(lang, 'nexus')],
      ])}
      ${col(f.resources, [
        [f.catalogue, href(lang, 'skills')],
        [f.learn, href(lang, 'learn')],
        [f.docs, `${SITE.repoAirlock}/blob/main/docs/internals.md`],
        [f.source, SITE.repoAirlock],
      ])}
      ${col(f.community, [
        [f.forum, href(lang, 'forum')],
        [f.discussions, SITE.discussions],
        [f.submit, `${SITE.repoAirlock}/blob/main/CONTRIBUTING.md`],
        [f.security, `${SITE.repoAirlock}/security/advisories/new`],
      ])}
      ${col(f.about, [
        ['GitHub', SITE.github],
        ['MIT', `${SITE.repoAirlock}/blob/main/LICENSE`],
      ])}
      ${col(f.legal, [
        [f.impressum, href(lang, 'impressum')],
        [f.privacy, href(lang, 'datenschutz')],
      ])}
    </div>
    <div class="base">
      <span>${f.rights}</span>
      <span>${f.note}</span>
    </div>
  </div>
</footer>`;
}

/**
 * Runs before paint so a dark-mode visitor never sees a white flash.
 * Deliberately the only blocking script on the page.
 */
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const THEME_TOGGLE = `
document.getElementById('themeBtn')?.addEventListener('click', function () {
  var r = document.documentElement;
  var cur = r.getAttribute('data-theme');
  var sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
  var next = cur ? (cur === 'dark' ? 'light' : 'dark') : (sysDark ? 'light' : 'dark');
  r.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
document.addEventListener('keydown', function (e) {
  if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
    var box = document.getElementById('skillSearch');
    if (box) { e.preventDefault(); box.focus(); }
  }
});`;

/** Only the strings the search dialog needs, so the payload stays small. */
const searchStrings = (t) => ({
  searchEverything: t.searchEverything,
  typeToSearch: t.typeToSearch,
  noResults: t.noResults,
  navigate: t.navigate,
  open: t.open,
  page: t.page,
  section: t.section,
  result: t.result,
  resultsWord: t.resultsWord,
});

/**
 * @param {{ lang: string, slug: string, title: string, description: string,
 *           body: string, script?: string, head?: string }} page
 */
export function render(page) {
  const t = UI[page.lang];
  const alt = LANGS.filter((l) => l !== page.lang)
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${href(l, page.slug)}">`)
    .join('');

  const favicon = `data:image/svg+xml,${encodeURIComponent(
    LOGO.replace('currentColor', '%23' + '4EE296').replace(/currentColor/g, '#4EE296'),
  )}`;

  return `<!doctype html>
<html lang="${page.lang}" ${page.lang === 'de' ? '' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:type" content="website">
<link rel="icon" href="${favicon}">
<link rel="alternate" hreflang="${page.lang}" href="${href(page.lang, page.slug)}">
${alt}
<script>${THEME_BOOT}</script>
<style>${CSS}${CSS_EXTRA}${SEARCH_CSS}</style>
${page.head ?? ''}
</head>
<body>
<a href="#main" class="sr">${t.skipLink}</a>
${header(page.lang, page.slug, t)}
<main id="main">
${anchorHeadings(page.body)}
</main>
${SEARCH_MARKUP(t)}
${footer(page.lang, t)}
<script>
${THEME_TOGGLE}
${SEARCH_JS(page.lang, searchStrings(t))}
${HERO_JS}
${page.script ?? ''}
</script>
</body>
</html>
`;
}
