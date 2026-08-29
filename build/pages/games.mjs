/**
 * Die Spieleseite — das Schaufenster des Spielbereichs.
 *
 * Gespielt wird NICHT hier: jedes Spiel ist eine eigene Seite mit eigener
 * Adresse, eigenem Titel und eigenem Platz in der Suche — eine Karte hier
 * ist eine Tuer, kein eingebettetes Spielfeld. Der Grund ist derselbe wie
 * bei den Produkten: was man teilen koennen soll, braucht eine Adresse.
 *
 * Drei Sorten Eintraege, und die Sorte steht ehrlich dran:
 *
 *   1. SPIELBAR, EIGENE SEITE: Reflex, Paare, Sequenz — komplett im Browser,
 *      nichts wird geladen, nichts gespeichert.
 *   2. SPIELBAR, MIT ANMELDUNG: GeoBingo, auf seiner eigenen Seite mit
 *      seiner eigenen Ehrlichkeit (spricht mit Google).
 *   3. IN ENTWICKLUNG und IDEEN: angekuendigt, nicht verlinkt. Die Ideen
 *      haben genau einen Link: die Abstimmung im Forum.
 */

import { href } from '../layout.mjs';

export const slug = 'games';

/**
 * Wie viele Spiele SPIELBAR sind — fuer die Tuer auf der Startseite.
 * Aus dieser Liste gezaehlt, nicht von Hand gepflegt; die Liste unten im
 * Markup wird aus denselben Schluesseln gebaut.
 */
const SPIELBAR = ['geobingo', 'reflex', 'paare', 'sequenz'];
export const N_SPIELBAR = SPIELBAR.length;

export const meta = {
  en: {
    title: 'Games — playable in the browser · Skillry',
    description:
      'The play side of the Skillry network: Reflex, Pairs and Sequence run entirely in your browser, GeoBingo runs Street View rounds for streams — and the GeoGuessr-style GeoRadar mode is on its way.',
  },
  de: {
    title: 'Spiele — direkt im Browser spielbar · Skillry',
    description:
      'Die Spielseite des Skillry-Netzwerks: Reflex, Paare und Sequenz laufen komplett im Browser, GeoBingo spielt Street-View-Runden für Streams — und GeoRadar, der GeoGuessr-Modus, ist unterwegs.',
  },
};

