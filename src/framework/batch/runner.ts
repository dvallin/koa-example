import { ModeBase, DefaultHandlers } from '..'
import { BatchHandler } from './handlers'
import { startApp, build } from '../server'
import { instrumentation } from '../instrumentation/instrumentation-handler'

export type BatchHandlers = BatchHandler | DefaultHandlers

export async function runMode(mode: ModeBase<BatchHandlers>, instrumentationPort: number | undefined = undefined): Promise<void> {
  const logger = mode.loggerProvider('Main')
  const batchHandlers = mode.exports.handlers.filter(f => f.type === 'batch') as BatchHandler[]
  const instrumentationHandlers = mode.exports.handlers.filter(f => f.type === 'instrumentation') as BatchHandler[]
  await mode.exports.startup()
  const instrumentationServer = startApp(
    build([...instrumentationHandlers, instrumentation(mode.exports.ready, mode.exports.metrics)], logger),
    instrumentationPort
  )
  instrumentationServer.on('close', mode.exports.shutdown)
  process.on('SIGTERM', () => {
    instrumentationServer.close(() => {
      process.exit(0)
    })
  })
  batchHandlers.forEach(async handler => await handler.handler())
  await mode.exports.shutdown()
}
