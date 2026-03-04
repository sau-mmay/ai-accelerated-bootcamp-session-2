const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const dataDirectory = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDirectory, { recursive: true });
const databasePath = process.env.DB_PATH || path.join(dataDirectory, 'todos.db');

// Initialize persistent SQLite database
const db = new Database(databasePath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'To Do',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    CHECK (status IN ('To Do', 'In Progress', 'Done'))
  )
`);

const todoCount = db.prepare('SELECT COUNT(*) as count FROM todos').get();

if (todoCount.count === 0) {
  const seedStmt = db.prepare(
    `INSERT INTO todos (title, description, due_date, priority, status, sort_order)
     VALUES (@title, @description, @due_date, @priority, @status, @sort_order)`
  );

  [
    {
      title: 'Set up project board',
      description: 'Create initial TODO app planning board',
      due_date: null,
      priority: 'Medium',
      status: 'To Do',
      sort_order: 1,
    },
    {
      title: 'Implement API health checks',
      description: 'Confirm backend stability before feature work',
      due_date: null,
      priority: 'High',
      status: 'In Progress',
      sort_order: 2,
    },
  ].forEach((todo) => seedStmt.run(todo));
}

const validPriorities = new Set(['Low', 'Medium', 'High', 'Urgent']);
const validStatuses = new Set(['To Do', 'In Progress', 'Done']);
const priorityRanking = {
  Urgent: 1,
  High: 2,
  Medium: 3,
  Low: 4,
};

const normalizeSort = (sortBy = 'createdAt', order = 'desc') => {
  const normalizedOrder = order === 'asc' ? 'ASC' : 'DESC';
  if (sortBy === 'dueDate') {
    return 'CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC, due_date ' + normalizedOrder;
  }

  if (sortBy === 'priority') {
    const direction = normalizedOrder === 'ASC' ? 'ASC' : 'DESC';
    return `
      CASE priority
        WHEN 'Urgent' THEN ${priorityRanking.Urgent}
        WHEN 'High' THEN ${priorityRanking.High}
        WHEN 'Medium' THEN ${priorityRanking.Medium}
        WHEN 'Low' THEN ${priorityRanking.Low}
      END ${direction}
    `;
  }

  if (sortBy === 'title') {
    return 'title ' + normalizedOrder;
  }

  if (sortBy === 'updatedAt') {
    return 'updated_at ' + normalizedOrder;
  }

  return 'created_at ' + normalizedOrder;
};

const mapTodo = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  dueDate: row.due_date,
  priority: row.priority,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const validateTodoPayload = ({ title, dueDate, priority, status }, { partial = false } = {}) => {
  if (!partial || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return 'Task title is required';
    }
  }

  if (dueDate !== undefined && dueDate !== null) {
    const parsedDate = new Date(dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Due date must be a valid date/time';
    }
  }

  if (priority !== undefined && !validPriorities.has(priority)) {
    return 'Priority must be one of Low, Medium, High, Urgent';
  }

  if (status !== undefined && !validStatuses.has(status)) {
    return 'Status must be one of To Do, In Progress, Done';
  }

  return null;
};

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

app.get('/api/todos', (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const sortClause = normalizeSort(sortBy, order);

    let query = `SELECT * FROM todos`;
    const params = [];

    if (status && validStatuses.has(status)) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ` ORDER BY ${sortClause}, id DESC`;

    const todos = db.prepare(query).all(...params).map(mapTodo);
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { title, description = '', dueDate = null, priority = 'Medium', status = 'To Do' } = req.body;

    const validationError = validateTodoPayload({ title, dueDate, priority, status });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const maxSortOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM todos').get();
    const insertTodoStmt = db.prepare(
      `INSERT INTO todos (title, description, due_date, priority, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    const result = insertTodoStmt.run(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
      dueDate,
      priority,
      status,
      maxSortOrder.maxOrder + 1
    );

    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(mapTodo(newTodo));
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const title = req.body.title !== undefined ? req.body.title : existing.title;
    const description = req.body.description !== undefined ? req.body.description : existing.description;
    const dueDate = req.body.dueDate !== undefined ? req.body.dueDate : existing.due_date;
    const priority = req.body.priority !== undefined ? req.body.priority : existing.priority;
    const status = req.body.status !== undefined ? req.body.status : existing.status;

    const validationError = validateTodoPayload({ title, dueDate, priority, status });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updateStmt = db.prepare(
      `UPDATE todos
       SET title = ?, description = ?, due_date = ?, priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    );
    updateStmt.run(title.trim(), description, dueDate, priority, status, id);

    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.status(200).json(mapTodo(updated));
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.patch('/api/todos/:id/complete', (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const nextStatus = req.body.completed ? 'Done' : 'To Do';
    db.prepare('UPDATE todos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(nextStatus, id);

    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.status(200).json(mapTodo(updated));
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    res.status(500).json({ error: 'Failed to update task completion' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Backward compatibility alias during transition
app.get('/api/items', (req, res) => {
  req.url = '/api/todos';
  app.handle(req, res);
});

app.post('/api/items', (req, res) => {
  req.url = '/api/todos';
  app.handle(req, res);
});

app.delete('/api/items/:id', (req, res) => {
  req.url = `/api/todos/${req.params.id}`;
  app.handle(req, res);
});

module.exports = { app, db };