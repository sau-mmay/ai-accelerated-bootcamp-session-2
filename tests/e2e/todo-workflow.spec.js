const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

const backendBaseURL = process.env.BACKEND_URL || 'http://127.0.0.1:3030';

test.describe('TODO critical workflow', () => {
  test('user can add, complete, and delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `E2E task ${Date.now()}`;

    await todoPage.goto();

    await expect(page.getByText('TODO Command Center')).toBeVisible();

    await todoPage.addTask(title);
    await expect(page.getByText(title)).toBeVisible();

    await todoPage.markTaskComplete(title);
    await todoPage.expectTaskStatus(title, 'Done');

    await todoPage.deleteTask(title);
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  });

  test('persists added task in backend and removes it after delete', async ({ page, request }) => {
    const todoPage = new TodoPage(page);
    const title = `E2E persisted task ${Date.now()}`;

    await todoPage.goto();
    await todoPage.addTask(title);
    await expect(page.getByText(title)).toBeVisible();

    await expect
      .poll(async () => {
        const response = await request.get(`${backendBaseURL}/api/todos`);
        if (!response.ok()) {
          return false;
        }

        const todos = await response.json();
        return todos.some((todo) => todo.title === title);
      })
      .toBe(true);

    await todoPage.deleteTask(title);
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);

    await expect
      .poll(async () => {
        const response = await request.get(`${backendBaseURL}/api/todos`);
        if (!response.ok()) {
          return true;
        }

        const todos = await response.json();
        return todos.some((todo) => todo.title === title);
      })
      .toBe(false);
  });
});
