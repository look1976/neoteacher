# Feature: Theme And UI Foundation

## Priority

P3 - Improves polish after core flows work.

## Gap

The prompt asks for Tailwind CSS and dark/light theme. Current frontend uses inline styles and no Tailwind dependency.

## Goal

Create a simple, maintainable UI foundation with theme support.

## Scope

- Add Tailwind CSS or define a small CSS module/global stylesheet.
- Remove most inline styles from core components.
- Add light/dark theme state.
- Connect theme to profile settings eventually.
- Improve responsive layout.
- Keep the app functional and restrained, not a marketing page.

## Acceptance Criteria

- Components use shared classes/styles rather than large inline style blocks.
- Light and dark themes are visually usable.
- Theme choice persists per profile or local fallback.
- Existing dashboard and learning flow remain functional.

## Likely Files

- `frontend/package.json`
- `frontend/tailwind.config.*`
- `frontend/src/main.tsx`
- `frontend/src/styles.css`
- `frontend/src/components/*`

