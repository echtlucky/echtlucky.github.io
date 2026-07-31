# Switching the forum on

The forum is built and waiting. It needs a Firebase project to point at. Total
time: about 20 minutes, all of it in a browser except the last two commands.

**Cost:** the free Spark plan covers this comfortably. Firestore's free tier is
50,000 document reads and 20,000 writes per day — a forum would need to be quite
busy to approach that.

---

## Before you start: what changes about the site

Right now the site stores nothing and calls nobody. Switching the forum on
changes that, and it is worth being clear about it:

- The forum page loads the Firebase SDK from `gstatic.com`. No other page does.
- Signed-in users get a record with their GitHub display name, avatar URL and
  account id. Posts are stored with the same.
- In Germany that means the site needs an **Impressum** and a
  **Datenschutzerklärung**. Both are legal requirements, not optional polish.
  Draft copy for both is in [`docs/LEGAL-DE.md`](LEGAL-DE.md) — read it, adjust
  it, and have it checked if you are unsure. I am not a lawyer.

Everything else on the site stays as it is: no trackers, no analytics, no
cookies.

---

## 1. Create the Firebase project

1. Go to **https://console.firebase.google.com** and sign in with a Google account.
2. **Create a project**. Name it whatever the site ends up being called.
3. **Turn Google Analytics off.** You do not need it, and leaving it on would
   contradict what the site says about itself.

## 2. Create the database

1. Left sidebar → **Build → Firestore Database** → **Create database**.
2. Choose **Production mode**. Not test mode — test mode is open to the world for
   30 days and then breaks, which is the worst of both.
3. Location: **eur3 (europe-west)** or **europe-west3 (Frankfurt)**. Keeping the
   data in the EU is the simpler position under GDPR.

## 3. Turn on GitHub sign-in

This is the part with a second browser tab, so take it slowly.

1. Firebase → **Build → Authentication** → **Get started** → **Sign-in method**.
2. Pick **GitHub**. Leave the panel open — you need the callback URL from it.
3. Copy the **authorisation callback URL** Firebase shows you. It looks like
   `https://<project-id>.firebaseapp.com/__/auth/handler`.
4. In a new tab: **https://github.com/settings/developers** → **OAuth Apps** →
   **New OAuth App**.
   - Application name: the site name
   - Homepage URL: `https://echtlucky.github.io` (or your domain once you have one)
   - Authorization callback URL: **paste the Firebase URL from step 3**
5. **Register application**, then **Generate a new client secret**.
6. Back in Firebase: paste the **Client ID** and **Client secret**, then **Save**.

## 4. Authorise your domains

Firebase → **Authentication → Settings → Authorised domains** → add:

- `echtlucky.github.io`
- `localhost` (for local testing)
- your custom domain, once it exists

Sign-in silently fails on any domain not in this list. If you ever see the popup
open and close with nothing happening, this is the first thing to check.

## 5. Get the config into the site

1. Firebase → **Project settings** (gear icon) → scroll to **Your apps** →
   **Web** (`</>`) → register an app. No hosting needed, we use GitHub Pages.
2. Firebase shows a `firebaseConfig` block. Copy the values into
   **`content/firebase.json`** in this repository.
3. Note the SDK version in the snippet URL and put it in `sdkVersion` in the same
   file.

**These values are not secrets.** They identify the project; they authorise
nothing. Google says so explicitly. The security boundary is `firestore.rules`
plus the authorised-domains list. Committing them is normal and correct.

## 6. Deploy the security rules

This is the step that actually protects anything. Do not skip it.

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick your project
firebase deploy --only firestore:rules
```

`firestore.rules` in the repository root is already written: everything readable,
nothing writable without a signed-in user, lengths bounded server-side, nobody
can set their own moderator role, and nothing is ever hard-deleted from the
client — removed posts are tombstoned so a thread cannot vanish mid-argument.

## 7. Build, look, ship

```bash
npm run build
npm run serve     # http://localhost:8080/forum/
```

Sign in, post a thread, reply to it. Then:

```bash
git add -A && git commit -m "Switch the forum on" && git push
```

## 8. Make yourself a moderator

1. Sign in once on the live site.
2. Firebase → **Authentication → Users** → copy your **User UID**.
3. Firestore → **Data** → `users` → your document → add a field
   `role` = `moderator` (string).
4. Also add the uid to `moderatorUids` in `content/firebase.json`, rebuild, push.

Two places on purpose: Firestore decides what you are *allowed* to do, the JSON
decides what buttons you are *shown*. The rules are the ones that matter.

---

## When something does not work

| What you see | Almost always |
| :--- | :--- |
| Popup opens, closes, nothing happens | Domain missing from **Authorised domains** |
| `auth/unauthorized-domain` | Same |
| `permission-denied` on posting | Rules not deployed — step 6 |
| Threads never load | Wrong `projectId`, or Firestore never created |
| Nothing loads at all, console 404 on gstatic | Wrong `sdkVersion` |
| `auth/operation-not-allowed` | GitHub provider not enabled in Firebase |

The browser console is worth opening — Firebase errors are unusually clear about
which of these it is.

---

## Later, if the forum takes off

- **Firestore indexes.** Firebase will print a link in the console the first time
  a query needs a composite index. Click it; it builds itself.
- **App Check** (reCAPTCHA Enterprise) stops scripted abuse. Worth adding before
  the forum is popular enough to be worth abusing.
- **Budget alert.** Google Cloud console → Billing → Budgets. Even on the free
  tier, set one. It costs nothing and removes a category of unpleasant surprise.
