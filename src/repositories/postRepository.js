import { connection } from "../dbStrategy/postgres/postgres.js";

export class PostRepository {
  static async createPost(post) {
    const { postText, metaTitle, metaText, metaUrl, metaImage, userId } = post;
    const query = {
      text: `
        INSERT INTO posts ("postText", "metaTitle", "metaText", "metaUrl", "metaImage", "userId")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
      values: [postText, metaTitle, metaText, metaUrl, metaImage, userId],
    };

    return connection.query(query);
  }

  static async getPosts() {
    const query = {
      text: `
      SELECT posts.*, users.name as username, users.photo as photo FROM posts
      JOIN users ON posts."userId" = users.id
      ORDER BY "createdAt" DESC
      LIMIT 20
      `,
    };
    return connection.query(query);
  }

  static async checkIfExists(id) {
    const query = {
      text: `
      SELECT * FROM posts WHERE id = $1 
      `,
      values: [id],
    };
    return connection.query(query);
  }

  static async updatePost(postText, id) {
    console.log(postText, id);
    const query = {
      text: `
      UPDATE posts
      SET "postText"= $1
      WHERE id = $2
      `,
      values: [postText, id],
    };
    return connection.query(query);
  }

  static async deletePost(id) {
    const query = {
      text: `
      DELETE FROM posts WHERE id = $1
      `,
      values: [id],
    };
    return connection.query(query);
  }
}
