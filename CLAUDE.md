# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (see `packageManager` field in `package.json`).

- `pnpm install` — install dependencies
- `pnpm dev` — start Vite dev server with HMR
- `pnpm build` — production build to `dist/`
- `pnpm preview` — preview the production build locally
- `pnpm lint` — run ESLint over the repo

No test runner is configured.

## Architecture

Minimal Vite + React 19 starter (JavaScript/JSX, not TypeScript).

- Entry point: `index.html` → `src/main.jsx` → mounts `<App />` inside `<StrictMode>` on `#root` via `createRoot`.
- `src/App.jsx` is the only component; styles live in sibling `App.css` and global `index.css`.
- Static SVG sprite at `public/icons.svg` is referenced via `<use href="/icons.svg#..." />` (served from root, not imported).
- Image assets imported from `src/assets/` are bundled by Vite; assets in `public/` are served as-is at the URL root.
- ESLint uses flat config (`eslint.config.js`) with `@eslint/js` recommended, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite preset). `dist` is globally ignored.
- Vite config (`vite.config.js`) only registers `@vitejs/plugin-react`. React Compiler is intentionally not enabled (see `README.md`).
