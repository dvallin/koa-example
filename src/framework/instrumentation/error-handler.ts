import { Logger } from '../logger'
import { Middleware } from 'koa'

export function errorHandler(logger: Logger): Middleware {
  return async (ctx, next) => {
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
