import * as User from '../../src/users'
import * as MockDatabase from './database/mock-database'

import { Mode, mergeExports } from '../../src'

export function testing(): Mode {
  const io = MockDatabase.testing()
  const user = User.production(io.components)
  return { io: io.components, user: user.components, exports: mergeExports(io.exports, user.exports) }
}
