import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { rooms, rituals } from '../lib/content.mjs';
await mkdir('preview', { recursive: true });
await cp('out', 'preview', { recursive: true });
// Keep the Next.js build for HTTP preview and generate a directly openable HTML
// companion from the same rendered page. Its small script supplies file:// interactions.
let html = await readFile('out/index.html', 'utf8');
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
html = html.replace(/<link\b[^>]*as="script"[^>]*>/g, '');
html = html.replace(/<link\b[^>]*rel="icon"[^>]*>/g, '<link rel="icon" href="./app/icon.svg" type="image/svg+xml">');
html = html.replaceAll('./_next/', './preview/_next/').replaceAll('src="media/', 'src="public/media/').replaceAll('href="media/', 'href="public/media/');
const offline = await readFile('public/offline.js', 'utf8');
html = html.replace('</body>', () => `<script>window.SELA=${JSON.stringify({ rooms, rituals })};</script><script>${offline}</script></body>`);
// Inline local CSS so this tracked file works before installing dependencies.
html = await replaceStyles(html);
await writeFile('index.html', html);
console.log('Created index.html (direct browser opening) and preview/ (interactive Next.js export).');

async function replaceStyles(source) {
  const links = [...source.matchAll(/<link\b[^>]*href="\.\/preview\/([^\"]+\.css)"[^>]*>/g)];
  for (const [tag, file] of links) {
    source = source.replace(tag, `<style>${await readFile('preview/' + file, 'utf8')}</style>`);
  }
  return source;
}
