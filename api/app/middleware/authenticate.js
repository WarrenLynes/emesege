import jwt from "jsonwebtoken";
import User from "../models/user";

export async function authenticate(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken)
    return res.status(403).send('TOKEN MISSING');

  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(401).send('BAD TOKEN');
  }
}