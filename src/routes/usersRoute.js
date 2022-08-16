import { Router } from "express";
import {
  getUserById,
  getUsersByName,
  followAnUser,
  unfollowAnUser,
} from "../controllers/userController.js";
import { tokenAuth } from "../middlewares/tokenMiddleware.js";

export const userRoute = Router();

userRoute.get("/user/:id", tokenAuth, getUserById);
userRoute.get("/users/", tokenAuth, getUsersByName);
userRoute.post("/user/:id/interaction", tokenAuth, followAnUser);
userRoute.delete("/user/:id/interaction", tokenAuth, unfollowAnUser);
