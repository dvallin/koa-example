import * as Log4Js from 'log4js'
import { RequestContext } from '..'

export interface LoggerProvider {
  (name: string): Logger
}
export interface Logger {
  error(message: string, context?: RequestContext): void
  warn(message: string, context?: RequestContext): void
  debug(message: string, context?: RequestContext): void
  trace(message: string, context?: RequestContext): void
}

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
