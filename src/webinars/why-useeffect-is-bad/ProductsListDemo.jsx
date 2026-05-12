import { useEffect, useState } from 'react'
import './ProductsListDemo.css'

export default function ProductsListDemo() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true);
    fetch('https://dummyjson.com/products')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
  
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
   
        setError(err)
        setLoading(false)
      })
    return () => {

    }
  }, [])

  if (loading) return <p className="status">Loading…</p>
  if (error) return <p className="status error">Error: {error.message}</p>

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
