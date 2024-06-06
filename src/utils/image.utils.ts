export const getImageUrl = (name: string, ext: string) => {
  return new URL(`../assets/images/${name}.${ext}`, import.meta.url).href
}
