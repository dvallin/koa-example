export interface Counter {
  inc(value?: number, timestamp?: number | Date): void
}
export interface Gauge {
  inc(value?: number, timestamp?: number | Date): void
  dec(value?: number, timestamp?: number | Date): void
  set(value?: number, timestamp?: number | Date): void
}
export interface Labelable<T> {
  labels(...values: string[]): T
}
export type Unlabeled<T> = T & Labelable<T>

export interface Metrics {
  asString(): string

  counter(name: string, help: string): Unlabeled<Counter>
  gauge(name: string, help: string): Unlabeled<Gauge>
}
