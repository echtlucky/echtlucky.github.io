# Putting the site on your own domain

**GitHub does not sell domains.** You buy one from a registrar, then point it at
GitHub Pages with two DNS records. GitHub does the HTTPS certificate for free and
renews it automatically.

Total time: fifteen minutes, most of it waiting for DNS.

---

## 1. Buy the domain

Any registrar works. Sensible ones, cheapest first:

| Registrar | Notes |
| :--- | :--- |
| **Porkbun** | Cheap, no upsell theatre, free WHOIS privacy. `.dev` and `.io` are good value here. |
| **Cloudflare Registrar** | Sells at cost, no markup ever. Requires moving DNS to Cloudflare — fine, and their DNS is fast. |
| **Namecheap** | Well known, decent panel, occasional upsells to click past. |
| **INWX / united-domains** | German, German-language support, better for a `.de`. |

**Avoid** the domain add-ons bundled with cheap web hosting. Moving away from
those later is reliably tedious.

### Which extension

- `.dev` — Google-run, **HTTPS enforced by the TLD itself**, reads as a developer
  project. Around €12–15/year.
- `.io` — the default for developer tools, though pricier at €30–40/year and with
  a politically messy history worth being aware of.
- `.com` — the one non-technical visitors will guess. Worth having if the name is
  free.
- `.de` — right if the audience is mostly German. It is not, so at most a
  redirect.

A reasonable move: buy the `.com` **and** the `.dev`, serve the `.dev`, redirect
the `.com`. Two domains is still under €30 a year.

---

## 2. Add the DNS records

At the registrar, open the DNS settings for the domain and add these.

**For the apex domain** (`example.com`) — four A records, all four:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

**For `www`** — one CNAME:

```
CNAME    www    echtlucky.github.io.
```

The trailing dot matters at some registrars and is ignored by the rest.

> If you use **Cloudflare** DNS, set the proxy to **DNS only** (grey cloud) for
> these records. Orange-cloud proxying in front of GitHub Pages causes redirect
> loops during certificate issuance.

---

## 3. Tell GitHub about it

1. Repository → **Settings** → **Pages**.
2. **Custom domain** → type the domain → **Save**.
3. Wait for the DNS check to go green. Usually minutes; occasionally an hour.
4. Tick **Enforce HTTPS** as soon as it is selectable. If it is greyed out, the
   certificate is still being issued — come back later, it is not broken.

GitHub writes a `CNAME` file into the repository when you save. Because this site
builds from `dist/`, that file needs to be part of the build instead — otherwise
the next deploy removes it. Add this to `build/site.mjs` near the other
site-level files:

```js
writeFileSync(join(OUT, 'CNAME'), 'example.com\n', 'utf8');
```

Then update `ORIGIN` in the same file so the sitemap points at the real domain.

---

## 4. Things that break, and why

| Symptom | Cause |
| :--- | :--- |
| “Domain does not resolve to the GitHub Pages server” | DNS has not propagated. Wait. `nslookup example.com` should return the four addresses above. |
| HTTPS box permanently greyed out | Usually a Cloudflare orange cloud, or an `AAAA` record left over from a previous host. |
| Site works, then 404s after a deploy | The `CNAME` file is not in the build output — see step 3. |
| `www` works, apex does not | Only the CNAME was added, not the four A records. |
| Certificate warning after switching | Remove and re-add the custom domain in Settings to force re-issuance. |

Check propagation from outside your own network — your machine caches DNS
aggressively:

```bash
nslookup example.com 8.8.8.8
```

---

## 5. After it is live

- Update `ORIGIN` in `build/site.mjs` so `sitemap.xml` and `robots.txt` are right.
- Add the domain to Firebase → **Authentication → Settings → Authorised domains**,
  or forum sign-in will stop working on the new address.
- Update the OAuth app's homepage URL at
  **https://github.com/settings/developers**.
- Submit `https://example.com/sitemap.xml` to
  **https://search.google.com/search-console**.

That last one is the only thing standing between the site and being findable at
all. It is free and takes two minutes.
