import { Mode } from '../../src/postgres/postgres-mode'
import { Postgres, Query } from '../../src/postgres/postgres'
import { QueryResult } from 'pg'

export class MockPostgres implements Postgres {
  public migrations: Query[] = []
  public backend = jest.fn<any[], any>()

  private id: number = 0

  async performQuery<T>(query: Query): Promise<QueryResult<T>> {
    const rows = this.backend(query.config, query.values)
    return Promise.resolve({
      rows,
      rowCount: rows.length,
      command: '',
      oid: this.id++,
      fields: [],
    })
  }

  async performQueries<T>(...queries: Query[]): Promise<QueryResult<T>[]> {
    return Promise.all(queries.map(q => this.performQuery(q)))
  }

  registerMigrations(...queries: Query[]) {
    this.migrations.push(...queries)
  }

  async performMigrations(): Promise<void> {}
}

export function testing(): Mode {
  return {
    postgres: new MockPostgres(),
  }
}
