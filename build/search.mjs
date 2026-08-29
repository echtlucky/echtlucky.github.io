/**
 * Site-wide search.
 *
 * The index is built from the rendered HTML rather than from the page modules,
 * so anything visible is findable and nothing that is only in the source ever
 * shows up in results. It is fetched lazily the first time someone opens the
 * dialog — inlining it would put thirty kilobytes on every page to serve one
 * interaction, and requesting it from our own origin is not the kind of network
 * call the site promises not to make.
 */

/** Strip tags and collapse whitespace, keeping the text a reader would see. */
function textOf(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Turn a heading into a stable anchor id. */
export function slugify(s) {
  return textOf(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Split a page into searchable sections, one per h2, so a hit lands on the part
 * of the page that answered rather than at the top of it.
 *
 * @param {{ lang: string, url: string, title: string, html: string, kind?: string }} page
 */
export function indexPage(page) {
  const main = /<main[^>]*>([\s\S]*)<\/main>/i.exec(page.html)?.[1] ?? page.html;
  const entries = [];

  // The lede: everything before the first h2 belongs to the page itself.
  const firstH2 = main.search(/<h2\b/i);
  const intro = textOf(firstH2 === -1 ? main : main.slice(0, firstH2));
  const h1 = textOf(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(main)?.[1] ?? page.title);

  entries.push({
    u: page.url,
    l: page.lang,
    k: page.kind ?? 'page',
    t: h1,
    s: '',
    b: intro.slice(0, 600),
  });

  const sections = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|$)/gi)];
  for (const [, heading, rest] of sections) {
    const title = textOf(heading);
    if (!title) continue;
    entries.push({
      u: `${page.url}#${slugify(title)}`,
      l: page.lang,
      k: 'section',
      t: title,
      s: h1,
      b: textOf(rest).slice(0, 600),
    });
  }

  return entries;
}

