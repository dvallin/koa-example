import { Mode } from '../../src/postgres/postgres-mode'
import { Postgres } from '../../src/postgres/postgres'
import { QueryConfig, QueryResult } from 'pg'

export class MockPostgres implements Postgres {
  public backend = jest.fn<any[], any>()

  private id: number = 0

  async performQuery<T>(query: QueryConfig, ...values: any[]): Promise<QueryResult<T>> {
    const rows = this.backend(query, values)
    return Promise.resolve({
      rows,
      rowCount: rows.length,
      command: query.name,
      oid: this.id++,
      fields: [],
    })
  }
}

export function testing(): Mode {
  return {
    database: new MockPostgres(),
  }
}
