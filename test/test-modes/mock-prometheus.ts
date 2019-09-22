import { Metrics, Unlabeled, Counter, Gauge } from '../../src/framework/metrics'
import { MetricsProvider } from '../../src/framework/modules/prometheus'

export class MockPrometheus implements Metrics {
  constructor(private readonly name: string, public readonly registry: jest.Mock<any>) {}

  asString(): string {
    return ''
  }

  counter(name: string, help: string): Unlabeled<Counter> {
    this.registry(this.name, name, 'counter', help)
    const labels = []
    const value: Counter = {
      inc: (...args) => this.registry(this.name, name, labels, ...args),
    }
    return {
      ...value,
      labels: (...values: string[]) => {
        labels.push(...values)
        return value
      },
    }
  }

  gauge(name: string, help: string): Unlabeled<Gauge> {
    this.registry(this.name, name, 'gauge', help)
    const labels = []
    const value: Gauge = {
      inc: (...args) => this.registry(this.name, name, labels, ...args),
      dec: (...args) => this.registry(this.name, name, labels, ...args),
      set: (...args) => this.registry(this.name, name, labels, ...args),
    }
    return {
      ...value,
      labels: (...values: string[]) => {
        labels.push(...values)
        return value
      },
    }
  }
}

export const mockPrometheusProvider: (registries: jest.Mock<any>) => MetricsProvider = (registries: jest.Mock<any>) => (name: string) =>
  new MockPrometheus(name, registries)
