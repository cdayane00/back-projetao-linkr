import jwt from "jsonwebtoken";

export async function tokenAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (token === null) {
    return res.status(401).json({ error: "'Null' is not a token." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
    if (err) return res.status(401).json({ error: "Invalid token." });
    res.locals.user = userId;
    next();
  });
}
