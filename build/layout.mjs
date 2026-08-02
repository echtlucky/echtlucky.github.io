/**
 * The page shell: header, navigation, language switch, footer.
 *
 * No template language and no dependencies — the pages are JavaScript template
 * literals, which is enough structure for a site this size and keeps the whole
 * build to `node build/site.mjs`.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CSS } from './theme.mjs';
import { CSS_EXTRA, MOTION_JS } from './theme-extra.mjs';
import { anchorHeadings } from './search.mjs';
import { WORDMARK_CSS, LOGO_FAVICON } from './logo.mjs';
import { SCENE_CSS, sceneFor } from './scenes.mjs';
import { header, HEADER_JS, HEADER_CSS } from './header.mjs';

/**
 * The names the header's client script reads. Kept as one explicit map rather
 * than spreading `t` wholesale: the script indexes into it directly, so a
 * missing key does not throw — it silently writes "undefined" onto a button.
 */
const headerStrings = (t) => ({
  signIn: t.auth.signIn,
  account: t.auth.account,
  submitIn: t.auth.submitIn,
  submitUp: t.auth.submitUp,
  swapUp: t.auth.swapUp,
  swapIn: t.auth.swapIn,
  working: t.auth.working,
  resetSent: t.auth.resetSent,
  resendOk: t.auth.resendOk,
  stillUnverified: t.auth.stillUnverified,
  quickNew: t.quick.newPostShort,
  quickVerify: t.auth.verifyShort,
  actTheme: t.act.theme,
  actLang: t.act.lang,
  actNew: t.act.newPost,
  actSignIn: t.act.signIn,
  actSignOut: t.act.signOut,
  noResults: t.find.noResults,
  result: t.find.result,
  resultsWord: t.find.resultsWord,
  errMail: t.auth.errMail,
  errShort: t.auth.errShort,
  errName: t.auth.errName,
  errWrong: t.auth.errWrong,
  errInUse: t.auth.errInUse,
  errWeak: t.auth.errWeak,
  errMany: t.auth.errMany,
  errNet: t.auth.errNet,
  errGeneric: t.auth.errGeneric,
});

const VT_JS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'vt.js'), 'utf8');

/**
 * The sign-in panel is only rendered where there is something to sign in to.
 * With an empty apiKey the header shows navigation and search and no account
 * button at all — better than a button that opens a form which cannot work.
 */
const FIREBASE_CFG = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'firebase.json'),
    'utf8',
  ),
);
const FIREBASE_READY = Boolean(FIREBASE_CFG.apiKey && FIREBASE_CFG.projectId);

export const LANGS = ['en', 'de'];
export const DEFAULT_LANG = 'en';

/**
 * The absolute origin, read from the same file the build reads it from.
 * Canonical and og: URLs have to be absolute — a share card cannot resolve
 * "/skills/" against anything.
 */
const SITE_CFG = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'site.json'), 'utf8'),
);
export const ORIGIN = String(SITE_CFG.origin || '').replace(/\/$/, '');

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

/**
 * Everything the new header says, in both languages.
 *
 * It is a long list because the header now does four jobs that used to live
 * elsewhere or nowhere: navigation, search, sign-in and quick actions. Written
 * out in full rather than assembled from fragments — a header that renders
 * "undefined" on a button is a bug nobody notices in review and everybody
 * notices in production.
 */
