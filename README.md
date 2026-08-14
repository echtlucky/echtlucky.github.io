# echtlucky.github.io

The product site: [AIRLOCK](https://github.com/echtlucky/airlock), NEXUS, the
Skillry FiveM scripts, a searchable skill index, plain-language material about
how AI assistants get tricked, and the published contract for the Skillry
licence API.

**Zero dependencies.** No framework, no bundler, no `npm install`. A site this
size does not need a build pipeline, it needs a loop.

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
  rescan.mjs      re-derives skill index verdicts from the real engine
  validate.mjs    structure, "nobody types their own verdict", and the
                  script catalogue's price and image rules
  linkcheck.mjs   every internal link must resolve
content/
  catalog.json    the skill index
  scripts.json    the FiveM script catalogue behind /scripts/
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

## How this site behaves

No trackers, no analytics, no cookies. The only thing stored in your browser is
the light/dark setting and which depth you picked in the Learn section — both
local, neither ever sent anywhere.

Every page except the forum is self-contained: no fonts, scripts or images from
anyone else. The forum is the exception and says so. It loads the Firebase SDK
from `gstatic.com` and talks to Firebase Authentication and Firestore, which
means an IP address reaches Google there even without signing in. Reading needs
no account; posting needs a confirmed email address. Firebase hashes the
password — this codebase never sees it.

`content/legal/` holds the Impressum and the privacy policy as Markdown, so they
can be revised without touching code. A missing file renders as a visible
placeholder rather than an empty page, and unfilled `{{TOKEN}}` values are marked
loudly: a legal page that merely looks finished is worse than one that admits it
is not.

## Licence

MIT.
