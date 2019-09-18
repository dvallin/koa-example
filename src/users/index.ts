import * as IO from '../io'

import { UserRepository, UserRepositoryImpl, migrations } from './user-repository'
import { UserService, UserServiceImpl } from './user-service'
import { router } from './user-router'
import { Module } from '..'

export interface Components {
  repository: UserRepository
  service: UserService
}

export function production(io: IO.Components): Module<Components> {
  const repository = new UserRepositoryImpl(io.postgres)
  const service = new UserServiceImpl(repository)
  return { components: { repository, service }, exports: { routers: [router(service)], migrations: migrations } }
}
