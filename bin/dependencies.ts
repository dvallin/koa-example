import { GenericContainer } from 'testcontainers'

const containers = [
  {
    name: 'postgres',
    container: new GenericContainer('postgres').withExposedPorts(5432),
    startedContainer: undefined,
  },
]

console.log('starting dependencies...')
Promise.all(
  containers.map(async s => {
    s.startedContainer = await s.container.start()
    return s
  })
).then(containers => {
  console.log('dependencies started')
  console.log(containers.map(c => c.name).join(', '))
  console.log('')
  console.log('environment variables')
  containers.forEach(c => {
    if (c.name === 'postgres') {
      console.log(`export PGHOST=${c.startedContainer.getContainerIpAddress()}`)
      console.log(`export PGPORT=${c.startedContainer.getMappedPort(5432).toString()}`)
      console.log(`export PGDATABASE=postgres`)
      console.log(`export PGUSER=postgres`)
      console.log(`export PGPASSWORD=postgres`)
    }
  })
})
