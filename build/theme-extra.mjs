/**
 * The louder half of the design.
 *
 * theme.mjs sets the quiet foundation — GitHub-adjacent, restrained, readable.
 * This file is what stops the site reading as a documentation page: an animated
 * hero that performs the product rather than describing it, alternating section
 * grounds so the page has rhythm, and the three accents used with conviction
 * instead of apologetically.
 *
 * Deliberately NOT here: a violet-to-blue gradient hero, glassmorphism, or a
 * three-across card grid of icons. Those are the house style of every AI landing
 * page shipped this year, and looking like everyone else is the one thing a
 * project about telling things apart cannot afford.
 */

export const CSS_EXTRA = `
/* ── grounds ────────────────────────────────────────────────────────────── */
.band { background: var(--bg-subtle); border-block: 1px solid var(--border); }
.band-tight { padding-block: clamp(32px, 5vw, 56px); }

/* ── hero ───────────────────────────────────────────────────────────────── */
.hero-stage { position: relative; overflow: hidden; isolation: isolate; }
.hero-stage canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: -1; opacity: 0.5; pointer-events: none;
}
.hero-stage::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(120% 90% at 12% 0%, transparent 30%, var(--bg) 78%);
}
@media (prefers-reduced-motion: reduce) { .hero-stage canvas { display: none; } }

.hero h1 .lit {
  background: linear-gradient(96deg, var(--airlock), var(--nexus) 58%, var(--accent-idx));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ── stat band ──────────────────────────────────────────────────────────── */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.stats > div { background: var(--surface); padding: 18px 20px; }
.stats .n { font-family: var(--mono); font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem); font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1.1; }
.stats .l { font-size: 0.78rem; color: var(--fg-muted); margin-top: 0.35rem; }
.stats .n.a { color: var(--airlock); }
.stats .n.n2 { color: var(--nexus); }
.stats .n.i { color: var(--accent-idx); }

/* ── cards with presence ────────────────────────────────────────────────── */
.card { transition: border-color 140ms ease, transform 140ms ease; }
.card.lift:hover { border-color: var(--border-strong); transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) { .card, .card.lift:hover { transition: none; transform: none; } }

.card.product { position: relative; overflow: hidden; }
.card.product::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 3px;
}
.card.product.airlock::before { background: linear-gradient(90deg, var(--airlock), transparent 85%); }
.card.product.nexus::before { background: linear-gradient(90deg, var(--nexus), transparent 85%); }
.card.product.index::before { background: linear-gradient(90deg, var(--accent-idx), transparent 85%); }
.card.product { border-top: 1px solid var(--border); }

.accent-index { color: var(--accent-idx); }

/* ── section heading with a rule ────────────────────────────────────────── */
.head-rule { display: flex; align-items: baseline; gap: 16px; }
.head-rule::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── pill row ───────────────────────────────────────────────────────────── */
.pills { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  font-size: 0.8rem; padding: 5px 12px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface); color: var(--fg-muted);
}
.pill.on { border-color: currentColor; }
.pill.a { color: var(--airlock); }
.pill.n2 { color: var(--nexus); }
.pill.i { color: var(--accent-idx); }

/* ── header search button ───────────────────────────────────────────────── */
.gh-search { cursor: pointer; border: 1px solid var(--header-border); font: inherit; font-size: 13px; text-align: left; }
button.gh-search { background: rgba(255,255,255,0.06); color: var(--header-fg); }

/* ── the reveal chip, reused from the tool ──────────────────────────────── */
.chip-hidden {
  display: inline-block; font-family: var(--mono); font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; margin-inline: 3px;
  border: 1px solid var(--danger); border-radius: 3px;
  background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger);
  vertical-align: baseline; white-space: nowrap;
}

/* ── forms ─────────────────────────────────────────────────────────────── */
.fld {
  width: 100%; padding: 10px 12px; margin: 4px 0 14px;
  border: 1px solid var(--border-strong); border-radius: var(--radius);
  background: var(--bg); color: var(--fg); font: inherit; font-size: 15px;
}
textarea.fld { resize: vertical; min-height: 96px; line-height: 1.6; }
.fld:focus { outline: 2px solid var(--link); outline-offset: 1px; border-color: var(--link); }

.prose { color: var(--fg); font-size: 0.96rem; }
.prose p { margin: 0 0 0.8em; }
.prose p:last-child { margin-bottom: 0; }
.skill h3 a { color: var(--fg); }
.skill h3 a:hover { color: var(--link); }

/* ── footer lift ────────────────────────────────────────────────────────── */
footer.site { position: relative; }
footer.site::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 2px;
  background: linear-gradient(90deg, var(--airlock), var(--nexus) 45%, var(--accent-idx) 80%, transparent);
  opacity: 0.75;
}
`;

