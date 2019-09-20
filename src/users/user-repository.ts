import { Postgres, createQuery, createPreparedQuery } from '../io/postgres'
import { QueryConfig } from 'pg'
import { User } from '.'
import { ContextReader } from '..'
import { LoggerProvider, Logger } from '../io/logger'

export interface UserRepository {
  get(email: string): ContextReader<User>
  create(user: User): ContextReader<void>
}

const TABLE_NAME = 'koa_users'

export const migrations: QueryConfig[] = [
  `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        email  VARCHAR(45) PRIMARY KEY,
        name   VARCHAR(45)
      );`,
].map(text => createQuery(text))

const commands = {
  'fetch-user': `SELECT email, name FROM ${TABLE_NAME} WHERE email = $1`,
  'create-user': `INSERT INTO ${TABLE_NAME} (email, name) VALUES ($1, $2);`,
}

export class UserRepositoryImpl implements UserRepository {
  private readonly logger: Logger

  constructor(private readonly postgres: Postgres, loggerProvider: LoggerProvider) {
    this.logger = loggerProvider('UserRepositoryImpl')
  }

  get(email: string): ContextReader<User> {
    return async context => {
      this.logger.trace('fetched user', context)
      const command = createPreparedQuery(commands, 'fetch-user', email)
      const result = await this.postgres.performQuery<User>(command)
      return result.rows[0]
    }
  }

  create(user: User): ContextReader<void> {
    return async context => {
      this.logger.trace('fetched user', context)
      const command = createPreparedQuery(commands, 'create-user', user.email, user.name)
      await this.postgres.performQuery(command)
    }
  }
}
