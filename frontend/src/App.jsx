import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
    await axios.post(`${API_URL}/tasks`, { title: newTaskTitle });
    setNewTaskTitle("");
    fetchTasks(); 
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
    fetchTasks(); 
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
      
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="New Task Name..." />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}>
          <h3>To Do</h3>
          {tasks.filter(t => t.status === 'Todo').map(task => (
            <div key={task._id} style={{ border: "1px solid black", padding: "5px", margin: "5px 0", backgroundColor: "#f9f9f9" }}>
              <p>{task.title}</p>
              <button onClick={() => handleMoveTask(task._id, 'In Progress')}>Move to In Progress ➡️</button>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}>
          <h3>In Progress</h3>
          {tasks.filter(t => t.status === 'In Progress').map(task => (
            <div key={task._id} style={{ border: "1px solid black", padding: "5px", margin: "5px 0", backgroundColor: "#fffacd" }}>
              <p>{task.title}</p>
              <button onClick={() => handleMoveTask(task._id, 'Todo')}>⬅️ Todo</button>
              <button onClick={() => handleMoveTask(task._id, 'Done')}>Done ➡️</button>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}>
          <h3>Done ✅</h3>
          {tasks.filter(t => t.status === 'Done').map(task => (
            <div key={task._id} style={{ border: "1px solid black", padding: "5px", margin: "5px 0", backgroundColor: "#d4edda" }}>
              <p>{task.title}</p>
              <button onClick={() => handleMoveTask(task._id, 'In Progress')}>⬅️ In Progress</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}