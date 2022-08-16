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

  static async getUsersByName(name) {
    const query = `SELECT users.id, users.name, users.photo FROM users WHERE users.name ILIKE ${sqlstring.escape(
      `${name}%`
    )}`;
    return connection.query(query);
  }

  static async getPostsByUserId(id) {
    const query = sqlstring.format(
      `
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
        COUNT(likes.id) AS "likeCount",
        jsonb_agg(jsonb_build_object('userId', likes."userId", 'likedBy', users_likes.name))  AS "postLikesData"
      FROM
        posts
        JOIN
          users ON posts."userId" = users.id
        LEFT JOIN
          likes ON posts.id = likes."postId"
        LEFT JOIN
          users AS users_likes ON likes."userId" = users_likes.id
      WHERE
        users.id = ?
      GROUP BY
        posts.id, users.id
      ORDER BY
        posts."createdAt" DESC
    `,
      [id]
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
