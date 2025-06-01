import React, { useState, useEffect, useRef } from 'react';

const ToDoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const inputRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tasks'));
    if (stored) setTasks(stored);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim() === '') return alert('Task cannot be empty!');
    const newTask = { id: Date.now(), text: task.trim(), completed: false };
    setTasks(prev => [...prev, newTask]);
    setTask('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleClearCompleted = () => {
    if (window.confirm("Clear all completed tasks?")) {
      setTasks(tasks.filter(t => !t.completed));
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (filter === 'active') filtered = tasks.filter(t => !t.completed);
    else if (filter === 'completed') filtered = tasks.filter(t => t.completed);

    if (sortBy === 'alpha') {
      filtered = [...filtered].sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === 'status') {
      filtered = [...filtered].sort((a, b) => a.completed - b.completed);
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-6">

        <h1 className="text-3xl font-bold mb-6 text-center">📝 To-Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            ref={inputRef}
            className="border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="none">Sort</option>
              <option value="alpha">Alphabetical</option>
              <option value="status">By Status</option>
            </select>
          </div>

          <span>
            ✅ {tasks.filter(t => t.completed).length} / {tasks.length}
          </span>
        </div>

        <ul className="divide-y divide-gray-200">
          {getFilteredTasks().length === 0 && (
            <p className="text-center text-gray-500 py-4">No tasks to display</p>
          )}
          {getFilteredTasks().map(t => (
            <li key={t.id} className="flex justify-between items-center py-2 group">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggleComplete(t.id)}
                  className="h-4 w-4"
                />
                <span className={`text-lg ${t.completed ? 'line-through text-gray-400' : ''}`}>
                  {t.text}
                </span>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-500 text-sm opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {tasks.some(t => t.completed) && (
          <div className="text-right mt-4">
            <button
              onClick={handleClearCompleted}
              className="text-sm text-gray-600 hover:text-red-500"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
