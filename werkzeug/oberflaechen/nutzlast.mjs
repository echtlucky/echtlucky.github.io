/**
 * Was jede Oberflaeche braucht, um sich zu zeichnen.
 *
 * Die Aktionen stammen aus dem HANDLER der jeweiligen Ressource — das ist
 * derselbe Vertrag, den ihr im Spiel der Client schickt. Erfunden sind nur
 * die Werte darin, und genau das sagt die Bildunterschrift auf der Seite.
 */
export const NUTZLAST = {
  skillry_bank: { nachrichten: [
    { action: 'aufbau', art: 'schalter',
      // `kann` kommt im Spiel aus ERLAUBT in server/buchen.lua. Ohne das Feld
      // steht neben jedem Punkt "Hier nicht moeglich" — die Oberflaeche saehe
      // auf einer Produktkarte kaputt aus statt vollstaendig.
      kann: { einzahlen: true, abheben: true, ueberweisen: true, umsaetze: true } },
    { action: 'auf' },
    { action: 'konto', inhaber: 'Lucas Steckel', nummer: 'SR-4471-0092',
      ortName: 'Filiale Vinewood', bar: 1840, konto: 12750 },
    { action: 'umsaetze', liste: [
      { zeit: 'Heute 14:22', text: 'Tankstelle Süd', betrag: -64 },
      { zeit: 'Heute 09:05', text: 'Lohn Werkstatt', betrag: 950 },
      { zeit: 'Gestern 21:40', text: 'Überweisung M. Braun', betrag: -300 },
    ] },
  ] },
};

/* ── Garage ─────────────────────────────────────────────────────────────── */
NUTZLAST.skillry_garage = { nachrichten: [
  { action: 'auf', art: 'auto', zugang: 'oeffentlich', garageName: 'Garage Alta Street' },
  { action: 'liste', garageName: 'Garage Alta Street', konto: 'bank', guthaben: 12750,
    maxPlaetze: 6, belegt: 3,
    arten: [{ id: 'alle', wort: 'Alle' }, { id: 'limousine', wort: 'Limousine' },
            { id: 'gelaende', wort: 'Gelände' }, { id: 'motorrad', wort: 'Motorrad' }],
    liste: [
      { id: 1, modell: 'Ubermacht Sentinel', kennzeichen: 'SR 4471', klasse: 'limousine',
        typ: 'limousine', holbar: true, zustand: 96, motor: 98, karosserie: 94, tank: 72,
        garage: 'alta', garageName: 'Garage Alta Street', gebuehr: 0 },
      { id: 2, modell: 'Canis Seminole', kennzeichen: 'SR 1188', klasse: 'gelaende',
        typ: 'gelaende', holbar: true, zustand: 81, motor: 84, karosserie: 78, tank: 41,
        garage: 'alta', garageName: 'Garage Alta Street', gebuehr: 0 },
      { id: 3, modell: 'Pegassi Bati 801', kennzeichen: 'SR 0092', klasse: 'motorrad',
        typ: 'motorrad', holbar: false, grund: 'Steht in der Werkstatt', zustand: 44,
        motor: 39, karosserie: 51, tank: 88, garage: 'werkstatt',
        garageName: 'Werkstatt Vinewood', gebuehr: 250 },
    ] },
] };

/* ── Werkstatt (Ressource heisst skillry_karte) ─────────────────────────── */
NUTZLAST.skillry_karte = { nachrichten: [
  { action: 'auf' },
  { action: 'stand', ort: 'Werkstatt Vinewood', fahrzeug: 'Ubermacht Sentinel',
    kennzeichen: 'SR 4471', motor: 98, karosserie: 94, dreck: 22, vorschau: true },
] };

/* ── Chat ───────────────────────────────────────────────────────────────── */
NUTZLAST.skillry_chat = { nachrichten: [
  { action: 'einstellungen', zeitstempel: true, sichtbarMs: 600000, maxZeilen: 40 },
  { action: 'auf' },
  { action: 'zeile', art: 'system', name: '', text: 'Willkommen auf Skillry Roleplay.' },
  { action: 'zeile', art: 'ooc', name: 'Lucas Steckel:', text: 'Bin an der Werkstatt, wer holt den Sentinel ab?' },
  { action: 'zeile', art: 'ooc', name: 'M. Braun:', text: 'Zehn Minuten, ich komme über die Alta.' },
  { action: 'zeile', art: 'system', name: '', text: 'M. Braun hat den Server betreten.' },
] };

