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
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown } from '../markdown.mjs';

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
    meta: {
      en: { title: spec.titles.en, description: spec.descriptions.en },
      de: { title: spec.titles.de, description: spec.descriptions.de },
    },
    body(lang) {
      const md = load(spec.name, lang);
      const notReady = {
        en: 'This document has not been written yet. Until it is, the forum should not be opened to anyone but its author.',
        de: 'Dieses Dokument ist noch nicht geschrieben. Solange das so ist, sollte das Forum niemandem außer seinem Autor offenstehen.',
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

      const warn = outstanding.length
        ? `<div class="note danger" style="margin-bottom:24px"><p>${
            lang === 'de'
              ? `Dieses Dokument enthält noch ${outstanding.length} nicht ausgefüllte Angabe(n). Es ist so nicht rechtsgültig.`
              : `This document still has ${outstanding.length} value(s) to fill in. It is not valid as it stands.`
          }</p></div>`
        : '';

      return `
<section class="hero" style="padding-bottom:20px">
  <div class="wrap stack">
    <span class="eyebrow">${spec.eyebrows[lang]}</span>
    <h1>${spec.headings[lang]}</h1>
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
  },
  descriptions: {
    en: 'Who operates this site, as required by German law.',
    de: 'Wer diese Seite betreibt — Angaben nach deutschem Recht.',
  },
  eyebrows: { en: 'Site notice', de: 'Impressum' },
  headings: { en: 'Site notice', de: 'Impressum' },
});

export const privacy = legalPage({
  name: 'datenschutz',
  slug: 'datenschutz',
  titles: {
    en: 'Privacy · Skillry',
    de: 'Datenschutzerklärung · Skillry',
  },
  descriptions: {
    en: 'What this site stores, which is almost nothing, and what the forum stores, which is a little more.',
    de: 'Was diese Seite speichert — nämlich fast nichts — und was das Forum speichert, nämlich etwas mehr.',
  },
  eyebrows: { en: 'Privacy', de: 'Datenschutz' },
  headings: { en: 'Privacy policy', de: 'Datenschutzerklärung' },
});
