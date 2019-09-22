import { Pool, QueryConfig, QueryResult } from 'pg'
import { Module } from '..'

export interface Postgres {
  performQuery<T>(query: QueryConfig): Promise<QueryResult<T>>
  performQueries<T>(queries: QueryConfig[]): Promise<QueryResult<T>[]>
  performTransaction(queries: QueryConfig[]): Promise<void>

  isConnected: boolean
  disconnect(): Promise<void>

  performMigrations(): Promise<void>
  registerMigrations(queries: QueryConfig[])
}

export function createQuery(text: string): QueryConfig {
  return { text }
}

export function createPreparedQuery<K extends string>(
  commands: { [key in K]: string },
  name: K,
  ...values: (string | number | Date)[]
): QueryConfig {
  const text = commands[name]
  return { name, text, values }
}

export class NonBlockingPostgres implements Postgres {
  private migrations: QueryConfig[] = []
  public isConnected = false

  constructor(private readonly pool: Pool = new Pool()) {
    pool.on('connect', () => {
      this.isConnected = true
    })
    pool.on('error', () => {
      this.isConnected = false
    })
  }

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

  disconnect(): Promise<void> {
    return this.pool.end()
  }

  performMigrations(): Promise<void> {
    return this.performTransaction(this.migrations)
  }

  registerMigrations(queries: QueryConfig[]) {
    this.migrations = this.migrations.concat(queries)
  }
}

export interface Components {
  postgres: Postgres
}

export function production(): Module<Components> {
  const postgres = new NonBlockingPostgres()

  return {
    components: { postgres },
    exports: {
      startup: () => postgres.performMigrations(),
      shutdown: (): Promise<void> => postgres.disconnect(),
      ready: () => postgres.isConnected,
    },
  }
}
