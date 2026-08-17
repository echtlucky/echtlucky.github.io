# Umbau der Skillry-Seiten — Arbeitsauftrag

Stand 17.08.2026. Dieses Dokument ist der verbesserte Umbau-Prompt: es ersetzt
die Sammlung loser Wünsche durch einen Auftrag, den eine Sitzung abarbeiten
kann, ohne vorher eine Stunde zu suchen.

> **Es liegt in einem Repository und gilt für drei.**
>
> Bis zum 17.08.2026 lag diese Datei lose in `D:\Projekte` — also in keinem
> Repository, ohne Versionierung, und damit an der einzigen Stelle, an der die
> Effektstufen standen. Jetzt liegt sie hier, weil `echtlucky.github.io` das
> einzige der drei Repositories mit einem Remote ist.
>
> `docs/` wird **nicht ausgeliefert**: der Bau kopiert nur `static/`, und in
> `dist/` taucht dieser Ordner nicht auf. Was hier steht, ist Werkstattpapier
> und keine Seite.
>
> Wer an `skillry-roleplay` oder `skillry-lizenz` arbeitet, findet die Stufen
> und die Reihenfolge trotzdem hier — die `DESIGN.md` des jeweiligen
> Repositories trägt die Regeln, die nur dort gelten.

---

## 1. Was es wirklich gibt

Der Bestand wurde geprüft, nicht angenommen. **`echtlucky.github.io` *ist*
skillry.de** — es gibt kein eigenes Wurzel-Repository, das noch gebaut werden
müsste. Wer nach einem sucht, sucht umsonst.

| Adresse | Repository | Umfang | Bauart |
| :--- | :--- | :--- | :--- |
| `skillry.de` | `D:\Projekte\echtlucky.github.io` | 12 Seiten, zweisprachig de/en | `node build/site.mjs` → `dist/`, GitHub Pages |
| `roleplay.skillry.de` | `D:\Projekte\skillry-roleplay` | 4 Seiten (`start`, `welt`, `regeln`, `zugang`) | `node build/site.mjs`, eigenes `deploy.ps1` |
| `lizenz.skillry.de` | `D:\Projekte\skillry-lizenz\web` | Kundenportal, eine `index.html` + `portal.js`/`qr.js` | Docker, `deploy.ps1`, Compose-Projekt `skillry-lizenz` |

Gemeinsam: Montserrat als `woff2` liegt in jedem Repo selbst, GitHub-nahe
Farbmarken (`#0d1117` / `#f0f6fc` / `#4493f8`), **null Abhängigkeiten**, kein
Bundler, kein `npm install`.

`CNAME` = `skillry.de`, `content/site.json` bestätigt `customDomain`.

---

## 2. Die eine Entscheidung, die vor allem anderen fällt

**Der Wunsch „alle FX-Effekte, GSAP, krasseste Website aller Zeiten" steht im
direkten Widerspruch zur Bauart aller drei Seiten.**

Die READMEs sagen es ausdrücklich: *„Zero dependencies. No framework, no
bundler, no `npm install`."* Der Skill `gpt-taste` schreibt dagegen GSAP mit
ScrollTrigger vor. Beides zusammen geht nicht — eine der beiden Regeln wird
gebrochen, und es ist besser, das bewusst zu tun als nebenbei.

| | A — Abhängigkeitsfrei bleiben *(empfohlen)* | B — GSAP aufnehmen |
| :--- | :--- | :--- |
| Scroll-Effekte | `animation-timeline: view()` / `scroll()` nativ in CSS | GSAP ScrollTrigger |
| Übergänge | View Transitions API, `@starting-style` | JS-gesteuert |
| Kosten | 0 KB, kein Build-Schritt | ~70 KB, Bundler oder CDN-Einbindung |
| Bruch | keiner | die zentrale Zusage der drei Repos fällt |
| Haken | ältere Browser sehen die Seite statisch — sie bleibt vollständig benutzbar | läuft überall gleich |

### Entschieden am 17.08.2026: **B — GSAP**

Empfohlen war A; Lucas hat sich nach Abwägung für **B** entschieden. Damit
gilt:

- Die Zusage „Zero dependencies" in `README.md` von `echtlucky.github.io` und
  `skillry-roleplay` **stimmt danach nicht mehr** und wird in beiden READMEs
  richtiggestellt. Eine falsch geword­ene Zusage stehen zu lassen ist
  schlimmer als die Abhängigkeit selbst.
- GSAP + ScrollTrigger werden **lokal abgelegt**, nicht per CDN geladen. Die
  Seite verspricht an mehreren Stellen, dass sie zur Laufzeit nichts von
  Dritten holt (Schrift liegt aus genau diesem Grund selbst im Repo) — ein
  CDN-Aufruf bräche das ein zweites Mal.
- `prefers-reduced-motion` bleibt bindend: ScrollTrigger wird dann gar nicht
  erst registriert, alle Endzustände stehen sofort.
