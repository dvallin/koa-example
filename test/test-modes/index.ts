import * as IO from '../../src/io'

import { mockLogProvider } from './mock-logger'
import { MockPostgres } from './mock-database'
import { Module } from '../../src/framework'
import { productionWithIo, AppMode } from '../../src'

function testingIo(): Module<IO.Components> {
  const postgres = new MockPostgres()
  return {
    components: { postgres, loggerProvider: mockLogProvider(jest.fn()) },
    exports: { ready: () => postgres.isConnected },
  }
}

export function productionWithLogSink(logSink: jest.Mock<any, any> = jest.fn()): AppMode {
  const io = IO.production()
  io.components.loggerProvider = mockLogProvider(logSink)
  return productionWithIo(io)
}

export function testing(): AppMode {
  return productionWithIo(testingIo())
}
