/**
 * Wo das Kundenportal liegt — an einer Stelle, damit es an einer Stelle
 * zurueckkommt.
 *
 * Das Portal lief unter `lizenz.skillry.de`, und dahinter stand der VPS
 * 212.227.45.18. Der ist zum 30.08.2026 gekuendigt. Ein Link auf einen Namen,
 * der ins Leere zeigt, ist schlimmer als kein Link: er sieht aus wie ein
 * Angebot, und wer darauf klickt, landet in der Fehlerseite seines Browsers
 * — ohne zu erfahren, dass hier gerade nichts kaputt ist, sondern etwas
 * abgeschaltet wurde.
 *
 * Deshalb steht hier `null` statt der Adresse. Die zwei Stellen, die auf das
 * Portal verweisen — der angemeldete Zustand in der Kopfzeile und die
 * Schnellwahl auf der Kontoseite — lassen ihren Eintrag dann einfach weg.
 * Kein Platzhalter, keine Hinweiszeile: ein Menuepunkt weniger faellt
 * niemandem auf, ein toter faellt jedem auf.
 *
 * Kommt das Portal auf einem neuen Server wieder, ist das eine Zeile hier —
 * und keine Suche durch zwei Dateien.
 *
 * NICHT betroffen ist die API-Dokumentation unter /api. Sie nennt
 * `lizenz.skillry.de/v1/pruefen` weiterhin, und das ist richtig so: sie
 * beschreibt die Schnittstelle des Produkts, nicht einen Knopf, den hier
 * jemand druecken kann. Dasselbe gilt fuer /handoff, das ohnehin nur
 * anspringt, wenn jemand vom Portal kommt.
 */

// Zum Wiedereinschalten: 'https://lizenz.skillry.de'
export const PORTAL = null;
