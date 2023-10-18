import express, {  Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import ChatService from "../service/chatService";
import { StatusCodes } from "http-status-codes";
import { Chat, PostChatDto } from "../model/chat";
import MessageService from "../service/messageService";
import { Message } from "../model/message";

const router = express.Router();

@autoInjectable()
export default class MessageController {
  messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  async createMessage(req: Request, res: Response) {
    const { senderId, chatId, body } = req.body;

    if (!(senderId && chatId && body))
      return res.status(StatusCodes.BAD_REQUEST).send("All input is required");

    const newMessage = await this.messageService.createMessageAsync(req.body);

    if (!newMessage)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json("Error creating message");

    return res.status(StatusCodes.OK).json(newMessage);
  }

  async getCurrentMessagesOfChat(req: Request, res: Response) {
    const currentChatId: number = parseInt(req.params.id);
    
    if(!currentChatId) return res.status(StatusCodes.BAD_REQUEST).send("The currentChatId is required");

    const existingMessages: Message[] | [] = await this.messageService.getCurrentMessagesOfChat(currentChatId);

    if (!existingMessages) return res.status(StatusCodes.OK).json("No messages found");

    return res.status(StatusCodes.OK).json(existingMessages);
  }
  routes() {
    router.post("/", (req: Request, res: Response) =>
      this.createMessage(req, res)
    );

    router.get("/:id", (req: Request, res: Response) =>
      this.getCurrentMessagesOfChat(req, res)
    );
    return router;
  }
}
