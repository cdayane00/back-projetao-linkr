import { Router } from "express";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";
import { sanitizeData } from "../utils/index.js";
import {
  createPost,
  listPosts,
  deletePost,
  updatePost,
} from "../controllers/postController.js";

export const postRouter = Router();

postRouter.post(
  "/post",
  tokenAuth,
  sanitizeData,
  validateBody("createPost"),
  createPost
);

postRouter.get("/timeline", tokenAuth, listPosts);

postRouter.delete("/post", tokenAuth, deletePost);

postRouter.patch(
  "/post",
  tokenAuth,
  sanitizeData,
  validateBody("updatePost"),
  updatePost
);
