import { Member } from "./member";
import { Message } from "./message";

export interface Chat {
    id: number;
    members: Member[];
    messages: Message[];
    created_at: Date;
    updated_at: Date;
  }

export class ChatModel implements Chat{
    id: number;
    members: Member[] = [];
    created_at: Date;
    updated_at: Date;
    messages: Message[] = [];

    constructor(id: number, members: [],messages: [], created_at: Date, updated_at: Date) {
        this.id = id;
        this.members = members;
        this.messages = messages;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    
}

export interface PostChatDto {
    members: Member[];
}
