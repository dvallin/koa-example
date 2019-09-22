import * as Log4Js from '../framework/modules/log4js'
import * as Postgres from '../framework/modules/postgres'
import { Module, mergeExports } from '../framework'

export type Components = Log4Js.Components & Postgres.Components

export function production(): Module<Components> {
  const logger = Log4Js.production()
  const postgres = Postgres.production()
  return {
    components: { ...logger.components, ...postgres.components },
    exports: mergeExports(logger.exports, postgres.exports),
  }
}
