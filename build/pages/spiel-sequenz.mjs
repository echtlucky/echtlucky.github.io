/**
 * Sequenz — die Farbfolge des Netzwerks, nachgespielt.
 *
 * Das Simon-Prinzip: vier Felder in vier Netzwerkfarben, jede Stufe haengt
 * einen Schritt an, wer die Folge nachtippt, kommt weiter. Eine eigene Seite
 * wie jedes Spiel (Begruendung in spiel-reflex.mjs); laeuft komplett im
 * Browser, laedt nichts, speichert nichts.
 *
 * Kein Ton, mit Absicht: das Original lebt vom Piepsen, aber diese Seite
 * spielt keinen Laut ab, den niemand angefordert hat — und ein Spiel, das
 * ohne Ton nicht funktioniert, waere hier das falsche Spiel. Die vier Felder
 * unterscheiden sich deshalb doppelt: Farbe UND Position.
 */

import { href } from '../layout.mjs';

export const slug = 'games/sequence';

export const meta = {
  en: {
    title: 'Sequence — memory chain · Skillry Games',
    description:
      'Four fields, one growing chain: watch the sequence, play it back, one step longer each level. Runs entirely in your browser — no account, nothing stored.',
  },
  de: {
    title: 'Sequenz — Farbfolge · Skillry Games',
    description:
      'Vier Felder, eine wachsende Folge: ansehen, nachspielen, jede Stufe einen Schritt länger. Läuft komplett im Browser — kein Konto, nichts wird gespeichert.',
  },
};

const T = {
  en: {
    eyebrow: 'Skillry Games',
    chip: 'On this page',
    h1: 'Sequence',
    lede: 'Four fields in four network colours. The chain plays itself once — then it is your turn, and every level adds one more step. How far do you get?',
    jsNote: 'This game needs JavaScript. Nothing else on this page does anything without your click either.',
    so: ['Press Start and watch: the fields light up in order.', 'Play the same order back — click or tab to a field and press Enter.', 'Each level adds one step. One wrong tap ends the run; your best stays until you close the tab.'],
    start: 'Start', wieder: 'Play again',
    schau: 'Watch…', dran: 'Your turn', vorbei: 'Level {n} was the end.',
    level: 'Level', best: 'Best',
    feld: 'Field',
    zurueck: 'All games', idee: 'Suggest a game',
  },
  de: {
    eyebrow: 'Skillry Games',
    chip: 'Auf dieser Seite',
    h1: 'Sequenz',
    lede: 'Vier Felder in vier Netzwerkfarben. Die Folge spielt sich einmal selbst — dann bist du dran, und jede Stufe hängt einen Schritt an. Wie weit kommst du?',
    jsNote: 'Dieses Spiel braucht JavaScript. Ohne läuft hier auch sonst nichts von allein.',
    so: ['Auf Start drücken und zusehen: die Felder leuchten der Reihe nach.', 'Dieselbe Reihenfolge nachspielen — klicken oder mit Tab aufs Feld und Enter.', 'Jede Stufe hängt einen Schritt an. Ein falscher Tipp beendet den Lauf; die Bestmarke bleibt, bis der Tab zugeht.'],
    start: 'Start', wieder: 'Nochmal',
    schau: 'Zusehen…', dran: 'Du bist dran', vorbei: 'Bei Stufe {n} war Schluss.',
    level: 'Stufe', best: 'Beste',
    feld: 'Feld',
    zurueck: 'Alle Spiele', idee: 'Ein Spiel vorschlagen',
  },
};

