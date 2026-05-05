import ProductsListDemo from './ProductsListDemo.jsx'
import ProductsListUseDemo from './ProductsListUseDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Fetch a products list — once with useEffect, once with React 19 use().',
  intro:
    'Two components fetching the same dummyjson.com endpoint, each with a different approach to async state.',
  demos: [
    {
      id: 'products-list',
      title: 'Fetch products list with useEffect',
      Component: ProductsListDemo,
    },
    {
      id: 'products-list-use',
      title: 'Fetch products list with use() + Suspense (React 19)',
      Component: ProductsListUseDemo,
    },
  ],
}
