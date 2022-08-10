import { Router } from "express";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";

export const tokenRouter = Router();

tokenRouter.post("/post", tokenAuth, validateBody("post"));
