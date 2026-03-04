# Coding Guidelines — TODO App

This document defines coding standards for the TODO app to ensure consistency, quality, and long-term maintainability.

## 1) Core Principles

- Prioritize readability over cleverness.
- Keep code simple, explicit, and testable.
- Follow the **DRY (Don’t Repeat Yourself)** principle.
- Apply **single responsibility** at function/module level.
- Prefer small, composable units over large, tightly coupled blocks.

## 2) Formatting and Style Rules

- Use project tooling as the source of truth for formatting and linting.
- Keep indentation and spacing consistent with existing project files.
- Use meaningful names for variables, functions, classes, and files.
- Avoid one-letter names except for conventional short-lived loop indices.
- Keep functions focused; split overly long functions into helpers.
- Keep files reasonably scoped; avoid “god files” with unrelated logic.

## 3) Import Organization

Order imports consistently in this sequence:

1. Node.js / built-in modules
2. Third-party dependencies
3. Internal absolute modules (if configured)
4. Relative modules (`../`, `./`)
5. Style imports / side-effect imports (where applicable)

Additional rules:

- Group imports with a blank line between groups.
- Sort imports alphabetically within each group when practical.
- Remove unused imports.
- Avoid deep relative paths when cleaner module structure is possible.

## 4) JavaScript / TypeScript Best Practices

- Prefer `const`; use `let` only when reassignment is needed.
- Avoid `var`.
- Use strict equality (`===` / `!==`).
- Handle null/undefined cases explicitly.
- Favor pure functions for business logic where possible.
- Avoid mutable shared state unless necessary and well-contained.
- Use early returns to reduce nesting.
- Keep async code explicit with proper `await` and error handling.

## 5) React Frontend Guidelines

- Use functional components and hooks.
- Keep UI components presentational where possible; move business logic to hooks/services.
- Keep component props clear and minimal.
- Derive UI state when possible; avoid duplicated state.
- Extract reusable UI patterns into shared components.
- Keep event handlers and side effects organized and predictable.

## 6) Backend Guidelines

- Separate routing, controller logic, and domain/business logic.
- Validate inputs at API boundaries.
- Return consistent HTTP status codes and response formats.
- Centralize error handling patterns.
- Keep endpoint handlers thin; move reusable logic into services/helpers.

## 7) Linting and Static Analysis

- Use **ESLint** as the required linter.
- Lint checks should run locally before pushing changes.
- Treat linter warnings as actionable; avoid ignoring rules without justification.
- If a rule must be disabled, scope it narrowly and document why.

## 8) DRY and Reuse Guidance

- When similar logic appears in multiple places, extract shared helpers or utilities.
- Reuse existing components/functions before creating new ones.
- Avoid copy-paste across frontend/backend without abstraction.
- Do not over-abstract early; extract only when duplication is real and recurring.

## 9) Error Handling and Logging

- Fail clearly with actionable error messages.
- Do not swallow errors silently.
- Use structured, minimal logging for debugging and operations.
- Never log sensitive values (credentials, tokens, personal data).

## 10) Maintainability Standards

- Keep public interfaces stable and intentional.
- Write code that is easy to test and reason about.
- Refactor opportunistically when touching nearby fragile code.
- Keep documentation updated when behavior or architecture changes.
- All new features should include or update relevant tests.

## 11) Definition of Done (Coding)

Code is considered complete only when:

- It follows the formatting and import standards in this document.
- It passes linting and applicable test checks.
- It avoids unnecessary duplication and respects DRY.
- It includes clear naming and maintainable structure.
- It updates related documentation when needed.
