import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as combineRouters from 'koa-combine-routers'
import koaRx from 'koa-rx'
import { Server } from 'http'
import { Mode } from './mode'

async function handleErrors(ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500
    ctx.body = 'Internal Server Error'
  }
}

export function build(...routers: Router[]): Koa {
  const app = new Koa()
  const router = combineRouters(...routers)
  app.use(handleErrors)
  app.use(koaRx())
  app.use(router())
  return app
}

export async function startMode(mode: Mode, port: number | undefined = undefined): Promise<Server> {
  await mode.io.postgres.performQueries(...mode.migrations)
  return startApp(build(...mode.routers), port)
}

export function startApp(app: Koa, port: number | undefined = undefined): Server {
  return app.listen(port || process.env.SERVER_PORT)
}
