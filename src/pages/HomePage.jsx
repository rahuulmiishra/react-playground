import { Link } from 'react-router-dom'
import { webinars } from '../webinars/index.js'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home">
      <h1>React Class Playground</h1>
      <p className="lede">Notes and live demos from my React classes.</p>
      <div className="home-actions">
        <Link to="/search-scratch" className="cta">
          Build search from scratch →
        </Link>
      </div>
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
