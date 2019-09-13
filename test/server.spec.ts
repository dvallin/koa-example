import { build, startApp } from '../src/server'

import * as Router from 'koa-router'
import * as request from 'supertest'
import { Server } from 'http'

describe('server', () => {
  let server: Server
  beforeEach(() => {
    const router = new Router({})

    router.get('/succeeds', async (ctx, _next) => {
      ctx.body = 'success'
    })
    router.get('/throws', async (_ctx, _next) => {
      throw Error('something bad happened')
    })

    server = startApp(build(router))
  })

  it('succeeds', async () => {
    console.error = jest.fn()

    const response = await request(server).get('/succeeds')
    expect(response.status).toEqual(200)
    expect(response.text).toEqual('success')
    expect(console.error).not.toHaveBeenCalled()
  })

  it('throwing', async () => {
    console.error = jest.fn()

    const response = await request(server).get('/throws')
    expect(response.status).toEqual(500)
    expect(response.text).toEqual('Internal Server Error')
    expect(console.error).toHaveBeenCalledWith(new Error('something bad happened'))
  })
})
