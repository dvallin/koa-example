import * as Koa from 'koa'
import * as Router from 'koa-joi-router'

export function instrumentation(ready: () => boolean): Koa.Middleware {
  const router = Router()
  router.get('/instrumentation/health', async (ctx, _next) => {
    ctx.status = 200
  })
  router.get('/instrumentation/ready', async (ctx, _next) => {
    ctx.status = ready() ? 200 : 500
  })
  return router.middleware()
}
