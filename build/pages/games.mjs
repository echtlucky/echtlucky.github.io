/**
 * Die Spieleseite — der Spielbereich des Netzwerks.
 *
 * Drei Sorten Eintraege, und die Sorte steht ehrlich dran:
 *
 *   1. SOFORT SPIELBAR, HIER: Reflex und Paare laufen komplett auf dieser
 *      Seite. Kein Server, kein Konto, nichts wird geladen und nichts
 *      gespeichert — nicht einmal localStorage, denn der Hinweis unten links
 *      zaehlt auf, was im Browser liegt, und diese Liste soll wahr bleiben.
 *      Ein Punktestand lebt, solange der Tab lebt.
 *
 *   2. SPIELBAR, MIT ANMELDUNG: GeoBingo. Es behaelt seine eigene Seite und
 *      seine eigene Ehrlichkeit (spricht mit Google, steht deshalb nicht in
 *      Suche und Sitemap); hier steht nur die Tuer dorthin.
 *
 *   3. IN ENTWICKLUNG: GeoRadar (der GeoGuessr-Modus) und das
 *      Mehrspieler-Netz. Angekuendigt, nicht verlinkt — ein Link auf etwas,
 *      das es nicht gibt, ist ein Fehler, der wie ein Angebot aussieht.
 *
 * Die Spiele brauchen JavaScript, und das steht als <noscript> dran statt
 * als toter Knopf. Beide bedienen sich mit Maus, Finger UND Tastatur: die
 * Spielflaechen sind echte <button>, also tut Enter/Leertaste von allein
 * das Richtige.
 */

import { href } from '../layout.mjs';
import { PFAD_OFFEN } from '../logo.mjs';

export const slug = 'games';

export const meta = {
  en: {
    title: 'Games — playable in the browser · Skillry',
    description:
      'The play side of the Skillry network: small games that run entirely in your browser, GeoBingo with a Street View round for streams, and what is coming next — including the GeoGuessr-style GeoRadar mode.',
  },
  de: {
    title: 'Spiele — direkt im Browser spielbar · Skillry',
    description:
      'Die Spielseite des Skillry-Netzwerks: kleine Spiele, die komplett im Browser laufen, GeoBingo mit Street-View-Runden für Streams, und was als Nächstes kommt — inklusive GeoRadar, dem GeoGuessr-Modus.',
  },
};

