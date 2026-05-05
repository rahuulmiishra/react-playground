import EmptyStateFlashDemo from './EmptyStateFlashDemo.jsx'

export default {
  slug: 'why-useeffect-is-bad',
  title: 'Why useEffect is bad',
  summary: 'Three real-world useEffect anti-patterns and their fixes.',
  intro:
    'Each demo runs Bad and Good side-by-side. Use the trigger button and watch for the bug.',
  demos: [
    {
      id: 'empty-state-flash',
      title: 'Empty-state flash on first render',
      Component: EmptyStateFlashDemo,
    },
  ],
}
