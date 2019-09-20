import { testMode } from '../../test-wrappers'
import { production } from '../../../src'
import { Message } from '../../../src/chats'
import { cleanDatabase } from '../testData'
import { productionWithLogSink } from '../../test-modes'

describe('chat message repository', () => {
  const logSink = jest.fn()

  testMode(production, 'creates a message', async (_server, mode) => {
    // given
    const now = new Date()

    // when
    await mode.chats.messageRepository.create({ room: 'some room', date: now, message: 'some message' })({ id: 'tracing-id' })

    // then
    const result = await mode.io.postgres.performQuery<Message>({ text: `SELECT * FROM chat_messages;` })
    expect(result.rowCount).toEqual(1)
    expect(result.rows[0]).toEqual({ room: 'some room', date: now, message: 'some message' })

    // after
    await cleanDatabase(mode)
  })

  testMode(() => productionWithLogSink(logSink), 'logs operations on trace', async (_server, mode) => {
    // given
    const now = new Date()

    // when
    await mode.chats.messageRepository.create({ room: 'some room', date: now, message: 'some message' })({ id: 'tracing-id' })

    // then
    expect(logSink).toHaveBeenCalledWith('ChatMessageRepositoryImpl', 'trace', 'wrote message to db', { id: 'tracing-id' })
  })
})
