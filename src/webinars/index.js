import whyUseEffectIsBad from './why-useeffect-is-bad/index.jsx'

export const webinars = [whyUseEffectIsBad]

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
