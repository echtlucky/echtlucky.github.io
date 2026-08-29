/**
 * GeoBingo — eine eigenstaendige Spielseite.
 *
 * Das hier ist die einzige `blank`-Seite dieser Website: kein Kopf, kein Fuss,
 * keine Szene, keine Designsprache aus theme.mjs. Der Grund steht bei
 * renderBlank() in layout.mjs und ist kein Geschmacksurteil — die Seite haelt
 * eine laufende Uhr und ein WebGL-Panorama, und alles, was der Browser sonst
 * noch jedes Bild lang mitschleppen muesste, ist Arbeit fuer nichts.
 *
 * Sie traegt deshalb ihr komplettes Aussehen selbst. Was nicht in SPIEL_CSS
 * steht, gibt es dort nicht.
 *
 *
 * WAS DIESE SEITE ANDERS MACHT ALS DER REST DER WEBSITE
 *
 *   * **Sie steht nirgends.** Nicht in der Navigation, nicht im Fuss, nicht in
 *     der Suche, nicht in der sitemap.xml, und `noindex` steht im Kopf. Davor
 *     liegt ein Zugangscode. Der haelt sie unauffaellig, nicht verschlossen:
 *     die Seite ist eine statische Datei, der Code steht darin, und wer ihn
 *     dort sucht, findet ihn. Der Hinweistext auf dem Tor sagt genau das.
 *   * **Sie laedt von Google.** Firebase, sobald eine Lobby aufgemacht wird;
 *     Google Maps, sobald eine Runde beginnt. Die Datenschutzerklaerung fuehrt
 *     das in Abschnitt 6 aus, und der Satz „alle uebrigen Seiten laden nichts
 *     von fremden Servern" in Abschnitt 5.1 wurde dafuer geaendert statt
 *     stehen gelassen.
 *   * **Sie kostet Geld.** Jedes angezeigte Panorama ist eine Rechnungszeile.
 *     Deshalb ist die Bewegungsart eine Einstellung, deshalb steht der Deckel
 *     in docs/SETUP-MAPS.md, und deshalb ist `mapsApiKey` leer, bis das
 *     jemand bewusst aendert.
 */

import { SITE } from '../layout.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'geobingo';

/** Ohne Rahmen. Siehe renderBlank() in build/layout.mjs. */
export const blank = true;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const GB = JSON.parse(readFileSync(join(ROOT, 'content', 'geobingo.json'), 'utf8'));
const FB = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));
const SPIEL_JS = readFileSync(join(ROOT, 'build', 'geobingo-spiel.js'), 'utf8');

/*
 * `GEOBINGO_MAPS_KEY` ist NICHT der Weg, den Schluessel zu setzen — der steht
 * in content/geobingo.json und gehoert ins Repository. Die Umgebungsvariable
 * gibt es fuer genau einen Fall: test/trocken/bauen.mjs baut die Seite mit
 * einem Platzhalter, damit man das Spiel durchspielen kann, BEVOR es einen
 * echten Schluessel gibt. Ohne sie waere der Trockenlauf ausgerechnet in dem
 * Fall leer, fuer den er gedacht ist.
 */
const KARTE = process.env.GEOBINGO_MAPS_KEY || GB.mapsApiKey;

/**
 * Zwei Zugaenge, und die Seite braucht beide. Ohne Firebase gibt es keine
 * Lobby, ohne Kartenschluessel kein Bild. Fehlt einer, sagt die Seite welcher —
 * statt einen Knopf anzubieten, der in eine Fehlermeldung fuehrt.
 */
const HAT_KARTE = Boolean(KARTE);
const HAT_DATENBANK = Boolean(FB.apiKey && FB.projectId);
const BEREIT = HAT_KARTE && HAT_DATENBANK;

export const meta = {
  en: {
    title: 'GeoBingo',
    description: 'A private Street View bingo round. Access by code.',
  },
  de: {
    title: 'GeoBingo',
    description: 'Eine private Street-View-Runde. Zutritt mit Code.',
  },
};

// ---------------------------------------------------------------------------
// Texte
// ---------------------------------------------------------------------------

/** Exportiert, damit build/validate.mjs prüfen kann, dass der Spielclient
    keinen Schlüssel liest, den es hier nicht gibt — und dass beide Sprachen
    dieselben haben. Siehe dort. */
