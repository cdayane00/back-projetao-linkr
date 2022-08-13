import { Router } from "express";
import { getUserById, getUsersByName } from "../controllers/userController.js";

export const userRoute = Router();

userRoute.get("/user/:id", getUserById);
userRoute.get("/users/:name", getUsersByName);
