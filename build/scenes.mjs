/**
 * A different atmosphere behind every main page.
 *
 * The mark stays the constant — every hero keeps the displaced text-lines that
 * are the brand. What changes underneath is the room the page is standing in,
 * so somebody who lands on AIRLOCK and then on the index knows they moved
 * without reading the heading.
 *
 * Three rules the scenes are built under, and none of them are negotiable:
 *
 *   1. Nothing may sit behind running text. Every scene is drawn into the
 *      margins and the empty upper band, and masked away from the column where
 *      the words are. A background that competes with a paragraph is a
 *      background that made the paragraph worse.
 *   2. Both modes. A sky that works on white is a smear on near-black, so each
 *      scene carries its own dark-mode values rather than being dimmed.
 *   3. Pure CSS, no images, no script, `position: fixed` so nothing is
 *      repainted while scrolling. The site fetches nothing from anyone, and a
 *      decoration is the worst possible reason to break that.
 */

export const SCENE_CSS = `
/*
 * The layer itself. Fixed, behind everything, never interactive. contain and
 * a promoted layer keep it off the main thread while scrolling — a full-page
 * gradient repainting at 60fps is how a static site starts feeling heavy.
 */
.scene {
  position: fixed; inset: 0; z-index: -2; pointer-events: none;
  contain: strict; will-change: transform;
}
@media (prefers-reduced-motion: reduce) { .scene { will-change: auto; } }

/* The column the text lives in. Everything below fades out across it, so no
   scene ever competes with a sentence. */
.scene::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(58% 62% at 50% 42%, var(--bg) 30%, transparent 78%);
}

/* ── Home: the aurora ───────────────────────────────────────────────────── */
/*
 * The front page is the one place the brand shows its whole layering: violet
 * masses with the sky-blue light behind them, drifting in from the upper
 * corners like an aurora. Not one flat colour — that is the point of the
 * palette — and never behind the column, which the shared ::after mask
 * guarantees. Three masses plus a soft wash from the top; the wash is what
 * keeps the corners from reading as two separate stickers.
 */
.scene-heim {
  background:
    radial-gradient(70% 38% at 14% 6%, color-mix(in srgb, var(--marke) 18%, transparent), transparent 70%),
    radial-gradient(56% 32% at 86% 12%, color-mix(in srgb, var(--himmel) 20%, transparent), transparent 72%),
    radial-gradient(44% 26% at 62% 30%, color-mix(in srgb, var(--marke) 9%, transparent), transparent 74%),
    linear-gradient(180deg, color-mix(in srgb, var(--himmel) 6%, transparent), transparent 42%);
}
:root[data-theme='dark'] .scene-heim,
:root:not([data-theme]) .scene-heim {
  background:
    radial-gradient(70% 38% at 14% 6%, color-mix(in srgb, var(--marke) 14%, transparent), transparent 70%),
    radial-gradient(56% 32% at 86% 12%, color-mix(in srgb, var(--himmel) 13%, transparent), transparent 72%),
    radial-gradient(44% 26% at 62% 30%, color-mix(in srgb, var(--marke-stark) 8%, transparent), transparent 74%),
    linear-gradient(180deg, color-mix(in srgb, #1a1440 55%, transparent), transparent 46%);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .scene-heim {
    background:
      radial-gradient(70% 38% at 14% 6%, color-mix(in srgb, var(--marke) 14%, transparent), transparent 70%),
      radial-gradient(56% 32% at 86% 12%, color-mix(in srgb, var(--himmel) 13%, transparent), transparent 72%),
      radial-gradient(44% 26% at 62% 30%, color-mix(in srgb, var(--marke-stark) 8%, transparent), transparent 74%),
      linear-gradient(180deg, color-mix(in srgb, #1a1440 55%, transparent), transparent 46%);
  }
}

/* ── AIRLOCK: air ───────────────────────────────────────────────────────── */
/*
 * Not a picture of clouds — bands of air. Four soft horizontal masses at
 * different heights and widths, the kind of stratification you see looking at
 * a sky rather than up into one. The green accent sits in the highest band so
 * the product colour is present without the page turning into a brand swatch.
 */
.scene-air {
  background:
    radial-gradient(80% 34% at 22% 12%, color-mix(in srgb, var(--airlock) 22%, transparent), transparent 70%),
    radial-gradient(70% 26% at 78% 26%, color-mix(in srgb, #7EC8FF 26%, transparent), transparent 72%),
    radial-gradient(90% 30% at 40% 44%, color-mix(in srgb, #A8D8FF 18%, transparent), transparent 75%),
    radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, #CFE9FF 22%, transparent), transparent 68%);
}
:root[data-theme='dark'] .scene-air,
:root:not([data-theme]) .scene-air {
  background:
    radial-gradient(80% 34% at 22% 12%, color-mix(in srgb, var(--airlock) 13%, transparent), transparent 70%),
    radial-gradient(70% 26% at 78% 26%, color-mix(in srgb, #2A7FB8 22%, transparent), transparent 72%),
    radial-gradient(90% 30% at 40% 44%, color-mix(in srgb, #1E5C86 16%, transparent), transparent 75%),
    radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, #123A55 30%, transparent), transparent 66%);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .scene-air {
    background:
      radial-gradient(80% 34% at 22% 12%, color-mix(in srgb, var(--airlock) 13%, transparent), transparent 70%),
      radial-gradient(70% 26% at 78% 26%, color-mix(in srgb, #2A7FB8 22%, transparent), transparent 72%),
      radial-gradient(90% 30% at 40% 44%, color-mix(in srgb, #1E5C86 16%, transparent), transparent 75%),
      radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, #123A55 30%, transparent), transparent 66%);
  }
}

/* ── NEXUS: the control layer ───────────────────────────────────────────── */
/*
 * NEXUS is a launcher, a browser, an editor and a studio in one window. So the
 * scene is panels: a lattice of rectangles at two scales, the larger ones
 * catching the cyan. It reads as an interface seen from far away, which is
 * exactly what the product is.
 */
.scene-nexus {
  background:
    /* the fine grid */
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--nexus) 9%, transparent) 0 1px, transparent 1px 84px),
    repeating-linear-gradient(0deg, color-mix(in srgb, var(--nexus) 9%, transparent) 0 1px, transparent 1px 84px),
    /* two panels, offset from the grid so it does not look like a table */
    linear-gradient(color-mix(in srgb, var(--nexus) 7%, transparent), color-mix(in srgb, var(--nexus) 7%, transparent)),
    linear-gradient(color-mix(in srgb, var(--nexus) 5%, transparent), color-mix(in srgb, var(--nexus) 5%, transparent)),
    radial-gradient(70% 50% at 84% 8%, color-mix(in srgb, var(--nexus) 14%, transparent), transparent 70%);
  background-repeat: repeat, repeat, no-repeat, no-repeat, no-repeat;
  background-size: auto, auto, 336px 252px, 252px 420px, auto;
  background-position: 0 0, 0 0, 4% 14%, 82% 40%, 0 0;
}

/* ── Skill index: the questions ─────────────────────────────────────────── */
/*
 * A question mark is the honest symbol for this page: every entry exists
 * because somebody could not tell by looking whether a file was safe.
 *
 * The glyphs are drawn as SVG in a data URI — not text nodes, so a screen
 * reader never encounters a wall of punctuation, and not an image file, so
 * nothing is fetched. Three marks per 420px tile at three sizes, placed off
 * the tile's own axes so the repeat does not read as a grid, and faded from
 * 10% down to 6% so the field has depth rather than being a wallpaper.
 */
.scene-index {
  --q: color-mix(in srgb, var(--accent-idx) 30%, transparent);
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'%3E%3Ctext x='60' y='150' font-family='Georgia,serif' font-size='190' fill='%23F5B942' fill-opacity='0.10'%3E%3F%3C/text%3E%3Ctext x='300' y='330' font-family='Georgia,serif' font-size='110' fill='%23F5B942' fill-opacity='0.08'%3E%3F%3C/text%3E%3Ctext x='210' y='400' font-family='Georgia,serif' font-size='64' fill='%23F5B942' fill-opacity='0.06'%3E%3F%3C/text%3E%3C/svg%3E"),
    radial-gradient(80% 45% at 50% 0%, color-mix(in srgb, var(--accent-idx) 12%, transparent), transparent 70%);
  background-repeat: repeat, no-repeat;
  background-size: 420px 420px, auto;
}
/* The glyph field is pushed out of the middle third: dense at the edges,
   nothing across the column where the entries are read. */
.scene-index::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0 24%, var(--bg) 34% 66%, transparent 76% 100%);
}

/* ── Scripts: the road ──────────────────────────────────────────────────── */
/*
 * For the FiveM section. Lane markings in perspective, held to two greys and
 * one warm accent — a road, not a neon skyline. Every script shop in this
 * corner of the internet looks like a nightclub flyer; this one should not.
 */
.scene-road {
  background:
    repeating-linear-gradient(102deg,
      color-mix(in srgb, var(--fg) 7%, transparent) 0 3px,
      transparent 3px 54px),
    radial-gradient(90% 50% at 50% 100%, color-mix(in srgb, #FF8A3D 12%, transparent), transparent 72%);
  background-repeat: repeat, no-repeat;
}

/* On a phone every scene steps back: the column is nearly the whole screen,
   so a background can only be in the way. */
@media (max-width: 720px) {
  .scene { opacity: 0.45; }
  .scene-index::before { background: none; }
}
`;

/** slug → scene class. Anything not listed gets no scene, which is correct for
 *  the legal pages: an atmosphere behind an Impressum is a joke at the reader's
 *  expense. */
export const SCENE_FOR = {
  '': 'scene-heim',
  airlock: 'scene-air',
  nexus: 'scene-nexus',
  skills: 'scene-index',
  scripts: 'scene-road',
};

export const sceneFor = (slug) => SCENE_FOR[slug] ?? null;
