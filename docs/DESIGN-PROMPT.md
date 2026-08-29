# Der Design-Prompt

Dieser Text ist zum **Kopieren** gedacht: in eine Claude-Session, an einen
Designer, an dich selbst in drei Monaten. Er enthält alles, was jemand wissen
muss, um an skillry.de tiefgründig weiterzuentwerfen, ohne die Entscheidungen
zu brechen, die schon gefallen sind — und er endet mit einer Kurzfassung für
den schnellen Einwurf.

Was hier steht, ist mit `DESIGN.md` (dem System) und `build/marke.mjs` (den
gemessenen Werten) abgeglichen. Wenn sich die drei widersprechen, gewinnt der
Code, dann `DESIGN.md`, dann dieses Blatt — und der Widerspruch wird behoben,
nicht ignoriert.

---

## Der Prompt

Du gestaltest **skillry.de** weiter — das Dach über einem Netzwerk aus
Projekten: AIRLOCK (Skill-Prüfer), NEXUS (Windows-Schaltzentrale), DECK, der
Skill-Index, das Forum, die FiveM-Skripte samt Rollenspielserver, die
Lizenz-API und der Spielbereich (`/games/` mit GeoBingo, Reflex, Paare und dem
kommenden GeoRadar). Die Seite ist ein statischer Eigenbau ohne Framework
(`build/site.mjs`), zweisprachig (Englisch an der Wurzel, Deutsch unter
`/de/`), und sie lädt **nichts von Dritten** — keine Fonts von Google, keine
CDN-Skripte, keine Bilddateien für Dekoration. Das ist keine Vorliebe, sondern
ein Versprechen, das an mehreren Stellen der Seite schriftlich gegeben wird.

### 1. Die Marke, in einem Absatz

Das Zeichen ist ein Kreis, entlang einer 45°-Achse zerschnitten und gegen sich
selbst verschoben — nichts fehlt, nichts ist offen, die Kontur ist eine
ununterbrochene Linie, die sich selbst nicht mehr zustimmt. Daraus folgt die
ganze Haltung: **etwas kann aussehen wie alles andere und nicht dasselbe
sein.** Die Marke hat **zwei Stimmen und eine Grammatik**: im dunklen Schema
ein kraftvolles Violett (Leiter ~262°), im hellen ein tiefes Blau (~222°),
beide geschichtet über ein Himmelslicht (`--himmel`), das nur in Verläufen,
Szenen und Lichtern lebt. Die *Rollen* sind in beiden Schemata identisch (Text,
Kante, Knopfpaar, Fläche) — nur der Farbton dreht, wie derselbe Himmel bei Tag
und bei Nacht. Jedes Projekt behält daneben seinen eigenen Akzent: Minz
AIRLOCK, Cyan NEXUS, Amber Index/Lizenz, Orange Skripte/Server, Rosa Forum,
Grün GeoBingo. **Gleiche Konstruktion überall, eigener Ton je Projekt** — das
ist der eine Satz, an dem jede neue Fläche gemessen wird.

### 2. Was nie wieder passieren darf

Diese Dinge waren da und wurden entfernt. Sie kommen nicht zurück, auch nicht
in neuer Verkleidung:

- **Muster hinter Seiten.** Die horizontalen Textzeilen-Streifen im Aufmacher
  und das Fragezeichen-Feld hinter dem Index sind gestrichen. Regel: ein
  Hintergrund ist Licht und Luft (Auroren, weiche Farbmassen, das Korn auf
  Objekten) — sobald sich etwas wiederholt und als Tapete lesbar wird, ist es
  gescheitert.
- **Ein Strich unter dem Kopf.** Der Header besteht aus fünf schwebenden
  Inseln; darunter läuft die Seite frei durch. Keine Unterkante, kein Balken,
  kein Balkenschatten.
- **Marken-Farbe auf Links.** Links bleiben `#0969da`, unterstrichen, im
  Fließtext. Ein violetter Link liest sich als besucht, ein markenblauer als
  Knopf.
- **Eine Farbe ohne Messung.** Jeder neue Farbwert trägt sein gemessenes
  Kontrastverhältnis als Kommentar im Quelltext (WCAG: ≥4.5:1 für Text,
  ≥3:1 für Bedienelement-Kanten und großen Text). „Sieht gut aus" ist kein
  Messwert.
