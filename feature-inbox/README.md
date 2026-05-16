# NeoTeacher Feature Inbox

This folder tracks missing features identified by comparing:

- `.github/prompts/main.md`
- `.github/prompts/implementation.md`
- the current generated codebase

Each file describes one implementation-ready feature area with scope, acceptance criteria, likely code touchpoints, and priority.

## Priority Order

1. `01-frontend-learning-flow.md`
2. `02-progress-and-spaced-repetition.md`
3. `03-seed-data-expansion.md`
4. `04-profile-creation-ui.md`
5. `05-grammar-notes-learning-ui.md`
6. `06-exercise-editor.md`
7. `07-json-import-export.md`
8. `08-media-upload-and-playback.md`
9. `09-test-mode.md`
10. `10-theme-and-ui-foundation.md`
11. `11-readme-and-dev-workflow.md`
12. `12-test-coverage.md`

## Current State Summary

The backend already has a useful foundation: Prisma models, REST endpoints, answer checking, sessions, progress rows, seed support, and Docker services. The largest gap is that the frontend does not expose the core learning loop. A user can view seeded profiles and exercise sets, but cannot start a lesson, answer questions, see feedback, repeat mistakes, or finish a session through the UI.

