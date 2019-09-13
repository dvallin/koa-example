import * as User from './users/user-mode'
import * as Database from './postgres/postgres-mode'

export interface Mode {
  database: Database.Mode
  user: User.Mode
}

export function production(): Mode {
  const database = Database.production()
  const user = User.production(database.postgres)
  return { database, user }
}
