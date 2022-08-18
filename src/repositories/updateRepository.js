import { connection } from "../dbStrategy/postgres/postgres.js";

export class UpdateRepository {
  static async checkUserPost(id, timestamp) {
    const query = {
      text: `
      SELECT COALESCE(COUNT(posts.id),0)
      FROM posts
      WHERE "userId"=$1 AND posts."createdAt" > $2
      
     `,
      values: [id, timestamp],
    };
    console.log(timestamp);
    return connection.query(query);
  }

  static async checkHashtagPosts(hashtag, timestamp) {
    const query = {
      text: `
      SELECT COALESCE(COUNT("postsHashtags"."postId"), 0)
      FROM "postsHashtags"
      JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
      WHERE hashtags.hashtag = $1 AND "postHashtags"."createdAd" > $2
      `,
      values: [hashtag, timestamp],
    };
    return connection.query(query);
  }

  static async checkTimelinePosts(userId, timestamp) {
    const query = {
      text: `
      SELECT COALESCE(COUNT(posts.id),0)
      FROM posts
      JOIN followers ON posts."userId" = followers."followedId"
        WHERE followers."whoFollow" = $1 AND posts."createdAt" > $2
      `,
      values: [userId, timestamp],
    };
    return connection.query(query);
  }
}
