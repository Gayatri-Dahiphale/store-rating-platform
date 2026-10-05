# Store Rating Platform

A full-stack web application where users can browse stores and submit ratings, built as an intern coding challenge.

## Tech Stack
- **Frontend**: React.js, Vite, Plain CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcryptjs

---

## 🔐 Demo Login Credentials (For Assessment)

> All roles share the same login portal at `/login`. Run `npm run seed` in the `server/` directory first to populate these accounts.

| Role | Email | Password |
|------|-------|----------|
| **System Administrator** | `admin@example.com` | `Admin@123` |
| **Normal User** | `user@example.com` | `User@123` |
| **Store Owner** | `owner@example.com` | `Owner@123` |

---

## Features
- JWT-based authentication with role-based access control
- **Admin**: Dashboard stats, manage users & stores, search/filter/sort lists, add users & stores
- **Normal User**: Browse stores, search, submit/modify ratings (1–5 stars)
- **Store Owner**: View dashboard with average rating and per-user breakdown

---

## Folder Structure
```
.
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Navbar, Layout, RatingStars, RoleRoute
│   │   ├── context/     # AuthContext (JWT auth state)
│   │   ├── pages/       # admin/, auth/, owner/, user/ pages
│   │   ├── services/    # Axios API instance
│   │   ├── App.jsx      # Routes
│   │   └── styles.css   # Plain CSS design system
│   └── package.json
└── server/          # Node.js + Express backend
    ├── middleware/  # JWT authenticate + role authorize
    ├── routes/      # authRoutes, adminRoutes, userRoutes, ownerRoutes
    ├── db.js        # PostgreSQL pool connection
    ├── schema.sql   # DB schema (users, stores, ratings)
    ├── seed.js      # Seeds demo users, stores, and ratings
    ├── server.js    # Express entry point (port 5000)
    └── package.json
```

---

## Installation & Setup

### 1. PostgreSQL Setup
Ensure PostgreSQL is installed and running, then create the database:
```sql
CREATE DATABASE store_rating_platform;
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_platform
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Seed the database (creates tables + demo data):
```bash
npm run seed
```

Start the backend server:
```bash
node server.js
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

> ⚠️ **Both servers must be running** for the app to work — the backend on port 5000 and the frontend on port 5173.

---

## Validation Rules
| Field | Rule |
|-------|------|
| **Name** | 20–60 characters |
| **Address** | Max 400 characters |
| **Password** | 8–16 chars, at least 1 uppercase & 1 special character |
| **Email** | Standard email format |
| **Rating** | Integer from 1 to 5 |
