---
name: pr-description
description: "Draft a merge request / pull request description from the commits on the current branch"
argument-hint: "Optional: issue or ticket ID, for example PROJ-123"
agent: agent
tools: ['read', 'search', 'execute']
---

Draft a merge request / pull request description for the current branch.

1. Run `git log --oneline main..HEAD` and `git diff --stat main...HEAD`
   in the terminal to see what changed. Read changed files as needed.
2. If the user supplied an issue or ticket ID, reference it in the title
   and in a "Closes" line.
3. Output Markdown only, using exactly this structure:

## Summary
One or two sentences on what this change does and why.

## Changes
- Bulleted list grouped by area (backend, frontend, tests, config)

## How to test
- Numbered steps a reviewer can follow locally

## Test evidence
- Tests added/updated and their result, plus any browser (Playwright) checks

## Risks and follow-ups
- Anything a reviewer should look at closely

Keep it platform-neutral so it can be pasted into a GitLab merge request
or a GitHub pull request. Do not push, and do not create the MR/PR.