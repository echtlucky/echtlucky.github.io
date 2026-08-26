Diese Seite ist so gebaut, dass sie möglichst wenig über Sie erfährt. Was sie trotzdem erfährt, steht hier — vollständig und ohne die übliche Verwässerung.

# 1. Verantwortlicher

Lucas Steckel  
Ackerstraße 4A  
45701 Herten  
Deutschland  
E-Mail: [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com)  
Telefon: 0177 5836332

Ein Datenschutzbeauftragter ist nicht bestellt; die gesetzlichen Voraussetzungen dafür liegen nicht vor.

# 2. Der kurze Überblick

- Kein Tracking, keine Analyse-Werkzeuge, keine Werbung, keine Profilbildung.
- Keine Cookies. Was im Browser abgelegt wird, bleibt im Browser.
- Keine Schriftarten, Skripte oder Bilder von fremden Servern — **außer** auf der Forum-Seite (Abschnitt 5) und bei GeoBingo (Abschnitt 6).
- Ohne Anmeldung im Forum entsteht kein Konto und keine dauerhaft bei mir gespeicherte Angabe zu Ihrer Person.

---

# 3. Aufruf der Seite (Hosting)

Diese Seite wird von **GitHub Pages** ausgeliefert, einem Dienst der GitHub B.V., Prins Bernhardplein 200, 1097 JB Amsterdam, Niederlande, einer Tochter der GitHub, Inc. (USA).

Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten, insbesondere Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, Referrer und Angaben zu Browser und Betriebssystem. Ohne diese Daten kann eine Seite nicht ausgeliefert werden. Ich selbst habe auf diese Protokolle keinen Zugriff und werte sie nicht aus.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist der sichere und funktionsfähige Betrieb der Seite.

**Drittlandübermittlung:** Eine Verarbeitung in den USA ist möglich. GitHub stützt sich hierfür auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO) und ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Datenschutzerklärung von GitHub: [docs.github.com/site-policy/privacy-policies/github-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

# 4. Was in Ihrem Browser gespeichert wird

Diese Seite setzt keine Cookies. Sie legt bis zu sechs Werte im lokalen Speicher (`localStorage`) Ihres Browsers ab:

| Schlüssel | Inhalt | Zweck |
| --- | --- | --- |
| `theme` | `light` oder `dark` | merkt sich die gewählte Darstellung |
| `level` | die gewählte Tiefe im Lernbereich | zeigt beim nächsten Besuch dieselbe Stufe |
| `skillry:who` | Ihr Anzeigename und ob Ihre E-Mail-Adresse bestätigt ist | zeigt in der Kopfleiste, dass Sie angemeldet sind |
| `gb:zutritt` | dass Sie den Zugangscode von GeoBingo eingegeben haben | fragt ihn nicht bei jedem Besuch erneut ab |
| `gb:name` | der Name, den Sie sich bei GeoBingo gegeben haben | steht dann schon im Feld |
| `gb:lobby` | der Code der zuletzt betretenen Lobby | bringt Sie nach einem Neuladen in dieselbe Runde zurück |

Die ersten beiden entstehen nur, wenn Sie den jeweiligen Umschalter tatsächlich benutzen. Der dritte entsteht ausschließlich, wenn Sie sich anmelden, und verschwindet beim Abmelden. Die letzten drei entstehen nur, wenn Sie GeoBingo öffnen; der Lobby-Code verschwindet, sobald Sie die Runde verlassen. Keiner der Werte enthält ein Token, und keiner wird irgendwohin gesendet.

`skillry:who` verdient eine Erklärung, weil er der Grund ist, warum die Kopfleiste Sie begrüßen kann, ohne dass irgendeine Seite mit Google spricht. Der Anmeldezustand liegt eigentlich bei Firebase; ihn dort abzufragen hieße, das Firebase-SDK auf **jeder** Seite zu laden — und damit wäre die Zusage aus Abschnitt 5, dass alle Seiten außer dem Forum und GeoBingo nichts von fremden Servern laden, nicht mehr wahr. Stattdessen schreibt die Anmeldung diesen einen Wert lokal, und alle anderen Seiten lesen nur ihn. Er enthält kein Token und keine E-Mail-Adresse, er berechtigt zu nichts — wer ihn im Browser von Hand fälscht, bekommt einen fremden Namen in die Ecke des Bildschirms und von der Datenbank eine Ablehnung.

Keiner der drei Werte wird an mich oder an Dritte übertragen, und alle lassen sich jederzeit über die Einstellungen Ihres Browsers löschen.

**Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TDDDG — die Speicherung ist erforderlich, um eine von Ihnen ausdrücklich gewünschte Funktion bereitzustellen. Eine Einwilligung ist dafür nicht nötig, weshalb hier auch kein Banner steht.

Bei angemeldeter Forum-Nutzung legt Firebase zusätzlich ein Sitzungstoken im lokalen Speicher ab (siehe Abschnitt 5).

---

# 5. Das Forum

Das Forum ist der einzige Teil dieser Seite, der personenbezogene Daten dauerhaft speichert. Es läuft auf **Firebase Authentication** und **Cloud Firestore**, Diensten der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.

## 5.1 Verbindungsaufbau

Sobald Sie die Forum-Seite öffnen, lädt Ihr Browser das Firebase-SDK von `www.gstatic.com` und baut eine Verbindung zu Google-Servern auf. Dabei wird Ihre IP-Adresse an Google übertragen — **auch dann, wenn Sie sich nicht anmelden**. Alle übrigen Seiten dieses Angebots laden nichts von fremden Servern — mit einer Ausnahme: GeoBingo, siehe Abschnitt 6. Dieser Satz stand hier bis zum 26.08.2026 ohne die Einschränkung. Er wurde geändert, weil er sonst nicht mehr gestimmt hätte.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist der Betrieb eines Forums ohne eigene Serverinfrastruktur.

## 5.2 Konto und Anmeldung

Die Anmeldung erfolgt mit E-Mail-Adresse und Passwort. Das Passwort wird ausschließlich von Firebase gehasht und gespeichert; dieser Quellcode sieht es zu keinem Zeitpunkt im Klartext und speichert es nirgends.

Firebase Authentication verarbeitet dabei: E-Mail-Adresse, Passwort-Hash, eine Nutzerkennung (UID), den Bestätigungsstatus der E-Mail-Adresse sowie Zeitpunkte von Erstellung und letzter Anmeldung. Zur Missbrauchsabwehr verarbeitet Google außerdem IP-Adresse und Gerätedaten.

Zum Schreiben ist eine **bestätigte** E-Mail-Adresse erforderlich. Dafür versendet Firebase eine Bestätigungsmail. Das ist kein Selbstzweck: ohne diese Hürde ist ein Forum ein offenes Relais.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der von Ihnen gewünschten Funktion) sowie Art. 6 Abs. 1 lit. f DSGVO für die Missbrauchsabwehr.

