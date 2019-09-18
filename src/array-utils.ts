function isDefined<T>(t: T | undefined): boolean {
  return t !== undefined
}

export function pluck<T, K extends keyof T>(values: T[], key: K): T[K][] {
  return values.map(v => v[key]).filter(isDefined)
}
