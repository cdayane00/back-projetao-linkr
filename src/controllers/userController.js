import { UserRepository } from "../repositories/userRepository.js";

export async function getUserById(req, res) {
  const { id } = req.params;
  console.log(id);

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserById(id);

    const { rows: posts } = await UserRepository.getPostsByUserId(id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    return res.status(200).json({ user, posts });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function getUsersByName(req, res) {
  const { name } = req.query;

  try {
    const { rows: user } = await UserRepository.getUsersByName(name);
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
