export interface AsyncReader<S, T> {
  (input: S): Promise<T>
}

export function map<S, T, R>(reader: AsyncReader<S, T>, f: (value: T) => R): AsyncReader<S, R> {
  return async i => f(await reader(i))
}

export function just<S, T>(value: T): AsyncReader<S, T> {
  return () => Promise.resolve(value)
}
