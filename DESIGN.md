---
version: beta
name: Verwerfung
description: Design system for skillry.de — the roof over every Skillry project. One construction shared by all of them, one violet brand layered over sky-blue, and each product keeping its own accent on its own page.
colors:
  primary: "#5c2fbd"
  secondary: "#4a2497"
  tertiary: "#0969da"
  himmel: "#2467d6"
  surface: "#ffffff"
  surface-sunken: "#f7f5fb"
  on-surface: "#211c33"
  on-surface-muted: "#5d5575"
  border: "#ddd7ea"
  border-control: "#8d84a8"
  header: "#1d1830"
  on-header: "#ffffff"
  error: "#cf222e"
  success: "#1a7f37"
  accent-airlock: "#0f7a4f"
  accent-nexus: "#0a7ea4"
  accent-index: "#9a6700"
  accent-scripts: "#c2410c"
  accent-forum: "#be2f6f"

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
  island: 15px
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

Skillry is no longer one tool with a page. It is a roof over projects — AIRLOCK,
NEXUS, DECK, the skill index, the forum, the FiveM scripts, the roleplay server —
and the design system is what makes them one house: **the same construction
everywhere, a different colour per project.** A card on the front page, a panel
in NEXUS and a column in the shop are built from the same shell, the same radii,
the same two-shadow elevation; what changes between them is which accent they
carry. That is the whole idea, and everything below serves it.

What this direction gives up, on purpose:

- **Warmth.** The neutrals are cool — violet-tinted white and a violet night.
  There is no clay, no cream, no soft brand illustration.
- **Noise.** The atmosphere lives *behind* the column — aurora scenes, the
  swell, the grain — and is masked away from every line of running text. A
  background that competes with a paragraph is a background that made the
  paragraph worse.
- **A borrowed look.** The header used to borrow GitHub's near-black bar. It is
  now five floating dark islands in the site's own family — still a dark colour
  space in both schemes, no longer someone else's.

The site is **bilingual (de/en)** and every page exists in both. It ships **light
and dark**, and neither is the afterthought: light is the `:root` default, dark
arrives through `prefers-color-scheme` and through an explicit toggle that stamps
`data-theme` on `<html>`.

## Colors

The brand is **violet, layered over sky-blue — never one flat colour.** The
violet is a ten-step ramp at hue ~262°, and every step carries its measured
contrast against white and against the dark ground `#0d0a1a` in the source
(`build/marke.mjs`). Those numbers decide what a step is allowed to do: 4.5:1
and up may carry text, 3:1 and up may draw the edge of a control, below that it
is a surface and nothing else.

The second layer, `HIMMEL`, is the sky-blue light behind the violet. It appears
only in gradients, scenes and glows — never as text, never as a control edge —
and it is what keeps the grounds from being monochrome. The one written-out
gradient of the brand is violet → sky → cyan, and it appears in exactly three
places: the one lit word in the hero, the hairline above the footer, and the
reading-progress bar.

**Violet is the colour of identity and action, never of navigation.** Blue for a
link is not a matter of taste, it is a thirty-year-old agreement — and a violet
link would read as *visited*, which is worse than off-brand: it is wrong.

