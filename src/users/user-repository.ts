import { Postgres } from '../postgres/postgres'
import { QueryConfig } from 'pg'

export interface UserRepository {
  get(id: string): Promise<string>
}

export const fetchUserCommand: QueryConfig = {
  name: 'fetch-user',
  text: 'SELECT name FROM user WHERE id = $1',
  values: [1],
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly postgres: Postgres) {}

  async get(id: string): Promise<string> {
    const result = await this.postgres.performQuery(fetchUserCommand, id)
    return result.rows[0] as string
  }
}
