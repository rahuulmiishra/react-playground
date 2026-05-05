# React Class Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild this Vite + React 19 starter as a personal playground that lists webinars from the user's React class and lets them open a webinar to see Bad/Good demo components. First webinar: "Why useEffect is bad" with three demos.

**Architecture:** `react-router-dom@^7` with `createBrowserRouter`. A hardcoded webinar registry (`src/webinars/index.js`) is the single source of truth. Each webinar exports `{ slug, title, summary, intro, demos: [{ id, title, Component }] }`. The detail page renders demos vertically using a shared `<DemoFrame>` that lays out Bad / Good side-by-side with a shared controls slot. Plain CSS files per component, no Tailwind, no UI library.

**Tech Stack:** React 19, Vite 8, react-router-dom 7, ESLint flat config, pnpm, plain CSS. No test runner — verification is manual via `pnpm dev` and the browser, plus `pnpm lint` and `pnpm build` at the end.

**Spec:** `docs/superpowers/specs/2026-05-05-react-class-playground-design.md`

---

## File Structure

Files this plan creates or rewrites:

| Path | Responsibility |
|------|----------------|
| `index.html` | Title update only |
| `src/main.jsx` | Router setup + `<RouterProvider>` mount |
| `src/index.css` | Global resets, body, links, container |
| `src/app/Layout.jsx` + `.css` | Site chrome (header, back link), `<Outlet />` |
| `src/app/NotFound.jsx` | 404 fallback |
| `src/pages/HomePage.jsx` + `.css` | Listing of webinars (vertical numbered rows) |
| `src/pages/WebinarPage.jsx` + `.css` | Loads webinar by `:slug`, renders demos stacked |
| `src/components/DemoFrame.jsx` + `.css` | Bad/Good wrapper with controls + notes slots |
| `src/lib/fakeApi.js` | 600ms delayed `fetchItems()` helper |
| `src/webinars/index.js` | `webinars` array + `getWebinar(slug)` |
| `src/webinars/why-useeffect-is-bad/index.jsx` | Webinar entry — title, intro, demos |
| `src/webinars/why-useeffect-is-bad/EmptyStateFlashDemo.jsx` + `.css` | Demo 1 |
| `src/webinars/why-useeffect-is-bad/DelayedSubscriptionDemo.jsx` + `.css` | Demo 2 |
| `src/webinars/why-useeffect-is-bad/StaleValueFlashDemo.jsx` + `.css` | Demo 3 |
| `CLAUDE.md` | Architecture section updated to reflect new structure |

Files deleted: `src/App.jsx`, `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/assets/` (if empty).
Files untouched: `public/favicon.svg`, `public/icons.svg`, `eslint.config.js`, `vite.config.js`, `package.json` scripts, `pnpm-lock.yaml` (regenerates on install).

---

## Verification Note

There is no test runner in this project. "Manual verification" steps in this plan mean: have `pnpm dev` running in a terminal, open the printed URL in a browser, and confirm what each step describes. The dev server has HMR — it picks up file changes automatically; if HMR misbehaves, hard-reload the page.

---

## Task 1: Clean slate and install router

**Files:**
- Delete: `src/App.jsx`, `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/assets/` (after the three files inside it are gone)
- Modify: `index.html`, `src/index.css`, `src/main.jsx`
- Modify: `package.json`, `pnpm-lock.yaml` (via `pnpm add`)

- [ ] **Step 1: Delete the starter UI files**

```bash
rm src/App.jsx src/App.css src/assets/react.svg src/assets/vite.svg src/assets/hero.png
rmdir src/assets
```

- [ ] **Step 2: Update `index.html` title**

Open `index.html`, change the `<title>` tag content to `React Class Playground`.

```html
<title>React Class Playground</title>
```

- [ ] **Step 3: Replace `src/index.css` with bare globals**

Overwrite the file with:

