<div align="center">
  # 📊 Project Flow
</div>

<div align="center">

### A Modern Full-Stack Project Management Board for Individuals & Small Teams

Build, organize, and track projects with a beautiful Kanban board, secure authentication, team collaboration, and real-time progress tracking.

<p>
  <a href="https://project-manager-progress.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-2563EB?style=for-the-badge" alt="Live Demo"/>
  </a>
  <a href="https://project-manager-backend-zqm6.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/API-Backend-16A34A?style=for-the-badge" alt="Backend"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-9.x-880000?style=flat-square&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Authentication-F59E0B?style=flat-square" />
  <img src="https://img.shields.io/badge/Bcrypt-Password_Security-10B981?style=flat-square" />
  <img src="https://img.shields.io/badge/Responsive-Design-0EA5E9?style=flat-square" />
  <img src="https://img.shields.io/badge/Kanban-Board-8B5CF6?style=flat-square" />
</p>

</div>

---

## 📖 Overview

**Project Flow** is a modern, full-stack project management application built using the **MERN Stack (MongoDB, Express.js, React, and Node.js)**. It provides individuals and small teams with dedicated project workspaces where they can organize tasks, collaborate with teammates, and monitor project progress through an intuitive Kanban board.

Designed with both functionality and user experience in mind, the application combines secure authentication, real-time progress tracking, collaborative workspaces, and a clean Glassmorphism-inspired interface to create a lightweight yet powerful productivity tool.

Each project operates as an isolated workspace, allowing teams to independently manage tasks, assign responsibilities, monitor completion status, and collaborate without interference from other projects.

Whether you're learning full-stack development, managing personal projects, or collaborating with a small team, Project Flow offers a practical and visually engaging project management experience.

---

# ✨ Features

## 🔐 Secure Authentication

- User registration and login
- Password hashing with **bcryptjs**
- Stateless authentication using **JSON Web Tokens (JWT)**
- Persistent login sessions
- Protected API routes

---

## 📁 Project Management

- Create unlimited projects
- Dedicated workspace for every project
- Edit project information
- Delete projects with automatic cleanup
- Isolated project environments

---

## 👥 Team Collaboration

- Invite existing users
- Username-based member lookup
- Automatic duplicate prevention using `$addToSet`
- Shared project workspaces
- Multi-user collaboration

---

## ✅ Kanban Task Board

Organize work using three intuitive workflow stages:

- 📝 Todo
- 🚧 In Progress
- ✅ Done

Move tasks between columns while keeping project progress automatically updated.

---

## 📝 Task Management

Every task includes:

- Title
- Description
- Priority Level
- Due Date
- Assigned Team Member
- Current Status

Priority levels include:

- 🟢 Low
- 🟡 Medium
- 🔴 High

---

## 📈 Real-Time Progress Tracking

Project Flow automatically calculates workspace completion by comparing completed tasks against the total number of tasks.

Features include:

- Automatic completion percentage
- Dynamic progress indicator
- Live updates after every task modification

---

## 🔍 Smart Filtering

Quickly find what matters.

Available filters include:

- Search tasks by title
- View all tasks
- Show only tasks assigned to you

---

## 🗑️ Automatic Data Cleanup

Deleting a project automatically removes every associated task from the database, preventing orphaned records and keeping data clean.

---

## 🎨 Modern Glassmorphism UI

The interface embraces a clean and modern design language featuring:

- Frosted glass panels
- Blur effects
- Smooth hover animations
- Custom scrollbars
- Responsive layouts
- Micro interactions
- Modern color palette

---

# 🚀 Why Project Flow?

Project Flow was created as a practical learning project focused on mastering full-stack web development through building a complete, real-world application from scratch.

Instead of implementing isolated features, the goal was to understand how modern web applications are designed, connected, secured, and deployed in production.

Throughout development, the project explored concepts including:

- Authentication
- REST APIs
- CRUD operations
- MongoDB data modeling
- State management
- Client-server communication
- Responsive UI design
- Secure password handling
- Deployment workflows
- Project architecture

