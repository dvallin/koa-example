import { Postgres, NonBlockingPostgres } from './postgres'
import { Pool } from 'pg'
import { Module } from '..'

export interface Components {
  postgres: Postgres
}

export function production(): Module<Components> {
  const pool = new Pool()
  return {
    components: { postgres: new NonBlockingPostgres(pool) },
    exports: {
      shutdown: () => pool.end(),
    },
  }
}
