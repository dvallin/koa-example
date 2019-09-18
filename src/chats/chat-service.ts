import { ChatMessageRepository } from './chat-message-repository'
import { Message } from '.'

export interface ChatService {
  received(message: Message): Promise<void>
}

export class ChatServiceImpl implements ChatService {
  constructor(private readonly messageRepository: ChatMessageRepository) {}

  received(message: Message): Promise<void> {
    return this.messageRepository.create(message)
  }
}
