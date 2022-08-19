import { useMetadata } from "../handlers/metadataHandler.js";
import { HashtagRepository } from "../repositories/hashtagRepository.js";
import { LikesRepository } from "../repositories/likesRepository.js";
import { PostRepository } from "../repositories/postRepository.js";
import { buildMultipleInsertsQuery } from "../utils/index.js";
import { UserRepository } from "../repositories/userRepository.js";
import { CommentsRepository } from "../repositories/commentsRepository.js";

export async function createPost(req, res) {
  const { userId } = res.locals.user;
  const { hashtagsIds, hashtagStrippedPostText: postText } = res.locals;
  const { postUrl } = res.locals.sanitizedData;

  const hashtagsRepository = new HashtagRepository(buildMultipleInsertsQuery);

  const result = await useMetadata(postUrl);
  const post = { ...result, postText, userId };

  try {
    const {
      rows: [postCreationResult],
    } = await PostRepository.createPost(post);

    if (hashtagsIds[0]) {
      await hashtagsRepository.createRelationPostHashtag(
        hashtagsIds,
        postCreationResult.id
      );
    }

    return res.status(201).send(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function listPosts(req, res) {
  const { userId } = res.locals.user;
  const { page, quantity } = req.query;
  const limit = quantity;

  const offset = page * 10;
  try {
    const {
      rows: [interaction],
    } = await UserRepository.userFollowsSomeone(userId);
    if (!interaction) return res.sendStatus(206);
    const { rows: posts } = await PostRepository.getPosts(
      userId,
      limit,
      offset
    );
    if (posts.length < 1 && page === "0") {
      return res.sendStatus(204);
    }
    return res.status(200).send(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deletePost(req, res) {
  const { id } = req.query;
  const { userId } = res.locals.user;

  try {
    const {
      rows: [body],
    } = await PostRepository.checkIfExists(id);
    if (!body) {
      return res.status(404).json({ error: "This post doesn't exists." });
    }
    if (body.userId !== userId) {
      return res
        .status(401)
        .json({ error: "You're not the owner of this post." });
    }

    await HashtagRepository.deleteAllRelationsPostHashtag(id);
    await CommentsRepository.deleteAllCommentsRelation(id);
    await LikesRepository.deleteAllLikeRelation(id);
    await PostRepository.deleteAllRepostRelations(id);

    await PostRepository.deletePost(id);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updatePost(req, res) {
  const { id } = req.query;
  const { userId } = res.locals.user;
  const { hashtagsIds, hashtagStrippedPostText: postText } = res.locals;

  const hashtagsRepository = new HashtagRepository(buildMultipleInsertsQuery);

  try {
    const {
      rows: [body],
    } = await PostRepository.checkIfExists(id);
    if (!body) {
      return res.status(404).json({ error: "This post doesn't exists." });
    }
    if (body.userId !== userId) {
      return res
        .status(401)
        .json({ error: "You're not the owner of this post." });
    }

    await HashtagRepository.deleteAllRelationsPostHashtag(id);

    if (hashtagsIds[0]) {
      await hashtagsRepository.createRelationPostHashtag(hashtagsIds, id);
    }

    await PostRepository.updatePost(postText, id);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function likeAPost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    await LikesRepository.likePost(postId, userId);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function dislikeAPost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    await LikesRepository.dislikePost(postId, userId);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function repostAPost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const {
      rows: [share],
    } = await PostRepository.validateRepost(userId, postId);

    if (!share) {
      await PostRepository.createRepost(userId, postId);
      return res.sendStatus(201);
    }
    return res.status(401).send("You can't repost");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
