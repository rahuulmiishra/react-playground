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

React Class Playground — a personal learning project that mirrors the user's React class. Each "webinar" is a topic with a set of small Bad/Good demo components.

- Routing: `react-router-dom@^7` via `createBrowserRouter` in `src/main.jsx`. Routes: `/` (home), `/webinars/:slug` (detail), `*` (NotFound).
- Layout: `src/app/Layout.jsx` renders the header and `<Outlet />`.
- Webinar registry: `src/webinars/index.js` exports a hardcoded `webinars` array and `getWebinar(slug)`. Each webinar is a folder under `src/webinars/<slug>/` exporting `{ slug, title, summary, intro, demos: [{ id, title, Component }] }` from its `index.jsx`. Add a webinar = create a folder, export the shape, append to the array.
- Detail page: `src/pages/WebinarPage.jsx` looks up the webinar by `:slug` and renders each demo in its own `<section id={demo.id}>` so deep-links via `#demo-id` work.
- DemoFrame: `src/components/DemoFrame.jsx` is the shared Bad/Good wrapper used by every demo — slots for `controls` (above, shared trigger), `bad`, `good`, and `notes` (takeaway under the grid).
- Styling: plain CSS files per component. Each `Foo.jsx` imports its sibling `Foo.css`. `src/index.css` has the global resets and `.container`. No Tailwind, no CSS modules, no preprocessor.
- Helpers: `src/lib/fakeApi.js` exposes `fetchItems()` with a 600ms delay for demos.
- StrictMode is intentionally retained — surfaces effect bugs in demos, which is on-purpose for this playground.
- No test runner. Verification is manual through `pnpm dev`, plus `pnpm lint` and `pnpm build`.
