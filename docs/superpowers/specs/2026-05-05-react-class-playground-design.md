# React Class Playground — Design

**Date:** 2026-05-05
**Status:** Draft, pending implementation
**Goal:** Rebuild this repo as a personal playground that mirrors the user's React class. Home page lists webinars; clicking one shows demo components built for that class topic. First webinar: **Why useEffect is bad**.

---

## 1. Scope

**In scope (v1):**
- Wipe existing starter UI.
- Home page with vertical numbered list of webinars (syllabus layout).
- Webinar detail page that renders all demos for the selected webinar, stacked.
- One webinar populated: `why-useeffect-is-bad`, with three Bad/Good demos.
- Reusable `<DemoFrame>` for side-by-side Bad/Good comparison.
- `react-router-dom` browser routing with bookmarkable URLs.
- Plain CSS files per component, scoped by class naming.

**Out of scope:**
- TypeScript, Tailwind, UI libraries, test runner.
- Auth, persistence, analytics.
- Auto-discovery via `import.meta.glob` (deferred until list grows).
- Sub-routes per demo (use anchors instead).
- Tabs / accordion in detail page.

---

## 2. Tech stack

- React 19 (existing)
- Vite 8 (existing)
- ESLint flat config (existing)
- **Add:** `react-router-dom@^7`
- Package manager: pnpm (existing)
- No new dev tooling.

---

## 3. File structure

```
src/
  main.jsx                       # Router setup, mounts <RouterProvider />
  index.css                      # Global resets / typography / container
  app/
    Layout.jsx                   # Header + <Outlet />
    Layout.css
    NotFound.jsx
  pages/
    HomePage.jsx                 # Webinar listing
    HomePage.css
    WebinarPage.jsx              # Loads webinar by :slug, renders demos
    WebinarPage.css
  webinars/
    index.js                     # webinars[] array + getWebinar(slug)
    why-useeffect-is-bad/
      index.jsx                  # { slug, title, summary, intro, demos: [...] }
      EmptyStateFlashDemo.jsx
      EmptyStateFlashDemo.css
      DelayedSubscriptionDemo.jsx
      DelayedSubscriptionDemo.css
      StaleValueFlashDemo.jsx
      StaleValueFlashDemo.css
  components/
    DemoFrame.jsx                # Bad/Good wrapper
    DemoFrame.css
  lib/
    fakeApi.js                   # Shared 600ms-delay fetch helper
```

**Removed:** `src/App.jsx`, `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, empty `src/assets/`.
**Kept:** `index.html` (title updated to "React Class Playground"), `public/favicon.svg`, `public/icons.svg`, `eslint.config.js`, `vite.config.js`, `CLAUDE.md` (updated to reflect new architecture).

---

## 4. Routing

`src/main.jsx` uses `createBrowserRouter` + `<RouterProvider>`. `<StrictMode>` retained — surfaces effect bugs in demos, which is on-purpose.

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'webinars/:slug', element: <WebinarPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
```

`<Layout>` renders the header (`React Class Playground` title; back-to-home link when not on `/`) and `<Outlet />`. `<WebinarPage>` reads `:slug` via `useParams`; unknown slug renders `<NotFound>`.

---

## 5. Webinar registry

Hardcoded array, single source of truth, imported at build time.

`src/webinars/index.js`:
```js
import whyUseEffectIsBad from './why-useeffect-is-bad/index.jsx'

export const webinars = [whyUseEffectIsBad]

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
```

`src/webinars/why-useeffect-is-bad/index.jsx` exports:
```js
{
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Three real-world useEffect anti-patterns and their fixes.',
  intro: 'Each demo runs Bad and Good side-by-side. Use the trigger button and watch for the bug.',
  demos: [
    { id: 'empty-state-flash',    title: 'Empty-state flash on first render',           Component: EmptyStateFlashDemo },
    { id: 'delayed-subscription', title: 'Delayed subscription (effect runs after paint)', Component: DelayedSubscriptionDemo },
    { id: 'stale-value-flash',    title: 'Cascading effect causes stale-value flash',     Component: StaleValueFlashDemo },
  ],
}
```

