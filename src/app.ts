import { startMode } from './server'
import { production } from './mode'

export const server = startMode(production())
