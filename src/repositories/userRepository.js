import { connection } from "../dbStrategy/postgres/postgres.js";

export class UserRepository {
  static async createUser(name, email, password, imageId) {
    const query = {
      text: `
      INSERT INTO users (name, email, password, profile_pic_id)
        VALUES ($1, $2, $3, $4)`,
      values: [name, email, password, imageId],
    };

    return connection.query(query);
  }

  static async getUserByEmail(email) {
    const query = {
      text: `
      SELECT * FROM users WHERE email = $1
      `,
      values: [email],
    };
    return connection.query(query);
  }
}
