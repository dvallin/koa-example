import { Middleware } from 'koa'
import { Socket, Server } from 'socket.io'

export interface KoaHandler {
  type: 'koa'
  handler: Middleware
}

export function wrapKoaHandler(handler: Middleware): KoaHandler {
  return { type: 'koa', handler }
}

export interface SocketHandler {
  type: 'socket.io'
  handler: (server: Server, socket: Socket) => void
}

export function wrapSocketHandler(handler: (server: Server, socket: Socket) => void): SocketHandler {
  return { type: 'socket.io', handler }
}
