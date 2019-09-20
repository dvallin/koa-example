import * as Koa from 'koa'
import { Logger } from '../io/logger'

export function errorHandler(logger: Logger) {
  return async (ctx: Koa.Context, next: () => Promise<{}>) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.details || err.msg || 'Internal Server Error'
      if (ctx.status === 500) {
        logger.error(err)
      }
    }
  }
}
