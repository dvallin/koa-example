import { Metrics, Gauge } from '../framework/metrics'

export class ChatMetrics {
  public readonly openSockets: Gauge

  constructor(metrics: Metrics) {
    this.openSockets = metrics.gauge('openSockets', 'open sockets')
  }
}
