import { Router } from "express";
import {
  getUserById,
  getUsersByName,
  followAnUser,
  unfollowAnUser,
} from "../controllers/userController.js";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";

export const userRouter = Router();

userRouter.get("/user/:id", tokenAuth, getUserById);
userRouter.get("/users/", tokenAuth, getUsersByName);
userRouter.post("/user/:id/interaction", tokenAuth, followAnUser);
userRouter.delete("/user/:id/interaction", tokenAuth, unfollowAnUser);
