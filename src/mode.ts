import * as Router from 'koa-router'
import * as IO from './io/mode'

import { Query } from './io/postgres'

import * as User from './users/user-mode'
import { migrations as userMigrations } from './users/user-repository'

export interface Mode {
  io: IO.Mode
  user: User.Mode

  routers: Router[]
  migrations: Query[]
}

export function production(): Mode {
  const io = IO.production()
  const user = User.production(io)
  return { io, user: user.mode, routers: [user.router], migrations: [...userMigrations] }
}
