# Page Home Pay

Next.js 16 application for home payment management.

## Local setup

1. Install Node.js 22 or newer.
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy environment placeholders:

   ```bash
   cp .env.example .env.local
   ```

4. Start development:

   ```bash
   pnpm run dev
   ```

## Validation commands

Run the full local validation gate before opening a PR:

```bash
pnpm run validate
```

That command runs:

| Command                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `pnpm run lint`          | Checks ESLint and Next.js lint rules.   |
| `pnpm run lint:css`      | Checks CSS with Stylelint.              |
| `pnpm run typecheck`     | Runs TypeScript without emitting files. |
| `pnpm run test:coverage` | Runs Vitest and generates LCOV coverage. |
| `pnpm run build`         | Builds the Next.js application.         |

## Required environment variables

See `.env.example` for all placeholders.

Current planned variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, for the future Clerk client integration.
- `CLERK_SECRET_KEY`, for future server-side Clerk usage.
- Optional Clerk route variables for sign-in/sign-up redirects.
- `GEMINI_API_KEY`, for AI-assisted GitHub workflows.
- `GH_PAT`, only for the manual discussion suggester workflow.
- GCP deployment secrets, only when deployment workflows are enabled.

## Workflow policy

- Feature, chore, fix, docs, and CI work branches target `develop`; PRs targeting `main` are rejected.
- Pull requests to `develop` must use an accepted branch prefix such as `feat/`, `feature/`, `fix/`, `chore/`, `docs/`, `test/`, `build/`, `ci/`, or `revert/`.
- Pull requests must link a GitHub issue in their description using keywords such as `Closes #123`, `Fixes #123`, or `Resolves #123`.
- Pull requests must have exactly one `type:*` label assigned (e.g., `type:feature`, `type:bug`) to pass validation.