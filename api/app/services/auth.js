import jwt from "jsonwebtoken";
import User from '../models/user';

export async function authenticate (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    return user;
  } catch (err) {
    throw new Error(err);
  }
}
