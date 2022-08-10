import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";

export async function createUser(req, res) {
  const { imageUrl, name, email, password } = res.locals.sanitizedData;
  try {
    await UserRepository.createUser(
      name,
      email,
      bcrypt.hashSync(password, 10),
      imageUrl.trim()
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function signIn(req, res) {
  const { email, password } = res.locals.sanitizedData;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Email is incorrect",
      });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        error: "Password is incorrect",
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    return res.status(200).json({ token, photo: user.photo });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
