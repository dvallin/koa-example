import { testing } from '../test-mode'
import { MockPostgres } from '../database/mock-database'
import { UserRepository, fetchUserCommand } from '../../src/users/user-repository'

describe('user repository', () => {
  let postgres: MockPostgres
  let repository: UserRepository

  beforeEach(() => {
    const context = testing()
    postgres = context.database.postgres as MockPostgres
    repository = context.user.repository
  })

  it('responds', async () => {
    postgres.backend.mockReturnValueOnce([{ name: 'mocked user name' }])

    const userName = await repository.get('id')

    expect(userName).toEqual('mocked user name')
    expect(postgres.backend).toHaveBeenCalledWith(fetchUserCommand, ['id'])
  })
})
