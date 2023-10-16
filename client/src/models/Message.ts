export interface Message {
    chat_id: number;
    sender_id: number;
    body: string;
    isRead: boolean;
    created_at: Date;
  }
