import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [tasks, setTasks] = useState([]);
  
  // New State variables for our expanded task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    setTasks(response.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      setToken(response.data.token);
    } catch (error) {
      alert("Login failed. You might need to register first!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert("Registration successful! You can now log in.");
    } catch (error) {
      alert("Error registering.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Send all the new data to the backend
    await axios.post(`${API_URL}/tasks`, { 
      title: newTaskTitle,
      description: newDescription,
      priority: newPriority,
      dueDate: newDueDate
    });
    
    // Clear the form after saving
    setNewTaskTitle("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewDueDate("");
    fetchTasks(); 
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
    fetchTasks(); 
  };

  // Helper function to color-code priorities
  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ffcccc'; // Light Red
    if (priority === 'Medium') return '#fff4cc'; // Light Yellow
    if (priority === 'Low') return '#cce5ff'; // Light Blue
    return 'white';
  };

  if (!token) {
    return (
      <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
        <h1>Project Manager Login</h1>
        <form>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br/><br/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister} style={{ marginLeft: "10px" }}>Register</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Kanban Board 📋</h1>
      <button onClick={() => setToken(null)}>Logout</button>
      
      {/* UPGRADED TASK CREATION FORM */}
      <div style={{ marginTop: "20px", marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fdfdfd" }}>
        <h3>Create a New Task</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Title (Required)" required style={{ flex: 1 }} />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
        </div>
        <textarea 
          value={newDescription} 
          onChange={e => setNewDescription(e.target.value)} 
          placeholder="Add a detailed description..." 
          style={{ width: "100%", height: "60px", marginBottom: "10px" }}
        />
        <button onClick={handleCreateTask} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Add Task
        </button>
      </div>

      {/* THE KANBAN BOARD */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", width: "33%", backgroundColor: "#f4f5f7" }}>
            <h3 style={{ marginTop: 0 }}>{columnStatus}</h3>
            
            {tasks.filter(t => t.status === columnStatus).map(task => (
              // UPGRADED TASK CARD
              <div key={task._id} style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "10px", margin: "10px 0", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  {task.priority && (
                    <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "12px", backgroundColor: getPriorityColor(task.priority) }}>
                      {task.priority}
                    </span>
                  )}
                </div>
                
                {task.description && <p style={{ fontSize: "14px", color: "#555", margin: "0 0 10px 0" }}>{task.description}</p>}
                
                {task.dueDate && (
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px 0" }}>
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}

                <div style={{ display: "flex", gap: "5px" }}>
                  {columnStatus !== 'Todo' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')} style={{ flex: 1, fontSize: "12px" }}>⬅️ Back</button>}
                  {columnStatus !== 'Done' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')} style={{ flex: 1, fontSize: "12px" }}>Next ➡️</button>}
                </div>

              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}