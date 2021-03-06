import { ContextReader } from '../framework/request-context'

import { ChatMessageRepository } from './chat-message-repository'
import { Message } from '.'

export interface ChatService {
  received(message: Message): ContextReader<void>
}

export class ChatServiceImpl implements ChatService {
  constructor(private readonly messageRepository: ChatMessageRepository) {}

  received(message: Message): ContextReader<void> {
    return this.messageRepository.create(message)
  }
}