To add a webinar later: create a folder under `src/webinars/`, export the same shape from `index.jsx`, append to the array.

---

## 6. Home page (listing)

Vertical numbered rows, one webinar per row.

- Row layout: `01` number column · title + one-line summary · right chevron `→`.
- Whole row is a `<Link>` to `/webinars/:slug`.
- Hover changes background; focus ring on keyboard navigation.
- Page title: `React Class Playground`. Lede: "Notes and live demos from my React classes."
- Falls back to "No webinars yet" if list is empty (defensive at boundary; not expected in v1).

---

## 7. Webinar detail page

```jsx
const { slug } = useParams()
const webinar = getWebinar(slug)
if (!webinar) return <NotFound />
// Render <header> + each demo as <section id={demo.id}>
```

- Header: title + intro paragraph.
- Each demo rendered in its own `<section>` with `id={demo.id}` (enables `#empty-state-flash` deep-links later).
- Section heading: `Demo {N} — {title}`.
- No tabs, no nested routing, no per-demo URL.

---

## 8. DemoFrame (Bad/Good wrapper)

```jsx
<DemoFrame
  controls={<button onClick={...}>Reload</button>}
  bad={<BadVersion />}
  good={<GoodVersion />}
  notes="Empty array ≠ no data. Distinguish 'loading' from 'loaded but empty'."
/>
```

- `controls` slot at top — shared trigger so both panes react to the same input.
- `demo-grid` is CSS grid: 2 columns ≥ 720px, stacked below.
- `pane-label` overlay on each pane: "Bad" (red accent) and "Good" (green accent).
- `notes` slot under the grid for the takeaway.
- All slot contents are React nodes — no children prop magic.

---

## 9. The three demos

Each demo file exports one component that internally renders `<DemoFrame>` with its `Bad` and `Good` implementations. Both implementations live in the same demo file (small enough; keeps comparisons readable).

### 9.1 `EmptyStateFlashDemo`

**Pattern shown:** Empty initial array masquerading as "loaded but empty" while a fetch is still in flight.

- Shared **"Reload"** button bumps a `nonce` prop into both panes; both refetch.
- `lib/fakeApi.js` exposes `fetchItems(nonce)` returning `Promise<string[]>` with a 600ms delay. Returns 3 items (`["Apple", "Banana", "Cherry"]`).
- **Bad:** `const [items, setItems] = useState([])`. `useEffect` calls `fetchItems`, then `setItems`. UI: `items.length === 0 ? <p>No items found.</p> : <ul>...`. First paint and every reload shows the empty message for 600ms.
- **Good:** `const [state, setState] = useState({ status: 'loading', items: [] })`. Effect sets to `loading` then to `success`. UI branches on `state.status`: `loading` → "Loading…" text, `success` and empty → "No items found.", `success` and non-empty → list.
- **Notes:** *"Empty array ≠ no data. Distinguish 'loading' from 'loaded but empty'."*

### 9.2 `DelayedSubscriptionDemo`

**Pattern shown:** Layout-affecting effects scheduled in `useEffect` run after paint, producing a one-frame visual jump.

- Shared **"Remount"** button bumps a `key` on both panes, forcing remount.
- Each pane contains a target square and a tooltip. The tooltip's `top`/`left` are computed by measuring the target via `ref.current.getBoundingClientRect()` on mount.
- **Bad:** measurement in `useEffect`. First paint shows tooltip at `(0, 0)`. After paint, the effect runs and updates the position; tooltip jumps. Visible on every remount.
- **Good:** measurement in `useLayoutEffect`. Position is set before the browser paints, no jump.
- No artificial delay. If the jump is too quick to perceive on real hardware during verification, address it then (see Risks).
- **Notes:** *"Effects that affect layout must run before paint. Use `useLayoutEffect`."*

