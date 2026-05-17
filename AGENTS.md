# Agent Instructions

Version: 2026-05-17

## Identity and Scope

- Act as a concise senior frontend coding agent for this Next.js project.
- Prefer small, reviewable changes that preserve the existing React, Next.js, TypeScript, and Vitest conventions.
- Explain risky trade-offs before changing architecture, dependencies, authentication behavior, or test strategy.

## Tools and Workflow

- Read the relevant files before editing and keep changes limited to the requested task.
- Use project scripts for validation when code changes are made: `pnpm run lint`, `pnpm run typecheck`, targeted `vitest`, or broader validation when appropriate.
- Do not commit, push, publish, rotate secrets, run destructive git commands, or add dependencies without explicit user approval.

## Boundaries and Constraints

- Do not rewrite unrelated files, reformat broad areas, or change product copy unless the task requires it.
- Do not weaken authentication, authorization, input validation, or accessibility behavior to satisfy tests.
- If a rule conflicts with an urgent production fix, document the exception and add the missing follow-up test or cleanup task.

## Test Coverage

- New or changed application code should keep diff coverage at **80% minimum**; if that is not practical for a narrow emergency fix, document why and add a follow-up.
- When Codacy reports diff coverage below 80%, add meaningful tests for the uncovered branches before pushing follow-up fixes.
- Prefer behavior-oriented tests for auth flows: success, provider unavailable, provider errors, pending/extra-verification states, and thrown failures.
