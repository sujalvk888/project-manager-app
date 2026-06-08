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
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/projectmanager")
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Database connection failed:", err));

// ==========================================
// 2. DATABASE MODELS
// ==========================================
// IMPROVEMENT: Added 'timestamps: true' to automatically track createdAt/updatedAt
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: String }] 
}, { timestamps: true });
const Project = mongoose.model('Project', ProjectSchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: String, default: 'Unassigned' } 
}, { timestamps: true });
const Task = mongoose.model('Task', TaskSchema);

// ==========================================
// 3. SECURITY MIDDLEWARE (NEW)
// ==========================================
// This ensures that only users with valid JWTs can access protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
  
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decodedUser) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token." });
    req.user = decodedUser; 
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
    if (!username || !password) return res.status(400).json({ error: "All fields required." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created!" });
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
    // Added 'username' to the token payload so it can be accessed in middleware
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// --- PROTECTED ROUTES --- (Using authenticateToken)

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    // SECURED: Uses req.user.username from the verified token, preventing impersonation
    const projects = await Project.find({ members: req.user.username }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) { res.status(500).json({ error: "Failed to fetch projects" }); }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const newProject = new Project({ 
      name: req.body.name, 
      description: req.body.description,
      members: [req.user.username] // Set the creator automatically
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) { res.status(500).json({ error: "Failed to create project" }); }
});

app.put('/api/projects/:id/invite', authenticateToken, async (req, res) => {
  try {
    const { newMemberUsername } = req.body;
    const userExists = await User.findOne({ username: newMemberUsername });
    if (!userExists) return res.status(404).json({ error: "User not found!" });

    // Ensure only actual members can invite others
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, members: req.user.username }, 
      { $addToSet: { members: newMemberUsername } }, 
      { new: true }
    );

    if (!updatedProject) return res.status(403).json({ error: "Unauthorized or project not found." });
    res.json(updatedProject);
  } catch (error) { res.status(500).json({ error: "Failed to invite user" }); }
});

app.get('/api/tasks/:projectId', authenticateToken, async (req, res) => {
  try {
    // Sort tasks so the most recently due ones appear appropriately 
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ error: "Failed to fetch tasks" }); }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) { res.status(500).json({ error: "Failed to create task" }); }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) { res.status(500).json({ error: "Failed to update task" }); }
});

// ==========================================
// 5. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));