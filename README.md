# Project Flow - Modern Project Management Board

Project Flow is a full-stack, visually rich project management application built on the MERN stack. It features a modern Glassmorphism UI, a real-time Kanban board for task tracking, and seamless team collaboration tools. 

Designed for both individuals and small teams, Project Flow ensures your projects stay organized and your team stays on the same page.

![Project Flow Cover](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop) *(Background theme inspiration)*

## ✨ Key Features

- **Robust Authentication**: Secure User Registration and Login powered by JWT and bcrypt.
- **Project Workspaces**: Create unlimited distinct projects. Each project acts as its own isolated workspace.
- **Interactive Kanban Board**: Visualize workflow with drag-and-drop-style status updates (`Todo` → `In Progress` → `Done`).
- **Detailed Task Management**: 
  - Set priorities (Low, Medium, High).
  - Define due dates.
  - Write detailed descriptions.
  - Search tasks by title or filter to view only your assigned tasks.
- **Team Collaboration**: Invite existing users to your projects so they can instantly collaborate and manage tasks alongside you.
- **Modern Glassmorphism UI**: A breathtaking, responsive frontend featuring frosted glass elements, smooth micro-animations, and dynamic progress tracking.

## 🚀 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development environment and optimized production builds.
- **Vanilla CSS**: Custom styling architecture featuring Glassmorphism variables, CSS variables for theming, and responsive grids.
- **Axios**: Clean and promise-based HTTP client for API interactions.

### Backend
- **Node.js & Express.js**: Fast, unopinionated, minimalist web framework.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema definitions.
- **JSON Web Tokens (JWT)**: Stateless API authorization.

---

## 🛠️ Local Development Setup

To run this project locally, you will need **Node.js** and **MongoDB** installed on your system. 

### 1. Clone the repository
```bash
git clone https://github.com/sujalvk888/project-manager-app.git
cd project-manager-app
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder based on `.env.example` or with the following variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/projectmanager
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server will run on http://localhost:5000.*

### 3. Frontend Setup
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to override the default local backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## ☁️ Deployment

This project is fully structured for modern cloud hosting.

- **Frontend Hosting**: Optimized for [Vercel](https://vercel.com). Just connect the repository, set the root directory to `frontend`, and configure your `VITE_API_URL` environment variable.
- **Backend Hosting**: Optimized for [Render](https://render.com). Connect the repository, set the root directory to `backend`, and add your `MONGO_URI`, `JWT_SECRET`, and `PORT` environment variables.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the [ISC License](LICENSE).