const HEADER_STRINGS = {
  en: {
    menu: { open: 'Open menu', close: 'Close', all: 'Everything on this site', onPage: 'On this page' },
    find: {
      placeholder: 'Search or jump to…',
      aria: 'Search pages, sections, skills and actions',
      navigate: 'to move',
      open: 'to open',
      noResults: 'Nothing matches that.',
      result: 'result',
      resultsWord: 'results',
      page: 'Page',
      section: 'Section',
      skill: 'Skill',
      action: 'Action',
      here: 'On this page',
    },
    quick: { newPost: 'Write a forum post', newPostShort: 'New post' },
    act: {
      theme: 'Switch light and dark',
      lang: 'Switch to German',
      newPost: 'Write a forum post',
      newPostShort: 'New post',
      signIn: 'Sign in',
      signOut: 'Sign out',
    },
    auth: {
      signIn: 'Sign in',
      account: 'Account',
      why: 'An account is an email address and a password. Firebase stores the password, hashed — this site never sees it.',
      name: 'Display name',
      email: 'Email address',
      password: 'Password',
      submitIn: 'Sign in',
      submitUp: 'Create account',
      swapUp: 'No account yet?',
      swapIn: 'Already have one?',
      forgot: 'Forgotten password',
      working: 'One moment…',
      lazyNote: 'Signing in loads Firebase from Google. Until you press the button, this page has contacted nobody.',
      verifyH: 'One step left',
      verifyP: 'Confirm the address in the email we sent, then reload. Reading works already; posting needs the confirmation.',
      verifyShort: 'Confirm email',
      resend: 'Send again',
      recheck: 'I have confirmed it',
      resendOk: 'Sent.',
      stillUnverified: 'Still not confirmed.',
      resetSent: 'If that address exists, a reset link is on its way.',
      myPosts: 'My posts',
      signOut: 'Sign out',
      errMail: 'That does not look like an email address.',
      errShort: 'At least eight characters.',
      errName: 'A name with at least two characters.',
      errWrong: 'Email address or password is wrong.',
      errInUse: 'That address already has an account.',
      errWeak: 'Firebase considers that password too weak.',
      errMany: 'Too many attempts. Try again in a few minutes.',
      errNet: 'No connection to Firebase.',
      errGeneric: 'That did not work.',
    },
  },
  de: {
    menu: { open: 'Menü öffnen', close: 'Schließen', all: 'Alles auf dieser Seite', onPage: 'Auf dieser Seite' },
    find: {
      placeholder: 'Suchen oder springen…',
      aria: 'Seiten, Abschnitte, Skills und Aktionen durchsuchen',
      navigate: 'zum Blättern',
      open: 'zum Öffnen',
      noResults: 'Dazu passt nichts.',
      result: 'Treffer',
      resultsWord: 'Treffer',
      page: 'Seite',
      section: 'Abschnitt',
      skill: 'Skill',
      action: 'Aktion',
      here: 'Auf dieser Seite',
    },
    quick: { newPost: 'Forumsbeitrag schreiben', newPostShort: 'Neuer Beitrag' },
    act: {
      theme: 'Hell und dunkel umschalten',
      lang: 'Auf Englisch umschalten',
      newPost: 'Forumsbeitrag schreiben',
      newPostShort: 'Neuer Beitrag',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
    },
    auth: {
      signIn: 'Anmelden',
      account: 'Konto',
      why: 'Ein Konto ist eine E-Mail-Adresse und ein Passwort. Firebase speichert das Passwort gehasht — diese Seite sieht es nie.',
      name: 'Anzeigename',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      submitIn: 'Anmelden',
      submitUp: 'Konto anlegen',
      swapUp: 'Noch kein Konto?',
      swapIn: 'Schon eins?',
      forgot: 'Passwort vergessen',
      working: 'Einen Moment…',
      lazyNote: 'Die Anmeldung lädt Firebase von Google. Bis du den Knopf drückst, hat diese Seite mit niemandem gesprochen.',
      verifyH: 'Ein Schritt fehlt',
      verifyP: 'Bestätige die Adresse in der Mail, die wir geschickt haben, und lade neu. Lesen geht schon; zum Schreiben braucht es die Bestätigung.',
      verifyShort: 'E-Mail bestätigen',
      resend: 'Nochmal senden',
      recheck: 'Habe ich bestätigt',
      resendOk: 'Gesendet.',
      stillUnverified: 'Immer noch nicht bestätigt.',
      resetSent: 'Falls es die Adresse gibt, ist ein Link unterwegs.',
      myPosts: 'Meine Beiträge',
      signOut: 'Abmelden',
      errMail: 'Das sieht nicht nach einer E-Mail-Adresse aus.',
      errShort: 'Mindestens acht Zeichen.',
      errName: 'Ein Name mit mindestens zwei Zeichen.',
      errWrong: 'E-Mail-Adresse oder Passwort stimmt nicht.',
      errInUse: 'Zu dieser Adresse gibt es schon ein Konto.',
      errWeak: 'Firebase hält dieses Passwort für zu schwach.',
      errMany: 'Zu viele Versuche. In ein paar Minuten nochmal.',
      errNet: 'Keine Verbindung zu Firebase.',
      errGeneric: 'Das hat nicht geklappt.',
    },
  },
};

export const UI = {
  en: {
    ...HEADER_STRINGS.en,
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
    ...HEADER_STRINGS.de,
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

/*
 * The mark moved to build/logo.mjs. What stood here was a stylised airlock
 * hatch — a rounded square, a circle and a cross, three shapes stacked into a
 * pictogram of one of the two products. It described AIRLOCK, not Skillry, and
 * it was assembled rather than drawn.
 */

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

/*
 * The header now lives in build/header.mjs. It grew from a bar with five links
 * into navigation, search, sign-in and quick actions at once, which is more
 * than a function in a layout file should carry — and the GitHub icon that
 * used to sit top right is gone from here entirely. It is still in the footer,
 * where a link away from the site belongs; the top right corner is where
 * people look for their account.
 */

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
        [f.submit, `${SITE.repoSite}/blob/main/README.md#submitting-a-skill`],
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
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, page.slug)}">`)
    .join('\n');

  // The mark drawn with a literal colour: `currentColor` inherits from nothing
  // inside a data: URI. encodeURIComponent turns the single `#` into `%23`
  // exactly once — pre-encoding it here is what used to double-escape it and
  // leave the stroke invalid.
  const favicon = `data:image/svg+xml,${encodeURIComponent(LOGO_FAVICON('#4EE296'))}`;

  const canonical = `${ORIGIN}${href(page.lang, page.slug)}`;

  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0D1117" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${page.lang === 'de' ? 'de_DE' : 'en_GB'}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${favicon}">
<link rel="alternate" hreflang="${page.lang}" href="${ORIGIN}${href(page.lang, page.slug)}">
${alt}
<link rel="alternate" hreflang="x-default" href="${ORIGIN}${href(DEFAULT_LANG, page.slug)}">
<script>${THEME_BOOT}</script>
<style>${CSS}${CSS_EXTRA}${WORDMARK_CSS}${HEADER_CSS}${SCENE_CSS}</style>
${page.head ?? ''}
</head>
<body>
<a href="#main" class="sr">${t.skipLink}</a>
${sceneFor(page.slug) ? `<div class="scene ${sceneFor(page.slug)}" aria-hidden="true"></div>` : ''}
${header(page.lang, page.slug, t, { auth: FIREBASE_READY })}
<main id="main">
${anchorHeadings(page.body)}
</main>
${footer(page.lang, t)}
<script>
${THEME_TOGGLE}
${HEADER_JS({
  lang: page.lang,
  strings: headerStrings(t),
  fb: FIREBASE_READY ? FIREBASE_CFG : null,
  urls: {
    forum: href(page.lang, 'forum'),
    other: href(page.lang === 'de' ? 'en' : 'de', page.slug),
    index: '/search-index.json',
  },
})}
${MOTION_JS}
${VT_JS}
${page.script ?? ''}
</script>
</body>
</html>
`;
}