/* ── Tablet ─────────────────────────────────────────────────────────────── */
NUTZLAST.skillry_tablet = { nachrichten: [
  { action: 'auf' },
  { action: 'stand',
    notizen: [
      { id: 1, titel: 'Werkstatt Vinewood', wann: 'Heute 14:20', laenge: 210,
        text: 'Sentinel: Motor auf 98, Lack neu. Abholung offen.' },
      { id: 2, titel: 'Einkauf', wann: 'Gestern 19:05', laenge: 84, text: 'Reifen, Öl, Kaffee.' },
      { id: 3, titel: 'Schichtplan Oktober', wann: '12.08.', laenge: 460, text: '' },
    ],
    bilder: [] },
] };

/* ── Zeitung ────────────────────────────────────────────────────────────── */
NUTZLAST.skillry_zeitung = { nachrichten: [
  { action: 'aufbau',
    blatt: { name: 'Vinewood Kurier', unter: 'Unabhängig seit 2019',
             spruch: 'Was in dieser Stadt passiert, steht hier.' },
    grenzen: { kopf: 60, text: 240 },
    arten: [{ id: 'klein', name: 'Kleinanzeige', preis: 150 },
            { id: 'gross', name: 'Halbe Seite', preis: 900 }],
    rubriken: [{ id: 'stadt', name: 'Stadt', text: 'Was gemeldet wurde.' },
               { id: 'markt', name: 'Markt', text: '' }],
    leer: { blatt: 'Für diese Ausgabe liegt noch nichts vor.' } },
  { action: 'auf', ansicht: 'blatt' },
  { action: 'ausgabe', nummer: 148, datum: 'Montag, 18. August', redaktion: false,
    neueste: true, aelteste: false,
    meldungen: [
      { id: 1, rubrik: 'stadt', kopf: 'Alta Street wieder frei',
        text: 'Die Sperrung an der Alta Street ist seit gestern Abend aufgehoben.',
        absender: 'Stadtverwaltung', wann: 'Heute 08:10' },
      { id: 2, rubrik: 'stadt', kopf: 'Werkstatt sucht Aushilfe',
        text: 'Die Werkstatt Vinewood sucht eine Aushilfe für Spätschichten.',
        absender: 'M. Braun', wann: 'Gestern 18:40' },
      { id: 3, rubrik: 'markt', kopf: 'Sentinel abzugeben',
        text: 'Ubermacht Sentinel, gepflegt, Motor überholt. Gegen Gebot.',
        absender: 'L. Steckel', wann: 'Gestern 12:05' },
    ] },
] };

/* Nicht jede Oberflaeche haengt in `.sk-pane` — drei bringen ihre eigene
   Huelle mit. Der Rahmen soll das Fenster zeigen, nicht den Vollbildgrund. */
NUTZLAST.skillry_chat.ziel = '#c-chat';
NUTZLAST.skillry_tablet.ziel = '.t-root';
NUTZLAST.skillry_zeitung.ziel = '.z-huelle';

/* `zustand` ist ein Wort, kein Prozentwert — hier/anderswo/draussen/verwahrt.
   Die Zahlen dahinter sind motor/karosserie/tank. */
NUTZLAST.skillry_garage.nachrichten[1].liste[0].zustand = 'hier';
NUTZLAST.skillry_garage.nachrichten[1].liste[1].zustand = 'hier';
NUTZLAST.skillry_garage.nachrichten[1].liste[2].zustand = 'anderswo';
NUTZLAST.skillry_garage.klicks = ['.g-karte'];

/* `arten` ist eine flache Liste von Typwoertern (arten.indexOf(e.typ)), und
   motor/karosserie/tank sind Brueche zwischen 0 und 1, keine Prozentzahlen. */
