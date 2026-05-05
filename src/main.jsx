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
