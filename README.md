# NeoTeacher

NeoTeacher is a self-hosted language learning web application built with React, TypeScript, Vite, Express, Prisma, and MySQL.

## Project structure

- `frontend/` — Vite + React frontend
- `backend/` — Express + TypeScript API with Prisma ORM
- `backend/prisma/` — Prisma schema and seed script
- `docker-compose.yml` — development services for MySQL, backend, and frontend

## Requirements

- Node.js 20+ and npm
- Docker / Docker Compose
- `npm install` will install workspace dependencies for both frontend and backend

## Local development

1. Install dependencies from the repository root:

   ```bash
   cd /home/look/projects/neoteacher
   npm install
   ```

2. Start the database service:

   ```bash
   docker compose up -d
   ```

3. Create the backend environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

4. Create the database schema and seed sample data:

   ```bash
   npm run migrate:dev
   npm run db:seed
   ```

5. Start the backend and frontend in development mode:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

6. Open the frontend in your browser:

   - `http://localhost:4173`

The backend API is available at `http://localhost:4000`.

## Docker development

1. Start the compose stack:

   ```bash
   docker compose up -d
   ```

2. Apply migrations and seed data inside the backend container:

   ```bash
   docker compose exec backend npm run migrate:deploy
   docker compose exec backend npm run db:seed
   ```

3. Open the running frontend at:

   - `http://localhost:8080`

4. Stop the stack when finished:

   ```bash
   docker compose down
   ```

> If you want to run a specific image tag from the Compose file, set `IMAGE_TAG` before starting:
>
> ```bash
> IMAGE_TAG=latest docker compose up -d
> ```

## Tests

- Run backend tests:

  ```bash
  npm --workspace backend run test
  ```

- Validate frontend build:

  ```bash
  npm --workspace frontend run build
  ```

## Current status

NeoTeacher is an early-stage MVP with the following working capabilities:

- profile creation and selection
- learning sessions with exercise answer checking
- grammar notes and progression tracking
- Prisma-backed persistence and seed data

Missing or incomplete features:

- exercise editor UI
- advanced lesson scheduling and review algorithm
- user authentication and multi-user persistence
- import/export workflows

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

- `backend/.env.example` contains the expected database connection and port values for local development.
- The backend `prisma` folder includes schema and seed logic used by `npm run migrate:dev` and `npm run db:seed`.
- The Docker Compose stack includes MySQL, backend, and frontend services.
