/**
 * Der Trockenlauf: GeoBingo einmal komplett durchspielen, ohne Google.
 *
 *   node build/site.mjs
 *   node test/trocken/bauen.mjs
 *   node build/serve.mjs 8123   →  http://localhost:8123/trocken/
 *
 * Es gibt zwei Gruende, warum das existiert, und beide sind praktisch:
 *
 *   1. **Proben kostet sonst Geld.** Jede Runde auf der echten Seite laedt
 *      Panoramen, und jedes Panorama ist eine Rechnungszeile bei Google. Wer
 *      vor einem Stream die Woerter, die Runde und die Auswertung durchgehen
 *      will, soll das nicht bezahlen muessen.
 *   2. **Ohne Schluessel geht sonst gar nichts.** Kein Maps-Schluessel, keine
 *      ausgerollten Firestore-Regeln, kein Gastzugang in der Konsole — und die
 *      Seite kommt nicht ueber den ersten Knopf hinaus. Hier laeuft sie ganz
 *      durch, weil Firebase und Maps durch Attrappen ersetzt sind.
 *
 * WAS DER TROCKENLAUF NICHT PRUEFT, und das ist wichtig:
 *
 *   * **Die Sicherheitsregeln.** `test/trocken/fb.js` kennt keine. Was hier
 *     durchgeht, sagt nichts darueber, was die echte Datenbank erlaubt — dafuer
 *     ist `firestore.rules` da, und geprueft wird das nur gegen das echte
 *     Projekt.
 *   * **Street View.** Die Attrappe zeigt ein Streifenmuster mit der
 *     Panorama-Kennung. Ob das Bild spaeter wirklich einen Hydranten zeigt,
 *     kann hier niemand sehen.
 *   * **Die Rechnung.** Genau das ist der Punkt: hier kostet nichts.
 *
 * Erzeugt wird nach `dist/trocken/`, also in einen Ordner, der beim naechsten
 * `node build/site.mjs` verschwindet. Das ist Absicht — was aus einer Attrappe
 * gebaut wurde, soll nicht neben der echten Seite liegenbleiben und
 * irgendwann mit ihr verwechselt werden.
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HIER, '..', '..');
const ZIEL = join(ROOT, 'dist', 'trocken');

/*
 * Der Platzhalter-Schluessel wird gesetzt, BEVOR das Seitenmodul geladen wird —
 * es liest ihn beim Import einmal und nie wieder.
 *
 * Und die Seite wird hier selbst gerendert statt aus `dist/` gelesen. Beides
 * hat denselben Grund: mit leerem `mapsApiKey` baut `node build/site.mjs` die
 * Seite ohne Spiel, und der Trockenlauf waere ausgerechnet dann leer, wenn man
 * ihn braucht — vor dem ersten Schluessel. Nebenbei faellt damit jede Gefahr
 * weg, dass ein erfundener Schluessel in die echte `dist/geobingo/` geraet:
 * geschrieben wird ausschliesslich nach `dist/trocken/`.
 */
process.env.GEOBINGO_MAPS_KEY = process.env.GEOBINGO_MAPS_KEY || 'trockenlauf-kein-echter-schluessel';

const { render } = await import('../../build/layout.mjs');
const seite = await import('../../build/pages/geobingo.mjs');

const SPRACHE = process.argv[2] === 'en' ? 'en' : 'de';

let html = render({
  lang: SPRACHE,
  slug: seite.slug,
  title: seite.meta[SPRACHE].title,
  description: seite.meta[SPRACHE].description,
  body: seite.body(SPRACHE),
  head: seite.head(SPRACHE),
  script: seite.script(SPRACHE),
  blank: true,
});

if (!html.includes('window.__GEOBINGO')) {
  process.stderr.write(
    'trocken: die Seite enthaelt kein Spiel. Dann fehlt Firebase in content/firebase.json —\n'
    + '         den Kartenschluessel setzt dieses Skript selbst.\n',
  );
  process.exit(2);
}

