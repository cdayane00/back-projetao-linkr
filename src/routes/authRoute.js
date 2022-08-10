import { Router } from "express";
import { createUser, signIn } from "../controllers/authController.js";
import { checkIfEmailIsRegistered } from "../middlewares/authMiddlewares.js";
import { validateBody } from "../middlewares/joiValidationMiddleware.js";
import { sanitizeData } from "../utils/index.js";

export const authRouter = Router();

authRouter.post(
  "/sign-up",
  sanitizeData,
  validateBody("signUp"),
  checkIfEmailIsRegistered,
  createUser
);

authRouter.post("/sign-in", sanitizeData, validateBody("signIn"), signIn);
