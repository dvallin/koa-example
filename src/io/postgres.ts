import { Pool, QueryConfig, QueryResult } from 'pg'

export interface Postgres {
  performQuery<T>(query: QueryConfig): Promise<QueryResult<T>>
  performQueries<T>(queries: QueryConfig[]): Promise<QueryResult<T>[]>
  performTransaction<T>(queries: QueryConfig[]): Promise<void>
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
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      client.release()
    }
  }

  async performTransaction(queries: QueryConfig[]): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await Promise.all(queries.map(query => client.query(query)))
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
