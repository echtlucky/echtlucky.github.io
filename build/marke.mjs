/**
 * Die Marke — Farbe, Bewegung, Schrift.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Warum es diese Datei gibt
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Skillry ist mehr als eine Website: Portal, Panel, Forum und Rechnungen
 * gehören dazu (`skillry-fivem/docs/unternehmen.md`, Stufe 1). Was sie zu
 * einer Sache macht, ist nicht ein Logo, sondern **dieselbe Kurve, dieselben
 * Abstände, dieselbe Farbe** — und die stehen hier, an einer Stelle, statt in
 * fünf Blättern nebeneinander.
 *
 * `theme.mjs` beschreibt, wie diese Seite aussieht. Diese Datei beschreibt, wie
 * Skillry aussieht.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Violett ist die Marke, Grün gehört wieder AIRLOCK
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bis zum 29.08.2026 beanspruchte Skillry das Grün und AIRLOCK trug es als
 * Flaggschiff. Das hatte einen Preis, der mit jedem neuen Projekt wuchs:
 * Marke und Flaggschiff waren farblich EIN Ding, und je mehr Projekte unter
 * dem Zeichen stehen — NEXUS, DECK, die Skripte, das Panel — desto falscher
 * wurde es, dass die Dachmarke die Farbe eines einzelnen Produkts trägt.
 *
 * Also die sauberere Ordnung: **die Marke bekommt eine eigene Farbe, die
 * keinem Produkt gehört.** Violett, Farbton ~262°, weit genug von Airlocks
 * Minz (149°), Nexus' Cyan (~193°) und dem Amber des Index (~40°), dass
 * keine zwei je verwechselt werden. Jedes Produkt behält seinen Akzent auf
 * seiner eigenen Seite; das Violett ist das Dach darüber.
 *
 * Und es ist bewusst KEINE Fläche aus einer Farbe: die Marke schichtet.
 * Violett trägt Identität und Handlung, das hellere Himmelsblau darunter
 * (`HIMMEL`) ist die zweite Ebene — es taucht nur in Verläufen, Szenen und
 * Lichtern auf, nie als Text, und ist das, was die Grundflächen davor
 * bewahrt, einfarbig zu sein.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Wo Violett auftaucht, und wo ausdrücklich nicht
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **Nicht bei den Links.** Blau für einen Link ist keine Geschmacksfrage,
 * sondern eine dreißig Jahre alte Verabredung, und eine Dokumentationsseite
 * lebt vom Überfliegen. Eine Marke braucht die Linkfarbe nicht — GitHub ist
 * schwarzweiß mit grünen Knöpfen und blauen Links, und niemand hält GitHub
 * für farblos. Ein violetter Link läse sich obendrein als "schon besucht".
 *
 * Violett ist die Farbe der **Identität und der Handlung**:
 *
 *   * das Zeichen im Kopf
 *   * der Fokusring — das Erste, was jemand mit der Tastatur sieht
 *   * der Hauptknopf einer Seite
 *   * der aktive Punkt in der Navigation
 *   * der Zähler am Warenkorb
 *   * die Schnittmarken an den Ecken einer Karte, solange die Karte keinem
 *     Projekt gehört — gehört sie einem, trägt sie dessen Akzent
 *
 * Das sind die "kleinen violetten Akzente": selten, immer an einer Stelle, an
 * der etwas passiert.
 */

// ---------------------------------------------------------------------------
// 1. Die Tonleiter
// ---------------------------------------------------------------------------

/**
 * Zehn Stufen Violett, Farbton ~262°, **gemessen und nicht geraten**.
 *
 * Neben jeder Stufe steht ihr Kontrast gegen Weiß und gegen `#0d0a1a`, den
 * dunklen Grund (die Nacht aus theme.mjs). Diese Zahlen entscheiden, wofür
 * eine Stufe taugt:
 *
 *   ab 4.5:1  Text
 *   ab 3.0:1  Kante eines Bedienelements (WCAG 1.4.11)
 *   darunter  nur Fläche
 *
 * Sie stehen hier ausgeschrieben, damit niemand eine Stufe "nur ein bisschen"
 * verschiebt und dabei eine Zusage bricht, die er nicht kannte. Gemessen mit
 * der WCAG-Formel, nicht mit dem Auge.
 */