/** Give every h2 an id so a search hit can scroll to it. */
export function anchorHeadings(html) {
  return html.replace(/<h2(?![^>]*\bid=)([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
    const id = slugify(inner);
    return id ? `<h2 id="${id}"${attrs}>${inner}</h2>` : m;
  });
}

// ---------------------------------------------------------------------------
// The dialog
// ---------------------------------------------------------------------------

export const SEARCH_CSS = `
.search-dialog {
  position: fixed; inset: 0; z-index: 100; display: none;
  padding: clamp(40px, 10vh, 120px) 16px 16px;
  background: rgba(5, 3, 15, 0.6); backdrop-filter: blur(3px);
}
.search-dialog[open] { display: block; }
.search-panel {
  max-width: 680px; margin: 0 auto; background: var(--surface);
  border: 1px solid var(--border-strong); border-radius: 12px;
  box-shadow: 0 16px 48px rgba(5,3,15,0.45); overflow: hidden;
  display: flex; flex-direction: column; max-height: min(72vh, 640px);
}
.search-head { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid var(--border); }
.search-head input {
  flex: 1; border: 0; background: transparent; color: var(--fg);
  font: inherit; font-size: 17px; outline: none; min-width: 0;
}
.search-head kbd {
  border: 1px solid var(--border); border-radius: 5px; padding: 3px 7px;
  font-size: 11px; color: var(--fg-subtle); background: var(--surface-2);
}
.search-results { overflow-y: auto; padding: 8px; }
.search-hit {
  display: block; padding: 11px 14px; border-radius: 8px; color: var(--fg);
  border: 1px solid transparent;
}
.search-hit:hover, .search-hit.sel { background: var(--surface-2); border-color: var(--border); text-decoration: none; }
.search-hit .ht { font-weight: 600; font-size: 15px; display: flex; align-items: baseline; gap: 8px; }
.search-hit .hk {
  font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--fg-subtle); border: 1px solid var(--border); border-radius: 999px; padding: 1px 7px; flex: none;
}
.search-hit .hp { font-size: 0.8rem; color: var(--fg-subtle); margin-top: 2px; }
.search-hit .hb { font-size: 0.86rem; color: var(--fg-muted); margin-top: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.search-hit mark { background: color-mix(in srgb, var(--accent-idx) 30%, transparent); color: inherit; border-radius: 2px; padding: 0 1px; }
.search-foot { padding: 9px 18px; border-top: 1px solid var(--border); font-size: 0.78rem; color: var(--fg-subtle); display: flex; gap: 16px; flex-wrap: wrap; }
.search-empty { padding: 36px 18px; text-align: center; color: var(--fg-muted); }
`;

export const SEARCH_MARKUP = (t) => `
<div class="search-dialog" id="searchDialog" role="dialog" aria-modal="true" aria-label="${t.searchHint}">
  <div class="search-panel">
    <div class="search-head">
      <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="color:var(--fg-subtle);flex:none"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"/></svg>
      <input id="siteSearch" type="search" placeholder="${t.searchEverything}" autocomplete="off" spellcheck="false" aria-label="${t.searchEverything}">
      <kbd>esc</kbd>
    </div>
    <div class="search-results" id="searchResults"></div>
    <div class="search-foot">
      <span>↑↓ ${t.navigate}</span><span>↵ ${t.open}</span><span id="searchCount"></span>
    </div>
  </div>
</div>`;

export const SEARCH_JS = (lang, strings) => `
(function () {
  var dialog = document.getElementById('searchDialog');
  var input = document.getElementById('siteSearch');
  var results = document.getElementById('searchResults');
  var countEl = document.getElementById('searchCount');
  if (!dialog) return;

  var LANG = ${JSON.stringify(lang)};
  var S = ${JSON.stringify(strings)};
  var index = null;
  var loading = false;
  var sel = 0;
  var hits = [];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (term) {
      if (term.length < 2) return;
      var re = new RegExp('(' + term.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function load() {
    if (index || loading) return Promise.resolve();
    loading = true;
    return fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data.filter(function (e) { return e.l === LANG; }); loading = false; })
      .catch(function () { loading = false; index = []; });
  }

  // Score by where the match landed: a title hit beats a body hit, and an exact
  // phrase beats scattered words.
  function score(entry, terms, q) {
    var t = entry.t.toLowerCase();
    var b = entry.b.toLowerCase();
    var s = entry.s.toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (t.indexOf(term) === 0) total += 60;
      else if (t.indexOf(term) !== -1) total += 40;
      else if (s.indexOf(term) !== -1) total += 12;
      else if (b.indexOf(term) !== -1) total += 8;
      else return 0;
    }
    if (t.indexOf(q) !== -1) total += 30;
    if (entry.k === 'page') total += 10;
    return total;
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    if (!q) {
      hits = [];
      results.innerHTML = '<div class="search-empty">' + esc(S.typeToSearch) + '</div>';
      countEl.textContent = '';
      return;
    }
    var terms = q.split(/\\s+/);
    hits = (index || [])
      .map(function (e) { return { e: e, n: score(e, terms, q) }; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 12)
      .map(function (x) { return x.e; });

    if (!hits.length) {
      results.innerHTML = '<div class="search-empty">' + esc(S.noResults) + '</div>';
      countEl.textContent = '';
      return;
    }
    sel = 0;
    results.innerHTML = hits.map(function (e, i) {
      return '<a class="search-hit' + (i === 0 ? ' sel' : '') + '" href="' + esc(e.u) + '">' +
        '<span class="ht">' + highlight(e.t, terms) + '<span class="hk">' + esc(e.k === 'page' ? S.page : S.section) + '</span></span>' +
        (e.s ? '<span class="hp">' + esc(e.s) + '</span>' : '') +
        '<span class="hb">' + highlight(e.b.slice(0, 180), terms) + '</span></a>';
    }).join('');
    countEl.textContent = hits.length + ' ' + (hits.length === 1 ? S.result : S.resultsWord);
  }

  function move(delta) {
    var nodes = results.querySelectorAll('.search-hit');
    if (!nodes.length) return;
    nodes[sel] && nodes[sel].classList.remove('sel');
    sel = (sel + delta + nodes.length) % nodes.length;
    nodes[sel].classList.add('sel');
    nodes[sel].scrollIntoView({ block: 'nearest' });
  }

  function open() {
    dialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    load().then(render);
    input.focus();
    input.select();
  }
  function close() {
    dialog.removeAttribute('open');
    document.body.style.overflow = '';
  }

  [].forEach.call(document.querySelectorAll('[data-search-open]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  input.addEventListener('input', function () { load().then(render); });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      var node = results.querySelectorAll('.search-hit')[sel];
      if (node) { e.preventDefault(); window.location.href = node.getAttribute('href'); }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dialog.hasAttribute('open')) { close(); return; }
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); return; }
    if (e.key === '/' && !typing && !dialog.hasAttribute('open')) { e.preventDefault(); open(); }
  });
})();`;