NUTZLAST.skillry_garage.nachrichten[1].arten = ['limousine', 'gelaende', 'motorrad'];
for (const [f, m, k, t] of [[0, 0.98, 0.94, 0.72], [1, 0.84, 0.78, 0.41], [2, 0.39, 0.51, 0.88]]) {
  Object.assign(NUTZLAST.skillry_garage.nachrichten[1].liste[f], { motor: m, karosserie: k, tank: t });
}

/* Nicht die Vollbildhuelle, sondern das Fenster darin. */
NUTZLAST.skillry_zeitung.ziel = '.z-platte';
NUTZLAST.skillry_tablet.ziel = '.t-rahmen';

NUTZLAST.skillry_tablet.klicks = ['.t-eintrag'];
NUTZLAST.skillry_tablet.danach = [
  { action: 'notizText', notiz: { id: 1, titel: 'Werkstatt Vinewood',
    text: 'Sentinel steht seit Freitag drin.\n\nMotor auf 98 gebracht, Lack neu, '
        + 'Bremsen hinten getauscht. Rechnung liegt bei M. Braun.\n\nAbholung noch offen — '
        + 'er wollte sich melden, sobald die Spaetschicht steht.' } },
];

/* Werkstatt: Dienste, Lacke und Finishes haengen alle am `stand`. */
Object.assign(NUTZLAST.skillry_karte.nachrichten[1], {
  konto: 'bank', guthaben: 12750, rabatt: 0,
  dienste: [
    { id: 'motor', name: 'Motor instand setzen', preis: 1400, art: 'motor' },
    { id: 'karosserie', name: 'Karosserie richten', preis: 950, art: 'karosserie' },
    { id: 'waesche', name: 'Waschen', preis: 120, art: 'dreck' },
    { id: 'lack', name: 'Lackieren', preis: 600, art: 'lack',
      preisJeFinish: { matt: 600, glanz: 750, metallic: 1100 } },
    { id: 'raeder', name: 'Räder wuchten', preis: 260, art: 'raeder',
      gesperrt: true, grund: 'Die Hebebühne ist belegt.' },
  ],
  lacke: [
    { id: 'schwarz', name: 'Schwarz', hex: '#14171c' },
    { id: 'graphit', name: 'Graphit', hex: '#3a4149' },
    { id: 'silber', name: 'Silber', hex: '#b9c0c7' },
    { id: 'weiss', name: 'Weiß', hex: '#e8ebee' },
    { id: 'blau', name: 'Signalblau', hex: '#2f81f7' },
    { id: 'gruen', name: 'Tannengrün', hex: '#1f6f45' },
    { id: 'rot', name: 'Weinrot', hex: '#7d1f27' },
    { id: 'sand', name: 'Sand', hex: '#c2ab7f' },
  ],
  finish: [
    { id: 'matt', name: 'Matt' },
    { id: 'glanz', name: 'Glanz' },
    { id: 'metallic', name: 'Metallic' },
  ],
});
NUTZLAST.skillry_karte.klicks = ['.w-dienst'];

/* ── Charakterauswahl ───────────────────────────────────────────────────── */
NUTZLAST.skillry_charakter = { ziel: '.sk-pane', warten: 900, nachrichten: [
  { action: 'aufbau',
    person: { herkunft: ['Los Santos', 'Liberty City', 'Vice City'], groesseVon: 150, groesseBis: 210 },
    ansichten: [{ id: 'ganz', name: 'Ganze Figur' }, { id: 'kopf', name: 'Kopf' }] },
  { action: 'auf', schritt: 'auswahl' },
  { action: 'charaktere', plaetze: 4, wartetext: '',
    liste: [
      { kennung: 'a1', platz: 1, vorname: 'Lucas', nachname: 'Steckel', beruf: 'Mechaniker',
        herkunft: 'Los Santos', geburtstag: '14.03.1996', alterSek: 5400, zustand: 'frei' },
      { kennung: 'a2', platz: 2, vorname: 'Marek', nachname: 'Braun', beruf: 'Taxifahrer',
        herkunft: 'Liberty City', geburtstag: '02.11.1988', alterSek: 262000, zustand: 'frei' },
      { kennung: 'a3', platz: 3, vorname: 'Nora', nachname: 'Feld', beruf: 'Ohne Beschäftigung',
        herkunft: 'Vice City', geburtstag: '27.07.2001', alterSek: 900, zustand: 'wartet' },
      { platz: 4, zustand: 'leer' },
    ] },
] };

