import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout.jsx'
import NotFound from './app/NotFound.jsx'
import './index.css'

function HomePagePlaceholder() {
  return <p>Home page (placeholder).</p>
}

function WebinarPagePlaceholder() {
  return <p>Webinar page (placeholder).</p>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePagePlaceholder /> },
      { path: 'webinars/:slug', element: <WebinarPagePlaceholder /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
