/*
 * Trockenlauf-Attrappe fuer Firestore und Firebase Auth.
 *
 * Genug, damit build/geobingo-spiel.js vollstaendig laeuft, ohne dass ein
 * Byte zu Google geht: Dokumente in einer Map, Horcher, die bei jeder
 * Aenderung feuern, und eine anonyme Anmeldung, die sofort gelingt.
 *
 * Absichtlich NICHT nachgebaut: die Sicherheitsregeln. Was der Client hier
 * schreiben darf, sagt nichts darueber, was die echte Datenbank erlaubt.
 */

const daten = new Map();          // pfad -> objekt
const horcher = [];               // { pfad, sammlung, cb }

const P = (teile) => teile.join('/');

/*
 * Nur die Horcher, die es wirklich angeht.
 *
 * Die erste Fassung feuerte bei jedem Schreibvorgang ALLE Horcher. Das ist
 * nicht, was Firestore tut — und es hat im Prueflabor einen Fehler vorgetaeuscht,
 * den es nicht gibt: ein neuer Fund liess auch den Woerter-Horcher feuern, der
 * Client baute die Kartenliste neu, und der Knopf, auf den der Test als
 * naechstes klicken wollte, war schon abgehaengt.
 *
 * Ein Prueflabor, das strenger ist als die Wirklichkeit, findet Fehler, die
 * keine sind — und kostet genau so viel Zeit wie ein echter.
 */
function ausloesen(pfad) {
  const eltern = pfad.slice(0, pfad.lastIndexOf('/'));
  for (const h of horcher.slice()) {
    if (h.sammlung) { if (h.pfad === eltern) h.cb(schnappSammlung(h.pfad)); }
    else if (h.pfad === pfad) h.cb(schnappDoc(h.pfad));
  }
}

function schnappDoc(pfad) {
  const d = daten.get(pfad);
  return { exists: () => d !== undefined, data: () => d, id: pfad.split('/').pop() };
}

function schnappSammlung(pfad) {
  const tiefe = pfad.split('/').length + 1;
  const docs = [];
  for (const [k, v] of daten) {
    if (k.startsWith(pfad + '/') && k.split('/').length === tiefe) {
      docs.push({ id: k.split('/').pop(), data: () => v });
    }
  }
  docs.sort((a, b) => String(a.data().angelegt ?? 0) - String(b.data().angelegt ?? 0));
  return { docs, forEach: (f) => docs.forEach(f) };
}

let uhr = 0;

export const initializeApp = () => ({});
export const getFirestore = () => ({});
export const getAuth = () => ({});

export const doc = (_db, ...t) => ({ pfad: P(t), typ: 'doc' });
export const collection = (_db, ...t) => ({ pfad: P(t), typ: 'sammlung' });
export const query = (q) => q;
export const orderBy = () => null;
export const serverTimestamp = () => ({ __zeit: ++uhr, toMillis: () => Date.now() });

export function setDoc(ref, wert, opt) {
  const alt = daten.get(ref.pfad);
  daten.set(ref.pfad, opt && opt.merge && alt ? Object.assign({}, alt, wert) : wert);
  ausloesen(ref.pfad);
  return Promise.resolve();
}
export function updateDoc(ref, teil) {
  const alt = Object.assign({}, daten.get(ref.pfad));
  for (const k in teil) {
    // Punktpfade wie "einst.minuten" — genau die benutzt die Lobby.
    if (k.includes('.')) {
      const [a, b] = k.split('.');
      alt[a] = Object.assign({}, alt[a]);
      alt[a][b] = teil[k];
    } else alt[k] = teil[k];
  }
  daten.set(ref.pfad, alt);
  ausloesen(ref.pfad);
  return Promise.resolve();
}
export function deleteDoc(ref) { daten.delete(ref.pfad); ausloesen(ref.pfad); return Promise.resolve(); }
export function getDoc(ref) { return Promise.resolve(schnappDoc(ref.pfad)); }
export function getDocs(ref) { return Promise.resolve(schnappSammlung(ref.pfad)); }

export function onSnapshot(ref, cb) {
  const h = { pfad: ref.pfad, sammlung: ref.typ === 'sammlung', cb };
  horcher.push(h);
  setTimeout(() => (h.sammlung ? cb(schnappSammlung(h.pfad)) : cb(schnappDoc(h.pfad))), 0);
  return () => { const i = horcher.indexOf(h); if (i >= 0) horcher.splice(i, 1); };
}

let nutzer = null;
const wachen = [];
export function onAuthStateChanged(_a, cb) { wachen.push(cb); setTimeout(() => cb(nutzer), 0); return () => {}; }
export function signInAnonymously() {
  nutzer = { uid: 'trocken-' + Math.random().toString(36).slice(2, 8), isAnonymous: true };
  wachen.forEach((w) => w(nutzer));
  return Promise.resolve({ user: nutzer });
}

// Fuer das Prueflabor: Zustand von aussen sichtbar machen.
// Fuers Prueflabor: Daten direkt setzen UND die Horcher richtig benachrichtigen.
// Ohne das schreibt ein Test am Horcher vorbei und sieht seine eigene Aenderung nicht.
window.__trocken = {
  daten, schnappSammlung,
  setzen: (pfad, wert) => { daten.set(pfad, wert); ausloesen(pfad); },
  feuern: (pfad) => ausloesen(pfad)
};
