import { Router } from "express";

export const hashtagsRouter = Router();

// return every post that contains the hashtag passed as param
hashtagsRouter.get("/hashtags/:hashtag");
