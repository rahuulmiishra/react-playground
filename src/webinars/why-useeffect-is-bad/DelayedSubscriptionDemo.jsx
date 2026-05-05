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
