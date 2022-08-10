import { Router } from "express";
import {
  getPostsByHashtagName,
  listHashtags,
} from "../controllers/hashtagController.js";
import { checkIfHashtagExists } from "../middlewares/hashtagMiddlewares.js";

export const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", listHashtags);

hashtagsRouter.get(
  "/hashtags/:hashtag",
  checkIfHashtagExists,
  getPostsByHashtagName
);
