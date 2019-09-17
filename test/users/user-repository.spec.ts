import { testing } from '../test-mode'
import { MockPostgres } from '../database/mock-database'
import { fetchUserCommand, fetchUserFromDb } from '../../src/users/user-repository'
import { Mode } from '../../src/mode'

describe('user repository', () => {
  let mode: Mode
  let postgres: MockPostgres

  beforeEach(() => {
    mode = testing()
    postgres = mode.io.postgres as MockPostgres
  })

  it('responds', async () => {
    postgres.backend.mockReturnValueOnce([{ name: 'mocked user name' }])

    const userName = await fetchUserFromDb(mode.io, 'email').toPromise()

    expect(userName).toEqual('mocked user name')
    expect(postgres.backend).toHaveBeenCalledWith(fetchUserCommand, ['id'])
  })
})
