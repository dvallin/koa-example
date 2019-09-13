import { startMode } from '../src/server'
import { testing } from './test-mode'
import { MockPostgres } from './database/mock-database'
import { Server } from 'http'

import * as request from 'supertest'

describe('app', () => {
  let postgres: MockPostgres
  let server: Server
  beforeEach(async () => {
    const mode = testing()
    postgres = mode.database.postgres as MockPostgres
    server = await startMode(mode)
  })

  it('returns user name', async () => {
    postgres.backend.mockReturnValue([{ name: 'mock user name' }])

    const response = await request(server).get('/users')
    expect(response.status).toEqual(200)
    expect(response.text).toEqual('mock user name')
  })

  it('runs migrations', async () => {
    expect(postgres.migrations).toMatchSnapshot()
  })
})
