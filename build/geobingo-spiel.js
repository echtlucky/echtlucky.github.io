/*
 * GeoBingo — der Spielclient.
 *
 * Eine eigenstaendige Spielseite: kein Kopf, kein Fuss, keine Anmeldung. Wer
 * den Zugangscode hat, gibt sich einen Namen und spielt. Gedacht ist sie fuer
 * einen Stream, und daran haengen die meisten Entscheidungen hier drin.
 *
 * Alles von aussen steht in window.__GEOBINGO — Firebase-Zugang, Kartenschluessel,
 * Regionen, Wortpakete und die Oberflaechentexte. Diese Datei enthaelt keinen
 * einzigen sichtbaren Text.
 *
 *
 * FUENF ENTSCHEIDUNGEN, DIE MAN SONST FUER WILLKUER HALTEN WUERDE
 *
 * 1. Ein Bildschirmfoto ist kein Bild, sondern fuenf Zahlen.
 *
 *    Das Panorama der Maps-JS-API rendert in eine WebGL-Flaeche, die der
 *    Browser nicht auslesen laesst — canvas.toDataURL() wirft dort, und daran
 *    aendert kein Kniff etwas. Ein Fund merkt sich deshalb `pano`, `heading`,
 *    `pitch`, `fov` und die Koordinate. Die Street View Static API baut daraus
 *    dasselbe Bild noch einmal, und dieselben Zahlen bringen in der Auswertung
 *    ein echtes 3D-Panorama genau an diese Stelle zurueck.
 *
 *    Nichts wird hochgeladen, nichts gespeichert, ein Fund ist 120 Byte — und
 *    er bleibt exakt nachpruefbar, weil ihn niemand hinterher zuschneiden kann.
 *
 * 2. Jedes geladene Panorama ist eine Rechnungszeile.
 *
 *    Google rechnet dynamisches Street View pro Panorama ab, das Laufen
 *    eingeschlossen. Daraus folgen drei Dinge im Code, die sonst wie
 *    Umstaendlichkeit aussehen: `bewegung` ist eine Einstellung und kein fester
 *    Wert; die Panorama-Flaeche wird nie neu gebaut; und in der Auswertung
 *    oeffnet sich das 3D-Panorama erst auf Klick statt von selbst.
 *
 * 3. Die Wortliste wird geflickt, nicht neu geschrieben.
 *
 *    innerHTML auf die Kartenliste haette bei jedem Schnappschuss alle <img>
 *    ersetzt — und jedes ersetzte Bild ist ein neuer Abruf bei Google. Bei acht
 *    Spielern, die klicken, waeren das hunderte Abrufe fuer Bilder, die schon
 *    da waren. Deshalb `zeichneKarte()`: Knoepfe einmal bauen, danach nur noch
 *    Zustaende umschalten.
 *
 * 4. Der Zugangscode ist eine Tuer, kein Schloss.
 *
 *    Die Seite liegt als statische Datei bei GitHub Pages. Der Code steht damit
 *    zwangslaeufig im Quelltext, und wer ihn dort sucht, findet ihn. Er haelt
 *    Zufallsbesucher und Suchmaschinen fern — mehr behauptet die Seite auch
 *    nicht, und der Hinweistext sagt das in diesen Worten.
 *
 * 5. Anonyme Anmeldung, keine Konten.
 *
 *    Eine Runde dauert zehn Minuten. Wer dafuer erst ein Konto anlegen und eine
 *    Bestaetigungsmail oeffnen muss, spielt nicht mit. Firebase vergibt eine
 *    anonyme Kennung; der Name steht in der Lobby und sonst nirgends.
 */
