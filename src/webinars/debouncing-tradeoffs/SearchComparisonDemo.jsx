import { useEffect, useRef, useState } from 'react'
import './SearchComparisonDemo.css'

const API = 'https://dummyjson.com/products/search?q='

function SearchPanel({ label, accent, debounceMs }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const [requestCount, setRequestCount] = useState(0)
  const [latestQuery, setLatestQuery] = useState('')
  const reqIdRef = useRef(0)

  const trimmed = query.trim()

  useEffect(() => {
    if (!trimmed) return

    let cancelled = false

    const run = () => {
      if (cancelled) return
      const myId = ++reqIdRef.current
      setRequestCount((n) => n + 1)
      setStatus('loading')

      fetch(API + encodeURIComponent(trimmed))
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then((json) => {
          // Race guard: discard if a newer request has been issued.
          if (myId !== reqIdRef.current) return
          setResults(json.products ?? [])
          setLatestQuery(trimmed)
          setStatus('done')
        })
        .catch(() => {
          if (myId !== reqIdRef.current) return
          setStatus('error')
        })
    }

    if (debounceMs > 0) {
      const t = setTimeout(run, debounceMs)
      return () => {
        cancelled = true
        clearTimeout(t)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [trimmed, debounceMs])

  // Render-time guard: empty query short-circuits stale state without setState in effect.
  const displayStatus = trimmed ? status : 'idle'
  const displayResults = trimmed ? results : []
  const displayQuery = trimmed ? latestQuery : ''

  return (
    <article className="panel" style={{ '--accent': accent }}>
      <header className="panel-head">
        <div className="panel-title">
          <span className="dot" data-status={displayStatus} />
          <h3>{label}</h3>
        </div>
        <div className="counter" key={requestCount}>
          <span className="counter-num">{requestCount}</span>
          <span className="counter-label">requests</span>
        </div>
      </header>

      <div className="input-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        <span className="input-glow" />
      </div>

      <div className="status-row">
        {displayStatus === 'idle' && <span>Type to search.</span>}
        {displayStatus === 'loading' && <span className="loading">Fetching…</span>}
        {displayStatus === 'done' && (
          <span>
            {displayResults.length} result{displayResults.length === 1 ? '' : 's'} for{' '}
            <em>"{displayQuery}"</em>
          </span>
        )}
        {displayStatus === 'error' && <span className="error">Request failed.</span>}
      </div>

      <ul className="results">
        {displayResults.slice(0, 8).map((p, i) => (
          <li key={p.id} className="result" style={{ '--i': i }}>
            <img src={p.thumbnail} alt="" loading="lazy" />
            <div className="result-meta">
              <span className="result-title">{p.title}</span>
              <span className="result-price">${p.price}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function SearchComparisonDemo() {
  return (
    <div className="search-comparison">
      <p className="lede">
        Type the same query into both. The left panel waits until you stop;
        the right panel fires on every keystroke and uses a{' '}
        <code>requestId</code> guard so stale responses never overwrite the
        latest one.
      </p>
      <div className="panel-grid">
        <SearchPanel label="Debounced (400ms)" accent="#8b5cf6" debounceMs={400} />
        <SearchPanel label="Immediate (race-safe)" accent="#22d3ee" debounceMs={0} />
      </div>
      <footer className="takeaway">
        <strong>Takeaway:</strong> debouncing trades responsiveness for fewer
        requests. If your API is fast and cheap (or cached), the immediate
        version with a race guard often gives a better feel without the
        bug-prone debounce timer dance.
      </footer>
    </div>
  )
}