- Die Marken-Animation selbst braucht **kein** GSAP-Plugin: sie ist ein
  einzelner Zahlenwert `t`, den GSAP tweent, während der Pfad neu gerechnet
  wird (siehe Abschnitt „Die Zeichen").

---

## 3. Der zweite ehrliche Einwand

„Alle Effekte überall" ist kein Designziel, sondern dessen Gegenteil. Ein
Lizenzportal, in dem jemand seinen Schlüssel sucht, und eine Regelseite, die
gelesen werden muss, werden durch Scroll-Choreografie **schlechter**, nicht
besser. Wirkung entsteht durch Kontrast: wenn die Startseite sich bewegt, muss
die Regelseite still sein, sonst bewegt sich nichts mehr — es wackelt nur.

Deshalb gilt eine Effektstufe je Seitentyp:

| Stufe | Wo | Was erlaubt ist |
| :--- | :--- | :--- |
| **3 — voll** | `skillry.de` Startseite | Scroll-Choreografie, gestaffelte Auftritte, an den Bildlauf gekoppelte Tiefe |
| **2 — gehalten** | `skillry.de` Produktseiten (AIRLOCK, NEXUS, Scripts), `roleplay` alle vier Seiten | Auftritte beim Eintreten, Hover-Tiefe — **kein** Scrub, kein Parallax |
| **1 — ruhig** | Skill-Index, Lernen, API-Vertrag, Forum, Rechtliches | nur Fokus- und Hover-Rückmeldung |
| **0 — still** | Lizenzportal `lizenz.skillry.de` | nichts, was das Ablesen eines Schlüssels stört |

### `roleplay`: Skriptverbot am 17.08.2026 aufgehoben

Das Repository verbot bis dahin per Test **jedes `<script>`**. Ich hatte daraus
geschlossen, Stufe 2 sei dort unmöglich; Lucas hat entschieden, die Regel
fallen zu lassen. Umgesetzt ist sie nicht gelöscht, sondern **ersetzt**:

| | vorher | jetzt |
| :--- | :--- | :--- |
| Prüfung 1 | „kein `<script>`" | „ohne JavaScript lesbar": nichts darf **unbedingt** versteckt sein, Skripte nur aus dem eigenen Repository, keine `onclick`-Attribute |
| Prüfung 2 | kein `@keyframes`/`animation`/`infinite` | **unverändert** |
| Prüfung 3, 4 | reduced-motion, nichts von außen | **unverändert** |

Der Kern der alten Zusage war nie „kein Skript", sondern „ohne JavaScript
lesbar" — und das ist die stärkere. Sie wird jetzt direkt geprüft statt über
ihr Symptom: versteckt werden darf nur unter `.bewegt`, einer Klasse, die ein
Skript setzt und ein Notaus nach zwei Sekunden abnimmt.

**Prüfung 2 blieb absichtlich stehen.** GSAP setzt Inline-Stile und braucht
weder `@keyframes` noch `animation` — „nichts läuft von allein" gilt auf dieser
Seite unverändert weiter.

Beides ist nachgewiesen, nicht behauptet: ein eingebautes `opacity: 0` ohne
`.bewegt` lässt die Prüfung mit Rückgabewert 1 abbrechen, und mit gelöschter
`gsap.min.js` sind alle 50 Elemente sichtbar.

---

## 4. Reihenfolge

### Schritt 0 — Sicherung
Jedes Repo ist ein eigenes Git. Vor dem ersten Eingriff je Repo ein Zweig:
`git switch -c umbau-2026-08`. **Deploy nimmt nur Committetes** (`git archive
HEAD`) — nicht committete Arbeit geht still verloren und der Server behält den
alten Stand.

### Schritt 1 — Designsprache festlegen (**vor** jeder Zeile CSS)
Skill: **`design-md-planner`**, Modus *codify-existing* (es gibt schon eine
Handschrift, sie ist nur nicht aufgeschrieben).

Ergebnis: ein `DESIGN.md` je Repo, gegen `npx @google/design.md` sauber
gelintet. Quelle für die Tokens ist der Bestand — `build/theme.mjs` in beiden
Node-Seiten, `web/marke.css` im Portal — **nicht** eine neue Erfindung.

Bindend, weil es woanders teuer bezahlt wurde
(siehe Erinnerung `skillry-gestaltung`):
- Das gültige Zeichen ist `marke-5`:
  `D:\Projekte\skillry-bot\assets\marke-5\zeichen-512-frei.png`.
  **`assets/marke-3d/zeichen3d.js` rendert eine zwei Runden alte Marke** — nicht benutzen.
- Verworfen und nicht wieder vorzuschlagen: Platinen-/Neon-Design, Verlauf
  Gold→Magenta, Messing-Graphit, Schild- und Ritterwappen, Mondschein-Stadtwappen.
- Schrift bleibt Montserrat, lokal, kein Google-Fonts-Aufruf.

Zur Kalibrierung dienen **`design-md-brands`** (74 echte Systeme). Genau **eine**
Referenz wählen — nicht drei vergleichen, das kostet den halben Kontext.
Naheliegend für den Bestand: `linear.app`, `vercel`, `supabase`.
Übernommen wird das *System* (Skalen, Rhythmus, Radien, Timing), **nicht** die
Identität einer fremden Marke.

### Schritt 2 — Prüfnetz **vor** dem Umbau
Es existiert schon eines und es ist gut: `build/pruefen.mjs`,
`build/validate.mjs`, `build/linkcheck.mjs`, `scripts/skriptpruefung.mjs`,
`npm test` in den beiden anderen Repos.

Vor der ersten Änderung einmal grün laufen lassen und die Ausgabe festhalten.
Ohne diesen Ausgangswert lässt sich „alle Funktionen erhalten" nicht belegen,
sondern nur behaupten.

Ergänzend **`playwright-cli`** (liegt in `D:\Projekte\.claude\skills\`):
Bildschirmfoto jeder Seite in beiden Sprachen und beiden Farbschemata,
**vorher**. Das ist der Vergleichsstand.

### Schritt 3 — Umbau je Seite
Skills nach Seitentyp, nicht alle auf einmal:

| Aufgabe | Skill |
| :--- | :--- |
| Bestand prüfen, generische Muster finden | `redesign-existing-projects` |
| Startseite skillry.de, Produktseiten | `design-taste-frontend` |
| Editorial-Ruhe: Regeln, Vertrag, Rechtliches | `minimalist-ui` |
| Dichte Ansichten: Skill-Index, Forum | `industrial-brutalist-ui` (**dosiert** — die Seite ist zweisprachig und muss lesbar bleiben) |
| Politur, Tiefe, Bewegung | `high-end-visual-design` |
| Bildmaterial für Hero-Abschnitte | `imagegen-frontend-web` |
| Vollständige Dateien statt gekürzter | `full-output-enforcement` |

**Die Startseite von skillry.de** soll jedes Thema einmal ansprechen und
verlinken: AIRLOCK, NEXUS, FiveM-Scripts, Skill-Index, die
Erklärtexte zu manipulierten KI-Assistenten, den Lizenzvertrag, das Forum,
Roleplay. Ein Abschnitt je Thema, jeder mit einem Weg hinein — und in **beiden**
Sprachen, `build/pages/home.mjs` führt sie parallel.

### Schritt 4 — Wortmarke einsetzen
Fertig und geprüft: `static/marke/wortmarke.svg` (570×220, 31 KB), erzeugt von
`scripts/wortmarke.py`, verteilt nach `skillry-roleplay/statisch/marke/` und
`skillry-lizenz/web/`. Zieht sich in 1,8 s, Akzent wandert einmal durch, bleibt
dann still. Hell und dunkel geprüft, `prefers-reduced-motion` zeigt sofort den
Endzustand.

Offen: Einbau in Hero (`build/pages/home.mjs`) und Kopf (`build/layout.mjs`).
Im Kopf **nur die Zeile „echtlucky"**, ohne den Namen und ohne Wiederholung der
Animation auf jeder Unterseite — einmal beim ersten Besuch reicht
(`sessionStorage`, oder schlicht: im Kopf statisch, im Hero bewegt).

### Schritt 5 — Nachweis
Dieselben Prüfungen wie in Schritt 2, dazu Bildschirmfotos **nachher**,
und ausdrücklich:
- jeder interne Verweis löst auf (`linkcheck.mjs`),
- beide Sprachen vollständig,
- Kontrast nach WCAG AA in beiden Farbschemata,
- Portal-Funktionen unberührt: `portal.js`, `qr.js`, `wisch.js`, `qr.test.mjs` grün,
- Tastaturbedienung und Fokusreihenfolge intakt.

---

## 5. Was nicht passieren darf

- **Keine Funktion fällt weg.** Der Umbau ist visuell. Fällt beim Umbau etwas
  auf, das weg sollte, wird es *gemeldet*, nicht entfernt.
- **Kein `npm install`** in `echtlucky.github.io` und `skillry-roleplay`,
  solange Entscheidung A gilt.
- **Kein Neustart als Deploy.** `deploy.ps1` je Repo kopiert, `systemctl
  restart` und `docker compose up -d` kopieren nichts.
- **Keine erfundene Bildwelt.** Bildmodelle bekommen das Zeichen als
  Referenzbild mit, nie als Beschreibung — daran ist hier schon eine ganze
  Bildwelt gescheitert.
- **Mehrere Fassungen zeigen, nie eine.** Freigabe liegt bei Lucas.

---

## 6. Umfang, ehrlich

Drei Seiten, 17 Seitenvorlagen, zwei Sprachen, zwei Farbschemata. Das ist
**keine Arbeit für eine Sitzung.** Sinnvoller Schnitt, jeweils mit grünem
Prüflauf am Ende:

1. `DESIGN.md` für alle drei Repos + Entscheidung A/B → danach steht die Sprache
2. `skillry.de` Startseite + Kopf/Fuß + Wortmarke → das Schaufenster steht
3. `skillry.de` übrige 11 Seiten
4. `roleplay.skillry.de` (4 Seiten)
5. `lizenz.skillry.de` Portal (Stufe 0 — Ruhe, Klarheit, sonst nichts)

Bei 45 Stunden je Quartal (Erinnerung `skillry-halbjahresplan`) ist das der
Plan für ein volles Quartal, nicht für ein Wochenende.
