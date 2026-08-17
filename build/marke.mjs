/**
 * Die Marke — Farbe, Bewegung, Schrift.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Warum es diese Datei gibt
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Skillry ist ab jetzt mehr als eine Website: Portal, Panel, Forum und
 * Rechnungen kommen dazu (`skillry-fivem/docs/unternehmen.md`, Stufe 1). Was
 * sie zu einer Sache macht, ist nicht ein Logo, sondern **dieselbe Kurve,
 * dieselben Abstände, dieselbe Farbe** — und die stehen hier, an einer Stelle,
 * statt in fünf Blättern nebeneinander.
 *
 * `theme.mjs` beschreibt, wie diese Seite aussieht. Diese Datei beschreibt, wie
 * Skillry aussieht.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Grün gehört ab jetzt der Marke, nicht einem Produkt
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bisher war Grün die Farbe von AIRLOCK und stand deshalb auf genau einer
 * Seite; die Farbe, die überall auftauchte, war das Blau der Links. Wer die
 * Seite ansieht, sieht folglich kein Grün — obwohl das Zeichen grün gemeint ist.
 *
 * Die naheliegende Antwort — ein zweites, anderes Grün für die Marke — wurde
 * durchgerechnet und verworfen. **Airlocks Minz `#4EE296` liegt bei Farbton
 * 149°, und die Tonleiter unten liegt bei 150°; der Abstand zwischen dem Minz
 * und Stufe 400 dieser Leiter beträgt 13 von 441 möglichen.** Es ist nicht ein
 * anderes Grün, es ist dasselbe. Zwei davon nebeneinander hätte niemand
 * auseinandergehalten.
 *
 * Also andersherum: **eine Leiter, und Airlocks Minz ist eine ihrer Stufen.**
 * Skillry beansprucht Grün, Airlock trägt es als Flaggschiff — was es ohnehin
 * ist. Nexus behält Cyan als die wirklich andere Farbe.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Wo Grün auftaucht, und wo ausdrücklich nicht
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **Nicht bei den Links.** Das war der erste Entwurf und er war falsch: Blau
 * für einen Link ist keine Geschmacksfrage, sondern eine dreißig Jahre alte
 * Verabredung, und eine Dokumentationsseite lebt vom Überfliegen. Eine Marke
 * braucht die Linkfarbe nicht — GitHub ist schwarzweiß mit grünen Knöpfen und
 * blauen Links, und niemand hält GitHub für farblos.
 *
 * Grün ist die Farbe der **Identität und der Handlung**:
 *
 *   * das Zeichen im Kopf
 *   * der Fokusring — das Erste, was jemand mit der Tastatur sieht
 *   * der Hauptknopf einer Seite
 *   * der aktive Punkt in der Navigation
 *   * der Zähler am Warenkorb
 *   * gelungene Zustände
 *
 * Das sind die „kleinen grünen Akzente": selten, immer an einer Stelle, an der
 * etwas passiert.
 */

// ---------------------------------------------------------------------------
// 1. Die Tonleiter
// ---------------------------------------------------------------------------

/**
 * Zehn Stufen, Farbton 150°, **gemessen und nicht geraten**.
 *
 * Neben jeder Stufe steht ihr Kontrast gegen Weiß und gegen `#0d1117`, den
 * dunklen Grund. Diese Zahlen entscheiden, wofür eine Stufe taugt:
 *
 *   ab 4.5:1  Text
 *   ab 3.0:1  Kante eines Bedienelements (WCAG 1.4.11)
 *   darunter  nur Fläche
 *
 * Sie stehen hier ausgeschrieben, damit niemand eine Stufe „nur ein bisschen"
 * verschiebt und dabei eine Zusage bricht, die er nicht kannte.
 */
export const GRUEN = {
  50: '#effaf5', // weiss  1.07  dunkel 17.72
  100: '#d9f2e6', // weiss  1.18  dunkel 16.04
  200: '#b0e8cc', // weiss  1.38  dunkel 13.75
  300: '#83e2b3', // weiss  1.56  dunkel 12.16
  400: '#58e49e', // weiss  1.61  dunkel 11.72   <- hier liegt Airlocks Minz
  500: '#23e785', // weiss  1.64  dunkel 11.57
  600: '#0dc96b', // weiss  2.19  dunkel  8.64
  700: '#079d52', // weiss  3.53  dunkel  5.37
  800: '#05763d', // weiss  5.73  dunkel  3.30
  900: '#054d29', // weiss 10.00  dunkel  1.89
};

