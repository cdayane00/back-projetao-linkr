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

  static async getHashtagsPosts(hashtagName, offset) {
    const query = {
      text: `
      SELECT
        posts.id AS "postId",
        posts."postText",
        posts."createdAt" AS "postDate",
        posts."userId",
        users.name AS "username",
        users.photo,
        posts."metaTitle",
        posts."metaText",
        posts."metaImage",
        posts."metaUrl",
        COUNT(distinct comments) AS "commentsCount",
	      COUNT(distinct likes) AS "likeCount",
        jsonb_agg(distinct jsonb_build_object('userId', likes."userId", 'likedBy', users_likes.name))  AS "postLikesData"
      FROM
        "postsHashtags"
        JOIN
          hashtags ON "postsHashtags"."hashtagId" = hashtags.id
        RIGHT JOIN
          posts ON "postsHashtags"."postId" = posts.id
        JOIN
          users ON posts."userId" = users.id
        LEFT JOIN
          likes ON posts.id = likes."postId"
        LEFT JOIN 
		      comments ON comments."postId" = posts.id
        LEFT JOIN
          users AS users_likes ON likes."userId" = users_likes.id
      WHERE
        hashtags.hashtag = $1
      GROUP BY
        hashtags.id, posts.id, users.id
      ORDER BY
        posts."createdAt" DESC
      LIMIT 10
      OFFSET $2
      `,
      values: [hashtagName, offset],
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
