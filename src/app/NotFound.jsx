import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div>
      <h1>Not found</h1>
      <p>That page does not exist.</p>
      <p><Link to="/">Back to home</Link></p>
    </div>
  )
}
