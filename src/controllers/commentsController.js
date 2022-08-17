import { CommentsRepository } from "../repositories/commentsRepository.js";

export async function commentOnPost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const { commentText } = res.locals.sanitizedData;

  try {
    await CommentsRepository.createComment(userId, postId, commentText);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getPostsComments(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const { rows: commentsFromPost } =
      await CommentsRepository.getCommentByPostId(postId, userId);

    return res.status(200).send(commentsFromPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
