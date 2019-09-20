import { testing } from '../test-modes'
import { MockPostgres } from '../test-modes/mock-database'
import { testMode, testManagementMode } from '../test-wrappers'
import * as request from 'supertest'

describe('app', () => {
  testMode(testing, 'performs migrations', async (_server, mode) => {
    const postgres = mode.io.postgres as MockPostgres
    expect(postgres.performedQueries).toMatchSnapshot()
  })

  testManagementMode(testing, 'becomes healthy', async server => {
    const response = await request(server).get('/instrumentation/health')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('OK')
    expect(response.body).toEqual({})
  })

  testManagementMode(testing, 'becomes ready', async server => {
    const response = await request(server).get('/instrumentation/ready')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('OK')
    expect(response.body).toEqual({})
  })

  testManagementMode(testing, 'becomes unready if postgres is disconnected', async (server, mode) => {
    const postgres = mode.io.postgres as MockPostgres
    postgres.isConnected = false

    const response = await request(server).get('/instrumentation/ready')

    expect(response.status).toBe(500)
    expect(response.text).toEqual('Internal Server Error')
    expect(response.body).toEqual({})
  })
})
