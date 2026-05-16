# Feature: JSON Import And Export

## Priority

P2 - Useful for content portability.

## Gap

The prompts require JSON import/export for exercise sets. No routes or UI exist.

## Goal

Allow exercise sets to be exported and imported as readable JSON.

## Scope

- Add export route for an exercise set with exercises and answer options.
- Add import route with Zod validation.
- Validate:
  - required exercise set fields,
  - supported exercise types,
  - non-empty correct answers,
  - valid answer options.
- Return readable import errors.
- Add frontend controls for exporting and importing JSON.
- Create `sample-data/` with at least one importable file.

## Acceptance Criteria

- Exported JSON can be imported into a clean database.
- Invalid JSON returns useful validation messages.
- Import saves data to MySQL.
- JSON format is documented.

## Likely Files

- `backend/src/routes/exerciseSets.ts`
- `backend/src/lib/exerciseSetJson.ts`
- `backend/tests/exerciseSetJson.test.ts`
- `frontend/src/components/ImportExportPanel.tsx`
- `sample-data/english-basics-present-simple.json`

