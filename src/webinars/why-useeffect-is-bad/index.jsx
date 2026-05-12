import ProductsListDemo from './ProductsListDemo.jsx'
import ProductsListUseDemo from './ProductsListUseDemo.jsx'
import DelayedSubscriptionDemo from './DelayedSubscriptionDemo.jsx'
import FilterCascadeDemo from './FilterCascadeDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary:
    'Fetching with useEffect vs use(), and the cost of subscribing in useEffect.',
  intro:
    'Three demos comparing useEffect-based patterns with their modern React replacements.',
  demos: [
    // {
    //   id: 'products-list',
    //   title: 'Fetch products list with useEffect',
    //   Component: ProductsListDemo,
    // },
    // {
    //   id: 'products-list-use',
    //   title: 'Fetch products list with use() + Suspense (React 19)',
    //   Component: ProductsListUseDemo,
    // },
    {
      id: 'delayed-subscription',
      title: 'Subscribe in useEffect vs useSyncExternalStore',
      Component: DelayedSubscriptionDemo,
    },
    // {
    //   id: 'filter-cascade',
    //   title: 'Sync derived state via useEffect vs derive during render',
    //   Component: FilterCascadeDemo,
    // },
  ],
}
