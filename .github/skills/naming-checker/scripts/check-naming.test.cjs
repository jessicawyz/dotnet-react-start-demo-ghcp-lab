'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');
const { loadRules, scanProject, renderReport } = require('./check-naming.cjs');

function fixture(t, entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'naming-checker-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(entries)) {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return root;
}

test('reports camelCase filenames and preserves filename exclusions', t => {
  const root = fixture(t, {
    'userService.ts': '',
    'userService.test.ts': 'let bad_name;',
    'reviewHelper.agent.md': '',
    'README.md': '',
    'SKILL.md': '',
    'user-service.config.ts': '',
    'node_modules/ignoredFile.js': 'let bad_name;',
    'generated/ignoredFile.ts': 'let bad_name;',
  });
  const result = scanProject(root, loadRules(root));
  assert.deepEqual(result.findings.filter(item => item.category === 'file').map(item => item.fix),
    ['user-service.ts']);
  assert.equal(result.findings.filter(item => item.category === 'variable').length, 1);
  assert.equal(result.files, 6);
});

test('checks declarations, destructuring, constants, and types without text false positives', t => {
  const root = fixture(t, {
    'example.ts': `
// const comment_name = 1;
const MAX_RETRIES = 3;
const retry_limit = -2 as const;
const options = { external_name: true };
let user_name, other_name;
const { external_name: local_name } = options;
function do_work(input_value: string) {
  const local_value = "let fake_name = 1";
  return local_value;
}
interface user_record { external_name: string }
type result_type<item_type> = item_type;
class user_service { do_work() {} }
enum response_code { external_name }
`,
  });
  const result = scanProject(root, loadRules(root));
  const byName = new Map(result.findings.map(item => [item.name, item]));
  for (const name of ['user_name', 'other_name', 'local_name', 'do_work', 'input_value', 'local_value']) {
    assert.equal(byName.get(name).category, 'variable');
  }
  for (const name of ['user_record', 'result_type', 'item_type', 'user_service', 'response_code']) {
    assert.equal(byName.get(name).category, 'type');
  }
  assert.equal(byName.get('retry_limit').fix, 'RETRY_LIMIT');
  assert.equal(byName.get('user_service').fix, 'UserService');
  assert.match(byName.get('user_name').location, /example\.ts:\d+:\d+$/);
  for (const name of ['comment_name', 'fake_name', 'external_name', 'MAX_RETRIES', 'options']) {
    assert.equal(byName.has(name), false, name);
  }
});

test('supports overrides and rejects invalid configuration explicitly', t => {
  const root = fixture(t, {
    'UserCard.tsx': 'export const UserCard = () => <div />;',
    'naming-checker.config.json': JSON.stringify({
      files: 'PascalCase', variables: 'PascalCase',
      allowFiles: ['naming-checker.config.json'],
    }),
    '.custom-rules.json': JSON.stringify({ variables: 'snake_case' }),
  });
  assert.equal(scanProject(root, loadRules(root)).findings.length, 0);
  assert.throws(() => loadRules(root, path.join(root, '.custom-rules.json')), /Unsupported naming style/);
  fs.writeFileSync(path.join(root, '.custom-rules.json'), '{"unknown":true}');
  assert.throws(() => loadRules(root, path.join(root, '.custom-rules.json')), /Unknown naming rule/);
});

test('CLI reports table, syntax errors, clean results, and operational failures with exit codes', t => {
  const root = fixture(t, { 'good-name.ts': 'let userName;' });
  const script = path.join(__dirname, 'check-naming.cjs');
  const run = (...args) => {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    if (result.error) throw result.error;
    return result;
  };
  const clean = run(root);
  assert.equal(clean.status, 0);
  assert.match(clean.stdout, /No naming findings/);
  fs.writeFileSync(path.join(root, 'good-name.ts'), 'let user_name;');
  const naming = run(root);
  assert.equal(naming.status, 1);
  assert.match(naming.stdout, /\| Severity \| Location \| Category \| Name \| Suggested fix \|/);
  assert.match(naming.stdout, /\| warning \| .* \| variable \| user_name \| userName \|/);
  fs.writeFileSync(path.join(root, 'good-name.ts'), 'let = ;');
  const invalid = run(root);
  assert.equal(invalid.status, 2);
  assert.match(invalid.stdout, /\| error \| .* \| syntax \|/);
  assert.equal(run(root, '--unknown', 'value').status, 2);
  const missing = run(path.join(root, 'missing'));
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /Naming checker failed:/);
});

test('escapes Markdown table cells', () => {
  const report = renderReport({
    findings: [{ severity: 'error', location: 'a.ts:1:1', category: 'syntax', name: 'a | b\nc', fix: 'Repair' }],
    files: 1, sourceFiles: 1,
  });
  assert.match(report, /a \\\| b c/);
});
