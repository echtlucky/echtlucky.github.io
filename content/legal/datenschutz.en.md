This site is built to learn as little about you as possible. What it does learn is written down here in full, without the usual dilution.

## 1. Controller

Lucas Steckel  
Ackerstraße 4A  
45701 Herten  
Germany  
E-mail: [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com)  
Phone: +49 177 5836332

No data protection officer has been appointed; the statutory thresholds for that are not met.

## 2. The short version

- No tracking, no analytics, no advertising, no profiling.
- No cookies. What is stored in your browser stays in your browser.
- No fonts, scripts or images from third-party servers — **except** on the forum page, see section 5.
- Without signing in to the forum, no account exists and nothing about you is stored on my side.

---

## 3. Visiting the site (hosting)

This site is served by **GitHub Pages**, a service of GitHub B.V., Prins Bernhardplein 200, 1097 JB Amsterdam, Netherlands, a subsidiary of GitHub, Inc. (USA).

When a page is requested, GitHub processes the technically necessary connection data: your IP address, date and time, the requested address, the referrer, and browser and operating system details. A page cannot be delivered without them. I have no access to these logs and do not evaluate them.

**Legal basis:** Art. 6 (1) (f) GDPR. The legitimate interest is the secure and functional operation of the site.

**Transfer to third countries:** processing in the USA is possible. GitHub relies on the European Commission's standard contractual clauses (Art. 46 (2) (c) GDPR) and is certified under the EU-U.S. Data Privacy Framework. GitHub's privacy statement: [docs.github.com/site-policy/privacy-policies/github-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

## 4. What is stored in your browser

This site sets no cookies. It writes up to three values into your browser's `localStorage`:

| Key | Content | Purpose |
| --- | --- | --- |
| `theme` | `light` or `dark` | remembers the appearance you picked |
| `level` | the depth you chose in the Learn section | shows the same level on your next visit |
| `skillry:who` | your display name, and whether your email address is confirmed | lets the header show that you are signed in |

The first two are written only if you actually use the toggle. The third appears only when you sign in, and goes away when you sign out.

`skillry:who` deserves an explanation, because it is the reason the header can greet you without any page talking to Google. The signed-in state really lives at Firebase; asking Firebase would mean loading its SDK on **every** page — and the promise in section 5, that every page but the forum fetches nothing from anyone else, would stop being true. So signing in writes this one value locally, and every other page reads only that. It holds no token and no email address, and it authorises nothing: forge it by hand in your browser and you get somebody else's name in the corner of your screen and a refusal from the database.

None of the three is transmitted to me or to anyone else, and all can be cleared at any time in your browser settings.

**Legal basis:** § 25 (2) no. 2 TDDDG — the storage is necessary to provide a function you explicitly asked for. No consent is required, which is why there is no banner here.

If you are signed in to the forum, Firebase additionally stores a session token in local storage (see section 5).

---

## 5. The forum

The forum is the only part of this site that stores personal data persistently. It runs on **Firebase Authentication** and **Cloud Firestore**, services of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.

### 5.1 Establishing the connection

As soon as you open the forum page, your browser loads the Firebase SDK from `www.gstatic.com` and opens a connection to Google servers. Your IP address is transmitted to Google in the process — **even if you do not sign in**. Every other page on this site loads nothing from third-party servers.

**Legal basis:** Art. 6 (1) (f) GDPR. The legitimate interest is running a forum without operating server infrastructure.

### 5.2 Account and sign-in

Sign-in uses an e-mail address and a password. The password is hashed and stored by Firebase alone; this codebase never sees it in clear text and stores it nowhere.

Firebase Authentication processes: e-mail address, password hash, a user ID (UID), the verification status of the address, and the times of creation and last sign-in. For abuse prevention, Google additionally processes IP address and device data.

Posting requires a **verified** e-mail address, for which Firebase sends a confirmation message. This is not ceremony: without that hurdle, a forum is an open relay.

**Legal basis:** Art. 6 (1) (b) GDPR for providing the function you requested, and Art. 6 (1) (f) GDPR for abuse prevention.

### 5.3 Posts

For every thread and reply the following is stored: the display name you chose, your user ID, the title and body of the post, and the timestamp. **Posts are public and readable by anyone without signing in.** Your e-mail address is not shown.

Choose a display name that may be as public as it is about to become. What goes into a post is your decision — do not write anything into one that should not stand in public.

Deleted posts are not hard-deleted. The text is replaced and the record remains, so a conversation cannot vanish in the middle of a disagreement. On a request under Art. 17 GDPR the record is removed entirely.

### 5.4 Transfer to third countries

Google also processes data in the USA, on the basis of the European Commission's standard contractual clauses under Art. 46 (2) (c) GDPR; Google LLC is certified under the EU-U.S. Data Privacy Framework. A data processing agreement under Art. 28 GDPR (Google Cloud Data Processing Addendum) is in place. Google's privacy policy: [policies.google.com/privacy](https://policies.google.com/privacy).

## 6. GitHub Discussions

Several pages link to GitHub Discussions. That is an external service; if you post there, GitHub's terms and privacy statement apply, and the only account involved is one you already control yourself.

## 7. Retention

- **Server logs at GitHub:** according to GitHub's own retention periods, outside my control.
- **Account and posts:** until you delete the account or request deletion.
- **Local storage values:** until you clear them in your browser.

## 8. Your rights

Under the GDPR you have the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and **to object to processing based on Art. 6 (1) (f) GDPR (Art. 21)**. Any consent given can be withdrawn at any time with effect for the future.

An informal message to [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com) is enough for all of it.

You also have the right to lodge a complaint with a supervisory authority (Art. 77 GDPR). The competent authority here is:

> Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf — [ldi.nrw.de](https://www.ldi.nrw.de/)

## 9. No automated decision-making

There is no automated decision-making, including profiling, within the meaning of Art. 22 GDPR. The verdicts in the skill index concern software, not people.

## 10. Changes

This statement is revised when something it describes changes. The current version lives at this address, and its history is visible in the public source repository.
