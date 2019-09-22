import * as IO from '../io'

import { UserRepository, UserRepositoryImpl } from './user-repository'
import { UserService, UserServiceImpl } from './user-service'
import { router } from './user-router'
import { Module } from '../framework'
import { ServiceHandler } from '../framework/service/handlers'

export interface Components {
  repository: UserRepository
  service: UserService
}

export interface User {
  name: string
  email: string
}

export function production(io: IO.Components): Module<Components, ServiceHandler> {
  const repository = new UserRepositoryImpl(io.postgres, io.loggerProvider)
  const service = new UserServiceImpl(repository)
  return { components: { repository, service }, exports: { handlers: [router(service)] } }
}
