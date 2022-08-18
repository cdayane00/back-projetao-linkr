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
    JOIN followers ON followers."followedId" = users.id
    WHERE users.name ILIKE ${sqlstring.escape(
      `${name}%`
    )} GROUP BY users.id ORDER BY "isFollowing" DESC
    `;
    return connection.query(query);
  }

  static async getPostsByUserId(id) {
    const query = sqlstring.format(
      `
      SELECT POSTS.ID AS "postId",
      POSTS."postText",
      POSTS."createdAt" AS "postDate",
      POSTS."userId",
      USERS.NAME AS "username",
      USERS.PHOTO,
      POSTS."metaTitle",
      POSTS."metaText",
      POSTS."metaImage",
      POSTS."metaUrl",
      COUNT(DISTINCT COMMENTS) AS "commentsCount",
      COUNT(DISTINCT LIKES) AS "likeCount",
      COUNT(DISTINCT SHARES) AS "sharesCount",
      JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('userId',

      LIKES."userId",
      'likedBy',
      USERS_LIKES.NAME)) AS "postLikesData"
      FROM POSTS
      JOIN USERS ON POSTS."userId" = USERS.ID
      LEFT JOIN LIKES ON POSTS.ID = LIKES."postId"
      LEFT JOIN COMMENTS ON COMMENTS."postId" = POSTS.id
      LEFT JOIN SHARES ON SHARES."postId" = POSTS.ID
      LEFT JOIN USERS AS USERS_LIKES ON LIKES."userId" = USERS_LIKES.ID
      WHERE POSTS."userId" = ? OR SHARES."whoShared" = ?
      GROUP BY POSTS.ID,
          USERS.ID
      ORDER BY POSTS."createdAt" DESC;
    `,
      [id, id]
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
      text: `SELECT FROM followers
      WHERE "whoFollow"= $1`,
      values: [userId],
    };
    return connection.query(query);
  }
}
