import { runMode } from './framework/batch/runner'
import { mergeExports } from './framework'
import { ConsoleLogger } from './framework/logger'
import { wrapBatchHandler } from './framework/batch/handlers'

runMode({
  loggerProvider: (name: string) => new ConsoleLogger(name),
  exports: mergeExports({
    handlers: [wrapBatchHandler(() => Promise.resolve())],
  }),
})
