import { Mode, production } from '../src/mode'
import * as MockDatabase from './database/mock-database'

export function testing(): Mode {
  const io = MockDatabase.testing()
  const mode = production()
  return { io, routes: mode.routes, migrations: mode.migrations }
}
