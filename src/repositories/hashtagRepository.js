import { connection } from "../dbStrategy/postgres/postgres.js";

export class HashtagRepository {
  constructor(buildMultipleInsertsQuery) {
    this.buildMultipleInsertsQuery = buildMultipleInsertsQuery;
  }

  async createHashtag(hashtagArray) {
    const inserts = this.buildMultipleInsertsQuery(hashtagArray);
    const query = {
      text: `
      INSERT INTO hashtags (hashtag)
      VALUES ${inserts}
      RETURNING id`,
    };

    return connection.query(query);
  }

  async createRelationPostHashtag(hashtagsIdsArray, postId) {
    const insert = this.buildMultipleInsertsQuery(hashtagsIdsArray, postId);

    const query = `
        INSERT INTO "postsHashtags" ("postId", "hashtagId")
        VALUES ${insert}
        `;

    return connection.query(query);
  }

  // Static Methods

  static async listAllHashtags() {
    const query = "SELECT * FROM hashtags";

    return connection.query(query);
  }

  static async listTrendingHashtags() {
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

  static async getHashtagsPosts(hashtagName) {
    const query = {
      text: `
        SELECT
            hashtags.id AS "hashtagId",
            hashtags.hashtag AS "hashtagName",
            jsonb_agg(jsonb_build_object('postId', posts.id,
                                        'userId', users.id,
                                        'username', users.name,
                                        'photo', users.photo,
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

  static async deleteAllRelationsPostHashtag(postId) {
    const query = {
      text: `
        DELETE FROM "postsHashtags"
        WHERE "postId" = $1
      `,
      values: [postId],
    };

    return connection.query(query);
  }
}
