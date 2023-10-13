import { Member } from "./member";

export interface Message {
    chatId : number,
    senderId: number,
    body: string,
    created_at: Date,
  }

export class MessageModel implements Message{
    chatId : number;
    senderId: number;
    body: string;
    created_at: Date;

    constructor(chatId : number, senderId: number, body: string, created_at: Date) {
        this.chatId = chatId;
        this.senderId = senderId;
        this.body = body;
        this.created_at = created_at;
    } 
}

export interface PostMessageDto {
    chatId : number,
    senderId: number,
    body: string
}