/*
 * ══ Der Kopfbalken ist ein eigener Farbraum ═══════════════════════════════
 *
 * Er ist dunkel, und zwar in BEIDEN Schemata: #24292f im hellen, #10151c im
 * dunklen. Was dort steht, kann sich deshalb nicht danach richten, ob die
 * Seite hell oder dunkel ist — es richtet sich danach, dass der Balken dunkel
 * ist.
 *
 * Das war nicht offensichtlich, und es ist einmal danebengegangen: das Zeichen
 * bekam `--marke-stark`, was im hellen Schema die DUNKELSTE Stufe ist. Auf dem
 * dunklen Balken ergab das **1.47:1** — praktisch unsichtbar. Gemessen im
 * Browser, nicht vermutet.
 *
 * Also ein eigenes Merkmal, das in beiden Schemata denselben Wert hat.
 * Nachgemessen auf #24292f: Stufe 400 hat 9.07:1, Stufe 500 hat 8.96:1, Stufe
 * 600 hat 6.69:1. Stufe 500 ist die kraeftigste von ihnen, ohne ins Blasse zu
 * gehen, und liegt dabei nah an Airlocks Minz — das Zeichen im Kopf und das
 * Zeichen auf der Airlock-Seite sehen damit gleich aus, was sie auch sollen.
 */
const AUF_DUNKEL = `
  --marke-auf-dunkel: ${GRUEN[500]};
`;

/**
 * Die Rollen im hellen Schema. Grund ist Weiß.
 *
 * `marke` trägt Text und braucht deshalb 4.5:1 — Stufe 800 hat 5.73. Stufe 700
 * wäre kräftiger und hat nur 3.53; sie taugt als Kante und nicht als Schrift,
 * und genau so wird sie hier benutzt.
 */
const MARKE_HELL = `
  --marke: ${GRUEN[800]};
  --marke-stark: ${GRUEN[900]};
  --marke-rand: ${GRUEN[700]};
  --marke-flaeche: ${GRUEN[50]};
  --marke-auf-flaeche: ${GRUEN[900]};
  --marke-schimmer: rgba(7, 157, 82, 0.18);
  --knopf-flaeche: ${GRUEN[900]};
  --knopf-flaeche-hover: ${GRUEN[800]};
  --knopf-schrift: #ffffff;
${AUF_DUNKEL}`;

/**
 * Dieselben Rollen im dunklen Schema. Grund ist `#0d1117`.
 *
 * Spiegelverkehrt und nicht dieselbe Zahl: auf fast schwarzem Grund trägt eine
 * dunkle Stufe keinen Text. Stufe 600 hat dort 8.64:1 und ist damit kräftig,
 * ohne ins Neon zu kippen — Stufe 500 hätte 11.57 und leuchtete.
 */
const MARKE_DUNKEL = `
  --marke: ${GRUEN[600]};
  --marke-stark: ${GRUEN[500]};
  --marke-rand: ${GRUEN[700]};
  --marke-flaeche: #08231a;
  --marke-auf-flaeche: ${GRUEN[300]};
  --marke-schimmer: rgba(13, 201, 107, 0.22);
  --knopf-flaeche: ${GRUEN[500]};
  --knopf-flaeche-hover: ${GRUEN[400]};
  --knopf-schrift: #052e18;
${AUF_DUNKEL}`;

/*
 * ══ Der gruene Knopf braucht ein PAAR, keine einzelne Farbe ═══════════════
 *
 * Der erste Entwurf nahm --marke-stark als Flaeche und #fff als Schrift. Im
 * hellen Schema ist das Stufe 900, also fast schwarzgruen: weisse Schrift
 * darauf hat 10:1. Im dunklen Schema ist dasselbe Merkmal Stufe 500, also ein
 * LEUCHTENDES Gruen — und weisse Schrift darauf hat **1.64:1**. Unlesbar.
 *
 * Der Fehler ist eine Denkart, kein Tippfehler: eine Flaechenfarbe und ihre
 * Schriftfarbe sind zusammen eine Entscheidung. Wer nur die Flaeche umschaltet,
 * hat die Haelfte umgeschaltet.
 *
 * Deshalb ein Paar, nachgemessen in beiden Schemata:
 *
 *   hell    Flaeche #054d29 (900), Schrift Weiss        10.00:1
 *           gegen die weisse Seite                      10.00:1
 *   dunkel  Flaeche #23e785 (500), Schrift #052e18       9.10:1
 *           gegen die dunkle Seite                      11.57:1
 *
 * Gefunden hat es nicht das Lesen, sondern eine Messung im Browser, die beide
 * Schemata durchgeschaltet hat.
 */
export const MARKE = { hell: MARKE_HELL, dunkel: MARKE_DUNKEL };

// ---------------------------------------------------------------------------
// 1b. Die zweite Leiter: Amber für das Lizenzportal
// ---------------------------------------------------------------------------

