import { href, SITE } from '../layout.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'skills';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CATALOG = JSON.parse(readFileSync(join(ROOT, 'content', 'catalog.json'), 'utf8'));

export const meta = {
  en: {
    title: 'Skill index — every entry carries a scan verdict · Skillry',
    description:
      'A searchable index of agent skills where every entry carries a verdict produced by running AIRLOCK over it, not typed by hand. Submit yours by pull request.',
  },
  de: {
    title: 'Skill-Index — jeder Eintrag trägt ein Scan-Urteil · Skillry',
    description:
      'Ein durchsuchbarer Index für Agent-Skills, bei dem jeder Eintrag ein Urteil trägt, das durch einen echten AIRLOCK-Scan entstanden ist — nicht per Hand eingetippt. Eigene Skills per Pull Request einreichen.',
  },
};

const T = {
  en: {
    eyebrow: 'Skill index',
    h1: 'Every entry says whether it is clean.',
    lede:
      'Skill lists exist. What none of them tell you is whether a skill is safe to install. Here, every entry carries a verdict that was <strong>produced by running the scanner</strong> — the date and engine version are on the card, and the script that generates them is in the repository.',
    countOne: 'skill indexed',
    countMany: 'skills indexed',
    updated: 'Verdicts last refreshed',
    searchLabel: 'Search skills',
    searchPlaceholder: 'Search by name, purpose or tag…',
    all: 'All',
    clear: 'Clear filters',
    noResults: 'Nothing matches that. Try a shorter search, or clear the filters.',
    resultsOne: 'result',
    resultsMany: 'results',
    by: 'by',
    declares: 'declares',
    reaches: 'reaches',
    nothingDeclared: 'nothing declared',
    view: 'View source',
    scannedOn: 'scanned',
    engine: 'engine',
    verdicts: { pass: 'pass', review: 'review', block: 'block', unscanned: 'unscanned' },
    verdictHelpH: 'What the verdicts mean',
    verdictHelp: [
      ['pass', 'No rule matched. That is not a guarantee — read the limits before you treat it as one.'],
      ['review', 'It reaches further than it claims to. Worth a deliberate look rather than a skim.'],
      ['block', 'Something certain and serious was found. Do not install it without reading the finding.'],
      ['unscanned', 'Listed but not yet verified. Shown honestly rather than quietly assumed clean.'],
    ],
    youngH: 'This index is young, and says so',
    youngP:
      'It starts with the skills I can scan myself. It grows by pull request: add an entry, and continuous integration runs AIRLOCK over the skill before it can be merged. An index that lists everything and verifies nothing would be worse than no index at all.',
    submit: 'Submit a skill',
    howH: 'How to submit',
    howSteps: [
      ['Fork and add an entry', 'One object in <code>content/catalog.json</code>: name, source, link, what it does. Leave <code>scan</code> as <code>null</code>.'],
      ['Open a pull request', 'CI fetches the skill, runs AIRLOCK over it, and writes the verdict into your entry. You do not fill that part in.'],
      ['A human reads it', 'A verdict of <code>block</code> does not automatically reject the entry — sometimes a security tool legitimately trips its own rules. It does mean somebody explains why in the pull request.'],
    ],
  },

  de: {
    eyebrow: 'Skill-Index',
    h1: 'Jeder Eintrag sagt, ob er sauber ist.',
    lede:
      'Skill-Listen gibt es. Was keine davon sagt: ob ein Skill sicher zu installieren ist. Hier trägt jeder Eintrag ein Urteil, das durch einen <strong>echten Scan entstanden ist</strong> — Datum und Engine-Version stehen auf der Karte, und das Skript, das sie erzeugt, liegt im Repository.',
    countOne: 'Skill im Index',
    countMany: 'Skills im Index',
    updated: 'Urteile zuletzt aktualisiert',
    searchLabel: 'Skills durchsuchen',
    searchPlaceholder: 'Nach Name, Zweck oder Tag suchen…',
    all: 'Alle',
    clear: 'Filter zurücksetzen',
    noResults: 'Dazu passt nichts. Probier eine kürzere Suche oder setz die Filter zurück.',
    resultsOne: 'Treffer',
    resultsMany: 'Treffer',
    by: 'von',
    declares: 'deklariert',
    reaches: 'greift nach',
    nothingDeclared: 'nichts deklariert',
    view: 'Quelle ansehen',
    scannedOn: 'gescannt',
    engine: 'Engine',
    verdicts: { pass: 'pass', review: 'review', block: 'block', unscanned: 'ungescannt' },
    verdictHelpH: 'Was die Urteile bedeuten',
    verdictHelp: [
      ['pass', 'Keine Regel hat angeschlagen. Das ist keine Garantie — lies die Grenzen, bevor du es als eine behandelst.'],
      ['review', 'Greift weiter, als er behauptet. Verdient einen bewussten Blick statt eines Überfliegens.'],
      ['block', 'Etwas Sicheres und Ernstes wurde gefunden. Nicht installieren, ohne den Befund gelesen zu haben.'],
      ['unscanned', 'Gelistet, aber noch nicht geprüft. Ehrlich ausgewiesen statt still als sauber angenommen.'],
    ],
    youngH: 'Dieser Index ist jung, und sagt das auch',
    youngP:
      'Er startet mit den Skills, die ich selbst scannen kann. Er wächst per Pull Request: Eintrag hinzufügen, und die CI lässt AIRLOCK über den Skill laufen, bevor er gemerged werden kann. Ein Index, der alles listet und nichts prüft, wäre schlechter als gar kein Index.',
    submit: 'Skill einreichen',
    howH: 'Wie du einreichst',
    howSteps: [
      ['Forken und Eintrag ergänzen', 'Ein Objekt in <code>content/catalog.json</code>: Name, Quelle, Link, was er macht. <code>scan</code> bleibt <code>null</code>.'],
      ['Pull Request aufmachen', 'Die CI holt den Skill, lässt AIRLOCK darüber laufen und schreibt das Urteil in deinen Eintrag. Diesen Teil füllst du nicht selbst aus.'],
      ['Ein Mensch liest drüber', 'Ein <code>block</code>-Urteil lehnt den Eintrag nicht automatisch ab — manchmal löst ein Security-Werkzeug berechtigt die eigenen Regeln aus. Es heißt aber, dass jemand im Pull Request erklärt, warum.'],
    ],
  },
};

