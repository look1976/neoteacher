# Feature: Test Coverage

## Priority

P1 - Add alongside core behavior changes.

## Gap

Only answer checker tests exist, and they cover 4 cases. The prompts require more answer tests plus repetition algorithm and learning session generation tests.

## Goal

Add focused tests around the code most likely to regress.

## Scope

- Complete required answer checker test cases:
  - exact answer,
  - accepted variant,
  - optional word,
  - Present Simple correct,
  - Present Simple grammar mistake not fully correct,
  - fill gap correct,
  - fill gap near miss not fully correct.
- Add tests for simple alternatives.
- Add progress/repetition tests after extracting progress logic.
- Add learning session generation tests for exercise set filtering and limit.

## Acceptance Criteria

- `npm --workspace backend test` passes.
- Tests cover answer normalization and almost-correct behavior.
- Tests cover mastery boundaries 0 and 5.
- Tests cover interval mapping.
- Tests are documented in README.

## Likely Files

- `backend/tests/checkAnswer.test.ts`
- `backend/tests/progress.test.ts`
- `backend/tests/sessionSelection.test.ts`
- `backend/src/lib/progress.ts`
- `backend/src/lib/sessionSelection.ts`

