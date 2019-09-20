import * as ws from 'socket.io-client'
import { testMode } from '../../test-wrappers'
import { Message } from '../../../src/chats'

import { testing } from '../../test-modes'
import { MockPostgres } from '../../test-modes/mock-database'

interface SerializedMessage {
  room: string
  message: string
  date: string
}

describe('chat socket', () => {
  testMode(testing, 'can join room and send messages to it', async (_server, mode, port) => {
    return new Promise(resolve => {
      const postgres = mode.io.postgres as MockPostgres
      const socket1Messages: Message[] = []
      const socket2Messages: Message[] = []

      const tryResolve = () => {
        // both clients have received 2 messages
        if (socket1Messages.length == 2 && socket2Messages.length == 2) {
          const messages: Message[] = postgres.performedQueries
            .filter(q => q.name === 'create-message')
            .map(q => ({ room: q.values[0], date: q.values[1], message: q.values[2] }))

          // all messages are saved and every client has received them in order
          expect(messages.map(m => ({ ...m, date: '<date overriden>' }))).toMatchSnapshot()
          expect(socket1Messages).toEqual(messages)
          expect(socket2Messages).toEqual(messages)
          resolve()
        }
      }

      const socket1 = ws(`http://localhost:${port}`)
      const socket2 = ws(`http://localhost:${port}`)
      socket1.emit('join', 'secret room')
      socket2.emit('join', 'secret room')

      socket1.emit('chat message', 'socket1> hello socket 2')
      socket2.emit('chat message', 'socket2> hello socket 1')

      const receiveMessage = (into: Message[]) => {
        return (msg: SerializedMessage) => {
          into.push({ ...msg, date: new Date(msg.date) })
          tryResolve()
        }
      }

      socket1.on('chat message', receiveMessage(socket1Messages))
      socket2.on('chat message', receiveMessage(socket2Messages))
    })
  })
})
