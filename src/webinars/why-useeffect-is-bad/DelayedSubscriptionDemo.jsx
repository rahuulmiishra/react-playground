import { useEffect, useState, useSyncExternalStore } from 'react'
import './DelayedSubscriptionDemo.css'

let count = 0
const listeners = new Set()
setInterval(() => {
  count += 1
  listeners.forEach((l) => l())
}, 100)

function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return count
}

function BadCounter() {
  const [value, setValue] = useState(getSnapshot)

  useEffect(() => {
    let unsub
    const t = setTimeout(() => {
      setValue(getSnapshot())
      unsub = subscribe(() => setValue(getSnapshot()))
    }, 2000)
    return () => {
      clearTimeout(t)
      if (unsub) unsub()
    }
  }, [])

  return (
    <div className="ticker ticker-bad">
      <span className="label">Bad (useEffect + 500ms gap)</span>
      <strong className="value">{value}</strong>
    </div>
  )
}

function GoodCounter() {
  const value = useSyncExternalStore(subscribe, getSnapshot)
  return (
    <div className="ticker ticker-good">
      <span className="label">Good (useSyncExternalStore)</span>
      <strong className="value">{value}</strong>
    </div>
  )
}

export default function DelayedSubscriptionDemo() {
  const [mounted, setMounted] = useState(true)
  return (
    <div className="delayed-stage">
      <p className="hint">
        External counter ticks every 100ms. Click Remount and watch Bad freeze on a stale value
        for 500ms while Good stays live.
      </p>
      <button
        type="button"
        className="remount-btn"
        onClick={() => setMounted((m) => !m)}
      >
        {mounted ? 'Unmount' : 'Mount'}
      </button>
      {mounted && (
        <div className="ticker-row">
          <BadCounter />
          <GoodCounter />
        </div>
      )}
    </div>
  )
}
