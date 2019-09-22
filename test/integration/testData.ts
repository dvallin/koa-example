import { AppMode } from '../../src'

export function cleanDatabase(mode: AppMode): Promise<void> {
  return mode.components.io.postgres.performTransaction([{ text: `TRUNCATE TABLE koa_users;` }, { text: `TRUNCATE TABLE chat_messages;` }])
}
