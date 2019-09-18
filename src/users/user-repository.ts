import { Postgres, createQuery, createPreparedQuery } from '../io/postgres'
import { QueryConfig } from 'pg'
import { User } from '.'

export interface UserRepository {
  get(email: string): Promise<string>
  create(user: User): Promise<void>
}

const TABLE_NAME = 'koa_users'

export const migrations: QueryConfig[] = [
  `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        email  VARCHAR(45) PRIMARY KEY,
        name   VARCHAR(45)
      );`,
].map(text => createQuery(text))

const commands = {
  'fetch-user': `SELECT name FROM ${TABLE_NAME} WHERE email = $1`,
  'create-user': `INSERT INTO ${TABLE_NAME} (email, name) VALUES ($1, $2);`,
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly postgres: Postgres) {}

  async get(email: string): Promise<string> {
    const command = createPreparedQuery(commands, 'fetch-user', email)
    const result = await this.postgres.performQuery<{ name: string }>(command)
    return result.rows[0].name
  }

  async create(user: User): Promise<void> {
    const command = createPreparedQuery(commands, 'create-user', user.email, user.name)
    await this.postgres.performQuery(command)
  }
}
