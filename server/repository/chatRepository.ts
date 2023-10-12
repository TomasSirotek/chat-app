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
        'SELECT c.id AS chat_id, c.created_at, c.updated_at, ARRAY_AGG(uc.user_id) AS members ' +
        'FROM chat_app.chat AS c ' +
        'INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id ' +
        'WHERE uc.user_id IN ($1, $2) ' +
        'GROUP BY c.id, c.created_at, c.updated_at ' +
        'HAVING COUNT(DISTINCT uc.user_id) = 2',
        [firstId, secondId]
      );
  
      client.release();
  
      if (result.rows.length === 0) return undefined; // No chat found for these users
  
      // Extract chat information
      const chatInfo = {
        id: result.rows[0].chat_id,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
        members: result.rows[0].members
      };
  
      return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }
  
  async getChatByUserId(userId: number): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();
  
      const chatResult = await client.query(
        'SELECT c.id AS chat_id, c.created_at, c.updated_at ' +
        'FROM chat_app.chat AS c ' +
        'INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id ' +
        'WHERE uc.user_id = $1',
        [userId]
      );
  
      if (chatResult.rows.length === 0) return undefined; // No chat found for this user
  
      const chatInfo = {
        id: chatResult.rows[0].chat_id,
        created_at: chatResult.rows[0].created_at,
        updated_at: chatResult.rows[0].updated_at,
        members: []
      };
  
      // Fetch chat members
      const memberResult = await client.query(
        'SELECT user_id ' +
        'FROM chat_app.user_chat ' +
        'WHERE chat_id = $1',
        [chatInfo.id]
      );
  
      client.release();
  
      // Add members to the chatInfo object
      chatInfo.members = memberResult.rows.map((row: { user_id: any; }) => row.user_id);
  
      return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  
  async createChatAsync(newChat: PostChatDto): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();


    const chatResult = await client.query(
      'INSERT INTO chat_app.chat (created_at, updated_at) VALUES (NOW(), NOW()) RETURNING id, created_at, updated_at'
    );

    if (chatResult.rows.length === 0) return undefined; // No chat found for this user
    

    const chatId = chatResult.rows[0].id;

    // Next, insert user associations in the user_chat table
    for (const member of newChat.members) {
      await client.query(
        'INSERT INTO chat_app.user_chat (user_id, chat_id) VALUES ($1, $2)',
        [member, chatId]
      );
    }

     // Fetch chat members after inserting them
     const memberResult = await client.query(
      'SELECT user_id FROM chat_app.user_chat WHERE chat_id = $1',
      [chatId]
    );

    client.release();

    if (memberResult.rows.length === 0) return undefined; // No chat found for this user

    const chatInfo = {
      id: chatId,
      created_at: chatResult.rows[0].created_at,
      updated_at: chatResult.rows[0].updated_at,
      members: memberResult.rows.map((row: { user_id: any; }) => row.user_id)
    };

    return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }
}