## 5.3 Beiträge

Zu jedem Thema und jeder Antwort werden gespeichert: der von Ihnen gewählte Anzeigename, Ihre Nutzerkennung, Titel und Text des Beitrags sowie der Zeitpunkt. **Beiträge sind öffentlich und ohne Anmeldung für jeden lesbar.** Ihre E-Mail-Adresse wird dabei nicht angezeigt.

Wählen Sie einen Anzeigenamen, der so öffentlich sein darf, wie er es damit wird. Was Sie in einen Beitrag schreiben, entscheiden Sie — schreiben Sie nichts hinein, das nicht öffentlich stehen soll.

Beiträge werden beim Löschen nicht hart entfernt, sondern als gelöscht markiert. Der Text wird ersetzt, der Eintrag selbst bleibt bestehen, damit ein Gesprächsverlauf nicht mitten in einer Auseinandersetzung verschwindet. Auf Verlangen nach Art. 17 DSGVO wird der Datensatz vollständig entfernt.

## 5.4 Drittlandübermittlung

Google verarbeitet Daten auch in den USA. Grundlage sind die Standardvertragsklauseln der EU-Kommission nach Art. 46 Abs. 2 lit. c DSGVO; Google LLC ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Über einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO (Google Cloud Data Processing Addendum) ist die Verarbeitung geregelt. Datenschutzerklärung von Google: [policies.google.com/privacy](https://policies.google.com/privacy).

# 6. GeoBingo

GeoBingo ist ein Spiel auf dieser Seite, das in **Google Street View** stattfindet. Es ist neben dem Forum der zweite Teil dieses Angebots, der mit einem fremden Server spricht, und der einzige, der das mit Google Maps Platform tut.

## 6.1 Wann überhaupt etwas geladen wird

Solange Sie die Seite nur lesen, wird von Google nichts geladen. Erst wenn Sie eine Lobby aufmachen oder einer beitreten, lädt Ihr Browser das Firebase-SDK von `www.gstatic.com`. Erst wenn eine Runde tatsächlich beginnt, lädt er zusätzlich die Kartenbibliothek von `maps.googleapis.com`. Ab dem jeweiligen Zeitpunkt ist Ihre IP-Adresse bei Google angekommen.

Diese Reihenfolge ist Absicht: Wer den Erklärtext liest und wieder geht, hat mit Google nicht gesprochen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO. Ohne Street View gibt es das Spiel nicht, und Sie starten es selbst.

## 6.2 Was Google dabei erfährt

Beim Anzeigen eines Panoramas und beim Nachbauen eines Fundbildes übermittelt Ihr Browser an Google: Ihre IP-Adresse, Angaben zu Browser und Gerät, die Kennung des angeforderten Panoramas samt Blickrichtung, sowie die Adresse dieser Seite als Referrer. Es gelten die Nutzungsbedingungen von Google Maps Platform und die Datenschutzerklärung von Google: [policies.google.com/privacy](https://policies.google.com/privacy).

**Ihr eigener Standort wird nicht abgefragt.** Die Standortabfrage des Browsers wird an keiner Stelle benutzt, und die Bewegungssensoren des Geräts sind im Panorama ausdrücklich abgeschaltet. Die Orte, an denen Sie im Spiel landen, sind gewürfelt und haben mit Ihrem nichts zu tun.

## 6.3 Was in der Datenbank steht

Eine Lobby liegt in derselben Cloud Firestore wie das Forum (siehe Abschnitt 5) und enthält: den fünfstelligen Code, den Anzeigenamen jedes Mitspielers und dessen Nutzerkennung, die Wortliste, und je Fund die Kennung des Panoramas mit Blickrichtung, Neigung, Bildwinkel und Koordinate.

**Ein Fund ist kein Bild.** Es wird nichts hochgeladen und keine Bilddatei gespeichert — nur die fünf Zahlen, aus denen Google dasselbe Bild wieder aufbaut.

Eine Lobby ist ausschließlich über ihren Code erreichbar. Eine Liste aller Lobbys gibt es nicht: die Datenbankregel erlaubt das Abrufen eines einzelnen Codes und verbietet das Auflisten. Wer die Runde verlässt oder den Tab schließt, wird aus der Spielerliste entfernt. Verlässt der Gastgeber die Lobby, wird sie mitsamt Wörtern und Funden gelöscht; eine liegengebliebene Lobby entfernt eine Aufräumregel von Firestore 24 Stunden nach ihrer Anlage.

## 6.4 Kein Konto, keine Anmeldung

**GeoBingo hat keine Anmeldung.** Sie geben sich einen Namen, und Firebase legt dafür eine anonyme Nutzerkennung an — eine Zeichenfolge ohne Bezug zu Ihrer Person. Es werden weder E-Mail-Adresse noch Passwort verarbeitet, und mit dem Forum-Konto aus Abschnitt 5 hat das nichts zu tun. Der Name steht nur in der Lobby und nur so lange, wie es sie gibt.

Vor der Seite liegt ein Zugangscode. Er hält sie unauffällig, nicht verschlossen: die Seite ist eine statische Datei, der Code steht darin, und wer entschlossen genug sucht, findet ihn. Sie ist nirgends verlinkt, steht nicht in der Sitemap, nicht in der Suche dieser Website und trägt `noindex`. Der Hinweistext auf dem Code-Feld sagt das in denselben Worten — ein Schutz, der mehr verspricht als er hält, ist schlechter als gar keiner.

# 7. GitHub Discussions

An mehreren Stellen wird auf GitHub Discussions verlinkt. Das ist ein externes Angebot; wenn Sie dort schreiben, gelten die Bedingungen und die Datenschutzerklärung von GitHub, und es ist ausschließlich ein Konto beteiligt, das Sie ohnehin selbst verwalten.

# 8. Speicherdauer

- **Server-Protokolle bei GitHub:** nach den Fristen von GitHub, ohne mein Zutun.
- **Konto und Beiträge:** bis Sie das Konto löschen oder die Löschung verlangen.
- **Lobbys und Funde bei GeoBingo:** bis der Gastgeber die Lobby verlässt, spätestens 24 Stunden nach ihrer Anlage.
- **Werte im lokalen Speicher:** bis Sie sie im Browser löschen.

# 9. Ihre Rechte

Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und **Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21)**. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.

Für all das genügt eine formlose Nachricht an [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com).

Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu (Art. 77 DSGVO). Zuständig ist:

> Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf — [ldi.nrw.de](https://www.ldi.nrw.de/)

# 10. Keine automatisierte Entscheidungsfindung

Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO statt. Die Prüfergebnisse im Skill-Index beziehen sich auf Software, nicht auf Personen.

# 11. Änderungen

Diese Erklärung wird angepasst, wenn sich am Angebot etwas ändert, das hier beschrieben ist. Die jeweils aktuelle Fassung liegt unter dieser Adresse; ihre Entwicklung ist im öffentlichen Quellcode-Verlauf nachvollziehbar.
