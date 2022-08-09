import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository.js";
import { sanitizeString } from "../utils/index.js";

export async function createUser(req, res) {
  const { imageUrl, name, email, password } = req.body;

  try {
    await UserRepository.createUser(
      sanitizeString(name),
      sanitizeString(email),
      bcrypt.hashSync(password, 10),
      imageUrl.trim()
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
