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
