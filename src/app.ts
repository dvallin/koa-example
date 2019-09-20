import { startMode } from './server'
import { production } from '.'

export const servers = startMode(production(), 8080, 8081)
