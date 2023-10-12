import express, {  Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import ChatService from "../service/chatService";
import { StatusCodes } from "http-status-codes";
import { PostChatDto } from "../model/chat";
import { authorization } from "./userController";

const router = express.Router();

@autoInjectable()
export default class ChatController {
  chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async createChat(req: Request, res: Response) {
    const { firstId, secondId } = req.body;

    if (!(firstId && secondId))
      return res.status(StatusCodes.BAD_REQUEST).send("All input is required");

    const existingChat = await this.chatService.getChatByUsersAsync(
      firstId,
      secondId
    );

    console.log(existingChat)

    if (existingChat) return res.status(StatusCodes.OK).json(existingChat);

    const newChatModel: PostChatDto = {
      members: [firstId, secondId],
    };
    const newChat = await this.chatService.createChatAsync(newChatModel);

    if (!newChat)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json("Error creating chat");

    return res.status(StatusCodes.OK).json(newChat);
  }

  async getUserChat(req: Request, res: Response) {
    const userId: number = parseInt(req.params.userId);

    if (!userId)
      return res.status(StatusCodes.BAD_REQUEST).send("The userId is required");

    const existingChat = await this.chatService.getChatByUserId(userId);

    if (!existingChat) return res.status(StatusCodes.OK).json("No chat found");

    return res.status(StatusCodes.OK).json(existingChat);
  }

  async getChatOfUsers(req: Request, res: Response) {
    const firstId: number = parseInt(req.params.firstId);
    const secondId: number = parseInt(req.params.secondId);

    if (!(firstId && secondId))
      return res.status(StatusCodes.BAD_REQUEST).send("All input is required");

    const existingChat = await this.chatService.getChatOfUsersAsync(
      firstId,
      secondId
    );


    if (!existingChat) return res.status(StatusCodes.OK).json("No chat found");

    return res.status(StatusCodes.OK).json(existingChat);
  }

  routes() {
    router.post("/", authorization, (req: Request, res: Response) =>
      this.createChat(req, res)
    );

    router.get("/:userId", authorization, (req: Request, res: Response) =>
      this.getUserChat(req, res)
    );

    router.get(
      "/get/:firstId/:secondId",
      authorization,
      (req: Request, res: Response) => this.getChatOfUsers(req, res)
    );
    return router;
  }
}
