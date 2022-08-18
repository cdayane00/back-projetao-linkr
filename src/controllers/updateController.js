import { UpdateRepository } from "../repositories/updateRepository.js";

export async function checkNewPosts(req, res) {
  const { userId } = res.locals.user;
  const { user, hashtag, timeline, timestamp } = req.query;
  if (user) {
    try {
      const {
        rows: [number],
      } = await UpdateRepository.checkUserPost(user, timestamp);
      return res.status(200).send(number);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  if (hashtag) {
    try {
      const {
        rows: [number],
      } = await UpdateRepository.checkHashtagPosts(hashtag, timestamp);
      return res.status(200).send(number);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  if (timeline) {
    try {
      const {
        rows: [number],
      } = await UpdateRepository.checkTimelinePosts(userId, timestamp);
      return res.status(200).send(number);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
