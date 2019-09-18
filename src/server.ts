import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as combineControllers from 'koa-combine-routers'
import { Server } from 'http'
import { Mode } from './'

async function handleErrors(ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500
    ctx.body = 'Internal Server Error'
  }
}

export async function startMode(mode: Mode, port: number | undefined = undefined): Promise<Server> {
  await mode.exports.startup()
  await mode.io.postgres.performQueries(mode.exports.migrations)
  const server = await startApp(build(mode.exports.routers), port)
  server.on('close', mode.exports.shutdown)
  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0)
    })
  })
  return server
}

export function build(routers: Router[]): Koa {
  const app = new Koa()
  const controllers = combineControllers(...routers)
  app.use(handleErrors)
  app.use(controllers())
  return app
}

export function startApp(app: Koa, port: number | undefined = undefined): Server {
  return app.listen(port || process.env.SERVER_PORT)
}
