import * as request from 'supertest'
import { testing } from '../test-mode'
import { testMode } from '../../test-wrappers'

describe('user controller', () => {
  testMode(testing, 'responds', async (server, mode) => {
    // given
    mode.user.repository.get = () => Promise.resolve('mocked user')

    // when
    const response = await request(server).get('/users')

    // then
    expect(response.status).toEqual(200)
    expect(response.ok).toBeTruthy()
    expect(response.type).toEqual('text/plain')
    expect(response.text).toEqual('mocked user')
    expect(response.body).toEqual({})
  })
})
