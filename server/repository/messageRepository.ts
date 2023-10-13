import { Chat, PostChatDto } from "../model/chat";
import { Message, PostMessageDto } from "../model/message";
import { PostUserDto, User } from "../model/user";
import "reflect-metadata";
const pgPoolWrapper = require(".././connection"); // import pgPoolWrapper

// TODO Do better error handling later for try catch
export class MesssageRepository {
  constructor() {}


  async getCurrentMessagesOfChat(currentChatId: number): Promise<Message[] | []> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT * FROM chat_app.message WHERE chat_id = $1",
        [currentChatId]
      );

      client.release();

      if (result.rows.length === 0) return []; // No chats found for this user

      const messages: Message[] = result.rows.map(
        (row: {
          chat_id: number,
          sender_id: Number,
          body: string,
          created_at: Date,
        }) => ({
          chat_id: row.chat_id,
          sender_id: row.sender_id,
          body: row.body,
          created_at: row.created_at,
        })
      );

      return messages;
    } catch (error) {
      console.log("Query error " + error);
      return [];
    }
  }

  async createMessage(newChat: PostMessageDto): Promise<Message | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "INSERT INTO chat_app.message (chat_id, sender_id,body) VALUES ($1,$2,$3) RETURNING chat_id,sender_id,body, created_at ",
        [newChat.chatId, newChat.senderId, newChat.body]
      );

      if (result.rows.length === 0) return undefined; // No chat found for this user

      client.release();

      const message : Message = {
        chatId: result.rows[0].chat_id,
        senderId: result.rows[0].sender_id,
        body: result.rows[0].body,
        created_at: result.rows[0].created_at,
      };

      return message;
    } catch (error) {
      console.log(error);
    }
  }
}
