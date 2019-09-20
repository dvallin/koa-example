import { testManagementMode } from '../test-wrappers'
import * as request from 'supertest'
import { production } from '../../src'

describe('app', () => {
  testManagementMode(production, 'creates management endpoints', async server => {
    const response = await request(server).get('/instrumentation/health')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('OK')
    expect(response.body).toEqual({})
  })

  testManagementMode(production, 'creates management endpoints', async server => {
    const response = await request(server).get('/instrumentation/ready')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('OK')
    expect(response.body).toEqual({})
  })
})