export const TEXTE = {
  en: {
    laden: 'Loading…',

    torH: 'Access code',
    torP: 'This page is not linked anywhere. If somebody gave you the code, this is where it goes.',
    torPlatz: 'Code',
    torAuf: 'Enter',
    torFalsch: 'That is not the code.',
    torHinweis: 'The code keeps this page quiet, not locked. It is a static file, so anybody determined enough will find the code inside it — that is what it is for and all it claims to do.',

    nameH: 'What should the others call you?',
    nameP: 'No account, no email, no password. The name lives in the lobby and nowhere else.',
    namePlatz: 'Your name',
    weiter: 'Continue',
    nameZuKurz: 'At least two characters.',

    heimZeile: 'Street View, a word list, and a clock. Spot the thing, click the word.',
    jetztSpielen: 'Play now',
    lobbysDurchsuchen: 'Browse lobbies',
    mitCodeBeitreten: 'Join with code',
    discord: 'Join our Discord',
    keineLobbys: 'No public lobbies right now. Open one — you can make it public in the settings.',
    oeffentlich: 'Public lobby',
    oeffentlichHinweis: 'Shows up under "Browse lobbies" for everyone with access to this page. Off means the code is the only way in.',
    code: 'Lobby code',
    beitreten: 'Join',
    codeFalsch: 'A lobby code is five characters.',
    lobbyWeg: 'No lobby with that code.',
    lobbyLaeuft: 'That round is already running.',

    verlassen: 'Leave',
    einladelink: 'Invite link',
    linkKopieren: 'Copy',
    kopiert: 'Invite link copied.',
    kopierenGeht: 'The clipboard is not available here. The link is now visible — careful if you are streaming.',
    aufdecken: 'Reveal',
    aufdeckenHinweis: 'Covered so it cannot end up on stream. Click reveals it; it covers itself again after 15 seconds. Copying works without revealing.',

    lobbyH: 'Lobby',
    rundeBeenden: 'End round',
    wirklichBeenden: 'Really end it?',
    woerterH: 'Words',
    woerterP: 'Your own words are the point. The packs below only fill the list quickly.',
    einstellungenP: 'Everything here is the host’s call, and everybody sees the change at once.',
    spielerP: 'Anybody with the invite link lands here.',
    wortPlatz: 'A dog, a red bus, somebody on a ladder…',
    punkte: 'Points',
    hinzu: 'Add',
    paketeH: 'Packs',
    alleWeg: 'Clear all',
    entfernen: 'Remove',
    keineWoerter: 'No words yet.',
    zuVieleWoerter: 'Forty words is the ceiling.',

    einstellungenH: 'Settings',
    dauer: 'Round length',
    min: 'min',
    bewegung: 'Movement',
    bewFrei: 'Free',
    bewPfeile: 'Arrows',
    bewAus: 'Frozen',
    bewegungHinweis: 'Frozen is the hardest — and the cheapest. Google bills dynamic Street View per panorama, walking included.',
    panoramen: 'panoramas for this round',
    vonTageskontingent: 'of %n a day',
    ueberKontingent: 'Over the daily cap — the round will stop partway.',
    modus: 'Mode',
    modEinzeln: 'Everyone for themselves',
    modTeams: 'Teams',
    nurStaedte: 'City centres only',
    nurStaedteHinweis: 'More to find. Switch off for everything from a motorway to a field track.',
    punkteZeigen: 'Show scores live',
    punkteZeigenHinweis: 'Off means nobody sees how the others are doing until the end.',
    regionenH: 'Regions',
    alleAn: 'All',
    alleAus: 'None',

    spielerH: 'Players',
    niemandDa: 'Nobody here yet.',
    gastgeber: 'host',
    teamWechseln: 'Switch',
    team: 'Team',
    losGehts: 'Start the round',
    brauchtWort: 'At least one word.',
    brauchtRegion: 'At least one region.',
    wartetAufGastgeber: 'Waiting for the host.',

    deineKarte: 'Your card',
    einklappen: 'Collapse',
    hudAus: 'Hide the overlay (H)',
    suchtOrt: 'Finding a place with panoramas…',
    zeitUm: 'Time is up.',
    punkteVersteckt: 'Scores are hidden until the end.',
    kartenFehlerH: 'Street View did not load',
    kartenFehlerP: 'The key is missing, restricted to a different address, or one of the two APIs is off: Maps JavaScript API and Street View Static API.',
    keinOrt: 'Forty tries in those regions and no panorama. Pick another region, or switch off "city centres only".',
    keineRegion: 'No region selected.',

    pruefungH: 'Everybody’s finds',
    pruefungP: 'Click a picture to stand in it in 3D. A find only fails if every other player thumbs it down — doing nothing lets it count.',
    auswerten: 'Show the result',
    nichtsGefunden: 'Nobody found anything. It happens.',
    daumenHoch: 'Counts',
    daumenRunter: 'Does not count',
    in3d: 'Open in 3D Street View',
    in3dKurz: '3D',
    schliessen: 'Close',

    ergebnisH: 'Result',
    funde: 'finds',
    nochmal: 'Another round',
    bilderAnsehen: 'Back to the pictures',

    errAnonymAus: 'Guest sign-in is switched off in the Firebase console (Authentication → Sign-in method → Anonymous).',
    errRegeln: 'The database refused that. The GeoBingo rules are probably not deployed yet — see docs/SETUP-MAPS.md, step 2.',
    errNetz: 'No connection to the database.',
    errAllgemein: 'That did not work.',

    setupH: 'Not switched on yet',
    setupKarte: 'There is no Google Maps key in content/geobingo.json, so there is no Street View to show.',
    setupDb: 'Firebase is not configured, so there is no lobby to join.',
    setupCta: 'The set-up, written out',
    ohneJs: 'This game needs JavaScript. There is no version of it that does not.',
  },

  de: {
    laden: 'Wird geladen…',

    torH: 'Zugangscode',
    torP: 'Diese Seite ist nirgends verlinkt. Wenn dir jemand den Code gegeben hat, gehört er hier hinein.',
    torPlatz: 'Code',
    torAuf: 'Rein',
    torFalsch: 'Das ist nicht der Code.',
    torHinweis: 'Der Code hält die Seite unauffällig, nicht verschlossen. Sie ist eine statische Datei, der Code steht darin, und wer entschlossen genug sucht, findet ihn — dafür ist er da, und mehr behauptet er nicht.',

    nameH: 'Wie sollen dich die anderen nennen?',
    nameP: 'Kein Konto, keine E-Mail, kein Passwort. Der Name steht in der Lobby und sonst nirgends.',
    namePlatz: 'Dein Name',
    weiter: 'Weiter',
    nameZuKurz: 'Mindestens zwei Zeichen.',

    heimZeile: 'Street View, eine Wortliste und eine Uhr. Ding sehen, Wort klicken.',
    jetztSpielen: 'Jetzt spielen',
    lobbysDurchsuchen: 'Lobbys durchsuchen',
    mitCodeBeitreten: 'Mit Code beitreten',
    discord: 'Discord beitreten',
    keineLobbys: 'Gerade keine öffentlichen Lobbys. Mach eine auf — öffentlich stellen geht in den Einstellungen.',
    oeffentlich: 'Öffentliche Lobby',
    oeffentlichHinweis: 'Taucht unter „Lobbys durchsuchen" auf, für jeden mit Zugang zu dieser Seite. Aus heißt: nur über den Code.',
    code: 'Lobby-Code',
    beitreten: 'Beitreten',
    codeFalsch: 'Ein Lobby-Code sind fünf Zeichen.',
    lobbyWeg: 'Zu diesem Code gibt es keine Lobby.',
    lobbyLaeuft: 'Diese Runde läuft schon.',

    verlassen: 'Verlassen',
    einladelink: 'Einladelink',
    linkKopieren: 'Kopieren',
    kopiert: 'Einladelink kopiert.',
    kopierenGeht: 'Die Zwischenablage geht hier nicht. Der Link ist jetzt sichtbar — Vorsicht, wenn du streamst.',
    aufdecken: 'Aufdecken',
    aufdeckenHinweis: 'Verdeckt, damit er nicht im Stream landet. Klick deckt ihn auf, nach 15 Sekunden verdeckt er sich wieder. Kopieren geht auch verdeckt.',

    lobbyH: 'Lobby',
    rundeBeenden: 'Runde beenden',
    wirklichBeenden: 'Wirklich beenden?',
    woerterH: 'Wörter',
    woerterP: 'Eigene Wörter sind der Sinn der Sache. Die Pakete füllen die Liste nur schnell auf.',
    einstellungenP: 'Alles hier entscheidet der Gastgeber, und alle sehen die Änderung sofort.',
    spielerP: 'Wer den Einladelink hat, landet hier.',
    wortPlatz: 'Ein Hund, ein roter Bus, jemand auf einer Leiter…',
    punkte: 'Punkte',
    hinzu: 'Dazu',
    paketeH: 'Pakete',
    alleWeg: 'Alle löschen',
    entfernen: 'Entfernen',
    keineWoerter: 'Noch keine Wörter.',
    zuVieleWoerter: 'Bei vierzig Wörtern ist Schluss.',

    einstellungenH: 'Einstellungen',
    dauer: 'Rundenlänge',
    min: 'Min',
    bewegung: 'Bewegung',
    bewFrei: 'Frei',
    bewPfeile: 'Pfeile',
    bewAus: 'Fest',
    bewegungHinweis: 'Fest ist am schwersten — und am billigsten. Google rechnet dynamisches Street View pro Panorama ab, das Laufen eingeschlossen.',
    panoramen: 'Panoramen für diese Runde',
    vonTageskontingent: 'von %n am Tag',
    ueberKontingent: 'Über dem Tageskontingent — die Runde bricht unterwegs ab.',
    modus: 'Modus',
    modEinzeln: 'Jeder für sich',
    modTeams: 'Teams',
    nurStaedte: 'Nur Innenstädte',
    nurStaedteHinweis: 'Mehr zu finden. Aus heißt: von der Autobahn bis zum Feldweg alles.',
    punkteZeigen: 'Punkte live zeigen',
    punkteZeigenHinweis: 'Aus heißt, niemand sieht bis zum Schluss, wie die anderen stehen.',
    regionenH: 'Regionen',
    alleAn: 'Alle',
    alleAus: 'Keine',

    spielerH: 'Spieler',
    niemandDa: 'Noch niemand da.',
    gastgeber: 'Gastgeber',
    teamWechseln: 'Wechseln',
    team: 'Team',
    losGehts: 'Runde starten',
    brauchtWort: 'Mindestens ein Wort.',
    brauchtRegion: 'Mindestens eine Region.',
    wartetAufGastgeber: 'Wartet auf den Gastgeber.',

    deineKarte: 'Deine Karte',
    einklappen: 'Einklappen',
    hudAus: 'Anzeige ausblenden (H)',
    suchtOrt: 'Sucht einen Ort mit Panoramen…',
    zeitUm: 'Zeit ist um.',
    punkteVersteckt: 'Punkte bleiben bis zum Schluss verdeckt.',
    kartenFehlerH: 'Street View hat nicht geladen',
    kartenFehlerP: 'Der Schlüssel fehlt, ist auf eine andere Adresse eingeschränkt, oder eine der beiden APIs ist aus: Maps JavaScript API und Street View Static API.',
    keinOrt: 'Vierzig Versuche in diesen Regionen und kein Panorama. Nimm eine andere Region, oder schalte „nur Innenstädte" aus.',
    keineRegion: 'Keine Region gewählt.',

    pruefungH: 'Alle Funde',
    pruefungP: 'Klick auf ein Bild, um in 3D darin zu stehen. Ein Fund fällt nur durch, wenn ihn alle anderen mit Daumen runter ablehnen — wer nichts tut, lässt ihn gelten.',
    auswerten: 'Ergebnis zeigen',
    nichtsGefunden: 'Niemand hat etwas gefunden. Kommt vor.',
    daumenHoch: 'Zählt',
    daumenRunter: 'Zählt nicht',
    in3d: 'In 3D-Street-View öffnen',
    in3dKurz: '3D',
    schliessen: 'Schließen',

    ergebnisH: 'Ergebnis',
    funde: 'Funde',
    nochmal: 'Noch eine Runde',
    bilderAnsehen: 'Zurück zu den Bildern',

    errAnonymAus: 'Der Gastzugang ist in der Firebase-Konsole aus (Authentication → Sign-in method → Anonymous).',
    errRegeln: 'Die Datenbank hat das abgelehnt. Vermutlich sind die GeoBingo-Regeln noch nicht ausgerollt — siehe docs/SETUP-MAPS.md, Schritt 2.',
    errNetz: 'Keine Verbindung zur Datenbank.',
    errAllgemein: 'Das hat nicht geklappt.',

    setupH: 'Noch nicht eingeschaltet',
    setupKarte: 'In content/geobingo.json steht kein Google-Maps-Schlüssel, also gibt es kein Street View zu zeigen.',
    setupDb: 'Firebase ist nicht eingerichtet, also gibt es keine Lobby.',
    setupCta: 'Die Einrichtung, ausgeschrieben',
    ohneJs: 'Dieses Spiel braucht JavaScript. Eine Fassung ohne gibt es nicht.',
  },
};

