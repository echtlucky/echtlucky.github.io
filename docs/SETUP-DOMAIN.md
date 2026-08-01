# skillry.de — who serves what

This is the part that is easy to get wrong, because three different Google and
GitHub screens all offer to "add your domain" and only one of them is right.

**One sentence:** the website is served by **GitHub Pages**. Firebase is used for
the forum's login and database only, and **Firebase Hosting is not used at all**.

---

## The records that are live, and why

```
skillry.de        A      185.199.108.153   ┐
skillry.de        A      185.199.109.153   │  GitHub Pages.
skillry.de        A      185.199.110.153   │  All four, always.
skillry.de        A      185.199.111.153   ┘

www.skillry.de    CNAME  echtlucky.github.io.

n8n.skillry.de    A      212.227.45.18        the VPS, unrelated to the site
```

Those four `185.199.*` addresses **are** GitHub Pages. They are correct. Nothing
about them needs changing, and deleting them takes the website offline.

---

## Do not add skillry.de to Firebase Hosting

Firebase Hosting will happily accept `skillry.de` as a custom domain. It then
shows a panel that says, in effect:

> Add `A skillry.de → 199.36.158.100`
> Remove `A skillry.de → 185.199.108.153` (and .109, .110, .111)

That instruction is correct *for Firebase's purposes* and wrong for this project.
Firebase is asking to take the domain away from GitHub Pages so it can serve the
site itself — from an empty Hosting bucket, because nothing is ever deployed
there. Following it would replace a working website with Firebase's 404 page.

**If that dialog is open right now:** press *Close for now* / *Vorerst
schließen*, then go to **Hosting → the site → the three dots next to
`skillry.de` → Remove domain**. Removing an unverified custom domain from
Firebase changes no DNS record — it only stops Firebase asking.

This repository states the same thing in code: `firebase.json` declares
`firestore` and no `hosting` block, precisely so that a stray `firebase deploy`
cannot publish a competing copy of the site.

### What Firebase actually needs from the domain

Nothing, in DNS terms. Exactly one setting, in the console:

**Authentication → Settings → Authorised domains** must list

```
skillry.de
www.skillry.de
```

That list has nothing to do with DNS or Hosting. It is the allow-list of pages
permitted to run a Firebase sign-in, and without it forum login fails with
`auth/unauthorized-domain` on the real address while still working on
`localhost`.

---

## The CNAME file, and the trap in it

GitHub Pages decides which domain a site answers on by reading a file literally
named `CNAME` from the **published artifact** — not from the repository, not from
the settings page. This site builds into `dist/`, so `build/site.mjs` writes it:

```js
if (SITE_CFG.customDomain) {
  writeFileSync(join(OUT, 'CNAME'), `${SITE_CFG.customDomain}\n`, 'utf8');
}
```

It is behind that `if` on purpose. The moment a `CNAME` file appears, GitHub
starts 301-redirecting `echtlucky.github.io` to the domain named in it. If DNS
does not point back yet, **both** addresses then serve the registrar's parking
page, and the site is down without any build having failed.

The order is therefore: DNS first → confirm it resolves → *then* set
`customDomain` in `content/site.json`. Both values live there:

```json
{ "customDomain": "skillry.de", "origin": "https://skillry.de" }
```

`origin` feeds `sitemap.xml`, `robots.txt`, and every canonical and `og:url` tag.
Setting one without the other produces a site that quietly advertises the wrong
address to search engines.

---

## Deploying

There is no manual upload step and no path to copy files to. Pushing to `main`
is the deployment:

```bash
git push origin main
```

`.github/workflows/deploy.yml` then validates the skill index, re-derives every
verdict against the real AIRLOCK engine, builds `dist/`, checks that no internal
link is dead, and hands the folder to GitHub Pages. Roughly 30 seconds.

```bash
gh run watch --repo echtlucky/echtlucky.github.io
```

If the site looks stale after a push, the cause is almost always that the
commits are still local. `git status` says "up to date" about the *working tree*,
not about the remote:

```bash
git log --oneline origin/main..main   # anything listed here is not deployed
```

---

## Symptoms and causes

| Symptom | Cause |
| :--- | :--- |
| Firebase says the domain needs verifying | It is being asked to host a site it does not host. Remove the domain from Firebase Hosting. |
| Site is an old version | Commits not pushed. See `origin/main..main` above. |
| `auth/unauthorized-domain` on login | Domain missing from **Authentication → Authorised domains**. |
| Site 404s right after a deploy | `CNAME` missing from the artifact — `customDomain` is empty in `content/site.json`. |
| `www` works, apex does not | Only the CNAME exists; all four A records are needed. |
| HTTPS checkbox greyed out | Certificate still being issued, or a leftover `AAAA` record, or Cloudflare proxying (orange cloud). Pages needs grey cloud. |
| Both addresses show a parking page | `CNAME` was published before DNS resolved. Remove `customDomain`, redeploy, fix DNS, put it back. |

Check from outside the local resolver — Windows caches aggressively:

```bash
nslookup skillry.de 1.1.1.1
```

---

## Still open

- **Enforce HTTPS** is on. Turning it off again, if it ever has to be, is:

  ```bash
  gh api -X PUT repos/echtlucky/echtlucky.github.io/pages -F https_enforced=false
  ```

  Note `-F`, not `-f`: `-f` sends the string `"true"` and the API rejects it
  with a 422 that does not mention which flag was wrong.

- `www.skillry.de` currently resolves to a single A record
  (`185.199.108.153`) rather than a CNAME. It works, but it pins the site to one
  of four servers and will not follow GitHub if those addresses ever change.
  Replacing it at the registrar with `CNAME www → echtlucky.github.io.` is the
  documented setup.
