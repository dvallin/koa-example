import { Postgres, createQuery, createPreparedQuery } from '../io/postgres'
import { QueryConfig } from 'pg'
import { Message } from '.'

export interface ChatMessageRepository {
  create(message: Message): Promise<void>
}

const TABLE_NAME = 'chat_messages'

export const migrations: QueryConfig[] = [
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
  constructor(private readonly postgres: Postgres) {}

  async create(message: Message): Promise<void> {
    const command = createPreparedQuery(commands, 'create-message', message.room, message.date, message.message)
    await this.postgres.performQuery(command)
  }
}
