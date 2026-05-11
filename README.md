# ProjectFlow — Project Management Web App

A full-stack Project & Task Management Web Application built with React + Vite, Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication** — JWT-based signup/login with protected routes
- **Project Management** — Create, edit, delete projects; add/remove team members
- **Task Management** — Create tasks with status, priority, assignee, and due dates
- **Dashboard** — Real-time stats, pie charts, bar charts, and overdue task tracking
- **Role-Based Access** — Admin vs Member role restrictions
- **Premium Dark UI** — Modern glassmorphism design with animations

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Recharts |
| Backend | Node.js, Express.js, JWT, bcryptjs, Helmet |
| Database | MongoDB + Mongoose |

## 📁 Structure

```
Assignment project/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/       # Dashboard, Projects, ProjectDetails, Tasks, Login, Signup
│       ├── components/  # ProjectCard, TaskCard, ProjectModal, TaskModal, Sidebar, StatusBadge
│       ├── redux/       # Store + slices (auth, projects, tasks)
│       ├── services/    # Axios API instance
│       └── layouts/     # AppLayout
└── server/          # Express.js backend
    ├── controllers/ # authController, projectController, taskController, dashboardController
    ├── routes/      # auth, projects, tasks, dashboard
    ├── models/      # User, Project, Task
    ├── middleware/  # auth (JWT), role (RBAC)
    └── config/      # db.js
```

## ⚙️ Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Backend
```bash
cd server
# Update .env with your MongoDB URI and JWT secret
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## 🔒 Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/projectmanager
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints

```
POST   /api/auth/signup          — Register user
POST   /api/auth/login           — Login user
GET    /api/auth/me              — Get current user (protected)
GET    /api/auth/users           — Get all users (protected)

POST   /api/projects             — Create project
GET    /api/projects             — Get all user projects
GET    /api/projects/:id         — Get project details
PUT    /api/projects/:id         — Update project
DELETE /api/projects/:id         — Delete project
POST   /api/projects/:id/members — Add member
DELETE /api/projects/:id/members/:userId — Remove member

POST   /api/tasks                — Create task
GET    /api/tasks                — Get tasks (with filters)
GET    /api/tasks/:id            — Get single task
PUT    /api/tasks/:id            — Update task
DELETE /api/tasks/:id            — Delete task

GET    /api/dashboard/stats      — Get dashboard statistics
GET    /api/dashboard/overdue    — Get overdue tasks
GET    /api/dashboard/chart-data — Get chart data
```
