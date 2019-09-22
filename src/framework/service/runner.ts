import { Server } from 'http'
import { ModeBase, NoneHandler } from '..'
import { instrumentation } from '../instrumentation/instrumentation-handler'
import { KoaHandler, SocketHandler } from './handlers'
import { registerSockets, startApp, build } from '../server'

export type KoaHandlers = KoaHandler | SocketHandler | NoneHandler

export async function runMode(
  mode: ModeBase<KoaHandlers>,
  port: number | undefined = undefined,
  instrumentationPort: number | undefined = undefined
): Promise<{ server: Server; instrumentationServer: Server }> {
  await mode.exports.startup()
  const koaHandlers = mode.exports.handlers.filter(h => h.type === 'koa') as KoaHandler[]
  const socketHandlers = mode.exports.handlers.filter(h => h.type === 'socket.io') as SocketHandler[]
  const server = startApp(build(koaHandlers, mode.loggerProvider), port)
  const instrumentationServer = startApp(build([instrumentation(mode.exports.ready)], mode.loggerProvider), instrumentationPort)
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
