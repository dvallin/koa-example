import { routes } from '../../src/users/user-routes'
import { build, startApp } from '../../src/server'

import * as request from 'supertest'
import { Server } from 'http'
import { testing } from '../test-mode'

describe('user controller', () => {
  let server: Server
  beforeEach(() => {
    const context = testing()
    context.user.repository.get = () => Promise.resolve('mocked user')
    server = startApp(build(routes(context.user.service)))
  })

  afterEach(() => {
    server.close()
  })

  it('responds', async () => {
    const response = await request(server).get('/users')
    expect(response.status).toEqual(200)
    expect(response.ok).toBeTruthy()
    expect(response.type).toEqual('text/plain')
    expect(response.text).toEqual('mocked user')
    expect(response.body).toEqual({})
  })
})
