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

function schnappSammlung(pfad, filter, grenze) {
  const tiefe = pfad.split('/').length + 1;
  let docs = [];
  for (const [k, v] of daten) {
    if (k.startsWith(pfad + '/') && k.split('/').length === tiefe) {
      docs.push({ id: k.split('/').pop(), data: () => v });
    }
  }
  // Die Wurzelsammlung `geobingo` liegt eine Ebene hoeher als alle anderen.
  if (pfad.indexOf('/') < 0) {
    docs = [];
    for (const [k, v] of daten) if (k.split('/').length === 2 && k.startsWith(pfad + '/')) {
      docs.push({ id: k.split('/').pop(), data: () => v });
    }
  }
  for (const f of filter ?? []) docs = docs.filter((d) => d.data()[f.feld] === f.wert);
  docs.sort((a, b) => String(a.data().angelegt ?? 0) - String(b.data().angelegt ?? 0));
  if (grenze) docs = docs.slice(0, grenze);
  return { docs, forEach: (fn) => docs.forEach(fn) };
}

let uhr = 0;

export const initializeApp = () => ({});
export const getFirestore = () => ({});
export const getAuth = () => ({});

export const doc = (_db, ...t) => ({ pfad: P(t), typ: 'doc' });
export const collection = (_db, ...t) => ({ pfad: P(t), typ: 'sammlung' });
/*
 * Abfragen: nur so viel, wie der Client wirklich benutzt — `where` mit `==`
 * und `limit`. `orderBy` ist eine Attrappe der Attrappe, weil schnappSammlung()
 * ohnehin nach `angelegt` sortiert.
 *
 * `where` gehoert dazu, seit es den Lobby-Browser gibt: ohne
 * where('oeffentlich','==',true) weist die echte Datenbank die Abfrage ab, und
 * ein Trockenlauf, der diese Zeile nicht kennt, prueft den Browser gar nicht.
 */
export const query = (ref, ...teile) => ({
  pfad: ref.pfad, typ: ref.typ,
  filter: teile.filter((t) => t && t.art === 'where'),
  grenze: (teile.find((t) => t && t.art === 'limit') || {}).n,
});
export const where = (feld, op, wert) => ({ art: 'where', feld, op, wert });
export const limit = (n) => ({ art: 'limit', n });
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
export function getDocs(ref) { return Promise.resolve(schnappSammlung(ref.pfad, ref.filter, ref.grenze)); }

export function onSnapshot(ref, cb) {
  const h = { pfad: ref.pfad, sammlung: ref.typ === 'sammlung', cb };
  horcher.push(h);
  setTimeout(() => (h.sammlung ? cb(schnappSammlung(h.pfad)) : cb(schnappDoc(h.pfad))), 0);
  return () => { const i = horcher.indexOf(h); if (i >= 0) horcher.splice(i, 1); };
}

let nutzer = null;
const wachen = [];

export function onAuthStateChanged(_a, cb) { wachen.push(cb); setTimeout(() => cb(nutzer), 0); return () => {}; }

/*
 * Google-Anmeldung als Attrappe.
 *
 * Welche Adresse dabei herauskommt, steht in `?als=` in der Adresszeile —
 * ohne Angabe die des Admins. Damit laesst sich beides trocken durchspielen:
 * `?als=admin` sieht das Verwaltungsfenster, `?als=fremd@example.com` bekommt
 * „noch nicht freigeschaltet" und kann sich melden.
 *
 * Was hier NICHT nachgebaut ist: dass die echte Regel die Adresse aus einem
 * von Google signierten Token liest. Hier steht sie in der URL — im
 * Trockenlauf ist das der Sinn, in der Wirklichkeit waere es das Gegenteil
 * von Sicherheit.
 */
export function GoogleAuthProvider() { this.setCustomParameters = () => {}; }

export function signInWithPopup() {
  const p = new URLSearchParams(location.search).get('als') || 'admin';
  const mail = p === 'admin' ? 'lucassteckel04@gmail.com' : p;
  nutzer = {
    uid: 'trocken-' + mail.replace(/[^a-z0-9]/gi, '').slice(0, 12),
    email: mail,
    displayName: mail.split('@')[0],
    isAnonymous: false,
  };
  wachen.forEach((w) => w(nutzer));
  return Promise.resolve({ user: nutzer });
}

export function signOut() {
  nutzer = null;
  wachen.forEach((w) => w(null));
  return Promise.resolve();
}

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
