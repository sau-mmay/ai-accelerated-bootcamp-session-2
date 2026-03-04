import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Prepare sprint backlog',
          dueDate: '2026-03-08T12:00',
          priority: 'High',
          status: 'To Do',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
        {
          id: 2,
          title: 'Review pull requests',
          dueDate: null,
          priority: 'Medium',
          status: 'In Progress',
          createdAt: '2026-03-02T00:00:00.000Z',
          updatedAt: '2026-03-02T00:00:00.000Z',
        },
      ])
    );
  }),

  rest.post('/api/todos', (req, res, ctx) => {
    const { title, priority = 'Medium', dueDate = null } = req.body;

    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        dueDate,
        priority,
        status: 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  rest.patch('/api/todos/:id/complete', (req, res, ctx) => {
    const isCompleted = req.body.completed;

    return res(
      ctx.status(200),
      ctx.json({
        id: Number(req.params.id),
        title: 'Prepare sprint backlog',
        dueDate: null,
        priority: 'High',
        status: isCompleted ? 'Done' : 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(req.params.id) }));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('TODO Command Center')).toBeInTheDocument();
    expect(screen.getByText('Quick Add Task')).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });

    // Initially shows loading state
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Prepare sprint backlog')).toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Fill in the form and submit
    const input = screen.getByRole('textbox', { name: /Task title/i });
    await act(async () => {
      await user.type(input, 'New Test Task');
    });

    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    await act(async () => {
      await user.click(submitButton);
    });

    // Check that the new task appears
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No tasks found. Add your first TODO!')).toBeInTheDocument();
    });
  });

  test('completes a task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Prepare sprint backlog')).toBeInTheDocument();
    });

    const completeButton = screen.getAllByRole('button', { name: /Complete|Reopen/i })[0];
    await act(async () => {
      await user.click(completeButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });
});