The application is fully deployed and actively demonstrates the complete development lifecycle from local development to cloud deployment.

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | User Interface |
| Vite | Build Tool |
| Axios | API Communication |
| Vanilla CSS | Styling |
| CSS Variables | Theme Management |
| Inline SVG Icons | Lightweight Icons |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js 5 | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |

---

## Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Cloud Database |

---

## Development Tools

- Git
- GitHub
- VS Code
- npm

---

# 🏗️ Architecture

Project Flow follows a classic MERN architecture where the frontend and backend are completely decoupled and communicate through RESTful APIs.

```text
                    ┌────────────────────┐
                    │       User         │
                    └─────────┬──────────┘
                              │
                              ▼
                  React + Vite Frontend
                              │
                    Axios HTTP Requests
                              │
                              ▼
                   Express.js REST API
                              │
              JWT Authentication Middleware
                              │
                              ▼
                     MongoDB + Mongoose
```

---

## High-Level Application Flow

```text
User
   │
   ▼
Authentication
(Login / Register)
   │
   ▼
JWT Issued
   │
   ▼
Dashboard
   │
   ▼
Project Workspace
   │
   ▼
Kanban Board
   │
   ▼
Tasks
(Create • Update • Move • Delete)
   │
   ▼
Automatic Progress Calculation
```

---

## Project Structure

```text
project-manager-app/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    │
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

# 📸 Screenshots

> **Screenshots will be added soon.**

Recommended screenshots to include:

- 🏠 Authentication Page
- 📊 Dashboard
- 📁 Project Workspace
- 📋 Kanban Board
- ➕ Create Project
- 📝 Create Task
- 👥 Team Invitation
- 📈 Progress Indicator
- 📱 Responsive Mobile View

---

## 🎥 Demo GIFs

> **Demo recordings will be added soon.**

Suggested GIFs:

- User Registration
- User Login
- Creating a Project
- Inviting Team Members
- Creating Tasks
- Moving Tasks Between Columns
- Progress Percentage Updating
- Filtering Tasks
- Deleting a Project

---

# 🌐 Live Demo

### 🚀 Frontend

**Project Flow**

https://project-manager-progress.vercel.app

---

### ⚙️ Backend API

https://project-manager-backend-zqm6.onrender.com

---

## 💾 Database

The application supports two database configurations:

| Environment | Database |
|------------|----------|
| Local Development | MongoDB Community Server |
| Production | MongoDB Atlas |

This setup allows local development while seamlessly scaling to a cloud-hosted production environment.

---

> **Next:** Installation, environment variables, project setup, application workflow, deployment guide, authentication flow, and usage instructions.


# ⚙️ Installation

Follow the steps below to set up **Project Flow** on your local machine.

## 📋 Prerequisites

Before getting started, make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm
- MongoDB Community Server *(or a MongoDB Atlas cluster)*
- Git

Verify your installation:

```bash
node -v
npm -v
git --version
```

---

# 📥 Clone the Repository

```bash
git clone https://github.com/<your-github-username>/project-manager-app.git
```

Navigate to the project directory:

```bash
cd project-manager-app
```

---

# 📦 Install Dependencies

Since the project is divided into two applications, install dependencies for both the backend and frontend.

## Backend

```bash
cd backend
npm install
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔑 Environment Variables

Project Flow uses environment variables to securely manage configuration values.

---

## Backend Configuration

Create a `.env` file inside the **backend** folder.

```text
backend/
│
├── .env
└── server.js
```

Add the following variables:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/project-flow

JWT_SECRET=your_super_secret_key
```

### Production Example (MongoDB Atlas)

```env
PORT=5000

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-flow

JWT_SECRET=your_super_secret_key
```

---

### Variable Explanation

| Variable | Description |
|----------|-------------|
| PORT | Express server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key used to sign JWT tokens |

---

## Frontend Configuration

Create another `.env` file inside the **frontend** directory.

```text
frontend/
│
├── .env
└── src/
```

```env
VITE_API_URL=http://localhost:5000/api
```

If your backend is deployed:

```env
VITE_API_URL=https://project-manager-backend-zqm6.onrender.com/api
```

---

### Frontend Variable

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

---

# ▶️ Running the Application

## Step 1 — Start MongoDB

If you're using a local database, make sure MongoDB is running.

---

## Step 2 — Start the Backend

```bash
cd backend

