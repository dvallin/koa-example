import * as IO from '../io'
import { Module } from '../framework'
import { buildChatSocketHandler } from './chat-socket-handler'
import { ChatServiceImpl, ChatService } from './chat-service'
import { ChatMessageRepositoryImpl, ChatMessageRepository } from './chat-message-repository'
import { SocketHandler } from '../framework/service/handlers'
import { ChatMetrics } from './chat-metrics'

export interface Components {
  messageRepository: ChatMessageRepository
  service: ChatService
  metrics: ChatMetrics
}

export interface Message {
  room: string
  date: Date
  message: string
}

export function production(io: IO.Components): Module<Components, SocketHandler> {
  const metrics = new ChatMetrics(io.metrics('chats'))
  const messageRepository = new ChatMessageRepositoryImpl(io.postgres, io.loggerProvider)
  const service = new ChatServiceImpl(messageRepository)
  const chatSocketHandler = buildChatSocketHandler(service, metrics)
  return {
    components: { messageRepository, service, metrics },
    exports: { handlers: [chatSocketHandler] },
  }
}
