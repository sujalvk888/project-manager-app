import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  // --- STATE 1: Authentication ---
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // --- STATE 2: Navigation & Projects ---
  const [activeProject, setActiveProject] = useState(null); 
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // --- STATE 3: Tasks ---
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // --- USE EFFECTS (Auto-fetching data) ---
  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  useEffect(() => {
    if (activeProject) fetchTasks(activeProject._id);
  }, [activeProject]);

  // --- API CALLS ---
  const fetchProjects = async () => {
    const response = await axios.get(`${API_URL}/projects`);
    setProjects(response.data);
  };

  const fetchTasks = async (projectId) => {
    const response = await axios.get(`${API_URL}/tasks/${projectId}`);
    setTasks(response.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      setToken(response.data.token);
    } catch (error) { alert("Login failed."); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert("Registration successful! Please log in.");
    } catch (error) { alert("Error registering."); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return alert("Project name is required!");
    await axios.post(`${API_URL}/projects`, { name: newProjectName, description: newProjectDesc });
    setNewProjectName("");
    setNewProjectDesc("");
    fetchProjects();
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return alert("Task title is required!");
    await axios.post(`${API_URL}/tasks`, { 
      title: newTaskTitle,
      description: newDescription,
      priority: newPriority,
      dueDate: newDueDate,
      projectId: activeProject._id
    });
    setNewTaskTitle(""); setNewDescription(""); setNewPriority("Medium"); setNewDueDate("");
    fetchTasks(activeProject._id); 
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
    fetchTasks(activeProject._id); 
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ffcccc'; 
    if (priority === 'Medium') return '#fff4cc'; 
    if (priority === 'Low') return '#cce5ff'; 
    return 'white';
  };

  // ==========================================
  // RENDER 1: LOGIN SCREEN
  // ==========================================
  if (!token) {
    return (
      <div style={{ padding: "50px", fontFamily: "sans-serif", maxWidth: "400px", margin: "0 auto" }}>
        <h2>Project Manager Login</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: "8px" }}/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "8px" }}/>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleLogin} style={{ padding: "10px", flex: 1, cursor: "pointer" }}>Login</button>
            <button onClick={handleRegister} style={{ padding: "10px", flex: 1, cursor: "pointer" }}>Register</button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: THE DASHBOARD (View all projects)
  // ==========================================
  if (!activeProject) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>My Projects 🗂️</h1>
          <button onClick={() => setToken(null)} style={{ padding: "8px 15px", cursor: "pointer" }}>Logout</button>
        </div>

        {/* Create Project Form */}
        <div style={{ backgroundColor: "#f4f5f7", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
          <h3>Start a New Project</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Project Name" style={{ flex: 1, padding: "8px" }} />
            <input value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} placeholder="Short Description" style={{ flex: 2, padding: "8px" }} />
            <button onClick={handleCreateProject} style={{ padding: "8px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Create</button>
          </div>
        </div>

        {/* Project Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {projects.map(project => (
            <div 
              key={project._id} 
              onClick={() => setActiveProject(project)} 
              style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", cursor: "pointer", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", transition: "transform 0.2s" }}
            >
              <h3 style={{ marginTop: 0 }}>{project.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{project.description || "No description provided."}</p>
              <p style={{ color: "#007bff", fontWeight: "bold", fontSize: "14px", margin: "0" }}>Open Board ➡️</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: THE KANBAN BOARD (Inside a specific project)
  // ==========================================
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Navigation Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <button onClick={() => setActiveProject(null)} style={{ padding: "8px 15px", cursor: "pointer" }}>⬅️ Back to Projects</button>
        <h1 style={{ margin: 0 }}>{activeProject.name} Board</h1>
      </div>
      
      {/* Task Creation Form */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fdfdfd" }}>
        <h3 style={{ marginTop: 0 }}>Add Task</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Title (Required)" style={{ flex: 1, padding: "8px" }} />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ padding: "8px" }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} style={{ padding: "8px" }}/>
        </div>
        <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Task description..." style={{ width: "100%", height: "60px", marginBottom: "10px", padding: "8px" }} />
        <button onClick={handleCreateTask} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Add Task
        </button>
      </div>

      {/* The Columns */}
      <div style={{ display: "flex", gap: "20px" }}>
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", width: "33%", backgroundColor: "#f4f5f7" }}>
            <h3 style={{ marginTop: 0 }}>{columnStatus}</h3>
            
            {tasks.filter(t => t.status === columnStatus).map(task => (
              <div key={task._id} style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "10px", margin: "10px 0", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  {task.priority && (
                    <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "12px", backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</span>
                  )}
                </div>
                {task.description && <p style={{ fontSize: "14px", color: "#555", margin: "0 0 10px 0" }}>{task.description}</p>}
                {task.dueDate && <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px 0" }}>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                
                <div style={{ display: "flex", gap: "5px" }}>
                  {columnStatus !== 'Todo' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')} style={{ flex: 1, fontSize: "12px", cursor: "pointer" }}>⬅️ Back</button>}
                  {columnStatus !== 'Done' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')} style={{ flex: 1, fontSize: "12px", cursor: "pointer" }}>Next ➡️</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}