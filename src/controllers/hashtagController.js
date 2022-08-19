import { HashtagRepository } from "../repositories/hashtagRepository.js";

export async function getPostsByHashtagName(req, res) {
  const { hashtag } = res.locals;
  const { page, quantity } = req.query;
  const limit = quantity;
  const offset = page * 10;
  try {
    const { hashtag: name } = hashtag;

    const { rows: postsByHashtag } = await HashtagRepository.getHashtagsPosts(
      name,
      limit,
      offset
    );

    return res.status(200).send(postsByHashtag);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function listTrendingHashtags(_req, res) {
  try {
    const { rows: hashtagsList } =
      await HashtagRepository.listTrendingHashtags();

    return res.status(200).send(hashtagsList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
