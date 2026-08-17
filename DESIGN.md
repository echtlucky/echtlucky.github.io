---
version: alpha
name: Verwerfung
description: Design system for skillry.de — open tools for people who want to know what their AI is actually running. Documentation-density, read by developers who arrived from a GitHub repository.

colors:
  primary: "#05763d"
  secondary: "#054d29"
  tertiary: "#0969da"
  surface: "#ffffff"
  surface-sunken: "#f6f8fa"
  on-surface: "#1f2328"
  on-surface-muted: "#59636e"
  border: "#d1d9e0"
  border-control: "#8c959f"
  header: "#24292f"
  on-header: "#ffffff"
  error: "#cf222e"
  success: "#1a7f37"
  accent-index: "#9a6700"
  accent-nexus: "#0a7ea4"

typography:
  wordmark:
    fontFamily: Montserrat
    fontSize: 19px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.004em
  display:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.022em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.016em
  headline-md:
    fontFamily: Montserrat
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: system-ui
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label-caps:
    fontFamily: system-ui
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
  code:
    fontFamily: ui-monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 96px

components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  page-header:
    backgroundColor: "{colors.header}"
    textColor: "{colors.on-header}"
    typography: "{typography.wordmark}"
    padding: "{spacing.md}"
  caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.body-md}"
  brand-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-md}"
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-header}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-header}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  card:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  input-outline:
    backgroundColor: "{colors.border-control}"
    height: 1px
  input-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
  status-ok:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    typography: "{typography.label-caps}"
  chip-index:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-index}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  chip-nexus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-nexus}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  code-block:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.on-surface}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# Verwerfung

## Overview

skillry.de argues that something can look exactly like everything else and not be
the same thing. The mark says it before any sentence does: a circle cut along a
45° axis, its halves slid past each other. Nothing is missing, nothing is open —
the outline is one unbroken line that no longer agrees with itself. A lock would
have said *keep out*, an eye *we are watching*, a shield *trust us*. This says
the only true thing: something here is offset from itself, and you can see it.

The register is **developer documentation, not marketing**. Most visitors arrive
from a GitHub repository, so the header deliberately borrows GitHub's
proportions and its near-black bar — the intent is that nobody feels they left.
Everything below the header is ours.

What this direction gives up, on purpose:

- **Warmth.** The neutrals are cool and the page is mostly white or near-black.
  There is no clay, no cream, no soft brand illustration.
- **Persuasion.** No testimonial wall, no logo carousel, no gradient hero. The
  page makes its case with prose, code, and a searchable index.
- **A loud identity.** Green appears on perhaps 3% of any screen. The site is
  legible as Skillry from the mark and the typography, not from being drenched
  in colour.

The site is **bilingual (de/en)** and every page exists in both. It ships **light
and dark**, and neither is the afterthought: light is the `:root` default, dark
arrives through `prefers-color-scheme` and through an explicit toggle that stamps
`data-theme` on `<html>`.

## Colors

The green is not a swatch someone liked. It is a ten-step ramp at **hue 150°**,
and every step carries its measured contrast against white and against the dark
ground `#0d1117` in the source. Those numbers decide what a step is allowed to
do: 4.5:1 and up may carry text, 3:1 and up may draw the edge of a control,
below that it is a surface and nothing else.

The ramp exists because of a measurement, not a preference. AIRLOCK's mint sits
at hue 149°; the ramp sits at 150°. The distance between the mint and step 400 is
13 of 441 possible — **it is not another green, it is the same green.** So rather
than invent a second one, the brand claims the ramp and AIRLOCK's mint is one of
its steps.

**Green is the colour of identity and action, never of navigation.** Blue for a
link is not a matter of taste, it is a thirty-year-old agreement, and a
documentation site lives on skimming. GitHub is black-and-white with green
buttons and blue links and nobody thinks GitHub is colourless.

