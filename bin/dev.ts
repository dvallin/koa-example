import * as setup from '../test/integration/setup'
import { startMode } from '../src/server'
import { production } from '../src'

console.log('setting up dependencies...')
setup()
  .then(() => {
    console.log('dependencies started.')
    return startMode(production(), 8080)
  })
  .then(() => console.log('server running at: http://localhost:8080'))
