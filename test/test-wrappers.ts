import * as Koa from 'koa'
import { Server } from 'http'

import { startMode, startApp } from '../src/server'
import { Mode } from '../src'
import { AddressInfo } from 'net'

export function testApp(appProvider: () => Koa, name: string, tests: (server: Server, app: Koa, port: number) => Promise<void>) {
  testServer(appProvider, app => Promise.resolve(startApp(app)), name, tests)
}

export function testMode(modeProvider: () => Mode, name: string, tests: (server: Server, mode: Mode, port: number) => Promise<void>) {
  testServer(modeProvider, m => startMode(m), name, tests)
}

function testServer<T>(
  fromProvider: () => T,
  serverProvider: (from: T) => Promise<Server>,
  name: string,
  tests: (server: Server, from: T, port: number) => Promise<void>
) {
  describe('with running server', () => {
    let server: Server
    let from: T

    beforeEach(async () => {
      from = fromProvider()
      server = await serverProvider(from)
    })

    afterEach(() => {
      server.close()
    })

    it(name, async () => tests(server, from, (server.address() as AddressInfo).port))
  })
}
