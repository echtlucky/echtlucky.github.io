/**
 * Serviert die echten Oberflaechen der FiveM-Ressourcen zum Abfotografieren.
 *
 *   node werkzeug/oberflaechen.mjs [port]
 *
 * ══ Warum das kein erzeugtes Bild ist ══════════════════════════════════════
 *
 * Der Vorschaurahmen im Skript-Katalog sagt heute: "dieser Rahmen ist eine
 * Leerstelle, kein Bild von irgendetwas." Ein Modellbild waere genau das --
 * ein Bild von irgendetwas, auf der Karte eines Produkts, das jemand kauft.
 *
 * Was hier passiert, ist etwas anderes: die Oberflaechen liegen als HTML im
 * Repository, sie werden geladen, bekommen dieselbe Nachricht, die ihnen im
 * Spiel der Client schickt, und zeichnen sich selbst. Das Bild zeigt also die
 * tatsaechliche Oberflaeche. Erfunden sind nur die ZAHLEN darin, und genau das
 * sagt die Bildunterschrift.
 *
 * Nichts davon wird ausgeliefert -- der Server laeuft nur lokal, waehrend die
 * Bilder entstehen.
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const RES = 'D:/Projekte/skillry-fivem/resources';
const PORT = Number(process.argv[2] || 8210);

const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
};

const MIT_UI = readdirSync(RES).filter((r) => existsSync(join(RES, r, 'html', 'index.html')));

createServer((q, r) => {
  const weg = decodeURIComponent((q.url || '/').split('?')[0]);

  if (weg === '/') {
    r.writeHead(200, { 'content-type': TYPEN['.html'] });
    return r.end(`<h1>${MIT_UI.length} Oberflaechen</h1><ul>` +
      MIT_UI.map((n) => `<li><a href="/ui/${n}/index.html">${n}</a></li>`).join('') + '</ul>');
  }

  const m = /^\/ui\/([a-z0-9_]+)\/(.*)$/.exec(weg);
  if (!m) { r.writeHead(404); return r.end('nur /ui/<ressource>/'); }

  const wurzel = normalize(join(RES, m[1], 'html'));
  const datei = normalize(join(wurzel, m[2] || 'index.html'));
  // Kein Ausbrechen aus dem html-Ordner der Ressource.
  if (!datei.startsWith(wurzel)) { r.writeHead(403); return r.end('nein'); }
  if (!existsSync(datei) || statSync(datei).isDirectory()) { r.writeHead(404); return r.end('fehlt'); }

  /*
   * ══ nui:// UMSCHREIBEN ════════════════════════════════════════════════
   *
   * Die Oberflaechen laden ihr gemeinsames Design-System als
   * `nui://skillry_ui/html/ui.css` -- das Protokoll, unter dem FiveM die
   * Ressourcen ausliefert. Ein Browser kennt es nicht und laesst die Datei
   * still weg.
   *
   * Genau daran lag es, dass die Bank sich zwar zeichnete, aber ohne Grund,
   * ohne Radien und mit falschen Schriftgroessen: geladen wurde nur ihr
   * eigenes bank.css, das Design-System darunter fehlte. NEUNZEHN der
   * einundzwanzig Oberflaechen haengen daran.
   *
   * Umgeschrieben wird nur beim Ausliefern. In den Dateien selbst bleibt
   * nui:// stehen, denn dort ist es richtig.
   */
  const typ = TYPEN[extname(datei)] || 'application/octet-stream';
  let inhalt = readFileSync(datei);
  if (/\.(html|css|js)$/i.test(datei)) {
    inhalt = Buffer.from(
      inhalt.toString('utf8').replace(/nui:\/\/([a-z0-9_]+)\/html\//g, '/ui/$1/'),
      'utf8',
    );
  }
  r.writeHead(200, { 'content-type': typ });
  r.end(inhalt);
}).listen(PORT, () => {
  process.stdout.write(`${MIT_UI.length} Oberflaechen auf http://localhost:${PORT}/\n`);
});
