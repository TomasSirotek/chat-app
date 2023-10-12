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
        "SELECT c.id AS chat_id, c.created_at, c.updated_at, ARRAY_AGG(uc.user_id) AS members " +
          "FROM chat_app.chat AS c " +
          "INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id " +
          "WHERE uc.user_id IN ($1, $2) " +
          "GROUP BY c.id, c.created_at, c.updated_at " +
          "HAVING COUNT(DISTINCT uc.user_id) = 2",
        [firstId, secondId]
      );

      client.release();

      if (result.rows.length === 0) {
        return undefined; // No chat found for these users
      }

      // Extract chat information
      const chatInfo: Chat = {
        id: result.rows[0].chat_id,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
        members: result.rows[0].members,
      };

      return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async getChatOfUsersAsync(
    firstId: number,
    secondId: number
  ): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT c.id AS chat_id, c.created_at, c.updated_at, ARRAY_AGG(uc.user_id) AS members " +
          "FROM chat_app.chat AS c " +
          "INNER JOIN chat_app.user_chat AS uc ON c.id = uc.chat_id " +
          "WHERE uc.user_id IN ($1, $2) " +
          "GROUP BY c.id, c.created_at, c.updated_at " +
          "HAVING COUNT(DISTINCT uc.user_id) = 2",
        [firstId, secondId]
      );

      client.release();

      if (result.rows.length === 0) return undefined; // No chat found for these users

      // Extract chat information
      const chatInfo = {
        id: result.rows[0].chat_id,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
        members: result.rows[0].members,
      };

      return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async getChatsByUserId(userId: number): Promise<Chat[] | []> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT " +
          "c.id AS chat_id, " +
          "c.created_at, " +
          "c.updated_at, " +
          "ARRAY_AGG(uc.user_id) AS members " +
          "FROM " +
          "chat_app.chat AS c " +
          "JOIN " +
          "chat_app.user_chat AS uc " +
          "ON " +
          "c.id = uc.chat_id " +
          "WHERE " +
          "c.id IN (" +
          "SELECT " +
          "chat_id " +
          "FROM " +
          "chat_app.user_chat " +
          "WHERE " +
          "user_id = $1" +
          ") " +
          "GROUP BY " +
          "c.id, c.created_at, c.updated_at",
        [userId]
      );

      client.release();

      if (result.rows.length === 0) return []; // No chats found for this user

      const chats = result.rows.map(
        (row: {
          chat_id: any;
          created_at: any;
          updated_at: any;
          members: number[];
        }) => ({
          id: row.chat_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          members: row.members,
        })
      );

      console.log(
        result.rows.map(
          (row: {
            chat_id: any;
            created_at: any;
            updated_at: any;
            members: any;
          }) => ({
            id: row.chat_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            members: row.members,
          })
        )
      );

      return chats;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async createChatAsync(newChat: PostChatDto): Promise<Chat | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const chatResult = await client.query(
        "INSERT INTO chat_app.chat (created_at, updated_at) VALUES (NOW(), NOW()) RETURNING id, created_at, updated_at"
      );

      if (chatResult.rows.length === 0) return undefined; // No chat found for this user

      const chatId = chatResult.rows[0].id;

      // Next, insert user associations in the user_chat table
      for (const member of newChat.members) {
        await client.query(
          "INSERT INTO chat_app.user_chat (user_id, chat_id) VALUES ($1, $2)",
          [member, chatId]
        );
      }

      // Fetch chat members after inserting them
      const memberResult = await client.query(
        "SELECT user_id FROM chat_app.user_chat WHERE chat_id = $1",
        [chatId]
      );

      client.release();

      if (memberResult.rows.length === 0) return undefined; // No chat found for this user

      const chatInfo = {
        id: chatId,
        created_at: chatResult.rows[0].created_at,
        updated_at: chatResult.rows[0].updated_at,
        members: memberResult.rows.map((row: { user_id: any }) => row.user_id),
      };

      return chatInfo;
    } catch (error) {
      console.log(error);
    }
  }
}
