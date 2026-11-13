#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const DEFAULT_RULES = {
  files: 'kebab-case',
  variables: 'camelCase',
  constants: 'UPPER_SNAKE_CASE',
  types: 'PascalCase',
  allowFiles: [
    'SKILL.md', 'README.md', 'LICENSE', 'LICENSE.txt', 'AGENTS.md',
    'CONTRIBUTING.md', 'CHANGELOG.md', 'Dockerfile', 'Makefile',
  ],
  excludeDirectories: [
    '.git', 'node_modules', 'dist', 'build', 'coverage', '.next', 'vendor', 'generated',
  ],
};

const STYLES = {
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  'kebab-case': /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
  PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
  UPPER_SNAKE_CASE: /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/,
};

function loadRules(root, configPath) {
  const resolved = configPath
    ? path.resolve(configPath)
    : path.join(root, 'naming-checker.config.json');
  let overrides = {};
  if (configPath || fs.existsSync(resolved)) {
    overrides = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  }
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new Error('Naming configuration must be a JSON object.');
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (!Object.hasOwn(DEFAULT_RULES, key)) {
      throw new Error(`Unknown naming rule: ${key}`);
    }
    if (key === 'allowFiles' || key === 'excludeDirectories') {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item)) {
        throw new Error(`${key} must be an array of nonempty strings.`);
      }
    } else if (typeof value !== 'string' || !Object.hasOwn(STYLES, value)) {
      throw new Error(`Unsupported naming style for ${key}: ${value}`);
    }
  }
  return { ...DEFAULT_RULES, ...overrides };
}

function convertName(name, style) {
  const words = name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(word => word.toLowerCase());
  const capitalize = word => word[0].toUpperCase() + word.slice(1);
  if (!words.length || !/^[a-z]/.test(words[0])) {
    return `Choose a descriptive ${style} name`;
  }
  if (style === 'kebab-case') return words.join('-');
  if (style === 'UPPER_SNAKE_CASE') return words.join('_').toUpperCase();
  if (style === 'PascalCase') return words.map(capitalize).join('');
  return words[0] + words.slice(1).map(capitalize).join('');
}

function isLiteralConstant(node) {
  if (!node) return false;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) ||
      ts.isTypeAssertionExpression(node) || ts.isSatisfiesExpression(node)) {
    return isLiteralConstant(node.expression);
  }
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isNumericLiteral(node) || node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    (ts.isPrefixUnaryExpression(node) &&
      [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken].includes(node.operator) &&
      ts.isNumericLiteral(node.operand));
}

function scanProject(root, rules) {
  if (!fs.statSync(root).isDirectory()) throw new Error(`Not a directory: ${root}`);
  const findings = [];
  let sourceFiles = 0;
  let files = 0;

  function addName(name, category, location, style) {
    if (!STYLES[style].test(name)) {
      findings.push({
        severity: 'warning', location, category, name,
        fix: convertName(name, style),
      });
    }
  }

  function checkSource(fullPath, relativePath) {
    sourceFiles++;
    const source = ts.createSourceFile(
      fullPath, fs.readFileSync(fullPath, 'utf8'), ts.ScriptTarget.Latest, true,
    );
    function location(node) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
      return `${relativePath}:${line + 1}:${character + 1}`;
    }
    if (source.parseDiagnostics.length) {
      for (const diagnostic of source.parseDiagnostics) {
        const { line, character } = source.getLineAndCharacterOfPosition(diagnostic.start || 0);
        findings.push({
          severity: 'error',
          location: `${relativePath}:${line + 1}:${character + 1}`,
          category: 'syntax',
          name: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
          fix: 'Repair syntax and rerun the naming scan',
        });
      }
      return;
    }
    function checkBinding(binding, category) {
      if (ts.isIdentifier(binding)) {
        addName(binding.text, category, location(binding), rules[`${category}s`]);
      } else {
        for (const element of binding.elements) {
          if (ts.isBindingElement(element)) checkBinding(element.name, category);
        }
      }
    }
    function visit(node) {
      if (ts.isVariableDeclaration(node)) {
        const list = node.parent;
        const statement = list.parent;
        const topLevel = ts.isVariableStatement(statement) &&
          (ts.isSourceFile(statement.parent) || ts.isModuleBlock(statement.parent));
        const category = topLevel && (list.flags & ts.NodeFlags.Const) &&
          ts.isIdentifier(node.name) && isLiteralConstant(node.initializer)
          ? 'constant' : 'variable';
        checkBinding(node.name, category);
      } else if (ts.isParameter(node)) {
        checkBinding(node.name, 'variable');
      } else if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) ||
                 ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) ||
                 ts.isSetAccessorDeclaration(node)) {
        if (node.name && ts.isIdentifier(node.name)) checkBinding(node.name, 'variable');
      } else if (ts.isClassDeclaration(node) || ts.isClassExpression(node) ||
                 ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) ||
                 ts.isEnumDeclaration(node) || ts.isTypeParameterDeclaration(node)) {
        if (node.name) checkBinding(node.name, 'type');
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }

  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name, 'en'));
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!rules.excludeDirectories.includes(entry.name)) walk(fullPath);
      } else if (entry.isFile()) {
        files++;
        const relativePath = path.relative(root, fullPath);
        if (!entry.name.startsWith('.') && !rules.allowFiles.includes(entry.name) &&
            !/\.agent\.md$/i.test(entry.name) && !/\.test\./i.test(entry.name)) {
          const extension = path.extname(entry.name);
          const stem = extension ? entry.name.slice(0, -extension.length) : entry.name;
          const segments = stem.split('.');
          if (segments.some(segment => !STYLES[rules.files].test(segment))) {
            findings.push({
              severity: 'warning', location: relativePath, category: 'file', name: entry.name,
              fix: segments.map(segment => convertName(segment, rules.files)).join('.') + extension,
            });
          }
        }
        if (/\.(?:[cm]?[jt]s|[jt]sx)$/i.test(entry.name) &&
            !/\.d\.(?:[cm]?ts)$/i.test(entry.name)) {
          checkSource(fullPath, relativePath);
        }
      }
    }
  }
  walk(root);
  return { findings, files, sourceFiles };
}

function renderReport(result) {
  const escape = value => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
  const lines = [
    '| Severity | Location | Category | Name | Suggested fix |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const finding of result.findings) {
    lines.push(`| ${[
      finding.severity, finding.location, finding.category, finding.name, finding.fix,
    ].map(escape).join(' | ')} |`);
  }
  if (!result.findings.length) lines.push('\nNo naming findings within automated coverage.');
  lines.push(`\nScanned ${result.files} files; checked declarations in ${result.sourceFiles} JS/TS files.`);
  return lines.join('\n');
}

function main(args) {
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node check-naming.cjs <project-root> [--config <rules.json>]');
    return 0;
  }
  if (![1, 3].includes(args.length) || args[0].startsWith('--') ||
      (args.length === 3 && (args[1] !== '--config' || args[2].startsWith('--')))) {
    throw new Error('Usage: node check-naming.cjs <project-root> [--config <rules.json>]');
  }
  const root = path.resolve(args[0]);
  const result = scanProject(root, loadRules(root, args[2]));
  console.log(renderReport(result));
  if (result.findings.some(finding => finding.severity === 'error')) return 2;
  return result.findings.length ? 1 : 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`Naming checker failed: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = { loadRules, scanProject, renderReport };
