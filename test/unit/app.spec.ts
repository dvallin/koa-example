import { testing } from './test-mode'
import { MockPostgres } from './database/mock-database'
import { testMode } from '../test-wrappers'

describe('app', () => {
  testMode(testing, 'performs migrations', async (_server, mode) => {
    const postgres = mode.io.postgres as MockPostgres
    expect(postgres.performedQueries).toMatchSnapshot()
  })
})