export const VIOLETT = {
  50: '#f5f2ff', // weiss  1.10  dunkel 17.69
  100: '#e9e2fe', // weiss  1.25  dunkel 15.60
  200: '#d3c5fd', // weiss  1.59  dunkel 12.25
  300: '#b7a2fb', // weiss  2.19  dunkel  8.90
  400: '#9e82f8', // weiss  3.00  dunkel  6.51
  500: '#8763f3', // weiss  4.11  dunkel  4.75
  600: '#7245df', // weiss  5.78  dunkel  3.38
  700: '#5c2fbd', // weiss  8.09  dunkel  2.41
  800: '#4a2497', // weiss 10.55  dunkel  1.85
  900: '#321768', // weiss 14.40  dunkel  1.36
};

/**
 * Die zweite Ebene: Himmel.
 *
 * Kein zweites Markenzeichen, sondern das Licht HINTER dem Violett — die
 * Farbabsetzung, die Verläufe, Szenen und den Aufmacher davor bewahrt,
 * einfarbig zu sein. Sie setzt nie Text und zieht nie eine Kante; deshalb
 * braucht sie nur zwei Werte statt einer Leiter. Gemessen trotzdem:
 * `dunkel` hat 10.04:1 auf `#0d0a1a`, `hell` 5.27:1 auf Weiß — beide dürften
 * Text tragen, tun es aber absichtlich nicht.
 */
export const HIMMEL = {
  hell: '#2467d6',
  dunkel: '#79c0ff',
};

/**
 * Airlocks Leiter, Farbton 150° — sie bleibt, denn AIRLOCK behält Grün.
 *
 * Bis zum 29.08.2026 war das die MARKENLEITER; die Begründung von damals
 * (Airlocks Minz `#4EE296` liegt bei 149°, Stufe 400 dieser Leiter 13 von 441
 * Einheiten daneben — dasselbe Grün) gilt weiter, nur andersherum: die Leiter
 * gehört jetzt dem Produkt, nicht dem Dach. Die Kontraste neben den Stufen
 * sind gegen Weiß und gegen das alte `#0d1117` gemessen und bleiben als
 * Auskunft stehen, wo AIRLOCK-Grün Text oder Kante sein darf.
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
 * Er ist dunkel, und zwar in BEIDEN Schemata: #1d1830 im hellen, #120d22 im
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
 * Nachgemessen für Stufe 300: 7.81:1 auf #1d1830, 8.65:1 auf #120d22 und
 * 6.54:1 auf dem Inselgrund rgb(44,38,66). Stufe 400 wäre kräftiger im Ton,
 * fällt auf der Insel aber auf 4.79 — für ein Zeichen, das die Marke IST,
 * ist die hellere Stufe die richtige.
 */
const AUF_DUNKEL = `
  --marke-auf-dunkel: ${VIOLETT[300]};
`;

/**
 * Die Rollen im hellen Schema. Grund ist Weiß.
 *
 * `marke` trägt Text und braucht deshalb 4.5:1 — Stufe 700 hat 8.09 und ist
 * dabei das kräftigste Violett, das noch nicht ins Schwarze kippt. Stufe 600
 * hat 5.78 und zieht die Kanten (Fokusring, aktive Ränder); sie dürfte sogar
 * Text setzen, tut es aber nicht, damit Kante und Schrift zwei Stimmen bleiben.
 */
const MARKE_HELL = `
  --marke: ${VIOLETT[700]};
  --marke-stark: ${VIOLETT[900]};
  --marke-rand: ${VIOLETT[600]};
  --marke-flaeche: ${VIOLETT[50]};
  --marke-auf-flaeche: ${VIOLETT[900]};
  --marke-schimmer: rgba(92, 47, 189, 0.18);
  --knopf-flaeche: ${VIOLETT[800]};
  --knopf-flaeche-hover: ${VIOLETT[700]};
  --knopf-schrift: #ffffff;
  --himmel: ${HIMMEL.hell};
${AUF_DUNKEL}`;

