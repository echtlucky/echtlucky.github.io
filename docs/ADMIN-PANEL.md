# Ein Verwaltungsbereich für alle Skillry-Projekte

Ein Plan, keine Anleitung. Nichts davon ist gebaut — ausser dem, was unter
„Schon da" steht, und das ist mehr als es klingt.

Geschrieben am 29.08.2026, nachdem der Bestand **gemessen** und nicht erinnert
wurde. Was hier über den Server steht, stammt aus `ssh skillry` und `docker ps`
desselben Abends.

---

## 0. Die eine Frage, die alles andere entscheidet

**Gibt es nach dem 30.08.2026 einen Server?**

Der VPS `212.227.45.18` lief am 29.08.2026 um 20:13 einwandfrei — 28 Tage
Uptime, zehn Container, `fivem` aktiv, `lizenz.skillry.de` und
`n8n.skillry.de` beide mit HTTP 200. Er ist aber **zum 30.08.2026 gekündigt**,
und der vollständige Abzug liegt geprüft in `D:\Projekte\skillry-vps`.

Das ist keine Randnotiz, sondern die Achse dieses Plans:

> Von allem, was „Verwaltungsbereich für alle Skillry-Projekte" umgangssprachlich
> bedeutet, braucht der grössere Teil genau die Maschine, die morgen abgeschaltet
> werden kann.

Deshalb ist der Plan in zwei Schichten geschnitten, und die Trennlinie ist
nicht Bequemlichkeit, sondern Physik:

| | Schicht 1 | Schicht 2 |
| :-- | :-- | :-- |
| Braucht | nur Firestore | einen laufenden Server |
| Überlebt das VPS-Ende | **ja** | nein |
| Kosten | 0 € | Serverkosten |
| Baubar | sofort | erst wenn feststeht, wo |

**Schicht 1 ist ohne Entscheidung baubar.** Schicht 2 zu planen, bevor
feststeht, ob es einen Server gibt, hiesse auf Sand zu bauen — deshalb steht
sie hier als Entwurf und nicht als Auftrag.

---

## 1. Was es wirklich zu verwalten gibt

Gemessen, nicht aus dem Gedächtnis:

### Auf dem VPS (Docker)

| Container | Was es ist |
| :-- | :-- |
| `root-caddy-1` | Reverse Proxy, TLS für alle Adressen |
| `root-mariadb-1` | Datenbank für Lizenzen und Spielserver |
| `root-n8n-1` | Automatisierung, `n8n.skillry.de` |
| `root-discord-bruecke-1` | Brücke Discord ↔ n8n |
| `root-skillry-community-1` | Discord-Bot |
| `root-skillry-server-1` | Discord-Bot |
| `root-skillry-fivem-1` | Discord-Bot |
| `skillry-lizenz` | die Lizenz-API, `lizenz.skillry.de/v1/` |
| `skillry-portal` | Dateiserver für das Kundenportal |
| `root-autoheal-1` | startet ungesunde Container neu |

Dazu **`fivem` als systemd-Dienst auf dem Wirt**, nicht im Container.

### Ausserhalb

| | Wo | Hängt am VPS? |
| :-- | :-- | :-- |
| `skillry.de` | GitHub Pages | **nein** |
| GeoBingo | GitHub Pages + Firestore | **nein** |
| Forum | GitHub Pages + Firestore | **nein** |
| `roleplay.skillry.de` | VPS | ja |
| `lizenz.skillry.de` | VPS | ja |
| `n8n.skillry.de` | VPS | ja |
| Discord-Bots | VPS | ja |
| FiveM-Spielserver | VPS | ja |

---

## 2. Schon da — und das ist der Anfang

Für GeoBingo wurde am 29.08.2026 eine Zugangsverwaltung gebaut, und sie wurde
**absichtlich nicht `geobingo_zugang` genannt**:

```
skillry_zugang/{uid}    email, name, rolle: 'admin' | 'streamer', seit
skillry_anfrage/{uid}   email, name, wann
```

Die Regeln dazu stehen in `firestore.rules`. Der Admin hängt an einer
E-Mail-Adresse im Anmeldetoken, nicht an einem Datenbankeintrag, den man
löschen könnte:

```
function istAdmin() {
  return signedIn()
    && request.auth.token.email == adminMail()
    && request.auth.token.email_verified == true;
}
```

Auf der GeoBingo-Startseite gibt es dafür bereits ein Fenster: Anfragen
annehmen oder ablehnen, Zugänge entziehen.

**Damit ist die Hälfte von Schicht 1 fertig.** Sie steht nur an der falschen
Stelle — in einer Spielseite statt in einem Verwaltungsbereich.

---

