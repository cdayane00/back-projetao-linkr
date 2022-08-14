import { Router } from "express";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";
import { sanitizeData } from "../utils/index.js";
import {
  createPost,
  listPosts,
  deletePost,
  updatePost,
  likeAPost,
  dislikeAPost,
} from "../controllers/postController.js";
import { handleHashtagsOnPost } from "../middlewares/hashtagMiddlewares.js";
import {
  checkLikeStatus,
  validateUserAndPost,
} from "../middlewares/likesMiddlewares.js";

export const postRouter = Router();

postRouter.post(
  "/post",
  tokenAuth,
  sanitizeData,
  validateBody("createPost"),
  handleHashtagsOnPost,
  createPost
);

postRouter.get("/timeline", tokenAuth, listPosts);

postRouter.delete("/post", tokenAuth, deletePost);

postRouter.patch(
  "/post",
  tokenAuth,
  sanitizeData,
  validateBody("updatePost"),
  handleHashtagsOnPost,
  updatePost
);

postRouter.post(
  "/post/:postId/like/:userId",
  tokenAuth,
  validateUserAndPost,
  checkLikeStatus("like"),
  likeAPost
);

postRouter.post(
  "/post/:postId/dislike/:userId",
  tokenAuth,
  validateUserAndPost,
  checkLikeStatus("dislike"),
  dislikeAPost
);
