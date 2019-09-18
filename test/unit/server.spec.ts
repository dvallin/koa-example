import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as request from 'supertest'

import { build } from '../../src/server'
import { testApp } from '../test-wrappers'

describe('server', () => {
  function exampleApp(): Koa {
    const router = new Router({})

    router.get('/succeeds', async (ctx, _next) => {
      ctx.body = 'success'
    })
    router.get('/throws', async (_ctx, _next) => {
      throw Error('something bad happened')
    })

    return build([router.middleware()])
  }

  testApp(exampleApp, 'succeeds', async server => {
    console.error = jest.fn()

    const response = await request(server).get('/succeeds')
    expect(response.status).toEqual(200)
    expect(response.text).toEqual('success')
    expect(console.error).not.toHaveBeenCalled()
  })

  testApp(exampleApp, 'throws', async server => {
    console.error = jest.fn()

    const response = await request(server).get('/throws')
    expect(response.status).toEqual(500)
    expect(response.text).toEqual('Internal Server Error')
    expect(console.error).toHaveBeenCalledWith(new Error('something bad happened'))
  })
})
