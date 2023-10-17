import { Member } from "./member";

export interface Message {
    chatId : number,
    senderId: number,
    body: string,
    createdAt: Date,
  }

export class MessageModel implements Message{
    chatId : number;
    senderId: number;
    body: string;
    createdAt: Date;

    constructor(chatId : number, senderId: number, body: string, createdAt: Date) {
        this.chatId = chatId;
        this.senderId = senderId;
        this.body = body;
        this.createdAt = createdAt;
    } 
}

export interface PostMessageDto {
    chatId : number,
    senderId: number,
    body: string
}