npm start
```

or

```bash
node server.js
```

Server running on:

```text
http://localhost:5000
```

---

## Step 3 — Start the Frontend

Open another terminal.

```bash
cd frontend

npm run dev
```

Vite will start the development server.

```text
http://localhost:5173
```

---

# 🚀 Application Workflow

The following sequence describes how users interact with Project Flow.

```text
Launch Application
        │
        ▼
Authentication
(Login / Register)
        │
        ▼
JWT Token Generated
        │
        ▼
Dashboard
        │
        ▼
Project Workspace
        │
        ▼
Kanban Board
        │
        ▼
Task Management
        │
        ▼
Progress Updates
```

---

# 🔐 Authentication Flow

Project Flow uses **JSON Web Tokens (JWT)** to authenticate users securely.

## Registration

1. User enters username and password.
2. Password is hashed using bcryptjs.
3. User record is stored in MongoDB.
4. Registration completes successfully.

---

## Login

1. User enters credentials.
2. Password hash is verified.
3. JWT token is generated.
4. Token is returned to the client.
5. Client stores the token in Local Storage.
6. Future requests automatically include the JWT.

---

## Protected Routes

Every protected API request includes:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend verifies the token before allowing access.

---

## Authentication Lifecycle

```text
Register
    │
    ▼
Password Hashing
    │
    ▼
MongoDB
    │
    ▼
Login
    │
    ▼
JWT Token
    │
    ▼
Local Storage
    │
    ▼
Authenticated Requests
```

---

# 📂 Application Flow

## 1. User Authentication

When the application starts:

- Checks Local Storage
- Searches for a saved JWT
- Redirects unauthenticated users to Login
- Loads Dashboard for authenticated users

---

## 2. Dashboard

The dashboard displays every project where the logged-in user is a member.

Users can:

- Create projects
- Open projects
- Delete projects

---

## 3. Workspace

Selecting a project loads its dedicated workspace.

The application requests:

```http
GET /api/tasks/:projectId
```

Every task belonging to that project is retrieved.

---

## 4. Task Management

Users can:

- Create tasks
- Update tasks
- Delete tasks
- Move tasks between columns
- Assign team members
- Change priority
- Update descriptions

Every modification is persisted immediately through the REST API.

---

## 5. Progress Tracking

Every task update triggers an automatic recalculation.

Completion Percentage =

```text
Completed Tasks
-------------------- × 100
Total Tasks
```

The UI updates instantly after every change.

---

# 📡 REST API Overview

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Create a new account |
| POST | `/api/login` | Authenticate user |

---

## Projects

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/projects` | Retrieve user projects |
| POST | `/api/projects` | Create project |
| DELETE | `/api/projects/:id` | Delete project |

---

## Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tasks/:projectId` | Get project tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Team Management

| Method | Endpoint | Description |
|---------|----------|-------------|
| PUT | `/api/projects/:id/invite` *(or equivalent implementation)* | Invite an existing user to a project |

> *The exact route name may vary depending on your implementation.*

---

# 🧠 Data Flow

```text
React Components
        │
        ▼
Axios Requests
        │
        ▼
Express API
        │
        ▼
JWT Middleware
        │
        ▼
MongoDB
        │
        ▼
Updated Response
        │
        ▼
React State
        │
        ▼
UI Re-render
```

---

# 🚀 Deployment

Project Flow is fully deployed and accessible online.

## Frontend

**Platform**

- Vercel

**Live URL**

```text
https://project-manager-progress.vercel.app
```

---

## Backend

**Platform**

- Render

**API URL**

```text
https://project-manager-backend-zqm6.onrender.com
```

---

## Database

**Development**

- MongoDB Community Server

**Production**

- MongoDB Atlas

