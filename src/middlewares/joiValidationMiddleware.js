import chalk from "chalk";

// Schemas
import {
  signInSchema as signIn,
  signUpSchema as signUp,
} from "../schemas/authSchemas.js";
import { postSchema as post } from "../schemas/postSchemas.js";

const Schemas = {
  signUp,
  signIn,
  post,
};

export function validateBody(validator) {
  if (!Object.hasOwn(Schemas, validator)) {
    throw new Error("Invalid validator");
  }

  return (req, res, next) => {
    const { error } = Schemas[validator].validate(res.locals.sanitizedData, {
      abortEarly: false,
    });

    if (error) {
      console.log(
        chalk.red.bold(error.details.map((detail) => detail.message))
      );

      return res
        .status(422)
        .send(error.details.map((detail) => detail.message));
    }

    return next();
  };
}
