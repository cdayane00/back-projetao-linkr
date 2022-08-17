import SqlString from "sqlstring";
import { connection } from "../dbStrategy/postgres/postgres.js";

export class CommentsRepository {
  static async createComment(whoCommentedId, postId, commentText) {
    const query = {
      text: `
            INSERT INTO comments ("whoCommented", "postId", "comment")
            VALUES ($1, $2, $3)
          `,
      values: [whoCommentedId, postId, commentText],
    };

    return connection.query(query);
  }

  static async getCommentByPostId(postId, userId) {
    const query = `
      SELECT 
        comments.*,
        users_comment.name AS username,
        users_comment.photo AS photo,
        (case when exists (SELECT * FROM followers WHERE "whoFollow" = ${SqlString.escape(
          userId
        )} AND "followedId" = comments."whoCommented")
          then CAST(1 AS int)
          else CAST(0 AS int)
        end) AS "isFollowing",
        (case when comments."whoCommented" = posts."userId" then CAST(1 AS int) else CAST(0 AS int) end) AS "isFromAuthor"
      FROM
        comments
          JOIN
            posts ON comments."postId" = posts.id
          JOIN
            users ON posts."userId" = users.id
          JOIN
		  	    users as users_comment ON comments."whoCommented" = users_comment.id
      WHERE comments."postId" = ${SqlString.escape(postId)}
      ORDER BY comments."createdAt" ASC`;

    return connection.query(query);
  }

  static async deleteAllCommentsRelation(postId) {
    const query = `
        DELETE FROM comments WHERE "postId" = ${SqlString.escape(postId)}`;

    return connection.query(query);
  }
}
