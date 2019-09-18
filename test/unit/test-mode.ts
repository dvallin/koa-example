import * as Users from '../../src/users'
import * as Chats from '../../src/chats'
import * as MockDatabase from './database/mock-database'

import { Mode, mergeExports } from '../../src'

export function testing(): Mode {
  const io = MockDatabase.testing()
  const users = Users.production(io.components)
  const chats = Chats.production(io.components)
  return {
    io: io.components,
    users: users.components,
    chats: chats.components,
    exports: mergeExports(io.exports, users.exports, chats.exports),
  }
}
