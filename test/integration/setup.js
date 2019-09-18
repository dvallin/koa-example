const testcontainers = require('testcontainers')

module.exports = async () => {
  if (global.postgres === undefined) {
    const postgres = await new testcontainers.GenericContainer('postgres').withExposedPorts(5432).start()

    process.env.PGHOST = postgres.getContainerIpAddress()
    process.env.PGUSER = 'postgres'
    process.env.PGDATABASE = 'postgres'
    process.env.PGPASSWORD = 'postgres'
    process.env.PGPORT = postgres.getMappedPort(5432).toString()
    global.postgres = postgres
  }
}
