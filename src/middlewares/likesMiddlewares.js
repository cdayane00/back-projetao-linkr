import chalk from "chalk";
import { LikesRepository } from "../repositories/likesRepository.js";
import { PostRepository } from "../repositories/postRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

export async function validateUserAndPost(req, res, next) {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserById(userId);
    const {
      rows: [post],
    } = await PostRepository.checkIfExists(postId);

    if (!user) {
      console.log(chalk.red.bold("User not found"));
      return res.status(404).json({ error: "User not found" });
    }

    if (!post) {
      console.log(chalk.red.bold("Post not found"));
      return res.status(404).json({ error: "Post not found" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export function checkLikeStatus(likeRoute) {
  const likeRoutes = ["like", "dislike"];

  if (!likeRoutes.some((value) => value !== likeRoute)) {
    throw new Error("Invalid validator");
  }

  return async function handleLike(req, res, next) {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    try {
      const {
        rows: [postLikeRelation],
      } = await LikesRepository.searchLike(postId, userId);

      if (likeRoute === "like" && postLikeRelation) {
        return res
          .status(409)
          .json({ error: "This user already liked the post" });
      }

      if (likeRoute === "dislike" && !postLikeRelation) {
        return res.status(400).json({ error: "Unable to dislike" });
      }

      return next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };
}
