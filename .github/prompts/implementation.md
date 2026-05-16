# NeoTeacher implementation review and completion prompt

You are working on the NeoTeacher repository.

NeoTeacher is a self-hosted language learning web application inspired by classic multimedia language trainers from the 1990s. It should be a real working application with frontend, backend, database, user profiles, exercises, learning sessions, progress tracking and repeated mistakes.

Your task is to review the current implementation and fix missing or incomplete parts.

Do not only describe problems. Make concrete code changes.

The goal is to turn the current repository into a working MVP.

---

## 1. Main objective

Review the existing codebase and verify whether NeoTeacher is a real application, not only a static UI mockup.

The MVP must include:

- user profiles,
- exercise sets,
- exercises,
- learning mode,
- answer checking,
- progress tracking,
- repeated mistakes,
- MySQL persistence,
- frontend/backend integration,
- seed data,
- working README instructions.

If any of those parts are missing, incomplete, mocked or only hardcoded in the frontend, implement them properly.

---

## 2. Expected architecture

The project should use this architecture:

- frontend: React + TypeScript + Vite + Tailwind CSS,
- backend: Node.js + TypeScript,
- API framework: Express or Fastify,
- database: MySQL,
- ORM: Prisma,
- validation: Zod,
- tests: Vitest or Jest.

Expected repository structure:

- `/frontend`
- `/backend`
- `/docs`
- `/sample-data`
- `/.github/prompts/main.md`
- `/.github/prompts/implementation.md`
- `/.github/copilot-instructions.md`
- `/docker-compose.yml`
- `/README.md`

If the current structure is different but still clean and functional, do not rewrite everything unnecessarily. Prefer incremental fixes.

---

## 3. Review checklist

Check the following areas one by one.

---

### 3.1 Project structure

Verify that:

- frontend and backend are separated,
- backend has a real API,
- backend has Prisma configured,
- backend has a MySQL database,
- frontend calls the backend API,
- shared types are not duplicated unnecessarily,
- README contains working setup instructions,
- seed data can be loaded.

If the structure is incomplete, fix it.

---

### 3.2 Database persistence

Verify that real data is stored in MySQL using Prisma.

The database should contain at least these models:

- UserProfile,
- Language,
- ExerciseSet,
- Exercise,
- AnswerOption,
- GrammarNote,
- UserExerciseProgress,
- TestSession,
- TestSessionAnswer,
- Settings.

For MVP, if some post-MVP models are not fully used yet, they may exist in the schema but have minimal usage.

Critical requirement:

- profiles must be saved in MySQL,
- exercises must be saved in MySQL,
- answers must update progress in MySQL,
- session results must be saved in MySQL,
- repeated mistakes must be based on persisted progress.

If important data is stored only in React state or localStorage, move it to the backend and database.

---

### 3.3 Backend API

Verify that the backend exposes useful REST endpoints.

At minimum, implement these endpoints:

Profiles:

- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/profiles/:id`
- `PATCH /api/profiles/:id`
- `DELETE /api/profiles/:id`

Exercise sets:

- `GET /api/exercise-sets`
- `POST /api/exercise-sets`
- `GET /api/exercise-sets/:id`
- `PATCH /api/exercise-sets/:id`
- `DELETE /api/exercise-sets/:id`

Exercises:

- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/exercises/:id`
- `PATCH /api/exercises/:id`
- `DELETE /api/exercises/:id`

Learning sessions:

- `POST /api/sessions/learning/start`
- `POST /api/sessions/:id/answer`
- `POST /api/sessions/:id/finish`
- `GET /api/sessions/:id/report`

Progress:

- `GET /api/profiles/:id/progress`
- `GET /api/profiles/:id/reviews`
- `POST /api/profiles/:id/reviews/start`

Grammar notes:

- `GET /api/grammar-notes`
- `GET /api/grammar-notes/:id`

For MVP, editing grammar notes can be skipped if needed.

All endpoints should:

- validate input,
- return JSON,
- handle errors cleanly,
- avoid crashing the backend.

---

### 3.4 Frontend/backend integration

Verify that the frontend uses the backend API for real application data.

The frontend should call the backend for:

