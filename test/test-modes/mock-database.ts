import { QueryResult, QueryConfig } from 'pg'

import { Postgres } from '../../src/io/postgres'

export class MockPostgres implements Postgres {
  public performedQueries: QueryConfig[] = []
  public backend = jest.fn<any[], any>()

  public isConnected = true
  private id = 0

  async performQuery<T>(query: QueryConfig): Promise<QueryResult<T>> {
    this.performedQueries.push(query)
    const rows = this.backend(query)
    return Promise.resolve({
      rows,
      rowCount: rows ? rows.length : 0,
      command: '',
      oid: this.id++,
      fields: [],
    })
  }

  async performQueries<T>(queries: QueryConfig[]): Promise<QueryResult<T>[]> {
    return Promise.all(queries.map(q => this.performQuery(q)))
  }

  async performTransaction(queries: QueryConfig[]): Promise<void> {
    Promise.all(queries.map(q => this.performQuery(q)))
  }

  disconnect(): Promise<void> {
    return Promise.resolve()
  }
}