const T = {
  en: {
    eyebrow: 'Skillry Games',
    h1: 'Play, right here.',
    lede:
      'Games are part of the network now. The small ones below run entirely on this page — no server, no account, nothing stored, not even a cookie. The big one, GeoBingo, has its own page and its own rules. And what is still being built says so, instead of pretending.',
    liveH: 'Playable now',
    nachher: 'In development',
    nachherLede: 'Announced, not linked — a link to something that does not exist yet is an error dressed as an offer. Progress lands here first.',
    jsNote: 'This game needs JavaScript. Nothing else on this page does anything without your click either.',
    chipHier: 'On this page',
    chipKonto: 'Sign-in required',
    chipBald: 'In development',

    geoH: 'GeoBingo',
    geoP: 'A live bingo round inside Google Street View, built to run full-screen next to a stream. A lobby, one shared word list, and a review where every find can be argued about as a real 3D panorama.',
    geoHinweis: 'Runs on its own page, behind a Google sign-in, and talks to Google once you play — that page says so before it does it.',
    geoCta: 'Open GeoBingo',
    geoPlan: 'Planned: a global minimap in the corner of a running round — open it, drag the map anywhere in the world, and Street View starts right there.',

    rxH: 'Reflex',
    rxP: 'Five rounds. The stage lights up in the brand colour after a random delay — hit it as fast as you can. Clicking early costs you the round’s honour, nothing else.',
    rxStart: 'Start',
    rxStartSub: 'Click, tap, or press Enter',
    rxWait: 'Wait for it…',
    rxWaitSub: 'The stage will light up',
    rxNow: 'NOW!',
    rxNowSub: '',
    rxEarly: 'Too early.',
    rxEarlySub: 'Click to retry the round',
    rxNext: 'Click for the next round',
    rxDone: 'Done!',
    rxDoneSub: 'Click to play again',
    rxRound: 'Round',
    rxLast: 'Last',
    rxAvg: 'Average',
    rxBest: 'Best',

    paH: 'Pairs',
    paP: 'Sixteen cards, eight pairs, one of them the Skillry mark itself. Fewest moves wins — against yourself, which is the hardest opponent available.',
    paMoves: 'Moves',
    paFound: 'Pairs',
    paTime: 'Time',
    paNew: 'Shuffle again',
    paWin: 'All eight! {m} moves in {s}s.',
    paCard: 'Card',

    radarH: 'GeoRadar',
    radarP: 'The GeoGuessr side of GeoBingo: you are dropped into Street View and race the lobby to work out where you are — fastest and closest guess wins the round. One game with GeoBingo, one shared lobby, switchable as a mode and playable on its own.',
    netzH: 'Multiplayer network',
    netzP: 'Lobbies with five-letter codes, like GeoBingo already has — extended to the small games, so Reflex and Pairs become duels. Same account, same codes, same rules about what gets stored.',
  },
  de: {
    eyebrow: 'Skillry Games',
    h1: 'Spielen, direkt hier.',
    lede:
      'Spiele gehören jetzt zum Netzwerk. Die kleinen unten laufen komplett auf dieser Seite — kein Server, kein Konto, nichts wird gespeichert, nicht mal ein Cookie. Das große, GeoBingo, hat seine eigene Seite und seine eigenen Regeln. Und was noch gebaut wird, sagt das, statt so zu tun.',
    liveH: 'Jetzt spielbar',
    nachher: 'In Entwicklung',
    nachherLede: 'Angekündigt, nicht verlinkt — ein Link auf etwas, das es noch nicht gibt, ist ein Fehler im Kostüm eines Angebots. Fortschritt landet zuerst hier.',
    jsNote: 'Dieses Spiel braucht JavaScript. Ohne läuft hier auch sonst nichts von allein.',
    chipHier: 'Auf dieser Seite',
    chipKonto: 'Anmeldung nötig',
    chipBald: 'In Entwicklung',

    geoH: 'GeoBingo',
    geoP: 'Eine Live-Bingo-Runde mitten in Google Street View, gebaut für den Vollbildmodus neben einem Stream. Eine Lobby, eine gemeinsame Wortliste, und eine Auswertung, in der über jeden Fund als echtes 3D-Panorama gestritten werden kann.',
    geoHinweis: 'Läuft auf einer eigenen Seite, hinter einer Google-Anmeldung, und spricht mit Google, sobald du spielst — das sagt die Seite, bevor sie es tut.',
    geoCta: 'GeoBingo öffnen',
    geoPlan: 'Geplant: eine globale Minikarte unten links in der laufenden Runde — aufklappen, die Karte irgendwohin ziehen (nach München oder ans andere Ende der Welt), und Street View startet genau dort.',

    rxH: 'Reflex',
    rxP: 'Fünf Runden. Die Fläche leuchtet nach zufälliger Wartezeit in der Markenfarbe auf — triff sie so schnell du kannst. Zu früh klicken kostet die Ehre der Runde, sonst nichts.',
    rxStart: 'Start',
    rxStartSub: 'Klicken, tippen oder Enter drücken',
    rxWait: 'Warte…',
    rxWaitSub: 'Gleich leuchtet die Fläche auf',
    rxNow: 'JETZT!',
    rxNowSub: '',
    rxEarly: 'Zu früh.',
    rxEarlySub: 'Klicken und die Runde nochmal',
    rxNext: 'Klicken für die nächste Runde',
    rxDone: 'Fertig!',
    rxDoneSub: 'Klicken für eine neue Partie',
    rxRound: 'Runde',
    rxLast: 'Letzte',
    rxAvg: 'Schnitt',
    rxBest: 'Beste',

    paH: 'Paare',
    paP: 'Sechzehn Karten, acht Paare, eines davon das Skillry-Zeichen selbst. Wenigste Züge gewinnen — gegen dich selbst, den härtesten Gegner im Angebot.',
    paMoves: 'Züge',
    paFound: 'Paare',
    paTime: 'Zeit',
    paNew: 'Neu mischen',
    paWin: 'Alle acht! {m} Züge in {s}s.',
    paCard: 'Karte',

    radarH: 'GeoRadar',
    radarP: 'Die GeoGuessr-Seite von GeoBingo: du wirst in Street View abgesetzt und rätst gegen die Lobby, wo du bist — die schnellste und genaueste Vermutung gewinnt die Runde. Ein Spiel mit GeoBingo, eine gemeinsame Lobby, als Modus umschaltbar und einzeln spielbar.',
    netzH: 'Mehrspieler-Netz',
    netzP: 'Lobbys mit Fünf-Zeichen-Codes, wie GeoBingo sie schon hat — ausgeweitet auf die kleinen Spiele, damit aus Reflex und Paare Duelle werden. Gleiches Konto, gleiche Codes, gleiche Regeln dafür, was gespeichert wird.',
  },
};

