/**
 * Die Skillry-Markenfamilie, parametrisch.
 *
 * Grundlage ist der bestehende Pfad aus `echtlucky.github.io/build/logo.mjs`.
 * Er wird hier nicht neu erfunden, sondern in seine Bauteile zerlegt:
 *
 *   Die untere Haelfte ist die obere, um 180 Grad um (12,12) gedreht. Genau
 *   daher kommen die beiden gegenueberliegenden Spitzen. Die Verwerfung ist
 *   die Strecke P3->P4; halbiert man sie und schiebt beide Haelften um diesen
 *   halben Betrag aufeinander zu, schliesst sich die Figur zum Kreis.
 *
 * Damit ist die ganze Familie EIN Parameter: t = 1 ist die entschiedene
 * Fassung, t = 0 der geschlossene Kreis. Die Kontur bleibt bei jedem t
 * geschlossen — bei t = 0 haben die beiden geraden Stuecke schlicht die
 * Laenge null. Deshalb darf zwischen den Zustaenden animiert werden, ohne
 * dass die Figur je aufreisst.
 */

// Die sechs Ankerpunkte der entschiedenen Fassung, unveraendert uebernommen.
const P = {
  p1: [6.17, 16.57], p2: [6.17, 5.53], p3: [20.26, 5.53],
  p4: [17.83, 7.43], p5: [17.83, 18.47], p6: [3.74, 18.47],
};
const RX = 9.96, RY = 7.8;

// Halber Verwerfungsvektor: (P3 - P4) / 2.
const U = [(P.p3[0] - P.p4[0]) / 2, (P.p3[1] - P.p4[1]) / 2];  // [1.215, -0.95]

// Radius des geschlossenen Zustands: der Abstand von der Mitte zu einem
// zusammengeschobenen Ankerpunkt. Ausgerechnet statt geschaetzt, damit die
// vier Punkte im Endzustand exakt auf einem Kreis liegen.
const R_ZU = Math.hypot(P.p1[0] - U[0] - 12, P.p1[1] - U[1] - 12);  // 8.949

const n = (v) => Number(v.toFixed(3));

/** Pfad der Verwerfung bei Versatz `t` (1 = entschieden, 0 = Kreis). */
export function verwerfung(t = 1, { mitte = [12, 12], skala = 1 } = {}) {
  // (1 - t): bei t = 1 wird nichts verschoben, die Ankerpunkte stehen wie
  // entschieden. Bei t = 0 wandert jede Haelfte um den halben Verwerfungs-
  // vektor auf die andere zu und die Figur schliesst sich.
  const k = (1 - t) * skala;
  const tr = ([x, y], s) => {
    const sx = 12 + (x - 12) * skala + s * k * U[0];
    const sy = 12 + (y - 12) * skala + s * k * U[1];
    return [n(sx + mitte[0] - 12), n(sy + mitte[1] - 12)];
  };
  // Die Radien laufen beim SCHLIESSEN mit -- sonst schliesst sich die Figur
  // zu einer breiten Ellipse (19.92 x 15.6) statt zu dem Kreis, als der sie
  // in logo.mjs beschrieben ist.
  //
  // Nur beim Schliessen: fuer t > 1 wird hier geklemmt. Ohne die Klemme
  // extrapoliert die Interpolation weiter, zieht rx ueber 9.96 hinaus und
  // drueckt ry darunter -- die Figur wird mit wachsendem t immer flacher und
  // zerfaellt zum Band. Die Konstruktion nennt rx 9.96 und ry 7.8 fest; ein
  // weiter aufgerissenes Zeichen verschiebt die Haelften, es verzerrt die
  // Boegen nicht.
  // Erst skalieren, dann runden -- andersherum kommt das Runden vor der
  // Multiplikation und schreibt Fliesskommarauschen in den Pfad.
  const kr = 1 - Math.min(t, 1);
  const rx = n((RX + (R_ZU - RX) * kr) * skala);
  const ry = n((RY + (R_ZU - RY) * kr) * skala);
  const A = (p) => `A${rx} ${ry} 0 0 1 ${p[0]} ${p[1]}`;

  // Haelfte A laeuft um -t*U, Haelfte B um +t*U — sie kommen sich entgegen.
  const a1 = tr(P.p1, -1), a2 = tr(P.p2, -1), a3 = tr(P.p3, -1);
  const b1 = tr(P.p4, +1), b2 = tr(P.p5, +1), b3 = tr(P.p6, +1);

  return `M${a1[0]} ${a1[1]}${A(a2)}${A(a3)}L${b1[0]} ${b1[1]}${A(b2)}${A(b3)}Z`;
}

/** Prueft, dass t=1 die entschiedene Fassung exakt reproduziert. */
export function probe() {
  const soll = 'M6.17 16.57A9.96 7.8 0 0 1 6.17 5.53A9.96 7.8 0 0 1 20.26 5.53'
             + 'L17.83 7.43A9.96 7.8 0 0 1 17.83 18.47A9.96 7.8 0 0 1 3.74 18.47Z';
  const ist = verwerfung(1);   // t=1 muss die entschiedene Fassung sein
  const zahlen = (s) => (s.match(/-?\d+\.?\d*/g) || []).map(Number);
  const a = zahlen(soll), b = zahlen(ist);
  const max = Math.max(...a.map((v, i) => Math.abs(v - (b[i] ?? 1e9))));
  return { gleich: max < 0.001, groessteAbweichung: max };
}