/**
 * Amber, Farbton ~40°, **dieselbe Bauart wie Grün** — zehn Stufen, jede mit
 * ihrem gemessenen Kontrast, und die Zahlen entscheiden, wofür eine taugt.
 *
 * ══ Warum das Portal eine eigene Farbe hat ════════════════════════════════
 *
 * Bis zum 17.08.2026 war die Klammer zwischen den Skillry-Seiten die FARBE:
 * alle drei grün. Seit alle drei dasselbe S tragen — dieselbe Konstruktion,
 * einen Parameter auseinander — ist die Klammer die FORM, und eine geteilte
 * Form hält besser als eine geteilte Farbe. Damit darf die Farbe unterscheiden,
 * wofür sie gut ist: Grün das Werkzeug, Blau das Rollenspiel, Amber die Lizenz.
 *
 * ══ Die eine Zahl, die diese Leiter überhaupt nötig macht ═════════════════
 *
 * **Das Marken-Amber #F5B942 erreicht auf Weiß nur 1.76:1.** Es kann im hellen
 * Schema keinen Text setzen. Wer "die Lizenzfarbe" nimmt und sie als Schrift
 * einträgt, baut eine unlesbare Seite — und merkt es nicht, weil dieselbe Farbe
 * auf dunklem Grund glänzend dasteht (10.72:1).
 *
 * Die Leiter beantwortet das: hell trägt Stufe 800 den Text, das Marken-Amber
 * ist dort FLÄCHE mit fast schwarzer Schrift darauf. Im Dunklen drehen die
 * Rollen, genau wie bei Grün.
 */
export const AMBER = {
  50: '#FDF6E7', // weiss  1.08  dunkel 17.58
  100: '#FAEBC8', // weiss  1.18  dunkel 16.02
  200: '#F6DA98', // weiss  1.36  dunkel 13.88
  300: '#F5CD6B', // weiss  1.52  dunkel 12.46
  400: '#F5B942', // weiss  1.76  dunkel 10.72   <- das Marken-Amber
  500: '#E8A520', // weiss  2.14  dunkel  8.86
  600: '#C4850C', // weiss  3.13  dunkel  6.04
  700: '#9C6800', // weiss  4.78  dunkel  3.96
  800: '#7A4F00', // weiss  7.13  dunkel  2.65
  900: '#4F3300', // weiss 11.63  dunkel  1.63
};

/*
 * Auf dem dunklen Kopfbalken (#24292f) gemessen: Stufe 300 hat 9.65:1, Stufe
 * 400 hat 8.30, Stufe 500 hat 6.86. Genommen wird 400 — kräftig genug und
 * zugleich das Marken-Amber selbst, damit das Zeichen im Kopf und das Zeichen
 * auf der Seite dieselbe Farbe haben.
 */
const AMBER_AUF_DUNKEL = `
  --marke-auf-dunkel: ${AMBER[400]};
`;

/** Helles Schema, Grund Weiß. Stufe 800 trägt Text (7.13), 700 die Kante (4.78). */
const LIZENZ_HELL = `
  --marke: ${AMBER[800]};
  --marke-stark: ${AMBER[900]};
  --marke-rand: ${AMBER[700]};
  --marke-flaeche: ${AMBER[50]};
  --marke-auf-flaeche: ${AMBER[900]};
  --marke-schimmer: rgba(156, 104, 0, 0.18);
  --knopf-flaeche: ${AMBER[900]};
  --knopf-flaeche-hover: ${AMBER[800]};
  --knopf-schrift: #ffffff;
${AMBER_AUF_DUNKEL}`;

/**
 * Dunkles Schema, Grund `#0d1117`. Spiegelverkehrt, nicht dieselbe Zahl.
 *
 * Der Knopf ist wieder ein PAAR: Fläche Stufe 400, Schrift `#2B1C00` — 9.38:1.
 * Weiß darauf hätte 1.76 und wäre unlesbar; das ist derselbe Fehler, der beim
 * grünen Knopf schon einmal gemacht wurde.
 */
const LIZENZ_DUNKEL = `
  --marke: ${AMBER[600]};
  --marke-stark: ${AMBER[400]};
  --marke-rand: ${AMBER[700]};
  --marke-flaeche: #241A05;
  --marke-auf-flaeche: ${AMBER[300]};
  --marke-schimmer: rgba(245, 185, 66, 0.22);
  --knopf-flaeche: ${AMBER[400]};
  --knopf-flaeche-hover: ${AMBER[300]};
  --knopf-schrift: #2B1C00;
${AMBER_AUF_DUNKEL}`;

/**
 * Für `marke-ausgeben.mjs`, also für `skillry-lizenz/web/marke.css`.
 *
 * Dieselben Merkmalsnamen wie bei `MARKE` — `portal.css` hängt an ihnen und
 * muss für den Farbwechsel keine Zeile ändern.
 */
export const MARKE_LIZENZ = { hell: LIZENZ_HELL, dunkel: LIZENZ_DUNKEL };

// ---------------------------------------------------------------------------
// 2. Die Bewegung
// ---------------------------------------------------------------------------

