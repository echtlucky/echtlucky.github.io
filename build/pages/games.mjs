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
const SPIELBAR = ['geobingo', 'georadar', 'reflex', 'paare', 'sequenz'];
export const N_SPIELBAR = SPIELBAR.length;

export const meta = {
  en: {
    title: 'Games — playable in the browser · Skillry',
    description:
      'The play side of the Skillry network: Reflex, Pairs and Sequence run entirely in your browser; GeoBingo hunts words in Street View and GeoRadar races to guess where in the world you are.',
  },
  de: {
    title: 'Spiele — direkt im Browser spielbar · Skillry',
    description:
      'Die Spielseite des Skillry-Netzwerks: Reflex, Paare und Sequenz laufen komplett im Browser; GeoBingo jagt Wörter in Street View, und GeoRadar rät um die Wette, wo auf der Welt du stehst.',
  },
  es: {
    title: 'Juegos — jugables directamente en el navegador · Skillry',
    description:
      'La parte de juego de la red Skillry: Reflejos, Parejas y Secuencia funcionan por completo en tu navegador; GeoBingo caza palabras en Street View, y GeoRadar convierte en carrera adivinar en qué punto del mundo estás.',
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
        hinweis: 'Runs behind a Google sign-in and talks to Google once you play — that page says so before it does it. New: a world minimap in the corner — open it, click anywhere, and jump the panorama right there (a lobby setting decides who may).',
      },
      georadar: {
        h: 'GeoRadar',
        p: 'The GeoGuessr side of GeoBingo: everyone lands in the SAME Street View spot and races to guess where it is on the world map — closest pin wins, the clock breaks ties.',
        hinweis: 'One game with GeoBingo: same lobby, same codes, switchable as a mode in the settings and playable on its own.',
      },
      reflex: { h: 'Reflex', p: 'Five rounds against your own nerves. The stage lights up after a random delay — hit it as fast as you can.' },
      paare: { h: 'Pairs', p: 'Sixteen cards, eight pairs, one of them the Skillry mark itself. Fewest moves wins.' },
      sequenz: { h: 'Sequence', p: 'Four fields, one growing chain: watch it, play it back, one step longer each level.' },
    },

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
        hinweis: 'Läuft hinter einer Google-Anmeldung und spricht mit Google, sobald du spielst — das sagt die Seite, bevor sie es tut. Neu: eine Welt-Minikarte in der Ecke — aufklappen, irgendwohin klicken, und das Panorama springt genau dorthin (wer darf, ist eine Lobby-Einstellung).',
      },
      georadar: {
        h: 'GeoRadar',
        p: 'Die GeoGuessr-Seite von GeoBingo: alle landen am SELBEN Street-View-Ort und raten um die Wette, wo das auf der Weltkarte ist — der nächste Pin gewinnt, bei Gleichstand die Uhr.',
        hinweis: 'Ein Spiel mit GeoBingo: gleiche Lobby, gleiche Codes, in den Einstellungen als Modus umschaltbar und einzeln spielbar.',
      },
      reflex: { h: 'Reflex', p: 'Fünf Runden gegen die eigenen Nerven. Die Fläche leuchtet nach zufälliger Wartezeit auf — triff sie so schnell du kannst.' },
      paare: { h: 'Paare', p: 'Sechzehn Karten, acht Paare, eines davon das Skillry-Zeichen selbst. Wenigste Züge gewinnen.' },
      sequenz: { h: 'Sequenz', p: 'Vier Felder, eine wachsende Folge: ansehen, nachspielen, jede Stufe einen Schritt länger.' },
    },

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
  es: {
    eyebrow: 'Skillry Games',
    h1: 'Juega, aquí mismo.',
    lede:
      'Los juegos son parte de la red. Cada uno tiene su propia página — un enlace que se puede compartir. Los pequeños corren enteros en tu navegador y no guardan nada; GeoBingo tiene su propia página y sus propias reglas. Lo que aún se está construyendo lo dice, en vez de aparentar.',
    liveH: 'Jugable ya',
    nachher: 'En desarrollo',
    nachherLede: 'Anunciado, sin enlace — un enlace a algo que aún no existe es un error disfrazado de oferta. El progreso aterriza primero aquí.',
    ideenH: 'Ideas de juegos',
    ideenLede: 'Lo que podría llegar a la red a continuación. Nada de esto es una promesa — son candidatos, y el orden lo decide el foro. Leer no necesita cuenta.',
    ideenCta: 'Votar en el foro',
    chipHier: 'Jugable',
    chipKonto: 'Requiere iniciar sesión',
    chipBald: 'En desarrollo',
    chipIdee: 'Idea',
    spielen: 'Jugar',

    spiele: {
      geobingo: {
        h: 'GeoBingo',
        p: 'Una ronda de bingo en vivo dentro de Google Street View, construida para ir a pantalla completa junto a un stream. Una sala, una lista de palabras compartida, y una revisión en la que cada hallazgo se puede discutir como un panorama 3D de verdad.',
        hinweis: 'Corre detrás de un inicio de sesión de Google y habla con Google en cuanto juegas — esa página lo dice antes de hacerlo. Nuevo: un minimapa del mundo en la esquina — ábrelo, haz clic en cualquier sitio, y el panorama salta justo ahí (quién puede, lo decide un ajuste de la sala).',
      },
      georadar: {
        h: 'GeoRadar',
        p: 'El lado GeoGuessr de GeoBingo: todos aterrizan en el MISMO punto de Street View y compiten por adivinar dónde queda en el mapa del mundo — la marca más cercana gana, y el reloj deshace empates.',
        hinweis: 'Un solo juego con GeoBingo: misma sala, mismos códigos, cambiable como modo en los ajustes y jugable por separado.',
      },
      reflex: { h: 'Reflejos', p: 'Cinco rondas contra tus propios nervios. La superficie se enciende tras una espera aleatoria — acierta lo más rápido que puedas.' },
      paare: { h: 'Parejas', p: 'Dieciséis cartas, ocho parejas, una de ellas el propio símbolo de Skillry. Ganan los menos movimientos.' },
      sequenz: { h: 'Secuencia', p: 'Cuatro campos, una cadena que crece: mírala, repítela, un paso más largo en cada nivel.' },
    },

    netzH: 'Red multijugador',
    netzP: 'Salas con códigos de cinco caracteres, como las que GeoBingo ya tiene — extendidas a los juegos pequeños, para que Reflejos y Parejas se conviertan en duelos. Misma cuenta, mismos códigos, mismas reglas sobre qué se guarda.',

    ideen: [
      ['Sprint de palabras', 'Teclear las palabras que caen antes de que aterricen — mecanografía rápida como duelo.'],
      ['Arena de quiz', 'Preguntas escritas por la comunidad en el foro, jugadas en salas.'],
      ['Descifracódigos', 'Romper el código de colores en los menos intentos posibles — Mastermind, edición de la red.'],
      ['Duelo de píxeles', 'Uno dibuja con píxeles, la sala adivina. La respuesta correcta más rápida puntúa.'],
      ['Cálculo relámpago', 'Sesenta segundos de cálculo mental, una clasificación compartida por sala.'],
      ['Torre', 'Apilar los bloques que van y vienen tan alto y tan recto como te dejen los nervios.'],
    ],
  },
};

/** Ziel, Akzent und Sortenchip je spielbarem Eintrag. */
const ZIELE = {
  geobingo: { slug: 'geobingo', ak: 'sp-geo' },
  georadar: { slug: 'geobingo', ak: 'sp-radar' },
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
    const chip = key === 'geobingo' || key === 'georadar' ? t.chipKonto : t.chipHier;
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
