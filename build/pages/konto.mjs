/**
 * Die Kontoverwaltung.
 *
 * WARUM EINE EIGENE SEITE UND NICHT DER ANGEMELDET-ZUSTAND VON /signin
 * -------------------------------------------------------------------
 * Anmelden und Verwalten sind zwei verschiedene Absichten. Wer sich anmeldet,
 * will danach woanders hin; wer sein Konto verwaltet, will genau hier bleiben.
 * Beides in eine Seite zu legen heisst, dass die eine Haelfte immer im Weg
 * steht — und dass man niemandem eine Adresse geben kann, unter der sein
 * Passwortwechsel liegt.
 *
 * /signin schickt Angemeldete hierher weiter, /account schickt Abgemeldete
 * dorthin. Beide Wege tragen das Ziel mit.
 *
 * DER AUFBAU
 * ----------
 * Das Markup steht vollstaendig in body() und wird nicht im Skript gebaut.
 * Das ist hier kein Stilfrage: ein Formular, das erst JavaScript erzeugt, wird
 * von Passwortspeichern schlechter erkannt, und genau darum geht es auf dieser
 * Seite. Das Skript fuellt Werte ein und faengt das Absenden ab — mehr nicht.
 *
 * ACHTUNG BEIM BEARBEITEN: Diese Datei baut HTML und CSS in Template-Literalen.
 * Ein Backtick in einem Kommentar beendet das Literal und der Build stirbt mit
 * "Unexpected identifier". Deshalb steht in den Kommentaren hier drin keiner.
 */
import { href } from '../layout.mjs';
import { PORTAL } from '../portal.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'account';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FB = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));
const CONFIGURED = Boolean(FB.projectId && FB.apiKey);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const meta = {
  en: {
    title: 'Account · Skillry',
    description:
      'Manage your Skillry account: display name, email address, password, connected sign-ins and sessions.',
  },
  de: {
    title: 'Konto · Skillry',
    description:
      'Dein Skillry-Konto verwalten: Anzeigename, E-Mail-Adresse, Passwort, verknuepfte Anmeldungen und Sitzungen.',
  },
};

