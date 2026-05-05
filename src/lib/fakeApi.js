export function fetchItems() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Apple', 'Banana', 'Cherry']), 600)
  })
}
