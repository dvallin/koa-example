import { testMode } from '../../test-wrappers'
import { production } from '../../../src'

describe('user repository', () => {
  testMode(production, 'fetches a user', async (_server, mode) => {
    // given
    await mode.io.postgres.performQuery({ text: `INSERT INTO koa_users (email, name) VALUES ('some-user', 'John Doe');` })

    // when
    const userName = await mode.user.repository.get('some-user')

    // then
    expect(userName).toEqual('John Doe')

    // after
    await mode.io.postgres.performQuery({ text: `DROP TABLE koa_users;` })
  })

  testMode(production, 'creates a user', async (_server, mode) => {
    // when
    await mode.user.repository.create({ name: 'test-name', email: 'test-email' })

    // then
    const result = await mode.io.postgres.performQuery<{ name: string; email: string }>({ text: `SELECT * FROM koa_users;` })
    expect(result.rowCount).toEqual(1)
    expect(result.rows[0]).toEqual({ name: 'test-name', email: 'test-email' })
  })
})
