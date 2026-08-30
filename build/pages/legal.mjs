/**
 * The legal pages: Impressum and Datenschutzerklärung.
 *
 * Content lives as Markdown in content/legal/ rather than inside this module,
 * because legal text gets revised by a human — possibly by a lawyer who has
 * never opened a JavaScript file — and it should be editable without touching
 * code.
 *
 * A missing file renders as a visible, honest placeholder. Silently emitting an
 * empty legal page would be worse than emitting none: it would look like the
 * obligation had been met.
 */

import { readFileSync, existsSync } from 'node:fs';
import { slugify } from '../search.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown } from '../markdown.mjs';
import { LANGS } from '../layout.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEGAL = join(ROOT, 'content', 'legal');

/** Anything the operator must still fill in shows up as {{TOKEN}} in the source. */
const PLACEHOLDER = /\{\{([A-Z0-9_]+)\}\}/g;

function load(name, lang) {
  const file = join(LEGAL, `${name}.${lang}.md`);
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8');
}

/**
 * Build one legal page.
 * @param {{ name: string, slug: string, titles: object, descriptions: object, eyebrows: object, headings: object }} spec
 */
export function legalPage(spec) {
  return {
    slug: spec.slug,
    // Aus LANGS abgeleitet statt je Sprache von Hand: eine neue live-Sprache,
    // deren titles/descriptions im Spec fehlen, faellt hier sofort als
    // "undefined" im Seitentitel auf statt still englisch zu bleiben.
    meta: Object.fromEntries(
      LANGS.map((l) => [l, { title: spec.titles[l], description: spec.descriptions[l] }]),
    ),
    body(lang) {
      const md = load(spec.name, lang);
      const notReady = {
        en: 'This document has not been written yet. Until it is, the forum should not be opened to anyone but its author.',
        de: 'Dieses Dokument ist noch nicht geschrieben. Solange das so ist, sollte das Forum niemandem außer seinem Autor offenstehen.',
        es: 'Este documento aún no está escrito. Mientras sea así, el foro no debería abrirse a nadie más que a su autor.',
      };

      if (!md) {
        return `
<section class="hero">
  <div class="wrap stack">
    <span class="eyebrow">${spec.eyebrows[lang]}</span>
    <h1>${spec.headings[lang]}</h1>
    <div class="note danger" style="max-width:60ch"><p>${notReady[lang]}</p></div>
  </div>
</section>`;
      }

      // Unfilled placeholders are made loud rather than left to look like text.
      const outstanding = [...md.matchAll(PLACEHOLDER)].map((m) => m[1]);
      const html = renderMarkdown(md).replace(
        PLACEHOLDER,
        (_, token) => `<mark class="todo" title="not filled in yet">${token}</mark>`,
      );

      const zuTun = {
        en: (n) => `This document still has ${n} value(s) to fill in. It is not valid as it stands.`,
        de: (n) => `Dieses Dokument enthält noch ${n} nicht ausgefüllte Angabe(n). Es ist so nicht rechtsgültig.`,
        es: (n) => `A este documento aún le falta(n) ${n} dato(s) por rellenar. Tal como está, no es válido.`,
      };
      const warn = outstanding.length
        ? `<div class="note danger" style="margin-bottom:24px"><p>${zuTun[lang](outstanding.length)}</p></div>`
        : '';

      /*
       * ══ EIN VERZEICHNIS, WEIL NIEMAND EINEN RECHTSTEXT AM STUECK LIEST ═══
       *
       * Die Datenschutzerklaerung ist 6.1 Bildschirme lang und hat zehn
       * Abschnitte. Wer sie oeffnet, sucht in aller Regel EINE Sache — was
       * gespeichert wird, wer es bekommt, wie man widerspricht — und blaettert
       * sonst daran vorbei.
       *
       * Die Ueberschriften kommen aus Markdown, also werden sie aus dem
       * gerenderten HTML gelesen statt zweitgepflegt. Der Anker kommt aus
       * DERSELBEN `slugify`, die `anchorHeadings` benutzt: nachgebaut wirft
       * eine naive Regel jeden Umlaut weg, und das faellt in der englischen
       * Fassung nicht auf.
       */
      const kapitel = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
        .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
        .filter(Boolean);

      const weg = {
        en: { aria: 'Sections of this document', titel: 'On this page' },
        de: { aria: 'Abschnitte dieses Dokuments', titel: 'Auf dieser Seite' },
        es: { aria: 'Secciones de este documento', titel: 'En esta página' },
      };
      const verzeichnis = kapitel.length < 4 ? '' : `
<nav class="wegweiser" aria-label="${weg[lang].aria}">
  <span class="wegweiser-titel">${weg[lang].titel}</span>
  <ol>
    ${kapitel.map((k, i) => `<li><a href="#${slugify(k)}">
      <span class="wegweiser-n">${String(i + 1).padStart(2, '0')}</span>${k}</a></li>`).join('')}
  </ol>
</nav>`;

      return `
<section class="hero" style="padding-bottom:20px">
  <div class="wrap stack">
    <span class="eyebrow">${spec.eyebrows[lang]}</span>
    <h1>${spec.headings[lang]}</h1>
    ${verzeichnis}
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="narrow legal">${warn}${html}</div>
  </div>
</section>`;
    },
  };
}

export const impressum = legalPage({
  name: 'impressum',
  slug: 'impressum',
  titles: {
    en: 'Site notice · Skillry',
    de: 'Impressum · Skillry',
    es: 'Aviso legal · Skillry',
  },
  descriptions: {
    en: 'Who operates this site, as required by German law.',
    de: 'Wer diese Seite betreibt — Angaben nach deutschem Recht.',
    es: 'Quién opera este sitio — información exigida por la ley alemana.',
  },
  eyebrows: { en: 'Site notice', de: 'Impressum', es: 'Aviso legal' },
  headings: { en: 'Site notice', de: 'Impressum', es: 'Aviso legal' },
});

export const privacy = legalPage({
  name: 'datenschutz',
  slug: 'datenschutz',
  titles: {
    en: 'Privacy · Skillry',
    de: 'Datenschutzerklärung · Skillry',
    es: 'Privacidad · Skillry',
  },
  descriptions: {
    en: 'What this site stores, which is almost nothing, and what the forum stores, which is a little more.',
    de: 'Was diese Seite speichert — nämlich fast nichts — und was das Forum speichert, nämlich etwas mehr.',
    es: 'Qué guarda este sitio — casi nada — y qué guarda el foro, que es algo más.',
  },
  eyebrows: { en: 'Privacy', de: 'Datenschutz', es: 'Privacidad' },
  headings: { en: 'Privacy policy', de: 'Datenschutzerklärung', es: 'Política de privacidad' },
});
