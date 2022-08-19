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
    COALESCE(COUNT(followers."followedId"), 0) as "followersCount"
    FROM users
    LEFT JOIN followers ON followers."followedId" = users.id
    WHERE users.id = ?
    GROUP BY users.id`,
      [id]
    );
    return connection.query(query);
  }

  static async getUsersByName(name, userId) {
    const query = `SELECT users.id, users.name, users.photo,
    (case when exists (SELECT * FROM followers WHERE "whoFollow" = ${sqlstring.escape(
      userId
    )} 
    AND "followedId" = users.id)
    then CAST(1 AS int)
    else CAST(0 AS int)
    end) AS "isFollowing"
    FROM users
    LEFT JOIN followers ON followers."followedId" = users.id
    WHERE users.name ILIKE ${sqlstring.escape(
      `${name}%`
    )} GROUP BY users.id ORDER BY "isFollowing" DESC
    `;
    return connection.query(query);
  }

  static async getPostsByUserId(id, limit, offset) {
    const query = sqlstring.format(
      `
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
              WHERE POSTS."userId" = ?
              GROUP BY POSTS.ID,
                USERS.ID)
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
                WHERE SHARES."whoShared" = ?
                GROUP BY POSTS.ID,
                  USERS.ID,
                  SHARES.ID,
                  USERS_WHO_SHARED.ID)) AS USER_PAGE_POSTS
      ORDER BY USER_PAGE_POSTS."postsDate" DESC
      LIMIT ?
      OFFSET ?
    `,
      [id, id, limit, offset]
    );
    return connection.query(query);
  }

  static async thisInteractionExists(userId, id) {
    const query = sqlstring.format(
      `
      SELECT * FROM followers
      WHERE "whoFollow" = ? AND "followedId" = ?
      `,
      [userId, id]
    );
    return connection.query(query);
  }

  static async followThisUser(userId, id) {
    const query = sqlstring.format(
      `
    INSERT INTO followers
    ("whoFollow", "followedId")
    VALUES
    (?, ?)`,
      [userId, id]
    );
    return connection.query(query);
  }

  static async unfollowThisUser(userId, id) {
    const query = sqlstring.format(
      `
    DELETE FROM followers
    WHERE "whoFollow" = ? AND "followedId" = ?
    `,
      [userId, id]
    );
    return connection.query(query);
  }

  static async userFollowsSomeone(userId) {
    const query = {
      text: `SELECT * FROM followers
      WHERE "whoFollow"= $1`,
      values: [userId],
    };
    return connection.query(query);
  }
}
