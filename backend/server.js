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

// User Blueprint
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Project Blueprint
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' }
});
const Project = mongoose.model('Project', ProjectSchema);

// Task Blueprint (Upgraded with Priorities, Dates, and Project Links)
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  status: { type: String, default: 'Todo' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true } 
});
const Task = mongoose.model('Task', TaskSchema);

// ==========================================
// 3. API ROUTES
// ==========================================

// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User created!" });
  } catch (error) {
    res.status(400).json({ error: "Username might already exist." });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, username });
});

// --- Project Routes ---
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const newProject = new Project({ 
    name: req.body.name, 
    description: req.body.description 
  });
  await newProject.save();
  res.json(newProject);
});

// --- Task Routes ---
app.get('/api/tasks/:projectId', async (req, res) => {
  // Only fetch tasks that belong to the requested project
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));