const T = {
  en: {
    h1: 'Account',
    lede: 'Everything about your sign-in, in one place.',
    navProfile: 'Profile',
    navSignIn: 'Sign-in',
    navLinked: 'Connected sign-ins',
    navSessions: 'Sessions',
    navDanger: 'Danger zone',

    profileH: 'Profile',
    nameL: 'Display name',
    nameHint: 'This is the name on your forum posts. Everyone can see it.',
    save: 'Save',
    savedOk: 'Saved.',

    mailH: 'Email address',
    mailCurrent: 'Current address',
    mailNew: 'New address',
    mailChange: 'Change address',
    mailPending:
      'A confirmation went to the new address. The change takes effect once you open the link there — until then the old address stays valid.',
    verified: 'confirmed',
    unverified: 'not confirmed',
    resend: 'Send confirmation again',
    resentOk: 'Sent.',

    pwH: 'Password',
    pwNew: 'New password',
    pwRepeat: 'Repeat',
    pwChange: 'Change password',
    pwMismatch: 'The two entries are not the same.',
    pwShort: 'At least eight characters.',
    pwOk: 'Password changed.',
    pwNone:
      'This account signs in through Google or GitHub and has no password here. Nothing to change.',

    linkedH: 'Connected sign-ins',
    linkedHint:
      'Every connected way gets you into the same account. At least one has to stay — otherwise you would lock yourself out.',
    connect: 'Connect',
    disconnect: 'Disconnect',
    lastOne: 'This is the only way in. Connect another one first.',
    linkedOk: 'Connected.',
    unlinkedOk: 'Disconnected.',
    pwLogin: 'Email and password',

    sessionsH: 'Sessions',
    signOutHere: 'Sign out on this device',
    sessionsNote:
      'This signs you out in this browser. Other devices keep their session until it expires — revoking those needs the licence service, which does not do it yet.',

    dangerH: 'Delete account',
    dangerNote:
      'The account and its sign-in go for good. Forum posts stay, with the name that was on them — otherwise every conversation they are part of would fall apart.',
    delete: 'Delete account',
    delConfirm: 'Type DELETE to confirm',
    delWord: 'DELETE',
    delWrong: 'Not confirmed — the word did not match.',
    delOk: 'The account is gone.',

    reauthH: 'Confirm it is you',
    reauthWhy:
      'This change matters, and you signed in a while ago. Confirming again means a stolen open browser is not enough.',
    reauthPw: 'Your password',
    reauthGo: 'Confirm',
    reauthPopup: 'Confirm with',
    cancel: 'Cancel',

    toPortal: 'Customer portal',
    toPosts: 'My posts',
    sideSafeH: 'What we can see',
    sideSafe:
      'Never your password — Firebase stores it hashed. Sign-ins through Google or GitHub give us an id and an address, nothing else.',
    sideMgrH: 'Let the password manager do it',
    sideMgr:
      'The fields are marked so your browser or password manager offers to store and fill them. A password you never type is one that cannot be watched over your shoulder.',
    noConf: 'Sign-in is not configured on this build.',
    working: 'One moment…',
    signedOut: 'You are not signed in.',
    toSignIn: 'To sign-in',
  },
  de: {
    h1: 'Konto',
    lede: 'Alles zu deiner Anmeldung an einem Ort.',
    navProfile: 'Profil',
    navSignIn: 'Anmeldung',
    navLinked: 'Verknuepfte Anmeldungen',
    navSessions: 'Sitzungen',
    navDanger: 'Gefahrenzone',

    profileH: 'Profil',
    nameL: 'Anzeigename',
    nameHint: 'Der Name an deinen Forumsbeitraegen. Den sehen alle.',
    save: 'Speichern',
    savedOk: 'Gespeichert.',

    mailH: 'E-Mail-Adresse',
    mailCurrent: 'Aktuelle Adresse',
    mailNew: 'Neue Adresse',
    mailChange: 'Adresse aendern',
    mailPending:
      'An die neue Adresse ist eine Bestaetigung raus. Die Aenderung gilt, sobald du den Link dort oeffnest — bis dahin bleibt die alte Adresse gueltig.',
    verified: 'bestaetigt',
    unverified: 'nicht bestaetigt',
    resend: 'Bestaetigung nochmal senden',
    resentOk: 'Raus.',

    pwH: 'Passwort',
    pwNew: 'Neues Passwort',
    pwRepeat: 'Wiederholen',
    pwChange: 'Passwort aendern',
    pwMismatch: 'Die beiden Eingaben sind nicht gleich.',
    pwShort: 'Mindestens acht Zeichen.',
    pwOk: 'Passwort geaendert.',
    pwNone:
      'Dieses Konto meldet sich ueber Google oder GitHub an und hat hier gar kein Passwort. Es gibt nichts zu aendern.',

    linkedH: 'Verknuepfte Anmeldungen',
    linkedHint:
      'Jeder verknuepfte Weg fuehrt in dasselbe Konto. Einer muss bleiben — sonst sperrst du dich selbst aus.',
    connect: 'Verknuepfen',
    disconnect: 'Trennen',
    lastOne: 'Das ist der einzige Weg hinein. Verknuepfe zuerst einen zweiten.',
    linkedOk: 'Verknuepft.',
    unlinkedOk: 'Getrennt.',
    pwLogin: 'E-Mail und Passwort',

    sessionsH: 'Sitzungen',
    signOutHere: 'Auf diesem Geraet abmelden',
    sessionsNote:
      'Das meldet dich in diesem Browser ab. Andere Geraete behalten ihre Sitzung, bis sie ablaeuft — die zu beenden braucht den Lizenzdienst, und der kann es noch nicht.',

    dangerH: 'Konto loeschen',
    dangerNote:
      'Das Konto und seine Anmeldung sind danach weg. Forumsbeitraege bleiben stehen, mit dem Namen, der daran stand — sonst zerfaellt jedes Gespraech, an dem sie haengen.',
    delete: 'Konto loeschen',
    delConfirm: 'Zum Bestaetigen LOESCHEN eintippen',
    delWord: 'LOESCHEN',
    delWrong: 'Nicht bestaetigt — das Wort stimmte nicht.',
    delOk: 'Das Konto ist weg.',

    reauthH: 'Bestaetige, dass du es bist',
    reauthWhy:
      'Diese Aenderung wiegt schwer, und deine Anmeldung ist eine Weile her. Nochmal bestaetigen heisst: ein offen stehen gelassener Browser genuegt nicht.',
    reauthPw: 'Dein Passwort',
    reauthGo: 'Bestaetigen',
    reauthPopup: 'Bestaetigen mit',
    cancel: 'Abbrechen',

    toPortal: 'Kundenportal',
    toPosts: 'Meine Beitraege',
    sideSafeH: 'Was wir sehen koennen',
    sideSafe:
      'Dein Passwort nie — Firebase speichert es gehasht. Anmeldungen ueber Google oder GitHub geben uns eine Kennung und eine Adresse, sonst nichts.',
    sideMgrH: 'Lass den Passwortspeicher ran',
    sideMgr:
      'Die Felder sind so ausgezeichnet, dass Browser und Passwortspeicher sie zum Merken und Ausfuellen anbieten. Ein Passwort, das man nie tippt, kann einem auch niemand ueber die Schulter ablesen.',
    noConf: 'Die Anmeldung ist in diesem Build nicht eingerichtet.',
    working: 'Einen Moment…',
    signedOut: 'Du bist nicht angemeldet.',
    toSignIn: 'Zur Anmeldung',
  },
};

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

