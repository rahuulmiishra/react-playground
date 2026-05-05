import { Component, Suspense, use, useState } from 'react'
import './ProductsListDemo.css'

function fetchProducts() {
  return fetch('https://dummyjson.com/products').then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })
}

function ProductsList({ promise }) {
  const data = use(promise)
  return (
    <ul className="products">
      {data.products.map((p) => (
        <li key={p.id} className="product">
          <img src={p.thumbnail} alt="" className="thumb" />
          <div className="meta">
            <h3>{p.title}</h3>
            <p className="price">${p.price}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <p className="status error">Error: {this.state.error.message}</p>
    }
    return this.props.children
  }
}

export default function ProductsListUseDemo() {
  const [promise] = useState(fetchProducts)
  return (
    <ErrorBoundary>
      <Suspense fallback={<p className="status">Loading…</p>}>
        <ProductsList promise={promise} />
      </Suspense>
    </ErrorBoundary>
  )
}
