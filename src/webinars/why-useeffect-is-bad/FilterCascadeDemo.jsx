import { useEffect, useMemo, useState } from 'react'
import './FilterCascadeDemo.css'

const ITEMS = [
  { id: 1, name: 'Apple', category: 'fruit' },
  { id: 2, name: 'Banana', category: 'fruit' },
  { id: 3, name: 'Carrot', category: 'veggie' },
  { id: 4, name: 'Donut', category: 'snack' },
  { id: 5, name: 'Eggplant', category: 'veggie' },
  { id: 6, name: 'Fudge', category: 'snack' },
  { id: 7, name: 'Grape', category: 'fruit' },
  { id: 8, name: 'Hummus', category: 'snack' },
]

const CATEGORIES = ['all', 'fruit', 'veggie', 'snack']

function applyFilter(items, filter) {
  const start = performance.now()
  while (performance.now() - start < 200) {
    // intentional busy-loop so the stale-list flash lingers long enough to see
  }
  return filter === 'all' ? items : items.filter((i) => i.category === filter)
}

function FilterPane({ kind, title, filter, setFilter, items }) {
  return (
    <div className={`fc-pane fc-${kind}`}>
      <h4>{title}</h4>
      <div className="fc-controls">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={c === filter ? 'active' : ''}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="fc-status">
        Filter: <strong>{filter}</strong> · {items.length} items
      </p>
      <ul className="fc-items">
        {items.map((it) => (
          <li key={it.id}>
            {it.name} <span className="cat">({it.category})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BadFilter() {
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState(() => applyFilter(ITEMS, 'all'))

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional anti-pattern: syncing derived state from another state
    setItems(applyFilter(ITEMS, filter))
  }, [filter])

  return (
    <FilterPane
      kind="bad"
      title="Bad (filter via useEffect)"
      filter={filter}
      setFilter={setFilter}
      items={items}
    />
  )
}

function GoodFilter() {
  const [filter, setFilter] = useState('all')
  const items = useMemo(() => applyFilter(ITEMS, filter), [filter])
  return (
    <FilterPane
      kind="good"
      title="Good (derived during render)"
      filter={filter}
      setFilter={setFilter}
      items={items}
    />
  )
}

export default function FilterCascadeDemo() {
  return (
    <div className="fc-stage">
      <p className="hint">
        Click a category. In Bad, the header switches immediately but the list shows the
        previous filter for a split second before catching up. Good stays consistent — the
        list is derived during render.
      </p>
      <div className="fc-row">
        <BadFilter />
        <GoodFilter />
      </div>
    </div>
  )
}
