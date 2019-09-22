import { map } from '../framework/async-reader'
import { ContextReader } from '../framework/request-context'

import { UserRepository } from './user-repository'
import { User } from '.'

export interface UserService {
  get(email: string): ContextReader<string>
  create(user: User): ContextReader<void>
}

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  get(email: string): ContextReader<string> {
    const user = this.repository.get(email)
    return map(user, u => u.name)
  }

  create(user: User): ContextReader<void> {
    return this.repository.create(user)
  }
}
