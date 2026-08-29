/**
 * Design tokens and the stylesheet.
 *
 * The brand has two voices (build/marke.mjs): deep blue by day, powerful
 * violet by night, both layered over sky light. The neutrals follow the voice
 * of their scheme — blue-tinted white, violet-tinted night — rather than being
 * borrowed from GitHub's grey-blue. The header stays a dark colour space in
 * both schemes; that rule predates the palette and survives it.
 *
 * The product accents live alongside the one brand colour. A product owns its
 * colour on its own page and nowhere else, so a visitor learns that mint means
 * AIRLOCK, cyan means NEXUS and amber means the index without being told.
 */

import { BEWEGUNG, MARKE, RUHE, SCHRIFT, SCHRIFT_QUELLE } from './marke.mjs';

export const TOKENS = {
  airlock: '#4EE296',
  nexus: '#38D9FF',
  index: '#F5B942',
  danger: '#FF6146',
  /* Zwei weitere Produktakzente, dieselbe Regel wie bei allen: eine Farbe
     gehoert einem Bereich und tritt gross nur dort auf. Beide gemessen auf
     der Nacht #0d0a1a: Orange 8.33:1, Rosa 7.37:1. */
  scripts: '#FF8A3D',
  forum: '#F472B6',
};

/**
 * The two palettes, written once and used three times — the media query, and
 * the two explicit overrides the theme toggle stamps onto <html>. They used to
 * be three copies that had to be edited in lockstep, which is the kind of thing
 * that stays right until exactly one of them is forgotten.
 */
/*
 * Die Nacht ist kein neutrales Grau mehr, sondern ein tiefes Violett-Indigo.
 * Nachgemessen auf #0d0a1a: --fg 17.07:1, --fg-muted 7.44:1, --fg-subtle
 * 5.00:1, --link 8.31:1, --border-strong 3.65:1 (Kante eines Bedienelements,
 * WCAG 1.4.11 verlangt 3:1). Die Flaechen steigen in Stufen aus derselben
 * Familie — #161126 und #211939 — statt einfach heller zu werden: das ist die
 * Schichtung, aus der die Tiefe kommt.
 */
const DARK = `
  --bg: #0d0a1a;
  --bg-subtle: #070512;
  --surface: #161126;
  --surface-2: #211939;
  --border: #322950;
  --border-strong: #6f6494;
  --fg: #f1eefb;
  --fg-muted: #a49bbd;
  --fg-subtle: #857ba5;
  --link: #79a9ff;
  --header-bg: #120d22;
  --header-fg: #f1eefb;
  --header-border: #322950;
  --airlock: ${TOKENS.airlock};
  --nexus: ${TOKENS.nexus};
  --accent-idx: ${TOKENS.index};
  --accent-scr: ${TOKENS.scripts};
  --accent-forum: ${TOKENS.forum};
  --danger: ${TOKENS.danger};
  --ok: #3fb950;
  --shadow: 0 1px 0 rgba(255,255,255,0.04);
  --e1: 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(5,3,15,0.6);
  --e2: 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -8px rgba(5,3,15,0.85);
  --e3: 0 1px 0 rgba(255,255,255,0.06), 0 24px 48px -16px rgba(5,3,15,0.95);
  --sheen: inset 0 1px 0 rgba(255,255,255,0.045);
${MARKE.dunkel}`;

/*
 * Das helle Schema ist die Tagesstimme: Weiss mit BLAU getoenten Neutralen,
 * wie die Nacht violett getoent ist. Nachgemessen auf Weiss: --fg 15.71:1,
 * --fg-muted 6.43:1, --fg-subtle 3.84:1, --border-strong 3.32:1 (Kante eines
 * Bedienelements, WCAG 1.4.11 verlangt 3:1).
 */