/**
 * Dieselben Rollen im dunklen Schema. Grund ist `#0d0a1a`.
 *
 * Spiegelverkehrt und nicht dieselbe Zahl: auf fast schwarzem Grund trägt eine
 * dunkle Stufe keinen Text. Stufe 400 hat dort 6.51:1 und ist damit kräftig,
 * ohne ins Neon zu kippen — Stufe 300 hätte 8.90 und leuchtete; sie bleibt
 * `--marke-stark`. Der Rand ist Stufe 500 (4.75 auf der Nacht) und nicht wie
 * im Hellen Stufe 600, denn 600 fällt dort auf 3.38 — noch Kante, aber ohne
 * Reserve; ein Fokusring darf nicht an der Untergrenze balancieren.
 */
const MARKE_DUNKEL = `
  --marke: ${VIOLETT[400]};
  --marke-stark: ${VIOLETT[300]};
  --marke-rand: ${VIOLETT[500]};
  --marke-flaeche: #191035;
  --marke-auf-flaeche: ${VIOLETT[300]};
  --marke-schimmer: rgba(158, 130, 248, 0.24);
  --knopf-flaeche: ${VIOLETT[400]};
  --knopf-flaeche-hover: ${VIOLETT[300]};
  --knopf-schrift: #120833;
  --himmel: ${HIMMEL.dunkel};
${AUF_DUNKEL}`;

/*
 * ══ Der violette Knopf braucht ein PAAR, keine einzelne Farbe ═════════════
 *
 * Der Fehler, der beim grünen Knopf gemacht wurde, gilt hier wörtlich weiter:
 * eine Flächenfarbe und ihre Schriftfarbe sind zusammen eine Entscheidung.
 * Wer nur die Fläche umschaltet, hat die Hälfte umgeschaltet.
 *
 * Deshalb ein Paar, nachgemessen in beiden Schemata:
 *
 *   hell    Fläche #4a2497 (800), Schrift Weiß           10.55:1
 *           gegen die weiße Seite                        10.55:1
 *   dunkel  Fläche #9e82f8 (400), Schrift #120833         6.32:1
 *           gegen die dunkle Seite                        6.51:1
 *           Hover-Fläche #b7a2fb (300), Schrift #120833   8.64:1
 *
 * Weiße Schrift auf der dunklen Knopffläche hätte 3.00:1 und wäre unlesbar —
 * dieselbe Falle wie damals bei Grün (dort 1.64:1), nur weniger grell.
 */
export const MARKE = { hell: MARKE_HELL, dunkel: MARKE_DUNKEL };

// ---------------------------------------------------------------------------
// 1b. Die zweite Leiter: Amber für das Lizenzportal
// ---------------------------------------------------------------------------

/**
 * Amber, Farbton ~40°, **dieselbe Bauart wie Violett und Grün** — zehn Stufen,
 * jede mit ihrem gemessenen Kontrast, und die Zahlen entscheiden, wofür eine
 * taugt.
 *
 * ══ Warum das Portal eine eigene Farbe hat ════════════════════════════════
 *
 * Die Klammer zwischen den Skillry-Seiten ist die FORM: alle tragen dasselbe
 * S, dieselbe Konstruktion, einen Parameter auseinander. Eine geteilte Form
 * hält besser als eine geteilte Farbe, und damit darf die Farbe unterscheiden,
 * wofür sie gut ist: Violett das Dach, Grün das Werkzeug, Blau das Rollenspiel,
 * Amber die Lizenz.
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
 * Rollen, genau wie bei Violett.
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
 * Auf dem dunklen Kopfbalken gemessen: Stufe 300 hat 9.65:1, Stufe 400 hat
 * 8.30, Stufe 500 hat 6.86. Genommen wird 400 — kräftig genug und zugleich
 * das Marken-Amber selbst, damit das Zeichen im Kopf und das Zeichen auf der
 * Seite dieselbe Farbe haben.
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
