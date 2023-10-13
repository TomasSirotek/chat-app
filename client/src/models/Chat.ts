import { Message } from "./Message";

export interface Chat {
    id: number;
    members: Member[];
    messages: Message[];
    created_at: Date;
    updated_at: Date;
  }


  export interface Member {
    id: number;
    firstId: number;
    secondId: number;
  }
