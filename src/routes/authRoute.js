import { Router } from "express";
import { createUser, signIn } from "../controllers/authController.js";
import { checkIfEmailIsRegistered } from "../middlewares/authMiddlewares.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";

export const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateBody("signUp"),
  checkIfEmailIsRegistered,
  createUser
);

authRouter.post("/sign-in", validateBody("signIn"), signIn);
