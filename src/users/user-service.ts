import { UserRepository } from './user-repository'
import { User } from '.'

export interface UserService {
  get(email: string): Promise<string>
  create(user: User): Promise<void>
}

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async get(email: string): Promise<string> {
    return this.repository.get(email)
  }

  async create(user: User): Promise<void> {
    return this.repository.create(user)
  }
}
