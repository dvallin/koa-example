import * as User from '../src/users/user-mode'
import * as Database from '../src/postgres/postgres-mode'
import * as MockDatabase from './database/mock-database'

export interface Mode {
  database: Database.Mode
  user: User.Mode
}

export function testing(): Mode {
  const database = MockDatabase.testing()
  const user = User.production(database.postgres)
  return { database, user }
}
