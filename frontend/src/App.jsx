import { useState, useEffect } from 'react';
import axios from 'axios';

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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (token && username) fetchProjects();
  }, [token, username]);

  useEffect(() => {
    if (activeProject) fetchTasks(activeProject._id);
  }, [activeProject]);

  const fetchProjects = async () => {
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
      setUsername(response.data.username); 
    } catch (error) { alert("Login failed. Check your credentials."); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert("Registration successful! Please log in.");
    } catch (error) { alert("Error registering. Username might be taken."); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    await axios.post(`${API_URL}/projects`, { 
      name: newProjectName, 
      description: newProjectDesc,
      username: username 
    });
    setNewProjectName("");
    setNewProjectDesc("");
    fetchProjects();
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    try {
      const response = await axios.put(`${API_URL}/projects/${activeProject._id}/invite`, { 
        newMemberUsername: inviteUsername 
      });
      setActiveProject(response.data); 
      setInviteUsername("");
      fetchProjects(); 
      alert(`Successfully added ${inviteUsername} to the project!`);
    } catch (error) {
      alert("User not found! Make sure you typed their exact username.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    await axios.post(`${API_URL}/tasks`, { 
      title: newTaskTitle,
      description: newDescription,
      priority: newPriority,
      dueDate: newDueDate,
      projectId: activeProject._id,
      assignee: newAssignee 
    });
    setNewTaskTitle(""); setNewDescription(""); setNewPriority("Medium"); setNewDueDate(""); setNewAssignee("Unassigned");
    fetchTasks(activeProject._id); 
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
    fetchTasks(activeProject._id); 
  };

  // Helper for applying CSS classes to priority badges
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
        <div className="auth-card">
          <h2>Project Manager</h2>
          <p className="auth-subtitle">Sign in to continue</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <input 
              className="input-field" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
            <input 
              className="input-field" 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
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
        <div className="header">
          <h1>Hello, {username}! 👋</h1>
          <button className="btn btn-secondary" onClick={() => setToken(null)}>Logout</button>
        </div>

        <div className="create-card fade-in-up">
          <h3>Start a New Project</h3>
          <form className="create-form-row" onSubmit={handleCreateProject}>
            <input 
              className="input-field flex-2" 
              value={newProjectName} 
              onChange={e => setNewProjectName(e.target.value)} 
              placeholder="Project Name" 
              required
            />
            <input 
              className="input-field flex-3" 
              value={newProjectDesc} 
              onChange={e => setNewProjectDesc(e.target.value)} 
              placeholder="Short Description" 
            />
            <button className="btn btn-success" type="submit">Create Project</button>
          </form>
        </div>

        <div className="project-grid">
          {projects.length === 0 && (
            <div className="empty-state">No projects yet. Create one above!</div>
          )}
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
      <div className="board-header">
        <div className="board-title-group">
          <button className="btn btn-secondary" onClick={() => { setActiveProject(null); setSearchQuery(""); setFilterType("All"); }}>
            ⬅️ Dashboard
          </button>
          <h1 style={{ margin: 0 }}>{activeProject.name}</h1>
        </div>

        <div className="team-invite-group">
          <span className="team-list">Team: {activeProject.members.join(", ")}</span>
          <form className="invite-input-group" onSubmit={handleInviteUser}>
            <input 
              className="input-field"
              value={inviteUsername} 
              onChange={e => setInviteUsername(e.target.value)} 
              placeholder="Friend's username" 
            />
            <button className="btn btn-primary" type="submit">Invite</button>
          </form>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container fade-in-up">
        <div className="progress-header">
          <span>Project Progress</span>
          <span className={progressPercentage === 100 ? "text-success" : "text-primary"}>
            {progressPercentage}%
          </span>
        </div>
        <div className="progress-track">
          <div 
            className={`progress-fill ${progressPercentage === 100 ? 'complete' : ''}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar fade-in-up">
        <div className="search-input-wrapper flex-2">
          <span className="search-icon">🔍</span>
          <input 
            className="input-field search-input"
            placeholder="Search tasks by title..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <select 
          className="input-field flex-1"
          value={filterType} 
          onChange={e => setFilterType(e.target.value)} 
        >
          <option value="All">View: All Team Tasks</option>
          <option value="Mine">View: Only My Tasks</option>
        </select>
      </div>
      
      {/* Task Creation Form */}
      <div className="create-card fade-in-up">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="create-form-row">
            <input 
              className="input-field flex-2"
              value={newTaskTitle} 
              onChange={e => setNewTaskTitle(e.target.value)} 
              placeholder="Task Title" 
              required
            />
            <select 
              className="input-field flex-1"
              value={newPriority} 
              onChange={e => setNewPriority(e.target.value)}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            
            <input 
              type="date" 
              className="input-field flex-1"
              value={newDueDate} 
              onChange={e => setNewDueDate(e.target.value)} 
            />
            
            <select 
              className="input-field flex-1"
              value={newAssignee} 
              onChange={e => setNewAssignee(e.target.value)} 
            >
              <option value="Unassigned">Assign To...</option>
              {activeProject.members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          <textarea 
            className="input-field"
            value={newDescription} 
            onChange={e => setNewDescription(e.target.value)} 
            placeholder="Task description..." 
            rows="2"
            style={{ marginBottom: "1rem" }}
          />
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">
            Add Task
          </button>
        </form>
      </div>

      {/* The Kanban Columns */}
      <div className="kanban-board fade-in-up">
        {['Todo', 'In Progress', 'Done'].map(columnStatus => (
          <div key={columnStatus} className="kanban-column">
            
            <div className="column-header">
              <h3>{columnStatus}</h3>
              <span className="task-count">
                {filteredTasks.filter(t => t.status === columnStatus).length}
              </span>
            </div>
            
            {filteredTasks.filter(t => t.status === columnStatus).map((task, index) => (
              <div 
                key={task._id} 
                className="task-card fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }} /* Creates a staggering drop-in effect! */
              >
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  {task.priority && (
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                </div>
                
                {task.description && <p className="task-desc">{task.description}</p>}
                
                <div className="task-meta">
                  <span className="task-date">
                    {task.dueDate ? `📅 ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                  </span>
                  <span className="task-assignee">
                    👤 {task.assignee}
                  </span>
                </div>
                
                <div className="task-actions">
                  {columnStatus !== 'Todo' && (
                    <button onClick={() => handleMoveTask(task._id, columnStatus === 'Done' ? 'In Progress' : 'Todo')}>
                      ⬅️ Move Back
                    </button>
                  )}
                  {columnStatus !== 'Done' && (
                    <button onClick={() => handleMoveTask(task._id, columnStatus === 'Todo' ? 'In Progress' : 'Done')}>
                      Move Forward ➡️
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>

    </div>
  );
}