/**
 * Paare — Memory mit den Formen des Netzwerks.
 *
 * Eine eigene Seite wie jedes Spiel (Begruendung in spiel-reflex.mjs). Die
 * acht Symbole sind Inline-SVG in currentColor; eines der acht ist das
 * Zeichen selbst, nach seinen Regeln: nicht gedreht, Gehrung, Linie statt
 * Silhouette.
 */

import { href } from '../layout.mjs';
import { PFAD_OFFEN } from '../logo.mjs';

export const slug = 'games/pairs';

export const meta = {
  en: {
    title: 'Pairs — memory game · Skillry Games',
    description:
      'Sixteen cards, eight pairs, one of them the Skillry mark itself. Fewest moves wins. Runs entirely in your browser — no account, nothing stored.',
  },
  de: {
    title: 'Paare — Memory · Skillry Games',
    description:
      'Sechzehn Karten, acht Paare, eines davon das Skillry-Zeichen selbst. Wenigste Züge gewinnen. Läuft komplett im Browser — kein Konto, nichts wird gespeichert.',
  },
  es: {
    title: 'Parejas — juego de memoria · Skillry Games',
    description:
      'Dieciséis cartas, ocho parejas, una de ellas el propio símbolo de Skillry. Ganan los menos movimientos. Corre entero en tu navegador — sin cuenta, nada se guarda.',
  },
};

const T = {
  en: {
    eyebrow: 'Skillry Games',
    chip: 'On this page',
    h1: 'Pairs',
    lede: 'Sixteen cards, eight pairs, one of them the Skillry mark itself. Fewest moves wins — against yourself, which is the hardest opponent available.',
    jsNote: 'This game needs JavaScript. Nothing else on this page does anything without your click either.',
    so: ['Turn two cards. If they match, they stay put and step back.', 'If they don’t, remember where they were — the clock only starts with your first flip.', 'All eight found: your moves and time stand. Shuffle and undercut them.'],
    moves: 'Moves', found: 'Pairs', time: 'Time',
    neu: 'Shuffle again',
    win: 'All eight! {m} moves in {s}s.',
    card: 'Card',
    zurueck: 'All games', idee: 'Suggest a game',
  },
  de: {
    eyebrow: 'Skillry Games',
    chip: 'Auf dieser Seite',
    h1: 'Paare',
    lede: 'Sechzehn Karten, acht Paare, eines davon das Skillry-Zeichen selbst. Wenigste Züge gewinnen — gegen dich selbst, den härtesten Gegner im Angebot.',
    jsNote: 'Dieses Spiel braucht JavaScript. Ohne läuft hier auch sonst nichts von allein.',
    so: ['Zwei Karten umdrehen. Passen sie, bleiben sie liegen und treten zurück.', 'Passen sie nicht: merken, wo sie lagen — die Uhr startet erst mit dem ersten Zug.', 'Alle acht gefunden: Züge und Zeit stehen fest. Neu mischen und unterbieten.'],
    moves: 'Züge', found: 'Paare', time: 'Zeit',
    neu: 'Neu mischen',
    win: 'Alle acht! {m} Züge in {s}s.',
    card: 'Karte',
    zurueck: 'Alle Spiele', idee: 'Ein Spiel vorschlagen',
  },
  es: {
    eyebrow: 'Skillry Games',
    chip: 'En esta página',
    h1: 'Parejas',
    lede: 'Dieciséis cartas, ocho parejas, una de ellas el propio símbolo de Skillry. Ganan los menos movimientos — contra ti, que eres el rival más duro disponible.',
    jsNote: 'Este juego necesita JavaScript. Sin él, nada más en esta página hace nada por su cuenta tampoco.',
    so: ['Da la vuelta a dos cartas. Si coinciden, se quedan y dan un paso atrás.', 'Si no coinciden: recuerda dónde estaban — el reloj solo arranca con tu primer movimiento.', 'Encontradas las ocho: tus movimientos y tu tiempo quedan fijados. Baraja de nuevo y mejóralos.'],
    moves: 'Movimientos', found: 'Parejas', time: 'Tiempo',
    neu: 'Barajar de nuevo',
    win: '¡Las ocho! {m} movimientos en {s}s.',
    card: 'Carta',
    zurueck: 'Todos los juegos', idee: 'Proponer un juego',
  },
};

/** Die acht Symbole — Formen des Netzwerks, in currentColor. */
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
main { --eck: var(--accent-forum); }
.card.eckig { --eck: var(--accent-forum); }
.sp-titel { color: var(--eck); }
.spiel-spalte { max-width: 640px; display: flex; flex-direction: column; gap: 20px; }
.spiel-fuss { display: flex; flex-wrap: wrap; gap: 12px 24px; }
.so-gehts { margin: 0; padding-left: 1.2rem; color: var(--fg-muted); font-size: 0.94rem; }
.so-gehts li { margin-bottom: 0.3rem; }

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

export function body(lang) {
  const t = T[lang];
  return `
<section class="hero">
  <div class="wrap">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1 class="sp-titel">${t.h1}</h1>
    <p class="lede">${t.lede}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap spiel-spalte">
    <article class="card eckig sp-spiel">
      <h3><span class="sp-name">${t.h1}</span> <span class="sp-chip">${t.chip}</span></h3>
      <noscript>${t.jsNote}</noscript>
      <div class="pa-kopf">
        <span>${t.moves} <b id="paZuege">0</b></span>
        <span>${t.found} <b id="paPaare">0</b>/8</span>
        <span>${t.time} <b id="paZeit">0s</b></span>
        <button type="button" class="btn" id="paNeu">${t.neu}</button>
      </div>
      <div class="pa-raster" id="paRaster"></div>
      <p class="pa-sieg" id="paSieg" hidden role="status"></p>
    </article>
    <ol class="so-gehts">${t.so.map((s) => `<li>${s}</li>`).join('')}</ol>
    <div class="spiel-fuss">
      <a class="btn" href="${href(lang, 'games')}">← ${t.zurueck}</a>
      <a class="btn" href="${href(lang, 'forum')}?cat=ideas">${t.idee}</a>
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
  const S = JSON.stringify({ win: t.win, card: t.card });
  const SYME = JSON.stringify(SYM);
  return `
(function () {
  var S = ${S};
  var raster = document.getElementById('paRaster');
  if (!raster) return;
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
})();`;
}