// ---------------------------------------------------------------------------
// Das Blatt — vollstaendig, weil die Seite nichts erbt
// ---------------------------------------------------------------------------

const SPIEL_CSS = `<style>
/*
 * Die Handschrift ist an GeoHunt angelehnt — dunkles Marineblau mit einem
 * Radialverlauf von oben, Violett als einzige Signalfarbe, Kanit als Schrift,
 * 8px Radien, Flaechen aus Weiss mit sehr wenig Deckkraft. Abgemessen an der
 * Seite selbst, nicht geraten: #7F22FE fuer den Hauptknopf, #F1F5F9 fuer
 * Ueberschriften, #CAD5E2 fuer Beisatz, der Grund #282943 nach #1A1A2E.
 *
 * Kanit liegt unter /schrift/ und kommt NICHT von Google Fonts. Diese Seite
 * spricht ohnehin schon mit Google, aber jeder Dienst mehr ist eine Zeile mehr
 * in der Datenschutzerklaerung — und eine Schrift ist es nicht wert.
 *
 * Zwei Regeln haben das Blatt geformt, beide aus der Beschwerde, die Seite
 * haenge:
 *
 *   1. \`backdrop-filter\` nur auf wenigen FESTSTEHENDEN Flaechen. Der
 *      Glaseffekt ist gewollt, aber er kostet den Browser bei jedem Bild eine
 *      Unschaerfe ueber allem darunter. Auf drei Leisten ueber einem Panorama
 *      ist das zu verkraften; auf jeder Kachel einer scrollenden Liste ist es
 *      genau das Ruckeln, das gemeldet wurde.
 *   2. Keine Dauer-Animation und kein \`will-change\` auf Vorrat. Was sich
 *      bewegt, bewegt sich auf einen Klick hin und ist nach 180 ms fertig.
 */

@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 400; font-display: swap;
  src: url('/schrift/kanit-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 400; font-display: swap;
  src: url('/schrift/kanit-400-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 600; font-display: swap;
  src: url('/schrift/kanit-600-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 600; font-display: swap;
  src: url('/schrift/kanit-600-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 700; font-display: swap;
  src: url('/schrift/kanit-700-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Kanit'; font-style: normal; font-weight: 700; font-display: swap;
  src: url('/schrift/kanit-700-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; min-height: 100%; }

:root {
  --oben: #282943;
  --unten: #1a1a2e;
  --tiefer: #14142a;
  --flaeche: rgba(255,255,255,0.03);
  --flaeche-2: rgba(255,255,255,0.06);
  --kante: rgba(255,255,255,0.10);
  --kante-stark: rgba(255,255,255,0.20);
  --schrift: #f1f5f9;
  --still: #cad5e2;
  --leise: #8b96ad;
  --violett: #7f22fe;
  --violett-hell: #a884ff;
  --violett-rand: rgba(168,132,255,0.40);
  --gruen: #22c55e;
  --warn: #f87171;
  --team-a: #38bdf8;
  --team-b: #fb923c;
  --r: 8px;
  --r-gross: 14px;
  --sans: 'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  /* Wie viele Zeilen ein HUD-Kasten hoch ist, bevor gescrollt wird. */
  --zeilen: 8;
}

body {
  background: radial-gradient(at 50% 0%, var(--oben), var(--unten)) fixed;
  color: var(--schrift);
  font: 400 16px/1.55 var(--sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1 { font: 700 clamp(1.7rem, 1.3rem + 1.8vw, 2.6rem)/1.1 var(--sans); margin: 0 0 .5rem; }
h2 { font: 600 1.4rem/1.25 var(--sans); margin: 0 0 .5rem; display: flex; align-items: center; gap: 10px; }
h3 { font: 600 1.05rem/1.3 var(--sans); margin: 0 0 .5rem; }
p { margin: 0 0 .85rem; }
button, input { font: inherit; color: inherit; }
button { cursor: pointer; }
button:disabled { cursor: default; opacity: .38; }
:focus-visible { outline: 2px solid var(--violett-hell); outline-offset: 2px; }

/* ── Bausteine ───────────────────────────────────────────────────────────── */
.gb-mitte { min-height: 100dvh; display: grid; place-items: center; padding: 26px 20px; }
.gb-tafel {
  background: var(--flaeche);
  border: 1px solid var(--kante);
  border-radius: var(--r-gross);
  padding: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  contain: layout paint style;
}
.gb-schmal { width: min(100%, 470px); }
.gb-still { color: var(--still); font-size: .95rem; }
.gb-fussnote { color: var(--leise); font-size: .82rem; margin: .5rem 0 0; }
.gb-luft { margin-top: 16px; }
.gb-etikett {
  display: inline-flex; align-items: center; gap: 8px;
  font: 600 .7rem/1 var(--sans); letter-spacing: .12em; text-transform: uppercase; color: var(--leise);
}
.gb-zahl {
  font: 600 .7rem/1 var(--mono); padding: 4px 7px; border-radius: 999px;
  background: var(--flaeche-2); border: 1px solid var(--kante); color: var(--still);
}
.gb-reihe { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.gb-warten { display: flex; align-items: center; gap: 11px; color: var(--still); }
.gb-kreisel {
  width: 16px; height: 16px; border-radius: 50%; flex: none;
  border: 2px solid var(--kante-stark); border-top-color: var(--violett-hell);
  animation: gb-dreh .7s linear infinite;
}
@keyframes gb-dreh { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .gb-kreisel { animation-duration: 2.4s; } }

.gb-marke { display: inline-flex; align-items: center; gap: 10px; font: 700 1.15rem/1 var(--sans); letter-spacing: .01em; }
.gb-auge {
  width: 17px; height: 17px; border-radius: 50%; flex: none;
  border: 2.5px solid var(--violett-hell);
  box-shadow: inset 0 0 0 3px var(--unten), inset 0 0 0 6px var(--violett-hell);
}

input {
  width: 100%; padding: 12px 14px;
  background: rgba(0,0,0,.25); border: 1px solid var(--kante); border-radius: var(--r);
  color: var(--schrift);
}
input:hover { border-color: var(--kante-stark); }
input::placeholder { color: #6a748c; }
.gb-codefeld { font: 600 1.15rem/1 var(--mono); letter-spacing: .32em; text-transform: uppercase; text-align: center; }

/* ── Knöpfe ──────────────────────────────────────────────────────────────── */
.gb-knopf {
  padding: 11px 18px; border-radius: var(--r);
  background: var(--flaeche); border: 1px solid var(--kante); color: var(--still);
  font: 400 .95rem/1.2 var(--sans); white-space: nowrap;
  transition: background .13s ease, border-color .13s ease, color .13s ease, transform .07s ease;
}
.gb-knopf:hover:not(:disabled) { background: var(--flaeche-2); border-color: var(--kante-stark); color: var(--schrift); }
.gb-knopf:active:not(:disabled) { transform: translateY(1px); }
/* Der scharf gestellte Beenden-Knopf: vier Sekunden lang rot, dann von selbst
   wieder normal — wer daneben greift, muss nichts wegklicken. */
.gb-knopf[data-scharf="1"] { background: var(--warn); border-color: var(--warn); color: #2b0b0b; font-weight: 600; }
.gb-haupt {
  background: var(--violett); border-color: var(--violett-rand); color: #fff;
  font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
}
.gb-haupt:hover:not(:disabled) { background: #8f3cff; border-color: var(--violett-hell); color: #fff; }
.gb-breit { width: 100%; padding: 15px 18px; font-size: 1.02rem; }
.gb-klein { padding: 7px 12px; font-size: .82rem; }
.gb-winzig { padding: 4px 9px; font-size: .74rem; }
.gb-gefahr { color: var(--warn); border-color: rgba(248,113,113,.35); }
.gb-still-knopf { background: none; border: 0; color: var(--leise); font-size: .9rem; text-decoration: underline; text-underline-offset: 3px; }
.gb-still-knopf:hover { color: var(--schrift); }
.gb-icon {
  width: 34px; height: 34px; display: grid; place-items: center; flex: none;
  background: var(--flaeche); border: 1px solid var(--kante); border-radius: var(--r);
  color: var(--still); font-size: 1rem; line-height: 1;
}
.gb-icon:hover { color: var(--schrift); border-color: var(--kante-stark); background: var(--flaeche-2); }

/* ── Startseite ──────────────────────────────────────────────────────────── */
/*
 * Alles untereinander und mittig. Der grosse Knopf oben, die schmaleren
 * darunter — die Reihenfolge ist die Aussage: fast jeder will spielen, und nur
 * wer einen Code vorgelesen bekommen hat, will das Feld.
 */
.gb-heim { width: min(100%, 430px); text-align: center; }
.gb-heimkopf { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: clamp(28px, 8vh, 64px); }
.gb-heimtitel { font: 700 clamp(2.6rem, 1.9rem + 3.2vw, 4.2rem)/1 var(--sans); margin: 0 0 .5rem; letter-spacing: -.01em; }
.gb-heimzeile { color: var(--still); font-size: 1.02rem; margin: 0 auto clamp(24px, 4vh, 38px); max-width: 34ch; }
.gb-heimknoepfe { display: grid; gap: 10px; }
.gb-heimknoepfe .gb-knopf { justify-content: center; }
.gb-gross { padding: 17px 20px; font-size: 1.12rem; }
.gb-discord {
  display: flex; align-items: center; justify-content: center; gap: 9px; text-decoration: none;
  color: #c7d2fe; border-color: rgba(88,101,242,.4); background: rgba(88,101,242,.12);
}
.gb-discord:hover { background: rgba(88,101,242,.22); border-color: rgba(88,101,242,.65); color: #e0e7ff; }

/* Codefeld und Lobby-Browser klappen erst auf Klick auf — dauerhaft gezeigt
   fuellen sie den Bildschirm mit dem, was die Minderheit braucht. */
.gb-ausklapp {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows .22s ease, opacity .18s ease, margin-top .22s ease;
  margin-top: 0;
}
.gb-ausklapp > * { overflow: hidden; min-height: 0; }
.gb-ausklapp[data-da="1"] { grid-template-rows: 1fr; opacity: 1; margin-top: 14px; }
.gb-ausklapp .gb-reihe { flex-wrap: nowrap; }
.gb-ausklapp .gb-codefeld { flex: 1; min-width: 0; }

.gb-lobbyliste { list-style: none; margin: 0; padding: 2px; display: grid; gap: 7px; max-height: 44dvh; overflow-y: auto; }
.gb-lobbyliste button {
  display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
  padding: 12px 14px; border: 1px solid var(--kante); border-radius: var(--r);
  background: rgba(0,0,0,.22); color: var(--schrift);
  transition: border-color .12s ease, background .12s ease;
}
.gb-lobbyliste button:hover { border-color: var(--violett-rand); background: rgba(127,34,254,.12); }
.gb-lobbycode { font: 700 1.05rem/1 var(--mono); letter-spacing: .16em; color: var(--violett-hell); }
.gb-lobbyinfo { flex: 1; min-width: 0; font-size: .82rem; color: var(--leise); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gb-lobbypfeil { font-size: 1.3rem; line-height: 1; color: var(--leise); }

.gb-kopfzeile { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }

/* ── Lobby ───────────────────────────────────────────────────────────────── */
.gb-lobbyseite, .gb-blattseite { max-width: 1520px; margin: 0 auto; padding: 22px clamp(14px, 3vw, 30px) 44px; }
.gb-lobbykopf { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.gb-lobbykopf h1 { margin: 0; }
.gb-lobbykopf > *:last-child { margin-left: auto; }
.gb-lobbytitel {
  font: 600 .72rem/1 var(--sans); letter-spacing: .16em; text-transform: uppercase; color: var(--leise);
  padding-left: 16px; border-left: 1px solid var(--kante);
}

/*
 * Das Einladeband — das Erste, was ein Gastgeber braucht, also auch das Erste,
 * was er sieht. In der Kopfzeile gequetscht zwischen Marke und
 * Verlassen-Knopf war es genau das, was man zuerst sucht und am schwersten
 * fand. Volle Breite, eigener Grund, deutlich abgesetzt.
 */
.gb-band {
  background: linear-gradient(180deg, rgba(127,34,254,.14), rgba(127,34,254,.04));
  border: 1px solid var(--violett-rand);
  border-radius: var(--r-gross);
  padding: 18px 20px;
  margin-bottom: 18px;
}
.gb-tafelzeile { color: var(--leise); font-size: .84rem; margin: -.2rem 0 1rem; }
/*
 * Verdeckte Felder.
 *
 * Der Wert steht wirklich im Markup — verdeckt wird mit blur(), und das ist
 * ausdruecklich KEIN Schutz gegen jemanden mit einer Entwicklerkonsole. Es ist
 * Schutz gegen eine Kamera: gegen den einen Moment, in dem der Einladelink im
 * Stream steht und der Chat in der Lobby sitzt. Genau dagegen hilft
 * Unschaerfe, und gegen mehr muss sie hier nicht helfen.
 *
 * user-select: none im verdeckten Zustand gehoert dazu: sonst markiert man den
 * unscharfen Text und liest ihn aus der Auswahl.
 */
.gb-geheim {
  position: relative; display: block; width: 100%; text-align: left;
  padding: 9px 12px; border: 1px solid var(--kante); border-radius: var(--r);
  background: rgba(0,0,0,.28); color: var(--schrift);
  font: 400 .84rem/1.3 var(--mono); overflow: hidden;
  transition: border-color .12s ease, background .12s ease;
}
.gb-geheim:hover { border-color: var(--kante-stark); background: rgba(0,0,0,.4); }
.gb-geheimwert {
  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: filter .18s ease, opacity .18s ease;
}
.gb-geheim[aria-expanded="false"] .gb-geheimwert {
  filter: blur(6px); opacity: .55; user-select: none; -webkit-user-select: none;
}
.gb-geheimhinweis {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font: 600 .68rem/1 var(--sans); letter-spacing: .09em; text-transform: uppercase;
  color: var(--violett-hell); pointer-events: none;
  transition: opacity .18s ease;
}
.gb-geheim[aria-expanded="true"] .gb-geheimhinweis { opacity: 0; }
.gb-geheimhinweis { white-space: nowrap; }
.gb-geheim-gross .gb-geheimwert { font: 700 1.5rem/1.15 var(--mono); letter-spacing: .2em; color: var(--violett-hell); text-align: center; }
.gb-geheim-gross { padding: 8px 14px; min-width: 168px; }
.gb-geheim-gross[aria-expanded="false"] .gb-geheimwert { filter: blur(10px); }
.gb-einladefuss { font-size: .72rem; color: var(--leise); line-height: 1.35; }

.gb-einladung { display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; flex: 1; min-width: 0; }
.gb-einladeteil { display: grid; gap: 6px; min-width: 0; }
.gb-einladeteil > .gb-etikett { justify-self: start; }
.gb-einladebreit { flex: 1; min-width: 240px; }
.gb-einladezeile { display: flex; align-items: stretch; gap: 8px; min-width: 0; }
.gb-einladezeile .gb-geheim { flex: 1; min-width: 0; }
.gb-lobbygitter { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1.15fr) minmax(0,.82fr); gap: 18px; align-items: start; }
/* Die Spielertafel traegt den Startknopf und soll nicht aus dem Bild wandern,
   wenn die Wortliste waechst. */
.gb-startTafel { position: sticky; top: 18px; }

.gb-wortform { display: grid; grid-template-columns: 1fr auto auto; gap: 9px; margin: 14px 0 12px; }
.gb-punktwahl { display: flex; border: 1px solid var(--kante); border-radius: var(--r); overflow: hidden; }
.gb-punktwahl button {
  width: 36px; background: transparent; border: 0; color: var(--leise); font: 600 .9rem/1 var(--mono);
  border-right: 1px solid var(--kante);
}
.gb-punktwahl button:last-child { border-right: 0; }
.gb-punktwahl button[aria-pressed="true"] { background: var(--violett); color: #fff; }
.gb-paketzeile { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; margin-bottom: 14px; }

.gb-wortliste { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; max-height: 340px; overflow-y: auto; }
.gb-wortliste li { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--kante); border-radius: var(--r); font-size: .95rem; }
.gb-leerzeile { justify-content: center; color: var(--leise); border-style: dashed !important; }
.gb-wortname { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.gb-punktmarke {
  flex: none; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px;
  font: 600 .72rem/1 var(--mono); color: #fff;
}
.gb-p1 { background: rgba(255,255,255,.14); }
.gb-p2 { background: var(--violett); }
.gb-p3 { background: #f59e0b; color: #1a1a2e; }
.gb-weg { background: none; border: 0; color: #6a748c; font-size: 1.2rem; line-height: 1; padding: 0 3px; }
.gb-weg:hover { color: var(--warn); }

/* ── Stellwerk ───────────────────────────────────────────────────────────── */
.gb-stellwerk { margin-bottom: 20px; }
.gb-stellwerk > .gb-etikett, .gb-stellwerk > label { margin-bottom: 9px; display: flex; }

.gb-drehregler {
  display: flex; align-items: stretch; border: 1px solid var(--kante);
  border-radius: var(--r); overflow: hidden; background: rgba(0,0,0,.25);
}
.gb-tick {
  width: 44px; background: var(--flaeche); border: 0; color: var(--leise);
  font: 600 .85rem/1 var(--mono); border-right: 1px solid var(--kante);
  transition: background .1s ease, color .1s ease;
}
.gb-tick:last-child { border-right: 0; border-left: 1px solid var(--kante); }
.gb-tick:hover:not(:disabled) { background: var(--flaeche-2); color: var(--schrift); }
.gb-tick:active:not(:disabled) { background: var(--violett); color: #fff; }
.gb-anzeige { flex: 1; display: flex; align-items: baseline; justify-content: center; gap: 6px; padding: 10px 4px; }
.gb-anzeige input {
  width: 3.2ch; padding: 0; text-align: right; background: none; border: 0; border-radius: 0;
  font: 700 1.55rem/1 var(--mono); font-variant-numeric: tabular-nums; color: var(--violett-hell);
  -moz-appearance: textfield;
}
.gb-anzeige input::-webkit-outer-spin-button, .gb-anzeige input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.gb-anzeige span { font: 600 .74rem/1 var(--sans); color: var(--leise); text-transform: uppercase; letter-spacing: .1em; }

.gb-schalterbank { display: flex; border: 1px solid var(--kante); border-radius: var(--r); overflow: hidden; }
.gb-schalterbank button {
  flex: 1; padding: 10px 6px; background: var(--flaeche); border: 0; border-right: 1px solid var(--kante);
  color: var(--leise); font: 400 .88rem/1.2 var(--sans); transition: background .1s ease, color .1s ease;
}
.gb-schalterbank button:last-child { border-right: 0; }
.gb-schalterbank button:hover:not(:disabled) { background: var(--flaeche-2); color: var(--schrift); }
.gb-schalterbank button[aria-pressed="true"] { background: var(--violett); color: #fff; font-weight: 600; }

/*
 * Die Kostenzeile. Sie steht direkt unter der Bewegungswahl, weil sie genau
 * dort etwas aendert — und sie wird rot, bevor Geld fliesst, nicht danach.
 */
.gb-kosten {
  display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
  margin: 10px 0 0; padding: 9px 12px;
  border: 1px solid var(--kante); border-radius: var(--r);
  background: rgba(0,0,0,.22); font-size: .84rem; color: var(--still);
}
.gb-kosten strong { font: 700 1.05rem/1 var(--mono); color: var(--violett-hell); }
.gb-kosten span { color: var(--leise); }
.gb-kosten em { flex-basis: 100%; font-style: normal; font-size: .8rem; color: var(--warn); }
.gb-kosten[data-warnung="1"] { border-color: var(--warn); background: rgba(248,113,113,.1); }
.gb-kosten[data-warnung="1"] strong { color: var(--warn); }

.gb-kippen { display: grid; gap: 12px; margin-bottom: 20px; }
.gb-kipp { display: flex; gap: 12px; align-items: flex-start; }
.gb-kippknopf {
  flex: none; width: 46px; height: 26px; margin-top: 1px; padding: 2px;
  border-radius: 999px; border: 1px solid var(--kante); background: rgba(0,0,0,.3);
  transition: background .15s ease, border-color .15s ease;
}
.gb-kippknopf[aria-pressed="true"] { background: rgba(127,34,254,.35); border-color: var(--violett-rand); }
.gb-schieber {
  display: block; width: 20px; height: 20px; border-radius: 50%; background: #6a748c;
  transition: transform .15s cubic-bezier(.3,1.4,.6,1), background .15s ease;
}
.gb-kippknopf[aria-pressed="true"] .gb-schieber { transform: translateX(20px); background: var(--violett-hell); }
.gb-kipptext strong { display: block; font-size: .95rem; font-weight: 600; }
.gb-kipptext em { display: block; font-style: normal; font-size: .8rem; color: var(--leise); }

.gb-regionen { display: grid; grid-template-columns: repeat(auto-fill, minmax(152px, 1fr)); gap: 6px; }
.gb-region {
  display: flex; align-items: center; gap: 9px; padding: 8px 10px; text-align: left;
  background: transparent; border: 1px solid var(--kante); border-radius: var(--r);
  color: var(--leise); font: 400 .84rem/1.3 var(--sans);
  transition: border-color .1s ease, color .1s ease, background .1s ease;
}
.gb-region:hover:not(:disabled) { border-color: var(--kante-stark); color: var(--schrift); }
.gb-region[aria-pressed="true"] { color: var(--schrift); border-color: var(--violett-rand); background: rgba(127,34,254,.12); }
.gb-lampe { width: 7px; height: 7px; border-radius: 50%; flex: none; background: #3d4457; }
.gb-region[aria-pressed="true"] .gb-lampe, .gb-lampe.gb-an { background: var(--violett-hell); box-shadow: 0 0 8px rgba(168,132,255,.9); }

.gb-spielerliste { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.gb-spielerliste li { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--kante); border-radius: var(--r); font-size: .92rem; }
.gb-spielerliste li[data-ich="1"] { border-color: var(--violett-rand); background: rgba(127,34,254,.10); }
.gb-spielername { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gb-spielername em { font-style: normal; font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; color: var(--leise); margin-left: 8px; }
.gb-punktzahl { font: 700 1.05rem/1 var(--mono); font-variant-numeric: tabular-nums; }
.gb-teammarke { flex: none; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; font: 700 .7rem/1 var(--mono); color: #14142a; }
.gb-teama { background: var(--team-a); } .gb-teamb { background: var(--team-b); }

/* ── Spielbühne ──────────────────────────────────────────────────────────── */
.gb-buehne { position: fixed; inset: 0; overflow: hidden; background: var(--tiefer); }
.gb-pano { position: absolute; inset: 0; }
.gb-panoladen { position: absolute; inset: 0; display: grid; place-items: center; padding: 30px; background: var(--tiefer); }
.gb-panofehler { max-width: 46ch; text-align: center; }
.gb-panofehler strong { color: var(--warn); display: block; margin-bottom: .5rem; font-weight: 600; }
.gb-panofehler p { color: var(--still); font-size: .92rem; }
.gb-blitz { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
.gb-blitz[data-da="1"] { animation: gb-blitzen .34s ease-out; }
@keyframes gb-blitzen { from { opacity: .5; } to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .gb-blitz[data-da="1"] { animation: none; } }

.gb-leiste, .gb-kasten {
  position: absolute; z-index: 3;
  background: rgba(20,20,42,.72);
  border: 1px solid var(--kante);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: opacity .18s ease, transform .18s ease;
}
.gb-buehne[data-hud="0"] .gb-leiste,
.gb-buehne[data-hud="0"] .gb-kasten { opacity: 0; pointer-events: none; }
.gb-buehne[data-hud="0"] .gb-links { transform: translateY(-50%) translateX(-16px); }
.gb-buehne[data-hud="0"] .gb-rechts { transform: translateY(-50%) translateX(16px); }

/* Nur noch eine Leiste, oben. Die untere trug einen Hinweistext, den nach der
   ersten Runde niemand mehr liest — und sie nahm Bildhoehe weg, die dem
   Panorama fehlt. */
.gb-leiste {
  left: 14px; right: 14px; top: 14px;
  display: flex; align-items: center; gap: 14px; padding: 8px 14px; border-radius: 999px;
}
.gb-leistelinks, .gb-leisterechts { display: flex; align-items: center; gap: 10px; }
.gb-leistemitte { flex: 1; display: flex; justify-content: center; }
.gb-leisterechts { margin-left: auto; }
.gb-uhr { font: 700 1.45rem/1 var(--mono); font-variant-numeric: tabular-nums; }
.gb-uhr[data-knapp="1"] { color: var(--warn); }

/*
 * Die beiden Kaesten haengen MITTIG an ihrer Seite und sind so hoch wie acht
 * Zeilen — nicht so hoch wie der Bildschirm.
 *
 * Das ist der Unterschied zwischen einer Leiste und einem Balken: bei zwoelf
 * Woertern steht die Liste ruhig in der Mitte, bei dreissig wird in ihr
 * gescrollt statt das halbe Panorama zu verdecken. Die Hoehe steht als
 * --zeilen im Wurzelblatt und nicht als Zahl mitten im Regelwerk.
 */
.gb-kasten {
  top: 50%; transform: translateY(-50%);
  width: 280px; border-radius: var(--r-gross);
  display: flex; flex-direction: column;
  max-height: min(calc(var(--zeilen) * 48px + 56px), calc(100dvh - 120px));
}
.gb-links { left: 14px; }
.gb-rechts { right: 14px; width: 236px; }
.gb-kastenkopf {
  display: flex; align-items: center; gap: 9px; flex: none;
  padding: 11px 13px; border-bottom: 1px solid var(--kante);
  font: 600 .74rem/1 var(--sans); letter-spacing: .11em; text-transform: uppercase; color: var(--leise);
}
.gb-kastenkopf .gb-zahl { margin-left: auto; }
.gb-klappe {
  flex: none; width: 24px; height: 24px; margin: -4px -4px -4px 0; display: grid; place-items: center;
  background: none; border: 0; border-radius: 6px; color: var(--leise); font-size: .8rem; line-height: 1;
  transition: color .12s ease, background .12s ease, transform .18s ease;
}
.gb-klappe:hover { color: var(--schrift); background: var(--flaeche-2); }
.gb-kasten[data-zu="1"] { max-height: 46px; }
.gb-kasten[data-zu="1"] .gb-klappe { transform: rotate(180deg); }
.gb-kasten[data-zu="1"] > *:not(.gb-kastenkopf) { display: none; }
.gb-kasten[data-zu="1"] .gb-kastenkopf { border-bottom: 0; }

.gb-kastenleib { padding: 9px; overflow-y: auto; overscroll-behavior: contain; }
.gb-karte { display: grid; gap: 5px; align-content: start; }

.gb-wortknopf {
  display: flex; align-items: center; gap: 9px; width: 100%; text-align: left;
  padding: 5px 9px 5px 6px; border: 1px solid var(--kante); border-radius: var(--r);
  background: rgba(0,0,0,.22); color: var(--schrift); font: 400 .9rem/1.25 var(--sans);
  transition: border-color .1s ease, background .1s ease;
}
.gb-wortknopf:hover { border-color: var(--kante-stark); background: var(--flaeche-2); }
.gb-wortknopf[data-gefunden="1"] { border-color: var(--violett-rand); background: rgba(127,34,254,.18); }
.gb-nummer { flex: none; width: 15px; font: 600 .7rem/1 var(--mono); color: #5c6580; text-align: center; }
.gb-wortknopf[data-gefunden="1"] .gb-nummer { color: var(--violett-hell); }
.gb-bildchen {
  flex: none; width: 48px; height: 32px; border-radius: 5px;
  background: rgba(255,255,255,.05) center/cover no-repeat;
  border: 1px solid var(--kante);
}

/* ── Auswertung ──────────────────────────────────────────────────────────── */
.gb-pruefblock { margin-bottom: 28px; }
.gb-pruefblock h3 { display: flex; align-items: center; gap: 10px; }
.gb-belege { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.gb-beleg { margin: 0; border: 1px solid var(--kante); border-radius: var(--r-gross); overflow: hidden; background: var(--flaeche); }
.gb-beleg[data-gilt="0"] { border-color: rgba(248,113,113,.5); opacity: .55; }
.gb-belegbild {
  display: block; width: 100%; aspect-ratio: 8/5; padding: 0; border: 0;
  background: var(--tiefer) center/cover no-repeat; position: relative;
}
.gb-3d {
  position: absolute; right: 9px; bottom: 9px; padding: 5px 10px; border-radius: 6px;
  background: var(--violett); border: 1px solid var(--violett-rand);
  font: 600 .72rem/1 var(--sans); letter-spacing: .08em; color: #fff;
  opacity: 0; transition: opacity .14s ease;
}
.gb-belegbild:hover .gb-3d, .gb-belegbild:focus-visible .gb-3d { opacity: 1; }
.gb-beleg figcaption { display: flex; align-items: center; justify-content: space-between; gap: 9px; padding: 9px 11px; }
.gb-wer { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: .88rem; min-width: 0; }
.gb-daumen { display: flex; gap: 6px; flex: none; }
.gb-daumen button {
  padding: 6px 9px; border: 1px solid var(--kante); border-radius: var(--r);
  background: rgba(0,0,0,.25); color: var(--leise); font: 600 .78rem/1 var(--mono);
}
.gb-daumen button:hover:not(:disabled) { border-color: var(--kante-stark); color: var(--schrift); }
.gb-daumen button[data-ja][aria-pressed="true"] { background: var(--gruen); border-color: var(--gruen); color: #06210f; }
.gb-daumen button[data-nein][aria-pressed="true"] { background: var(--warn); border-color: var(--warn); color: #2b0b0b; }

.gb-schau {
  position: fixed; inset: 0; z-index: 40; background: rgba(10,10,24,.94);
  display: flex; flex-direction: column; opacity: 0; pointer-events: none;
  transition: opacity .16s ease;
}
.gb-schau[data-da="1"] { opacity: 1; pointer-events: auto; }
.gb-schaukopf { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 18px; font-weight: 600; flex: none; }
.gb-schaupano { flex: 1; min-height: 0; }

/* ── Ergebnis ────────────────────────────────────────────────────────────── */
.gb-rangliste { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.gb-rangliste li {
  display: grid; grid-template-columns: 36px 1fr auto auto; align-items: center; gap: 15px;
  padding: 14px 16px; border: 1px solid var(--kante); border-radius: var(--r-gross); background: rgba(0,0,0,.2);
}
.gb-rangliste li[data-platz="1"] { border-color: var(--violett-rand); background: rgba(127,34,254,.14); }
.gb-platz { font: 700 1.1rem/1 var(--mono); color: var(--leise); }
.gb-rangliste li[data-platz="1"] .gb-platz { color: var(--violett-hell); }
.gb-teamgitter { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
.gb-teamtafel { padding: 20px; border: 1px solid var(--kante); border-radius: var(--r-gross); background: rgba(0,0,0,.2); }
.gb-teamtafel[data-sieger="1"] { border-color: var(--violett-rand); background: rgba(127,34,254,.14); }
.gb-grosszahl { display: block; font: 700 3rem/1 var(--mono); margin: .35rem 0 .8rem; }
.gb-teamtafel ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; }
.gb-teamtafel li { display: flex; justify-content: space-between; gap: 12px; font-size: .92rem; color: var(--still); }
.gb-teamtafel li span { font: 700 .92rem/1.5 var(--mono); color: var(--schrift); }

/* ── Meldeleiste ─────────────────────────────────────────────────────────── */
.gb-melde {
  position: fixed; left: 50%; bottom: 26px; transform: translate(-50%, 12px); z-index: 60;
  max-width: min(92vw, 500px); padding: 12px 18px; font-size: .92rem;
  background: rgba(26,26,46,.97); border: 1px solid var(--kante-stark); border-radius: var(--r);
  box-shadow: 0 20px 50px -20px rgba(0,0,0,.95);
  opacity: 0; pointer-events: none; transition: opacity .16s ease, transform .16s ease;
}
.gb-melde[data-da="1"] { opacity: 1; transform: translate(-50%, 0); }
.gb-melde[data-art="fehler"] { border-color: var(--warn); }
.gb-melde[data-art="gut"] { border-color: var(--gruen); }

/* ── schmale Fenster ─────────────────────────────────────────────────────── */
@media (max-width: 1180px) {
  .gb-lobbygitter { grid-template-columns: 1fr 1fr; }
  .gb-lobbygitter > section:last-child { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .gb-lobbygitter { grid-template-columns: 1fr; }
  .gb-lobbygitter > section:last-child { grid-column: auto; }
  .gb-grosscode { font-size: 1.45rem; }
  /* Auf dem Handy unten quer statt seitlich: seitliche Kaesten liessen vom
     Panorama nichts uebrig. */
  .gb-kasten { top: auto; bottom: 12px; transform: none; left: 10px; right: 10px; width: auto; max-height: 38dvh; }
  .gb-rechts { display: none; }
  .gb-buehne[data-hud="0"] .gb-links { transform: translateY(16px); }
}
</style>`;

