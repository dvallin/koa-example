import * as Router from 'koa-router'
import { KoaHandler, wrapKoaHandler } from '../service/handlers'

export function instrumentation(ready: () => boolean): KoaHandler {
  const router = new Router()
  router.get('/instrumentation/health', async (ctx, _next) => {
    ctx.status = 200
  })
  router.get('/instrumentation/ready', async (ctx, _next) => {
    ctx.status = ready() ? 200 : 500
  })
  return wrapKoaHandler(router.middleware())
}
