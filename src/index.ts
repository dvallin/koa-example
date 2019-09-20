import * as Users from './users'
import * as Chats from './chats'
import * as IO from './io'
import { pluck } from './array-utils'
import { QueryConfig } from 'pg'
import { Middleware } from 'koa'
import { Socket, Server } from 'socket.io'
import { AsyncReader } from './async-reader'

export type Hook = () => Promise<void>
export type SocketHandler = (server: Server, socket: Socket) => void

export interface RequestContext {
  id: string
}

export type ContextReader<T> = AsyncReader<RequestContext, T>

export interface ModuleExports {
  startup: Hook
  shutdown: Hook

  middlewares: Middleware[]
  migrations: QueryConfig[]
  socketHandlers: SocketHandler[]
}

export interface Module<T> {
  components: T
  exports: Partial<ModuleExports>
}

export interface Mode {
  io: IO.Components
  users: Users.Components
  chats: Chats.Components

  exports: ModuleExports
}

async function callHooks(hooks: Hook[]): Promise<void> {
  await Promise.all(hooks.map(hook => hook()))
}

export function mergeExports(...moduleExports: Partial<ModuleExports>[]): ModuleExports {
  const startup = (): Promise<void> => callHooks(pluck(moduleExports, 'startup'))
  const shutdown = (): Promise<void> => callHooks(pluck(moduleExports, 'shutdown'))
  const migrations = [].concat(...pluck(moduleExports, 'migrations'))
  const middlewares = [].concat(...pluck(moduleExports, 'middlewares'))
  const socketHandlers = [].concat(...pluck(moduleExports, 'socketHandlers'))
  return { startup, shutdown, migrations, middlewares, socketHandlers }
}

export function productionWithIo(io: Module<IO.Components>): Mode {
  const users = Users.production(io.components)
  const chats = Chats.production(io.components)
  return {
    io: io.components,
    users: users.components,
    chats: chats.components,
    exports: mergeExports(io.exports, users.exports, chats.exports),
  }
}

export function production(): Mode {
  return productionWithIo(IO.production())
}
