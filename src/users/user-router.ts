import * as Router from 'koa-joi-router'
import { UserService } from './user-service'
import { Middleware, Context } from 'koa'
import { User } from '.'
import { get, post } from '../framework/service/router-utils'
import { ServiceHandler, wrapKoaHandler } from '../framework/service/handlers'

const joi = Router.Joi
const email = joi
  .string()
  .email()
  .required()
const name = joi
  .string()
  .min(3)
  .required()
const getUserParameters = { email }
const createUserBody = { name, email }

export function router(service: UserService): ServiceHandler {
  const router = Router()

  router.route(
    get('/users/:email', getUserParameters, async (ctx, _next, params: { email: string }) => {
      ctx.body = await service.get(params.email)({ id: ctx.state.id })
    })
  )

  router.route(
    post('/users', createUserBody, async (ctx: Context, _next: Middleware, user: User) => {
      await service.create(user)({ id: ctx.state.id })
      ctx.status = 201
    })
  )

  return wrapKoaHandler(router.middleware())
}
