import * as Log4Js from '../framework/modules/log4js'
import * as Postgres from '../framework/modules/postgres'
import * as Prometheus from '../framework/modules/prometheus'
import { Module, mergeExports } from '../framework'

export type Components = Log4Js.Components & Postgres.Components & Prometheus.Components

export function production(): Module<Components> {
  const logger = Log4Js.production()
  const postgres = Postgres.production()
  const prometheus = Prometheus.production()
  return {
    components: { ...logger.components, ...postgres.components, ...prometheus.components },
    exports: mergeExports(logger.exports, postgres.exports, prometheus.exports),
  }
}