const LIGHT = `
  --bg: #ffffff;
  --bg-subtle: #f4f7fd;
  --surface: #ffffff;
  --surface-2: #f4f7fd;
  --border: #d9dfee;
  /*
   * Die Kante eines BEDIENELEMENTS — Feld, Knopf, Griff. Nach WCAG 1.4.11
   * braucht sie 3:1 gegen ihren Grund, sonst ist nicht zu erkennen, wo das
   * Element aufhoert. Nachgemessen mit den alten Werten:
   *
   *     hell   #b7c0c9 auf #ffffff   1.84:1
   *     dunkel #545d68 auf #0d1117   2.83:1
   *
   * Beide zu schwach. Mit den zwei Markenstimmen neu gemessen:
   *
   *     hell   #7f8dae auf #ffffff   3.32:1  (blau getoent)
   *     dunkel #6f6494 auf #0d0a1a   3.65:1  (violett getoent)
   *
   * Nicht zu verwechseln mit --border: das ist die Kante einer FLAECHE
   * (Karte, Trennlinie). Fuer die gilt die Regel nicht, und eine Karte mit
   * 3:1-Rand sieht aus wie ein Formularfeld.
   */
  --border-strong: #7f8dae;
  --fg: #1b2334;
  --fg-muted: #525f78;
  --fg-subtle: #76829f;
  --link: #0969da;
  --header-bg: #182342;
  --header-fg: #ffffff;
  --header-border: #2d3a5e;
  --airlock: #0f7a4f;
  --nexus: #0a7ea4;
  --accent-idx: #9a6700;
  --accent-scr: #c2410c;
  --accent-forum: #be2f6f;
  --danger: #cf222e;
  --ok: #1a7f37;
  --shadow: 0 1px 3px rgba(27,35,52,0.08);
  --e1: 0 1px 2px rgba(27,35,52,0.06), 0 1px 3px rgba(27,35,52,0.05);
  --e2: 0 2px 4px rgba(27,35,52,0.05), 0 8px 20px -6px rgba(27,35,52,0.10);
  --e3: 0 4px 8px rgba(27,35,52,0.06), 0 20px 40px -12px rgba(27,35,52,0.16);
  --sheen: inset 0 1px 0 rgba(255,255,255,0.6);
${MARKE.hell}`;