```css
:root {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
  color: #1f2328;
  background: #f7f7f8;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

a {
  color: #0969da;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  font: inherit;
  cursor: pointer;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px;
}
```

- [ ] **Step 4: Replace `src/main.jsx` with a placeholder mount that compiles**

Overwrite the file with a temporary single-route mount so the app still boots while we add routing in Task 2.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="container">
      <h1>React Class Playground</h1>
      <p>Bootstrapping…</p>
    </div>
  </StrictMode>,
)
```

- [ ] **Step 5: Install `react-router-dom`**

Run: `pnpm add react-router-dom`
Expected: `package.json` gets `"react-router-dom": "^7.x.x"` (or similar) under `dependencies`; `pnpm-lock.yaml` updates.

- [ ] **Step 6: Verify dev server boots**

Run: `pnpm dev` in one terminal, open the printed URL.
Expected: page shows the heading "React Class Playground" and the text "Bootstrapping…". No console errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove starter UI and install react-router-dom"
```

---

## Task 2: Router scaffold, Layout, and NotFound

**Files:**
- Create: `src/app/Layout.jsx`
- Create: `src/app/Layout.css`
- Create: `src/app/NotFound.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/app/Layout.jsx`**

```jsx
import { Link, Outlet, useLocation } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container layout-header-inner">
          <Link to="/" className="brand">React Class Playground</Link>
          {!onHome && (
            <Link to="/" className="back-link">← All webinars</Link>
          )}
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/Layout.css`**

```css
.layout-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.layout-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
}

.brand {
  font-weight: 600;
  color: #1f2328;
}

.brand:hover {
  text-decoration: none;
  color: #0969da;
}

.back-link {
  font-size: 14px;
}
```

- [ ] **Step 3: Create `src/app/NotFound.jsx`**

```jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div>
      <h1>Not found</h1>
      <p>That page does not exist.</p>
      <p><Link to="/">Back to home</Link></p>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/main.jsx` with the real router**

Use a placeholder `HomePage` and `WebinarPage` — defined inline temporarily. We replace them with real pages in Tasks 3 and 4.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout.jsx'
import NotFound from './app/NotFound.jsx'
import './index.css'

function HomePagePlaceholder() {
  return <p>Home page (placeholder).</p>
}

