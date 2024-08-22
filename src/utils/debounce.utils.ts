//TODO: Implement search scenarios
// export function debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean) {
//   let timeout: NodeJS.Timeout
//   return function (this: any, ...args: any[]) {
//     const context = this
//     const later = function () {
//       timeout = null as any
//       if (!immediate) func.apply(context, args)
//     }
//     const callNow = immediate && !timeout
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//     if (callNow) func.apply(context, args)
//   }
// }
