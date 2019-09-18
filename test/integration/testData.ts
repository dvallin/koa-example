import { Mode } from '../../src'

export function cleanDatabase(mode: Mode): Promise<void> {
  return mode.io.postgres.performTransaction([{ text: `TRUNCATE TABLE koa_users;` }, { text: `TRUNCATE TABLE chat_messages;` }])
}
