# Feature: Grammar Notes In Learning UI

## Priority

P1 - Supports learning mode explanations.

## Gap

Grammar notes exist in the database and backend, but the frontend does not load or display them. The session response only includes `grammarNoteId`.

## Goal

Show linked grammar notes during learning mode when available.

## Scope

- Load grammar note by id when the current exercise has `grammarNoteId`.
- Show an Explain button in learning mode.
- Display note title, topic, content, and examples.
- Hide or disable explanations in test mode later.

## Acceptance Criteria

- Exercises linked to Present Simple can reveal a Present Simple explanation.
- Grammar content is loaded from backend, not hardcoded in React.
- Missing grammar notes are handled gracefully.

## Likely Files

- `frontend/src/api/grammarNotes.ts`
- `frontend/src/components/GrammarNotePanel.tsx`
- `frontend/src/components/LearningSession.tsx`
- `backend/src/routes/grammarNotes.ts`

