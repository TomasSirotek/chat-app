export interface Message {
    chatId: number;
    senderId: number;
    body: string;
    isRead: boolean;
    isSending: boolean;
    createdAt: Date;
  }
