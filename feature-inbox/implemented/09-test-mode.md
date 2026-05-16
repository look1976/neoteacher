# Feature: Test Mode

## Priority

P3 - Post-learning-flow MVP extension.

## Gap

The backend `start` endpoint accepts `mode: "test"`, but the frontend has no test mode and backend behavior is not meaningfully different from learning mode.

## Goal

Implement a distinct test mode with stricter UX and final reporting.

## Scope

- Add a Test Mode entry point.
- Allow selecting exercise set and question count.
- Optional time limit can be added later.
- Do not show hints or explanations while answering.
- Save all answers.
- Finish session and show report.
- Report includes:
  - score percentage,
  - correct/incorrect counts,
  - question list,
  - user answers,
  - suggested reviews.

## Acceptance Criteria

- Test mode can be started from the UI.
- Feedback is delayed until the report.
- Session and answers are persisted.
- Report is loaded from backend.

## Likely Files

- `frontend/src/components/TestSession.tsx`
- `frontend/src/components/SessionReport.tsx`
- `frontend/src/api/sessions.ts`
- `backend/src/routes/sessions.ts`

