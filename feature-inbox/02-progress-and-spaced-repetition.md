# Feature: Progress And Spaced Repetition

## Priority

P0 - Required for MVP quality.

## Gap

Progress rows are created and updated, but the review algorithm is incomplete. Correct answers always set the next review to tomorrow, `intervalDays` is not updated, `easeFactor` is not adjusted, and mastery clamping can overwrite the updated mastery value.

## Goal

Implement the simple spaced repetition behavior described in the prompts.

## Scope

- Extract progress update logic into a reusable backend helper.
- Correct answer:
  - increase `masteryLevel` by 1 up to 5,
  - set `intervalDays` based on new mastery:
    - 0 -> 1
    - 1 -> 2
    - 2 -> 4
    - 3 -> 7
    - 4 -> 14
    - 5 -> 30
  - set `nextReviewAt` based on `intervalDays`.
- Wrong answer:
  - decrease `masteryLevel` by 1, not below 0,
  - set `intervalDays` to 0 or 1,
  - set `nextReviewAt` to today.
- Keep `attempts`, `correctAttempts`, `wrongAttempts`, `lastAnswer`, and `lastAnsweredAt` accurate.
- Dashboard should show due review count and mistake count.

## Acceptance Criteria

- Answering correctly updates mastery and future review date.
- Answering incorrectly lowers mastery and makes the exercise due.
- `GET /api/profiles/:id/reviews` returns due review items.
- Repeated answer submissions do not produce invalid mastery values below 0 or above 5.
- Unit tests cover the interval table and boundary conditions.

## Likely Files

- `backend/src/routes/sessions.ts`
- `backend/src/lib/progress.ts`
- `backend/tests/progress.test.ts`
- `frontend/src/components/Dashboard.tsx`
- `frontend/src/api/profiles.ts`

