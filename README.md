# Store Rating Platform

A full-stack web application for rating stores, built as an intern coding challenge.

## Tech Stack
- **Frontend**: React.js, Vite, Plain CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcryptjs

## Folder Structure
```
.
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API configuration
│   │   ├── App.jsx      # Routing
│   │   ├── main.jsx     # Entry point
│   │   └── styles.css   # Plain CSS
│   └── package.json
└── server/          # Node.js backend
    ├── middleware/  # Auth & Role middleware
    ├── routes/      # Express routes
    ├── db.js        # PostgreSQL connection
    ├── schema.sql   # Database schema
    ├── seed.js      # Seed script
    ├── server.js    # Entry point
    └── package.json
```

## Features
- JWT-based authentication
- Role-based access control (Admin, Normal User, Store Owner)
- **Admin**: Dashboard stats, manage users and stores, search, filter, and sort lists.
- **Normal User**: Browse stores, search, submit ratings, modify ratings.
- **Store Owner**: View dashboard, track average rating, see user ratings.

## Installation & Setup

### 1. PostgreSQL Setup
Ensure you have PostgreSQL installed and running.
Create a database named `store_rating_platform`:
```sql
CREATE DATABASE store_rating_platform;
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (copy from `.env.example`) and fill in your DB credentials:
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

Run the seed script to initialize the database schema and insert demo data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# or 
node server.js
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## Demo Credentials
All users share the same login portal (`/login`).

**System Administrator:**
- Email: `admin@example.com`
- Password: `Admin@123`

**Normal User:**
- Email: `user@example.com`
- Password: `User@123`

**Store Owner:**
- Email: `owner@example.com`
- Password: `Owner@123`

## Validation Rules
- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, 1 uppercase, 1 special character
- **Email**: Standard email format
- **Rating**: Integer 1-5