## 3. Schicht 1 — was ohne Server geht

Alles, was Firestore selbst durchsetzen kann. Kostet nichts, überlebt jede
Serverentscheidung.

### 3.1 Wo es liegt

Eine neue `blank`-Seite `/verwaltung/` im Website-Repository, nach demselben
Muster wie GeoBingo: kein Kopf, kein Fuss, `noindex`, nicht in Navigation,
Suche oder Sitemap, und diesmal auch **nicht im Fuss verlinkt**.

Warum keine eigene Domain: eine zweite Auslieferung ist eine zweite Stelle, an
der etwas veraltet. Die Website wird ohnehin bei jedem Push gebaut.

### 3.2 Was sie kann

**Zugänge** — das Vorhandene, aus GeoBingo herausgelöst und um das erweitert,
was ein Turnier braucht:

- Anfragen annehmen und ablehnen
- Rollen vergeben: `admin`, `streamer`, und neu `helfer` (darf Lobbys sehen,
  aber keine Zugänge vergeben)
- Zugang befristen — `bis` als Feld, und die Regel prüft es. Für eine
  Olympiade ist das der Unterschied zwischen „für den Wettbewerb
  freigeschaltet" und „für immer".
- Sperren statt löschen, damit ein entzogener Zugang nachvollziehbar bleibt

**Spiele und Turniere** — die Struktur, an der weitere Spiele andocken:

```
skillry_spiele/{id}          name, aktiv, seite
skillry_turnier/{id}         name, wann, spiele[], teilnehmer[], zustand
skillry_turnier/{id}/runden/{n}   spiel, ergebnisse
```

Damit wird aus „GeoBingo hat Lobbys" ein Turnier mit mehreren Spielen und einer
Gesamtwertung. Das ist der Teil, den die Olympiade wirklich braucht, und er
kommt ohne Server aus.

**Laufende Lobbys** — welche Runden gerade offen sind, wer drin ist, und im
Notfall eine Lobby schliessen. Braucht eine Regelerweiterung: Admin darf
`geobingo/*` auflisten, nicht nur öffentliche.

**Sicht auf die Datenschutzlage** — was gerade gespeichert ist, wie viele
Lobbys herumliegen, ob die Aufräumregel greift. Nicht als Zierde: die
Datenschutzerklärung behauptet, eine Lobby überdauere ihre Runde nicht, und
das sollte man nachsehen können.

### 3.3 Was sie ausdrücklich nicht kann

Container, Bots, FiveM, Lizenzen, Logs, Deploys. Nichts davon geht ohne Server
— und eine Oberfläche, die Knöpfe dafür zeigt, wäre eine Lüge.

### 3.4 Aufwand

Grob ein Tag. Das meiste ist Umzug und Erweiterung von Vorhandenem.

---

## 4. Schicht 2 — was einen Server braucht

**Nur planen, wenn die Serverfrage beantwortet ist.**

### 4.1 Warum eine statische Seite das nicht kann

GitHub Pages liefert Dateien aus. Es gibt keinen Prozess, der einen Container
neu starten, ein Log lesen oder `server.cfg` ändern könnte. Wer das aus dem
Browser will, braucht auf der anderen Seite jemanden, der zuhört.

**Der Browser darf dabei nie einen SSH-Schlüssel sehen.** Ein Schlüssel im
Browser ist ein Schlüssel in fremder Hand, sobald jemand die Konsole aufmacht
oder der Rechner kompromittiert ist. Die Arbeit macht ein Dienst **auf** dem
Server; der Browser schickt nur, was getan werden soll.

### 4.2 Der Dienst

Ein neuer Container `skillry-admin` im Netz `root_default`, hinter Caddy unter
`admin.skillry.de`.

**Nicht an die Lizenz-API angebaut.** Deren README sagt den Grund selbst:

> „Ein Wegetreffer mehr in `src/server.js` ist eine Stelle mehr, an der
> `/v1/pruefen` etwas passieren kann."

An `/v1/pruefen` hängen zahlende Spielserver. Ein Verwaltungsbereich darf
diesem Prozess weder Last noch einen Absturzpfad hinzufügen.

**Die Token-Prüfung wird aber wiederverwendet.** `skillry-lizenz/src/firebase.js`
prüft ein Firebase-ID-Token mit `node:crypto` gegen Googles öffentliche
Schlüssel — hundert Zeilen, reine Funktion, getestet. Genau das braucht der
neue Dienst auch.

Zwei Wege, und der zweite ist besser:

- *Kopieren* — schnell, und zwei Kopien laufen auseinander. Genau davor warnt
  das Lizenz-README bei den Vertragsbeschreibungen.
