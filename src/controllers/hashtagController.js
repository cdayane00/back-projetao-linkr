import { HashtagRepository } from "../repositories/hashtagRepository.js";

export async function getPostsByHashtagName(req, res) {
  const { hashtag } = res.locals;

  try {
    const { hashtag: name } = hashtag;

    const {
      rows: [postsByHashtag],
    } = await HashtagRepository.getHashtagsPosts(name);

    return res.status(200).send(postsByHashtag);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
