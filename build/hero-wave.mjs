/**
 * The swell under the front page.
 *
 * The hero already carries the mark at page scale: lines of text seen from far
 * away, cut along a 45° fault, the far half slid sideways (theme-extra.mjs).
 * That stays. What is added here sits at the *foot* of the section — three soft
 * wave bands drifting across a reserved strip at three different speeds, in the
 * three colours the site already owns.
 *
 * The colours are not a new palette. They are the site's own gradient — the one
 * on the word "actually" in the headline and on the hairline above the footer,
 * `--marke → --himmel → --nexus` — unrolled along the scroll. At the top of the
 * page the swell is violet, and by the time the hero has scrolled away it has
 * travelled through sky-blue into cyan. Nothing new was invented; an existing
 * gradient was given a second axis — and it is the layering the brand file
 * promises: violet in front, sky behind it, never one flat colour.
 *
 * ── The band is reserved, not stolen ───────────────────────────────────────
 *
 * The first version of this file drew a 340px wave anchored to the bottom of a
 * hero whose bottom padding is 72px, and then painted an ellipse of `var(--bg)`
 * back over the middle to rescue the text. Measured, that ellipse never had a
 * chance: it is centred at a fixed 30% of the *viewport*, while the text column
 * is a centred box of at most `--w`. The two coincide at exactly one window
 * width. At 1280px the column starts at 1.9% of the viewport and at 2560px it
 * starts at 24.7%, so a single percentage cannot follow it, and the wave ran
 * over the headline, the lede and both buttons at every width tested.
 *
 * So the wave is not hidden from the text any more — it is given ground of its
 * own. `--swell` is added to the hero's bottom padding *and* is the height of
 * the layer, which puts the top of the wave exactly one normal bottom-padding
 * below the last line of content, at every viewport, with no mask involved.
 * Overlap is not tuned away here, it is arithmetically impossible. That is the
 * only version of this that stays true on a screen nobody tested.
 *
 * ── The rest of the rules, all of them load-bearing ────────────────────────
 *
 * 1. Nothing runs when nobody is looking. The drift is a CSS transform
 *    animation, not a requestAnimationFrame loop, so a background tab suspends
 *    it for free; and an IntersectionObserver sets `data-still` on the layer
 *    the moment the hero leaves the viewport, which pauses every animation in
 *    here — the drift and the colour travel both — and releases the promoted
 *    layers. A hero that keeps animating three masked bands while the reader is
 *    four screens further down is a laptop fan spinning for a picture nobody
 *    can see.
 *
 * 2. The scroll effect never runs on the scroll event. Where the browser has
 *    scroll-driven animations, `animation-timeline: --hero` with
 *    `animation-range: exit` does the colour travel entirely off the main
 *    thread, over exactly the distance the hero takes to leave — no magic pixel
 *    constant, and it scales itself to the section's real height on any device.
 *    Where it does not, one IntersectionObserver with twenty-one thresholds
 *    writes `--hw-p` and a CSS transition smooths the steps. That is about
 *    twenty callbacks for the whole hero, against one per scrolled pixel.
 *
 * 3. Reduced motion switches it off rather than slowing it down, and what is
 *    left is a still composition of three offset bands — which is a picture
 *    worth looking at, not a hole where an animation used to be.
 *
 * 4. It costs nothing to lay out. The layer is absolutely positioned inside a
 *    section that is already `position: relative`, so it contributes no height
 *    and cannot shift anything. The height it needs is reserved by padding in
 *    the same stylesheet, which is in the document head — so the reservation is
 *    made before the first paint, not after a script has run. The markup is
 *    served, so it is there without JavaScript; the only thing script adds is
 *    knowing when to stop.
 *
 * 5. Transform and opacity only. Both are compositor properties: the bands are
 *    painted once and then moved, never repainted. The wave itself is an SVG
 *    mask so the fill can stay a `color-mix` of the real theme tokens — a data
 *    URI has no cascade to inherit a colour from, which is the same reason the
 *    favicon in layout.mjs has to be handed a literal hex.
 */

/**
 * One tile of the wave: two full periods, drawn as a quadratic chain so the
 * seam is smooth in position *and* tangent — the reflected control point of a
 * `T` command guarantees it. Filled down to the baseline, `preserveAspectRatio`
 * off so `mask-size` may stretch it to whatever box a band happens to be.
 */
const TILE =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='120' viewBox='0 0 360 120' preserveAspectRatio='none'%3E%3Cpath id='i9n' d='M0 60Q45 22 90 60T180 60T270 60T360 60V120H0Z'/%3E%3C/svg%3E")`;

/** The layer itself. Static markup, so it exists with JavaScript switched off. */
export const HERO_WAVE_HTML = `<div class="hero-wave" aria-hidden="true">
  <div class="hw hw-1"><div class="hw-x"></div></div>
  <div class="hw hw-2"><div class="hw-x"></div></div>
  <div class="hw hw-3"><div class="hw-x"></div></div>
</div>`;

