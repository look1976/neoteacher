# Feature: README And Developer Workflow

## Priority

P1 - Needed so the project can be run reliably.

## Gap

README is outdated. It describes Compose as MySQL-only even though Compose includes backend and frontend. It references `.env.example`, which is not present. Docker schema setup is not explained.

## Goal

Make setup instructions accurate for local dev and Docker.

## Scope

- Document requirements.
- Document local development:
  - install,
  - database setup,
  - schema creation,
  - seed,
  - backend,
  - frontend.
- Document Docker workflow:
  - `docker compose up -d`,
  - schema creation with Prisma,
  - seed command,
  - open `http://localhost:8080`.
- Document test command.
- Document current MVP status and known missing features.
- Add `.env.example` if local dev expects it.

## Acceptance Criteria

- A new developer can start the app from README only.
- README does not claim missing features are complete.
- Docker instructions include schema creation and seed.
- Test command is documented.

## Likely Files

- `README.md`
- `backend/.env.example`
- `docker-compose.yml`

