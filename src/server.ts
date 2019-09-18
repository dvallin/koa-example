import * as Koa from 'koa'
import { Server } from 'http'
import { Mode } from './'

async function handleErrors(ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.details || err.msg || 'Internal Server Error'
    if (ctx.status === 500) {
      console.error(err)
    }
  }
}

export async function startMode(mode: Mode, port: number | undefined = undefined): Promise<Server> {
  await mode.exports.startup()
  await mode.io.postgres.performQueries(mode.exports.migrations)
  const server = await startApp(build(mode.exports.middlewares), port)
  server.on('close', mode.exports.shutdown)
  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0)
    })
  })
  return server
}

export function build(middlewares: Koa.Middleware[]): Koa {
  const app = new Koa()

  app.use(handleErrors)
  middlewares.forEach(m => app.use(m))

  return app
}

export function startApp(app: Koa, port: number | undefined = undefined): Server {
  return app.listen(port || process.env.SERVER_PORT)
}
