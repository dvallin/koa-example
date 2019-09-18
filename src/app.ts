import { startMode } from './server'
import { production } from '.'

export const server = startMode(production())
