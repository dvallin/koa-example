import { Server } from 'http'
import { ModeBase, InstrumentationHandler, DefaultHandlers } from '..'
import { instrumentation } from '../instrumentation/instrumentation-handler'
import { ServiceHandler, SocketHandler } from './handlers'
import { registerSockets, startApp, build } from '../server'

export type KoaHandlers = ServiceHandler | SocketHandler | DefaultHandlers

export async function runMode(
  mode: ModeBase<KoaHandlers>,
  port: number | undefined = undefined,
  instrumentationPort: number | undefined = undefined
): Promise<{ server: Server; instrumentationServer: Server }> {
  const logger = mode.loggerProvider('Main')

  const serviceHandlers = mode.exports.handlers.filter(h => h.type === 'service') as ServiceHandler[]
  const socketHandlers = mode.exports.handlers.filter(h => h.type === 'socket.io') as SocketHandler[]
  const instrumentationHandlers = mode.exports.handlers.filter(h => h.type === 'instrumentation') as InstrumentationHandler[]

  await mode.exports.startup()
  const server = startApp(build(serviceHandlers, logger), port)
  const instrumentationServer = startApp(
    build([...instrumentationHandlers, instrumentation(mode.exports.ready, mode.exports.metrics)], logger),
    instrumentationPort
  )
  server.on('close', mode.exports.shutdown)
  process.on('SIGTERM', () => {
    instrumentationServer.close(() => {
      server.close(() => {
        process.exit(0)
      })
    })
  })
  registerSockets(server, socketHandlers)
  return { server, instrumentationServer }
}
