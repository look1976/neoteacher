# Feature: Exercise Editor

## Priority

P2 - Important, but not before the core learning loop.

## Gap

Backend CRUD exists for exercise sets and exercises, but there is no frontend editor.

## Goal

Create a minimal content editor for custom exercise sets and MVP exercise types.

## Scope

- List exercise sets.
- Create/edit/delete exercise sets.
- Add exercises of type:
  - `multiple_choice`
  - `fill_gap`
  - `sentence_translation`
- Edit:
  - question text,
  - prompt text,
  - correct answers,
  - acceptable answers,
  - explanation,
  - difficulty,
  - tags.
- For multiple choice, edit answer options and mark correct option.
- Preview an exercise.
- Test answer checking against draft answers.

## Acceptance Criteria

- A custom exercise set can be created fully from the UI.
- A new exercise appears in the learning flow.
- Invalid payloads show readable errors.
- Editing does not require database or curl access.

## Likely Files

- `frontend/src/components/ExerciseEditor.tsx`
- `frontend/src/components/ExerciseSetEditor.tsx`
- `frontend/src/api/exerciseSets.ts`
- `frontend/src/api/exercises.ts`
- `backend/src/routes/exerciseSets.ts`
- `backend/src/routes/exercises.ts`

