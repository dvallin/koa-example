import { UserService } from './user-service'
import { UserRepository } from './user-repository'
import { router as userRouter } from './user-routes'
import * as Router from 'koa-router'
import * as IO from '../io/mode'

export interface Mode {
  service: UserService
  repository: UserRepository
}

export function production(io: IO.Mode): { mode: Mode; router: Router } {
  const repository = new UserRepository(io)
  const service = new UserService(repository)
  const mode = { repository, service }
  return { mode, router: userRouter(service) }
}
