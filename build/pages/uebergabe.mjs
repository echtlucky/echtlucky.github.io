/**
 * Die Uebergabe der Anmeldung an das Kundenportal.
 *
 * ---------------------------------------------------------------------------
 * DAS PROBLEM
 * ---------------------------------------------------------------------------
 * skillry.de und lizenz.skillry.de sind fuer den Browser zwei verschiedene
 * Herkuenfte. Firebase legt seine Anmeldung je Herkunft ab. Wer hier
 * angemeldet ist, ist es dort deshalb nicht — auch wenn dasselbe Konto, ein
 * Browser und ein Mensch dahinterstehen.
 *
 * ---------------------------------------------------------------------------
 * DER WEG, UND WARUM ES DIESER IST
 * ---------------------------------------------------------------------------
 * Der Lizenzdienst hat bereits einen vollstaendigen Uebertragungsweg, gebaut
 * fuer "Desktop zeigt QR-Code, Telefon bestaetigt": anlegen, bestaetigen,
 * abholen, mit Fristen, Einmalgebrauch und eigenen Tests. Hier wird genau der
 * benutzt, nur ohne QR-Code und ohne Rueckfrage — es ist derselbe Mensch im
 * selben Browser.
 *
 *   1. Das Portal legt eine Uebertragung an und behaelt das Abholgeheimnis.
 *   2. Das Portal laedt DIESE SEITE in einem versteckten Rahmen und schickt
 *      ihr die Kennung.
 *   3. Diese Seite bestaetigt die Uebertragung mit ihrem Firebase-Token.
 *   4. Das Portal holt die fertige Sitzung ab.
 *
 * Das Abholgeheimnis verlaesst das Portal dabei NIE, und das Firebase-Token
 * verlaesst diese Seite nie. Ueber die Grenze geht nur die Kennung — und die
 * ist allein wertlos.
 *
 * WARUM NICHT EINFACH DAS TOKEN IN DIE ADRESSE
 * Weil eine Adresse im Verlauf steht, im Referer landen kann und in
 * Protokollen auftaucht. Ein Token, das dort einmal steht, ist so lange
 * gueltig wie es gueltig ist — niemand kann es zuruecknehmen.
 *
 * ---------------------------------------------------------------------------
 * DIE EINE STELLE, AN DER ALLES HAENGT
 * ---------------------------------------------------------------------------
 * Wer diese Seite dazu bringt, eine Uebertragung zu bestaetigen, bekommt eine
 * SITZUNG FUER DAS KONTO DES BESUCHERS. Ein fremder Rahmen mit einer eigenen
 * Kennung waere also kein Randfall, sondern die Uebernahme des Kontos.
 *
 * Deshalb wird jede Nachricht gegen eine Liste erlaubter Herkuenfte geprueft,
 * und zwar woertlich. Und deshalb prueft die Seite zusaetzlich, WER sie
 * eingerahmt hat: ein Angreifer, der eine Nachricht mit gefaelschter Herkunft
 * schicken koennte, muesste dafuer den Browser selbst brechen — aber ein
 * Angreifer, der die Seite einfach in seine eigene einbaut, muss gar nichts
 * brechen. Das ist die naheliegende Variante, und sie wird zuerst abgewiesen.
 *
 * ACHTUNG BEIM BEARBEITEN: HTML und CSS stehen in Template-Literalen. Ein
 * Backtick in einem Kommentar beendet das Literal und der Build stirbt.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'handoff';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FB = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));
const CONFIGURED = Boolean(FB.projectId && FB.apiKey);

/**
 * Wer diese Seite einrahmen und ansprechen darf.
 *
 * Woertlicher Vergleich, kein startsWith: https://lizenz.skillry.de.boese.net
 * faengt mit unserem Namen an und gehoert uns nicht. Dieselbe Ueberlegung wie
 * in ursprungPruefen() im Lizenzdienst.
 */
const ERLAUBTE = ['https://lizenz.skillry.de'];

/** Wohin bestaetigt wird. */
const DIENST = 'https://lizenz.skillry.de';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const meta = {
  en: {
    title: 'Sign-in handover · Skillry',
    description: 'A technical page that hands your sign-in to the customer portal. Nothing to do here.',
  },
  de: {
    title: 'Anmeldung uebergeben · Skillry',
    description: 'Eine technische Seite, die deine Anmeldung an das Kundenportal weiterreicht. Hier gibt es nichts zu tun.',
  },
};

