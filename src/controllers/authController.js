import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserByEmail(email);

    if (!user) {
      res.status(401).alert("Email is incorrect");
    }

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return res.status(401).alert("Password is incorrect");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