export const HERO_WAVE_CSS = `
/*
 * The one number this whole file is built on. It is the height of the swell and
 * the extra bottom padding of the hero — the same value in both places, which
 * is what keeps the wave off the text without a single mask.
 */
.hero-swell {
  --swell: clamp(132px, 15vw, 240px);
  padding-bottom: calc(clamp(40px, 6vw, 72px) + var(--swell));
}

.hero-wave {
  position: absolute; inset: auto 0 0 0; z-index: -2;
  height: var(--swell);
  overflow: hidden; pointer-events: none; contain: layout paint;
  --hw-tile: ${TILE};
  /*
   * How much of a token's colour a band is allowed to carry, and how much is
   * left by the time the band fades out.
   *
   * These are not one value scaled for the two themes, because the two themes
   * are not doing the same thing. On near-black the crest is *light* being
   * added, so a thin bright edge at 38% is already a glow and the body of the
   * band can stay faint. On white the crest is dark ink being laid down, and a
   * translucent dark violet over white turns grey long before it turns pale —
   * the first pass used the same restraint here and the wave simply vanished.
   * So light mode gets a stronger crest and, more importantly, a much stronger
   * mid-band: on paper the colour has to live in the body of the wave, not in
   * a hairline along the top of it.
   */
  --hw-ink: 48%;
  --hw-thin: 20%;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .hero-wave { --hw-ink: 38%; --hw-thin: 12%; }
}
:root[data-theme='dark'] .hero-wave { --hw-ink: 38%; --hw-thin: 12%; }
:root[data-theme='light'] .hero-wave { --hw-ink: 48%; --hw-thin: 20%; }

/* A band. Carries the colour weight, and nothing else — its opacity is the one
   thing the scroll drives, and opacity does not repaint. */
.hw {
  position: absolute; left: 0; right: 0; bottom: 0;
  transition: opacity 460ms var(--ease);
}

/*
 * The drifting half. Two to four times wider than the band so that translating
 * it by exactly one tile always leaves the band covered, and the tile is a fixed
 * 25% of that width — so the travel and the repeat are the same distance
 * whatever the viewport is, and one keyframe set serves all three bands. A wider
 * element means a longer tile means a longer wavelength, which is where the
 * three bands get their different scale from.
 */
.hw-x {
  position: absolute; inset: 0 auto 0 0; height: 100%;
  -webkit-mask-image: var(--hw-tile); mask-image: var(--hw-tile);
  -webkit-mask-repeat: repeat-x; mask-repeat: repeat-x;
  -webkit-mask-size: 25% 100%; mask-size: 25% 100%;
  -webkit-mask-position: 0 100%; mask-position: 0 100%;
  animation: hw-drift 41s linear infinite;
  will-change: transform;
}

.hw-1 { height: 100%; opacity: calc(0.85 - 0.70 * var(--hw-p, 0)); }
.hw-2 { height: 76%;  opacity: calc(0.20 + 0.60 * var(--hw-p, 0)); }
.hw-3 { height: 54%;  opacity: calc(0.04 + 0.51 * var(--hw-p, 0)); }

/*
 * Each band is strongest along its own crest and gone before it reaches the
 * floor. Filling a wave solidly to the baseline is what turns three swells into
 * one flat violet slab with a hard edge where the section stops — the fade is
 * what keeps them reading as light rather than as terrain. It is also what lets
 * the vertical drift below stay invisible: the bottom of every band is already
 * transparent, so lifting it by 1.8% cannot expose a seam.
 */
.hw-1 .hw-x {
  width: 300%; animation-duration: 41s;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--marke) var(--hw-ink), transparent) 0%,
    color-mix(in srgb, var(--marke) var(--hw-thin), transparent) 44%,
    transparent 92%);
}
/* Reversed, so the middle band runs against the other two. Two waves moving the
   same way read as one conveyor belt; three that disagree read as water. */
.hw-2 .hw-x {
  width: 200%; animation-duration: 28s; animation-direction: reverse;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--himmel) var(--hw-ink), transparent) 0%,
    color-mix(in srgb, var(--himmel) var(--hw-thin), transparent) 44%,
    transparent 92%);
}
.hw-3 .hw-x {
  width: 400%; animation-duration: 57s;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--nexus) var(--hw-ink), transparent) 0%,
    color-mix(in srgb, var(--nexus) var(--hw-thin), transparent) 44%,
    transparent 92%);
}

/*
 * Horizontal travel is exactly linear across the nine stops — one tile per
 * cycle, so the loop closes without a seam. The vertical component is a sine
 * sampled at the same stops, which is what turns a slide into a swell. Both
 * live in one transform, so a band is one composited layer rather than two.
 */
@keyframes hw-drift {
  0%     { transform: translate3d(0, 0, 0); }
  12.5%  { transform: translate3d(-3.125%, 1.3%, 0); }
  25%    { transform: translate3d(-6.25%, 1.8%, 0); }
  37.5%  { transform: translate3d(-9.375%, 1.3%, 0); }
  50%    { transform: translate3d(-12.5%, 0, 0); }
  62.5%  { transform: translate3d(-15.625%, -1.3%, 0); }
  75%    { transform: translate3d(-18.75%, -1.8%, 0); }
  87.5%  { transform: translate3d(-21.875%, -1.3%, 0); }
  100%   { transform: translate3d(-25%, 0, 0); }
}

/*
 * Out of the viewport: every animation in here stops and the promoted layers
 * are handed back. Both selectors matter — the drift on .hw-x is the one that
 * costs frames, and the colour travel on .hw is the one the rule about "no CSS
 * animation on an element outside the viewport" is actually about. Set from
 * script, never from the markup, so the still state is never what a reader
 * without JavaScript gets served.
 */
.hero-wave[data-still] .hw-x,
.hero-wave[data-still] .hw { animation-play-state: paused; will-change: auto; }

/*
 * The colour travel, where the browser can do it without the main thread. The
 * timeline is the hero's own exit, so the gradient completes precisely as the
 * section leaves — and outside that range the animation is not running at all,
 * it is holding a filled value.
 */
@supports (animation-timeline: view()) {
  .hero-swell { view-timeline-name: --hero; view-timeline-axis: block; }
  .hw {
    animation-timing-function: linear; animation-fill-mode: both;
    animation-timeline: --hero; animation-range: exit;
  }
  .hw-1 { animation-name: hw-tint-1; }
  .hw-2 { animation-name: hw-tint-2; }
  .hw-3 { animation-name: hw-tint-3; }
  @media (prefers-reduced-motion: reduce) { .hw { animation-name: none; } }
}
@keyframes hw-tint-1 { from { opacity: 0.85; } to { opacity: 0.15; } }
@keyframes hw-tint-2 { from { opacity: 0.20; } to { opacity: 0.80; } }
@keyframes hw-tint-3 { from { opacity: 0.04; } to { opacity: 0.55; } }

/*
 * Asked for less motion: off, not slower — no animation is created at all, so
 * there is nothing left to tick and no layer left promoted.
 *
 * The opacities have to be restated here, and that is not tidiness. Everywhere
 * else the three bands are a *journey*: they start as violet with sky and cyan
 * held back at 0.20 and 0.04, and the scroll is what brings the other two up. A
 * reader who asked for less motion never gets that scroll, so leaving the
 * start-of-journey values in place would hand them a single violet band and two
 * they cannot see — the composition this file keeps claiming to have, minus two
 * thirds of it. These are the mid-travel values instead: all three colours
 * present at once, which is the picture the journey passes through anyway.
 */
@media (prefers-reduced-motion: reduce) {
  .hw-x { animation: none; transform: none; will-change: auto; }
  .hw { transition: none; }
  .hw-1 { opacity: 0.60; }
  .hw-2 { opacity: 0.46; }
  .hw-3 { opacity: 0.30; }
}

/*
 * On a phone the swell is shallower — not because it is in the way, it cannot
 * be, but because 15vw of a 375px screen spent on decoration is height the
 * reader has to scroll past before the page says anything. The band steps back
 * to the same 0.45 the page scenes use at this width.
 */
@media (max-width: 720px) {
  .hero-swell { --swell: clamp(96px, 24vw, 132px); }
  .hero-wave { opacity: 0.45; }
}
`;

