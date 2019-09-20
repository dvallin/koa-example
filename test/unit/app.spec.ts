import { testing } from '../test-modes'
import { MockPostgres } from '../test-modes/mock-database'
import { testMode } from '../test-wrappers'

describe('app', () => {
  testMode(testing, 'performs migrations', async (_server, mode) => {
    const postgres = mode.io.postgres as MockPostgres
    expect(postgres.performedQueries).toMatchSnapshot()
  })
})
