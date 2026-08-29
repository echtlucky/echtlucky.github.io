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
import { BEWEGUNG_BOOT, BEWEGUNG_CSS, BEWEGUNG_JS, BEWEGUNG_SCRIPTS } from './bewegung.mjs';
import { SCENE_CSS, sceneFor } from './scenes.mjs';
import { GRAIN_CSS } from './grain.mjs';
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
    menu: { open: 'Open menu', close: 'Close', all: 'Everything on this site', onPage: 'On this page', spiel: 'By game', bald: 'soon', keine: 'none yet', auch: 'Also here' },
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
      konto: 'Account',
      portal: 'Customer portal',
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
    menu: { open: 'Menü öffnen', close: 'Schließen', all: 'Alles auf dieser Seite', onPage: 'Auf dieser Seite', spiel: 'Nach Spiel', bald: 'bald', keine: 'noch keine', auch: 'Auch hier' },
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
      konto: 'Konto',
      portal: 'Kundenportal',
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
    nav: { airlock: 'AIRLOCK', nexus: 'NEXUS', deck: 'DECK', scripts: 'Scripts', skills: 'Skill index', learn: 'Learn', api: 'API', forum: 'Forum', werkzeuge: 'Tools', geobingo: 'GeoBingo' },
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
      scriptsGta5: 'For GTA V',
      scriptsEgal: 'Game-independent',
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
      // Required by the Cfx.re Creator Platform License Agreement, §2.3: any
      // site, product listing or storefront touching FiveM must carry an
      // operator contact and a disclaimer of this kind. The contact is the
      // site notice, linked in the column above.
      //
      // The sentence stays in English in both languages on purpose. It is a
      // formula quoted from an English contract; a translation would read
      // better and mean something slightly different, and this is the one
      // line on the page where "slightly different" is the wrong outcome.
      rockstar: 'SKILLRY IS NOT APPROVED, SPONSORED, OR ENDORSED BY ROCKSTAR GAMES. '
        + 'Grand Theft Auto and Rockstar Games are trademarks of Take-Two Interactive Software, Inc.',
    },
  },
  de: {
    ...HEADER_STRINGS.de,
    tagline: 'Werkzeuge für Leute, die KI benutzen und wissen wollen, was da läuft.',
    nav: { airlock: 'AIRLOCK', nexus: 'NEXUS', deck: 'DECK', scripts: 'Skripte', skills: 'Skill-Index', learn: 'Lernen', api: 'API', forum: 'Forum', werkzeuge: 'Werkzeuge', geobingo: 'GeoBingo' },
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
      scriptsGta5: 'Für GTA V',
      scriptsEgal: 'Spielunabhängig',
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
      // Wörtlich dieselbe englische Formel wie oben — die Begründung steht dort.
      rockstar: 'SKILLRY IS NOT APPROVED, SPONSORED, OR ENDORSED BY ROCKSTAR GAMES. '
        + 'Grand Theft Auto and Rockstar Games are trademarks of Take-Two Interactive Software, Inc.',
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
  // DECK steht neben NEXUS, weil beides Programme sind — und weil der
  // DECK-Eintrag in NEXUS hierher zurueckfaellt, wenn das Programm nicht
  // installiert ist. Eine Seite, auf die von aussen gezeigt wird, gehoert
  // auch in die eigene Navigation.
  { slug: 'deck', key: 'deck' },
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
      <!--
        Der Fuss folgt derselben Einteilung wie die Navigation — Skripte,
        Werkzeuge, Forum, Lernen. Zwei Ordnungen fuer dieselben Seiten sind
        zwei Karten desselben Hauses, und die zweite ist immer die aeltere.
      -->
      ${col(t.nav.scripts, [
        [f.scriptsGta5, `${href(lang, 'scripts')}?spiel=gta5`],
        [f.scriptsEgal, `${href(lang, 'scripts')}?spiel=egal`],
        [t.nav.api, href(lang, 'api')],
      ])}
      ${col(t.nav.werkzeuge, [
        ['AIRLOCK', href(lang, 'airlock')],
        ['NEXUS', href(lang, 'nexus')],
        ['DECK', href(lang, 'deck')],
        [f.catalogue, href(lang, 'skills')],
      ])}
      ${col(f.resources, [
        [f.learn, href(lang, 'learn')],
        [f.docs, `${SITE.repoAirlock}/blob/main/docs/internals.md`],
        [f.source, SITE.repoAirlock],
      ])}
      ${col(f.community, [
        [f.forum, href(lang, 'forum')],
        /*
         * GeoBingo steht im Fuss und sonst nirgends: nicht in der Navigation,
         * nicht im Menue, nicht in der Suche, nicht in der sitemap.xml. Der
         * Fuss ist der Ort fuer etwas, das es gibt, das aber niemand suchen
         * soll — und hinter dem Link steht ohnehin noch die Anmeldung.
         */
        [t.nav.geobingo, href(lang, 'geobingo')],
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
      <!-- Auf jeder Seite und nicht nur auf /scripts/: die Pflicht haengt an
           der Website, nicht an der einzelnen Unterseite, und eine Zeile, die
           je nach Weg da ist oder nicht, ist eine, die irgendwann fehlt. -->
      <span class="disclaimer">${f.rockstar}</span>
    </div>
  </div>
</footer>`;
}

/**
 * Runs before paint so a dark-mode visitor never sees a white flash.
 * Deliberately the only blocking script on the page.
 */
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

/**
 * Der Hinweis unten links.
 *
 * **Er ist kein Einwilligungsbanner, und er tut auch nicht so.** Diese Website
 * setzt keine Cookies, misst nichts und wirbt nicht; gespeichert wird im
 * Browser nur, was jemand selbst eingestellt hat. Für so etwas gibt es nach
 * § 25 Abs. 2 TDDDG nichts einzuwilligen, und ein „Alle akzeptieren"-Knopf
 * ohne etwas zu akzeptieren wäre die unehrlichste Sorte Formalie: er trainiert
 * Leute darauf, wegzuklicken, was anderswo wirklich zählt.
 *
 * Was es tatsächlich zu sagen gibt, sagt er: was lokal liegt, dass Forum und
 * GeoBingo mit Google sprechen sobald man sie benutzt, und wo das ausführlich
 * steht. Ein Knopf, ein Link, weg.
 *
 * Gemerkt wird das Wegklicken in `localStorage` — womit der Hinweis das
 * einzige ist, was er beschreibt. Ohne `localStorage` (privates Fenster,
 * gesperrter Speicher) erscheint er wieder; das ist die richtige Richtung,
 * falsch zu liegen.
 */
const HINWEIS_CSS = `
.ck {
  position: fixed; left: 16px; bottom: 16px; z-index: 70;
  width: min(calc(100vw - 32px), 330px);
  padding: 14px 16px 13px;
  background: var(--surface); color: var(--fg);
  border: 1px solid var(--border-strong); border-radius: var(--radius);
  box-shadow: var(--e3);
  font-size: 0.82rem; line-height: 1.5;
  transform: translateY(8px); opacity: 0;
  animation: ck-auf 0.28s 0.5s ease forwards;
}
@keyframes ck-auf { to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .ck { animation-delay: 0s; animation-duration: 0.01s; } }
.ck[hidden] { display: none; }
.ck h2 {
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--fg-muted); margin: 0 0 6px;
}
.ck p { margin: 0 0 10px; color: var(--fg-muted); }
.ck .ck-zeile { display: flex; align-items: center; gap: 12px; }
.ck button {
  padding: 7px 14px; font: inherit; font-weight: 600; font-size: 0.8rem; cursor: pointer;
  background: var(--fg); color: var(--bg); border: 1px solid var(--fg); border-radius: var(--radius);
}
.ck button:hover { opacity: 0.88; }
.ck a { font-size: 0.8rem; }
@media (max-width: 480px) { .ck { left: 10px; right: 10px; bottom: 10px; width: auto; } }
`;

const HINWEIS_TEXT = {
  en: {
    h: 'No cookies',
    p: 'This site sets none, measures nothing and advertises nothing. Your browser only stores what you set yourself. The forum and GeoBingo talk to Google once you use them.',
    ok: 'Got it',
    mehr: 'Privacy policy',
  },
  de: {
    h: 'Keine Cookies',
    p: 'Diese Seite setzt keine, misst nichts und wirbt nicht. Im Browser liegt nur, was Sie selbst eingestellt haben. Forum und GeoBingo sprechen mit Google, sobald Sie sie benutzen.',
    ok: 'Verstanden',
    mehr: 'Datenschutz',
  },
};

const hinweis = (lang) => {
  const t = HINWEIS_TEXT[lang];
  return `<aside class="ck" id="ckHinweis" hidden aria-label="${t.h}">
  <h2>${t.h}</h2>
  <p>${t.p}</p>
  <div class="ck-zeile">
    <button type="button" id="ckOk">${t.ok}</button>
    <a href="${href(lang, 'datenschutz')}">${t.mehr}</a>
  </div>
</aside>`;
};

/*
 * Erst einblenden, wenn feststeht, dass er noch nicht weggeklickt wurde —
 * sonst blitzt er bei jedem Seitenwechsel kurz auf, obwohl er längst erledigt
 * ist. Deshalb steht er mit `hidden` im Markup und wird hier freigegeben.
 */
const HINWEIS_JS = `
(function () {
  var box = document.getElementById('ckHinweis');
  if (!box) return;
  try { if (localStorage.getItem('skillry:hinweis') === '1') return; } catch (e) {}
  box.hidden = false;
  document.getElementById('ckOk').addEventListener('click', function () {
    box.hidden = true;
    try { localStorage.setItem('skillry:hinweis', '1'); } catch (e) {}
  });
})();`;

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
/**
 * Eine Seite ohne alles.
 *
 * `blank: true` an einem Seitenmodul heisst: kein Kopf, kein Fuss, keine
 * Szene, kein Korn, keine Designsprache — nur der Rumpf, den die Seite selbst
 * mitbringt. Es gibt genau einen Grund dafuer, und es ist kein aesthetischer:
 *
 * GeoBingo ist eine Spielflaeche, die im Vollbild neben einem Stream steht.
 * Der Kopf dieser Website ist 1800 Zeilen Navigation, Suche und Anmeldung mit
 * eigenem Blatt und eigenem Skript; theme.mjs, theme-extra, Szenen und Korn
 * kommen dazu. Auf einer Seite mit einer laufenden Uhr und einem WebGL-Panorama
 * ist das alles Arbeit, die der Browser jedes Bild lang mitschleppt, fuer
 * nichts — auf dieser Seite ist keine Zeile davon sichtbar.
 *
 * Eine `blank`-Seite traegt dafuer die volle Verantwortung fuer ihr Aussehen.
 * Sie erbt keine Farben und keine Schrift; was sie nicht in `head()` schreibt,
 * gibt es dort nicht.
 *
 * `noindex` gehoert dazu und nicht daneben: eine Seite ohne Weg dorthin, die
 * trotzdem in einer Suchmaschine steht, ist keine unauffaellige Seite.
 */
function renderBlank(page) {
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#07090D">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0B0E13"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="#5BE0A8" stroke-width="2.4"/><circle cx="16" cy="16" r="2.6" fill="#5BE0A8"/></svg>',
  )}">
${page.head ?? ''}
</head>
<body>
${page.body}
<script>${page.script ?? ''}</script>
</body>
</html>
`;
}

/**
 * @param {{ lang: string, slug: string, title: string, description: string,
 *           body: string, script?: string, head?: string }} page
 */
export function render(page) {
  if (page.blank) return renderBlank(page);

  const t = UI[page.lang];
  const alt = LANGS.filter((l) => l !== page.lang)
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, page.slug)}">`)
    .join('\n');

  // The mark drawn with a literal colour: `currentColor` inherits from nothing
  // inside a data: URI. encodeURIComponent turns the single `#` into `%23`
  // exactly once — pre-encoding it here is what used to double-escape it and
  // leave the stroke invalid. VIOLETT[500]: the one step that carries as an
  // edge on light AND dark tab bars (4.11 on white, 4.75 on the night).
  const favicon = `data:image/svg+xml,${encodeURIComponent(LOGO_FAVICON('#8763f3'))}`;

  const canonical = `${ORIGIN}${href(page.lang, page.slug)}`;

  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0D0A1A" media="(prefers-color-scheme: dark)">
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
<script>${THEME_BOOT}${page.bewegung ? BEWEGUNG_BOOT : ''}</script>
${page.bewegung ? BEWEGUNG_SCRIPTS : ''}
<style>${CSS}${CSS_EXTRA}${WORDMARK_CSS}${HEADER_CSS}${SCENE_CSS}${GRAIN_CSS}${HINWEIS_CSS}${page.bewegung ? BEWEGUNG_CSS : ''}</style>
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
${hinweis(page.lang)}
<script>
${HINWEIS_JS}
${THEME_TOGGLE}
${HEADER_JS({
  lang: page.lang,
  strings: headerStrings(t),
  /*
   * ══ Genau die Form, die der Kopf erwartet — und nur die ═════════════════
   *
   * Hier stand `FIREBASE_CFG`, also die ganze Datei. Der Kopf liest daraus aber
   * `C.fb.sdk` und `C.fb.config`, und beide Felder gibt es dort nicht: sie
   * heissen `sdkVersion`, und die Einstellungen liegen flach im Objekt.
   *
   * Die Folge war kein Fehler, den man sieht, sondern einer, den man erst im
   * Netzwerkfenster findet:
   *
   *     GET https://www.gstatic.com/firebasejs/undefined/firebase-app.js  404
   *
   * **Die Anmeldung im Kopf hat damit auf keiner Seite je funktioniert.** Nur
   * das Forum hatte eine eigene, richtig verdrahtete (`build/pages/forum.mjs`)
   * — deshalb gab es zwei verschiedene Anmeldefenster, und nur eines davon tat
   * etwas.
   *
   * Uebergeben wird jetzt die Form, die der Kopf liest, und **nur die Felder,
   * die er braucht**: `moderatorUids` gehoerte nie in ein Skript, das auf jeder
   * Seite ausgeliefert wird.
   */
  fb: FIREBASE_READY ? {
    sdk: FIREBASE_CFG.sdkVersion,
    apiKey: FIREBASE_CFG.apiKey,
    config: {
      apiKey: FIREBASE_CFG.apiKey,
      authDomain: FIREBASE_CFG.authDomain,
      projectId: FIREBASE_CFG.projectId,
      storageBucket: FIREBASE_CFG.storageBucket,
      messagingSenderId: FIREBASE_CFG.messagingSenderId,
      appId: FIREBASE_CFG.appId,
    },
  } : null,
  urls: {
    forum: href(page.lang, 'forum'),
    /*
     * ZWEI FELDER, DIE HIER GEFEHLT HABEN — UND ES IST DASSELBE MUSTER WIE
     * DAMALS BEI fb.sdk
     *
     * Das Kopfskript liest C.urls.newPost und C.urls.alt. Beide gab es nicht.
     * Ein fehlendes Feld ist in JavaScript kein Fehler, sondern undefined, und
     * undefined in einer Adresse ergibt eine gueltige Adresse:
     *
     *     quick.href = C.urls.newPost   ->   https://skillry.de/undefined
     *
     * Der Knopf "+ POST" oben rechts fuehrte damit auf die 404-Seite, und der
     * Sprungbefehl fuer den Sprachwechsel ebenso. Nichts hat gewarnt: kein
     * Build-Fehler, kein Konsolenfehler, keine rote Zeile. Nur eine Seite, die
     * hoeflich sagt, dass es sie nicht gibt.
     *
     * `alt` heisst dasselbe wie `other` — der eine Name steht in der Suche,
     * der andere in der Sprachumschaltung. Statt einen umzubenennen und den
     * zweiten Fundort zu uebersehen, stehen jetzt beide da.
     */
    newPost: href(page.lang, 'forum') + '?new=1',
    alt: href(page.lang === 'de' ? 'en' : 'de', page.slug),
    other: href(page.lang === 'de' ? 'en' : 'de', page.slug),
    index: '/search-index.json',
  },
})}
${MOTION_JS}
${VT_JS}
${page.bewegung ? BEWEGUNG_JS(page.bewegung) : ''}
${page.script ?? ''}
</script>
</body>
</html>
`;
}