- loading profiles,
- creating profiles,
- loading exercise sets,
- loading exercises,
- starting a learning session,
- submitting answers,
- loading progress,
- loading due reviews,
- displaying session reports.

Do not keep core application data as hardcoded mock data in React components.

Mock data is acceptable only for temporary visual placeholders, not for real business logic.

---

### 3.5 Answer checking

Implement or verify a real answer checking module.

Expected function:

- `checkAnswer(userAnswer, exercise): AnswerCheckResult`

Expected return shape:

- `isCorrect: boolean`
- `normalizedUserAnswer: string`
- `matchedAnswer: string | null`
- `score: number`
- `feedback: string`
- `almostCorrect: boolean`

The answer checker should support:

- case-insensitive comparison,
- trimming whitespace,
- normalizing repeated spaces,
- optional punctuation normalization,
- multiple correct answers,
- acceptable answer variants,
- optional words,
- simple alternatives,
- minor typo detection.

Example accepted answers for the same exercise:

- `I have got a car`
- `I've got a car`
- `I have a car`

Optional words syntax:

- `I have [got] a car`

Simple alternatives syntax:

- `I have got a car/I've got a car`

Near match logic:

- small spelling mistakes can be marked as almost correct,
- almost correct should not be treated as fully correct,
- do not accept clearly wrong grammar only because the string is similar.

Add unit tests for this module.

---

### 3.6 Required answer checking tests

Add tests for these cases:

Test case 1:

- Input: `I have got a car`
- Accepted: `I have got a car`
- Expected: correct

Test case 2:

- Input: `I've got a car`
- Accepted variants:
  - `I have got a car`
  - `I've got a car`
- Expected: correct

Test case 3:

- Input: `I have a car`
- Pattern: `I have [got] a car`
- Expected: correct

Test case 4:

- Input: `She drinks coffee every day`
- Accepted: `She drinks coffee every day`
- Expected: correct

Test case 5:

- Input: `She drink coffee every day`
- Accepted: `She drinks coffee every day`
- Expected: incorrect or almost correct, but not fully correct

Test case 6:

- Fill gap input: `drinks`
- Accepted: `drinks`
- Expected: correct

Test case 7:

- Fill gap input: `drink`
- Accepted: `drinks`
- Expected: incorrect or almost correct, but not fully correct

---

### 3.7 Learning mode

Verify that learning mode is a real interactive flow.

Learning mode should:

- allow selecting a user profile,
- allow selecting an exercise set,
- start a session through backend API,
- show one exercise at a time,
- allow the user to submit an answer,
- call backend answer checking,
- show feedback immediately,
- show explanation if available,
- update user progress after every answer,
- repeat wrong answers during the same session,
- show a final result screen.

If learning mode is only a static UI, implement a working version.

MVP exercise types required in learning mode:

- `multiple_choice`
- `fill_gap`
- `sentence_translation`

Other exercise types may be present as placeholders, but they must be clearly marked as not implemented yet.

---

### 3.8 Test mode

If test mode exists, verify that it is different from learning mode.

Test mode should:

- disable hints,
- avoid immediate explanations by default,
- save answers,
- calculate score,
- create a final report.

If test mode is not implemented yet, add a clean placeholder route/page and mark it as post-MVP, unless the rest of the MVP is already complete.

Do not spend too much time on test mode before the learning mode works.

---

### 3.9 Progress tracking

Verify that progress is updated after every submitted answer.

Each user/exercise pair should track:

- attempts,
- correctAttempts,
- wrongAttempts,
- masteryLevel,
- lastAnswer,
- lastAnsweredAt,
- nextReviewAt,
- easeFactor,
- intervalDays.

Progress must be persisted in MySQL.

Progress should not disappear after page refresh.

---

### 3.10 Repeated mistakes and spaced repetition

Implement or verify a simple repetition algorithm.

After a correct answer:

- increase masteryLevel by 1, up to 5,
- increase intervalDays according to mastery level,
- set nextReviewAt to the future.

Suggested intervals:

- mastery 0 -> 1 day
- mastery 1 -> 2 days
- mastery 2 -> 4 days
- mastery 3 -> 7 days
- mastery 4 -> 14 days
- mastery 5 -> 30 days

