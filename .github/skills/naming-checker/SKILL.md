---
name: naming-checker
description: Validate file, variable, constant, and type naming against project standards and report a severity table with suggested fixes. Use for naming audits, camelCase versus kebab-case filenames, identifier convention reviews, and naming-related code review findings, even when the user does not explicitly request this skill.
compatibility: Node.js 18 or newer and npm; install the bundled TypeScript parser dependency before running.
---

# Naming checker

## Workflow

1. Identify the requested project root and scope. Read its contributor guidance,
   instruction files, naming lint rules, and representative source files.
   Prefer explicit project standards over inferred patterns. Explain conflicting
   standards and ask for a decision when the conflict affects findings.
2. Map the standards to the scanner's rules below. Treat its defaults as
   provisional when no project standard exists; state that assumption in the report.
   Honor framework conventions such as PascalCase React component filenames.
3. Install dependencies with `npm ci --prefix "<skill-directory>"` if unavailable.
   Run the bundled script using absolute paths, quoting paths with spaces:

   ```text
   node "<skill-directory>/scripts/check-naming.cjs" "<project-root>"
   node "<skill-directory>/scripts/check-naming.cjs" "<project-root>" --config "<rules.json>"
   ```

   Use the platform's path separators. The scanner is read-only and runs on
   Windows and macOS. It does not rename files or identifiers.
4. Review the findings against project standards. For other languages or naming
   rules the script cannot express, inspect source or use existing project
   linters. Label these as manual checks; do not imply automated coverage.
5. Return the findings table, naming assumptions, scan scope, and coverage
   limitations. Preserve scanner errors rather than presenting an incomplete
   scan as clean. Before proposing renames, check imports, exports, public APIs,
   reflection, serialization, and case-sensitive filesystem references.
   Do not apply fixes unless requested.

## Automated rules

The script scans filenames across the project and declarations in `.js`, `.jsx`,
`.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, and `.cts` files using the TypeScript AST.

| Category | Default | Scope |
| --- | --- | --- |
| Files | kebab-case | Each dot-separated filename segment before the last extension. |
| Variables | camelCase | Local bindings, parameters, functions, and methods. |
| Constants | UPPER_SNAKE_CASE | Top-level `const` bindings initialized with a string, number, boolean, or signed numeric literal. Other `const` bindings are variables. |
| Types | PascalCase | Classes, interfaces, type aliases, enums, and type parameters. |

Filename checks exclude names ending in `.agent.md` and names containing `.test.`
(case-insensitive). Test source declarations are still checked. Conventional
filenames (`SKILL.md`, `README.md`, `LICENSE`, `LICENSE.txt`, `AGENTS.md`,
`CONTRIBUTING.md`, `CHANGELOG.md`, `Dockerfile`, `Makefile`) and dotfiles are
exempt from filename checks.

The scanner skips symlinks and `.git`, `node_modules`, `dist`, `build`, `coverage`,
`.next`, `vendor`, and `generated` directories. It does not interpret gitignore.
Add generated directories to `excludeDirectories` when needed. Declaration files
(`.d.ts`, `.d.mts`, `.d.cts`) are excluded from identifier checks.

Imports, object properties, enum members, string/computed method names, and
property signatures are not checked because their names may be external contracts.
Leading underscores and dollar signs are not accepted by default. Assess those
conventions and unsupported language-specific rules manually.

## Project overrides

The script loads `naming-checker.config.json` from the project root when present.
An explicit `--config` path overrides that discovery. Resolve a relative config
path from the current working directory. Unknown fields or invalid styles fail
explicitly. Each style supports `camelCase`, `kebab-case`, `PascalCase`, or
`UPPER_SNAKE_CASE`. Overrides replace the default value, including arrays.

```json
{
  "files": "kebab-case",
  "variables": "camelCase",
  "constants": "UPPER_SNAKE_CASE",
  "types": "PascalCase",
  "allowFiles": ["SKILL.md", "README.md", "Dockerfile"],
  "excludeDirectories": [".git", "node_modules", "dist", "generated"]
}
```

For mixed filename conventions, scan the affected directories separately with
appropriate configs, or review the exceptions manually. Do not invent per-folder
configuration support. A config can be kept outside the project for an audit;
do not modify project policy without permission.

## Report

Output Markdown with these columns:

| Severity | Location | Category | Name | Suggested fix |
| --- | --- | --- | --- | --- |
| warning | src/userService.ts | file | userService.ts | user-service.ts |
| warning | src/userService.ts:3:7 | variable | user_name | userName |

Naming violations have `warning` severity. Syntax errors have `error` severity,
with a suggestion to repair the syntax and rerun. Locations include line and
column for declarations. Suggestions are candidates, not safe automated renames;
check collisions and references before applying them.

Exit codes: `0` means no findings within automated coverage, `1` means naming
findings, and `2` means invalid arguments/configuration, I/O failure, or source
syntax errors. A clean run prints the table header and an explicit no-findings
message.

## Verification

Run `npm test --prefix "<skill-directory>"` for focused scanner regression tests.