export const CSS = `${SCHRIFT_QUELLE}

:root {
${SCHRIFT}${BEWEGUNG}${MARKE.hell}
  --bg: #ffffff;
  --bg-subtle: #f4f7fd;
  --surface: #ffffff;
  --surface-2: #f4f7fd;
  --border: #d9dfee;
  --border-strong: #7f8dae;
  --fg: #1b2334;
  --fg-muted: #525f78;
  --fg-subtle: #76829f;
  --link: #0969da;
  --header-bg: #182342;
  --header-fg: #ffffff;
  --header-border: #2d3a5e;
  --airlock: #0f7a4f;
  --nexus: #0a7ea4;
  --accent-idx: #9a6700;
  --accent-scr: #c2410c;
  --accent-forum: #be2f6f;
  --danger: #cf222e;
  --ok: #1a7f37;
  --shadow: 0 1px 3px rgba(27,35,52,0.08);

  /**
   * Three levels of elevation rather than one flat shade.
   *
   * Each is two shadows: a tight one that reads as a contact edge, and a wide
   * soft one that reads as distance. A single blurred shadow gives the grey
   * halo that makes a light-mode page look washed out — the tight layer is what
   * keeps the card's edge crisp while the soft layer does the lifting.
   */
  --e1: 0 1px 2px rgba(27,35,52,0.06), 0 1px 3px rgba(27,35,52,0.05);
  --e2: 0 2px 4px rgba(27,35,52,0.05), 0 8px 20px -6px rgba(27,35,52,0.10);
  --e3: 0 4px 8px rgba(27,35,52,0.06), 0 20px 40px -12px rgba(27,35,52,0.16);
  /* A hairline of light along the top edge. Free depth, costs no layout. */
  --sheen: inset 0 1px 0 rgba(255,255,255,0.6);

  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

  --w: 1280px;
  --radius: 8px;
  --radius-lg: 14px;

  /* Motion, named once so a single line can slow the whole site down. */
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --fast: 140ms;
  --slow: 420ms;
}

/**
 * Dark mode is not the light palette inverted.
 *
 * Shadows do almost nothing on a dark ground — there is no light to occlude —
 * so depth there comes from the surface getting *lighter* as it rises, and
 * from a hairline along the top edge. Keeping --e1..--e3 defined in both modes
 * means components never have to ask which mode they are in.
 */
@media (prefers-color-scheme: dark) {
  :root { ${DARK} }
}
:root[data-theme="dark"] { ${DARK} }
:root[data-theme="light"] { ${LIGHT} }

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }

/*
 * WARUM DIESE REGEL WICHTIG IST — UND WARUM MIT !important
 *
 * Das hidden-Attribut wirkt nur ueber die Standardregel des Browsers,
 * [hidden] { display: none }. Die hat die niedrigste Stufe, die es gibt.
 * JEDE eigene display-Regel schlaegt sie — auch eine so harmlose wie
 * .gh-signin { display: inline-flex }.
 *
 * Genau das ist passiert: im Kopf standen der Anmelde-Link und der
 * Konto-Knopf. Das Skript setzt brav das eine auf hidden und das andere
 * nicht. Sichtbar waren trotzdem beide — angemeldet stand rechts oben
 * "Anmelden" NEBEN dem eigenen Namen, abgemeldet zweimal "Anmelden".
 *
 * Das Tueckische daran: im Skript ist nichts falsch, und getComputedStyle
 * meldet display: inline-flex, was ja auch stimmt. Man sieht den Fehler nur
 * auf dem Bildschirm.
 *
 * !important ist hier kein Notnagel, sondern die Bedeutung selbst: hidden
 * heisst "das gibt es fuer diesen Zustand nicht". Etwas, das es nicht gibt,
 * kann kein Layout mehr ueberstimmen.
 */
[hidden] { display: none !important; }
/* Die eine Ruheregel fuer die ganze Seite. Sie steht in build/marke.mjs, weil
   sie zur Bewegung gehoert und nicht zu dieser Seite — Portal und Panel
   bekommen dieselbe. Die drei aelteren Bloecke in theme-extra.mjs schalten
   daneben einzelne Bewegungen ab; sie bleiben, denn sie sagen genauer, was dort
   statt der Bewegung passieren soll.

   KEINE RUECKSTRICHE IN DIESEM KOMMENTAR. Er steht innerhalb eines
   Template-Literals, und ein Rueckstrich darin beendet es — die Datei laesst
   sich dann nicht mehr laden, und der Fehler heisst "Unexpected identifier". */
${RUHE}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
  /*
   * HIER STAND overflow-x: hidden — UND IST BEWUSST WEG
   *
   * Die Regel hat einen Preis, den sie nicht wert war: hidden macht aus body
   * einen Scrollbehaelter, auch in der Achse, die gar nicht abgeschnitten
   * wird (overflow-y wird dabei stillschweigend zu auto). Und ein
   * Scrollbehaelter ist der Bezugsrahmen fuer alles darin mit
   * position: sticky. Die Seitenspalten der Anmeldung klebten dadurch an
   * einem Behaelter, der selbst nie scrollt, waehrend sichtbar das Fenster
   * scrollte — gemessen: 300px gescrollt, 300px mitgewandert, obwohl
   * getComputedStyle brav "sticky" meldete.
   *
   * Der naheliegende Tausch gegen clip half nicht. Gemessen bei 1400px
   * Fenster mit einem 3000px breiten Kind, jeweils ob sich waagerecht
   * scrollen laesst:
   *
   *     body: hidden   riegelt ab       html: hidden   wirkungslos
   *     body: clip     wirkungslos      html: clip     wirkungslos
   *
   * Auf dem Wurzelelement wandert overflow ins Viewport ab, und clip auf body
   * riegelt nicht ab. Es gab also nur hidden oder nichts.
   *
   * Nachgemessen wurde deshalb, wovor die Regel ueberhaupt schuetzt: 15 Seiten
   * in beiden Sprachen, bei 360px und bei 768px, mit abgeschalteter Regel.
   * Kein einziger Ueberlauf. Sie hat nichts abgefangen — sie haette nur etwas
   * verdeckt, falls es je auftritt.
   *
   * Und genau das ist der zweite Grund: eine Regel, die Ueberlauf versteckt,
   * versteckt den Fehler, der ihn verursacht. Waagerechter Ueberlauf gehoert
   * dort behoben, wo er entsteht.
   */
  -webkit-font-smoothing: antialiased;
  /* Real punctuation and proportional-looking numerals in running text. */
  font-variant-numeric: proportional-nums;
  text-rendering: optimizeLegibility;
}

::selection { background: color-mix(in srgb, var(--marke) 28%, transparent); color: var(--fg); }

/**
 * Links get an underline that sits below the baseline instead of through the
 * descenders, and thickens on hover rather than appearing from nothing — the
 * appearing kind makes the line jump by a pixel as you move across it.
 */
a {
  color: var(--link);
  text-decoration: none;
  text-underline-offset: 0.18em;
  text-decoration-thickness: 1px;
  transition: color var(--fast) var(--ease), text-decoration-color var(--fast) var(--ease);
}
a:hover { text-decoration: underline; text-decoration-thickness: 2px; }
/* Der Fokusring ist gruen, und das ist der sichtbarste der kleinen Akzente:
   er ist das Erste, was jemand sieht, der die Seite mit der Tastatur benutzt.
   --marke-rand hat in beiden Schemata mehr als 3:1 gegen den Grund (hell 3.53,
   dunkel 5.37) und traegt damit als Kante eines Bedienelements. */
:focus-visible { outline: 2px solid var(--marke-rand); outline-offset: 2px; border-radius: 3px; }

/**
 * Display sizes want tighter tracking than body text: the same letter-spacing
 * that steadies 16px makes 48px look loose. The scale steps by roughly 1.25
 * and each level tightens a little further.
 */
h1, h2, h3, h4 { margin: 0; line-height: 1.18; font-weight: 650; text-wrap: balance; }
h1 { font-size: clamp(2.1rem, 1.4rem + 2.8vw, 3.6rem); letter-spacing: -0.028em; line-height: 1.06; }
h2 { font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem); letter-spacing: -0.021em; }
h3 { font-size: 1.18rem; letter-spacing: -0.011em; }
h4 { font-size: 1rem; letter-spacing: -0.006em; }

/* Avoids the single-word last line that makes a paragraph look unfinished. */
p { margin: 0; text-wrap: pretty; }

code, kbd, .mono { font-family: var(--mono); font-size: 0.875em; font-variant-ligatures: none; }
code:not(pre code) {
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  border: 1px solid var(--border);
  padding: 0.12em 0.38em; border-radius: 5px;
}

.wrap { max-width: var(--w); margin: 0 auto; padding: 0 24px; }
.narrow { max-width: 68ch; }
/* When .narrow sits on the .wrap itself, keep the wrap full width and constrain
   its children instead — otherwise the column re-centres and the page loses its
   left edge from one section to the next. */
.wrap.narrow { max-width: var(--w); }
.wrap.narrow > * { max-width: 68ch; }
.stack { display: flex; flex-direction: column; gap: 1rem; }
.stack-lg { display: flex; flex-direction: column; gap: 2rem; }
.muted { color: var(--fg-muted); }
.small { font-size: 0.875rem; }
.center { text-align: center; }
section { padding: clamp(48px, 7vw, 88px) 0; }
.divider { border: 0; border-top: 1px solid var(--border); margin: 0; }

/* ── header ─────────────────────────────────────────────────────────────── */
/*
 * Kein Grund und keine Unterkante mehr: der Kopf besteht aus Inseln
 * (build/header.mjs), und ein durchgezogener Strich unter der Navigation
 * war der Rest des alten Balkens — eine Kante, die etwas abschloss, das es
 * nicht mehr gibt. Die Seite laeuft jetzt frei unter den Inseln durch.
 */
.gh-header { position: sticky; top: 0; z-index: 50; }
.gh-header .wrap { display: flex; align-items: center; gap: 16px; height: 62px; }
.gh-logo { display: flex; align-items: center; gap: 10px; color: var(--header-fg); font-weight: 600; font-size: 15px; letter-spacing: 0.02em; flex: none; }
.gh-logo:hover { text-decoration: none; opacity: 0.85; }
.gh-logo svg { display: block; }

.gh-nav { display: flex; gap: 4px; align-items: center; flex: 1; min-width: 0; }
.gh-nav a {
  color: var(--header-fg); font-size: 14px; font-weight: 500;
  padding: 6px 10px; border-radius: var(--radius); opacity: 0.85; white-space: nowrap;
}
.gh-nav a:hover { opacity: 1; background: rgba(255,255,255,0.08); text-decoration: none; }
.gh-nav a[aria-current="page"] { opacity: 1; background: rgba(255,255,255,0.1); }

.gh-actions { display: flex; align-items: center; gap: 8px; flex: none; }
.gh-search {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.06); border: 1px solid var(--header-border);
  border-radius: var(--radius); padding: 5px 10px; color: var(--header-fg);
  font-size: 13px; min-width: 200px; opacity: 0.8;
}
.gh-search:hover { opacity: 1; text-decoration: none; border-color: var(--border-strong); }
.gh-search kbd {
  margin-left: auto; border: 1px solid var(--header-border); border-radius: 4px;
  padding: 1px 5px; font-size: 11px; opacity: 0.75;
}
.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius);
  border: 1px solid var(--header-border); background: rgba(255,255,255,0.06);
  color: var(--header-fg); cursor: pointer; padding: 0;
}
.icon-btn:hover { background: rgba(255,255,255,0.14); }
.lang-switch { display: flex; gap: 2px; align-items: center; }
.lang-switch a svg { display: block; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,0.25); }
.lang-switch a {
  color: var(--header-fg); font-size: 14px; padding: 5px 8px; border-radius: var(--radius);
  opacity: 0.55; line-height: 1;
}
.lang-switch a:hover { opacity: 1; background: rgba(255,255,255,0.08); text-decoration: none; }
.lang-switch a[aria-current="true"] { opacity: 1; background: rgba(255,255,255,0.12); }

@media (max-width: 940px) {
  .gh-search { display: none; }
  .gh-nav { overflow-x: auto; scrollbar-width: none; }
  .gh-nav::-webkit-scrollbar { display: none; }
}
/*
 * The rule that used to stand here hid the wordmark below 620px — from the days
 * when it was the site name set in the same interface font as everything else,
 * and therefore expendable. It is now a serif that carries the whole of the
 * branding, and hiding it left every phone visitor looking at an unlabelled
 * symbol. Sizing down is the answer; disappearing is not. What the header does
 * at each width is decided in build/header.mjs.
 *
 * Note for anyone editing this file: it is one long template literal, so a
 * backtick in a comment ends the stylesheet. That is exactly how this comment
 * broke the build the first time it was written.
 */

/* ── hero ───────────────────────────────────────────────────────────────── */
.hero { padding: clamp(56px, 9vw, 112px) 0 clamp(40px, 6vw, 72px); }
.hero h1 { max-width: 20ch; }
.hero .lede { font-size: clamp(1.05rem, 1rem + 0.4vw, 1.3rem); color: var(--fg-muted); max-width: 58ch; margin-top: 1rem; }
.eyebrow {
  font-family: var(--mono); font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--fg-subtle);
  display: block; margin-bottom: 0.9rem;
}

/* ── buttons ────────────────────────────────────────────────────────────── */
.btn-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 2rem; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: var(--radius); font-size: 15px; font-weight: 600;
  border: 1px solid var(--border-strong); background: var(--surface); color: var(--fg);
  cursor: pointer; box-shadow: var(--e1), var(--sheen);
  transition: transform var(--fast) var(--ease), box-shadow var(--fast) var(--ease),
              border-color var(--fast) var(--ease), background var(--fast) var(--ease);
}
.btn:hover { text-decoration: none; border-color: var(--fg-muted); background: var(--surface-2); box-shadow: var(--e2), var(--sheen); transform: translateY(-1px); }
/* Pressing has to move the thing down again, or the button feels stuck up. */
.btn:active { transform: translateY(0); box-shadow: var(--e1); }
/* Der Hauptknopf traegt die Markenfarbe (blau bei Tag, violett bei Nacht) —
   die zweite Stelle, an der die Marke handelt.
   Flaeche UND Schrift kommen als Paar aus build/marke.mjs: im dunklen Schema
   ist die violette Flaeche hell, und weisse Schrift darauf haette 3.00:1. Die
   ausfuehrliche Begruendung steht dort. Das Innenlicht an der Oberkante ist
   dieselbe Koerper-Regel wie bei den Inseln im Kopf: eine Flaeche mit Licht
   an der Kante liest sich als Ding, nicht als Anstrich. */
.btn-primary {
  background: var(--knopf-flaeche); color: var(--knopf-schrift); border-color: var(--knopf-flaeche);
  box-shadow: var(--e1), inset 0 1px 0 rgba(255,255,255,0.16), 0 0 0 0 var(--marke-schimmer);
}
.btn-primary:hover {
  background: var(--knopf-flaeche-hover); border-color: var(--knopf-flaeche-hover);
  color: var(--knopf-schrift);
  box-shadow: var(--e2), inset 0 1px 0 rgba(255,255,255,0.16), 0 0 0 4px var(--marke-schimmer);
}

/* ── cards ──────────────────────────────────────────────────────────────── */
.grid { display: grid; gap: 20px; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }

.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--e1), var(--sheen);
  display: flex; flex-direction: column; gap: 0.7rem;
}
.card h3 { display: flex; align-items: center; gap: 9px; }
.card .tag {
  font-family: var(--mono); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em;
  text-transform: uppercase; padding: 2px 7px; border-radius: 999px;
  border: 1px solid currentColor;
}
.accent-airlock { color: var(--airlock); }
.accent-nexus { color: var(--nexus); }
.card.product { border-top: 3px solid var(--border); }
.card.product.airlock { border-top-color: var(--airlock); }
.card.product.nexus { border-top-color: var(--nexus); }
.card ul { margin: 0; padding-left: 1.1rem; color: var(--fg-muted); font-size: 0.94rem; }
.card li { margin-bottom: 0.3rem; }

/* ── code ───────────────────────────────────────────────────────────────── */
pre {
  margin: 0; padding: 16px 18px; overflow-x: auto;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: var(--radius); font-family: var(--mono); font-size: 0.83rem; line-height: 1.65;
  color: var(--fg);
}
pre .c { color: var(--fg-subtle); }
pre .g { color: var(--ok); }
pre .r { color: var(--danger); }
pre .b { color: var(--link); }
.terminal { background: #0d0a1a; border-color: #322950; color: #ece8f8; }
.terminal .c { color: #857ba5; }

/* ── tables ─────────────────────────────────────────────────────────────── */
.table-scroll { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
th { background: var(--surface-2); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-muted); font-weight: 600; }
tr:last-child td { border-bottom: 0; }

/* ── catalogue ──────────────────────────────────────────────────────────── */
.filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 1.5rem 0; }
.search-box {
  flex: 1 1 280px; display: flex; align-items: center; gap: 10px;
  border: 1px solid var(--border-strong); border-radius: var(--radius);
  background: var(--surface); padding: 9px 13px;
}
.search-box input {
  flex: 1; border: 0; background: transparent; color: var(--fg);
  font: inherit; font-size: 15px; outline: none; min-width: 0;
}
.chip {
  font-size: 13px; padding: 6px 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--border); background: var(--surface); color: var(--fg-muted);
}
.chip:hover { border-color: var(--border-strong); color: var(--fg); }
.chip[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
/*
 * Die Zahl im Filterknopf sagt, wie viele Eintraege dahinter liegen.
 *
 * Sie ist der Grund, warum die Reihe kurz sein darf: ein Filter ohne Zahl ist
 * ein Versprechen, ein Filter mit Zahl ist eine Auskunft. Wer "community 8"
 * liest, weiss vor dem Klick, ob sich der Klick lohnt.
 *
 * Tabellenziffern, damit die Zahlen untereinander nicht wackeln.
 */
.chip-n {
  margin-left: 7px; opacity: 0.55;
  font-variant-numeric: tabular-nums; font-size: 0.9em;
}
.chip[aria-pressed="true"] .chip-n { opacity: 0.7; }

.skill-list { display: grid; gap: 12px; }
.skill {
  display: grid; grid-template-columns: 1fr auto; gap: 6px 16px; align-items: start;
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--border); border-radius: var(--radius); padding: 16px 18px;
}
.skill.verdict-pass { border-left-color: var(--ok); }
.skill.verdict-review { border-left-color: #bf8700; }
.skill.verdict-block { border-left-color: var(--danger); }
.skill.verdict-unscanned { border-left-color: var(--border-strong); }
/* Nicht scannbar traegt eine GESTRICHELTE Kante. "Noch nicht geprueft" und
   "hier gibt es nichts zu pruefen" duerfen nicht gleich aussehen -- sonst
   liest sich das zweite als das erste, also als offene Aufgabe. */
.skill.verdict-unscannable { border-left-color: var(--border-strong); border-left-style: dashed; }
.skill h3 { font-size: 1rem; }
.skill .meta { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 0.8rem; color: var(--fg-subtle); font-family: var(--mono); }
.skill .desc { grid-column: 1; color: var(--fg-muted); font-size: 0.92rem; }
.verdict {
  font-family: var(--mono); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 3px 8px; border-radius: 4px; white-space: nowrap;
  border: 1px solid currentColor;
}
.v-pass { color: var(--ok); }
.v-review { color: #bf8700; }
.v-block { color: var(--danger); }
.v-unscanned { color: var(--fg-subtle); }
.v-unscannable { color: var(--fg-subtle); border-style: dashed; }
.empty { padding: 40px; text-align: center; color: var(--fg-muted); border: 1px dashed var(--border); border-radius: var(--radius); }

/* ── notes ──────────────────────────────────────────────────────────────── */
.note {
  border: 1px solid var(--border); border-left: 3px solid var(--fg-subtle);
  border-radius: var(--radius); padding: 16px 20px; background: var(--surface);
}
.note.warn { border-left-color: #bf8700; }
.note.danger { border-left-color: var(--danger); }
.note.ok { border-left-color: var(--ok); }
.note h3 { font-size: 1rem; margin-bottom: 0.4rem; }
.note p { color: var(--fg-muted); }

/* ── levels (learn) ─────────────────────────────────────────────────────── */
.level-toggle { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius); overflow: hidden; }
.level-toggle button {
  border: 0; background: var(--surface); color: var(--fg-muted); font: inherit; font-size: 14px;
  padding: 8px 16px; cursor: pointer; border-right: 1px solid var(--border);
}
.level-toggle button:last-child { border-right: 0; }
.level-toggle button[aria-pressed="true"] { background: var(--fg); color: var(--bg); }
.lvl { display: none; }
.lvl.on { display: block; }

/* ── steps ──────────────────────────────────────────────────────────────── */
.steps { counter-reset: s; display: flex; flex-direction: column; gap: 1.4rem; }
.step { display: grid; grid-template-columns: 34px 1fr; gap: 16px; align-items: start; }
.step::before {
  counter-increment: s; content: counter(s);
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
  border: 1px solid var(--border-strong); font-family: var(--mono); font-size: 13px;
  font-weight: 700; color: var(--fg-muted);
}
.step h3 { margin-bottom: 0.3rem; }

/* ── footer ─────────────────────────────────────────────────────────────── */
/*
 * ══ DER FUSS BESTEHT AUS INSELN, WIE DER KOPF ═════════════════════════════
 *
 * Vorher: ein Streifen in --bg-subtle mit Oberkante, darin fuenf Spalten, die
 * nur durch Abstand getrennt waren. Jetzt traegt jede Spalte ihre eigene
 * Flaeche, und die Grundzeile darunter ihre eigene. Die Luecken sind der
 * Entwurf, genau wie oben.
 *
 * ══ Und ein Unterschied zum Kopf, der wichtig ist ═════════════════════════
 *
 * Der Kopf ist sein eigener Farbraum -- dunkel in BEIDEN Schemata, weil sich
 * das, was darin steht, danach richtet und nicht danach, ob die Seite hell
 * ist. Der Fuss steht dagegen AUF der Seite. Seine Inseln gehen deshalb mit
 * dem Schema mit und nehmen --surface: das ist im Dunklen #161126 ueber
 * #0d0a1a und im Hellen #ffffff ueber #f7f5fb. In beiden Faellen liegt die
 * Insel HELLER als ihr Grund und liest sich damit als angehoben.
 *
 * Haette ich hier die dunklen Kopf-Token genommen, saesse im hellen Schema
 * ein schwarzer Block unter einer weissen Seite.
 *
 * Der Radius ist derselbe wie oben (--insel-r), damit Kopf und Fuss als
 * dieselbe Sprache lesbar sind, und die Verweise darin tragen den kleineren
 * Innenradius.
 */
footer.site {
  background: transparent;
  padding: 12px 0 40px; margin-top: 56px;
}
footer.site .cols {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: clamp(8px, 0.9vw, 14px);
}
/*
 * Dieselbe Rezeptur wie .card, und das mit Absicht: --surface, --border,
 * --e1 UND --sheen.
 *
 * Das Innenlicht ist der Teil, den man beim Nachmessen uebersieht. Die
 * Fuellung allein steht im Dunklen nur 1.1:1 ueber der Seite -- das liest man
 * kaum. Was die Insel traegt, sind Kante und Oberkantenlicht zusammen, und
 * genau so steht es auch in DESIGN.md: Tiefe kommt aus Flaechen und Kanten
 * zuerst, aus Schatten zuletzt.
 *
 * Eine eigene, hellere Fuellung nur fuer den Fuss waere die falsche Antwort
 * gewesen: --surface-2 ist im hellen Schema #f7f5fb und laege damit fast
 * unsichtbar auf dem weissen Grund. Die Kartenrezeptur ist fuer beide
 * Schemata schon geloest.
 */
footer.site .cols > div,
footer.site .base {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--insel-r);
  box-shadow: var(--e1), var(--sheen);
  padding: 18px 18px 20px;
  transition: border-color var(--mittel) var(--ease), box-shadow var(--mittel) var(--ease);
}
footer.site .cols > div:hover { border-color: var(--border-strong); box-shadow: var(--e2), var(--sheen); }

footer.site h4 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.09em; color: var(--fg-subtle); margin: 0 0 0.7rem; }
footer.site ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
/* Die Verweise sitzen in der Schale und bekommen deshalb den Innenradius --
   und einen eigenen Innenabstand, damit die Flaeche beim Ueberfahren nicht
   an der Schriftkante klebt. */
footer.site a {
  color: var(--fg-muted); font-size: 0.9rem;
  display: block; padding: 5px 8px; margin-inline: -8px;
  border-radius: var(--insel-r-innen);
  transition: color var(--kurz) var(--ease), background-color var(--kurz) var(--ease);
}
footer.site a:hover { color: var(--fg); background: var(--surface-2); text-decoration: none; }
/*
 * Der Sockel: drei Zeilen mit drei Stimmen. Vorher teilten sich Lizenz,
 * Verhaltenssatz und Rockstar-Hinweis einen Streifen mit space-between —
 * drei Saetze in drei Laengen, nebeneinander gequetscht, lasen sich wie
 * Kleingedrucktes. Jetzt: Zeichen und Lizenz oben (wer die Seite ist),
 * darunter der Verhaltenssatz (wie sie sich benimmt), zuunterst der
 * Pflichthinweis ueber seiner eigenen Haarlinie.
 */
footer.site .base {
  margin-top: clamp(8px, 0.9vw, 14px);
  display: flex; flex-direction: column; gap: 10px;
  color: var(--fg-subtle); font-size: 0.84rem;
}
footer.site .base p { margin: 0; max-width: 88ch; }
footer.site .base-marke {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  color: var(--fg);
}
footer.site .base-marke .mark { color: var(--marke); flex: none; }
footer.site .base-name {
  font-family: var(--anzeige); font-weight: 700; font-size: 1rem; letter-spacing: -0.004em;
}
footer.site .base-rechte { color: var(--fg-subtle); }
/* Der Rockstar-Hinweis bekommt eine eigene Zeile ueber eigener Haarlinie.
   **Und er wird ausdruecklich nicht kleiner gesetzt als der Rest**: die Cfx.re
   Platform License Agreement verlangt ihn deutlich sichtbar, und ein Hinweis in
   Achtelpunkt erfuellt eine Pflicht nur dem Buchstaben nach. */
footer.site .base .disclaimer {
  letter-spacing: .01em;
  border-top: 1px solid var(--border); padding-top: 10px; margin-top: 2px;
}
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;