// ---------------------------------------------------------------------------

export function head() {
  return SPIEL_CSS;
}

/** Beschriftung eines Gebiets oder Pakets in der Sprache der Seite. */
const benannt = (o, lang) => ({ name: o[lang], beschreibung: o[lang === 'de' ? 'deD' : 'enD'] || '' });

export function body(lang) {
  const t = TEXTE[lang];

  if (!BEREIT) {
    return `<div class="gb-mitte"><div class="gb-tafel gb-schmal">
  <div class="gb-marke"><span class="gb-auge"></span>GeoBingo</div>
  <h1 style="margin-top:1rem">${t.setupH}</h1>
  ${HAT_KARTE ? '' : `<p class="gb-still">${t.setupKarte}</p>`}
  ${HAT_DATENBANK ? '' : `<p class="gb-still">${t.setupDb}</p>`}
  <p style="margin-top:1rem"><a class="gb-knopf gb-haupt" style="display:inline-block;text-decoration:none" href="${SITE.repoSite}/blob/main/docs/SETUP-MAPS.md">${t.setupCta}</a></p>
</div></div>`;
  }

  return `<div id="gbRoot"><div class="gb-mitte"><div class="gb-warten"><span class="gb-kreisel"></span>${t.laden}</div></div></div>
<noscript><div class="gb-mitte"><div class="gb-tafel gb-schmal"><p>${t.ohneJs}</p></div></div></noscript>`;
}

