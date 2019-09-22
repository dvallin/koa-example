import { ModeBase, NoneHandler } from '..'
import { BatchHandler } from './handlers'
import { startApp, build } from '../server'
import { instrumentation } from '../instrumentation/instrumentation-handler'

export type BatchHandlers = BatchHandler | NoneHandler

export async function runMode(mode: ModeBase<BatchHandlers>, instrumentationPort: number | undefined = undefined): Promise<void> {
  await mode.exports.startup()
  const instrumentationServer = startApp(build([instrumentation(mode.exports.ready)], mode.loggerProvider), instrumentationPort)
  instrumentationServer.on('close', mode.exports.shutdown)
  process.on('SIGTERM', () => {
    instrumentationServer.close(() => {
      process.exit(0)
    })
  })
  mode.exports.handlers.forEach(async handler => await handler.handler())
  await mode.exports.shutdown()
}
