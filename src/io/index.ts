import { Postgres, NonBlockingPostgres } from './postgres'
import { Module } from '..'
import { LoggerProvider, ofLog4Js } from './logger'
import * as Log4Js from 'log4js'

export interface Components {
  postgres: Postgres
  loggerProvider: LoggerProvider
}

export function production(): Module<Components> {
  const log4Js = Log4Js.configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } },
  })

  const postgres = new NonBlockingPostgres()

  return {
    components: { postgres, loggerProvider: ofLog4Js(log4Js) },
    exports: {
      shutdown: (): Promise<void> => postgres.disconnect(),
      ready: () => postgres.isConnected,
    },
  }
}
