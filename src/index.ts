import * as Users from './users'
import * as Chats from './chats'
import * as IO from './io'

import { Module, Mode, mergeExports } from './framework'
import { KoaHandlers } from './framework/service/runner'

export interface Components {
  io: IO.Components
  users: Users.Components
  chats: Chats.Components
}

export type AppMode = Mode<Components, KoaHandlers>

export function productionWithIo(io: Module<IO.Components>): AppMode {
  const users = Users.production(io.components)
  const chats = Chats.production(io.components)
  return {
    components: {
      io: io.components,
      users: users.components,
      chats: chats.components,
    },
    loggerProvider: io.components.loggerProvider,
    exports: mergeExports<KoaHandlers>(io.exports, users.exports, chats.exports),
  }
}

export function production(): AppMode {
  return productionWithIo(IO.production())
}
