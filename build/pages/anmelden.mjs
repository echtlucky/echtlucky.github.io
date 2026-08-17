/**
 * Die Anmeldung als eigene Seite.
 *
 * WARUM NICHT MEHR IM KOPF
 * ------------------------
 * Sie war ein Ausklapp-Panel am rechten Rand der Kopfleiste. Das hat drei
 * Dinge nicht gekonnt, die eine Anmeldung koennen muss:
 *
 *   1. Sie hatte keine Adresse. Man kann niemanden zur Anmeldung schicken,
 *      man kann sie nicht als Ziel nach einer Weiterleitung angeben, und der
 *      Zurueck-Knopf tut nichts, weil nie etwas passiert ist.
 *   2. Sie sah anders aus als die im Kundenportal. Zwei Anmeldungen in zwei
 *      Gestalten fuer dieselbe Sache sind fuer den, der sie benutzt, zwei
 *      verschiedene Firmen.
 *   3. In 400px Breite am Bildschirmrand ist kein Platz fuer Google, GitHub
 *      und eine E-Mail-Anmeldung nebeneinander. Deshalb fehlten die beiden
 *      Wege dort einfach — auf lizenz.skillry.de gab es sie, hier nicht.
 *
 * Diese Seite uebernimmt die Form des Kundenportals: dieselbe Kapsel, dieselbe
 * Aufteilung, dieselben Nebenwege. Die Geometrie ist keine Nachahmung nach
 * Augenmass, sondern dieselbe Rechnung — sie steht unten bei .form-kreis und
 * ausfuehrlich in skillry-lizenz/web/portal.css.
 *
 * ACHTUNG BEIM BEARBEITEN: Diese Datei baut HTML und CSS in Template-Literalen.
 * Ein Backtick in einem Kommentar beendet das Literal und der Build stirbt mit
 * "Unexpected identifier". Deshalb steht in den Kommentaren hier drin kein
 * einziger. Das ist inzwischen der fuenfte Fall dieser Sorte.
 */
import { href, SITE } from '../layout.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'signin';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FB = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));
const NOTIZEN = JSON.parse(readFileSync(join(ROOT, 'content', 'ki-notizen.json'), 'utf8'));

/** Ohne Projekt gibt es nichts, womit man sich anmelden koennte. Die Seite sagt es. */
const CONFIGURED = Boolean(FB.projectId && FB.apiKey);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const meta = {
  en: {
    title: 'Sign in · Skillry',
    description:
      'Sign in to Skillry with Google, GitHub or an email address. One account for the site, the forum and the customer portal.',
  },
  de: {
    title: 'Anmelden · Skillry',
    description:
      'Bei Skillry anmelden — mit Google, GitHub oder einer E-Mail-Adresse. Ein Konto fuer die Seite, das Forum und das Kundenportal.',
  },
};

const T = {
  en: {
    kicker: 'Account',
    h1: 'Sign in',
    lede: 'One account for the site, the forum and the customer portal.',
    email: 'Email address',
    pw: 'Password',
    name: 'Display name',
    submitIn: 'Sign in',
    submitUp: 'Create account',
    toUp: 'No account yet?',
    toIn: 'Already have one?',
    forgot: 'Forgot password',
    orMail: 'or with an email address',
    google: 'Continue with Google',
    github: 'Continue with GitHub',
    sideNews: 'AI notes',
    sideStand: 'As of',
    sideNewsFoot: 'Written by hand, not fetched — the date says how old it is.',
    sideWhat: 'What the account opens',
    whatItems: [
      ['Forum', 'Ask, answer, report a false positive.'],
      ['Customer portal', 'Licences, keys, orders and invoices.'],
      ['Saved scripts', 'Your list stays across devices.'],
    ],
    sideSafe: 'What we do not see',
    safeText:
      'The password is hashed by Firebase. This page never sees it. Google and GitHub sign you in without giving us a password at all.',
    signedInH: 'You are signed in',
    toPortal: 'To the customer portal',
    toForum: 'To the forum',
    signOut: 'Sign out',
    verifyH: 'Confirm your email address',
    verifyP:
      'You can read everything. To write, open the link in the mail that just went out — it stops anyone signing up with an address that is not theirs.',
    resend: 'Send again',
    done: 'I have confirmed',
    noConf: 'Sign-in is not configured on this build.',
    working: 'One moment…',
    backHint: 'Back to where you were',
  },
  de: {
    kicker: 'Konto',
    h1: 'Anmelden',
    lede: 'Ein Konto fuer die Seite, das Forum und das Kundenportal.',
    email: 'E-Mail-Adresse',
    pw: 'Passwort',
    name: 'Anzeigename',
    submitIn: 'Anmelden',
    submitUp: 'Konto anlegen',
    toUp: 'Noch kein Konto?',
    toIn: 'Schon eins?',
    forgot: 'Passwort vergessen',
    orMail: 'oder mit einer E-Mail-Adresse',
    google: 'Weiter mit Google',
    github: 'Weiter mit GitHub',
    sideNews: 'KI-Notizen',
    sideStand: 'Stand',
    sideNewsFoot: 'Von Hand geschrieben, nicht abgerufen — das Datum sagt, wie alt es ist.',
    sideWhat: 'Was das Konto oeffnet',
    whatItems: [
      ['Forum', 'Fragen, antworten, Fehlmeldungen melden.'],
      ['Kundenportal', 'Lizenzen, Schluessel, Bestellungen und Rechnungen.'],
      ['Gemerkte Skripte', 'Deine Liste bleibt ueber Geraete hinweg.'],
    ],
    sideSafe: 'Was wir nicht sehen',
    safeText:
      'Das Passwort wird von Firebase gehasht. Diese Seite sieht es nie. Google und GitHub melden dich an, ohne dass hier ueberhaupt ein Passwort entsteht.',
    signedInH: 'Du bist angemeldet',
    toPortal: 'Zum Kundenportal',
    toForum: 'Zum Forum',
    signOut: 'Abmelden',
    verifyH: 'Bestaetige deine E-Mail-Adresse',
    verifyP:
      'Lesen kannst du alles. Zum Schreiben oeffne den Link in der Mail, die gerade rausging — das verhindert, dass sich jemand mit einer fremden Adresse anmeldet.',
    resend: 'Nochmal senden',
    done: 'Ich habe bestaetigt',
    noConf: 'Die Anmeldung ist in diesem Build nicht eingerichtet.',
    working: 'Einen Moment…',
    backHint: 'Zurueck, wo du warst',
  },
};

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

