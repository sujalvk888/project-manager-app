require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json()); 
app.use(cors()); 

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Database connection failed:", err));

// ==========================================
// 2. DATABASE BLUEPRINTS (Models)
// ==========================================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: String }] 
});
const Project = mongoose.model('Project', ProjectSchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  status: { type: String, default: 'Todo' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: String, default: 'Unassigned' } 
});
const Task = mongoose.model('Task', TaskSchema);

// ==========================================
// 3. SECURITY MIDDLEWARE
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token." });
    req.user = user; 
    next();
  });
};

// ==========================================
// 4. API ROUTES
// ==========================================

// --- AUTHENTICATION ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Username might already exist." });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// --- PROJECTS ---
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.username });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const newProject = new Project({ 
      name: req.body.name, 
      description: req.body.description,
      members: [req.user.username] 
    });
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project." });
  }
});

app.put('/api/projects/:id/invite', authenticateToken, async (req, res) => {
  try {
    const { newMemberUsername } = req.body;
    const userExists = await User.findOne({ username: newMemberUsername });
    if (!userExists) return res.status(404).json({ error: "User not found!" });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { members: newMemberUsername } }, 
      { new: true }
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to invite user." });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ projectId: req.params.id }); 
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project." });
  }
});

// --- TASKS ---
app.get('/api/tasks/:projectId', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task." });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));