import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('instruction hook supplies AGENTS.md as context and reports missing files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-hook-'));
  const run = () => spawnSync(process.execPath, ['scripts/session-start.mjs'], { cwd: process.cwd(), env: { ...process.env, PORTFOLIO_PROJECT_ROOT: dir }, encoding: 'utf8' });
  const missing = run();
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /AGENTS\.md/);
  writeFileSync(join(dir, 'AGENTS.md'), 'Project instruction example');
  const result = run();
  assert.equal(result.status, 0);
  assert.match(JSON.parse(result.stdout).hookSpecificOutput.additionalContext, /Project instruction example/);
});

test('documented structure matches the project', () => {
  const result = spawnSync(process.execPath, ['scripts/check-structure.mjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
