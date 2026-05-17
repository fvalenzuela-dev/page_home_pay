# Agent Instructions

## Test Coverage

- New or changed application code must keep diff coverage at **80% minimum**.
- When Codacy reports diff coverage below 80%, add meaningful tests for the uncovered branches before pushing follow-up fixes.
- Prefer behavior-oriented tests for auth flows: success, provider unavailable, provider errors, pending/extra-verification states, and thrown failures.
