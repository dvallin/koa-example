import * as Router from 'koa-router'
import * as Prometheus from 'prom-client'
import { Module, InstrumentationHandler, wrapInstrumentationHandler, NoneHandler } from '..'
import { Metrics, Counter, Gauge, Unlabeled } from '../metrics'

export class PrometheusMetrics implements Metrics {
  constructor(private readonly registry: Prometheus.Registry, private readonly prefix?: string) {}

  public counter(name: string, help: string): Unlabeled<Counter> {
    return new Prometheus.Counter({ name: this.prefixName(name), help, registers: [this.registry] })
  }

  public gauge(name: string, help: string): Unlabeled<Gauge> {
    return new Prometheus.Gauge({ name: this.prefixName(name), help, registers: [this.registry] })
  }

  private prefixName(name: string): string {
    if (this.prefix) {
      return this.prefix + '_' + name
    }
    return name
  }

  public asString(): string {
    return this.registry.metrics()
  }
}

export type MetricsProvider = (name: string) => Metrics

export interface Components {
  metrics: MetricsProvider
}

export function metrics(): InstrumentationHandler {
  const router = new Router()
  return wrapInstrumentationHandler(router.middleware())
}

export function production(registry: Prometheus.Registry = new Prometheus.Registry()): Module<Components, NoneHandler> {
  Prometheus.collectDefaultMetrics({ register: registry })

  return {
    components: { metrics: name => new PrometheusMetrics(registry, name) },
    exports: {
      metrics: new PrometheusMetrics(registry),
    },
  }
}