/**
 * Eine Kurve, drei Dauern.
 *
 * **Eine** Kurve, weil zwei Kurven auf einer Seite als zwei Programme gelesen
 * werden. Sie ist schnell am Anfang und läuft weich aus — das ist die Bewegung
 * von etwas, das angestoßen wurde, und nicht die von etwas, das anläuft.
 *
 * Drei Dauern reichen für alles:
 *
 *   `--kurz`   Zustand am selben Element (ein Knopf wird heller)
 *   `--mittel` etwas kommt oder geht (ein Menü, eine Ansicht)
 *   `--lang`   etwas bewegt sich über eine Strecke (ein Marker wandert)
 *
 * Was länger dauert als `--lang`, wartet, und Warten ist keine Gestaltung.
 */
export const BEWEGUNG = `
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --kurz: 140ms;
  --mittel: 240ms;
  --lang: 380ms;
`;

/**
 * Wer weniger Bewegung eingestellt hat, bekommt weniger.
 *
 * **Die Dauern werden auf 1ms gesetzt und nicht auf 0.** Der Unterschied ist
 * nicht Kosmetik: bei `0s` feuert in manchen Browsern kein `transitionend`, und
 * Code, der darauf wartet, wartet für immer. Ein Millisekunde ist für das Auge
 * dasselbe wie null und für den Ablauf etwas ganz anderes.
 *
 * Animationen werden ganz abgeschaltet statt verkürzt — eine Animation mit
 * Fülleigenschaft hielte sonst ihren ersten Bildzustand fest, und das ist genau
 * das Zucken, das man vermeiden wollte.
 */
export const RUHE = `
@media (prefers-reduced-motion: reduce) {
  :root { --kurz: 1ms; --mittel: 1ms; --lang: 1ms; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}`;

// ---------------------------------------------------------------------------
// 3. Die Schrift
// ---------------------------------------------------------------------------

/**
 * Montserrat, **selbst gehostet**, und das ist keine Vorliebe.
 *
 * Ein `<link>` auf `fonts.googleapis.com` lädt die Schrift beim Besucher und
 * überträgt dabei dessen IP-Adresse an Google. Das Landgericht München I hat
 * das 2022 als Verstoß gegen die DSGVO gewertet (3 O 17493/20). Für eine Seite
 * mit deutschem Impressum ist das kein Restrisiko, sondern ein bekanntes.
 *
 * Also liegt die Datei bei uns: `static/schrift/`, zwei Ausschnitte (Latein und
 * Latein erweitert), zusammen rund 108 KB. Die SIL Open Font License erlaubt
 * das ausdrücklich und verlangt dafür, dass ihr Text mitgeliefert wird — er
 * liegt als `OFL.txt` daneben.
 *
 * ══ Warum nur für Überschriften und die Wortmarke ═════════════════════════
 *
 * Der Fließtext bleibt in der Systemschrift. Sie ist schon da, kostet nichts
 * und ist auf jedem Gerät die, für die dessen Bildschirm eingestellt ist. Eine
 * Webschrift für Fließtext kostet Ladezeit für einen Unterschied, den beim
 * Lesen niemand bemerkt — bei einer Überschrift und einer Wortmarke bemerkt ihn
 * jeder.
 *
 * `font-display: swap`: bis die Datei da ist, steht die Systemschrift. Nicht
 * `block`, denn das hieße unsichtbare Überschriften, solange geladen wird.
 */
export const SCHRIFT_QUELLE = `
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500 800;
  font-display: swap;
  src: url('/schrift/montserrat-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500 800;
  font-display: swap;
  src: url('/schrift/montserrat-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF,
    U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}`;

/**
 * Die Ausweichkette hinter Montserrat.
 *
 * **Nicht die Systemschrift**, sondern Geometrisches, das auf den drei Systemen
 * tatsächlich liegt: Avenir Next auf Mac, Segoe UI Variable auf Windows,
 * Roboto auf Android. Fällt Montserrat aus, sieht die Überschrift dann immer
 * noch so aus, wie sie gemeint war — und nicht wie der Fließtext, nur größer.
 */
export const SCHRIFT = `
  --anzeige: 'Montserrat', 'Avenir Next', 'Segoe UI Variable Display', 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

/**
 * Alles zusammen, für `theme.mjs`.
 *
 * Die Reihenfolge ist beabsichtigt: erst `@font-face` (der Browser darf früh
 * anfangen zu laden), dann die Wertenamen, dann die Ruheregel ganz zuletzt —
 * sie überschreibt, und was überschreibt, gehört nach unten.
 */
export const markeCss = ({ hell = true } = {}) => `${SCHRIFT_QUELLE}

:root {
${SCHRIFT}${BEWEGUNG}${hell ? MARKE_HELL : MARKE_DUNKEL}}
`;
