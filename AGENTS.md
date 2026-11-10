# Portfolio project instructions

This is Samiul Azim Leon’s personal, desktop-inspired portfolio. Preserve the midnight-blue wallpaper and make the portfolio feel like a native macOS desktop and iOS home screen, with familiar app icons, system-style windows, accessible interactions, lightweight motion, and visible credit to Eagle Dzn Studio. Keep the dock translucent and show app names on hover, keyboard focus, and touch long press; a normal tap opens the app. Keep the About Me icon in the dock only; do not add a landing-page introduction to the desktop. Use the supplied native Notes icon for the Notes app. Do not invent personal facts, project achievements, or social destinations; label demo content until Leon supplies real details.

Content and app definitions belong in `src/data/`; window contents in `src/apps/`; shared interface components in `src/components/`; styling in `src/styles/`; replaceable imagery in `public/assets/`. Keep dependencies and animations lightweight. Support keyboard navigation, readable contrast, touch, and reduced motion.

Run `npm test`, `npm run check:structure`, and `npm run build` after relevant changes. When files or directories change, run `npm run structure:update`, review the result, and commit the updated tree. When the user changes an enduring requirement or design decision, update these instructions in the same change. Never assume a hook can infer or enforce intent on its own.

## Project structure

The following list is maintained by `npm run structure:update` and checked in tests. Generated files, dependencies, and Git internals are excluded.

<!-- structure:start -->
.codex/
.codex/config.toml
.codex/hooks/
.codex/hooks/README.md
.gitignore
AGENTS.md
index.html
package-lock.json
package.json
public/
public/assets/
public/assets/notes-macos.png
public/assets/portrait.png
README.md
scripts/
scripts/check-structure.mjs
scripts/session-start.mjs
src/
src/App.tsx
src/apps/
src/apps/AppContent.tsx
src/components/
src/components/AppIcon.tsx
src/components/MenuBar.tsx
src/components/Window.tsx
src/data/
src/data/apps.ts
src/main.tsx
src/styles/
src/styles/main.css
tests/
tests/project.test.mjs
tsconfig.json
vite.config.ts
<!-- structure:end -->
