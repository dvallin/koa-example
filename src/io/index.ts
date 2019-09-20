import { Postgres, NonBlockingPostgres } from './postgres'
import { Pool } from 'pg'
import { Module } from '..'
import { LoggerProvider, ofLog4Js } from './logger'
import * as Log4Js from 'log4js'

export interface Components {
  postgres: Postgres
  loggerProvider: LoggerProvider
}

export function production(): Module<Components> {
  const pool = new Pool()

  const log4Js = Log4Js.configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } },
  })

  return {
    components: { postgres: new NonBlockingPostgres(pool), loggerProvider: ofLog4Js(log4Js) },
    exports: {
      shutdown: (): Promise<void> => pool.end(),
    },
  }
}