const T = {
  en: {
    eyebrow: 'Skillry Games',
    h1: 'Play, right here.',
    lede:
      'Games are part of the network. Each one has its own page — a link you can share. The small ones run entirely in your browser and store nothing; GeoBingo has its own page and its own rules. What is still being built says so, instead of pretending.',
    liveH: 'Playable now',
    nachher: 'In development',
    nachherLede: 'Announced, not linked — a link to something that does not exist yet is an error dressed as an offer. Progress lands here first.',
    ideenH: 'Game ideas',
    ideenLede: 'What could join the network next. None of these are promises — they are candidates, and the forum decides the order. One vote per opinion, no account needed to read along.',
    ideenCta: 'Vote in the forum',
    chipHier: 'Playable',
    chipKonto: 'Sign-in required',
    chipBald: 'In development',
    chipIdee: 'Idea',
    spielen: 'Play',

    spiele: {
      geobingo: {
        h: 'GeoBingo',
        p: 'A live bingo round inside Google Street View, built to run full-screen next to a stream. A lobby, one shared word list, and a review where every find can be argued about as a real 3D panorama.',
        hinweis: 'Runs behind a Google sign-in and talks to Google once you play — that page says so before it does it. Planned: a global minimap in the corner — open it, drag the map anywhere in the world, and Street View starts right there.',
      },
      reflex: { h: 'Reflex', p: 'Five rounds against your own nerves. The stage lights up after a random delay — hit it as fast as you can.' },
      paare: { h: 'Pairs', p: 'Sixteen cards, eight pairs, one of them the Skillry mark itself. Fewest moves wins.' },
      sequenz: { h: 'Sequence', p: 'Four fields, one growing chain: watch it, play it back, one step longer each level.' },
    },

    radarH: 'GeoRadar',
    radarP: 'The GeoGuessr side of GeoBingo: you are dropped into Street View and race the lobby to work out where you are — closest guess wins, the clock breaks ties. One game with GeoBingo, one shared lobby, switchable as a mode and playable on its own.',
    netzH: 'Multiplayer network',
    netzP: 'Lobbies with five-letter codes, like GeoBingo already has — extended to the small games, so Reflex and Pairs become duels. Same account, same codes, same rules about what gets stored.',

    ideen: [
      ['Word Sprint', 'Type the falling words before they land — speed typing as a duel.'],
      ['Quiz Arena', 'Questions written by the community in the forum, played in lobbies.'],
      ['Codebreaker', 'Crack the colour code in as few guesses as possible — Mastermind, network edition.'],
      ['Pixel Duel', 'One draws with pixels, the lobby guesses. Fastest correct guess scores.'],
      ['Lightning Math', 'Sixty seconds of mental arithmetic, one shared leaderboard per lobby.'],
      ['Tower', 'Stack the moving blocks as high and as straight as your nerves allow.'],
    ],
  },
  de: {
    eyebrow: 'Skillry Games',
    h1: 'Spielen, direkt hier.',
    lede:
      'Spiele gehören zum Netzwerk. Jedes hat seine eigene Seite — einen Link, den man teilen kann. Die kleinen laufen komplett im Browser und speichern nichts; GeoBingo hat seine eigene Seite und seine eigenen Regeln. Was noch gebaut wird, sagt das, statt so zu tun.',
    liveH: 'Jetzt spielbar',
    nachher: 'In Entwicklung',
    nachherLede: 'Angekündigt, nicht verlinkt — ein Link auf etwas, das es noch nicht gibt, ist ein Fehler im Kostüm eines Angebots. Fortschritt landet zuerst hier.',
    ideenH: 'Spielideen',
    ideenLede: 'Was als Nächstes ins Netzwerk kommen könnte. Nichts davon ist ein Versprechen — es sind Kandidaten, und die Reihenfolge entscheidet das Forum. Mitlesen geht ohne Konto.',
    ideenCta: 'Im Forum abstimmen',
    chipHier: 'Spielbar',
    chipKonto: 'Anmeldung nötig',
    chipBald: 'In Entwicklung',
    chipIdee: 'Idee',
    spielen: 'Spielen',

    spiele: {
      geobingo: {
        h: 'GeoBingo',
        p: 'Eine Live-Bingo-Runde mitten in Google Street View, gebaut für den Vollbildmodus neben einem Stream. Eine Lobby, eine gemeinsame Wortliste, und eine Auswertung, in der über jeden Fund als echtes 3D-Panorama gestritten werden kann.',
        hinweis: 'Läuft hinter einer Google-Anmeldung und spricht mit Google, sobald du spielst — das sagt die Seite, bevor sie es tut. Geplant: eine globale Minikarte in der Ecke — aufklappen, die Karte irgendwohin ziehen, und Street View startet genau dort.',
      },
      reflex: { h: 'Reflex', p: 'Fünf Runden gegen die eigenen Nerven. Die Fläche leuchtet nach zufälliger Wartezeit auf — triff sie so schnell du kannst.' },
      paare: { h: 'Paare', p: 'Sechzehn Karten, acht Paare, eines davon das Skillry-Zeichen selbst. Wenigste Züge gewinnen.' },
      sequenz: { h: 'Sequenz', p: 'Vier Felder, eine wachsende Folge: ansehen, nachspielen, jede Stufe einen Schritt länger.' },
    },

    radarH: 'GeoRadar',
    radarP: 'Die GeoGuessr-Seite von GeoBingo: du wirst in Street View abgesetzt und rätst gegen die Lobby, wo du bist — die genaueste Vermutung gewinnt, die Uhr entscheidet bei Gleichstand. Ein Spiel mit GeoBingo, eine gemeinsame Lobby, als Modus umschaltbar und einzeln spielbar.',
    netzH: 'Mehrspieler-Netz',
    netzP: 'Lobbys mit Fünf-Zeichen-Codes, wie GeoBingo sie schon hat — ausgeweitet auf die kleinen Spiele, damit aus Reflex und Paare Duelle werden. Gleiches Konto, gleiche Codes, gleiche Regeln dafür, was gespeichert wird.',

    ideen: [
      ['Wortsprint', 'Die fallenden Wörter wegtippen, bevor sie landen — Schnellschreiben als Duell.'],
      ['Quiz-Arena', 'Fragen aus der Community im Forum, gespielt in Lobbys.'],
      ['Codeknacker', 'Den Farbcode in möglichst wenigen Versuchen knacken — Mastermind, Netzwerk-Ausgabe.'],
      ['Pixel-Duell', 'Einer malt mit Pixeln, die Lobby rät. Der schnellste richtige Tipp punktet.'],
      ['Blitzrechnen', 'Sechzig Sekunden Kopfrechnen, eine gemeinsame Bestenliste je Lobby.'],
      ['Turm', 'Die wandernden Blöcke so hoch und so gerade stapeln, wie die Nerven es zulassen.'],
    ],
  },
};