After a wrong answer:

- decrease masteryLevel by 1, not below 0,
- increase wrongAttempts,
- set nextReviewAt to today or tomorrow,
- add the exercise to the current session repeat queue if learning mode is active.

The dashboard should show due reviews or repeated mistakes if available.

---

### 3.11 Exercise editor

Check whether a basic exercise editor exists.

For MVP, the editor should support at least:

- creating an exercise set,
- editing an exercise set,
- adding multiple choice exercises,
- adding fill gap exercises,
- adding sentence translation exercises,
- editing correct answers,
- editing acceptable answers,
- editing explanations,
- setting difficulty,
- setting tags.

If no editor exists yet, create a minimal functional editor or add a clearly marked post-MVP placeholder.

Do not let the lack of a full editor block the MVP if seed data and learning mode already work.

---

### 3.12 Import/export

Check whether JSON import/export exists.

For MVP, this can be minimal.

Import should:

- accept exercise set JSON,
- validate required fields,
- validate exercise types,
- validate correctAnswers,
- save data to MySQL,
- return readable validation errors.

Export should:

- export an exercise set with exercises,
- produce portable JSON.

If missing and the MVP is otherwise functional, add at least export or document import/export as post-MVP.

---

### 3.13 Grammar notes

Verify that grammar notes are represented in the database.

Minimum functionality:

- seed a few grammar notes,
- list grammar notes,
- show grammar note content,
- allow an exercise to reference a grammar note,
- show related grammar note in learning mode if available.

Initial grammar notes:

- Present Simple
- Past Simple
- Articles: a/an/the
- Questions with do/does/did
- There is / There are

---

### 3.14 Seed data

Add or verify realistic seed data.

Seed data should include at least 5 exercise sets:

1. Basic vocabulary: home
2. Basic vocabulary: travel
3. Present Simple
4. Past Simple
5. Questions and negatives

Each set should contain useful A1/A2 English exercises for Polish-speaking learners.

For MVP, each set should contain at least several real exercises.

Prefer quality over generating many meaningless exercises.

Exercise types in seed data should include:

- `multiple_choice`
- `fill_gap`
- `sentence_translation`

---

### 3.15 Validation and security

Verify that:

- backend input is validated with Zod,
- API errors are handled,
- JSON import is validated,
- file upload types are restricted if uploads exist,
- upload size is limited if uploads exist,
- unsafe filenames are not used,
- frontend forms validate required fields.

If upload support is not implemented yet, document it as post-MVP.

---

### 3.16 Tests

Add or verify tests for:

- answer normalization,
- answer checking,
- optional words,
- answer alternatives,
- almost-correct detection,
- repetition algorithm,
- learning session generation.

Use Vitest or Jest.

Make sure tests can be run with a documented command.

---

### 3.17 Documentation

Update README.md so that a new developer can run the project.

README should include:

- project overview,
- requirements,
- installation,
- backend startup,
- frontend startup,
- database migration,
- seed command,
- test command,
- Docker Compose startup if available,
- current MVP status,
- known missing features.

If Docker is not ready yet, do not pretend it works. Mark it as planned.

---

## 4. Implementation priorities

Work in this order:

1. Make the backend run.
2. Make Prisma and MySQL work.
3. Make seed data work.
4. Make frontend load real profiles and exercise sets.
5. Make learning mode work.
6. Make answer checking reliable.
7. Make progress tracking persistent.
8. Make repeated mistakes work.
9. Add tests.
10. Update README.

Do not spend too much time on visual polish before the core learning loop works.

---

## 5. Definition of done for MVP

The MVP is done when:

- the app starts locally,
- the backend connects to MySQL,
- seed data can be loaded,
- a user can select or create a profile,
- a user can choose an exercise set,
- a user can complete a learning session,
- answers are checked,
- feedback is shown,
- progress is saved,
- wrong answers are repeated,
- due reviews are calculated,
- README explains how to run everything.

---

## 6. Output after changes

After making changes, provide a concise summary:

1. What was already working.
2. What was missing.
3. What you changed.
4. How to run the project now.
5. What still remains as future work.

Do not provide only a theoretical review.

Make the code work.