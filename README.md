# Cyber Log Analyzer

A production-style full-stack cybersecurity analytics platform that allows authenticated users to upload Linux authentication logs, parse them through a Python analysis engine, detect suspicious activity, store results in PostgreSQL, and inspect security analytics through a responsive React dashboard.

## Live Application

- **Frontend**: [https://cyber-log-analyzer-phi.vercel.app](https://cyber-log-analyzer-phi.vercel.app)
- **Backend API**: [https://cyber-log-analyzer-production.up.railway.app](https://cyber-log-analyzer-production.up.railway.app)

## Key Features

- JWT-based registration and login
- Password hashing using bcrypt
- Protected frontend routes
- Axios authentication interceptor
- Automatic handling of expired or invalid tokens
- Linux authentication log upload
- Multer-based file processing
- Python log parser integration
- PostgreSQL persistence
- Security alert generation
- Dashboard statistics
- Alert severity distribution
- Top source IP analytics
- Event-type analytics
- Recent security alerts
- Responsive SOC-style dashboard
- Graphite and Electric Cyan interface palette
- Railway backend deployment
- Railway PostgreSQL deployment
- Vercel frontend deployment
- Dockerized backend and Python analysis engine

*Note on real-time functionality: The backend initializes Socket.IO, and the frontend includes the `socket.io-client` dependency. However, real-time frontend Socket.IO integration is not yet fully implemented.*

## Security Detections

Uploaded authentication logs are parsed into structured entries and passed through detection modules that generate alerts with severity levels (`low`, `medium`, `high`, `critical`). The platform detects:

- Brute-force login attempts
- Account enumeration
- Privilege escalation activity
- Suspicious successful login after failed attempts
- Credential stuffing behaviour
- Persistence-related activity
- Log tampering
- ML-assisted anomaly detection

## Architecture

```
Vercel React Frontend
        ↓ HTTPS
Railway Express Backend
        ↓
Railway PostgreSQL
        ↓
Python Analysis Engine
```

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Framer Motion
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JSON Web Tokens
- bcryptjs
- Multer
- Socket.IO

### Analysis Engine
- Python 3
- Custom authentication-log parser
- Security detection modules
- ML anomaly detector

### Deployment
- Vercel (Frontend)
- Railway (Backend)
- Railway PostgreSQL
- Docker (Backend & Python runtime)

## Project Structure

```text
cyber-log-analyzer/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── analysis-engine/
│   ├── parser/
│   ├── detection/
│   ├── ml/
│   └── requirements.txt
├── database/
│   └── schema.sql
├── Dockerfile
└── README.md
```

## Prerequisites

- Node.js 22 or newer recommended
- npm
- Python 3.10 or newer
- PostgreSQL 14 or newer
- Git

## Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rithikamandiv-ux/cyber-log-analyzer.git
   cd cyber-log-analyzer
   ```

2. **Database setup**
   Create the database:
   ```bash
   createdb cyber_log_analyzer
   ```
   *or using psql:*
   ```bash
   psql -U postgres -c "CREATE DATABASE cyber_log_analyzer;"
   ```
   Import the schema:
   ```bash
   psql -U postgres -d cyber_log_analyzer -f database/schema.sql
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   *The backend starts on the configured `PORT` (default is 5000).*

4. **Frontend setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```
   *The frontend development server normally starts on `http://localhost:5173`.*

5. **Analysis-engine setup**
   ```bash
   cd analysis-engine
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

## Environment Variables

### Backend Example (`backend/.env`)

```ini
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyber_log_analyzer
DB_USER=postgres
DB_PASSWORD=your_database_password

JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=24h

CLIENT_URL=http://localhost:5173

UPLOAD_DIR=../uploads
MAX_FILE_SIZE=50000000

ANALYSIS_ENGINE_PATH=../analysis-engine
```

### Frontend Example (`frontend/.env.local`)

```ini
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Important Notes:**
- `VITE_API_URL` must include `/api`.
- `CLIENT_URL` must exactly match the frontend origin.
- Production secrets must be configured through Railway or Vercel settings.
- Real `.env` files must never be committed.

## API Endpoints

*Protected endpoints require the `Authorization: Bearer <jwt_token>` header.*

**Authentication:**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Logs:**
- `GET /api/logs`
- `POST /api/logs/upload`

**Alerts:**
- `GET /api/alerts`

**Dashboard:**
- `GET /api/dashboard`

**ML:**
- Routes under `/api/ml`

**Health:**
- `GET /api/health`

## Docker Deployment

The root `Dockerfile` provides a unified environment for the backend and analysis engine. It uses a Node.js Bookworm Slim image, installs Python 3 and pip, installs backend and Python dependencies, copies the backend and analysis engine, builds the TypeScript backend, creates an `/app/uploads` directory, and starts the compiled Node.js server.

Example commands:

```bash
docker build -t cyber-log-analyzer-backend .
docker run --env-file backend/.env -p 5000:5000 cyber-log-analyzer-backend
```

*Note: PostgreSQL must still be accessible from the container.*

## Production Deployment

### Frontend
- Hosted on **Vercel**
- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` handles SPA route rewrites

**Required Vercel variables:**
- `VITE_API_URL`
- `VITE_SOCKET_URL`

### Backend
- Hosted on **Railway**
- Built using the repository root `Dockerfile`
- PostgreSQL provided by Railway
- Production environment variables configured in Railway
- `CLIENT_URL` points to the Vercel production domain

*Note: Environment-variable changes require a redeployment.*

## Security Considerations

- Do not commit JWT secrets or database credentials.
- Use strong production passwords.
- Change default or test accounts before public use.
- Uploaded files must be validated by size and type.
- JWT frontend checks are only usability guards.
- Backend authentication middleware is the real security boundary.
- Use HTTPS in production.
- Restrict CORS to trusted frontend origins.
- Regularly rotate secrets.
- Add rate limiting before exposing authentication endpoints to heavy public traffic.

## Known Limitations

- Uploaded files are stored in the Railway container filesystem.
- Container filesystem storage is ephemeral.
- Failed uploads may require stronger status and error tracking.
- Socket.IO frontend integration is not yet complete.
- ML confidence shown in the current dashboard may not yet come from a fully trained production model.
- No automated test suite is currently configured.
- The frontend production bundle may produce a chunk-size warning.
- Authentication currently uses localStorage for the JWT.
- Refresh-token support is not yet implemented.

## Future Improvements

- Persistent object storage for uploaded logs
- Failed-upload status and error-message storage
- Full Socket.IO live dashboard updates
- Refresh-token authentication
- Rate limiting
- Password-reset workflow
- Role-based access control
- Automated backend and frontend tests
- GitHub Actions CI pipeline
- Route-level frontend code splitting
- More log formats
- Improved ML model training and evaluation
- Alert resolution workflow
- Audit logging
- User and organization management

## Project Status

The Cyber Log Analyzer is deployed and operational as a working full-stack application. Core authentication, log upload, Python parsing, threat detection, alert storage, dashboard analytics, and cloud deployment features are implemented.

Continued development will focus on hardening, persistent storage, real-time updates, testing, and advanced ML capabilities.

## License

This project is licensed under the MIT License.
