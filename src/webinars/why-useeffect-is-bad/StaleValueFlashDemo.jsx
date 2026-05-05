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
  // eslint-disable-next-line react-hooks/refs -- intentional render counter for demo
  renders.current += 1

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional anti-pattern (the stale-value flash this demo shows)
    setDerived(expensive(count))
  }, [count])

  return (
    <div className="derived-stage">
      <div className="kvs">
        <div><span className="k">count</span><span className="v">{count}</span></div>
        <div><span className="k">derived</span><span className="v">{derived}</span></div>
      </div>
      {/* eslint-disable-next-line react-hooks/refs -- intentional render counter for demo */}
      <span className="render-badge">renders: {renders.current}</span>
    </div>
  )
}

function GoodDerived({ count }) {
  const derived = useMemo(() => expensive(count), [count])
  const renders = useRef(0)
  // eslint-disable-next-line react-hooks/refs -- intentional render counter for demo
  renders.current += 1

  return (
    <div className="derived-stage">
      <div className="kvs">
        <div><span className="k">count</span><span className="v">{count}</span></div>
        <div><span className="k">derived</span><span className="v">{derived}</span></div>
      </div>
      {/* eslint-disable-next-line react-hooks/refs -- intentional render counter for demo */}
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
