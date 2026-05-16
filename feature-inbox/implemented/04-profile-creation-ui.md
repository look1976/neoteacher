# Feature: Profile Creation UI

## Priority

P1 - Required by the original product spec and useful for MVP.

## Gap

The backend supports creating profiles, but the frontend only selects existing profiles.

## Goal

Allow local users to create a profile from the browser.

## Scope

- Add a Create Profile action near the profile selector.
- Collect:
  - name,
  - native language,
  - target language.
- Submit through `POST /api/profiles`.
- Select the newly created profile after creation.
- Show validation errors.

## Acceptance Criteria

- A user can create a profile without using curl.
- Empty names are rejected in the UI and backend.
- New profile appears in the selector immediately.
- Profile persists after refresh.

## Likely Files

- `frontend/src/components/ProfileSelector.tsx`
- `frontend/src/components/ProfileForm.tsx`
- `frontend/src/api/profiles.ts`
- `frontend/src/App.tsx`

