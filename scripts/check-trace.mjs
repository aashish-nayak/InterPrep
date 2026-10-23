import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { instrument, traceIds } from '../src/trace.js';

const questions = JSON.parse(fs.readFileSync('src/questions.json', 'utf8'));
for (const question of questions.filter(q => traceIds.has(q.id))) {
  const code = question.code.filter(c => c.language === 'php').map(c => c.text).join('\n\n');
  const run = input => spawnSync('php', ['-d', 'display_errors=stderr'], { input, encoding: 'utf8' });
  const plain = run(`<?php\n${code}`);
  const traced = run(instrument(code));
  assert.equal(traced.status, 0, `Question ${question.id}: ${traced.stderr}`);
  const result = JSON.parse(traced.stdout);
  assert.equal(result.error, null, `Question ${question.id}`);
  if (question.id !== 54) assert.equal(result.output, plain.stdout, `Output parity: ${question.id}`);
  assert.ok(result.steps.length > 0);
  assert.ok(result.steps.every(s => s.line >= 1 && s.line <= code.split('\n').length));
  assert.equal(result.steps.at(-1).output, result.output);
  if (question.id === 112) {
    assert.equal(result.steps.length, 48);
    assert.equal(result.steps.at(-1).variables.i, 5);
    assert.equal(result.output.replace(/\r\n/g, '\n'), '*\n**\n***\n****\n');
  }
}
console.log(`TRACE_PARITY_OK: ${traceIds.size} reviewed examples`);

