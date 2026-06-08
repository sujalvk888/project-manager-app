import { useState, useEffect } from 'react';
import axios from 'axios';

// ==========================================
// SVG ICON LIBRARY (Replaces Emojis)
// ==========================================
const Icons = {
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  Users: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  User: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  ArrowRight: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>,
  ChevronLeft: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>,
  ChevronRight: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>,
  Edit: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>,
  Trash: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
  Folder: () => <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.8)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
};

export default function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [activeProject, setActiveProject] = useState(null); 
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [inviteUsername, setInviteUsername] = useState(""); 

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newAssignee, setNewAssignee] = useState("Unassigned");

  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (savedToken && savedUsername) {
      setToken(savedToken); setUsername(savedUsername);
    }
  }, []);

  const authConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { if (token) fetchProjects(); }, [token]);
  useEffect(() => { if (activeProject) fetchTasks(activeProject._id); }, [activeProject]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`, authConfig());
      setProjects(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) handleLogout();
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${projectId}`, authConfig());
      setTasks(response.data);
    } catch (error) { console.error("Error fetching tasks:", error); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token: newToken, username: newUsername } = response.data;
      setToken(newToken); setUsername(newUsername); setPassword(""); 
      localStorage.setItem("token", newToken); localStorage.setItem("username", newUsername);
    } catch (error) { alert("Login failed. Check your credentials."); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert("Registration successful! Please log in.");
    } catch (error) { alert("Error registering. Username might be taken."); }
  };

  const handleLogout = () => {
    setToken(null); setUsername(""); setActiveProject(null);
    localStorage.removeItem("token"); localStorage.removeItem("username");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await axios.post(`${API_URL}/projects`, { name: newProjectName, description: newProjectDesc }, authConfig());
      setNewProjectName(""); setNewProjectDesc(""); fetchProjects();
    } catch (error) { console.error("Failed to create project"); }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project and all its tasks?")) return;
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, authConfig());
      fetchProjects();
    } catch (error) { console.error("Failed to delete project"); }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    try {
      const response = await axios.put(`${API_URL}/projects/${activeProject._id}/invite`, { newMemberUsername: inviteUsername }, authConfig());
      setActiveProject(response.data); setInviteUsername(""); fetchProjects(); 
      alert(`Successfully added ${inviteUsername} to the project!`);
    } catch (error) { alert("User not found! Make sure you typed their exact username."); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      await axios.post(`${API_URL}/tasks`, { 
        title: newTaskTitle, description: newDescription, priority: newPriority, 
        dueDate: newDueDate, projectId: activeProject._id, assignee: newAssignee 
      }, authConfig());
      setNewTaskTitle(""); setNewDescription(""); setNewPriority("Medium"); setNewDueDate(""); setNewAssignee("Unassigned");
      fetchTasks(activeProject._id); 
    } catch (error) { console.error("Failed to create task"); }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/tasks/${editingTask._id}`, editingTask, authConfig());
      setEditingTask(null); 
      fetchTasks(activeProject._id);
    } catch (error) { console.error("Failed to update task"); }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus }, authConfig());
      fetchTasks(activeProject._id); 
    } catch (error) { console.error("Failed to move task"); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, authConfig());
      fetchTasks(activeProject._id);
    } catch (error) { console.error("Failed to delete task"); }
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    if (priority === 'Low') return 'priority-low';
    return '';
  };

  // ==========================================
  // RENDER 1: LOGIN SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card glass-panel fade-in-up">
          <h2>Project Flow</h2>
          <p className="auth-subtitle">Welcome back. Please sign in.</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <input className="input-field" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div className="auth-buttons">
              <button className="btn btn-primary" type="submit">Login</button>
              <button className="btn btn-secondary" type="button" onClick={handleRegister}>Register</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: THE DASHBOARD
  // ==========================================
  if (!activeProject) {
    return (
      <div className="dashboard-container">
        <div className="header fade-in-up">
          <h1>Welcome, {username}!</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>

        <div className="create-card glass-panel fade-in-up" style={{animationDelay: "0.1s"}}>
          <h3>Start a New Project</h3>
          <form className="create-form-row" onSubmit={handleCreateProject}>
            <input className="input-field flex-2" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Project Name" required />
            <input className="input-field flex-3" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} placeholder="Short Description" />
            <button className="btn btn-success" type="submit">Create Project</button>
          </form>
        </div>

        <div className="project-grid">
          {projects.length === 0 && (
            <div className="empty-state fade-in-up">
              <Icons.Folder />
              <span>No projects yet. Start by creating one above!</span>
            </div>
          )}
          {projects.map((project, index) => (
            <div key={project._id} className="project-card glass-panel fade-in-up" style={{ animationDelay: `${(index * 0.1) + 0.2}s` }} onClick={() => setActiveProject(project)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{project.name}</h3>
                <button className="btn btn-danger btn-icon" onClick={(e) => handleDeleteProject(e, project._id)} title="Delete Project">
                  <Icons.Trash />
                </button>
              </div>
              <p className="project-desc">{project.description || "No description provided."}</p>
              <div className="project-meta">
                <span className="project-members"><Icons.Users /> {project.members.length} Member(s)</span>
                <span className="open-board-link">Open Board <Icons.ArrowRight /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: THE KANBAN BOARD
  // ==========================================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterType === "All" ? true : task.assignee === username;
    return matchesSearch && matchesAssignee;
  });

  return (
    <div className="dashboard-container">
      
      {/* Header Area */}
      <div className="board-header fade-in-up">
        <div className="board-title-group">
          <button className="btn btn-secondary" style={{borderRadius: "999px"}} onClick={() => { setActiveProject(null); setSearchQuery(""); setFilterType("All"); }}>
            <Icons.ChevronLeft /> Back
          </button>
          <h1 style={{ margin: 0, color: "var(--primary-color)" }}>{activeProject.name}</h1>
        </div>

        <div className="team-invite-group glass-panel">
          <span className="team-list"><Icons.Users /> Team: {activeProject.members.join(", ")}</span>
          <form className="invite-input-group" onSubmit={handleInviteUser}>
            <input className="input-field" value={inviteUsername} onChange={e => setInviteUsername(e.target.value)} placeholder="Invite by username" />
            <button className="btn btn-primary" type="submit">Invite</button>
          </form>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container glass-panel fade-in-up" style={{animationDelay: "0.1s"}}>
        <div className="progress-header">
          <span>Overall Project Progress</span>
          <span className={progressPercentage === 100 ? "text-success" : "text-primary"}>{progressPercentage}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${progressPercentage === 100 ? 'complete' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar glass-panel fade-in-up" style={{animationDelay: "0.2s"}}>
        <div className="search-input-wrapper flex-2">
          <span className="search-icon"><Icons.Search /></span>
          <input className="input-field search-input" placeholder="Search tasks by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="input-field flex-1" style={{borderRadius: 'var(--radius-full)'}} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">View: All Team Tasks</option>
          <option value="Mine">View: Only My Tasks</option>
        </select>
      </div>
      
      {/* Task Creation Form */}
      <div className="create-card glass-panel fade-in-up" style={{animationDelay: "0.3s"}}>
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="create-form-row">
            <input className="input-field flex-2" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Title" required />
            <select className="input-field flex-1" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input type="date" className="input-field flex-1" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
            <select className="input-field flex-1" value={newAssignee} onChange={e => setNewAssignee(e.target.value)}>
              <option value="Unassigned">Assign To...</option>
              {activeProject.members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          <textarea className="input-field" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Task description..." rows="2" style={{ marginBottom: "1rem" }} />
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Add Task</button>
        </form>
      </div>

      {/* The Kanban Columns */}
      <div className="kanban-board fade-in-up" style={{animationDelay: "0.4s"}}>
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} className="kanban-column glass-panel">
            
            <div className="column-header">
              <h3>{columnStatus}</h3>
              <span className="task-count">{filteredTasks.filter(t => t.status === columnStatus).length}</span>
            </div>
            
            {filteredTasks.filter(t => t.status === columnStatus).map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {task.priority && <span className={`priority-badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>}
                    <button className="btn btn-secondary btn-icon" onClick={() => setEditingTask(task)} title="Edit Task">
                      <Icons.Edit />
                    </button>
                    <button className="btn btn-danger btn-icon" onClick={() => handleDeleteTask(task._id)} title="Delete Task">
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
                
                {task.description && <p className="task-desc">{task.description}</p>}
                
                <div className="task-meta">
                  <span className="task-date"><Icons.Calendar /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                  <span className="task-assignee"><Icons.User /> {task.assignee}</span>
                </div>
                
                <div className="task-actions">
                  {columnStatus !== 'Todo' && (
                    <button className="btn" onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')}>
                      <Icons.ChevronLeft /> Back
                    </button>
                  )}
                  {columnStatus !== 'Done' && (
                    <button className="btn" onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')}>
                      Forward <Icons.ChevronRight />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ==========================================
          MODAL: EDIT TASK
      ========================================== */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>&times;</button>
            </div>
            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</label>
                <input className="input-field" value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</label>
                  <select className="input-field" value={editingTask.priority} onChange={e => setEditingTask({...editingTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Due Date</label>
                  <input type="date" className="input-field" value={editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ""} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assignee</label>
                <select className="input-field" value={editingTask.assignee} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})}>
                  <option value="Unassigned">Unassigned</option>
                  {activeProject.members.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                <textarea className="input-field" value={editingTask.description} onChange={e => setEditingTask({...editingTask, description: e.target.value})} rows="3" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}