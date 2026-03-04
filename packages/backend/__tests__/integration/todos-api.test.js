const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Todos API integration', () => {
  describe('GET /api/todos', () => {
    it('returns todos in an array', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          priority: expect.any(String),
          status: expect.any(String),
        })
      );
    });
  });

  describe('POST /api/todos', () => {
    it('creates a new task with due date and priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Write integration tests',
          dueDate: '2026-03-10T09:00',
          priority: 'High',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: 'Write integration tests',
          priority: 'High',
          status: 'To Do',
        })
      );
    });

    it('returns 400 for empty title', async () => {
      const response = await request(app).post('/api/todos').send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title is required');
    });

    it('returns 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Invalid priority', priority: 'Critical' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Priority must be one of Low, Medium, High, Urgent');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates an existing task', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Original task' });

      const response = await request(app)
        .put(`/api/todos/${createResponse.body.id}`)
        .send({
          title: 'Updated task title',
          status: 'In Progress',
          priority: 'Urgent',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated task title');
      expect(response.body.status).toBe('In Progress');
      expect(response.body.priority).toBe('Urgent');
    });

    it('returns 404 for unknown task id', async () => {
      const response = await request(app)
        .put('/api/todos/999999')
        .send({ title: 'Should not exist' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    it('marks a task as done and can reopen it', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Completion test task' });
      const id = createResponse.body.id;

      const completeResponse = await request(app)
        .patch(`/api/todos/${id}/complete`)
        .send({ completed: true });

      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.status).toBe('Done');

      const reopenResponse = await request(app)
        .patch(`/api/todos/${id}/complete`)
        .send({ completed: false });

      expect(reopenResponse.status).toBe(200);
      expect(reopenResponse.body.status).toBe('To Do');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes an existing task', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Delete me' });

      const response = await request(app).delete(`/api/todos/${createResponse.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('returns 400 for invalid id format', async () => {
      const response = await request(app).delete('/api/todos/not-a-number');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });
});
