import { Router } from "express";
import { getPostsByHashtagName } from "../controllers/hashtagController.js";
import { checkIfHashtagExists } from "../middlewares/hashtagMiddlewares.js";

export const hashtagsRouter = Router();

// return every post that contains the hashtag passed as param
hashtagsRouter.get(
  "/hashtags/:hashtag",
  checkIfHashtagExists,
  getPostsByHashtagName
);
