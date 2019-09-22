import { RequestContext } from '../../src/framework/request-context'
import { Logger, LoggerProvider } from '../../src/framework/logger'

export class MockLogger implements Logger {
  constructor(private readonly name: string, public readonly logSink: jest.Mock<any, any>) {}

  error(message: string, traceId?: RequestContext): void {
    this.logSink(this.name, 'error', message, traceId)
  }
  warn(message: string, traceId?: RequestContext): void {
    this.logSink(this.name, 'warn', message, traceId)
  }
  debug(message: string, traceId?: RequestContext): void {
    this.logSink(this.name, 'debug', message, traceId)
  }
  trace(message: string, traceId?: RequestContext): void {
    this.logSink(this.name, 'trace', message, traceId)
  }
}

export const mockLogProvider: (logSink: jest.Mock<any, any>) => LoggerProvider = (logSink: jest.Mock<any, any>) => (name: string) =>
  new MockLogger(name, logSink)