/**
 * Die acht Symbole fuer Paare.
 *
 * Inline-SVG in currentColor: die Farbe kommt von der Kachelklasse, das Symbol
 * ist nur Form. Eines der acht ist das Zeichen selbst — nach seinen Regeln
 * (nicht gedreht, Gehrung, Linie statt Silhouette).
 */
const SYM = [
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="2.2"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2.2"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5 20 19H4Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.8 20.2 12 12 20.2 3.8 12Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5v15M4.5 12h15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 14c2.5-5 5.5-5 8 0s5.5 5 8 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.6 19.3 7.8v8.4L12 20.4 4.7 16.2V7.8Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${PFAD_OFFEN}" stroke="currentColor" stroke-width="1.9" stroke-linejoin="miter" stroke-miterlimit="4"/></svg>`,
];

const CSS = `
/* Akzente je Spiel: dieselbe Karte, eigener Ton — die Ordnung des Hauses.
   Mit .card davor, denn .card.eckig setzt --eck mit zwei Klassen Gewicht;
   eine einzelne Klasse verlöre gegen sie, und alle Spiele wären markenfarben. */
.card.sp-geo { --eck: var(--ok); }
.card.sp-rx { --eck: var(--himmel); }
.card.sp-pa { --eck: var(--accent-forum); }
.card.sp-radar { --eck: var(--nexus); }
.card.sp-netz { --eck: var(--marke); }
.sp-spiel h3 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sp-spiel h3 .sp-name { color: var(--eck); }
.sp-chip {
  font-family: var(--mono); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.09em;
  text-transform: uppercase; padding: 2px 8px; border-radius: 999px;
  border: 1px solid currentColor; color: var(--eck);
}
.sp-hinweis { font-size: 0.84rem; color: var(--fg-subtle); }
.sp-spiel noscript { display: block; font-size: 0.84rem; color: var(--danger); }

/* ── Reflex ─────────────────────────────────────────────────────────────── */
.rx-stage {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  width: 100%; min-height: 200px; padding: 20px; cursor: pointer;
  font: inherit; color: var(--fg);
  background: var(--surface-2); border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  transition: background var(--kurz) var(--ease), border-color var(--kurz) var(--ease),
              color var(--kurz) var(--ease);
  -webkit-user-select: none; user-select: none; touch-action: manipulation;
}
.rx-gross { font-family: var(--anzeige); font-weight: 700; font-size: clamp(1.5rem, 4vw, 2.2rem); letter-spacing: -0.01em; }
.rx-klein { font-size: 0.88rem; color: inherit; opacity: 0.75; }
.rx-stage[data-zustand='warte'] { background: var(--marke-flaeche); border-color: var(--marke-rand); color: var(--marke-auf-flaeche); }
/* Das Aufleuchten ist der Markenknopf in gross — dasselbe gemessene Paar. */
.rx-stage[data-zustand='jetzt'] { background: var(--knopf-flaeche); border-color: var(--knopf-flaeche); color: var(--knopf-schrift); }
.rx-stage[data-zustand='frueh'] { border-color: var(--danger); color: var(--danger); }
.rx-werte {
  display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 12px;
  font-size: 0.88rem; color: var(--fg-muted);
}
.rx-werte b { font-family: var(--mono); font-variant-numeric: tabular-nums; color: var(--fg); font-weight: 600; }

/* ── Paare ──────────────────────────────────────────────────────────────── */
.pa-kopf {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 22px;
  font-size: 0.88rem; color: var(--fg-muted); margin-bottom: 12px;
}
.pa-kopf b { font-family: var(--mono); font-variant-numeric: tabular-nums; color: var(--fg); font-weight: 600; }
.pa-kopf .btn { margin-left: auto; padding: 7px 14px; font-size: 13px; }
.pa-raster { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.pa-karte {
  aspect-ratio: 1; border-radius: var(--radius); cursor: pointer; padding: 0;
  border: 1px solid var(--border-strong); background: var(--surface-2);
  display: grid; place-items: center;
  transition: background var(--kurz) var(--ease), border-color var(--kurz) var(--ease),
              transform var(--kurz) var(--ease), opacity var(--mittel) var(--ease);
  touch-action: manipulation;
}
.pa-karte:hover { border-color: var(--fg-muted); }
.pa-karte svg { width: 56%; height: 56%; opacity: 0; transform: scale(0.6); transition: opacity var(--kurz) var(--ease), transform var(--kurz) var(--ease); }
.pa-karte.auf { background: var(--surface); }
.pa-karte.auf svg { opacity: 1; transform: none; }
/* Ein gefundenes Paar bleibt liegen, tritt aber zurueck: sichtbar als
   Ergebnis, nicht mehr im Spiel. */
.pa-karte.weg { opacity: 0.45; cursor: default; border-color: var(--border); }
.pa-karte.weg svg { opacity: 1; transform: none; }
.pa-c1 { color: var(--marke); }
.pa-c2 { color: var(--himmel); }
.pa-c3 { color: var(--accent-forum); }
.pa-c4 { color: var(--accent-scr); }
.pa-c5 { color: var(--accent-idx); }
.pa-c6 { color: var(--nexus); }
.pa-c7 { color: var(--ok); }
.pa-c8 { color: var(--fg); }
.pa-sieg { margin-top: 12px; font-weight: 600; color: var(--eck); }
.pa-sieg[hidden] { display: none; }
@media (max-width: 480px) { .pa-raster { gap: 6px; } }
`;

/** Ein Spielkopf: Name in der Spielfarbe, Sortenchip daneben. */
const kopf = (t, name, chip) =>
  `<h3><span class="sp-name">${name}</span> <span class="sp-chip">${chip}</span></h3>`;

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero">
  <div class="wrap">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack-lg">
    <h2 class="head-rule">${t.liveH}</h2>

    <div class="grid grid-2">
      <article class="card eckig sp-spiel sp-geo" id="geobingo">
        ${kopf(t, t.geoH, t.chipKonto)}
        <p class="muted">${t.geoP}</p>
        <p class="sp-hinweis">${t.geoHinweis}</p>
        <p class="sp-hinweis">${t.geoPlan}</p>
        <div class="btn-row" style="margin-top:auto">
          <a class="btn" href="${href(lang, 'geobingo')}">${t.geoCta}</a>
        </div>
      </article>

      <article class="card eckig sp-spiel sp-rx" id="reflex">
        ${kopf(t, t.rxH, t.chipHier)}
        <p class="muted">${t.rxP}</p>
        <noscript>${t.jsNote}</noscript>
        <button type="button" class="rx-stage" id="rxStage" data-zustand="start">
          <span class="rx-gross" id="rxGross">${t.rxStart}</span>
          <span class="rx-klein" id="rxKlein">${t.rxStartSub}</span>
        </button>
        <div class="rx-werte">
          <span>${t.rxRound} <b id="rxRunde">–</b>/5</span>
          <span>${t.rxLast} <b id="rxLetzte">–</b></span>
          <span>${t.rxAvg} <b id="rxSchnitt">–</b></span>
          <span>${t.rxBest} <b id="rxBeste">–</b></span>
        </div>
      </article>
    </div>

    <article class="card eckig sp-spiel sp-pa" id="paare" style="max-width:560px">
      ${kopf(t, t.paH, t.chipHier)}
      <p class="muted">${t.paP}</p>
      <noscript>${t.jsNote}</noscript>
      <div class="pa-kopf">
        <span>${t.paMoves} <b id="paZuege">0</b></span>
        <span>${t.paFound} <b id="paPaare">0</b>/8</span>
        <span>${t.paTime} <b id="paZeit">0s</b></span>
        <button type="button" class="btn" id="paNeu">${t.paNew}</button>
      </div>
      <div class="pa-raster" id="paRaster"></div>
      <p class="pa-sieg" id="paSieg" hidden role="status"></p>
    </article>
  </div>
</section>

<section class="anschluss">
  <div class="wrap stack-lg">
    <div class="stack">
      <h2 class="head-rule">${t.nachher}</h2>
      <p class="muted narrow">${t.nachherLede}</p>
    </div>
    <div class="grid grid-2">
      <article class="card eckig sp-spiel sp-radar">
        ${kopf(t, t.radarH, t.chipBald)}
        <p class="muted">${t.radarP}</p>
      </article>
      <article class="card eckig sp-spiel sp-netz">
        ${kopf(t, t.netzH, t.chipBald)}
        <p class="muted">${t.netzP}</p>
      </article>
    </div>
  </div>
</section>
`;
}

export function head() {
  return `<style>${CSS}</style>`;
}

export function script(lang) {
  const t = T[lang];
  // Nur die Texte, die das Skript wirklich anfasst — als JSON, damit kein
  // Anfuehrungszeichen aus einer Uebersetzung das Skript beendet.
  const S = JSON.stringify({
    start: t.rxStart, startSub: t.rxStartSub, wait: t.rxWait, waitSub: t.rxWaitSub,
    now: t.rxNow, early: t.rxEarly, earlySub: t.rxEarlySub, next: t.rxNext,
    done: t.rxDone, doneSub: t.rxDoneSub, win: t.paWin, card: t.paCard,
  });
  const SYME = JSON.stringify(SYM);

  return `
(function () {
  var S = ${S};

  // ── Reflex ───────────────────────────────────────────────────────────────
  var stage = document.getElementById('rxStage');
  if (stage) {
    var gross = document.getElementById('rxGross');
    var klein = document.getElementById('rxKlein');
    var eRunde = document.getElementById('rxRunde');
    var eLetzte = document.getElementById('rxLetzte');
    var eSchnitt = document.getElementById('rxSchnitt');
    var eBeste = document.getElementById('rxBeste');
    var runde = 0, zeiten = [], timer = 0, ab = 0;

    function zeig(zustand, g, k) {
      stage.dataset.zustand = zustand;
      gross.textContent = g;
      klein.textContent = k || '';
    }
    function werte() {
      eRunde.textContent = runde ? String(runde) : '–';
      eLetzte.textContent = zeiten.length ? zeiten[zeiten.length - 1] + ' ms' : '–';
      eSchnitt.textContent = zeiten.length
        ? Math.round(zeiten.reduce(function (a, b) { return a + b; }, 0) / zeiten.length) + ' ms' : '–';
      eBeste.textContent = zeiten.length ? Math.min.apply(null, zeiten) + ' ms' : '–';
    }
    function warte() {
      zeig('warte', S.wait, S.waitSub);
      // 900 bis 3200 ms: kurz genug, dass niemand wegschaut, lang genug,
      // dass Raten teurer ist als Warten.
      timer = setTimeout(function () {
        ab = performance.now();
        zeig('jetzt', S.now, '');
      }, 900 + Math.random() * 2300);
    }
    stage.addEventListener('click', function () {
      var z = stage.dataset.zustand;
      if (z === 'warte') {           // zu frueh
        clearTimeout(timer);
        zeig('frueh', S.early, S.earlySub);
      } else if (z === 'jetzt') {    // der Treffer
        var ms = Math.round(performance.now() - ab);
        zeiten.push(ms);
        werte();
        if (runde >= 5) {
          runde = 0;
          zeig('start', S.done, S.doneSub);
        } else {
          zeig('ergebnis', ms + ' ms', S.next);
        }
      } else {                       // start, ergebnis, frueh, fertig
        if (z === 'start') { zeiten = []; runde = 0; }
        if (z !== 'frueh') runde += 1;
        werte();
        warte();
      }
    });
  }

  // ── Paare ────────────────────────────────────────────────────────────────
  var raster = document.getElementById('paRaster');
  if (raster) {
    var SYME = ${SYME};
    var eZuege = document.getElementById('paZuege');
    var ePaare = document.getElementById('paPaare');
    var eZeit = document.getElementById('paZeit');
    var eSieg = document.getElementById('paSieg');
    var neu = document.getElementById('paNeu');
    var offen = [], zuege = 0, paare = 0, sperre = false, start0 = 0, uhr = 0;

    function tick() {
      if (!start0) return;
      eZeit.textContent = Math.round((performance.now() - start0) / 1000) + 's';
    }
    function mischen() {
      clearInterval(uhr); uhr = setInterval(tick, 500);
      start0 = 0; offen = []; zuege = 0; paare = 0; sperre = false;
      eZuege.textContent = '0'; ePaare.textContent = '0'; eZeit.textContent = '0s';
      eSieg.hidden = true;
      var deck = [];
      for (var i = 0; i < 8; i++) { deck.push(i, i); }
      for (var j = deck.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = deck[j]; deck[j] = deck[k]; deck[k] = tmp;
      }
      raster.textContent = '';
      deck.forEach(function (sym, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pa-karte pa-c' + (sym + 1);
        b.dataset.sym = String(sym);
        b.setAttribute('aria-label', S.card + ' ' + (idx + 1));
        b.innerHTML = SYME[sym];
        b.addEventListener('click', function () { drehe(b); });
        raster.appendChild(b);
      });
    }
    function drehe(b) {
      if (sperre || b.classList.contains('auf') || b.classList.contains('weg')) return;
      if (!start0) start0 = performance.now();
      b.classList.add('auf');
      offen.push(b);
      if (offen.length < 2) return;
      zuege += 1; eZuege.textContent = String(zuege);
      var a = offen[0], c = offen[1];
      offen = [];
      if (a.dataset.sym === c.dataset.sym) {
        a.classList.remove('auf'); c.classList.remove('auf');
        a.classList.add('weg'); c.classList.add('weg');
        paare += 1; ePaare.textContent = String(paare);
        if (paare === 8) {
          clearInterval(uhr);
          var sek = Math.round((performance.now() - start0) / 1000);
          eSieg.textContent = S.win.replace('{m}', zuege).replace('{s}', sek);
          eSieg.hidden = false;
        }
      } else {
        sperre = true;
        setTimeout(function () {
          a.classList.remove('auf'); c.classList.remove('auf');
          sperre = false;
        }, 650);
      }
    }
    neu.addEventListener('click', mischen);
    mischen();
  }
})();`;
}
