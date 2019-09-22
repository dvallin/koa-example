import { Middleware } from 'koa'
import { Socket, Server } from 'socket.io'
import { Handler } from '..'

export type ServiceHandler = Handler<'service', Middleware>

export function wrapKoaHandler(handler: Middleware, priority = 1): ServiceHandler {
  return { type: 'service', handler, priority }
}

export type SocketHandler = Handler<'socket.io', (server: Server, socket: Socket) => void>

export function wrapSocketHandler(handler: (server: Server, socket: Socket) => void, priority = 1): SocketHandler {
  return { type: 'socket.io', handler, priority }
}
