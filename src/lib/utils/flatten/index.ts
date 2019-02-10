export function flatten<T>(array: T[][]): T[] {
  return ([] as T[]).concat(...array)
}
