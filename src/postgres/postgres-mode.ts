import { Postgres, NonBlockingPostgres } from './postgres'
import { Pool } from 'pg'

export interface Mode {
  database: Postgres
}

export function production(): Mode {
  const pool = new Pool()
  return {
    database: new NonBlockingPostgres(pool),
  }
}