### 9.3 `StaleValueFlashDemo`

**Pattern shown:** State derived from other state via `useEffect` causes an extra render with the stale derived value.

- Shared **"Increment"** button bumps `count`. `count` is owned by `StaleValueFlashDemo` (parent) and passed as a prop into both `Bad` and `Good` panes — both panes always see the same `count`.
- Each pane displays `count` and a `derived` value, where `derived = expensive(count)`. `expensive` is intentionally slow: a ~30ms busy-loop so the intermediate render lingers long enough to see.
- **Bad:** `const [derived, setDerived] = useState(() => expensive(count))`. `useEffect` on `[count]` calls `setDerived(expensive(count))`. After clicking Increment, pane renders once with new `count` and stale `derived`, then re-renders with both fresh. Visible flicker.
- **Good:** `const derived = useMemo(() => expensive(count), [count])`. One render. `count` and `derived` always consistent.
- A "render count" badge in each pane (incremented via `useRef` during render) makes the double-render in Bad concrete.
- **Notes:** *"If state B is fully derived from state A, compute it during render. Don't sync via effect."*

---

## 10. `lib/fakeApi.js`

```js
export function fetchItems() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Apple', 'Banana', 'Cherry']), 600)
  })
}
```

Each demo pane that calls `fetchItems()` runs it inside an effect whose deps include the parent's `nonce` — incrementing `nonce` triggers a refetch.

---

## 11. Styling

- Plain CSS files, one per component, imported at the top of the JSX.
- Class names prefixed by component: `.demo-frame`, `.webinar-row`, etc. No nesting, no preprocessors.
- System font stack. Light theme only.
- Container `max-width: 960px`, horizontal padding, centered.
- Color accents: Bad pane → soft red border + label badge; Good pane → soft green border + label badge.
- Responsive: `<DemoFrame>` panes stack vertically below 720px.
- Hover/focus states on rows, links, and buttons. Focus ring uses `outline`, not `outline: none`.

---

## 12. Cleanup checklist

Delete:
- `src/App.jsx`
- `src/App.css`
- `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/assets/` (if empty after)

Edit:
- `src/main.jsx` — replace App mount with router setup.
- `src/index.css` — strip starter styles, keep reset + body + link defaults + `.container`.
- `index.html` — update `<title>` to "React Class Playground".
- `CLAUDE.md` — update Architecture section to reflect new structure.

Keep:
- `public/favicon.svg`, `public/icons.svg`
- `eslint.config.js`, `vite.config.js`, `package.json`, `pnpm-lock.yaml`

---

## 13. Risks / open notes

- **StrictMode double-invoke:** intentional. Demos that depend on effect timing (Demo 1, 3) will show their bug twice in dev — that's a feature, not a bug, for a learning playground. If a demo becomes confusing because of it, document the StrictMode behavior in that demo's notes rather than disabling StrictMode.
- **Demo 2 cross-machine reliability:** `useEffect` vs `useLayoutEffect` jump is normally visible without artificial delay. If verification on real hardware shows no perceivable jump, add a one-frame `requestAnimationFrame` deferral inside the Bad pane's effect to make it observable — but only if needed.
- **`expensive()` in Demo 3:** 30ms busy-loop blocks the main thread on each render. Acceptable for a teaching demo; do not copy into real code.
- **No tests:** the project has no test runner. Verification is manual: dev server, click through, observe.

---

## 14. Definition of done

- `pnpm dev` boots cleanly with no console errors or React warnings (other than ones intentionally produced by Bad demos).
- Visiting `/` shows the listing with one row: "Why useEffect is bad".
- Clicking the row navigates to `/webinars/why-useeffect-is-bad` and renders three demos.
- Each demo's "Bad" pane visibly produces the bug; each "Good" pane does not.
- Browser back button returns to the listing.
- Unknown URL (e.g. `/webinars/foo`) renders the NotFound page.
- `pnpm lint` passes.
- `pnpm build` succeeds.
