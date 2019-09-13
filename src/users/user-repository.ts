import { Postgres, Query } from '../postgres/postgres'
import { QueryConfig } from 'pg'

export interface UserRepository {
  get(email: string): Promise<string>
}

const TABLE_NAME = 'koa_users'

export const migrations: Query[] = [
  {
    config: {
      name: 'create-user-table',
      text: `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        email  VARCHAR(45) PRIMARY KEY,
        name   VARCHAR(45)
      );`,
    },
  },
]

export const fetchUserCommand: QueryConfig = {
  name: 'fetch-user',
  text: `SELECT name FROM ${TABLE_NAME} WHERE email = $1`,
  values: [1],
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly postgres: Postgres) {
    this.postgres.registerMigrations(...migrations)
  }

  async get(email: string): Promise<string> {
    const result = await this.postgres.performQuery<{ name: string }>({ config: fetchUserCommand, values: [email] })
    return result.rows[0].name
  }
}
