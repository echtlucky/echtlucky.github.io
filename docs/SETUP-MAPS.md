# Switching GeoBingo on

`/geobingo/` is a self-contained game page: no site header, no footer, no
navigation, `noindex`, and not in the sitemap or the site search. It is reached
by URL plus an access code, and it is built for one job — a round played live
next to a stream.

It needs three things this repository cannot create for you. All three are in a
browser; total time about 30 minutes.

Until they exist, the page renders an explanation of which piece is missing
rather than a button that fails.

**This is the one page on this site that costs money.** Not much, and not
unavoidably, but the number is not zero and it scales with how much people
play. Section 4 is the part to read before opening it to a chat.

---

## 0. Try it first, for free

Before spending anything, play a full round with Firebase and Street View
replaced by stand-ins:

```bash
npm run trocken
```

Then open <http://localhost:8123/trocken/>. Lobby, settings, words, the round,
the review with thumbs, teams, the result — all of it runs, and not one byte
goes to Google. It is the cheapest way to decide how long a round should be and
which words work before a real one is played.

What the dry run does **not** check: the security rules (it has none), whether
a panorama really shows a hydrant, and the bill (that is the point).

---

## 1. The Google Cloud project and the key

1. Open [console.cloud.google.com](https://console.cloud.google.com) and create
   a project. `skillry-geobingo` is a fine name.
2. **Billing → Link a billing account.** A card is required even to use only
   the free monthly allowance. There is no way around this; Google will not
   issue a Maps key without it.
3. **APIs & Services → Enable APIs.** Enable exactly two:
   - **Maps JavaScript API** — the 3D panorama you walk around in, in the round
     and again in the review.
   - **Street View Static API** — the still image behind every find.

   Enabling more than these two is how a key ends up billable for things the
   page never asked for.
4. **APIs & Services → Credentials → Create credentials → API key.**
5. **Restrict the key immediately.** An unrestricted Maps key on a public page
   is somebody else's free quota, billed to you.
   - *Application restrictions* → **Websites**:
     `https://skillry.de/*`, `https://www.skillry.de/*`,
     `https://echtlucky.github.io/*`, and `http://localhost:8123/*` for local
     preview.
   - *API restrictions* → **Restrict key**, and pick the same two APIs.
6. Paste the key into `content/geobingo.json` → `mapsApiKey`.

The key is not a secret and cannot be one — it necessarily ships in the page a
browser downloads. Google documents this explicitly. What protects it is the
referrer restriction above and the cap in section 4, not concealment.

---

## 2. Firebase: one switch and the rules

The lobby runs on the same Firebase project as the forum (`skillry-203fb`), so
there is no second project to create.

1. **Guest sign-in — required, not optional.** GeoBingo has no accounts and no
   sign-in screen at all. Everybody who plays gets an anonymous Firebase user
   id, and the name they type lives in the lobby and nowhere else.

   Firebase console → **Authentication → Sign-in method → Anonymous → Enable**.

   Without it, opening a lobby fails and the page says
   *"Der Gastzugang ist in der Firebase-Konsole aus (Authentication →
   Sign-in method → Anonymous)."* — that message exists because this is the
   step everybody forgets.

2. **Deploy the security rules.** They are in `firestore.rules`, and the
   `geobingo` block is new. Without this every write is refused and the page
   says *"Die Datenbank hat das abgelehnt. Vermutlich sind die
   GeoBingo-Regeln noch nicht ausgerollt."*

   ```bash
   firebase deploy --only firestore:rules
   ```

3. **A time-to-live rule on the lobbies.** A lobby is deleted when the host
   leaves — but a crashed browser or a closed laptop leaves one behind, and
   nothing else ever removes it.

   Firestore console → **Time-to-live** → *Create policy*:
   - Collection group: `geobingo`
   - Timestamp field: `angelegt`

   **This is what makes privacy policy section 6.3 true rather than
   aspirational** — it says a lobby does not outlive its round.

   Note what a TTL policy does not do: it removes the lobby document.
   Sub-collections are not cascaded, so `spieler`, `woerter` and `funde` under
   an abandoned lobby survive as orphaned paths. They are unreachable — a lobby
   is only ever found by its code, and the code is gone with the document — but
   they are still stored. Saying so here is cheaper than discovering it later.

---

## 3. The access code

`content/geobingo.json` → `zugangscode`. Case and dashes are ignored, so
`ZEBRA HYDRANT 7` and `zebra-hydrant-7` are the same code. It can also be put
in the link: `…/geobingo/?k=zebra-hydrant-7` opens straight through, which is
the form to paste into a Discord DM.

