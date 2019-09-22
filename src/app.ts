import { runMode } from './framework/service/runner'
import { production } from '.'

export const servers = runMode(production(), 8080, 8081)
