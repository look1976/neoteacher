# Feature: Seed Data Expansion

## Priority

P0 - Needed for a useful MVP demo.

## Gap

Current seed data creates one profile, one grammar note, one exercise set, and two exercises. The prompts expect at least five exercise sets and several grammar notes.

## Goal

Provide enough realistic A1/A2 English practice data for the learning loop to feel like a real app.

## Scope

Create seed data for:

- Basic vocabulary: home
- Basic vocabulary: travel
- Present Simple
- Past Simple
- Questions and negatives

Seed grammar notes:

- Present Simple
- Past Simple
- Articles: a/an/the
- Questions with do/does/did
- There is / There are

Include exercise types:

- `multiple_choice`
- `fill_gap`
- `sentence_translation`

## Acceptance Criteria

- `npm run db:seed` creates at least 5 exercise sets.
- Each exercise set has several useful exercises.
- Each required grammar note exists.
- At least some exercises reference grammar notes.
- Seed data is safe to rerun and clears old seed-owned records consistently.

## Likely Files

- `backend/prisma/seed.ts`
- Optional: `sample-data/english-a1.json`

## Notes

Prefer fewer, high-quality exercises over large generated filler.

