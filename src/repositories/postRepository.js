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

  static async getPosts(userId, offset) {
    const query = {
      text: `
      SELECT
        posts.id AS "postId",
        posts."postText",
        posts."createdAt" AS "postsDate",
        posts."metaTitle", posts."metaText", posts."metaUrl", posts."metaImage",
        posts."userId",
        users."name" AS "username",
        users."photo" AS "photo",
        COUNT(distinct comments) AS "commentsCount",
	      COUNT(distinct likes) AS "likeCount",
        jsonb_agg(distinct jsonb_build_object('userId', likes."userId", 'likedBy', users_likes.name))  AS "postLikesData"
      FROM
        posts
        JOIN 
          users ON posts."userId" = users.id
        LEFT JOIN
          likes ON posts.id = likes."postId"
        LEFT JOIN 
		      comments ON comments."postId" = posts.id
        LEFT JOIN users AS users_likes ON likes."userId" = users_likes.id
        JOIN followers ON posts."userId" = followers."followedId"
        WHERE "whoFollow" = $1
      GROUP BY posts.id, users.id
      ORDER BY posts."createdAt" DESC
      LIMIT 10
      OFFSET $2
      `,
      values: [userId, offset],
    };
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
}