export function script(lang) {
  if (!BEREIT) return '';

  /*
   * Alles, was von aussen kommt, geht durch JSON.stringify — auch die Texte.
   * In „Bäckerei" steckt kein Anführungszeichen, in einer künftigen Zeile aber
   * schon, und dann wäre die Seite kaputt statt nur falsch.
   */
  const kopf = {
    fb: {
      apiKey: FB.apiKey, authDomain: FB.authDomain, projectId: FB.projectId,
      storageBucket: FB.storageBucket, messagingSenderId: FB.messagingSenderId, appId: FB.appId,
    },
    sdk: FB.sdkVersion || '11.0.2',
    maps: KARTE,
    zugang: GB.zugangscode,
    discord: GB.discord || '',
    standard: GB.standard,
    kontingent: GB.kontingent || null,
    regionen: GB.regionen.map((r) => ({
      id: r.id, name: r[lang], boxen: r.boxen || null,
      /*
       * Nur die beiden Zahlen. Der Ortsname steht in content/geobingo.json,
       * damit die Datei lesbar und prüfbar bleibt — im Browser hat er nichts
       * verloren: er wird nirgends angezeigt, und 877 Namen sind rund 12 KB,
       * die jeder Spieler mitlädt, ohne dass sie je jemand sieht.
       */
      staedte: (r.staedte || []).map((o) => [o[0], o[1]]),
    })),
    pakete: GB.pakete.map((p) => ({
      id: p.id, ...benannt(p, lang),
      woerter: p.woerter.map((w) => ({ text: w[lang], p: w.p })),
    })),
    L: TEXTE[lang],
  };

  return `window.__GEOBINGO = ${JSON.stringify(kopf)};\n${SPIEL_JS}`;
}
