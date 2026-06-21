Momentum - Team Task Manager

A full-stack, real-time Project and Task Management Web Application designed for high-performance teams.

Built with React, Node.js, Express, and MongoDB, and fully deployed on Railway.

Live Deployment
Live Application URL:
https://diligent-eagerness-production-2617.up.railway.app/

Backend API URL:
https://assignment-team-task-manager-full-stack-production.up.railway.app/

--------------------------------------------------

Key Features (Assignment Requirements Met)

Authentication (Signup/Login)
- Secure email/password authentication using Firebase.
- Protected frontend routes and JWT-verified backend API endpoints.

Project & Team Management
- Users can create, update, and delete projects.
- Invite and manage team members within a project.

Task Creation, Assignment & Status Tracking
- Create tasks with priorities, due dates, and assign them to specific team members.
- Interactive Kanban Board with drag-and-drop support between:
  - To Do
  - In Progress
  - Done

Dashboard
- Visual overview of project health using charts.
- Identify pending and overdue tasks instantly.

Proper Validations & Relationships
- Relational NoSQL data modeling using Mongoose.
- Backend validation and error handling.

Role-Based Access Control (RBAC)

Admins:
- Manage project settings
- Delete projects
- Remove team members

Members:
- View projects
- Add tasks
- Update task status

--------------------------------------------------

Technology Stack

Frontend:
- React 19
- Vite
- Tailwind CSS
- Redux Toolkit
- Lucide React

Backend:
- Node.js
- Express.js
- Firebase Admin
- Helmet

Database:
- MongoDB
- Mongoose

Deployment:
- Railway
- Docker

--------------------------------------------------

Local Setup Instructions

1. Prerequisites
- Node.js v20+
- MongoDB instance
- Firebase Project

--------------------------------------------------

2. Backend Setup

cd server
npm install

Create .env file inside server folder:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

Run backend:

npm run dev

--------------------------------------------------

3. Frontend Setup

cd client
npm install

Create .env file inside client folder:

VITE_API_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

Run frontend:

npm run dev

--------------------------------------------------

Application Screenshot

https://github.com/user-attachments/assets/6f860b04-8f9f-4a3e-bfee-3644f8256001

--------------------------------------------------

Developed for the Full-Stack Web Development Assignment.