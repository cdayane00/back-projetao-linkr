import { Router } from "express";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";
import { sanitizeData } from "../utils/index.js";
import { createPost, listPosts } from "../controllers/postController.js";

export const postRouter = Router();

postRouter.post(
  "/timeline",
  tokenAuth,
  sanitizeData,
  validateBody("post"),
  createPost
);

postRouter.get("/timeline", tokenAuth, listPosts);
