import * as Koa from 'koa'
import * as Router from 'koa-joi-router'

export function management(): Koa.Middleware {
  const router = Router()
  router.get('/management/health', async (ctx, _next) => {
    ctx.status = 200
  })
  router.get('/management/ready', async (ctx, _next) => {
    ctx.status = 200
  })
  return router.middleware()
}
