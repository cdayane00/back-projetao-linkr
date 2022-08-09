import bcrypt from "bcrypt";
import { ImagesRepository } from "../repositories/imagesRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { sanitizeString } from "../utils/index.js";

export async function createUser(req, res) {
  const { imageUrl, name, email, password } = req.body;

  try {
    const {
      rows: [image],
    } = await ImagesRepository.createImage(imageUrl.trim());

    await UserRepository.createUser(
      sanitizeString(name),
      sanitizeString(email),
      bcrypt.hashSync(password, 10),
      image.id
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
