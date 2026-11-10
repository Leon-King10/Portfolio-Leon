# Samiul Azim Leon — Portfolio

A responsive desktop-inspired portfolio. Biography, projects, and social apps are intentionally marked as demos until replaced with Leon’s real information.

## Start

```sh
npm install
npm run dev
npm test
npm run build
```

Edit app labels and demo content in `src/data/`, window content in `src/apps/`, and replace `public/assets/portrait.png` or the wallpaper styles as needed. When adding or removing files, run `npm run structure:update` and review the generated tree in `AGENTS.md`. Add lasting project decisions to the same file.

## Codex hook

The project-local `.codex/config.toml` registers a `SessionStart` hook for startup, resume, and compaction. It runs `scripts/session-start.mjs`, which adds `AGENTS.md` to the session context. Review and trust the project and its hook in Codex using `/hooks`; changed hook definitions require renewed trust. Verify the script with `node scripts/session-start.mjs` and observe the hook in a fresh trusted session. The hook can supply instructions, but cannot guarantee an agent follows them or automatically write new decisions.

## Deployment

Push the repository to GitHub and import it into Vercel. Vercel detects Vite; the build command is `npm run build` and output directory is `dist`. No backend or secrets are needed.
