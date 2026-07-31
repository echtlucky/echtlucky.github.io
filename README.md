# echtlucky.github.io

The product site: [AIRLOCK](https://github.com/echtlucky/airlock), NEXUS, a
searchable skill index, and plain-language material about how AI assistants get
tricked.

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
writes back the result with its date and engine version. Continuous integration
then re-derives every verdict and **fails if the file disagrees**, so a pull
request cannot introduce an entry that claims to be clean.

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

No trackers, no analytics, no cookies, no fonts or scripts from anyone else.
The only thing stored in your browser is the light/dark setting and which depth
you picked in the Learn section — both local, neither ever sent anywhere.

The forum is GitHub Discussions, so the only account involved is one you already
control. No password of yours is ever stored here.

## Licence

MIT.
