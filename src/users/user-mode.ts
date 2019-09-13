import * as Router from 'koa-router'

import { UserRepository, UserRepositoryImpl } from './user-repository'
import { UserService, UserServiceImpl } from './user-service'
import { Postgres } from '../postgres/postgres'
import { routes } from './user-routes'

export interface Mode {
  repository: UserRepository
  service: UserService
  routes: Router
}

export function production(postgres: Postgres): Mode {
  const repository = new UserRepositoryImpl(postgres)
  const service = new UserServiceImpl(repository)
  return { repository, service, routes: routes(service) }
}
