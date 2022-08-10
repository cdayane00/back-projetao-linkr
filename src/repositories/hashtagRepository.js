import { connection } from "../dbStrategy/postgres/postgres.js";

export class HashtagRepository {
  static async createHashtag(hashtagName) {
    const query = {
      text: `
      INSERT INTO hashtags (hashtag)
      VALUES ($1)
      RETURNING id`,
      values: [hashtagName],
    };

    return connection.query(query);
  }

  static async listAllHashtags() {
    const query = `
    SELECT 
      hashtags.id AS "hashtagId",
      hashtags.hashtag AS "hashtagName",
      COUNT("postsHashtags"."hashtagId") AS "postsCount"
    FROM hashtags
      JOIN "postsHashtags" ON hashtags.id = "postsHashtags"."hashtagId"
    GROUP BY hashtags.id
    ORDER BY "postsCount" DESC
    LIMIT 10;
    `;

    return connection.query(query);
  }

  static async getHashtagByName(hashtagName) {
    const query = {
      text: "SELECT * FROM hashtags WHERE hashtag = $1",
      values: [hashtagName],
    };

    return connection.query(query);
  }

  static async createRelationPostHashtag(postId, hashtagId) {
    const query = {
      text: `
        INSERT INTO "postsHashtags" ("postId", "hashtagId")
        VALUES ($1, $2)
        `,
      values: [postId, hashtagId],
    };

    return connection.query(query);
  }

  static async getHashtagsPosts(hashtagName) {
    const query = {
      text: `
        SELECT
            hashtags.id AS "hashtagId",
            hashtags.hashtag AS "hashtagName",
            jsonb_agg(jsonb_build_object('postId', posts.id,
                                        'userId', users.id,
                                        'userName', users.name,
                                        'userImage', users.photo,
                                        'postText', posts."postText",
                                        'postDate', posts."createdAt", 
                                        'metaTitle', posts."metaTitle",
                                        'metaText', posts."metaText",
                                        'metaImage', posts."metaImage",
                                        'metaUrl', posts."metaUrl",
                                        'likeCount', 999) ORDER BY posts."createdAt" DESC) AS "hashtagPosts"
        FROM
        "postsHashtags"
        JOIN
            hashtags ON "postsHashtags"."hashtagId" = hashtags.id
        RIGHT JOIN
            posts ON "postsHashtags"."postId" = posts.id
        JOIN
            users ON posts."userId" = users.id
        WHERE
            hashtags.hashtag = $1
        GROUP BY
            hashtags.id;
      `,
      values: [hashtagName],
    };

    return connection.query(query);
  }
}
