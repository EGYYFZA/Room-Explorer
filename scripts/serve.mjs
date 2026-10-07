import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' };
http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + requested);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const contents = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(contents);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(3000, '127.0.0.1', () => console.log('Sela House preview: http://127.0.0.1:3000'));
