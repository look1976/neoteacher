# NeoTeacher Feature Inbox

This folder tracks missing features identified by comparing:

- `.github/prompts/main.md`
- `.github/prompts/implementation.md`
- the current generated codebase

Each file describes one implementation-ready feature area with scope, acceptance criteria, likely code touchpoints, and priority.

## Priority Order

1. `03-seed-data-expansion.md`
2. `04-profile-creation-ui.md`
3. `05-grammar-notes-learning-ui.md`
4. `06-exercise-editor.md`
5. `07-json-import-export.md`
6. `08-media-upload-and-playback.md`
7. `09-test-mode.md`
8. `10-theme-and-ui-foundation.md`
9. `11-readme-and-dev-workflow.md`
10. `12-test-coverage.md`

## Implemented

- `implemented/01-frontend-learning-flow.md`
- `implemented/02-progress-and-spaced-repetition.md`

## Current State Summary

The backend already has a useful foundation: Prisma models, REST endpoints, answer checking, sessions, progress rows, seed support, and Docker services. The core learning loop now exists, and the dashboard can show persisted progress, due reviews, and mistakes. The next largest gap is seed data depth.
