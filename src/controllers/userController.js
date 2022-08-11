import { UserRepository } from "../repositories/userRepository.js";

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const {
      rows: [user],
    } = await UserRepository.getUserById(id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      photo: user.photo,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
