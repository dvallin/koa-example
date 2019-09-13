import { GenericContainer, StartedTestContainer } from 'testcontainers'

import { production } from '../../src/mode'

const twentySeconds: number = 20 * 1000

describe('containers', () => {
  let postgres: StartedTestContainer
  beforeAll(async () => {
    postgres = await new GenericContainer('postgres').withExposedPorts(5432).start()

    process.env.PGHOST = postgres.getContainerIpAddress()
    process.env.PGUSER = 'postgres'
    process.env.PGDATABASE = 'postgres'
    process.env.PGPASSWORD = 'postgres'
    process.env.PGPORT = postgres.getMappedPort(5432).toString()
  }, twentySeconds)

  afterAll(async () => {
    await postgres.stop()
  }, twentySeconds)

  it('runs', async () => {
    const mode = production()
    const userName = await mode.user.repository.get('some-user')
    console.log(userName)
  })
})
