import React, { useState, useEffect } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Done as DoneIcon } from '@mui/icons-material';
import './App.css';

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['To Do', 'In Progress', 'Done'];
const sortOptions = [
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Title', value: 'title' },
];

const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    background: {
      default: '#02080d',
      paper: '#0a1119',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, rgba(0,229,255,0.4), rgba(0,229,255,0.16))',
          border: '1px solid rgba(0,229,255,0.45)',
          boxShadow: '0 10px 25px rgba(0,229,255,0.25), inset 0 1px 2px rgba(255,255,255,0.25)',
          backdropFilter: 'blur(12px)',
          color: '#d6fbff',
          transition: 'all 0.2s ease',
        },
      },
    },
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
  });
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    fetchData();
  }, [statusFilter, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        order: sortBy === 'title' ? 'asc' : 'desc',
      });

      if (statusFilter !== 'All') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/todos?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      title: '',
      dueDate: '',
      priority: 'Medium',
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.title.trim()) {
      return;
    }

    const payload = {
      title: formState.title,
      priority: formState.priority,
      dueDate: formState.dueDate || null,
    };

    if (editingId) {
      await handleUpdate(editingId, payload);
      return;
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const result = await response.json();
      setTodos((previous) => [result, ...previous]);
      setError(null);
      resetForm();
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error('Error adding task:', err);
    }
  };

  const handleUpdate = async (taskId, payload) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const result = await response.json();
      setTodos((previous) => previous.map((task) => (task.id === taskId ? result : task)));
      setError(null);
      resetForm();
    } catch (err) {
      setError('Error updating task: ' + err.message);
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTodos((previous) => previous.filter((task) => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handleCompleteToggle = async (task) => {
    try {
      const response = await fetch(`/api/todos/${task.id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: task.status !== 'Done' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update completion status');
      }

      const result = await response.json();
      setTodos((previous) => previous.map((entry) => (entry.id === task.id ? result : entry)));
      setError(null);
    } catch (err) {
      setError('Error updating task status: ' + err.message);
      console.error('Error updating task status:', err);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setFormState({
      title: task.title,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
      priority: task.priority,
    });
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box className="AppRoot">
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,229,255,0.3)' }}>
          <Toolbar>
            <Typography variant="h5" fontWeight={700}>TODO Command Center</Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Card className="GlassCard">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {editingId ? 'Edit Task' : 'Quick Add Task'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    label="Task title"
                    value={formState.title}
                    onChange={(event) => setFormState((previous) => ({ ...previous, title: event.target.value }))}
                    placeholder="Enter task title"
                    required
                    fullWidth
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Due date"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={formState.dueDate}
                      onChange={(event) => setFormState((previous) => ({ ...previous, dueDate: event.target.value }))}
                      fullWidth
                    />

                    <FormControl fullWidth>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select
                        labelId="priority-label"
                        label="Priority"
                        value={formState.priority}
                        onChange={(event) => setFormState((previous) => ({ ...previous, priority: event.target.value }))}
                      >
                        {priorities.map((priority) => (
                          <MenuItem key={priority} value={priority}>
                            {priority}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button type="submit" variant="contained" color="primary">
                      {editingId ? 'Save Task' : 'Add Task'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outlined" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Filter by status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Filter by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                  labelId="sort-label"
                  label="Sort by"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography>Loading tasks...</Typography>
              </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && todos.length === 0 && (
              <Alert severity="info">No tasks found. Add your first TODO!</Alert>
            )}

            <Stack spacing={2}>
              {todos.map((task) => (
                <Card key={task.id} className="GlassCard">
                  <CardContent>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="h6" sx={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          <Chip size="small" label={task.status} color={task.status === 'Done' ? 'success' : 'default'} />
                          <Chip size="small" label={`Priority: ${task.priority}`} color="primary" variant="outlined" />
                          <Chip
                            size="small"
                            label={task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleString()}` : 'No due date'}
                            variant="outlined"
                          />
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<DoneIcon />}
                          onClick={() => handleCompleteToggle(task)}
                        >
                          {task.status === 'Done' ? 'Reopen' : 'Complete'}
                        </Button>
                        <Button type="button" variant="outlined" startIcon={<EditIcon />} onClick={() => startEdit(task)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;