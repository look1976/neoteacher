# Feature: Frontend Learning Flow

## Priority

P0 - Required for MVP.

## Gap

The backend exposes session endpoints and the frontend has API helpers, but no UI calls them. The current frontend only loads profiles and exercise sets.

## Goal

Allow a user to start and complete a learning session from the browser.

## Scope

- Add a Start button to each exercise set.
- Start a session through `POST /api/sessions/learning/start`.
- Render one exercise at a time.
- Support MVP exercise types:
  - `multiple_choice`
  - `fill_gap`
  - `sentence_translation`
  - `text_translation` can reuse the sentence/text input component.
- Submit answers through `POST /api/sessions/:id/answer`.
- Show immediate feedback in learning mode.
- Show explanation after answering if available.
- Repeat wrong answers later in the same session.
- Finish the session through `POST /api/sessions/:id/finish`.
- Show a final result screen.

## Acceptance Criteria

- A seeded user can click Start on `Everyday English`.
- The first question appears without using curl or dev tools.
- Multiple choice options are clickable.
- Text questions can be answered with an input field.
- Correct answers show positive feedback.
- Incorrect answers show feedback and the exercise is queued for repetition.
- The session can be completed and a result summary appears.
- Refreshing after submitted answers does not erase backend progress.

## Likely Files

- `frontend/src/App.tsx`
- `frontend/src/components/ExerciseSetList.tsx`
- `frontend/src/components/LearningSession.tsx`
- `frontend/src/components/ExercisePrompt.tsx`
- `frontend/src/api/sessions.ts`
- `frontend/src/types.ts`

## Notes

The backend currently sanitizes exercises and does not return correct answers, which is correct for the UI. The answer feedback should come only from the session answer endpoint.