- *Herausziehen* nach `skillry-kern` und in beiden einbinden. Eine Abhängigkeit
  mehr, aber eine eigene, und die Tests wandern mit.

### 4.3 Die Sicherheitsregel, auf die alles hinausläuft

**Keine beliebigen Befehle. Nie.**

Der Dienst kennt eine feste Liste benannter Vorgänge:

```
status                      alle Container plus fivem
logs:<dienst>               die letzten N Zeilen, nur lesen
neustart:<dienst>           genau einer aus der Liste
fivem:status                Spielerzahl, Betriebszeit
fivem:neustart
cfg:lesen                   server.cfg zeigen
cfg:schreiben               mit Sicherung und Unterschied vorher
```

Ein `exec(befehl)`-Weg wäre bequem und wäre eine Fernsteuerung für den ganzen
Server hinter einer Weboberfläche. Wer den Admin-Zugang übernimmt, übernimmt
sonst die Maschine — nicht ein paar Knöpfe.

Dazu:

- **Zweiter Faktor Pflicht** für alles, was etwas ändert. Die Lizenz-API hat
  TOTP bereits (`TOTP_SCHLUESSEL`, `KONTO_FAKTOR_PFLICHT`) — dieselbe
  Mechanik, nicht eine zweite.
- **Kurze Sitzungen.** Ein Verwaltungstoken ist nichts, was tagelang gilt.
- **Jede Änderung wird protokolliert**: wer, wann, was, mit welchem Ergebnis.
  Anfügend, nicht überschreibbar. Ohne das weiss nach einem Zwischenfall
  niemand, was passiert ist.
- **Taktbremse**, und zwar auch für den Admin. Ein durchgedrehtes Skript mit
  gültigem Token ist derselbe Schaden wie ein Angreifer.
- **Admin-Adressen aus der Umgebung**, nicht im Quelltext. Der Wert in
  `content/geobingo.json` steuert nur, wer Knöpfe SIEHT — was zählt, steht
  serverseitig.

### 4.4 Was auch mit Server nicht hineingehört

**Deploys.** `deploy-fivem.ps1`, `deploy.ps1` und `git archive HEAD` laufen aus
einem Git-Arbeitsverzeichnis auf einer Maschine, die den Stand kennt. Der
Server hat keins. Ein „Deploy"-Knopf im Browser würde entweder etwas
Veraltetes ausliefern oder einen zweiten Auslieferweg schaffen, der irgendwann
vom ersten abweicht.

Was hineingehört: **anzeigen, was zuletzt ausgeliefert wurde** und ob es zum
aktuellen Stand passt.

**Spielerdaten.** Namen, Positionen, Inventare aus der qbox-Datenbank haben in
einer Weboberfläche nichts verloren, die auch nur einen Browser weit von einem
Stream entfernt ist.

### 4.5 Aufwand

Grob drei bis vier Tage: Dienst, Vorgangsliste, zweiter Faktor, Protokoll,
Oberfläche, Caddy-Eintrag, Tests. Plus die Entscheidung über `skillry-kern`.

---

## 5. Kosten

| | |
| :-- | :-- |
| Schicht 1 | **0 €** — Firestore-Spark reicht (50.000 Lesevorgänge am Tag) |
| Schicht 2 | die Serverkosten, sonst nichts |
| GitHub Pages | 0 € |

Schicht 1 fügt der Firestore-Nutzung fast nichts hinzu: ein Verwaltungsbereich
wird von einer Person benutzt, nicht von hundert.

---

## 6. Was zuerst

1. **Serverfrage beantworten.** Neuer VPS, alter verlängert, oder erst einmal
   lokal geparkt. Ohne diese Antwort ist Schicht 2 Papier.
2. **Schicht 1 bauen**, unabhängig davon. Sie ist die Grundlage der Olympiade
   und verliert nichts, wenn später ein Server dazukommt.
3. **`skillry-kern` entscheiden**, sobald ein zweiter Dienst Token prüfen soll.
4. Schicht 2, wenn 1 steht und ein Server existiert.

---

## 7. Was dieser Plan nicht behauptet

- Er ersetzt nicht die Einzelheiten. Datenmodelle stehen hier als Skizze; eine
  Regel schreibt man gegen echte Abfragen, nicht gegen einen Plan.
- Er sagt nichts über die Bots, was über „neu starten und Logs lesen"
  hinausgeht. Was ein Bot inhaltlich können soll, ist eine eigene Frage.
- Er nimmt an, dass die Website bei GitHub Pages bleibt. Zöge sie auf einen
  Server, verschöbe sich die Trennlinie zwischen den Schichten — die
  Sicherheitsregeln blieben dieselben.
