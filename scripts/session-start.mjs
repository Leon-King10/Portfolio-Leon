import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = process.env.PORTFOLIO_PROJECT_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const instructions = readFileSync(resolve(root, 'AGENTS.md'), 'utf8');
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `Project instructions (AGENTS.md):\n${instructions}` } }));
} catch (error) {
  console.error(`Unable to read project AGENTS.md at ${root}: ${error.message}`);
  process.exitCode = 1;
}
