import { HashtagRepository } from "../repositories/hashtagRepository.js";
import {
  buildMultipleInsertsQuery,
  findHashtagsInsideString,
} from "../utils/index.js";

export async function checkIfHashtagExists(req, res, next) {
  const { hashtag: hashtagName } = req.params;

  if (!hashtagName) {
    return res.status(400).json({ error: "Invalid params", status: 400 });
  }

  try {
    const {
      rows: [hashtag],
    } = await HashtagRepository.getHashtagByName(hashtagName);

    if (!hashtag) {
      return res.status(404).json({ error: "Hashtag not found", status: 404 });
    }

    res.locals.hashtag = hashtag;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal error", status: 500 });
  }
}

export async function handleHashtagsOnPost(req, res, next) {
  const { postText } = res.locals.sanitizedData;
  const hashtagRepository = new HashtagRepository(buildMultipleInsertsQuery);

  const hashtagsArray = findHashtagsInsideString(postText);

  try {
    const { rows: allHashtags } = await HashtagRepository.listAllHashtags();
    let hashtagsIds = [];

    const filteredNewHashtags = hashtagsArray.filter(
      (hashtagFromPost) =>
        !allHashtags.some(({ hashtag }) => hashtag === hashtagFromPost)
    );

    const existingHashtags = allHashtags.filter(({ hashtag }) =>
      hashtagsArray.some((tag) => tag === hashtag)
    );

    hashtagsIds = [...existingHashtags.map((hashtag) => hashtag.id)];

    if (filteredNewHashtags.length > 0) {
      const { rows: insertResult } = await hashtagRepository.createHashtag(
        filteredNewHashtags
      );

      insertResult.map(({ id }) => hashtagsIds.push(id));
    }

    res.locals.hashtagsIds = hashtagsIds;

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
