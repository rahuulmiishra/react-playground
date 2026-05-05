import { useEffect, useState } from 'react'
import DemoFrame from '../../components/DemoFrame.jsx'
import { fetchItems } from '../../lib/fakeApi.js'
import './EmptyStateFlashDemo.css'

function BadList({ nonce }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional anti-pattern (the flash this demo shows)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- explicit loading reset is the fix this demo shows
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
