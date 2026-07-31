/**
 * Local preview server. Not part of the deployment — GitHub Pages serves the
 * `dist/` output directly.
 *
 *   node build/serve.mjs [port]
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = normalize(join(OUT, url));

  // Directory URLs map to index.html, the same way Pages resolves them.
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');

  if (!file.startsWith(OUT) || !existsSync(file)) {
    const fallback = join(OUT, '404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(existsSync(fallback) ? readFileSync(fallback) : 'not found');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(readFileSync(file));
}).listen(PORT, () => process.stdout.write(`serving dist/ on http://localhost:${PORT}\n`));
