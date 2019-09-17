import * as Router from 'koa-router'
import { UserService } from './user-service'

export function router(service: UserService): Router {
  const router = new Router({ prefix: '/users-functional' })

  router.get('/', ctx => service.getSomeUserName(2).subscribe(userName => (ctx.body = userName)))

  return router
}