---

# 🌍 Deployment Architecture

```text
                 Users
                   │
                   ▼
          Vercel Frontend
                   │
                   ▼
        Render Express Server
                   │
                   ▼
          MongoDB Atlas Cluster
```

---

# 🔒 Security Highlights

Project Flow includes several security-focused practices.

- Passwords are never stored as plain text.
- bcryptjs is used to hash credentials before storage.
- JWT secures authenticated sessions.
- Environment variables protect sensitive credentials.
- CORS is configured for controlled cross-origin requests.
- Protected routes require valid authentication tokens.
- Duplicate team members are prevented using MongoDB's `$addToSet`.
- Cascading project deletion prevents orphaned task records.

---

# 🌐 Browser Compatibility

Project Flow has been designed to work on all modern browsers.

- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Brave
- ✅ Opera

---

# 📱 Responsive Design

The interface adapts across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The layout uses responsive CSS along with modern Glassmorphism styling to provide a consistent experience across devices.

---

> **Next:** User interface highlights, feature walkthrough, future improvements, contributing, license, acknowledgements, and closing sections.

# 🎨 User Interface Highlights

Project Flow was designed with a strong focus on simplicity, usability, and modern aesthetics. Instead of relying on heavy UI libraries, the interface is built using custom CSS, creating a lightweight experience while maintaining a polished and professional appearance.

## ✨ Glassmorphism Design

The application embraces a modern Glassmorphism-inspired design language featuring:

- Frosted glass containers
- Background blur effects
- Soft shadows
- Rounded components
- Layered transparency
- Clean typography
- Consistent spacing

---

## 📊 Interactive Dashboard

The dashboard provides users with a quick overview of their projects through a clean and intuitive layout.

Highlights include:

- Project cards
- Progress indicators
- Team member visibility
- Quick project actions
- Responsive grid layout

---

## 📋 Kanban Workspace

The Kanban board serves as the heart of Project Flow, allowing users to visualize project progress and manage tasks efficiently.

### Workflow Stages

```text
📝 Todo
      ↓

🚧 In Progress
      ↓

✅ Done
```

Users can seamlessly move tasks between workflow stages while keeping project progress synchronized in real time.

---

## 📝 Task Cards

Each task card displays essential information at a glance.

Included information:

- Task title
- Description
- Priority
- Due date
- Assignee
- Current status

This layout minimizes clutter while ensuring that important details remain easily accessible.

---

## 📈 Dynamic Progress Tracking

Project completion is automatically calculated based on the number of completed tasks.

Benefits include:

- Instant progress updates
- Better project visibility
- Clear completion metrics
- No manual calculations

---

## 🔍 Search & Filtering

Quickly locate the information you need using built-in filtering options.

Available filters:

- Search by task title
- View all tasks
- Show only assigned tasks

---

## 🎯 Responsive Experience

Project Flow is fully responsive and optimized for multiple screen sizes.

Supported devices:

- 💻 Desktop
- 🖥️ Laptop
- 📱 Mobile
- 📟 Tablet

The interface automatically adjusts layouts to provide a smooth experience across devices.

---

# ⚡ Performance Considerations

Several design choices help keep the application lightweight and responsive.

- Vite for fast development builds
- React Hooks for efficient state management
- Axios for asynchronous API communication
- Modular API requests
- Lightweight inline SVG icons
- Minimal third-party dependencies
- Efficient MongoDB document queries

---

# 🧠 Technical Highlights

Throughout this project, several core full-stack development concepts were implemented and explored.

### Backend

- RESTful API design
- Express.js middleware
- JWT authentication
- Password hashing with bcryptjs
- MongoDB document modeling
- Mongoose schema validation
- Environment variable management
- Cross-Origin Resource Sharing (CORS)

---

### Frontend

- React Hooks
- Component-based architecture
- API integration with Axios
- Responsive layouts
- Conditional rendering
- Local state management
- Custom CSS animations
- Glassmorphism UI

---

### Database

