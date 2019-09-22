// koa request id is nearly impossible to require with import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requestId = require('koa-requestid')

import * as Koa from 'koa'
import * as SocketIO from 'socket.io'
import { errorHandler } from './instrumentation/error-handler'
import { LoggerProvider } from './logger'
import { Server } from 'http'
import { SocketHandler, KoaHandler } from './service/handlers'

export function startApp(app: Koa, port: number | undefined = undefined): Server {
  return app.listen(port || process.env.SERVER_PORT)
}

export function build(middlewares: KoaHandler[], loggerProvider: LoggerProvider): Koa {
  const app = new Koa()

  app.use(requestId())
  app.use(errorHandler(loggerProvider('MainErrorHandler')).handler)
  middlewares.forEach(m => app.use(m.handler))

  return app
}

export function registerSockets(server: Server, socketHandlers: SocketHandler[]): void {
  const io = SocketIO(server)
  socketHandlers.forEach(handler => io.on('connect', socket => handler.handler(io, socket)))
}
