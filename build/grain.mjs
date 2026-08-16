/**
 * The grain: the site's surfaces made of something.
 *
 * This comes from an image — `anmeldung-4-textur.jpg`, a mid-grey field with a
 * texture in it you only notice on the second look. The image is not here, and
 * that is the whole point of this file, so the reasoning is written down.
 *
 * ── Why the picture is not the answer ──────────────────────────────────────
 *
 * Measured, the image is 928×1152, mean luma 174, and neutral to within half a
 * step (R 174.1 / G 174.0 / B 173.6). Subtract a local mean and what is left —
 * the texture itself — has a standard deviation of 5.8 luma steps, about 2.3%
 * of the range. Its autocorrelation is 0.41 one pixel sideways and −0.10 one
 * pixel down: grain stretched along the horizontal, roughly two pixels wide and
 * one tall, with no periodicity anywhere. Uncoated paper, in other words, and
 * the numbers say so rather than the adjective.
 *
 * Three things stop that file from being used as a file:
 *
 *   1. It is 774 kB for one flat tone. The stylesheet on this site is inlined
 *      into every one of the twenty pages, so a data URI is paid twenty times;
 *      and a separate request for a decoration is a request this site has
 *      never made.
 *   2. It cannot be re-inked. The texture lives on a *mid-grey* ground, which
 *      is what lets it deviate in both directions at once. This site has no
 *      mid-grey ground — it has white and near-black — and you cannot make
 *      #ffffff brighter. Any faithful transplant would have to bring its own
 *      grey with it, which is a fourth background colour nobody asked for.
 *   3. It has a light in it: 182 at the top, 164 at the bottom, a 10% drift.
 *      That is a photograph of a surface. Stretched over a page with hard
 *      section dividers it is a gradient competing with the layout, and on an
 *      8-bit display it bands. The texture travels; the light does not.
 *
 * So the grain is rebuilt, and it is measured against the original rather than
 * eyeballed. `feTurbulence` with `baseFrequency='.45 .9'` — lower across, higher
 * down, which is what stretches the grain sideways — renders, screenshotted and
 * measured back, at an autocorrelation of 0.37 sideways and −0.08 down against
 * the image's 0.39 and −0.14 at the size it would actually have been shown at.
 * That is the same material, arrived at from the other end. It costs 5.4 kB of
 * source and about 1.2 kB on the wire — the four copies of the tile are four
 * copies of the same string, which is the one thing compression is good at —
 * and it takes the theme's ink instead of bringing its own grey.
 *
 * It is also the answer to the question a bitmap cannot answer well. The tile is
 * described in CSS pixels and rasterised by the browser at whatever the device
 * is, so on a 2× display the same grain is drawn with twice the pixels rather
 * than shrinking: measured on the same card at 1× and at 2×, the standard
 * deviation is 3.46 both times and only the pixel-to-pixel correlation rises,
 * from 0.37 to 0.79. A 1× bitmap would have blurred, and a 2× one would have
 * cost four times the bytes to avoid it.
 *
 * What is honestly *not* as good as the image: the grain here is one-sided.
 * Paper deviates lighter and darker; ink on white can only go darker. At this
 * amplitude the eye reads texture rather than direction, so the loss is small —
 * but it is a loss, and it is why the tone under the grain shifts by just under
 * four steps instead of staying put.
 *
 * ── The rules it is built under ────────────────────────────────────────────
 *
 * 1. It never runs. Not a script, not an animation, not an observer — a tiled
 *    background image that is painted once. There is nothing here to pause when
 *    the reader scrolls away and nothing for `prefers-reduced-motion` to switch
 *    off, which is the strongest form of "nothing happens when nobody is
 *    looking" available.
 * 2. Both modes carry their own ink and their own strength, rather than one
 *    being the other turned down. On white the grain is the fg colour laid on;
 *    on near-black it is light added, and light on a dark ground reads louder at
 *    the same amplitude — so dark gets less of it. The same asymmetry the hero
 *    wave already documents.
 * 3. It goes on objects, never on grounds. That one is worth its own paragraph
 *    and gets it, at the stylesheet below.
 */

/**
 * One tile of grain.
 *
 * `ink` is 0 for black or 1 for white — a data URI has no cascade to inherit a
 * colour from, the same constraint the favicon and the index scene are already
 * written around, so the two inks are two strings.
 *
 * `k` is the alpha slope. The turbulence's red channel arrives as noise centred
 * on 0.5; the matrix maps it to `alpha = k·R − 0.42·k`, so everything below the
 * 42nd percentile of the noise clamps to nothing and the rest fades up from
 * there. That threshold is what keeps the grain continuous rather than a
 * scattering of separate dots: pushed higher, the same standard deviation
 * arrives as visible specks with clean paper between them, which is dust, not
 * texture. Measured on a rendered card at k = 0.16: mean 251.2, sd 3.46,
 * darkest pixel 238. In dark mode at k = 0.115 the same tile over #1a1d21 runs
 * mean 29.8 against a plain 27.3, sd 2.23 — two thirds of the light amplitude,
 * which is what makes the two read as the same material.
 *
 * `filterUnits='userSpaceOnUse'` pins the filter region to exactly the tile so
 * `stitchTiles` has the right box to make seamless, and it avoids having to
 * escape a percent sign inside a URL. It works: sampling a 1100px strip across a
 * tiled card, the largest step between any two neighbouring columns anywhere —
 * tile edges included — is 2.8 luma steps, 1.1% of the range, and no phase in
 * the 220px cycle stands out from the rest. There is no seam to find.
 *
 * The tile is 220px because it has to be much larger than the grain and much
 * smaller than a card, and because 0.45 and 0.9 both land on whole numbers of
 * periods across it, so the noise tiles exactly rather than being stretched to.
 */
