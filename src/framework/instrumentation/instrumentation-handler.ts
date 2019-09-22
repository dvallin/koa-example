import * as Router from 'koa-router'
import { InstrumentationHandler, wrapInstrumentationHandler } from '..'
import { Metrics } from '../metrics'

export function instrumentation(ready: () => boolean, metrics: Metrics): InstrumentationHandler {
  const router = new Router()
  router.get('/instrumentation/health', async (ctx, _next) => {
    ctx.status = 200
  })
  router.get('/instrumentation/ready', async (ctx, _next) => {
    ctx.status = ready() ? 200 : 500
  })
  router.get('/instrumentation/metrics', async (ctx, _next) => {
    ctx.body = metrics.asString()
  })
  return wrapInstrumentationHandler(router.middleware())
}
