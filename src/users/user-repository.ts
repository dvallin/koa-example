import { Query } from '../io/postgres'
import { QueryConfig } from 'pg'
import { Observable, of, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Mode } from '../io/mode'

const TABLE_NAME = 'koa_users'

export const migrations: Query[] = [
  {
    config: {
      name: 'create-user-table',
      text: `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        email  VARCHAR(45) PRIMARY KEY,
        name   VARCHAR(45)
      );`,
    },
  },
]

export const fetchUserCommand: QueryConfig = {
  name: 'fetch-user',
  text: `SELECT name FROM ${TABLE_NAME} WHERE email = $1`,
  values: [1],
}

export class UserRepository {
  constructor(private readonly io: Mode) {}

  fetchUserFromDb(email: string): Observable<string> {
    const query = this.io.postgres.performQuery<{ name: string }>({ config: fetchUserCommand, values: [email] })
    return from(query).pipe(map(records => records.rows[0].name))
  }

  getSomeUserEmail(id: number): Observable<string> {
    return of(`${id}@otto.de`)
  }
}
