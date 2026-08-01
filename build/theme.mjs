/**
 * Design tokens and the stylesheet.
 *
 * The header borrows GitHub's proportions on purpose: anyone arriving from a
 * repository should feel like they never left. Everything below the header is
 * ours.
 *
 * Two product accents live alongside one site accent. A product owns its colour
 * on its own page and nowhere else, so a visitor learns that green means AIRLOCK
 * and cyan means NEXUS without being told.
 */

export const TOKENS = {
  airlock: '#4EE296',
  nexus: '#38D9FF',
  index: '#F5B942',
  danger: '#FF6146',
};

/**
 * The two palettes, written once and used three times — the media query, and
 * the two explicit overrides the theme toggle stamps onto <html>. They used to
 * be three copies that had to be edited in lockstep, which is the kind of thing
 * that stays right until exactly one of them is forgotten.
 */
const DARK = `
  --bg: #0d1117;
  --bg-subtle: #010409;
  --surface: #161c24;
  --surface-2: #212830;
  --border: #30363d;
  --border-strong: #545d68;
  --fg: #f0f6fc;
  --fg-muted: #9198a1;
  --fg-subtle: #7d8590;
  --link: #4493f8;
  --header-bg: #10151c;
  --header-fg: #f0f6fc;
  --header-border: #30363d;
  --airlock: ${TOKENS.airlock};
  --nexus: ${TOKENS.nexus};
  --accent-idx: ${TOKENS.index};
  --danger: ${TOKENS.danger};
  --ok: #3fb950;
  --shadow: 0 1px 0 rgba(255,255,255,0.04);
  --e1: 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(1,4,9,0.6);
  --e2: 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -8px rgba(1,4,9,0.85);
  --e3: 0 1px 0 rgba(255,255,255,0.06), 0 24px 48px -16px rgba(1,4,9,0.95);
  --sheen: inset 0 1px 0 rgba(255,255,255,0.045);
`;

const LIGHT = `
  --bg: #ffffff;
  --bg-subtle: #f6f8fa;
  --surface: #ffffff;
  --surface-2: #f6f8fa;
  --border: #d8dee4;
  --border-strong: #b7c0c9;
  --fg: #1f2328;
  --fg-muted: #59636e;
  --fg-subtle: #818b98;
  --link: #0969da;
  --header-bg: #1c2128;
  --header-fg: #ffffff;
  --header-border: #32383f;
  --airlock: #0f7a4f;
  --nexus: #0a7ea4;
  --accent-idx: #9a6700;
  --danger: #cf222e;
  --ok: #1a7f37;
  --shadow: 0 1px 3px rgba(31,35,40,0.08);
  --e1: 0 1px 2px rgba(31,35,40,0.06), 0 1px 3px rgba(31,35,40,0.05);
  --e2: 0 2px 4px rgba(31,35,40,0.05), 0 8px 20px -6px rgba(31,35,40,0.10);
  --e3: 0 4px 8px rgba(31,35,40,0.06), 0 20px 40px -12px rgba(31,35,40,0.16);
  --sheen: inset 0 1px 0 rgba(255,255,255,0.6);
`;

export const CSS = `
:root {
  --bg: #ffffff;
  --bg-subtle: #f6f8fa;
  --surface: #ffffff;
  --surface-2: #f6f8fa;
  --border: #d1d9e0;
  --border-strong: #b7c0c9;
  --fg: #1f2328;
  --fg-muted: #59636e;
  --fg-subtle: #818b98;
  --link: #0969da;
  --header-bg: #24292f;
  --header-fg: #ffffff;
  --header-border: #32383f;
  --airlock: #0f7a4f;
  --nexus: #0a7ea4;
  --accent-idx: #9a6700;
  --danger: #cf222e;
  --ok: #1a7f37;
  --shadow: 0 1px 3px rgba(31,35,40,0.08);

  /**
   * Three levels of elevation rather than one flat shade.
   *
   * Each is two shadows: a tight one that reads as a contact edge, and a wide
   * soft one that reads as distance. A single blurred shadow gives the grey
   * halo that makes a light-mode page look washed out — the tight layer is what
   * keeps the card's edge crisp while the soft layer does the lifting.
   */
  --e1: 0 1px 2px rgba(31,35,40,0.06), 0 1px 3px rgba(31,35,40,0.05);
  --e2: 0 2px 4px rgba(31,35,40,0.05), 0 8px 20px -6px rgba(31,35,40,0.10);
  --e3: 0 4px 8px rgba(31,35,40,0.06), 0 20px 40px -12px rgba(31,35,40,0.16);
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
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  /* Real punctuation and proportional-looking numerals in running text. */
  font-variant-numeric: proportional-nums;
  text-rendering: optimizeLegibility;
}

::selection { background: color-mix(in srgb, var(--airlock) 28%, transparent); color: var(--fg); }

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
:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; border-radius: 3px; }

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
.gh-header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  position: sticky; top: 0; z-index: 50;
}
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
.btn-primary { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.btn-primary:hover { background: var(--fg-muted); border-color: var(--fg-muted); color: var(--bg); }

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
.terminal { background: #0d1117; border-color: #30363d; color: #e6edf3; }
.terminal .c { color: #7d8590; }

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
footer.site {
  border-top: 1px solid var(--border); background: var(--bg-subtle);
  padding: 44px 0 60px; margin-top: 40px;
}
footer.site .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 28px; }
footer.site h4 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.09em; color: var(--fg-subtle); margin-bottom: 0.7rem; }
footer.site ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.45rem; }
footer.site a { color: var(--fg-muted); font-size: 0.9rem; }
footer.site a:hover { color: var(--fg); }
footer.site .base { margin-top: 32px; padding-top: 22px; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; color: var(--fg-subtle); font-size: 0.84rem; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;