const CSS = `
<style>
/*
 * ── Die Kapsel ───────────────────────────────────────────────────────────
 *
 * Dieselbe Form wie im Kundenportal, und dieselbe Rechnung dahinter. Kurz,
 * weil sie in skillry-lizenz/web/portal.css in voller Laenge steht:
 *
 * border-radius von 999px auf einem Kasten der Breite w ergibt keine Ellipse,
 * sondern eine Kapsel — zwei Halbkreise mit r = w/2 oben und unten, gerade
 * Seiten dazwischen. Anstossen kann der Inhalt nur in den Kappen. Ist das
 * seitliche Polster ein Anteil p der Breite, muss oben und unten gelten:
 *
 *     pb >= (w/2) * (1 - sqrt(1 - (1-2p)^2))
 *
 * Bei p = 19 % sind das 10.77 %. Hier stehen 13.5 %, und der Ueberschuss ist
 * der sichtbare Abstand. Auf GLEICHHEIT geloest waere zu knapp: genau daran
 * ist die Portal-Version einmal gescheitert, als der Inhalt um 15px breiter
 * wurde und die Ecken des Knopfs ueber der Kante standen.
 *
 * Die 19 % machen den Inhalt ausserdem immer genau 62 % der Form breit.
 * Daran haengt --spalte, und daran haengen die Knoepfe UNTER der Kapsel —
 * deshalb fluchten sie mit den Feldern darin, auf jeder Breite, ohne eine
 * einzige feste Zahl.
 */
:root {
  --an-kreis-d: 520px;
  --an-anteil: 0.62;
  --an-kreis-grund: radial-gradient(112% 112% at 32% 24%, #ffffff 0%, #f7f9fb 44%, #eef1f5 100%);
  --an-kreis-rand: #d1d9e0;
  --an-kreis-glanz: rgba(255, 255, 255, 0.95);
  --an-kreis-wurf: rgba(31, 35, 40, 0.16);
  --an-kreis-bloom: rgba(31, 35, 40, 0.10);
}
@media (prefers-color-scheme: dark) {
  :root {
    --an-kreis-grund: radial-gradient(112% 112% at 32% 24%, #20262e 0%, #171c23 46%, #10141a 100%);
    --an-kreis-rand: #333b45;
    --an-kreis-glanz: rgba(255, 255, 255, 0.07);
    --an-kreis-wurf: rgba(0, 0, 0, 0.55);
    --an-kreis-bloom: rgba(0, 0, 0, 0.45);
  }
}
:root[data-theme="dark"] {
  --an-kreis-grund: radial-gradient(112% 112% at 32% 24%, #20262e 0%, #171c23 46%, #10141a 100%);
  --an-kreis-rand: #333b45;
  --an-kreis-glanz: rgba(255, 255, 255, 0.07);
  --an-kreis-wurf: rgba(0, 0, 0, 0.55);
  --an-kreis-bloom: rgba(0, 0, 0, 0.45);
}
:root[data-theme="light"] {
  --an-kreis-grund: radial-gradient(112% 112% at 32% 24%, #ffffff 0%, #f7f9fb 44%, #eef1f5 100%);
  --an-kreis-rand: #d1d9e0;
  --an-kreis-glanz: rgba(255, 255, 255, 0.95);
  --an-kreis-wurf: rgba(31, 35, 40, 0.16);
  --an-kreis-bloom: rgba(31, 35, 40, 0.10);
}

/*
 * ── Der Raum: drei Spalten ───────────────────────────────────────────────
 *
 * Links die Notizen, in der Mitte die Anmeldung, rechts was das Konto oeffnet.
 * Die Mitte ist 1fr und nicht auto: sonst zieht die breitere der beiden
 * Seitenspalten die Kapsel aus der Bildmitte, und eine Anmeldung, die zwei
 * Pixel neben der Mitte steht, sieht falsch aus, ohne dass man sagen kann,
 * warum. Beide Seiten sind gleich breit, also steht die Mitte in der Mitte.
 *
 * minmax(0, 1fr) und nicht 1fr: der Standardwert von min-width in einem Grid
 * ist auto, damit kann die Spalte nicht unter ihren Inhalt schrumpfen, und
 * dann waechst das Raster ueber das Fenster hinaus statt umzubrechen.
 */
.an-raum {
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr) 264px;
  gap: 40px;
  align-items: start;
  padding: 40px 0 72px;
}
.an-mitte { min-width: 0; }

/*
 * Die Seitenspalten bleiben stehen. top ist --hdr-h plus Luft und keine
 * getippte Zahl: der Kopf aendert seine Hoehe an einem Haltepunkt, und zwei
 * Zahlen fuer dieselbe Hoehe laufen frueher oder spaeter auseinander.
 */
.an-seite {
  position: sticky;
  top: calc(var(--hdr-h, 62px) + 26px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.an-karte {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  padding: 16px 18px 18px;
}
.an-karte h2 {
  font-size: 0.7rem; letter-spacing: 0.11em; text-transform: uppercase;
  font-family: var(--mono); color: var(--fg-subtle);
  margin: 0 0 12px; font-weight: 600;
}
.an-notiz { padding-bottom: 13px; margin-bottom: 13px; border-bottom: 1px solid var(--border); }
.an-notiz:last-of-type { padding-bottom: 0; margin-bottom: 0; border-bottom: 0; }
.an-notiz h3 { font-size: 0.88rem; margin: 0 0 4px; line-height: 1.35; }
.an-notiz p { font-size: 0.8rem; line-height: 1.5; color: var(--fg-muted); margin: 0; }
.an-marke {
  font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--nexus); display: block; margin-bottom: 5px;
}
.an-stand {
  font-family: var(--mono); font-size: 0.66rem; color: var(--fg-subtle);
  margin: 12px 0 0; padding-top: 10px; border-top: 1px solid var(--border);
}
.an-was { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
.an-was strong { display: block; font-size: 0.86rem; }
.an-was span { font-size: 0.78rem; color: var(--fg-muted); line-height: 1.45; }

/* ── Kapsel ─────────────────────────────────────────────────────────────── */
/*
 * ═══════════════════════════════════════════════════════════════════════
 * WARUM DIE KAPSEL EINEN HALTER BRAUCHT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Prozentwerte in padding beziehen sich auf die INLINE-GROESSE DES
 * ELTERNELEMENTS, nicht auf die eigene Breite des Elements. Auch
 * padding-top — der bezieht sich ebenfalls auf die Breite, nicht auf die
 * Hoehe. Das ist die Regel, an der die ganze Rechnung oben haengt: sie
 * stimmt nur, wenn beide Breiten gleich sind.
 *
 * Hier waren sie es nicht. Die Kapsel war width: min(520px, 100%) und stand
 * mittig in der 672px breiten Rasterspalte. Gemessen kam heraus:
 *
 *     Kapsel 520px breit, padding-left 127.7px = 19 % von 672
 *     erwartet waeren  98.8px = 19 % von 520
 *
 * 29 Pixel zu viel auf jeder Seite, und oben 90.7 statt 70.2. Die Form sah
 * dabei nicht kaputt aus — sie war nur zu leer, und der Inhalt darin zu
 * schmal. Genau die Sorte Fehler, die man ohne Nachmessen nie findet, weil
 * nichts ueberlaeuft und nichts abgeschnitten wird.
 *
 * Der Halter ist genau so breit wie die Kapsel sein soll. Damit ist das
 * Elternelement die Kapsel selbst, die Prozente meinen wieder das, was in
 * der Rechnung steht — und alles darunter kann schlicht 62 % nehmen.
 */
.an-halter { width: min(var(--an-kreis-d), 100%); margin-inline: auto; }

.form-kreis {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: var(--an-kreis-d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13.5% 19%;
  border-radius: 999px;
  background: var(--an-kreis-grund);
  /*
   * Der Rand ist ein inset-Schatten und kein border.
   *
   * Ein border zaehlt in die Breite: bei box-sizing border-box blieben vom
   * Inhaltskasten 520 - 197.6 - 2 = 320.4px, waehrend die Knoepfe unter der
   * Kapsel volle 62 % von 520 = 322.4px nahmen. Gemessen 320 gegen 322 — zwei
   * Pixel, die man einzeln nicht sieht, die aber genau die Flucht brechen,
   * fuer die der Halter oben gebaut wurde.
   *
   * Ein inset-Schatten hat keine Wirkung auf das Layout, folgt aber demselben
   * border-radius. Damit ist der Inhaltskasten exakt 62 %, und die zwei Pixel
   * muessen nirgends von Hand abgezogen werden.
   */
  box-shadow:
    inset 0 0 0 1px var(--an-kreis-rand),
    inset 0 1px 0 var(--an-kreis-glanz),
    0 0 clamp(40px, 12vw, 96px) -28px var(--an-kreis-bloom),
    0 22px 46px -34px var(--an-kreis-wurf);
}
.kreis-in { width: 100%; }

/*
 * Alles unter der Kapsel nimmt dieselben 62 % und fluchtet dadurch mit den
 * Feldern DARIN statt mit deren Rand. Das war der sichtbare Bruch im Portal,
 * bevor es die Zahl gab: Felder 359px, Knoepfe darunter 520.
 */
/*
 * Alles unter der Kapsel nimmt denselben Anteil und fluchtet dadurch mit den
 * Feldern DARIN statt mit deren Rand. Es steht im selben Halter, also meinen
 * die 62 % hier dieselbe Breite wie die 62 % in der Kapsel.
 *
 * Ohne den Halter waren die Knoepfe 434px breit und die Felder darueber 322 —
 * das war der sichtbare Bruch, und es war derselbe Fehler wie beim Polster.
 */
.an-spalte { width: calc(var(--an-anteil) * 100%); margin-inline: auto; }

.an-kopf { text-align: center; margin-bottom: 14px; }
.an-kopf h1 { font-size: 1.32rem; margin: 0 0 5px; }
.an-kopf p { font-size: 0.83rem; color: var(--fg-muted); margin: 0; line-height: 1.45; }

.an-feld { margin-bottom: 11px; }
.an-feld label { display: block; font-size: 0.75rem; color: var(--fg-muted); margin-bottom: 3px; }
.an-go { width: 100%; justify-content: center; margin-top: 6px; }
.an-unten { display: flex; justify-content: space-between; gap: 12px; margin-top: 11px; font-size: 0.8rem; }

/*
 * ── Die Nebenwege ───────────────────────────────────────────────────────
 *
 * Sie stehen UNTER der Kapsel und nicht darin. Der Grund ist derselbe wie im
 * Portal: wer schon ein Passwort hier hat, soll es benutzen koennen, ohne
 * zuerst an zwei fremden Firmen vorbeizugehen. Deshalb sind sie auch nicht
 * die dickeren Knoepfe — im Portal waren sie einmal sogar breiter als der
 * Anmeldeknopf, und eine Seite, die einen zuerst woanders hinschickt, ist
 * eine Seite, die ihre eigene Anmeldung nicht ernst nimmt.
 */
.an-oder {
  display: flex; align-items: center; gap: 12px; margin: 22px 0 14px;
  font-size: 0.76rem; color: var(--fg-subtle);
}
.an-oder::before, .an-oder::after { content: ""; flex: 1; height: 1px; background: var(--border); }
.an-fremd { display: flex; flex-direction: column; gap: 9px; }
.an-fremd .btn { width: 100%; justify-content: center; }

.an-meld {
  font-size: 0.83rem; margin: 0 0 11px; padding: 9px 12px;
  border-left: 2px solid var(--danger); border-radius: 0 8px 8px 0;
  background: color-mix(in srgb, var(--danger) 8%, transparent); color: var(--fg);
}
.an-meld.ok { border-left-color: var(--ok); background: color-mix(in srgb, var(--ok) 8%, transparent); }
.an-meld[hidden] { display: none; }

.an-wer { text-align: center; }
.an-avatar {
  width: 52px; height: 52px; border-radius: 50%; margin: 0 auto 12px;
  display: grid; place-items: center; font-weight: 700; font-size: 20px;
  color: #04120b; background: linear-gradient(140deg, var(--airlock), var(--nexus));
}
.an-wer-mail { font-size: 0.8rem; color: var(--fg-subtle); margin: 0 0 16px; word-break: break-all; }
.an-wer .btn { width: 100%; justify-content: center; margin-bottom: 8px; }

[hidden] { display: none !important; }

/*
 * ── Schmaler ────────────────────────────────────────────────────────────
 *
 * 1080 und nicht 900: bei 1000px sind die beiden 264px-Spalten plus 520px
 * Kapsel plus zweimal 40px Abstand schon 1128px breit. Das Raster wuerde die
 * Kapsel zusammendruecken, und eine gedrueckte Kapsel ist keine Kapsel mehr,
 * sondern ein Oval mit falschem Polster — die Prozentrechnung oben stimmt
 * dann zwar noch, sieht aber nach nichts aus.
 *
 * Die Notizen verschwinden nicht, sie wandern unter die Anmeldung. Sie sind
 * dort das, was sie sind: Beiwerk, das man liest, wenn man Zeit hat.
 */
@media (max-width: 1080px) {
  .an-raum { grid-template-columns: minmax(0, 1fr); gap: 30px; }
  .an-seite { position: static; flex-direction: row; flex-wrap: wrap; }
  .an-seite > * { flex: 1 1 300px; }
  .an-links { order: 3; }
  .an-rechts { order: 2; }
  .an-mitte { order: 1; }
}
@media (max-width: 560px) {
  /* Zweites Paar aus derselben Formel: weniger Seitenrand (9 %), dafuer mehr
     oben und unten (24 %). Der Anteil waechst damit auf 82 %, und weil die
     Knoepfe ihn ueber dieselbe Variable lesen, wandern sie mit. */
  :root { --an-anteil: 0.82; }
  .form-kreis { padding: 24% 9%; }
  .an-seite { flex-direction: column; }
}
</style>`;

