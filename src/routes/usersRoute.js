import { Router } from "express";
import { getUserById } from "../controllers/userController.js";

export const userRoute = Router();

userRoute.get("/user/:id", getUserById);
