import { UserRepository } from "../repositories/userRepository.js";

export async function checkIfEmailIsRegistered(req, res, next) {
  const { email } = req.body;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserByEmail(email);

    if (user) {
      return res.sendStatus(409);
    }

    return next();
  } catch (error) {
    return res.sendStatus(500);
  }
}
