import { Router } from "express";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";
import { checkNewPosts } from "../controllers/updateController.js";

export const updateRouter = Router();

updateRouter.get("/update", tokenAuth, checkNewPosts);
