import chalk from "chalk";
import { UserRepository } from "../repositories/userRepository.js";

export async function checkIfEmailIsRegistered(req, res, next) {
  const { email } = res.locals.sanitizedData;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserByEmail(email);

    if (user) {
      console.log(chalk.red.bold("Conflict: user is already registered"));
      return res
        .status(409)
        .json({ error: "This email is already being used" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