// ---------------------------------------------------------------------------
// Markup
// ---------------------------------------------------------------------------

export function head() {
  return CSS;
}

/*
 * Drei Notizen, nicht alle.
 *
 * Eine haftende Spalte, die hoeher ist als das Fenster, haftet nicht — sie
 * kann nur den Rest ihres Weges kleben und wandert davor mit. Gemessen: 891px
 * Spalte bei 880px Fenster und 88px Kopfabstand liessen 112px Weg uebrig, und
 * praktisch war davon nichts zu sehen.
 *
 * Deshalb steht hier eine Grenze und keine stille Kuerzung: die Datei darf
 * mehr Eintraege haben, die Spalte zeigt die ersten drei, und wie viele es
 * insgesamt sind, steht unter der Liste. Wer sie pflegt, sieht am Zaehler,
 * dass etwas nicht angezeigt wird.
 */
const ZEIGT = 3;

function notizen(lang, t) {
  const rest = Math.max(0, NOTIZEN.eintraege.length - ZEIGT);
  const items = NOTIZEN.eintraege
    .slice(0, ZEIGT)
    .map((e) => {
      const x = e[lang] || e.de;
      return `<article class="an-notiz">
        <span class="an-marke">${esc(e.marke)}</span>
        <h3>${esc(x.titel)}</h3>
        <p>${esc(x.text)}</p>
      </article>`;
    })
    .join('');
  return `<section class="an-karte">
    <h2>${esc(t.sideNews)}</h2>
    ${items}
    <p class="an-stand">${esc(t.sideStand)}: ${esc(NOTIZEN.stand)}${
      rest ? ` · +${rest}` : ''
    } · ${esc(t.sideNewsFoot)}</p>
  </section>`;
}

