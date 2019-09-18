import { Pool, QueryConfig, QueryResult } from 'pg'

export interface Postgres {
  performQuery<T>(query: QueryConfig): Promise<QueryResult<T>>
  performQueries<T>(queries: QueryConfig[]): Promise<QueryResult<T>[]>
}

export function createQuery(text: string): QueryConfig {
  return { text }
}

export function createPreparedQuery<K extends string>(commands: { [key in K]: string }, name: K, ...values: any[]): QueryConfig {
  const text = commands[name]
  return { name, text, values }
}

export class NonBlockingPostgres implements Postgres {
  constructor(private readonly pool: Pool) {}

  async performQuery<T>(query: QueryConfig): Promise<QueryResult<T>> {
    return await this.pool.query(query)
  }

  async performQueries<T>(queries: QueryConfig[]): Promise<QueryResult<T>[]> {
    const client = await this.pool.connect()
    try {
      return await Promise.all(queries.map(query => client.query(query)))
    } finally {
      client.release()
    }
  }
}
