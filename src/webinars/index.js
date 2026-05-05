export const webinars = []

export function getWebinar(slug) {
  return webinars.find((w) => w.slug === slug)
}