export function body(lang) {
  const t = T[lang] || T.de;

  const was = t.whatItems
    .map(([k, v]) => `<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`)
    .join('');

  const form = !CONFIGURED
    ? `<p class="an-meld">${esc(t.noConf)}</p>`
    : `<form id="anForm" novalidate>
        <p class="an-meld" id="anMeld" role="alert" hidden></p>
        <div class="an-feld" id="anNameFeld" hidden>
          <label for="anName">${esc(t.name)}</label>
          <input class="fld" type="text" id="anName" autocomplete="nickname">
        </div>
        <div class="an-feld">
          <label for="anMail">${esc(t.email)}</label>
          <input class="fld" type="email" id="anMail" autocomplete="email" required>
        </div>
        <div class="an-feld">
          <label for="anPw">${esc(t.pw)}</label>
          <input class="fld" type="password" id="anPw" autocomplete="current-password" required>
        </div>
        <button class="btn btn-primary an-go" type="submit" id="anGo">${esc(t.submitIn)}</button>
        <div class="an-unten">
          <button type="button" class="linkish" id="anSwap">${esc(t.toUp)}</button>
          <button type="button" class="linkish" id="anForgot">${esc(t.forgot)}</button>
        </div>
      </form>`;

  return `<div class="wrap an-raum">

  <aside class="an-seite an-links">${notizen(lang, t)}</aside>

  <div class="an-mitte">
    <div class="an-halter">
    <div class="form-kreis">
      <div class="kreis-in">

        <div data-an-sicht="form">
          <div class="an-kopf">
            <h1>${esc(t.h1)}</h1>
            <p>${esc(t.lede)}</p>
          </div>
          ${form}
        </div>

        <div data-an-sicht="pruefen" hidden>
          <div class="an-kopf"><h1>${esc(t.verifyH)}</h1><p>${esc(t.verifyP)}</p></div>
          <p class="an-meld" id="anMeld2" role="status" hidden></p>
          <button type="button" class="btn an-go" id="anResend">${esc(t.resend)}</button>
          <button type="button" class="btn an-go" id="anDone">${esc(t.done)}</button>
        </div>

        <!--
          Die Ansicht "angemeldet" ist hier bewusst NICHT mehr vorhanden.
          Wer angemeldet ist, wird zur Kontoverwaltung weitergeleitet — und
          Markup, das nie zu sehen ist, wird beim naechsten Umbau gepflegt,
          obwohl es niemanden mehr erreicht.
        -->
      </div>
    </div>

    ${
      CONFIGURED
        ? `<div class="an-spalte js-only" id="anFremdBlock">
      <p class="an-oder">${esc(t.orMail)}</p>
      <div class="an-fremd">
        <button type="button" class="btn" id="anGoogle">${esc(t.google)}</button>
        <button type="button" class="btn" id="anGithub">${esc(t.github)}</button>
      </div>
    </div>`
        : ''
    }
    </div>
  </div>

  <aside class="an-seite an-rechts">
    <section class="an-karte">
      <h2>${esc(t.sideWhat)}</h2>
      <ul class="an-was">${was}</ul>
    </section>
    <section class="an-karte">
      <h2>${esc(t.sideSafe)}</h2>
      <p style="font-size:0.8rem;line-height:1.55;color:var(--fg-muted);margin:0">${esc(t.safeText)}</p>
    </section>
  </aside>

</div>`;
}

