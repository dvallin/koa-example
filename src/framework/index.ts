import { pluck } from './array-utils'
import { LoggerProvider } from './logger'

export type Hook = () => Promise<void>

export interface ModuleExports<T> {
  startup: Hook
  shutdown: Hook

  handlers: T[]

  ready: () => boolean
}

export interface NoneHandler {
  type: 'none'
  handler: () => never
}

export interface Module<T, H = NoneHandler> {
  components: T
  exports: Partial<ModuleExports<H>>
}

export type Mode<T, H> = ModeBase<H> & { components: T }

export interface ModeBase<H> {
  loggerProvider: LoggerProvider
  exports: ModuleExports<H>
}

async function callHooks(hooks: Hook[]): Promise<void> {
  await Promise.all(hooks.map(hook => hook()))
}

export function mergeExports<T>(...moduleExports: Partial<ModuleExports<T>>[]): ModuleExports<T> {
  const startup = (): Promise<void> => callHooks(pluck(moduleExports, 'startup'))
  const shutdown = (): Promise<void> => callHooks(pluck(moduleExports, 'shutdown'))
  const handlers = [].concat(...pluck(moduleExports, 'handlers'))
  const ready = () => pluck(moduleExports, 'ready').every(ready => ready())
  return { startup, shutdown, handlers, ready }
}
