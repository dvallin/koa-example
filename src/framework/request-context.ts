import { AsyncReader } from './async-reader'

export interface RequestContext {
  id: string
}

export type ContextReader<T> = AsyncReader<RequestContext, T>