// ---------------------------------------------------------------------------
// Skript
// ---------------------------------------------------------------------------

export function script(lang) {
  if (!CONFIGURED) return '';
  const t = T[lang] || T.de;
  const kontoZiel = href(lang, 'account');
  const L = JSON.stringify({
    submitIn: t.submitIn,
    submitUp: t.submitUp,
    toUp: t.toUp,
    toIn: t.toIn,
    working: t.working,
    orMail: t.orMail,
  });

  return [
    '(function () {',
    '  var L = ' + L + ';',
    '  var A = window.Skillry && window.Skillry.auth;',
    '  if (!A) return;',
    '',
    '  var sicht = function (n) {',
    '    [].forEach.call(document.querySelectorAll("[data-an-sicht]"), function (d) {',
    '      d.hidden = d.dataset.anSicht !== n;',
    '    });',
    '    var fremd = document.getElementById("anFremdBlock");',
    '    if (fremd) fremd.hidden = n !== "form";',
    '  };',
    '',
    '  var meldEl = document.getElementById("anMeld");',
    '  var meld2 = document.getElementById("anMeld2");',
    '  function sag(el, text, gut) {',
    '    if (!el) return;',
    '    el.hidden = !text; el.textContent = text || "";',
    '    el.classList.toggle("ok", !!gut);',
    '  }',
    '',
    '  /*',
    '   * Firebase-Fehlercodes sind fuer Entwickler geschrieben. Was hier',
    '   * ankommt, liest ein Mensch, der sich anmelden will — der braucht',
    '   * keinen Code, sondern den naechsten Schritt.',
    '   */',
    '  var TEXTE = {',
    '    "auth/invalid-email": ' + JSON.stringify(lang === 'de' ? 'Diese E-Mail-Adresse sieht nicht richtig aus.' : 'That email address does not look right.') + ',',
    '    "auth/missing-password": ' + JSON.stringify(lang === 'de' ? 'Da fehlt noch das Passwort.' : 'The password is still missing.') + ',',
    '    "auth/weak-password": ' + JSON.stringify(lang === 'de' ? 'Das Passwort ist zu kurz — mindestens sechs Zeichen.' : 'That password is too short — six characters at least.') + ',',
    '    "auth/email-already-in-use": ' + JSON.stringify(lang === 'de' ? 'Zu dieser Adresse gibt es schon ein Konto. Melde dich damit an.' : 'There is already an account on that address. Sign in with it.') + ',',
    '    /* Ein Text fuer falsches Passwort, unbekanntes Konto und ungueltige',
    '       Anmeldedaten. Drei verschiedene Texte machen aus dem Formular ein',
    '       Auskunftsmittel darueber, welche Adressen ein Konto haben. */',
    '    "auth/invalid-credential": ' + JSON.stringify(lang === 'de' ? 'E-Mail-Adresse und Passwort passen nicht zusammen.' : 'That email and password do not go together.') + ',',
    '    "auth/wrong-password": ' + JSON.stringify(lang === 'de' ? 'E-Mail-Adresse und Passwort passen nicht zusammen.' : 'That email and password do not go together.') + ',',
    '    "auth/user-not-found": ' + JSON.stringify(lang === 'de' ? 'E-Mail-Adresse und Passwort passen nicht zusammen.' : 'That email and password do not go together.') + ',',
    '    "auth/too-many-requests": ' + JSON.stringify(lang === 'de' ? 'Zu viele Versuche. Warte einen Moment.' : 'Too many attempts. Wait a moment.') + ',',
    '    "auth/popup-closed-by-user": ' + JSON.stringify(lang === 'de' ? 'Das Fenster wurde geschlossen, bevor es fertig war.' : 'The window closed before it finished.') + ',',
    '    "auth/network-request-failed": ' + JSON.stringify(lang === 'de' ? 'Keine Verbindung. Das liegt nicht an deinem Passwort.' : 'No connection. This is not your password.') + '',
    '  };',
    '  function lesbar(e) {',
    '    var c = e && e.code;',
    '    if (c && TEXTE[c]) return TEXTE[c];',
    '    /* Unbekanntes wird NICHT verschluckt: ein Fehler ohne Text ist eine',
    '       Anmeldung, die stumm nicht funktioniert. Lieber der rohe Code. */',
    '    return (e && (e.message || c)) || "?";',
    '  }',
    '',
    '  var modus = "in";',
    '  var form = document.getElementById("anForm");',
    '  var go = document.getElementById("anGo");',
    '  var swap = document.getElementById("anSwap");',
    '  var nameFeld = document.getElementById("anNameFeld");',
    '',
    '  if (swap) swap.addEventListener("click", function () {',
    '    modus = modus === "in" ? "up" : "in";',
    '    go.textContent = modus === "in" ? L.submitIn : L.submitUp;',
    '    swap.textContent = modus === "in" ? L.toUp : L.toIn;',
    '    nameFeld.hidden = modus !== "up";',
    '    document.getElementById("anPw").setAttribute("autocomplete", modus === "in" ? "current-password" : "new-password");',
    '    sag(meldEl, "");',
    '  });',
    '',
    '  function laufe(p) {',
    '    go.disabled = true;',
    '    var alt = go.textContent;',
    '    go.textContent = L.working;',
    '    return p.then(function (r) { go.disabled = false; go.textContent = alt; return r; },',
    '                  function (e) { go.disabled = false; go.textContent = alt; throw e; });',
    '  }',
    '',
    '  if (form) form.addEventListener("submit", function (e) {',
    '    e.preventDefault();',
    '    sag(meldEl, "");',
    '    var mail = document.getElementById("anMail").value.trim();',
    '    var pw = document.getElementById("anPw").value;',
    '    var wunsch = (document.getElementById("anName").value || "").trim();',
    '    laufe(A.ensure().then(function (k) {',
    '      if (modus === "in") return k.fb.signInWithEmailAndPassword(k.auth, mail, pw);',
    '      return k.fb.createUserWithEmailAndPassword(k.auth, mail, pw).then(function (c) {',
    '        var weiter = wunsch ? k.fb.updateProfile(c.user, { displayName: wunsch }) : Promise.resolve();',
    '        return weiter.then(function () { return k.fb.sendEmailVerification(c.user); });',
    '      });',
    '    })).then(null, function (err) { sag(meldEl, lesbar(err)); });',
    '  });',
    '',
    '  var forgot = document.getElementById("anForgot");',
    '  if (forgot) forgot.addEventListener("click", function () {',
    '    var mail = document.getElementById("anMail").value.trim();',
    '    if (!mail) { sag(meldEl, ' + JSON.stringify(lang === 'de' ? 'Trag zuerst deine E-Mail-Adresse ein.' : 'Enter your email address first.') + '); return; }',
    '    /*',
    '     * IMMER dieselbe Antwort, ob die Mail rausging oder nicht.',
    '     *',
    '     * Wer hier "Zu dieser Adresse gibt es kein Konto" ausgibt, hat ein',
    '     * Formular gebaut, mit dem man Adresslisten pruefen kann: eintragen,',
    '     * absenden, ablesen. Ob eine Adresse ein Konto hat, ist nichts, was',
    '     * ein Anmeldeformular an Unangemeldete verteilt. Uebernommen aus dem',
    '     * Kopf, wo dieselbe Ueberlegung schon stand.',
    '     */',
    '    A.ensure().then(function (k) { return k.fb.sendPasswordResetEmail(k.auth, mail); })',
    '      .then(null, function () {})',
    '      .then(function () { sag(meldEl, ' + JSON.stringify(lang === 'de' ? 'Wenn es zu dieser Adresse ein Konto gibt, ist die Mail unterwegs.' : 'If there is an account on that address, the mail is on its way.') + ', true); });',
    '  });',
    '',
    '  /*',
    '   * Google und GitHub. Ein Popup, das der Browser blockt, ist der haeufigste',
    '   * Fall hier — und er faellt als Fehlercode zurueck, nicht als stiller',
    '   * Nichts-passiert. Deshalb geht auch dieser Weg durch lesbar().',
    '   */',
    '  function fremd(name) {',
    '    sag(meldEl, "");',
    '    A.ensure().then(function (k) {',
    '      var p = name === "google" ? new k.fb.GoogleAuthProvider() : new k.fb.GithubAuthProvider();',
    '      return k.fb.signInWithPopup(k.auth, p);',
    '    }).then(null, function (err) { sag(meldEl, lesbar(err)); });',
    '  }',
    '  var gBtn = document.getElementById("anGoogle");',
    '  var hBtn = document.getElementById("anGithub");',
    '  if (gBtn) gBtn.addEventListener("click", function () { fremd("google"); });',
    '  if (hBtn) hBtn.addEventListener("click", function () { fremd("github"); });',
    '',
    '  var resend = document.getElementById("anResend");',
    '  if (resend) resend.addEventListener("click", function () {',
    '    A.ensure().then(function (k) { return k.fb.sendEmailVerification(k.auth.currentUser); })',
    '      .then(function () { sag(meld2, ' + JSON.stringify(lang === 'de' ? 'Nochmal raus.' : 'Sent again.') + ', true); },',
    '            function (err) { sag(meld2, lesbar(err)); });',
    '  });',
    '  var done = document.getElementById("anDone");',
    '  if (done) done.addEventListener("click", function () {',
    '    A.ensure().then(function (k) {',
    '      return k.auth.currentUser.reload().then(function () {',
    '        if (k.auth.currentUser.emailVerified) zeichne(k.auth.currentUser);',
    '        else sag(meld2, ' + JSON.stringify(lang === 'de' ? 'Noch nicht bestaetigt. Sieh im Spam-Ordner nach.' : 'Not confirmed yet. Check the spam folder.') + ');',
    '      });',
    '    });',
    '  });',

    '  /*',
    '   * Wohin danach.',
    '   *',
    '   * ?weiter= traegt das Ziel. Nur PFADE werden angenommen und nur solche,',
    '   * die mit einem einzelnen / anfangen: //example.com ist fuer den Browser',
    '   * eine fremde Adresse, und ein Anmeldeformular, das danach irgendwohin',
    '   * weiterleitet, ist genau das Werkzeug, mit dem man Leute auf eine',
    '   * nachgebaute Seite schickt. Alles andere landet auf dieser Seite.',
    '   */',
    '  function ziel() {',
    '    var w = new URLSearchParams(location.search).get("weiter");',
    '    if (!w || w.charAt(0) !== "/" || w.charAt(1) === "/" || w.charAt(1) === "\\\\") return null;',
    '    return w;',
    '  }',
    '',
    '  function zeichne(u) {',
    '    if (!u) { sicht("form"); return; }',
    '    if (!u.emailVerified && u.providerData && u.providerData.length &&',
    '        u.providerData[0].providerId === "password") { sicht("pruefen"); return; }',
    '    var z = ziel();',
    '    if (z) { location.replace(z); return; }',
    '    /*',
    '     * Ohne Ziel geht es zur Kontoverwaltung.',
    '     *',
    '     * Angemeldet hat diese Seite keine Aufgabe mehr. Sie zeigte bisher',
    '     * "Du bist angemeldet" und zwei Links — eine Sackgasse mit',
    '     * Bestaetigung. Die Kontoseite ist der Ort, an dem es weitergeht.',
    '     *',
    '     * replace und nicht assign: sonst liegt die Anmeldeseite in der',
    '     * Geschichte, und der Zurueck-Knopf fuehrt zurueck auf sie, die sofort',
    '     * wieder weiterleitet. Man kaeme nicht mehr nach hinten heraus.',
    '     */',
    '    location.replace(' + JSON.stringify(kontoZiel) + ');',
    '  }',
    '',
    '  /*',
    '   * Der Kopf hat schon einen onAuthStateChanged-Horcher und schreibt in',
    '   * A.state.user. Ein zweiter Horcher waere ein zweiter Zustand fuer',
    '   * dieselbe Frage. Stattdessen wird hier auf dasselbe Ereignis gehoert,',
    '   * das der Kopf ohnehin ausloest.',
    '   */',
    '  A.ensure().then(function (k) {',
    '    k.fb.onAuthStateChanged(k.auth, zeichne);',
    '  });',
    '})();',
  ].join('\n');
}
