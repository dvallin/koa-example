import { build, startApp, startMode } from '../src/server'

import * as request from 'supertest'
import { Server } from 'http'
import { testing } from './test-mode'
import { Mode } from '../src/mode'
import { MockPostgres } from './database/mock-database'

describe('app', () => {
  let postgres: MockPostgres
  beforeEach(async () => {
    const mode = testing()
    postgres = mode.database.postgres as MockPostgres
    await startMode(mode)
  })

  it('runs migrations', async () => {
    expect(postgres.migrations).toMatchSnapshot()
  })
})
