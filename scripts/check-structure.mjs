import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const ignored = new Set(['.git', 'node_modules', 'dist', '.DS_Store']);
function walk(dir = '.') {
  return readdirSync(dir, { withFileTypes: true }).filter(entry => !ignored.has(entry.name) && !entry.name.endsWith('.tsbuildinfo')).sort((a,b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const path = join(dir, entry.name).replace(/^\.\//, '');
    return entry.isDirectory() ? [path + '/', ...walk(path)] : [path];
  });
}
const content = readFileSync('AGENTS.md', 'utf8');
const actual = walk().join('\n');
if (process.argv.includes('--write')) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync('AGENTS.md', content.replace(/<!-- structure:start -->[\s\S]*?<!-- structure:end -->/, `<!-- structure:start -->\n${actual}\n<!-- structure:end -->`));
  console.log('Updated project structure in AGENTS.md');
} else {
  const match = content.match(/<!-- structure:start -->\n([\s\S]*?)\n<!-- structure:end -->/);
  if (!match || match[1] !== actual) { console.error('Project structure is out of date. Run npm run structure:update and review AGENTS.md.'); process.exitCode = 1; }
  else console.log('Project structure matches AGENTS.md.');
}