const CSS = `
<style>
.ko-raum {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 250px;
  gap: 34px;
  align-items: start;
  padding: 34px 0 72px;
}
.ko-mitte { min-width: 0; }
.ko-seite { position: sticky; top: calc(var(--hdr-h, 62px) + 26px); }

.ko-kopf { margin-bottom: 26px; }
.ko-kopf h1 { font-size: 1.6rem; margin: 0 0 5px; }
.ko-kopf p { color: var(--fg-muted); margin: 0; font-size: 0.92rem; }

/* Der Abschnittswegweiser links. */
.ko-nav { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.ko-nav a {
  display: block; padding: 7px 11px; margin-left: -11px;
  border-radius: 7px; color: var(--fg-muted); font-size: 0.88rem;
}
.ko-nav a:hover { background: var(--surface-2); color: var(--fg); text-decoration: none; }
.ko-nav a[aria-current="true"] { color: var(--fg); background: var(--surface-2); font-weight: 600; }

.ko-block {
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); padding: 20px 22px; margin-bottom: 18px;
}
/*
 * scroll-margin-top, nicht ein Abstandshalter.
 *
 * Der Kopf der Seite klebt. Ein Sprungziel landet sonst DAHINTER: der Browser
 * scrollt das Element an den oberen Fensterrand, und dort steht die Leiste
 * davor. Man springt zu einer Ueberschrift und sieht ihre Unterkante.
 */
.ko-block[id] { scroll-margin-top: calc(var(--hdr-h, 62px) + 20px); }
.ko-block h2 { font-size: 1.05rem; margin: 0 0 4px; }
.ko-hint { color: var(--fg-muted); font-size: 0.85rem; line-height: 1.55; margin: 0 0 16px; }
.ko-l { display: block; font-size: 0.76rem; color: var(--fg-muted); margin-bottom: 2px; }
.ko-reihe { display: flex; gap: 12px; flex-wrap: wrap; }
.ko-reihe > * { flex: 1 1 190px; }
.ko-tat { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 4px; }

/*
 * Das versteckte Benutzernamenfeld.
 *
 * display: none waere das Naheliegende und genau das Falsche: Passwortspeicher
 * ueberspringen Felder, die nicht im Layout stehen, und ordnen das Passwort
 * dann keinem Konto zu. Deshalb steht es da, ist nur nicht zu sehen — die
 * Bauweise, die Chrome und Firefox in ihren eigenen Hinweisen empfehlen.
 */
.ko-versteckt {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap; border: 0;
}

.ko-marke {
  display: inline-block; margin-left: 8px; padding: 1px 8px;
  border-radius: 999px; font-size: 0.7rem; font-family: var(--mono);
  border: 1px solid var(--border-strong); color: var(--fg-muted);
}
.ko-marke.ja { color: var(--marke-auf-flaeche); background: var(--marke-flaeche); border-color: transparent; }
.ko-marke.nein { color: var(--warn, #d29922); border-color: currentColor; }

.ko-weg {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0; border-bottom: 1px solid var(--border);
}
.ko-weg:last-child { border-bottom: 0; padding-bottom: 0; }
.ko-weg-name { flex: 1; font-size: 0.9rem; }
.ko-weg-adr { display: block; font-size: 0.78rem; color: var(--fg-subtle); }

.ko-gefahr { border-color: color-mix(in srgb, var(--danger) 40%, var(--border)); }
.ko-gefahr h2 { color: var(--danger); }
.btn-gefahr {
  border-color: var(--danger); color: var(--danger); background: none;
}
.btn-gefahr:hover { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }

.ko-meld {
  font-size: 0.85rem; margin: 0 0 14px; padding: 9px 12px;
  border-left: 2px solid var(--danger); border-radius: 0 8px 8px 0;
  background: color-mix(in srgb, var(--danger) 8%, transparent);
}
.ko-meld.ok { border-left-color: var(--ok); background: color-mix(in srgb, var(--ok) 8%, transparent); }
.ko-meld[hidden] { display: none; }

.ko-karte {
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); padding: 15px 17px; margin-bottom: 16px;
}
.ko-karte h2 {
  font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.11em;
  text-transform: uppercase; color: var(--fg-subtle); margin: 0 0 9px; font-weight: 600;
}
.ko-karte p { font-size: 0.79rem; line-height: 1.55; color: var(--fg-muted); margin: 0; }
.ko-schnell { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ko-schnell a { font-size: 0.86rem; }

.ko-dialog {
  width: min(420px, calc(100vw - 32px));
  padding: 0; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface); color: var(--fg); box-shadow: var(--e3);
}
/* ::backdrop haengt nicht im Elementbaum und erbt die eigenen Variablen nicht
   — var() faellt dort still auf durchsichtig zurueck. Also ein fester Wert. */
.ko-dialog::backdrop { background: rgba(5, 3, 15, 0.62); backdrop-filter: blur(2px); }
.ko-dialog-in { padding: 20px 22px 18px; }
.ko-dialog h2 { font-size: 1.05rem; margin: 0 0 6px; }
.ko-dialog-fuss { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }

@media (max-width: 1040px) {
  .ko-raum { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .ko-seite { position: static; }
  .ko-links { order: 1; }
  .ko-mitte { order: 2; }
  .ko-rechts { order: 3; }
  .ko-nav { flex-direction: row; flex-wrap: wrap; gap: 4px; }
  .ko-nav a { margin-left: 0; border: 1px solid var(--border); }
}
</style>`;

