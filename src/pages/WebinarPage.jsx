import { useParams } from 'react-router-dom'
import { getWebinar } from '../webinars/index.js'
import NotFound from '../app/NotFound.jsx'
import './WebinarPage.css'

export default function WebinarPage() {
  const { slug } = useParams()
  const webinar = getWebinar(slug)
  if (!webinar) return <NotFound />

  return (
    <article className="webinar">
      <header className="webinar-header">
        <h1>{webinar.title}</h1>
        <p className="intro">{webinar.intro}</p>
      </header>
      {webinar.demos.map((demo, i) => {
        const Demo = demo.Component
        return (
          <section key={demo.id} id={demo.id} className="demo-section">
            <h2>
              <span className="demo-num">Demo {i + 1}</span> {demo.title}
            </h2>
            <Demo />
          </section>
        )
      })}
    </article>
  )
}
