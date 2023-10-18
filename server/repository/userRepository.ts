import { PostUserDto, User } from "../model/user";
import "reflect-metadata";
const pgPoolWrapper = require(".././connection"); // import pgPoolWrapper

export class UserRepository {
 
  constructor() {}

  async getAllUsersAsync(): Promise<User[] | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query("SELECT * FROM chat_app.user ");

      client.release();

      return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User | undefined>{
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT * FROM chat_app.user WHERE refresh_token = $1 ",
        [refreshToken]
      );

      client.release();

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }
  }
  async updateUserAsync(existingUser: User): Promise<User | undefined> {

    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "UPDATE chat_app.user SET refresh_token = $1 WHERE id = $2 RETURNING *",
        [existingUser.refreshToken, existingUser.id]
      );

      client.release();

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }


  }

  async getUserByEmailAsync(email: string): Promise<User | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT * FROM chat_app.user WHERE email = $1 ",
        [email]
      );

      client.release();

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByIdAsync(id: number): Promise<User | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "SELECT * FROM chat_app.user WHERE id = $1 ",
        [id]
      );

      client.release();

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
    }
  }

  async createUserAsync(user: PostUserDto): Promise<User | undefined> {
    try {
      const client = await pgPoolWrapper.connect();

      const result = await client.query(
        "INSERT INTO chat_app.user (userName, email, password) VALUES ($1, $2, $3) RETURNING *",
        [user.username, user.email, user.password]
      );
      client.release();
      return result.rows[0];
    } catch (error) {
      console.log(error);
    }
  }
}
