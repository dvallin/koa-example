import { pluck } from './array-utils'
import { LoggerProvider } from './logger'
import { Middleware } from 'koa'
import { Metrics } from './metrics'

export type Hook = () => Promise<void>

export interface ModuleExports<T> {
  startup: Hook
  shutdown: Hook

  handlers: T[]

  ready: () => boolean
  metrics: Metrics
}

export interface Handler<T, H> {
  type: T
  handler: H
  priority: number
}

export type NoneHandler = Handler<'none', () => never>

export type InstrumentationHandler = Handler<'instrumentation', Middleware>

export function wrapInstrumentationHandler(handler: Middleware): InstrumentationHandler {
  return { type: 'instrumentation', handler, priority: 0 }
}

export type DefaultHandlers = NoneHandler | InstrumentationHandler

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
  // TODO: better mechanism here!
  const metrics = pluck(moduleExports, 'metrics')[0]
  return { startup, shutdown, handlers, ready, metrics }
}
