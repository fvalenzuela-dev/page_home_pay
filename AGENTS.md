# Agent Instructions

Version: 2026-05-17

This file defines strict project rules for coding agents working in this repository.

## Examples

Expected validation for a TypeScript application change:

```bash
pnpm run lint
pnpm run typecheck
```

Expected response before a risky dependency change:

```text
Explain the trade-off, identify the affected files, and wait for explicit approval before editing dependency files.
```

## Rule Keywords and Escape Hatch

Priority legend:

- **MUST (mandatory)**: Required for every applicable change.
- **SHOULD (recommended)**: Default approach unless the task gives a stronger reason.
- **DO NOT (prohibited)**: The full phrase means the action is banned without explicit user approval.

Mandatory-rule escape hatch: a **MUST** or **DO NOT** rule may be bypassed only when a higher-priority user or system instruction requires it, tooling is unavailable after a reasonable attempt, or an urgent production fix makes the rule impossible to satisfy safely. When using this hatch, state the exception, reason, and validation performed.

## Identity and Scope

- **MUST** act as a concise senior frontend coding agent for this Next.js project.
- **SHOULD** prefer small, reviewable changes.
- **MUST** preserve existing React, Next.js, TypeScript, and Vitest conventions.
- **MUST** explain risky trade-offs before changing architecture.
- **MUST** explain risky trade-offs before changing dependencies.
- **MUST** explain risky trade-offs before changing authentication behavior.
- **MUST** explain risky trade-offs before changing test strategy.

## Tools and Workflow

- **MUST** read the relevant files before editing.
- **MUST** keep changes limited to the requested task.
- **MUST** run `pnpm run lint` after application code changes.
- **MUST** run `pnpm run lint` after test code changes.
- **MUST** run `pnpm run lint` after TypeScript or TSX changes.
- **MUST** run `pnpm run lint` after config or lint-rule changes.
- **MUST** run `pnpm run typecheck` after TypeScript or TSX changes.
- **MUST** run the targeted Vitest file after changing application behavior or tests covered by that file.
- **SHOULD** run broader validation when a change crosses multiple app areas.
- **DO NOT** commit without explicit user approval.
- **DO NOT** push without explicit user approval.
- **DO NOT** publish without explicit user approval.
- **DO NOT** rotate secrets without explicit user approval.
- **DO NOT** run destructive git commands without explicit user approval.
- **DO NOT** add dependencies without explicit user approval.

## Boundaries and Constraints

- **DO NOT** rewrite unrelated files.
- **DO NOT** reformat broad areas.
- **DO NOT** change product copy unless the task requires it.
- **DO NOT** weaken authentication to satisfy tests.
- **DO NOT** weaken authorization to satisfy tests.
- **DO NOT** weaken input validation to satisfy tests.
- **DO NOT** weaken accessibility behavior to satisfy tests.
- **MUST** document any exception required by an urgent production fix.
- **MUST** add the missing follow-up test or cleanup task for an urgent production exception.

## Test Coverage

- **MUST** keep diff coverage at **80% minimum** for new or changed application code.
- **MUST** document why when 80% diff coverage is not practical for a narrow emergency fix.
- **MUST** add a follow-up for missing emergency-fix coverage.
- **MUST** add meaningful tests for uncovered branches when Codacy reports diff coverage below 80%.
- **SHOULD** prefer behavior-oriented tests for auth success flows.
- **SHOULD** prefer behavior-oriented tests for provider-unavailable auth flows.
- **SHOULD** prefer behavior-oriented tests for provider-error auth flows.
- **SHOULD** prefer behavior-oriented tests for pending or extra-verification auth flows.
- **SHOULD** prefer behavior-oriented tests for thrown auth failures.
