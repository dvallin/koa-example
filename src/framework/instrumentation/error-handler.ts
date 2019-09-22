import { KoaHandler, wrapKoaHandler } from '../service/handlers'
import { Logger } from '../logger'

export function errorHandler(logger: Logger): KoaHandler {
  return wrapKoaHandler(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.details || err.msg || 'Internal Server Error'
      if (ctx.status === 500) {
        logger.error(err)
      }
    }
  })
}
