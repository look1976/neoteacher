# Feature: Media Upload And Playback

## Priority

P3 - Part of the product vision, post-core-MVP.

## Gap

Schema fields exist for `imagePath` and `audioPath`, but there are no upload folders, upload endpoints, static file serving, validation, or frontend playback.

## Goal

Support local image and audio assets for multimedia exercises.

## Scope

- Create local upload folders:
  - `uploads/images/`
  - `uploads/audio/`
- Add backend upload endpoint.
- Restrict file types.
- Limit upload size.
- Sanitize filenames.
- Serve uploaded files statically.
- Show images in picture exercises.
- Add audio play button for listening/dictation exercises.
- Respect profile setting for automatic audio playback later.

## Acceptance Criteria

- Image files can be uploaded and displayed in an exercise.
- Audio files can be uploaded and played in an exercise.
- Unsafe file extensions are rejected.
- Uploaded file URLs are stored in MySQL.

## Likely Files

- `backend/src/routes/uploads.ts`
- `backend/src/index.ts`
- `frontend/src/components/MediaUpload.tsx`
- `frontend/src/components/ExercisePrompt.tsx`
- `uploads/images/.gitkeep`
- `uploads/audio/.gitkeep`