/* ── Pausenmenue ────────────────────────────────────────────────────────── */
NUTZLAST.skillry_pause = { ziel: '.pm-blatt', warten: 900, nachrichten: [
  { action: 'aufbau', escape: true, taste: 'F4', befehl: 'pause', gtaMenue: false,
    abschnitte: [
      { id: 'start', name: 'Start' }, { id: 'profil', name: 'Profil' },
      { id: 'spieler', name: 'Spieler' }, { id: 'regeln', name: 'Regeln' },
      { id: 'hilfe', name: 'Hilfe' }, { id: 'einstellungen', name: 'Einstellungen' },
    ],
    kacheln: [
      { ziel: 'profil', name: 'Mein Ausweis', bild: 'ausweis' },
      { ziel: 'spieler', name: 'Wer ist da', bild: 'spieler' },
      { ziel: 'regeln', name: 'Regeln', bild: 'regeln' },
      { ziel: 'hilfe', name: 'Hilfe', bild: 'hilfe' },
      { ziel: 'einstellungen', name: 'Einstellungen', bild: 'zahnrad' },
    ] },
  { action: 'auf' },
  { action: 'ich', ich: { name: 'Lucas Steckel', geburtstag: '14.03.1996',
      herkunft: 'Los Santos', groesseCm: 182 } },
  { action: 'server', server: { spieler: 47, max: 64, modus: 'oeffentlich', stunde: 21, minute: 40 } },
] };

/* ── Werkbank ───────────────────────────────────────────────────────────── */
NUTZLAST.skillry_werkbank = { warten: 800, nachrichten: [
  { action: 'auf',
    rechte: { animation: true, partikel: true, modell: true, kamera: true, messen: true },
    beispiele: { animation: { dict: 'amb@world_human_clipboard@male@idle_a', name: 'idle_a' },
                 partikel: { asset: 'core', name: 'exp_grd_bzgas_smoke' },
                 objekt: 'prop_tool_bench02', fahrzeug: 'sentinel' },
    effekte: ['DeathFailOut', 'ChopVision', 'DrugsMichaelAliensFight', 'FocusIn', 'REDMIST'],
    zeitstufen: ['Morgens', 'Mittags', 'Abends', 'Nachts'] },
] };

NUTZLAST.skillry_charakter.ziel = '#k-mitte';
NUTZLAST.skillry_werkbank.ziel = '.wb-root';

/* Die Kachelbilder heissen `kachel-<ziel>.jpg` und liegen in html/bilder/. */
for (const k of NUTZLAST.skillry_pause.nachrichten[0].kacheln) k.bild = `kachel-${k.ziel}.jpg`;

/* Acht Kacheln statt fuenf — sonst steht die untere Rasterhaelfte leer.
   Eine Kachel erscheint nur, wenn ihr Ziel auch in `abschnitte` steht. */
for (const [id, name] of [['belohnung', 'Belohnungen'], ['battlepass', 'Battlepass'], ['shop', 'Shop']]) {
  NUTZLAST.skillry_pause.nachrichten[0].abschnitte.push({ id, name });
  NUTZLAST.skillry_pause.nachrichten[0].kacheln.push({ ziel: id, name, bild: `kachel-${id}.jpg` });
}

/* Leere Plaetze baut `kartenZeichnen` selbst aus `plaetze` — ein Eintrag mit
   zustand 'leer' erzeugt dagegen eine Charakterkarte ohne Inhalt. */
NUTZLAST.skillry_charakter.nachrichten[2].liste.pop();
NUTZLAST.skillry_charakter.hintergrund = '#06080c';
NUTZLAST.skillry_werkbank.ziel = '.wb-blatt';

/* Auch die Werkbank ist hinten offen — sie liegt im Spiel ueber der Welt. */
NUTZLAST.skillry_werkbank.hintergrund = '#06080c';