/**
 * The hero background: glyphs resolving out of noise, left to right.
 *
 * It is the same motion the command-line tool uses for its wordmark, and it is
 * the only animation on the site — the page is about text that is not what it
 * appears to be, so the background quietly performs that instead of a generic
 * particle field.
 */
export const HERO_JS = `
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var NOISE = '01#$%&*+=<>/|¦{}[]()^~\\\\'.split('');
  var CHARS = 'abcdefghijklmnopqrstuvwxyz.,:;-_/'.split('');
  var COLS = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cell = 15;
  var rows = 0, cols = 0, t = 0, raf = 0;

  function palette() {
    var s = getComputedStyle(document.documentElement);
    return {
      dim: s.getPropertyValue('--fg-subtle').trim() || '#7d8590',
      hot: s.getPropertyValue('--airlock').trim() || '#4EE296',
      red: s.getPropertyValue('--danger').trim() || '#FF6146',
    };
  }
  var P = palette();

  function size() {
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(r.width / cell);
    rows = Math.ceil(r.height / cell);
    COLS = [];
    for (var i = 0; i < cols; i++) {
      COLS.push({ speed: 0.25 + ((i * 37) % 60) / 120, phase: ((i * 53) % 100) / 100 });
    }
  }

  // Deterministic per-cell glyph: no Math.random, so the field never flickers
  // incoherently between frames.
  function glyph(x, y, frame, set) {
    var h = (x * 73856093) ^ (y * 19349663) ^ (frame * 83492791);
    return set[Math.abs(h) % set.length];
  }

  function draw() {
    var w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';

    for (var x = 0; x < cols; x++) {
      var c = COLS[x];
      var front = ((t * c.speed * 0.02) + c.phase) % 1.6;
      var frontRow = front * rows;

      for (var y = 0; y < rows; y++) {
        var d = frontRow - y;
        if (d < 0 || d > 14) continue;

        var frame = Math.floor(t / 4);
        if (d < 2.5) {
          ctx.fillStyle = P.hot;
          ctx.globalAlpha = 0.5;
          ctx.fillText(glyph(x, y, frame, NOISE), x * cell, y * cell);
        } else {
          ctx.globalAlpha = Math.max(0, 0.26 - (d - 2.5) * 0.022);
          ctx.fillStyle = (x + y) % 23 === 0 ? P.red : P.dim;
          ctx.fillText(glyph(x, y, 0, CHARS), x * cell, y * cell);
        }
      }
    }
    ctx.globalAlpha = 1;
    t++;
    raf = requestAnimationFrame(draw);
  }

  var ro = new ResizeObserver(size);
  ro.observe(canvas);
  size();
  draw();

  // Stop when off screen; a background animation nobody is looking at is just
  // a battery drain.
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { if (!raf) { P = palette(); raf = requestAnimationFrame(draw); } }
      else { cancelAnimationFrame(raf); raf = 0; }
    });
  }).observe(canvas);

  document.getElementById('themeBtn')?.addEventListener('click', function () {
    setTimeout(function () { P = palette(); }, 30);
  });
})();`;
