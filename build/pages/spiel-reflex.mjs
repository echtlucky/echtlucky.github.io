/**
 * Reflex — ein eigenes Ziel, keine Karte mit Startknopf.
 *
 * Jedes Spiel des Netzwerks ist eine SEITE: eine Adresse, die man teilen
 * kann, ein Titel im Tab, ein Platz in der Suche. Die Spieleseite ist das
 * Schaufenster, gespielt wird hier. Laeuft komplett im Browser, laedt nichts,
 * speichert nichts — ein Punktestand lebt, solange der Tab lebt.
 */

import { href } from '../layout.mjs';

export const slug = 'games/reflex';

export const meta = {
  en: {
    title: 'Reflex — reaction game · Skillry Games',
    description:
      'Five rounds against your own nerves: the stage lights up after a random delay, hit it as fast as you can. Runs entirely in your browser — no account, nothing stored.',
  },
  de: {
    title: 'Reflex — Reaktionsspiel · Skillry Games',
    description:
      'Fünf Runden gegen die eigenen Nerven: die Fläche leuchtet nach zufälliger Wartezeit auf, triff sie so schnell du kannst. Läuft komplett im Browser — kein Konto, nichts wird gespeichert.',
  },
};

const T = {
  en: {
    eyebrow: 'Skillry Games',
    chip: 'On this page',
    h1: 'Reflex',
    lede: 'Five rounds. The stage lights up in the brand colour after a random delay — hit it as fast as you can. Clicking early costs you the round’s honour, nothing else.',
    jsNote: 'This game needs JavaScript. Nothing else on this page does anything without your click either.',
    so: ['Click Start — then keep your eyes on the stage.', 'The moment it lights up: click, tap, or press Enter.', 'After five rounds you get your average and your best. Then beat it.'],
    start: 'Start', startSub: 'Click, tap, or press Enter',
    wait: 'Wait for it…', waitSub: 'The stage will light up',
    now: 'NOW!',
    early: 'Too early.', earlySub: 'Click to retry the round',
    next: 'Click for the next round',
    done: 'Done!', doneSub: 'Click to play again',
    round: 'Round', last: 'Last', avg: 'Average', best: 'Best',
    zurueck: 'All games', idee: 'Suggest a game',
  },
  de: {
    eyebrow: 'Skillry Games',
    chip: 'Auf dieser Seite',
    h1: 'Reflex',
    lede: 'Fünf Runden. Die Fläche leuchtet nach zufälliger Wartezeit in der Markenfarbe auf — triff sie so schnell du kannst. Zu früh klicken kostet die Ehre der Runde, sonst nichts.',
    jsNote: 'Dieses Spiel braucht JavaScript. Ohne läuft hier auch sonst nichts von allein.',
    so: ['Auf Start klicken — und die Fläche nicht aus den Augen lassen.', 'Sobald sie aufleuchtet: klicken, tippen oder Enter drücken.', 'Nach fünf Runden stehen Schnitt und Bestzeit da. Dann: schlagen.'],
    start: 'Start', startSub: 'Klicken, tippen oder Enter drücken',
    wait: 'Warte…', waitSub: 'Gleich leuchtet die Fläche auf',
    now: 'JETZT!',
    early: 'Zu früh.', earlySub: 'Klicken und die Runde nochmal',
    next: 'Klicken für die nächste Runde',
    done: 'Fertig!', doneSub: 'Klicken für eine neue Partie',
    round: 'Runde', last: 'Letzte', avg: 'Schnitt', best: 'Beste',
    zurueck: 'Alle Spiele', idee: 'Ein Spiel vorschlagen',
  },
};

const CSS = `
main { --eck: var(--himmel); }
.card.eckig { --eck: var(--himmel); }
.sp-titel { color: var(--eck); }
.spiel-spalte { max-width: 640px; display: flex; flex-direction: column; gap: 20px; }
.spiel-fuss { display: flex; flex-wrap: wrap; gap: 12px 24px; }
.so-gehts { margin: 0; padding-left: 1.2rem; color: var(--fg-muted); font-size: 0.94rem; }
.so-gehts li { margin-bottom: 0.3rem; }

.rx-stage {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  width: 100%; min-height: 240px; padding: 20px; cursor: pointer;
  font: inherit; color: var(--fg);
  background: var(--surface-2); border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  transition: background var(--kurz) var(--ease), border-color var(--kurz) var(--ease),
              color var(--kurz) var(--ease);
  -webkit-user-select: none; user-select: none; touch-action: manipulation;
}
.rx-gross { font-family: var(--anzeige); font-weight: 700; font-size: clamp(1.6rem, 5vw, 2.4rem); letter-spacing: -0.01em; }
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
      <button type="button" class="rx-stage" id="rxStage" data-zustand="start">
        <span class="rx-gross" id="rxGross">${t.start}</span>
        <span class="rx-klein" id="rxKlein">${t.startSub}</span>
      </button>
      <div class="rx-werte">
        <span>${t.round} <b id="rxRunde">–</b>/5</span>
        <span>${t.last} <b id="rxLetzte">–</b></span>
        <span>${t.avg} <b id="rxSchnitt">–</b></span>
        <span>${t.best} <b id="rxBeste">–</b></span>
      </div>
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
  const S = JSON.stringify({
    start: t.start, startSub: t.startSub, wait: t.wait, waitSub: t.waitSub,
    now: t.now, early: t.early, earlySub: t.earlySub, next: t.next,
    done: t.done, doneSub: t.doneSub,
  });
  return `
(function () {
  var S = ${S};
  var stage = document.getElementById('rxStage');
  if (!stage) return;
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
    } else {                       // start, ergebnis, frueh
      if (z === 'start') { zeiten = []; runde = 0; }
      if (z !== 'frueh') runde += 1;
      werte();
      warte();
    }
  });
})();`;
}
