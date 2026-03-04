class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(title) {
    await this.page.getByRole('textbox', { name: /Task title/i }).fill(title);
    await this.page.getByRole('button', { name: /^Add Task$/ }).click();
  }

  async taskCard(title) {
    return this.page.locator('.MuiCard-root', { hasText: title }).first();
  }

  async markTaskComplete(title) {
    const card = await this.taskCard(title);
    await card.getByRole('button', { name: /Complete|Reopen/i }).click();
  }

  async deleteTask(title) {
    const card = await this.taskCard(title);
    await card.getByRole('button', { name: /^Delete$/ }).click();
  }
}

module.exports = { TodoPage };
