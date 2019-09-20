import * as IO from '../../src/io'

import { Mode, productionWithIo, Module } from '../../src'
import { mockLogProvider } from './mock-logger'
import { MockPostgres } from './mock-database'

function testingIo(): Module<IO.Components> {
  return {
    components: { postgres: new MockPostgres(), loggerProvider: mockLogProvider(jest.fn()) },
    exports: {},
  }
}

export function productionWithLogSink(logSink: jest.Mock<any, any> = jest.fn()): Mode {
  const io = IO.production()
  io.components.loggerProvider = mockLogProvider(logSink)
  return productionWithIo(io)
}

export function testing(): Mode {
  return productionWithIo(testingIo())
}
