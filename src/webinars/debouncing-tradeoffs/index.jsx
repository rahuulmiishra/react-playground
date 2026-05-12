import SearchComparisonDemo from './SearchComparisonDemo.jsx'

export default {
  slug: 'debouncing-tradeoffs',
  title: 'Debouncing tradeoffs',
  summary:
    'Debounced search vs fire-on-every-keystroke search (race-safe). When does debouncing actually help?',
  intro:
    'Two search inputs side-by-side hitting the same API. The left one waits 400ms after you stop typing; the right one fires on every keystroke and uses a request-ID guard so the latest response always wins. Watch the request counters as you type.',
  demos: [
    {
      id: 'search-comparison',
      title: 'Debounced vs immediate search',
      Component: SearchComparisonDemo,
    },
  ],
}
