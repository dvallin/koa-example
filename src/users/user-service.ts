import { UserRepository } from './user-repository'

export interface UserService {
  get(): Promise<string>
}

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async get(): Promise<string> {
    return this.repository.get('some-user')
  }
}
