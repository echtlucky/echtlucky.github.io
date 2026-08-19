/**
 * The FiveM scripts, with a basket.
 *
 * Three decisions shape this file, and all three are about what the page is
 * NOT allowed to do:
 *
 *   1. **No script source reaches the browser.** Everything rendered here comes
 *      from content/scripts.json: name, version, one sentence of description,
 *      declared dependencies. No Lua, no config, no excerpt. Not as a
 *      precaution — as an acknowledgement. Whatever a browser loads, anybody
 *      can read; minifying and obfuscating are a threshold measured in minutes.
 *      The protection that actually holds is Cfx.re Asset Escrow and the
 *      licence check, and both are documented on /api/ rather than claimed
 *      here.
 *
 *   2. **No invented facts.** Every version number is the one in the
 *      resource's own fxmanifest.lua. No price is shown, because none is set —
 *      the field exists and renders when it is filled. Every count on the page
 *      (how many scripts, how many priced, how many with a screenshot) is
 *      derived from the file at build time, so a sentence cannot rot into a
 *      lie when somebody edits the data.
 *
 *   3. **No checkout.** The basket collects a selection and ends in a message
 *      to a human being. A half-built till would be worse than none.
 *
 * The page reads without JavaScript: every product and description is in the
 * HTML, and <details> opens without a script. JavaScript adds three things —
 * the view switch, opening from a #produkt- link, and the basket. The controls
 * for those are hidden by a <noscript> stylesheet rather than shown and dead.
 */

import { href, SITE } from '../layout.mjs';
import { grainOn } from '../grain.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Stufe 2 — gehalten.
 *
 * Auftritte beim Eintreten und Hover-Tiefe, aber KEINE an den Bildlauf
 * gekoppelte Bewegung: diese Seite wird gelesen, nicht bestaunt. Das
 * Schaufenster ist die Startseite. Stufen: `docs/UMBAU-PLAN.md`.
 */
export const bewegung = 2;

export const slug = 'scripts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = JSON.parse(readFileSync(join(ROOT, 'content', 'scripts.json'), 'utf8'));

const PRODUCTS = DATA.products;
const N = PRODUCTS.length;
/**
 * Die Spiele, die es hier tatsaechlich gibt — aus den Daten, nicht von Hand.
 *
 * Das Feld `spiel` steht in `content/scripts.json` noch nirgends; alle 37
 * Eintraege sind FiveM-Ressourcen und damit GTA V. Die Vorgabe steht deshalb
 * hier im Code. Sobald ein Produkt sein `spiel` mitbringt, taucht das Spiel von
 * selbst als Knopf auf — dieselbe Zeile, ein Knopf mehr.
 *
 * **Ein Spiel ohne Eintraege bekommt keinen Knopf.** Ein Filter, der auf eine
 * leere Liste fuehrt, ist kein Filter, sondern eine Sackgasse; dieselbe Regel
 * gilt im Menue in `build/header.mjs`.
 */
const SPIEL_NAMEN = {
  gta5: { en: 'GTA V', de: 'GTA V' },
  gta6: { en: 'GTA VI', de: 'GTA VI' },
  egal: { en: 'Game-independent', de: 'Spielunabhängig' },
};
const SPIEL_VON = (p) => p.spiel ?? 'gta5';
const SPIEL_ANZAHL = PRODUCTS.reduce((z, p) => {
  const g = SPIEL_VON(p);
  z[g] = (z[g] ?? 0) + 1;
  return z;
}, Object.create(null));

/** „Alle" zuerst, danach jedes Spiel mit Eintraegen in fester Reihenfolge. */
const SPIELE = [
  { key: 'alle', l: { en: 'All', de: 'Alle' }, n: PRODUCTS.length },
  ...Object.keys(SPIEL_NAMEN)
    .filter((k) => SPIEL_ANZAHL[k])
    .map((k) => ({ key: k, l: SPIEL_NAMEN[k], n: SPIEL_ANZAHL[k] })),
];

const N_PRICED = PRODUCTS.filter((p) => typeof p.price === 'number').length;
const MEDIEN = (p) => (Array.isArray(p.media) ? p.media : []);
/* Zwei Zahlen und nicht eine: die Oberflaechen sind aus den echten Dateien
   gezeichnet, die Aufnahmen kommen aus dem laufenden Spiel. Beides unter
   „Aufnahme" zu zaehlen waere bequem und gelogen. */
const OBERFLAECHE = (m) => m.kind === 'ui' || m.kind === 'shared-ui';
const N_UI = PRODUCTS.filter((p) => MEDIEN(p).some(OBERFLAECHE)).length;
const N_SHOT = PRODUCTS.filter((p) => MEDIEN(p).some((m) => !OBERFLAECHE(m))).length;
const N_MEDIA = PRODUCTS.filter((p) => MEDIEN(p).length > 0).length;
const N_STABLE = PRODUCTS.filter((p) => !/^0\./.test(String(p.version))).length;

/** Every headline on this page counts something, and a catalogue of one is a
 *  perfectly ordinary state for it to be in on its first day. */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const meta = {
  en: {
    title: 'Scripts — the Skillry FiveM resources, with a basket · Skillry',
    description:
      'Every Skillry FiveM resource with its version and the dependencies it declares, as a grid or a list. A basket that collects a selection and hands it to a human being — no checkout, no prices until there are prices, and no script source in your browser.',
  },
  de: {
    title: 'Skripte — die FiveM-Ressourcen von Skillry, mit Warenkorb · Skillry',
    description:
      'Jede FiveM-Ressource von Skillry mit ihrer Fassung und den Abhängigkeiten, die sie deklariert — als Raster oder als Liste. Ein Warenkorb, der eine Auswahl sammelt und an einen Menschen übergibt: keine Kasse, keine Preise solange keine feststehen, und kein Skriptcode in deinem Browser.',
  },
};

// ---------------------------------------------------------------------------
// Strings
// ---------------------------------------------------------------------------

