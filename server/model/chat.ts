import { Member } from "./member";

export interface Chat {
    id: number;
    members: Member[];
    created_at: Date;
    updated_at: Date;
  }

export class ChatModel implements Chat{
    id: number;
    members: Member[] = [];
    created_at: Date;
    updated_at: Date;

    constructor(id: number, members: [], created_at: Date, updated_at: Date) {
        this.id = id;
        this.members = members;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    
}

export interface PostChatDto {
    members: Member[];
}