const T = 220;
const tile = (ink, k) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${T}' height='${T}'%3E%3Cfilter id='g' filterUnits='userSpaceOnUse' x='0' y='0' width='${T}' height='${T}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.45 .9' numOctaves='1' stitchTiles='stitch' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 ${ink} 0 0 0 0 ${ink} 0 0 0 0 ${ink} ${k} 0 0 0 ${(-0.42 * k).toFixed(4)}'/%3E%3C/filter%3E%3Crect width='${T}' height='${T}' filter='url(%23g)'/%3E%3C/svg%3E")`;

/*
 * How much of it, per mode. Light lays ink on paper and can afford the amount
 * measured off the original; dark adds light to a near-black ground, where the
 * eye is working against a much smaller absolute background and the same
 * amplitude reads roughly a third louder. 0.115 is where the two look like the
 * same material rather than the same number.
 */
const LIGHT = tile(0, 0.16);
const DARK = tile(1, 0.115);

/**
 * The texture, applied to a list of selectors, in both modes.
 *
 * It is a function rather than a block of CSS because it has two callers. The
 * site-wide surfaces are declared just below; the shop on /scripts/ builds the
 * same object out of its own class and keeps its stylesheet to its own page, so
 * it asks for the texture there instead of this file naming `.sh-item` and
 * shipping that selector to the Impressum.
 *
 * Four blocks and not two: the base, the system preference, and the two the
 * theme toggle stamps onto <html>. That is the same shape theme.mjs writes its
 * palette in, for the same reason — a toggle that only works in one direction
 * is the bug you get from writing three of them.
 */
const rule = (prefix, sels, img) =>
  `${sels.map((s) => prefix + s).join(',\n')} { background-image: ${img}; }`;

export const grainOn = (...sels) => `
${rule('', sels, LIGHT)}
@media (prefers-color-scheme: dark) {
${rule(":root:not([data-theme='light']) ", sels, DARK)}
}
${rule(":root[data-theme='dark'] ", sels, DARK)}
${rule(":root[data-theme='light'] ", sels, LIGHT)}

/*
 * Every element paints the tile from its own corner, so three cards in a row
 * would otherwise show the same 220px square of grain three times — the one way
 * an aperiodic texture can still read as a repeat. Three offsets, none of them
 * a multiple of anything, and a row stops agreeing with itself. It costs three
 * declarations and nothing at runtime.
 */
${sels.map((s) => `${s}:nth-child(2n) { background-position: 71px 33px; }`).join('\n')}
${sels.map((s) => `${s}:nth-child(3n) { background-position: 137px 96px; }`).join('\n')}
${sels.map((s) => `${s}:nth-child(4n+1) { background-position: 19px 152px; }`).join('\n')}
`;

export const GRAIN_CSS = `
/*
 * Where the grain goes, and — the harder half — where it does not.
 *
 * The rule is one line: it goes on objects, never on grounds.
 *
 * That is not a preference, it is arithmetic, and the front page proved it. On
 * a pure white page a texture can only be ink, and ink has a mean: measured on
 * the rendered hero, the grain pulls the ground from 255 to 250.7 and the dark
 * mode from 16.5 to 19.5. On an object that shift is the point — it is what
 * makes the thing look made of something. On a ground it is a step, and the
 * hero's step landed against the plain white section under it across a single
 * hairline, where 1.7% is plainly visible as two different papers. There is no
 * version of that which is not a mistake, and no amount of turning it down
 * fixes it: below the level where the step disappears the texture has gone too.
 *
 * So: the bordered surfaces, and nothing else.
 *
 *   In light mode --surface and --bg are both #ffffff. A card is currently a
 *   border and a shadow drawn around nothing, and this is the one place on the
 *   site where a texture does structural work instead of decorating: a card
 *   made of something reads as a card without needing a heavier border. The
 *   tone it costs is the tone that buys it.
 *
 * It does not go on the page background — that is what turns a detail into
 * wallpaper, and it is the single change that would put grain behind every
 * paragraph on the site. Not on the hero, for the reason above. Not on the
 * footer, which already sets itself apart with its own ground and its own
 * hairline and does not need a third signal. Not on tables, code blocks or
 * form fields, where a texture under small type is a cost with nothing bought.
 * And not on the legal pages, which get no atmosphere by an older rule in
 * scenes.mjs — they carry no cards, so that holds here by itself rather than
 * by an exception.
 *
 * On the short text that is left inside a card, the arithmetic is again the
 * argument. Body text is #1f2328 on #ffffff, a contrast ratio of 15.3:1. Under
 * the grain the ground averages #fbfbfb and the ratio is 15.3:1; the darkest
 * pixel the grain produces anywhere still leaves 13.6:1 against a threshold of
 * 4.5. Compared with the hero's line texture, which shipped, this is about a
 * fifth as strong.
 */
${grainOn('.card', '.note', '.skill')}`;
