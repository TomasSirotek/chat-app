import { autoInjectable } from "tsyringe";
import { Chat, PostChatDto } from "../model/chat";
import { ChatRepository } from "../repository/chatRepository";
import { Message, PostMessageDto } from "../model/message";
import { MesssageRepository } from "../repository/messageRepository";

@autoInjectable()
export default class MessageService {
  messageRepository: MesssageRepository;

  constructor(messageRepository: MesssageRepository) {
    this.messageRepository = messageRepository;
  }


  async getCurrentMessagesOfChat(currentChatId: number): Promise<Message[] | []> {
    return this.messageRepository.getCurrentMessagesOfChat(currentChatId);
  }

  async createMessageAsync(message: PostMessageDto): Promise<Message | undefined> {
    return this.messageRepository.createMessage(message);
  }
}
