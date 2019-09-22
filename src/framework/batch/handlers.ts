import { Hook, Handler } from '..'

export type BatchHandler = Handler<'batch', Hook>

export function wrapBatchHandler(handler: Hook): BatchHandler {
  return { type: 'batch', handler, priority: 1 }
}
