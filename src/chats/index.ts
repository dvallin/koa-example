import * as IO from '../io'
import { Module } from '..'
import { buildChatSocketHandler } from './chat-socket-handler'
import { ChatServiceImpl, ChatService } from './chat-service'
import { ChatMessageRepositoryImpl, ChatMessageRepository, migrations } from './chat-message-repository'

export interface Components {
  messageRepository: ChatMessageRepository
  service: ChatService
}

export interface Message {
  room: string
  date: Date
  message: string
}

export function production(io: IO.Components): Module<Components> {
  const messageRepository = new ChatMessageRepositoryImpl(io.postgres)
  const service = new ChatServiceImpl(messageRepository)
  const chatSocketHandler = buildChatSocketHandler(service)
  return {
    components: { messageRepository, service },
    exports: { socketHandlers: [chatSocketHandler], migrations: migrations },
  }
}
