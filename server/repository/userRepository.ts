const pgPoolWrapper = require(".././connection"); // import pgPoolWrapper

import { UserRepository } from "./interface/userRepository";

export class PostgresUserRepository implements UserRepository {
  constructor() {}

  async getUserByEmailAsync(email: string) {
    // Database query logic to find a user by ID
    try {
      const client = await pgPoolWrapper.connect();

      return await client.query(
        "SELECT * FROM chat_app.user WHERE email = $1",
        [email]
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createUserAsync(user: any)  {
    try {
      const client = await pgPoolWrapper.connect();

      await client.query(
        "INSERT INTO chat_app.user (userName, email, password) VALUES ($1, $2, $3) RETURNING *",
        [user.username, user.email, user.password]
      );
    } catch (error) {
      console.log(error);
    }
  }
}