const T = {
  en: {
    h1: 'Sign-in handover',
    p1: 'This page exists so the customer portal can pick up the sign-in you already have here. It runs by itself, inside a hidden frame, and shows nothing.',
    p2: 'If you got here by hand, nothing is broken — there is simply nothing to do. The portal is at lizenz.skillry.de.',
    toPortal: 'To the customer portal',
  },
  de: {
    h1: 'Anmeldung uebergeben',
    p1: 'Diese Seite gibt es, damit das Kundenportal die Anmeldung uebernehmen kann, die du hier schon hast. Sie laeuft von selbst, in einem versteckten Rahmen, und zeigt nichts an.',
    p2: 'Wenn du von Hand hier gelandet bist, ist nichts kaputt — es gibt hier schlicht nichts zu tun. Das Portal liegt auf lizenz.skillry.de.',
    toPortal: 'Zum Kundenportal',
  },
};

export function head() {
  return `<style>
.ue-raum { max-width: 46rem; margin: 0 auto; padding: 64px 0 80px; }
.ue-raum h1 { font-size: 1.5rem; margin: 0 0 12px; }
.ue-raum p { color: var(--fg-muted); line-height: 1.65; margin: 0 0 14px; }
</style>`;
}

export function body(lang) {
  const t = T[lang] || T.de;
  return `<div class="wrap ue-raum">
  <h1>${esc(t.h1)}</h1>
  <p>${esc(t.p1)}</p>
  <p>${esc(t.p2)}</p>
  <p><a class="btn btn-primary" href="${DIENST}/">${esc(t.toPortal)}</a></p>
</div>`;
}

