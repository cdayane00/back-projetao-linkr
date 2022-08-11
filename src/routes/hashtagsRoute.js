import { Router } from "express";

import {
  getPostsByHashtagName,
  listTrendingHashtags,
} from "../controllers/hashtagController.js";

import { checkIfHashtagExists } from "../middlewares/hashtagMiddlewares.js";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";

export const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", tokenAuth, listTrendingHashtags);

hashtagsRouter.get(
  "/hashtags/:hashtag",
  tokenAuth,
  checkIfHashtagExists,
  getPostsByHashtagName
);
