import { useState, useEffect } from 'react';
import axios from 'axios';

// ==========================================
// AXIOS SETUP & AUTHORIZATION INTERCEPTOR
// ==========================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export default function App() {
  // IMPROVEMENT: Maintain session in LocalStorage on refresh
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || "");
  const [activeProject, setActiveProject] = useState(null); 

  // Apply token to all outgoing API requests automatically
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  const handleLogout = () => {
    setToken(null);
    setUsername("");
    setActiveProject(null);
  };

  // IMPROVEMENT: Deconstructed massive component into logical sub-components
  if (!token) {
    return <LoginScreen setToken={setToken} setUsername={setUsername} />;
  }

  if (!activeProject) {
    return <DashboardScreen username={username} setActiveProject={setActiveProject} onLogout={handleLogout} />;
  }

  return <KanbanBoard activeProject={activeProject} setActiveProject={setActiveProject} username={username} />;
}

// ==========================================
// COMPONENT 1: LOGIN SCREEN
// ==========================================
function LoginScreen({ setToken, setUsername }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLoginMode) {
        const response = await api.post('/login', formData);
        setToken(response.data.token);
        setUsername(response.data.username); 
      } else {
        await api.post('/register', formData);
        alert("Registration successful! Please log in.");
        setIsLoginMode(true);
        setFormData({ ...formData, password: '' }); // Clear password field
      }
    } catch (error) { 
      setErrorMsg(error.response?.data?.error || "An error occurred."); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Project Manager</h2>
        <p className="auth-subtitle">{isLoginMode ? "Sign in to continue" : "Create a new account"}</p>
        
        {errorMsg && <div style={{color: 'red', marginBottom: '10px'}}>{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            className="input-field" 
            placeholder="Username" 
            value={formData.username} 
            onChange={e => setFormData({ ...formData, username: e.target.value })} 
            required
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={e => setFormData({ ...formData, password: e.target.value })} 
            required
          />
          <div className="auth-buttons">
            <button className="btn btn-primary" type="submit">
              {isLoginMode ? "Login" : "Register"}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? "Need an account?" : "Back to login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 2: DASHBOARD
// ==========================================
function DashboardScreen({ username, setActiveProject, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) { console.error("Failed to fetch projects"); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) { alert("Error creating project"); }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Hello, {username}! 👋</h1>
        <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
      </div>

      <div className="create-card fade-in-up">
        <h3>Start a New Project</h3>
        <form className="create-form-row" onSubmit={handleCreateProject}>
          <input 
            className="input-field flex-2" 
            value={newProject.name} 
            onChange={e => setNewProject({...newProject, name: e.target.value})} 
            placeholder="Project Name" 
            required
          />
          <input 
            className="input-field flex-3" 
            value={newProject.description} 
            onChange={e => setNewProject({...newProject, description: e.target.value})} 
            placeholder="Short Description" 
          />
          <button className="btn btn-success" type="submit">Create Project</button>
        </form>
      </div>

      <div className="project-grid">
        {projects.length === 0 && <div className="empty-state">No projects yet. Create one above!</div>}
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="project-card fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setActiveProject(project)} 
          >
            <h3>{project.name}</h3>
            <p className="project-desc">{project.description || "No description provided."}</p>
            <div className="project-meta">
              <span className="project-members">👥 {project.members.length} Member(s)</span>
              <span className="open-board-link">Open Board ➡️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 3: KANBAN BOARD
// ==========================================
function KanbanBoard({ activeProject, setActiveProject, username }) {
  const [tasks, setTasks] = useState([]);
  const [inviteUsername, setInviteUsername] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // IMPROVEMENT: Grouped task inputs into a single object
  const [newTask, setNewTask] = useState({
    title: "", description: "", priority: "Medium", dueDate: "", assignee: "Unassigned"
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const response = await api.get(`/tasks/${activeProject._id}`);
    setTasks(response.data);
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    try {
      const response = await api.put(`/projects/${activeProject._id}/invite`, { newMemberUsername: inviteUsername });
      setActiveProject(response.data); 
      setInviteUsername("");
      alert(`Successfully added ${inviteUsername} to the project!`);
    } catch (error) {
      alert(error.response?.data?.error || "Error inviting user.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      await api.post('/tasks', { ...newTask, projectId: activeProject._id });
      setNewTask({ title: "", description: "", priority: "Medium", dueDate: "", assignee: "Unassigned" });
      fetchTasks(); 
    } catch (err) { alert("Error adding task"); }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    fetchTasks(); 
  };

  const getPriorityClass = (priority) => ({
    'High': 'priority-high', 'Medium': 'priority-medium', 'Low': 'priority-low'
  })[priority] || '';

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
      <div className="board-header">
        <div className="board-title-group">
          <button className="btn btn-secondary" onClick={() => setActiveProject(null)}>⬅️ Dashboard</button>
          <h1 style={{ margin: 0 }}>{activeProject.name}</h1>
        </div>

        <div className="team-invite-group">
          <span className="team-list">Team: {activeProject.members.join(", ")}</span>
          <form className="invite-input-group" onSubmit={handleInviteUser}>
            <input 
              className="input-field" value={inviteUsername} 
              onChange={e => setInviteUsername(e.target.value)} placeholder="Friend's username" 
            />
            <button className="btn btn-primary" type="submit">Invite</button>
          </form>
        </div>
      </div>

      <div className="progress-container fade-in-up">
        <div className="progress-header">
          <span>Project Progress</span>
          <span className={progressPercentage === 100 ? "text-success" : "text-primary"}>{progressPercentage}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${progressPercentage === 100 ? 'complete' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="search-filter-bar fade-in-up">
        <div className="search-input-wrapper flex-2">
          <span className="search-icon">🔍</span>
          <input className="input-field search-input" placeholder="Search tasks by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="input-field flex-1" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">View: All Team Tasks</option>
          <option value="Mine">View: Only My Tasks</option>
        </select>
      </div>
      
      <div className="create-card fade-in-up">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="create-form-row">
            <input className="input-field flex-2" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task Title" required />
            <select className="input-field flex-1" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input type="date" className="input-field flex-1" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
            <select className="input-field flex-1" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})}>
              <option value="Unassigned">Assign To...</option>
              {activeProject.members.map(member => ( <option key={member} value={member}>{member}</option> ))}
            </select>
          </div>
          <textarea className="input-field" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Task description..." rows="2" style={{ marginBottom: "1rem" }} />
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Add Task</button>
        </form>
      </div>

      <div className="kanban-board fade-in-up">
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} className="kanban-column">
            <div className="column-header">
              <h3>{columnStatus}</h3>
              <span className="task-count">{filteredTasks.filter(t => t.status === columnStatus).length}</span>
            </div>
            
            {filteredTasks.filter(t => t.status === columnStatus).map((task, index) => (
              <div key={task._id} className="task-card fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  {task.priority && <span className={`priority-badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>}
                </div>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">
                  <span className="task-date">{task.dueDate ? `📅 ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}</span>
                  <span className="task-assignee">👤 {task.assignee}</span>
                </div>
                <div className="task-actions">
                  {columnStatus !== 'Todo' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')}>⬅️ Move Back</button>}
                  {columnStatus !== 'Done' && <button onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')}>Move Forward ➡️</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}