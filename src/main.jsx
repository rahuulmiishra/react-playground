import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout.jsx'
import NotFound from './app/NotFound.jsx'
import HomePage from './pages/HomePage.jsx'
import WebinarPage from './pages/WebinarPage.jsx'
import SearchScratchPage from './pages/SearchScratchPage.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'webinars/:slug', element: <WebinarPage /> },
      { path: 'search-scratch', element: <SearchScratchPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(

    <RouterProvider router={router} />
,
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )
