import { UserRepository } from './user-repository'
import { User } from '.'
import { ContextReader } from '..'
import { map } from '../async-reader'

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
