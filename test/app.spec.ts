import { startMode } from '../src/server'
import { testing } from './test-mode'
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