function WebinarPagePlaceholder() {
  return <p>Webinar page (placeholder).</p>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePagePlaceholder /> },
      { path: 'webinars/:slug', element: <WebinarPagePlaceholder /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 5: Manual verify**

With `pnpm dev` running:
- Visit `/` → header with brand "React Class Playground"; main content shows "Home page (placeholder)."
- Visit `/webinars/anything` → header now shows the "← All webinars" back link; main content shows "Webinar page (placeholder)."
- Visit `/garbage` → "Not found" page with a working back link.
- Click brand from a non-home page → goes back to `/`.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold router, layout, and not-found page"
```

---

## Task 3: Home page with empty webinar registry

**Files:**
- Create: `src/webinars/index.js`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/HomePage.css`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/webinars/index.js` with an empty registry**

```js
export const webinars = []

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
```

- [ ] **Step 2: Create `src/pages/HomePage.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { webinars } from '../webinars/index.js'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home">
      <h1>React Class Playground</h1>
      <p className="lede">Notes and live demos from my React classes.</p>
      {webinars.length === 0 ? (
        <p className="empty">No webinars yet.</p>
      ) : (
        <ol className="webinar-list">
          {webinars.map((w, i) => (
            <li key={w.slug}>
              <Link to={`/webinars/${w.slug}`} className="webinar-row">
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="text">
                  <span className="title">{w.title}</span>
                  <span className="summary">{w.summary}</span>
                </span>
                <span className="chev" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/pages/HomePage.css`**

```css
.home h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

.home .lede {
  margin: 0 0 32px;
  color: #57606a;
}

.empty {
  color: #57606a;
  font-style: italic;
}

.webinar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.webinar-row {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: inherit;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.webinar-row:hover {
  background: #f6f8fa;
  border-color: #d0d7de;
  text-decoration: none;
}

.webinar-row .num {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #57606a;
}

.webinar-row .text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.webinar-row .title {
  font-weight: 600;
  font-size: 16px;
}

.webinar-row .summary {
  font-size: 14px;
  color: #57606a;
}

.webinar-row .chev {
  color: #57606a;
}
```

- [ ] **Step 4: Wire `HomePage` into the router**

Edit `src/main.jsx` — replace the `HomePagePlaceholder` import/use with the real component. Keep `WebinarPagePlaceholder` for now (Task 4).

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout.jsx'
import NotFound from './app/NotFound.jsx'
import HomePage from './pages/HomePage.jsx'
import './index.css'

function WebinarPagePlaceholder() {
  return <p>Webinar page (placeholder).</p>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'webinars/:slug', element: <WebinarPagePlaceholder /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 5: Manual verify**

Visit `/` → see "React Class Playground" heading, lede paragraph, italic "No webinars yet." (registry is empty until Task 8). No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: home page with empty webinar registry"
```

---

## Task 4: Webinar detail page (registry-driven)

**Files:**
- Create: `src/pages/WebinarPage.jsx`
- Create: `src/pages/WebinarPage.css`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/pages/WebinarPage.jsx`**

```jsx
import { useParams } from 'react-router-dom'
import { getWebinar } from '../webinars/index.js'
import NotFound from '../app/NotFound.jsx'
import './WebinarPage.css'

export default function WebinarPage() {
  const { slug } = useParams()
  const webinar = getWebinar(slug)
  if (!webinar) return <NotFound />

  return (
    <article className="webinar">
      <header className="webinar-header">
        <h1>{webinar.title}</h1>
        <p className="intro">{webinar.intro}</p>
      </header>
      {webinar.demos.map((demo, i) => {
        const Demo = demo.Component
        return (
          <section key={demo.id} id={demo.id} className="demo-section">
            <h2>
              <span className="demo-num">Demo {i + 1}</span> {demo.title}
            </h2>
            <Demo />
          </section>
        )
      })}
    </article>
  )
}
```

- [ ] **Step 2: Create `src/pages/WebinarPage.css`**

```css
.webinar-header {
  margin-bottom: 32px;
}

.webinar-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.webinar-header .intro {
  margin: 0;
  color: #57606a;
}

.demo-section {
  margin: 40px 0;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.demo-section h2 {
  font-size: 18px;
  margin: 0 0 16px;
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.demo-num {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #57606a;
  font-weight: 600;
}
```

- [ ] **Step 3: Wire `WebinarPage` into the router**

Edit `src/main.jsx` — replace the `WebinarPagePlaceholder` with the real component.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout.jsx'
import NotFound from './app/NotFound.jsx'
import HomePage from './pages/HomePage.jsx'
import WebinarPage from './pages/WebinarPage.jsx'
import './index.css'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 4: Manual verify**

- Visit `/webinars/why-useeffect-is-bad` → "Not found" page (registry still empty).
- Visit `/webinars/foo` → "Not found" page.
- Visit `/` → home page still works.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: webinar detail page driven by registry"
```

---

## Task 5: DemoFrame component and fakeApi helper

**Files:**
- Create: `src/components/DemoFrame.jsx`
- Create: `src/components/DemoFrame.css`
- Create: `src/lib/fakeApi.js`

- [ ] **Step 1: Create `src/lib/fakeApi.js`**

```js
export function fetchItems() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Apple', 'Banana', 'Cherry']), 600)
  })
}
```

- [ ] **Step 2: Create `src/components/DemoFrame.jsx`**

```jsx
import './DemoFrame.css'

export default function DemoFrame({ controls, bad, good, notes }) {
  return (
    <div className="demo-frame">
      {controls && <div className="demo-controls">{controls}</div>}
      <div className="demo-grid">
        <div className="demo-pane bad">
          <div className="pane-label">Bad</div>
          <div className="pane-body">{bad}</div>
        </div>
        <div className="demo-pane good">
          <div className="pane-label">Good</div>
          <div className="pane-body">{good}</div>
        </div>
      </div>
      {notes && <p className="demo-notes">{notes}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/DemoFrame.css`**

```css
.demo-frame {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.demo-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.demo-controls button {
  padding: 8px 14px;
  background: #1f2328;
  color: #ffffff;
  border: 1px solid #1f2328;
  border-radius: 6px;
}

.demo-controls button:hover {
  background: #30363d;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 720px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}

.demo-pane {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 32px 16px 16px;
  position: relative;
  background: #fafbfc;
  min-height: 160px;
}

.demo-pane.bad {
  border-color: #f5c2c0;
  background: #fff5f5;
}

.demo-pane.good {
  border-color: #b7e1c2;
  background: #f4faf6;
}

.pane-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 999px;
}

.bad .pane-label {
  background: #ffe1e1;
  color: #a40e26;
}

.good .pane-label {
  background: #d4f1dd;
  color: #1a7f37;
}

.demo-notes {
  margin: 16px 0 0;
  padding: 12px 14px;
  background: #f6f8fa;
  border-left: 3px solid #1f2328;
  color: #57606a;
  font-size: 14px;
  border-radius: 4px;
}
```

- [ ] **Step 4: Manual verify**

Nothing visible yet — no consumer. `pnpm dev` should still build with no errors. Confirm browser console is clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: DemoFrame component and fakeApi helper"
```

---

## Task 6: Demo 1 — EmptyStateFlashDemo, register first webinar

**Files:**
- Create: `src/webinars/why-useeffect-is-bad/index.jsx`
- Create: `src/webinars/why-useeffect-is-bad/EmptyStateFlashDemo.jsx`
- Create: `src/webinars/why-useeffect-is-bad/EmptyStateFlashDemo.css`
- Modify: `src/webinars/index.js`

- [ ] **Step 1: Create `EmptyStateFlashDemo.jsx`**

```jsx
import { useEffect, useState } from 'react'
import DemoFrame from '../../components/DemoFrame.jsx'
import { fetchItems } from '../../lib/fakeApi.js'
import './EmptyStateFlashDemo.css'

function BadList({ nonce }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false
    setItems([])
    fetchItems().then((data) => {
      if (!cancelled) setItems(data)
    })
    return () => {
      cancelled = true
    }
  }, [nonce])

  if (items.length === 0) {
    return <p className="empty-msg">No items found.</p>
  }
  return (
    <ul className="items">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  )
}

function GoodList({ nonce }) {
  const [state, setState] = useState({ status: 'loading', items: [] })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', items: [] })
    fetchItems().then((data) => {
      if (!cancelled) setState({ status: 'success', items: data })
    })
    return () => {
      cancelled = true
    }
  }, [nonce])

  if (state.status === 'loading') {
    return <p className="loading-msg">Loading…</p>
  }
  if (state.items.length === 0) {
    return <p className="empty-msg">No items found.</p>
  }
  return (
    <ul className="items">
      {state.items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  )
}

export default function EmptyStateFlashDemo() {
  const [nonce, setNonce] = useState(0)
  return (
    <DemoFrame
      controls={
        <button type="button" onClick={() => setNonce((n) => n + 1)}>
          Reload
        </button>
      }
      bad={<BadList nonce={nonce} />}
      good={<GoodList nonce={nonce} />}
      notes={`Empty array ≠ no data. Distinguish "loading" from "loaded but empty".`}
    />
  )
}
```

- [ ] **Step 2: Create `EmptyStateFlashDemo.css`**

```css
.items {
  margin: 0;
  padding-left: 20px;
}

.empty-msg {
  margin: 0;
  font-style: italic;
  color: #a40e26;
}

.loading-msg {
  margin: 0;
  color: #57606a;
}
```

- [ ] **Step 3: Create `src/webinars/why-useeffect-is-bad/index.jsx`**

```jsx
import EmptyStateFlashDemo from './EmptyStateFlashDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Three real-world useEffect anti-patterns and their fixes.',
  intro:
    'Each demo runs Bad and Good side-by-side. Use the trigger button and watch for the bug.',
  demos: [
    {
      id: 'empty-state-flash',
      title: 'Empty-state flash on first render',
      Component: EmptyStateFlashDemo,
    },
  ],
}
```

- [ ] **Step 4: Register the webinar in `src/webinars/index.js`**

```js
import whyUseEffectIsBad from './why-useeffect-is-bad/index.jsx'

export const webinars = [whyUseEffectIsBad]

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
```

- [ ] **Step 5: Manual verify**

- Visit `/` → see one row "01 — Why useEffect is bad" with the summary line.
- Click the row → navigate to `/webinars/why-useeffect-is-bad`.
- See "Demo 1 — Empty-state flash on first render" section with the DemoFrame.
- On first render: **Bad pane shows "No items found." in red for ~600ms, then a list of Apple/Banana/Cherry. Good pane shows "Loading…" then the list.**
- Click "Reload" → Bad pane flashes "No items found." again briefly; Good pane shows "Loading…" briefly. Both end with the list.
- StrictMode note: in dev, mount runs twice — the bad flash may happen twice on initial mount; that's expected.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(why-useeffect-is-bad): demo 1 empty-state flash"
```

---

## Task 7: Demo 2 — DelayedSubscriptionDemo

**Files:**
- Create: `src/webinars/why-useeffect-is-bad/DelayedSubscriptionDemo.jsx`
- Create: `src/webinars/why-useeffect-is-bad/DelayedSubscriptionDemo.css`
- Modify: `src/webinars/why-useeffect-is-bad/index.jsx`

- [ ] **Step 1: Create `DelayedSubscriptionDemo.jsx`**

The Bad pane measures the target with `useEffect`; the Good pane uses `useLayoutEffect`. Both panes are remounted via `key` whenever the user clicks "Remount" so the difference is visible from the very first paint.

```jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import DemoFrame from '../../components/DemoFrame.jsx'
import './DelayedSubscriptionDemo.css'

function BadTooltip() {
  const targetRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const r = targetRef.current.getBoundingClientRect()
    const parent = targetRef.current.offsetParent.getBoundingClientRect()
    setPos({ top: r.bottom - parent.top + 6, left: r.left - parent.left })
  }, [])

  return (
    <div className="tooltip-stage">
      <div ref={targetRef} className="target">Target</div>
      <div className="tooltip" style={{ top: pos.top, left: pos.left }}>
        Tooltip
      </div>
    </div>
  )
}

function GoodTooltip() {
  const targetRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    const r = targetRef.current.getBoundingClientRect()
    const parent = targetRef.current.offsetParent.getBoundingClientRect()
    setPos({ top: r.bottom - parent.top + 6, left: r.left - parent.left })
  }, [])

  return (
    <div className="tooltip-stage">
      <div ref={targetRef} className="target">Target</div>
      <div className="tooltip" style={{ top: pos.top, left: pos.left }}>
        Tooltip
      </div>
    </div>
  )
}

export default function DelayedSubscriptionDemo() {
  const [key, setKey] = useState(0)
  return (
    <DemoFrame
      controls={
        <button type="button" onClick={() => setKey((k) => k + 1)}>
          Remount
        </button>
      }
      bad={<BadTooltip key={key} />}
      good={<GoodTooltip key={key} />}
      notes="Effects that affect layout must run before paint. Use useLayoutEffect."
    />
  )
}
```

- [ ] **Step 2: Create `DelayedSubscriptionDemo.css`**

```css
.tooltip-stage {
  position: relative;
  height: 140px;
  padding: 16px;
}

.target {
  display: inline-block;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-weight: 600;
}

.tooltip {
  position: absolute;
  background: #1f2328;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
}
```

- [ ] **Step 3: Append to demos in `src/webinars/why-useeffect-is-bad/index.jsx`**

```jsx
import EmptyStateFlashDemo from './EmptyStateFlashDemo.jsx'
import DelayedSubscriptionDemo from './DelayedSubscriptionDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Three real-world useEffect anti-patterns and their fixes.',
  intro:
    'Each demo runs Bad and Good side-by-side. Use the trigger button and watch for the bug.',
  demos: [
    {
      id: 'empty-state-flash',
      title: 'Empty-state flash on first render',
      Component: EmptyStateFlashDemo,
    },
    {
      id: 'delayed-subscription',
      title: 'Delayed subscription (effect runs after paint)',
      Component: DelayedSubscriptionDemo,
    },
  ],
}
```

- [ ] **Step 4: Manual verify**

- Visit `/webinars/why-useeffect-is-bad`. Demo 2 appears below Demo 1.
- On first paint: in the **Bad** pane, the tooltip momentarily appears at `(0, 0)` (top-left of the pane) before snapping under the target. In the **Good** pane, the tooltip is already correctly positioned.
- Click "Remount". Same observation: Bad jumps, Good doesn't.
- If on a fast machine the Bad jump is imperceptible, follow the Risks note from the spec — wrap `setPos` inside `BadTooltip` in `requestAnimationFrame`. Only do this if the jump is otherwise invisible.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(why-useeffect-is-bad): demo 2 delayed subscription"
```

---

## Task 8: Demo 3 — StaleValueFlashDemo

**Files:**
- Create: `src/webinars/why-useeffect-is-bad/StaleValueFlashDemo.jsx`
- Create: `src/webinars/why-useeffect-is-bad/StaleValueFlashDemo.css`
- Modify: `src/webinars/why-useeffect-is-bad/index.jsx`

- [ ] **Step 1: Create `StaleValueFlashDemo.jsx`**

`expensive(count)` is intentionally slow (~30ms busy-loop) so the intermediate render in the Bad pane lingers visibly. Render counts are tracked with a `useRef` incremented during render and displayed as a badge.

```jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import DemoFrame from '../../components/DemoFrame.jsx'
import './StaleValueFlashDemo.css'

function expensive(count) {
  const start = performance.now()
  while (performance.now() - start < 30) {
    // intentional busy-loop — only for visualizing render flashes in this demo
  }
  return count * count
}

function BadDerived({ count }) {
  const [derived, setDerived] = useState(() => expensive(count))
  const renders = useRef(0)
  renders.current += 1

  useEffect(() => {
    setDerived(expensive(count))
  }, [count])

  return (
    <div className="derived-stage">
      <div className="kvs">
        <div><span className="k">count</span><span className="v">{count}</span></div>
        <div><span className="k">derived</span><span className="v">{derived}</span></div>
      </div>
      <span className="render-badge">renders: {renders.current}</span>
    </div>
  )
}

function GoodDerived({ count }) {
  const derived = useMemo(() => expensive(count), [count])
  const renders = useRef(0)
  renders.current += 1

  return (
    <div className="derived-stage">
      <div className="kvs">
        <div><span className="k">count</span><span className="v">{count}</span></div>
        <div><span className="k">derived</span><span className="v">{derived}</span></div>
      </div>
      <span className="render-badge">renders: {renders.current}</span>
    </div>
  )
}

export default function StaleValueFlashDemo() {
  const [count, setCount] = useState(1)
  return (
    <DemoFrame
      controls={
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increment
        </button>
      }
      bad={<BadDerived count={count} />}
      good={<GoodDerived count={count} />}
      notes="If state B is fully derived from state A, compute it during render. Don't sync via effect."
    />
  )
}
```

- [ ] **Step 2: Create `StaleValueFlashDemo.css`**

```css
.derived-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.kvs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-variant-numeric: tabular-nums;
  font-size: 16px;
}

.k {
  display: inline-block;
  width: 80px;
  color: #57606a;
  font-size: 13px;
}

.v {
  font-weight: 600;
}

.render-badge {
  font-size: 12px;
  color: #57606a;
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 999px;
  padding: 2px 10px;
}
```

- [ ] **Step 3: Append to demos in `src/webinars/why-useeffect-is-bad/index.jsx`**

```jsx
import EmptyStateFlashDemo from './EmptyStateFlashDemo.jsx'
import DelayedSubscriptionDemo from './DelayedSubscriptionDemo.jsx'
import StaleValueFlashDemo from './StaleValueFlashDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Three real-world useEffect anti-patterns and their fixes.',
  intro:
    'Each demo runs Bad and Good side-by-side. Use the trigger button and watch for the bug.',
  demos: [
    {
      id: 'empty-state-flash',
      title: 'Empty-state flash on first render',
      Component: EmptyStateFlashDemo,
    },
    {
      id: 'delayed-subscription',
      title: 'Delayed subscription (effect runs after paint)',
      Component: DelayedSubscriptionDemo,
    },
    {
      id: 'stale-value-flash',
      title: 'Cascading effect causes stale-value flash',
      Component: StaleValueFlashDemo,
    },
  ],
}
```

- [ ] **Step 4: Manual verify**

- Visit `/webinars/why-useeffect-is-bad`. Demo 3 appears below Demo 2.
- Initial render: Bad and Good both show `count = 1`, `derived = 1`. Note: in dev StrictMode, every render is double-invoked, so the render badges include those extra invocations — focus on relative growth, not absolute numbers.
- Click "Increment" once. **Bad pane briefly shows `count = 2, derived = 1` (stale) — visible flash for ~30ms — then snaps to `count = 2, derived = 4`. Good pane goes straight to `count = 2, derived = 4` with no flash.**
- Click "Increment" several more times — the Bad pane's render badge grows roughly twice as fast as the Good pane's, because each Bad click causes a render with stale `derived` plus a second render after the effect calls `setDerived`.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(why-useeffect-is-bad): demo 3 stale-value flash"
```

---

## Task 9: Update CLAUDE.md, lint, build, final verify

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the Architecture section in `CLAUDE.md`**

Open `CLAUDE.md`. Replace the entire `## Architecture` section with:

```markdown
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
```

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: exit code 0, no errors. (Warnings about React refresh fast-refresh on the webinar `index.jsx` may be acceptable; if any rule fails, fix the offending file before continuing — do not silence rules.)

- [ ] **Step 3: Run a production build**

Run: `pnpm build`
Expected: exit code 0, `dist/` directory generated. No build errors.

- [ ] **Step 4: Final manual verification (Definition of Done)**

With `pnpm dev` running:
- `/` shows the listing with one row: "01 — Why useEffect is bad".
- Clicking the row navigates to `/webinars/why-useeffect-is-bad` and renders three demos in order.
- Demo 1: Bad pane flashes "No items found." for ~600ms; Good pane shows "Loading…".
- Demo 2: Bad tooltip jumps from `(0, 0)` to its correct position; Good tooltip stays put.
- Demo 3: Bad pane briefly shows stale `derived` after Increment; Good pane is always consistent. Bad render count grows ~2× faster than Good.
- Browser back button returns to the listing.
- `/webinars/foo` (unknown slug) → NotFound page.
- Console is clean except for any warnings the Bad demos intentionally produce.
- `pnpm lint` passes.
- `pnpm build` succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: update CLAUDE.md to reflect new architecture"
```

---

## Done

The project now has a working webinar playground with one webinar populated. Adding the next class is: create a folder under `src/webinars/`, export the standard shape, append to the array in `src/webinars/index.js`. No registry or routing changes needed.
