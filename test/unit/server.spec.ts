import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as request from 'supertest'

import { build } from '../../src/server'
import { testApp } from '../test-wrappers'
import { mockLogProvider } from '../test-modes/mock-logger'
import { getCallArgument } from '../jest-utils'

describe('server', () => {
  const logSink = jest.fn()

  function exampleApp(): Koa {
    const router = new Router({})
    const logProvider = mockLogProvider(logSink)

    router.get('/succeeds', async (ctx, _next) => {
      ctx.body = 'success'
    })
    router.get('/throws', async (_ctx, _next) => {
      throw Error('something bad happened')
    })
    router.get('/log-context', async (ctx, _next) => {
      logProvider('log-request').trace(JSON.stringify(ctx.state))
    })

    return build([router.middleware()], logProvider)
  }

  testApp(exampleApp, 'succeeds', async server => {
    const response = await request(server).get('/succeeds')

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('success')
    expect(logSink).not.toHaveBeenCalled()
  })

  testApp(exampleApp, 'throws', async server => {
    const response = await request(server).get('/throws')

    expect(response.status).toEqual(500)
    expect(response.text).toEqual('Internal Server Error')
    expect(logSink).toHaveBeenCalledWith('MainErrorHandler', 'error', new Error('something bad happened'), undefined)
  })

  testApp(exampleApp, 'creates request id', async server => {
    await request(server).get('/log-context')

    const message = getCallArgument<string>(logSink, 0, 2)
    expect(JSON.parse(message).id).not.toHaveLength(0)
  })
})
