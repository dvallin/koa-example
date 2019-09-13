import { Pool, QueryConfig, QueryResult } from 'pg'

export interface Postgres {
  performQuery<T>(query: QueryConfig, ...values: any[]): Promise<QueryResult<T>>
}

export class NonBlockingPostgres implements Postgres {
  constructor(private readonly pool: Pool) {}

  async performQuery<T>(query: QueryConfig, ...values: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect()
    try {
      return client.query(query, values)
    } finally {
      client.release()
    }
  }
}
