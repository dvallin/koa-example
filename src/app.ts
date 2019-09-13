import { start } from './server'
import { production } from './mode'

export const server = start(production())
