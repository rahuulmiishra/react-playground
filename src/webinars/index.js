import whyUseEffectIsBad from './why-useeffect-is-bad/index.jsx'
import debouncingTradeoffs from './debouncing-tradeoffs/index.jsx'

export const webinars = [whyUseEffectIsBad, debouncingTradeoffs]

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