- **Eine Seite in nur einer Sprache oder nur einem Schema.** Beides ist halbe
  Arbeit, und halbe Arbeit wird nicht gemerged.

### 3. Die Komponentensprache

- **Inseln:** Kopf und Fuß bestehen aus abgerundeten (15px), leicht
  durchscheinenden Körpern mit Innenlicht an der Oberkante und zwei Schatten
  (eng = Auflage, weit = Entfernung), gezogen aus der dunkelsten Stufe der
  Familie, nie aus neutralem Schwarz. Der Inselgrund folgt der Stimme:
  Nachtblau-Violett im Dunklen, Tiefblau im Hellen.
- **Karten:** Radius 12–14px, Fläche + Haarlinie zuerst, Schatten zuletzt.
  Produktkarten tragen die Akzent-Haarlinie oben plus einen Hauch Farbverlauf.
- **Schnittmarken (`.card.eckig`):** die scharfe Kante NEBEN der Rundung —
  zwei rechtwinklige, eckige Klammern außerhalb der Kartenecken, 2px, in der
  Projektfarbe (`--eck`). Nicht auf jeder Karte; ein Highlight, das überall
  ist, ist Textur.
- **Bewegung:** eine Kurve (`cubic-bezier(0.22,0.61,0.36,1)`), drei Dauern
  (140/240/380ms). Auftritte beim Scrollen überall, GSAP-Choreografie nur auf
  der Startseite, View-Transitions zwischen Seiten mit ruhig gehaltenem Kopf.
  `prefers-reduced-motion` schaltet ab statt zu verkürzen (1ms, nie 0).
- **Bilder:** Inline-SVG aus Theme-Variablen (gehen mit dem Schema mit, laden
  nichts). Keine Bitmaps für Dekoration.
- **Typografie:** Montserrat (selbst gehostet) für Display und Wortmarke,
  Systemschrift für den Rest. Drei Gewichte: 400/600/700.

### 4. Der Verfeinerungs-Durchgang (auf jede Seite anwenden)

Geh jede Seite in beiden Schemata und auf drei Breiten durch (390 / 834 /
1440) und frag:

1. **Was ist hier laut, ohne etwas zu sagen?** Entfernen schlägt dämpfen.
2. **Wie viele Hintergrundstimmen sprechen?** Szene + Korn + ggf. Welle sind
   das Maximum; eine vierte fliegt.
3. **Teilen sich alle Kanten eine Logik?** Flächenkante (`--border`) vs.
   Bedienelement-Kante (`--border-strong`) — nie vertauschen.
4. **Trägt jede Farbe eine Rolle?** Marke = Identität/Handlung, Akzent =
   Projektzugehörigkeit, Blau = Link, Grün/Rot = Zustand. Eine Farbe ohne
   Rolle ist Rauschen.
5. **Was passiert beim Überfahren, Fokussieren, Drücken?** Jedes interaktive
   Element hat alle drei Zustände, und der Fokusring ist die Markenfarbe.
6. **Liest sich die Seite ohne JavaScript?** Inhalte ja; Spiele sagen ehrlich
   per `<noscript>`, dass sie Skript brauchen.
7. **Stimmen die Sätze noch?** Zahlen kommen aus Daten, Behauptungen aus
   Skripten. Eine Seite, die etwas verspricht, das der Code nicht hält, wird
   korrigiert — am Satz oder am Code.

### 5. Das Spiele-Netzwerk (die Ausbaustufe)

Der Spielbereich lebt unter `/games/` und wächst nach diesen Regeln: kleine
Spiele laufen komplett im Browser und speichern nichts; alles mit Konto und
Netz läuft über die vorhandene Firebase-Infrastruktur (Auth + Firestore, wie
Forum und GeoBingo); jedes Spiel bekommt seine eigene Akzentfarbe bei
identischer Kartenkonstruktion; und was es noch nicht gibt, wird angekündigt,
nie verlinkt.

