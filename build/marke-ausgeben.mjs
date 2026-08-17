#!/usr/bin/env node
/**
 * Die Marke als fertiges Stylesheet ausgeben.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Warum es das gibt
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `build/marke.mjs` ist die Quelle für die Designsprache. Diese Seite baut ihr
 * Stylesheet daraus zusammen — aber das Portal (`skillry-lizenz`) ist ein
 * eigenes Repository mit einer statischen `portal.css` und ohne Bauschritt.
 *
 * Zwei Möglichkeiten, und beide sind schlecht, wenn man sie nicht sauber macht:
 *
 *   * **Abschreiben.** Zwei Listen an zwei Orten, die dasselbe beschreiben,
 *     laufen auseinander. Genau diese Fehlerklasse hat heute schon dreimal
 *     zugeschlagen (`config.js` gegen `docker-compose.yaml`).
 *   * **Zur Laufzeit laden.** Das Portal holte seine Farben dann von
 *     `skillry.de` — und hinge damit an einer Adresse, an der die Anmeldung
 *     nicht hängen darf. Dieselbe Begründung, aus der die Firebase-Werte dort
 *     im Code stehen und nicht geladen werden.
 *
 * Also der dritte Weg: **erzeugen, kopieren, und die Abweichung prüfen.** Diese
 * Datei erzeugt. Kopiert wird von Hand (einmal je Änderung). Und
 * `skillry-lizenz/test/marke.mjs` rechnet bei jedem Lauf nach, ob die Kopie
 * noch dieselbe ist — vor jedem Ausliefern, denn `deploy.ps1` lässt die
 * Prüfungen davor laufen.
 *
 *     node build/marke-ausgeben.mjs > ../skillry-lizenz/web/marke.css
 */

import { BEWEGUNG, MARKE_LIZENZ, RUHE, SCHRIFT, SCHRIFT_QUELLE } from './marke.mjs';

/**
 * Die Schrift liegt im Portal woanders.
 *
 * Auf dieser Seite unter `/schrift/`, im Portal unter `/schrift/` ebenfalls —
 * aber es sind zwei Kopien auf zwei Servern. Das ist Absicht: das Portal soll
 * keine Datei von `skillry.de` holen müssen, um lesbar zu sein.
 */
const kopf = `/*
 * ═══════════════════════════════════════════════════════════════════════════
 * ERZEUGT — NICHT VON HAND ÄNDERN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Quelle: echtlucky.github.io/build/marke.mjs
 * Neu erzeugen:
 *
 *     cd D:/Projekte/echtlucky.github.io
 *     node build/marke-ausgeben.mjs > ../skillry-lizenz/web/marke.css
 *
 * \`test/marke.mjs\` in diesem Repository rechnet bei jedem Lauf nach, ob diese
 * Datei noch zur Quelle passt — und \`deploy.ps1\` lässt die Prüfungen vor dem
 * Ausliefern laufen. Wer hier von Hand ändert, bekommt eine rote Prüfung und
 * keinen stillen Unterschied.
 */
`;

process.stdout.write(`${kopf}${SCHRIFT_QUELLE}

:root {
${SCHRIFT}${BEWEGUNG}${MARKE_LIZENZ.hell}}

@media (prefers-color-scheme: dark) {
  :root {${MARKE_LIZENZ.dunkel}  }
}
:root[data-theme="dark"] {${MARKE_LIZENZ.dunkel}}
:root[data-theme="light"] {${MARKE_LIZENZ.hell}}
${RUHE}
`);