/** Everything the client needs, and nothing about anyone's machine. */
function payload(lang) {
  return CATALOG.skills.map((s) => ({
    id: s.id,
    name: s.name,
    author: s.author,
    source: s.source,
    url: s.url,
    license: s.license,
    tags: s.tags ?? [],
    tools: s.tools ?? [],
    title: s.title?.[lang] ?? s.title?.en ?? '',
    desc: s.description?.[lang] ?? s.description?.en ?? '',
    verdict: s.scan?.verdict ?? 'unscanned',
    findings: s.scan?.findings ?? null,
    reaches: s.scan?.reaches ?? [],
    date: s.scan?.date ?? null,
    engine: s.scan?.engine ?? null,
  }));
}

export function body(lang) {
  const t = T[lang];
  const skills = payload(lang);
  const n = skills.length;
  const tags = [...new Set(skills.flatMap((s) => s.tags))].sort();

  const chips = [
    `<button class="chip" data-tag="" aria-pressed="true">${t.all}</button>`,
    ...tags.map((tag) => `<button class="chip" data-tag="${tag}" aria-pressed="false">${tag}</button>`),
  ].join('');

  return `
<section class="hero hero-stage index" style="padding-bottom:24px">
  <div class="wrap stack">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <p class="small muted mono">${n} ${n === 1 ? t.countOne : t.countMany} · ${t.updated}: ${CATALOG.updated}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="filters">
      <label class="search-box">
        <span class="sr">${t.searchLabel}</span>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="color:var(--fg-subtle)"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"/></svg>
        <input id="skillSearch" type="search" placeholder="${t.searchPlaceholder}" autocomplete="off" spellcheck="false">
      </label>
      ${chips}
    </div>
    <p class="small muted" id="resultCount" aria-live="polite"></p>
    <div class="skill-list" id="skillList"></div>
    <div class="empty" id="emptyState" hidden>${t.noResults}</div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap grid grid-2">
    <div class="stack">
      <h2>${t.verdictHelpH}</h2>
      <div class="table-scroll">
        <table>
          <tbody>
            ${t.verdictHelp
              .map(
                ([v, d]) =>
                  `<tr><td style="white-space:nowrap"><span class="verdict v-${v === t.verdicts.unscanned ? 'unscanned' : v}">${t.verdicts[v] ?? v}</span></td><td class="muted">${d}</td></tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="stack">
      <h2>${t.youngH}</h2>
      <p class="muted">${t.youngP}</p>
      <div class="steps" style="margin-top:0.6rem">
        ${t.howSteps.map(([h, p]) => `<div class="step"><div><h3>${h}</h3><p class="muted small">${p}</p></div></div>`).join('')}
      </div>
      <div class="btn-row">
        <a class="btn btn-primary" href="${SITE.repoAirlock}/blob/main/CONTRIBUTING.md">${t.submit}</a>
        <a class="btn" href="${href(lang, 'learn')}">${T[lang].eyebrow === 'Skill index' ? 'Learn the basics' : 'Grundlagen lernen'}</a>
      </div>
    </div>
  </div>
</section>
`;
}

export function script(lang) {
  const t = T[lang];
  return `
(function () {
  var SKILLS = ${JSON.stringify(payload(lang)).replace(/</g, '\\u003c')};
  var L = ${JSON.stringify({
    by: t.by,
    declares: t.declares,
    reaches: t.reaches,
    nothingDeclared: t.nothingDeclared,
    view: t.view,
    scannedOn: t.scannedOn,
    engine: t.engine,
    verdicts: t.verdicts,
    one: t.resultsOne,
    many: t.resultsMany,
  })};

  var list = document.getElementById('skillList');
  var empty = document.getElementById('emptyState');
  var count = document.getElementById('resultCount');
  var search = document.getElementById('skillSearch');
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var activeTag = '';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Match against everything a person might plausibly type, not only the name.
  function haystack(s) {
    return (s.name + ' ' + s.title + ' ' + s.desc + ' ' + s.author + ' ' + s.source + ' ' +
            s.tags.join(' ') + ' ' + s.tools.join(' ')).toLowerCase();
  }

  function card(s) {
    var v = s.verdict;
    var meta = [];
    meta.push(L.by + ' ' + esc(s.author));
    meta.push(esc(s.license));
    meta.push(L.declares + ': ' + (s.tools.length ? esc(s.tools.join(', ')) : L.nothingDeclared));
    if (s.reaches.length) meta.push(L.reaches + ': ' + esc(s.reaches.join(', ')));
    if (s.date) meta.push(L.scannedOn + ' ' + esc(s.date) + ' · ' + L.engine + ' ' + esc(s.engine));

    return '<article class="skill verdict-' + v + '">' +
      '<div><h3>' + esc(s.name) + '</h3></div>' +
      '<span class="verdict v-' + v + '">' + (L.verdicts[v] || v) + '</span>' +
      '<p class="desc">' + esc(s.desc) + '</p>' +
      '<div class="meta">' + meta.join('<span aria-hidden="true">·</span>') +
        '<a href="' + esc(s.url) + '">' + L.view + ' →</a></div>' +
      '</article>';
  }

  function apply() {
    var q = search.value.trim().toLowerCase();
    var terms = q ? q.split(/\\s+/) : [];
    var hits = SKILLS.filter(function (s) {
      if (activeTag && s.tags.indexOf(activeTag) === -1) return false;
      if (!terms.length) return true;
      var h = haystack(s);
      return terms.every(function (term) { return h.indexOf(term) !== -1; });
    });

    list.innerHTML = hits.map(card).join('');
    empty.hidden = hits.length > 0;
    count.textContent = hits.length + ' ' + (hits.length === 1 ? L.one : L.many);
  }

  search.addEventListener('input', apply);
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeTag = chip.dataset.tag;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      apply();
    });
  });

  apply();
})();`;
}