- **Primary (#05763d):** deep fir — Skillry itself. Carries brand text on white
  at 5.73:1. Step 700 is stronger and reaches only 3.53:1, which is why it draws
  edges and never sets type.
- **Secondary (#054d29):** the darkest green — the surface of a primary button,
  paired with white at 10:1.
- **Tertiary (#0969da):** link blue — the sole driver of navigation. It is the
  one colour a reader is allowed to interpret as "this goes somewhere".
- **On-surface-muted (#59636e):** the second voice — captions, metadata, the
  sentence under a heading.
- **Border (#d1d9e0)** is the edge of a *surface* — a card, a rule.
  **Border-control (#8c959f)** is the edge of a *control* — a field, a button, a
  handle. WCAG 1.4.11 demands 3:1 for the second and says nothing about the
  first, and the two must not be swapped: a card with a 3:1 edge looks like a
  form field. The old value `#b7c0c9` reached 1.84:1 and was wrong.
- **Accent-index (#9a6700)** and **accent-nexus (#0a7ea4)** belong to one page
  each. A product owns its colour on its own page and nowhere else, so a reader
  learns that amber means the skill index and cyan means NEXUS without being
  told.
- **Error (#cf222e)** and **success (#1a7f37)** sit in the same cool family as
  the rest; neither is stock red or stock green.

**In dark mode the roles invert rather than repeat.** On a near-black ground a
dark step carries no text: primary becomes step 600 (8.64:1), the button becomes
step 500 with near-black text (9.10:1). A button's surface and its text are one
decision, not two — an earlier version switched only the surface and produced
white-on-bright-green at **1.64:1**.

## Typography

**Montserrat for display and the wordmark, the system font for everything else.**
Body text in a web font costs load time for a difference nobody notices while
reading; in a heading and a wordmark everybody notices it.

Montserrat is **self-hosted**, and that is not a preference. A `<link>` to
`fonts.googleapis.com` transmits the visitor's IP to Google; Landgericht München I
ruled that a GDPR violation in 2022 (3 O 17493/20). For a site with a German
imprint that is a known risk, not a residual one. Two subsets live in
`static/schrift/`, about 108 KB, with the SIL Open Font License text beside them
as the licence requires.

The fallback chain behind Montserrat is **not** the system font but other
geometric faces that actually exist on the three platforms — Avenir Next on Mac,
Segoe UI Variable on Windows, Roboto on Android. If Montserrat fails to load the
heading still looks like a heading, rather than like body text set larger.

Tracking moves against size: negative at display sizes where a geometric grotesk
runs open, and positive on the small uppercase labels, which need air. Weight is
capped at 400/600/700 — three steps, far apart.

## Layout

The measure for body text is **60–75 characters**; prose columns cap around
`68ch` and do not stretch to the viewport on a wide monitor. Spacing runs on a
**4px base**, and the jump from `lg` (24px) to `xl` (48px) is where a section
ends and the next begins — the page is paced by that gap rather than by rules.

The layout is **symmetric and left-aligned**, not asymmetric. This is a
documentation site; a reader scanning for a code block should never have to
search for where the next line starts. Headings, body, and code all share one
left edge.

The header is full-bleed and dark in **both** schemes. That makes it its own
colour space: what sits in it takes its contrast from the bar being dark, not
from the page being light or dark. This was got wrong once — the mark was given
the light scheme's darkest green and reached 1.47:1 on the dark bar.

## Elevation & Depth

Depth comes from **tonal layers and borders first**, shadow last. `surface` and
`surface-sunken` do most of the work; a card is usually a fill change plus a
hairline, not a lift.

Where shadow is used it is always **two shadows, never one**: a tight one that
reads as a contact edge, and a wide soft one that reads as distance. A single
blurred shadow gives the grey halo that makes a light page look washed out — the
tight layer keeps the card's edge crisp while the soft layer does the lifting.
Three levels exist (`--e1`, `--e2`, `--e3`) and nothing needs a fourth. In dark
mode the top highlight (`--sheen`, white at 4.5%) does the lifting instead,
because a shadow on near-black is invisible.

## Shapes

Radius is **hierarchical, not uniform**: 4px on small controls, 6px on buttons
and fields, 12px on cards, fully round only on chips and avatars. One radius
everywhere is the tell that nobody chose it.

The mark has three rules that are not stylistic preferences:

1. **Never rotate it.** The offset runs bottom-left to top-right; turned, the
   figure reads as a loading spinner, and a security tool must not wear an
   interface element as its face.
2. **Never set `stroke-linejoin: round` on it.** The two corners carry the idea;
   the miter ratio is 1.62, well inside the default limit.
3. **It is a line, not a silhouette.** Filling it produces a blob.

The mark's one permitted movement is the halves closing into the circle they
have been pretending to be. It is a single parameter, and the contour stays
closed at every step — the straight segments simply reach length zero. Closed,
the radii resolve to a true circle (8.95 × 8.95); the anchors sit exactly on it.

## Components

- **`button-primary`** is the one green surface on a page. A page with two of
  them has no primary action. Its surface and text colour are a pair and are
  switched together, per scheme, never individually.
- **The focus ring is green and is not optional.** It is the first thing a
  keyboard user sees and it is one of the six places green is allowed at all:
  the mark, the focus ring, the primary button, the active nav item, the cart
  counter, and successful states.
- **`link`** is blue and underlined in body text. Do not restyle links green to
  get more brand on the page.
- **`chip-index` / `chip-nexus`** appear only on their own product's page.
- **`code-block`** uses the sunken surface, never a tinted one; a coloured code
  background competes with syntax highlighting.

Motion is **one curve and three durations**: `cubic-bezier(0.22, 0.61, 0.36, 1)`,
fast at the start and easing out — the movement of something that was pushed,
not something starting up. `--kurz` 140ms for a state on the same element,
`--mittel` 240ms for something arriving or leaving, `--lang` 380ms for something
travelling a distance. Anything slower than `--lang` is waiting, and waiting is
not design. Two curves on one page read as two programs.

Under `prefers-reduced-motion: reduce` the durations go to **1ms, not 0**: at
`0s` some browsers never fire `transitionend`, and code waiting on it waits
forever. Animations are switched off entirely rather than shortened, because an
animation with a fill mode would otherwise freeze on its first frame — exactly
the flicker the setting was meant to remove.

## Do's and Don'ts

- **Do** keep green under about 5% of any screen, and only in the six places
  listed above.
- **Don't** make links green. Blue links are a thirty-year agreement and this
  site is read by skimming.
- **Do** treat a button's surface colour and its text colour as one decision,
  and re-measure both when either changes scheme.
- **Don't** use `border` where `border-control` belongs, or the reverse. A card
  with a control edge looks like an input; an input with a card edge fails WCAG
  1.4.11.
- **Do** state a contrast ratio next to any new colour value, measured, in the
  source. Every existing value carries one.
- **Don't** add a second green. The ramp at hue 150° is the green; AIRLOCK's mint
  is one of its steps, 13 units away out of 441.
- **Don't** load a font, script, or image from a third-party host at runtime. The
  site promises it fetches nothing from anyone, and the font is self-hosted for a
  documented legal reason.
- **Do** give a product accent exactly one page. An accent on every page is not
  an accent.
- **Don't** rotate, fill, or round the corners of the mark.
- **Do** ship every page in both German and English. A page that exists in one
  language is not finished.
