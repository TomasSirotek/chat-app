import { PostUserDto, User } from "../model/user";
import "reflect-metadata"
const pgPoolWrapper = require(".././connection"); // import pgPoolWrapper


export class UserRepository {
  constructor() {}

  async getUserByEmailAsync(email: string):  Promise<User | undefined>  {
    // Database query logic to find a user by ID
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

  async createUserAsync(user: PostUserDto) : Promise<User | undefined>  {
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
    return undefined;
  }
}
