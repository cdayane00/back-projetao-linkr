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
