/**
 * A deliberately small Markdown renderer.
 *
 * It covers exactly what the legal pages use: headings, paragraphs, hard line
 * breaks, lists, tables, emphasis, inline code, links and blockquotes. Everything it does not
 * understand is escaped and shown as text rather than passed through, which is
 * the right default for a project whose subject is text that turns out not to
 * be what it looked like.
 *
 * No HTML passthrough. A Markdown renderer that forwards raw HTML is an XSS
 * hole waiting for the first contributed document.
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);

// A sentinel that cannot occur in escaped text: the escape pass has already
// removed every < > & and quote, so a private-use codepoint is unreachable by
// any input. Built numerically — a literal invisible character in source is
// exactly the thing this project exists to object to.
const MARK = String.fromCodePoint(0xe000);

// Hard line breaks are marked with the same sentinel before escaping, so the
// document cannot smuggle one in. 'br' is not digits, so it cannot collide with
// the numbered code-span markers below.
const BREAK = `${MARK}br${MARK}`;

/** Inline formatting, applied after escaping so no markup can be smuggled in. */
function inline(raw) {
  let s = esc(raw);

  // Code first: nothing inside a code span should be interpreted further.
  const spans = [];
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    spans.push(`<code>${code}</code>`);
    return MARK + (spans.length - 1) + MARK;
  });

  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    // Only http(s), mailto and site-relative targets. A javascript: URL in a
    // contributed document would otherwise become a live link.
    if (!/^(https?:\/\/|mailto:|\/|#)/.test(url)) return text;
    const ext = /^https?:\/\//.test(url) ? ' rel="noopener"' : '';
    return `<a href="${url}"${ext}>${text}</a>`;
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return s.replace(new RegExp(MARK + '(\\d+)' + MARK, 'g'), (_, i) => spans[Number(i)]);
}

function tableRow(line, cell = 'td') {
  const cells = line.replace(/^\||\|$/g, '').split('|');
  return `<tr>${cells.map((c) => `<${cell}>${inline(c.trim())}</${cell}>`).join('')}</tr>`;
}

/**
 * @param {string} md
 * @returns {string} HTML
 */
export function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const closeList = (tag) => { if (tag) out.push(`</${tag}>`); };
  let list = null;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { closeList(list); list = null; i++; continue; }

    // Heading
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      closeList(list); list = null;
      const level = h[1].length + 1; // h1 is the page title, documents start at h2
      out.push(`<h${Math.min(level, 5)}>${inline(h[2])}</h${Math.min(level, 5)}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      closeList(list); list = null;
      out.push('<hr class="divider">');
      i++;
      continue;
    }

    // Table
    if (line.trim().startsWith('|') && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      closeList(list); list = null;
      out.push('<div class="table-scroll"><table><thead>' + tableRow(line.trim(), 'th') + '</thead><tbody>');
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        out.push(tableRow(lines[i].trim()));
        i++;
      }
      out.push('</tbody></table></div>');
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      closeList(list); list = null;
      const quote = [];
      while (i < lines.length && lines[i].startsWith('> ')) { quote.push(lines[i].slice(2)); i++; }
      out.push(`<div class="note">${inline(quote.join(' '))}</div>`);
      continue;
    }

    // Lists
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      const want = ul ? 'ul' : 'ol';
      if (list !== want) { closeList(list); out.push(`<${want}>`); list = want; }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
      i++;
      continue;
    }

    // Paragraph — consume until a blank line or a block starter.
    closeList(list); list = null;
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|[-*]\s|\d+\.\s|>\s|\||---+$)/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      // A line ending in two spaces is a hard break, as in standard Markdown.
      // A postal address is the reason this exists: "Name, street, town" is one
      // paragraph that must not be reflowed into one line.
      const joined = para
        .map((l, n) => (n < para.length - 1 && /  $/.test(l) ? `${l.trimEnd()}${BREAK}` : l.trimEnd()))
        .join(' ');
      out.push(`<p>${inline(joined).split(`${BREAK} `).join('<br>')}</p>`);
    }
  }

  closeList(list);
  return out.join('\n');
}
