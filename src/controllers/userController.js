import { UserRepository } from "../repositories/userRepository.js";

export async function getUserById(req, res) {
  const { id } = req.params;

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
    console.log(posts);

    // if (posts.length === 0) {
    //   console.log("entrou");
    //   return res.status(200).json({ user, posts: [] });
    // }

    return res.status(200).json({ user, posts });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