**GeoBingo — globale Minikarte (geplant):** unten links in der laufenden Runde
sitzt eine kleine Karte. Aufgeklappt wird sie zur Weltkarte; man zieht sie an
einen beliebigen Ort (München, Tokio, irgendwo) und startet Street View genau
dort. Technisch: die Ortssuche über Street-View-*Metadaten* ist kostenlos, erst
das Laden eines dynamischen Panoramas kostet — die Minikarte darf also frei
suchen und bestätigt den Sprung, bevor ein Panorama geladen wird. Die Karte
wird wie alles im Spiel **gepatcht, nie neu gebaut** (ein `innerHTML` auf die
Runde würde Panorama und Fundbilder neu laden und die Rechnung treiben). Wer
springen darf (alle, nur der Host, nur außerhalb gewerteter Runden), ist eine
Lobby-Einstellung, keine Annahme.

**GeoRadar — der GeoGuessr-Modus (geplant, sehr gut machen):** dasselbe Spiel
wie GeoBingo aus der anderen Richtung. Alle landen im selben Panorama und raten
gegen die Uhr, WO sie sind; ein Tipp ist ein Pin auf der Weltkarte. Gewertet
wird **Nähe zuerst, Zeit als Zweitschlüssel** — wer näher liegt, schlägt jeden,
der schneller war; erst bei praktisch gleicher Distanz entscheidet die Uhr, und
die genauen Kurven werden mit echten Runden getestet statt am Schreibtisch
festgelegt. Ein Tipp ist wie ein Fund **fünf Zahlen, kein Screenshot**
(Koordinate, Zeitstempel, Runde). GeoBingo und GeoRadar teilen sich Lobby,
Codes, Teams und Auswertung: ein Spiel, zwei Modi, im Lobby-Bildschirm
umschaltbar und jeder Modus einzeln spielbar. Firestore wächst dabei um eine
Modus-Angabe an der Lobby und eine Tipp-Sammlung pro Runde — die Regeln in
`firestore.rules` sagen wieder laut, was sie NICHT prüfen können (ob eine
Distanz im Browser ehrlich berechnet wurde), und die Auswertung bleibt deshalb
der Ort, an dem gestritten wird.

**Mehrspieler-Netz (geplant):** die Lobby-Mechanik von GeoBingo
(Fünf-Zeichen-Codes, privat als Voreinstellung, öffentlich als Datenbankregel)
wird zum wiederverwendbaren Baustein, damit aus Reflex und Paare Duelle werden
können — gleiches Konto, gleiche Codes, gleiche Regeln dafür, was gespeichert
wird. Neue Spiele (auch jenseits von Street View) treten dem Netz bei, indem
sie eine Karte auf `/games/` bekommen, eine Akzentfarbe beanspruchen und die
drei ehrlichen Chips benutzen: *Auf dieser Seite* / *Anmeldung nötig* /
*In Entwicklung*.

### 6. Arbeitsweise

Miss jede neue Farbe (`WCAG-Kontrast, im Quelltext dokumentiert`), lass
`npm run check` und `node build/linkcheck.mjs` laufen, bau beide Sprachen,
schau dir beide Schemata auf drei Breiten an, und schreib zu jeder
Design-Entscheidung den Grund dorthin, wo die Entscheidung steht — als
Kommentar im Code, nicht in einem Chat, der verloren geht.

---

## Kurzfassung zum Einwerfen

> Entwirf für skillry.de im bestehenden System weiter: Marke mit zwei Stimmen
> (Tag = tiefes Blau ~222°, Nacht = kraftvolles Violett ~262°, beide über
> einem Himmelslicht, das nur in Verläufen/Szenen lebt), Projekt-Akzente
> unangetastet (Minz AIRLOCK, Cyan NEXUS, Amber Index, Orange Skripte, Rosa
> Forum, Grün GeoBingo). Gleiche Konstruktion überall, eigener Ton je Projekt.
> Hintergründe sind Licht und Luft — keine Muster, keine Streifen, keine
> Glyphenfelder, kein Strich unter dem Kopf. Rundungen hierarchisch (4/6/12/15),
> scharfe Kanten nur als Schnittmarken außerhalb der Kartenecken in der
> Projektfarbe. Eine Bewegungskurve, drei Dauern, reduced-motion schaltet ab.
> Links bleiben #0969da. Jede Farbe mit gemessenem Kontrast im Quelltext
> (≥4.5:1 Text, ≥3:1 Kanten), jede Seite in Deutsch UND Englisch, hell UND
> dunkel, auf 390/834/1440 geprüft. Nichts von Dritten laden; Bilder als
> Inline-SVG aus Theme-Variablen. Und bei allem zuerst fragen: Was ist hier
> laut, ohne etwas zu sagen? Das fliegt.
