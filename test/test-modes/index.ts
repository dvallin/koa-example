import * as IO from '../../src/io'

import { mockLogProvider } from './mock-logger'
import { MockPostgres } from './mock-database'
import { Module } from '../../src/framework'
import { productionWithIo, AppMode } from '../../src'
import { mockPrometheusProvider } from './mock-prometheus'

function testingIo(): Module<IO.Components> {
  const postgres = new MockPostgres()
  const metrics = mockPrometheusProvider(jest.fn())
  return {
    components: { postgres, loggerProvider: mockLogProvider(jest.fn()), metrics },
    exports: { ready: () => postgres.isConnected, metrics: metrics('') },
  }
}

export function productionWithLogSink(logSink: jest.Mock<any> = jest.fn()): AppMode {
  const io = IO.production()
  io.components.loggerProvider = mockLogProvider(logSink)
  return productionWithIo(io)
}

export function testing(): AppMode {
  return productionWithIo(testingIo())
}
