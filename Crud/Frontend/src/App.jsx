import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    taskName: '',
    assignedTo: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    location: ''
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success) {
        setTasks(result.data);
      } else {
        setError('Failed to fetch tasks');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
      setLoading(false);
      console.error('Fetch error:', err);
    }
  };

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTasks([result.data, ...tasks]);
        resetForm();
        alert('✅ Task created successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error creating task: ' + err.message);
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      
      const response = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTasks(tasks.map(task => 
          task._id === editId ? result.data : task
        ));
        resetForm();
        alert('✅ Task updated successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      setError('');
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTasks(tasks.filter(task => task._id !== id));
        alert('✅ Task deleted successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setFormData({
      taskName: task.taskName,
      assignedTo: task.assignedTo,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      location: task.location || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      taskName: '',
      assignedTo: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '',
      location: ''
    });
    setEditId(null);
    setError('');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Pending': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>
          <span className="header-icon">📋</span>
          Team Farmer Task Management
        </h1>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
        
        {/* FORM */}
        <div className="form-container">
          <h2>
            <span>{editId ? '✏️' : '➕'}</span>
            {editId ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={editId ? handleUpdate : handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="taskName">📝 Task Name:</label>
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Plant wheat seeds"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assignedTo">👤 Assigned To:</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  placeholder="Farmer name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">⚡ Priority:</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">📊 Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dueDate">📅 Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">📍 Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Field location (optional)"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">📄 Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Detailed task description..."
                rows="4"
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="btn-primary">
                {editId ? '💾 Update Task' : '➕ Create Task'}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TASKS LIST */}
        <div className="tasks-list">
          <h2>
            <span>📋</span>
            Tasks Overview ({tasks.length})
          </h2>
          
          {loading ? (
            <p className="loading">⏳ Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="no-data">📭 No tasks found. Create one above!</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="task-name">{task.taskName}</td>
                      <td>{task.assignedTo}</td>
                      <td>
                        <span 
                          className="badge"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{ backgroundColor: getStatusColor(task.status) }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td>{task.location || '-'}</td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => handleEdit(task)}
                          className="btn-edit"
                          title="Edit task"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="btn-delete"
                          title="Delete task"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
