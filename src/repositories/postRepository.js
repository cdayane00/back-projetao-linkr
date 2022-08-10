import { connection } from "../dbStrategy/postgres/postgres.js";

export class PostRepository {
  static async createPost(post) {
    const { postText, metaTitle, metaText, metaUrl, metaImage, userId } = post;
    const query = {
      text: `
        INSERT INTO posts ("postText", "metaTitle", "metaText", "metaUrl", "metaImage", "userId")
        VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [postText, metaTitle, metaText, metaUrl, metaImage, userId],
    };

    return connection.query(query);
  }

  static async getPosts() {
    const query = {
      text: `
      SELECT * FROM posts
      ORDER BY "createdAt"
      LIMIT 20
      `,
    };
    return connection.query(query);
  }
}
