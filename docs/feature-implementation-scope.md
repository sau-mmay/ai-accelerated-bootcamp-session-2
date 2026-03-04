# Feature Implementation Ideas & Scope — TODO App

This document is a working context file for implementation planning, scope control, and handoff continuity.

## Purpose

- Track what has been implemented
- Capture what is intentionally deferred
- Define next-slice scope and acceptance criteria
- Keep architecture and testing direction aligned with project docs

## Source of Truth

This plan aligns with:
- `docs/functional-requirements.md`
- `docs/ui-guidelines.md`
- `docs/testing-guidelines.md`
- `docs/coding-guidelines.md`

## Current Status Snapshot

### Completed: Slice 1 (MVP Core)

Backend:
- Migrated from `items` to `todos` domain model
- Persistent SQLite storage (file-based DB)
- Implemented TODO API endpoints:
  - `GET /api/todos` (supports status filter + sorting)
  - `POST /api/todos`
  - `PUT /api/todos/:id`
  - `PATCH /api/todos/:id/complete`
  - `DELETE /api/todos/:id`
- Validation for title, due date, priority, and status
- Port configuration remains env-driven (`process.env.PORT || 3030`)

Frontend:
- Rebuilt app using Material UI (MUI)
- Implemented cyan/black dark theme with glass treatment for primary CTA
- Added core workflows:
  - add task
  - edit task
  - complete/reopen task
  - delete task
  - sort tasks
  - filter by status

Testing:
- Backend integration tests with Jest + Supertest
- Frontend unit/component tests with Jest + Testing Library + MSW
- Root test flow passes (`npm test`)

## Deferred (Explicitly Paused)

### Slice 2 (On Hold)

Planned but not started:
- Search (title + description partial match)
- Smart views:
  - overdue
  - due today
  - due this week
  - completed
- Bulk actions:
  - complete/incomplete
  - priority changes
  - delete multiple
- Soft delete + restore (trash behavior)
- Optional undo affordance for delete

## Proposed Next Slices

### Slice 2 — Productivity Core

Scope:
- Search API + UI search bar
- Smart view filters in UI + backend query support
- Multi-select task mode + bulk actions
- Soft delete schema updates and restore endpoints

Acceptance:
- All new behavior tested (unit/integration as appropriate)
- Existing tests remain green
- UX remains consistent with MUI + cyan/black style system

### Slice 3 — Structured Planning

Scope:
- Tags
- List/project grouping
- Improved sorting combinations

Acceptance:
- Grouping/filtering interactions are keyboard accessible
- No regression in existing CRUD flows

### Slice 4 — Advanced Tasking

Scope:
- Subtasks
- Recurrence rules
- Reminder scheduling + snooze model

Acceptance:
- Data model and API remain maintainable
- Critical flows covered by integration tests

### Slice 5 — Stretch Collaboration

Scope:
- Shared lists/projects
- Roles (`Owner`, `Editor`, `Viewer`)
- Assignment and activity history

Acceptance:
- Role-based access behavior validated through tests

## Scope Guardrails

- Prioritize vertical slices that deliver API + UI + tests together
- No feature is "done" without tests aligned to `docs/testing-guidelines.md`
- Keep implementation DRY and maintainable per `docs/coding-guidelines.md`
- Avoid adding non-essential UI complexity before core functional completeness
- Keep E2E suite focused (5–8 critical journeys max)

## Implementation Notes for Resume

When resuming from pause:
1. Start Slice 2 with soft delete data model decisions first
2. Add search + smart views next (query design before UI polish)
3. Implement bulk actions after multi-select interaction is stable
4. Add/update tests in the same PR as each feature increment

## Open Decisions (To Confirm Before Slice 2)

- Soft delete retention strategy (time-based purge vs manual empty trash)
- Search matching depth (title-only MVP vs title + description + tags)
- Bulk action UX (toolbar vs contextual action panel)
- Whether smart views are tabs, chips, or sidebar list

## Definition of Progress

A slice is considered complete only when:
- Functional scope for the slice is implemented end-to-end
- Tests pass locally and in CI
- Documentation context in this file is updated for the next handoff
