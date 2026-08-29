import { href, SITE } from '../layout.mjs';

/**
 * Stufe 2 — gehalten.
 *
 * Auftritte beim Eintreten, keine an den Bildlauf gekoppelte Bewegung. Diese
 * Seite wird gelesen: sie ist der Rückfall für den DECK-Eintrag in NEXUS, und
 * wer hier landet, will wissen, was das ist und wie er es bekommt — nicht
 * bestaunt werden.
 */
export const bewegung = 2;

export const slug = 'deck';

export const meta = {
  en: {
    title: 'DECK — fleet control for FiveM servers · Skillry',
    description:
      'One window for every FiveM server: this machine and any VPS you add. Console, players and tick time in real time — and the panel can restart without taking the game server with it.',
  },
  de: {
    title: 'DECK — Flottensteuerung für FiveM-Server · Skillry',
    description:
      'Ein Fenster für alle FiveM-Server: diesen Rechner und jeden VPS, den du einträgst. Konsole, Spieler und Tickzeit in Echtzeit — und ein Neustart des Panels reißt den Spielserver nicht mit.',
  },
};

const T = {
  en: {
    eyebrow: 'DECK · in development',
    h1: 'One window. Every server.',
    lede:
      'DECK runs FiveM servers — the one on this machine and every VPS you add. Not a second txAdmin: it asks a different question.',
    cta: 'How to build it',
    ctaNexus: 'See NEXUS instead',

    fromH: 'Where it comes from',
    fromP:
      'A rented server was cancelled, the backup had to run somewhere, and starting it again by hand every time got old. DECK is what came out of that — built for one question txAdmin does not ask: <em>how do I run one project across several machines?</em>',

    diffH: 'Four things it does differently',
    diff: [
      ['Target and project are two things',
       'A <strong>target</strong> is a machine — this PC, a VPS, later a second one. A <strong>project</strong> is a server: resources, config, database, a pinned FXServer build. One project, many targets. Testing locally and then moving to the VPS is a switch in a menu, not a second setup kept in sync by hand.'],
      ['The panel is not the game server’s parent',
       'txAdmin starts the server as its own child: if the panel dies, the server dies. Here it runs detached, output to a file, commands over RCON. DECK writes down the process number and reattaches on the next start. <strong>Restarting the panel is invisible to the players.</strong>'],
      ['The build is pinned, not incidental',
       'A project carries its FXServer version as a statement. Builds sit side by side, and switching one does not overwrite the other. A server running 35245 locally and 35574 outside has bugs you never see at home.'],
      ['Tick time is a difference, not an average',
       'The performance endpoint reports totals since boot. Divide those and you get the average of the last three days — a number that stops moving. DECK divides the delta: the average of the last two seconds, and that one moves. If the endpoint is locked, it shows a dash, not a zero.'],
    ],

    haveH: 'What is in it today',
    have: [
      'Start, restart and stop, with a graceful shutdown so player data is written',
      'Live console with per-resource colours, adjustable size and command history',
      'Players with ping, connection time and identifiers to copy',
      'Fleet view: reachability, latency, system facts over SSH',
      'Credentials in the Windows account, never in a config file',
    ],

    getH: 'How to get it',
    getP:
      'DECK is not released yet, and the repository is private for now — there is no download and no public source. This is what running it takes.',
    steps: [
      ['Requirements', '.NET 9 SDK and Windows. Nothing else — no Docker, no virtualisation.'],
      ['Runtimes', '<code>werkzeug\\laufzeit-holen.ps1</code> fetches FXServer 35245 and a portable MariaDB — 675 MB, each checked against a pinned SHA-256. They are deliberately not in the repository.'],
      ['Build and run', '<code>dotnet build DECK.sln</code>, then <code>dotnet run --project src/Deck.App</code>.'],
    ],

    nexusH: 'Together with NEXUS',
    nexusP:
      'NEXUS carries a DECK entry in its sidebar. If DECK is on the machine, the entry opens it; if it is not, it brings you here. The two are separate programs on purpose — DECK talks SSH, RCON and processes, and that has no business inside an assistant.',
  },

  de: {
    eyebrow: 'DECK · in Entwicklung',
    h1: 'Ein Fenster. Alle Server.',
    lede:
      'DECK steuert FiveM-Server — den auf diesem Rechner und jeden VPS, den du einträgst. Kein zweites txAdmin: es stellt eine andere Frage.',
    cta: 'Wie man es baut',
    ctaNexus: 'Stattdessen NEXUS ansehen',

    fromH: 'Woher es kommt',
    fromP:
      'Ein gemieteter Server wurde gekündigt, die Sicherung musste irgendwo laufen, und ihn jedes Mal von Hand wieder hochzuziehen wurde alt. DECK ist das, was dabei herauskam — gebaut für eine Frage, die txAdmin nicht stellt: <em>wie führe ich ein Projekt über mehrere Maschinen?</em>',

    diffH: 'Vier Dinge, die es anders macht',
    diff: [
      ['Ziel und Projekt sind zwei Dinge',
       'Ein <strong>Ziel</strong> ist eine Maschine — dieser PC, ein VPS, später ein zweiter. Ein <strong>Projekt</strong> ist ein Server: Ressourcen, Konfiguration, Datenbank, eine festgenagelte FXServer-Fassung. Ein Projekt, viele Ziele. Lokal testen und dann auf den VPS schieben ist ein Wechsel im Menü — kein zweites Setup, das man von Hand gleichhält.'],
      ['Das Panel ist nicht der Elternprozess',
       'txAdmin startet den Server als sein eigenes Kind: fällt das Panel aus, fällt der Server mit. Hier läuft er abgelöst, die Ausgabe in eine Datei, Befehle über RCON. DECK merkt sich die Prozessnummer und hängt sich beim nächsten Start wieder an. <strong>Ein Neustart des Panels ist für die Spieler unsichtbar.</strong>'],
      ['Die Fassung ist festgenagelt, nicht zufällig',
       'Ein Projekt trägt seine FXServer-Fassung als Angabe. Artefakte liegen nebeneinander, und ein Wechsel überschreibt nichts. Ein Server, der lokal auf 35245 und draußen auf 35574 läuft, hat Fehler, die man zu Hause nie sieht.'],
      ['Tickzeit ist eine Differenz, kein Durchschnitt',
       'Der Leistungsendpunkt liefert Summen seit dem Start. Wer die teilt, bekommt den Durchschnitt der letzten drei Tage — eine Zahl, die stillsteht. DECK teilt die Differenz: den Durchschnitt der letzten zwei Sekunden, und der bewegt sich. Ist der Endpunkt verriegelt, steht dort ein Strich und keine Null.'],
    ],

    haveH: 'Was heute drin ist',
    have: [
      'Starten, Neustarten und Stoppen — geordnet, damit die Spielstände geschrieben werden',
      'Live-Konsole mit Farbe je Ressource, einstellbarer Größe und Befehlsverlauf',
      'Spieler mit Ping, Verbindungsdauer und Kennungen zum Kopieren',
      'Flotte: Erreichbarkeit, Latenz, Systemangaben über SSH',
      'Zugangsdaten im Windows-Konto, nie in einer Konfigurationsdatei',
    ],

    getH: 'Wie man es bekommt',
    getP:
      'DECK ist noch nicht veröffentlicht, und das Repository ist vorerst privat — es gibt weder ein Herunterladen noch einen offenen Quelltext. So viel gehört dazu, es zu betreiben.',
    steps: [
      ['Voraussetzung', '.NET 9 SDK und Windows. Sonst nichts — kein Docker, keine Virtualisierung.'],
      ['Laufzeiten', '<code>werkzeug\\laufzeit-holen.ps1</code> holt FXServer 35245 und eine portable MariaDB — 675 MB, beide gegen eine festgelegte SHA-256 geprüft. Sie liegen mit Absicht nicht im Repository.'],
      ['Bauen und starten', '<code>dotnet build DECK.sln</code>, dann <code>dotnet run --project src/Deck.App</code>.'],
    ],

    nexusH: 'Zusammen mit NEXUS',
    nexusP:
      'NEXUS trägt einen DECK-Eintrag in der Seitenleiste. Liegt DECK auf der Maschine, öffnet der Eintrag es; liegt es nicht da, führt er hierher. Die beiden sind mit Absicht getrennte Programme — DECK spricht SSH, RCON und Prozesse, und das hat in einem Assistenten nichts zu suchen.',
  },
};

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero hero-stage" style="border-top:3px solid var(--accent)">
  <div class="wrap stack">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="#bekommen">${t.cta}</a>
      <a class="btn" href="${href(lang, 'nexus')}">${t.ctaNexus}</a>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap narrow">
    <div class="note"><h3>${t.fromH}</h3><p>${t.fromP}</p></div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.diffH}</h2>
    <div class="grid grid-2">
      ${t.diff.map(([h, p]) => `<article class="card"><h3>${h}</h3><p>${p}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap narrow stack-lg">
    <h2>${t.haveH}</h2>
    <ul class="checklist">
      ${t.have.map(x => `<li>${x}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<hr class="divider">

<section id="bekommen">
  <div class="wrap narrow stack-lg">
    <h2>${t.getH}</h2>
    <p>${t.getP}</p>
    <div class="grid grid-3">
      ${t.steps.map(([h, p]) => `<article class="card"><h3>${h}</h3><p>${p}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap narrow">
    <div class="note"><h3>${t.nexusH}</h3><p>${t.nexusP}</p></div>
  </div>
</section>
`;
}
