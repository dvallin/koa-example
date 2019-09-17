import { Observable } from 'rxjs'
import { UserRepository } from './user-repository'
import { mergeMap } from 'rxjs/operators'

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  getSomeUserName(id: number): Observable<string> {
    return this.repo.getSomeUserEmail(id).pipe(mergeMap(p => this.repo.fetchUserFromDb(p[0])))
  }
}
