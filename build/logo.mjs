/**
 * The mark: a fault, opened until it reads as an S.
 *
 * A circle, cut along a 45° axis, its two halves slid past each other. Nothing
 * is missing from it, nothing is open, nothing is hidden inside it — the
 * outline is still one unbroken closed line. It simply no longer agrees with
 * itself.
 *
 * That is the thing this project is about. A skill file is not attacked from
 * outside and nothing is torn out of it; its surface and its content have come
 * apart, and everything follows from that one displacement. A lock would have
 * said "keep out", an eye would have said "we are watching", a shield would
 * have said "trust us". This says the only true thing: something here is
 * offset from itself, and you can see it.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Why it is now an S, and why that is not a new idea
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The lower half IS the upper half, rotated 180° about (12,12). That is where
 * the two opposing points come from — and it is also what an S is made of. The
 * letter was in the construction the whole time; it was simply not pulled far
 * enough apart to be seen. Widening the displacement does not add a letter to
 * the mark, it finishes one that was already there.
 *
 * The whole family is therefore one parameter, `t`:
 *
 *     t = 0     the halves meet — a true circle, radii 7.99 × 7.99
 *     t = 1     the original decided fault, unchanged
 *     t = 2.1   the shipping mark: unmistakably an S
 *
 * At every value in between the contour stays closed; the two straight jogs
 * simply reach length zero at t = 0. That is what makes the mark animatable
 * without it ever appearing broken.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * The numbers, measured rather than eyeballed
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Two half-ellipses, rx 9.96, ry 7.8, the lower one the upper one turned
 *   180°. At t = 2.1 the raw figure measures 20.894 × 21.303 including the
 *   stroke, so it is scaled by 0.8927 to sit inside the 2.4 safe margin the
 *   original kept. Note the figure is TALLER than wide — with the radii
 *   wrongly extrapolated it used to be the other way round, and scaling by
 *   width alone clips the bottom.
 *
 *   The radii interpolate only while CLOSING (t from 1 down to 0), so the
 *   closed state is a true circle rather than the wide ellipse it would
 *   otherwise be. Above t = 1 they are clamped: a wider fault slides the
 *   halves apart, it does not stretch the arcs.
 *
 * Regenerate with `node scripts/zeichen-bauen.mjs`; the geometry lives in
 * `build/marken.mjs`.
 *
 * Rules for using it:
 *   - Never rotate it. The offset runs bottom-left to top-right; turned, the
 *     figure reads as a loading spinner, and a security tool must not wear an
 *     interface element as its face.
 *   - Never set stroke-linejoin: round on it. The two corners are what carry
 *     the idea.
 *   - It is a line, not a silhouette. Filling it produces a blob.
 */

/** t = 2.1, scaled 0.8927 — the shipping mark. */
export const PFAD_OFFEN =
  'M7.989 15.147A8.891 6.963 0 0 1 7.989 5.291A8.891 6.963 0 0 1 20.567 5.291'
  + 'L16.011 8.853A8.891 6.963 0 0 1 16.011 18.709A8.891 6.963 0 0 1 3.433 18.709Z';

/** t = 0 — the circle it has been pretending to be. Same segment structure. */
export const PFAD_ZU =
  'M5.711 16.928A7.99 7.99 0 0 1 5.711 7.072A7.99 7.99 0 0 1 18.289 7.072'
  + 'L18.289 7.072A7.99 7.99 0 0 1 18.289 16.928A7.99 7.99 0 0 1 5.711 16.928Z';

export const LOGO = `<svg class="mark" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${PFAD_OFFEN}" stroke="currentColor" stroke-width="1.7" stroke-linejoin="miter" stroke-miterlimit="4"/></svg>`;

/**
 * The favicon needs the same path with a literal colour — currentColor means
 * nothing inside a data: URI, where there is no cascade to inherit from.
 */
export const LOGO_FAVICON = (hex) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="${PFAD_OFFEN}" stroke="${hex}" stroke-width="2.1" stroke-linejoin="miter" stroke-miterlimit="4"/></svg>`;

/**
 * The wordmark.
 *
 * No web font is loadable here — the site promises it fetches nothing from
 * anyone — so the choice is which of the fonts already on the machine to ask
 * for. A serif is the interesting answer: every tool in this field wears the
 * same grotesque, and the whole argument of the project is that something can
 * look exactly like everything else and not be.
 *
 * The stack is ordered so the fallback is never a surprise. Constantia ships
 * with Windows and Office, Palatino with macOS, Iowan and Hoefler on Apple
 * devices, and Georgia underneath all of them — present on effectively every
 * desktop and phone since the nineties. Whatever a visitor has, they get a
 * transitional serif with a high x-height, not Times New Roman.
 *
 * Optical sizing is done by hand: at 17px a serif needs slightly open tracking
 * to stop the joins filling in, which is the opposite of what the display
 * headings want.
 */
export const WORDMARK_CSS = `

.gh-logo { display: inline-flex; align-items: center; gap: 9px; flex: none; }
.gh-logo:hover { text-decoration: none; }
.gh-logo .mark { display: block; flex: none; }
.gh-logo .mark path {
  transition: d var(--mittel) var(--ease), stroke var(--mittel) var(--ease);
}
/*
 * The one moment the mark is allowed to move: the halves close on hover, and
 * the shape becomes the circle it has been pretending to be.
 *
 * Animating \`d\` needs the two paths to share a segment structure, which is
 * why the closed state keeps its zero-length jog instead of dropping it.
 * Browsers without animatable \`d\` (Firefox, as of writing) simply snap
 * between the two states — the mark is never wrong, only less smooth.
 */
.gh-logo:hover .mark path { d: path("${PFAD_ZU}"); }
`;
