const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TODO critical workflow', () => {
  test('user can add, complete, and delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `E2E task ${Date.now()}`;

    await todoPage.goto();

    await expect(page.getByText('TODO Command Center')).toBeVisible();

    await todoPage.addTask(title);
    await expect(page.getByText(title)).toBeVisible();

    await todoPage.markTaskComplete(title);
    await expect(page.getByText('Done')).toBeVisible();

    await todoPage.deleteTask(title);
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
