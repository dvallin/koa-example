import { testing } from '../test-mode'
import { MockPostgres } from '../database/mock-database'
import { UserRepository } from '../../../src/users/user-repository'

describe('user repository', () => {
  let postgres: MockPostgres
  let repository: UserRepository

  beforeEach(() => {
    const context = testing()
    postgres = context.io.postgres as MockPostgres
    repository = context.user.repository
  })

  it('gets users', async () => {
    // given
    postgres.backend.mockReturnValueOnce([{ name: 'mocked user name' }])

    // when
    const userName = await repository.get('id')

    // then
    expect(userName).toEqual('mocked user name')
    expect(postgres.backend).toHaveBeenCalledWith({
      name: 'fetch-user',
      text: 'SELECT name FROM koa_users WHERE email = $1',
      values: ['id'],
    })
  })
  it('creates users', async () => {
    // when
    await repository.create({ name: 'test-name', email: 'test-email' })

    // then
    expect(postgres.backend).toHaveBeenCalledWith({
      name: 'create-user',
      text: 'INSERT INTO koa_users (email, name) VALUES ($1, $2);',
      values: ['test-email', 'test-name'],
    })
  })
})
