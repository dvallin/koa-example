import * as Router from 'koa-joi-router'
import { Middleware, Context } from 'koa'
import * as joi from '@hapi/joi'

export function get<T>(
  path: string,
  params: joi.SchemaLike,
  handle: (ctx: Context, next: Middleware, params: T) => Promise<void>
): Router.Spec {
  return {
    method: 'get',
    path,
    validate: { params },
    handler: (ctx, next): Promise<void> => handle(ctx, next, ctx.params),
  }
}

export function post<T>(
  path: string,
  body: joi.SchemaLike,
  handle: (ctx: Context, next: Middleware, body: T) => Promise<void>
): Router.Spec {
  return {
    method: 'post',
    path,
    validate: {
      type: 'json',
      body,
    },
    handler: (ctx, next): Promise<void> => handle(ctx, next, ctx.request.body),
  }
}
