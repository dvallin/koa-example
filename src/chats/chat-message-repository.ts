import { Postgres, createQuery, createPreparedQuery } from '../framework/modules/postgres'
import { ContextReader } from '../framework/request-context'
import { LoggerProvider, Logger } from '../framework/logger'

import { QueryConfig } from 'pg'
import { Message } from '.'

export interface ChatMessageRepository {
  create(message: Message): ContextReader<void>
}

const TABLE_NAME = 'chat_messages'

const migrations: QueryConfig[] = [
  `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        room  VARCHAR(45),
        date  TIMESTAMP,
        message   TEXT,
        PRIMARY KEY(room, date)
      );`,
].map(text => createQuery(text))

const commands = {
  'create-message': `INSERT INTO ${TABLE_NAME} (room, date, message) VALUES ($1, $2, $3);`,
}

export class ChatMessageRepositoryImpl implements ChatMessageRepository {
  private logger: Logger

  constructor(private readonly postgres: Postgres, loggerProvider: LoggerProvider) {
    this.logger = loggerProvider('ChatMessageRepositoryImpl')
    postgres.registerMigrations(migrations)
  }

  create(message: Message): ContextReader<void> {
    return async context => {
      const command = createPreparedQuery(commands, 'create-message', message.room, message.date, message.message)
      this.logger.trace('wrote message to db', context)
      await this.postgres.performQuery(command)
    }
  }
}
