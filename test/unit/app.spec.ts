import { testing } from '../test-modes'
import { MockPostgres } from '../test-modes/mock-database'
import { testMode, testManagementMode } from '../test-wrappers'
import * as request from 'supertest'

describe('app', () => {
  testMode(testing, 'performs migrations', async (_server, mode) => {
    const postgres = mode.io.postgres as MockPostgres
    expect(postgres.performedQueries).toMatchSnapshot()
  })

  testManagementMode(testing, 'creates management endpoints', async server => {
    const response = await request(server).get('/management/health')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('OK')
    expect(response.body).toEqual({})
  })
})
