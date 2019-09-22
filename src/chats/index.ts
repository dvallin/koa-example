import * as IO from '../io'
import { Module } from '../framework'
import { buildChatSocketHandler } from './chat-socket-handler'
import { ChatServiceImpl, ChatService } from './chat-service'
import { ChatMessageRepositoryImpl, ChatMessageRepository } from './chat-message-repository'
import { SocketHandler } from '../framework/service/handlers'

export interface Components {
  messageRepository: ChatMessageRepository
  service: ChatService
}

export interface Message {
  room: string
  date: Date
  message: string
}

export function production(io: IO.Components): Module<Components, SocketHandler> {
  const messageRepository = new ChatMessageRepositoryImpl(io.postgres, io.loggerProvider)
  const service = new ChatServiceImpl(messageRepository)
  const chatSocketHandler = buildChatSocketHandler(service)
  return {
    components: { messageRepository, service },
    exports: { handlers: [chatSocketHandler] },
  }
}
