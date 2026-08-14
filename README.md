# echtlucky.github.io

The product site: [AIRLOCK](https://github.com/echtlucky/airlock), NEXUS, a
searchable skill index, plain-language material about how AI assistants get
tricked, and the published contract for the Skillry licence API.

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
  validate.mjs    structure + "nobody types their own verdict"
  linkcheck.mjs   every internal link must resolve
content/
  catalog.json    the skill index
dist/             generated, not committed
```

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