- MongoDB collections
- Document relationships
- CRUD operations
- Cascade deletion
- Query filtering
- Atomic updates
- Schema validation

---

# 📚 Learning Outcomes

Project Flow was built as a hands-on learning project to strengthen practical full-stack development skills.

Some of the concepts explored include:

- Building a complete MERN application
- Authentication and authorization
- Secure password storage
- REST API development
- MongoDB data modeling
- React application architecture
- Client-server communication
- Environment configuration
- Deployment workflows
- Production-ready application structure

The project represents a significant step toward understanding how modern web applications are designed, developed, and deployed.

---

# 🚀 Future Improvements

While Project Flow already provides a complete project management experience, there are several exciting enhancements planned for future iterations.

## Planned Features

- Drag-and-drop task management
- Project activity timeline
- File attachments
- Comments on tasks
- Task labels and tags
- Project templates
- User profile management
- Dark/Light theme switcher
- Email invitations
- Notification system
- Deadline reminders
- Calendar view
- Dashboard analytics
- Search across projects
- Archive completed projects
- Role-based permissions
- Team owner/admin controls
- Real-time collaboration using Socket.IO
- Unit and integration testing
- Docker support
- CI/CD pipeline

---

# 🤝 Contributing

Contributions, ideas, and suggestions are always welcome.

If you'd like to improve Project Flow, follow these steps:

## 1. Fork the Repository

Click the **Fork** button on GitHub.

---

## 2. Clone Your Fork

```bash
git clone https://github.com/your-username/project-manager-app.git
```

---

## 3. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

---

## 4. Make Your Changes

Implement your feature or bug fix.

---

## 5. Commit Your Changes

```bash
git commit -m "Add amazing feature"
```

---

## 6. Push the Branch

```bash
git push origin feature/amazing-feature
```

---

## 7. Open a Pull Request

Create a Pull Request describing your changes.

---

# 🐛 Found a Bug?

If you discover a bug or have a feature suggestion, feel free to open an issue.

When reporting bugs, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser information
- Screenshots (if applicable)

---

# ⭐ Show Your Support

If you found this project helpful or interesting, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

# 📄 License

This project is currently released under the **MIT License**.

You are free to:

- Use
- Modify
- Distribute
- Learn from
- Build upon

Please include the original license when redistributing the project.

> **Note:** If you haven't added an actual `LICENSE` file to your repository yet, it's recommended to do so before publishing. GitHub provides an MIT License template that you can add with just a few clicks.

---

# 🙏 Acknowledgements

This project wouldn't have been possible without the amazing tools and technologies provided by the open-source community.

Special thanks to:

- React
- Node.js
- Express.js
- MongoDB
- Mongoose
- Vite
- Axios
- bcryptjs
- JSON Web Token
- Render
- Vercel
- MongoDB Atlas
- Git
- GitHub

Thank you to the maintainers and contributors behind these incredible projects.

---

# 📌 Project Status

> **Current Status:** Active

Project Flow is fully functional and deployed.

This project was created as part of my continuous learning journey in full-stack web development, with a strong focus on building real-world applications rather than following isolated tutorials. It reflects my interest in project-based learning and my commitment to understanding the complete software development lifecycle—from planning and development to deployment.

As I continue learning, I plan to enhance Project Flow with additional features, performance improvements, and a more scalable architecture.

---

# 💡 Final Thoughts

Building Project Flow has been an incredibly rewarding experience. It brought together frontend development, backend engineering, database design, authentication, deployment, and user experience into a single, practical application.

Every feature presented a new opportunity to learn, solve problems, and gain hands-on experience with technologies commonly used in modern web development.

This project represents not just a completed application, but an important milestone in my journey as a software developer.

---

<div align="center">

## 🌟 Thank You for Visiting!

If you enjoyed exploring **Project Flow**, consider giving the repository a ⭐ to support the project.

**Happy Coding! 🚀**

</div>
````

This completes the README. Once you replace the placeholder GitHub username in the clone URL and add your screenshots plus an MIT `LICENSE` file (if you choose to use MIT), it will be ready to paste into your repository.

