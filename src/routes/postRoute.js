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
  repostAPost,
} from "../controllers/postController.js";
import { handleHashtagsOnPost } from "../middlewares/hashtagMiddlewares.js";
import {
  checkLikeStatus,
  validateUserAndPost,
} from "../middlewares/likesMiddlewares.js";
import {
  commentOnPost,
  getPostsComments,
} from "../controllers/commentsController.js";

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
  "/post/:postId/like",
  tokenAuth,
  validateUserAndPost,
  checkLikeStatus("like"),
  likeAPost
);

postRouter.post(
  "/post/:postId/dislike",
  tokenAuth,
  validateUserAndPost,
  checkLikeStatus("dislike"),
  dislikeAPost
);

postRouter.post(
  "/post/:postId/comments",
  tokenAuth,
  validateUserAndPost,
  sanitizeData,
  validateBody("createComment"),
  commentOnPost
);

postRouter.get(
  "/post/:postId/comments",
  tokenAuth,
  validateUserAndPost,
  getPostsComments
);

postRouter.post(
  "/post/:postId/shares",
  tokenAuth,
  validateUserAndPost,
  repostAPost
);
