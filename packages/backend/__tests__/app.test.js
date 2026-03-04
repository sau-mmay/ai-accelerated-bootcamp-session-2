const { __testables } = require('../src/app');

const { normalizeSort, validateTodoPayload } = __testables;

describe('Backend unit tests', () => {
  describe('validateTodoPayload', () => {
    it('returns null for a valid payload', () => {
      const error = validateTodoPayload({
        title: 'Ship unit tests',
        dueDate: '2026-03-10T09:00',
        priority: 'High',
        status: 'In Progress',
      });

      expect(error).toBeNull();
    });

    it('rejects empty title', () => {
      const error = validateTodoPayload({ title: '   ' });
      expect(error).toBe('Task title is required');
    });

    it('rejects invalid due date', () => {
      const error = validateTodoPayload({
        title: 'Test date',
        dueDate: 'not-a-date',
      });

      expect(error).toBe('Due date must be a valid date/time');
    });

    it('rejects unsupported priority', () => {
      const error = validateTodoPayload({
        title: 'Test priority',
        priority: 'Critical',
      });

      expect(error).toBe('Priority must be one of Low, Medium, High, Urgent');
    });
  });

  describe('normalizeSort', () => {
    it('returns due date clause', () => {
      const clause = normalizeSort('dueDate', 'asc');
      expect(clause).toContain('due_date ASC');
    });

    it('returns title clause', () => {
      const clause = normalizeSort('title', 'desc');
      expect(clause).toBe('title DESC');
    });

    it('returns fallback clause', () => {
      const clause = normalizeSort('unknownSort', 'desc');
      expect(clause).toBe('created_at DESC');
    });
  });
});
