/**
 * Die drei endgueltigen Zeichen.
 *
 *   t = 2.1, auf den dokumentierten Sicherheitsrand von 2.4 skaliert.
 *   Skillry gruen, Roleplay signalblau, Lizenz amber mit Schluessel.
 *
 * Bewegung als SMIL, nicht als CSS: `d: path()` kennt Firefox nicht, SMIL
 * schon. Auf der Seite selbst treibt spaeter GSAP denselben Parameter --
 * diese Datei muss allein funktionieren, im Favicon wie im README.
 */
import { verwerfung } from './marken.mjs';
import { writeFileSync } from 'node:fs';

const T = 2.1;
const RAND = 2.4;          // Sicherheitsrand aus build/logo.mjs
const STRICH = 1.7;

/*
 * Ausdehnung bei t = 2.1, im Browser ueber getBBox gemessen -- die Boegen
 * woelben sich ueber die Ankerpunkte hinaus, aus den Punkten allein laesst
 * sich das nicht sauber rechnen:
 *
 *   inklusive Strich   20.894 x 21.303
 *
 * Bindend ist hier die HOEHE, nicht die Breite. Mit den frueher faelschlich
 * extrapolierten Radien war die Figur breiter als hoch; seit die Radien fest
 * stehen, ist es umgekehrt. Wer die alte Zahl weiterbenutzt, skaliert zu
 * wenig und stoesst unten an.
 */
const GEMESSEN = 21.303;
const SKALA = Number(((24 - 2 * RAND - STRICH) / (GEMESSEN - STRICH)).toFixed(4));

/** Pfad bei t, um die Mitte skaliert. */
const d = (t) => verwerfung(t, { skala: SKALA });

/* Zwoelf Stufen fuer die SMIL-Morphung: genug fuer ein weiches Schliessen,
   wenig genug, dass die Datei klein bleibt. */
const STUFEN = 12;
const werte = (auf) => {
  const f = [];
  for (let i = 0; i <= STUFEN; i++) {
    const p = i / STUFEN;
    const e = p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;   // weich ein/aus
    f.push(d(T * (auf ? e : 1 - e)));
  }
  return f;
};

const SCHLUESSEL = (f) => `
  <g stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="butt" opacity="0">
    <circle cx="12" cy="9.9" r="2.35"/>
    <path d="M12 12.25V17.4"/><path d="M12 14.6h2.15"/><path d="M12 16.5h1.6"/>
    <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.34;0.62;1"
             dur="2.4s" begin="0s" fill="freeze"/>
  </g>`;

function marke({ name, farbe, icon = false, titel }) {
  // Von geschlossen nach offen: das Zeichen findet beim Laden seine Form.
  const folge = [...werte(true)].join(';');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
     fill="none" role="img" aria-label="${titel}">
  <title>${titel}</title>
  <path d="${d(T)}" stroke="${farbe}" stroke-width="${STRICH}" fill="none"
        stroke-linejoin="miter" stroke-miterlimit="4">
    <animate attributeName="d" values="${folge}" dur="1.5s" begin="0s"
             calcMode="linear" fill="freeze"/>
  </path>${icon ? SCHLUESSEL(farbe) : ''}
</svg>
`;
}

const MARKEN = [
  { name: 'skillry',  farbe: '#4EE296', titel: 'Skillry' },
  { name: 'roleplay', farbe: '#2F81F7', titel: 'Skillry Roleplay' },
  { name: 'lizenz',   farbe: '#F5B942', titel: 'Skillry Lizenz', icon: true },
];

for (const m of MARKEN) {
  writeFileSync(`zeichen-${m.name}.svg`, marke(m), 'utf8');
}

console.log(`t=${T}  Skala ${SKALA}`);
console.log('Pfad bei t:', d(T).slice(0, 60), '…');
console.log('geschrieben:', MARKEN.map((m) => `zeichen-${m.name}.svg`).join(', '));
