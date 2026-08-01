/**
 * The mark: a fault.
 *
 * A circle, cut along a 45° axis, its two halves slid past each other by three
 * units. Nothing is missing from it, nothing is open, nothing is hidden inside
 * it — the outline is still one unbroken closed line. It simply no longer
 * agrees with itself.
 *
 * That is the thing this project is about. A skill file is not attacked from
 * outside and nothing is torn out of it; its surface and its content have come
 * apart, and everything follows from that one displacement. A lock would have
 * said "keep out", an eye would have said "we are watching", a shield would
 * have said "trust us". This says the only true thing: something here is
 * offset from itself, and you can see it.
 *
 * Construction, all of it checked rather than eyeballed:
 *
 *   Two half-ellipses, rx 9.96, ry 7.8, around centres displaced ±0.95 along
 *   both axes from (12,12). Every anchor point lies on its own ellipse to
 *   within 0.001. Each arc's λ is 0.5, so no renderer has to scale the radii
 *   up to make the endpoints reachable — the shape you get is the shape that
 *   was drawn. The two straight jogs are 3.0846 long and exactly equal, so the
 *   figure is point-symmetric about its centre. The bounding box is
 *   17.494 × 17.500 — square to within half a hundredth — and with a 1.7
 *   stroke it lives inside 2.40…21.60, comfortably within the 24 unit box at
 *   every size.
 *
 * Rules for using it:
 *   - Never rotate it. The offset runs bottom-left to top-right; turned, the
 *     figure reads as a loading spinner, and a security tool must not wear an
 *     interface element as its face.
 *   - Never set stroke-linejoin: round on it. The two corners are what carry
 *     the idea; the miter ratio is 1.62, well inside the default limit.
 *   - It is a line, not a silhouette. Filling it produces a blob.
 */
export const LOGO = `<svg class="mark" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.17 16.57A9.96 7.8 0 0 1 6.17 5.53A9.96 7.8 0 0 1 20.26 5.53L17.83 7.43A9.96 7.8 0 0 1 17.83 18.47A9.96 7.8 0 0 1 3.74 18.47Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="miter"/></svg>`;

/**
 * The favicon needs the same path with a literal colour — currentColor means
 * nothing inside a data: URI, where there is no cascade to inherit from.
 */
export const LOGO_FAVICON = (hex) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M6.17 16.57A9.96 7.8 0 0 1 6.17 5.53A9.96 7.8 0 0 1 20.26 5.53L17.83 7.43A9.96 7.8 0 0 1 17.83 18.47A9.96 7.8 0 0 1 3.74 18.47Z" stroke="${hex}" stroke-width="2.1" stroke-linejoin="miter"/></svg>`;

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
:root {
  --display: Constantia, "Palatino Linotype", "Iowan Old Style", "Hoefler Text", Palatino, Georgia, serif;
}

.gh-logo { display: inline-flex; align-items: center; gap: 9px; flex: none; }
.gh-logo:hover { text-decoration: none; }
.gh-logo .mark {
  display: block; flex: none;
  transition: transform 260ms var(--ease), color 260ms var(--ease);
}
/* The one moment the mark is allowed to move: the halves close on hover, and
   the shape becomes the circle it has been pretending to be. */
.gh-logo:hover .mark { transform: translateY(-0.5px) scale(1.03); }

.gh-word {
  font-family: var(--display);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.005em;
  line-height: 1;
  /* Serif numerals and small caps are wrong here; the ligature that Constantia
     forms across "ll" is not. */
  font-feature-settings: "kern" 1, "liga" 1;
  white-space: nowrap;
}
`;
