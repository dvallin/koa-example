import { build, start } from './server'
import { production } from './mode'

const context = production()
const app = build(context.user.routes)
export const server = start(app)
