import { testing } from '../test-modes'
import { MockPostgres } from '../test-modes/mock-database'
import { testMode, testManagementMode } from '../test-runners'
import * as request from 'supertest'

describe('app', () => {
  testMode(testing, 'registers migrations', async (_server, mode) => {
    const postgres = mode.components.io.postgres as MockPostgres
    expect(postgres.migrations).toMatchSnapshot()
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
    const postgres = mode.components.io.postgres as MockPostgres
    postgres.isConnected = false

    const response = await request(server).get('/instrumentation/ready')

    expect(response.status).toBe(500)
    expect(response.text).toEqual('Internal Server Error')
    expect(response.body).toEqual({})
  })
})
