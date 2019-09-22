import { RequestContext } from './request-context'

export interface LoggerProvider {
  (name: string): Logger
}

export interface Logger {
  error(message: string, context?: RequestContext): void
  warn(message: string, context?: RequestContext): void
  debug(message: string, context?: RequestContext): void
  trace(message: string, context?: RequestContext): void
}

export class ConsoleLogger implements Logger {
  constructor(private readonly name: string) {}

  error(message: string, context?: RequestContext): void {
    console.error(this.name, message, context)
  }
  warn(message: string, context?: RequestContext): void {
    console.warn(this.name, message, context)
  }
  debug(message: string, context?: RequestContext): void {
    console.debug(this.name, message, context)
  }
  trace(message: string, context?: RequestContext): void {
    console.trace(this.name, message, context)
  }
}
