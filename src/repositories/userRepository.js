import sqlstring from "sqlstring";
import { connection } from "../dbStrategy/postgres/postgres.js";

export class UserRepository {
  static async createUser(name, email, password, imageUrl) {
    const query = {
      text: `
      INSERT INTO users (name, email, password, photo)
        VALUES ($1, $2, $3, $4)`,
      values: [name, email, password, imageUrl],
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

  static async getUserById(id) {
    const query = sqlstring.format(
      `
    SELECT users.id, users.name, users.photo FROM users WHERE users.id = ?`,
      [id]
    );
    return connection.query(query);
  }

  static async getPostsByUserId(id) {
    const query = sqlstring.format(
      `
      SELECT
      posts.id AS "postId",
      posts."postText",
      posts."createdAt" AS "postDate",
      posts."metaTitle", posts."metaText", posts."metaUrl", posts."metaImage",
      users.name AS "username",
      users.photo AS photo
      FROM posts
      JOIN users ON posts."userId" = users.id
      WHERE posts."userId" = ?
      ORDER BY posts."createdAt" DESC`,
      [id]
    );
    return connection.query(query);
  }
}
