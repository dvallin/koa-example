import { Pool, QueryConfig, QueryResult } from 'pg'

export interface Postgres {
  performQuery<T>(query: Query): Promise<QueryResult<T>>
  performQueries<T>(...queries: Query[]): Promise<QueryResult<T>[]>

  registerMigrations(...queries: Query[]): void
  performMigrations(): Promise<void>
}

export interface Query {
  config: QueryConfig
  values?: any[]
}

export class NonBlockingPostgres implements Postgres {
  private migrations: Query[] = []

  constructor(private readonly pool: Pool) {}

  async performQuery<T>(query: Query): Promise<QueryResult<T>> {
    return await this.pool.query(query.config, query.values)
  }

  async performQueries<T>(...queries: Query[]): Promise<QueryResult<T>[]> {
    const client = await this.pool.connect()
    try {
      return await Promise.all(queries.map(q => client.query(q.config, q.values)))
    } finally {
      client.release()
    }
  }

  registerMigrations(...queries: Query[]) {
    this.migrations.push(...queries)
  }

  async performMigrations(): Promise<void> {
    await this.performQueries(...this.migrations)
  }
}
