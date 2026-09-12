# Car Dealership Website

A full-stack car dealership website built with React, Node.js/Express, and PostgreSQL.

## Project Structure

- `client/` - React frontend (Vite)
- `server/` - Node.js/Express backend (REST API)
- `database/` - SQL schema files
- `docker-compose.yml` - PostgreSQL database setup

## Prerequisites

- Node.js (v18+)
- Docker Desktop (running)

## Getting Started

### 1. Start the database (PostgreSQL via Docker)

```bash
docker compose up -d
```

### 2. Install dependencies

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client
npm install
```

### 3. Configure environment variables

Copy `server/.env.example` to `server/.env` and update values if needed.
(`DB_NAME` must be `car_dealership` to match `docker-compose.yml`.)

### 4. Create tables + seed data (requires the DB from step 1 to be up)

```bash
cd server
npm run setup
```

### 5. Run the backend

```bash
cd server
npm start
```
Server runs on http://localhost:5000

### 6. Run the frontend

```bash
cd client
npm run dev
```
Frontend runs on http://localhost:5173

## Default Admin Login

After running the `database/schema.sql` seed script:

- Username: `admin`
- Password: `admin123`

## Technology Stack

- **Frontend**: React 18, React Router 7, Axios, Vite
- **Backend**: Node.js, Express, PostgreSQL (pg), JWT auth, bcrypt
- **Database**: PostgreSQL 16