const SDK = (JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8')).sdkVersion) || '11.0.2';
const gstatic = (datei) => `https://www.gstatic.com/firebasejs/${SDK}/${datei}`;

/*
 * Eine Importkarte biegt die drei Firebase-Module auf die Attrappe um. Das ist
 * der einzige Weg, ein dynamisches `import()` einer absoluten Adresse
 * abzufangen, ohne den Quelltext des Spiels anzufassen — und den anzufassen
 * hiesse, etwas anderes zu pruefen als das, was ausgeliefert wird.
 */
const importkarte = {
  imports: {
    [gstatic('firebase-app.js')]: './fb.js',
    [gstatic('firebase-firestore.js')]: './fb.js',
    [gstatic('firebase-auth.js')]: './fb.js',
  },
};

/*
 * Die Maps-Attrappe steht VOR dem Spiel im Kopf, und das ist der ganze Trick:
 * `maps()` prueft zuerst, ob `google.maps.StreetViewPanorama` schon da ist,
 * und laedt nur dann nach. Ist es da, wird nie ein Skript von Google geholt.
 *
 * `getPanorama` schlaegt absichtlich in der Haelfte der Faelle fehl. Der
 * Wiederholweg in zufallsort() ist der Teil, der im Echtbetrieb am haeufigsten
 * laeuft — ein Prueflauf, in dem der erste Wurf immer trifft, prueft ihn nie.
 */
const MAPS_ATTRAPPE = `<script>
window.google = { maps: {
  StreetViewSource: { OUTDOOR: 'outdoor' },
  StreetViewService: function () {
    this.getPanorama = function (o) {
      if (Math.random() < 0.5) return Promise.reject(new Error('ZERO_RESULTS'));
      var id = 'PANO-' + Math.random().toString(36).slice(2, 9);
      return Promise.resolve({ data: { location: {
        pano: id,
        latLng: { lat: function () { return o.location.lat; }, lng: function () { return o.location.lng; } }
      } } });
    };
  },
  StreetViewPanorama: function (el, opt) {
    var pov = opt.pov, zoom = opt.zoom, pano = opt.pano;
    function malen() {
      el.style.background = 'repeating-linear-gradient(45deg,#1b2430 0 22px,#222d3b 22px 44px)';
      el.innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center;'
        + 'color:#7f8b9c;font:600 13px ui-monospace,monospace;text-align:center;line-height:1.7">'
        + 'ATTRAPPE STREET VIEW<br>' + pano
        + '<br>Blick ' + Math.round(pov.heading) + '\\u00b0 &middot; Zoom ' + (Math.round(zoom * 10) / 10) + '</div>';
    }
    malen();
    this.getPov = function () { return pov; };
    this.getZoom = function () { return zoom; };
    this.getPano = function () { return pano; };
    this.getPosition = function () { return { lat: function () { return 52.5; }, lng: function () { return 13.4; } }; };
    this.setPano = function (p) { pano = p; malen(); };
    this.setPov = function (p) { pov = p; malen(); };
    this.setZoom = function (z) { zoom = z; malen(); };
  }
} };
</script>`;

/*
 * Fundbilder kommen sonst von der Street View Static API — also von Google, und
 * gegen Bezahlung. Hier wird jede solche Adresse durch einen Verlauf ersetzt,
 * sobald sie im Blattgrund auftaucht.
 */
const BILD_ATTRAPPE = `<script>
(function () {
  function ersetzen(wurzel) {
    (wurzel.querySelectorAll ? wurzel.querySelectorAll('[style*="maps.googleapis.com"]') : []).forEach(function (e) {
      var t = (e.style.backgroundImage.match(/pano=([^&"]+)/) || [])[1] || '?';
      e.style.backgroundImage = 'linear-gradient(135deg,#2a3a4d,#16202b)';
      e.dataset.attrappe = t;
      e.title = 'Attrappe: ' + decodeURIComponent(t);
    });
  }
  new MutationObserver(function (l) { l.forEach(function (m) { ersetzen(m.target); }); ersetzen(document); })
    .observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
})();
</script>`;

const HINWEIS = `<div style="position:fixed;left:0;right:0;bottom:0;z-index:99;padding:5px 12px;
  background:#3a2410;border-top:1px solid #7a5320;color:#ffcf8a;
  font:600 11px/1.5 ui-monospace,monospace;text-align:center;pointer-events:none">
  TROCKENLAUF &middot; Firebase und Street View sind Attrappen &middot; nichts davon geht zu Google, nichts davon prueft die Sicherheitsregeln
</div>`;

/*
 * Der Riegel, und nicht nur die Farbe darueber.
 *
 * Die Bild-Attrappe oben ersetzt die Static-API-Adresse, sobald sie im
 * Blattgrund steht — aber der Browser hat den Abruf da schon begonnen. Im
 * ersten Durchgang stand in performance.getEntriesByType('resource')
 * tatsaechlich eine Anfrage an maps.googleapis.com, obwohl das Bild sichtbar
 * eine Attrappe war.
 *
 * Fuer einen Trockenlauf, der „nichts geht zu Google" behauptet, ist das der
 * Unterschied zwischen wahr und beinahe wahr. Diese Regel verbietet dem
 * Browser den Abruf, statt ihn hinterher zu uebermalen: `img-src` und
 * `connect-src` lassen nur noch die eigene Herkunft zu.
 *
 * Eine Feinheit, damit niemand beim Nachmessen erschrickt: in
 * `performance.getEntriesByType('resource')` stehen die geblockten Adressen
 * WEITERHIN — mit `duration: 0`, `transferSize: 0` und `responseStatus: 0`.
 * Chrome vermerkt den abgewiesenen Versuch, schickt ihn aber nicht. Im
 * Netzwerkprotokoll des Browsers taucht dementsprechend nichts auf.
 */
const RIEGEL = '<meta http-equiv="Content-Security-Policy" content="'
  + "default-src 'self'; "
  + "script-src 'self' 'unsafe-inline'; "
  + "style-src 'self' 'unsafe-inline'; "
  + "img-src 'self' data:; "
  + "connect-src 'self'; "
  + "font-src 'self' data:"
  + '">';

html = html
  .replace('<head>', `<head>\n${RIEGEL}\n<script type="importmap">${JSON.stringify(importkarte)}</script>\n${MAPS_ATTRAPPE}`)
  // Als Modul, sonst greift die Importkarte fuer das dynamische import() nicht.
  .replace('<script>window.__GEOBINGO', '<script type="module">window.__GEOBINGO')
  .replace('</body>', `${BILD_ATTRAPPE}\n${HINWEIS}\n</body>`);

mkdirSync(ZIEL, { recursive: true });
writeFileSync(join(ZIEL, 'index.html'), html, 'utf8');
copyFileSync(join(HIER, 'fb.js'), join(ZIEL, 'fb.js'));

process.stdout.write(
  `\ntrockenlauf — dist/trocken/index.html (${Math.round(Buffer.byteLength(html) / 1024)} KB)\n`
  + '  http://localhost:8123/trocken/   (node build/serve.mjs 8123)\n\n',
);