/** Ziel, Akzent und Sortenchip je spielbarem Eintrag. */
const ZIELE = {
  geobingo: { slug: 'geobingo', ak: 'sp-geo' },
  reflex: { slug: 'games/reflex', ak: 'sp-rx' },
  paare: { slug: 'games/pairs', ak: 'sp-pa' },
  sequenz: { slug: 'games/sequence', ak: 'sp-sq' },
};

const CSS = `
/* Akzente je Spiel: dieselbe Karte, eigener Ton — die Ordnung des Hauses.
   Mit .card davor, denn .card.eckig setzt --eck mit zwei Klassen Gewicht;
   eine einzelne Klasse verlöre gegen sie, und alle Spiele wären markenfarben. */
.card.sp-geo { --eck: var(--ok); }
.card.sp-rx { --eck: var(--himmel); }
.card.sp-pa { --eck: var(--accent-forum); }
.card.sp-sq { --eck: var(--accent-scr); }
.card.sp-radar { --eck: var(--nexus); }
.card.sp-netz { --eck: var(--marke); }
.sp-mehr {
  margin-top: auto; padding-top: 10px; color: var(--link); font-size: 0.9rem; font-weight: 600;
}
.sp-mehr span { display: inline-block; transition: transform var(--kurz) var(--ease); }
a.sp-karte:hover { text-decoration: none; }
a.sp-karte:hover .sp-mehr span { transform: translateX(3px); }
a.sp-karte { color: var(--fg); }

/* ── Die Ideen: eine Reihe, keine Karteninflation ────────────────────────── */
.ideen-reihe {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px 30px;
}
.ideen-reihe > div { border-top: 1px solid var(--border); padding-top: 12px; }
.ideen-reihe h3 { font-size: 0.95rem; margin: 0 0 0.3rem; display: flex; align-items: center; gap: 8px; }
.ideen-reihe .sp-chip { color: var(--fg-subtle); }
`;

const kopf = (t, name, chip) =>
  `<h3><span class="sp-name">${name}</span> <span class="sp-chip">${chip}</span></h3>`;

export function body(lang) {
  const t = T[lang];

  const spielKarte = (key) => {
    const z = ZIELE[key];
    const s = t.spiele[key];
    const chip = key === 'geobingo' ? t.chipKonto : t.chipHier;
    return `<a class="card lift eckig sp-spiel sp-karte ${z.ak}" href="${href(lang, z.slug)}">
      ${kopf(t, s.h, chip)}
      <p class="muted">${s.p}</p>
      ${s.hinweis ? `<p class="sp-hinweis">${s.hinweis}</p>` : ''}
      <span class="sp-mehr">${t.spielen} <span aria-hidden="true">→</span></span>
    </a>`;
  };

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
      ${SPIELBAR.map(spielKarte).join('')}
    </div>
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

<section class="anschluss" style="padding-top:0">
  <div class="wrap stack-lg">
    <div class="stack">
      <h2 class="head-rule">${t.ideenH}</h2>
      <p class="muted narrow">${t.ideenLede}</p>
    </div>
    <div class="ideen-reihe">
      ${t.ideen.map(([h, p]) => `<div>
        <h3>${h} <span class="sp-chip">${t.chipIdee}</span></h3>
        <p class="muted small">${p}</p>
      </div>`).join('')}
    </div>
    <div class="btn-row" style="margin-top:0">
      <a class="btn" href="${href(lang, 'forum')}?cat=ideas">${t.ideenCta}</a>
    </div>
  </div>
</section>
`;
}

export function head() {
  return `<style>${CSS}</style>`;
}
