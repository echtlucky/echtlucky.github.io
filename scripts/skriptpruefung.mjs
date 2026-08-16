/**
 * Prueft die Syntax jedes eingebetteten Skripts in dist/.
 *
 * WARUM ES DIESE PRUEFUNG GIBT
 * ----------------------------
 * Die Seitenmodule erzeugen JavaScript als Zeichenkette. `node --check` prueft
 * dann das Modul und findet dort nichts zu beanstanden — die Zeichenkette ist
 * ja eine gueltige Zeichenkette, egal was drinsteht. Auch `npm run build`
 * laeuft durch, denn gebaut wird nur Text.
 *
 * Gefunden wurde der erste Fall von Hand: eine verwaiste Klammer in paint()
 * im Kopfskript. Der Build war gruen, die Verweispruefung war gruen, die Seite
 * sah richtig aus — und im Browser stand "Uncaught SyntaxError: Unexpected
 * token )". Das ganze Kopfskript lief nicht: keine Suche, kein Menue, kein
 * Anmeldezustand. Auf JEDER Seite, denn der Kopf ist ueberall.
 *
 * Genau diese Sorte Fehler faellt sonst erst jemandem auf, der die Seite
 * benutzt. Deshalb steht die Pruefung jetzt zwischen Bauen und Ausliefern.
 *
 * Sie prueft Syntax, nicht Verhalten. Ein Skript, das fehlerfrei parst und
 * trotzdem das Falsche tut, kommt hier durch — dafuer gibt es den Browser.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const WURZEL = 'dist';

function htmlDateien(verzeichnis) {
  let gefunden = [];
  for (const eintrag of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, eintrag);
    if (statSync(pfad).isDirectory()) gefunden = gefunden.concat(htmlDateien(pfad));
    else if (eintrag.endsWith('.html')) gefunden.push(pfad);
  }
  return gefunden;
}

/*
 * Nur Bloecke ohne src: was von aussen geladen wird, steht nicht in dieser
 * Datei und gehoert nicht in diese Pruefung. Und nur, was der Browser auch
 * als Skript ausfuehrt — application/ld+json ist Daten und wuerde als
 * JavaScript zu Recht scheitern.
 */
const BLOCK = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const TYP = /\btype\s*=\s*"([^"]*)"/;

let geprueft = 0;
const fehler = new Map();

for (const datei of htmlDateien(WURZEL)) {
  const html = readFileSync(datei, 'utf8');
  for (const treffer of html.matchAll(BLOCK)) {
    const typ = (TYP.exec(treffer[1]) || [, ''])[1].toLowerCase();
    if (typ && typ !== 'module' && typ !== 'text/javascript') continue;
    const code = treffer[2].trim();
    if (!code) continue;
    geprueft++;
    try {
      new vm.Script(code, { filename: datei });
    } catch (e) {
      /*
       * Nach Meldung gruppieren und nicht nach Datei. Das Kopfskript steht in
       * allen 23 Seiten: ein Fehler darin waere sonst 23 Zeilen, die alle
       * dasselbe sagen, und die eine Zeile, die etwas anderes sagt, geht
       * darin unter.
       */
      const schluessel = e.message;
      if (!fehler.has(schluessel)) fehler.set(schluessel, []);
      fehler.get(schluessel).push(datei);
    }
  }
}

console.log(`skriptpruefung — ${geprueft} eingebettete Skriptbloecke`);

if (fehler.size === 0) {
  console.log('  ✓ alle parsen fehlerfrei');
  process.exit(0);
}

for (const [meldung, dateien] of fehler) {
  console.error(`  ✗ ${meldung}`);
  console.error(`    in ${dateien.length} Datei(en), z. B. ${dateien[0]}`);
}
process.exit(1);
