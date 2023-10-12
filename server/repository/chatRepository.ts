import { Chat, PostChatDto } from "../model/chat";
import { PostUserDto, User } from "../model/user";
import "reflect-metadata";
const pgPoolWrapper = require(".././connection"); // import pgPoolWrapper

// TODO Do better error handling later for try catch
export class ChatRepository {
  
  constructor() {}

  async getChatByUsersAsync(
    firstId: number,
    secondId: number
  ): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      
      const result = await client.query(
        'SELECT c.id AS chat_id, c.created_at, c.updated_at, uc.user_id AS member_id ' +
        'FROM chat_app.chat AS c ' +
        'INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id ' +
        'WHERE uc.user_id IN ($1, $2) ' +
        'GROUP BY c.id, c.created_at, c.updated_at, uc.user_id ',
        [firstId, secondId]
      );

      client.release();

      if (result.rows.length === 0) {
        return undefined; // No chat found for these users
      }
  
    
    const chatInfo : Chat= {
      id: result.rows[0].chat_id,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
      members: result.rows.map((row: { member_id: any; }) => row.member_id)
    };
    return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async getChatOfUsersAsync(firstId: number, secondId: number): Promise<Chat | undefined> {
    
    try {
      const client = await pgPoolWrapper.connect();

     
      const result = await client.query(
        'SELECT c.id AS chat_id, c.created_at, c.updated_at, uc.user_id AS member_id ' +
        'FROM chat_app.chat AS c ' +
        'INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id ' +
        'WHERE uc.user_id IN ($1, $2) ' +
        'GROUP BY c.id, c.created_at, c.updated_at, uc.user_id ' +
        'HAVING COUNT(DISTINCT uc.user_id) = 2',
        [firstId, secondId]
      );

      client.release();

      if (result.rows.length === 0) {
        return undefined; // No chat found for these users
      }
  
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getChatByUserId(userId: number): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT * FROM chat_app.chat WHERE chat.firstId = $1 ",
        [userId]
      );
      client.release();
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }
  }


  async createChatAsync(newChat: PostChatDto): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      console.log(newChat.members)
      const result = await client.query(
        'INSERT INTO chat_app.user_chat (user_id, chat_id) VALUES ($1, $2) RETURNING *',
        [newChat.members[0], newChat.members[1]]
      );

      client.release();
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }
  }

}