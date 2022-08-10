import { useMetadata } from "../handlers/metadataHandler.js";
import { PostRepository } from "../repositories/postRepository.js";

export async function createPost(req, res) {
  const { userId } = res.locals.user;
  const { postText, postUrl } = res.locals.sanitizedData;
  const result = await useMetadata(postUrl);
  const post = { ...result, postText, userId };
  try {
    await PostRepository.createPost(post);
    return res.status(201).send(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function listPosts(req, res) {
  try {
    const { rows } = await PostRepository.getPosts();
    return res.status(200).send(rows);
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
    await PostRepository.deletePost(id);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updatePost(req, res) {
  const { id } = req.query;
  const { userId } = res.locals.user;
  const { postText } = res.locals.sanitizedData;

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
    await PostRepository.updatePost(postText, id);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}