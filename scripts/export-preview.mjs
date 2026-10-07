import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { rooms, rituals, houseGallery } from '../lib/content.mjs';
import { createJourney } from '../lib/journey.mjs';
import { createRoomExperience } from '../lib/room-experience.mjs';
import { createPageTransitions } from '../lib/page-transitions.mjs';
import { closeDialog } from '../lib/dialog-motion.mjs';
import { createSectionMotion } from '../lib/section-motion.mjs';
await mkdir('preview', { recursive: true });
await cp('out', 'preview', { recursive: true });
await mkdir('room-pages', { recursive: true });

// Keep the Next.js HTTP export, plus self-contained file:// companions.
async function prepare(file, depth = 0) {
  let html = await readFile(file, 'utf8');
  const base = depth ? '../' : './';
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<link\b[^>]*as="script"[^>]*>/g, '');
  html = html.replace(/<link\b[^>]*rel="icon"[^>]*>/g, '<link rel="icon" href="' + base + 'app/icon.svg" type="image/svg+xml">');
  for (const [tag, file] of [...html.matchAll(/<link\b[^>]*href="(?:\.?\/)_next\/([^"?]+\.css)(?:\?[^\"]*)?"[^>]*>/g)]) {
    const css = await readFile('out/_next/' + file, 'utf8');
    html = html.replace(tag, () => '<style>' + css + '</style>');
  }
  html = html.replace(/(src|href)="\/?media\//g, '$1="' + base + 'public/media/');
  html = html.replace(/href="\/rooms\/(garden|canopy|pool)\/"/g, (_, id) => 'href="' + (depth ? './' : 'room-pages/') + id + '.html"');
  if (depth) html = html.replace(/href="\/(#[^"]*)?"/g, (_, hash = '') => 'href="../index.html' + hash + '"');
  return html.replace('</body>', () => '<script>window.closeSelaDialog=' + closeDialog.toString() + ';(' + createPageTransitions.toString() + ')();(' + createSectionMotion.toString() + ')();</script></body>');
}
let home = await prepare('out/index.html');
const offline = await readFile('public/offline.js', 'utf8');
home = home.replace('</body>', () => '<script>window.SELA=' + JSON.stringify({ rooms, rituals, houseGallery }) + ';</script><script>' + offline + '</script><script>(' + createJourney.toString() + ')();</script></body>');
await writeFile('index.html', home);
for (const room of rooms) {
  let html = await prepare('out/rooms/' + room.id + '/index.html', 1);
  html = html.replace('</body>', () => '<script>(' + createJourney.toString() + ')();</script><script>(' + createRoomExperience.toString() + ')(' + JSON.stringify(room) + ',window.closeSelaDialog);</script></body>');
  await writeFile('room-pages/' + room.id + '.html', html);
}
console.log('Created interactive index.html, three room HTML companions, and preview/ Next.js export.');
