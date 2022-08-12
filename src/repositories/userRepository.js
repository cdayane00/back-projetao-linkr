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
    SELECT users.id, users.name, users.photo, 
            json_agg(json_build_object(
                'userPhoto', users.photo,
                'userName', users.name,
                'postId', posts.id,
                'postText', posts."postText",
                'postDate', posts."createdAt", 
                'metaTitle', posts."metaTitle",
                'metaText', posts."metaText",
                'metaImage', posts."metaImage",
                'metaUrl', posts."metaUrl",
                'likeCount', 999) ORDER BY posts."createdAt" DESC) AS "userPosts"
                FROM users LEFT JOIN posts ON posts."userId" = users.id WHERE users.id = ? 
                GROUP BY users.id`,
      [id]
    );
    return connection.query(query);
  }
}
