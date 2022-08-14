import { HashtagRepository } from "../repositories/hashtagRepository.js";

export async function getPostsByHashtagName(req, res) {
  const { hashtag } = res.locals;

  try {
    const { hashtag: name } = hashtag;

    const { rows: postsByHashtag } = await HashtagRepository.getHashtagsPosts(
      name
    );

    return res.status(200).send(postsByHashtag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

export async function listTrendingHashtags(_req, res) {
  try {
    const { rows: hashtagsList } =
      await HashtagRepository.listTrendingHashtags();

    return res.status(200).send(hashtagsList);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
