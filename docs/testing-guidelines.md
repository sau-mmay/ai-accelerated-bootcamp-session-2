# Testing Guidelines — TODO App

This document defines mandatory testing standards to ensure code quality, reliability, and maintainability across the TODO app project.

## 1) Testing Strategy

Use a layered testing strategy:

- **Unit tests** for individual functions and React components in isolation.
- **Integration tests** for backend API behavior through real HTTP requests.
- **End-to-end (E2E) tests** for complete user workflows in a real browser.

All new features must include appropriate tests at one or more of these layers.

## 2) Unit Testing Standards

### Framework

- Use **Jest** for unit tests.

### Naming Convention

- Unit test files must use: `*.test.js` or `*.test.ts`.
- Test file names should match what they are testing.
  - Example: `app.test.js` for `app.js`.

### Placement

- Backend unit tests: `packages/backend/__tests__/`
- Frontend unit tests: `packages/frontend/src/__tests__/`

### Scope

- Test pure functions, utility modules, business logic, and React components in isolation.
- Mock external dependencies (network, file system, DB, time) when needed.

## 3) Integration Testing Standards

### Framework

- Use **Jest + Supertest** for backend integration tests.
- Integration tests must exercise API endpoints using real HTTP requests.

### Naming Convention

- Integration test files must use: `*.test.js` or `*.test.ts`.
- Name files clearly by API area.
  - Example: `todos-api.test.js` for TODO endpoint behavior.

### Placement

- Place integration tests in: `packages/backend/__tests__/integration/`

### Scope

- Validate status codes, request/response schema, validation behavior, and error handling.
- Cover key endpoint flows (create/read/update/delete) and essential edge cases.

## 4) End-to-End (E2E) Testing Standards

### Framework

- Use **Playwright** (required framework).

### Naming Convention

- E2E test files must use: `*.spec.js` or `*.spec.ts`.
- Name files by user journey.
  - Example: `todo-workflow.spec.js`.

### Placement

- Place E2E tests in: `tests/e2e/`

### Scope and Limits

- Limit E2E suite to **5–8 critical user journeys**.
- Focus on happy paths and key edge cases.
- Do not attempt exhaustive E2E coverage.

### Browser Policy

- Playwright tests must run on **one browser only** for consistency and speed.

### Architecture Pattern

- Playwright tests must use the **Page Object Model (POM)** pattern for maintainability.

## 5) Test Isolation and Reliability

- All tests must be isolated and independent.
- Each test must create or arrange its own data.
- Tests must not rely on execution order or side effects from other tests.
- Setup and teardown hooks are required where applicable.
- Tests must pass reliably across multiple runs (locally and in CI).

## 6) Port Configuration Standards

Always use environment variables with sensible defaults.

### Backend

Use:

```js
const PORT = process.env.PORT || 3030;
```

### Frontend

- Default React port is `3000`.
- Allow override via `PORT` environment variable.

This is required so CI/CD workflows can dynamically detect and manage ports.

## 7) Quality and Maintainability Rules

- Keep tests readable, focused, and deterministic.
- Prefer explicit assertions over snapshot-heavy tests (unless snapshots clearly add value).
- Avoid brittle selectors and timing dependencies.
- Use clear arrange/act/assert structure.
- Remove duplication with shared helpers only when it improves clarity.
- Keep test names descriptive of behavior and expected outcome.

## 8) Definition of Done for Testing

A feature is not complete unless:

- Appropriate unit and/or integration tests are added for new logic.
- E2E coverage is added or updated when user workflow behavior changes.
- Tests pass locally and in CI.
- Test code follows naming, folder, and isolation standards in this document.