export function head() {
  return CSS;
}

// ---------------------------------------------------------------------------
// Markup
// ---------------------------------------------------------------------------

export function body(lang) {
  const t = T[lang] || T.de;

  if (!CONFIGURED) {
    return `<div class="wrap" style="padding:60px 0"><p class="ko-meld">${esc(t.noConf)}</p></div>`;
  }

  const nav = [
    ['profil', t.navProfile],
    ['anmeldung', t.navSignIn],
    ['verknuepft', t.navLinked],
    ['sitzungen', t.navSessions],
    ['gefahr', t.navDanger],
  ]
    .map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`)
    .join('');

  return `<div class="wrap ko-raum">

  <aside class="ko-seite ko-links">
    <ul class="ko-nav" id="koNav">${nav}</ul>
  </aside>

  <div class="ko-mitte">
    <div class="ko-kopf">
      <h1>${esc(t.h1)}</h1>
      <p>${esc(t.lede)}</p>
    </div>

    <p class="ko-meld" id="koMeld" role="status" hidden></p>

    <div id="koAbgemeldet" hidden>
      <div class="ko-block">
        <h2>${esc(t.signedOut)}</h2>
        <p class="ko-hint">${esc(t.lede)}</p>
        <a class="btn btn-primary" id="koZurAnmeldung" href="${href(lang, 'signin')}">${esc(t.toSignIn)}</a>
      </div>
    </div>

    <div id="koAngemeldet" hidden>

      <section class="ko-block" id="profil">
        <h2>${esc(t.profileH)}</h2>
        <p class="ko-hint">${esc(t.nameHint)}</p>
        <form id="koNameForm" novalidate>
          <label class="ko-l" for="koName">${esc(t.nameL)}</label>
          <input class="fld" id="koName" type="text" autocomplete="nickname" maxlength="60">
          <div class="ko-tat"><button class="btn btn-primary" type="submit">${esc(t.save)}</button></div>
        </form>
      </section>

      <section class="ko-block" id="anmeldung">
        <h2>${esc(t.mailH)}</h2>
        <p class="ko-hint">
          <span id="koMailIst"></span><span class="ko-marke" id="koMailMarke"></span>
        </p>
        <div class="ko-tat" id="koMailUnbestaetigt" hidden>
          <button type="button" class="btn" id="koResend">${esc(t.resend)}</button>
        </div>
        <form id="koMailForm" novalidate style="margin-top:14px">
          <label class="ko-l" for="koMailNeu">${esc(t.mailNew)}</label>
          <input class="fld" id="koMailNeu" type="email" autocomplete="email">
          <div class="ko-tat"><button class="btn" type="submit">${esc(t.mailChange)}</button></div>
        </form>
      </section>

      <section class="ko-block">
        <h2>${esc(t.pwH)}</h2>
        <p class="ko-hint" id="koPwNone" hidden>${esc(t.pwNone)}</p>
        <form id="koPwForm" novalidate>
          <!--
            Das Benutzernamenfeld ist fuer den Passwortspeicher da, nicht fuer
            den Menschen. Ohne ein Feld mit autocomplete="username" im selben
            Formular weiss der Speicher nicht, zu welchem Konto das neue
            Passwort gehoert — und bietet es beim naechsten Mal nicht an.
          -->
          <input class="ko-versteckt" id="koPwUser" type="email" autocomplete="username" tabindex="-1" aria-hidden="true">
          <div class="ko-reihe">
            <div>
              <label class="ko-l" for="koPwNeu">${esc(t.pwNew)}</label>
              <input class="fld" id="koPwNeu" type="password" autocomplete="new-password">
            </div>
            <div>
              <label class="ko-l" for="koPwNeu2">${esc(t.pwRepeat)}</label>
              <input class="fld" id="koPwNeu2" type="password" autocomplete="new-password">
            </div>
          </div>
          <div class="ko-tat"><button class="btn" type="submit">${esc(t.pwChange)}</button></div>
        </form>
      </section>

      <section class="ko-block" id="verknuepft">
        <h2>${esc(t.linkedH)}</h2>
        <p class="ko-hint">${esc(t.linkedHint)}</p>
        <div id="koWege"></div>
      </section>

      <section class="ko-block" id="sitzungen">
        <h2>${esc(t.sessionsH)}</h2>
        <p class="ko-hint">${esc(t.sessionsNote)}</p>
        <div class="ko-tat"><button type="button" class="btn" id="koAbmelden">${esc(t.signOutHere)}</button></div>
      </section>

      <section class="ko-block ko-gefahr" id="gefahr">
        <h2>${esc(t.dangerH)}</h2>
        <p class="ko-hint">${esc(t.dangerNote)}</p>
        <form id="koDelForm" novalidate>
          <label class="ko-l" for="koDelWort">${esc(t.delConfirm)}</label>
          <input class="fld" id="koDelWort" type="text" autocomplete="off" spellcheck="false">
          <div class="ko-tat"><button class="btn btn-gefahr" type="submit">${esc(t.delete)}</button></div>
        </form>
      </section>

    </div>
  </div>

  <aside class="ko-seite ko-rechts">
    <section class="ko-karte">
      <h2>${esc(t.navSignIn)}</h2>
      <ul class="ko-schnell">
        ${PORTAL ? `<li><a href="${PORTAL}/">${esc(t.toPortal)}</a></li>` : ''}
        <li><a href="${href(lang, 'forum')}?mine=1">${esc(t.toPosts)}</a></li>
      </ul>
    </section>
    <section class="ko-karte">
      <h2>${esc(t.sideSafeH)}</h2>
      <p>${esc(t.sideSafe)}</p>
    </section>
    <section class="ko-karte">
      <h2>${esc(t.sideMgrH)}</h2>
      <p>${esc(t.sideMgr)}</p>
    </section>
  </aside>

</div>

<dialog class="ko-dialog" id="koReauth">
  <form method="dialog" class="ko-dialog-in">
    <h2>${esc(t.reauthH)}</h2>
    <p class="ko-hint">${esc(t.reauthWhy)}</p>
    <p class="ko-meld" id="koReauthMeld" role="alert" hidden></p>
    <div id="koReauthPw">
      <input class="ko-versteckt" id="koReauthUser" type="email" autocomplete="username" tabindex="-1" aria-hidden="true">
      <label class="ko-l" for="koReauthFeld">${esc(t.reauthPw)}</label>
      <input class="fld" id="koReauthFeld" type="password" autocomplete="current-password">
    </div>
    <div id="koReauthFremd" hidden>
      <button type="button" class="btn" id="koReauthPopup"></button>
    </div>
    <div class="ko-dialog-fuss">
      <button type="button" class="btn" id="koReauthAb">${esc(t.cancel)}</button>
      <button type="button" class="btn btn-primary" id="koReauthGo">${esc(t.reauthGo)}</button>
    </div>
  </form>
</dialog>`;
}

// ---------------------------------------------------------------------------
// Skript
// ---------------------------------------------------------------------------

export function script(lang) {
  if (!CONFIGURED) return '';
  const t = T[lang] || T.de;
  const S = JSON.stringify({
    savedOk: t.savedOk, resentOk: t.resentOk, mailPending: t.mailPending,
    pwMismatch: t.pwMismatch, pwShort: t.pwShort, pwOk: t.pwOk,
    connect: t.connect, disconnect: t.disconnect, lastOne: t.lastOne,
    linkedOk: t.linkedOk, unlinkedOk: t.unlinkedOk, pwLogin: t.pwLogin,
    verified: t.verified, unverified: t.unverified,
    delWord: t.delWord, delWrong: t.delWrong, delOk: t.delOk,
    working: t.working, reauthPopup: t.reauthPopup,
  });

  return [
    '(function () {',
    '  var S = ' + S + ';',
    '  var A = window.Skillry && window.Skillry.auth;',
    '  if (!A) return;',
    '',
    '  var meld = document.getElementById("koMeld");',
    '  function sag(text, gut) {',
    '    meld.hidden = !text; meld.textContent = text || "";',
    '    meld.classList.toggle("ok", !!gut);',
    '    if (text) meld.scrollIntoView({ block: "nearest", behavior: "smooth" });',
    '  }',
    '',
    '  /*',
    '   * Firebase-Fehlercodes sind fuer Entwickler geschrieben. Hier liest sie',
    '   * jemand, der seinen Namen aendern wollte.',
    '   */',
    '  var TEXTE = {',
    '    "auth/requires-recent-login": ' + JSON.stringify(lang === 'de' ? 'Dafuer musst du dich frisch bestaetigen.' : 'That needs a fresh confirmation.') + ',',
    '    "auth/wrong-password": ' + JSON.stringify(lang === 'de' ? 'Das Passwort stimmt nicht.' : 'That password is not right.') + ',',
    '    "auth/invalid-credential": ' + JSON.stringify(lang === 'de' ? 'Das Passwort stimmt nicht.' : 'That password is not right.') + ',',
    '    "auth/email-already-in-use": ' + JSON.stringify(lang === 'de' ? 'Diese Adresse gehoert schon zu einem Konto.' : 'That address already belongs to an account.') + ',',
    '    "auth/invalid-email": ' + JSON.stringify(lang === 'de' ? 'Diese Adresse sieht nicht richtig aus.' : 'That address does not look right.') + ',',
    '    "auth/weak-password": ' + JSON.stringify(lang === 'de' ? 'Das Passwort ist zu kurz.' : 'That password is too short.') + ',',
    '    "auth/credential-already-in-use": ' + JSON.stringify(lang === 'de' ? 'Dieser Zugang haengt schon an einem anderen Konto.' : 'That sign-in already belongs to another account.') + ',',
    '    "auth/popup-closed-by-user": ' + JSON.stringify(lang === 'de' ? 'Das Fenster wurde geschlossen, bevor es fertig war.' : 'The window closed before it finished.') + ',',
    '    "auth/network-request-failed": ' + JSON.stringify(lang === 'de' ? 'Keine Verbindung.' : 'No connection.') + '',
    '  };',
    '  function lesbar(e) {',
    '    var c = e && e.code;',
    '    if (c && TEXTE[c]) return TEXTE[c];',
    '    /* Unbekanntes wird NICHT verschluckt. Eine Aenderung, die stumm nicht',
    '       passiert, ist schlimmer als ein haesslicher Code. */',
    '    return (e && (e.message || c)) || "?";',
    '  }',
    '',
    '  var K = null;    // { fb, auth }',
    '  var U = null;    // der angemeldete Mensch',
    '',
    '  /*',
    '   * FRISCH BESTAETIGEN',
    '   *',
    '   * Firebase verlangt fuer Passwort, Adresse und Loeschen eine Anmeldung,',
    '   * die nicht zu lange her ist. Das ist keine Schikane: es ist der',
    '   * Unterschied zwischen einem gestohlenen Browserfenster und einem',
    '   * gestohlenen Konto.',
    '   *',
    '   * Statt die Aktion abzubrechen und den Fehler anzuzeigen, wird hier',
    '   * bestaetigt und die Aktion DANACH WIEDERHOLT. Wer sein Passwort',
    '   * geaendert haben will, soll es nicht zweimal eintippen muessen.',
    '   */',
    '  var dlg = document.getElementById("koReauth");',
    '  function frischBestaetigen() {',
    '    return new Promise(function (fertig, daneben) {',
    '      var mitPasswort = U.providerData.some(function (p) { return p.providerId === "password"; });',
    '      document.getElementById("koReauthPw").hidden = !mitPasswort;',
    '      document.getElementById("koReauthFremd").hidden = mitPasswort;',
    '      document.getElementById("koReauthUser").value = U.email || "";',
    '      document.getElementById("koReauthFeld").value = "";',
    '      var rm = document.getElementById("koReauthMeld");',
    '      rm.hidden = true;',
    '',
    '      var erster = U.providerData[0] && U.providerData[0].providerId;',
    '      var popupKnopf = document.getElementById("koReauthPopup");',
    '      popupKnopf.textContent = S.reauthPopup + " " + (erster === "google.com" ? "Google" : "GitHub");',
    '',
    '      function schliessen(ok, fehler) {',
    '        dlg.close();',
    '        if (ok) fertig(); else daneben(fehler || { code: "abgebrochen" });',
    '      }',
    '      function fehlerZeigen(e) { rm.hidden = false; rm.textContent = lesbar(e); }',
    '',
    '      function mitPw() {',
    '        var pw = document.getElementById("koReauthFeld").value;',
    '        if (!pw) return;',
    '        var cred = K.fb.EmailAuthProvider.credential(U.email, pw);',
    '        K.fb.reauthenticateWithCredential(U, cred).then(',
    '          function () { schliessen(true); }, fehlerZeigen);',
    '      }',
    '      function mitFremd() {',
    '        var p = erster === "google.com" ? new K.fb.GoogleAuthProvider() : new K.fb.GithubAuthProvider();',
    '        K.fb.reauthenticateWithPopup(U, p).then(function () { schliessen(true); }, fehlerZeigen);',
    '      }',
    '',
    '      /* Die Horcher werden bei jedem Oeffnen neu gesetzt, deshalb vorher',
    '         die Knoepfe austauschen: sonst haengen nach dem dritten Mal drei',
    '         Horcher daran und der Vorgang laeuft dreifach. */',
    '      function frisch(id, fn) {',
    '        var alt = document.getElementById(id);',
    '        var neu = alt.cloneNode(true);',
    '        alt.parentNode.replaceChild(neu, alt);',
    '        neu.addEventListener("click", fn);',
    '        return neu;',
    '      }',
    '      frisch("koReauthGo", mitPw);',
    '      frisch("koReauthPopup", mitFremd);',
    '      frisch("koReauthAb", function () { schliessen(false); });',
    '      dlg.showModal();',
    '      if (mitPasswort) document.getElementById("koReauthFeld").focus();',
    '    });',
    '  }',
    '',
    '  /* Einmal ausfuehren; verlangt Firebase eine frische Anmeldung, wird',
    '     bestaetigt und dasselbe nochmal versucht. Nur EINMAL nachgefasst — beim',
    '     zweiten Mal liegt es nicht mehr am Alter der Anmeldung. */',
    '  function mitFrische(tuwas) {',
    '    return tuwas().catch(function (e) {',
    '      if (!e || e.code !== "auth/requires-recent-login") throw e;',
    '      return frischBestaetigen().then(tuwas);',
    '    });',
    '  }',
    '',
    '  // ── Anzeige ────────────────────────────────────────────────────────────',
    '  var WEGE = [',
    '    { id: "google.com", name: "Google" },',
    '    { id: "github.com", name: "GitHub" }',
    '  ];',
    '',
    '  function zeichnen() {',
    '    document.getElementById("koAngemeldet").hidden = !U;',
    '    document.getElementById("koAbgemeldet").hidden = !!U;',
    '    if (!U) {',
    '      /* Das Ziel mitgeben, damit man nach dem Anmelden wieder hier landet',
    '         und nicht auf der Startseite. */',
    '      var z = document.getElementById("koZurAnmeldung");',
    '      if (z && z.href.indexOf("weiter=") === -1) {',
    '        z.href = z.href + "?weiter=" + encodeURIComponent(location.pathname);',
    '      }',
    '      return;',
    '    }',
    '',
    '    document.getElementById("koName").value = U.displayName || "";',
    '    document.getElementById("koMailIst").textContent = U.email || "";',
    '    var marke = document.getElementById("koMailMarke");',
    '    marke.textContent = U.emailVerified ? S.verified : S.unverified;',
    '    marke.className = "ko-marke " + (U.emailVerified ? "ja" : "nein");',
    '    document.getElementById("koMailUnbestaetigt").hidden = !!U.emailVerified;',
    '',
    '    var hatPw = U.providerData.some(function (p) { return p.providerId === "password"; });',
    '    document.getElementById("koPwNone").hidden = hatPw;',
    '    document.getElementById("koPwForm").hidden = !hatPw;',
    '    document.getElementById("koPwUser").value = U.email || "";',
    '',
    '    // Verknuepfte Wege',
    '    var haus = document.getElementById("koWege");',
    '    var drin = U.providerData.map(function (p) { return p.providerId; });',
    '    var zeilen = "";',
    '    if (hatPw) {',
    '      zeilen += "<div class=\\"ko-weg\\"><span class=\\"ko-weg-name\\">" + S.pwLogin +',
    '        "<span class=\\"ko-weg-adr\\">" + (U.email || "") + "</span></span></div>";',
    '    }',
    '    WEGE.forEach(function (w) {',
    '      var da = drin.indexOf(w.id) !== -1;',
    '      var konto = da ? (U.providerData.filter(function (p) { return p.providerId === w.id; })[0] || {}) : null;',
    '      zeilen += "<div class=\\"ko-weg\\"><span class=\\"ko-weg-name\\">" + w.name +',
    '        (konto && konto.email ? "<span class=\\"ko-weg-adr\\">" + konto.email + "</span>" : "") +',
    '        "</span><button type=\\"button\\" class=\\"btn\\" data-weg=\\"" + w.id + "\\" data-an=\\"" + da + "\\">" +',
    '        (da ? S.disconnect : S.connect) + "</button></div>";',
    '    });',
    '    haus.innerHTML = zeilen;',
    '',
    '    [].forEach.call(haus.querySelectorAll("[data-weg]"), function (kn) {',
    '      kn.addEventListener("click", function () {',
    '        var id = kn.dataset.weg, an = kn.dataset.an === "true";',
    '        /*',
    '         * Den letzten Weg NICHT trennen lassen. Firebase erlaubt es und',
    '         * hinterlaesst ein Konto, in das niemand mehr hineinkommt — auch',
    '         * der Besitzer nicht. Ein Fehler, den man nicht zuruecknehmen kann,',
    '         * gehoert vorher abgefangen und nicht hinterher erklaert.',
    '         */',
    '        if (an && U.providerData.length < 2) { sag(S.lastOne); return; }',
    '        kn.disabled = true;',
    '        var lauf = an',
    '          ? K.fb.unlink(U, id)',
    '          : K.fb.linkWithPopup(U, id === "google.com" ? new K.fb.GoogleAuthProvider() : new K.fb.GithubAuthProvider());',
    '        lauf.then(function () {',
    '          return U.reload().then(function () { U = K.auth.currentUser; zeichnen(); sag(an ? S.unlinkedOk : S.linkedOk, true); });',
    '        }, function (e) { kn.disabled = false; sag(lesbar(e)); });',
    '      });',
    '    });',
    '  }',
    '',
    '  // ── Formulare ──────────────────────────────────────────────────────────',
    '  function beim(id, fn) {',
    '    var f = document.getElementById(id);',
    '    if (f) f.addEventListener("submit", function (e) { e.preventDefault(); fn(e); });',
    '  }',
    '',
    '  beim("koNameForm", function () {',
    '    var n = document.getElementById("koName").value.trim();',
    '    if (!n) return;',
    '    K.fb.updateProfile(U, { displayName: n })',
    '      .then(function () { sag(S.savedOk, true); }, function (e) { sag(lesbar(e)); });',
    '  });',
    '',
    '  beim("koMailForm", function () {',
    '    var neu = document.getElementById("koMailNeu").value.trim();',
    '    if (!neu) return;',
    '    /*',
    '     * verifyBeforeUpdateEmail und nicht updateEmail.',
    '     *',
    '     * updateEmail setzt die Adresse SOFORT um und schickt die Bestaetigung',
    '     * hinterher. Wer sich vertippt, hat dann ein Konto an einer Adresse, die',
    '     * ihm nicht gehoert, und kein Passwort-Zuruecksetzen fuehrt mehr zu ihm.',
    '     * Hier wird zuerst bestaetigt und dann umgestellt — bis dahin bleibt die',
    '     * alte Adresse gueltig.',
    '     */',
    '    mitFrische(function () { return K.fb.verifyBeforeUpdateEmail(U, neu); })',
    '      .then(function () {',
    '        document.getElementById("koMailNeu").value = "";',
    '        sag(' + JSON.stringify(t.mailPending) + ', true);',
    '      }, function (e) { if (e && e.code !== "abgebrochen") sag(lesbar(e)); });',
    '  });',
    '',
    '  beim("koPwForm", function () {',
    '    var a = document.getElementById("koPwNeu").value;',
    '    var b = document.getElementById("koPwNeu2").value;',
    '    if (a.length < 8) { sag(S.pwShort); return; }',
    '    if (a !== b) { sag(S.pwMismatch); return; }',
    '    mitFrische(function () { return K.fb.updatePassword(U, a); })',
    '      .then(function () {',
    '        document.getElementById("koPwNeu").value = "";',
    '        document.getElementById("koPwNeu2").value = "";',
    '        sag(S.pwOk, true);',
    '      }, function (e) { if (e && e.code !== "abgebrochen") sag(lesbar(e)); });',
    '  });',
    '',
    '  beim("koDelForm", function () {',
    '    var wort = document.getElementById("koDelWort").value.trim();',
    '    /* Das Wort abtippen und keine Ja-Nein-Frage. Ein Bestaetigungsfeld',
    '       klickt man weg, ein Wort muss man lesen. */',
    '    if (wort !== S.delWord) { sag(S.delWrong); return; }',
    '    mitFrische(function () { return K.fb.deleteUser(U); })',
    '      .then(function () { sag(S.delOk, true); setTimeout(function () { location.href = "/"; }, 1200); },',
    '            function (e) { if (e && e.code !== "abgebrochen") sag(lesbar(e)); });',
    '  });',
    '',
    '  var resend = document.getElementById("koResend");',
    '  if (resend) resend.addEventListener("click", function () {',
    '    K.fb.sendEmailVerification(U).then(function () { sag(S.resentOk, true); },',
    '                                       function (e) { sag(lesbar(e)); });',
    '  });',
    '',
    '  var ab = document.getElementById("koAbmelden");',
    '  if (ab) ab.addEventListener("click", function () { K.fb.signOut(K.auth); });',
    '',
    '  /*',
    '   * Der Wegweiser links markiert den Abschnitt, der gerade zu sehen ist.',
    '   * IntersectionObserver und kein scroll-Horcher: der laeuft nur, wenn sich',
    '   * wirklich etwas kreuzt, statt bei jedem einzelnen Rad-Schritt.',
    '   */',
    '  var punkte = [].slice.call(document.querySelectorAll("#koNav a"));',
    '  var ziele = punkte.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);',
    '  if (ziele.length && window.IntersectionObserver) {',
    '    var beobachter = new IntersectionObserver(function (eintraege) {',
    '      eintraege.forEach(function (e) {',
    '        if (!e.isIntersecting) return;',
    '        punkte.forEach(function (a) {',
    '          a.setAttribute("aria-current", String(a.getAttribute("href").slice(1) === e.target.id));',
    '        });',
    '      });',
    '    }, { rootMargin: "-30% 0px -60% 0px" });',
    '    ziele.forEach(function (z) { beobachter.observe(z); });',
    '  }',
    '',
    '  A.ensure().then(function (k) {',
    '    K = k;',
    '    k.fb.onAuthStateChanged(k.auth, function (u) { U = u; zeichnen(); });',
    '  });',
    '})();',
  ].join('\n');
}
