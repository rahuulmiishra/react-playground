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
