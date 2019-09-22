import * as Koa from 'koa'
import * as SocketIO from 'socket.io'
import { Server } from 'http'
import { SocketHandler } from './service/handlers'
import { Handler } from '.'
import { errorHandler } from './instrumentation/error-handler'
import { Logger } from './logger'

// koa request id is nearly impossible to require with import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requestId = require('koa-requestid')

export function startApp(app: Koa, port: number | undefined = undefined): Server {
  return app.listen(port || process.env.SERVER_PORT)
}

export function build(middlewares: Handler<unknown, Koa.Middleware>[], logger: Logger): Koa {
  const app = new Koa()

  app.use(requestId())
  app.use(errorHandler(logger))

  middlewares.sort(m => m.priority).forEach(m => app.use(m.handler))

  return app
}

export function registerSockets(server: Server, socketHandlers: SocketHandler[]): void {
  const io = SocketIO(server)
  socketHandlers.forEach(handler => io.on('connect', socket => handler.handler(io, socket)))
}