const CSS = `
main { --eck: var(--accent-scr); }
.card.eckig { --eck: var(--accent-scr); }
.sp-titel { color: var(--eck); }
.spiel-spalte { max-width: 640px; display: flex; flex-direction: column; gap: 20px; }
.spiel-fuss { display: flex; flex-wrap: wrap; gap: 12px 24px; }
.so-gehts { margin: 0; padding-left: 1.2rem; color: var(--fg-muted); font-size: 0.94rem; }
.so-gehts li { margin-bottom: 0.3rem; }

.sq-kopf {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 22px;
  font-size: 0.88rem; color: var(--fg-muted); margin-bottom: 12px;
}
.sq-kopf b { font-family: var(--mono); font-variant-numeric: tabular-nums; color: var(--fg); font-weight: 600; }
.sq-kopf .btn { margin-left: auto; padding: 7px 14px; font-size: 13px; }
.sq-status { min-height: 1.4em; font-weight: 600; color: var(--fg-muted); }
.sq-status.vorbei { color: var(--danger); }

.sq-raster { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
/*
 * Ein Feld ist im Ruhezustand eine FLAECHE seiner Farbe (schwacher Einschlag
 * auf der Kartenflaeche) und leuchtet als KOERPER auf: volle Farbe, kein
 * Blitzweiss. So bleibt das Aufleuchten auch fuer Farbschwache lesbar —
 * es aendert sich Helligkeit UND Saettigung, nicht nur der Ton, und die
 * Position traegt die zweite Haelfte der Unterscheidung.
 */
.sq-feld {
  aspect-ratio: 1.35; border-radius: var(--radius); cursor: pointer; padding: 0;
  border: 1px solid color-mix(in srgb, var(--sq) 45%, var(--border));
  background: color-mix(in srgb, var(--sq) 16%, var(--surface-2));
  transition: background var(--kurz) var(--ease), border-color var(--kurz) var(--ease),
              transform var(--kurz) var(--ease);
  touch-action: manipulation;
}
.sq-feld:hover { border-color: var(--sq); }
.sq-feld.an {
  background: var(--sq); border-color: var(--sq);
  transform: scale(0.97);
}
.sq-feld:disabled { cursor: default; }
.sq-f1 { --sq: var(--marke); }
.sq-f2 { --sq: var(--himmel); }
.sq-f3 { --sq: var(--accent-forum); }
.sq-f4 { --sq: var(--accent-idx); }
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
      <div class="sq-kopf">
        <span>${t.level} <b id="sqLevel">–</b></span>
        <span>${t.best} <b id="sqBeste">–</b></span>
        <button type="button" class="btn btn-primary" id="sqStart">${t.start}</button>
      </div>
      <div class="sq-raster">
        ${[1, 2, 3, 4].map((n) => `<button type="button" class="sq-feld sq-f${n}" data-f="${n - 1}" aria-label="${t.feld} ${n}" disabled></button>`).join('')}
      </div>
      <p class="sq-status" id="sqStatus" role="status"></p>
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
  const S = JSON.stringify({ schau: t.schau, dran: t.dran, vorbei: t.vorbei, start: t.start, wieder: t.wieder });
  return `
(function () {
  var S = ${S};
  var start = document.getElementById('sqStart');
  if (!start) return;
  var felder = [].slice.call(document.querySelectorAll('.sq-feld'));
  var eLevel = document.getElementById('sqLevel');
  var eBeste = document.getElementById('sqBeste');
  var status = document.getElementById('sqStatus');
  var folge = [], schritt = 0, beste = 0, laeuft = false, zeigt = false;

  function sperren(zu) { felder.forEach(function (f) { f.disabled = zu; }); }
  function blink(i, dauer, dann) {
    var f = felder[i];
    f.classList.add('an');
    setTimeout(function () {
      f.classList.remove('an');
      if (dann) setTimeout(dann, 170);
    }, dauer);
  }
  function zeigen() {
    zeigt = true; sperren(true);
    status.classList.remove('vorbei');
    status.textContent = S.schau;
    var i = 0;
    (function weiter() {
      if (i >= folge.length) {
        zeigt = false; sperren(false); schritt = 0;
        status.textContent = S.dran;
        return;
      }
      blink(folge[i], 420, function () { i += 1; weiter(); });
    })();
  }
  function stufe() {
    folge.push(Math.floor(Math.random() * 4));
    eLevel.textContent = String(folge.length);
    // Kurze Luft vor dem Vorspielen, sonst wirkt der neue Schritt wie die
    // Antwort auf den letzten Klick.
    setTimeout(zeigen, 480);
  }
  function vorbei() {
    laeuft = false; sperren(true);
    status.classList.add('vorbei');
    status.textContent = S.vorbei.replace('{n}', folge.length);
    start.textContent = S.wieder;
    start.hidden = false;
  }
  felder.forEach(function (f) {
    f.addEventListener('click', function () {
      if (!laeuft || zeigt) return;
      var i = Number(f.dataset.f);
      blink(i, 220, null);
      if (i !== folge[schritt]) return vorbei();
      schritt += 1;
      if (schritt === folge.length) {
        if (folge.length > beste) { beste = folge.length; eBeste.textContent = String(beste); }
        sperren(true);
        stufe();
      }
    });
  });
  start.addEventListener('click', function () {
    folge = []; schritt = 0; laeuft = true;
    start.hidden = true;
    eLevel.textContent = '0';
    stufe();
  });
})();`;
}
