import { connection } from "../dbStrategy/postgres/postgres.js";

export class LikesRepository {
  static async likePost(postId, userId) {
    const query = {
      text: `
        INSERT INTO "likes" ("postId", "userId")
        VALUES ($1, $2)`,
      values: [postId, userId],
    };

    return connection.query(query);
  }

  static async dislikePost(postId, userId) {
    const query = {
      text: `
        DELETE FROM "likes"
        WHERE "postId" = $1 AND "userId" = $2`,
      values: [postId, userId],
    };

    return connection.query(query);
  }

  static async searchLike(postId, userId) {
    const query = {
      text: `
        SELECT * FROM likes
        WHERE "postId" = $1 AND "userId" = $2`,
      values: [postId, userId],
    };

    return connection.query(query);
  }
}
