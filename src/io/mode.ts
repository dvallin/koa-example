import { Postgres, NonBlockingPostgres } from './postgres'
import { Pool } from 'pg'

export interface Mode {
  postgres: Postgres
}

export function production(): Mode {
  const pool = new Pool()
  return { postgres: new NonBlockingPostgres(pool) }
}
