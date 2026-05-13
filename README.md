# 🚀 Momentum - Team Task Manager

A full-stack, real-time Project and Task Management Web Application designed for high-performance teams. 

Built with **React, Node.js, Express, and MongoDB**, and fully deployed on **Railway**.

### 🌐 Live Deployment
- **Live Application URL:** [https://diligent-eagerness-production-2617.up.railway.app/](https://diligent-eagerness-production-2617.up.railway.app/)
- **Backend API URL:** [https://assignment-team-task-manager-full-stack-production.up.railway.app/](https://assignment-team-task-manager-full-stack-production.up.railway.app/)

---

## ✨ Key Features (Assignment Requirements Met)

✅ **Authentication (Signup/Login)**
- Secure email/password authentication using Firebase.
- Protected frontend routes and JWT-verified backend API endpoints.

✅ **Project & Team Management**
- Users can create, update, and delete projects.
- Invite and manage team members within a project.

✅ **Task Creation, Assignment & Status Tracking**
- Create tasks with priorities, due dates, and assign them to specific team members.
- **Interactive Kanban Board**: Drag-and-drop tasks between "To Do", "In Progress", and "Done" columns.

✅ **Dashboard**
- Visual overview of project health, including pie charts and bar charts.
- Instantly identify pending and overdue tasks across all projects.

✅ **Proper Validations & Relationships**
- Relational NoSQL data modeling using Mongoose (Users ↔ Projects ↔ Tasks).
- Robust backend validation and error handling.

✅ **Role-Based Access Control (RBAC)**
- **Admins:** Can manage project settings, delete projects, and remove team members.
- **Members:** Can view projects, add tasks, and update task statuses.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Redux Toolkit, Lucide React |
| **Backend** | Node.js, Express.js, Firebase Admin, Helmet (Security) |
| **Database** | MongoDB & Mongoose |
| **Deployment** | Railway (Nixpacks & Custom Dockerfiles) |

---

## ⚙️ Local Setup Instructions

If you want to run this project locally on your machine, follow these steps:

### 1. Prerequisites
- Node.js (v20 or higher)
- A MongoDB instance (local or MongoDB Atlas)
- A Firebase Project (for authentication)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file inside the `server` folder:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file inside the `client` folder:
```env
VITE_API_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
Run the frontend:
```bash
npm run dev
```

---

## 📸 Application Screenshots
*(You can add screenshots or GIF links of your application here)*

---
*Developed for the Full-Stack Web Development Assignment.*
