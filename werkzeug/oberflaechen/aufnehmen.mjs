/**
 * Fotografiert die echten Oberflaechen der FiveM-Ressourcen ab.
 *
 *   node schuss.mjs <port> <zielordner>
 *
 * Erwartet den Automaten aus echtlucky.github.io/werkzeug/oberflaechen.mjs.
 * Die Nutzlast je Oberflaeche steht in nutzlast.mjs.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NUTZLAST } from './nutzlast.mjs';

const PORT = process.argv[2] || 8211;
const ZIEL = process.argv[3] || './bilder';
mkdirSync(ZIEL, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });

let gut = 0, schlecht = [];
for (const [name, { nachrichten, ziel = '.sk-pane', warten = 700, klicks = [], danach = [], hintergrund = null }] of Object.entries(NUTZLAST)) {
  try {
    await seite.goto(`http://localhost:${PORT}/ui/${name}/index.html`, { waitUntil: 'networkidle' });
    /* Eine NUI-Seite ist durchsichtig — im Spiel liegt das Spielbild
       darunter. Im Browser liegt dort Weiss. Wo eine Oberflaeche bewusst ein
       Fenster freilaesst (die Charakterbuehne), leuchtet dieses Weiss
       hindurch. Der dunkle Grund ist keine Verschoenerung, sondern die
       naechstliegende Wahrheit: dort steht im Spiel die Figur. */
    if (hintergrund) await seite.addStyleTag({ content: `html { background: ${hintergrund}; }` });
    await seite.evaluate((liste) => liste.forEach((n) => window.postMessage(n, '*')), nachrichten);
    await seite.waitForTimeout(warten);

    /* Manche Oberflaechen zeigen ihre rechte Haelfte erst, wenn links etwas
       gewaehlt ist. Ein Bild mit „Waehle links ein Fahrzeug" zeigt das
       Programm im Wartezustand und nicht bei der Arbeit. */
    for (const wahl of klicks) {
      const k = await seite.$(wahl);
      if (k) { await k.click(); await seite.waitForTimeout(350); }
      else schlecht.push(`${name}: Klickziel ${wahl} fehlt`);
    }

    /* Im Spiel beantwortet Lua den Klick. Hier muss die Antwort von Hand
       kommen, sonst bleibt die rechte Haelfte leer. */
    if (danach.length) {
      await seite.evaluate((liste) => liste.forEach((n) => window.postMessage(n, '*')), danach);
      await seite.waitForTimeout(400);
    }

    const el = await seite.$(ziel);
    if (!el) { schlecht.push(`${name}: ${ziel} nicht gefunden`); continue; }
    const kasten = await el.boundingBox();
    if (!kasten || kasten.width < 40 || kasten.height < 40) {
      schlecht.push(`${name}: ${ziel} ist ${Math.round(kasten?.width || 0)}x${Math.round(kasten?.height || 0)}`);
      continue;
    }
    await el.screenshot({ path: join(ZIEL, `${name}.png`) });
    console.log(`  ${name.padEnd(24)} ${Math.round(kasten.width)}x${Math.round(kasten.height)}`);
    gut++;
  } catch (e) {
    schlecht.push(`${name}: ${String(e).split('\n')[0].slice(0, 90)}`);
  }
}
await browser.close();
console.log(`\n${gut} von ${Object.keys(NUTZLAST).length} aufgenommen.`);
if (schlecht.length) console.log('offen:\n  ' + schlecht.join('\n  '));
