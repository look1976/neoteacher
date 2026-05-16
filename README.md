# NeoTeacher

NeoTeacher is a self-hosted language learning web application built with React, TypeScript, Vite, Express, Prisma, and MySQL.

## Project structure

- `frontend/` — Vite + React frontend
- `backend/` — Express + TypeScript API with Prisma ORM
- `backend/prisma/` — Prisma schema and seed script
- `docker-compose.yml` — MySQL service for local development

## Local setup

1. Install dependencies in the monorepo:

   ```bash
   cd /home/look/projects/neoteacher
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Start MySQL for development:

   ```bash
   docker compose up -d
   ```

3. Configure backend environment:

   ```bash
   cd backend
   cp .env.example .env
   ```

4. Create the database schema and seed sample data:

   ```bash
   npm run migrate:dev
   npm run db:seed
   ```

5. Run the backend and frontend:

   ```bash
   npm --workspace backend run dev
   npm --workspace frontend run dev
   ```

6. Open the frontend in your browser:

   - `http://localhost:4173`

## Backend API

The backend exposes the following endpoints:

- `GET /health`
- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/profiles/:id`
- `PATCH /api/profiles/:id`
- `DELETE /api/profiles/:id`
- `GET /api/exercise-sets`
- `POST /api/exercise-sets`
- `GET /api/exercise-sets/:id`
- `PATCH /api/exercise-sets/:id`
- `DELETE /api/exercise-sets/:id`
- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/exercises/:id`
- `PATCH /api/exercises/:id`
- `DELETE /api/exercises/:id`
- `POST /api/sessions/learning/start`
- `POST /api/sessions/:id/answer`
- `POST /api/sessions/:id/finish`
- `GET /api/sessions/:id/report`
- `GET /api/grammar-notes`
- `GET /api/grammar-notes/:id`

## Notes

- Frontend and backend are integrated through the Vite proxy.
- Seed data includes a sample user profile, grammar note, exercise set, exercises, progress, and session history.
- The backend includes an answer checker and persistent progress tracking.