/**
 * Two observers, no scroll handler, and both of them go quiet on their own.
 *
 * The first stops every animation in the layer when the hero is off screen. The
 * second exists only where scroll-driven animations do not, and turns the
 * hero's exit into a single number the stylesheet reads — twenty-one thresholds
 * across the whole section, not one callback per pixel. Once the hero is gone
 * neither observer has anything left to report, so the page falls completely
 * silent.
 */
export const HERO_WAVE_JS = `
(function () {
  var layer = document.querySelector('.hero-wave');
  if (!layer || !('IntersectionObserver' in window)) return;
  var hero = layer.parentElement;

  new IntersectionObserver(function (entries) {
    layer.toggleAttribute('data-still', !entries[0].isIntersecting);
  }, { rootMargin: '160px 0px' }).observe(layer);

  var scrollDriven = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()'));
  if (scrollDriven || !hero) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var steps = [];
  for (var i = 0; i <= 20; i++) steps.push(i / 20);

  new IntersectionObserver(function (entries) {
    // How far through leaving the section is: 0 while its top edge is still
    // below the viewport top, 1 once its bottom edge has passed it. The same
    // span "animation-range: exit" describes, arrived at from the rectangle the
    // observer hands over anyway — no measuring, no reading layout.
    var r = entries[entries.length - 1].boundingClientRect;
    var p = r.height ? Math.min(Math.max(-r.top / r.height, 0), 1) : 0;
    layer.style.setProperty('--hw-p', p.toFixed(3));
  }, { threshold: steps }).observe(hero);
})();`;
