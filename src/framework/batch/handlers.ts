import { Hook } from '..'

export interface BatchHandler {
  type: 'batch'
  handler: Hook
}

export function wrapBatchHandler(handler: Hook): BatchHandler {
  return { type: 'batch', handler }
}
