import * as User from './users'
import * as IO from './io'
import * as Router from 'koa-router'
import { pluck } from './array-utils'
import { QueryConfig } from 'pg'

export type Hook = () => Promise<void>

export interface ModuleExports {
  startup: Hook
  shutdown: Hook

  routers: Router[]
  migrations: QueryConfig[]
}

export interface Module<T> {
  components: T
  exports: Partial<ModuleExports>
}

export interface Mode {
  io: IO.Components
  user: User.Components

  exports: ModuleExports
}

export function production(): Mode {
  const io = IO.production()
  const user = User.production(io.components)
  return { io: io.components, user: user.components, exports: mergeExports(io.exports, user.exports) }
}

async function callHooks(hooks: Hook[]): Promise<void> {
  await Promise.all(hooks.map(hook => hook()))
}

export function mergeExports(...moduleExports: Partial<ModuleExports>[]): ModuleExports {
  const startup = () => callHooks(pluck(moduleExports, 'startup'))
  const shutdown = () => callHooks(pluck(moduleExports, 'shutdown'))
  const migrations = [].concat(...pluck(moduleExports, 'migrations'))
  const routers = [].concat(...pluck(moduleExports, 'routers'))
  return { startup, shutdown, migrations, routers }
}
