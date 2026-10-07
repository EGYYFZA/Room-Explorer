import { lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// Only disposable local artifacts; preserve source, HTML exports and running Next.js.
const disposable = ['.npm-cache', 'test-results', 'playwright-report', 'preview'];
for (const name of disposable) {
  const target = path.resolve(root, name);
  if (path.dirname(target) !== path.resolve(root)) throw new Error('Invalid cleanup target');
  const entry = await lstat(target).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (!entry) continue;
  if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`Refusing non-directory: ${target}`);
  await rm(target, { recursive: true });
  console.log(`Removed ${name}/`);
}
