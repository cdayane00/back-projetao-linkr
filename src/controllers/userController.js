import { UserRepository } from "../repositories/userRepository.js";

export async function getUserById(req, res) {
  const { userId } = res.locals.user;
  const { id } = req.params;
  const { page, quantity } = req.query;
  let limit;
  if (!quantity) limit = 10;
  if (quantity) limit = quantity;
  const offset = page * 10;
  let follow;
  try {
    const {
      rows: [user],
    } = await UserRepository.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const {
      rows: [interaction],
    } = await UserRepository.thisInteractionExists(userId, id);

    if (!interaction) {
      follow = { interaction: false };
    }
    if (interaction) {
      follow = { interaction: true };
    }
    const { rows: posts } = await UserRepository.getPostsByUserId(
      id,
      limit,
      offset
    );

    return res.status(200).json({ user, posts, follow });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function getUsersByName(req, res) {
  const { userId } = res.locals.user;
  const { name } = req.query;

  try {
    const { rows: user } = await UserRepository.getUsersByName(name, userId);
    console.log(user);
    if (name === "") {
      return res.status(200).json([]);
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function followAnUser(req, res) {
  const { userId } = res.locals.user;
  const { id } = req.params;
  try {
    const {
      rows: [interaction],
    } = await UserRepository.thisInteractionExists(userId, id);

    if (interaction) {
      return res.status(409).json({
        error: "You already follow this user, please reload the page.",
      });
    }
    await UserRepository.followThisUser(userId, id);
    return res.status(201).send("Success");
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function unfollowAnUser(req, res) {
  const { userId } = res.locals.user;
  const { id } = req.params;
  try {
    const {
      rows: [interaction],
    } = await UserRepository.thisInteractionExists(userId, id);
    if (!interaction) {
      return res
        .status(409)
        .json({ error: "You do not follow this user, please reload the page" });
    }
    await UserRepository.unfollowThisUser(userId, id);
    return res.status(204).send("You are no longer following this user");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
