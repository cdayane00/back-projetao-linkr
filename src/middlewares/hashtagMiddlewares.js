import { HashtagRepository } from "../repositories/hashtagRepository.js";

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
