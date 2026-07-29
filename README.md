# 🛡️ Cyber Log Analyzer

A production-style full-stack cybersecurity analytics platform for uploading, parsing, and analyzing security logs with real-time alerting and visual dashboards.

## Architecture

```
cyber-log-analyzer/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── analysis-engine/   # Python 3 + Pandas
├── database/          # PostgreSQL schema
├── uploads/           # Uploaded log files (gitignored)
└── docs/              # Documentation
```

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Frontend           | React, TypeScript, Vite, Tailwind CSS |
| UI Charts          | Recharts                            |
| Backend            | Node.js, Express, TypeScript        |
| Database           | PostgreSQL                          |
| Authentication     | JWT (jsonwebtoken + bcryptjs)       |
| File Upload        | Multer                              |
| Real-time          | Socket.IO                           |
| Analysis Engine    | Python 3, Pandas                    |
| Package Manager    | npm                                 |

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Python** >= 3.10
- **PostgreSQL** >= 14

## Getting Started

### 1. Clone & Configure

```bash
git clone <repo-url>
cd cyber-log-analyzer
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

### 2. Set Up Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE cyber_log_analyzer;"

# Run the schema
psql -U postgres -d cyber_log_analyzer -f database/schema.sql
```

### 3. Start Backend

```bash
cd backend
cp .env.example .env   # Edit with your settings
npm install
npm run dev
```

The API server starts at `http://localhost:5000`.

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

### 5. Set Up Analysis Engine

```bash
cd analysis-engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## API Routes

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/auth/login` | User login               |
| POST   | `/api/auth/register` | User registration     |
| GET    | `/api/logs`       | List uploaded log files   |
| POST   | `/api/logs/upload`| Upload a log file        |
| GET    | `/api/alerts`     | List security alerts     |
| GET    | `/api/dashboard`  | Dashboard statistics     |

## Project Status

This project is currently in the **foundation phase**. The architecture and scaffolding are in place, with placeholder endpoints ready for business logic implementation.

## License

MIT
