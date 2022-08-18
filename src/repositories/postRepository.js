import sqlstring from "sqlstring";
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

  static async getPosts(userId, limit, offset) {
    const query = `
      SELECT *
      FROM (
            (SELECT POSTS.ID AS "postId",
                POSTS."postText",
                POSTS."createdAt" AS "postsDate",
                POSTS."metaTitle",
                POSTS."metaText",
                POSTS."metaUrl",
                POSTS."metaImage",
                POSTS."userId",
                USERS."name" AS "username",
                USERS."photo" AS "photo",
                NULL AS "whoSharedName",
                NULL AS "whoSharedId",
                COUNT(DISTINCT COMMENTS) AS "commentsCount",
                COUNT(DISTINCT LIKES) AS "likeCount",
                COUNT(DISTINCT SHARES_COUNT) AS "sharesCount",
                JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('userId',
                                                        LIKES."userId",
                                                        'likedBy',
                                                        USERS_LIKES.NAME)) AS "postLikesData"
              FROM POSTS
              JOIN USERS ON POSTS."userId" = USERS.ID
              LEFT JOIN LIKES ON POSTS.ID = LIKES."postId"
              LEFT JOIN COMMENTS ON COMMENTS."postId" = POSTS.ID
              LEFT JOIN SHARES ON SHARES."postId" = POSTS.ID
              LEFT JOIN SHARES AS SHARES_COUNT ON SHARES_COUNT."postId" = POSTS.ID
              LEFT JOIN USERS AS USERS_LIKES ON LIKES."userId" = USERS_LIKES.ID
              LEFT JOIN FOLLOWERS ON POSTS."userId" = FOLLOWERS."followedId"
              WHERE FOLLOWERS."whoFollow" = ${sqlstring.escape(userId)}
              GROUP BY POSTS.ID,
                USERS.ID,
                SHARES.ID)
          UNION ALL
            (SELECT POSTS.ID AS "postId",
                POSTS."postText",
                SHARES."createdAt" AS "postsDate",
                POSTS."metaTitle",
                POSTS."metaText",
                POSTS."metaUrl",
                POSTS."metaImage",
                POSTS."userId",
                USERS."name" AS "username",
                USERS."photo" AS "photo",
                USERS_WHO_SHARED.NAME AS "whoSharedName",
                USERS_WHO_SHARED.ID AS "whoSharedId",
                COUNT(DISTINCT COMMENTS) AS "commentsCount",
                COUNT(DISTINCT LIKES) AS "likeCount",
                COUNT(DISTINCT SHARES_COUNT) AS "sharesCount",
                JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('userId',
                                                        LIKES."userId",
                                                        'likedBy',
                                                        USERS_LIKES.NAME)) AS "postLikesData"
              FROM POSTS
              JOIN USERS ON POSTS."userId" = USERS.ID
              LEFT JOIN LIKES ON POSTS.ID = LIKES."postId"
              LEFT JOIN COMMENTS ON COMMENTS."postId" = POSTS.ID
              LEFT JOIN SHARES ON SHARES."postId" = POSTS.ID
              LEFT JOIN SHARES AS SHARES_COUNT ON SHARES_COUNT."postId" = POSTS.ID
              LEFT JOIN USERS AS USERS_LIKES ON LIKES."userId" = USERS_LIKES.ID
              LEFT JOIN USERS AS USERS_WHO_SHARED ON SHARES."whoShared" = USERS_WHO_SHARED.ID
              LEFT JOIN FOLLOWERS ON POSTS."userId" = FOLLOWERS."followedId"
              WHERE SHARES."whoShared" IN
                  (SELECT FOLLOWERS."followedId"
                    FROM FOLLOWERS
                    WHERE FOLLOWERS."whoFollow" = ${sqlstring.escape(userId)} )
              GROUP BY POSTS.ID,
                USERS.ID,
                SHARES.ID,
                USERS_WHO_SHARED.ID)) AS TIMELINE_POSTS
      ORDER BY TIMELINE_POSTS."postsDate" DESC
      LIMIT ${sqlstring.escape(limit)}
      OFFSET ${sqlstring.escape(offset)}
      `;
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

  static async createRepost(whoShared, postId) {
    const query = {
      text: `INSERT INTO shares ("whoShared", "postId") VALUES ($1, $2)`,
      values: [whoShared, postId],
    };
    return connection.query(query);
  }

  static async validateRepost(whoShared, postId) {
    const query = {
      text: `SELECT * FROM shares WHERE "whoShared" = $1 AND "postId" = $2`,
      values: [whoShared, postId],
    };
    return connection.query(query);
  }
}
