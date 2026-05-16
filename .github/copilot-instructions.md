# Copilot instructions for NeoTeacher

This repository contains NeoTeacher, a self-hosted language learning web app inspired by classic 1990s multimedia language trainers.

## Architecture

- Use React + TypeScript + Vite for the frontend.
- Use Node.js + TypeScript + Express/Fastify for the backend.
- Use SQLite with Prisma ORM.
- Store uploaded media in local `uploads/` folders.
- Keep frontend and backend separated in a monorepo structure.

## Development rules

- Do not create static UI-only mockups unless explicitly requested.
- Persist user profiles, exercises, sessions and progress in SQLite.
- Use Zod for input validation.
- Keep answer-checking logic covered by unit tests.
- Prefer small, readable modules over large files.
- Update README when setup or commands change.

## Product rules

- The app is a language training tool, not a linear course platform.
- Support learning mode, test mode, repeated mistakes and progress tracking.
- Preserve the concept of editable exercise sets.
- Keep the UI simple, fast and slightly retro-inspired.