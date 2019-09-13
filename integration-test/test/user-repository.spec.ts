import { GenericContainer, StartedTestContainer } from 'testcontainers'

import { production, Mode } from '../../src/mode'

const twentySeconds: number = 20 * 1000

describe('containers', () => {
  let postgres: StartedTestContainer
  let mode: Mode

  beforeAll(async () => {
    postgres = await new GenericContainer('postgres').withExposedPorts(5432).start()

    process.env.PGHOST = postgres.getContainerIpAddress()
    process.env.PGUSER = 'postgres'
    process.env.PGDATABASE = 'postgres'
    process.env.PGPASSWORD = 'postgres'
    process.env.PGPORT = postgres.getMappedPort(5432).toString()

    mode = production()
    await mode.database.postgres.performMigrations()
  }, twentySeconds)

  afterAll(async () => {
    await postgres.stop()
  }, twentySeconds)

  it('runs', async () => {
    await mode.database.postgres.performQuery({
      config: { name: '', text: `INSERT INTO koa_users (email, name) VALUES ('some-user', 'John Doe');` },
    })
    const userName = await mode.user.repository.get('some-user')
    expect(userName).toEqual('John Doe')
  })
})