export function script() {
  if (!CONFIGURED) return '';

  return [
    '(function () {',
    '  var ERLAUBTE = ' + JSON.stringify(ERLAUBTE) + ';',
    '  var DIENST = ' + JSON.stringify(DIENST) + ';',
    '',
    '  /*',
    '   * Nur im Rahmen, und nur im richtigen.',
    '   *',
    '   * ancestorOrigins kennt jeder Browser ausser Firefox. Wo es fehlt, faengt',
    '   * die Herkunftspruefung an der Nachricht selbst — die ist die eigentliche',
    '   * Grenze, dieser Test hier ist die zusaetzliche.',
    '   */',
    '  function rahmenStimmt() {',
    '    if (window.top === window.self) return false;',
    '    var a = location.ancestorOrigins;',
    '    if (!a || !a.length) return true;',
    '    for (var i = 0; i < a.length; i++) {',
    '      /* JEDER Vorfahre muss erlaubt sein, nicht nur der naechste. Sonst',
    '         baut ein fremdes Dokument das Portal ein und das Portal uns. */',
    '      if (ERLAUBTE.indexOf(a[i]) === -1) return false;',
    '    }',
    '    return true;',
    '  }',
    '',
    '  if (!rahmenStimmt()) return;',
    '',
    '  function antworte(quelle, herkunft, nachricht) {',
    '    /* Immer mit ausdruecklicher Zielherkunft. Mit "*" laege die Antwort in',
    '       jedem Dokument, das den Rahmen zwischenzeitlich uebernommen hat. */',
    '    quelle.postMessage(nachricht, herkunft);',
    '  }',
    '',
    '  var laeuft = false;',
    '',
    '  window.addEventListener("message", function (e) {',
    '    // ══ DIE GRENZE ══════════════════════════════════════════════════════',
    '    // Woertlich. Wer hier durchkommt, bekommt eine Sitzung fuer das Konto',
    '    // des Besuchers — ein startsWith waere die ganze Luecke.',
    '    if (ERLAUBTE.indexOf(e.origin) === -1) return;',
    '    var d = e.data;',
    '    if (!d || d.typ !== "skillry-uebergabe-bitte") return;',
    '    if (typeof d.kennung !== "string" || !/^[A-Za-z0-9]{6,64}$/.test(d.kennung)) {',
    '      antworte(e.source, e.origin, { typ: "skillry-uebergabe-fertig", ok: false, grund: "kennung" });',
    '      return;',
    '    }',
    '    /* Eine Bitte auf einmal. Zwei gleichzeitig waeren zwei Sitzungen aus',
    '       einer Anmeldung, und die zweite haette niemand gewollt. */',
    '    if (laeuft) return;',
    '    laeuft = true;',
    '',
    '    var A = window.Skillry && window.Skillry.auth;',
    '    if (!A) {',
    '      laeuft = false;',
    '      antworte(e.source, e.origin, { typ: "skillry-uebergabe-fertig", ok: false, grund: "kein-dienst" });',
    '      return;',
    '    }',
    '',
    '    /*',
    '     * AUF DEN ZUSTAND WARTEN, NICHT currentUser LESEN',
    '     *',
    '     * getAuth() gibt sofort ein Objekt zurueck, aber currentUser bleibt',
    '     * darin so lange null, bis die gespeicherte Anmeldung aus der',
    '     * IndexedDB wiederhergestellt ist. Das dauert Millisekunden bis',
    '     * Sekunden — in einem Rahmen, der gerade erst geladen wurde, eher',
    '     * das obere Ende.',
    '     *',
    '     * Genau daran ist die erste Fassung gescheitert: sie las currentUser',
    '     * sofort, bekam null und meldete zurueck, es sei niemand angemeldet',
    '     * — obwohl auf skillry.de eine Anmeldung stand. Der Fehler fiel nicht',
    '     * auf, weil die Antwort plausibel klang.',
    '     *',
    '     * onAuthStateChanged feuert immer, auch wenn wirklich niemand',
    '     * angemeldet ist — dann eben mit null. Es ist das einzige ehrliche',
    '     * Signal.',
    '     */',
    '    function nutzerHolen(k) {',
    '      return new Promise(function (fertig) {',
    '        var erledigt = false;',
    '        var stop = k.fb.onAuthStateChanged(k.auth, function (u) {',
    '          if (erledigt) return;',
    '          erledigt = true; stop(); fertig(u || null);',
    '        });',
    '        /* Notbremse, damit das Portal nicht ewig wartet. Kuerzer als',
    '           dessen eigene Frist — sonst antwortet immer die dort und man',
    '           erfaehrt hier nie, was los war. */',
    '        setTimeout(function () {',
    '          if (erledigt) return;',
    '          erledigt = true; try { stop(); } catch (x) {} fertig(null);',
    '        }, 4000);',
    '      });',
    '    }',
    '',
    '    /* Ist niemand da: fehlt die Anmeldung, oder hat dieser Rahmen einen',
    '       eigenen, abgetrennten Speicher? Chrome trennt den Speicher von',
    '       Rahmen fremder Herkunft, und dann sieht diese Seite die Anmeldung',
    '       von skillry.de grundsaetzlich nicht. Zwei Faelle, zwei verschiedene',
    '       Loesungen — also werden sie getrennt gemeldet, statt beide',
    '       "hat nicht geklappt" zu heissen. */',
    '    function speicherLage() {',
    '      if (!indexedDB.databases) return Promise.resolve("unbekannt");',
    '      return indexedDB.databases().then(function (l) {',
    '        return l.some(function (d) { return d.name === "firebaseLocalStorageDb"; })',
    '          ? "speicher-da" : "speicher-leer";',
    '      }, function () { return "unlesbar"; });',
    '    }',
    '',
    '    A.ensure().then(function (k) {',
    '      return nutzerHolen(k).then(function (u) {',
    '        if (!u) {',
    '          return speicherLage().then(function (lage) {',
    '            throw { grund: "keine-anmeldung/" + lage };',
    '          });',
    '        }',
    '        return u.getIdToken().then(function (token) {',
    '        return fetch(DIENST + "/v1/konto/uebertragung/bestaetigen", {',
    '          method: "POST",',
    '          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },',
    '          body: JSON.stringify({ kennung: d.kennung })',
    '        });',
    '      });',
    '      });',
    '    }).then(function (r) {',
    '      return r.json().catch(function () { return {}; }).then(function (j) {',
    '        return { code: r.status, koerper: j };',
    '      });',
    '    }).then(function (a) {',
    '      laeuft = false;',
    '      if (a.code === 200 && a.koerper && a.koerper.ok) {',
    '        antworte(e.source, e.origin, { typ: "skillry-uebergabe-fertig", ok: true });',
    '        return;',
    '      }',
    '      /*',
    '       * Der Grund geht mit, damit das Portal das Richtige tun kann:',
    '       * bei einem fehlenden zweiten Faktor ist die normale Anmeldung der',
    '       * richtige Weg, bei einer Stoerung ein Hinweis. Ein blosses',
    '       * "hat nicht geklappt" waere fuer beide dieselbe Sackgasse.',
    '       */',
    '      antworte(e.source, e.origin, {',
    '        typ: "skillry-uebergabe-fertig", ok: false,',
    '        grund: (a.koerper && a.koerper.fehler) || ("http-" + a.code)',
    '      });',
    '    }).catch(function (err) {',
    '      laeuft = false;',
    '      antworte(e.source, e.origin, {',
    '        typ: "skillry-uebergabe-fertig", ok: false,',
    '        grund: (err && err.grund) || "stoerung"',
    '      });',
    '    });',
    '  });',
    '',
    '  /* Erst melden, wenn zugehoert wird. Das Portal wartet auf dieses Zeichen',
    '     statt auf das load-Ereignis des Rahmens: geladen heisst nicht bereit. */',
    '  ERLAUBTE.forEach(function (h) {',
    '    try { parent.postMessage({ typ: "skillry-uebergabe-bereit" }, h); } catch (x) {}',
    '  });',
    '})();',
  ].join('\n');
}
