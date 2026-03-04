# Functional Requirements — TODO App

This document defines the core functional requirements for a TODO application.

## 1. Task Creation

1.1 The user can create a new task with a required title.

1.2 The user can optionally add:
- A detailed description
- A due date and time
- A priority level (`Low`, `Medium`, `High`, `Urgent`)
- One or more tags (for example: `work`, `home`, `study`)

1.3 The app validates task creation rules:
- Title cannot be empty
- Due date cannot be set to an invalid date/time
- Duplicate titles are allowed, but each task must have a unique internal ID

## 2. Task Editing and Updates

2.1 The user can edit any existing task field after creation.

2.2 The user can mark a task as complete or incomplete.

2.3 The user can duplicate an existing task to speed up repeated work.

2.4 The user can add and remove subtasks from a parent task.

2.5 The app tracks and stores a `last updated` timestamp for each task.

## 3. Task Organization

3.1 The user can sort tasks by:
- Due date (earliest first / latest first)
- Priority (highest first)
- Creation date (newest first / oldest first)
- Alphabetical title (A–Z / Z–A)

3.2 The user can manually reorder tasks using drag-and-drop in a custom list view.

3.3 The user can group tasks by status (`To Do`, `In Progress`, `Done`).

3.4 The user can move tasks between lists or projects (for example: `Personal`, `Work`, `Errands`).

## 4. Filtering and Search

4.1 The user can filter tasks by status, priority, tags, project/list, and due date range.

4.2 The user can quickly view smart slices:
- Overdue tasks
- Due today
- Due this week
- Completed tasks

4.3 The user can search tasks by title and description using partial text matching.

## 5. Deadlines and Reminders

5.1 The user can set one or multiple reminders per task.

5.2 The app sends notifications when reminders are reached (in-app at minimum).

5.3 The app highlights overdue tasks visually.

5.4 The user can snooze a reminder for predefined intervals (for example: 10 minutes, 1 hour, tomorrow).

## 6. Recurring Tasks

6.1 The user can create recurring tasks with patterns such as:
- Daily
- Weekly (selected weekdays)
- Monthly (specific day)
- Custom interval (every _N_ days)

6.2 Completing a recurring task automatically schedules the next occurrence.

6.3 The user can edit only one occurrence or all future occurrences.

## 7. Bulk Actions

7.1 The user can select multiple tasks and apply bulk operations:
- Mark complete/incomplete
- Change priority
- Add/remove tags
- Move to another list/project
- Delete

## 8. Data Integrity and Persistence

8.1 Task data persists across app restarts.

8.2 Deleting a task requires confirmation or supports an undo window.

8.3 The app supports soft delete (trash) with restore capability before permanent removal.

## 9. Collaboration (Stretch Core)

9.1 The user can share a list/project with another user.

9.2 Shared users can be assigned roles (`Owner`, `Editor`, `Viewer`).

9.3 A task can be assigned to a specific collaborator.

9.4 The app records activity history for shared lists (create/edit/complete/delete events).

## 10. Usability Expectations (Functional)

10.1 The user can perform all core actions (create, edit, complete, delete) with keyboard only.

10.2 The app supports quick-add input so the user can create tasks rapidly without opening a full form.

10.3 The app provides clear error messages for invalid inputs and failed operations.

10.4 The app confirms successful operations with lightweight feedback (for example: toast or inline status).

## 11. Suggested Minimum Viable Functional Scope (MVP)

At minimum, an MVP implementation must support:
- Create, edit, complete, and delete tasks
- Due dates
- Priority
- Sorting by due date and priority
- Filtering by status
- Persistent storage
