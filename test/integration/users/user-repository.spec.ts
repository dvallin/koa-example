import { testMode } from '../../test-wrappers'
import { production } from '../../../src'
import { cleanDatabase } from '../testData'

describe('user repository', () => {
  testMode(production, 'fetches a user', async (_server, mode) => {
    // given
    await mode.io.postgres.performQuery({ text: `INSERT INTO koa_users (email, name) VALUES ('some-user', 'John Doe');` })

    // when
    const user = await mode.users.repository.get('some-user')({ id: 'tracing-id' })

    // then
    expect(user).toEqual({ email: 'some-user', name: 'John Doe' })

    // after
    await cleanDatabase(mode)
  })

  testMode(production, 'creates a user', async (_server, mode) => {
    // when
    await mode.users.repository.create({ name: 'test-name', email: 'test-email' })({ id: 'tracing-id' })

    // then
    const result = await mode.io.postgres.performQuery<{ name: string; email: string }>({ text: `SELECT * FROM koa_users;` })
    expect(result.rowCount).toEqual(1)
    expect(result.rows[0]).toEqual({ name: 'test-name', email: 'test-email' })

    // after
    await cleanDatabase(mode)
  })
})
