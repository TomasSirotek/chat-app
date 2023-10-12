import { autoInjectable } from "tsyringe";
import { Chat, PostChatDto } from "../model/chat";
import { ChatRepository } from "../repository/chatRepository";

@autoInjectable()
export default class ChatService {
  chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  async getChatByUsersAsync(
    firstId: number,
    secondId: number
  ): Promise<Chat | undefined> {
    return this.chatRepository.getChatByUsersAsync(firstId, secondId);
  }

  getChatOfUsersAsync(
    firstId: number,
    secondId: number
  ): Promise<Chat | undefined> {
    return this.chatRepository.getChatOfUsersAsync(firstId, secondId);
  }

  async getChatByUserId(userId: number): Promise<Chat | undefined> {
    return this.chatRepository.getChatByUserId(userId);
  }

  async createChatAsync(chat: PostChatDto): Promise<Chat | undefined> {
    return this.chatRepository.createChatAsync(chat);
  }
}
