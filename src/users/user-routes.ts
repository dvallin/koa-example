import * as Router from 'koa-router'
import { UserService } from './user-service'
import { Middleware } from 'koa'

export function routes(service: UserService): Router {
  const router = new Router({ prefix: '/users' })

  router.get('/', async (ctx: Router.RouterContext, _next: Middleware) => {
    ctx.body = await service.get()
  })

  return router
}
