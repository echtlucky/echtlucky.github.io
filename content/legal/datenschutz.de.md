Diese Seite ist so gebaut, dass sie möglichst wenig über Sie erfährt. Was sie trotzdem erfährt, steht hier — vollständig und ohne die übliche Verwässerung.

## 1. Verantwortlicher

Lucas Steckel  
Ackerstraße 4A  
45701 Herten  
Deutschland  
E-Mail: [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com)  
Telefon: 0177 5836332

Ein Datenschutzbeauftragter ist nicht bestellt; die gesetzlichen Voraussetzungen dafür liegen nicht vor.

## 2. Der kurze Überblick

- Kein Tracking, keine Analyse-Werkzeuge, keine Werbung, keine Profilbildung.
- Keine Cookies. Was im Browser abgelegt wird, bleibt im Browser.
- Keine Schriftarten, Skripte oder Bilder von fremden Servern — **außer** auf der Forum-Seite, siehe Abschnitt 5.
- Ohne Anmeldung im Forum entsteht kein Konto und keine dauerhaft bei mir gespeicherte Angabe zu Ihrer Person.

---

## 3. Aufruf der Seite (Hosting)

Diese Seite wird von **GitHub Pages** ausgeliefert, einem Dienst der GitHub B.V., Prins Bernhardplein 200, 1097 JB Amsterdam, Niederlande, einer Tochter der GitHub, Inc. (USA).

Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten, insbesondere Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, Referrer und Angaben zu Browser und Betriebssystem. Ohne diese Daten kann eine Seite nicht ausgeliefert werden. Ich selbst habe auf diese Protokolle keinen Zugriff und werte sie nicht aus.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist der sichere und funktionsfähige Betrieb der Seite.

**Drittlandübermittlung:** Eine Verarbeitung in den USA ist möglich. GitHub stützt sich hierfür auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO) und ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Datenschutzerklärung von GitHub: [docs.github.com/site-policy/privacy-policies/github-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

## 4. Was in Ihrem Browser gespeichert wird

Diese Seite setzt keine Cookies. Sie legt zwei Werte im lokalen Speicher (`localStorage`) Ihres Browsers ab:

| Schlüssel | Inhalt | Zweck |
| --- | --- | --- |
| `theme` | `light` oder `dark` | merkt sich die gewählte Darstellung |
| `level` | die gewählte Tiefe im Lernbereich | zeigt beim nächsten Besuch dieselbe Stufe |

Beide Werte entstehen nur, wenn Sie den Umschalter tatsächlich benutzen. Sie werden **nicht** an mich oder an Dritte übertragen, enthalten keinen Personenbezug und lassen sich jederzeit über die Einstellungen Ihres Browsers löschen.

**Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TDDDG — die Speicherung ist erforderlich, um eine von Ihnen ausdrücklich gewünschte Funktion bereitzustellen. Eine Einwilligung ist dafür nicht nötig, weshalb hier auch kein Banner steht.

Bei angemeldeter Forum-Nutzung legt Firebase zusätzlich ein Sitzungstoken im lokalen Speicher ab (siehe Abschnitt 5).

---

## 5. Das Forum

Das Forum ist der einzige Teil dieser Seite, der personenbezogene Daten dauerhaft speichert. Es läuft auf **Firebase Authentication** und **Cloud Firestore**, Diensten der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.

### 5.1 Verbindungsaufbau

Sobald Sie die Forum-Seite öffnen, lädt Ihr Browser das Firebase-SDK von `www.gstatic.com` und baut eine Verbindung zu Google-Servern auf. Dabei wird Ihre IP-Adresse an Google übertragen — **auch dann, wenn Sie sich nicht anmelden**. Alle übrigen Seiten dieses Angebots laden nichts von fremden Servern.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist der Betrieb eines Forums ohne eigene Serverinfrastruktur.

### 5.2 Konto und Anmeldung

Die Anmeldung erfolgt mit E-Mail-Adresse und Passwort. Das Passwort wird ausschließlich von Firebase gehasht und gespeichert; dieser Quellcode sieht es zu keinem Zeitpunkt im Klartext und speichert es nirgends.

Firebase Authentication verarbeitet dabei: E-Mail-Adresse, Passwort-Hash, eine Nutzerkennung (UID), den Bestätigungsstatus der E-Mail-Adresse sowie Zeitpunkte von Erstellung und letzter Anmeldung. Zur Missbrauchsabwehr verarbeitet Google außerdem IP-Adresse und Gerätedaten.

Zum Schreiben ist eine **bestätigte** E-Mail-Adresse erforderlich. Dafür versendet Firebase eine Bestätigungsmail. Das ist kein Selbstzweck: ohne diese Hürde ist ein Forum ein offenes Relais.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der von Ihnen gewünschten Funktion) sowie Art. 6 Abs. 1 lit. f DSGVO für die Missbrauchsabwehr.

### 5.3 Beiträge

Zu jedem Thema und jeder Antwort werden gespeichert: der von Ihnen gewählte Anzeigename, Ihre Nutzerkennung, Titel und Text des Beitrags sowie der Zeitpunkt. **Beiträge sind öffentlich und ohne Anmeldung für jeden lesbar.** Ihre E-Mail-Adresse wird dabei nicht angezeigt.

Wählen Sie einen Anzeigenamen, der so öffentlich sein darf, wie er es damit wird. Was Sie in einen Beitrag schreiben, entscheiden Sie — schreiben Sie nichts hinein, das nicht öffentlich stehen soll.

Beiträge werden beim Löschen nicht hart entfernt, sondern als gelöscht markiert. Der Text wird ersetzt, der Eintrag selbst bleibt bestehen, damit ein Gesprächsverlauf nicht mitten in einer Auseinandersetzung verschwindet. Auf Verlangen nach Art. 17 DSGVO wird der Datensatz vollständig entfernt.

### 5.4 Drittlandübermittlung

Google verarbeitet Daten auch in den USA. Grundlage sind die Standardvertragsklauseln der EU-Kommission nach Art. 46 Abs. 2 lit. c DSGVO; Google LLC ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Über einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO (Google Cloud Data Processing Addendum) ist die Verarbeitung geregelt. Datenschutzerklärung von Google: [policies.google.com/privacy](https://policies.google.com/privacy).

## 6. GitHub Discussions

An mehreren Stellen wird auf GitHub Discussions verlinkt. Das ist ein externes Angebot; wenn Sie dort schreiben, gelten die Bedingungen und die Datenschutzerklärung von GitHub, und es ist ausschließlich ein Konto beteiligt, das Sie ohnehin selbst verwalten.

## 7. Speicherdauer

- **Server-Protokolle bei GitHub:** nach den Fristen von GitHub, ohne mein Zutun.
- **Konto und Beiträge:** bis Sie das Konto löschen oder die Löschung verlangen.
- **Werte im lokalen Speicher:** bis Sie sie im Browser löschen.

## 8. Ihre Rechte

Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und **Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21)**. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.

Für all das genügt eine formlose Nachricht an [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com).

Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu (Art. 77 DSGVO). Zuständig ist:

> Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf — [ldi.nrw.de](https://www.ldi.nrw.de/)

## 9. Keine automatisierte Entscheidungsfindung

Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO statt. Die Prüfergebnisse im Skill-Index beziehen sich auf Software, nicht auf Personen.

## 10. Änderungen

Diese Erklärung wird angepasst, wenn sich am Angebot etwas ändert, das hier beschrieben ist. Die jeweils aktuelle Fassung liegt unter dieser Adresse; ihre Entwicklung ist im öffentlichen Quellcode-Verlauf nachvollziehbar.