- **Primary (#5c2fbd, step 700):** the brand's voice in light mode. Carries text
  on white at 8.09:1. In dark mode the roles mirror: step 400 (`#9e82f8`)
  carries text on the night at 6.51:1.
- **Secondary (#4a2497, step 800):** the surface of the primary button in light
  mode, paired with white at 10.55:1. In dark mode the button is step 400 with
  near-black violet ink (`#120833`) at 6.32:1 — surface and text are one
  decision, not two.
- **Tertiary (#0969da):** link blue — the sole driver of navigation.
- **Border (#ddd7ea)** is the edge of a *surface*; **border-control (#8d84a8)**
  is the edge of a *control* and measures 3.50:1 on white (dark: `#6f6494`,
  3.65:1 on the night). WCAG 1.4.11 demands 3:1 for the second and says nothing
  about the first, and the two must not be swapped.
- **The night (#0d0a1a)** and its layers `#161126` / `#211939` are steps of one
  violet-indigo family, not a grey that got tinted. Depth in dark mode is the
  surface getting lighter as it rises, plus a hairline of light on the top edge.
- **Product accents:** mint for AIRLOCK, cyan for NEXUS, amber for the index and
  the licence, orange for the scripts and the roleplay server, pink for the
  forum, sky-blue for the API contract. A product owns its colour on its own
  page — and on the front-page doors, where every project shows the same card
  with its own accent. An accent on every page is not an accent.
- **Error (#cf222e)** and **success (#1a7f37)** stay in the cool family; neither
  is stock red or stock green. Success stays green on purpose — green left the
  brand, not the vocabulary of states.

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

The layout is **symmetric and left-aligned**, not asymmetric. A reader scanning
for a code block should never have to search for where the next line starts.
Headings, body, and code all share one left edge.

The header is five floating islands — mark, navigation, search, language,
actions — and it is dark in **both** schemes. That makes it its own colour
space: what sits in it takes its contrast from the islands being dark, not from
the page being light or dark. The mark in the header is `--marke-auf-dunkel`
(step 300, `#b7a2fb`), measured at 6.54:1 on the island ground; this was got
wrong once with a scheme-dependent token that reached 1.47:1.

## Elevation & Depth

Depth comes from **tonal layers and borders first**, shadow last. `surface` and
`surface-sunken` do most of the work; a card is usually a fill change plus a
hairline, not a lift.

Where shadow is used it is always **two shadows, never one**: a tight one that
reads as a contact edge, and a wide soft one that reads as distance — and both
are drawn from the darkest violet of the palette, never neutral black, or a grey
halo settles around every surface. Three levels exist (`--e1`, `--e2`, `--e3`)
and nothing needs a fourth. In dark mode the top highlight (`--sheen`, white at
4.5%) does the lifting instead, because a shadow on near-black is invisible.

Behind the column, the main pages carry **scenes** — pure-CSS atmospheres, one
per page, masked away from the text: the aurora on the front page (violet and
sky, the brand's layering at page scale), air behind AIRLOCK, the panel lattice
behind NEXUS, the question field behind the index, the road behind the scripts.

## Shapes

Radius is **hierarchical, not uniform**: 4px on small controls, 6px on buttons
and fields, 12px on cards, 15px on the header islands, fully round only on chips
and avatars. One radius everywhere is the tell that nobody chose it.

**The sharp edge lives beside the soft one, not instead of it.** Cards that
belong to a project carry crop-mark corners: two right-angled brackets sitting
*outside* the rounded corners, square, two pixels thick, in the project's
accent (`--eck`). A sharp angle next to a soft corner reads as a set mark; a
sharp angle on top of a soft corner reads as a mistake. Not every card gets
them — a highlight that is everywhere is a texture.

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

- **`button-primary`** is the one violet surface on a page. A page with two of
  them has no primary action. Its surface and text colour are a pair and are
  switched together, per scheme, never individually — white on the dark-mode
  button surface would be 3.00:1, which is how this rule earns its keep.
- **The focus ring is violet and is not optional.** `--marke-rand` measures
  5.78:1 on white and 4.75:1 on the night — a control edge with reserve, not
  one balancing on the 3:1 line.
- **`link`** is blue and underlined in body text. Do not restyle links violet
  to get more brand on the page.
- **`chip-index` / `chip-nexus`** appear only on their own product's page.
- **`code-block`** uses the sunken surface, never a tinted one; a coloured code
  background competes with syntax highlighting.
- **Images are inline SVG drawn from theme tokens**, so they follow the scheme
  instead of being right in one of the two. Nothing is fetched for decoration —
  not from a third party, and not from us.

Motion is **one curve and three durations**: `cubic-bezier(0.22, 0.61, 0.36, 1)`,
fast at the start and easing out — the movement of something that was pushed,
not something starting up. `--kurz` 140ms for a state on the same element,
`--mittel` 240ms for something arriving or leaving, `--lang` 380ms for something
travelling a distance. Anything slower than `--lang` is waiting, and waiting is
not design. Two curves on one page read as two programs. Sections and cards
arrive on scroll everywhere; the front page adds the GSAP choreography, and
navigation cross-fades through view transitions with the header held still.

Under `prefers-reduced-motion: reduce` the durations go to **1ms, not 0**: at
`0s` some browsers never fire `transitionend`, and code waiting on it waits
forever. Animations are switched off entirely rather than shortened, because an
animation with a fill mode would otherwise freeze on its first frame — exactly
the flicker the setting was meant to remove.

## Do's and Don'ts

- **Do** keep violet under about 5% of any screen, and only in the named places:
  the mark, the focus ring, the primary button, the active nav item, the cart
  counter, and the crop-mark corners of cards that belong to no project.
- **Don't** make links violet. They would read as visited links, and this site
  is read by skimming.
- **Do** treat a button's surface colour and its text colour as one decision,
  and re-measure both when either changes scheme.
- **Don't** use `border` where `border-control` belongs, or the reverse. A card
  with a control edge looks like an input; an input with a card edge fails WCAG
  1.4.11.
- **Do** state a contrast ratio next to any new colour value, measured, in the
  source. Every existing value carries one.
- **Don't** add a second violet, and don't promote `HIMMEL` to text or edges —
  it is the layer behind the brand, not a second brand.
- **Don't** load a font, script, or image from a third-party host at runtime. The
  site promises it fetches nothing from anyone, and the font is self-hosted for a
  documented legal reason.
- **Do** give a product accent exactly one page — plus its door on the front
  page, where every project stands in the same construction with its own colour.
- **Don't** rotate, fill, or round the corners of the mark.
- **Do** ship every page in both German and English. A page that exists in one
  language is not finished.
