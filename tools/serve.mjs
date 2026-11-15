import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const allowed = new Set(['index.html','styles.css','app.js','config.js','core.js','logo.svg','icons.js','effects.js','sites.js','launcher.js','updates.js','community.js','avatars.js']);
const types = { html:'text/html', css:'text/css', js:'text/javascript', svg:'image/svg+xml',png:'image/png',ico:'image/x-icon',jpg:'image/jpeg',webp:'image/webp',gif:'image/gif' };
createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!allowed.has(path) && !/^assets\/sites\/[a-z0-9-]+\.(png|svg|ico|jpg|webp|gif)$/.test(path)) { res.writeHead(404); res.end('Not found'); return; }
  try { const content = await readFile(new URL(`../${path}`, import.meta.url)); res.writeHead(200, { 'Content-Type': `${types[path.split('.').pop()]}; charset=utf-8`, 'Cache-Control': 'no-store' }); res.end(content); }
  catch { res.writeHead(500); res.end('Could not read app file'); }
}).listen(4173, '127.0.0.1', () => console.log('Veil preview: http://127.0.0.1:4173'));
