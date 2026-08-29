<p align="center">
  <img src="static/marke/zeichen.svg" alt="Skillry" width="96">
</p>

# echtlucky.github.io

The product site: [AIRLOCK](https://github.com/echtlucky/airlock), NEXUS, the
Skillry FiveM scripts, a searchable skill index, plain-language material about
how AI assistants get tricked, and the published contract for the Skillry
licence API.

**No build dependencies.** No framework, no bundler, no `npm install`. A site
this size does not need a build pipeline, it needs a loop.

This used to say *zero dependencies*, and since 17.08.2026 that is no longer
true: the home page loads **GSAP and ScrollTrigger** for its scroll
choreography. They are checked in under `static/js/` — never from a CDN, for
the same reason the font is self-hosted — and they ship only on pages that
opt in with `export const bewegung = true`. Every other page is unchanged and
still fetches nothing.

The claim was corrected rather than quietly left standing. A README that
promises something the code stopped doing is worse than the dependency.

```bash
node build/site.mjs      # build to dist/
node build/serve.mjs     # preview on http://localhost:8080
```

## Layout

```
build/
  site.mjs        the build — emits every page once per language
  layout.mjs      page shell: header, nav, language switch, footer
  theme.mjs       design tokens and the stylesheet
  pages/          one module per page, content in both languages
  geobingo-spiel.js  the GeoBingo client, plain JS rather than a string array
  rescan.mjs      re-derives skill index verdicts from the real engine
  validate.mjs    structure, "nobody types their own verdict", the script
                  catalogue's price and image rules, and that the game never
                  reads a string neither language has
  linkcheck.mjs   every internal link must resolve
content/
  catalog.json    the skill index
  scripts.json    the FiveM script catalogue behind /scripts/
  geobingo.json   the game's key, start regions and word packs
test/
  rules.mjs       proves the forum rules against the live project
  trocken/        plays GeoBingo with Firebase and Street View stubbed out
dist/             generated, not committed
```

A page module exports `slug`, `meta`, `body(lang)`, and optionally `script(lang)`
and `head(lang)`. `head` is where a page keeps CSS nobody else needs — the shop
layout has no business loading on the Impressum.

English lives at the root, German under `/de/`. Adding a language means adding
it to `LANGS` and filling in the strings — the loop does the rest.

## The skill index

Every entry carries a verdict, and **no verdict in this repository was typed by
hand**. `build/rescan.mjs` runs the actual AIRLOCK engine over each skill and
writes back the result with its date and engine version.

Continuous integration re-derives those verdicts and **fails if the file
disagrees**, so a pull request cannot introduce an entry that claims to be
clean. Two honest qualifications, because a guarantee is worth what its
exceptions are worth:

- It currently covers **5 of the 21 entries** — the ones with a `localPath`
  into a local AIRLOCK checkout. The other sixteen hold verdicts that
  `build/fetch-scan.mjs` produced from a remote file at whatever the default
  branch pointed at that day. Real verdicts, but not reproducible ones,
  because nothing records the commit they came from. `npm run validate
  --verdicts` prints the ratio rather than rounding it up.
- Pinning every entry to a commit and a blob hash is the next piece of work,
  and it is what will make the sentence above true without a footnote.

The check itself no longer has a quiet way out: the AIRLOCK checkout in
`.github/workflows/deploy.yml` used to be `continue-on-error`, with the verdict
step conditional on it. A missing checkout therefore skipped the check and the
build went green — a guarantee that stops applying exactly when it is needed.

### Submitting a skill

1. Add an object to `content/catalog.json`. Required: `id`, `name`, `author`,
   `source`, `url`, `license`, `tags`, and `title` / `description` in both
   languages. Leave `scan` as `null`.
2. Open a pull request. CI validates the structure and derives the verdict.
3. A `block` verdict does not reject an entry automatically — a security tool
   can legitimately trip its own rules. It does mean somebody explains why.

```bash
npm run validate                                   # structure
AIRLOCK_PATH=../airlock npm run validate:verdicts  # and the verdicts
```

## The scripts page

`/scripts/` lists every FiveM resource in `content/scripts.json` and carries a
basket. Three rules hold it together, and all three are about what it may not
do.

**No script source reaches the browser.** The page renders a name, a version, a
sentence and the dependencies each resource declares — no Lua, no config, not
one excerpt. That is not caution, it is the situation: whatever a browser loads,
anybody can read, and minifying is a threshold of minutes. The protection that
holds is Cfx.re Asset Escrow and the licence check, both written out on
`/api/`. The page says so in those words rather than implying otherwise.

**No invented facts.** Every version is the `version` from that resource's own
`fxmanifest.lua`. Every count on the page — how many scripts, how many priced,
how many with a recording — is derived from the file at build time, so a
sentence cannot rot into a lie when the data changes. `price` is `null`
everywhere today and the page therefore shows no price at all; fill the field in
and it appears on the card and in the basket. `npm run validate` rejects a price
that is a string, zero or negative, and rejects an image without `w` and `h`,
because a picture without dimensions makes the page jump while it loads.

**No checkout.** The basket collects a selection, keeps it in `localStorage`,
and ends in a message the visitor sends themselves — Discord once
`handoff.discord` holds an invite, otherwise the address from the site notice,
plus a copy button. There is no payment step and no payment provider. It exists
on that one page and is deliberately absent from the site header.

The page reads without JavaScript: every script and description is in the HTML
and `<details>` opens on its own. JavaScript adds the grid/list switch, opening
a card from a `#produkt-…` link, and the basket — and the controls for those are
hidden by a `<noscript>` stylesheet rather than shown and dead.

## GeoBingo

A live bingo round in Street View, and the one page here that is not part of
the site. It has no header, no footer, no navigation, is linked only from the
footer, is excluded from the sitemap and the search, carries `noindex`, and
sits behind a Google sign-in. It exists to be played full-screen next to a
stream.

**Who may open a round is decided per account, and decided by Firestore.** The
admin is pinned in `firestore.rules` to an email address, matched against the
sign-in token — not to a database row somebody could delete, and not to
`content/geobingo.json`, which ships to the browser. The value there only
decides who SEES the buttons, and `npm run validate` fails when the two
disagree: a page offering buttons the database refuses is worse than one that
hides them.

Signing in is not the same as being unlocked. Anybody signed in can join
somebody else's round through an invite link; opening one of your own needs an
entry in `skillry_zugang`. Without that split, every friend of every streamer
would have to be unlocked by hand. If a link leaks, the host switches the lobby
to unlocked accounts only and the link stops being enough.

Until 29.08.2026 this was an access code in the built HTML. It was described
here as a door and not a lock, and for a round among friends it was enough. For
an event where access is handed out deliberately it was worth nothing, and it
was replaced rather than reinforced.

The start screen is one column: play, browse lobbies, join with code, Discord.
A lobby is private by default and reachable only through its code; a host can
switch it to public, and then it appears under **Browse lobbies**. That is a
database rule and not an interface choice — `allow list` requires
`resource.data.oeffentlich == true`, so a query without that filter is refused
outright and a private lobby cannot show up there even if this code were wrong.

A lobby has a five-character code. Everybody in it edits one shared word list —
**own words first, the packs are only a quick way to fill it** — and agrees on
length to the minute, movement, teams or free-for-all, which regions are in
play, and whether scores are visible while the round runs. During the round a
left-click on a word records the view you are looking at, zoom included, so
zooming in on a dog and then clicking "Hund" saves the dog. When the clock runs
out everybody lands in the review together, where any picture can be opened as
a real 3D panorama and argued about.

Six things carry it, and most of them are about what it refuses to do.

**A find is five numbers, not a screenshot.** The panorama renders into a WebGL
surface the browser will not let anyone read back — `canvas.toDataURL()` throws
there, and no trick changes that. So a find stores the panorama id, heading,
pitch, field of view and coordinate. The Street View Static API rebuilds the
picture from them, and the same numbers put a real panorama back at that exact
spot in the review. Nothing is uploaded, nothing is stored as a file, a find is
120 bytes, and nobody can crop a screenshot after the fact.

**Movement is a setting because it is a bill.** Google charges dynamic Street
View *per panorama*, walking included. A round on `Fest` is one charged
panorama per player; a round on `Frei` is however many streets somebody
wandered down. `docs/SETUP-MAPS.md` says what each mode costs rather than
leaving it to be discovered on an invoice. Searching for a random start
location is free — Street View metadata is not billed — which is why the game
may roll forty times to find a place with panoramas.

**The card is patched, never rebuilt.** `innerHTML` on the word list would
replace every image on every snapshot, and each replaced image is another
billed request for a picture already in the browser. With several players
clicking at once that is hundreds of pointless requests, so the buttons are
built once and only their state changes afterwards. The panorama element is
under the same rule for the same reason, plus one more: rebuilding it would put
the player back at their starting point mid-round.

**A find fails only if everybody else votes it down.** Not a majority: doing
nothing lets a find count, and one grump cannot kill it. A thumbs-up therefore
never makes a find worse — it is agreement you can give without it being
needed.

**The page carries its own stylesheet.** It is the only `blank` page in the
build (see `renderBlank()` in `build/layout.mjs`): no `theme.mjs`, no header,
no scenes, no grain. That is not taste, it is the 167 KB of chrome a page with
a running clock and a WebGL panorama would otherwise repaint for nothing. The
page is 23 KB.

**Nothing claims to verify a find.** No database rule can check whether a
panorama really shows a hydrant, and the score is computed in the browser.
`firestore.rules` says both out loud where the rules stop. The check that
works is the review, which is why it is not decoration.

The page is off until `content/geobingo.json` has a Maps key, and it renders an
explanation of which piece is missing rather than a button that fails.
`npm run validate` ends with `maps key set` or `maps key EMPTY`.

### Playing it for free

```bash
npm run trocken     # then http://localhost:8123/trocken/
```

`test/trocken/` replaces Firebase and Street View with stand-ins and rebuilds
the real built page around them — an import map for the Firebase modules, a
fake `google.maps` that is already present so the loader never fetches, and a
Content-Security-Policy that blocks the static image host outright rather than
painting over it. Lobby, round, review, teams and result all run, and nothing
reaches Google. It does not check the security rules, and it cannot tell you
whether a picture really shows a hydrant.

## The notice in the bottom left

Not a consent banner, and it does not pretend to be one. This site sets no
cookies, measures nothing and advertises nothing; what lands in the browser is
what somebody set themselves. There is nothing to consent to under § 25 (2)
TDDDG, and an "accept all" button with nothing to accept is the dishonest kind
of formality — it trains people to click away the ones that do matter.

So it says the true thing instead: what is stored locally, that the forum and
GeoBingo talk to Google once you use them, and where the long version is. One
button, one link, gone. Dismissing it writes `skillry:hinweis` to
`localStorage`, which makes the notice the only thing it describes.

## How this site behaves

No trackers, no analytics, no cookies. What is stored in your browser is the
light/dark setting, which depth you picked in the Learn section, and — if you
play GeoBingo — the code of the lobby you are in. All local, none of it ever
sent anywhere.

**Two pages are not self-contained, and both say so.** Everything else fetches
nothing from anybody.

The forum loads the Firebase SDK from `gstatic.com` and talks to Firebase
Authentication and Firestore, which means an IP address reaches Google there
even without signing in. Reading needs no account; posting needs a confirmed
email address. Firebase hashes the password — this codebase never sees it.

GeoBingo additionally loads Google Maps. It is staged: Firebase loads when the
sign-in screen needs it, the Maps library only once a round actually starts.
Somebody who opens the page and leaves without signing in has not spoken to
Google at all.

That used to be one exception rather than two, and the privacy policy said in
so many words that *every* page but the forum fetches nothing from anyone else.
That sentence was rewritten rather than left standing — the same correction
this README made about GSAP above, for the same reason.

`content/legal/` holds the Impressum and the privacy policy as Markdown, so they
can be revised without touching code. A missing file renders as a visible
placeholder rather than an empty page, and unfilled `{{TOKEN}}` values are marked
loudly: a legal page that merely looks finished is worse than one that admits it
is not.

## Licence

MIT.
