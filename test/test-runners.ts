import * as Koa from 'koa'
import { Server } from 'http'

import { runMode, KoaHandlers } from '../src/framework/service/runner'
import { AddressInfo } from 'net'
import { ModeBase } from '../src/framework'
import { startApp } from '../src/framework/server'

function getServerPort(server: Server): number {
  return (server.address() as AddressInfo).port
}

function testServer<T>(
  fromProvider: () => T,
  serversProvider: (from: T) => Promise<Server[]>,
  name: string,
  tests: (server: Server[], from: T, ports: number[]) => Promise<void>
): void {
  describe('with running server', () => {
    let servers: Server[]
    let from: T

    beforeEach(async () => {
      jest.clearAllMocks()
      from = fromProvider()
      servers = await serversProvider(from)
    })

    afterEach(() => {
      servers.forEach(s => s.close())
    })

    it(name, async () => tests(servers, from, servers.map(s => getServerPort(s))))
  })
}

export function testApp(appProvider: () => Koa, name: string, tests: (server: Server, app: Koa, port: number) => Promise<void>): void {
  testServer(appProvider, app => Promise.resolve([startApp(app)]), name, (servers, mode, ports) => tests(servers[0], mode, ports[0]))
}

export function testModeServer<T extends ModeBase<KoaHandlers>>(
  modeProvider: () => T,
  name: string,
  tests: (server: Server, mode: T, port: number) => Promise<void>,
  server: 0 | 1
): void {
  testServer(
    modeProvider,
    async m => {
      const servers = await runMode(m)
      return [servers.server, servers.instrumentationServer]
    },
    name,
    (servers, mode, ports) => tests(servers[server], mode, ports[server])
  )
}

export function testMode<T extends ModeBase<KoaHandlers>>(
  modeProvider: () => T,
  name: string,
  tests: (server: Server, mode: T, port: number) => Promise<void>
): void {
  testModeServer(modeProvider, name, tests, 0)
}

export function testManagementMode<T extends ModeBase<KoaHandlers>>(
  modeProvider: () => T,
  name: string,
  tests: (server: Server, mode: T, port: number) => Promise<void>
): void {
  testModeServer(modeProvider, name, tests, 1)
}
