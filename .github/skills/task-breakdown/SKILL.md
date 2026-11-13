---
name: task-breakdown
description: Break down feature requests and user stories into implementable sub-tasks with T-shirt size estimates, dependencies, and testable acceptance criteria. Use whenever the user asks to "break down", "decompose", or "plan implementation" for a feature or user story, including requests for an implementation task list. Assess risks for shared code paths and database migrations. Do not use for unrelated requests to explain or break down text.
---

# Task breakdown

Produce an actionable implementation plan, not implementation code. Do not edit project files or create tickets unless separately requested.

## Workflow

1. Establish scope.
   - Summarize the intended user outcome, constraints, and explicit non-goals.
   - Ask focused questions if missing requirements would materially change the approach. Otherwise, state assumptions and open questions without presenting them as facts.
2. Inspect relevant context when available.
   - Review project guidance, affected components, existing patterns, tests, and database migration conventions.
   - Identify shared code paths and their consumers. If source is unavailable, label component names and impact estimates as provisional; do not invent paths or claim verification.
3. Decompose the work.
   - Give each task a stable ID such as T1 and an action-oriented title.
   - Make each task independently understandable, bounded, and verifiable, with one primary component or responsibility.
   - Include necessary implementation, integration, regression tests, and directly affected documentation. Avoid unrelated cleanup and generic tasks with no concrete deliverable.
   - Reference prerequisite task IDs only for actual dependencies. Mark independent tasks as `None`; allow them to run in parallel.
   - Order tasks so prerequisites appear first. Avoid cycles and references to nonexistent tasks.
4. Estimate relative effort using the sizing guide.
   - Consider implementation complexity, breadth of change, testing, coordination, and uncertainty.
   - Prefer XS through M for implementable tasks. Split L tasks where practical; decompose XL work into smaller tasks before finalizing the table.
   - If an XL task cannot yet be decomposed responsibly, mark it blocked by a bounded investigation task and explain the missing information.
5. Assess risk before finalizing.
   - Explicitly check every task for shared-code impact and database migrations; size and risk are separate judgments.
   - For shared code, identify affected consumers, compatibility concerns, regression coverage, and any staged rollout or rollback needs.
   - For migrations, assess data loss, backfill volume, locking or downtime, old/new application compatibility, deployment order, and rollback or forward-recovery feasibility. Do not assume a destructive migration is reversible.
   - Record likelihood and impact as low, medium, or high, explain why, and define mitigation and validation steps for each flagged task.
   - Add concrete mitigation work to the task table when it requires implementation. Make safety prerequisites explicit dependencies and include relevant safety checks in acceptance criteria.
6. Check completeness.
   - Trace the requested behavior to tasks and observable acceptance criteria.
   - Ensure dependency IDs resolve, estimates use the allowed sizes, and risk mitigations have corresponding work or validation.
   - Surface unresolved blockers rather than implying the plan is ready to implement.

## T-shirt sizing guide

Sizes express relative effort, not guaranteed hours or delivery dates. Use an existing team scale if supplied; otherwise use:

| Size | Meaning |
| --- | --- |
| XS | Small, localized change with a known approach and minimal verification. |
| S | Bounded change within one component with straightforward tests. |
| M | Several related changes or an integration with meaningful testing and some uncertainty. |
| L | Broad or complex work involving multiple components, coordination, or substantial verification; split where practical. |
| XL | Too broad or uncertain for a single implementation task; decompose or investigate first. |

## Output format

Start with a short scope summary, followed by assumptions and blocking questions if any.

### Implementation tasks

Use this exact five-column Markdown table. Put the task ID in the task-title cell so dependencies remain unambiguous. Replace placeholders with concrete content.

| Task title | Component | T-shirt size | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| T1: Action-oriented title | Affected component | XS/S/M/L/XL | None or prerequisite IDs | Observable, testable outcomes, including relevant edge cases and verification. |

Acceptance criteria should describe behavior or artifacts that demonstrate completion, not vague statements such as "works correctly" or "tests pass." Identify the specific behavior that tests must verify. Use `<br>` to separate multiple criteria within a cell.

### Risk assessment

Include one row per flagged task, referencing its task ID.

| Task | Risk area | Likelihood | Impact | Risk and affected consumers/data | Mitigation and validation |
| --- | --- | --- | --- | --- | --- |
| Task ID | Shared code / Database migration / Both | Low/Medium/High | Low/Medium/High | Concrete failure mode and blast radius | Prevention, targeted checks, rollout and recovery considerations |

If neither risk area applies, state that shared-code and migration risks were assessed and none were identified. If context is insufficient, state what remains unverified instead.

End with a brief implementation sequence, noting parallel work and any blockers or decisions needed before implementation.
