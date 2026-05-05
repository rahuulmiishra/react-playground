import ProductsListDemo from './ProductsListDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Fetch a products list with useEffect — loading, data, and error states.',
  intro:
    'Single component fetching from dummyjson.com inside useEffect. Renders loading, then either the products grid or an error message.',
  demos: [
    {
      id: 'products-list',
      title: 'Fetch products list with useEffect',
      Component: ProductsListDemo,
    },
  ],
}
