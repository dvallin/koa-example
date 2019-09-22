import * as Log4Js from 'log4js'
import { RequestContext } from '../request-context'
import { LoggerProvider } from '../logger'
import { Module } from '..'

function format(message: string, context: RequestContext | undefined): string {
  const relevantContext: Partial<{ id: string }> = context || {}
  return `[${relevantContext.id || 'unkown'}] ${message}`
}

export class Log4JsLogger {
  constructor(private readonly logger: Log4Js.Logger) {}

  error(message: string, context?: RequestContext): void {
    this.logger.error(format(message, context))
  }
  warn(message: string, context?: RequestContext): void {
    this.logger.warn(format(message, context))
  }
  debug(message: string, context?: RequestContext): void {
    this.logger.debug(format(message, context))
  }
  trace(message: string, context?: RequestContext): void {
    this.logger.trace(format(message, context))
  }
}

export function ofLog4Js(log4Js: Log4Js.Log4js): LoggerProvider {
  return name => {
    return new Log4JsLogger(log4Js.getLogger(name))
  }
}

export interface Components {
  loggerProvider: LoggerProvider
}

export function production(): Module<Components> {
  const log4Js = Log4Js.configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } },
  })

  return {
    components: { loggerProvider: ofLog4Js(log4Js) },
    exports: {},
  }
}