const T = {
  en: {
    eyebrow: 'FiveM · Skillry resources',
    h1: `${plural(N, 'FiveM script', 'FiveM scripts')}. A basket, and no checkout.`,
    lede:
      'The Skillry FiveM resources, listed one by one with the version each of them declares. Put together whatever interests you — the basket collects the selection and hands it to a human being. Nothing is paid for here, nothing is downloaded here, and <strong>the source of a script that is for sale never reaches this browser</strong>.',
    countLine: `${plural(N, 'script', 'scripts')} · data last touched ${DATA.updated}`,

    filterLabel: 'Filter by game',
    countPattern: '{n} of {all} scripts',
    viewLabel: 'View',
    viewGrid: 'Grid',
    viewList: 'List',
    countWord: plural(N, 'script', 'scripts'),

    honestH: 'Three things this page deliberately does not have',
    honest: [
      [
        'Prices',
        N_PRICED === 0
          ? 'Not one script here carries a price, because not one has been set. A number somebody takes for real is worse than no number. The field exists in <code>content/scripts.json</code>; fill it in and it appears here and in the basket.'
          : `A price is set for ${N_PRICED} of ${N} scripts. The rest have none, and show none — a number somebody takes for real is worse than no number.`,
      ],
      [
        'A checkout',
        'There is no payment step and no payment provider. The basket ends in a message you send yourself. A half-built till would be worse than none at all.',
      ],
      [
        'Screenshots that do not exist',
        N_MEDIA === 0
          ? 'There is nothing to show for any of these scripts yet. Rather than invent something, every preview is an empty frame that says what belongs there.'
          : `${N_UI} of ${N} scripts show their interface, drawn from the real files with sample data. ${N_SHOT === 0 ? 'None' : String(N_SHOT)} show a recording from the running game. The remaining ${N - N_MEDIA} show an empty frame that says what belongs there, instead of something invented.`,
      ],
    ],

    listH: 'Every script',
    detailWord: 'Details',
    requiresWord: 'Requires',
    docWord: 'The whole contract is on the API page',
    permaWord: 'Link to this script',
    addWord: 'Add to basket',
    addedWord: 'In the basket',
    noShotCaption:
      'No recording of this script exists yet. A screenshot or a short clip from the game belongs here — this frame is a gap, not a picture of anything.',
    noShotLabel: 'No material',
    shotCaption: 'A recording from the game.',
    uiCaption: 'The interface of the script, with sample data. Rendered from the real files, not a mock-up.',
    sharedCaption: 'What this script puts on screen — drawn by the shared interface skillry_ui, with sample data from the real files.',

    versionH: 'What the version number on each card means',
    versionP: `It is the <code>version</code> from the resource's own <code>fxmanifest.lua</code>, unchanged. Nothing on this page derives a status from it: anything below 1.0.0 is unfinished, and the description is the best guide to what that means in each case. Today: ${N_STABLE} of ${N} at 1.0.0 or above.`,

    basketH: 'Basket',
    basketP:
      'The basket lives on this page and nowhere else. No other page has one; the header only links here. The selection stays in your own browser and is sent to nobody until you send it yourself.',
    basketNoJs:
      'The basket needs JavaScript. Without it every script and every description is still on this page — just write to me and name the ones you mean.',
    basketEmpty: 'Nothing selected yet. Every card has a button.',
    basketOne: 'item',
    basketMany: 'items',
    removeWord: 'Remove',
    clearWord: 'Empty the basket',
    copyWord: 'Copy the list',
    copiedWord: 'Copied.',
    copyFailWord: 'Your browser would not copy it. Select the text above and copy it yourself.',
    mailWord: 'Send by email',
    discordWord: 'Send on Discord',
    discordHint: 'Copy the list first — a Discord link cannot carry it for you.',
    mailSubject: 'Skillry scripts — enquiry',
    tooLong:
      'The list is too long for a prepared email. Copy it and send it yourself.',
    noPriceFoot:
      'No price is stored for any of these. This list is a selection, not an invoice.',
    someNoPriceOne: 'One item has no price stored, so there is no total.',
    someNoPriceMany: '{n} items have no price stored, so there is no total.',
    sumWord: 'Total',
    textHead: 'Basket — Skillry FiveM scripts',
    textLabel: 'The basket as plain text, ready to copy',
    barGo: 'Go to the basket',

    truthH: 'Why there is no script code on this page',
    truth: [
      'Whatever a browser loads, anybody can read. Minifying and obfuscating are a threshold of a few minutes, not a lock — and nothing on this site will tell you otherwise.',
      'So of the resources that are for sale, this page carries only what is public anyway: the name, the version, one sentence, and the dependencies each one declares. No Lua, no configuration, not one excerpt.',
      'The protection that does hold sits elsewhere, and it is written out in full on this site rather than asserted here. <strong>Cfx.re Asset Escrow</strong> encrypts the resource on delivery, so the customer never receives readable Lua at all. <strong>The licence check</strong> answers whether a subscription still applies today, and can be revoked. Escrow is the part that stops an attacker; the licence check is the part that can end a subscription. Neither replaces the other.',
      'That is also why a preview here is always a picture, a recording or a rebuilt mock-up — never delivered source.',
    ],
    truthCta: 'Read the licence API in full',

    askH: 'Before you order',
    askP:
      'Questions about a script, about what it needs, or about whether two of them get along: ask in the forum, or write directly. The site notice has the address.',
    askForum: 'Go to the forum',
    askImpressum: 'Site notice and contact',
  },

  de: {
    eyebrow: 'FiveM · Skillry-Ressourcen',
    h1: `${plural(N, 'FiveM-Skript', 'FiveM-Skripte')}. Ein Warenkorb, keine Kasse.`,
    lede:
      'Die FiveM-Ressourcen von Skillry, einzeln aufgelistet, jede mit der Fassung, die sie deklariert. Leg zusammen, was dich interessiert — der Warenkorb sammelt die Auswahl und übergibt sie an einen Menschen. Hier wird nichts bezahlt, hier wird nichts heruntergeladen, und <strong>der Quelltext eines verkauften Skripts erreicht diesen Browser nie</strong>.',
    countLine: `${plural(N, 'Skript', 'Skripte')} · Daten zuletzt angefasst ${DATA.updated}`,

    filterLabel: 'Nach Spiel filtern',
    countPattern: '{n} von {all} Skripten',
    viewLabel: 'Ansicht',
    viewGrid: 'Raster',
    viewList: 'Liste',
    countWord: plural(N, 'Skript', 'Skripte'),

    honestH: 'Drei Dinge, die diese Seite bewusst nicht hat',
    honest: [
      [
        'Preise',
        N_PRICED === 0
          ? 'Bei keinem Skript steht ein Preis, weil keiner feststeht. Eine Zahl, die jemand für echt hält, ist schlimmer als keine. Das Feld gibt es in <code>content/scripts.json</code>; sobald es gefüllt ist, erscheint der Preis hier und im Warenkorb.'
          : `Bei ${N_PRICED} von ${N} Skripten steht ein Preis. Bei den übrigen steht keiner, weil keiner feststeht — eine Zahl, die jemand für echt hält, ist schlimmer als keine.`,
      ],
      [
        'Eine Kasse',
        'Es gibt keinen Bezahlvorgang und keinen Zahlungsanbieter. Der Warenkorb endet in einer Nachricht, die du selbst abschickst. Eine halb gebaute Kasse wäre schlimmer als gar keine.',
      ],
      [
        'Screenshots, die es nicht gibt',
        N_MEDIA === 0
          ? 'Zu keinem dieser Skripte liegt bisher etwas vor. Statt etwas zu erfinden, steht in jeder Vorschau ein leerer Rahmen, der sagt, was dort hingehört.'
          : `${N_UI} von ${N} Skripten zeigen ihre Oberfläche, aus den echten Dateien mit Beispieldaten gezeichnet. ${N_SHOT === 0 ? 'Keines' : String(N_SHOT)} zeigt eine Aufnahme aus dem laufenden Spiel. Die übrigen ${N - N_MEDIA} zeigen einen leeren Rahmen, der sagt, was dort hingehört — statt etwas Erfundenes.`,
      ],
    ],

    listH: 'Alle Skripte',
    detailWord: 'Einzelheiten',
    requiresWord: 'Braucht',
    docWord: 'Der ganze Vertrag steht auf der API-Seite',
    permaWord: 'Link auf dieses Skript',
    addWord: 'In den Warenkorb',
    addedWord: 'Im Warenkorb',
    noShotCaption:
      'Zu diesem Skript gibt es noch keine Aufnahme. Hier gehört ein Screenshot oder ein kurzer Ausschnitt aus dem Spiel hin — dieser Rahmen ist eine Leerstelle, kein Bild von irgendetwas.',
    noShotLabel: 'Kein Material',
    shotCaption: 'Eine Aufnahme aus dem Spiel.',
    uiCaption: 'Die Oberfläche des Skripts, mit Beispieldaten. Aus den echten Dateien gezeichnet, kein Entwurf.',
    sharedCaption: 'Was dieses Skript auf den Schirm bringt — gezeichnet von der gemeinsamen Oberfläche skillry_ui, mit Beispieldaten aus den echten Dateien.',

    versionH: 'Was die Fassung auf jeder Karte bedeutet',
    versionP: `Es ist die <code>version</code> aus der <code>fxmanifest.lua</code> der Ressource, unverändert. Diese Seite leitet daraus keinen Status ab: Alles unter 1.0.0 ist nicht fertig, und was das im Einzelfall heißt, sagt am ehesten die Beschreibung. Stand heute: ${N_STABLE} von ${N} bei 1.0.0 oder höher.`,

    basketH: 'Warenkorb',
    basketP:
      'Der Warenkorb liegt auf dieser Seite und sonst nirgends. Keine andere Seite hat einen; die Kopfleiste verlinkt nur hierher. Die Auswahl bleibt in deinem eigenen Browser und geht an niemanden, bis du sie selbst schickst.',
    basketNoJs:
      'Der Warenkorb braucht JavaScript. Ohne JavaScript stehen alle Skripte und alle Beschreibungen trotzdem auf dieser Seite — schreib einfach und nenn die, die du meinst.',
    basketEmpty: 'Noch nichts ausgewählt. Auf jeder Karte sitzt ein Knopf.',
    basketOne: 'Position',
    basketMany: 'Positionen',
    removeWord: 'Entfernen',
    clearWord: 'Warenkorb leeren',
    copyWord: 'Liste kopieren',
    copiedWord: 'Kopiert.',
    copyFailWord: 'Dein Browser wollte nicht kopieren. Markier den Text oben und kopier ihn selbst.',
    mailWord: 'Per Mail schicken',
    discordWord: 'Auf Discord schicken',
    discordHint: 'Kopier die Liste vorher — ein Discord-Link kann sie nicht mitnehmen.',
    mailSubject: 'Skillry-Skripte — Anfrage',
    tooLong:
      'Die Liste ist zu lang für eine vorbereitete Mail. Kopier sie und schick sie selbst.',
    noPriceFoot:
      'Zu keiner Position ist ein Preis hinterlegt. Diese Liste ist eine Auswahl, keine Rechnung.',
    someNoPriceOne: 'Zu einer Position ist kein Preis hinterlegt, deshalb steht hier keine Summe.',
    someNoPriceMany: 'Zu {n} Positionen ist kein Preis hinterlegt, deshalb steht hier keine Summe.',
    sumWord: 'Summe',
    textHead: 'Warenkorb — Skillry-FiveM-Skripte',
    textLabel: 'Der Warenkorb als Text zum Kopieren',
    barGo: 'Zum Warenkorb',

    truthH: 'Warum hier kein Skriptcode steht',
    truth: [
      'Was ein Browser lädt, kann jeder lesen. Minifizieren und Verschleiern sind eine Schwelle von Minuten, kein Schloss — und nichts auf dieser Seite wird dir etwas anderes erzählen.',
      'Deshalb trägt diese Seite von den verkauften Ressourcen nur, was ohnehin öffentlich ist: den Namen, die Fassung, einen Satz, und die Abhängigkeiten, die jede von ihnen deklariert. Kein Lua, keine Konfiguration, nicht ein Ausschnitt.',
      'Der Schutz, der wirklich hält, liegt woanders — und er ist auf der API-Seite vollständig nachzulesen, statt hier bloß behauptet zu werden. <strong>Cfx.re Asset Escrow</strong> verschlüsselt die Ressource bei der Auslieferung, der Kunde bekommt also gar kein lesbares Lua. <strong>Die Lizenzprüfung</strong> beantwortet, ob ein Abo heute noch gilt, und lässt sich widerrufen. Escrow ist der Teil, der einen Angreifer aufhält; die Lizenzprüfung ist der Teil, der ein Abo beenden kann. Keines ersetzt das andere.',
      'Genau deshalb ist eine Vorschau hier immer ein Bild, eine Aufnahme oder ein Nachbau — nie ausgelieferter Quelltext.',
    ],
    truthCta: 'Die Lizenz-API vollständig lesen',

    askH: 'Bevor du bestellst',
    askP:
      'Fragen zu einem Skript, zu dem, was es braucht, oder dazu, ob zwei davon miteinander können: frag im Forum oder schreib direkt. Die Adresse steht im Impressum.',
    askForum: 'Zum Forum',
    askImpressum: 'Impressum und Kontakt',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The anchor of a single product. Stable across languages, so a shared link
 *  keeps working when the reader switches language. */
const anchor = (id) => `produkt-${String(id).replace(/_/g, '-')}`;

/**
 * A price, or nothing at all. Intl needs full ICU; Node has shipped it by
 * default for years, but a build that throws because of a currency symbol
 * would be an absurd way to lose a page.
 */
function money(value, lang) {
  if (typeof value !== 'number' || !isFinite(value)) return '';
  try {
    return new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB', {
      style: 'currency',
      currency: DATA.currency || 'EUR',
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${DATA.currency || 'EUR'}`;
  }
}

const CHEV = `<svg class="sh-chev" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 4l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** The preview: real material when there is some, an honest gap when there is not. */
function preview(p, t, lang) {
  const m = Array.isArray(p.media) ? p.media[0] : null;

  if (!m || !m.src) {
    return `<figure class="sh-shot">
      <div class="sh-frame"><span class="mono">${esc(t.noShotLabel)}</span></div>
      <figcaption class="small muted">${esc(t.noShotCaption)}</figcaption>
    </figure>`;
  }

  const alt = esc(m.alt?.[lang] ?? m.alt?.en ?? '');
  const media =
    m.type === 'video'
      ? // preload="none" so an unopened card fetches nothing, and no autoplay:
        // a page full of looping clips is exactly the thing this site avoids.
        `<video controls playsinline preload="none" width="${Number(m.w) || 1600}" height="${Number(m.h) || 900}"><source src="${esc(m.src)}"></video>`
      : `<img src="${esc(m.src)}" width="${Number(m.w) || 1600}" height="${Number(m.h) || 900}" loading="lazy" decoding="async" alt="${alt}">`;

  /* Zwei Arten Material, zwei Saetze. Eine Oberflaeche, die mit
     Beispieldaten aus ihren eigenen Dateien gezeichnet wurde, ist keine
     Aufnahme aus dem Spiel — und darf auch nicht so heissen. */
  /* Manche Skripte haben gar keine eigene Oberflaeche und zeichnen durch
     skillry_ui. Ihr Bild ist echt, aber es ist nicht ihr Fenster — und
     „Die Oberflaeche des Skripts" waere dafuer die falsche Zeile. */
  const unter = m.kind === 'ui' ? t.uiCaption
    : m.kind === 'shared-ui' ? t.sharedCaption
    : t.shotCaption;
  return `<figure class="sh-shot">${media}<figcaption class="small muted">${esc(unter)}</figcaption></figure>`;
}

function card(p, t, lang) {
  const id = anchor(p.id);
  const title = esc(p.title?.[lang] ?? p.title?.en ?? p.id);
  const summary = esc(p.summary?.[lang] ?? p.summary?.en ?? '');
  const price = money(p.price, lang);
  const requires = Array.isArray(p.requires) ? p.requires : [];

  const docLink = p.doc
    ? `<p class="small"><a href="${href(lang, p.doc)}">${esc(t.docWord)} <span aria-hidden="true">→</span></a></p>`
    : '';

  const requiresLine = requires.length
    ? `<p class="small muted sh-req">${esc(t.requiresWord)}: ${requires
        .map((r) => `<code>${esc(r)}</code>`)
        .join(' ')}</p>`
    : '';

  /*
   * `data-spiel` an jeder Karte, und der Filter liest nur dieses Merkmal.
   *
   * Nicht der Filter kennt die Produkte, sondern die Karte kennt ihr Spiel.
   * Damit ist ein neues Spiel eine Zeile in `content/scripts.json` und keine
   * Aenderung am Filter — dieselbe Bauart wie bei den Bereitstellern in
   * `skillry-lizenz/src/bereitstellung.js`.
   */
  return `<li class="sh-item" id="${id}" data-spiel="${esc(p.spiel ?? 'gta5')}">
  <details class="sh-d">
    <summary class="sh-sum">
      <span class="sh-h">
        <span class="sh-title">${title}</span>
        <span class="sh-ver mono">v${esc(p.version)}</span>
        ${price ? `<span class="sh-price">${esc(price)}</span>` : ''}
      </span>
      <span class="sh-res mono">${esc(p.id)}</span>
      <span class="sh-sub">${summary}</span>
      <span class="sh-more">${esc(t.detailWord)}${CHEV}</span>
    </summary>
    <div class="sh-body">
      ${preview(p, t, lang)}
      ${requiresLine}
      ${docLink}
      <p class="small"><a class="sh-perma" href="${href(lang, slug)}#${id}">${esc(t.permaWord)}</a></p>
    </div>
  </details>
  <div class="sh-act js-only">
    <button type="button" class="btn sh-add" data-add="${esc(p.id)}" aria-pressed="false">${esc(t.addWord)}</button>
  </div>
</li>`;
}

// ---------------------------------------------------------------------------
// The stylesheet, which only this page loads
// ---------------------------------------------------------------------------

const CSS = `
.sh-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
.sh-tools .sh-count { margin-left: auto; font-variant-numeric: tabular-nums; }

/* ── Die Filterknoepfe ────────────────────────────────────────────────────── */

/*
 * Sie sehen aus wie die Ansichtsumschaltung daneben, weil sie dasselbe tun:
 * beide aendern, WIE die Liste erscheint, und nicht, was sie enthaelt. Zwei
 * verschiedene Formen fuer zwei gleichartige Griffe waeren zwei Erfindungen.
 */
.sh-filter { display: flex; gap: 2px; padding: 2px; border: 1px solid var(--border); border-radius: 999px; }
.sh-spiel {
  border: 0; background: none; color: var(--fg-muted); cursor: pointer;
  font: inherit; font-size: 0.84rem; padding: 5px 12px; border-radius: 999px;
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  transition: background var(--kurz) var(--ease), color var(--kurz) var(--ease);
}
.sh-spiel:hover { color: var(--fg); background: var(--surface-2); }
/* Der gewaehlte Filter traegt die Marke — dieselbe Rolle wie der aktive Punkt
   in der Navigation: hier passiert gerade etwas. */
.sh-spiel[aria-pressed="true"] {
  background: var(--marke-flaeche); color: var(--marke-auf-flaeche); font-weight: 600;
}
.sh-spiel em {
  font-style: normal; font-size: 0.85em; font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
.sh-spiel[aria-pressed="true"] em { opacity: 1; }

@media (max-width: 560px) {
  .sh-tools { flex-wrap: wrap; }
  .sh-tools .sh-count { margin-left: 0; width: 100%; }
}

.sh-list { list-style: none; margin: 0; padding: 0; }
.sh-list[data-view="grid"] { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.sh-list[data-view="list"] { display: flex; flex-direction: column; gap: 10px; }

.sh-item {
  display: flex; flex-direction: column; min-width: 0;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); box-shadow: var(--e1), var(--sheen);
  /* The header is sticky, so an anchor that lands flush with the top lands
     underneath it. */
  scroll-margin-top: 84px;
}
.sh-item.in-cart { border-color: var(--accent-idx); }

/* Setting display on a summary removes the native marker, so the chevron in
   .sh-more is the marker. list-style covers Firefox, the pseudo covers WebKit. */
.sh-sum { display: grid; gap: 4px; padding: 16px 18px; cursor: pointer; list-style: none; }
.sh-sum::-webkit-details-marker { display: none; }
.sh-sum:focus-visible { outline: 2px solid var(--link); outline-offset: -2px; border-radius: var(--radius-lg); }
.sh-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; min-width: 0; }
.sh-title { font-weight: 650; font-size: 1.05rem; letter-spacing: -0.012em; overflow-wrap: anywhere; }
.sh-ver {
  font-size: 0.68rem; letter-spacing: 0.06em; color: var(--fg-subtle);
  border: 1px solid var(--border); border-radius: 999px; padding: 1px 8px; white-space: nowrap;
}
.sh-price { font-weight: 650; color: var(--accent-idx); white-space: nowrap; }
.sh-res { font-size: 0.76rem; color: var(--fg-subtle); overflow-wrap: anywhere; }
.sh-sub { color: var(--fg-muted); font-size: 0.92rem; margin-top: 0.35rem; }
.sh-more { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--link); margin-top: 0.35rem; }
.sh-chev { transition: transform var(--fast) var(--ease); }
.sh-d[open] .sh-chev { transform: rotate(180deg); }
@media (prefers-reduced-motion: reduce) { .sh-chev { transition: none; } }

.sh-body { padding: 0 18px 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.sh-req code { font-size: 0.78rem; }
.sh-perma { font-size: 0.8rem; }

.sh-shot { margin: 0; display: flex; flex-direction: column; gap: 8px; }
.sh-shot img, .sh-shot video {
  display: block; width: 100%; height: auto; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--surface-2);
}
/*
 * The empty frame. Deliberately not a mock-up of anything: a drawing of a
 * screen nobody has photographed is an invented screenshot with extra steps.
 * Hatching and a word, and the caption underneath says what belongs here.
 */
.sh-frame {
  aspect-ratio: 16 / 9; display: grid; place-items: center; padding: 12px; text-align: center;
  border: 1px dashed var(--border-strong); border-radius: var(--radius); color: var(--fg-subtle);
  background: repeating-linear-gradient(135deg,
    color-mix(in srgb, var(--fg) 5%, transparent) 0 2px, transparent 2px 12px);
}
.sh-frame span { font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; }

.sh-act { display: flex; gap: 10px; padding: 0 18px 16px; margin-top: auto; }
.sh-act .btn { padding: 8px 16px; font-size: 14px; }
.sh-add[aria-pressed="true"] { background: var(--accent-idx); border-color: var(--accent-idx); color: var(--bg); }

/* List view: the card becomes a row, with the button beside the text. */
.sh-list[data-view="list"] .sh-item { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
.sh-list[data-view="list"] .sh-d { grid-column: 1; min-width: 0; }
.sh-list[data-view="list"] .sh-act { grid-column: 2; padding: 16px 18px; margin-top: 0; }
@media (max-width: 560px) {
  .sh-list[data-view="list"] .sh-item { grid-template-columns: 1fr; }
  .sh-list[data-view="list"] .sh-act { grid-column: 1; padding: 0 18px 16px; }
}

/* ── the basket ─────────────────────────────────────────────────────────── */
.sh-cart {
  border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface);
  padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; box-shadow: var(--e1), var(--sheen);
}
.sh-cart-list {
  list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px;
  background: var(--border); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden auto; max-height: 60vh;
}
.sh-cart-list:empty { display: none; }
.sh-cart-list li { background: var(--surface); display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; padding: 10px 14px; }
.sh-cart-list .n { font-weight: 600; min-width: 0; overflow-wrap: anywhere; }
.sh-cart-list .r { font-family: var(--mono); font-size: 0.76rem; color: var(--fg-subtle); overflow-wrap: anywhere; }
.sh-cart-list .p { font-weight: 650; color: var(--accent-idx); }
.sh-cart-list .x {
  margin-left: auto; border: 1px solid var(--border); background: var(--surface-2); color: var(--fg-muted);
  font: inherit; font-size: 0.78rem; padding: 3px 10px; border-radius: 999px; cursor: pointer;
}
.sh-cart-list .x:hover { border-color: var(--border-strong); color: var(--fg); }
.sh-cart-text {
  width: 100%; min-height: 130px; max-height: 40vh; resize: vertical;
  font-family: var(--mono); font-size: 0.78rem; line-height: 1.6; padding: 12px 14px;
  border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface-2); color: var(--fg);
}
.sh-sum-line { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline; }
.sh-sum-line .t { font-weight: 650; font-size: 1.05rem; }

/*
 * The floating count. Rendered hidden and only shown once something is in the
 * basket, so nobody ever sees an empty bar following them down the page.
 */
.sh-bar {
  position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%); z-index: 40;
  display: flex; align-items: center; gap: 14px; max-width: calc(100vw - 32px);
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: 999px; padding: 8px 10px 8px 20px; box-shadow: var(--e3);
}
.sh-bar[hidden] { display: none; }
.sh-bar .n { font-size: 0.88rem; white-space: nowrap; }
.sh-bar .btn { padding: 7px 16px; font-size: 14px; border-radius: 999px; }

/* Shown only when JavaScript did not run; see the noscript block below. */
.sh-nojs { display: none; }

/*
 * A shop item is built exactly like a .card — --surface, one border, the same
 * radius and the same elevation — so it gets the same material. It is asked for
 * here rather than declared in build/grain.mjs because .sh-item exists on this
 * page and nowhere else, and a selector for it in the site-wide stylesheet
 * would be loaded by the Impressum to no purpose.
 */
${grainOn('.sh-item')}
`;

/**
 * Two stylesheets, and the second one is the point.
 *
 * A control that cannot work is worse than a control that is absent: the view
 * switch, the basket and every "add" button do nothing at all without
 * JavaScript. So they are hidden by a stylesheet that only exists when
 * scripting is off, and the paragraph explaining that is revealed by the same
 * rule. The alternative — hiding them by default and unhiding them from JS —
 * costs a visible flash on every load for a case that is much rarer.
 */
export function head() {
  return `<style>${CSS}</style><noscript><style>.js-only{display:none!important}.sh-nojs{display:block}</style></noscript>`;
}

// ---------------------------------------------------------------------------

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero hero-stage index" style="border-top:3px solid var(--accent-idx)">
  <div class="wrap stack">
    <span class="eyebrow accent-index">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <p class="small muted mono">${t.countLine}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack">
    <h2>${t.honestH}</h2>
    <div class="grid grid-3">
      ${t.honest.map(([h, p]) => `<div class="note warn"><h3>${h}</h3><p>${p}</p></div>`).join('')}
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack">
    <h2>${t.listH}</h2>
    <div class="sh-tools">
      <div class="level-toggle js-only" role="group" aria-label="${esc(t.viewLabel)}">
        <button type="button" class="sh-view" data-view="grid" aria-pressed="true">${esc(t.viewGrid)}</button>
        <button type="button" class="sh-view" data-view="list" aria-pressed="false">${esc(t.viewList)}</button>
      </div>
      <!--
        Der Filter steht neben der Ansicht und nicht darueber: beide aendern,
        WIE die Liste erscheint, und nicht, was sie enthaelt. Nur was
        Eintraege hat, bekommt einen Knopf — genau wie im Menue.
      -->
      <div class="sh-filter js-only" role="group" aria-label="${esc(t.filterLabel)}">
        ${SPIELE.map((g) => `<button type="button" class="sh-spiel" data-spiel="${g.key}" aria-pressed="${g.key === 'alle'}">${esc(g.l[lang])}<em>${g.n}</em></button>`).join('')}
      </div>
      <p class="small muted sh-count" id="shCount" role="status">${esc(t.countWord)}</p>
    </div>
    <ul class="sh-list" id="shList" data-view="grid">
      ${PRODUCTS.map((p) => card(p, t, lang)).join('\n')}
    </ul>
  </div>
</section>

<hr class="divider">

<section id="korb">
  <div class="wrap stack">
    <h2>${t.basketH}</h2>
    <p class="muted narrow">${t.basketP}</p>
    <p class="sh-nojs note">${t.basketNoJs}</p>
    <div class="sh-cart js-only" id="cartPanel">
      <p class="muted" id="cartEmpty">${esc(t.basketEmpty)}</p>
      <ul class="sh-cart-list" id="cartList"></ul>
      <div class="sh-sum-line" id="cartSum"></div>
      <label class="sr" for="cartText">${esc(t.textLabel)}</label>
      <textarea id="cartText" class="sh-cart-text" readonly rows="8"></textarea>
      <div class="btn-row" style="margin-top:0">
        <button type="button" class="btn btn-primary" id="cartCopy">${esc(t.copyWord)}</button>
        <a class="btn" id="cartDiscord" href="#korb" hidden>${esc(t.discordWord)}</a>
        <a class="btn" id="cartMail" href="#korb">${esc(t.mailWord)}</a>
        <button type="button" class="btn" id="cartClear">${esc(t.clearWord)}</button>
      </div>
      <p class="small muted" id="cartDiscordHint" hidden>${esc(t.discordHint)}</p>
      <p class="small muted" id="cartMsg" aria-live="polite"></p>
    </div>
  </div>
</section>

<!-- Keine Trennlinie: Was die Fassungsnummer bedeutet, erklaert die Karten direkt darueber. Getrennt durch eine Linie sucht man den Bezug. -->
<section class="anschluss">
  <div class="wrap stack narrow">
    <h2>${t.versionH}</h2>
    <p class="muted">${t.versionP}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack narrow">
    <h2>${t.truthH}</h2>
    ${t.truth.map((p) => `<p class="muted">${p}</p>`).join('')}
    <div class="btn-row">
      <a class="btn btn-primary" href="${href(lang, 'api')}">${esc(t.truthCta)}</a>
    </div>
  </div>
</section>

<!-- Keine Trennlinie: Was vor einer Bestellung zu klaeren ist, schliesst an den Absatz darueber an. -->
<section class="anschluss">
  <div class="wrap stack narrow">
    <h2>${t.askH}</h2>
    <p class="muted">${t.askP}</p>
    <div class="btn-row">
      <a class="btn" href="${href(lang, 'forum')}">${esc(t.askForum)}</a>
      <a class="btn" href="${href(lang, 'impressum')}">${esc(t.askImpressum)}</a>
      <a class="btn" href="${SITE.repoSite}/blob/main/content/scripts.json">content/scripts.json</a>
    </div>
  </div>
</section>

<div class="sh-bar js-only" id="cartBar" hidden>
  <span class="n"><span id="barCount">0</span> <span id="barWord"></span></span>
  <a class="btn btn-primary" href="#korb">${esc(t.barGo)}</a>
</div>
`;
}

// ---------------------------------------------------------------------------
// The client script: a view switch, an anchor that opens a card, and a basket.
// ---------------------------------------------------------------------------

export function script(lang) {
  const t = T[lang];

  // Only what the basket has to print. Not the descriptions — the basket lists
  // what you picked, and the descriptions are already on the page.
  const items = PRODUCTS.map((p) => ({
    i: p.id,
    t: p.title?.[lang] ?? p.title?.en ?? p.id,
    v: String(p.version),
    p: typeof p.price === 'number' ? p.price : null,
  }));

  const L = {
    add: t.addWord,
    added: t.addedWord,
    remove: t.removeWord,
    empty: t.basketEmpty,
    one: t.basketOne,
    many: t.basketMany,
    copied: t.copiedWord,
    copyFail: t.copyFailWord,
    tooLong: t.tooLong,
    noPrice: t.noPriceFoot,
    someOne: t.someNoPriceOne,
    someMany: t.someNoPriceMany,
    sum: t.sumWord,
    head: t.textHead,
    subject: t.mailSubject,
    discordHint: t.discordHint,
    zaehlMuster: t.countPattern,
  };

  const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

  return `
(function () {
  var ITEMS = ${json(items)};
  var L = ${json(L)};
  var HANDOFF = ${json({ discord: String(DATA.handoff?.discord || ''), email: String(DATA.handoff?.email || '') })};
  var CUR = ${json(DATA.currency || 'EUR')};
  var LOC = ${json(lang === 'de' ? 'de-DE' : 'en-GB')};
  var K_VIEW = 'skillry:scripts:view';
  var K_CART = 'skillry:scripts:cart';
  var MAX = 200;          // more positions than there are scripts, and a ceiling
  var MAILTO_MAX = 1800;  // beyond this a mailto: link stops being reliable

  var list = document.getElementById('shList');
  if (!list) return;

  // ── Der Filter nach Spiel ────────────────────────────────────────────────
  //
  // Er versteckt Karten, er entfernt sie nicht. Der Warenkorb, die Anker und
  // die Ansichtsumschaltung arbeiten unveraendert weiter — sie sehen dieselben
  // Elemente wie vorher, nur teilweise unsichtbar. Ein Filter, der die Liste
  // neu baut, muesste all das nachziehen.
  var KARTEN = [].slice.call(list.querySelectorAll('.sh-item'));
  var KNOEPFE = [].slice.call(document.querySelectorAll('.sh-spiel'));
  var zaehler = document.getElementById('shCount');
  var spielJetzt = 'alle';

  function spielSetzen(wahl, inAdresse) {
    if (wahl !== 'alle' && !KARTEN.some(function (k) { return k.dataset.spiel === wahl; })) wahl = 'alle';
    spielJetzt = wahl;

    var sichtbar = 0;
    for (var i = 0; i < KARTEN.length; i++) {
      var passt = wahl === 'alle' || KARTEN[i].dataset.spiel === wahl;
      KARTEN[i].hidden = !passt;
      if (passt) sichtbar++;
    }
    for (var j = 0; j < KNOEPFE.length; j++) {
      KNOEPFE[j].setAttribute('aria-pressed', String(KNOEPFE[j].dataset.spiel === wahl));
    }
    // Die Zahl ist die Rueckmeldung des Filters. Das role="status" am Absatz
    // sorgt dafuer, dass ein Vorleseprogramm sie mitbekommt, ohne dass der
    // Fokus springt.
    if (zaehler) {
      zaehler.textContent = L.zaehlMuster
        .replace('{n}', String(sichtbar)).replace('{all}', String(KARTEN.length));
    }

    if (inAdresse) {
      var u = new URL(location.href);
      if (wahl === 'alle') u.searchParams.delete('spiel'); else u.searchParams.set('spiel', wahl);
      // replaceState und nicht pushState: ein Filter ist keine Station,
      // durch die man sich zurueckklickt. Wer den Zurueck-Knopf drueckt, will
      // von dieser Seite weg und nicht durch seine letzten fuenf Filter.
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    }
  }

  for (var b = 0; b < KNOEPFE.length; b++) {
    KNOEPFE[b].addEventListener('click', function () { spielSetzen(this.dataset.spiel, true); });
  }

  /*
   * Ein Anker schlaegt den Filter.
   *
   * Wer einem Dauerlink auf ein einzelnes Skript folgt, waehrend ein Filter
   * gesetzt ist, der es ausblendet, landet auf einer Seite, die seine Zeile
   * nicht zeigt — und haelt den Link fuer kaputt. Also: passt der Anker nicht
   * zum Filter, gewinnt der Anker.
   */
  function ankerRetten() {
    if (!location.hash) return;
    var ziel = document.getElementById(location.hash.slice(1));
    if (!ziel || !ziel.classList.contains('sh-item') || !ziel.hidden) return;
    spielSetzen('alle', true);
    ziel.scrollIntoView({ block: 'center' });
  }

  spielSetzen(new URL(location.href).searchParams.get('spiel') || 'alle', false);
  ankerRetten();
  window.addEventListener('hashchange', ankerRetten);

  var BY = {};
  for (var i = 0; i < ITEMS.length; i++) BY[ITEMS[i].i] = ITEMS[i];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function anchorOf(id) { return 'produkt-' + String(id).replace(/_/g, '-'); }
  function money(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '';
    try { return new Intl.NumberFormat(LOC, { style: 'currency', currency: CUR }).format(v); }
    catch (e) { return v.toFixed(2) + ' ' + CUR; }
  }

  // =========================================================================
  // 1. The view, remembered
  // =========================================================================
  var views = [].slice.call(document.querySelectorAll('.sh-view'));

  function setView(v, save) {
    if (v !== 'list') v = 'grid';
    list.setAttribute('data-view', v);
    views.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === v)); });
    if (save) { try { localStorage.setItem(K_VIEW, v); } catch (e) {} }
  }

  var storedView = null;
  try { storedView = localStorage.getItem(K_VIEW); } catch (e) {}
  setView(storedView, false);

  views.forEach(function (b) {
    b.addEventListener('click', function () { setView(b.getAttribute('data-view'), true); });
  });

  // =========================================================================
  // 2. A #produkt- link arrives open
  //
  // Without JavaScript the anchor still scrolls to the right card — it is just
  // closed, and one click away. This is the part JavaScript adds.
  // =========================================================================
  function openFromHash() {
    var raw = location.hash.slice(1);
    if (!raw) return;
    var id;
    try { id = decodeURIComponent(raw); } catch (e) { id = raw; }
    var el = document.getElementById(id);
    if (!el || !el.classList.contains('sh-item')) return;
    var d = el.querySelector('details');
    if (d && !d.open) d.open = true;
  }
  addEventListener('hashchange', openFromHash);
  openFromHash();

  // =========================================================================
  // 3. The basket
  // =========================================================================
  var panel   = document.getElementById('cartPanel');
  var cList   = document.getElementById('cartList');
  var cEmpty  = document.getElementById('cartEmpty');
  var cSum    = document.getElementById('cartSum');
  var cText   = document.getElementById('cartText');
  var cCopy   = document.getElementById('cartCopy');
  var cClear  = document.getElementById('cartClear');
  var cMail   = document.getElementById('cartMail');
  var cDisc   = document.getElementById('cartDiscord');
  var cHint   = document.getElementById('cartDiscordHint');
  var cMsg    = document.getElementById('cartMsg');
  var bar     = document.getElementById('cartBar');
  var barN    = document.getElementById('barCount');
  var barW    = document.getElementById('barWord');

  /**
   * Reading the basket back is where a stored value gets to be anything at all:
   * somebody else's key, a hand-edited string, a leftover from an older shape
   * of this page, a script that has since been renamed. Every one of those has
   * to end in an empty basket rather than an exception, because an exception
   * here takes the view switch and the anchor down with it.
   */
  function read() {
    var raw = null;
    try { raw = localStorage.getItem(K_CART); } catch (e) { return []; }
    if (!raw) return [];
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return []; }
    if (!parsed || Object.prototype.toString.call(parsed) !== '[object Array]') return [];
    var seen = {}, out = [];
    for (var i = 0; i < parsed.length && out.length < MAX; i++) {
      var v = parsed[i];
      if (typeof v !== 'string') continue;
      if (!Object.prototype.hasOwnProperty.call(BY, v)) continue;  // gone, or never existed
      if (seen[v]) continue;
      seen[v] = 1;
      out.push(v);
    }
    return out;
  }

  function write(ids) {
    try { localStorage.setItem(K_CART, JSON.stringify(ids)); } catch (e) {}
  }

  var cart = read();

  // Whatever was in there is now sanitised. Writing it straight back means the
  // rubbish is gone for good rather than being filtered out on every load —
  // and only when there was rubbish, so an ordinary visit writes nothing.
  var storedRaw = null;
  try { storedRaw = localStorage.getItem(K_CART); } catch (e) {}
  if (storedRaw !== null && storedRaw !== JSON.stringify(cart)) write(cart);

  /**
   * What the basket knows about money, in one place.
   *
   * The line it produces is printed twice — on the page and in the text somebody
   * copies — and the two used to be written separately. The copied version then
   * kept saying "no prices are set" over a list of priced items, which is the
   * exact failure this page exists to avoid, in the one artefact that leaves the
   * site.
   */
  function priceLine(n) {
    if (!n) return '';
    var missing = 0, total = 0;
    for (var i = 0; i < n; i++) {
      var it = BY[cart[i]];
      if (it.p === null) missing++; else total += it.p;
    }
    if (missing === n) return L.noPrice;
    // A total over the half of the basket that happens to be priced is a number
    // nobody can use, so it is not printed at all.
    if (missing > 0) return missing === 1 ? L.someOne : L.someMany.replace('{n}', String(missing));
    return L.sum + ': ' + money(total);
  }

  function plainText() {
    var lines = [L.head + ' (' + cart.length + ')', ''];
    for (var i = 0; i < cart.length; i++) {
      var it = BY[cart[i]];
      var p = it.p === null ? '' : '  ' + money(it.p);
      lines.push('- ' + it.i + '  v' + it.v + p);
    }
    lines.push('', priceLine(cart.length));
    return lines.join('\\n');
  }

  function render() {
    var n = cart.length;

    cEmpty.hidden = n > 0;
    cSum.innerHTML = '';
    cList.innerHTML = cart.map(function (id) {
      var it = BY[id];
      return '<li>' +
        '<span class="n">' + esc(it.t) + '</span>' +
        '<span class="r">' + esc(it.i) + ' · v' + esc(it.v) + '</span>' +
        (it.p === null ? '' : '<span class="p">' + esc(money(it.p)) + '</span>') +
        '<button type="button" class="x" data-del="' + esc(it.i) + '">' + esc(L.remove) + '</button>' +
        '</li>';
    }).join('');

    if (n) {
      var line = priceLine(n);
      var isTotal = line.indexOf(L.sum + ':') === 0;
      cSum.innerHTML = isTotal
        ? '<span class="t">' + esc(line) + '</span>'
        : '<span class="small muted">' + esc(line) + '</span>';
    }

    cText.value = n ? plainText() : '';
    cText.hidden = n === 0;

    // The mail route, prepared but never sent from here. The address itself is
    // left unencoded: a %40 in place of the @ is legal and some mail clients
    // still hand it to the user as a broken recipient.
    var mail = 'mailto:' + HANDOFF.email +
      '?subject=' + encodeURIComponent(L.subject) +
      '&body=' + encodeURIComponent(plainText());
    if (!HANDOFF.email || !n) {
      cMail.hidden = true;
    } else if (mail.length > MAILTO_MAX) {
      cMail.hidden = true;
      cMsg.textContent = L.tooLong;
    } else {
      cMail.hidden = false;
      cMail.setAttribute('href', mail);
    }

    // No Discord invite in the data means no Discord button. A dead link to a
    // server that was never named would be worse than the email route.
    if (HANDOFF.discord && n) {
      cDisc.hidden = false;
      cDisc.setAttribute('href', HANDOFF.discord);
      cDisc.setAttribute('rel', 'noopener');
      cHint.hidden = false;
    } else {
      cDisc.hidden = true;
      cHint.hidden = true;
    }

    cClear.hidden = !n;
    cCopy.hidden = !n;

    barN.textContent = String(n);
    barW.textContent = n === 1 ? L.one : L.many;
    bar.hidden = n === 0;

    // Every button on the page, back in step with the basket.
    var adds = list.querySelectorAll('.sh-add');
    for (var j = 0; j < adds.length; j++) {
      var id = adds[j].getAttribute('data-add');
      var on = cart.indexOf(id) !== -1;
      adds[j].setAttribute('aria-pressed', String(on));
      adds[j].textContent = on ? L.added : L.add;
      var item = document.getElementById(anchorOf(id));
      if (item) item.classList.toggle('in-cart', on);
    }
  }

  function toggle(id) {
    if (!Object.prototype.hasOwnProperty.call(BY, id)) return;
    var at = cart.indexOf(id);
    if (at === -1) {
      if (cart.length >= MAX) return;
      cart.push(id);
    } else {
      cart.splice(at, 1);
    }
    cMsg.textContent = '';
    write(cart);
    render();
  }

  // One listener for every card, however many there are.
  list.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.sh-add') : null;
    if (!b) return;
    toggle(b.getAttribute('data-add'));
  });

  cList.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-del]') : null;
    if (!b) return;
    toggle(b.getAttribute('data-del'));
  });

  cClear.addEventListener('click', function () {
    cart = [];
    cMsg.textContent = '';
    write(cart);
    render();
  });

  cCopy.addEventListener('click', function () {
    var text = cText.value;
    if (!text) return;
    function fallback() {
      cText.focus();
      cText.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      cMsg.textContent = ok ? L.copied : L.copyFail;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { cMsg.textContent = L.copied; },
        fallback,
      );
    } else {
      fallback();
    }
  });

  // Another tab of this page changing the basket. Not a poll — the browser
  // tells us, and only when it happened somewhere else.
  addEventListener('storage', function (e) {
    if (e.key !== K_CART) return;
    cart = read();
    render();
  });

  render();
})();`;
}
