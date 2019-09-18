import { testMode } from '../../test-wrappers'
import { production } from '../../../src'
import { Message } from '../../../src/chats'
import { cleanDatabase } from '../testData'

describe('chat message repository', () => {
  testMode(production, 'creates a message', async (_server, mode) => {
    // given
    const now = new Date()

    // when
    await mode.chats.messageRepository.create({ room: 'some room', date: now, message: 'some message' })

    // then
    const result = await mode.io.postgres.performQuery<Message>({ text: `SELECT * FROM chat_messages;` })
    expect(result.rowCount).toEqual(1)
    expect(result.rows[0]).toEqual({ room: 'some room', date: now, message: 'some message' })

    // after
    await cleanDatabase(mode)
  })
})
