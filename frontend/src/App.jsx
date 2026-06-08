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
  const [inviteUsername, setInviteUsername] = useState(""); // For inviting friends

  // --- STATE 3: Tasks ---
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newAssignee, setNewAssignee] = useState("Unassigned");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch projects when logged in (Notice we now pass the username!)
  useEffect(() => {
    if (token && username) fetchProjects();
  }, [token, username]);

  useEffect(() => {
    if (activeProject) fetchTasks(activeProject._id);
  }, [activeProject]);

  // --- API CALLS ---
  const fetchProjects = async () => {
    // We send the username in the URL so the backend only sends OUR projects
    const response = await axios.get(`${API_URL}/projects?username=${username}`);
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
      setUsername(response.data.username); // Save username for our queries!
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
    await axios.post(`${API_URL}/projects`, { 
      name: newProjectName, 
      description: newProjectDesc,
      username: username // Tell the backend who is creating this!
    });
    setNewProjectName("");
    setNewProjectDesc("");
    fetchProjects();
  };

  // NEW: Invite User to Project
  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    try {
      const response = await axios.put(`${API_URL}/projects/${activeProject._id}/invite`, { 
        newMemberUsername: inviteUsername 
      });
      setActiveProject(response.data); // Update the active project to show the new member immediately
      setInviteUsername("");
      fetchProjects(); // Refresh the background list
      alert(`Successfully added ${inviteUsername} to the project!`);
    } catch (error) {
      alert("User not found! Make sure you typed their exact username.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return alert("Task title is required!");
    await axios.post(`${API_URL}/tasks`, { 
      title: newTaskTitle,
      description: newDescription,
      priority: newPriority,
      dueDate: newDueDate,
      projectId: activeProject._id,
      assignee: newAssignee // Send the assigned person
    });
    setNewTaskTitle(""); setNewDescription(""); setNewPriority("Medium"); setNewDueDate(""); setNewAssignee("Unassigned");
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
  // RENDER 2: THE DASHBOARD
  // ==========================================
  if (!activeProject) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Hello, {username}! 👋</h1>
          <button onClick={() => setToken(null)} style={{ padding: "8px 15px", cursor: "pointer" }}>Logout</button>
        </div>

        <div style={{ backgroundColor: "#f4f5f7", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
          <h3>Start a New Project</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Project Name" style={{ flex: 1, padding: "8px" }} />
            <input value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} placeholder="Short Description" style={{ flex: 2, padding: "8px" }} />
            <button onClick={handleCreateProject} style={{ padding: "8px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Create</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {projects.length === 0 && <p>No projects yet. Create one above!</p>}
          {projects.map(project => (
            <div 
              key={project._id} 
              onClick={() => setActiveProject(project)} 
              style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", cursor: "pointer", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
            >
              <h3 style={{ marginTop: 0 }}>{project.name}</h3>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>{project.description || "No description provided."}</p>
              
              {/* Show member count to make it feel like a real team tool! */}
              <p style={{ fontSize: "12px", color: "#888", marginBottom: "15px" }}>👥 {project.members.length} Member(s)</p>
              
              <p style={{ color: "#007bff", fontWeight: "bold", fontSize: "14px", margin: "0" }}>Open Board ➡️</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: THE KANBAN BOARD
  // ==========================================
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Header Area */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => setActiveProject(null)} style={{ padding: "8px 15px", cursor: "pointer" }}>⬅️ Dashboard</button>
          <h1 style={{ margin: 0 }}>{activeProject.name}</h1>
        </div>

        {/* TEAM COLLABORATION: Invite Input */}
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>Team: {activeProject.members.join(", ")}</span>
          <div style={{ marginLeft: "15px", display: "flex", border: "1px solid #ccc", borderRadius: "4px", overflow: "hidden" }}>
            <input 
              value={inviteUsername} 
              onChange={e => setInviteUsername(e.target.value)} 
              placeholder="Friend's exact username" 
              style={{ padding: "5px", border: "none" }}
            />
            <button onClick={handleInviteUser} style={{ padding: "5px 10px", border: "none", backgroundColor: "#17a2b8", color: "white", cursor: "pointer" }}>Invite</button>
          </div>
        </div>
      </div>
      
      {/* Task Creation Form */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fdfdfd" }}>
        <h3 style={{ marginTop: 0 }}>Add Task</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Title" style={{ flex: 1, padding: "8px" }} />
          
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ padding: "8px" }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          
          <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} style={{ padding: "8px" }}/>
          
          {/* TEAM COLLABORATION: Assignee Dropdown */}
          <select value={newAssignee} onChange={e => setNewAssignee(e.target.value)} style={{ padding: "8px", backgroundColor: "#e9ecef" }}>
            <option value="Unassigned">Assign To...</option>
            {activeProject.members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>

        </div>
        <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Task description..." style={{ width: "100%", height: "40px", marginBottom: "10px", padding: "8px" }} />
        <button onClick={handleCreateTask} style={{ width: "100%", padding: "8px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Add Task
        </button>
      </div>

      {/* The Columns */}
      <div style={{ display: "flex", gap: "20px" }}>
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", width: "33%", backgroundColor: "#f4f5f7" }}>
            <h3 style={{ marginTop: 0, borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>{columnStatus}</h3>
            
            {tasks.filter(t => t.status === columnStatus).map(task => (
              <div key={task._id} style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "10px", margin: "10px 0", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  {task.priority && (
                    <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "12px", backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</span>
                  )}
                </div>
                
                {task.description && <p style={{ fontSize: "14px", color: "#555", margin: "0 0 10px 0" }}>{task.description}</p>}
                
                {/* Information Row: Due Date & Assignee */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {task.dueDate ? `📅 ${new Date(task.dueDate).toLocaleDateString()}` : ""}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0056b3", backgroundColor: "#e2eefd", padding: "2px 6px", borderRadius: "4px" }}>
                    👤 {task.assignee}
                  </span>
                </div>
                
                <div style={{ display: "flex", gap: "5px" }}>
                  {columnStatus !== 'Todo' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')} style={{ flex: 1, fontSize: "12px", cursor: "pointer", padding: "5px" }}>⬅️</button>}
                  {columnStatus !== 'Done' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')} style={{ flex: 1, fontSize: "12px", cursor: "pointer", padding: "5px" }}>➡️</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}