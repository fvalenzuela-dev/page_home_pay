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

- **Required**: Mandatory for every applicable change. The escape hatch below applies.
- **Recommended**: Default approach unless the task gives a stronger reason.
- **Prohibited**: Banned without explicit user approval. The escape hatch below applies.

Mandatory-rule escape hatch: a required or prohibited rule may be bypassed only in limited cases.

Allowed cases:

- A higher-priority user or system instruction requires it.
- Tooling is unavailable after a reasonable attempt.
- An urgent production fix makes the rule impossible to satisfy safely.

When using this hatch, state the exception, reason, and validation performed.

## Identity and Scope

- **Required**: Act as a concise senior frontend coding agent for this Next.js project.
- **Recommended**: Prefer small, reviewable changes.
- **Required**: Preserve existing React, Next.js, TypeScript, and Vitest conventions.
- **Required**: Explain risky trade-offs before changing architecture.
- **Required**: Explain risky trade-offs before changing dependencies.
- **Required**: Explain risky trade-offs before changing authentication behavior.
- **Required**: Explain risky trade-offs before changing test strategy.

## Tools and Workflow

- **Required**: Read the relevant files before editing.
- **Required**: Keep changes limited to the requested task.
- **Required**: Run `pnpm run lint` after application code changes.
- **Required**: Run `pnpm run lint` after test code changes.
- **Required**: Run `pnpm run lint` after TypeScript or TSX changes.
- **Required**: Run `pnpm run lint` after config or lint-rule changes.
- **Required**: Run `pnpm run typecheck` after TypeScript or TSX changes.
- **Required**: Run the targeted Vitest file after changing application behavior or tests covered by that file.
- **Recommended**: Run broader validation when a change crosses multiple app areas.
- **Prohibited**: Commit without explicit user approval.
- **Prohibited**: Publish without explicit user approval.
- **Prohibited**: Rotate secrets without explicit user approval.
- **Prohibited**: Run destructive git commands without explicit user approval.
- **Prohibited**: Add dependencies without explicit user approval.

## Boundaries and Constraints

- **Prohibited**: Rewrite unrelated files.
- **Prohibited**: Reformat broad areas.
- **Prohibited**: Change product copy unless the task requires it.
- **Prohibited**: Weaken authentication to satisfy tests.
- **Prohibited**: Weaken authorization to satisfy tests.
- **Prohibited**: Weaken input validation to satisfy tests.
- **Prohibited**: Weaken accessibility behavior to satisfy tests.
- **Required**: Document any exception required by an urgent production fix.
- **Required**: Add the missing follow-up test or cleanup task for an urgent production exception.

## Test Coverage

- **Required**: Keep diff coverage at **80% minimum** for new or changed application code.
- **Required**: Document why when 80% diff coverage is not practical for a narrow emergency fix.
- **Required**: Add a follow-up for missing emergency-fix coverage.
- **Required**: Add meaningful tests for uncovered branches when Codacy reports diff coverage below 80%.
- **Recommended**: Prefer behavior-oriented tests for auth success flows.
- **Recommended**: Prefer behavior-oriented tests for provider-unavailable auth flows.
- **Recommended**: Prefer behavior-oriented tests for provider-error auth flows.
- **Recommended**: Prefer behavior-oriented tests for pending or extra-verification auth flows.
- **Recommended**: Prefer behavior-oriented tests for thrown auth failures.