**It is a door, not a lock, and the page says so on the code screen.** This is
a static file on GitHub Pages; the code is inside it, and anybody determined
enough will find it. What it does buy:

- The page is not linked from anywhere on the site, is excluded from
  `sitemap.xml` and the site search, and carries `noindex, nofollow`.
- Somebody who guesses the URL sees a code field, not a lobby.

That is the right amount of protection for a game page and the wrong amount for
anything else. If it ever needs to be genuinely closed, it needs a server in
front of it — GitHub Pages cannot do that.

Change the code by editing the field and rebuilding. Anybody who has already
been let in stays in until they clear their browser storage (`gb:zutritt`).

---

## 4. What it costs, honestly

Two SKUs, priced an order of magnitude apart. Figures are Google's list prices
as of August 2026 — check
[the current pricing list](https://developers.google.com/maps/billing-and-pricing/pricing)
before relying on them.

| What | SKU tier | Free each month | Then, per 1,000 |
| --- | --- | --- | --- |
| **Dynamic Street View** — a panorama you can look around in | Pro | 5,000 | $14.00 |
| **Static Street View** — the still image behind a find | Essentials | 10,000 | $7.00 |
| Street View **metadata** — the search for a random location | — | unlimited | free |

Four things follow, and they are why the page is built the way it is:

**Walking is the expensive part.** Dynamic Street View is billed *per
panorama*, not per session. A player who takes forty steps has loaded forty
panoramas. That is why movement is a lobby setting:

- **Fest** (frozen) — **one** charged panorama per player per round.
- **Pfeile** (arrows only) — as many as somebody walks, but walking is slower.
- **Frei** — the full game, and the full bill.

Four players on *Frei* for ten minutes is very roughly 300–500 panoramas. Call
it 12 rounds inside the free allowance, and about €4–7 per round after that. On
*Fest*, the same allowance is over a thousand rounds.

**The review opens 3D on click, not by itself.** Every picture in the review is
a cheap static image; pressing one opens a real panorama, which is a Pro-tier
charge. If all of them opened automatically, arriving at the review would cost
as much as the round did.

**Thumbnails are fetched once.** The card in the round is patched rather than
rebuilt, so a find's picture is requested once and then stays. This is the
single biggest reason the page is cheap to run with several players clicking at
the same time.

**Set the cap, not just the alert.** A budget alert is an email that arrives
after the money is gone.

- Billing → **Budgets & alerts** → say €10/month with alerts at 50/90/100%.
  This notifies. It does not stop anything.
- APIs & Services → **Quotas** → a hard daily ceiling on *Map loads* and
  *Street View loads*. This is the one that stops the meter. Past the ceiling
  the page shows "Street View hat nicht geladen" and the round cannot start,
  which is by far the better failure.

---

## 5. Check it worked

```bash
npm run validate    # the summary ends with "maps key set" or "maps key EMPTY"
npm run build
npm run serve       # http://localhost:8123/geobingo/
```

Then, in the browser:

1. Open the page, type the access code, pick a name, open a lobby.
   - *"Der Gastzugang ist … aus"* → step 2.1.
   - *"Die Datenbank hat das abgelehnt"* → step 2.2.
2. Add a word, press start.
   - *"Street View hat nicht geladen"* → in order of likelihood: the referrer
     restriction does not list the address you are on, one of the two APIs is
     off, or the key is wrong.
   - *"Vierzig Versuche … und kein Panorama"* → the selected regions have poor
     coverage. Switch **Nur Innenstädte** on, or add a region.
3. Click a word. A thumbnail appears beside it within a second. If the panorama
   works but the thumbnails stay empty, the **Street View Static API**
   specifically is off — it is a separate API from the JavaScript one and easy
   to miss in step 1.3.

---

## What this set-up deliberately does not do

- **No server.** There is no backend proxying the key, so the key is in the
  page and the score is computed in the browser. Somebody who opens the console
  can write any number into their own display; they cannot change a document,
  so everyone else still sees the real standing. The check that matters is the
  review, where the other players vote — a design choice, and
  `firestore.rules` says so where the rules stop.
- **No image storage.** A find is a panorama id and four numbers. Nothing is
  uploaded and nothing is stored as a file, which is why there is no Cloud
  Storage bucket in this document and no upload quota to worry about.
- **No moderation.** Words are typed by whoever is in the lobby, and a lobby is
  whoever has the code. That is fine for a group of friends and is the whole
  security model.
