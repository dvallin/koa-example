import { testing } from '../../test-modes'
import { MockPostgres } from '../../test-modes/mock-database'
import { UserRepository } from '../../../src/users/user-repository'

describe('user repository', () => {
  let postgres: MockPostgres
  let repository: UserRepository

  beforeEach(() => {
    const mode = testing()
    postgres = mode.components.io.postgres as MockPostgres
    repository = mode.components.users.repository
  })

  it('gets users', async () => {
    // given
    postgres.backend.mockReturnValueOnce([{ name: 'mocked user name', email: 'mocked email address' }])

    // when
    const user = await repository.get('id')({ id: 'some-tracking' })

    // then
    expect(user).toEqual({ name: 'mocked user name', email: 'mocked email address' })
    expect(postgres.backend).toHaveBeenCalledWith({
      name: 'fetch-user',
      text: 'SELECT email, name FROM koa_users WHERE email = $1',
      values: ['id'],
    })
  })

  it('creates users', async () => {
    // when
    await repository.create({ name: 'test-name', email: 'test-email' })({ id: 'some-tracking' })

    // then
    expect(postgres.backend).toHaveBeenCalledWith({
      name: 'create-user',
      text: 'INSERT INTO koa_users (email, name) VALUES ($1, $2);',
      values: ['test-email', 'test-name'],
    })
  })
})