(function () {
  'use strict';

  var C = window.__GEOBINGO;
  if (!C) return;

  var L = C.L;
  var wurzel = document.getElementById('gbRoot');
  if (!wurzel) return;

  // ── Kleinkram ─────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text != null) e.textContent = text;
    return e;
  }

  function holen(schluessel) { try { return localStorage.getItem(schluessel); } catch (e) { return null; } }
  function legen(schluessel, wert) { try { localStorage.setItem(schluessel, wert); } catch (e) {} }
  function weg(schluessel) { try { localStorage.removeItem(schluessel); } catch (e) {} }

  /*
   * Die Meldeleiste. `alert()` haelt den ganzen Ablauf an und bringt seinen
   * eigenen Fensterrahmen mit — auf einer Seite mit laufender Uhr, die neben
   * einem Stream steht, ist beides falsch.
   */
  var meldBox = null, meldZeit = null;
  function melde(text, art) {
    if (!meldBox) {
      meldBox = el('div', 'gb-melde');
      meldBox.setAttribute('role', 'status');
      document.body.appendChild(meldBox);
    }
    meldBox.textContent = String(text);
    meldBox.dataset.art = art || 'info';
    meldBox.dataset.da = '1';
    clearTimeout(meldZeit);
    meldZeit = setTimeout(function () { meldBox.dataset.da = '0'; }, art === 'fehler' ? 7000 : 3000);
  }

  /* Ohne 0/O/1/I/5/S: ein Code wird vorgelesen und abgetippt, und genau diese
     Zeichen sind die, bei denen das schiefgeht. */
  var ALPHABET = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';
  function zufallsZahlen(n) {
    var z = new Uint32Array(n);
    (window.crypto || window.msCrypto).getRandomValues(z);
    return z;
  }
  function neuerCode() {
    var z = zufallsZahlen(5), s = '';
    for (var i = 0; i < 5; i++) s += ALPHABET[z[i] % ALPHABET.length];
    return s;
  }
  function id16() {
    var z = zufallsZahlen(2);
    return z[0].toString(36) + z[1].toString(36);
  }

  function zeit(ms) {
    if (ms < 0) ms = 0;
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /** Vergleicht Zugangscodes ohne Ruecksicht auf Schreibweise und Bindestriche. */
  function schluesselGleich(a, b) {
    var n = function (x) { return String(x || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
    return n(a) !== '' && n(a) === n(b);
  }

  // ── Zustand ───────────────────────────────────────────────────────────────

  var fb = null, app = null, db = null, auth = null, user = null;
  var code = null, lobby = null;
  var spieler = {}, woerter = [], funde = {}, stimmen = {};
  var abos = [], stimmAbos = {};
  var bild = 'laden';
  var pano = null, svc = null, mapsLaeuft = null;
  var schauPano = null;                 // das Panorama der Auswertung
  var uhr = null;
  var hudAus = false;
  /* Ob der Spielerkasten zugeklappt ist. Bleibt ueber die Runde hinaus
     stehen: wer verdeckt spielen will, will das nicht jede Runde neu
     einstellen. */
  var spielerAus = holen('gb:spieler-zu') === '1';
  var entwurf = null;                   // Einstellungen, solange die Lobby noch nicht existiert

  function ichBinGastgeber() { return !!(lobby && user && lobby.host === user.uid); }
  function meinName() {
    if (user && spieler[user.uid] && spieler[user.uid].name) return spieler[user.uid].name;
    return holen('gb:name') || 'Gast';
  }
  function meinTeam() { return (user && spieler[user.uid] && spieler[user.uid].team) || 'a'; }
  function spielerZahl() { return Object.keys(spieler).length; }
  function teamsAn() { return !!(lobby && lobby.einst && lobby.einst.modus === 'teams'); }

  function abmelden() {
    for (var i = 0; i < abos.length; i++) { try { abos[i](); } catch (e) {} }
    abos = [];
    for (var k in stimmAbos) { try { stimmAbos[k](); } catch (e) {} }
    stimmAbos = {};
  }

  // ── Firebase ──────────────────────────────────────────────────────────────

  var SDK = 'https://www.gstatic.com/firebasejs/' + C.sdk + '/';

  function firebase() {
    return Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-firestore.js'),
      import(SDK + 'firebase-auth.js')
    ]).then(function (m) {
      fb = Object.assign({}, m[0], m[1], m[2]);
      app = fb.initializeApp(C.fb);
      db = fb.getFirestore(app);
      auth = fb.getAuth(app);
      return new Promise(function (fertig, schiefgegangen) {
        var erste = true;
        fb.onAuthStateChanged(auth, function (u) {
          user = u;
          if (erste) { erste = false; fertig(); }
        });
        setTimeout(function () { if (erste) { erste = false; schiefgegangen(new Error('auth')); } }, 15000);
      });
    });
  }

  /*
   * Anonyme Anmeldung. Ist sie in der Firebase-Konsole nicht eingeschaltet,
   * kommt `auth/operation-not-allowed` zurueck — und dann sagt die Seite genau
   * das, samt Weg dorthin, statt „das hat nicht geklappt". Ein Fehler, dessen
   * Behebung ein Schalter ist, sollte den Schalter nennen.
   */
  function anmelden() {
    if (user) return Promise.resolve(user);
    return fb.signInAnonymously(auth).then(function (r) { user = r.user; return user; });
  }

  // ── Google Maps ───────────────────────────────────────────────────────────

  /*
   * Erst geladen, wenn wirklich gespielt wird. Sobald das Skript da ist, hat
   * der Browser mit Google gesprochen und die IP-Adresse ist dort angekommen —
   * wer nur die Lobby aufmacht, hat darum nicht gebeten.
   */
  /*
   * `gm_authFailure` ist der einzige Weg, von einem Schluesselproblem zu
   * erfahren — und ohne ihn sieht man es nicht kommen.
   *
   * Ist der Schluessel ungueltig, die Adresse nicht freigegeben oder die Maps
   * JavaScript API im Projekt nicht aktiviert, dann WIRFT nichts. Der
   * Konstruktor kehrt normal zurueck, das Versprechen erfuellt sich, der
   * Ladehinweis verschwindet — und Google malt in die leere Flaeche seinen
   * eigenen grauen Kasten mit „Hoppla! Ein Fehler ist aufgetreten." Der Spieler
   * sieht einen Fehler, den diese Seite nie ausgeloest hat, in einer Gestaltung,
   * die nicht ihre ist, mit einem Hinweis auf die JavaScript-Konsole.
   *
   * Genau das ist beim ersten echten Durchlauf passiert (ApiNotActivatedMapError),
   * und deshalb steht der Haken jetzt hier: Google ruft diese Funktion bei
   * jedem Authentifizierungsfehler auf, und danach sagt die Seite es mit
   * eigenen Worten und nennt die drei Stellen, an denen es liegen kann.
   */
  var mapsAbgelehnt = false;

  function maps() {
    if (mapsLaeuft) return mapsLaeuft;
    mapsLaeuft = new Promise(function (fertig, schiefgegangen) {
      if (window.google && window.google.maps && window.google.maps.StreetViewPanorama) return fertig();
      var zeitAus = setTimeout(function () { schiefgegangen(new Error('timeout')); }, 20000);

      window.gm_authFailure = function () {
        mapsAbgelehnt = true;
        clearTimeout(zeitAus);
        panoFehlerZeigen('schluessel');
        schiefgegangen(new Error('auth'));
      };

      window.__gbMapsBereit = function () { clearTimeout(zeitAus); fertig(); };
      var s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(C.maps)
        + '&v=weekly&loading=async&callback=__gbMapsBereit';
      s.async = true;
      s.onerror = function () { clearTimeout(zeitAus); schiefgegangen(new Error('script')); };
      document.head.appendChild(s);
    });
    return mapsLaeuft;
  }

  /*
   * Die Fehlerflaeche ueber dem Panorama. Wird von zwei Seiten gerufen — vom
   * Fehlschlag beim Starten der Runde und von gm_authFailure, das auch dann
   * noch zuschlaegt, wenn das Panorama laengst gebaut ist. Deshalb baut sie
   * die Flaeche notfalls neu, statt eine vorhandene vorauszusetzen.
   */
  function panoFehlerZeigen(art) {
    var huelle = document.querySelector('.gb-buehne');
    if (!huelle) return;
    var kasten = document.getElementById('gbPanoLaden');
    if (!kasten) {
      kasten = el('div', 'gb-panoladen');
      kasten.id = 'gbPanoLaden';
      var pano = document.getElementById('gbPano');
      if (pano && pano.nextSibling) huelle.insertBefore(kasten, pano.nextSibling);
      else huelle.appendChild(kasten);
    }
    var text = art === 'kein-ort' ? L.keinOrt
      : art === 'keine-region' ? L.keineRegion
      : L.kartenFehlerP;
    kasten.innerHTML = '<div class="gb-panofehler"><strong>' + esc(L.kartenFehlerH) + '</strong><p>'
      + esc(text) + '</p></div>';
  }

  /*
   * Ein Zufallsort mit Panoramen.
   *
   * Gewuerfelt wird in einem Kasten der gewaehlten Regionen (oder in einem
   * engen Kasten um eine Innenstadt, wenn „nur Staedte" an ist), dann sucht
   * Street View im Umkreis den naechsten Panoramapunkt. Der Umweg ist noetig,
   * weil ein zufaelliger Punkt fast immer Wasser, Wald oder Feld ist — und er
   * ist kostenlos, weil eine Metadaten-Abfrage nicht abgerechnet wird. Deshalb
   * darf sie bis zu vierzig Mal danebengehen.
   *
   * `outdoor` schliesst Innenaufnahmen aus: eine Runde, die in einem Museum
   * beginnt, ist kein Spiel, sondern eine Sackgasse.
   */
  function zufallsort(einst) {
    var kaesten = [];
    var ids = einst.regionen || [];
    for (var i = 0; i < C.regionen.length; i++) {
      var r = C.regionen[i];
      if (ids.indexOf(r.id) < 0) continue;
      if (einst.nurStaedte && r.staedte && r.staedte.length) {
        for (var j = 0; j < r.staedte.length; j++) {
          var s = r.staedte[j];
          kaesten.push([s[0] - 0.05, s[1] - 0.05, s[0] + 0.05, s[1] + 0.05, 8000]);
        }
      } else if (r.boxen) {
        for (var k = 0; k < r.boxen.length; k++) kaesten.push(r.boxen[k].concat([50000]));
      }
    }
    if (!kaesten.length) return Promise.reject(new Error('keine-region'));
    if (!svc) svc = new google.maps.StreetViewService();

    function versuch(rest) {
      var b = kaesten[(zufallsZahlen(1)[0]) % kaesten.length];
      var lat = b[0] + Math.random() * (b[2] - b[0]);
      var lng = b[1] + Math.random() * (b[3] - b[1]);
      return svc.getPanorama({
        location: { lat: lat, lng: lng },
        radius: b[4],
        source: google.maps.StreetViewSource.OUTDOOR
      }).then(function (r) {
        return { pano: r.data.location.pano, lat: r.data.location.latLng.lat(), lng: r.data.location.latLng.lng() };
      }).catch(function () {
        if (rest <= 0) throw new Error('kein-ort');
        return versuch(rest - 1);
      });
    }
    return versuch(40);
  }

  /*
   * Zoomstufe zu Bildwinkel. Google bildet das als fov = 180 / 2^zoom ab; die
   * Static API nimmt 10 bis 120 Grad, also wird geklemmt. Ohne diese Zeile
   * zeigt der gespeicherte Fund einen anderen Ausschnitt als den, den der
   * Spieler beim Klicken vor sich hatte — und die Auswertung streitet dann
   * ueber ein Bild, das so niemand gewaehlt hat. Genau deshalb funktioniert
   * auch das Heranzoomen an den Hund: der Zoom wandert mit.
   */
  function zoomZuFov(z) {
    return Math.round(Math.max(10, Math.min(120, 180 / Math.pow(2, z || 0))) * 10) / 10;
  }

  function bildAdresse(f, breite, hoehe) {
    return 'https://maps.googleapis.com/maps/api/streetview'
      + '?size=' + breite + 'x' + hoehe
      + '&pano=' + encodeURIComponent(f.pano)
      + '&heading=' + f.heading + '&pitch=' + f.pitch + '&fov=' + f.fov
      + '&return_error_code=true&key=' + encodeURIComponent(C.maps);
  }

  // ── Punkte ────────────────────────────────────────────────────────────────

  /*
   * Ein Fund faellt nur durch, wenn ihn ALLE anderen mit Daumen runter
   * ablehnen.
   *
   * Nicht „Mehrheit entscheidet", und das ist Absicht: wer nichts tut, haelt
   * das Spiel nicht auf, und ein einzelner Miesepeter kippt keinen Fund. Ein
   * Daumen hoch macht einen Fund damit nie schlechter — er ist die Zustimmung,
   * die man geben kann, ohne dass sie noetig waere.
   */
  function zaehlung(fid) {
    var s = stimmen[fid] || {}, ja = 0, nein = 0;
    for (var k in s) { if (s[k] === 1) ja++; else if (s[k] === -1) nein++; }
    var andere = Math.max(0, spielerZahl() - 1);
    return { ja: ja, nein: nein, andere: andere, gilt: !(andere > 0 && ja === 0 && nein >= andere) };
  }

  function wortVon(id) {
    for (var i = 0; i < woerter.length; i++) if (woerter[i].id === id) return woerter[i];
    return null;
  }

  function stand() {
    var tabelle = {};
    for (var uid in spieler) {
      tabelle[uid] = { uid: uid, name: spieler[uid].name, team: spieler[uid].team || 'a', punkte: 0, funde: 0 };
    }
    for (var fid in funde) {
      var f = funde[fid];
      if (!tabelle[f.uid] || !zaehlung(fid).gilt) continue;
      var w = wortVon(f.wortId);
      tabelle[f.uid].punkte += (w ? w.p : 1);
      tabelle[f.uid].funde++;
    }
    var liste = [];
    for (var k in tabelle) liste.push(tabelle[k]);
    liste.sort(function (a, b) { return b.punkte - a.punkte || b.funde - a.funde || a.name.localeCompare(b.name); });
    return liste;
  }

  function teamStand() {
    var t = { a: { id: 'a', punkte: 0, funde: 0, wer: [] }, b: { id: 'b', punkte: 0, funde: 0, wer: [] } };
    var einzeln = stand();
    for (var i = 0; i < einzeln.length; i++) {
      var s = einzeln[i], z = t[s.team] || t.a;
      z.punkte += s.punkte; z.funde += s.funde; z.wer.push(s);
    }
    return [t.a, t.b].sort(function (x, y) { return y.punkte - x.punkte || y.funde - x.funde; });
  }

  // ── Lobby ─────────────────────────────────────────────────────────────────

  /*
   * `setDoc` unter einer Regel, die nur `create` erlaubt, ist die ganze
   * Kollisionspruefung: gibt es den Code schon, weist die Datenbank den
   * Schreibvorgang ab und es wird neu gewuerfelt. Erst nachsehen und dann
   * schreiben waeren zwei Vorgaenge mit einer Luecke dazwischen.
   */
  function lobbyAnlegen(einst, rest) {
    var c = neuerCode();
    return fb.setDoc(fb.doc(db, 'geobingo', c), {
      host: user.uid,
      zustand: 'lobby',
      offen: true,
      /* Oberstes Feld, nicht unter `einst`: die Regel fuer `list` prueft
         `resource.data.oeffentlich`, und verschachtelte Felder sind in einer
         Firestore-Abfrage nicht so filterbar. Neue Lobbys sind privat. */
      oeffentlich: C.standard.oeffentlich === true,
      einst: einst,
      angelegt: fb.serverTimestamp()
    }).then(function () { return c; })
      .catch(function (e) {
        if ((rest == null ? 5 : rest) > 0 && /permission|already/i.test(String((e && e.code) || e))) {
          return lobbyAnlegen(einst, (rest == null ? 5 : rest) - 1);
        }
        throw e;
      });
  }

  function spielerEintragen(c, team) {
    return fb.setDoc(fb.doc(db, 'geobingo', c, 'spieler', user.uid), {
      name: meinName(), team: team || 'a', dabei: fb.serverTimestamp()
    }, { merge: true });
  }

  function beitreten(c, still) {
    c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 5) { if (!still) melde(L.codeFalsch, 'fehler'); return Promise.resolve(false); }

    return anmelden().then(function () {
      return fb.getDoc(fb.doc(db, 'geobingo', c));
    }).then(function (s) {
      if (!s.exists()) { if (!still) melde(L.lobbyWeg, 'fehler'); weg('gb:lobby'); return false; }
      var d = s.data();
      if (!d.offen) { if (!still) melde(L.lobbyLaeuft, 'fehler'); return false; }

      // In Teams wird die kleinere Seite aufgefuellt. Das ist keine
      // Bevormundung: umstellen kann jeder in der Lobby mit einem Klick, aber
      // eine Vorbelegung von 4:0 hat noch nie jemand gewollt.
      return fb.getDocs(fb.collection(db, 'geobingo', c, 'spieler')).then(function (q) {
        var a = 0, b = 0;
        q.forEach(function (p) { if ((p.data().team || 'a') === 'b') b++; else a++; });
        return spielerEintragen(c, b < a ? 'b' : 'a');
      }).then(function () {
        code = c;
        legen('gb:lobby', c);
        history.replaceState(null, '', location.pathname + '?lobby=' + c);
        horchen();
        return true;
      });
    }).catch(function (e) {
      /* `still` heisst: das hier hat niemand angeklickt. Der Boot versucht den
         gemerkten Code aus dem letzten Besuch — schlaegt das fehl, ist das kein
         Fehler des Besuchers, und eine rote Leiste auf einer Seite, an der noch
         niemand etwas getan hat, ist Laerm. */
      if (!still) melde(fehlertext(e), 'fehler');
      weg('gb:lobby');
      return false;
    });
  }

  function verlassen() {
    var warCode = code, warGastgeber = ichBinGastgeber();
    abmelden();
    clearInterval(uhr); uhr = null;
    schliesseSchau();
    if (warCode && user && db) {
      if (warGastgeber) lobbyAufraeumen(warCode);
      else fb.deleteDoc(fb.doc(db, 'geobingo', warCode, 'spieler', user.uid)).catch(function () {});
    }
    code = null; lobby = null; spieler = {}; woerter = []; funde = {}; stimmen = {};
    pano = null;
    weg('gb:lobby');
    history.replaceState(null, '', location.pathname);
    bild = 'start';
    zeichne();
  }

  /*
   * Der Gastgeber nimmt die Lobby mit, wenn er geht.
   *
   * Firestore loescht beim Loeschen eines Dokuments seine Unter-Sammlungen
   * NICHT mit — das Lobby-Dokument waere weg, und Woerter, Spieler und Funde
   * lebten als verwaiste Pfade weiter. Also von Hand, von innen nach aussen.
   * Was das nicht abdeckt: ein abgestuerzter Browser. Dagegen hilft nur eine
   * Aufraeumregel in Firestore selbst, und die steht als Pflichtschritt in
   * docs/SETUP-MAPS.md.
   */
  function lobbyAufraeumen(c) {
    function leeren(pfad) {
      return fb.getDocs(fb.collection.apply(null, [db].concat(pfad))).then(function (q) {
        return Promise.all(q.docs.map(function (d) {
          return fb.deleteDoc(fb.doc.apply(null, [db].concat(pfad, [d.id]))).catch(function () {});
        }));
      }).catch(function () {});
    }
    return fundeLeeren(c)
      .then(function () { return Promise.all([leeren(['geobingo', c, 'woerter']), leeren(['geobingo', c, 'spieler'])]); })
      .then(function () { return fb.deleteDoc(fb.doc(db, 'geobingo', c)); })
      .catch(function () {});
  }

  /* Alle Funde samt Stimmen. Zuerst die Stimmen, dann die Funde — anders herum
     waeren die Stimmen unter einem geloeschten Fund nicht mehr auffindbar und
     blieben fuer immer stehen. */
  function fundeLeeren(c) {
    return fb.getDocs(fb.collection(db, 'geobingo', c, 'funde')).then(function (q) {
      return Promise.all(q.docs.map(function (d) {
        return fb.getDocs(fb.collection(db, 'geobingo', c, 'funde', d.id, 'stimmen')).then(function (sq) {
          return Promise.all(sq.docs.map(function (v) {
            return fb.deleteDoc(fb.doc(db, 'geobingo', c, 'funde', d.id, 'stimmen', v.id)).catch(function () {});
          }));
        }).then(function () {
          return fb.deleteDoc(fb.doc(db, 'geobingo', c, 'funde', d.id)).catch(function () {});
        });
      }));
    }).catch(function () {});
  }

  /*
   * Eine Fehlermeldung, die sagt, welcher Schalter fehlt.
   *
   * Zwei Dinge stehen hier, weil sie beim ersten Durchgang genau so schiefgingen:
   *
   *   * `admin-restricted-operation` gehoert dazu. Ist die anonyme Anmeldung in
   *     der Firebase-Konsole aus, antwortet Google mit ADMIN_ONLY_OPERATION, und
   *     das SDK macht daraus diesen Code — NICHT `operation-not-allowed`, was
   *     man erwarten wuerde und was hier zuerst allein stand. Ergebnis war „Das
   *     hat nicht geklappt" fuer ein Problem, dessen Loesung ein Haken ist.
   *   * Der Code haengt hinten dran, wenn nichts passt. Eine unbekannte
   *     Stoerung mit Namen ist eine, die man nachschlagen kann; „das hat nicht
   *     geklappt" ist eine Sackgasse, und genau daran hat sich diese Seite
   *     schon einmal aufgehalten.
   */
  function fehlertext(e) {
    var c = String((e && e.code) || e || '');
    if (/admin-restricted-operation|operation-not-allowed/.test(c)) return L.errAnonymAus;
    if (/permission-denied|insufficient/.test(c)) return L.errRegeln;
    if (/unavailable|network-request-failed|failed-precondition|deadline/.test(c)) return L.errNetz;
    var kurz = c.replace(/^(auth|firestore)\//, '');
    return kurz && kurz !== 'undefined' ? L.errAllgemein + ' (' + kurz + ')' : L.errAllgemein;
  }

  // ── Horcher ───────────────────────────────────────────────────────────────

  function horchen() {
    abmelden();

    abos.push(fb.onSnapshot(fb.doc(db, 'geobingo', code), function (s) {
      if (!s.exists()) { melde(L.lobbyWeg, 'fehler'); verlassen(); return; }
      var vorher = lobby && lobby.zustand;
      lobby = s.data();
      if (lobby.zustand !== vorher) uebergang(lobby.zustand);
      else auffrischen();
    }, function (e) { melde(fehlertext(e), 'fehler'); }));

    abos.push(fb.onSnapshot(fb.collection(db, 'geobingo', code, 'spieler'), function (q) {
      spieler = {};
      q.forEach(function (d) { spieler[d.id] = d.data(); });
      auffrischen();
    }));

    abos.push(fb.onSnapshot(fb.query(fb.collection(db, 'geobingo', code, 'woerter'), fb.orderBy('angelegt', 'asc')), function (q) {
      woerter = [];
      q.forEach(function (d) { var w = d.data(); woerter.push({ id: d.id, text: w.text, p: w.p, vonUid: w.vonUid }); });
      kartenNeuBauen = true;
      auffrischen();
    }));

    abos.push(fb.onSnapshot(fb.collection(db, 'geobingo', code, 'funde'), function (q) {
      funde = {};
      q.forEach(function (d) { funde[d.id] = d.data(); });
      if (bild === 'pruefung' || bild === 'ergebnis') stimmenHorchen();
      auffrischen();
    }));
  }

  /*
   * Ein Horcher je Fund, und der Eintrag in stimmAbos ist der Grund, warum das
   * gefahrlos mehrfach aufgerufen werden darf: die Funktion laeuft beim Wechsel
   * in die Auswertung UND noch einmal, sobald die Funde wirklich da sind. Was
   * davon zuerst kommt, haengt am Netz.
   */
  function stimmenHorchen() {
    for (var fid in funde) {
      if (stimmAbos[fid]) continue;
      stimmAbos[fid] = (function (id) {
        return fb.onSnapshot(fb.collection(db, 'geobingo', code, 'funde', id, 'stimmen'), function (q) {
          var s = {};
          q.forEach(function (d) { s[d.id] = d.data().v; });
          stimmen[id] = s;
          if (bild === 'pruefung' || bild === 'ergebnis') auffrischen();
        });
      })(fid);
    }
  }

  function uebergang(jetzt) {
    clearInterval(uhr); uhr = null;
    schliesseSchau();
    if (jetzt === 'lobby') { bild = 'lobby'; pano = null; kartenNeuBauen = true; zeichne(); return; }
    if (jetzt === 'laeuft') { bild = 'spiel'; kartenNeuBauen = true; zeichne(); starteRunde(); uhr = setInterval(tick, 250); return; }
    if (jetzt === 'pruefung') { bild = 'pruefung'; pano = null; stimmenHorchen(); zeichne(); return; }
    if (jetzt === 'ergebnis') { bild = 'ergebnis'; pano = null; zeichne(); return; }
  }

  /* Auffrischen heisst NIE neu bauen. Im Spiel wuerde das das Panorama
     wegwerfen, in der Auswertung das offene 3D-Fenster schliessen. */
  function auffrischen() {
    if (bild === 'spiel') { zeichneKarte(); zeichneSpielerleiste(); return; }
    zeichne();
  }

  // ── Die Runde ─────────────────────────────────────────────────────────────

  /*
   * Wann die Runde endet — oder null, solange das noch niemand weiss.
   *
   * `startAm` ist ein serverTimestamp, und Firestore meldet den ersten
   * Schnappschuss sofort zurueck, bevor der Server geantwortet hat. In diesem
   * Moment steht dort null. Gaebe diese Funktion dafuer 0 zurueck, waere die
   * Runde rechnerisch vor Jahrzehnten abgelaufen: die Uhr spraenge auf 0:00,
   * der Gastgeber schaltete sofort weiter, und kein Klick auf ein Wort ginge
   * durch. Deshalb null — der Unterschied zwischen „vorbei" und „noch nicht
   * bekannt".
   */
  function endeAm() {
    if (!lobby || !lobby.startAm || !lobby.startAm.toMillis) return null;
    return lobby.startAm.toMillis() + (lobby.einst.minuten * 60000);
  }

  function tick() {
    var ende = endeAm();
    if (ende === null) return;
    var rest = ende - Date.now();
    var u = document.getElementById('gbUhr');
    if (u) { u.textContent = zeit(rest); u.dataset.knapp = rest < 30000 ? '1' : '0'; }
    if (rest > 0) return;

    clearInterval(uhr); uhr = null;
    /* Nur der Gastgeber schaltet weiter. Schrieben acht Browser gleichzeitig
       dasselbe Feld, waere das Ergebnis dasselbe und sieben Schreibvorgaenge
       ueberfluessig — und die Regel muesste sie alle erlauben. */
    if (ichBinGastgeber()) fb.updateDoc(fb.doc(db, 'geobingo', code), { zustand: 'pruefung' }).catch(function () {});
    else melde(L.zeitUm, 'info');
  }

  function starteRunde() {
    var flaeche = document.getElementById('gbPano');
    if (!flaeche) return;

    maps().then(function () {
      return zufallsort(lobby.einst);
    }).then(function (ort) {
      var b = lobby.einst.bewegung;
      pano = new google.maps.StreetViewPanorama(flaeche, {
        pano: ort.pano,
        pov: { heading: Math.random() * 360, pitch: 0 },
        zoom: 1,
        // Ortsname und Adresse weg: das Spiel ist „finde das Ding", nicht
        // „lies das Strassenschild vor".
        addressControl: false,
        showRoadLabels: false,
        linksControl: b !== 'aus',
        clickToGo: b === 'frei',
        disableDoubleClickZoom: b !== 'frei',
        panControl: false,
        zoomControl: true,
        fullscreenControl: false,
        enableCloseButton: false,
        motionTracking: false,
        motionTrackingControl: false
      });
      // Nur wegraeumen, wenn Google nicht schon abgelehnt hat: sonst legt der
      // graue Kasten von Google die Flaeche frei, die gerade erklaeren sollte,
      // was fehlt.
      if (mapsAbgelehnt) return;
      var laden = document.getElementById('gbPanoLaden');
      if (laden) laden.remove();
    }).catch(function (e) {
      panoFehlerZeigen(String(e && e.message));
    });
  }

  /*
   * Der Klick auf ein Wort. Hier ist das Spiel.
   *
   * Die Dokumentkennung ist uid_wortId und damit fest: ein zweiter Klick auf
   * dasselbe Wort ueberschreibt den alten Fund, statt einen zweiten anzulegen.
   * Eine Kennung ist eine Tatsache, ein ausgegrauter Knopf ist ein Vorschlag.
   */
  function fangen(wortId) {
    if (!pano || !lobby || lobby.zustand !== 'laeuft') return;
    var ende = endeAm();
    if (ende !== null && Date.now() > ende) { melde(L.zeitUm, 'fehler'); return; }
    var w = wortVon(wortId);
    if (!w) return;

    var pov = pano.getPov(), pos = pano.getPosition();
    var f = {
      uid: user.uid, name: meinName(), team: meinTeam(),
      wortId: wortId, wortText: w.text,
      pano: pano.getPano(),
      heading: Math.round((pov.heading || 0) * 10) / 10,
      pitch: Math.round((pov.pitch || 0) * 10) / 10,
      fov: zoomZuFov(pano.getZoom()),
      lat: pos ? Math.round(pos.lat() * 1e6) / 1e6 : null,
      lng: pos ? Math.round(pos.lng() * 1e6) / 1e6 : null,
      angelegt: fb.serverTimestamp()
    };

    // Sofort anzeigen, ohne auf die Datenbank zu warten: bei laufender Uhr ist
    // eine Verzoegerung von 200 ms zwischen Klick und Bild der Unterschied
    // zwischen „reagiert" und „hakt".
    var fid = user.uid + '_' + wortId;
    funde[fid] = f;
    zeichneKarte();
    blitz();

    fb.setDoc(fb.doc(db, 'geobingo', code, 'funde', fid), f).catch(function (e) {
      delete funde[fid];
      zeichneKarte();
      melde(fehlertext(e), 'fehler');
    });
  }

  function loesen(wortId) {
    var fid = user.uid + '_' + wortId;
    delete funde[fid];
    zeichneKarte();
    fb.deleteDoc(fb.doc(db, 'geobingo', code, 'funde', fid)).catch(function () {});
  }

  function blitz() {
    var b = document.getElementById('gbBlitz');
    if (!b) return;
    b.dataset.da = '0';
    void b.offsetWidth;
    b.dataset.da = '1';
  }

  // ── Zeichnen ──────────────────────────────────────────────────────────────

  function zeichne() {
    if (bild === 'laden') { wurzel.innerHTML = mitteMeldung(L.laden, true); return; }
    if (bild === 'tor') { wurzel.innerHTML = torBild(); nachBau(); return; }
    if (bild === 'name') { wurzel.innerHTML = nameBild(); nachBau(); return; }
    if (bild === 'start') { wurzel.innerHTML = startBild(); nachBau(); return; }
    if (bild === 'lobby') { wurzel.innerHTML = lobbyBild(); nachBau(); return; }
    if (bild === 'spiel') {
      /*
       * Der Riegel vor dem Panorama. Wer hier ankommt, waehrend schon eines
       * laeuft, wollte fast sicher nur die Seitenleiste auffrischen — und
       * haette mit innerHTML das Panorama weggeworfen, ein neues bezahlt und
       * den Spieler an seinen Startpunkt zurueckgesetzt. Ein Kommentar an den
       * Aufrufern reicht dafuer nicht: es genuegt ein einziger kuenftiger, der
       * ihn nicht liest.
       */
      if (pano && document.getElementById('gbPano')) { zeichneKarte(); zeichneSpielerleiste(); return; }
      wurzel.innerHTML = spielBild();
      kartenNeuBauen = true;
      nachBau(); zeichneKarte(); zeichneSpielerleiste();
      return;
    }
    if (bild === 'pruefung') { wurzel.innerHTML = pruefungBild(); nachBau(); return; }
    if (bild === 'ergebnis') { wurzel.innerHTML = ergebnisBild(); nachBau(); return; }
  }

  function mitteMeldung(text, kreisel) {
    return '<div class="gb-mitte"><div class="gb-warten">'
      + (kreisel ? '<span class="gb-kreisel"></span>' : '') + esc(text) + '</div></div>';
  }

  function marke() {
    return '<div class="gb-marke"><span class="gb-auge"></span>GeoBingo</div>';
  }

  // ── Bildschirm: Zugangscode ───────────────────────────────────────────────

  function torBild() {
    return '<div class="gb-mitte"><div class="gb-tafel gb-schmal">'
      + marke()
      + '<h1>' + esc(L.torH) + '</h1>'
      + '<p class="gb-still">' + esc(L.torP) + '</p>'
      + '<form class="gb-reihe" data-tu="tor">'
      + '<input id="gbTor" type="password" autocomplete="off" spellcheck="false" placeholder="' + esc(L.torPlatz) + '" aria-label="' + esc(L.torH) + '">'
      + '<button class="gb-knopf gb-haupt" type="submit">' + esc(L.torAuf) + '</button>'
      + '</form>'
      + '<p class="gb-fussnote">' + esc(L.torHinweis) + '</p>'
      + '</div></div>';
  }

  // ── Bildschirm: Name ──────────────────────────────────────────────────────

  function nameBild() {
    return '<div class="gb-mitte"><div class="gb-tafel gb-schmal">'
      + marke()
      + '<h1>' + esc(L.nameH) + '</h1>'
      + '<p class="gb-still">' + esc(L.nameP) + '</p>'
      + '<form class="gb-reihe" data-tu="name">'
      + '<input id="gbName" maxlength="24" autocomplete="off" placeholder="' + esc(L.namePlatz) + '" value="' + esc(holen('gb:name') || '') + '" aria-label="' + esc(L.nameH) + '">'
      + '<button class="gb-knopf gb-haupt" type="submit">' + esc(L.weiter) + '</button>'
      + '</form>'
      + '</div></div>';
  }

  // ── Bildschirm: Start ─────────────────────────────────────────────────────

  /*
   * Die Startseite: ein Titel und darunter die Knoepfe, einer unter dem
   * anderen.
   *
   * Vorher standen „Neue Runde" und „Beitreten" als zwei Spalten
   * nebeneinander, und das las sich wie zwei gleichrangige Angebote. Es sind
   * aber keine zwei gleichrangigen: fast jeder, der hier ankommt, will
   * spielen, und nur wer einen Code vorgelesen bekommen hat, will das Feld.
   * Deshalb ein grosser Knopf und darunter die schmaleren — die Reihenfolge
   * IST die Aussage.
   *
   * Das Codefeld und der Lobby-Browser klappen erst auf Klick auf. Beide
   * dauerhaft zu zeigen hiesse, den Bildschirm mit dem zu fuellen, was die
   * Minderheit braucht.
   */
  function startBild() {
    var knopf = function (tu, text, extra) {
      return '<button class="gb-knopf gb-breit' + (extra || '') + '" data-tu="' + tu + '">' + esc(text) + '</button>';
    };

    return '<div class="gb-mitte"><div class="gb-heim">'
      + '<div class="gb-heimkopf">' + marke()
      + '<button class="gb-still-knopf" data-tu="umbenennen">' + esc(meinName()) + '</button></div>'

      + '<h1 class="gb-heimtitel">GeoBingo</h1>'
      + '<p class="gb-heimzeile">' + esc(L.heimZeile) + '</p>'

      + '<div class="gb-heimknoepfe">'
      + knopf('anlegen', L.jetztSpielen, ' gb-haupt gb-gross')
      + knopf('lobbys', L.lobbysDurchsuchen)
      + knopf('codeZeigen', L.mitCodeBeitreten)
      + (C.discord
        ? '<a class="gb-knopf gb-breit gb-discord" href="' + esc(C.discord) + '" target="_blank" rel="noopener noreferrer">'
          + '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.65 12.65 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/></svg>'
          + esc(L.discord) + '</a>'
        : '')
      + '</div>'

      + '<div class="gb-ausklapp" id="gbCodeBox" data-da="0">'
      + '<form class="gb-reihe" data-tu="beitreten">'
      + '<input id="gbCode" class="gb-codefeld" maxlength="5" autocomplete="off" spellcheck="false" placeholder="ABCDE" aria-label="' + esc(L.code) + '">'
      + '<button class="gb-knopf gb-haupt" type="submit">' + esc(L.beitreten) + '</button>'
      + '</form></div>'

      + '<div class="gb-ausklapp" id="gbLobbyBox" data-da="0"><div id="gbLobbyListe"></div></div>'
      + '</div></div>';
  }

  /*
   * Der Lobby-Browser.
   *
   * Sichtbar sind nur Lobbys, die ihr Gastgeber ausdruecklich auf „oeffentlich"
   * gestellt hat — und das ist keine Bequemlichkeit der Oberflaeche, sondern
   * eine Regel in der Datenbank: `allow list` verlangt
   * `resource.data.oeffentlich == true`, und eine Abfrage ohne diese
   * Einschraenkung wird abgewiesen. Eine private Lobby kann hier also nicht
   * auftauchen, auch nicht durch einen Fehler in dieser Datei.
   */
  function lobbysLaden() {
    var ziel = document.getElementById('gbLobbyListe');
    if (!ziel) return;
    ziel.innerHTML = '<div class="gb-warten"><span class="gb-kreisel"></span>' + esc(L.laden) + '</div>';

    anmelden().then(function () {
      return fb.getDocs(fb.query(
        fb.collection(db, 'geobingo'),
        fb.where('oeffentlich', '==', true),
        fb.limit(30),
      ));
    }).then(function (q) {
      var offen = [];
      q.forEach(function (d) { if (d.data().offen) offen.push({ code: d.id, d: d.data() }); });
      if (!offen.length) { ziel.innerHTML = '<p class="gb-fussnote">' + esc(L.keineLobbys) + '</p>'; return; }

      ziel.innerHTML = '<ul class="gb-lobbyliste">' + offen.map(function (l) {
        var e = l.d.einst || {};
        return '<li><button data-tu="beitretenAus" data-code="' + esc(l.code) + '">'
          + '<span class="gb-lobbycode">' + esc(l.code) + '</span>'
          + '<span class="gb-lobbyinfo">' + (e.minuten || '?') + ' ' + esc(L.min)
          + ' · ' + esc(bewegungName(e.bewegung))
          + ' · ' + esc(e.modus === 'teams' ? L.modTeams : L.modEinzeln) + '</span>'
          + '<span class="gb-lobbypfeil">&rsaquo;</span></button></li>';
      }).join('') + '</ul>';
    }).catch(function (e) {
      ziel.innerHTML = '<p class="gb-fussnote">' + esc(fehlertext(e)) + '</p>';
    });
  }

  function bewegungName(b) {
    return b === 'aus' ? L.bewAus : b === 'pfeile' ? L.bewPfeile : L.bewFrei;
  }

  /** Einen der beiden Ausklapp-Bereiche zeigen und den anderen schliessen. */
  function ausklappen(welcher) {
    var a = document.getElementById('gbCodeBox');
    var b = document.getElementById('gbLobbyBox');
    if (!a || !b) return;
    var ziel = welcher === 'code' ? a : b;
    var offen = ziel.dataset.da !== '1';
    a.dataset.da = '0'; b.dataset.da = '0';
    ziel.dataset.da = offen ? '1' : '0';
    if (offen && welcher === 'code') document.getElementById('gbCode').focus();
    if (offen && welcher === 'lobbys') lobbysLaden();
  }

  // ── Bildschirm: Lobby ─────────────────────────────────────────────────────

  /*
   * Der Einladelink — und warum er verdeckt ist.
   *
   * Er traegt beides: den Zugangscode der Seite UND den Lobby-Code. Wer ihn
   * bekommt, ist mit einem Klick drin, ohne irgendetwas abzutippen. Genau
   * deshalb ist er auf einem Stream das Gefaehrlichste auf dem Bildschirm:
   * einmal kurz sichtbar, und die ganze Twitch-Chat sitzt in der Lobby.
   *
   * Also steht er unscharf da, bis jemand ihn absichtlich aufdeckt, und
   * verdeckt sich nach 15 Sekunden von selbst wieder — Aufdecken ist ein
   * Handgriff, Zudecken darf keiner sein, den man vergisst. Kopieren geht die
   * ganze Zeit, ohne dass er je sichtbar wird; das ist der uebliche Weg.
   *
   * Der Lobby-Code daneben bekommt dieselbe Behandlung. Er ist dasselbe
   * Geheimnis in kurz, und einen davon zu verdecken und den anderen nicht,
   * waere ein Schloss neben einem offenen Fenster.
   */
  function einladeLink() {
    var u = location.origin + location.pathname + '?k=' + encodeURIComponent(C.zugang) + '&lobby=' + code;
    return u;
  }

  function geheim(wert, gross) {
    return '<button class="gb-geheim' + (gross ? ' gb-geheim-gross' : '') + '" data-geheim aria-expanded="false"'
      + ' title="' + esc(L.aufdeckenHinweis) + '">'
      + '<span class="gb-geheimwert">' + esc(wert) + '</span>'
      + '<span class="gb-geheimhinweis">' + esc(L.aufdecken) + '</span>'
      + '</button>';
  }

  function einladung() {
    return '<div class="gb-einladung">'
      + '<div class="gb-einladeteil"><span class="gb-etikett">' + esc(L.code) + '</span>'
      + geheim(code, true) + '</div>'
      + '<div class="gb-einladeteil gb-einladebreit"><span class="gb-etikett">' + esc(L.einladelink) + '</span>'
      + '<div class="gb-einladezeile">' + geheim(einladeLink(), false)
      + '<button class="gb-knopf gb-klein" data-tu="teilen">' + esc(L.linkKopieren) + '</button></div>'
      + '<span class="gb-einladefuss">' + esc(L.aufdeckenHinweis) + '</span></div>'
      + '</div>';
  }

  /*
   * Aufdecken, und nach 15 Sekunden wieder zu. Der Zeitgeber haengt am Element
   * selbst, damit zwei aufgedeckte Felder sich nicht gegenseitig die Uhr
   * ueberschreiben.
   */
  var geheimUhren = [];
  function geheimZeigen(el) {
    var auf = el.getAttribute('aria-expanded') !== 'true';
    el.setAttribute('aria-expanded', auf ? 'true' : 'false');
    for (var i = 0; i < geheimUhren.length; i++) {
      if (geheimUhren[i].el === el) { clearTimeout(geheimUhren[i].t); geheimUhren.splice(i, 1); break; }
    }
    if (!auf) return;
    geheimUhren.push({ el: el, t: setTimeout(function () {
      el.setAttribute('aria-expanded', 'false');
    }, 15000) });
  }

  function lobbyBild() {
    var e = lobby.einst;
    var gast = ichBinGastgeber();
    var aus = gast ? '' : ' disabled';

    var regionen = C.regionen.map(function (r) {
      var an = (e.regionen || []).indexOf(r.id) >= 0;
      return '<button class="gb-region" data-region="' + esc(r.id) + '" aria-pressed="' + an + '"' + aus + '>'
        + '<span class="gb-lampe"></span>' + esc(r.name) + '</button>';
    }).join('');

    var pakete = C.pakete.map(function (p) {
      return '<button class="gb-knopf gb-klein" data-paket="' + esc(p.id) + '" title="' + esc(p.beschreibung) + '">+ ' + esc(p.name) + '</button>';
    }).join('');

    return '<div class="gb-lobbyseite">'
      + '<header class="gb-lobbykopf">'
      + marke()
      + '<span class="gb-lobbytitel">' + esc(L.lobbyH) + '</span>'
      + '<button class="gb-knopf gb-klein" data-tu="verlassen">' + esc(L.verlassen) + '</button>'
      + '</header>'
      /*
       * Das Einladeband steht ueber allem anderen und ueber die ganze Breite.
       *
       * In der Kopfzeile gequetscht zwischen Marke und Verlassen-Knopf war es
       * genau das, was man als Erstes braucht und am schwersten fand. Wer eine
       * Lobby aufmacht, will als naechstes Leute hereinholen — nicht Woerter
       * tippen.
       */
      + '<section class="gb-band">' + einladung() + '</section>'

      + '<div class="gb-lobbygitter">'

      // ── Wörter ──
      + '<section class="gb-tafel">'
      + '<h2>' + esc(L.woerterH) + '<span class="gb-zahl">' + woerter.length + '</span></h2>'
      + '<p class="gb-tafelzeile">' + esc(L.woerterP) + '</p>'
      + '<form class="gb-wortform" data-tu="wort">'
      + '<input id="gbWort" maxlength="40" autocomplete="off" placeholder="' + esc(L.wortPlatz) + '">'
      + '<div class="gb-punktwahl" role="group" aria-label="' + esc(L.punkte) + '">'
      + [1, 2, 3].map(function (n) {
        return '<button type="button" data-punkte="' + n + '" aria-pressed="' + (n === 1) + '">' + n + '</button>';
      }).join('')
      + '</div>'
      + '<button class="gb-knopf gb-haupt" type="submit">' + esc(L.hinzu) + '</button>'
      + '</form>'
      + '<div class="gb-paketzeile"><span class="gb-etikett">' + esc(L.paketeH) + '</span>' + pakete
      + (woerter.length ? '<button class="gb-knopf gb-klein gb-gefahr" data-tu="alleWeg">' + esc(L.alleWeg) + '</button>' : '')
      + '</div>'
      + '<ul class="gb-wortliste">'
      + (woerter.length
        ? woerter.map(function (w) {
          return '<li><span class="gb-punktmarke gb-p' + w.p + '">' + w.p + '</span>'
            + '<span class="gb-wortname">' + esc(w.text) + '</span>'
            + '<button class="gb-weg" data-weg="' + esc(w.id) + '" aria-label="' + esc(L.entfernen) + '">&times;</button></li>';
        }).join('')
        : '<li class="gb-leerzeile">' + esc(L.keineWoerter) + '</li>')
      + '</ul>'
      + '</section>'

      // ── Einstellungen ──
      + '<section class="gb-tafel">'
      + '<h2>' + esc(L.einstellungenH) + '</h2>'
      + '<p class="gb-tafelzeile">' + esc(L.einstellungenP) + '</p>'

      + '<div class="gb-stellwerk">'
      + '<label class="gb-etikett" for="gbMinuten">' + esc(L.dauer) + '</label>'
      + '<div class="gb-drehregler">'
      + '<button class="gb-tick" data-min="-5"' + aus + ' aria-label="-5">&minus;5</button>'
      + '<button class="gb-tick" data-min="-1"' + aus + ' aria-label="-1">&minus;</button>'
      + '<div class="gb-anzeige"><input id="gbMinuten" type="number" min="1" max="90" value="' + e.minuten + '"' + aus + '><span>' + esc(L.min) + '</span></div>'
      + '<button class="gb-tick" data-min="1"' + aus + ' aria-label="+1">+</button>'
      + '<button class="gb-tick" data-min="5"' + aus + ' aria-label="+5">+5</button>'
      + '</div></div>'

      + '<div class="gb-stellwerk">'
      + '<span class="gb-etikett">' + esc(L.bewegung) + '</span>'
      + '<div class="gb-schalterbank" role="group">'
      + [['frei', L.bewFrei], ['pfeile', L.bewPfeile], ['aus', L.bewAus]].map(function (b) {
        return '<button data-bewegung="' + b[0] + '" aria-pressed="' + (e.bewegung === b[0]) + '"' + aus + '>' + esc(b[1]) + '</button>';
      }).join('')
      + '</div>'
      + kostenzeile()
      + '<p class="gb-fussnote">' + esc(L.bewegungHinweis) + '</p></div>'

      + '<div class="gb-stellwerk">'
      + '<span class="gb-etikett">' + esc(L.modus) + '</span>'
      + '<div class="gb-schalterbank" role="group">'
      + [['einzeln', L.modEinzeln], ['teams', L.modTeams]].map(function (m) {
        return '<button data-modus="' + m[0] + '" aria-pressed="' + (e.modus === m[0]) + '"' + aus + '>' + esc(m[1]) + '</button>';
      }).join('')
      + '</div></div>'

      + '<div class="gb-kippen">'
      + kippschalter('nurStaedte', L.nurStaedte, e.nurStaedte, aus, L.nurStaedteHinweis)
      + kippschalter('punkteZeigen', L.punkteZeigen, e.punkteZeigen, aus, L.punkteZeigenHinweis)
      + kippschalter('oeffentlich', L.oeffentlich, lobby.oeffentlich, aus, L.oeffentlichHinweis)
      + '</div>'

      + '<div class="gb-stellwerk">'
      + '<span class="gb-etikett">' + esc(L.regionenH) + '<span class="gb-zahl">' + (e.regionen || []).length + '</span></span>'
      + '<div class="gb-regionen">' + regionen + '</div>'
      + (gast ? '<div class="gb-reihe gb-luft">'
        + '<button class="gb-knopf gb-klein" data-tu="alleRegionen">' + esc(L.alleAn) + '</button>'
        + '<button class="gb-knopf gb-klein" data-tu="keineRegionen">' + esc(L.alleAus) + '</button></div>' : '')
      + '</div>'
      + '</section>'

      // ── Spieler ──
      + '<section class="gb-tafel gb-startTafel">'
      + '<h2>' + esc(L.spielerH) + '<span class="gb-zahl">' + spielerZahl() + '</span></h2>'
      + '<p class="gb-tafelzeile">' + esc(L.spielerP) + '</p>'
      + spielerListe(true)
      + (gast
        ? '<button class="gb-knopf gb-haupt gb-breit gb-luft" data-tu="los"' + (woerter.length < 1 || !(e.regionen || []).length ? ' disabled' : '') + '>' + esc(L.losGehts) + '</button>'
          + (woerter.length < 1 ? '<p class="gb-fussnote">' + esc(L.brauchtWort) + '</p>' : '')
          + (!(e.regionen || []).length ? '<p class="gb-fussnote">' + esc(L.brauchtRegion) + '</p>' : '')
        : '<p class="gb-fussnote gb-luft">' + esc(L.wartetAufGastgeber) + '</p>')
      + '</section>'

      + '</div></div>';
  }

  /*
   * Was diese Runde kostet, BEVOR sie startet.
   *
   * Google rechnet dynamisches Street View pro Panorama ab, und der
   * Unterschied zwischen den Bewegungsarten ist keine Nuance, sondern der
   * Faktor achtzig. Wer das erst auf der Monatsrechnung sieht, hat keine
   * Wahl mehr gehabt — deshalb steht die Schaetzung dort, wo die Entscheidung
   * getroffen wird.
   *
   * Die Zahlen sind grob und sagen das auch. Sie muessen nicht stimmen, sie
   * muessen die Groessenordnung treffen: eine Runde auf „Frei" ist kein
   * bisschen teurer als eine auf „Fest", sie ist zweistellig teurer.
   */
  function panoramenSchaetzung(bewegung, minuten, spieler) {
    var jeSpieler = bewegung === 'aus' ? 1
      : bewegung === 'pfeile' ? 1 + minuten * 2
      : 1 + minuten * 8;
    return Math.round(jeSpieler * Math.max(1, spieler));
  }

  function kostenzeile() {
    if (!C.kontingent || !C.kontingent.panoramenProTag) return '';
    var e = lobby.einst;
    var n = panoramenSchaetzung(e.bewegung, e.minuten || 10, spielerZahl());
    var deckel = C.kontingent.panoramenProTag;
    var zuViel = n > deckel;
    return '<p class="gb-kosten" data-warnung="' + (zuViel ? '1' : '0') + '">'
      + '<strong>' + n + '</strong> ' + esc(L.panoramen)
      + ' <span>' + esc(L.vonTageskontingent.replace('%n', deckel)) + '</span>'
      + (zuViel ? '<em>' + esc(L.ueberKontingent) + '</em>' : '')
      + '</p>';
  }

  function kippschalter(name, beschriftung, an, aus, hinweis) {
    return '<div class="gb-kipp"><button class="gb-kippknopf" data-kipp="' + name + '" aria-pressed="' + !!an + '"' + aus + '>'
      + '<span class="gb-schieber"></span></button>'
      + '<span class="gb-kipptext"><strong>' + esc(beschriftung) + '</strong>'
      + (hinweis ? '<em>' + esc(hinweis) + '</em>' : '') + '</span></div>';
  }

  function spielerListe(inLobby) {
    var uids = Object.keys(spieler);
    if (!uids.length) return '<p class="gb-fussnote">' + esc(L.niemandDa) + '</p>';
    var teams = teamsAn();
    var tabelle = {};
    if (!inLobby) { var s = stand(); for (var i = 0; i < s.length; i++) tabelle[s[i].uid] = s[i]; }

    uids.sort(function (x, y) {
      if (teams) { var t = (spieler[x].team || 'a').localeCompare(spieler[y].team || 'a'); if (t) return t; }
      return String(spieler[x].name).localeCompare(String(spieler[y].name));
    });

    return '<ul class="gb-spielerliste">' + uids.map(function (uid) {
      var p = spieler[uid];
      var ich = user && uid === user.uid;
      return '<li' + (ich ? ' data-ich="1"' : '') + '>'
        + (teams ? '<span class="gb-teammarke gb-team' + esc(p.team || 'a') + '">' + esc((p.team || 'a').toUpperCase()) + '</span>' : '<span class="gb-lampe gb-an"></span>')
        + '<span class="gb-spielername">' + esc(p.name) + (uid === lobby.host ? '<em>' + esc(L.gastgeber) + '</em>' : '') + '</span>'
        + (inLobby && teams && ich ? '<button class="gb-knopf gb-winzig" data-tu="teamwechsel">' + esc(L.teamWechseln) + '</button>' : '')
        + (!inLobby && tabelle[uid] ? '<span class="gb-punktzahl">' + tabelle[uid].punkte + '</span>' : '')
        + '</li>';
    }).join('') + '</ul>';
  }

  // ── Bildschirm: Spiel ─────────────────────────────────────────────────────

  /*
   * Die Buehne: Panorama im Vollbild, eine Leiste oben, zwei Kaesten an den
   * Seiten. Kein Balken unten mehr — er trug einen Hinweistext, den nach der
   * ersten Runde niemand mehr liest, und nahm dem Panorama Bildhoehe weg.
   *
   * Der rechte Kasten hat eine Klappe, und die ist keine Spielerei: sie ist
   * der einzige Weg, verdeckt gegeneinander zu spielen, ohne dass der
   * Gastgeber vorher „Punkte live zeigen" ausgeschaltet haben muss. Wer sie
   * zuklappt, sieht seinen eigenen Stand trotzdem nicht — das ist Absicht.
   */
  function spielBild() {
    return '<div class="gb-buehne" data-hud="' + (hudAus ? '0' : '1') + '">'
      + '<div id="gbPano" class="gb-pano"></div>'
      + '<div id="gbBlitz" class="gb-blitz" data-da="0" aria-hidden="true"></div>'
      + '<div id="gbPanoLaden" class="gb-panoladen"><span class="gb-kreisel"></span>' + esc(L.suchtOrt) + '</div>'

      + '<div class="gb-leiste">'
      + '<div class="gb-leistelinks"><span id="gbUhr" class="gb-uhr" data-knapp="0">--:--</span></div>'
      + '<div class="gb-leistemitte">' + marke() + '</div>'
      + '<div class="gb-leisterechts">'
      /*
       * „Runde beenden" nur beim Gastgeber, und mit Rueckfrage.
       *
       * Er sitzt direkt neben dem Verlassen-Kreuz, waehrend eine Uhr laeuft und
       * jemand gerade ein Wort anklicken will. Ein Fehlgriff wuerde allen die
       * laufende Runde wegnehmen — deshalb fragt er nach, und zwar in der
       * Leiste selbst statt in einem Fenster, das den Blick aufs Panorama
       * nimmt.
       */
      + (ichBinGastgeber()
        ? '<button class="gb-knopf gb-klein" data-tu="beenden" id="gbBeenden">' + esc(L.rundeBeenden) + '</button>'
        : '')
      + '<button class="gb-icon" data-tu="hud" title="' + esc(L.hudAus) + '" aria-label="' + esc(L.hudAus) + '">&#9114;</button>'
      + '<button class="gb-icon" data-tu="verlassen" title="' + esc(L.verlassen) + '" aria-label="' + esc(L.verlassen) + '">&times;</button>'
      + '</div></div>'

      + '<aside class="gb-kasten gb-links" id="gbKastenLinks" data-zu="0">'
      + '<div class="gb-kastenkopf">' + esc(L.deineKarte)
      + '<span id="gbFortschritt" class="gb-zahl">0 / 0</span>'
      + '<button class="gb-klappe" data-klapp="gbKastenLinks" aria-label="' + esc(L.einklappen) + '" title="' + esc(L.einklappen) + '">&#9650;</button>'
      + '</div>'
      + '<div class="gb-kastenleib"><div id="gbKarte" class="gb-karte"></div></div></aside>'

      + '<aside class="gb-kasten gb-rechts" id="gbKastenRechts" data-zu="' + (spielerAus ? '1' : '0') + '">'
      + '<div class="gb-kastenkopf">' + esc(L.spielerH)
      + '<span class="gb-zahl">' + spielerZahl() + '</span>'
      + '<button class="gb-klappe" data-klapp="gbKastenRechts" aria-label="' + esc(L.einklappen) + '" title="' + esc(L.einklappen) + '">&#9650;</button>'
      + '</div>'
      + '<div class="gb-kastenleib" id="gbSpielerleiste"></div></aside>'
      + '</div>';
  }

  /*
   * Die Karte wird geflickt, nicht neu geschrieben.
   *
   * `kartenNeuBauen` steht nur, wenn sich die WORTLISTE geaendert hat. Alles
   * andere — ein Fund kommt, ein Fund geht — schaltet an bestehenden Knoepfen
   * nur Zustaende um. Das ist kein Feinschliff: jedes ersetzte <img> ist ein
   * neuer Abruf der Static API, also eine Rechnungszeile fuer ein Bild, das
   * schon im Browser lag.
   */
  var kartenNeuBauen = true;
  var kartenKnoepfe = {};

  function zeichneKarte() {
    var ziel = document.getElementById('gbKarte');
    if (!ziel) return;

    if (kartenNeuBauen) {
      ziel.textContent = '';
      kartenKnoepfe = {};
      if (!woerter.length) {
        ziel.appendChild(el('p', 'gb-fussnote', L.keineWoerter));
      } else {
        for (var i = 0; i < woerter.length; i++) {
          var w = woerter[i];
          var b = el('button', 'gb-wortknopf');
          b.dataset.wort = w.id;
          b.dataset.gefunden = '0';
          var nummer = el('span', 'gb-nummer', i < 9 ? String(i + 1) : '');
          var bildchen = el('span', 'gb-bildchen');
          var name = el('span', 'gb-wortname', w.text);
          var punkte = el('span', 'gb-punktmarke gb-p' + w.p, String(w.p));
          b.appendChild(nummer); b.appendChild(bildchen); b.appendChild(name); b.appendChild(punkte);
          ziel.appendChild(b);
          kartenKnoepfe[w.id] = { knopf: b, bild: bildchen, pano: null };
        }
      }
      kartenNeuBauen = false;
    }

    var gefunden = 0;
    for (var id in kartenKnoepfe) {
      var eintrag = kartenKnoepfe[id];
      var f = funde[(user ? user.uid : '') + '_' + id];
      if (f) {
        gefunden++;
        eintrag.knopf.dataset.gefunden = '1';
        // Nur wenn sich das Panorama wirklich geaendert hat. Sonst haette jeder
        // Schnappschuss dasselbe Bild noch einmal geholt.
        if (eintrag.pano !== f.pano + '|' + f.heading + '|' + f.pitch + '|' + f.fov) {
          eintrag.pano = f.pano + '|' + f.heading + '|' + f.pitch + '|' + f.fov;
          eintrag.bild.style.backgroundImage = 'url("' + bildAdresse(f, 160, 100) + '")';
        }
      } else if (eintrag.knopf.dataset.gefunden === '1') {
        eintrag.knopf.dataset.gefunden = '0';
        eintrag.pano = null;
        eintrag.bild.style.backgroundImage = '';
      }
    }

    var fs = document.getElementById('gbFortschritt');
    if (fs) fs.textContent = gefunden + ' / ' + woerter.length;
  }

  function zeichneSpielerleiste() {
    var ziel = document.getElementById('gbSpielerleiste');
    if (!ziel) return;
    var zeigen = !lobby || !lobby.einst || lobby.einst.punkteZeigen !== false;
    ziel.innerHTML = zeigen
      ? spielerListe(false)
      : '<p class="gb-fussnote">' + esc(L.punkteVersteckt) + '</p>' + spielerListe(true).replace(/<span class="gb-punktzahl">.*?<\/span>/g, '');
  }

  // ── Bildschirm: Auswertung ────────────────────────────────────────────────

  function pruefungBild() {
    var proWort = {};
    for (var fid in funde) (proWort[funde[fid].wortId] || (proWort[funde[fid].wortId] = [])).push([fid, funde[fid]]);

    var bloecke = woerter.map(function (w) {
      var liste = proWort[w.id] || [];
      if (!liste.length) return '';
      return '<section class="gb-pruefblock"><h3><span class="gb-punktmarke gb-p' + w.p + '">' + w.p + '</span>' + esc(w.text) + '</h3>'
        + '<div class="gb-belege">' + liste.map(function (paar) {
          var id = paar[0], f = paar[1], z = zaehlung(id);
          var meine = (stimmen[id] || {})[user.uid];
          var eigen = f.uid === user.uid;
          return '<figure class="gb-beleg" data-gilt="' + (z.gilt ? '1' : '0') + '">'
            + '<button class="gb-belegbild" data-schau="' + esc(id) + '" title="' + esc(L.in3d) + '"'
            + ' style="background-image:url(&quot;' + bildAdresse(f, 400, 250) + '&quot;)">'
            + '<span class="gb-3d">' + esc(L.in3dKurz) + '</span></button>'
            + '<figcaption>'
            + '<span class="gb-wer">' + (teamsAn() ? '<span class="gb-teammarke gb-team' + esc(f.team || 'a') + '">' + esc((f.team || 'a').toUpperCase()) + '</span>' : '') + esc(f.name) + '</span>'
            + '<span class="gb-daumen">'
            + '<button data-ja="' + esc(id) + '" aria-pressed="' + (meine === 1) + '"' + (eigen ? ' disabled' : '') + ' title="' + esc(L.daumenHoch) + '">&#128077; ' + z.ja + '</button>'
            + '<button data-nein="' + esc(id) + '" aria-pressed="' + (meine === -1) + '"' + (eigen ? ' disabled' : '') + ' title="' + esc(L.daumenRunter) + '">&#128078; ' + z.nein + '</button>'
            + '</span></figcaption></figure>';
        }).join('') + '</div></section>';
    }).join('');

    return '<div class="gb-blattseite">'
      + '<header class="gb-lobbykopf">' + marke()
      + '<div><h1>' + esc(L.pruefungH) + '</h1><p class="gb-still">' + esc(L.pruefungP) + '</p></div>'
      + (ichBinGastgeber()
        ? '<button class="gb-knopf gb-haupt" data-tu="auswerten">' + esc(L.auswerten) + '</button>'
        : '<span class="gb-fussnote">' + esc(L.wartetAufGastgeber) + '</span>')
      + '</header>'
      + (bloecke || '<div class="gb-tafel gb-schmal"><p class="gb-still">' + esc(L.nichtsGefunden) + '</p></div>')
      + '</div>';
  }

  // ── Bildschirm: Ergebnis ──────────────────────────────────────────────────

  function ergebnisBild() {
    var inhalt;
    if (teamsAn()) {
      var t = teamStand();
      inhalt = '<div class="gb-teamgitter">' + t.map(function (z, i) {
        return '<div class="gb-teamtafel gb-team' + esc(z.id) + '"' + (i === 0 ? ' data-sieger="1"' : '') + '>'
          + '<span class="gb-etikett">' + esc(L.team) + ' ' + esc(z.id.toUpperCase()) + '</span>'
          + '<strong class="gb-grosszahl">' + z.punkte + '</strong>'
          + '<ul>' + z.wer.map(function (s) {
            return '<li>' + esc(s.name) + '<span>' + s.punkte + '</span></li>';
          }).join('') + '</ul></div>';
      }).join('') + '</div>';
    } else {
      inhalt = '<ol class="gb-rangliste">' + stand().map(function (s, i) {
        return '<li data-platz="' + (i + 1) + '"><span class="gb-platz">' + (i + 1) + '</span>'
          + '<span class="gb-wer">' + esc(s.name) + '</span>'
          + '<span class="gb-still">' + s.funde + ' ' + esc(L.funde) + '</span>'
          + '<span class="gb-punktzahl">' + s.punkte + '</span></li>';
      }).join('') + '</ol>';
    }

    return '<div class="gb-blattseite">'
      + '<header class="gb-lobbykopf">' + marke()
      + '<h1>' + esc(L.ergebnisH) + '</h1>'
      + '<div class="gb-reihe">'
      + (ichBinGastgeber() ? '<button class="gb-knopf gb-haupt" data-tu="nochmal">' + esc(L.nochmal) + '</button>' : '')
      + '<button class="gb-knopf" data-tu="zurueckZurPruefung">' + esc(L.bilderAnsehen) + '</button>'
      + '<button class="gb-knopf" data-tu="verlassen">' + esc(L.verlassen) + '</button>'
      + '</div></header>'
      + '<div class="gb-tafel">' + inhalt + '</div>'
      + '</div>';
  }

  // ── Das 3D-Fenster der Auswertung ─────────────────────────────────────────

  /*
   * Erst auf Klick, und mit EINEM wiederverwendeten Panorama.
   *
   * Jedes geoeffnete Panorama ist eine Rechnungszeile. Wuerden alle Funde von
   * selbst in 3D stehen, kostete das Aufschlagen der Auswertung so viel wie
   * eine ganze Runde. Wer hinsehen will, klickt — und wer durchklickt,
   * bekommt dasselbe Panorama umgesetzt statt eines neuen Objekts.
   */
  function schau(fid) {
    var f = funde[fid];
    if (!f) return;
    var fenster = document.getElementById('gbSchau');
    if (!fenster) {
      fenster = el('div', 'gb-schau');
      fenster.id = 'gbSchau';
      fenster.innerHTML = '<div class="gb-schaukopf"><span id="gbSchauText"></span>'
        + '<button class="gb-icon" data-tu="schauZu" aria-label="' + esc(L.schliessen) + '">&times;</button></div>'
        + '<div id="gbSchauPano" class="gb-schaupano"></div>';
      document.body.appendChild(fenster);
    }
    document.getElementById('gbSchauText').textContent = f.wortText + ' — ' + f.name;
    fenster.dataset.da = '1';

    maps().then(function () {
      var pov = { heading: f.heading, pitch: f.pitch };
      var zoom = Math.log(180 / f.fov) / Math.log(2);
      if (!schauPano) {
        schauPano = new google.maps.StreetViewPanorama(document.getElementById('gbSchauPano'), {
          pano: f.pano, pov: pov, zoom: zoom,
          addressControl: false, showRoadLabels: false,
          linksControl: true, clickToGo: true,
          fullscreenControl: false, motionTracking: false, motionTrackingControl: false,
          enableCloseButton: false
        });
      } else {
        schauPano.setPano(f.pano);
        schauPano.setPov(pov);
        schauPano.setZoom(zoom);
      }
    }).catch(function () { melde(L.kartenFehlerP, 'fehler'); });
  }

  function schliesseSchau() {
    var f = document.getElementById('gbSchau');
    if (f) f.dataset.da = '0';
  }

  // ── Ereignisse ────────────────────────────────────────────────────────────

  /*
   * Ein Horcher auf dem Dokument statt einer pro Knopf. Die Karte und die
   * Spielerleiste werden staendig geflickt; Horcher an ersetzten Knoepfen
   * waeren jedes Mal weg, und der zweite Klick taete nichts.
   */
  var punkteWahl = 1;
  var gebunden = false;

  function nachBau() {
    binde();
    var erstes = wurzel.querySelector('#gbTor, #gbName, #gbWort, #gbCode');
    if (erstes) erstes.focus();
  }

  function binde() {
    if (gebunden) return;
    gebunden = true;

    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-tu],[data-wort],[data-weg],[data-paket],[data-region],[data-kipp],[data-bewegung],[data-modus],[data-min],[data-punkte],[data-ja],[data-nein],[data-schau],[data-klapp],[data-code],[data-geheim]');
      if (!t) return;
      var d = t.dataset;

      if (d.wort) { ev.preventDefault(); if (d.gefunden === '1') loesen(d.wort); else fangen(d.wort); return; }
      if (t.hasAttribute('data-geheim')) { geheimZeigen(t); return; }
      if (d.klapp) { klappen(d.klapp); return; }
      if (d.code && d.tu === 'beitretenAus') { beitreten(d.code); return; }
      if (d.schau) { schau(d.schau); return; }
      if (d.ja) { stimmeAb(d.ja, 1); return; }
      if (d.nein) { stimmeAb(d.nein, -1); return; }
      if (d.weg) { schreibe(fb.deleteDoc(fb.doc(db, 'geobingo', code, 'woerter', d.weg))); return; }
      if (d.paket) { paketDazu(d.paket); return; }
      if (d.punkte) {
        punkteWahl = parseInt(d.punkte, 10);
        var alle = wurzel.querySelectorAll('[data-punkte]');
        for (var i = 0; i < alle.length; i++) alle[i].setAttribute('aria-pressed', String(alle[i].dataset.punkte === d.punkte));
        return;
      }
      if (d.region) { regionKippen(d.region); return; }
      if (d.kipp) {
        /* `oeffentlich` steht als oberstes Feld auf dem Lobby-Dokument und
           nicht unter `einst`. Nicht aus Ordnungsliebe: die Regel fuer `list`
           prueft `resource.data.oeffentlich`, und verschachtelte Felder sind
           dort nicht abfragbar. */
        if (d.kipp === 'oeffentlich') { oeffentlichKippen(); return; }
        einstellen(d.kipp, !(lobby.einst[d.kipp]));
        return;
      }
      if (d.bewegung) { einstellen('bewegung', d.bewegung); return; }
      if (d.modus) { einstellen('modus', d.modus); return; }
      if (d.min) { minutenAendern(parseInt(d.min, 10)); return; }

      var tu = d.tu;
      if (tu === 'anlegen') lobbyStarten();
      else if (tu === 'teilen') teilen();
      else if (tu === 'verlassen') verlassen();
      else if (tu === 'los') losGehts();
      else if (tu === 'hud') hudKippen();
      else if (tu === 'beenden') rundeBeenden();
      else if (tu === 'auswerten') schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), { zustand: 'ergebnis' }));
      else if (tu === 'nochmal') nochmal();
      else if (tu === 'zurueckZurPruefung') schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), { zustand: 'pruefung' }));
      else if (tu === 'schauZu') schliesseSchau();
      else if (tu === 'codeZeigen') ausklappen('code');
      else if (tu === 'lobbys') ausklappen('lobbys');
      else if (tu === 'umbenennen') { bild = 'name'; zeichne(); }
      else if (tu === 'teamwechsel') teamWechseln();
      else if (tu === 'alleRegionen') einstellen('regionen', C.regionen.map(function (r) { return r.id; }));
      else if (tu === 'keineRegionen') einstellen('regionen', []);
      else if (tu === 'alleWeg') alleWoerterWeg();
    });

    document.addEventListener('submit', function (ev) {
      var f = ev.target.closest('form[data-tu]');
      if (!f) return;
      ev.preventDefault();
      var tu = f.dataset.tu;
      if (tu === 'tor') torPruefen();
      else if (tu === 'name') nameSetzen();
      else if (tu === 'beitreten') beitreten(document.getElementById('gbCode').value);
      else if (tu === 'wort') wortDazu();
    });

    document.addEventListener('change', function (ev) {
      if (ev.target.id === 'gbMinuten') {
        var n = Math.max(1, Math.min(90, parseInt(ev.target.value, 10) || 1));
        ev.target.value = n;
        einstellen('minuten', n);
      }
    });

    /*
     * Zifferntasten fuer die ersten neun Woerter, H fuer das HUD.
     *
     * Bei laufender Uhr ist der Weg Maus → Seitenleiste → zurueck ins Bild
     * teuer, und das Ding, das man gesehen hat, ist dann oft nicht mehr im
     * Bild. Genau dafuer stehen die Nummern auf den Kacheln.
     */
    document.addEventListener('keydown', function (ev) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      if (ev.key === 'Escape') { schliesseSchau(); return; }
      if (bild !== 'spiel') return;
      if (ev.key === 'h' || ev.key === 'H') { ev.preventDefault(); hudKippen(); return; }
      var n = '123456789'.indexOf(ev.key);
      if (n < 0 || !woerter[n]) return;
      ev.preventDefault();
      if (funde[user.uid + '_' + woerter[n].id]) loesen(woerter[n].id); else fangen(woerter[n].id);
    });
  }

  /** Ein Schreibvorgang, dessen einzige Reaktion im Fehlerfall die Meldung ist. */
  function schreibe(versprechen) {
    return versprechen.catch(function (e) { melde(fehlertext(e), 'fehler'); });
  }

  /*
   * Vorzeitig beenden — zweistufig.
   *
   * Der erste Klick faerbt den Knopf und wartet vier Sekunden; der zweite
   * schaltet wirklich um. Wer daneben greift, verliert nichts und muss nichts
   * wegklicken: der Knopf faellt von selbst in seinen Ruhezustand zurueck.
   */
  var beendenScharf = null;
  function rundeBeenden() {
    if (!ichBinGastgeber()) return;
    var k = document.getElementById('gbBeenden');
    if (!k) return;
    if (!beendenScharf) {
      k.dataset.scharf = '1';
      k.textContent = L.wirklichBeenden;
      beendenScharf = setTimeout(function () {
        beendenScharf = null;
        k.dataset.scharf = '0';
        k.textContent = L.rundeBeenden;
      }, 4000);
      return;
    }
    clearTimeout(beendenScharf);
    beendenScharf = null;
    schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), { zustand: 'pruefung' }));
  }

  function hudKippen() {
    hudAus = !hudAus;
    var b = wurzel.querySelector('.gb-buehne');
    if (b) b.dataset.hud = hudAus ? '0' : '1';
  }

  /* Auf- und zuklappen, ohne irgendetwas neu zu zeichnen — das Panorama
     ueberlebt es damit unangetastet. */
  function klappen(id) {
    var k = document.getElementById(id);
    if (!k) return;
    var zu = k.dataset.zu !== '1';
    k.dataset.zu = zu ? '1' : '0';
    if (id === 'gbKastenRechts') { spielerAus = zu; legen('gb:spieler-zu', zu ? '1' : '0'); }
  }

  // ── Handlungen ────────────────────────────────────────────────────────────

  function torPruefen() {
    var wert = document.getElementById('gbTor').value;
    if (!schluesselGleich(wert, C.zugang)) { melde(L.torFalsch, 'fehler'); return; }
    legen('gb:zutritt', '1');
    weiterNachTor();
  }

  function weiterNachTor() {
    bild = holen('gb:name') ? 'start' : 'name';
    zeichne();
    if (bild === 'start') lobbyAusAdresse();
  }

  function nameSetzen() {
    var n = String(document.getElementById('gbName').value || '').trim().slice(0, 24);
    if (n.length < 2) { melde(L.nameZuKurz, 'fehler'); return; }
    legen('gb:name', n);
    // Steht der Name schon in einer Lobby, muss er dort mitwandern.
    if (code && user) schreibe(fb.setDoc(fb.doc(db, 'geobingo', code, 'spieler', user.uid), { name: n }, { merge: true }));
    bild = code ? 'lobby' : 'start';
    zeichne();
    if (!code) lobbyAusAdresse();
  }

  /*
   * Der Unterschied zwischen „jemand hat einen Einladelink geoeffnet" und
   * „hier lag noch ein Code vom letzten Mal", und er ist wichtiger als er
   * aussieht.
   *
   * Steht der Code in der Adresse, ist das eine Absicht: jemand hat einen Link
   * bekommen und angeklickt. Geht das schief — Lobby aufgeloest, Runde laeuft
   * schon —, MUSS die Seite das sagen. Vorher liefen beide Faelle still, und
   * wer einem Einladelink folgte, landete kommentarlos auf der Startseite und
   * hielt das Spiel fuer kaputt.
   *
   * Der gemerkte Code aus dem letzten Besuch bleibt still: danach hat niemand
   * gefragt, und eine rote Leiste auf einer Seite, an der noch niemand etwas
   * getan hat, ist Laerm.
   */
  function lobbyAusAdresse() {
    var ausAdresse = new URLSearchParams(location.search).get('lobby');
    var c = ausAdresse || holen('gb:lobby');
    if (c) beitreten(c, !ausAdresse);
  }

  function lobbyStarten() {
    var einst = {
      minuten: C.standard.minuten,
      bewegung: C.standard.bewegung,
      modus: C.standard.modus,
      nurStaedte: C.standard.nurStaedte !== false,
      punkteZeigen: C.standard.punkteZeigen !== false,
      regionen: (C.standard.regionen || []).slice()
    };
    anmelden().then(function () {
      return lobbyAnlegen(einst);
    }).then(function (c) {
      code = c;
      legen('gb:lobby', c);
      history.replaceState(null, '', location.pathname + '?lobby=' + c);
      return spielerEintragen(c, 'a');
    }).then(function () { horchen(); })
      .catch(function (e) { melde(fehlertext(e), 'fehler'); });
  }

  function einstellen(feld, wert) {
    if (!ichBinGastgeber()) return;
    var d = {};
    d['einst.' + feld] = wert;
    schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), d));
  }

  function minutenAendern(schritt) {
    if (!ichBinGastgeber()) return;
    einstellen('minuten', Math.max(1, Math.min(90, (lobby.einst.minuten || 10) + schritt)));
  }

  function oeffentlichKippen() {
    if (!ichBinGastgeber()) return;
    schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), { oeffentlich: !lobby.oeffentlich }));
  }

  function regionKippen(id) {
    if (!ichBinGastgeber()) return;
    var r = (lobby.einst.regionen || []).slice();
    var i = r.indexOf(id);
    if (i >= 0) r.splice(i, 1); else r.push(id);
    einstellen('regionen', r);
  }

  function teamWechseln() {
    if (!user || !code) return;
    schreibe(fb.setDoc(fb.doc(db, 'geobingo', code, 'spieler', user.uid),
      { team: meinTeam() === 'a' ? 'b' : 'a' }, { merge: true }));
  }

  function paketDazu(paketId) {
    var p = null;
    for (var i = 0; i < C.pakete.length; i++) if (C.pakete[i].id === paketId) p = C.pakete[i];
    if (!p) return;
    var platz = 40 - woerter.length;
    if (platz <= 0) { melde(L.zuVieleWoerter, 'fehler'); return; }

    /* Gemischt und nicht der Reihe nach — sonst spielt jede Runde dieselbe
       Liste in derselben Reihenfolge, und ab der dritten weiss sie jeder. */
    var pool = p.woerter.slice();
    for (var j = pool.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = pool[j]; pool[j] = pool[k]; pool[k] = t;
    }
    var da = {};
    for (var m = 0; m < woerter.length; m++) da[woerter[m].text.toLowerCase()] = true;

    var neu = [];
    for (var n = 0; n < pool.length && neu.length < Math.min(8, platz); n++) {
      if (!da[pool[n].text.toLowerCase()]) neu.push(pool[n]);
    }
    schreibe(Promise.all(neu.map(function (w) {
      return fb.setDoc(fb.doc(db, 'geobingo', code, 'woerter', id16()), {
        text: w.text, p: w.p, vonUid: user.uid, angelegt: fb.serverTimestamp()
      });
    })));
  }

  function wortDazu() {
    var feld = document.getElementById('gbWort');
    var text = String(feld.value || '').trim().slice(0, 40);
    if (!text) return;
    if (woerter.length >= 40) { melde(L.zuVieleWoerter, 'fehler'); return; }
    feld.value = '';
    feld.focus();
    schreibe(fb.setDoc(fb.doc(db, 'geobingo', code, 'woerter', id16()), {
      text: text, p: punkteWahl, vonUid: user.uid, angelegt: fb.serverTimestamp()
    }));
  }

  function alleWoerterWeg() {
    if (!ichBinGastgeber()) return;
    schreibe(Promise.all(woerter.map(function (w) {
      return fb.deleteDoc(fb.doc(db, 'geobingo', code, 'woerter', w.id));
    })));
  }

  /*
   * Kopieren, ohne den Link je zu zeigen. Faellt die Zwischenablage aus
   * (kein HTTPS, verweigerte Berechtigung), wird der Link NICHT in die
   * Meldeleiste geschrieben — auf einem Stream waere das genau der Unfall,
   * den das Verdecken verhindern soll. Stattdessen deckt sich das Feld auf,
   * und der Gastgeber entscheidet selbst, was er damit tut.
   */
  function teilen() {
    var url = einladeLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { melde(L.kopiert, 'gut'); },
        function () { kopierenGescheitert(); },
      );
    } else kopierenGescheitert();
  }

  function kopierenGescheitert() {
    melde(L.kopierenGeht, 'fehler');
    var feld = wurzel.querySelector('.gb-einladezeile [data-geheim]');
    if (feld && feld.getAttribute('aria-expanded') !== 'true') geheimZeigen(feld);
  }

  function losGehts() {
    if (!woerter.length || !(lobby.einst.regionen || []).length) return;
    schreibe(fb.updateDoc(fb.doc(db, 'geobingo', code), {
      zustand: 'laeuft', offen: false, startAm: fb.serverTimestamp()
    }));
  }

  function nochmal() {
    fundeLeeren(code).then(function () {
      stimmen = {};
      for (var k in stimmAbos) { try { stimmAbos[k](); } catch (e) {} }
      stimmAbos = {};
      return fb.updateDoc(fb.doc(db, 'geobingo', code), { zustand: 'lobby', offen: true, startAm: null });
    }).catch(function (e) { melde(fehlertext(e), 'fehler'); });
  }

  function stimmeAb(fid, v) {
    if (funde[fid] && funde[fid].uid === user.uid) return;
    var ref = fb.doc(db, 'geobingo', code, 'funde', fid, 'stimmen', user.uid);
    if ((stimmen[fid] || {})[user.uid] === v) schreibe(fb.deleteDoc(ref));
    else schreibe(fb.setDoc(ref, { v: v }));
  }

  // ── Start ─────────────────────────────────────────────────────────────────

  zeichne();

  /*
   * Angemeldet wird erst, wenn es gebraucht wird — beim Aufmachen oder
   * Betreten einer Lobby, nicht beim Laden.
   *
   * Vorher stand `anmelden()` hier im Start, und wenn der Gastzugang in der
   * Firebase-Konsole aus war, begruesste die Seite jeden Besucher mit einer
   * roten Fehlermeldung, bevor er irgendetwas angeklickt hatte. Ein Fehler zu
   * einer Handlung, die niemand vorgenommen hat, ist kein Hinweis, sondern
   * Laerm.
   */
  firebase().then(function () {
    if (!schluesselGleich(new URLSearchParams(location.search).get('k'), C.zugang) && !holen('gb:zutritt')) {
      bild = 'tor'; zeichne(); return;
    }
    legen('gb:zutritt', '1');
    weiterNachTor();
  }).catch(function () {
    wurzel.innerHTML = mitteMeldung(L.errAllgemein, false);
  });

  /* Wer den Tab schliesst, verschwindet aus der Spielerliste. Ohne das stehen
     in jeder Lobby nach drei Runden Namen, die nicht da sind. */
  window.addEventListener('pagehide', function () {
    if (!code || !user || !db) return;
    try { fb.deleteDoc(fb.doc(db, 'geobingo', code, 'spieler', user.uid)); } catch (e) {}
  });
})();
